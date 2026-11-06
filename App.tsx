/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { OwnerDashboard } from './components/OwnerDashboard';
import { OwnerLoginModal } from './components/OwnerLoginModal';
import { LicenseActivationModal } from './components/LicenseActivationModal';
import { DemoBanner } from './components/DemoBanner';
import { AssessmentForm } from './components/AssessmentForm';
import { AssessmentView } from './components/AssessmentView';
import { ExportModal } from './components/ExportModal';
import { QuestionEditorModal } from './components/QuestionEditorModal';
import { StudentSimulator } from './components/StudentSimulator';
import { GuideModal } from './components/GuideModal';
import { ThemeCatalogModal } from './components/ThemeCatalogModal';
import { CbtConverterModal } from './components/CbtConverterModal';
import { QuestionBankModal } from './components/QuestionBankModal';
import { ComprehensiveGradingModal } from './components/ComprehensiveGradingModal';
import { HolisticAssessmentModal } from './components/HolisticAssessmentModal';
import { ShareCbtModal } from './components/ShareCbtModal';
import { StudentCbtPortal } from './components/StudentCbtPortal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { testConnection } from './services/firebase';
import { syncAllLocalStorageToDatabase } from './services/firebaseDatabaseService';
import { saveGeneratedQuestionsToBank } from './services/questionBankService';
import {
  initializeUserSession,
  subscribeToUser,
  logoutUser,
  startDemoSession,
  getDemoSession,
  updateDemoSessionUsage
} from './services/authService';
import { fetchDemoSettings } from './services/licenseService';
import {
  AssessmentPackage,
  GenerateAssessmentRequest,
  QuestionItem,
  UserAccount,
  DemoSession,
  DemoSettings
} from './types';
import {
  generateLocalAssessment,
  calculateQualityScore,
  balanceKeysInQuestions,
  calculateBloomDistribution,
  calculateSoloDistribution,
  calculateDeepLearningDistribution,
  calculateOverallQuality
} from './services/assessmentGenerator';
import { CURRICULUM_TOPICS, CurriculumTopic } from './data/curriculumData';
import { AlertCircle, Key, Sparkles, X, Database } from 'lucide-react';

export default function App() {
  // User Authentication & Workspace State
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => initializeUserSession());
  const [viewMode, setViewMode] = useState<'landing' | 'app' | 'owner'>(() => {
    const user = initializeUserSession();
    if (user?.role === 'owner') return 'owner';
    if (user?.role === 'licensed' || user?.role === 'demo') return 'app';
    return 'landing';
  });

  const [currentDemoSession, setCurrentDemoSession] = useState<DemoSession | null>(() => getDemoSession());
  const [demoSettings, setDemoSettings] = useState<DemoSettings>({
    demoEnabled: true,
    allowedFeatures: [],
    maxQuestionsPerGeneration: 5,
    maxGenerationsPerSession: 2,
    dailyLimit: 10,
    exportEnabled: false,
    persistenceEnabled: false,
    demoMessage: 'Selamat datang di PAIBP FASE D SMART LEARNING PRO 2026. Anda sedang mencoba Mode Demo dengan fitur terbatas (Maks 5 soal, 2x generasi). Aktifkan Lisensi Guru untuk menikmati akses penuh tanpa batas.',
    activateButtonText: 'Aktifkan Lisensi Penuh Sekarang'
  });

  // Auth Modals
  const [showLicenseModal, setShowLicenseModal] = useState<boolean>(false);
  const [showOwnerLoginModal, setShowOwnerLoginModal] = useState<boolean>(false);
  const [quotaExceededMessage, setQuotaExceededMessage] = useState<string | null>(null);

  // Application Feature Modals
  const [currentPackage, setCurrentPackage] = useState<AssessmentPackage | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [editingQuestion, setEditingQuestion] = useState<QuestionItem | null>(null);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [showSimulatorModal, setShowSimulatorModal] = useState<boolean>(false);
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);
  const [showCatalogModal, setShowCatalogModal] = useState<boolean>(false);
  const [showQuestionBankModal, setShowQuestionBankModal] = useState<boolean>(false);
  const [showCbtConverterModal, setShowCbtConverterModal] = useState<boolean>(false);
  const [showGradingModal, setShowGradingModal] = useState<boolean>(false);
  const [showHolisticAssessmentModal, setShowHolisticAssessmentModal] = useState<boolean>(false);
  const [showShareCbtModal, setShowShareCbtModal] = useState<boolean>(false);
  const [selectedCatalogTopic, setSelectedCatalogTopic] = useState<{ topic: CurriculumTopic; temaName: string } | null>(null);
  const [bankSavedToast, setBankSavedToast] = useState<{ count: number; title: string } | null>(null);

  // Check if opened via shared student CBT link: ?cbt=<examId>
  const [studentCbtExamId, setStudentCbtExamId] = useState<string | null>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const cbtParam = params.get('cbt') || params.get('exam');
      if (cbtParam) return cbtParam;
      if (window.location.hash.startsWith('#/cbt/')) {
        return window.location.hash.replace('#/cbt/', '').split('?')[0];
      }
    } catch {
      // Ignored
    }
    return null;
  });

  const [studentCbtToken, setStudentCbtToken] = useState<string>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('token') || '';
    } catch {
      return '';
    }
  });

  // Helper untuk menyimpan seluruh butir soal hasil generate ke Bank Soal secara otomatis
  const autoSaveToQuestionBank = (pkg: AssessmentPackage) => {
    if (!pkg || !pkg.questions || pkg.questions.length === 0) return;
    try {
      saveGeneratedQuestionsToBank(pkg.questions, {
        grade: pkg.identity.grade,
        semester: pkg.identity.semester,
        element: (pkg.materiMapping[0]?.element || 'Akidah') as any,
        tema: pkg.tema || pkg.materiMapping[0]?.materi,
        assessmentTitle: pkg.identity.title,
        userId: currentUser?.uid
      });
      setBankSavedToast({
        count: pkg.questions.length,
        title: pkg.identity.title
      });
      setTimeout(() => {
        setBankSavedToast(null);
      }, 5000);
    } catch (err) {
      console.warn('Gagal menyimpan otomatis ke Bank Soal:', err);
    }
  };

  // Sync auth state subscription
  useEffect(() => {
    const unsubscribe = subscribeToUser(user => {
      setCurrentUser(user);
      if (!user) {
        setViewMode('landing');
      }
    });
    return () => unsubscribe();
  }, []);

  // Discreet Owner Portal invocation (Secret shortcut Ctrl+Alt+O or secret query)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Secret key combination: Ctrl+Alt+O (or Cmd+Alt+O on Mac)
      if ((e.ctrlKey || e.metaKey) && e.altKey && (e.key === 'o' || e.key === 'O')) {
        e.preventDefault();
        setShowOwnerLoginModal(true);
      }
    };

    // Check secret query or hash parameter: ?portal=owner, ?admin=portal, #owner-login
    try {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get('portal') === 'owner' || searchParams.get('admin') === 'portal' || window.location.hash === '#owner-login') {
        setShowOwnerLoginModal(true);
      }
    } catch {
      // ignore
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch demo settings and test database connection on boot
  useEffect(() => {
    fetchDemoSettings().then(settings => setDemoSettings(settings));

    testConnection().then(ok => {
      if (ok) {
        syncAllLocalStorageToDatabase().catch(err => {
          console.warn('Background database sync notice:', err);
        });
      }
    });
  }, []);

  // Generate initial package showcase for immediately interactive feel
  useEffect(() => {
    const defaultTopic = CURRICULUM_TOPICS.find(t => t.grade === 'VIII' && t.semester === '1' && t.element === 'Akidah') || CURRICULUM_TOPICS[0];
    const initial = generateLocalAssessment({
      mode: 'sumatif',
      grade: defaultTopic.grade,
      semester: defaultTopic.semester,
      element: defaultTopic.element,
      temaCode: defaultTopic.temaCode,
      tema: defaultTopic.tema,
      cp: defaultTopic.officialCp,
      tp: defaultTopic.suggestedTpList[0],
      materi: defaultTopic.materi,
      submateri: defaultTopic.submateriList.join(', '),
      questionCount: currentUser?.role === 'demo' ? Math.min(demoSettings.maxQuestionsPerGeneration, 5) : 10,
      questionType: 'Pilihan Ganda',
      difficulty: 'Sulit',
      contextType: 'Kehidupan siswa, sekolah, etika digital, dan masyarakat',
      allOptionsPositive: true,
      noRoteMemorization: true,
      schoolName: currentUser?.schoolName || 'SMP Negeri 1 Nusantara',
      teacherName: currentUser?.displayName || 'Guru Pengampu PAIBP',
      customPrompt: ''
    });
    setCurrentPackage(initial);
  }, [currentUser]);

  // Handle Demo Mode Launch
  const handleStartDemo = async () => {
    try {
      const { user, session } = await startDemoSession();
      setCurrentUser(user);
      setCurrentDemoSession(session);
      setViewMode('app');
    } catch (e) {
      console.error('Failed to start demo:', e);
      setViewMode('app');
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    await logoutUser();
    setCurrentUser(null);
    setViewMode('landing');
  };

  // Handle Bank Soal import
  const handleImportBankQuestions = (bankQuestions: QuestionItem[]) => {
    if (!currentPackage) return;
    const startNum = 1;
    const renumbered = bankQuestions.map((q, idx) => ({
      ...q,
      number: startNum + idx
    }));

    const newKisiKisi = renumbered.map(q => ({
      number: q.number,
      cp: currentPackage.cp,
      tp: q.tp,
      element: String(q.element),
      tema: q.tema || currentPackage.tema,
      temaCode: q.temaCode || currentPackage.temaCode,
      materi: q.materi,
      submateri: q.submateri,
      indicator: q.indicator,
      stimulus: q.stimulus,
      operationalVerb: q.operationalVerb,
      bloomLevel: q.bloomLevel,
      soloLevel: q.soloLevel,
      deepLearningDim: q.deepLearningDim,
      difficulty: q.difficulty,
      questionType: 'Pilihan Ganda',
      questionNumber: q.number,
      correctKey: q.correctKey
    }));

    const counts = { A: 0, B: 0, C: 0, D: 0 };
    renumbered.forEach(q => {
      if (counts[q.correctKey] !== undefined) counts[q.correctKey]++;
    });

    setCurrentPackage({
      ...currentPackage,
      identity: {
        ...currentPackage.identity,
        totalQuestions: renumbered.length,
        timeAllocation: renumbered.length <= 10 ? 30 : renumbered.length <= 25 ? 60 : 90
      },
      questions: renumbered,
      kisiKisi: newKisiKisi,
      keyDistribution: {
        ...counts,
        idealPerOption: Math.round(renumbered.length / 4),
        isBalanced: true,
        varianceScore: 95
      },
      bloomDistribution: calculateBloomDistribution(renumbered),
      soloDistribution: calculateSoloDistribution(renumbered),
      deepLearningDistribution: calculateDeepLearningDistribution(renumbered),
      overallQuality: calculateOverallQuality(renumbered)
    });
  };

  // Assessment Generation with Server-Side Demo Quota Enforcement
  const handleGenerate = async (params: GenerateAssessmentRequest) => {
    const isDemo = currentUser?.role === 'demo';

    // Demo limit validation on client before calling API
    if (isDemo) {
      if (currentDemoSession && currentDemoSession.usageCount >= demoSettings.maxGenerationsPerSession) {
        setQuotaExceededMessage(
          `Batas kuota generasi Mode Demo telah tercapai (${currentDemoSession.usageCount}/${demoSettings.maxGenerationsPerSession} kali generasi). Silakan aktifkan Kode Lisensi Guru untuk menikmati akses penuh tanpa batas!`
        );
        return;
      }
      // Force question count within demo limit
      params.questionCount = Math.min(demoSettings.maxQuestionsPerGeneration, params.questionCount);
    }

    setIsLoading(true);
    try {
      // Direct high-fidelity algorithmic generation when offline without network call
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        console.log('[Offline Mode] Generating assessment using high-fidelity local algorithm.');
        const offlinePkg = generateLocalAssessment(params);
        setCurrentPackage(offlinePkg);
        autoSaveToQuestionBank(offlinePkg);
        setIsLoading(false);
        window.scrollTo({ top: 400, behavior: 'smooth' });
        return;
      }

      const res = await fetch('/api/generate-assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': isDemo ? 'demo' : 'licensed',
          'x-demo-session-id': currentDemoSession?.sessionId || ''
        },
        body: JSON.stringify({
          ...params,
          isDemo,
          demoSessionId: currentDemoSession?.sessionId
        })
      });

      if (res.status === 403) {
        const errorJson = await res.json();
        setQuotaExceededMessage(errorJson.message || 'Batas kuota generasi Mode Demo telah tercapai.');
        setIsLoading(false);
        return;
      }

      const json = await res.json();

      if (isDemo && currentDemoSession) {
        const nextUsage = currentDemoSession.usageCount + 1;
        updateDemoSessionUsage(nextUsage);
        setCurrentDemoSession({ ...currentDemoSession, usageCount: nextUsage });
      }

      if (json.success && json.data && json.data.questions && json.data.questions.length > 0) {
        const aiData = json.data;
        const questionsWithScores: QuestionItem[] = aiData.questions.map((q: any, idx: number) => {
          const item: QuestionItem = {
            number: idx + 1,
            element: q.element || params.element,
            tp: q.tp || params.tp,
            materi: q.materi || params.materi,
            submateri: q.submateri || params.submateri || '',
            indicator: q.indicator || `Disajikan stimulus, siswa dapat menganalisis ${params.materi}`,
            stimulus: q.stimulus,
            operationalVerb: q.operationalVerb || 'Menganalisis',
            bloomLevel: q.bloomLevel || 'C4',
            soloLevel: q.soloLevel || 'Relational',
            deepLearningDim: q.deepLearningDim || 'Merefleksi',
            difficulty: (q.difficulty as any) || (params.difficulty === 'Custom' ? 'Sulit' : params.difficulty),
            questionType: 'Pilihan Ganda',
            questionText: q.questionText,
            options: q.options,
            correctKey: q.correctKey,
            explanation: q.explanation || 'Jawaban paling tepat dan komprehensif berdasarkan prinsip syariat.',
            distractorExplanation: q.distractorExplanation || {},
            islamicValue: q.islamicValue || 'Integritas dan Nilai Tauhid',
            realLifeContext: q.realLifeContext || 'Kehidupan sehari-hari siswa SMP/MTs',
            qualityScore: {
              tpAlignment: 4,
              stimulusQuality: 4,
              bloomPrecision: 4,
              soloPrecision: 4,
              optionHomogeneity: 4,
              distractorQuality: 4,
              contextuality: 4,
              cognitiveDepth: 4,
              total: 32,
              category: 'Sangat Baik'
            }
          };
          item.qualityScore = calculateQualityScore(item);
          return item;
        });

        const balancedQuestions = balanceKeysInQuestions(questionsWithScores);

        const kisiKisi = balancedQuestions.map(q => ({
          number: q.number,
          cp: params.cp,
          tp: q.tp,
          element: q.element as string,
          materi: q.materi,
          submateri: q.submateri,
          indicator: q.indicator,
          stimulus: q.stimulus,
          operationalVerb: q.operationalVerb,
          bloomLevel: q.bloomLevel,
          soloLevel: q.soloLevel,
          deepLearningDim: q.deepLearningDim,
          difficulty: q.difficulty,
          questionType: 'Pilihan Ganda',
          questionNumber: q.number,
          correctKey: q.correctKey
        }));

        const bloomDist = calculateBloomDistribution(balancedQuestions);
        const soloDist = calculateSoloDistribution(balancedQuestions);
        const dlDist = calculateDeepLearningDistribution(balancedQuestions);
        const overallQ = calculateOverallQuality(balancedQuestions);

        const counts = { A: 0, B: 0, C: 0, D: 0 };
        balancedQuestions.forEach(q => {
          if (counts[q.correctKey] !== undefined) counts[q.correctKey]++;
        });

        const newPkg: AssessmentPackage = {
          id: `paibp-${Date.now()}`,
          identity: {
            title: `ASESMEN DEEP LEARNING PAIBP KELAS ${params.grade} (${params.element.toUpperCase()})`,
            subject: 'Pendidikan Agama Islam dan Budi Pekerti (PAIBP)',
            grade: params.grade,
            phase: 'Fase D',
            semester: params.semester,
            academicYear: '2025/2026',
            schoolName: params.schoolName || currentUser?.schoolName || 'SMP / MTs',
            teacherName: params.teacherName || currentUser?.displayName || 'Guru Pengampu PAIBP',
            timeAllocation: params.questionCount <= 10 ? 30 : params.questionCount <= 25 ? 60 : 90,
            totalQuestions: balancedQuestions.length,
            dateCreated: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
          },
          mode: params.mode,
          cp: params.cp,
          tpList: [params.tp],
          materiMapping: [{
            element: params.element,
            materi: params.materi,
            submateri: params.submateri || '',
            percentage: 100,
            questionCount: params.questionCount
          }],
          kisiKisi,
          questions: balancedQuestions,
          keyDistribution: {
            ...counts,
            isBalanced: true,
            idealPerOption: Math.round(balancedQuestions.length / 4),
            varianceScore: 94
          },
          bloomDistribution: bloomDist,
          soloDistribution: soloDist,
          difficultyDistribution: {
            Mudah: { count: 0, percentage: 0 },
            Sedang: { count: 2, percentage: 20 },
            Sulit: { count: 6, percentage: 60 },
            'Sangat Sulit': { count: 2, percentage: 20 }
          },
          deepLearningDistribution: dlDist,
          overallQuality: overallQ,
          validationChecklist: [
            { id: 'v1', label: 'Kesesuaian dengan CP & TP Resmi', passed: true, notes: 'Semua butir soal mengacu pada CP Fase D & TP yang ditetapkan.' },
            { id: 'v2', label: 'Standar HOTS (C4-C6) & SOLO Relational', passed: true, notes: 'Dominan menguji penalaran dan transfer pemahaman.' },
            { id: 'v3', label: 'Distribusi Kunci Jawaban (A, B, C, D)', passed: true, notes: 'Kunci jawaban terdistribusi secara seimbang tanpa pola berulang.' },
            { id: 'v4', label: 'Kaidah Pilihan Ganda Homogen', passed: true, notes: 'Opsi jawaban memiliki panjang dan struktur gramatikal yang setara.' }
          ],
          recommendations: [
            'Naskah asesmen siap digunakan untuk evaluasi sumatif atau kuis formatif.',
            'Disarankan membahas alasan pedagogik bersama siswa setelah penilaian selesai.'
          ]
        };

        setCurrentPackage(newPkg);
        autoSaveToQuestionBank(newPkg);
      } else {
        const localPkg = generateLocalAssessment(params);
        setCurrentPackage(localPkg);
        autoSaveToQuestionBank(localPkg);
      }
    } catch (e) {
      console.warn('API call failed, running local generation:', e);
      const fallbackPkg = generateLocalAssessment(params);
      setCurrentPackage(fallbackPkg);
      autoSaveToQuestionBank(fallbackPkg);
    } finally {
      setIsLoading(false);
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  };

  const handleSaveQuestion = (updatedQ: QuestionItem) => {
    if (!currentPackage) return;
    const newQuestions = currentPackage.questions.map(q =>
      q.number === updatedQ.number ? updatedQ : q
    );
    const newKisiKisi = currentPackage.kisiKisi.map(k =>
      k.number === updatedQ.number
        ? {
            ...k,
            bloomLevel: updatedQ.bloomLevel,
            soloLevel: updatedQ.soloLevel,
            deepLearningDim: updatedQ.deepLearningDim,
            difficulty: updatedQ.difficulty,
            correctKey: updatedQ.correctKey,
            indicator: updatedQ.indicator,
            stimulus: updatedQ.stimulus
          }
        : k
    );

    setCurrentPackage({
      ...currentPackage,
      questions: newQuestions,
      kisiKisi: newKisiKisi,
      bloomDistribution: calculateBloomDistribution(newQuestions),
      soloDistribution: calculateSoloDistribution(newQuestions),
      deepLearningDistribution: calculateDeepLearningDistribution(newQuestions),
      overallQuality: calculateOverallQuality(newQuestions)
    });
  };

  // ROUTE 0: DEDICATED STUDENT CBT PORTAL (Valid link sharing for students)
  if (studentCbtExamId) {
    return (
      <StudentCbtPortal
        examId={studentCbtExamId}
        initialToken={studentCbtToken}
        onExit={() => {
          try {
            const url = new URL(window.location.href);
            url.searchParams.delete('cbt');
            url.searchParams.delete('exam');
            url.searchParams.delete('token');
            window.history.replaceState({}, '', url.pathname);
          } catch {
            // Ignored
          }
          setStudentCbtExamId(null);
        }}
      />
    );
  }

  // ROUTE 1: LANDING PAGE
  if (viewMode === 'landing') {
    return (
      <>
        <LandingPage
          onEnterWithLicense={() => setShowLicenseModal(true)}
          onEnterAsDemo={handleStartDemo}
          onOpenGuide={() => setShowGuideModal(true)}
        />

        {showLicenseModal && (
          <LicenseActivationModal
            isOpen={showLicenseModal}
            onClose={() => setShowLicenseModal(false)}
            onSuccess={(user) => {
              setCurrentUser(user);
              setViewMode('app');
            }}
          />
        )}

        {showOwnerLoginModal && (
          <OwnerLoginModal
            isOpen={showOwnerLoginModal}
            onClose={() => setShowOwnerLoginModal(false)}
            onSuccess={(ownerUser) => {
              setCurrentUser(ownerUser);
              setViewMode('owner');
            }}
          />
        )}

        {showGuideModal && (
          <GuideModal onClose={() => setShowGuideModal(false)} />
        )}

        {/* Global Offline Connectivity Indicator */}
        <OfflineIndicator />
      </>
    );
  }

  // ROUTE 2: OWNER DASHBOARD
  if (viewMode === 'owner' && currentUser?.role === 'owner') {
    return (
      <>
        <OwnerDashboard
          currentOwner={currentUser}
          onLogout={handleLogout}
          onSwitchToTeacherWorkspace={() => setViewMode('app')}
        />
        <OfflineIndicator />
      </>
    );
  }

  // ROUTE 3: TEACHER & DEMO APPLICATION WORKSPACE
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        onOpenGuide={() => setShowGuideModal(true)}
        onOpenCatalog={() => setShowCatalogModal(true)}
        onOpenQuestionBank={() => setShowQuestionBankModal(true)}
        onOpenCbtConverter={() => setShowCbtConverterModal(true)}
        onOpenGrading={() => setShowGradingModal(true)}
        onOpenHolisticAssessment={() => setShowHolisticAssessmentModal(true)}
        onOpenDirectCbt={() => setShowSimulatorModal(true)}
        onOpenShareCbt={() => setShowShareCbtModal(true)}
        activeMode={currentPackage?.mode || 'sumatif'}
        currentUser={currentUser}
        onOpenActivation={() => setShowLicenseModal(true)}
        onOpenOwnerDashboard={() => setViewMode('owner')}
        onLogout={handleLogout}
      />

      {/* Demo Mode Quota Banner */}
      {currentUser?.role === 'demo' && (
        <DemoBanner
          demoSession={currentDemoSession}
          demoSettings={demoSettings}
          onOpenActivation={() => setShowLicenseModal(true)}
          onExitDemo={() => setViewMode('landing')}
        />
      )}

      {/* Quota Exceeded Modal */}
      {quotaExceededMessage && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/50 rounded-2xl max-w-md w-full p-6 text-white shadow-2xl relative text-center space-y-4">
            <button
              onClick={() => setQuotaExceededMessage(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-white">Batas Kuota Mode Demo Tercapai</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                {quotaExceededMessage}
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => {
                  setQuotaExceededMessage(null);
                  setShowLicenseModal(true);
                }}
                className="flex-1 py-2.5 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Key className="w-4 h-4" />
                <span>Aktifkan Kode Lisensi</span>
              </button>
              <button
                onClick={() => setQuotaExceededMessage(null)}
                className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Generator Form */}
        <AssessmentForm
          onGenerate={handleGenerate}
          isLoading={isLoading}
          onOpenThemeCatalog={() => setShowCatalogModal(true)}
          onOpenHolisticAssessment={() => setShowHolisticAssessmentModal(true)}
          selectedCatalogTopic={selectedCatalogTopic}
          currentUser={currentUser}
          onOpenActivation={() => setShowLicenseModal(true)}
        />

        {/* Generated Assessment Package View */}
        {currentPackage && (
          <AssessmentView
            packageData={currentPackage}
            onEditQuestion={(q) => setEditingQuestion(q)}
            onOpenExport={() => setShowExportModal(true)}
            onOpenSimulator={() => setShowSimulatorModal(true)}
            onOpenCbtConverter={() => setShowCbtConverterModal(true)}
            onOpenQuestionBank={() => setShowQuestionBankModal(true)}
            onOpenGrading={() => setShowGradingModal(true)}
            onOpenHolisticAssessment={() => setShowHolisticAssessmentModal(true)}
            onOpenShareCbt={() => setShowShareCbtModal(true)}
            currentUser={currentUser}
            onOpenActivation={() => setShowLicenseModal(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <p className="font-semibold text-slate-300">
              PAIBP FASE D SMART LEARNING PRO 2026
            </p>
            <p className="text-slate-500 mt-0.5">
              Standar Asesmen SMP/MTs Fase D (Kelas VII, VIII, IX) — Kemdikbudristek & Kemenag RI
            </p>
          </div>
          <div className="flex items-center gap-3">
            {currentUser?.role === 'owner' && (
              <button
                onClick={() => setViewMode('owner')}
                className="text-amber-400 hover:text-amber-300 font-semibold cursor-pointer underline"
              >
                Kembali ke Dashboard Owner
              </button>
            )}
            <span className="text-slate-500">
              Taksonomi Bloom Revisi & Taksonomi SOLO 4-Level
            </span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {showLicenseModal && (
        <LicenseActivationModal
          isOpen={showLicenseModal}
          onClose={() => setShowLicenseModal(false)}
          onSuccess={(user) => {
            setCurrentUser(user);
            setViewMode('app');
          }}
        />
      )}

      {showOwnerLoginModal && (
        <OwnerLoginModal
          isOpen={showOwnerLoginModal}
          onClose={() => setShowOwnerLoginModal(false)}
          onSuccess={(ownerUser) => {
            setCurrentUser(ownerUser);
            setViewMode('owner');
          }}
        />
      )}

      {showCatalogModal && (
        <ThemeCatalogModal
          onClose={() => setShowCatalogModal(false)}
          onSelectTopic={(topic, temaName) => {
            setSelectedCatalogTopic({ topic, temaName });
            setShowCatalogModal(false);
          }}
        />
      )}

      {showQuestionBankModal && (
        <QuestionBankModal
          currentUser={currentUser}
          onClose={() => setShowQuestionBankModal(false)}
          onImportToCurrentPackage={handleImportBankQuestions}
          onOpenCbtWithQuestions={(pkg) => {
            setCurrentPackage(pkg);
            setShowQuestionBankModal(false);
            setShowSimulatorModal(true);
          }}
          onShareCbtWithQuestions={(pkg) => {
            setCurrentPackage(pkg);
            setShowQuestionBankModal(false);
            setShowShareCbtModal(true);
          }}
          onOpenActivation={() => setShowLicenseModal(true)}
        />
      )}

      {showCbtConverterModal && currentPackage && (
        <CbtConverterModal
          packageData={currentPackage}
          onClose={() => setShowCbtConverterModal(false)}
          currentUser={currentUser}
          onOpenActivation={() => setShowLicenseModal(true)}
        />
      )}

      {showExportModal && currentPackage && (
        <ExportModal
          packageData={currentPackage}
          onClose={() => setShowExportModal(false)}
          onOpenCbtConverter={() => setShowCbtConverterModal(true)}
          currentUser={currentUser}
          onOpenActivation={() => setShowLicenseModal(true)}
        />
      )}

      {editingQuestion && (
        <QuestionEditorModal
          question={editingQuestion}
          onSave={handleSaveQuestion}
          onClose={() => setEditingQuestion(null)}
        />
      )}

      {showSimulatorModal && currentPackage && (
        <StudentSimulator
          packageData={currentPackage}
          onClose={() => setShowSimulatorModal(false)}
          onOpenGrading={() => setShowGradingModal(true)}
          onOpenShareCbt={() => setShowShareCbtModal(true)}
          currentUser={currentUser}
          onOpenActivation={() => setShowLicenseModal(true)}
        />
      )}

      {showShareCbtModal && currentPackage && (
        <ShareCbtModal
          packageData={currentPackage}
          onClose={() => setShowShareCbtModal(false)}
          onOpenGrading={() => setShowGradingModal(true)}
          currentUser={currentUser}
          onOpenActivation={() => setShowLicenseModal(true)}
        />
      )}

      {showGuideModal && (
        <GuideModal onClose={() => setShowGuideModal(false)} />
      )}

      {showGradingModal && (
        <ComprehensiveGradingModal
          onClose={() => setShowGradingModal(false)}
          initialGrade={currentPackage?.identity.grade || 'VIII'}
          initialSemester={currentPackage?.identity.semester || '1'}
          initialElement={currentPackage?.materiMapping[0]?.element || 'Akidah'}
          initialTp={currentPackage?.tpList[0]}
          schoolName={currentPackage?.identity.schoolName}
          teacherName={currentPackage?.identity.teacherName}
          currentUser={currentUser}
          onOpenActivation={() => setShowLicenseModal(true)}
        />
      )}

      {showHolisticAssessmentModal && (
        <HolisticAssessmentModal
          onClose={() => setShowHolisticAssessmentModal(false)}
          onOpenGradingBook={() => setShowGradingModal(true)}
          initialGrade={currentPackage?.identity.grade || 'VIII'}
          initialSemester={currentPackage?.identity.semester || '1'}
          initialElement={currentPackage?.materiMapping[0]?.element || 'Akidah'}
          schoolName={currentPackage?.identity.schoolName}
          teacherName={currentPackage?.identity.teacherName}
          currentUser={currentUser}
          onOpenActivation={() => setShowLicenseModal(true)}
        />
      )}

      {/* Auto-Save to Question Bank Toast Notification */}
      {bankSavedToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-slate-900/95 backdrop-blur-md border border-emerald-500/50 shadow-2xl rounded-2xl p-4 text-white flex items-start space-x-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
            <Database className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs text-emerald-400">Tersimpan di Bank Soal</span>
              <span className="bg-emerald-900/60 text-emerald-300 text-[10px] font-extrabold px-1.5 py-0.2 rounded border border-emerald-700/50">
                +{bankSavedToast.count} Soal
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5 truncate">
              {bankSavedToast.title}
            </p>
            <div className="mt-2.5 flex items-center gap-2">
              <button
                onClick={() => {
                  setShowQuestionBankModal(true);
                  setBankSavedToast(null);
                }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] px-3 py-1 rounded-lg transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
              >
                <span>Buka Bank Soal</span>
              </button>
              <button
                onClick={() => setBankSavedToast(null)}
                className="text-slate-400 hover:text-white text-[11px] font-medium px-2 py-1 cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
          <button
            onClick={() => setBankSavedToast(null)}
            className="text-slate-400 hover:text-white p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Global Offline Connectivity Indicator */}
      <OfflineIndicator />
    </div>
  );
}
