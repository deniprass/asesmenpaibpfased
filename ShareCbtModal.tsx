import React, { useState, useEffect } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  QrCode,
  Laptop,
  Clock,
  Key,
  ShieldAlert,
  Send,
  ExternalLink,
  Users,
  Award,
  RefreshCw,
  FileCheck,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Eye,
  Sliders
} from 'lucide-react';
import { AssessmentPackage, CbtExamConfig, PublishedCbtExam, CbtStudentResult, UserAccount } from '../types';
import {
  publishCbtExam,
  generateShareableCbtUrl,
  generateWhatsAppBroadcast,
  getAllPublishedExams
} from '../services/cbtShareService';
import { loadCbtResults } from '../services/gradingService';
import { loadCbtResultsFromDatabase } from '../services/firebaseDatabaseService';
import { Lock, AlertTriangle } from 'lucide-react';

interface ShareCbtModalProps {
  packageData: AssessmentPackage;
  onClose: () => void;
  onOpenGrading?: () => void;
  currentUser?: UserAccount | null;
  onOpenActivation?: () => void;
}

export const ShareCbtModal: React.FC<ShareCbtModalProps> = ({
  packageData,
  onClose,
  onOpenGrading,
  currentUser,
  onOpenActivation
}) => {
  const isDemo = currentUser?.role === 'demo';
  const [demoPrompt, setDemoPrompt] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'share' | 'settings' | 'history'>('share');
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [publishedExam, setPublishedExam] = useState<PublishedCbtExam | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [copiedWaText, setCopiedWaText] = useState<boolean>(false);
  const [showQrModal, setShowQrModal] = useState<boolean>(false);

  // Config options for the exam
  const [duration, setDuration] = useState<number>(
    packageData.identity.timeAllocation || (packageData.questions.length <= 10 ? 30 : 45)
  );
  const [token, setToken] = useState<string>('PAI-2026');
  const [requireToken, setRequireToken] = useState<boolean>(true);
  const [shuffleQuestions, setShuffleQuestions] = useState<boolean>(false);
  const [shuffleOptions, setShuffleOptions] = useState<boolean>(false);
  const [showInstantScore, setShowInstantScore] = useState<boolean>(true);
  const [showReview, setShowReview] = useState<boolean>(true);
  const [allowPrintCertificate, setAllowPrintCertificate] = useState<boolean>(true);
  const [kktpTarget, setKktpTarget] = useState<number>(75);
  const [antiCheatWarning, setAntiCheatWarning] = useState<boolean>(true);
  const [detectTabSwitch, setDetectTabSwitch] = useState<boolean>(true);
  const [maxTabSwitchAllowed, setMaxTabSwitchAllowed] = useState<number>(2);

  // History & Submissions
  const [publishedHistory, setPublishedHistory] = useState<PublishedCbtExam[]>([]);
  const [cbtResults, setCbtResults] = useState<CbtStudentResult[]>([]);
  const [isLoadingResults, setIsLoadingResults] = useState<boolean>(false);

  // Initial publish on mount so the teacher immediately gets a live link
  useEffect(() => {
    handlePublishExam();
    loadSubmissionsRecap();
  }, [packageData]);

  // Load history & student submissions recap
  const loadSubmissionsRecap = async () => {
    setIsLoadingResults(true);
    try {
      const history = await getAllPublishedExams();
      setPublishedHistory(history);

      const localResults = loadCbtResults();
      const cloudResults = await loadCbtResultsFromDatabase();
      const map = new Map<string, CbtStudentResult>();
      [...cloudResults, ...localResults].forEach(r => map.set(r.id, r));
      setCbtResults(Array.from(map.values()));
    } catch (e) {
      console.warn('Error loading submissions:', e);
    } finally {
      setIsLoadingResults(false);
    }
  };

  const handlePublishExam = async () => {
    setIsPublishing(true);
    const config: CbtExamConfig = {
      token,
      requireToken,
      durationMinutes: duration,
      minimumDurationMinutes: 5,
      shuffleQuestions,
      shuffleOptions,
      showInstantScore,
      showReview,
      allowPrintCertificate,
      kktpTarget,
      examInstructions: '1. Berdoalah sebelum mengerjakan soal.\n2. Kerjakan dengan jujur, teliti, dan mandiri.\n3. Dilarang membuka tab browser lain selama ujian berlangsung.',
      antiCheatWarning,
      detectTabSwitch,
      maxTabSwitchAllowed,
      tabSwitchAction: 'warn',
      questionSelectionMode: 'all',
      selectedQuestionIds: packageData.questions.map(q => q.number),
      maxQuestionsLimit: packageData.questions.length
    };

    try {
      const pub = await publishCbtExam(packageData, config);
      setPublishedExam(pub);
      // Refresh history
      getAllPublishedExams().then(list => setPublishedHistory(list));
    } catch (err) {
      console.error('Publish error:', err);
    } finally {
      setIsPublishing(false);
    }
  };

  const shareUrl = publishedExam
    ? generateShareableCbtUrl(publishedExam.id, publishedExam.requireToken ? publishedExam.token : undefined)
    : '';

  const waText = publishedExam ? generateWhatsAppBroadcast(publishedExam, shareUrl) : '';

  const handleCopyLink = () => {
    if (isDemo) {
      setDemoPrompt('Membagikan tautan CBT resmi ke siswa terkunci pada Mode Demo. Silakan aktifkan Kode Lisensi Guru!');
      return;
    }
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    });
  };

  const handleCopyCode = () => {
    if (!publishedExam) return;
    navigator.clipboard.writeText(publishedExam.code).then(() => {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 3000);
    });
  };

  const handleCopyWhatsAppText = () => {
    if (isDemo) {
      setDemoPrompt('Format siaran WhatsApp ke grup siswa hanya aktif untuk Guru Berlisensi atau Owner. Aktifkan lisensi Anda!');
      return;
    }
    if (!waText) return;
    navigator.clipboard.writeText(waText).then(() => {
      setCopiedWaText(true);
      setTimeout(() => setCopiedWaText(false), 3000);
    });
  };

  const handleOpenWhatsApp = () => {
    if (isDemo) {
      setDemoPrompt('Siaran langsung ke WhatsApp siswa terkunci pada Mode Demo. Silakan aktifkan Kode Lisensi Guru!');
      return;
    }
    if (!waText) return;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(waText)}`;
    window.open(url, '_blank');
  };

  const handleTestStudentView = () => {
    if (!shareUrl) return;
    window.open(shareUrl, '_blank');
  };

  // Filter submissions for this specific exam
  const examSubmissions = cbtResults.filter(
    r =>
      r.examTitle.trim().toLowerCase() === packageData.identity.title.trim().toLowerCase() ||
      r.examTitle.includes(packageData.identity.title)
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-linear-to-r from-emerald-800 via-teal-800 to-sky-900 px-6 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-white/10 rounded-xl backdrop-blur-xs">
              <Share2 className="w-5 h-5 text-emerald-300" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight">
                Bagikan Link CBT ke Siswa
              </h2>
              <p className="text-xs text-emerald-100/90 line-clamp-1">
                {packageData.identity.title} ({packageData.questions.length} Butir Soal • Kelas {packageData.identity.grade})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('share')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'share'
                ? 'border-emerald-600 text-emerald-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Link & Broadcast Ujian</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'settings'
                ? 'border-emerald-600 text-emerald-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Pengaturan & Token</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'history'
                ? 'border-emerald-600 text-emerald-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Rekap Hasil Siswa ({examSubmissions.length})</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* TAB 1: SHARE & BROADCAST */}
          {activeTab === 'share' && (
            <div className="space-y-5">
              {/* Cloud Ready Banner */}
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong>Link CBT Siap Digunakan Siswa:</strong> Siswa dapat langsung membuka link ini di HP, tablet, atau laptop tanpa memerlukan akun login. Semua hasil ujian akan <strong>otomatis terekap ke dalam sistem buku nilai guru</strong>.
                </div>
              </div>

              {/* DEMO RESTRICTION BANNER */}
              {isDemo && (
                <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-300 text-xs text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-start gap-2.5">
                    <Lock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold block text-slate-900">Mode Demo: Bagikan Link Siswa Dibatasi</strong>
                      <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                        Fitur membagikan tautan CBT online dan siaran WhatsApp ke siswa secara valid hanya aktif untuk <strong>Guru Berlisensi</strong> atau <strong>Owner</strong>. Anda dapat mencoba simulasi di menu <em>Ujian CBT Langsung</em>.
                      </p>
                    </div>
                  </div>
                  {onOpenActivation && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenActivation();
                      }}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs shrink-0 flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer w-fit"
                    >
                      <Key className="w-3.5 h-3.5" />
                      <span>Aktifkan Lisensi Guru</span>
                    </button>
                  )}
                </div>
              )}

              {demoPrompt && (
                <div className="p-3 bg-rose-50 border border-rose-300 text-rose-800 rounded-xl text-xs flex items-center justify-between">
                  <span className="flex items-center gap-2 font-medium">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    {demoPrompt}
                  </span>
                  <button onClick={() => setDemoPrompt('')} className="text-rose-500 hover:text-rose-800 font-bold">✕</button>
                </div>
              )}

              {/* Main Shareable Link Box */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Tautan / Link CBT Siswa (URL Valid)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-mono focus:outline-none select-all"
                  />
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer shrink-0"
                  >
                    {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? 'Tersalin!' : 'Salin Link'}</span>
                  </button>
                </div>
              </div>

              {/* Quick Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block uppercase">Token Ujian</span>
                    <span className="text-sm font-mono font-bold text-emerald-700">{token}</span>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                    {requireToken ? 'Wajib' : 'Bebas'}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block uppercase">Kode Ujian Singkat</span>
                    <span className="text-sm font-mono font-bold text-sky-700">{publishedExam?.code || 'PAI-2026'}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="text-[11px] text-slate-500 hover:text-slate-800 font-semibold"
                  >
                    {copiedCode ? 'Tersalin' : 'Salin'}
                  </button>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block uppercase">Durasi Pengerjaan</span>
                    <span className="text-sm font-bold text-slate-800">{duration} Menit</span>
                  </div>
                  <Clock className="w-4 h-4 text-slate-400" />
                </div>
              </div>

              {/* Action Buttons: WhatsApp & Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleOpenWhatsApp}
                  className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim ke WhatsApp Kelas</span>
                </button>

                <button
                  type="button"
                  onClick={handleTestStudentView}
                  className="py-3 px-4 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4 text-slate-300" />
                  <span>Buka Uji Coba Tampilan Siswa</span>
                </button>
              </div>

              {/* WhatsApp Broadcast Template Box */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Draf Pesan Siap Kirim (Grup WhatsApp Siswa / Wali Murid):</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyWhatsAppText}
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedWaText ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedWaText ? 'Tersalin' : 'Salin Pesan'}</span>
                  </button>
                </div>
                <div className="text-[11px] text-slate-600 font-mono bg-white p-3 rounded-lg border border-slate-200 max-h-36 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                  {waText}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EXAM CONFIG & SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                Sesuaikan parameter pelaksanaan ujian sebelum atau sesudah membagikan tautan. Perubahan akan otomatis diperbarui.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Durasi Waktu Ujian (Menit)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="180"
                    value={duration}
                    onChange={e => setDuration(Number(e.target.value) || 30)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Token Masuk Ujian
                  </label>
                  <input
                    type="text"
                    value={token}
                    onChange={e => setToken(e.target.value.toUpperCase())}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800 uppercase"
                  />
                </div>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-slate-200">
                <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={requireToken}
                    onChange={e => setRequireToken(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Wajibkan token untuk memulai pengerjaan</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={shuffleQuestions}
                    onChange={e => setShuffleQuestions(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Acak urutan butir soal untuk setiap siswa</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showInstantScore}
                    onChange={e => setShowInstantScore(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Tampilkan nilai akhir langsung setelah siswa mengumpulkan</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showReview}
                    onChange={e => setShowReview(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Izinkan siswa melihat review pembahasan kunci jawaban</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={detectTabSwitch}
                    onChange={e => setDetectTabSwitch(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Aktifkan deteksi anti-curang (perpindahan tab/jendela browser)</span>
                </label>
              </div>

              <div className="pt-3">
                <button
                  type="button"
                  disabled={isPublishing}
                  onClick={handlePublishExam}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isPublishing ? 'animate-spin' : ''}`} />
                  <span>{isPublishing ? 'Memperbarui...' : 'Simpan & Perbarui Tautan Ujian'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: SUBMISSIONS RECAP */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Rekap Peserta Didik yang Telah Mengerjakan
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Total {examSubmissions.length} siswa telah mengumpulkan hasil CBT
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={loadSubmissionsRecap}
                    className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs"
                    title="Segarkan data terbaru"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingResults ? 'animate-spin' : ''}`} />
                  </button>

                  {onOpenGrading && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenGrading();
                      }}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <FileCheck className="w-3.5 h-3.5" />
                      <span>Buka Buku Nilai 3 Ranah</span>
                    </button>
                  )}
                </div>
              </div>

              {examSubmissions.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200">
                  <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-600">Belum ada siswa yang mengumpulkan.</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Bagikan tautan CBT ke grup kelas. Nilai akan otomatis muncul di sini setelah siswa menekan tombol kumpulkan.
                  </p>
                </div>
              ) : (
                <div className="border border-slate-200 rounded-xl overflow-hidden max-h-72 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] sticky top-0">
                      <tr>
                        <th className="p-2.5">No</th>
                        <th className="p-2.5">Nama Siswa</th>
                        <th className="p-2.5">NIS</th>
                        <th className="p-2.5">Kelas</th>
                        <th className="p-2.5 text-center">Skor</th>
                        <th className="p-2.5 text-center">Status</th>
                        <th className="p-2.5">Waktu Selesai</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      {examSubmissions.map((res, idx) => {
                        const isTuntas = res.score >= 75;
                        return (
                          <tr key={res.id || idx} className="hover:bg-slate-50">
                            <td className="p-2.5 font-semibold text-slate-500">{idx + 1}</td>
                            <td className="p-2.5 font-bold text-slate-900">{res.studentName}</td>
                            <td className="p-2.5 font-mono text-slate-600">{res.nis}</td>
                            <td className="p-2.5 text-slate-600">{res.classGroup}</td>
                            <td className="p-2.5 text-center font-bold font-mono text-sm">
                              <span className={isTuntas ? 'text-emerald-600' : 'text-amber-600'}>
                                {res.score}
                              </span>
                            </td>
                            <td className="p-2.5 text-center">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  isTuntas ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {isTuntas ? 'TUNTAS' : 'REMEDIAL'}
                              </span>
                            </td>
                            <td className="p-2.5 text-[11px] text-slate-500">{res.submittedAt}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500">
            {publishedExam ? (
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Tersimpan di Cloud Firestore • Kode: <strong>{publishedExam.code}</strong></span>
              </span>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
