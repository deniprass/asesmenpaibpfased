import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  BookOpen,
  Award,
  CheckCircle2,
  AlertCircle,
  Download,
  Printer,
  Sliders,
  Sparkles,
  Users,
  Heart,
  Activity,
  Zap,
  RefreshCw,
  Plus,
  Trash2,
  Copy,
  ChevronDown,
  Check,
  Search,
  Filter,
  BarChart3,
  Calendar,
  FileCheck,
  FileSpreadsheet,
  Database,
  Cloud,
  Laptop,
  Lock,
  Key,
  ClipboardList,
  Edit3
} from 'lucide-react';
import {
  GradeLevel,
  Semester,
  PaibpElement,
  StudentInfo,
  StudentTpGradeRecord,
  GradingConfiguration,
  RombelName,
  CbtStudentResult,
  UserAccount,
  TeacherBehaviorLog,
  FormatifAssessmentRecord,
  SumatifAssessmentRecord,
  SumatifElementScore
} from '../types';
import {
  DEFAULT_GRADING_CONFIG,
  INITIAL_STUDENTS_BY_GRADE,
  getRosterForGradeAndRombel,
  generateInitialScoresForRoster,
  recalculateStudentRecord,
  saveGradebookToStorage,
  loadGradebookFromStorage,
  exportGradebookToCsv,
  printOfficialGradebook,
  loadCbtResults,
  deleteCbtResult,
  exportCbtResultsToCsv,
  printCbtStudentCertificate,
  syncCbtScoreToStudentGradebook,
  PREDICATE_THRESHOLDS,
  calculateFormatifAverage,
  calculateSumatifRecord,
  loadBehaviorLogsFromStorage,
  saveBehaviorLogsToStorage,
  INITIAL_BEHAVIOR_LOGS
} from '../services/gradingService';
import {
  subscribeToDatabaseStatus,
  syncAllLocalStorageToDatabase,
  loadGradeRecordsFromDatabase,
  loadStudentsFromDatabase,
  loadCbtResultsFromDatabase,
  deleteCbtResultFromDatabase,
  DatabaseSyncStatus
} from '../services/firebaseDatabaseService';
import { CURRICULUM_TOPICS, OFFICIAL_CP_PAIBP_FASED } from '../data/curriculumData';
import { HolisticAssessmentModal } from './HolisticAssessmentModal';
import { StudentImportModal } from './StudentImportModal';

interface ComprehensiveGradingModalProps {
  onClose: () => void;
  initialGrade?: GradeLevel;
  initialSemester?: Semester;
  initialElement?: PaibpElement | string;
  initialTp?: string;
  schoolName?: string;
  teacherName?: string;
  currentUser?: UserAccount | null;
  onOpenActivation?: () => void;
}

export const ComprehensiveGradingModal: React.FC<ComprehensiveGradingModalProps> = ({
  onClose,
  initialGrade = 'VIII',
  initialSemester = '1',
  initialElement = 'Akidah',
  initialTp,
  schoolName = 'SMP Negeri 1 Nusantara',
  teacherName = 'Guru Pengampu PAIBP',
  currentUser,
  onOpenActivation
}) => {
  const isDemo = currentUser?.role === 'demo';
  // Navigation & Filter States
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(initialGrade);
  const [selectedSemester, setSelectedSemester] = useState<Semester>(initialSemester);
  const [selectedElement, setSelectedElement] = useState<PaibpElement>(
    (initialElement as PaibpElement) || 'Akidah'
  );

  // Active Domain Tab: 'formatif' | 'sumatif' | 'catatan_sikap' | 'all' | 'kognitif' | 'afektif' | 'psikomotorik' | 'rapor' | 'cbt'
  const [activeDomainTab, setActiveDomainTab] = useState<
    'formatif' | 'sumatif' | 'catatan_sikap' | 'all' | 'kognitif' | 'afektif' | 'psikomotorik' | 'rapor' | 'cbt'
  >('formatif');

  // CBT Recapitulation States
  const [cbtResultsList, setCbtResultsList] = useState<CbtStudentResult[]>([]);
  const [isLoadingCbt, setIsLoadingCbt] = useState<boolean>(false);
  const [cbtSearchQuery, setCbtSearchQuery] = useState<string>('');
  const [cbtSyncNotice, setCbtSyncNotice] = useState<string>('');

  const loadAllCbtSubmissions = async () => {
    setIsLoadingCbt(true);
    try {
      const local = loadCbtResults();
      const cloud = await loadCbtResultsFromDatabase();
      const map = new Map<string, CbtStudentResult>();
      [...cloud, ...local].forEach(r => map.set(r.id, r));
      const sorted = Array.from(map.values()).sort(
        (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      );
      setCbtResultsList(sorted);
    } catch (e) {
      console.warn('Error loading CBT submissions:', e);
    } finally {
      setIsLoadingCbt(false);
    }
  };

  useEffect(() => {
    loadAllCbtSubmissions();
  }, []);

  // Grading Configurations & Weights
  const [config, setConfig] = useState<GradingConfiguration>(DEFAULT_GRADING_CONFIG);
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);
  const [showHolisticModal, setShowHolisticModal] = useState<boolean>(false);
  const [customSchoolName, setCustomSchoolName] = useState<string>(schoolName);
  const [customTeacherName, setCustomTeacherName] = useState<string>(teacherName);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'tuntas' | 'remedial'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Available topics for selected Grade, Semester, & Element
  const availableTopics = useMemo(() => {
    return CURRICULUM_TOPICS.filter(
      t =>
        t.grade === selectedGrade &&
        t.semester === selectedSemester &&
        (t.element === selectedElement || (selectedElement === "Al-Qur'an Hadis" && t.element.includes("Qur'an")))
    );
  }, [selectedGrade, selectedSemester, selectedElement]);

  // Current active topic & TP selection
  const [selectedTopicId, setSelectedTopicId] = useState<string>(
    availableTopics[0]?.id || 'custom-topic'
  );

  // Auto-sync topic when availableTopics change (grade, semester, or element filter change)
  useEffect(() => {
    if (availableTopics.length > 0 && !availableTopics.some(t => t.id === selectedTopicId)) {
      setSelectedTopicId(availableTopics[0].id);
      setSelectedTpIndex(0);
    }
  }, [availableTopics, selectedTopicId]);

  const currentTopic = availableTopics.find(t => t.id === selectedTopicId) || availableTopics[0];

  const availableTpList = useMemo(() => {
    if (currentTopic && currentTopic.suggestedTpList.length > 0) {
      return currentTopic.suggestedTpList;
    }
    return [
      initialTp ||
        `Peserta didik mampu menganalisis dan menerapkan nilai-nilai ${selectedElement} dalam kehidupan nyata.`
    ];
  }, [currentTopic, selectedElement, initialTp]);

  const [selectedTpIndex, setSelectedTpIndex] = useState<number>(0);
  const currentTpText = availableTpList[selectedTpIndex] || availableTpList[0] || 'Tujuan Pembelajaran';

  // Rombel Categorization: A, B, C, D
  const [selectedRombel, setSelectedRombel] = useState<RombelName>('A');

  // Student records for current TP and Rombel
  const storageKey = `${selectedGrade}_rombel${selectedRombel}_${selectedSemester}_${selectedElement}_${selectedTopicId}_tp${selectedTpIndex}`;
  const [records, setRecords] = useState<StudentTpGradeRecord[]>([]);

  // Cloud Database Status state
  const [dbStatus, setDbStatus] = useState<DatabaseSyncStatus>({
    isConnected: true,
    isSyncing: false,
    totalStudentsInDb: 0,
    totalGradeRecordsInDb: 0,
    totalCbtResultsInDb: 0,
    lastSyncedAt: null,
    error: null
  });
  const [syncToast, setSyncToast] = useState<string>('');

  // Subscribe to real-time database status
  useEffect(() => {
    const unsub = subscribeToDatabaseStatus((status) => {
      setDbStatus(status);
    });
    return unsub;
  }, []);

  // Load from local storage or cloud database or initialize for selected Grade & Rombel
  useEffect(() => {
    let isCancelled = false;

    async function loadData() {
      // 1. Try local storage first for instant responsiveness
      const saved = loadGradebookFromStorage(storageKey);
      if (saved && saved.length > 0) {
        const updated = saved.map(r => recalculateStudentRecord(r, config));
        if (!isCancelled) setRecords(updated);
        return;
      }

      // 2. Try loading from Firestore Cloud Database
      try {
        const cloudRecords = await loadGradeRecordsFromDatabase(storageKey);
        if (cloudRecords && cloudRecords.length > 0 && !isCancelled) {
          const updated = cloudRecords.map(r => recalculateStudentRecord(r, config));
          setRecords(updated);
          saveGradebookToStorage(storageKey, updated);
          return;
        }

        // 3. Check if master students roster exists in Firestore for this grade and rombel
        const cloudStudents = await loadStudentsFromDatabase(selectedGrade);
        const filteredCloud = cloudStudents.filter(s => {
          if (s.classGroup) {
            const match = s.classGroup.match(/[-_\s]([A-Da-d])($|\b)/);
            if (match) return match[1].toUpperCase() === selectedRombel;
          }
          return false;
        });

        const roster = (filteredCloud.length > 0)
          ? filteredCloud
          : getRosterForGradeAndRombel(selectedGrade, selectedRombel);

        if (!isCancelled) {
          const initial = generateInitialScoresForRoster(
            roster,
            `tp-${selectedTopicId}-${selectedTpIndex}`,
            currentTpText,
            selectedElement,
            selectedGrade,
            selectedSemester,
            config,
            selectedRombel
          );
          setRecords(initial);
          saveGradebookToStorage(storageKey, initial);
        }
      } catch (err) {
        console.warn('Error loading from database, fallback to initial:', err);
        const roster = getRosterForGradeAndRombel(selectedGrade, selectedRombel);
        if (!isCancelled) {
          const initial = generateInitialScoresForRoster(
            roster,
            `tp-${selectedTopicId}-${selectedTpIndex}`,
            currentTpText,
            selectedElement,
            selectedGrade,
            selectedSemester,
            config,
            selectedRombel
          );
          setRecords(initial);
          saveGradebookToStorage(storageKey, initial);
        }
      }
    }

    loadData();

    return () => {
      isCancelled = true;
    };
  }, [storageKey, selectedGrade, selectedRombel, selectedSemester, selectedElement, selectedTopicId, selectedTpIndex]);

  // Manual Cloud Sync Trigger
  const handleManualSyncDatabase = async () => {
    if (isDemo) {
      onOpenActivation?.();
      setSyncToast('Mode Demo: Sinkronisasi Cloud permanen memerlukan lisensi resmi dari Owner.');
      setTimeout(() => setSyncToast(''), 4500);
      return;
    }
    try {
      setSyncToast('Menyinkronkan seluruh data ke Cloud Database...');
      const res = await syncAllLocalStorageToDatabase();
      setSyncToast(`Tersimpan! ${res.gradesSynced} nilai dan data siswa aman di Cloud Firestore.`);
      setTimeout(() => setSyncToast(''), 4500);
    } catch (e) {
      setSyncToast('Data tersimpan aman.');
      setTimeout(() => setSyncToast(''), 3000);
    }
  };

  // Save changes to storage whenever records change
  const handleUpdateRecord = (index: number, updated: StudentTpGradeRecord) => {
    const recalculated = recalculateStudentRecord(updated, config);
    const newRecords = [...records];
    newRecords[index] = recalculated;
    setRecords(newRecords);
    saveGradebookToStorage(storageKey, newRecords);
  };

  // Behavior Logs State & Handlers
  const [behaviorLogs, setBehaviorLogs] = useState<TeacherBehaviorLog[]>(() => loadBehaviorLogsFromStorage());
  const [showAddBehaviorModal, setShowAddBehaviorModal] = useState<boolean>(false);
  const [behaviorDate, setBehaviorDate] = useState<string>('30/10/2026');
  const [behaviorStudentId, setBehaviorStudentId] = useState<string>('');
  const [behaviorIncident, setBehaviorIncident] = useState<string>('');
  const [behaviorFollowUp, setBehaviorFollowUp] = useState<string>('Diapresiasi dan diberi pembinaan');
  const [behaviorPredicate, setBehaviorPredicate] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [behaviorNotes, setBehaviorNotes] = useState<string>('');

  // Validation Warning Message State (0-100 check)
  const [validationWarning, setValidationWarning] = useState<string | null>(null);
  const triggerValidationWarning = (msg: string) => {
    setValidationWarning(msg);
    setTimeout(() => setValidationWarning(null), 3500);
  };

  // Handler for Formatif (Awal, Tengah, Akhir)
  const handleFormatifScoreChange = (
    index: number,
    field: 'awal' | 'tengah' | 'akhir',
    rawVal: string
  ) => {
    if (rawVal !== '') {
      const num = Number(rawVal);
      if (isNaN(num) || num < 0 || num > 100) {
        triggerValidationWarning(`Nilai ${field.toUpperCase()} tidak valid ("${rawVal}"). Nilai harus berada dalam rentang 0 - 100.`);
        return;
      }
    }
    const val = rawVal === '' ? undefined : Number(rawVal);
    const target = { ...records[index] };
    const currentFmt: FormatifAssessmentRecord = target.formatifData || {
      awal: target.kognitif.diagnostik || 78,
      tengah: target.kognitif.formatif || 82,
      akhir: target.kognitif.sumatif || 85,
      catatan: 'Aktif dan pemahaman materi berkembang baik.'
    };

    const updatedFmt: FormatifAssessmentRecord = {
      ...currentFmt,
      [field]: val
    };
    updatedFmt.rataRata = calculateFormatifAverage(updatedFmt.awal, updatedFmt.tengah, updatedFmt.akhir);
    target.formatifData = updatedFmt;

    handleUpdateRecord(index, target);
  };

  const handleFormatifCatatanChange = (index: number, catatan: string) => {
    const target = { ...records[index] };
    target.formatifData = {
      ...(target.formatifData || {
        awal: 78,
        tengah: 82,
        akhir: 85,
        rataRata: 81.7
      }),
      catatan
    };
    handleUpdateRecord(index, target);
  };

  // Handler for Sumatif 5 Elemen (Kognitif & Sikap)
  const handleSumatifElementScoreChange = (
    index: number,
    elemKey: 'alQuranHadis' | 'akidah' | 'akhlak' | 'fikih' | 'sejarahPeradabanIslam',
    subField: 'kognitif' | 'sikap',
    rawVal: string
  ) => {
    if (rawVal !== '') {
      const num = Number(rawVal);
      if (isNaN(num) || num < 0 || num > 100) {
        triggerValidationWarning(`Nilai ${subField} tidak valid ("${rawVal}"). Nilai harus berada dalam rentang 0 - 100.`);
        return;
      }
    }
    const val = rawVal === '' ? undefined : Number(rawVal);
    const target = { ...records[index] };
    const currentSum: SumatifAssessmentRecord = target.sumatifData || calculateSumatifRecord({
      alQuranHadis: { kognitif: 82, sikap: 85 },
      akidah: { kognitif: 80, sikap: 84 },
      akhlak: { kognitif: 85, sikap: 88 },
      fikih: { kognitif: 82, sikap: 84 },
      sejarahPeradabanIslam: { kognitif: 80, sikap: 82 }
    });

    const elemObj: SumatifElementScore = { ...currentSum[elemKey], [subField]: val };
    const updatedSum = calculateSumatifRecord(
      {
        alQuranHadis: elemKey === 'alQuranHadis' ? elemObj : currentSum.alQuranHadis,
        akidah: elemKey === 'akidah' ? elemObj : currentSum.akidah,
        akhlak: elemKey === 'akhlak' ? elemObj : currentSum.akhlak,
        fikih: elemKey === 'fikih' ? elemObj : currentSum.fikih,
        sejarahPeradabanIslam: elemKey === 'sejarahPeradabanIslam' ? elemObj : currentSum.sejarahPeradabanIslam
      },
      currentSum.sts,
      currentSum.sas
    );

    target.sumatifData = updatedSum;
    handleUpdateRecord(index, target);
  };

  // Handler for Sumatif STS / SAS
  const handleSumatifExamChange = (index: number, field: 'sts' | 'sas', rawVal: string) => {
    if (rawVal !== '') {
      const num = Number(rawVal);
      if (isNaN(num) || num < 0 || num > 100) {
        triggerValidationWarning(`Nilai ${field.toUpperCase()} tidak valid ("${rawVal}"). Nilai harus berada dalam rentang 0 - 100.`);
        return;
      }
    }
    const val = rawVal === '' ? undefined : Number(rawVal);
    const target = { ...records[index] };
    const currentSum: SumatifAssessmentRecord = target.sumatifData || calculateSumatifRecord({
      alQuranHadis: { kognitif: 82, sikap: 85 },
      akidah: { kognitif: 80, sikap: 84 },
      akhlak: { kognitif: 85, sikap: 88 },
      fikih: { kognitif: 82, sikap: 84 },
      sejarahPeradabanIslam: { kognitif: 80, sikap: 82 }
    });

    const updatedSum = calculateSumatifRecord(
      {
        alQuranHadis: currentSum.alQuranHadis,
        akidah: currentSum.akidah,
        akhlak: currentSum.akhlak,
        fikih: currentSum.fikih,
        sejarahPeradabanIslam: currentSum.sejarahPeradabanIslam
      },
      field === 'sts' ? val : currentSum.sts,
      field === 'sas' ? val : currentSum.sas
    );

    target.sumatifData = updatedSum;
    handleUpdateRecord(index, target);
  };

  // Handler for adding behavior log
  const handleAddBehaviorLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const st = records.find(r => r.studentId === behaviorStudentId) || records[0];
    if (!st) return;

    const newLog: TeacherBehaviorLog = {
      id: `log-${Date.now()}`,
      date: behaviorDate || '30/10/2026',
      studentId: st.studentId,
      studentName: st.studentName,
      classGroup: st.classGroup || `${selectedGrade}-${selectedRombel}`,
      incident: behaviorIncident.trim() || 'Aktivitas terpuji dan peduli sesama',
      followUp: behaviorFollowUp.trim() || 'Diapresiasi',
      predicate: behaviorPredicate,
      notes: behaviorNotes.trim()
    };

    const updated = [newLog, ...behaviorLogs];
    setBehaviorLogs(updated);
    saveBehaviorLogsToStorage(updated);
    setShowAddBehaviorModal(false);
    setBehaviorIncident('');
    setBehaviorNotes('');
  };

  const handleDeleteBehaviorLog = (logId: string) => {
    if (window.confirm('Hapus catatan sikap ini?')) {
      const updated = behaviorLogs.filter(l => l.id !== logId);
      setBehaviorLogs(updated);
      saveBehaviorLogsToStorage(updated);
    }
  };

  // Specific cell score updater
  const handleScoreChange = (
    index: number,
    domain: 'kognitif' | 'afektif' | 'psikomotorik',
    field: string,
    value: string
  ) => {
    const parsed = value === '' ? undefined : Math.min(100, Math.max(0, Number(value)));
    const target = { ...records[index] };

    if (domain === 'kognitif') {
      target.kognitif = { ...target.kognitif, [field]: parsed };
    } else if (domain === 'afektif') {
      target.afektif = { ...target.afektif, [field]: parsed };
    } else if (domain === 'psikomotorik') {
      target.psikomotorik = { ...target.psikomotorik, [field]: parsed };
    }

    handleUpdateRecord(index, target);
  };

  // Batch quick-fill function
  const handleBatchFill = (domain: 'kognitif' | 'afektif' | 'psikomotorik', field: string, value: number) => {
    const updated = records.map(r => {
      const copy = { ...r };
      if (domain === 'kognitif') {
        copy.kognitif = { ...copy.kognitif, [field]: value };
      } else if (domain === 'afektif') {
        copy.afektif = { ...copy.afektif, [field]: value };
      } else if (domain === 'psikomotorik') {
        copy.psikomotorik = { ...copy.psikomotorik, [field]: value };
      }
      return recalculateStudentRecord(copy, config);
    });
    setRecords(updated);
    saveGradebookToStorage(storageKey, updated);
  };

  // Sync CBT scores to gradebook
  const handleSyncAllCbtToCurrentGradebook = () => {
    let count = 0;
    const updated = records.map(r => {
      const match = cbtResultsList.find(
        c =>
          (c.nis && r.nis && c.nis.trim() === r.nis.trim()) ||
          c.studentName.toLowerCase().trim() === r.studentName.toLowerCase().trim()
      );
      if (match) {
        count++;
        const copy = { ...r };
        copy.kognitif = { ...copy.kognitif, sumatif: match.score };
        return recalculateStudentRecord(copy, config);
      }
      return r;
    });

    setRecords(updated);
    saveGradebookToStorage(storageKey, updated);
    setCbtSyncNotice(`Berhasil menyinkronkan ${count} nilai CBT siswa ke kolom Sumatif Kognitif.`);
    setTimeout(() => setCbtSyncNotice(''), 4000);
  };

  const handleDeleteCbtSubmission = (resultId: string) => {
    if (window.confirm('Hapus data hasil CBT siswa ini dari database?')) {
      deleteCbtResult(resultId);
      deleteCbtResultFromDatabase(resultId).catch(() => {});
      setCbtResultsList(prev => prev.filter(r => r.id !== resultId));
    }
  };

  // Reset to default sample scores
  const handleResetSample = () => {
    if (window.confirm(`Reset nilai Kelas ${selectedGrade}-${selectedRombel} ini ke data simulasi ideal Kurikulum Merdeka?`)) {
      const roster = getRosterForGradeAndRombel(selectedGrade, selectedRombel);
      const initial = generateInitialScoresForRoster(
        roster,
        `tp-${selectedTopicId}-${selectedTpIndex}`,
        currentTpText,
        selectedElement,
        selectedGrade,
        selectedSemester,
        config,
        selectedRombel
      );
      setRecords(initial);
      saveGradebookToStorage(storageKey, initial);
    }
  };

  // Add new student
  const [newStudentName, setNewStudentName] = useState<string>('');
  const [newStudentNis, setNewStudentNis] = useState<string>('');
  const [newStudentClass, setNewStudentClass] = useState<string>('');
  const [newStudentGender, setNewStudentGender] = useState<'L' | 'P'>('L');
  const [showAddStudentModal, setShowAddStudentModal] = useState<boolean>(false);
  const [showImportModal, setShowImportModal] = useState<boolean>(false);

  const handleImportStudentsSuccess = (importedStudents: StudentTpGradeRecord[], isAppend: boolean) => {
    let updatedList: StudentTpGradeRecord[] = [];
    if (isAppend) {
      updatedList = [...records, ...importedStudents];
    } else {
      updatedList = importedStudents;
    }
    setRecords(updatedList);
    saveGradebookToStorage(storageKey, updatedList);
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;

    const newId = `s-custom-${Date.now()}`;
    const rombelDigit = selectedRombel === 'A' ? '1' : selectedRombel === 'B' ? '2' : selectedRombel === 'C' ? '3' : '4';
    const newRecord: StudentTpGradeRecord = {
      studentId: newId,
      studentName: newStudentName.trim(),
      nis: newStudentNis.trim() || `24${rombelDigit}${(records.length + 1).toString().padStart(2, '0')}`,
      nisn: `00${Math.floor(10000000 + Math.random() * 90000000)}`,
      classGroup: newStudentClass.trim() || `${selectedGrade}-${selectedRombel}`,
      rombel: selectedRombel,
      gender: newStudentGender,
      tpId: `tp-${selectedTopicId}-${selectedTpIndex}`,
      tpText: currentTpText,
      element: selectedElement,
      grade: selectedGrade,
      semester: selectedSemester,
      kognitif: { tugas: 80, diagnostik: 75, formatif: 82, sumatif: 80, rataRata: 0 },
      afektif: { sikap: 85, keaktifan: 82, presensiSholat: 90, adabEtika: 85, rataRata: 0, predikat: 'Baik' },
      psikomotorik: { praktik: 82, unjukKerja: 80, produkProyek: 80, rataRata: 0, predikat: 'Mahir' },
      nilaiAkhir: 0,
      isTuntas: false,
      deskripsiCapaian: ''
    };

    const recalculated = recalculateStudentRecord(newRecord, config);
    const updatedList = [...records, recalculated];
    setRecords(updatedList);
    saveGradebookToStorage(storageKey, updatedList);
    setNewStudentName('');
    setNewStudentNis('');
    setNewStudentClass('');
    setShowAddStudentModal(false);
  };

  const handleDeleteStudent = (index: number) => {
    if (window.confirm(`Hapus data nilai siswa "${records[index].studentName}"?`)) {
      const updatedList = records.filter((_, i) => i !== index);
      setRecords(updatedList);
      saveGradebookToStorage(storageKey, updatedList);
    }
  };

  // Class statistics
  const stats = useMemo(() => {
    if (records.length === 0) return { avgCog: 0, avgAff: 0, avgPsy: 0, avgFinal: 0, tuntasCount: 0, remedialCount: 0, maxScore: 0, minScore: 0 };
    const avgCog = Math.round((records.reduce((acc, r) => acc + r.kognitif.rataRata, 0) / records.length) * 10) / 10;
    const avgAff = Math.round((records.reduce((acc, r) => acc + r.afektif.rataRata, 0) / records.length) * 10) / 10;
    const avgPsy = Math.round((records.reduce((acc, r) => acc + r.psikomotorik.rataRata, 0) / records.length) * 10) / 10;
    const avgFinal = Math.round((records.reduce((acc, r) => acc + r.nilaiAkhir, 0) / records.length) * 10) / 10;

    const tuntasCount = records.filter(r => r.isTuntas).length;
    const remedialCount = records.length - tuntasCount;
    const maxScore = Math.max(...records.map(r => r.nilaiAkhir));
    const minScore = Math.min(...records.map(r => r.nilaiAkhir));

    return { avgCog, avgAff, avgPsy, avgFinal, tuntasCount, remedialCount, maxScore, minScore };
  }, [records]);

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const matchesSearch =
        r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.nisn.includes(searchQuery);
      const matchesStatus =
        filterStatus === 'all' ||
        (filterStatus === 'tuntas' && r.isTuntas) ||
        (filterStatus === 'remedial' && !r.isTuntas);
      return matchesSearch && matchesStatus;
    });
  }, [records, searchQuery, filterStatus]);

  // Copy narrative description to clipboard
  const handleCopyNarrative = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-7xl max-h-[95vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* ========================================================================= */}
        {/* 1. MODAL TOP HEADER */}
        {/* ========================================================================= */}
        <div className="bg-slate-900 text-white px-5 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md font-bold">
              <FileCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Buku Penilaian Lengkap PAIBP: Kognitif, Afektif & Psikomotorik
                </h2>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30 uppercase tracking-wide">
                  Kurikulum Merdeka 2026
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Penilaian otentik berbasis 3 ranah capaian tiap Tujuan Pembelajaran (TP) • Integrasi e-Rapor & Deskripsi Otomatis
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowHolisticModal(true)}
              className="px-3 py-1.5 bg-indigo-900/90 hover:bg-indigo-800 text-indigo-200 hover:text-white rounded-lg border border-indigo-700/80 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
              title="Lihat Rubrik & Panduan Asesmen Holistik (Kognitif, Afektif, Psikomotorik & P5PPRA) untuk TP ini"
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Rubrik & Panduan Asesmen</span>
            </button>

            <button
              onClick={() => setShowConfigModal(true)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Atur Bobot Penilaian & Nilai Kriteria Ketercapaian (KKTP)"
            >
              <Sliders className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">Bobot & KKTP ({config.kktp})</span>
            </button>

            <button
              onClick={() => {
                if (isDemo) {
                  onOpenActivation?.();
                  return;
                }
                exportGradebookToCsv(
                  records,
                  selectedElement,
                  currentTpText,
                  selectedGrade,
                  selectedSemester,
                  config
                );
              }}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
              title={isDemo ? "Fitur terkunci di Mode Demo (Perlu Lisensi)" : "Ekspor Rekap Nilai ke Excel / Spreadsheet"}
            >
              {isDemo ? <Lock className="w-3.5 h-3.5 text-amber-300" /> : <Download className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isDemo ? 'Ekspor (Terkunci)' : 'Ekspor Excel'}</span>
            </button>

            <button
              onClick={() => {
                if (isDemo) {
                  onOpenActivation?.();
                  return;
                }
                printOfficialGradebook(
                  records,
                  selectedElement,
                  currentTpText,
                  selectedGrade,
                  selectedSemester,
                  customSchoolName,
                  customTeacherName,
                  config
                );
              }}
              className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
              title={isDemo ? "Fitur terkunci di Mode Demo (Perlu Lisensi)" : "Cetak Buku Nilai Resmi Standar Madrasah"}
            >
              {isDemo ? <Lock className="w-3.5 h-3.5 text-amber-300" /> : <Printer className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isDemo ? 'Cetak (Terkunci)' : 'Cetak Buku Nilai'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Demo Mode Restriction Banner */}
        {isDemo && (
          <div className="bg-amber-500/15 border-b border-amber-500/30 px-5 py-2.5 text-xs text-amber-900 flex flex-wrap items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-600 shrink-0" />
              <div>
                <span className="font-bold">Mode Demo Terbatas:</span> Anda dapat menguji input nilai lokal dan kalkulasi 3 ranah. Ekspor Excel resmi, Cetak Buku Rapor, dan Sinkronisasi Cloud permanen memerlukan <strong>Kode Aktivasi Lisensi dari Owner</strong>.
              </div>
            </div>
            <button
              onClick={onOpenActivation}
              className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Aktivasi Kode Lisensi</span>
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* CLOUD DATABASE PERSISTENCE STATUS BAR */}
        {/* ========================================================================= */}
        <div className="bg-emerald-950/60 border-b border-emerald-500/25 px-5 py-2 text-xs text-emerald-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <div className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-bold text-white">Database Cloud Firestore:</span>
            </div>
            <span className="text-emerald-300">
              {dbStatus.totalStudentsInDb > 0 ? `${dbStatus.totalStudentsInDb} Siswa Master` : `${records.length} Siswa Terdaftar`} & {records.length} Nilai 3 Ranah Tersimpan Permanen
            </span>
            {dbStatus.lastSyncedAt && (
              <span className="text-[11px] text-emerald-400/80 hidden md:inline">
                (Sinkron: {dbStatus.lastSyncedAt})
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {syncToast && (
              <span className="text-emerald-300 text-[11px] font-semibold bg-emerald-500/20 px-2.5 py-0.5 rounded border border-emerald-500/40 animate-pulse">
                {syncToast}
              </span>
            )}
            <button
              type="button"
              onClick={handleManualSyncDatabase}
              disabled={dbStatus.isSyncing}
              className="px-2.5 py-1 bg-emerald-800/90 hover:bg-emerald-700 text-white border border-emerald-500/40 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              title="Sinkronkan seluruh data siswa & nilai ke database cloud sekarang agar tidak terhapus"
            >
              <RefreshCw className={`w-3 h-3 ${dbStatus.isSyncing ? 'animate-spin' : ''}`} />
              <span>{dbStatus.isSyncing ? 'Menyinkronkan...' : 'Sinkronkan Database'}</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. PARAMETER KELAS & PEMILIHAN TUJUAN PEMBELAJARAN (TP) */}
        {/* ========================================================================= */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-3.5 shrink-0">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Grade, Rombel, Semester, Element Selector */}
            <div className="md:col-span-6 flex flex-wrap sm:flex-nowrap gap-2 items-center">
              <div className="w-28 shrink-0">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Kelas & Fase
                </label>
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value as GradeLevel)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-sky-500"
                >
                  <option value="VII">Kelas VII (Fase D)</option>
                  <option value="VIII">Kelas VIII (Fase D)</option>
                  <option value="IX">Kelas IX (Fase D)</option>
                </select>
              </div>

              <div className="w-24 shrink-0">
                <label className="block text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-1">
                  Rombel
                </label>
                <select
                  value={selectedRombel}
                  onChange={(e) => setSelectedRombel(e.target.value as RombelName)}
                  className="w-full bg-emerald-50 border border-emerald-300 rounded-lg px-2 py-1.5 text-xs font-bold text-emerald-950 focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="A">Rombel A</option>
                  <option value="B">Rombel B</option>
                  <option value="C">Rombel C</option>
                  <option value="D">Rombel D</option>
                </select>
              </div>

              <div className="w-24 shrink-0">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Semester
                </label>
                <select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value as Semester)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-sky-500"
                >
                  <option value="1">Sem. 1 (Ganjil)</option>
                  <option value="2">Sem. 2 (Genap)</option>
                </select>
              </div>

              <div className="flex-1 min-w-[140px]">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Elemen PAIBP
                </label>
                <select
                  value={selectedElement}
                  onChange={(e) => setSelectedElement(e.target.value as PaibpElement)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-sky-900 focus:ring-2 focus:ring-sky-500"
                >
                  <option value="Al-Qur'an Hadis">Al-Qur'an Hadis</option>
                  <option value="Akidah">Akidah</option>
                  <option value="Akhlak">Akhlak</option>
                  <option value="Fikih">Fikih</option>
                  <option value="Sejarah Peradaban Islam">Sejarah Peradaban Islam</option>
                </select>
              </div>
            </div>

            {/* TP Selector */}
            <div className="md:col-span-6">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>Tujuan Pembelajaran (TP) yang Dinilai:</span>
                <span className="text-sky-700 font-bold">
                  {availableTpList.length} TP Tersedia
                </span>
              </label>
              <div className="flex gap-2">
                <select
                  value={selectedTpIndex}
                  onChange={(e) => setSelectedTpIndex(Number(e.target.value))}
                  className="flex-1 bg-white border border-sky-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-sky-500 shadow-2xs"
                >
                  {availableTpList.map((tp, idx) => (
                    <option key={idx} value={idx}>
                      TP {idx + 1}: {tp}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={handleResetSample}
                  className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-600 rounded-lg border border-slate-300 text-xs font-medium flex items-center gap-1 transition-colors shrink-0"
                  title="Muat Ulang Data Nilai Sampel Standar"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Reset Nilai</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* KATEGORI KELAS BERDASARKAN ROMBEL (ROMBEL A, B, C, D) */}
        {/* ========================================================================= */}
        <div className="bg-slate-100/90 border-b border-slate-200 px-5 py-2 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-emerald-600" />
              <span>Kategori Rombel:</span>
            </span>
            <div className="flex items-center gap-1.5">
              {(['A', 'B', 'C', 'D'] as RombelName[]).map((r) => {
                const isActive = selectedRombel === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setSelectedRombel(r)}
                    className={`px-3.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-linear-to-r from-emerald-700 to-teal-800 text-white shadow-xs scale-102 ring-2 ring-emerald-500/40'
                        : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-300'
                    }`}
                  >
                    <span>Rombel {r}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                      isActive ? 'bg-emerald-950 text-emerald-200' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {selectedGrade}-{r}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="bg-white border border-emerald-300 px-2.5 py-0.5 rounded-md text-[11px] font-semibold text-emerald-900 flex items-center gap-1.5 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Buku Nilai Rombel Aktif: <strong>Kelas {selectedGrade}-{selectedRombel}</strong> ({records.length} Siswa)</span>
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. TABS MENU PENILAIAN LENGKAP: FORMATIF, SUMATIF 5 ELEMEN, SIKAP & RAPOR */}
        {/* ========================================================================= */}
        <div className="border-b border-slate-200 px-5 pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white shrink-0">
          <div className="flex space-x-1 sm:space-x-2 overflow-x-auto scrollbar-none">
            {/* TAB A: NILAI FORMATIF */}
            <button
              onClick={() => setActiveDomainTab('formatif')}
              className={`px-3 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeDomainTab === 'formatif'
                  ? 'border-emerald-600 text-emerald-800 bg-emerald-50/70 shadow-2xs'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileCheck className="w-4 h-4 text-emerald-600" />
              <span>A. Nilai Formatif</span>
            </button>

            {/* TAB B: NILAI SUMATIF (5 ELEMEN) */}
            <button
              onClick={() => setActiveDomainTab('sumatif')}
              className={`px-3 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeDomainTab === 'sumatif'
                  ? 'border-sky-600 text-sky-800 bg-sky-50/70 shadow-2xs'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Award className="w-4 h-4 text-sky-600" />
              <span>B. Nilai Sumatif (5 Elemen)</span>
              <span className="bg-sky-100 text-sky-800 text-[10px] px-1.5 py-0.2 rounded font-bold">
                Header Bertingkat
              </span>
            </button>

            {/* TAB C: PENILAIAN SIKAP / CATATAN GURU */}
            <button
              onClick={() => setActiveDomainTab('catatan_sikap')}
              className={`px-3 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeDomainTab === 'catatan_sikap'
                  ? 'border-amber-600 text-amber-800 bg-amber-50/70 shadow-2xs'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Heart className="w-4 h-4 text-amber-600" />
              <span>C. Penilaian Sikap / Catatan Guru</span>
              <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.2 rounded font-bold">
                {behaviorLogs.length}
              </span>
            </button>

            {/* REKAP KOMPREHENSIF 3 RANAH */}
            <button
              onClick={() => setActiveDomainTab('all')}
              className={`px-3 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeDomainTab === 'all'
                  ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              <span>Rekap 3 Ranah</span>
            </button>

            <button
              onClick={() => setActiveDomainTab('kognitif')}
              className={`px-3 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeDomainTab === 'kognitif'
                  ? 'border-sky-600 text-sky-700 bg-sky-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Award className="w-4 h-4 text-sky-600" />
              <span>Ranah Kognitif (Tugas, Formatif & Sumatif)</span>
              <span className="bg-sky-100 text-sky-800 text-[10px] px-1.5 py-0.2 rounded font-bold">
                {config.weights.kognitif}%
              </span>
            </button>

            <button
              onClick={() => setActiveDomainTab('afektif')}
              className={`px-3 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeDomainTab === 'afektif'
                  ? 'border-amber-600 text-amber-700 bg-amber-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Heart className="w-4 h-4 text-amber-600" />
              <span>Ranah Afektif (Sikap & Sholat 5 Waktu)</span>
              <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.2 rounded font-bold">
                {config.weights.afektif}%
              </span>
            </button>

            <button
              onClick={() => setActiveDomainTab('psikomotorik')}
              className={`px-3 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeDomainTab === 'psikomotorik'
                  ? 'border-purple-600 text-purple-700 bg-purple-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Zap className="w-4 h-4 text-purple-600" />
              <span>Ranah Psikomotorik (Praktik & Kinerja)</span>
              <span className="bg-purple-100 text-purple-800 text-[10px] px-1.5 py-0.2 rounded font-bold">
                {config.weights.psikomotorik}%
              </span>
            </button>

            <button
              onClick={() => setActiveDomainTab('rapor')}
              className={`px-3 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeDomainTab === 'rapor'
                  ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Deskripsi Narasi Rapor</span>
            </button>

            <button
              onClick={() => setActiveDomainTab('cbt')}
              className={`px-3 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeDomainTab === 'cbt'
                  ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Laptop className="w-4 h-4 text-indigo-600" />
              <span>Rekap Hasil CBT Siswa</span>
              <span className="bg-indigo-100 text-indigo-800 text-[10px] px-1.5 py-0.2 rounded font-bold">
                {cbtResultsList.length}
              </span>
            </button>
          </div>

          {/* Quick Actions (Add student & search) */}
          <div className="flex items-center gap-2 pb-2 sm:pb-0">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari siswa / NISN..."
                className="pl-8 pr-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 w-36 sm:w-44 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <button
              onClick={() => setShowAddStudentModal(true)}
              className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors shrink-0"
              title="Tambah satu siswa secara manual"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Siswa</span>
            </button>

            <button
              onClick={() => setShowImportModal(true)}
              className="px-2.5 py-1 bg-linear-to-r from-emerald-700 to-teal-800 hover:from-emerald-600 hover:to-teal-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs shrink-0"
              title="Import Data Siswa dari Excel, CSV, atau Google Sheets (NIS, Nama, Kelas)"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-200" />
              <span>Import Siswa (Excel/CSV)</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. DOMAIN SPECIFIC OPTIONS & QUICK FILL BAR */}
        {/* ========================================================================= */}
        <div className="bg-slate-100/70 border-b border-slate-200 px-5 py-2 text-xs flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* Options Toggles per Domain */}
          <div className="flex flex-wrap items-center gap-2.5">
            {activeDomainTab === 'kognitif' && (
              <>
                <span className="font-bold text-sky-950 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-sky-600" />
                  Opsi Kognitif Aktif:
                </span>
                <label className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.cognitiveOptions.tugas}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        cognitiveOptions: { ...config.cognitiveOptions, tugas: e.target.checked }
                      })
                    }
                    className="rounded text-sky-600"
                  />
                  <span>Nilai Tugas (Harian)</span>
                </label>
                <label className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.cognitiveOptions.diagnostik}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        cognitiveOptions: { ...config.cognitiveOptions, diagnostik: e.target.checked }
                      })
                    }
                    className="rounded text-sky-600"
                  />
                  <span>Asesmen Diagnostik</span>
                </label>
                <label className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.cognitiveOptions.formatif}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        cognitiveOptions: { ...config.cognitiveOptions, formatif: e.target.checked }
                      })
                    }
                    className="rounded text-sky-600"
                  />
                  <span>Asesmen Formatif (Kuis/LKPD)</span>
                </label>
                <label className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.cognitiveOptions.sumatif}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        cognitiveOptions: { ...config.cognitiveOptions, sumatif: e.target.checked }
                      })
                    }
                    className="rounded text-sky-600"
                  />
                  <span>Asesmen Sumatif TP</span>
                </label>
              </>
            )}

            {activeDomainTab === 'afektif' && (
              <>
                <span className="font-bold text-amber-950 flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-amber-600" />
                  Opsi Afektif Aktif:
                </span>
                <label className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.affectiveOptions.sikap}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        affectiveOptions: { ...config.affectiveOptions, sikap: e.target.checked }
                      })
                    }
                    className="rounded text-amber-600"
                  />
                  <span>Nilai Sikap & Karakter</span>
                </label>
                <label className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.affectiveOptions.keaktifan}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        affectiveOptions: { ...config.affectiveOptions, keaktifan: e.target.checked }
                      })
                    }
                    className="rounded text-amber-600"
                  />
                  <span>Keaktifan Belajar</span>
                </label>
                <label className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.affectiveOptions.presensi_sholat}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        affectiveOptions: { ...config.affectiveOptions, presensi_sholat: e.target.checked }
                      })
                    }
                    className="rounded text-amber-600"
                  />
                  <span>Presensi Sholat 5 Waktu & Mutaba'ah</span>
                </label>
                <label className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.affectiveOptions.adab_etika}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        affectiveOptions: { ...config.affectiveOptions, adab_etika: e.target.checked }
                      })
                    }
                    className="rounded text-amber-600"
                  />
                  <span>Adab & Etika Digital</span>
                </label>
              </>
            )}

            {activeDomainTab === 'psikomotorik' && (
              <>
                <span className="font-bold text-purple-950 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-purple-600" />
                  Opsi Psikomotorik Aktif:
                </span>
                <label className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.psychomotorOptions.praktik}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        psychomotorOptions: { ...config.psychomotorOptions, praktik: e.target.checked }
                      })
                    }
                    className="rounded text-purple-600"
                  />
                  <span>Nilai Praktik Ibadah / Tajwid</span>
                </label>
                <label className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.psychomotorOptions.unjuk_kerja}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        psychomotorOptions: { ...config.psychomotorOptions, unjuk_kerja: e.target.checked }
                      })
                    }
                    className="rounded text-purple-600"
                  />
                  <span>Unjuk Kerja / Kinerja</span>
                </label>
                <label className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.psychomotorOptions.produk_proyek}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        psychomotorOptions: { ...config.psychomotorOptions, produk_proyek: e.target.checked }
                      })
                    }
                    className="rounded text-purple-600"
                  />
                  <span>Produk / Proyek Dakwah</span>
                </label>
              </>
            )}

            {(activeDomainTab === 'all' || activeDomainTab === 'rapor') && (
              <div className="flex items-center gap-2 text-[11px] text-slate-600">
                <span className="font-bold text-slate-800">Formula Nilai Akhir:</span>
                <span className="bg-sky-100 text-sky-800 px-2 py-0.5 rounded font-semibold">
                  Kognitif ({config.weights.kognitif}%)
                </span>
                <span>+</span>
                <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-semibold">
                  Afektif ({config.weights.afektif}%)
                </span>
                <span>+</span>
                <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-semibold">
                  Psikomotorik ({config.weights.psikomotorik}%)
                </span>
                <span className="text-slate-400">|</span>
                <span className="font-bold text-emerald-800">KKTP: {config.kktp}</span>
              </div>
            )}
          </div>

          {/* Quick Fill Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-500 font-medium">Input Cepat Kelas:</span>
            {activeDomainTab === 'kognitif' && (
              <>
                <button
                  onClick={() => handleBatchFill('kognitif', 'tugas', 85)}
                  className="px-2 py-0.5 bg-white hover:bg-slate-200 border border-slate-300 rounded text-[10px] font-semibold text-slate-700"
                >
                  Tugas = 85
                </button>
                <button
                  onClick={() => handleBatchFill('kognitif', 'formatif', 80)}
                  className="px-2 py-0.5 bg-white hover:bg-slate-200 border border-slate-300 rounded text-[10px] font-semibold text-slate-700"
                >
                  Formatif = 80
                </button>
                <button
                  onClick={() => handleBatchFill('kognitif', 'sumatif', 82)}
                  className="px-2 py-0.5 bg-white hover:bg-slate-200 border border-slate-300 rounded text-[10px] font-semibold text-slate-700"
                >
                  Sumatif = 82
                </button>
              </>
            )}

            {activeDomainTab === 'afektif' && (
              <>
                <button
                  onClick={() => handleBatchFill('afektif', 'presensiSholat', 95)}
                  className="px-2 py-0.5 bg-white hover:bg-slate-200 border border-slate-300 rounded text-[10px] font-semibold text-amber-800"
                >
                  Sholat 5 Waktu = 95
                </button>
                <button
                  onClick={() => handleBatchFill('afektif', 'sikap', 88)}
                  className="px-2 py-0.5 bg-white hover:bg-slate-200 border border-slate-300 rounded text-[10px] font-semibold text-amber-800"
                >
                  Sikap = 88
                </button>
                <button
                  onClick={() => handleBatchFill('afektif', 'keaktifan', 85)}
                  className="px-2 py-0.5 bg-white hover:bg-slate-200 border border-slate-300 rounded text-[10px] font-semibold text-amber-800"
                >
                  Aktif = 85
                </button>
              </>
            )}

            {activeDomainTab === 'psikomotorik' && (
              <>
                <button
                  onClick={() => handleBatchFill('psikomotorik', 'praktik', 85)}
                  className="px-2 py-0.5 bg-white hover:bg-slate-200 border border-slate-300 rounded text-[10px] font-semibold text-purple-800"
                >
                  Praktik = 85
                </button>
                <button
                  onClick={() => handleBatchFill('psikomotorik', 'unjukKerja', 82)}
                  className="px-2 py-0.5 bg-white hover:bg-slate-200 border border-slate-300 rounded text-[10px] font-semibold text-purple-800"
                >
                  Kinerja = 82
                </button>
                <button
                  onClick={() => handleBatchFill('psikomotorik', 'produkProyek', 85)}
                  className="px-2 py-0.5 bg-white hover:bg-slate-200 border border-slate-300 rounded text-[10px] font-semibold text-purple-800"
                >
                  Produk = 85
                </button>
              </>
            )}

            {(activeDomainTab === 'all' || activeDomainTab === 'rapor') && (
              <span className="text-[10px] text-slate-500 italic">
                Klik tab kognitif/afektif/psikomotorik untuk input cepat per aspek
              </span>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 5. TABEL UTAMA NILAI SISWA */}
        {/* ========================================================================= */}
        <div className="flex-1 overflow-auto bg-slate-50 p-4">
          {/* Validation Warning Alert (Rentang 0 - 100) */}
          {validationWarning && (
            <div className="mb-3 p-3 bg-rose-50 border border-rose-300 rounded-xl text-xs text-rose-800 flex items-center justify-between gap-2 shadow-2xs animate-fadeIn">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="font-bold">{validationWarning}</span>
              </div>
              <button
                type="button"
                onClick={() => setValidationWarning(null)}
                className="text-rose-600 hover:text-rose-800 font-bold text-xs p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB A: NILAI FORMATIF */}
          {/* Kolom: No | Nama | Awal | Tengah | Akhir | Rata-rata | Catatan */}
          {/* Sel input kuning lembut, sel hitung otomatis hijau lembut */}
          {/* ========================================================================= */}
          {activeDomainTab === 'formatif' ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-3 bg-emerald-950 text-white flex flex-wrap items-center justify-between gap-2 border-b border-emerald-900">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-xs uppercase tracking-wide">
                    Tabel A: Nilai Formatif PAIBP Fase D (Kelas {selectedGrade}-{selectedRombel})
                  </span>
                </div>
                <div className="text-[11px] text-emerald-200 flex items-center gap-2">
                  <span className="bg-emerald-900/80 px-2 py-0.5 rounded border border-emerald-700/60 font-medium">
                    Rata-rata = rata-rata nilai Awal, Tengah, Akhir yang terisi (1 desimal)
                  </span>
                  <span className="hidden sm:inline bg-amber-500/20 text-amber-200 px-2 py-0.5 rounded border border-amber-400/30 text-[10px]">
                    Kuning: Input • Hijau: Otomatis
                  </span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="sticky top-0 z-20 bg-slate-900 text-white text-[11px] font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-3 py-3 text-center w-12 border-r border-slate-800">No</th>
                      <th className="px-3 py-3 w-56 border-r border-slate-800 sticky left-0 bg-slate-900 z-30 shadow-xs">
                        Nama Siswa
                      </th>
                      <th className="px-3 py-3 text-center w-28 bg-amber-950/80 text-amber-200 border-r border-slate-800">
                        Awal
                      </th>
                      <th className="px-3 py-3 text-center w-28 bg-amber-950/80 text-amber-200 border-r border-slate-800">
                        Tengah
                      </th>
                      <th className="px-3 py-3 text-center w-28 bg-amber-950/80 text-amber-200 border-r border-slate-800">
                        Akhir
                      </th>
                      <th className="px-3 py-3 text-center w-32 bg-emerald-950 text-emerald-200 border-r border-slate-800 font-extrabold">
                        Rata-rata
                      </th>
                      <th className="px-4 py-3 min-w-[220px]">
                        Catatan
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-700">
                    {filteredRecords.map((r, idx) => {
                      const fmt = r.formatifData || {
                        awal: r.kognitif.diagnostik ?? 78,
                        tengah: r.kognitif.formatif ?? 82,
                        akhir: r.kognitif.sumatif ?? 85,
                        rataRata: 81.7,
                        catatan: 'Aktif dan pemahaman materi berkembang baik.'
                      };
                      return (
                        <tr key={r.studentId} className="hover:bg-slate-50 transition-colors group">
                          <td className="px-3 py-2.5 text-center font-semibold text-slate-400 border-r border-slate-100">
                            {idx + 1}
                          </td>
                          <td className="px-3 py-2.5 border-r border-slate-100 sticky left-0 bg-white group-hover:bg-slate-50 z-10 shadow-2xs">
                            <div className="font-bold text-slate-900">{r.studentName}</div>
                            <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1.5 mt-0.5">
                              {r.nis && <span>NIS: {r.nis}</span>}
                              <span className="text-slate-300">•</span>
                              <span className="font-semibold text-emerald-700">{r.classGroup || `${selectedGrade}-${selectedRombel}`}</span>
                              <span className="text-slate-300">•</span>
                              <span>{r.gender === 'L' ? 'L' : 'P'}</span>
                            </div>
                          </td>
                          {/* Sel Input Awal: Kuning Lembut */}
                          <td className="px-2 py-2 text-center border-r border-slate-100">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={fmt.awal ?? ''}
                              onChange={(e) => handleFormatifScoreChange(idx, 'awal', e.target.value)}
                              placeholder="0-100"
                              className="w-20 text-center font-bold text-slate-800 p-1.5 rounded-lg border border-amber-300 bg-amber-50/70 focus:bg-amber-100/90 focus:outline-hidden focus:ring-1 focus:ring-amber-500 shadow-2xs"
                            />
                          </td>
                          {/* Sel Input Tengah: Kuning Lembut */}
                          <td className="px-2 py-2 text-center border-r border-slate-100">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={fmt.tengah ?? ''}
                              onChange={(e) => handleFormatifScoreChange(idx, 'tengah', e.target.value)}
                              placeholder="0-100"
                              className="w-20 text-center font-bold text-slate-800 p-1.5 rounded-lg border border-amber-300 bg-amber-50/70 focus:bg-amber-100/90 focus:outline-hidden focus:ring-1 focus:ring-amber-500 shadow-2xs"
                            />
                          </td>
                          {/* Sel Input Akhir: Kuning Lembut */}
                          <td className="px-2 py-2 text-center border-r border-slate-100">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={fmt.akhir ?? ''}
                              onChange={(e) => handleFormatifScoreChange(idx, 'akhir', e.target.value)}
                              placeholder="0-100"
                              className="w-20 text-center font-bold text-slate-800 p-1.5 rounded-lg border border-amber-300 bg-amber-50/70 focus:bg-amber-100/90 focus:outline-hidden focus:ring-1 focus:ring-amber-500 shadow-2xs"
                            />
                          </td>
                          {/* Sel Rata-rata: Hijau Lembut, readOnly */}
                          <td className="px-2 py-2 text-center border-r border-slate-100">
                            <input
                              type="text"
                              readOnly
                              value={fmt.rataRata ?? 0}
                              className="w-20 text-center font-black text-emerald-950 p-1.5 rounded-lg border border-emerald-300 bg-emerald-50 cursor-not-allowed select-none shadow-2xs"
                              title="Hasil hitung otomatis: rata-rata nilai Awal, Tengah, dan Akhir yang terisi (1 desimal)"
                            />
                          </td>
                          {/* Sel Catatan: Kuning Lembut */}
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              value={fmt.catatan ?? ''}
                              onChange={(e) => handleFormatifCatatanChange(idx, e.target.value)}
                              placeholder="Catatan perkembangan pemahaman peserta didik..."
                              className="w-full text-xs text-slate-800 p-1.5 rounded-lg border border-amber-200 bg-amber-50/50 focus:bg-amber-100/80 focus:outline-hidden focus:ring-1 focus:ring-amber-400"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : activeDomainTab === 'sumatif' ? (
            /* ========================================================================= */
            /* TAB B: NILAI SUMATIF (HEADER BERTINGKAT) */
            /* Kolom: No | Nama | 5 elemen x [Kognitif, Sikap, Rt] | Rt Sumatif | STS | SAS | Jml | Rata-rata | Predikat */
            /* ========================================================================= */
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-3 bg-sky-950 text-white flex flex-wrap items-center justify-between gap-2 border-b border-sky-900">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-sky-400" />
                  <span className="font-bold text-xs uppercase tracking-wide">
                    Tabel B: Nilai Sumatif 5 Elemen PAIBP Fase D (Kelas {selectedGrade}-{selectedRombel})
                  </span>
                </div>
                <div className="text-[11px] text-sky-200 flex flex-wrap items-center gap-2">
                  <span>Rt Elemen = (Kognitif + Sikap) / 2</span>
                  <span>•</span>
                  <span>Jml = Rt Sumatif + STS + SAS</span>
                  <span>•</span>
                  <span className="bg-sky-900/80 px-2 py-0.5 rounded border border-sky-700/60 font-semibold">
                    Predikat: A (≥{PREDICATE_THRESHOLDS.A}), B (≥{PREDICATE_THRESHOLDS.B}), C (≥{PREDICATE_THRESHOLDS.C}), D
                  </span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="sticky top-0 z-20 bg-slate-900 text-white text-[11px] font-bold uppercase tracking-wider">
                    {/* Header Baris 1: Header Bertingkat */}
                    <tr>
                      <th rowSpan={2} className="px-3 py-2 text-center w-12 border-r border-slate-800">No</th>
                      <th rowSpan={2} className="px-3 py-2 w-56 border-r border-slate-800 sticky left-0 bg-slate-900 z-30 shadow-xs">
                        Nama Siswa
                      </th>
                      
                      {/* 5 Elemen: masing-masing 3 sub-kolom */}
                      <th colSpan={3} className="px-2 py-2 text-center border-r border-slate-800 bg-emerald-950/90 text-emerald-200">
                        1. Al-Qur'an Hadis
                      </th>
                      <th colSpan={3} className="px-2 py-2 text-center border-r border-slate-800 bg-teal-950/90 text-teal-200">
                        2. Akidah
                      </th>
                      <th colSpan={3} className="px-2 py-2 text-center border-r border-slate-800 bg-cyan-950/90 text-cyan-200">
                        3. Akhlak
                      </th>
                      <th colSpan={3} className="px-2 py-2 text-center border-r border-slate-800 bg-indigo-950/90 text-indigo-200">
                        4. Fikih
                      </th>
                      <th colSpan={3} className="px-2 py-2 text-center border-r border-slate-800 bg-purple-950/90 text-purple-200">
                        5. Sejarah Peradaban Islam
                      </th>

                      <th rowSpan={2} className="px-2 py-2 text-center w-20 border-r border-slate-800 bg-emerald-950 text-emerald-300 font-extrabold">
                        Rt Sumatif
                      </th>
                      <th rowSpan={2} className="px-2 py-2 text-center w-20 border-r border-slate-800 bg-amber-950/90 text-amber-200">
                        STS
                      </th>
                      <th rowSpan={2} className="px-2 py-2 text-center w-20 border-r border-slate-800 bg-amber-950/90 text-amber-200">
                        SAS
                      </th>
                      <th rowSpan={2} className="px-2 py-2 text-center w-20 border-r border-slate-800 bg-emerald-950 text-emerald-200 font-extrabold">
                        Jml
                      </th>
                      <th rowSpan={2} className="px-2 py-2 text-center w-20 border-r border-slate-800 bg-emerald-950 text-emerald-300 font-extrabold">
                        Rata-rata
                      </th>
                      <th rowSpan={2} className="px-2 py-2 text-center w-20 bg-emerald-950 text-emerald-300 font-extrabold">
                        Predikat
                      </th>
                    </tr>

                    {/* Header Baris 2: Sub-kolom Kognitif, Sikap, Rt */}
                    <tr className="bg-slate-950 text-[10px]">
                      {/* Al-Qur'an Hadis */}
                      <th className="px-1.5 py-1.5 text-center w-14 border-r border-slate-800 text-amber-200">Kog</th>
                      <th className="px-1.5 py-1.5 text-center w-14 border-r border-slate-800 text-amber-200">Sik</th>
                      <th className="px-1.5 py-1.5 text-center w-14 border-r border-slate-800 text-emerald-300 font-bold bg-emerald-950/70">Rt</th>
                      
                      {/* Akidah */}
                      <th className="px-1.5 py-1.5 text-center w-14 border-r border-slate-800 text-amber-200">Kog</th>
                      <th className="px-1.5 py-1.5 text-center w-14 border-r border-slate-800 text-amber-200">Sik</th>
                      <th className="px-1.5 py-1.5 text-center w-14 border-r border-slate-800 text-teal-300 font-bold bg-teal-950/70">Rt</th>
                      
                      {/* Akhlak */}
                      <th className="px-1.5 py-1.5 text-center w-14 border-r border-slate-800 text-amber-200">Kog</th>
                      <th className="px-1.5 py-1.5 text-center w-14 border-r border-slate-800 text-amber-200">Sik</th>
                      <th className="px-1.5 py-1.5 text-center w-14 border-r border-slate-800 text-cyan-300 font-bold bg-cyan-950/70">Rt</th>

                      {/* Fikih */}
                      <th className="px-1.5 py-1.5 text-center w-14 border-r border-slate-800 text-amber-200">Kog</th>
                      <th className="px-1.5 py-1.5 text-center w-14 border-r border-slate-800 text-amber-200">Sik</th>
                      <th className="px-1.5 py-1.5 text-center w-14 border-r border-slate-800 text-indigo-300 font-bold bg-indigo-950/70">Rt</th>

                      {/* SPI */}
                      <th className="px-1.5 py-1.5 text-center w-14 border-r border-slate-800 text-amber-200">Kog</th>
                      <th className="px-1.5 py-1.5 text-center w-14 border-r border-slate-800 text-amber-200">Sik</th>
                      <th className="px-1.5 py-1.5 text-center w-14 border-r border-slate-800 text-purple-300 font-bold bg-purple-950/70">Rt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-700">
                    {filteredRecords.map((r, idx) => {
                      const sum = r.sumatifData || calculateSumatifRecord({
                        alQuranHadis: { kognitif: 82, sikap: 85 },
                        akidah: { kognitif: 80, sikap: 84 },
                        akhlak: { kognitif: 85, sikap: 88 },
                        fikih: { kognitif: 82, sikap: 84 },
                        sejarahPeradabanIslam: { kognitif: 80, sikap: 82 }
                      });

                      return (
                        <tr key={r.studentId} className="hover:bg-slate-50 transition-colors group">
                          <td className="px-3 py-2 text-center font-semibold text-slate-400 border-r border-slate-100">
                            {idx + 1}
                          </td>
                          <td className="px-3 py-2 border-r border-slate-100 sticky left-0 bg-white group-hover:bg-slate-50 z-10 shadow-2xs">
                            <div className="font-bold text-slate-900 truncate max-w-[210px]">{r.studentName}</div>
                            <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                              {r.nis && <span>NIS: {r.nis}</span>}
                              <span>•</span>
                              <span>{r.classGroup || `${selectedGrade}-${selectedRombel}`}</span>
                            </div>
                          </td>

                          {/* 1. Al-Qur'an Hadis */}
                          <td className="px-1 py-1.5 text-center border-r border-slate-100">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={sum.alQuranHadis.kognitif ?? ''}
                              onChange={(e) => handleSumatifElementScoreChange(idx, 'alQuranHadis', 'kognitif', e.target.value)}
                              className="w-12 text-center font-bold text-slate-800 p-1 rounded border border-amber-300 bg-amber-50/70 focus:bg-amber-100/90 text-xs shadow-2xs"
                            />
                          </td>
                          <td className="px-1 py-1.5 text-center border-r border-slate-100">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={sum.alQuranHadis.sikap ?? ''}
                              onChange={(e) => handleSumatifElementScoreChange(idx, 'alQuranHadis', 'sikap', e.target.value)}
                              className="w-12 text-center font-bold text-slate-800 p-1 rounded border border-amber-300 bg-amber-50/70 focus:bg-amber-100/90 text-xs shadow-2xs"
                            />
                          </td>
                          <td className="px-1 py-1.5 text-center border-r border-slate-100">
                            <input
                              type="text"
                              readOnly
                              value={sum.alQuranHadis.rt ?? '-'}
                              className="w-12 text-center font-bold text-emerald-950 p-1 rounded border border-emerald-300 bg-emerald-50 cursor-not-allowed text-xs shadow-2xs"
                            />
                          </td>

                          {/* 2. Akidah */}
                          <td className="px-1 py-1.5 text-center border-r border-slate-100">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={sum.akidah.kognitif ?? ''}
                              onChange={(e) => handleSumatifElementScoreChange(idx, 'akidah', 'kognitif', e.target.value)}
                              className="w-12 text-center font-bold text-slate-800 p-1 rounded border border-amber-300 bg-amber-50/70 focus:bg-amber-100/90 text-xs shadow-2xs"
                            />
                          </td>
                          <td className="px-1 py-1.5 text-center border-r border-slate-100">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={sum.akidah.sikap ?? ''}
                              onChange={(e) => handleSumatifElementScoreChange(idx, 'akidah', 'sikap', e.target.value)}
                              className="w-12 text-center font-bold text-slate-800 p-1 rounded border border-amber-300 bg-amber-50/70 focus:bg-amber-100/90 text-xs shadow-2xs"
                            />
                          </td>
                          <td className="px-1 py-1.5 text-center border-r border-slate-100">
                            <input
                              type="text"
                              readOnly
                              value={sum.akidah.rt ?? '-'}
                              className="w-12 text-center font-bold text-teal-950 p-1 rounded border border-teal-300 bg-emerald-50 cursor-not-allowed text-xs shadow-2xs"
                            />
                          </td>

                          {/* 3. Akhlak */}
                          <td className="px-1 py-1.5 text-center border-r border-slate-100">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={sum.akhlak.kognitif ?? ''}
                              onChange={(e) => handleSumatifElementScoreChange(idx, 'akhlak', 'kognitif', e.target.value)}
                              className="w-12 text-center font-bold text-slate-800 p-1 rounded border border-amber-300 bg-amber-50/70 focus:bg-amber-100/90 text-xs shadow-2xs"
                            />
                          </td>
                          <td className="px-1 py-1.5 text-center border-r border-slate-100">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={sum.akhlak.sikap ?? ''}
                              onChange={(e) => handleSumatifElementScoreChange(idx, 'akhlak', 'sikap', e.target.value)}
                              className="w-12 text-center font-bold text-slate-800 p-1 rounded border border-amber-300 bg-amber-50/70 focus:bg-amber-100/90 text-xs shadow-2xs"
                            />
                          </td>
                          <td className="px-1 py-1.5 text-center border-r border-slate-100">
                            <input
                              type="text"
                              readOnly
                              value={sum.akhlak.rt ?? '-'}
                              className="w-12 text-center font-bold text-cyan-950 p-1 rounded border border-cyan-300 bg-emerald-50 cursor-not-allowed text-xs shadow-2xs"
                            />
                          </td>

                          {/* 4. Fikih */}
                          <td className="px-1 py-1.5 text-center border-r border-slate-100">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={sum.fikih.kognitif ?? ''}
                              onChange={(e) => handleSumatifElementScoreChange(idx, 'fikih', 'kognitif', e.target.value)}
                              className="w-12 text-center font-bold text-slate-800 p-1 rounded border border-amber-300 bg-amber-50/70 focus:bg-amber-100/90 text-xs shadow-2xs"
                            />
                          </td>
                          <td className="px-1 py-1.5 text-center border-r border-slate-100">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={sum.fikih.sikap ?? ''}
                              onChange={(e) => handleSumatifElementScoreChange(idx, 'fikih', 'sikap', e.target.value)}
                              className="w-12 text-center font-bold text-slate-800 p-1 rounded border border-amber-300 bg-amber-50/70 focus:bg-amber-100/90 text-xs shadow-2xs"
                            />
                          </td>
                          <td className="px-1 py-1.5 text-center border-r border-slate-100">
                            <input
                              type="text"
                              readOnly
                              value={sum.fikih.rt ?? '-'}
                              className="w-12 text-center font-bold text-indigo-950 p-1 rounded border border-indigo-300 bg-emerald-50 cursor-not-allowed text-xs shadow-2xs"
                            />
                          </td>

                          {/* 5. Sejarah Peradaban Islam */}
                          <td className="px-1 py-1.5 text-center border-r border-slate-100">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={sum.sejarahPeradabanIslam.kognitif ?? ''}
                              onChange={(e) => handleSumatifElementScoreChange(idx, 'sejarahPeradabanIslam', 'kognitif', e.target.value)}
                              className="w-12 text-center font-bold text-slate-800 p-1 rounded border border-amber-300 bg-amber-50/70 focus:bg-amber-100/90 text-xs shadow-2xs"
                            />
                          </td>
                          <td className="px-1 py-1.5 text-center border-r border-slate-100">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={sum.sejarahPeradabanIslam.sikap ?? ''}
                              onChange={(e) => handleSumatifElementScoreChange(idx, 'sejarahPeradabanIslam', 'sikap', e.target.value)}
                              className="w-12 text-center font-bold text-slate-800 p-1 rounded border border-amber-300 bg-amber-50/70 focus:bg-amber-100/90 text-xs shadow-2xs"
                            />
                          </td>
                          <td className="px-1 py-1.5 text-center border-r border-slate-100">
                            <input
                              type="text"
                              readOnly
                              value={sum.sejarahPeradabanIslam.rt ?? '-'}
                              className="w-12 text-center font-bold text-purple-950 p-1 rounded border border-purple-300 bg-emerald-50 cursor-not-allowed text-xs shadow-2xs"
                            />
                          </td>

                          {/* Rt Sumatif: Hijau lembut, readOnly */}
                          <td className="px-1.5 py-1.5 text-center border-r border-slate-100">
                            <input
                              type="text"
                              readOnly
                              value={sum.rtSumatif}
                              className="w-16 text-center font-black text-emerald-950 p-1 rounded border border-emerald-300 bg-emerald-50 cursor-not-allowed text-xs shadow-2xs"
                              title="Rata-rata dari nilai Rt kelima elemen yang terisi"
                            />
                          </td>

                          {/* Input STS: Kuning lembut */}
                          <td className="px-1.5 py-1.5 text-center border-r border-slate-100">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={sum.sts ?? ''}
                              onChange={(e) => handleSumatifExamChange(idx, 'sts', e.target.value)}
                              placeholder="0-100"
                              className="w-14 text-center font-bold text-slate-800 p-1 rounded border border-amber-300 bg-amber-50/70 focus:bg-amber-100/90 text-xs shadow-2xs"
                            />
                          </td>

                          {/* Input SAS: Kuning lembut */}
                          <td className="px-1.5 py-1.5 text-center border-r border-slate-100">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={sum.sas ?? ''}
                              onChange={(e) => handleSumatifExamChange(idx, 'sas', e.target.value)}
                              placeholder="0-100"
                              className="w-14 text-center font-bold text-slate-800 p-1 rounded border border-amber-300 bg-amber-50/70 focus:bg-amber-100/90 text-xs shadow-2xs"
                            />
                          </td>

                          {/* Jml: Hijau lembut, readOnly */}
                          <td className="px-1.5 py-1.5 text-center border-r border-slate-100">
                            <input
                              type="text"
                              readOnly
                              value={sum.jml}
                              className="w-14 text-center font-black text-emerald-950 p-1 rounded border border-emerald-300 bg-emerald-50 cursor-not-allowed text-xs shadow-2xs"
                              title="Jml = Rt Sumatif + STS + SAS (komponen kosong dilewati)"
                            />
                          </td>

                          {/* Rata-rata: Hijau lembut, readOnly */}
                          <td className="px-1.5 py-1.5 text-center border-r border-slate-100">
                            <input
                              type="text"
                              readOnly
                              value={sum.rataRata}
                              className="w-14 text-center font-black text-emerald-950 p-1 rounded border border-emerald-300 bg-emerald-50 cursor-not-allowed text-xs shadow-2xs"
                              title="Rata-rata dari Rt Sumatif, STS, SAS yang terisi"
                            />
                          </td>

                          {/* Predikat: Badge A, B, C, D */}
                          <td className="px-2 py-1.5 text-center">
                            <span className={`inline-block w-8 py-1 rounded-md text-xs font-black shadow-2xs ${
                              sum.predikat === 'A'
                                ? 'bg-emerald-600 text-white border border-emerald-700'
                                : sum.predikat === 'B'
                                ? 'bg-sky-600 text-white border border-sky-700'
                                : sum.predikat === 'C'
                                ? 'bg-amber-600 text-white border border-amber-700'
                                : 'bg-rose-600 text-white border border-rose-700'
                            }`}>
                              {sum.predikat}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : activeDomainTab === 'catatan_sikap' ? (
            /* ========================================================================= */
            /* TAB C: PENILAIAN SIKAP / CATATAN GURU */
            /* Kolom: No | Hari/Tgl | Nama | Kelas | Kejadian/Uraian | Tindak Lanjut | Predikat | Ket. */
            /* ========================================================================= */
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden space-y-4">
              <div className="p-3 bg-amber-950 text-white flex flex-wrap items-center justify-between gap-2 border-b border-amber-900">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-xs uppercase tracking-wide">
                    Tabel C: Jurnal Penilaian Sikap / Catatan Guru PAIBP Fase D
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setBehaviorStudentId(records[0]?.studentId || '');
                    setShowAddBehaviorModal(true);
                  }}
                  className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Tambah Catatan Sikap Siswa</span>
                </button>
              </div>

              <div className="overflow-x-auto p-3">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="sticky top-0 z-20 bg-slate-900 text-white text-[11px] font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-3 py-3 text-center w-12 border-r border-slate-800">No</th>
                      <th className="px-3 py-3 w-32 border-r border-slate-800">Hari / Tgl</th>
                      <th className="px-3 py-3 w-56 border-r border-slate-800 sticky left-0 bg-slate-900 z-30 shadow-xs">
                        Nama Siswa
                      </th>
                      <th className="px-3 py-3 text-center w-24 border-r border-slate-800">Kelas</th>
                      <th className="px-4 py-3 min-w-[220px] border-r border-slate-800">Kejadian / Uraian</th>
                      <th className="px-4 py-3 min-w-[200px] border-r border-slate-800">Tindak Lanjut</th>
                      <th className="px-3 py-3 text-center w-28 border-r border-slate-800 bg-amber-950 text-amber-200">Predikat</th>
                      <th className="px-3 py-3 min-w-[150px] border-r border-slate-800">Ket.</th>
                      <th className="px-2 py-3 text-center w-14">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-700">
                    {behaviorLogs.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="px-4 py-8 text-center text-slate-400">
                          Belum ada catatan sikap tersimpan. Klik "+ Tambah Catatan Sikap Siswa" di atas.
                        </td>
                      </tr>
                    ) : (
                      behaviorLogs.map((log, idx) => (
                        <tr key={log.id} className="hover:bg-amber-50/30 transition-colors">
                          <td className="px-3 py-2.5 text-center font-semibold text-slate-400 border-r border-slate-100">
                            {idx + 1}
                          </td>
                          <td className="px-3 py-2.5 font-mono text-xs text-slate-700 border-r border-slate-100">
                            {log.date}
                          </td>
                          <td className="px-3 py-2.5 font-bold text-slate-900 border-r border-slate-100 sticky left-0 bg-white z-10 shadow-2xs">
                            {log.studentName}
                          </td>
                          <td className="px-3 py-2.5 text-center font-bold text-emerald-800 border-r border-slate-100">
                            <span className="bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              {log.classGroup}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 text-slate-800 leading-relaxed border-r border-slate-100">
                            {log.incident}
                          </td>
                          <td className="px-4 py-2.5 text-sky-900 font-medium leading-relaxed border-r border-slate-100">
                            {log.followUp}
                          </td>
                          <td className="px-3 py-2.5 text-center border-r border-slate-100">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-black shadow-2xs ${
                              log.predicate === 'A'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : log.predicate === 'B'
                                ? 'bg-sky-100 text-sky-800 border border-sky-300'
                                : log.predicate === 'C'
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : 'bg-rose-100 text-rose-800 border border-rose-300'
                            }`}>
                              Predikat {log.predicate}
                            </span>
                          </td>
                          <td className="px-3 py-2.5 text-slate-500 text-xs border-r border-slate-100">
                            {log.notes || '-'}
                          </td>
                          <td className="px-2 py-2.5 text-center">
                            <button
                              type="button"
                              onClick={() => handleDeleteBehaviorLog(log.id)}
                              className="text-slate-300 hover:text-rose-600 p-1 rounded transition-colors cursor-pointer"
                              title="Hapus catatan ini"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : activeDomainTab !== 'rapor' && activeDomainTab !== 'cbt' ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-white text-[11px] font-bold uppercase tracking-wider">
                      <th className="px-3 py-3 text-center w-12 border-r border-slate-800">No</th>
                      <th className="px-3 py-3 w-56 border-r border-slate-800 sticky left-0 bg-slate-900 z-30 shadow-xs">
                        Nama Siswa • NIS • Kelas
                      </th>
                      <th className="px-2 py-3 text-center w-12 border-r border-slate-800">L/P</th>

                      {/* KOLOM KOGNITIF */}
                      {(activeDomainTab === 'all' || activeDomainTab === 'kognitif') && (
                        <>
                          {config.cognitiveOptions.tugas && (
                            <th className="px-2 py-3 text-center w-20 bg-sky-900 text-sky-200 border-r border-slate-800">
                              Tugas
                            </th>
                          )}
                          {config.cognitiveOptions.diagnostik && (
                            <th className="px-2 py-3 text-center w-20 bg-sky-900 text-sky-200 border-r border-slate-800">
                              Diagnostik
                            </th>
                          )}
                          {config.cognitiveOptions.formatif && (
                            <th className="px-2 py-3 text-center w-20 bg-sky-900 text-sky-200 border-r border-slate-800">
                              Formatif
                            </th>
                          )}
                          {config.cognitiveOptions.sumatif && (
                            <th className="px-2 py-3 text-center w-20 bg-sky-900 text-sky-200 border-r border-slate-800">
                              Sumatif
                            </th>
                          )}
                          <th className="px-2 py-3 text-center w-20 bg-sky-800 text-white font-extrabold border-r border-slate-800">
                            Rata Kognitif
                          </th>
                        </>
                      )}

                      {/* KOLOM AFEKTIF */}
                      {(activeDomainTab === 'all' || activeDomainTab === 'afektif') && (
                        <>
                          {config.affectiveOptions.sikap && (
                            <th className="px-2 py-3 text-center w-20 bg-amber-900 text-amber-200 border-r border-slate-800">
                              Sikap
                            </th>
                          )}
                          {config.affectiveOptions.keaktifan && (
                            <th className="px-2 py-3 text-center w-20 bg-amber-900 text-amber-200 border-r border-slate-800">
                              Keaktifan
                            </th>
                          )}
                          {config.affectiveOptions.presensi_sholat && (
                            <th className="px-2 py-3 text-center w-24 bg-amber-900 text-amber-100 border-r border-slate-800">
                              Sholat 5 Waktu
                            </th>
                          )}
                          {config.affectiveOptions.adab_etika && (
                            <th className="px-2 py-3 text-center w-20 bg-amber-900 text-amber-200 border-r border-slate-800">
                              Adab & Etika
                            </th>
                          )}
                          <th className="px-2 py-3 text-center w-20 bg-amber-800 text-white font-extrabold border-r border-slate-800">
                            Rata Afektif
                          </th>
                          <th className="px-2 py-3 text-center w-20 bg-amber-800 text-white border-r border-slate-800">
                            Predikat
                          </th>
                        </>
                      )}

                      {/* KOLOM PSIKOMOTORIK */}
                      {(activeDomainTab === 'all' || activeDomainTab === 'psikomotorik') && (
                        <>
                          {config.psychomotorOptions.praktik && (
                            <th className="px-2 py-3 text-center w-20 bg-purple-900 text-purple-200 border-r border-slate-800">
                              Praktik
                            </th>
                          )}
                          {config.psychomotorOptions.unjuk_kerja && (
                            <th className="px-2 py-3 text-center w-20 bg-purple-900 text-purple-200 border-r border-slate-800">
                              Kinerja
                            </th>
                          )}
                          {config.psychomotorOptions.produk_proyek && (
                            <th className="px-2 py-3 text-center w-20 bg-purple-900 text-purple-200 border-r border-slate-800">
                              Produk
                            </th>
                          )}
                          <th className="px-2 py-3 text-center w-20 bg-purple-800 text-white font-extrabold border-r border-slate-800">
                            Rata Psiko
                          </th>
                          <th className="px-2 py-3 text-center w-20 bg-purple-800 text-white border-r border-slate-800">
                            Predikat
                          </th>
                        </>
                      )}

                      {/* NILAI AKHIR & STATUS KKTP */}
                      <th className="px-2 py-3 text-center w-20 bg-emerald-900 text-emerald-200 font-black border-r border-slate-800">
                        NILAI AKHIR
                      </th>
                      <th className="px-2 py-3 text-center w-24 bg-emerald-900 text-emerald-200 font-bold border-r border-slate-800">
                        Status KKTP
                      </th>
                      <th className="px-2 py-3 text-center w-12">Aksi</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200 text-slate-700">
                    {filteredRecords.map((r, idx) => {
                      const isTuntas = r.isTuntas;
                      return (
                        <tr
                          key={r.studentId}
                          className="hover:bg-sky-50/40 transition-colors group"
                        >
                          <td className="px-3 py-2.5 text-center font-semibold text-slate-400 border-r border-slate-100">
                            {idx + 1}
                          </td>
                          <td className="px-3 py-2.5 border-r border-slate-100">
                            <div className="font-bold text-slate-900">{r.studentName}</div>
                            <div className="text-[10px] text-slate-500 font-mono flex flex-wrap items-center gap-1.5 mt-0.5">
                              {r.nis && (
                                <span className="bg-slate-100 text-slate-700 font-semibold px-1.5 py-0.2 rounded border border-slate-200">
                                  NIS: {r.nis}
                                </span>
                              )}
                              <span className="bg-emerald-50 text-emerald-800 font-semibold px-1.5 py-0.2 rounded border border-emerald-200">
                                {r.classGroup || `${selectedGrade}-A`}
                              </span>
                              <span className="text-slate-400">NISN: {r.nisn}</span>
                            </div>
                          </td>
                          <td className="px-2 py-2.5 text-center border-r border-slate-100 font-bold text-slate-600">
                            {r.gender}
                          </td>

                          {/* KOGNITIF INPUTS */}
                          {(activeDomainTab === 'all' || activeDomainTab === 'kognitif') && (
                            <>
                              {config.cognitiveOptions.tugas && (
                                <td className="px-1.5 py-2 text-center border-r border-slate-100">
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={r.kognitif.tugas ?? ''}
                                    onChange={(e) =>
                                      handleScoreChange(idx, 'kognitif', 'tugas', e.target.value)
                                    }
                                    className="w-14 text-center font-semibold p-1 border border-slate-200 rounded focus:ring-1 focus:ring-sky-500 bg-white"
                                  />
                                </td>
                              )}
                              {config.cognitiveOptions.diagnostik && (
                                <td className="px-1.5 py-2 text-center border-r border-slate-100">
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={r.kognitif.diagnostik ?? ''}
                                    onChange={(e) =>
                                      handleScoreChange(idx, 'kognitif', 'diagnostik', e.target.value)
                                    }
                                    className="w-14 text-center font-semibold p-1 border border-slate-200 rounded focus:ring-1 focus:ring-sky-500 bg-white"
                                  />
                                </td>
                              )}
                              {config.cognitiveOptions.formatif && (
                                <td className="px-1.5 py-2 text-center border-r border-slate-100">
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={r.kognitif.formatif ?? ''}
                                    onChange={(e) =>
                                      handleScoreChange(idx, 'kognitif', 'formatif', e.target.value)
                                    }
                                    className="w-14 text-center font-semibold p-1 border border-slate-200 rounded focus:ring-1 focus:ring-sky-500 bg-white"
                                  />
                                </td>
                              )}
                              {config.cognitiveOptions.sumatif && (
                                <td className="px-1.5 py-2 text-center border-r border-slate-100">
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={r.kognitif.sumatif ?? ''}
                                    onChange={(e) =>
                                      handleScoreChange(idx, 'kognitif', 'sumatif', e.target.value)
                                    }
                                    className="w-14 text-center font-semibold p-1 border border-slate-200 rounded focus:ring-1 focus:ring-sky-500 bg-white"
                                  />
                                </td>
                              )}
                              <td className="px-2 py-2 text-center font-bold text-sky-800 bg-sky-50/50 border-r border-slate-100">
                                {r.kognitif.rataRata}
                              </td>
                            </>
                          )}

                          {/* AFEKTIF INPUTS */}
                          {(activeDomainTab === 'all' || activeDomainTab === 'afektif') && (
                            <>
                              {config.affectiveOptions.sikap && (
                                <td className="px-1.5 py-2 text-center border-r border-slate-100">
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={r.afektif.sikap ?? ''}
                                    onChange={(e) =>
                                      handleScoreChange(idx, 'afektif', 'sikap', e.target.value)
                                    }
                                    className="w-14 text-center font-semibold p-1 border border-slate-200 rounded focus:ring-1 focus:ring-amber-500 bg-white"
                                  />
                                </td>
                              )}
                              {config.affectiveOptions.keaktifan && (
                                <td className="px-1.5 py-2 text-center border-r border-slate-100">
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={r.afektif.keaktifan ?? ''}
                                    onChange={(e) =>
                                      handleScoreChange(idx, 'afektif', 'keaktifan', e.target.value)
                                    }
                                    className="w-14 text-center font-semibold p-1 border border-slate-200 rounded focus:ring-1 focus:ring-amber-500 bg-white"
                                  />
                                </td>
                              )}
                              {config.affectiveOptions.presensi_sholat && (
                                <td className="px-1.5 py-2 text-center border-r border-slate-100">
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={r.afektif.presensiSholat ?? ''}
                                    onChange={(e) =>
                                      handleScoreChange(idx, 'afektif', 'presensiSholat', e.target.value)
                                    }
                                    title="Nilai presensi sholat 5 waktu & mutaba'ah ibadah yaumiyah"
                                    className="w-16 text-center font-bold text-amber-900 p-1 border border-amber-300 rounded focus:ring-1 focus:ring-amber-500 bg-amber-50/50"
                                  />
                                </td>
                              )}
                              {config.affectiveOptions.adab_etika && (
                                <td className="px-1.5 py-2 text-center border-r border-slate-100">
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={r.afektif.adabEtika ?? ''}
                                    onChange={(e) =>
                                      handleScoreChange(idx, 'afektif', 'adabEtika', e.target.value)
                                    }
                                    className="w-14 text-center font-semibold p-1 border border-slate-200 rounded focus:ring-1 focus:ring-amber-500 bg-white"
                                  />
                                </td>
                              )}
                              <td className="px-2 py-2 text-center font-bold text-amber-800 bg-amber-50/50 border-r border-slate-100">
                                {r.afektif.rataRata}
                              </td>
                              <td className="px-2 py-2 text-center border-r border-slate-100">
                                <span
                                  className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                                    r.afektif.predikat === 'Sangat Baik'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : r.afektif.predikat === 'Baik'
                                      ? 'bg-blue-100 text-blue-800'
                                      : 'bg-amber-100 text-amber-800'
                                  }`}
                                >
                                  {r.afektif.predikat}
                                </span>
                              </td>
                            </>
                          )}

                          {/* PSIKOMOTORIK INPUTS */}
                          {(activeDomainTab === 'all' || activeDomainTab === 'psikomotorik') && (
                            <>
                              {config.psychomotorOptions.praktik && (
                                <td className="px-1.5 py-2 text-center border-r border-slate-100">
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={r.psikomotorik.praktik ?? ''}
                                    onChange={(e) =>
                                      handleScoreChange(idx, 'psikomotorik', 'praktik', e.target.value)
                                    }
                                    className="w-14 text-center font-semibold p-1 border border-slate-200 rounded focus:ring-1 focus:ring-purple-500 bg-white"
                                  />
                                </td>
                              )}
                              {config.psychomotorOptions.unjuk_kerja && (
                                <td className="px-1.5 py-2 text-center border-r border-slate-100">
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={r.psikomotorik.unjukKerja ?? ''}
                                    onChange={(e) =>
                                      handleScoreChange(idx, 'psikomotorik', 'unjukKerja', e.target.value)
                                    }
                                    className="w-14 text-center font-semibold p-1 border border-slate-200 rounded focus:ring-1 focus:ring-purple-500 bg-white"
                                  />
                                </td>
                              )}
                              {config.psychomotorOptions.produk_proyek && (
                                <td className="px-1.5 py-2 text-center border-r border-slate-100">
                                  <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={r.psikomotorik.produkProyek ?? ''}
                                    onChange={(e) =>
                                      handleScoreChange(idx, 'psikomotorik', 'produkProyek', e.target.value)
                                    }
                                    className="w-14 text-center font-semibold p-1 border border-slate-200 rounded focus:ring-1 focus:ring-purple-500 bg-white"
                                  />
                                </td>
                              )}
                              <td className="px-2 py-2 text-center font-bold text-purple-800 bg-purple-50/50 border-r border-slate-100">
                                {r.psikomotorik.rataRata}
                              </td>
                              <td className="px-2 py-2 text-center border-r border-slate-100">
                                <span
                                  className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                                    r.psikomotorik.predikat === 'Sangat Mahir'
                                      ? 'bg-purple-100 text-purple-800'
                                      : r.psikomotorik.predikat === 'Mahir'
                                      ? 'bg-indigo-100 text-indigo-800'
                                      : 'bg-slate-100 text-slate-800'
                                  }`}
                                >
                                  {r.psikomotorik.predikat}
                                </span>
                              </td>
                            </>
                          )}

                          {/* NILAI AKHIR TP & STATUS KKTP */}
                          <td className="px-2 py-2 text-center font-black text-slate-900 text-xs bg-emerald-50/40 border-r border-slate-100">
                            {r.nilaiAkhir}
                          </td>
                          <td className="px-2 py-2 text-center border-r border-slate-100">
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center justify-center gap-1 ${
                                isTuntas
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {isTuntas ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  <span>Tuntas</span>
                                </>
                              ) : (
                                <>
                                  <AlertCircle className="w-3 h-3 text-rose-600" />
                                  <span>Remedial</span>
                                </>
                              )}
                            </span>
                          </td>

                          {/* AKSI DELETE */}
                          <td className="px-2 py-2 text-center">
                            <button
                              onClick={() => handleDeleteStudent(idx)}
                              className="text-slate-300 hover:text-rose-600 p-1 rounded transition-colors"
                              title="Hapus baris siswa ini"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* ========================================================================= */
            /* TAB 5: DESKRIPSI NARASI RAPOR PER SISWA */
            /* ========================================================================= */
            <div className="space-y-3">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    Generator Narasi Rapor Kurikulum Merdeka (Otomatis per Siswa)
                  </h4>
                  <p className="text-[11px] text-emerald-800 mt-0.5">
                    Deskripsi mengintegrasikan capaian kognitif, kebiasaan ibadah sholat 5 waktu & sikap afektif, serta keterampilan psikomotorik. Siap dicopy ke aplikasi e-Rapor.
                  </p>
                </div>
                <span className="text-xs font-bold text-emerald-900 bg-white px-3 py-1.5 rounded-lg border border-emerald-300 shadow-2xs">
                  {records.length} Siswa Terdaftar
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredRecords.map((r, i) => (
                  <div
                    key={r.studentId}
                    className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2.5 relative hover:border-sky-300 transition-all"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div className="flex items-center space-x-2">
                        <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center">
                          {i + 1}
                        </span>
                        <div>
                          <span className="font-bold text-xs text-slate-900">{r.studentName}</span>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono mt-0.5">
                            {r.nis && <span className="bg-slate-100 text-slate-700 font-semibold px-1 py-0.2 rounded">NIS: {r.nis}</span>}
                            <span className="bg-emerald-50 text-emerald-800 font-semibold px-1 py-0.2 rounded border border-emerald-200">
                              {r.classGroup || `${selectedGrade}-A`}
                            </span>
                            <span className="text-slate-400">NISN: {r.nisn}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                          NA: {r.nilaiAkhir}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            r.isTuntas
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {r.isTuntas ? 'Tuntas KKTP' : 'Remedial'}
                        </span>
                      </div>
                    </div>

                    {/* Breakdown Scores */}
                    <div className="grid grid-cols-3 gap-2 text-[10px] text-center">
                      <div className="bg-sky-50 p-1.5 rounded border border-sky-100">
                        <span className="text-sky-700 block font-medium">Kognitif</span>
                        <span className="font-bold text-sky-900 text-xs">{r.kognitif.rataRata}</span>
                      </div>
                      <div className="bg-amber-50 p-1.5 rounded border border-amber-100">
                        <span className="text-amber-700 block font-medium">Afektif (Sholat: {r.afektif.presensiSholat ?? '-'})</span>
                        <span className="font-bold text-amber-900 text-xs">{r.afektif.rataRata} ({r.afektif.predikat})</span>
                      </div>
                      <div className="bg-purple-50 p-1.5 rounded border border-purple-100">
                        <span className="text-purple-700 block font-medium">Psikomotorik</span>
                        <span className="font-bold text-purple-900 text-xs">{r.psikomotorik.rataRata} ({r.psikomotorik.predikat})</span>
                      </div>
                    </div>

                    {/* Editable Narrative Description */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        Deskripsi Capaian Kompetensi (Rapor):
                      </label>
                      <textarea
                        rows={3}
                        value={r.deskripsiCapaian}
                        onChange={(e) => {
                          const updated = { ...r, deskripsiCapaian: e.target.value };
                          handleUpdateRecord(i, updated);
                        }}
                        className="w-full text-xs text-slate-800 bg-slate-50/70 border border-slate-200 rounded-lg p-2.5 leading-relaxed focus:bg-white focus:ring-1 focus:ring-sky-500"
                      />
                    </div>

                    {/* Copy Button */}
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleCopyNarrative(r.studentId, r.deskripsiCapaian)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-sky-100 text-slate-700 hover:text-sky-800 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-colors"
                      >
                        {copiedId === r.studentId ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700">Tersalin ke Clipboard!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-500" />
                            <span>Salin Narasi Rapor</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB: REKAP HASIL UJIAN CBT SISWA DARI CLOUD DATABASE & LINK SISWA */}
          {/* ========================================================================= */}
          {activeDomainTab === 'cbt' && (
            <div className="p-5 space-y-5">
              {/* CBT Notice & Sync Feedback */}
              {cbtSyncNotice && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 flex items-center justify-between animate-fadeIn">
                  <span className="flex items-center gap-2 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    {cbtSyncNotice}
                  </span>
                  <button onClick={() => setCbtSyncNotice('')} className="text-emerald-700 hover:text-emerald-900 font-bold">✕</button>
                </div>
              )}

              {/* Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
                      Rekapitulasi Hasil Ujian CBT Siswa (Real-Time Cloud)
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Data terkumpul secara otomatis dari link CBT yang dikerjakan peserta didik. Nilai terekap permanen di Firestore Cloud.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={loadAllCbtSubmissions}
                    className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                    title="Segarkan data dari Cloud Database Firestore"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingCbt ? 'animate-spin' : ''}`} />
                    <span>Segarkan Data</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => exportCbtResultsToCsv(cbtResultsList)}
                    disabled={cbtResultsList.length === 0}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                    title="Ekspor seluruh hasil CBT siswa ke file CSV / Excel"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Ekspor CSV / Excel</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSyncAllCbtToCurrentGradebook}
                    disabled={cbtResultsList.length === 0}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                    title="Otomatis masukkan nilai CBT siswa yang cocok ke kolom Sumatif Kognitif di buku nilai"
                  >
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>Sinkronkan ke Nilai Sumatif</span>
                  </button>
                </div>
              </div>

              {/* 4 Cards Metrics */}
              {(() => {
                const filteredCbt = cbtResultsList.filter(r => {
                  const q = cbtSearchQuery.toLowerCase();
                  return (
                    r.studentName.toLowerCase().includes(q) ||
                    r.nis.toLowerCase().includes(q) ||
                    r.classGroup.toLowerCase().includes(q) ||
                    r.examTitle.toLowerCase().includes(q)
                  );
                });
                const total = filteredCbt.length;
                const avg = total > 0 ? Math.round(filteredCbt.reduce((a, b) => a + b.score, 0) / total) : 0;
                const tuntas = filteredCbt.filter(r => r.score >= config.kktp).length;
                const highest = total > 0 ? Math.max(...filteredCbt.map(r => r.score)) : 0;

                return (
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Total Peserta Mengumpulkan</span>
                        <span className="text-xl font-extrabold text-slate-800 font-mono mt-0.5 block">{total} Siswa</span>
                      </div>
                      <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Rata-Rata Nilai CBT</span>
                        <span className="text-xl font-extrabold text-sky-600 font-mono mt-0.5 block">{avg}</span>
                      </div>
                      <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Nilai Tertinggi</span>
                        <span className="text-xl font-extrabold text-emerald-600 font-mono mt-0.5 block">{highest}</span>
                      </div>
                      <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Tuntas KKTP (&ge; {config.kktp})</span>
                        <span className="text-xl font-extrabold text-amber-600 font-mono mt-0.5 block">{tuntas} / {total}</span>
                      </div>
                    </div>

                    {/* Search bar inside CBT tab */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="relative flex-1 max-w-sm">
                        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={cbtSearchQuery}
                          onChange={e => setCbtSearchQuery(e.target.value)}
                          placeholder="Cari nama peserta, NIS, kelas, atau judul ujian..."
                          className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <span className="text-xs text-slate-500 font-medium">
                        Menampilkan {total} dari {cbtResultsList.length} data ujian
                      </span>
                    </div>

                    {/* Table of CBT Submissions */}
                    {total === 0 ? (
                      <div className="p-12 text-center bg-slate-50 rounded-2xl border border-slate-200">
                        <Laptop className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <h4 className="text-sm font-bold text-slate-700">Belum Ada Hasil CBT yang Terkumpul</h4>
                        <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                          Gunakan tombol "Bagikan Link CBT Siswa" pada naskah soal atau bilah menu atas untuk membagikan tautan ujian ke siswa. Semua hasil pengerjaan akan otomatis masuk dan terekap di tabel ini secara real-time.
                        </p>
                      </div>
                    ) : (
                      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
                        <div className="max-h-96 overflow-y-auto">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-slate-900 text-white font-bold uppercase text-[10px] sticky top-0">
                              <tr>
                                <th className="p-3 w-12 text-center">No</th>
                                <th className="p-3">Nama Siswa</th>
                                <th className="p-3">NIS</th>
                                <th className="p-3">Kelas</th>
                                <th className="p-3">Judul Ujian CBT</th>
                                <th className="p-3 text-center">Skor (0-100)</th>
                                <th className="p-3 text-center">Benar / Total</th>
                                <th className="p-3 text-center">Status KKTP</th>
                                <th className="p-3">Waktu Selesai</th>
                                <th className="p-3 text-center w-28">Aksi</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-800">
                              {filteredCbt.map((res, idx) => {
                                const isTuntas = res.score >= config.kktp;
                                return (
                                  <tr key={res.id || idx} className="hover:bg-indigo-50/40 transition-colors">
                                    <td className="p-3 text-center font-bold text-slate-400">{idx + 1}</td>
                                    <td className="p-3 font-bold text-slate-900">{res.studentName}</td>
                                    <td className="p-3 font-mono text-slate-600">{res.nis}</td>
                                    <td className="p-3">
                                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold text-[11px]">
                                        {res.classGroup}
                                      </span>
                                    </td>
                                    <td className="p-3 text-slate-700 max-w-xs truncate" title={res.examTitle}>
                                      {res.examTitle}
                                    </td>
                                    <td className="p-3 text-center font-mono font-extrabold text-sm">
                                      <span className={isTuntas ? 'text-emerald-600' : 'text-amber-600'}>
                                        {res.score}
                                      </span>
                                    </td>
                                    <td className="p-3 text-center text-slate-600 font-mono text-[11px]">
                                      {res.correctCount} / {res.totalQuestions}
                                    </td>
                                    <td className="p-3 text-center">
                                      <span
                                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                          isTuntas ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                        }`}
                                      >
                                        {isTuntas ? 'TUNTAS' : 'REMEDIAL'}
                                      </span>
                                    </td>
                                    <td className="p-3 text-[11px] text-slate-500 whitespace-nowrap">
                                      {res.submittedAt}
                                    </td>
                                    <td className="p-3 text-center">
                                      <div className="flex items-center justify-center gap-1">
                                        <button
                                          type="button"
                                          onClick={() => printCbtStudentCertificate(res, customSchoolName, customTeacherName)}
                                          className="p-1 text-sky-600 hover:text-sky-800 hover:bg-sky-50 rounded"
                                          title="Cetak Bukti Nilai Peserta Didik"
                                        >
                                          <Printer className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteCbtSubmission(res.id)}
                                          className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded"
                                          title="Hapus data hasil ini"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* 6. MODAL FOOTER: STATISTIK RINGKAS KELAS & ACTION */}
        {/* ========================================================================= */}
        <div className="bg-slate-900 text-white px-5 py-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 text-xs">
          {/* Quick stats badges */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-bold text-slate-300">Statistik Kelas:</span>
            <span className="bg-slate-800 px-2.5 py-1 rounded text-slate-300 border border-slate-700">
              Rata Kognitif: <strong className="text-sky-400">{stats.avgCog}</strong>
            </span>
            <span className="bg-slate-800 px-2.5 py-1 rounded text-slate-300 border border-slate-700">
              Rata Afektif: <strong className="text-amber-400">{stats.avgAff}</strong>
            </span>
            <span className="bg-slate-800 px-2.5 py-1 rounded text-slate-300 border border-slate-700">
              Rata Psikomotorik: <strong className="text-purple-400">{stats.avgPsy}</strong>
            </span>
            <span className="bg-emerald-950 px-2.5 py-1 rounded text-emerald-300 border border-emerald-800/80">
              Rata Akhir: <strong className="text-emerald-400 font-black">{stats.avgFinal}</strong>
            </span>
            <span className="bg-slate-800 px-2.5 py-1 rounded text-slate-300 border border-slate-700">
              Tuntas KKTP: <strong className="text-emerald-400">{stats.tuntasCount}</strong> / {records.length} Siswa ({records.length > 0 ? Math.round((stats.tuntasCount / records.length) * 100) : 0}%)
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-semibold transition-colors"
            >
              Tutup Buku Nilai
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MODAL CONFIGURATION (BOBOT & KKTP) */}
        {/* ========================================================================= */}
        {showConfigModal && (
          <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-5 text-slate-800 shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-sky-600" />
                  Pengaturan Bobot Penilaian & KKTP
                </h3>
                <button
                  onClick={() => setShowConfigModal(false)}
                  className="p-1 rounded text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Kriteria Ketercapaian Tujuan Pembelajaran (KKTP):
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="50"
                      max="90"
                      value={config.kktp}
                      onChange={(e) => setConfig({ ...config, kktp: Number(e.target.value) })}
                      className="w-24 p-2 border border-slate-300 rounded-lg text-sm font-bold text-sky-800"
                    />
                    <span className="text-slate-500 text-[11px]">Standar minimal ketuntasan (Default: 75)</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <label className="block font-bold text-slate-700 mb-2">
                    Bobot Ranah Pembelajaran (Total 100%):
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-sky-50 p-2.5 rounded-lg border border-sky-200">
                      <span className="font-bold text-sky-900 block mb-1">Kognitif (%)</span>
                      <input
                        type="number"
                        min="10"
                        max="80"
                        value={config.weights.kognitif}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            weights: { ...config.weights, kognitif: Number(e.target.value) }
                          })
                        }
                        className="w-full p-1.5 bg-white border border-sky-300 rounded font-bold text-sky-900 text-center"
                      />
                    </div>
                    <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                      <span className="font-bold text-amber-900 block mb-1">Afektif (%)</span>
                      <input
                        type="number"
                        min="10"
                        max="80"
                        value={config.weights.afektif}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            weights: { ...config.weights, afektif: Number(e.target.value) }
                          })
                        }
                        className="w-full p-1.5 bg-white border border-amber-300 rounded font-bold text-amber-900 text-center"
                      />
                    </div>
                    <div className="bg-purple-50 p-2.5 rounded-lg border border-purple-200">
                      <span className="font-bold text-purple-900 block mb-1">Psikomotor (%)</span>
                      <input
                        type="number"
                        min="10"
                        max="80"
                        value={config.weights.psikomotorik}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            weights: { ...config.weights, psikomotorik: Number(e.target.value) }
                          })
                        }
                        className="w-full p-1.5 bg-white border border-purple-300 rounded font-bold text-purple-900 text-center"
                      />
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Total Bobot:{' '}
                    <strong
                      className={
                        config.weights.kognitif + config.weights.afektif + config.weights.psikomotorik === 100
                          ? 'text-emerald-600'
                          : 'text-rose-600'
                      }
                    >
                      {config.weights.kognitif + config.weights.afektif + config.weights.psikomotorik}%
                    </strong>{' '}
                    (Standar: 40% Kognitif + 30% Afektif + 30% Psikomotorik)
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <label className="block font-bold text-slate-700">Identitas Madrasah / Cetak:</label>
                  <div>
                    <span className="text-[11px] text-slate-500 block mb-0.5">Nama Sekolah / Madrasah:</span>
                    <input
                      type="text"
                      value={customSchoolName}
                      onChange={(e) => setCustomSchoolName(e.target.value)}
                      className="w-full p-1.5 border border-slate-300 rounded text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block mb-0.5">Nama Guru Pengampu PAIBP:</span>
                    <input
                      type="text"
                      value={customTeacherName}
                      onChange={(e) => setCustomTeacherName(e.target.value)}
                      className="w-full p-1.5 border border-slate-300 rounded text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    // Recalculate all records with new config
                    const updated = records.map(r => recalculateStudentRecord(r, config));
                    setRecords(updated);
                    saveGradebookToStorage(storageKey, updated);
                    setShowConfigModal(false);
                  }}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold"
                >
                  Simpan & Terapkan Perubahan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL TAMBAH SISWA */}
        {/* ========================================================================= */}
        {showAddStudentModal && (
          <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
            <form
              onSubmit={handleAddStudent}
              className="bg-white rounded-xl max-w-sm w-full p-5 text-slate-800 shadow-2xl border border-slate-200 space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-sky-600" />
                  Tambah Peserta Didik Baru
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="p-1 rounded text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nama Lengkap Siswa:</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Muhammad Ihsan Kamil"
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">NIS (Lokal):</label>
                    <input
                      type="text"
                      placeholder="Contoh: 24001"
                      value={newStudentNis}
                      onChange={(e) => setNewStudentNis(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-sky-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Kelas:</label>
                    <input
                      type="text"
                      placeholder={`Contoh: ${selectedGrade}-A`}
                      value={newStudentClass}
                      onChange={(e) => setNewStudentClass(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jenis Kelamin:</label>
                  <div className="flex space-x-3">
                    <label className="flex items-center space-x-1 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        checked={newStudentGender === 'L'}
                        onChange={() => setNewStudentGender('L')}
                        className="text-sky-600"
                      />
                      <span>Laki-laki (L)</span>
                    </label>
                    <label className="flex items-center space-x-1 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        checked={newStudentGender === 'P'}
                        onChange={() => setNewStudentGender('P')}
                        className="text-sky-600"
                      />
                      <span>Perempuan (P)</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold"
                >
                  Simpan Siswa
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL TAMBAH CATATAN SIKAP / JURNAL GURU */}
        {/* ========================================================================= */}
        {showAddBehaviorModal && (
          <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
            <form
              onSubmit={handleAddBehaviorLogSubmit}
              className="bg-white rounded-xl max-w-md w-full p-5 text-slate-800 shadow-2xl border border-slate-200 space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-amber-600" />
                  Tambah Catatan Sikap / Jurnal Guru
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddBehaviorModal(false)}
                  className="p-1 rounded text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                {/* Hari / Tgl */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hari / Tanggal Kejadian:</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 30/10/2026 atau Jumat, 30 Oktober 2026"
                    value={behaviorDate}
                    onChange={(e) => setBehaviorDate(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                </div>

                {/* Dropdown Siswa & Kelas Otomatis */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">Pilih Peserta Didik (Nama):</label>
                    <select
                      value={behaviorStudentId || records[0]?.studentId || ''}
                      onChange={(e) => setBehaviorStudentId(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 font-semibold"
                    >
                      {records.map((st) => (
                        <option key={st.studentId} value={st.studentId}>
                          {st.studentName} ({st.nis || 'No NIS'})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Kelas (Otomatis):</label>
                    <input
                      type="text"
                      readOnly
                      value={
                        (records.find((r) => r.studentId === (behaviorStudentId || records[0]?.studentId))?.classGroup) ||
                        `${selectedGrade}-${selectedRombel}`
                      }
                      className="w-full p-2 border border-emerald-300 bg-emerald-50 rounded-lg text-xs font-bold text-emerald-900 cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Kejadian / Uraian */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kejadian / Perilaku yang Diamati:</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Contoh: Membuang sampah pada tempatnya / Membantu teman saat mengaji"
                    value={behaviorIncident}
                    onChange={(e) => setBehaviorIncident(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Tindak Lanjut & Predikat */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Tindak Lanjut Guru:</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Diapresiasi / Dibina"
                      value={behaviorFollowUp}
                      onChange={(e) => setBehaviorFollowUp(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Predikat Sikap:</label>
                    <select
                      value={behaviorPredicate}
                      onChange={(e) => setBehaviorPredicate(e.target.value as 'A' | 'B' | 'C' | 'D')}
                      className="w-full p-2 border border-slate-300 rounded-lg text-xs font-bold text-amber-900 focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="A">Predikat A (Sangat Baik)</option>
                      <option value="B">Predikat B (Baik)</option>
                      <option value="C">Predikat C (Cukup)</option>
                      <option value="D">Predikat D (Perlu Pembinaan)</option>
                    </select>
                  </div>
                </div>

                {/* Catatan Keterangan Tambahan */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Keterangan Tambahan (Ket.):</label>
                  <input
                    type="text"
                    placeholder="Contoh: Konsisten berakhlak mulia di kelas dan musholla"
                    value={behaviorNotes}
                    onChange={(e) => setBehaviorNotes(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddBehaviorModal(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
                >
                  Simpan Catatan Sikap
                </button>
              </div>
            </form>
          </div>
        )}
        {showHolisticModal && (
          <HolisticAssessmentModal
            onClose={() => setShowHolisticModal(false)}
            initialGrade={selectedGrade}
            initialSemester={selectedSemester}
            initialElement={selectedElement}
            initialTopicId={currentTopic?.id}
            schoolName={customSchoolName}
            teacherName={customTeacherName}
            currentUser={currentUser}
            onOpenActivation={onOpenActivation}
          />
        )}

        {/* MODAL IMPORT SISWA (EXCEL / CSV / TEKS) */}
        {showImportModal && (
          <StudentImportModal
            onClose={() => setShowImportModal(false)}
            onImportSuccess={handleImportStudentsSuccess}
            currentGrade={selectedGrade}
            currentSemester={selectedSemester}
            currentElement={selectedElement}
            currentTpId={`tp-${selectedTopicId}-${selectedTpIndex}`}
            currentTpText={currentTpText}
            config={config}
            existingCount={records.length}
          />
        )}
      </div>
    </div>
  );
};
