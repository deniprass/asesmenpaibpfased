import React, { useState, useMemo } from 'react';
import {
  CbtExamConfig,
  QuestionItem,
  TabSwitchAction
} from '../types';
import {
  Settings,
  X,
  Clock,
  ShieldAlert,
  HelpCircle,
  Shuffle,
  Key,
  Copy,
  Check,
  Award,
  Database,
  Filter,
  Layers,
  Sparkles,
  RotateCcw,
  CheckSquare,
  Square,
  AlertTriangle,
  Lock,
  Maximize2,
  FileText
} from 'lucide-react';

interface CbtSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: CbtExamConfig;
  onSaveConfig: (newConfig: CbtExamConfig) => void;
  questions: QuestionItem[];
  defaultTopic?: string;
  defaultElement?: string;
}

type SettingsTab = 'selection' | 'anticheat' | 'timing' | 'token_results';

export const CbtSettingsModal: React.FC<CbtSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  questions,
  defaultTopic = '',
  defaultElement = ''
}) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('selection');
  const [draftConfig, setDraftConfig] = useState<CbtExamConfig>({ ...config });
  const [copiedToken, setCopiedToken] = useState<boolean>(false);
  const [saveToast, setSaveToast] = useState<boolean>(false);

  // Sync draft when opened
  React.useEffect(() => {
    if (isOpen) {
      setDraftConfig({ ...config });
    }
  }, [isOpen, config]);

  // Extract distinct Topics/Materi
  const distinctTopics = useMemo(() => {
    const map = new Map<string, number>();
    questions.forEach(q => {
      const key = q.tema || q.materi || defaultTopic || 'Materi Umum';
      map.set(key, (map.get(key) || 0) + 1);
    });
    return Array.from(map.entries()).map(([topic, count]) => ({ topic, count }));
  }, [questions, defaultTopic]);

  // Extract distinct TPs
  const distinctTps = useMemo(() => {
    const map = new Map<string, number>();
    questions.forEach(q => {
      const key = q.tp || 'Tujuan Pembelajaran';
      map.set(key, (map.get(key) || 0) + 1);
    });
    return Array.from(map.entries()).map(([tp, count]) => ({ tp, count }));
  }, [questions]);

  // Calculate questions matching current selection draft
  const activeQuestionsCount = useMemo(() => {
    let list = [...questions];
    if (draftConfig.questionSelectionMode === 'topic' && draftConfig.selectedTopicFilter && draftConfig.selectedTopicFilter !== 'all') {
      list = list.filter(q => (q.tema === draftConfig.selectedTopicFilter) || (q.materi === draftConfig.selectedTopicFilter));
    } else if (draftConfig.questionSelectionMode === 'tp' && draftConfig.selectedTpFilter && draftConfig.selectedTpFilter !== 'all') {
      list = list.filter(q => q.tp === draftConfig.selectedTpFilter);
    } else if (draftConfig.questionSelectionMode === 'custom' && draftConfig.selectedQuestionIds && draftConfig.selectedQuestionIds.length > 0) {
      list = list.filter(q => draftConfig.selectedQuestionIds?.includes(q.number));
    }
    if (draftConfig.maxQuestionsLimit && draftConfig.maxQuestionsLimit > 0 && draftConfig.maxQuestionsLimit < list.length) {
      return draftConfig.maxQuestionsLimit;
    }
    return list.length;
  }, [questions, draftConfig]);

  if (!isOpen) return null;

  // Handlers for token
  const handleGenerateRandomToken = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let res = 'PAI-';
    for (let i = 0; i < 4; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setDraftConfig(prev => ({ ...prev, token: res }));
  };

  const handleCopyToken = () => {
    navigator.clipboard.writeText(draftConfig.token);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  // Handlers for manual question checklist
  const handleToggleQuestionId = (qNum: number) => {
    setDraftConfig(prev => {
      const current = prev.selectedQuestionIds || questions.map(q => q.number);
      const exists = current.includes(qNum);
      const next = exists ? current.filter(id => id !== qNum) : [...current, qNum];
      return { ...prev, selectedQuestionIds: next };
    });
  };

  const handleSelectAllQuestions = () => {
    setDraftConfig(prev => ({
      ...prev,
      selectedQuestionIds: questions.map(q => q.number)
    }));
  };

  const handleDeselectAllQuestions = () => {
    setDraftConfig(prev => ({
      ...prev,
      selectedQuestionIds: []
    }));
  };

  const handleSelectOnlyPg = () => {
    const pgIds = questions.filter(q => q.questionType !== 'Essay').map(q => q.number);
    setDraftConfig(prev => ({
      ...prev,
      selectedQuestionIds: pgIds
    }));
  };

  const handleSelectOnlyEssay = () => {
    const essayIds = questions.filter(q => q.questionType === 'Essay').map(q => q.number);
    setDraftConfig(prev => ({
      ...prev,
      selectedQuestionIds: essayIds
    }));
  };

  const handleResetToDefault = () => {
    setDraftConfig({
      token: 'PAI-2026',
      requireToken: true,
      durationMinutes: 45,
      minimumDurationMinutes: 5,
      shuffleQuestions: false,
      shuffleOptions: false,
      showInstantScore: true,
      showReview: true,
      allowPrintCertificate: true,
      kktpTarget: 75,
      examInstructions: '1. Kerjakan soal dengan teliti, mandiri, dan penuh kejujuran.\n2. Dilarang berpindah tab browser atau membuka jendela aplikasi lain.\n3. Periksa kembali seluruh jawaban sebelum mengklik tombol kumpulkan.',
      antiCheatWarning: true,
      detectTabSwitch: true,
      maxTabSwitchAllowed: 2,
      tabSwitchAction: 'warn',
      questionSelectionMode: 'all',
      selectedTopicFilter: 'all',
      selectedTpFilter: 'all',
      selectedQuestionIds: questions.map(q => q.number),
      maxQuestionsLimit: questions.length
    });
  };

  const handleApply = () => {
    onSaveConfig(draftConfig);
    setSaveToast(true);
    setTimeout(() => {
      setSaveToast(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* ========================================================================= */}
        {/* MODAL HEADER */}
        {/* ========================================================================= */}
        <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md font-bold">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Pengaturan Sesi Ujian CBT PAIBP
                </h3>
                <span className="bg-purple-500/20 text-purple-300 text-[10px] font-bold px-2 py-0.5 rounded border border-purple-500/30 uppercase tracking-wide">
                  Detail & Komprehensif
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Konfigurasi pemilihan soal per tema/TP, proteksi buka tab lain, alokasi waktu, token & integritas ujian
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Tutup Pengaturan"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CLOUD DATABASE REASSURANCE NOTICE */}
        {/* ========================================================================= */}
        <div className="bg-emerald-950/60 border-b border-emerald-500/20 px-5 py-2 text-xs text-emerald-200 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold">Database Cloud Firestore Aktif:</span>
            <span className="text-emerald-300">Data konfigurasi, master siswa & hasil CBT aman tersimpan permanen dan tidak akan hilang.</span>
          </div>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-500/30 hidden sm:inline">
            {activeQuestionsCount} Butir Aktif
          </span>
        </div>

        {/* ========================================================================= */}
        {/* SETTINGS TABS NAVIGATION */}
        {/* ========================================================================= */}
        <div className="bg-slate-950/60 border-b border-slate-800 px-4 flex gap-1 sm:gap-2 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('selection')}
            className={`px-3.5 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'selection'
                ? 'border-purple-500 text-purple-300 bg-purple-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Filter className="w-4 h-4 text-purple-400" />
            <span>1. Pemilihan Soal (Tema / TP)</span>
          </button>

          <button
            onClick={() => setActiveTab('anticheat')}
            className={`px-3.5 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'anticheat'
                ? 'border-rose-500 text-rose-300 bg-rose-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>2. Buka Tab Lain (Anti-Curang)</span>
          </button>

          <button
            onClick={() => setActiveTab('timing')}
            className={`px-3.5 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'timing'
                ? 'border-sky-500 text-sky-300 bg-sky-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-4 h-4 text-sky-400" />
            <span>3. Waktu Pengerjaan</span>
          </button>

          <button
            onClick={() => setActiveTab('token_results')}
            className={`px-3.5 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'token_results'
                ? 'border-amber-500 text-amber-300 bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Key className="w-4 h-4 text-amber-400" />
            <span>4. Token, Acak & Hasil</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB CONTENTS */}
        {/* ========================================================================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-xs text-slate-300">
          
          {/* TAB 1: PEMILIHAN SOAL BERDASARKAN TEMA ATAU TP */}
          {activeTab === 'selection' && (
            <div className="space-y-5">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <h4 className="font-bold text-white text-sm mb-1 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-400" />
                  Mode Penentuan Butir Soal yang Diujikan
                </h4>
                <p className="text-slate-400 text-[11px] mb-3">
                  Pilih apakah ingin mengujikan seluruh soal dalam paket, memfilter berdasarkan materi tema tertentu, Tujuan Pembelajaran (TP), atau memilih butir secara mandiri.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setDraftConfig(p => ({ ...p, questionSelectionMode: 'all' }))}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      draftConfig.questionSelectionMode === 'all'
                        ? 'bg-purple-950/70 border-purple-500 text-white shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold text-xs text-purple-300 mb-1">Semua Soal Paket</div>
                    <div className="text-[11px] text-slate-400">Gunakan seluruh {questions.length} butir soal yang telah digenerate.</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDraftConfig(p => ({
                      ...p,
                      questionSelectionMode: 'topic',
                      selectedTopicFilter: p.selectedTopicFilter === 'all' ? (distinctTopics[0]?.topic || 'all') : p.selectedTopicFilter
                    }))}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      draftConfig.questionSelectionMode === 'topic'
                        ? 'bg-purple-950/70 border-purple-500 text-white shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold text-xs text-purple-300 mb-1">Berdasarkan Tema / Materi</div>
                    <div className="text-[11px] text-slate-400">Filter butir soal hanya untuk tema pembelajaran tertentu.</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDraftConfig(p => ({
                      ...p,
                      questionSelectionMode: 'tp',
                      selectedTpFilter: p.selectedTpFilter === 'all' ? (distinctTps[0]?.tp || 'all') : p.selectedTpFilter
                    }))}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      draftConfig.questionSelectionMode === 'tp'
                        ? 'bg-purple-950/70 border-purple-500 text-white shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold text-xs text-purple-300 mb-1">Berdasarkan TP</div>
                    <div className="text-[11px] text-slate-400">Khusus menguji Tujuan Pembelajaran tertentu.</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDraftConfig(p => ({
                      ...p,
                      questionSelectionMode: 'custom',
                      selectedQuestionIds: p.selectedQuestionIds && p.selectedQuestionIds.length > 0
                        ? p.selectedQuestionIds
                        : questions.map(q => q.number)
                    }))}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      draftConfig.questionSelectionMode === 'custom'
                        ? 'bg-purple-950/70 border-purple-500 text-white shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold text-xs text-purple-300 mb-1">Pilih Butir Manual</div>
                    <div className="text-[11px] text-slate-400">Checklist butir soal mana saja yang ingin diujikan.</div>
                  </button>
                </div>
              </div>

              {/* DETAILS FOR TOPIC SELECTION */}
              {draftConfig.questionSelectionMode === 'topic' && (
                <div className="bg-slate-950 p-4 rounded-xl border border-purple-500/30 space-y-3">
                  <label className="block font-bold text-white text-xs">
                    Pilih Tema / Materi Pelajaran PAIBP:
                  </label>
                  <select
                    value={draftConfig.selectedTopicFilter || 'all'}
                    onChange={(e) => setDraftConfig(p => ({ ...p, selectedTopicFilter: e.target.value }))}
                    className="w-full bg-slate-900 border border-purple-500/40 rounded-lg p-2.5 text-xs text-white focus:ring-2 focus:ring-purple-500 font-semibold"
                  >
                    <option value="all">-- Semua Tema ({questions.length} Butir) --</option>
                    {distinctTopics.map((item, idx) => (
                      <option key={idx} value={item.topic}>
                        Tema: {item.topic} ({item.count} Butir Soal)
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-purple-300">
                    Siswa hanya akan menerima soal yang sesuai dengan materi/tema yang Anda pilih di atas.
                  </p>
                </div>
              )}

              {/* DETAILS FOR TP SELECTION */}
              {draftConfig.questionSelectionMode === 'tp' && (
                <div className="bg-slate-950 p-4 rounded-xl border border-purple-500/30 space-y-3">
                  <label className="block font-bold text-white text-xs">
                    Pilih Tujuan Pembelajaran (TP) yang Diujikan:
                  </label>
                  <select
                    value={draftConfig.selectedTpFilter || 'all'}
                    onChange={(e) => setDraftConfig(p => ({ ...p, selectedTpFilter: e.target.value }))}
                    className="w-full bg-slate-900 border border-purple-500/40 rounded-lg p-2.5 text-xs text-white focus:ring-2 focus:ring-purple-500 font-semibold"
                  >
                    <option value="all">-- Semua TP ({questions.length} Butir) --</option>
                    {distinctTps.map((item, idx) => (
                      <option key={idx} value={item.tp}>
                        TP: {item.tp.substring(0, 80)}... ({item.count} Butir)
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-purple-300">
                    Sangat cocok untuk asesmen formatif atau sumatif per Tujuan Pembelajaran tunggal.
                  </p>
                </div>
              )}

              {/* DETAILS FOR MANUAL QUESTION CHECKLIST */}
              {draftConfig.questionSelectionMode === 'custom' && (
                <div className="bg-slate-950 p-4 rounded-xl border border-purple-500/30 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
                    <div>
                      <h5 className="font-bold text-white text-xs">
                        Checklist Butir Soal ({draftConfig.selectedQuestionIds?.length || 0} Terpilih dari {questions.length})
                      </h5>
                      <span className="text-[11px] text-slate-400">Centang butir soal yang akan ditampilkan dalam lembar ujian siswa</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={handleSelectAllQuestions}
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] font-semibold"
                      >
                        Pilih Semua
                      </button>
                      <button
                        type="button"
                        onClick={handleSelectOnlyPg}
                        className="px-2 py-1 bg-purple-900/60 hover:bg-purple-800 text-purple-200 rounded text-[11px] font-semibold"
                      >
                        Hanya PG
                      </button>
                      <button
                        type="button"
                        onClick={handleSelectOnlyEssay}
                        className="px-2 py-1 bg-indigo-900/60 hover:bg-indigo-800 text-indigo-200 rounded text-[11px] font-semibold"
                      >
                        Hanya Uraian
                      </button>
                      <button
                        type="button"
                        onClick={handleDeselectAllQuestions}
                        className="px-2 py-1 bg-rose-950/60 hover:bg-rose-900 text-rose-300 rounded text-[11px] font-semibold"
                      >
                        Hapus Semua
                      </button>
                    </div>
                  </div>

                  <div className="max-h-60 overflow-y-auto space-y-2 pr-1 divide-y divide-slate-850">
                    {questions.map((q) => {
                      const isSelected = draftConfig.selectedQuestionIds?.includes(q.number);
                      const isEssay = q.questionType === 'Essay';

                      return (
                        <div
                          key={q.number}
                          onClick={() => handleToggleQuestionId(q.number)}
                          className={`p-2.5 rounded-lg flex items-start gap-3 cursor-pointer transition-colors ${
                            isSelected ? 'bg-purple-950/40 border border-purple-500/30' : 'bg-slate-900/50 hover:bg-slate-900'
                          }`}
                        >
                          <div className="mt-0.5 text-purple-400 shrink-0">
                            {isSelected ? <CheckSquare className="w-4 h-4 text-purple-400" /> : <Square className="w-4 h-4 text-slate-600" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-white text-xs">
                                Soal No. {q.number}
                              </span>
                              <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                                isEssay ? 'bg-indigo-500/20 text-indigo-300' : 'bg-sky-500/20 text-sky-300'
                              }`}>
                                {isEssay ? 'Uraian' : 'PG'}
                              </span>
                              <span className="text-[10px] text-amber-400 font-mono bg-amber-500/10 px-1 rounded">
                                {q.bloomLevel || 'C3'}
                              </span>
                              <span className="text-[10px] text-slate-400 truncate max-w-xs">
                                {q.tema || q.materi}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-300 line-clamp-2">
                              {q.questionText}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* LIMIT NUMBER OF QUESTIONS */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h5 className="font-bold text-white text-xs">
                    Batasi Jumlah Soal Maksimal yang Diujikan
                  </h5>
                  <p className="text-[11px] text-slate-400">
                    Contoh: Jika paket berisi 25 soal, Anda bisa membatasi hanya 10 atau 15 soal untuk kuis harian.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <input
                    type="number"
                    min={1}
                    max={questions.length}
                    value={draftConfig.maxQuestionsLimit ?? questions.length}
                    onChange={(e) => setDraftConfig(p => ({
                      ...p,
                      maxQuestionsLimit: Math.min(questions.length, Math.max(1, Number(e.target.value) || questions.length))
                    }))}
                    className="w-20 bg-slate-900 border border-slate-700 rounded-lg p-2 text-center text-white font-bold"
                  />
                  <span className="text-slate-400">/ {questions.length} Soal</span>
                  <button
                    type="button"
                    onClick={() => setDraftConfig(p => ({ ...p, maxQuestionsLimit: questions.length }))}
                    className="px-2 py-1 text-[11px] bg-slate-800 text-slate-300 rounded hover:text-white"
                  >
                    Semua
                  </button>
                </div>
              </div>

              {/* SUMMARY BOX */}
              <div className="bg-purple-950/40 border border-purple-500/30 rounded-xl p-3 flex items-center justify-between">
                <span className="text-purple-200">
                  <strong>Total Butir Soal Siap Diujikan:</strong> {activeQuestionsCount} butir
                </span>
                <span className="text-[11px] text-purple-300 font-bold bg-purple-500/20 px-2 py-0.5 rounded border border-purple-500/40">
                  {draftConfig.questionSelectionMode === 'all'
                    ? 'Semua Paket'
                    : draftConfig.questionSelectionMode === 'topic'
                    ? `Filter Tema: ${draftConfig.selectedTopicFilter}`
                    : draftConfig.questionSelectionMode === 'tp'
                    ? 'Filter Tujuan Pembelajaran'
                    : 'Pilihan Butir Khusus'}
                </span>
              </div>
            </div>
          )}

          {/* TAB 2: PENGATURAN BUKA TAB LAIN (ANTI-CURANG) */}
          {activeTab === 'anticheat' && (
            <div className="space-y-5">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-rose-400" />
                      Sistem Deteksi Perpindahan Tab / Jendela Browser
                    </h4>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      Mendeteksi ketika peserta didik meninggalkan jendela CBT untuk membuka Google, tab browsing lain, atau aplikasi chat.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={draftConfig.detectTabSwitch ?? true}
                      onChange={(e) => setDraftConfig(p => ({ ...p, detectTabSwitch: e.target.checked, antiCheatWarning: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-800 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
                  </label>
                </div>

                {draftConfig.detectTabSwitch && (
                  <div className="space-y-4 pt-1">
                    {/* Tolerance Count */}
                    <div>
                      <label className="block font-bold text-slate-200 mb-1.5">
                        Batas Toleransi Berpindah Tab yang Diperbolehkan:
                      </label>
                      <p className="text-[11px] text-slate-400 mb-2">
                        Berapa kali siswa diizinkan tidak sengaja berpindah jendela sebelum tindakan tegas diterapkan:
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        {[
                          { val: 0, label: '0x (Tanpa Toleransi)' },
                          { val: 1, label: '1x Toleransi' },
                          { val: 2, label: '2x (Standar Rekomendasi)' },
                          { val: 3, label: '3x Toleransi' },
                          { val: 5, label: '5x Toleransi' }
                        ].map(item => (
                          <button
                            key={item.val}
                            type="button"
                            onClick={() => setDraftConfig(p => ({ ...p, maxTabSwitchAllowed: item.val }))}
                            className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                              draftConfig.maxTabSwitchAllowed === item.val
                                ? 'bg-rose-950/80 border-rose-500 text-rose-200 font-bold shadow-md'
                                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                            }`}
                          >
                            <span className="block text-sm">{item.val}x</span>
                            <span className="text-[10px] text-slate-400">{item.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Violation Action */}
                    <div>
                      <label className="block font-bold text-slate-200 mb-1.5">
                        Tindakan Jika Melebihi Batas Toleransi Buka Tab:
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        <button
                          type="button"
                          onClick={() => setDraftConfig(p => ({ ...p, tabSwitchAction: 'warn' }))}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            draftConfig.tabSwitchAction === 'warn'
                              ? 'bg-amber-950/70 border-amber-500 text-amber-200 shadow-md'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 font-bold mb-1">
                            <AlertTriangle className="w-4 h-4 text-amber-400" />
                            <span>1. Peringatan Teguran</span>
                          </div>
                          <p className="text-[11px] text-slate-400">
                            Dialog peringatan keras muncul di layar. Siswa harus mengonfirmasi sebelum dapat lanjut menjawab.
                          </p>
                        </button>

                        <button
                          type="button"
                          onClick={() => setDraftConfig(p => ({ ...p, tabSwitchAction: 'lock' }))}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            draftConfig.tabSwitchAction === 'lock'
                              ? 'bg-orange-950/70 border-orange-500 text-orange-200 shadow-md'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 font-bold mb-1">
                            <Lock className="w-4 h-4 text-orange-400" />
                            <span>2. Kunci Layar 20 Detik</span>
                          </div>
                          <p className="text-[11px] text-slate-400">
                            Layar ujian dibekukan dengan countdown hukuman 20 detik sebelum tombol kembali aktif.
                          </p>
                        </button>

                        <button
                          type="button"
                          onClick={() => setDraftConfig(p => ({ ...p, tabSwitchAction: 'autosubmit' }))}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            draftConfig.tabSwitchAction === 'autosubmit'
                              ? 'bg-rose-950/70 border-rose-500 text-rose-200 shadow-md'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 font-bold mb-1">
                            <ShieldAlert className="w-4 h-4 text-rose-400" />
                            <span>3. Kumpulkan Otomatis</span>
                          </div>
                          <p className="text-[11px] text-slate-400">
                            Ujian seketika dihentikan dan jawaban saat itu langsung diserahkan ke sistem (Diskualifikasi).
                          </p>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Anti-cheat summary banner */}
              <div className="bg-rose-950/30 border border-rose-500/30 rounded-xl p-3 flex items-start gap-2.5">
                <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div className="text-rose-200 text-xs">
                  <strong>Penerapan Kejujuran Digital Kurikulum Merdeka:</strong>
                  <p className="text-[11px] text-rose-300/90 mt-0.5">
                    Fitur ini memantau perpindahan fokus tab browser secara presisi. Setiap kali siswa berpindah jendela, sistem akan mencatat riwayat pelanggaran dan menampilkannya di kartu hasil serta rekap pengawas ujian.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: WAKTU PENGERJAAN & ATURAN WAKTU */}
          {activeTab === 'timing' && (
            <div className="space-y-5">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <Clock className="w-4 h-4 text-sky-400" />
                  Alokasi & Manajemen Waktu Pengerjaan
                </h4>

                <div className="space-y-3">
                  <div>
                    <label className="block font-bold text-slate-200 mb-1">
                      Total Durasi Ujian CBT (Menit):
                    </label>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {[15, 30, 45, 60, 90, 120].map(mins => (
                        <button
                          key={mins}
                          type="button"
                          onClick={() => setDraftConfig(p => ({ ...p, durationMinutes: mins }))}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                            draftConfig.durationMinutes === mins
                              ? 'bg-sky-600 text-white border-sky-400 shadow-sm'
                              : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                          }`}
                        >
                          {mins} Menit
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={5}
                        max={180}
                        value={draftConfig.durationMinutes}
                        onChange={(e) => setDraftConfig(p => ({ ...p, durationMinutes: Math.max(5, Number(e.target.value) || 30) }))}
                        className="w-24 bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-bold text-center"
                      />
                      <span className="text-slate-400">Menit ({draftConfig.durationMinutes * 60} detik)</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800">
                    <label className="block font-bold text-slate-200 mb-1">
                      Waktu Minimal Pengerjaan Sebelum Boleh Mengumpulkan (Menit):
                    </label>
                    <p className="text-[11px] text-slate-400 mb-2">
                      Mencegah peserta mengklik tombol kumpulkan secara tergesa-gesa tanpa meneliti jawaban.
                    </p>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={0}
                        max={draftConfig.durationMinutes - 1}
                        value={draftConfig.minimumDurationMinutes ?? 5}
                        onChange={(e) => setDraftConfig(p => ({
                          ...p,
                          minimumDurationMinutes: Math.max(0, Math.min(draftConfig.durationMinutes - 1, Number(e.target.value) || 0))
                        }))}
                        className="w-24 bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-bold text-center"
                      />
                      <span className="text-slate-400">Menit sejak ujian dimulai</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-sky-950/40 border border-sky-500/30 rounded-xl p-3 flex items-start gap-2.5">
                <Clock className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                <div className="text-sky-200 text-xs">
                  <strong>Otomatisasi Hitung Mundur:</strong>
                  <p className="text-[11px] text-sky-300/90 mt-0.5">
                    Ketika waktu tersisa di bawah 5 menit, timer ujian di layar peserta akan berubah warna menjadi merah dengan efek detak peringatan. Saat waktu 00:00 tercapai, sistem akan secara otomatis menyimpan seluruh jawaban yang telah dipilih dan mengunci ujian.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TOKEN, ACAK SOAL & FORMAT HASIL */}
          {activeTab === 'token_results' && (
            <div className="space-y-5">
              {/* TOKEN SETTINGS */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div>
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <Key className="w-4 h-4 text-amber-400" />
                      Token Akses Ruang Ujian
                    </h4>
                    <p className="text-slate-400 text-[11px]">
                      Peserta wajib memasukkan token ini sebelum dapat memulai mengerjakan soal.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={draftConfig.requireToken ?? true}
                      onChange={(e) => setDraftConfig(p => ({ ...p, requireToken: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-800 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                  </label>
                </div>

                {draftConfig.requireToken && (
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={draftConfig.token}
                      onChange={(e) => setDraftConfig(p => ({ ...p, token: e.target.value.toUpperCase() }))}
                      className="w-44 bg-slate-900 border border-amber-500/50 rounded-lg p-2.5 text-center text-amber-300 font-mono font-bold text-base tracking-widest uppercase"
                    />
                    <button
                      type="button"
                      onClick={handleGenerateRandomToken}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Acak Token</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyToken}
                      className="px-3 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      {copiedToken ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedToken ? 'Disalin!' : 'Salin Token'}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* SHUFFLING & RANDOMIZATION */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <Shuffle className="w-4 h-4 text-purple-400" />
                  Pengacakan Soal & Opsi Jawaban
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <label className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-3 cursor-pointer hover:border-slate-700 transition-colors">
                    <input
                      type="checkbox"
                      checked={draftConfig.shuffleQuestions}
                      onChange={(e) => setDraftConfig(p => ({ ...p, shuffleQuestions: e.target.checked }))}
                      className="rounded accent-purple-600 w-4 h-4"
                    />
                    <div>
                      <span className="font-bold text-white block">Acak Urutan Butir Soal</span>
                      <span className="text-[11px] text-slate-400">Setiap peserta akan menerima urutan nomor soal yang berbeda</span>
                    </div>
                  </label>

                  <label className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-3 cursor-pointer hover:border-slate-700 transition-colors">
                    <input
                      type="checkbox"
                      checked={draftConfig.shuffleOptions ?? false}
                      onChange={(e) => setDraftConfig(p => ({ ...p, shuffleOptions: e.target.checked }))}
                      className="rounded accent-purple-600 w-4 h-4"
                    />
                    <div>
                      <span className="font-bold text-white block">Acak Urutan Pilihan Ganda (A, B, C, D)</span>
                      <span className="text-[11px] text-slate-400">Opsi jawaban diacak dengan kunci jawaban tetap terjaga akurat</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* EVALUATION & RESULT POLICY */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-400" />
                  Kebijakan Pengumuman Nilai & Evaluasi
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-start gap-2.5 cursor-pointer hover:border-slate-700 transition-colors">
                    <input
                      type="checkbox"
                      checked={draftConfig.showInstantScore}
                      onChange={(e) => setDraftConfig(p => ({ ...p, showInstantScore: e.target.checked }))}
                      className="rounded accent-emerald-600 w-4 h-4 mt-0.5"
                    />
                    <div>
                      <span className="font-bold text-white block text-xs">Tampilkan Skor Langsung</span>
                      <span className="text-[11px] text-slate-400">Peserta dapat melihat skor perolehan seketika setelah submit</span>
                    </div>
                  </label>

                  <label className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-start gap-2.5 cursor-pointer hover:border-slate-700 transition-colors">
                    <input
                      type="checkbox"
                      checked={draftConfig.showReview}
                      onChange={(e) => setDraftConfig(p => ({ ...p, showReview: e.target.checked }))}
                      className="rounded accent-emerald-600 w-4 h-4 mt-0.5"
                    />
                    <div>
                      <span className="font-bold text-white block text-xs">Tampilkan Pembahasan & Kunci</span>
                      <span className="text-[11px] text-slate-400">Siswa dapat membaca telaah pedagogik dan jawaban yang benar</span>
                    </div>
                  </label>

                  <label className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-start gap-2.5 cursor-pointer hover:border-slate-700 transition-colors">
                    <input
                      type="checkbox"
                      checked={draftConfig.allowPrintCertificate ?? true}
                      onChange={(e) => setDraftConfig(p => ({ ...p, allowPrintCertificate: e.target.checked }))}
                      className="rounded accent-emerald-600 w-4 h-4 mt-0.5"
                    />
                    <div>
                      <span className="font-bold text-white block text-xs">Izinkan Cetak Kartu Hasil</span>
                      <span className="text-[11px] text-slate-400">Tombol cetak kartu nilai CBT standar resmi aktif untuk siswa</span>
                    </div>
                  </label>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <label className="font-bold text-slate-200">
                    Nilai Target KKTP (Kriteria Ketercapaian):
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={50}
                      max={95}
                      value={draftConfig.kktpTarget ?? 75}
                      onChange={(e) => setDraftConfig(p => ({ ...p, kktpTarget: Number(e.target.value) || 75 }))}
                      className="w-20 bg-slate-900 border border-slate-700 rounded-lg p-2 text-center text-emerald-300 font-bold"
                    />
                    <span className="text-slate-400 text-xs">Poin (Skor minimal dinyatakan Tuntas)</span>
                  </div>
                </div>
              </div>

              {/* EXAM INSTRUCTIONS TEXTAREA */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <label className="block font-bold text-white text-xs">
                  Petunjuk & Tata Tertib Ujian Khusus (Tampil di Halaman Peserta):
                </label>
                <textarea
                  rows={3}
                  value={draftConfig.examInstructions ?? ''}
                  onChange={(e) => setDraftConfig(p => ({ ...p, examInstructions: e.target.value }))}
                  placeholder="Ketik petunjuk ujian..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:ring-2 focus:ring-purple-500 font-sans"
                />
              </div>
            </div>
          )}

        </div>

        {/* ========================================================================= */}
        {/* MODAL FOOTER */}
        {/* ========================================================================= */}
        <div className="bg-slate-950 px-5 py-3.5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset ke Standar</span>
          </button>

          <div className="flex items-center gap-2">
            {saveToast && (
              <span className="text-emerald-400 text-xs font-semibold animate-pulse flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                Pengaturan berhasil disimpan!
              </span>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold transition-colors cursor-pointer"
            >
              Batal
            </button>

            <button
              type="button"
              onClick={handleApply}
              className="px-5 py-2 bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-purple-900/30 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Terapkan Pengaturan CBT</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
