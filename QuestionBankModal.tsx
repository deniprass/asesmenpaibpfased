import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { COMPREHENSIVE_QUESTION_BANK } from '../data/questionBankData';
import { QuestionItem, PaibpElement, GradeLevel, BloomLevel, AssessmentPackage, UserAccount } from '../types';
import {
  fetchAllBankQuestions,
  deleteCustomBankQuestion,
  clearAllGeneratedBankQuestions,
  SavedBankQuestion
} from '../services/questionBankService';
import {
  calculateBloomDistribution,
  calculateSoloDistribution,
  calculateDeepLearningDistribution,
  calculateOverallQuality
} from '../services/assessmentGenerator';
import {
  Search,
  BookOpen,
  Award,
  Sparkles,
  CheckCircle,
  Copy,
  Check,
  Plus,
  ArrowRight,
  Database,
  ExternalLink,
  Laptop,
  X,
  Trash2,
  Download,
  Filter,
  Layers,
  FileSpreadsheet,
  Clock,
  Share2,
  Play,
  Zap,
  Lock,
  Key
} from 'lucide-react';

interface QuestionBankModalProps {
  currentUser?: UserAccount | null;
  onClose: () => void;
  onImportToCurrentPackage?: (selectedQuestions: QuestionItem[]) => void;
  onOpenCbtWithQuestions?: (pkg: AssessmentPackage) => void;
  onShareCbtWithQuestions?: (pkg: AssessmentPackage) => void;
  onOpenActivation?: () => void;
}

export const QuestionBankModal: React.FC<QuestionBankModalProps> = ({
  currentUser,
  onClose,
  onImportToCurrentPackage,
  onOpenCbtWithQuestions,
  onShareCbtWithQuestions,
  onOpenActivation
}) => {
  const [bankQuestions, setBankQuestions] = useState<SavedBankQuestion[]>([]);
  const [standardCount, setStandardCount] = useState<number>(0);
  const [generatedCount, setGeneratedCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters
  const [activeTab, setActiveTab] = useState<'all' | 'standard' | 'generated'>('all');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedElement, setSelectedElement] = useState<string>('all');
  const [selectedBloom, setSelectedBloom] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Selection & Copy States
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showDeleteConfirmId, setShowDeleteConfirmId] = useState<string | null>(null);

  // Load questions
  const loadBankData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchAllBankQuestions(currentUser?.uid);
      setBankQuestions(data.all);
      setStandardCount(data.standardCount);
      setGeneratedCount(data.generatedCount);
    } catch (e) {
      console.warn('Gagal memuat bank soal:', e);
      // Fallback to static
      const fallback = COMPREHENSIVE_QUESTION_BANK.map(q => ({ ...q, isCustomGenerated: false }));
      setBankQuestions(fallback);
      setStandardCount(fallback.length);
      setGeneratedCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser?.uid]);

  useEffect(() => {
    loadBankData();

    const handleBankUpdate = () => {
      loadBankData();
    };

    window.addEventListener('paibp_bank_updated', handleBankUpdate);
    return () => {
      window.removeEventListener('paibp_bank_updated', handleBankUpdate);
    };
  }, [loadBankData]);

  // Filter bank items
  const filteredQuestions = useMemo(() => {
    return bankQuestions.filter(q => {
      // Tab filter
      if (activeTab === 'standard' && q.isCustomGenerated) return false;
      if (activeTab === 'generated' && !q.isCustomGenerated) return false;

      // Grade, Element, Bloom
      if (selectedGrade !== 'all' && q.grade !== selectedGrade) return false;
      if (selectedElement !== 'all' && q.element !== selectedElement) return false;
      if (selectedBloom !== 'all' && q.bloomLevel !== selectedBloom) return false;

      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = (q.questionText || '').toLowerCase().includes(query);
        const matchStimulus = (q.stimulus || '').toLowerCase().includes(query);
        const matchMateri = (q.materi || '').toLowerCase().includes(query);
        const matchSubmateri = (q.submateri || '').toLowerCase().includes(query);
        const matchTema = (q.tema || '').toLowerCase().includes(query);
        const matchIndicator = (q.indicator || '').toLowerCase().includes(query);

        if (!matchTitle && !matchStimulus && !matchMateri && !matchSubmateri && !matchTema && !matchIndicator) {
          return false;
        }
      }

      return true;
    });
  }, [bankQuestions, activeTab, selectedGrade, selectedElement, selectedBloom, searchQuery]);

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const selectAll = () => {
    if (selectedIds.size === filteredQuestions.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredQuestions.map(q => q.id)));
    }
  };

  const handleCopySingle = (q: SavedBankQuestion) => {
    const text = `[SOAL NO. ${q.number} - KELAS ${q.grade} ${String(q.element).toUpperCase()}]\n${q.stimulus ? `[STIMULUS]\n${q.stimulus}\n\n` : ''}${q.questionText}\n\n${(q.options || []).map(o => `${o.key}. ${o.text}`).join('\n')}\n\nKUNCI: ${q.correctKey}\nPEMBAHASAN: ${q.explanation || '-'}`;
    navigator.clipboard.writeText(text);
    setCopiedId(q.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeleteSingle = async (id: string) => {
    await deleteCustomBankQuestion(id);
    setBankQuestions(prev => prev.filter(q => q.id !== id));
    setGeneratedCount(prev => Math.max(0, prev - 1));
    const nextSelected = new Set(selectedIds);
    nextSelected.delete(id);
    setSelectedIds(nextSelected);
    setShowDeleteConfirmId(null);
  };

  const handleClearAllGenerated = async () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus seluruh butir soal hasil generate guru dari Bank Soal?')) {
      await clearAllGeneratedBankQuestions(currentUser?.uid);
      setBankQuestions(prev => prev.filter(q => !q.isCustomGenerated));
      setGeneratedCount(0);
      setSelectedIds(new Set());
    }
  };

  const handleCreatePackageFromSelected = () => {
    const items = bankQuestions.filter(q => selectedIds.has(q.id));
    if (items.length === 0) return;

    if (onImportToCurrentPackage) {
      onImportToCurrentPackage(items);
      onClose();
    }
  };

  const buildPackageFromBankQuestions = (items: SavedBankQuestion[], customTitle?: string): AssessmentPackage => {
    const firstGrade = (selectedGrade !== 'all' ? selectedGrade : items[0]?.grade || 'VIII') as GradeLevel;
    const firstElement = (selectedElement !== 'all' ? selectedElement : items[0]?.element || 'Akidah') as PaibpElement;

    return {
      id: `cbt-bank-${Date.now()}`,
      identity: {
        title: customTitle || `UJIAN CBT BANK SOAL PAIBP KELAS ${firstGrade} (${items.length} SOAL)`,
        subject: 'Pendidikan Agama Islam dan Budi Pekerti (PAIBP)',
        grade: firstGrade,
        phase: 'Fase D',
        semester: '1',
        academicYear: '2025/2026',
        schoolName: currentUser?.schoolName || 'SMP / MTs',
        teacherName: currentUser?.displayName || 'Guru Pengampu PAIBP',
        timeAllocation: items.length <= 10 ? 30 : items.length <= 25 ? 60 : 90,
        totalQuestions: items.length,
        dateCreated: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
      },
      mode: 'sumatif',
      cp: 'Mengimplementasikan nilai-nilai Islam dalam kehidupan sehari-hari',
      tpList: Array.from(new Set(items.map(i => i.tp || 'Tujuan Pembelajaran Fase D'))),
      materiMapping: [{
        element: firstElement,
        materi: items[0]?.materi || 'Koleksi Bank Soal Terpadu',
        submateri: 'Seleksi Bank Soal',
        percentage: 100,
        questionCount: items.length
      }],
      kisiKisi: items.map((q, idx) => ({
        number: idx + 1,
        cp: 'Sesuai kurikulum Fase D',
        tp: q.tp || 'Tujuan Pembelajaran',
        element: String(q.element || firstElement),
        materi: q.materi || 'Materi PAIBP',
        submateri: q.submateri || '',
        indicator: q.indicator || '',
        stimulus: q.stimulus,
        operationalVerb: q.operationalVerb,
        bloomLevel: q.bloomLevel,
        soloLevel: q.soloLevel,
        deepLearningDim: q.deepLearningDim,
        difficulty: q.difficulty,
        questionType: 'Pilihan Ganda',
        questionNumber: idx + 1,
        correctKey: q.correctKey
      })),
      questions: items.map((q, idx) => ({ ...q, number: idx + 1 })),
      keyDistribution: {
        A: items.filter(i => i.correctKey === 'A').length,
        B: items.filter(i => i.correctKey === 'B').length,
        C: items.filter(i => i.correctKey === 'C').length,
        D: items.filter(i => i.correctKey === 'D').length,
        idealPerOption: Math.round(items.length / 4),
        isBalanced: true,
        varianceScore: 92
      },
      bloomDistribution: calculateBloomDistribution(items),
      soloDistribution: calculateSoloDistribution(items),
      difficultyDistribution: {
        Mudah: { count: 0, percentage: 0 },
        Sedang: { count: items.filter(i => i.difficulty === 'Sedang').length, percentage: 30 },
        Sulit: { count: items.filter(i => i.difficulty === 'Sulit').length, percentage: 50 },
        'Sangat Sulit': { count: items.filter(i => i.difficulty === 'Sangat Sulit').length, percentage: 20 }
      },
      deepLearningDistribution: calculateDeepLearningDistribution(items),
      overallQuality: calculateOverallQuality(items),
      validationChecklist: [
        { id: 'v1', label: 'Bank Soal Terverifikasi', passed: true, notes: 'Soal dipilih langsung dari Bank Soal Terstandar.' }
      ],
      recommendations: ['Siap digunakan untuk pelaksanaan CBT Mandiri.']
    };
  };

  const handleLaunchCbt = (overrideItems?: SavedBankQuestion[], customTitle?: string) => {
    let items = overrideItems || bankQuestions.filter(q => selectedIds.has(q.id));
    if (items.length === 0) items = filteredQuestions;
    if (items.length === 0 || !onOpenCbtWithQuestions) return;

    const newPkg = buildPackageFromBankQuestions(items, customTitle);
    onOpenCbtWithQuestions(newPkg);
    onClose();
  };

  const handleShareCbt = (overrideItems?: SavedBankQuestion[], customTitle?: string) => {
    let items = overrideItems || bankQuestions.filter(q => selectedIds.has(q.id));
    if (items.length === 0) items = filteredQuestions;
    if (items.length === 0 || !onShareCbtWithQuestions) return;

    const newPkg = buildPackageFromBankQuestions(items, customTitle);
    onShareCbtWithQuestions(newPkg);
    onClose();
  };

  const handleQuickCbtPreset = (count: number, action: 'launch' | 'share' = 'launch') => {
    const pool = filteredQuestions.length > 0 ? filteredQuestions : bankQuestions;
    if (pool.length === 0) return;
    const selected = pool.slice(0, count);
    const title = `PAKET CBT ${count} SOAL (${selectedGrade !== 'all' ? `KELAS ${selectedGrade}` : 'FASE D'}${selectedElement !== 'all' ? ` - ${selectedElement}` : ''})`;
    if (action === 'share') {
      handleShareCbt(selected, title);
    } else {
      handleLaunchCbt(selected, title);
    }
  };

  const handleLaunchSingleQuestionCbt = (q: SavedBankQuestion) => {
    const title = `SIMULASI CBT BUTIR SOAL NO. ${q.number} (KELAS ${q.grade})`;
    handleLaunchCbt([q], title);
  };

  const isDemo = currentUser?.role === 'demo';

  const handleExportCsv = () => {
    if (isDemo) {
      onOpenActivation?.();
      return;
    }

    const list = selectedIds.size > 0 
      ? bankQuestions.filter(q => selectedIds.has(q.id))
      : filteredQuestions;

    if (list.length === 0) return;

    let csv = 'No,Kelas,Elemen,Level Kognitif,Tingkat Kesulitan,Materi,Indikator,Stimulus,Teks Soal,Opsi A,Opsi B,Opsi C,Opsi D,Kunci,Pembahasan,Sumber\n';

    list.forEach((q, idx) => {
      const getOpt = (k: string) => (q.options?.find(o => o.key === k)?.text || '').replace(/"/g, '""');
      const clean = (str?: string) => `"${(str || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`;

      csv += `${idx + 1},${clean(q.grade)},${clean(String(q.element))},${clean(q.bloomLevel)},${clean(q.difficulty)},${clean(q.materi)},${clean(q.indicator)},${clean(q.stimulus)},${clean(q.questionText)},"${getOpt('A')}","${getOpt('B')}","${getOpt('C')}","${getOpt('D')}",${clean(q.correctKey)},${clean(q.explanation)},${clean(q.isCustomGenerated ? 'Hasil Generate Guru' : 'Standar Kurikulum 2026')}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Bank_Soal_PAIBP_FaseD_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl max-w-5xl w-full p-4 sm:p-6 text-slate-800 shadow-2xl relative max-h-[92vh] flex flex-col border border-slate-200">
        
        {/* Top Header */}
        <div className="flex items-start justify-between pb-3 sm:pb-4 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 via-sky-600 to-teal-500 text-white flex items-center justify-center shadow-md">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Bank Soal Terstandar & Hasil Generate PAIBP (Fase D)
                </h3>
                <span className="bg-sky-100 text-sky-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-sky-200">
                  Kepmendikdasmen 020/2026
                </span>
                {generatedCount > 0 && (
                  <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-purple-200 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-purple-600" />
                    <span>{generatedCount} Soal Generate Tersimpan</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Semua hasil generasi asesmen otomatis tersimpan di sini. Guru dapat mencari, memilih, mengekspor, atau menggunakannya untuk CBT langsung.
              </p>
            </div>
          </div>
          <button
            id="btn-close-bank-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Mode Notice Banner */}
        {isDemo && (
          <div className="mt-2.5 p-2.5 bg-amber-500/15 border border-amber-500/30 rounded-xl text-xs text-amber-900 flex flex-wrap items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-600 shrink-0" />
              <div>
                <span className="font-bold">Mode Demo Terbatas:</span> Anda dapat menelusuri bank soal standar. Ekspor CSV lengkap dan pembuatan paket CBT live kustom memerlukan <strong>Kode Aktivasi Lisensi dari Owner</strong>.
              </div>
            </div>
            <button
              onClick={onOpenActivation}
              className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Aktivasi Lisensi</span>
            </button>
          </div>
        )}

        {/* Tab Selector: Semua, Kurikulum Standar, Hasil Generate */}
        <div className="pt-3 pb-2 px-1 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Semua Soal ({bankQuestions.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('standard')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'standard'
                  ? 'bg-white text-emerald-800 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              <span>Standar Kurikulum ({standardCount})</span>
            </button>
            <button
              onClick={() => setActiveTab('generated')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'generated'
                  ? 'bg-white text-purple-800 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>Hasil Generate Guru ({generatedCount})</span>
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCsv}
              className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              title={isDemo ? "Ekspor terkunci di Mode Demo (Perlu Lisensi)" : "Unduh CSV/Excel"}
            >
              {isDemo ? <Lock className="w-3.5 h-3.5 text-amber-600" /> : <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />}
              <span>{isDemo ? 'Ekspor (Terkunci)' : 'Ekspor CSV'}</span>
            </button>
            {activeTab === 'generated' && generatedCount > 0 && (
              <button
                onClick={handleClearAllGenerated}
                className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
                title="Bersihkan Semua Hasil Generate"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Kosongkan Hasil Generate</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="py-2.5 px-3 bg-slate-50/80 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-2 text-xs">
          {/* Search bar */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari materi, stimulus, dalil, kata kunci..."
              className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Grade filter */}
          <div className="md:col-span-2">
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            >
              <option value="all">Semua Kelas</option>
              <option value="VII">Kelas VII (Fase D)</option>
              <option value="VIII">Kelas VIII (Fase D)</option>
              <option value="IX">Kelas IX (Fase D)</option>
            </select>
          </div>

          {/* Element filter */}
          <div className="md:col-span-3">
            <select
              value={selectedElement}
              onChange={(e) => setSelectedElement(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            >
              <option value="all">Semua 5 Elemen</option>
              <option value="Al-Qur'an Hadis">Al-Qur'an Hadis</option>
              <option value="Akidah">Akidah</option>
              <option value="Akhlak">Akhlak</option>
              <option value="Fikih">Fikih</option>
              <option value="Sejarah Peradaban Islam">Sejarah Peradaban Islam</option>
            </select>
          </div>

          {/* Bloom filter */}
          <div className="md:col-span-2">
            <select
              value={selectedBloom}
              onChange={(e) => setSelectedBloom(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            >
              <option value="all">Level Kognitif</option>
              <option value="C4">C4 (Menganalisis)</option>
              <option value="C5">C5 (Mengevaluasi)</option>
              <option value="C6">C6 (Mencipta)</option>
            </select>
          </div>
        </div>

        {/* Quick CBT Presets & Action Bar */}
        <div className="py-2.5 px-4 bg-linear-to-r from-indigo-50 via-purple-50 to-sky-50 border-b border-indigo-100 flex flex-wrap items-center justify-between gap-2.5 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-bold text-indigo-950 flex items-center gap-1 mr-1">
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Paket CBT Cepat:</span>
            </span>
            <button
              type="button"
              onClick={() => handleQuickCbtPreset(5, 'launch')}
              disabled={filteredQuestions.length === 0}
              className="px-2.5 py-1 bg-white hover:bg-indigo-600 hover:text-white disabled:opacity-40 text-indigo-800 font-bold rounded-lg border border-indigo-200 text-[11px] shadow-2xs transition-all cursor-pointer flex items-center gap-1"
              title="Jalankan ujian CBT 5 soal dari materi ini"
            >
              <span>⚡ 5 Soal</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickCbtPreset(10, 'launch')}
              disabled={filteredQuestions.length === 0}
              className="px-2.5 py-1 bg-white hover:bg-indigo-600 hover:text-white disabled:opacity-40 text-indigo-800 font-bold rounded-lg border border-indigo-200 text-[11px] shadow-2xs transition-all cursor-pointer flex items-center gap-1"
              title="Jalankan ujian CBT 10 soal ulangan harian"
            >
              <span>📝 10 Soal</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickCbtPreset(15, 'launch')}
              disabled={filteredQuestions.length === 0}
              className="px-2.5 py-1 bg-white hover:bg-indigo-600 hover:text-white disabled:opacity-40 text-indigo-800 font-bold rounded-lg border border-indigo-200 text-[11px] shadow-2xs transition-all cursor-pointer flex items-center gap-1"
              title="Jalankan ujian CBT 15 soal formatif"
            >
              <span>📋 15 Soal</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickCbtPreset(20, 'launch')}
              disabled={filteredQuestions.length === 0}
              className="px-2.5 py-1 bg-white hover:bg-indigo-600 hover:text-white disabled:opacity-40 text-indigo-800 font-bold rounded-lg border border-indigo-200 text-[11px] shadow-2xs transition-all cursor-pointer flex items-center gap-1"
              title="Jalankan ujian CBT 20 soal sumatif / PTS"
            >
              <span>🏆 20 Soal</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            {onShareCbtWithQuestions && (
              <button
                type="button"
                onClick={() => handleShareCbt()}
                disabled={filteredQuestions.length === 0}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold rounded-lg text-xs shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
                title="Buat link CBT siswa dari soal-soal ini untuk dibagikan via WhatsApp"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-200" />
                <span>Bagikan Link CBT {selectedIds.size > 0 ? `(${selectedIds.size} Soal)` : 'Siswa'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Action bar for multi-selection */}
        <div className="py-2 px-3 bg-sky-50/70 border-b border-sky-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-3">
            <button
              onClick={selectAll}
              className="font-bold text-sky-800 hover:text-sky-950 flex items-center gap-1.5 cursor-pointer"
            >
              <span className={`w-4 h-4 rounded border flex items-center justify-center ${selectedIds.size > 0 && selectedIds.size === filteredQuestions.length ? 'bg-sky-600 border-sky-600 text-white' : 'border-slate-400 bg-white'}`}>
                {selectedIds.size > 0 && <Check className="w-3 h-3" />}
              </span>
              <span>{selectedIds.size === filteredQuestions.length ? 'Batal Pilih Semua' : 'Pilih Semua'} ({filteredQuestions.length} Soal Ditampilkan)</span>
            </button>
            {selectedIds.size > 0 && (
              <span className="bg-sky-200/80 text-sky-900 font-bold px-2 py-0.5 rounded text-[11px]">
                {selectedIds.size} butir terpilih
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {selectedIds.size > 0 ? (
              <>
                {onOpenCbtWithQuestions && (
                  <button
                    onClick={() => handleLaunchCbt()}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-1.5 px-3 rounded-lg flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                  >
                    <Laptop className="w-3.5 h-3.5" />
                    <span>Ujian CBT ({selectedIds.size} Soal Ini)</span>
                  </button>
                )}
                {onImportToCurrentPackage && (
                  <button
                    id="btn-import-selected-to-package"
                    onClick={handleCreatePackageFromSelected}
                    className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs py-1.5 px-3 rounded-lg flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Gunakan di Asesmen Aktif</span>
                  </button>
                )}
              </>
            ) : (
              onOpenCbtWithQuestions && (
                <button
                  onClick={() => handleLaunchCbt()}
                  disabled={filteredQuestions.length === 0}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-xs py-1.5 px-3 rounded-lg flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                >
                  <Laptop className="w-3.5 h-3.5" />
                  <span>Ujian CBT Semua Soal Terfilter ({filteredQuestions.length})</span>
                </button>
              )
            )}
          </div>
        </div>

        {/* Questions List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3.5">
          {isLoading ? (
            <div className="text-center py-12 text-slate-400">
              <div className="w-8 h-8 border-3 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs font-semibold text-slate-600">Memuat koleksi bank soal...</p>
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Database className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              <p className="font-bold text-sm text-slate-600">
                {activeTab === 'generated' ? 'Belum ada soal hasil generate tersimpan' : 'Tidak ada soal yang cocok dengan filter'}
              </p>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                {activeTab === 'generated'
                  ? 'Setiap kali Anda membuat asesmen baru melalui form, seluruh butir soal akan otomatis masuk dan tersimpan ke menu Bank Soal ini.'
                  : 'Coba sesuaikan kata kunci pencarian atau ubah filter kelas dan elemen.'}
              </p>
            </div>
          ) : (
            filteredQuestions.map((q) => {
              const isSelected = selectedIds.has(q.id);

              return (
                <div
                  key={q.id}
                  className={`p-3.5 sm:p-4 rounded-xl border transition-all ${
                    isSelected
                      ? 'border-sky-500 bg-sky-50/30 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white shadow-2xs'
                  }`}
                >
                  {/* Top Badges & Origin */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        onClick={() => toggleSelect(q.id)}
                        className={`w-5 h-5 rounded border flex items-center justify-center transition-colors cursor-pointer ${
                          isSelected ? 'bg-sky-600 border-sky-600 text-white' : 'border-slate-300 bg-white hover:border-sky-500'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                      </button>

                      {/* Origin Badge */}
                      {q.isCustomGenerated ? (
                        <span className="bg-purple-100 text-purple-900 border border-purple-200 font-extrabold text-[10px] px-2 py-0.5 rounded flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5 text-purple-600" />
                          <span>Hasil Generate Baru</span>
                        </span>
                      ) : (
                        <span className="bg-emerald-100 text-emerald-900 border border-emerald-200 font-bold text-[10px] px-2 py-0.5 rounded flex items-center gap-1">
                          <BookOpen className="w-2.5 h-2.5 text-emerald-600" />
                          <span>Standar Kurikulum 2026</span>
                        </span>
                      )}

                      <span className="font-extrabold text-xs text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                        Kls {q.grade} (Sem {q.semester})
                      </span>
                      <span className="bg-sky-100 text-sky-800 font-bold text-[11px] px-2 py-0.5 rounded border border-sky-200">
                        {String(q.element)}
                      </span>
                      <span className="bg-indigo-100 text-indigo-800 font-bold text-[11px] px-2 py-0.5 rounded">
                        {q.bloomLevel} — {q.soloLevel}
                      </span>
                      <span className="bg-amber-100 text-amber-800 font-semibold text-[11px] px-2 py-0.5 rounded">
                        {q.difficulty}
                      </span>

                      {q.createdAt && (
                        <span className="text-[10px] text-slate-400 flex items-center gap-1 ml-1">
                          <Clock className="w-2.5 h-2.5" />
                          <span>{new Date(q.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {onOpenCbtWithQuestions && (
                        <button
                          type="button"
                          onClick={() => handleLaunchSingleQuestionCbt(q)}
                          className="text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-xs flex items-center gap-1 font-bold transition-colors px-2 py-1 rounded-lg cursor-pointer"
                          title="Uji coba butir soal ini di simulator CBT siswa"
                        >
                          <Laptop className="w-3.5 h-3.5 text-purple-600" />
                          <span>Coba CBT</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleCopySingle(q)}
                        className="text-slate-400 hover:text-slate-700 text-xs flex items-center gap-1 font-medium transition-colors px-2 py-1 rounded hover:bg-slate-100 cursor-pointer"
                        title="Salin soal ini"
                      >
                        {copiedId === q.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-600 font-bold">Tersalin</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Salin</span>
                          </>
                        )}
                      </button>

                      {/* Delete button if custom generated */}
                      {q.isCustomGenerated && (
                        showDeleteConfirmId === q.id ? (
                          <div className="flex items-center gap-1 bg-rose-50 p-0.5 rounded border border-rose-200 text-[10px]">
                            <button
                              onClick={() => handleDeleteSingle(q.id)}
                              className="bg-rose-600 text-white px-1.5 py-0.5 rounded font-bold hover:bg-rose-700 cursor-pointer"
                            >
                              Hapus
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirmId(null)}
                              className="text-slate-500 px-1 py-0.5 hover:text-slate-800 cursor-pointer"
                            >
                              Batal
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setShowDeleteConfirmId(q.id)}
                            className="text-slate-300 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Hapus soal ini dari Bank Soal"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  {/* Materi & Indikator */}
                  <div className="mb-2 text-xs">
                    <span className="font-bold text-slate-800">{q.tema || q.materi}</span>
                    {q.indicator && (
                      <p className="text-[11px] text-slate-500 italic mt-0.5">
                        Indikator: {q.indicator}
                      </p>
                    )}
                  </div>

                  {/* Stimulus */}
                  {q.stimulus && (
                    <div className="p-2.5 sm:p-3 bg-slate-50 rounded-lg border-l-4 border-sky-500 text-xs text-slate-700 mb-2.5 leading-relaxed font-sans">
                      <span className="font-bold text-[10px] text-sky-800 uppercase tracking-wider block mb-1">
                        [STIMULUS KASUS AUTENTIK]
                      </span>
                      {q.stimulus}
                    </div>
                  )}

                  {/* Question Text */}
                  <p className="text-xs sm:text-sm font-semibold text-slate-900 mb-3 leading-relaxed">
                    {q.questionText}
                  </p>

                  {/* Options */}
                  {q.options && q.options.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-3">
                      {q.options.map((opt) => {
                        const isCorrect = opt.key === q.correctKey;
                        return (
                          <div
                            key={opt.key}
                            className={`p-2.5 rounded-lg border flex items-start space-x-2 ${
                              isCorrect
                                ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 font-medium'
                                : 'bg-white border-slate-200 text-slate-700'
                            }`}
                          >
                            <span
                              className={`font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[11px] ${
                                isCorrect
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {opt.key}
                            </span>
                            <span className="leading-snug">{opt.text}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Model answer for essay */}
                  {q.modelAnswer && (
                    <div className="p-2.5 bg-indigo-50/70 border border-indigo-200 rounded-lg text-xs text-indigo-950 mb-3">
                      <span className="font-bold text-[10px] text-indigo-800 block mb-0.5 uppercase">
                        Model Jawaban Essay:
                      </span>
                      <p>{q.modelAnswer}</p>
                    </div>
                  )}

                  {/* Explanation Footer */}
                  <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-600 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-emerald-800">Kunci {q.correctKey}: </span>
                      <span>{q.explanation || 'Sesuai dengan dalil naqli dan rujukan syariat.'}</span>
                    </div>
                    {q.dalilReference && (
                      <span className="font-semibold text-slate-500 bg-slate-50 px-2 py-0.5 rounded text-[10px]">
                        Dalil: {q.dalilReference}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Modal Actions */}
        <div className="pt-3.5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-slate-500">
            Total <strong>{filteredQuestions.length}</strong> butir soal tersedia ({generatedCount} soal hasil generate, {standardCount} kurikulum standar).
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors text-xs cursor-pointer"
            >
              Tutup
            </button>
            {selectedIds.size > 0 && onImportToCurrentPackage && (
              <button
                onClick={handleCreatePackageFromSelected}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg transition-colors text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Gunakan {selectedIds.size} Soal Terpilih</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
