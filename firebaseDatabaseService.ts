import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  writeBatch,
  query,
  where,
  onSnapshot
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { StudentInfo, StudentTpGradeRecord, CbtStudentResult, GradeLevel, Semester } from '../types';

// Collection references
export const STUDENTS_COLLECTION = 'students';
export const GRADE_RECORDS_COLLECTION = 'grade_records';
export const CBT_RESULTS_COLLECTION = 'cbt_results';

export interface DatabaseSyncStatus {
  isConnected: boolean;
  isSyncing: boolean;
  totalStudentsInDb: number;
  totalGradeRecordsInDb: number;
  totalCbtResultsInDb: number;
  lastSyncedAt: string | null;
  error: string | null;
}

// Global sync state for UI indicators
let currentStatus: DatabaseSyncStatus = {
  isConnected: true,
  isSyncing: false,
  totalStudentsInDb: 0,
  totalGradeRecordsInDb: 0,
  totalCbtResultsInDb: 0,
  lastSyncedAt: null,
  error: null
};

const statusListeners: ((status: DatabaseSyncStatus) => void)[] = [];

export function subscribeToDatabaseStatus(listener: (status: DatabaseSyncStatus) => void) {
  statusListeners.push(listener);
  listener({ ...currentStatus });
  return () => {
    const idx = statusListeners.indexOf(listener);
    if (idx !== -1) statusListeners.splice(idx, 1);
  };
}

function notifyStatusChange() {
  statusListeners.forEach(listener => listener({ ...currentStatus }));
}

// Sanitize string ID for Firestore document path
export function sanitizeDocId(id: string): string {
  return String(id).replace(/[^a-zA-Z0-9_\-\.]/g, '_').substring(0, 120);
}

// ============================================================================
// 1. DATA MASTER SISWA (IMPORT & MANAGEMENT)
// ============================================================================

/**
 * Simpan daftar siswa (hasil import atau manual) ke Cloud Database Firestore.
 * Menggunakan batch write agar proses penyimpanan cepat dan aman.
 */
export async function saveStudentsToDatabase(students: StudentInfo[], grade: GradeLevel): Promise<void> {
  if (!students || students.length === 0) return;

  currentStatus.isSyncing = true;
  notifyStatusChange();

  try {
    const batch = writeBatch(db);
    const nowIso = new Date().toISOString();

    students.forEach((s, idx) => {
      const studentId = sanitizeDocId(s.id || `s-${grade.toLowerCase()}-${s.nis || idx + 1}`);
      const docRef = doc(db, STUDENTS_COLLECTION, studentId);
      
      const payload = {
        id: studentId,
        nis: String(s.nis || `24${(idx + 1).toString().padStart(3, '0')}`).substring(0, 32),
        nisn: String(s.nisn || `00${idx + 10000000}`).substring(0, 32),
        name: String(s.name || 'Siswa').substring(0, 128),
        classGroup: String(s.classGroup || `${grade}-A`).substring(0, 32),
        gender: s.gender === 'P' ? 'P' : 'L',
        grade: String(grade).substring(0, 10),
        createdAt: nowIso,
        updatedAt: nowIso
      };

      batch.set(docRef, payload, { merge: true });
    });

    await batch.commit();

    // Update status
    currentStatus.totalStudentsInDb = Math.max(currentStatus.totalStudentsInDb, students.length);
    currentStatus.lastSyncedAt = new Date().toLocaleTimeString('id-ID');
    currentStatus.isSyncing = false;
    currentStatus.error = null;
    notifyStatusChange();

    console.log(`[Firestore] Berhasil menyimpan ${students.length} data siswa kelas ${grade} ke database cloud.`);
  } catch (error) {
    currentStatus.isSyncing = false;
    currentStatus.error = error instanceof Error ? error.message : String(error);
    notifyStatusChange();
    handleFirestoreError(error, OperationType.WRITE, STUDENTS_COLLECTION);
  }
}

/**
 * Ambil daftar siswa dari Cloud Database Firestore berdasarkan jenjang kelas.
 */
export async function loadStudentsFromDatabase(grade?: GradeLevel): Promise<StudentInfo[]> {
  try {
    let q = collection(db, STUDENTS_COLLECTION);
    const snap = await getDocs(q);

    const students: StudentInfo[] = [];
    snap.forEach(docSnap => {
      const data = docSnap.data();
      if (!grade || data.grade === grade) {
        students.push({
          id: data.id || docSnap.id,
          name: data.name,
          nis: data.nis,
          nisn: data.nisn || '',
          gender: data.gender === 'P' ? 'P' : 'L',
          classGroup: data.classGroup || `${data.grade || 'VII'}-A`
        });
      }
    });

    currentStatus.totalStudentsInDb = snap.size;
    notifyStatusChange();

    return students;
  } catch (error) {
    console.warn('[Firestore] Gagal memuat siswa dari database:', error);
    return [];
  }
}

/**
 * Hapus satu siswa dari database Firestore
 */
export async function deleteStudentFromDatabase(studentId: string): Promise<void> {
  const cleanId = sanitizeDocId(studentId);
  try {
    await deleteDoc(doc(db, STUDENTS_COLLECTION, cleanId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${STUDENTS_COLLECTION}/${cleanId}`);
  }
}

// ============================================================================
// 2. REKAP BUKU NILAI 3 RANAH (KOGNITIF, AFEKTIF, PSIKOMOTORIK)
// ============================================================================

/**
 * Simpan seluruh rekap nilai 3 ranah untuk suatu TP/Elemen ke Cloud Database Firestore.
 */
export async function saveGradeRecordsToDatabase(
  records: StudentTpGradeRecord[],
  storageKey: string
): Promise<void> {
  if (!records || records.length === 0) return;

  currentStatus.isSyncing = true;
  notifyStatusChange();

  try {
    const batch = writeBatch(db);
    const nowIso = new Date().toISOString();

    records.forEach((rec, idx) => {
      const cleanKey = sanitizeDocId(storageKey);
      const recordDocId = sanitizeDocId(`rec_${cleanKey}_${rec.studentId || idx}`);
      const docRef = doc(db, GRADE_RECORDS_COLLECTION, recordDocId);

      const payload = {
        id: recordDocId,
        studentId: sanitizeDocId(rec.studentId || `std_${idx}`),
        studentName: String(rec.studentName || 'Siswa').substring(0, 128),
        nis: String(rec.nis || '').substring(0, 32),
        nisn: String(rec.nisn || '').substring(0, 32),
        classGroup: String(rec.classGroup || '').substring(0, 32),
        gender: rec.gender === 'P' ? 'P' : 'L',
        tpId: String(rec.tpId || '').substring(0, 64),
        tpText: String(rec.tpText || '').substring(0, 500),
        element: String(rec.element || '').substring(0, 64),
        grade: String(rec.grade || '').substring(0, 10),
        semester: String(rec.semester || '1').substring(0, 10),
        kognitif: rec.kognitif || {},
        afektif: rec.afektif || {},
        psikomotorik: rec.psikomotorik || {},
        nilaiAkhir: Number(rec.nilaiAkhir || 0),
        isTuntas: Boolean(rec.isTuntas),
        deskripsiCapaian: String(rec.deskripsiCapaian || '').substring(0, 1000),
        storageKey: cleanKey,
        updatedAt: nowIso
      };

      batch.set(docRef, payload, { merge: true });
    });

    await batch.commit();

    currentStatus.totalGradeRecordsInDb += records.length;
    currentStatus.lastSyncedAt = new Date().toLocaleTimeString('id-ID');
    currentStatus.isSyncing = false;
    currentStatus.error = null;
    notifyStatusChange();

    console.log(`[Firestore] Berhasil menyimpan ${records.length} rekap nilai ke cloud (${storageKey}).`);
  } catch (error) {
    currentStatus.isSyncing = false;
    currentStatus.error = error instanceof Error ? error.message : String(error);
    notifyStatusChange();
    handleFirestoreError(error, OperationType.WRITE, GRADE_RECORDS_COLLECTION);
  }
}

/**
 * Muat rekap nilai dari Cloud Database Firestore berdasarkan storageKey.
 */
export async function loadGradeRecordsFromDatabase(storageKey: string): Promise<StudentTpGradeRecord[] | null> {
  try {
    const cleanKey = sanitizeDocId(storageKey);
    const q = query(
      collection(db, GRADE_RECORDS_COLLECTION),
      where('storageKey', '==', cleanKey)
    );
    const snap = await getDocs(q);

    if (snap.empty) {
      return null;
    }

    const records: StudentTpGradeRecord[] = [];
    snap.forEach(docSnap => {
      const d = docSnap.data();
      records.push({
        studentId: d.studentId,
        studentName: d.studentName,
        nis: d.nis,
        nisn: d.nisn || '',
        classGroup: d.classGroup,
        gender: d.gender,
        tpId: d.tpId,
        tpText: d.tpText,
        element: d.element,
        grade: d.grade,
        semester: d.semester,
        kognitif: d.kognitif || { rataRata: 0 },
        afektif: d.afektif || { rataRata: 0, predikat: 'Baik' },
        psikomotorik: d.psikomotorik || { rataRata: 0, predikat: 'Mahir' },
        nilaiAkhir: d.nilaiAkhir || 0,
        isTuntas: Boolean(d.isTuntas),
        deskripsiCapaian: d.deskripsiCapaian || ''
      });
    });

    return records;
  } catch (error) {
    console.warn(`[Firestore] Gagal memuat rekap nilai untuk ${storageKey}:`, error);
    return null;
  }
}

// ============================================================================
// 3. HASIL UJIAN CBT LANGSUNG
// ============================================================================

/**
 * Simpan hasil ujian CBT siswa ke database Firestore secara permanen.
 */
export async function saveCbtResultToDatabase(result: CbtStudentResult): Promise<void> {
  const resultId = sanitizeDocId(result.id || `cbt_${Date.now()}_${result.nis || 'unknown'}`);
  const docRef = doc(db, CBT_RESULTS_COLLECTION, resultId);

  const payload = {
    id: resultId,
    studentName: String(result.studentName || 'Peserta').substring(0, 128),
    nis: String(result.nis || '').substring(0, 32),
    classGroup: String(result.classGroup || '').substring(0, 32),
    examTitle: String(result.examTitle || 'Ujian CBT').substring(0, 200),
    grade: String(result.grade || 'VIII').substring(0, 10),
    semester: String(result.semester || '1').substring(0, 10),
    element: String(result.element || '').substring(0, 64),
    score: Number(result.score || 0),
    predicate: String(result.score >= 85 ? 'Sangat Baik' : result.score >= 75 ? 'Baik' : 'Perlu Bimbingan').substring(0, 32),
    totalQuestions: Number(result.totalQuestions || 0),
    correctAnswers: Number(result.correctCount || 0),
    wrongAnswers: Number(result.wrongCount || 0),
    unansweredAnswers: Number(result.unansweredCount || 0),
    essayCount: Number(result.essayCount || 0),
    timeSpentSeconds: Number(result.timeSpentSeconds || 0),
    submittedAt: String(result.submittedAt || new Date().toISOString()).substring(0, 64),
    answers: result.answers || {},
    doubtfuls: result.doubtfuls || [],
    bloomAnalysis: result.bloomAnalysis || {},
    elementAnalysis: result.elementAnalysis || {},
    syncedToGradebook: Boolean(result.syncedToGradebook)
  };

  try {
    await setDoc(docRef, payload, { merge: true });
    currentStatus.totalCbtResultsInDb += 1;
    currentStatus.lastSyncedAt = new Date().toLocaleTimeString('id-ID');
    notifyStatusChange();
    console.log(`[Firestore] Berhasil menyimpan hasil CBT siswa ${result.studentName} ke cloud.`);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${CBT_RESULTS_COLLECTION}/${resultId}`);
  }
}

/**
 * Muat seluruh hasil ujian CBT dari Cloud Firestore.
 */
export async function loadCbtResultsFromDatabase(): Promise<CbtStudentResult[]> {
  try {
    const snap = await getDocs(collection(db, CBT_RESULTS_COLLECTION));
    const results: CbtStudentResult[] = [];

    snap.forEach(docSnap => {
      const d = docSnap.data();
      results.push({
        id: d.id || docSnap.id,
        nis: d.nis || '',
        studentName: d.studentName || '',
        classGroup: d.classGroup || '',
        examTitle: d.examTitle || 'Ujian CBT',
        grade: (d.grade as GradeLevel) || 'VIII',
        semester: (d.semester as Semester) || '1',
        element: d.element || '',
        score: Number(d.score || 0),
        totalQuestions: Number(d.totalQuestions || 0),
        correctCount: Number(d.correctAnswers || 0),
        wrongCount: Number(d.wrongAnswers || 0),
        unansweredCount: Number(d.unansweredAnswers ?? Math.max(0, (d.totalQuestions || 0) - (d.correctAnswers || 0) - (d.wrongAnswers || 0))),
        essayCount: Number(d.essayCount || 0),
        answers: d.answers || {},
        doubtfuls: d.doubtfuls || [],
        timeSpentSeconds: Number(d.timeSpentSeconds || 0),
        submittedAt: d.submittedAt || new Date().toISOString(),
        bloomAnalysis: d.bloomAnalysis || {},
        elementAnalysis: d.elementAnalysis || {},
        syncedToGradebook: Boolean(d.syncedToGradebook)
      });
    });

    currentStatus.totalCbtResultsInDb = results.length;
    notifyStatusChange();

    return results;
  } catch (error) {
    console.warn('[Firestore] Gagal memuat hasil CBT:', error);
    return [];
  }
}

/**
 * Hapus hasil ujian CBT dari Cloud Firestore.
 */
export async function deleteCbtResultFromDatabase(resultId: string): Promise<void> {
  const cleanId = sanitizeDocId(resultId);
  try {
    await deleteDoc(doc(db, CBT_RESULTS_COLLECTION, cleanId));
    currentStatus.totalCbtResultsInDb = Math.max(0, currentStatus.totalCbtResultsInDb - 1);
    notifyStatusChange();
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${CBT_RESULTS_COLLECTION}/${cleanId}`);
  }
}

/**
 * Helper sinkronisasi global:
 * Sinkronkan seluruh data di LocalStorage ke Firestore agar aman tidak terhapus.
 */
export async function syncAllLocalStorageToDatabase(): Promise<{
  studentsSynced: number;
  gradesSynced: number;
  cbtSynced: number;
}> {
  let studentsSynced = 0;
  let gradesSynced = 0;
  let cbtSynced = 0;

  try {
    // 1. Scan and sync gradebook keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('paibp_assessment_gradebook_v2_')) {
        const subKey = key.replace('paibp_assessment_gradebook_v2_', '');
        const raw = localStorage.getItem(key);
        if (raw) {
          try {
            const records: StudentTpGradeRecord[] = JSON.parse(raw);
            if (Array.isArray(records) && records.length > 0) {
              await saveGradeRecordsToDatabase(records, subKey);
              gradesSynced += records.length;

              // Also extract student infos to master roster
              const studentInfos: StudentInfo[] = records.map(r => ({
                id: r.studentId,
                name: r.studentName,
                nis: r.nis,
                nisn: r.nisn || '',
                classGroup: r.classGroup || `${r.grade}-A`,
                gender: r.gender
              }));
              await saveStudentsToDatabase(studentInfos, records[0]?.grade || 'VII');
              studentsSynced += studentInfos.length;
            }
          } catch (e) {
            console.warn('Sync parse error for key:', key, e);
          }
        }
      }
    }

    // 2. Sync CBT results from both keys
    const rawCbt = localStorage.getItem('paibp_cbt_student_results_v1') || localStorage.getItem('paibp_cbt_results_list');
    if (rawCbt) {
      try {
        const cbtList: CbtStudentResult[] = JSON.parse(rawCbt);
        if (Array.isArray(cbtList)) {
          for (const item of cbtList) {
            await saveCbtResultToDatabase(item);
            cbtSynced++;
          }
        }
      } catch (e) {
        console.warn('Sync CBT error:', e);
      }
    }

    currentStatus.lastSyncedAt = new Date().toLocaleTimeString('id-ID');
    currentStatus.error = null;
    notifyStatusChange();

    return { studentsSynced, gradesSynced, cbtSynced };
  } catch (error) {
    console.error('Error during global sync:', error);
    throw error;
  }
}
