import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Laptop,
  Clock,
  CheckCircle2,
  AlertCircle,
  Award,
  ArrowRight,
  ArrowLeft,
  FileCheck,
  Printer,
  ShieldAlert,
  HelpCircle,
  Maximize2,
  Minimize2,
  Sparkles,
  BookOpen,
  Check,
  Eye,
  EyeOff,
  AlertTriangle,
  RotateCcw,
  Send,
  UserCheck,
  GraduationCap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PublishedCbtExam, CbtStudentResult, QuestionItem } from '../types';
import { getPublishedExam, recordStudentCbtSubmission } from '../services/cbtShareService';
import { printCbtStudentCertificate } from '../services/gradingService';

interface StudentCbtPortalProps {
  examId: string;
  initialToken?: string;
  onExit?: () => void;
}

type PortalStep = 'loading' | 'notFound' | 'gate' | 'exam' | 'result';
type FontSize = 'normal' | 'large' | 'xlarge';

export const StudentCbtPortal: React.FC<StudentCbtPortalProps> = ({
  examId,
  initialToken,
  onExit
}) => {
  const [step, setStep] = useState<PortalStep>('loading');
  const [exam, setExam] = useState<PublishedCbtExam | null>(null);
  const [loadError, setLoadError] = useState<string>('');

  // Student Identity Input
  const [studentName, setStudentName] = useState<string>('');
  const [studentNis, setStudentNis] = useState<string>('');
  const [studentClass, setStudentClass] = useState<string>('');
  const [inputToken, setInputToken] = useState<string>(initialToken || '');
  const [tokenError, setTokenError] = useState<string>('');
  const [pledgeChecked, setPledgeChecked] = useState<boolean>(true);

  // Exam runtime state
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [doubtfuls, setDoubtfuls] = useState<number[]>([]);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [fontSize, setFontSize] = useState<FontSize>('normal');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState<boolean>(false);
  const [minimumDurationAlert, setMinimumDurationAlert] = useState<string>('');

  // Anti-cheat state
  const [antiCheatViolations, setAntiCheatViolations] = useState<number>(0);
  const [showAntiCheatAlert, setShowAntiCheatAlert] = useState<boolean>(false);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [lockCountdown, setLockCountdown] = useState<number>(0);
  const [autoSubmitReason, setAutoSubmitReason] = useState<string>('');

  // Result state
  const [finalResult, setFinalResult] = useState<CbtStudentResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [reviewMode, setReviewMode] = useState<boolean>(false);
  const [isSyncedToGradebook, setIsSyncedToGradebook] = useState<boolean>(false);

  // Fetch exam on mount
  useEffect(() => {
    let isMounted = true;
    setStep('loading');
    setLoadError('');

    getPublishedExam(examId)
      .then(data => {
        if (!isMounted) return;
        if (data) {
          setExam(data);
          setStudentClass(`${data.grade}-A`);
          if (initialToken) {
            setInputToken(initialToken);
          } else if (data.token) {
            setInputToken(data.token);
          }
          setStep('gate');
        } else {
          setLoadError(`Paket ujian dengan kode "${examId}" tidak ditemukan atau belum dipublikasikan.`);
          setStep('notFound');
        }
      })
      .catch(err => {
        if (!isMounted) return;
        setLoadError('Terjadi kesalahan saat memuat data ujian: ' + (err.message || String(err)));
        setStep('notFound');
      });

    return () => {
      isMounted = false;
    };
  }, [examId, initialToken]);

  // Exam timer countdown
  useEffect(() => {
    if (step !== 'exam') return;

    if (timeRemaining <= 0) {
      setAutoSubmitReason('Waktu pengerjaan ujian telah habis! Jawaban Anda otomatis dikumpulkan.');
      handleFinalSubmit(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [step, timeRemaining]);

  // Lock penalty timer
  useEffect(() => {
    if (!isLocked || lockCountdown <= 0) {
      if (isLocked && lockCountdown <= 0) setIsLocked(false);
      return;
    }
    const penaltyTimer = setInterval(() => {
      setLockCountdown(prev => prev - 1);
    }, 1000);
    return () => clearInterval(penaltyTimer);
  }, [isLocked, lockCountdown]);

  // Anti-cheat window blur & tab switch listener
  useEffect(() => {
    if (step !== 'exam' || !exam?.antiCheatWarning || !exam?.detectTabSwitch) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setAntiCheatViolations(prev => {
          const newCount = prev + 1;
          const maxAllowed = exam.maxTabSwitchAllowed ?? 2;

          if (newCount > maxAllowed) {
            if (exam.tabSwitchAction === 'autosubmit') {
              setAutoSubmitReason(
                `Ujian dihentikan & dikumpulkan otomatis: Anda terdeteksi berpindah tab/jendela browser sebanyak ${newCount} kali, melampaui batas maksimal (${maxAllowed}x).`
              );
              handleFinalSubmit(true);
            } else if (exam.tabSwitchAction === 'lock') {
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
  }, [step, exam]);

  // Fullscreen toggle helper
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Start exam handler
  const handleStartExam = () => {
    if (!studentName.trim()) {
      alert('Mohon masukkan Nama Lengkap Anda terlebih dahulu!');
      return;
    }
    if (!studentNis.trim()) {
      alert('Mohon masukkan Nomor Induk Siswa (NIS / NISN)!');
      return;
    }
    if (!pledgeChecked) {
      alert('Mohon centang janji kejujuran sebelum memulai ujian.');
      return;
    }

    if (exam?.requireToken && inputToken.trim().toUpperCase() !== exam.token.trim().toUpperCase()) {
      setTokenError(`Token ujian tidak sesuai! Silakan periksa kembali atau tanyakan kepada guru.`);
      return;
    }

    setTokenError('');

    // Prepare questions
    let examQuestions = [...(exam?.questions || [])];
    if (exam?.shuffleQuestions) {
      // Deterministic shuffle
      examQuestions.sort(() => Math.random() - 0.5);
    }

    // Renumber
    examQuestions = examQuestions.map((q, idx) => ({
      ...q,
      number: idx + 1
    }));

    setQuestions(examQuestions);
    setTimeRemaining((exam?.durationMinutes || 45) * 60);
    setCurrentIndex(0);
    setAnswers({});
    setDoubtfuls([]);
    setAntiCheatViolations(0);
    setIsLocked(false);
    setLockCountdown(0);
    setAutoSubmitReason('');
    setStep('exam');
  };

  // Select answer
  const handleSelectAnswer = (qNumber: number, optionKey: string) => {
    setAnswers(prev => ({ ...prev, [qNumber]: optionKey }));
  };

  // Toggle doubtful
  const handleToggleDoubtful = (qNumber: number) => {
    setDoubtfuls(prev =>
      prev.includes(qNumber) ? prev.filter(n => n !== qNumber) : [...prev, qNumber]
    );
  };

  // Final submission handler
  const handleFinalSubmit = async (isAutoSubmit = false) => {
    if (!exam) return;

    // Check minimum duration requirement if not auto-submitted
    if (!isAutoSubmit && exam.minimumDurationMinutes && exam.minimumDurationMinutes > 0) {
      const timeSpentSeconds = exam.durationMinutes * 60 - timeRemaining;
      const timeSpentMinutes = Math.floor(timeSpentSeconds / 60);
      if (timeSpentMinutes < exam.minimumDurationMinutes) {
        setMinimumDurationAlert(
          `Waktu pengerjaan minimal adalah ${exam.minimumDurationMinutes} menit. Anda baru mengerjakan selama ${timeSpentMinutes} menit. Silakan periksa kembali jawaban Anda dengan cermat.`
        );
        setShowConfirmSubmit(false);
        return;
      }
    }

    setShowConfirmSubmit(false);
    setIsSubmitting(true);

    // Calculate score
    let correct = 0;
    let wrong = 0;
    let unanswered = 0;
    let essay = 0;

    const bloomAnalysis: Record<string, { total: number; correct: number }> = {};
    const elementAnalysis: Record<string, { total: number; correct: number }> = {};

    questions.forEach(q => {
      const bloom = q.bloomLevel || 'C3';
      const el = q.element || exam.element || 'PAI';

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

    const totalQuestions = questions.length;
    const mcTotal = totalQuestions - essay;
    const finalScore = mcTotal > 0 ? Math.round((correct / mcTotal) * 100) : 100;
    const timeSpent = exam.durationMinutes * 60 - timeRemaining;

    const resultRecord: CbtStudentResult = {
      id: `cbt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      nis: studentNis,
      studentName: studentName,
      classGroup: studentClass || `${exam.grade}-A`,
      examTitle: exam.title,
      grade: exam.grade,
      semester: exam.semester,
      element: exam.element,
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

    // Record submission into system (Firestore + LocalStorage + Gradebook)
    try {
      const syncRes = await recordStudentCbtSubmission(exam.id, resultRecord);
      setIsSyncedToGradebook(syncRes.syncedToGradebook);
      resultRecord.syncedToGradebook = syncRes.syncedToGradebook;
    } catch (e) {
      console.warn('Submission recording notice:', e);
    }

    setFinalResult(resultRecord);
    setIsSubmitting(false);
    setStep('result');

    // Confetti celebration
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {
      // Ignored if confetti fails
    }
  };

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Current question data
  const currentQ = questions[currentIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = Math.max(0, totalQuestions - answeredCount);
  const doubtfulCount = doubtfuls.length;

  // Font size class mapping
  const fontSizeClasses = {
    normal: { text: 'text-sm sm:text-base', heading: 'text-base sm:text-lg' },
    large: { text: 'text-base sm:text-lg', heading: 'text-lg sm:text-xl' },
    xlarge: { text: 'text-lg sm:text-xl', heading: 'text-xl sm:text-2xl' }
  }[fontSize];

  // =========================================================================
  // RENDER: LOADING STATE
  // =========================================================================
  if (step === 'loading') {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 text-white">
        <div className="relative flex h-16 w-16 mb-4 items-center justify-center">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-30"></span>
          <Laptop className="w-10 h-10 text-emerald-400 animate-pulse relative" />
        </div>
        <h2 className="text-xl font-bold mb-1">Memuat Ujian CBT...</h2>
        <p className="text-xs text-slate-400">Menghubungkan ke server database soal...</p>
      </div>
    );
  }

  // =========================================================================
  // RENDER: NOT FOUND / ERROR STATE
  // =========================================================================
  if (step === 'notFound') {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 text-white">
        <div className="bg-slate-800 border border-slate-700 max-w-md w-full rounded-2xl p-6 text-center shadow-xl">
          <div className="w-14 h-14 bg-rose-500/20 text-rose-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold mb-2">Ujian Tidak Ditemukan</h2>
          <p className="text-sm text-slate-300 mb-6">{loadError}</p>
          <div className="p-3 bg-slate-900/60 rounded-lg text-xs text-slate-400 mb-6 text-left">
            <p className="font-semibold text-slate-300 mb-1">Saran untuk siswa:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Pastikan link pengerjaan ujian yang Anda buka sudah lengkap dan benar.</li>
              <li>Tanyakan kepada Guru Pengampu untuk membagikan ulang tautan atau token ujian terbaru.</li>
            </ul>
          </div>
          {onExit && (
            <button
              onClick={onExit}
              className="w-full py-2.5 bg-slate-700 hover:bg-slate-600 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
            >
              Kembali ke Beranda
            </button>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER: STEP 1 - STUDENT GATE (ID & TOKEN ENTRY)
  // =========================================================================
  if (step === 'gate' && exam) {
    return (
      <div className="min-h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-950 flex flex-col items-center justify-center p-4 sm:p-6 text-white">
        <div className="w-full max-w-xl bg-slate-800/90 border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-md overflow-hidden">
          {/* Top Header */}
          <div className="bg-linear-to-r from-emerald-800 via-teal-800 to-sky-900 p-6 text-white border-b border-emerald-600/30">
            <div className="flex items-center gap-3 mb-2">
              <span className="p-2 bg-white/10 rounded-xl backdrop-blur-xs">
                <Laptop className="w-6 h-6 text-emerald-300" />
              </span>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded border border-emerald-400/30">
                  PORTAL UJIAN CBT SISWA RESMI
                </span>
                <h1 className="text-lg sm:text-xl font-bold tracking-tight mt-1">{exam.title}</h1>
              </div>
            </div>
            <p className="text-xs text-emerald-100/90 flex flex-wrap items-center gap-3 mt-2">
              <span>{exam.schoolName}</span>
              <span>•</span>
              <span>Kelas {exam.grade} - Semester {exam.semester}</span>
              <span>•</span>
              <span>Guru: {exam.teacherName}</span>
            </p>
          </div>

          {/* Exam Info Badges */}
          <div className="grid grid-cols-3 gap-2 p-4 bg-slate-900/50 border-b border-slate-700/50 text-center text-xs">
            <div className="p-2 bg-slate-800/70 rounded-lg border border-slate-700">
              <span className="text-[10px] text-slate-400 block font-semibold">DURASI</span>
              <span className="text-sm font-bold text-emerald-400">{exam.durationMinutes} Menit</span>
            </div>
            <div className="p-2 bg-slate-800/70 rounded-lg border border-slate-700">
              <span className="text-[10px] text-slate-400 block font-semibold">JUMLAH SOAL</span>
              <span className="text-sm font-bold text-sky-400">{exam.questions.length} Butir</span>
            </div>
            <div className="p-2 bg-slate-800/70 rounded-lg border border-slate-700">
              <span className="text-[10px] text-slate-400 block font-semibold">TARGET KKTP</span>
              <span className="text-sm font-bold text-amber-400">Skor {exam.kktpTarget}</span>
            </div>
          </div>

          {/* Form */}
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Nama Lengkap Peserta Didik <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={studentName}
                onChange={e => setStudentName(e.target.value)}
                placeholder="Contoh: Muhammad Rizky Pratama"
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Nomor Induk Siswa (NIS / NISN) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={studentNis}
                  onChange={e => setStudentNis(e.target.value)}
                  placeholder="Contoh: 24001"
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Kelas / Rombel <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={studentClass}
                  onChange={e => setStudentClass(e.target.value)}
                  placeholder="Contoh: VIII-A"
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>
            </div>

            {exam.requireToken && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Token Masuk Ujian <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={inputToken}
                  onChange={e => {
                    setInputToken(e.target.value);
                    setTokenError('');
                  }}
                  placeholder="Masukkan token dari guru..."
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-emerald-300 font-mono tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                />
                {tokenError && (
                  <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{tokenError}</span>
                  </p>
                )}
              </div>
            )}

            {/* Anti-cheat & instructions info */}
            <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-700/60 text-xs space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <ShieldAlert className="w-4 h-4" />
                <span>Petunjuk & Tata Tertib Ujian CBT:</span>
              </div>
              <div className="text-slate-300 whitespace-pre-line text-[11px] leading-relaxed">
                {exam.instructions}
              </div>
              {exam.detectTabSwitch && (
                <div className="pt-1.5 border-t border-slate-800 text-[11px] text-amber-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>Sistem mendeteksi perpindahan tab browser (maksimal {exam.maxTabSwitchAllowed}x toleransi).</span>
                </div>
              )}
            </div>

            {/* Honesty pledge */}
            <label className="flex items-start gap-2.5 text-xs text-slate-300 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={pledgeChecked}
                onChange={e => setPledgeChecked(e.target.checked)}
                className="mt-0.5 rounded border-slate-600 text-emerald-600 focus:ring-emerald-500 bg-slate-900"
              />
              <span className="leading-snug">
                Saya berjanji akan mengerjakan ujian ini secara <strong>jujur, mandiri, dan berakhlak mulia</strong> tanpa membuka catatan atau bantuan lain.
              </span>
            </label>

            {/* Start Button */}
            <button
              onClick={handleStartExam}
              className="w-full py-3 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Mulai Kerjakan Ujian Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER: STEP 2 - LIVE CBT EXAM INTERFACE
  // =========================================================================
  if (step === 'exam' && exam && currentQ) {
    const isAnswered = Boolean(answers[currentQ.number]);
    const isDoubtful = doubtfuls.includes(currentQ.number);
    const timeIsUrgent = timeRemaining < 300; // < 5 minutes
    const timeIsCritical = timeRemaining < 60; // < 1 minute

    return (
      <div className="min-h-screen bg-slate-100 flex flex-col select-none">
        {/* Anti-cheat Screen Lock Overlay */}
        {isLocked && (
          <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center text-white">
            <div className="w-16 h-16 bg-rose-500/20 text-rose-400 rounded-full flex items-center justify-center mb-4 animate-bounce">
              <ShieldAlert className="w-10 h-10" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2 text-rose-400">Layar Ujian Terkunci Sementara</h2>
            <p className="text-sm text-slate-300 max-w-md mb-6">
              Anda terdeteksi berpindah tab browser atau meminimalkan layar ujian. Sebagai konsekuensi disiplin, layar terkunci selama:
            </p>
            <div className="text-4xl font-extrabold text-white font-mono bg-rose-950/60 border border-rose-500/40 px-6 py-3 rounded-2xl mb-4">
              {lockCountdown} Detik
            </div>
            <p className="text-xs text-slate-400">Harap tetap di halaman ini hingga hitungan selesai.</p>
          </div>
        )}

        {/* Anti-cheat Alert Warning Banner */}
        {showAntiCheatAlert && (
          <div className="bg-rose-600 text-white px-4 py-2.5 text-xs font-semibold flex items-center justify-between shrink-0 shadow-md">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>
                Peringatan: Anda terdeteksi berpindah jendela/tab browser (Pelanggaran ke-{antiCheatViolations} dari batas {exam.maxTabSwitchAllowed}x). Harap fokus pada soal!
              </span>
            </div>
            <button
              onClick={() => setShowAntiCheatAlert(false)}
              className="px-2 py-0.5 bg-rose-800 hover:bg-rose-900 rounded text-[11px] font-bold"
            >
              Saya Mengerti
            </button>
          </div>
        )}

        {/* Top Navbar */}
        <header className="bg-slate-900 text-white px-4 py-3 shrink-0 shadow-md flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="p-1.5 bg-emerald-600/30 text-emerald-400 rounded-lg">
              <Laptop className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-xs sm:text-sm font-bold line-clamp-1">{exam.title}</h2>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Peserta: <strong className="text-slate-200">{studentName}</strong> ({studentClass}) • NIS: {studentNis}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Timer Display */}
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono font-bold text-xs sm:text-sm border ${
                timeIsCritical
                  ? 'bg-rose-900/80 text-rose-200 border-rose-500 animate-pulse'
                  : timeIsUrgent
                  ? 'bg-amber-900/80 text-amber-200 border-amber-500'
                  : 'bg-slate-800 text-emerald-400 border-slate-700'
              }`}
            >
              <Clock className="w-4 h-4 shrink-0" />
              <span>{formatTime(timeRemaining)}</span>
            </div>

            {/* Font size toggles */}
            <div className="hidden md:flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700 text-xs">
              <button
                onClick={() => setFontSize('normal')}
                className={`px-2 py-1 rounded font-bold ${fontSize === 'normal' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}
                title="Ukuran Normal"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-2 py-1 rounded font-bold ${fontSize === 'large' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}
                title="Ukuran Besar"
              >
                A+
              </button>
              <button
                onClick={() => setFontSize('xlarge')}
                className={`px-2 py-1 rounded font-bold ${fontSize === 'xlarge' ? 'bg-slate-700 text-white' : 'text-slate-400'}`}
                title="Ukuran Sangat Besar"
              >
                A++
              </button>
            </div>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
              title="Layar Penuh"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* Main Exam Layout */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Question Paper Panel */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xs border border-slate-200 p-5 sm:p-8 space-y-6">
              {/* Question header info */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                    {currentQ.number}
                  </span>
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Soal Nomor {currentQ.number} dari {totalQuestions}
                    </span>
                    <p className="text-[11px] text-slate-400">
                      Tipe: {currentQ.questionType || 'Pilihan Ganda'} • Elemen: {currentQ.element || exam.element}
                    </p>
                  </div>
                </div>

                {/* Doubtful Flag Toggle */}
                <button
                  type="button"
                  onClick={() => handleToggleDoubtful(currentQ.number)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isDoubtful
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{isDoubtful ? 'Ditandai Ragu' : 'Ragu-ragu'}</span>
                </button>
              </div>

              {/* Stimulus if exists */}
              {currentQ.stimulus && (
                <div className="p-4 bg-slate-50 rounded-xl border-l-4 border-emerald-500 text-slate-700 leading-relaxed italic text-xs sm:text-sm">
                  {currentQ.stimulus}
                </div>
              )}

              {/* Question Text */}
              <div className={`font-medium text-slate-900 leading-relaxed ${fontSizeClasses.text}`}>
                {currentQ.questionText}
              </div>

              {/* Options for Multiple Choice */}
              {currentQ.options && currentQ.options.length > 0 && (
                <div className="space-y-3 pt-2">
                  {currentQ.options.map(opt => {
                    const isSelected = answers[currentQ.number] === opt.key;
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => handleSelectAnswer(currentQ.number, opt.key)}
                        className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-50/80 border-emerald-500 shadow-xs ring-1 ring-emerald-500/30'
                            : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      >
                        <span
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                            isSelected
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                          }`}
                        >
                          {opt.key}
                        </span>
                        <div className={`flex-1 leading-snug ${fontSizeClasses.text} ${isSelected ? 'font-semibold text-emerald-950' : ''}`}>
                          {opt.text}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Essay notice */}
              {currentQ.questionType === 'Essay' && (
                <div className="p-4 bg-sky-50 rounded-xl border border-sky-200 text-sky-900 text-xs">
                  <p className="font-bold mb-1">Soal Bentuk Uraian (Essay)</p>
                  <p>Tuliskan jawaban lengkap Anda pada lembar jawab kertas atau buku catatan sesuai arahan guru.</p>
                </div>
              )}

              {/* Bottom Navigation Controls */}
              <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Sebelumnya</span>
                </button>

                <div className="flex items-center gap-2">
                  {currentIndex < totalQuestions - 1 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentIndex(prev => Math.min(totalQuestions - 1, prev + 1))}
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                    >
                      <span>Selanjutnya</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowConfirmSubmit(true)}
                      className="px-5 py-2 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-900/20 transition-all cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>Kumpulkan Ujian</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </main>

          {/* Right Question Palette Grid Sidebar */}
          <aside className="w-full lg:w-72 bg-white border-t lg:border-t-0 lg:border-l border-slate-200 p-4 shrink-0 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800">NAVIGASI SOAL</span>
                <span className="text-xs font-semibold text-emerald-600">
                  {answeredCount} / {totalQuestions} Terjawab
                </span>
              </div>

              {/* Grid buttons */}
              <div className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-5 gap-2 max-h-64 lg:max-h-[calc(100vh-280px)] overflow-y-auto p-1">
                {questions.map((q, idx) => {
                  const answered = Boolean(answers[q.number]);
                  const doubtful = doubtfuls.includes(q.number);
                  const isCurrent = idx === currentIndex;

                  let btnBg = 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200';
                  if (doubtful) {
                    btnBg = 'bg-amber-500 text-white border-amber-600';
                  } else if (answered) {
                    btnBg = 'bg-emerald-600 text-white border-emerald-700';
                  }

                  return (
                    <button
                      key={q.number}
                      type="button"
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-9 rounded-lg font-bold text-xs border flex items-center justify-center transition-all cursor-pointer ${btnBg} ${
                        isCurrent ? 'ring-2 ring-sky-500 ring-offset-1 font-extrabold shadow-sm' : ''
                      }`}
                    >
                      {q.number}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] space-y-1.5 text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded bg-emerald-600 shrink-0"></span>
                  <span>Sudah Terjawab ({answeredCount})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded bg-amber-500 shrink-0"></span>
                  <span>Ragu-ragu ({doubtfulCount})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded bg-slate-100 border border-slate-300 shrink-0"></span>
                  <span>Belum Terjawab ({unansweredCount})</span>
                </div>
              </div>
            </div>

            {/* Finish Button at bottom of sidebar */}
            <div className="pt-4 mt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowConfirmSubmit(true)}
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Selesai & Kumpulkan</span>
              </button>
            </div>
          </aside>
        </div>

        {/* Confirmation Submit Modal */}
        {showConfirmSubmit && (
          <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-center text-slate-900 mb-2">
                Konfirmasi Kumpulkan Jawaban
              </h3>
              <p className="text-xs text-slate-600 text-center mb-4">
                Apakah Anda yakin ingin menyelesaikan dan mengumpulkan ujian ini sekarang?
              </p>

              {/* Status summary */}
              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-center text-xs mb-4">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">TERJAWAB</span>
                  <span className="text-sm font-bold text-emerald-600">{answeredCount}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">BELUM</span>
                  <span className="text-sm font-bold text-rose-600">{unansweredCount}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">RAGU</span>
                  <span className="text-sm font-bold text-amber-600">{doubtfulCount}</span>
                </div>
              </div>

              {unansweredCount > 0 && (
                <div className="p-3 bg-amber-50 text-amber-800 text-xs rounded-xl border border-amber-200 mb-4 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    Masih ada <strong>{unansweredCount} butir soal</strong> yang belum Anda jawab. Anda yakin ingin melanjutkan?
                  </span>
                </div>
              )}

              {minimumDurationAlert && (
                <div className="p-3 bg-rose-50 text-rose-800 text-xs rounded-xl border border-rose-200 mb-4 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{minimumDurationAlert}</span>
                </div>
              )}

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowConfirmSubmit(false);
                    setMinimumDurationAlert('');
                  }}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Periksa Kembali
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleFinalSubmit(false)}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-900/20 cursor-pointer"
                >
                  {isSubmitting ? 'Mengumpulkan...' : 'Ya, Kumpulkan'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // RENDER: STEP 3 - FINAL RESULT CARD & SCORE RECAP
  // =========================================================================
  if (step === 'result' && exam && finalResult) {
    const isTuntas = finalResult.score >= exam.kktpTarget;
    const minutes = Math.floor(finalResult.timeSpentSeconds / 60);
    const seconds = finalResult.timeSpentSeconds % 60;
    const predikat =
      finalResult.score >= 85
        ? 'Sangat Mahir'
        : finalResult.score >= 75
        ? 'Mahir'
        : finalResult.score >= 65
        ? 'Cakap'
        : 'Perlu Bimbingan';

    return (
      <div className="min-h-screen bg-slate-900 py-8 px-4 flex flex-col items-center justify-center text-white">
        <div className="max-w-xl w-full bg-slate-800/95 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-linear-to-r from-emerald-800 to-teal-800 p-6 text-center text-white border-b border-emerald-600/30">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-xs">
              <Award className="w-10 h-10 text-emerald-300" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/30 text-emerald-200 px-2.5 py-0.5 rounded border border-emerald-400/30">
              HASIL UJIAN CBT BERHASIL TERKUMPUL
            </span>
            <h1 className="text-xl sm:text-2xl font-bold mt-2">{exam.title}</h1>
            <p className="text-xs text-emerald-100/90 mt-1">
              Peserta: <strong>{finalResult.studentName}</strong> ({finalResult.classGroup}) • NIS: {finalResult.nis}
            </p>
          </div>

          {/* Database Recapitulation Notice */}
          <div className="bg-emerald-950/60 border-b border-emerald-500/30 px-5 py-2.5 text-xs text-emerald-300 flex items-center justify-center gap-2 text-center">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Data Hasil Ujian Anda Terekap Permanen di Sistem:</strong> Tersimpan di database guru dan tersinkron ke buku nilai.
            </span>
          </div>

          {/* Score & Metrics */}
          <div className="p-6 space-y-6">
            <div className="text-center p-6 bg-slate-900/80 rounded-2xl border border-slate-700/60">
              <span className="text-xs font-semibold text-slate-400 block mb-1">SKOR CAPAIAN AKHIR</span>
              <div
                className={`text-5xl sm:text-6xl font-extrabold font-mono tracking-tight ${
                  isTuntas ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {finalResult.score}
              </div>
              <div className="mt-3 flex items-center justify-center gap-2">
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    isTuntas
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}
                >
                  {isTuntas ? 'TUNTAS KKTP' : 'PERLU BIMBINGAN / REMEDIAL'}
                </span>
                <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
                  Predikat: {predikat}
                </span>
              </div>
            </div>

            {/* 4 Detail Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block font-semibold">BENAR</span>
                <span className="text-base font-bold text-emerald-400">{finalResult.correctCount}</span>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block font-semibold">SALAH</span>
                <span className="text-base font-bold text-rose-400">{finalResult.wrongCount}</span>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block font-semibold">KOSONG</span>
                <span className="text-base font-bold text-slate-400">{finalResult.unansweredCount}</span>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block font-semibold">DURASI</span>
                <span className="text-base font-bold text-sky-400">{minutes}m {seconds}s</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              {exam.allowPrintCertificate && (
                <button
                  type="button"
                  onClick={() => printCbtStudentCertificate(finalResult, exam.schoolName, exam.teacherName)}
                  className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak / Unduh Bukti Nilai Resmi Peserta Didik</span>
                </button>
              )}

              {exam.showReview && (
                <button
                  type="button"
                  onClick={() => setReviewMode(!reviewMode)}
                  className="w-full py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>{reviewMode ? 'Tutup Pembahasan Soal' : 'Lihat Kunci & Pembahasan Soal'}</span>
                </button>
              )}

              {onExit && (
                <button
                  type="button"
                  onClick={onExit}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Keluar dari Ujian
                </button>
              )}
            </div>

            {/* Review Section */}
            {reviewMode && exam.showReview && (
              <div className="pt-4 border-t border-slate-700 space-y-4 max-h-96 overflow-y-auto pr-1">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Review & Pembahasan Jawaban
                </h4>
                {questions.map((q, idx) => {
                  const studentAns = answers[q.number];
                  const isCorrect = studentAns === q.correctKey;

                  return (
                    <div
                      key={q.number}
                      className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                        isCorrect
                          ? 'bg-emerald-950/30 border-emerald-500/40'
                          : 'bg-rose-950/30 border-rose-500/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-200">Soal #{idx + 1}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isCorrect ? 'bg-emerald-500/30 text-emerald-300' : 'bg-rose-500/30 text-rose-300'
                          }`}
                        >
                          {isCorrect ? 'BENAR' : 'SALAH'}
                        </span>
                      </div>
                      <p className="text-slate-300">{q.questionText}</p>
                      <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                        <div className="p-2 bg-slate-900/60 rounded">
                          <span className="text-slate-400 block text-[10px]">Jawaban Anda:</span>
                          <span className="font-bold text-white">{studentAns || '(Tidak dijawab)'}</span>
                        </div>
                        <div className="p-2 bg-slate-900/60 rounded">
                          <span className="text-emerald-400 block text-[10px]">Kunci Benar:</span>
                          <span className="font-bold text-emerald-300">{q.correctKey}</span>
                        </div>
                      </div>
                      {q.explanation && (
                        <div className="p-2 bg-slate-900/80 rounded text-[11px] text-slate-300 border-l-2 border-emerald-500">
                          <span className="font-semibold text-emerald-300">Pembahasan: </span>
                          {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};
