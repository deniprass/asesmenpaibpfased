import React, { useState, useEffect, useMemo, useRef } from 'react';
import { QuestionItem, AssessmentPackage, GradeLevel, Semester, CbtExamConfig, CbtStudentIdentity, CbtStudentResult, StudentInfo, UserAccount } from '../types';
import {
  Laptop,
  Clock,
  CheckCircle2,
  AlertCircle,
  Award,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  X,
  FileCheck,
  Printer,
  Download,
  Users,
  Settings,
  ShieldAlert,
  HelpCircle,
  Maximize2,
  Minimize2,
  Trash2,
  Sparkles,
  ChevronRight,
  BookOpen,
  Search,
  Check,
  Eye,
  EyeOff,
  AlertTriangle,
  Database,
  Cloud,
  Sliders,
  Lock,
  Filter,
  RefreshCw,
  Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  INITIAL_STUDENTS_BY_GRADE,
  saveCbtResult,
  loadCbtResults,
  deleteCbtResult,
  syncCbtScoreToStudentGradebook,
  printCbtStudentCertificate,
  exportCbtResultsToCsv
} from '../services/gradingService';
import {
  loadStudentsFromDatabase,
  loadCbtResultsFromDatabase
} from '../services/firebaseDatabaseService';
import { CbtSettingsModal } from './CbtSettingsModal';
import { BankSoalPickerModal } from './BankSoalPickerModal';

interface DirectCbtModalProps {
  packageData: AssessmentPackage;
  onClose: () => void;
  onOpenGrading?: () => void;
  onOpenShareCbt?: () => void;
  currentUser?: UserAccount | null;
  onOpenActivation?: () => void;
}

type ModalView = 'student-gate' | 'student-exam' | 'student-result' | 'teacher-panel';
type FontSize = 'normal' | 'large' | 'xlarge';

export const DirectCbtModal: React.FC<DirectCbtModalProps> = ({
  packageData,
  onClose,
  onOpenGrading,
  onOpenShareCbt,
  currentUser,
  onOpenActivation
}) => {
  const isDemo = currentUser?.role === 'demo';
  // Modal main view state
  const [currentView, setCurrentView] = useState<ModalView>('student-gate');

  // Exam Configuration with Comprehensive Defaults
  const [config, setConfig] = useState<CbtExamConfig>({
    token: 'PAI-2026',
    requireToken: true,
    durationMinutes: packageData.identity.timeAllocation || (packageData.questions.length <= 10 ? 30 : 45),
    minimumDurationMinutes: 5,
    shuffleQuestions: false,
    shuffleOptions: false,
    showInstantScore: true,
    showReview: true,
    allowPrintCertificate: true,
    kktpTarget: 75,
    examInstructions: '1. Kerjakan soal dengan teliti, jujur, dan mandiri.\n2. Dilarang berpindah tab browser atau membuka aplikasi lain.\n3. Periksa kembali jawaban sebelum mengklik tombol kumpulkan.',
    antiCheatWarning: true,
    detectTabSwitch: true,
    maxTabSwitchAllowed: 2,
    tabSwitchAction: 'warn',
    questionSelectionMode: 'all',
    selectedTopicFilter: 'all',
    selectedTpFilter: 'all',
    selectedQuestionIds: packageData.questions.map(q => q.number),
    maxQuestionsLimit: packageData.questions.length
  });

  // Active questions state (supports dynamic additions & replacements from Bank Soal)
  const [activeQuestions, setActiveQuestions] = useState<QuestionItem[]>(() => packageData.questions);
  const [showBankPickerModal, setShowBankPickerModal] = useState<boolean>(false);
  const [bankImportToast, setBankImportToast] = useState<string>('');

  const handleImportFromBankSoal = (imported: QuestionItem[], mode: 'append' | 'replace') => {
    let updated: QuestionItem[] = [];
    if (mode === 'replace') {
      updated = imported.map((q, idx) => ({ ...q, number: idx + 1 }));
      setBankImportToast(`Berhasil mengganti seluruh soal CBT dengan ${imported.length} butir dari Bank Soal.`);
    } else {
      const startNum = activeQuestions.length + 1;
      const renumbered = imported.map((q, idx) => ({ ...q, number: startNum + idx }));
      updated = [...activeQuestions, ...renumbered];
      setBankImportToast(`Berhasil menambahkan ${imported.length} butir soal dari Bank Soal (Total: ${updated.length} butir).`);
    }
    setActiveQuestions(updated);
    setConfig(prev => ({
      ...prev,
      selectedQuestionIds: updated.map(q => q.number),
      maxQuestionsLimit: updated.length
    }));
    setTimeout(() => setBankImportToast(''), 4500);
  };

  // Settings Modal & Extra Security States
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [lockCountdown, setLockCountdown] = useState<number>(0);
  const [minimumDurationAlert, setMinimumDurationAlert] = useState<string>('');
  const [autoSubmitReason, setAutoSubmitReason] = useState<string>('');

  // Student Identity
  const [studentIdentity, setStudentIdentity] = useState<CbtStudentIdentity>({
    nis: '24001',
    name: 'Ahmad Fauzi Pratama',
    classGroup: `${packageData.identity.grade}-A`
  });
  const [inputToken, setInputToken] = useState<string>('PAI-2026');
  const [tokenError, setTokenError] = useState<string>('');

  // Master students loaded from Cloud Database
  const [cloudStudents, setCloudStudents] = useState<StudentInfo[]>([]);

  // Roster of students available (prioritizes imported students from Cloud Database)
  const availableStudents: StudentInfo[] = useMemo(() => {
    if (cloudStudents.length > 0) return cloudStudents;
    const list = INITIAL_STUDENTS_BY_GRADE[packageData.identity.grade] || INITIAL_STUDENTS_BY_GRADE.VIII;
    return list;
  }, [packageData.identity.grade, cloudStudents]);

  // Load students and results from Cloud Firestore
  useEffect(() => {
    loadStudentsFromDatabase(packageData.identity.grade).then(list => {
      if (list && list.length > 0) {
        setCloudStudents(list);
      }
    });

    // Load local results first, then merge with Cloud Firestore
    const local = loadCbtResults();
    setCbtResultsList(local);

    loadCbtResultsFromDatabase().then(cloudResults => {
      if (cloudResults && cloudResults.length > 0) {
        setCbtResultsList(prev => {
          const map = new Map();
          [...cloudResults, ...prev].forEach(r => map.set(r.id, r));
          return Array.from(map.values());
        });
      }
    });
  }, [packageData.identity.grade]);

  // Exam questions preparation (with Tema / TP filter, custom selection, limit, and option shuffling)
  const preparedQuestions = useMemo(() => {
    let list = [...activeQuestions];

    // Filter by Topic
    if (config.questionSelectionMode === 'topic' && config.selectedTopicFilter && config.selectedTopicFilter !== 'all') {
      const filtered = list.filter(q => (q.tema === config.selectedTopicFilter) || (q.materi === config.selectedTopicFilter));
      if (filtered.length > 0) list = filtered;
    }
    // Filter by TP (Tujuan Pembelajaran)
    else if (config.questionSelectionMode === 'tp' && config.selectedTpFilter && config.selectedTpFilter !== 'all') {
      const filtered = list.filter(q => q.tp === config.selectedTpFilter);
      if (filtered.length > 0) list = filtered;
    }
    // Filter by Custom Question Numbers
    else if (config.questionSelectionMode === 'custom' && config.selectedQuestionIds && config.selectedQuestionIds.length > 0) {
      const filtered = list.filter(q => config.selectedQuestionIds?.includes(q.number));
      if (filtered.length > 0) list = filtered;
    }

    // Question limit
    if (config.maxQuestionsLimit && config.maxQuestionsLimit > 0 && config.maxQuestionsLimit < list.length) {
      list = list.slice(0, config.maxQuestionsLimit);
    }

    // Shuffle Questions
    if (config.shuffleQuestions) {
      list = [...list].sort(() => Math.random() - 0.5);
    }

    // Shuffle Multiple Choice Options (A, B, C, D) while maintaining accurate answer keys
    if (config.shuffleOptions) {
      list = list.map(q => {
        if (q.questionType === 'Essay' || !q.options || q.options.length < 2) return q;
        const correctOpt = q.options.find(o => o.key === q.correctKey);
        const correctText = correctOpt ? correctOpt.text : '';
        const shuffled = [...q.options].sort(() => Math.random() - 0.5);
        const standardKeys: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];
        let updatedKey = q.correctKey;
        const remappedOptions = shuffled.map((opt, i) => {
          const k = standardKeys[i] || opt.key;
          if (opt.text === correctText) {
            updatedKey = k;
          }
          return { ...opt, key: k };
        });
        return {
          ...q,
          options: remappedOptions,
          correctKey: updatedKey
        };
      });
    }

    return list;
  }, [
    activeQuestions,
    config.questionSelectionMode,
    config.selectedTopicFilter,
    config.selectedTpFilter,
    config.selectedQuestionIds,
    config.maxQuestionsLimit,
    config.shuffleQuestions,
    config.shuffleOptions
  ]);

  // Exam Active State
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [doubtfuls, setDoubtfuls] = useState<number[]>([]);
  const [timeRemaining, setTimeRemaining] = useState<number>(config.durationMinutes * 60);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [showQuestionDrawer, setShowQuestionDrawer] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<FontSize>('normal');
  const [showConfirmSubmit, setShowConfirmSubmit] = useState<boolean>(false);
  const [antiCheatViolations, setAntiCheatViolations] = useState<number>(0);
  const [showAntiCheatAlert, setShowAntiCheatAlert] = useState<boolean>(false);

  // Completed Result state
  const [activeResult, setActiveResult] = useState<CbtStudentResult | null>(null);
  const [cbtResultsList, setCbtResultsList] = useState<CbtStudentResult[]>([]);
  const [showReviewInResult, setShowReviewInResult] = useState<boolean>(false);
  const [syncSuccessToast, setSyncSuccessToast] = useState<string>('');

  // Search & Filter in Teacher Recap Panel
  const [cbtSearchQuery, setCbtSearchQuery] = useState<string>('');
  const [cbtRombelFilter, setCbtRombelFilter] = useState<string>('all');
  const [isSyncingAll, setIsSyncingAll] = useState<boolean>(false);

  // Filtered CBT results for teacher panel
  const filteredCbtResults = useMemo(() => {
    return cbtResultsList.filter(r => {
      const matchSearch =
        !cbtSearchQuery.trim() ||
        r.studentName.toLowerCase().includes(cbtSearchQuery.toLowerCase()) ||
        r.nis.toLowerCase().includes(cbtSearchQuery.toLowerCase());

      const matchRombel =
        cbtRombelFilter === 'all' ||
        (r.classGroup && (
          r.classGroup.toUpperCase().includes(`-${cbtRombelFilter.toUpperCase()}`) ||
          r.classGroup.toUpperCase().includes(`_${cbtRombelFilter.toUpperCase()}`) ||
          r.classGroup.toUpperCase().endsWith(` ${cbtRombelFilter.toUpperCase()}`)
        ));

      return matchSearch && matchRombel;
    });
  }, [cbtResultsList, cbtSearchQuery, cbtRombelFilter]);

  // Overall CBT Class Statistics
  const cbtStats = useMemo(() => {
    if (cbtResultsList.length === 0) {
      return { avg: 0, tuntas: 0, remedial: 0, highest: 0, lowest: 0 };
    }
    const avg = Math.round((cbtResultsList.reduce((acc, r) => acc + r.score, 0) / cbtResultsList.length) * 10) / 10;
    const tuntas = cbtResultsList.filter(r => r.score >= (config.kktpTarget ?? 75)).length;
    const remedial = cbtResultsList.length - tuntas;
    const highest = Math.max(...cbtResultsList.map(r => r.score));
    const lowest = Math.min(...cbtResultsList.map(r => r.score));
    return { avg, tuntas, remedial, highest, lowest };
  }, [cbtResultsList, config.kktpTarget]);

  // Timer countdown
  useEffect(() => {
    if (currentView !== 'student-exam' || isPaused) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam(true); // auto-submit on timeout
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentView, isPaused]);

  // Lock countdown timer for anti-cheat penalty
  useEffect(() => {
    if (!isLocked || lockCountdown <= 0) {
      if (isLocked && lockCountdown <= 0) {
        setIsLocked(false);
      }
      return;
    }
    const penaltyTimer = setInterval(() => {
      setLockCountdown(prev => {
        if (prev <= 1) {
          setIsLocked(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(penaltyTimer);
  }, [isLocked, lockCountdown]);

  // Anti-cheat window blur & tab switch listener
  useEffect(() => {
    if (currentView !== 'student-exam' || !config.antiCheatWarning || !config.detectTabSwitch) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setAntiCheatViolations(prev => {
          const newCount = prev + 1;
          const maxAllowed = config.maxTabSwitchAllowed ?? 2;

          if (newCount > maxAllowed) {
            if (config.tabSwitchAction === 'autosubmit') {
              setAutoSubmitReason(
                `Ujian dihentikan & dikumpulkan otomatis: Peserta terdeteksi berpindah tab/jendela sebanyak ${newCount} kali, melampaui batas toleransi maksimal (${maxAllowed}x).`
              );
              handleSubmitExam(true);
            } else if (config.tabSwitchAction === 'lock') {
              setIsLocked(true);
              setLockCountdown(20);
            } else {
              setShowAntiCheatAlert(true);
            }
          } else {
            setShowAntiCheatAlert(true);
          }
          return newCount;
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [currentView, config.antiCheatWarning, config.detectTabSwitch, config.maxTabSwitchAllowed, config.tabSwitchAction]);

  const currentQ = preparedQuestions[currentIndex];
  const totalQuestions = preparedQuestions.length;

  // Handlers
  const handleSelectStudentFromRoster = (studentId: string) => {
    const found = availableStudents.find(s => s.id === studentId);
    if (found) {
      setStudentIdentity({
        nis: found.nis || `24${found.id.slice(-2)}`,
        name: found.name,
        classGroup: found.classGroup || `${packageData.identity.grade}-A`
      });
    }
  };

  const handleStartExam = () => {
    if (!studentIdentity.name.trim()) {
      alert('Silakan masukkan nama peserta didik!');
      return;
    }
    if (config.requireToken && inputToken.trim().toUpperCase() !== config.token.trim().toUpperCase()) {
      setTokenError(`Token ujian tidak valid! Masukkan token: ${config.token}`);
      return;
    }

    setTokenError('');
    setTimeRemaining(config.durationMinutes * 60);
    setCurrentIndex(0);
    setAnswers({});
    setDoubtfuls([]);
    setAntiCheatViolations(0);
    setIsLocked(false);
    setLockCountdown(0);
    setAutoSubmitReason('');
    setCurrentView('student-exam');
  };

  const handleSelectAnswer = (qNumber: number, optionKey: string) => {
    setAnswers(prev => ({ ...prev, [qNumber]: optionKey }));
  };

  const handleToggleDoubtful = (qNumber: number) => {
    setDoubtfuls(prev =>
      prev.includes(qNumber) ? prev.filter(n => n !== qNumber) : [...prev, qNumber]
    );
  };

  const handleSubmitExam = (isAutoSubmit = false) => {
    // Check minimum duration requirement if not auto-submitted
    if (!isAutoSubmit && config.minimumDurationMinutes && config.minimumDurationMinutes > 0) {
      const timeSpentSeconds = config.durationMinutes * 60 - timeRemaining;
      const timeSpentMinutes = Math.floor(timeSpentSeconds / 60);
      if (timeSpentMinutes < config.minimumDurationMinutes) {
        setMinimumDurationAlert(
          `Waktu pengerjaan minimal adalah ${config.minimumDurationMinutes} menit. Anda baru mengerjakan selama ${timeSpentMinutes} menit. Silakan periksa kembali jawaban Anda dengan cermat.`
        );
        setShowConfirmSubmit(false);
        return;
      }
    }

    setShowConfirmSubmit(false);

    // Calculate score based on prepared questions
    let correct = 0;
    let wrong = 0;
    let unanswered = 0;
    let essay = 0;

    const bloomAnalysis: Record<string, { total: number; correct: number }> = {};
    const elementAnalysis: Record<string, { total: number; correct: number }> = {};

    preparedQuestions.forEach(q => {
      const bloom = q.bloomLevel || 'C3';
      const el = q.element || 'PAI';

      if (!bloomAnalysis[bloom]) bloomAnalysis[bloom] = { total: 0, correct: 0 };
      bloomAnalysis[bloom].total++;

      if (!elementAnalysis[el]) elementAnalysis[el] = { total: 0, correct: 0 };
      elementAnalysis[el].total++;

      if (q.questionType === 'Essay') {
        essay++;
      } else {
        const studentAns = answers[q.number];
        if (!studentAns) {
          unanswered++;
        } else if (studentAns === q.correctKey) {
          correct++;
          bloomAnalysis[bloom].correct++;
          elementAnalysis[el].correct++;
        } else {
          wrong++;
        }
      }
    });

    const mcTotal = totalQuestions - essay;
    const finalScore = mcTotal > 0 ? Math.round((correct / mcTotal) * 100) : 100;
    const timeSpent = config.durationMinutes * 60 - timeRemaining;

    const resultRecord: CbtStudentResult = {
      id: `cbt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      nis: studentIdentity.nis,
      studentName: studentIdentity.name,
      classGroup: studentIdentity.classGroup,
      examTitle: packageData.identity.title,
      grade: packageData.identity.grade,
      semester: packageData.identity.semester,
      element: packageData.materiMapping[0]?.element || 'PAIBP',
      score: finalScore,
      totalQuestions,
      correctCount: correct,
      wrongCount: wrong,
      unansweredCount: unanswered,
      essayCount: essay,
      answers,
      doubtfuls,
      timeSpentSeconds: timeSpent > 0 ? timeSpent : 60,
      submittedAt: new Date().toLocaleString('id-ID'),
      bloomAnalysis,
      elementAnalysis,
      syncedToGradebook: false
    };

    // 1. Simpan hasil CBT ke LocalStorage & Cloud Database Firestore
    saveCbtResult(resultRecord);

    // 2. Otomatis rekap dan sinkronkan nilai ke Buku Nilai Kelas jika siswa terdaftar
    const autoSynced = syncCbtScoreToStudentGradebook(
      resultRecord.studentName,
      resultRecord.nis,
      resultRecord.score,
      resultRecord.grade,
      resultRecord.semester,
      'sumatif'
    );
    if (autoSynced) {
      resultRecord.syncedToGradebook = true;
      saveCbtResult(resultRecord);
    }

    setCbtResultsList(loadCbtResults());
    setActiveResult(resultRecord);
    setCurrentView('student-result');

    // Confetti effect
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }
  };

  const handleSyncToGradebook = (result: CbtStudentResult) => {
    if (isDemo) {
      setSyncSuccessToast('Sinkronisasi nilai CBT ke Buku Nilai Cloud terkunci di Mode Demo. Masukkan Kode Aktivasi dari Owner!');
      if (onOpenActivation) onOpenActivation();
      return;
    }
    const success = syncCbtScoreToStudentGradebook(
      result.studentName,
      result.nis,
      result.score,
      result.grade,
      result.semester,
      'sumatif'
    );

    if (success) {
      result.syncedToGradebook = true;
      saveCbtResult(result);
      setCbtResultsList(loadCbtResults());
      setSyncSuccessToast(`Nilai ${result.studentName} (${result.score}) berhasil disinkronkan ke Buku Nilai (Sumatif) & Cloud Firestore!`);
      setTimeout(() => setSyncSuccessToast(''), 4000);
    } else {
      setSyncSuccessToast(`Nilai tersimpan di Cloud! Buka Buku Nilai untuk memuat nilai ${result.studentName}.`);
      setTimeout(() => setSyncSuccessToast(''), 4000);
    }
  };

  const handleSyncAllToGradebook = () => {
    setIsSyncingAll(true);
    let count = 0;
    cbtResultsList.forEach(r => {
      const ok = syncCbtScoreToStudentGradebook(
        r.studentName,
        r.nis,
        r.score,
        r.grade,
        r.semester,
        'sumatif'
      );
      if (ok) {
        count++;
        r.syncedToGradebook = true;
        saveCbtResult(r);
      }
    });
    setCbtResultsList(loadCbtResults());
    setIsSyncingAll(false);
    setSyncSuccessToast(`Rekap Selesai! ${count} nilai CBT berhasil terekap ke Buku Nilai Kelas & Cloud Firestore.`);
    setTimeout(() => setSyncSuccessToast(''), 4500);
  };

  const handleRefreshFromCloud = async () => {
    setIsSyncingAll(true);
    try {
      const cloudResults = await loadCbtResultsFromDatabase();
      if (cloudResults && cloudResults.length > 0) {
        setCbtResultsList(prev => {
          const map = new Map();
          [...cloudResults, ...prev].forEach(r => map.set(r.id, r));
          return Array.from(map.values());
        });
        setSyncSuccessToast(`Sinkronisasi Cloud Berhasil: ${cloudResults.length} data hasil CBT dimuat dari Cloud Firestore.`);
      } else {
        setSyncSuccessToast('Database Cloud Firestore telah diperiksa (terkini).');
      }
    } catch (e) {
      setSyncSuccessToast('Hasil CBT tersimpan aman di database.');
    } finally {
      setIsSyncingAll(false);
      setTimeout(() => setSyncSuccessToast(''), 4000);
    }
  };

  const handleDeleteHistory = (id: string) => {
    if (window.confirm('Hapus riwayat nilai ujian siswa ini dari penyimpanan lokal dan Cloud Firestore?')) {
      deleteCbtResult(id);
      setCbtResultsList(loadCbtResults());
    }
  };

  // Helper formatting time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Answered count & doubtful count
  const answeredCount = Object.keys(answers).length;
  const doubtfulCount = doubtfuls.length;
  const unansweredCount = totalQuestions - answeredCount;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[96vh] overflow-hidden">
        
        {/* TOP MODAL HEADER & MODE SWITCHER */}
        <div className="bg-slate-950 px-4 sm:px-6 py-3.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-900/30">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base text-white tracking-tight">
                  UJIAN CBT LANGSUNG (Computer-Based Test)
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase">
                  PAIBP Fase D
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate max-w-md">
                {packageData.identity.title} • Kelas {packageData.identity.grade} • {totalQuestions} Butir Soal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenShareCbt && (
              <button
                type="button"
                onClick={() => {
                  if (isDemo && onOpenActivation) {
                    setBankImportToast('Membagikan link CBT online ke siswa terkunci di Mode Demo. Masukkan Kode Aktivasi dari Owner!');
                    onOpenActivation();
                    return;
                  }
                  onOpenShareCbt();
                }}
                className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer ${
                  isDemo
                    ? 'bg-amber-600 hover:bg-amber-500 text-white border-amber-400/50'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400/50'
                }`}
                title={isDemo ? 'Perlu Kode Aktivasi dari Owner untuk membagikan link ke siswa' : 'Bagikan link ujian CBT ke siswa via WhatsApp / Tautan online valid'}
              >
                {isDemo ? <Lock className="w-3.5 h-3.5 text-amber-200" /> : <Share2 className="w-3.5 h-3.5 text-emerald-200" />}
                <span>{isDemo ? 'Bagikan Link (Perlu Aktivasi)' : 'Bagikan Link Siswa'}</span>
              </button>
            )}

            {/* Bank Soal Integration Button */}
            <button
              type="button"
              onClick={() => setShowBankPickerModal(true)}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg border border-amber-400/50 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
              title="Integrasi Bank Soal: Ambil & gabungkan butir soal dari Bank Soal ke dalam ujian CBT"
            >
              <Database className="w-3.5 h-3.5 text-amber-200" />
              <span className="hidden sm:inline">Bank Soal</span>
              <span className="sm:hidden">Bank</span>
              <span className="bg-amber-950/90 text-amber-200 text-[10px] px-1.5 py-0.2 rounded border border-amber-500/40 font-mono">
                + Ambil
              </span>
            </button>

            {/* Direct CBT Settings Button */}
            <button
              type="button"
              onClick={() => setShowSettingsModal(true)}
              className="px-3 py-1.5 bg-linear-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white rounded-lg border border-purple-400/40 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-purple-950/50 cursor-pointer"
              title="Buka Pengaturan CBT: Pemilihan Soal Tema/TP, Anti-Buka Tab, Waktu Pengerjaan, Token, dll"
            >
              <Sliders className="w-3.5 h-3.5 text-purple-200" />
              <span className="hidden sm:inline">Pengaturan CBT</span>
              <span className="sm:hidden">Atur</span>
              <span className="bg-purple-950/90 text-purple-200 text-[10px] px-1.5 py-0.2 rounded border border-purple-500/40 font-mono">
                {totalQuestions} Soal
              </span>
            </button>

            {/* View Switchers */}
            <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setCurrentView('student-gate')}
                className={`px-3 py-1 rounded-md font-semibold transition-all flex items-center gap-1.5 ${
                  currentView === 'student-gate' || currentView === 'student-exam' || currentView === 'student-result'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Laptop className="w-3.5 h-3.5" />
                <span>Ruang Ujian Siswa</span>
              </button>
              <button
                onClick={() => setCurrentView('teacher-panel')}
                className={`px-3 py-1 rounded-md font-semibold transition-all flex items-center gap-1.5 ${
                  currentView === 'teacher-panel'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Panel Pengawas & Rekap ({cbtResultsList.length})</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Tutup Modal CBT"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* NOTIFICATION TOAST */}
        {syncSuccessToast && (
          <div className="bg-emerald-500/20 border-b border-emerald-500/30 text-emerald-300 px-4 py-2 text-xs flex items-center justify-between animate-fadeIn">
            <span className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              {syncSuccessToast}
            </span>
            <button onClick={() => setSyncSuccessToast('')} className="text-emerald-400 hover:text-white">✕</button>
          </div>
        )}

        {/* BANK SOAL IMPORT TOAST */}
        {bankImportToast && (
          <div className="bg-amber-500/20 border-b border-amber-500/30 text-amber-300 px-4 py-2 text-xs flex items-center justify-between animate-fadeIn">
            <span className="flex items-center gap-2 font-medium">
              <Sparkles className="w-4 h-4 text-amber-400" />
              {bankImportToast}
            </span>
            <button onClick={() => setBankImportToast('')} className="text-amber-400 hover:text-white">✕</button>
          </div>
        )}

        {/* VIEW 1: STUDENT EXAM GATE / LOGIN */}
        {currentView === 'student-gate' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
            <div className="max-w-2xl mx-auto space-y-6">
              
              {/* Exam Info Card */}
              <div className="bg-linear-to-r from-purple-950/40 via-indigo-950/40 to-slate-900 border border-purple-500/30 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                  <Laptop className="w-36 h-36" />
                </div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-400/30">
                    Sesi Ujian Aktif
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-500/20 text-sky-300 border border-sky-400/30">
                    Durasi: {config.durationMinutes} Menit
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    {totalQuestions} Butir Soal ({config.questionSelectionMode === 'all' ? 'Semua' : config.questionSelectionMode === 'topic' ? `Tema: ${config.selectedTopicFilter}` : config.questionSelectionMode === 'tp' ? 'Per TP' : 'Pilihan Khusus'})
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                    config.detectTabSwitch
                      ? 'bg-rose-500/20 text-rose-300 border-rose-400/30'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    Anti-Curang: {config.detectTabSwitch ? `Aktif (${config.maxTabSwitchAllowed ?? 2}x toleransi)` : 'Nonaktif'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                    KKTP: {config.kktpTarget ?? 75}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white mb-1">
                  {packageData.identity.title}
                </h2>
                <p className="text-xs text-slate-300">
                  {packageData.identity.schoolName} • Guru: {packageData.identity.teacherName} • Semester {packageData.identity.semester}
                </p>

                {/* Quick Configure Button for Teachers on Gate */}
                <div className="mt-3.5 pt-3 border-t border-purple-500/20 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] text-purple-300">
                    Pengajar dapat mengubah butir soal (Tema/TP), batas buka tab, durasi pengerjaan, dan token kapan saja:
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowSettingsModal(true)}
                    className="px-3 py-1.5 bg-purple-900/80 hover:bg-purple-800 text-purple-200 hover:text-white border border-purple-500/40 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  >
                    <Sliders className="w-3.5 h-3.5 text-purple-300" />
                    <span>Ubah Pengaturan Ujian</span>
                  </button>
                </div>
              </div>

              {/* Student Identity Form */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="font-bold text-sm text-white flex items-center gap-2">
                      <Users className="w-4 h-4 text-purple-400" />
                      Identitas Peserta Ujian
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Pilih dari daftar siswa atau ketik identitas peserta Anda
                    </p>
                  </div>
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-1 rounded font-mono">
                    Token: {config.token}
                  </span>
                </div>

                {/* Quick Select from Roster */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Pilih Cepat dari Roster Kelas {packageData.identity.grade}:
                  </label>
                  <select
                    onChange={(e) => handleSelectStudentFromRoster(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-hidden focus:border-purple-500"
                  >
                    <option value="">-- Pilih Nama Siswa Terdaftar --</option>
                    {availableStudents.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.nis || s.nisn}) • {s.classGroup || `${packageData.identity.grade}-A`}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      NIS (Nomor Induk Siswa):
                    </label>
                    <input
                      type="text"
                      value={studentIdentity.nis}
                      onChange={(e) => setStudentIdentity({ ...studentIdentity, nis: e.target.value })}
                      placeholder="Contoh: 24001"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white font-mono focus:outline-hidden focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Kelas:
                    </label>
                    <input
                      type="text"
                      value={studentIdentity.classGroup}
                      onChange={(e) => setStudentIdentity({ ...studentIdentity, classGroup: e.target.value })}
                      placeholder="Contoh: VII-A / VIII-B"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-hidden focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Token Ujian:
                    </label>
                    <input
                      type="text"
                      value={inputToken}
                      onChange={(e) => setInputToken(e.target.value.toUpperCase())}
                      placeholder="Ketik token..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-purple-300 font-mono font-bold tracking-wider uppercase focus:outline-hidden focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nama Lengkap Peserta:
                  </label>
                  <input
                    type="text"
                    value={studentIdentity.name}
                    onChange={(e) => setStudentIdentity({ ...studentIdentity, name: e.target.value })}
                    placeholder="Nama Lengkap Siswa"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white font-medium focus:outline-hidden focus:border-purple-500"
                  />
                </div>

                {tokenError && (
                  <div className="bg-rose-500/20 border border-rose-500/30 text-rose-300 p-2.5 rounded-lg text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{tokenError}</span>
                  </div>
                )}

                {/* Instructions */}
                <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1.5">
                  <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                    Tata Tertib & Petunjuk Ujian CBT PAIBP:
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px] leading-relaxed">
                    <li>Waktu pengerjaan adalah <strong className="text-white">{config.durationMinutes} menit</strong> dan berjalan otomatis setelah tombol Mulai ditekan.</li>
                    <li>Gunakan tombol <strong className="text-amber-400">Ragu-Ragu</strong> jika Anda belum yakin dengan jawaban yang dipilih.</li>
                    <li>Jawaban Anda otomatis tersimpan. Anda dapat melompat ke nomor soal mana pun melalui menu Daftar Soal.</li>
                    <li>Kerjakan dengan jujur, mandiri, dan cermat demi menguji penalaran nilai-nilai Islam.</li>
                  </ul>
                </div>

                {/* Submit button */}
                <button
                  onClick={handleStartExam}
                  className="w-full py-3.5 bg-linear-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-purple-900/40 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>MULAI KERJAKAN UJIAN CBT SEKARANG</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>
        )}

        {/* VIEW 2: ACTIVE STUDENT CBT EXAM WORKSPACE */}
        {currentView === 'student-exam' && currentQ && (
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-950">
            
            {/* ANBK-STYLE OFFICIAL CBT TOP BAR */}
            <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
              {/* Student Identity Badge */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-xs uppercase shadow-xs">
                  {studentIdentity.name.charAt(0) || 'S'}
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <span>{studentIdentity.name}</span>
                    <span className="text-[10px] text-purple-300 font-mono bg-purple-950/80 px-1.5 py-0.5 rounded border border-purple-800/40">
                      NIS: {studentIdentity.nis}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    Kelas {studentIdentity.classGroup} • PAI & Budi Pekerti
                  </span>
                </div>
              </div>

              {/* Middle: Realtime Countdown Timer */}
              <div className="flex items-center space-x-2">
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono font-bold text-xs sm:text-sm ${
                    timeRemaining <= 300
                      ? 'bg-rose-950/80 border-rose-500 text-rose-300 animate-pulse'
                      : timeRemaining <= 900
                      ? 'bg-amber-950/80 border-amber-500 text-amber-300'
                      : 'bg-slate-800/90 border-slate-700 text-emerald-400'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  <span>Sisa Waktu: {formatTime(timeRemaining)}</span>
                </div>
              </div>

              {/* Right: Controls & Navigation Drawer Toggle */}
              <div className="flex items-center space-x-2">
                {/* Font Size Selector */}
                <div className="hidden sm:flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700 text-xs">
                  <button
                    onClick={() => setFontSize('normal')}
                    className={`px-2 py-1 rounded text-[11px] font-bold ${fontSize === 'normal' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    title="Ukuran Font Normal"
                  >
                    A
                  </button>
                  <button
                    onClick={() => setFontSize('large')}
                    className={`px-2 py-1 rounded text-[11px] font-bold ${fontSize === 'large' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    title="Ukuran Font Besar"
                  >
                    A+
                  </button>
                  <button
                    onClick={() => setFontSize('xlarge')}
                    className={`px-2 py-1 rounded text-[11px] font-bold ${fontSize === 'xlarge' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    title="Ukuran Font Sangat Besar"
                  >
                    A++
                  </button>
                </div>

                {/* Question Grid Drawer Button */}
                <button
                  onClick={() => setShowQuestionDrawer(!showQuestionDrawer)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <span>Daftar Soal ({answeredCount}/{totalQuestions})</span>
                </button>
              </div>
            </div>

            {/* MAIN EXAM BODY (Split: Question View + Optional Drawer) */}
            <div className="flex-1 flex overflow-hidden relative">
              
              {/* Question Workspace */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                
                {/* Question Meta Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="bg-purple-600 text-white font-black px-2.5 py-0.5 rounded text-xs">
                      SOAL NO. {currentIndex + 1}
                    </span>
                    <span className="text-slate-400">dari {totalQuestions} Soal</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      {currentQ.questionType === 'Essay' ? 'Uraian / Essay' : 'Pilihan Ganda'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-950/80 text-sky-300 border border-sky-800/40">
                      {currentQ.bloomLevel} — {currentQ.soloLevel}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-800/40">
                      Elemen: {currentQ.element}
                    </span>
                  </div>
                </div>

                {/* Stimulus Box (if any) */}
                {currentQ.stimulus && (
                  <div className="bg-slate-900/90 border-l-4 border-purple-500 p-4 rounded-r-xl shadow-xs text-slate-200">
                    <div className="text-[10px] uppercase font-bold text-purple-400 mb-1 tracking-wider">
                      Stimulus / Teks / Studi Kasus:
                    </div>
                    <div
                      className={`leading-relaxed italic ${
                        fontSize === 'xlarge' ? 'text-base sm:text-lg' : fontSize === 'large' ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'
                      }`}
                    >
                      {currentQ.stimulus}
                    </div>
                  </div>
                )}

                {/* Question Stem */}
                <div className="bg-slate-900 p-4 sm:p-5 rounded-xl border border-slate-800 shadow-xs">
                  <p
                    className={`font-semibold text-white leading-relaxed ${
                      fontSize === 'xlarge' ? 'text-lg sm:text-xl' : fontSize === 'large' ? 'text-base sm:text-lg' : 'text-sm sm:text-base'
                    }`}
                  >
                    {currentQ.questionText}
                  </p>
                </div>

                {/* Options (MC) or Essay Box */}
                {currentQ.questionType === 'Essay' ? (
                  <div className="bg-slate-900 p-4 rounded-xl border border-purple-500/40 space-y-3">
                    <div className="flex items-center justify-between text-xs text-purple-300">
                      <span className="font-bold">Lembar Jawaban Uraian Siswa:</span>
                      <span className="text-[10px] text-slate-400">
                        {(answers[currentQ.number] || '').trim().split(/\s+/).filter(Boolean).length} Kata
                      </span>
                    </div>
                    <textarea
                      rows={6}
                      value={answers[currentQ.number] || ''}
                      onChange={(e) => handleSelectAnswer(currentQ.number, e.target.value)}
                      placeholder="Tuliskan jawaban argumentatif, dasar hukum Islam, dan solusi Anda di sini secara lengkap..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-white text-xs sm:text-sm leading-relaxed focus:outline-hidden focus:border-purple-500 placeholder-slate-600"
                    />
                    <p className="text-[11px] text-slate-400 italic">
                      Jawaban uraian akan tersimpan otomatis dan dinilai guru pada buku penilaian.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {(currentQ.options || []).map(opt => {
                      const isSelected = answers[currentQ.number] === opt.key;
                      return (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() => handleSelectAnswer(currentQ.number, opt.key)}
                          className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all flex items-start space-x-3.5 cursor-pointer ${
                            isSelected
                              ? 'bg-purple-950/60 border-purple-500 text-white shadow-md shadow-purple-950/50'
                              : 'bg-slate-900/80 border-slate-800 hover:bg-slate-850 hover:border-slate-700 text-slate-300'
                          }`}
                        >
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                              isSelected
                                ? 'bg-purple-600 text-white'
                                : 'bg-slate-800 text-slate-400 border border-slate-700'
                            }`}
                          >
                            {opt.key}
                          </div>
                          <div
                            className={`leading-relaxed ${
                              fontSize === 'xlarge' ? 'text-base sm:text-lg' : fontSize === 'large' ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'
                            }`}
                          >
                            {opt.text}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* DRAWER / SIDEBAR: QUESTION GRID 1..N */}
              {showQuestionDrawer && (
                <div className="w-72 sm:w-80 bg-slate-900 border-l border-slate-800 p-4 flex flex-col shrink-0 shadow-2xl z-20">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                    <h4 className="font-bold text-xs text-white uppercase tracking-wider">
                      Daftar Nomor Soal
                    </h4>
                    <button
                      onClick={() => setShowQuestionDrawer(false)}
                      className="text-slate-400 hover:text-white p-1 rounded-md text-xs"
                    >
                      ✕ Tutup
                    </button>
                  </div>

                  {/* Summary Status Badges */}
                  <div className="grid grid-cols-3 gap-2 mb-4 text-[10px] text-center font-bold">
                    <div className="bg-emerald-950/60 text-emerald-300 border border-emerald-800/50 rounded-lg p-1.5">
                      <span className="block text-sm font-black">{answeredCount}</span>
                      Terjawab
                    </div>
                    <div className="bg-amber-950/60 text-amber-300 border border-amber-800/50 rounded-lg p-1.5">
                      <span className="block text-sm font-black">{doubtfulCount}</span>
                      Ragu-ragu
                    </div>
                    <div className="bg-slate-800/80 text-slate-300 border border-slate-700 rounded-lg p-1.5">
                      <span className="block text-sm font-black">{unansweredCount}</span>
                      Belum
                    </div>
                  </div>

                  {/* Number Grid */}
                  <div className="flex-1 overflow-y-auto grid grid-cols-5 gap-2 pr-1 content-start">
                    {preparedQuestions.map((q, idx) => {
                      const isAnswered = !!answers[q.number];
                      const isDoubtful = doubtfuls.includes(q.number);
                      const isCurrent = idx === currentIndex;

                      let btnStyle = 'bg-slate-800 border-slate-700 text-slate-300';
                      if (isCurrent) {
                        btnStyle = 'ring-2 ring-purple-400 text-white font-bold';
                      }
                      if (isDoubtful) {
                        btnStyle += ' bg-amber-600 text-white border-amber-500 font-bold';
                      } else if (isAnswered) {
                        btnStyle += ' bg-emerald-600 text-white border-emerald-500 font-bold';
                      }

                      return (
                        <button
                          key={q.number}
                          onClick={() => {
                            setCurrentIndex(idx);
                            setShowQuestionDrawer(false);
                          }}
                          className={`h-10 rounded-lg border text-xs flex flex-col items-center justify-center relative transition-all ${btnStyle}`}
                        >
                          <span>{idx + 1}</span>
                          {isAnswered && (
                            <span className="text-[9px] uppercase font-mono leading-none opacity-80">
                              {answers[q.number]}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* CBT BOTTOM ACTION BAR */}
            <div className="bg-slate-900 border-t border-slate-800 px-4 py-3 flex items-center justify-between gap-2 shrink-0">
              {/* Prev Button */}
              <button
                type="button"
                onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="px-3.5 sm:px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Soal</span> Sebelumnya
              </button>

              {/* Middle: Toggle Ragu-Ragu */}
              <button
                type="button"
                onClick={() => handleToggleDoubtful(currentQ.number)}
                className={`px-3 sm:px-4 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  doubtfuls.includes(currentQ.number)
                    ? 'bg-amber-600 text-white border-amber-500 shadow-xs'
                    : 'bg-amber-950/40 text-amber-300 border-amber-600/40 hover:bg-amber-950/60'
                }`}
              >
                <AlertCircle className="w-4 h-4" />
                <span>{doubtfuls.includes(currentQ.number) ? 'Hapus Ragu-Ragu' : 'Tandai Ragu-Ragu'}</span>
              </button>

              {/* Next / Finish Button */}
              {currentIndex < totalQuestions - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentIndex(prev => Math.min(totalQuestions - 1, prev + 1))}
                  className="px-4 sm:px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-purple-900/30 transition-all cursor-pointer"
                >
                  <span className="hidden sm:inline">Soal</span> Berikutnya
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowConfirmSubmit(true)}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-900/30 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Selesaikan Ujian</span>
                </button>
              )}
            </div>

            {/* CONFIRMATION SUBMIT MODAL */}
            {showConfirmSubmit && (
              <div className="fixed inset-0 z-60 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl">
                  <div className="w-12 h-12 rounded-full bg-purple-500/20 text-purple-400 mx-auto flex items-center justify-center border border-purple-500/30">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      Konfirmasi Pengumpulan Ujian CBT
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Apakah Anda yakin ingin mengakhiri sesi ujian ini sekarang?
                    </p>
                  </div>

                  {/* Summary Counts */}
                  <div className="grid grid-cols-3 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                    <div>
                      <span className="text-emerald-400 font-bold block text-sm">{answeredCount}</span>
                      <span className="text-[10px] text-slate-400">Terjawab</span>
                    </div>
                    <div>
                      <span className="text-amber-400 font-bold block text-sm">{doubtfulCount}</span>
                      <span className="text-[10px] text-slate-400">Ragu-ragu</span>
                    </div>
                    <div>
                      <span className="text-rose-400 font-bold block text-sm">{unansweredCount}</span>
                      <span className="text-[10px] text-slate-400">Belum Terjawab</span>
                    </div>
                  </div>

                  {(doubtfulCount > 0 || unansweredCount > 0) && (
                    <div className="bg-amber-950/40 border border-amber-600/40 text-amber-300 p-2.5 rounded-lg text-xs text-left flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>
                        Peringatan: Masih terdapat {unansweredCount} butir belum dijawab dan {doubtfulCount} butir ragu-ragu.
                      </span>
                    </div>
                  )}

                  <div className="flex gap-2.5 pt-2">
                    <button
                      onClick={() => setShowConfirmSubmit(false)}
                      className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
                    >
                      Periksa Kembali
                    </button>
                    <button
                      onClick={() => handleSubmitExam(false)}
                      className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md"
                    >
                      Ya, Kumpulkan Sekarang
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ANTI-CHEAT ALERT DIALOG */}
            {showAntiCheatAlert && (
              <div className="fixed inset-0 z-70 bg-black/80 flex items-center justify-center p-4">
                <div className="bg-slate-900 border border-rose-500/50 rounded-2xl max-w-sm w-full p-5 text-center space-y-3 shadow-2xl">
                  <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center border border-rose-500/40">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">
                      Peringatan Kejujuran Ujian!
                    </h4>
                    <p className="text-xs text-rose-300 mt-1">
                      Terdeteksi perpindahan tab atau jendela ujian (Pelanggaran #{antiCheatViolations}). Tetaplah berada di halaman CBT ini hingga selesai.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAntiCheatAlert(false)}
                    className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl"
                  >
                    Saya Mengerti & Kembali Mengerjakan
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

        {/* VIEW 3: COMPLETED RESULT SCREEN */}
        {currentView === 'student-result' && activeResult && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            <div className="max-w-2xl mx-auto space-y-6 text-center">
              
              {/* Score Header Banner */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                <div className="w-16 h-16 rounded-2xl bg-purple-500/20 text-purple-400 mx-auto flex items-center justify-center border border-purple-500/30 mb-3">
                  <Award className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-white">
                  Ujian CBT Selesai Diserahkan!
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Peserta: <strong className="text-white">{activeResult.studentName}</strong> (NIS: {activeResult.nis}) • Kelas {activeResult.classGroup}
                </p>

                {/* Cloud Database & Gradebook Status Confirmation */}
                <div className="my-3 py-2 px-3.5 bg-emerald-950/60 border border-emerald-500/30 rounded-xl flex flex-wrap items-center justify-center gap-2 text-xs text-emerald-200">
                  <Database className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    Hasil ujian CBT telah <strong>terekap dan tersimpan permanen</strong> di Cloud Firestore!
                  </span>
                  {activeResult.syncedToGradebook ? (
                    <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/40">
                      ✓ Otomatis Masuk Buku Nilai
                    </span>
                  ) : (
                    <span className="bg-sky-500/20 text-sky-300 text-[10px] font-bold px-2 py-0.5 rounded border border-sky-500/40">
                      Siap Disinkronkan
                    </span>
                  )}
                </div>

                {/* Score Number Display */}
                {config.showInstantScore ? (
                  <div className="my-5 py-4 bg-slate-950 rounded-2xl border border-slate-800 max-w-xs mx-auto">
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold block">
                      Skor Akhir Capaian CBT
                    </span>
                    <span className="text-5xl font-black text-purple-400 block mt-1">
                      {activeResult.score}
                    </span>
                    <div className="mt-2">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                          activeResult.score >= 85
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : activeResult.score >= 75
                            ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                            : activeResult.score >= 65
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {activeResult.score >= 85
                          ? 'Sangat Mahir'
                          : activeResult.score >= 75
                          ? 'Mahir (Tuntas KKTP)'
                          : activeResult.score >= 65
                          ? 'Cakap (Cukup)'
                          : 'Perlu Bimbingan (Remedial)'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="my-4 py-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400">
                    Jawaban Anda telah tersimpan. Pengumuman nilai diatur oleh Guru Pengampu.
                  </div>
                )}

                {/* Detail Stats Grid */}
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Benar</span>
                    <span className="text-base font-bold text-emerald-400">{activeResult.correctCount}</span>
                  </div>
                  <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Salah</span>
                    <span className="text-base font-bold text-rose-400">{activeResult.wrongCount}</span>
                  </div>
                  <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Kosong</span>
                    <span className="text-base font-bold text-slate-400">{activeResult.unansweredCount}</span>
                  </div>
                  <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Durasi</span>
                    <span className="text-base font-bold text-purple-300">
                      {Math.floor(activeResult.timeSpentSeconds / 60)}m {activeResult.timeSpentSeconds % 60}s
                    </span>
                  </div>
                </div>

                {/* Action Buttons: Sync to Gradebook & Print Certificate */}
                <div className="flex flex-wrap items-center justify-center gap-2.5 mt-5 pt-4 border-t border-slate-800">
                  <button
                    onClick={() => handleSyncToGradebook(activeResult)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors"
                  >
                    <FileCheck className="w-4 h-4" />
                    <span>Simpan ke Buku Nilai Kelas</span>
                  </button>

                  <button
                    onClick={() => printCbtStudentCertificate(activeResult, packageData.identity.schoolName, packageData.identity.teacherName)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Cetak Kartu Hasil CBT</span>
                  </button>

                  {config.showReview && (
                    <button
                      onClick={() => setShowReviewInResult(!showReviewInResult)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span>{showReviewInResult ? 'Tutup Pembahasan' : 'Lihat Pembahasan & Kunci'}</span>
                    </button>
                  )}

                  <button
                    onClick={() => setCurrentView('student-gate')}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Ujian Siswa Baru</span>
                  </button>
                </div>
              </div>

              {/* REVIEW & EXPLANATION ACCORDION */}
              {showReviewInResult && (
                <div className="text-left space-y-3 bg-slate-900 p-5 rounded-2xl border border-slate-800">
                  <h4 className="font-bold text-xs uppercase text-slate-300 tracking-wider flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-purple-400" />
                    Pembahasan Pedagogik & Telaah Butir Soal:
                  </h4>
                  {packageData.questions.map((q) => {
                    const studentAns = activeResult.answers[q.number];
                    const isCorrect = studentAns === q.correctKey;
                    const isEssay = q.questionType === 'Essay';

                    return (
                      <div
                        key={q.number}
                        className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white">
                            Soal No. {q.number} ({isEssay ? 'Uraian' : 'PG'} • {q.bloomLevel})
                          </span>
                          {isEssay ? (
                            <span className="px-2 py-0.5 rounded text-[10px] bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                              Uraian Siap Dinilai Guru
                            </span>
                          ) : (
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                isCorrect
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              }`}
                            >
                              {isCorrect ? 'Jawaban Benar ✓' : `Keliru (Kunci: ${q.correctKey}) ✗`}
                            </span>
                          )}
                        </div>

                        <p className="text-slate-300">{q.questionText}</p>

                        {!isEssay && (
                          <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-[11px] text-slate-300">
                            <div><strong className="text-purple-300">Jawaban Siswa:</strong> {studentAns || '(Tidak dijawab)'}</div>
                            <div><strong className="text-emerald-300">Kunci Jawaban:</strong> {q.correctKey}</div>
                            <div className="mt-1 text-slate-400"><strong className="text-slate-200">Alasan Ilmiah:</strong> {q.explanation}</div>
                          </div>
                        )}

                        {isEssay && (
                          <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-[11px] text-slate-300 space-y-1">
                            <div><strong className="text-purple-300">Jawaban Siswa:</strong> {studentAns || '(Kosong)'}</div>
                            <div className="text-purple-200"><strong className="text-white">Model Jawaban Guru:</strong> {q.modelAnswer || q.explanation}</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          </div>
        )}

        {/* VIEW 4: TEACHER PROCTOR & LIVE CBT SCOREBOARD */}
        {currentView === 'teacher-panel' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            
            {/* Exam Config Setting Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-purple-400" />
                    Pengaturan Sesi Ujian CBT Aktif
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Konfigurasi butir soal (Tema/TP), toleransi buka tab, waktu pengerjaan, dan integritas ujian
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowBankPickerModal(true)}
                    className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer w-fit"
                    title="Ambil soal tambahan dari Bank Soal untuk ujian ini"
                  >
                    <Database className="w-3.5 h-3.5" />
                    <span>Ambil dari Bank Soal</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSettingsModal(true)}
                    className="px-4 py-2 bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer w-fit"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Buka Pengaturan CBT Terperinci</span>
                  </button>
                </div>
              </div>

              {/* Status Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block mb-0.5">Mode Pemilihan Soal</span>
                  <span className="font-bold text-purple-300 block truncate">
                    {config.questionSelectionMode === 'all'
                      ? 'Semua Butir'
                      : config.questionSelectionMode === 'topic'
                      ? `Tema: ${config.selectedTopicFilter}`
                      : config.questionSelectionMode === 'tp'
                      ? 'Filter TP'
                      : 'Pilihan Khusus'}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    {totalQuestions} Butir Soal Diujikan
                  </span>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block mb-0.5">Proteksi Buka Tab Lain</span>
                  <span className={`font-bold block ${config.detectTabSwitch ? 'text-rose-400' : 'text-slate-500'}`}>
                    {config.detectTabSwitch ? `Aktif (${config.maxTabSwitchAllowed ?? 2}x toleransi)` : 'Nonaktif'}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Aksi: {config.tabSwitchAction === 'autosubmit' ? 'Submit Otomatis' : config.tabSwitchAction === 'lock' ? 'Kunci Layar' : 'Peringatan'}
                  </span>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block mb-0.5">Waktu Pengerjaan</span>
                  <span className="font-bold text-sky-300 block">
                    {config.durationMinutes} Menit
                  </span>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Min Submit: {config.minimumDurationMinutes ?? 5} Menit
                  </span>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block mb-0.5">Token & Pengacakan</span>
                  <span className="font-mono font-bold text-amber-300 block">
                    {config.requireToken ? config.token : 'Bebas Akses'}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Acak Soal: {config.shuffleQuestions ? 'Ya' : 'Tidak'} • Opsi: {config.shuffleOptions ? 'Ya' : 'Tidak'}
                  </span>
                </div>
              </div>
            </div>

            {/* Results Table & Export Toolbar */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3 flex items-center justify-between text-xs text-emerald-200">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-400" />
                  <span><strong>Cloud Database Firestore Terhubung:</strong> Seluruh nilai dan hasil ujian CBT siswa tersimpan permanen di cloud dan tidak akan hilang.</span>
                </div>
                <span className="text-[10px] font-bold bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded text-emerald-300">
                  {cbtResultsList.length} Hasil Tersimpan
                </span>
              </div>

              {/* Scoreboard Statistics */}
              {cbtResultsList.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block mb-0.5">Total Peserta Selesai</span>
                    <span className="text-lg font-black text-white">{cbtResultsList.length}</span>
                    <span className="text-[10px] text-slate-500 block">Siswa</span>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block mb-0.5">Rata-Rata Nilai CBT</span>
                    <span className={`text-lg font-black ${cbtStats.avg >= (config.kktpTarget ?? 75) ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {cbtStats.avg}
                    </span>
                    <span className="text-[10px] text-slate-500 block">Target: {config.kktpTarget ?? 75}</span>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-emerald-400 block mb-0.5">Tuntas KKTP</span>
                    <span className="text-lg font-black text-emerald-400">{cbtStats.tuntas}</span>
                    <span className="text-[10px] text-emerald-500/80 block">
                      {Math.round((cbtStats.tuntas / cbtResultsList.length) * 100)}% Kelas
                    </span>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-rose-400 block mb-0.5">Perlu Remedial</span>
                    <span className="text-lg font-black text-rose-400">{cbtStats.remedial}</span>
                    <span className="text-[10px] text-rose-500/80 block">
                      {Math.round((cbtStats.remedial / cbtResultsList.length) * 100)}% Kelas
                    </span>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block mb-0.5">Tertinggi / Terendah</span>
                    <div className="flex items-center gap-1.5 text-sm font-black mt-0.5">
                      <span className="text-emerald-400">{cbtStats.highest}</span>
                      <span className="text-slate-500">/</span>
                      <span className="text-rose-400">{cbtStats.lowest}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block">Rentang Skor</span>
                  </div>
                </div>
              )}

              {/* Table Header & Action Toolbar */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <Award className="w-4 h-4 text-purple-400" />
                    Rekapitulasi Nilai & Hasil Ujian CBT Siswa ({filteredCbtResults.length})
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Data terekap real-time, sinkron dengan Cloud Firestore & Buku Nilai Kurikulum Merdeka
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSyncAllToGradebook}
                    disabled={isSyncingAll || cbtResultsList.length === 0}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-40 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    title="Rekap dan masukkan seluruh nilai CBT siswa ke Buku Nilai Kelas (Sumatif)"
                  >
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>{isSyncingAll ? 'Menyinkronkan...' : 'Sinkronkan Semua ke Buku Nilai'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRefreshFromCloud}
                    disabled={isSyncingAll}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Perbarui data terbaru dari Cloud Database Firestore"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncingAll ? 'animate-spin' : ''}`} />
                    <span className="hidden sm:inline">Perbarui Cloud</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => exportCbtResultsToCsv(filteredCbtResults)}
                    disabled={filteredCbtResults.length === 0}
                    className="px-3 py-1.5 bg-purple-700 hover:bg-purple-600 disabled:opacity-40 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    title="Unduh seluruh rekap nilai CBT ke spreadsheet Excel/CSV"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Ekspor Excel</span>
                  </button>

                  {onOpenGrading && (
                    <button
                      type="button"
                      onClick={onOpenGrading}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                      title="Buka Buku Penilaian Lengkap 3 Ranah (Kognitif, Afektif, Psikomotorik)"
                    >
                      <FileCheck className="w-3.5 h-3.5" />
                      <span>Buku Nilai</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Filter & Search Bar */}
              <div className="flex flex-wrap items-center gap-2.5 bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs">
                <div className="relative flex-1 min-w-[180px]">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={cbtSearchQuery}
                    onChange={(e) => setCbtSearchQuery(e.target.value)}
                    placeholder="Cari nama peserta atau NIS..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-purple-500"
                  />
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-slate-400 font-semibold text-[11px]">Filter Rombel:</span>
                  <select
                    value={cbtRombelFilter}
                    onChange={(e) => setCbtRombelFilter(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-hidden focus:border-purple-500"
                  >
                    <option value="all">Semua Rombel (A, B, C, D)</option>
                    <option value="A">Rombel A</option>
                    <option value="B">Rombel B</option>
                    <option value="C">Rombel C</option>
                    <option value="D">Rombel D</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              {filteredCbtResults.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500">
                  {cbtResultsList.length === 0 ? (
                    <>
                      Belum ada peserta didik yang menyelesaikan ujian CBT ini.
                      <br />
                      Buka tab <strong>Ruang Ujian Siswa</strong> untuk memulai sesi ujian pertama.
                    </>
                  ) : (
                    <>
                      Tidak ada hasil CBT yang cocok dengan pencarian / filter rombel yang dipilih.
                    </>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/60">
                        <th className="py-2.5 px-3">No</th>
                        <th className="py-2.5 px-3">NIS</th>
                        <th className="py-2.5 px-3">Nama Siswa</th>
                        <th className="py-2.5 px-3">Kelas</th>
                        <th className="py-2.5 px-3 text-center">Skor CBT</th>
                        <th className="py-2.5 px-3 text-center">B/S/Total</th>
                        <th className="py-2.5 px-3 text-center">Status Rekap</th>
                        <th className="py-2.5 px-3">Waktu Selesai</th>
                        <th className="py-2.5 px-3 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredCbtResults.map((r, idx) => (
                        <tr key={r.id} className="hover:bg-slate-850/50 transition-colors">
                          <td className="py-2.5 px-3 text-slate-400">{idx + 1}</td>
                          <td className="py-2.5 px-3 font-mono text-purple-300">{r.nis || '-'}</td>
                          <td className="py-2.5 px-3 font-bold text-white">{r.studentName}</td>
                          <td className="py-2.5 px-3 text-slate-300">{r.classGroup}</td>
                          <td className="py-2.5 px-3 text-center">
                            <span
                              className={`font-black text-sm px-2 py-0.5 rounded ${
                                r.score >= (config.kktpTarget ?? 75)
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              }`}
                            >
                              {r.score}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center text-slate-400">
                            {r.correctCount}/{r.wrongCount}/{r.totalQuestions}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            {r.syncedToGradebook ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                ✓ Masuk Buku Nilai
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleSyncToGradebook(r)}
                                className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300 hover:text-white hover:bg-emerald-900 border border-slate-700 transition-colors cursor-pointer"
                                title="Klik untuk masukkan ke buku nilai kelas"
                              >
                                Masukkan Buku Nilai
                              </button>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-slate-400 text-[11px]">{r.submittedAt}</td>
                          <td className="py-2.5 px-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleSyncToGradebook(r)}
                                title="Sinkronkan ke Buku Nilai (Sumatif)"
                                className="p-1 rounded bg-emerald-950/80 text-emerald-300 hover:bg-emerald-900 border border-emerald-700/50 cursor-pointer"
                              >
                                <FileCheck className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => printCbtStudentCertificate(r, packageData.identity.schoolName, packageData.identity.teacherName)}
                                title="Cetak Kartu Hasil CBT Siswa"
                                className="p-1 rounded bg-indigo-950/80 text-indigo-300 hover:bg-indigo-900 border border-indigo-700/50 cursor-pointer"
                              >
                                <Printer className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteHistory(r.id)}
                                title="Hapus Riwayat (Permanen Cloud)"
                                className="p-1 rounded bg-rose-950/80 text-rose-300 hover:bg-rose-900 border border-rose-700/50 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* CBT SETTINGS MODAL */}
        <CbtSettingsModal
          isOpen={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
          config={config}
          onSaveConfig={(newConfig) => {
            setConfig(newConfig);
            setTimeRemaining(newConfig.durationMinutes * 60);
          }}
          questions={packageData.questions}
          defaultTopic={packageData.identity.topic}
          defaultElement={packageData.materiMapping[0]?.element}
        />

        {/* MINIMUM DURATION ALERT */}
        {minimumDurationAlert && (
          <div className="fixed inset-0 z-70 bg-black/85 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-sky-500/60 rounded-2xl max-w-sm w-full p-5 text-center space-y-3 shadow-2xl">
              <div className="w-12 h-12 rounded-full bg-sky-500/20 text-sky-400 mx-auto flex items-center justify-center border border-sky-500/40">
                <Clock className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">
                Waktu Minimal Belum Terpenuhi
              </h4>
              <p className="text-xs text-sky-200 leading-relaxed">
                {minimumDurationAlert}
              </p>
              <button
                type="button"
                onClick={() => setMinimumDurationAlert('')}
                className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl"
              >
                Saya Mengerti & Kembali Memeriksa
              </button>
            </div>
          </div>
        )}

        {/* PENALTY LOCK SCREEN OVERLAY */}
        {isLocked && (
          <div className="fixed inset-0 z-80 bg-black/95 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-orange-500/70 rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl">
              <div className="w-14 h-14 rounded-full bg-orange-500/20 text-orange-400 mx-auto flex items-center justify-center border border-orange-500/40">
                <Lock className="w-7 h-7 animate-pulse text-orange-400" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">
                  Layar Ujian Dibekukan Sementara
                </h4>
                <p className="text-xs text-orange-200 mt-1">
                  Anda telah meninggalkan atau berpindah jendela ujian sebanyak {antiCheatViolations} kali, melampaui batas toleransi ({config.maxTabSwitchAllowed ?? 2}x).
                </p>
              </div>
              <div className="py-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-3xl font-black text-orange-400 font-mono">{lockCountdown}s</span>
                <span className="block text-[10px] text-slate-400 mt-0.5">Sanksi pembekuan layar aktif</span>
              </div>
              {lockCountdown <= 0 ? (
                <button
                  type="button"
                  onClick={() => setIsLocked(false)}
                  className="w-full py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl"
                >
                  Buka Kunci & Lanjutkan Ujian
                </button>
              ) : (
                <p className="text-[10px] text-slate-500">
                  Tetap berada di halaman ini hingga waktu pembekuan selesai.
                </p>
              )}
            </div>
          </div>
        )}

        {/* BANK SOAL PICKER MODAL */}
        {showBankPickerModal && (
          <BankSoalPickerModal
            grade={packageData.identity.grade}
            defaultElement={packageData.materiMapping[0]?.element}
            currentQuestionsCount={activeQuestions.length}
            onClose={() => setShowBankPickerModal(false)}
            onImportQuestions={handleImportFromBankSoal}
          />
        )}

      </div>
    </div>
  );
};
