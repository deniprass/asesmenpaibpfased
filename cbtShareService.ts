import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  increment
} from 'firebase/firestore';
import { db } from './firebase';
import {
  AssessmentPackage,
  CbtExamConfig,
  CbtStudentResult,
  PublishedCbtExam,
  GradeLevel,
  Semester
} from '../types';
import { saveCbtResult, syncCbtScoreToStudentGradebook } from './gradingService';
import { saveCbtResultToDatabase } from './firebaseDatabaseService';

export const PUBLISHED_EXAMS_COLLECTION = 'published_exams';
const LOCAL_STORAGE_KEY = 'paibp_published_cbt_exams_v1';

// Generate short alphanumeric code (e.g. PAI-7K2M)
export function generateShortExamCode(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let random = '';
  for (let i = 0; i < 4; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `PAI-${random}`;
}

/**
 * Simpan dan publikasikan paket soal CBT ke Cloud Firestore dan LocalStorage
 * agar dapat diakses oleh siswa di perangkat manapun melalui link.
 */
export async function publishCbtExam(
  packageData: AssessmentPackage,
  config: CbtExamConfig,
  customCode?: string
): Promise<PublishedCbtExam> {
  const timestamp = Date.now();
  const examId = `cbt-exam-${timestamp}-${Math.random().toString(36).substring(2, 7)}`;
  const code = (customCode || generateShortExamCode()).toUpperCase();

  // Filter or prepare questions according to config
  let questions = [...packageData.questions];
  if (config.questionSelectionMode === 'topic' && config.selectedTopicFilter && config.selectedTopicFilter !== 'all') {
    questions = questions.filter(
      q => q.tema === config.selectedTopicFilter || q.materi === config.selectedTopicFilter
    );
  } else if (config.questionSelectionMode === 'tp' && config.selectedTpFilter && config.selectedTpFilter !== 'all') {
    questions = questions.filter(q => q.tp === config.selectedTpFilter);
  } else if (config.questionSelectionMode === 'custom' && config.selectedQuestionIds && config.selectedQuestionIds.length > 0) {
    questions = questions.filter(q => config.selectedQuestionIds?.includes(q.number));
  }

  if (config.maxQuestionsLimit && config.maxQuestionsLimit > 0 && config.maxQuestionsLimit < questions.length) {
    questions = questions.slice(0, config.maxQuestionsLimit);
  }

  // Renumber questions for student test
  const renumberedQuestions = questions.map((q, idx) => ({
    ...q,
    number: idx + 1
  }));

  const publishedExam: PublishedCbtExam = {
    id: examId,
    code,
    title: packageData.identity.title || 'Ujian CBT PAIBP Fase D',
    grade: packageData.identity.grade as GradeLevel,
    semester: packageData.identity.semester as Semester,
    element: packageData.materiMapping[0]?.element || 'Akidah',
    tema: packageData.tema || packageData.materiMapping[0]?.materi,
    schoolName: packageData.identity.schoolName || 'SMP Negeri 1 Nusantara',
    teacherName: packageData.identity.teacherName || 'Guru Pengampu PAIBP',
    durationMinutes: config.durationMinutes || 45,
    minimumDurationMinutes: config.minimumDurationMinutes ?? 5,
    token: config.token || 'PAI-2026',
    requireToken: Boolean(config.requireToken),
    shuffleQuestions: Boolean(config.shuffleQuestions),
    shuffleOptions: Boolean(config.shuffleOptions),
    showInstantScore: Boolean(config.showInstantScore),
    showReview: Boolean(config.showReview),
    allowPrintCertificate: Boolean(config.allowPrintCertificate),
    kktpTarget: config.kktpTarget || 75,
    instructions: config.examInstructions || '1. Berdoalah sebelum mengerjakan soal.\n2. Kerjakan dengan jujur dan teliti.\n3. Dilarang membuka tab browser lain selama ujian berlangsung.',
    antiCheatWarning: Boolean(config.antiCheatWarning),
    detectTabSwitch: Boolean(config.detectTabSwitch),
    maxTabSwitchAllowed: config.maxTabSwitchAllowed ?? 2,
    tabSwitchAction: config.tabSwitchAction || 'warn',
    questions: renumberedQuestions,
    publishedAt: new Date().toISOString(),
    submissionsCount: 0
  };

  // 1. Simpan di LocalStorage untuk akses instan & offline
  savePublishedExamToLocal(publishedExam);

  // 2. Simpan di Firestore cloud agar bisa diakses oleh siswa di HP/Laptop mereka
  try {
    const docRef = doc(db, PUBLISHED_EXAMS_COLLECTION, examId);
    await setDoc(docRef, publishedExam);
    console.log(`[CbtShareService] Berhasil mempublikasikan ujian CBT ke Cloud Firestore: ${examId} (${code})`);
  } catch (error) {
    console.warn('[CbtShareService] Gagal menyimpan ke Firestore (akan menggunakan local storage):', error);
  }

  return publishedExam;
}

/**
 * Muat data ujian CBT yang telah dipublikasikan berdasarkan ID atau Kode Ujian
 */
export async function getPublishedExam(examIdOrCode: string): Promise<PublishedCbtExam | null> {
  const queryClean = examIdOrCode.trim();
  if (!queryClean) return null;

  // 1. Cek Firestore langsung dengan doc ID
  try {
    const docRef = doc(db, PUBLISHED_EXAMS_COLLECTION, queryClean);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data() as PublishedCbtExam;
      savePublishedExamToLocal(data); // cache locally
      return data;
    }

    // 2. Jika bukan ID dokumen, cari berdasarkan field code
    const q = query(
      collection(db, PUBLISHED_EXAMS_COLLECTION),
      where('code', '==', queryClean.toUpperCase())
    );
    const querySnap = await getDocs(q);
    if (!querySnap.empty) {
      const data = querySnap.docs[0].data() as PublishedCbtExam;
      savePublishedExamToLocal(data);
      return data;
    }
  } catch (err) {
    console.warn('[CbtShareService] Error fetching published exam from Firestore:', err);
  }

  // 3. Fallback: Cari di LocalStorage jika offline atau Firestore gagal
  const localList = loadPublishedExamsFromLocal();
  const localMatch = localList.find(
    e => e.id === queryClean || e.code.toUpperCase() === queryClean.toUpperCase()
  );

  return localMatch || null;
}

/**
 * Catat dan kumpulkan hasil pengerjaan CBT siswa ke dalam sistem
 * (Terekap di Firestore Cloud, LocalStorage, dan Buku Nilai)
 */
export async function recordStudentCbtSubmission(
  examId: string,
  result: CbtStudentResult
): Promise<{ success: boolean; syncedToGradebook: boolean }> {
  try {
    // 1. Simpan ke Firestore cbt_results
    await saveCbtResultToDatabase(result);

    // 2. Simpan ke LocalStorage
    saveCbtResult(result);

    // 3. Rekap & sinkronkan ke buku nilai 3 ranah kelas jika siswa cocok
    let synced = false;
    try {
      synced = syncCbtScoreToStudentGradebook(
        result.studentName,
        result.nis,
        result.score,
        result.grade,
        result.semester,
        'sumatif'
      );
    } catch (e) {
      console.warn('Sync to gradebook notice:', e);
    }

    // 4. Update jumlah peserta yang telah mengumpulkan pada dokumen ujian
    try {
      const examRef = doc(db, PUBLISHED_EXAMS_COLLECTION, examId);
      await updateDoc(examRef, {
        submissionsCount: increment(1)
      });
    } catch {
      // Ignored if update count fails
    }

    return { success: true, syncedToGradebook: synced };
  } catch (error) {
    console.error('[CbtShareService] Error recording CBT submission:', error);
    // Fallback: save locally
    saveCbtResult(result);
    return { success: true, syncedToGradebook: false };
  }
}

/**
 * Dapatkan daftar semua ujian CBT yang pernah dipublikasikan
 */
export async function getAllPublishedExams(): Promise<PublishedCbtExam[]> {
  try {
    const snap = await getDocs(collection(db, PUBLISHED_EXAMS_COLLECTION));
    const list: PublishedCbtExam[] = [];
    snap.forEach(d => list.push(d.data() as PublishedCbtExam));
    if (list.length > 0) {
      // Update local cache
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
      return list.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    }
  } catch (err) {
    console.warn('Failed to load published exams from Firestore:', err);
  }
  return loadPublishedExamsFromLocal();
}

/**
 * Hasilkan URL link yang valid dan siap dibagikan ke siswa
 */
export function generateShareableCbtUrl(examId: string, token?: string): string {
  const origin = window.location.origin;
  const pathname = window.location.pathname;
  let url = `${origin}${pathname}?cbt=${encodeURIComponent(examId)}`;
  if (token) {
    url += `&token=${encodeURIComponent(token)}`;
  }
  return url;
}

/**
 * Buat template pesan WhatsApp siap kirim ke grup kelas / peserta didik
 */
export function generateWhatsAppBroadcast(exam: PublishedCbtExam, shareUrl: string): string {
  const lines = [
    `*ASSALAMU'ALAIKUM WR. WB.* 📖✨`,
    ``,
    `*PEMBERITAHUAN UJIAN CBT ONLINE PAIBP FASE D*`,
    `----------------------------------------`,
    `📌 *Mata Pelajaran:* Pendidikan Agama Islam & Budi Pekerti`,
    `📚 *Kelas / Semester:* Kelas ${exam.grade} - Semester ${exam.semester}`,
    `📝 *Judul Ujian:* ${exam.title}`,
    `⏳ *Durasi:* ${exam.durationMinutes} Menit (${exam.questions.length} Butir Soal)`,
    exam.requireToken ? `🔑 *Token Masuk:* \`${exam.token}\`` : `🔑 *Token:* Tanpa Token`,
    `🏷️ *Kode Ujian:* \`${exam.code}\``,
    ``,
    `📲 *LINK PENGERJAAN UJIAN (Klik untuk mulai):*`,
    `${shareUrl}`,
    ``,
    `⚠️ *Petunjuk Pengerjaan:*`,
    `1. Buka link melalui Google Chrome / browser di HP atau Laptop.`,
    `2. Masukkan Nama Lengkap, NIS, dan Kelas dengan benar.`,
    `3. Kerjakan dengan jujur, mandiri, dan teliti. Dilarang berpindah tab browser.`,
    `4. Nilai dan bukti kelulusan akan langsung terekam otomatis di sistem guru setelah dikumpulkan.`,
    ``,
    `*Selamat mengerjakan, semoga sukses dan barakah!* 🤲`,
    `_Guru Pengampu: ${exam.teacherName}_`
  ];
  return lines.join('\n');
}

// Local cache helpers
function savePublishedExamToLocal(exam: PublishedCbtExam): void {
  try {
    const list = loadPublishedExamsFromLocal();
    const filtered = list.filter(e => e.id !== exam.id);
    filtered.unshift(exam);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered.slice(0, 50)));
  } catch (e) {
    console.warn('LocalStorage published exam cache warning:', e);
  }
}

function loadPublishedExamsFromLocal(): PublishedCbtExam[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
