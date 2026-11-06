import { QuestionItem, GradeLevel, Semester, PaibpElement } from '../types';
import { db } from './firebase';
import { collection, doc, setDoc, getDocs, deleteDoc, writeBatch } from 'firebase/firestore';
import { BankQuestionRecord, COMPREHENSIVE_QUESTION_BANK } from '../data/questionBankData';

const LOCAL_STORAGE_BANK_KEY = 'paibp_custom_question_bank_v1';
const FIRESTORE_BANK_COLLECTION = 'custom_bank_questions';

// Extended type with metadata
export interface SavedBankQuestion extends BankQuestionRecord {
  createdAt?: string;
  userId?: string;
  assessmentTitle?: string;
  isCustomGenerated?: boolean;
}

/**
 * Mendapatkan semua soal custom yang tersimpan di localStorage
 */
export function getLocalSavedQuestions(userId?: string): SavedBankQuestion[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_BANK_KEY);
    if (!raw) return [];
    const list: SavedBankQuestion[] = JSON.parse(raw);
    if (!Array.isArray(list)) return [];
    if (userId) {
      return list.filter(q => !q.userId || q.userId === userId);
    }
    return list;
  } catch (err) {
    console.warn('Gagal membaca custom question bank dari localStorage:', err);
    return [];
  }
}

/**
 * Menyimpan seluruh butir soal hasil generasi asesmen otomatis ke dalam Bank Soal.
 * Data disimpan secara instan ke localStorage (siap mode offline) dan disinkronkan ke Cloud Firestore.
 */
export async function saveGeneratedQuestionsToBank(
  questions: QuestionItem[],
  meta: {
    grade: GradeLevel;
    semester: Semester;
    element: PaibpElement;
    tema?: string;
    assessmentTitle?: string;
    userId?: string;
  }
): Promise<SavedBankQuestion[]> {
  if (!questions || questions.length === 0) return [];

  const existing = getLocalSavedQuestions();
  const existingTexts = new Set(existing.map(q => q.questionText.trim().toLowerCase()));

  const now = new Date();
  const nowIso = now.toISOString();

  const newlySaved: SavedBankQuestion[] = [];

  questions.forEach((q, idx) => {
    // Hindari duplikasi persis teks soal dalam ruang bank yang sama
    const textKey = q.questionText.trim().toLowerCase();
    if (existingTexts.has(textKey)) {
      return;
    }

    const uniqueId = `gen-${Date.now()}-${idx + 1}-${Math.random().toString(36).substring(2, 6)}`;
    const savedRecord: SavedBankQuestion = {
      ...q,
      id: uniqueId,
      grade: meta.grade,
      semester: meta.semester,
      element: meta.element,
      temaId: `tema-gen-${meta.grade.toLowerCase()}-${meta.semester}`,
      tema: meta.tema || (q.tema || `${meta.element} - Kelas ${meta.grade}`),
      source: 'Hasil Generate Guru' as any,
      createdAt: nowIso,
      userId: meta.userId || 'local-user',
      assessmentTitle: meta.assessmentTitle || `Asesmen ${meta.element} Kls ${meta.grade}`,
      isCustomGenerated: true
    };

    existing.unshift(savedRecord);
    newlySaved.push(savedRecord);
    existingTexts.add(textKey);
  });

  // Simpan ke localStorage
  try {
    localStorage.setItem(LOCAL_STORAGE_BANK_KEY, JSON.stringify(existing));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('paibp_bank_updated', { detail: { count: newlySaved.length } }));
    }
  } catch (err) {
    console.warn('Gagal menyimpan bank soal ke localStorage:', err);
  }

  // Sinkronisasi background ke Cloud Firestore jika online dan tersedia
  if (db && typeof navigator !== 'undefined' && navigator.onLine && newlySaved.length > 0) {
    try {
      const batch = writeBatch(db);
      newlySaved.forEach((item) => {
        const docRef = doc(db, FIRESTORE_BANK_COLLECTION, item.id);
        batch.set(docRef, {
          ...item,
          updatedAt: nowIso
        });
      });
      await batch.commit();
      console.log(`[Bank Soal] Berhasil sinkron ${newlySaved.length} soal baru ke Cloud Firestore.`);
    } catch (firestoreErr) {
      console.warn('[Bank Soal] Penyimpanan Firestore dilewati (tetap aman di offline storage):', firestoreErr);
    }
  }

  return newlySaved;
}

/**
 * Mengambil semua bank soal gabungan (Kurikulum Standar + Hasil Generate Guru)
 */
export async function fetchAllBankQuestions(userId?: string): Promise<{
  all: SavedBankQuestion[];
  standardCount: number;
  generatedCount: number;
}> {
  // Ambil dari localStorage terlebih dahulu
  let customQuestions = getLocalSavedQuestions(userId);

  // Jika online, coba perbarui dari Firestore jika belum tersinkron
  if (db && typeof navigator !== 'undefined' && navigator.onLine) {
    try {
      const snap = await getDocs(collection(db, FIRESTORE_BANK_COLLECTION));
      if (!snap.empty) {
        const firestoreMap = new Map<string, SavedBankQuestion>();
        customQuestions.forEach(q => firestoreMap.set(q.id, q));

        snap.forEach(d => {
          const data = d.data() as SavedBankQuestion;
          if (data && data.id && (!userId || !data.userId || data.userId === userId)) {
            firestoreMap.set(data.id, data);
          }
        });

        const merged = Array.from(firestoreMap.values()).sort((a, b) => {
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        });

        customQuestions = merged;
        localStorage.setItem(LOCAL_STORAGE_BANK_KEY, JSON.stringify(merged));
      }
    } catch (err) {
      console.warn('[Bank Soal] Memuat dari cache lokal offline:', err);
    }
  }

  // Standard questions
  const standardQuestions: SavedBankQuestion[] = COMPREHENSIVE_QUESTION_BANK.map(q => ({
    ...q,
    isCustomGenerated: false
  }));

  const combined = [...customQuestions, ...standardQuestions];

  return {
    all: combined,
    standardCount: standardQuestions.length,
    generatedCount: customQuestions.length
  };
}

/**
 * Menghapus 1 butir soal hasil generate dari Bank Soal
 */
export async function deleteCustomBankQuestion(id: string): Promise<boolean> {
  const current = getLocalSavedQuestions();
  const next = current.filter(q => q.id !== id);
  localStorage.setItem(LOCAL_STORAGE_BANK_KEY, JSON.stringify(next));

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('paibp_bank_updated', { detail: { deletedId: id } }));
  }

  if (db && typeof navigator !== 'undefined' && navigator.onLine) {
    try {
      await deleteDoc(doc(db, FIRESTORE_BANK_COLLECTION, id));
    } catch (err) {
      console.warn('Gagal menghapus soal di Firestore:', err);
    }
  }

  return true;
}

/**
 * Menghapus semua hasil generate dari Bank Soal
 */
export async function clearAllGeneratedBankQuestions(userId?: string): Promise<void> {
  if (userId) {
    const current = getLocalSavedQuestions();
    const remaining = current.filter(q => q.userId && q.userId !== userId);
    localStorage.setItem(LOCAL_STORAGE_BANK_KEY, JSON.stringify(remaining));
  } else {
    localStorage.removeItem(LOCAL_STORAGE_BANK_KEY);
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('paibp_bank_updated', { detail: { cleared: true } }));
  }
}
