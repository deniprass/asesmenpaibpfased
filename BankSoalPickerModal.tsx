import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Search,
  BookOpen,
  Sparkles,
  Check,
  Plus,
  Filter,
  CheckCircle2,
  Database,
  Layers,
  ArrowRight
} from 'lucide-react';
import { QuestionItem, GradeLevel, PaibpElement, BloomLevel } from '../types';
import { fetchAllBankQuestions, SavedBankQuestion } from '../services/questionBankService';

interface BankSoalPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  grade: GradeLevel;
  defaultElement?: string;
  currentQuestionsCount: number;
  onImportQuestions: (questions: QuestionItem[], mode: 'append' | 'replace') => void;
}

export const BankSoalPickerModal: React.FC<BankSoalPickerModalProps> = ({
  isOpen,
  onClose,
  grade,
  defaultElement = 'all',
  currentQuestionsCount,
  onImportQuestions
}) => {
  const [bankQuestions, setBankQuestions] = useState<SavedBankQuestion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Filters
  const [elementFilter, setElementFilter] = useState<string>(defaultElement || 'all');
  const [bloomFilter, setBloomFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'standard' | 'generated'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setIsLoading(true);

    fetchAllBankQuestions()
      .then(res => {
        if (!isMounted) return;
        setBankQuestions(res.all);
      })
      .catch(err => {
        console.warn('Gagal memuat bank soal:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  // Filtered list
  const filtered = useMemo(() => {
    return bankQuestions.filter(q => {
      // Must match grade if specified
      if (grade && q.grade !== grade) return false;

      // Element filter
      if (elementFilter !== 'all' && q.element !== elementFilter) return false;

      // Bloom level
      if (bloomFilter !== 'all' && q.bloomLevel !== bloomFilter) return false;

      // Source filter
      if (sourceFilter === 'standard' && q.isCustomGenerated) return false;
      if (sourceFilter === 'generated' && !q.isCustomGenerated) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const textMatch = (q.questionText || '').toLowerCase().includes(query);
        const stimulusMatch = (q.stimulus || '').toLowerCase().includes(query);
        const materiMatch = (q.materi || '').toLowerCase().includes(query);
        const indicatorMatch = (q.indicator || '').toLowerCase().includes(query);
        if (!textMatch && !stimulusMatch && !materiMatch && !indicatorMatch) return false;
      }

      return true;
    });
  }, [bankQuestions, grade, elementFilter, bloomFilter, sourceFilter, searchQuery]);

  if (!isOpen) return null;

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const handleSelectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map(q => q.id)));
    }
  };

  const handleApply = (mode: 'append' | 'replace') => {
    const selectedItems = bankQuestions.filter(q => selectedIds.has(q.id));
    if (selectedItems.length === 0) return;

    const cleanedQuestions: QuestionItem[] = selectedItems.map((item, idx) => ({
      number: idx + 1,
      indicator: item.indicator || '',
      stimulus: item.stimulus || '',
      questionText: item.questionText,
      options: item.options || [],
      correctKey: item.correctKey,
      explanation: item.explanation || '',
      bloomLevel: item.bloomLevel || 'C3',
      soloLevel: item.soloLevel || 'Multistructural',
      deepLearningDim: item.deepLearningDim || 'Meaningful Learning',
      difficulty: item.difficulty || 'Sedang',
      questionType: item.questionType || 'Pilihan Ganda',
      tp: item.tp || 'Tujuan Pembelajaran',
      materi: item.materi || 'Materi PAIBP',
      submateri: item.submateri || '',
      element: String(item.element || 'Akidah')
    }));

    onImportQuestions(cleanedQuestions, mode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-linear-to-r from-purple-800 via-indigo-800 to-slate-900 px-6 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-white/10 rounded-xl backdrop-blur-xs">
              <Database className="w-5 h-5 text-purple-300" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold tracking-tight">
                  Integrasi Bank Soal ke CBT
                </h3>
                <span className="bg-purple-500/20 text-purple-200 border border-purple-400/30 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  Kelas {grade} (Fase D)
                </span>
              </div>
              <p className="text-xs text-purple-100/80">
                Pilih butir soal terstandar dari Bank Soal untuk ditambahkan atau menggantikan soal CBT aktif (Saat ini: {currentQuestionsCount} soal).
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-2.5 shrink-0 text-xs">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Elemen PAIBP
            </label>
            <select
              value={elementFilter}
              onChange={e => setElementFilter(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
            >
              <option value="all">Semua Elemen</option>
              <option value="Al-Qur'an Hadis">Al-Qur'an Hadis</option>
              <option value="Akidah">Akidah</option>
              <option value="Akhlak">Akhlak</option>
              <option value="Fikih">Fikih</option>
              <option value="Sejarah Peradaban Islam">Sejarah Peradaban Islam</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Level Taksonomi Bloom
            </label>
            <select
              value={bloomFilter}
              onChange={e => setBloomFilter(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
            >
              <option value="all">Semua Level (C1-C6)</option>
              <option value="C1">C1 - Mengingat</option>
              <option value="C2">C2 - Memahami</option>
              <option value="C3">C3 - Menerapkan</option>
              <option value="C4">C4 - Menganalisis (HOTS)</option>
              <option value="C5">C5 - Mengevaluasi (HOTS)</option>
              <option value="C6">C6 - Mencipta (HOTS)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Sumber Koleksi
            </label>
            <select
              value={sourceFilter}
              onChange={e => setSourceFilter(e.target.value as any)}
              className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
            >
              <option value="all">Semua Koleksi Bank</option>
              <option value="standard">Standar Kurikulum 2026</option>
              <option value="generated">Hasil Generate Guru</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Cari Teks / Indikator
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cari materi..."
                className="w-full bg-white border border-slate-300 rounded-lg pl-8 pr-2.5 py-1.5 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Action bar for multi-selection */}
        <div className="py-2.5 px-4 bg-purple-50/70 border-b border-purple-100 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSelectAll}
              className="font-bold text-purple-900 hover:text-purple-700 flex items-center gap-1.5 cursor-pointer"
            >
              <span className={`w-4 h-4 rounded border flex items-center justify-center ${selectedIds.size > 0 && selectedIds.size === filtered.length ? 'bg-purple-600 border-purple-600 text-white' : 'border-slate-400 bg-white'}`}>
                {selectedIds.size > 0 && <Check className="w-3 h-3" />}
              </span>
              <span>{selectedIds.size === filtered.length ? 'Batal Pilih Semua' : 'Pilih Semua'} ({filtered.length} Soal Tersedia)</span>
            </button>
            {selectedIds.size > 0 && (
              <span className="bg-purple-200 text-purple-900 font-extrabold px-2 py-0.5 rounded text-[11px]">
                {selectedIds.size} butir dipilih
              </span>
            )}
          </div>
          <span className="text-[11px] text-slate-500">
            Total {bankQuestions.length} soal di Bank Soal
          </span>
        </div>

        {/* Question List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {isLoading ? (
            <div className="text-center py-12 text-slate-400">
              <div className="w-8 h-8 border-3 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs font-semibold text-slate-600">Memuat butir soal dari Bank Soal...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Database className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              <p className="font-bold text-sm text-slate-600">Tidak ada soal yang cocok dengan kriteria filter</p>
              <p className="text-xs text-slate-400 mt-1">Coba pilih "Semua Elemen" atau sesuaikan kata kunci pencarian.</p>
            </div>
          ) : (
            filtered.map((q) => {
              const isSelected = selectedIds.has(q.id);

              return (
                <div
                  key={q.id}
                  onClick={() => toggleSelect(q.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-purple-500 bg-purple-50/40 shadow-xs ring-1 ring-purple-400/40'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex flex-wrap items-center gap-1.5 text-xs">
                      <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${isSelected ? 'bg-purple-600 border-purple-600 text-white' : 'border-slate-300 bg-white'}`}>
                        {isSelected && <Check className="w-3 h-3" />}
                      </span>
                      {q.isCustomGenerated ? (
                        <span className="bg-purple-100 text-purple-900 font-extrabold text-[10px] px-2 py-0.5 rounded">
                          Hasil Generate
                        </span>
                      ) : (
                        <span className="bg-emerald-100 text-emerald-900 font-bold text-[10px] px-2 py-0.5 rounded">
                          Standar 2026
                        </span>
                      )}
                      <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        Kelas {q.grade}
                      </span>
                      <span className="bg-sky-100 text-sky-800 font-semibold px-2 py-0.5 rounded text-[11px]">
                        {String(q.element)}
                      </span>
                      <span className="bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded text-[11px]">
                        {q.bloomLevel}
                      </span>
                      <span className="bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded text-[11px]">
                        {q.difficulty}
                      </span>
                    </div>
                  </div>

                  {q.stimulus && (
                    <div className="p-2.5 bg-slate-50 rounded-lg text-xs italic text-slate-700 border-l-2 border-purple-400 mb-2">
                      {q.stimulus}
                    </div>
                  )}

                  <p className="text-xs font-medium text-slate-900 leading-relaxed mb-2.5">
                    {q.questionText}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                    {(q.options || []).map(opt => (
                      <div
                        key={opt.key}
                        className={`p-2 rounded-lg border flex items-start gap-2 ${
                          opt.key === q.correctKey
                            ? 'bg-emerald-50/80 border-emerald-300 font-semibold text-emerald-950'
                            : 'bg-slate-50/70 border-slate-200 text-slate-700'
                        }`}
                      >
                        <span className={`w-5 h-5 rounded flex items-center justify-center font-bold text-[11px] shrink-0 ${opt.key === q.correctKey ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
                          {opt.key}
                        </span>
                        <span className="leading-snug">{opt.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-600">
            {selectedIds.size > 0 ? (
              <span className="font-semibold text-purple-900">
                {selectedIds.size} butir soal dipilih dari Bank Soal
              </span>
            ) : (
              <span>Pilih minimal 1 butir soal untuk diintegrasikan ke CBT</span>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Batal
            </button>

            <button
              type="button"
              disabled={selectedIds.size === 0}
              onClick={() => handleApply('append')}
              className="flex-1 sm:flex-none px-4 py-2 bg-purple-700 hover:bg-purple-600 disabled:opacity-40 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
              title="Menambahkan soal terpilih ke dalam daftar soal CBT yang sudah ada"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambahkan (+{selectedIds.size} Soal)</span>
            </button>

            <button
              type="button"
              disabled={selectedIds.size === 0}
              onClick={() => handleApply('replace')}
              className="flex-1 sm:flex-none px-4 py-2 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
              title="Mengganti seluruh soal CBT dengan soal terpilih dari Bank Soal"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Ganti Seluruh Soal CBT</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
