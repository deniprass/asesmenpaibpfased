import React, { useState, useMemo } from 'react';
import { 
  X, 
  Search, 
  BookOpen, 
  CheckCircle2, 
  Layers, 
  GraduationCap, 
  Calendar, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Bookmark,
  Compass
} from 'lucide-react';
import { PaibpElement, GradeLevel, Semester } from '../types';
import { 
  CP_THEMES_CLASSIFICATION, 
  OFFICIAL_CP_CLAUSES 
} from '../data/cpThemesData';
import { CURRICULUM_TOPICS, CurriculumTopic } from '../data/curriculumData';

interface ThemeCatalogModalProps {
  onClose: () => void;
  onSelectTopic: (topic: CurriculumTopic, temaName: string) => void;
}

export const ThemeCatalogModal: React.FC<ThemeCatalogModalProps> = ({
  onClose,
  onSelectTopic
}) => {
  const [selectedElement, setSelectedElement] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedSemester, setSelectedSemester] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeThemeId, setActiveThemeId] = useState<string>(CP_THEMES_CLASSIFICATION[0].themeId);

  const elementsList: PaibpElement[] = [
    "Al-Qur'an Hadis",
    "Akidah",
    "Akhlak",
    "Fikih",
    "Sejarah Peradaban Islam"
  ];

  // Filtered themes
  const filteredThemes = useMemo(() => {
    return CP_THEMES_CLASSIFICATION.filter(theme => {
      const matchElem = selectedElement === 'all' || theme.element === selectedElement;
      const matchGrade = selectedGrade === 'all' || theme.recommendedGrades.includes(selectedGrade as GradeLevel);
      const matchSem = selectedSemester === 'all' || theme.recommendedSemesters.includes(selectedSemester as Semester);
      const kw = searchQuery.toLowerCase().trim();
      const matchSearch = !kw || 
        theme.temaName.toLowerCase().includes(kw) ||
        theme.description.toLowerCase().includes(kw) ||
        theme.submateriScope.some(s => s.toLowerCase().includes(kw)) ||
        theme.element.toLowerCase().includes(kw) ||
        theme.dalilReference.toLowerCase().includes(kw);

      return matchElem && matchGrade && matchSem && matchSearch;
    });
  }, [selectedElement, selectedGrade, selectedSemester, searchQuery]);

  const activeTheme = useMemo(() => {
    return filteredThemes.find(t => t.themeId === activeThemeId) || filteredThemes[0] || CP_THEMES_CLASSIFICATION[0];
  }, [filteredThemes, activeThemeId]);

  // Find corresponding CurriculumTopic
  const matchingTopic = useMemo(() => {
    if (!activeTheme) return CURRICULUM_TOPICS[0];
    return CURRICULUM_TOPICS.find(t => t.temaCode === activeTheme.themeId || t.tema === activeTheme.temaName) ||
      CURRICULUM_TOPICS.find(t => t.element === activeTheme.element) ||
      CURRICULUM_TOPICS[0];
  }, [activeTheme]);

  const handleApplyTheme = () => {
    if (matchingTopic && activeTheme) {
      onSelectTopic(matchingTopic, activeTheme.temaName);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-2xl max-w-5xl w-full h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center font-bold shadow-sm">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Katalog & Klasifikasi Tema Kurikulum CP PAIBP
                </h3>
                <span className="bg-sky-500/30 text-sky-300 text-[10px] font-bold px-2 py-0.5 rounded border border-sky-400/40">
                  Keputusan No. 020/2026
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Klasifikasi terstruktur seluruh Capaian Pembelajaran Fase D (Kelas VII, VIII, IX) menjadi tema-tema pembelajaran mendalam
              </p>
            </div>
          </div>

          <button
            id="btn-close-theme-catalog"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters Toolbar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="input-theme-catalog-search"
              type="text"
              placeholder="Cari tema, materi, dalil, atau CP..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500 shadow-2xs"
            />
          </div>

          {/* Quick Selectors */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <select
              id="select-catalog-element"
              value={selectedElement}
              onChange={(e) => setSelectedElement(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:ring-2 focus:ring-sky-500 shadow-2xs"
            >
              <option value="all">Semua Elemen CP (5 Elemen)</option>
              {elementsList.map(elem => (
                <option key={elem} value={elem}>{elem}</option>
              ))}
            </select>

            <select
              id="select-catalog-grade"
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:ring-2 focus:ring-sky-500 shadow-2xs"
            >
              <option value="all">Semua Kelas (VII, VIII, IX)</option>
              <option value="VII">Kelas VII</option>
              <option value="VIII">Kelas VIII</option>
              <option value="IX">Kelas IX</option>
            </select>

            <select
              id="select-catalog-semester"
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:ring-2 focus:ring-sky-500 shadow-2xs"
            >
              <option value="all">Semua Semester (1 & 2)</option>
              <option value="1">Semester 1</option>
              <option value="2">Semester 2</option>
            </select>
          </div>
        </div>

        {/* Modal Main Body: 2-Column (Sidebar List + Detail Panel) */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* Left Column: List of Classified Themes */}
          <div className="md:col-span-5 lg:col-span-4 border-r border-slate-200 overflow-y-auto p-3 space-y-2 bg-slate-50/40">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-2 py-1 flex items-center justify-between">
              <span>Tema Terklasifikasi</span>
              <span className="bg-sky-100 text-sky-800 text-[10px] px-1.5 py-0.5 rounded font-bold">
                {filteredThemes.length} Tema
              </span>
            </div>

            {filteredThemes.length === 0 ? (
              <div className="text-center py-10 text-xs text-slate-400">
                Tidak ada tema yang cocok dengan filter pencarian.
              </div>
            ) : (
              filteredThemes.map((t) => {
                const isSelected = activeTheme?.themeId === t.themeId;
                return (
                  <button
                    key={t.themeId}
                    onClick={() => setActiveThemeId(t.themeId)}
                    className={`w-full text-left p-3 rounded-xl transition-all border ${
                      isSelected
                        ? 'bg-sky-50/90 border-sky-300 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {t.element}
                      </span>
                      <div className="flex items-center space-x-1 text-[10px] font-semibold text-slate-500">
                        <span>Kls {t.recommendedGrades.join(', ')}</span>
                        <span>•</span>
                        <span>Sem {t.recommendedSemesters.join(', ')}</span>
                      </div>
                    </div>
                    <div className={`text-xs font-bold ${isSelected ? 'text-sky-900' : 'text-slate-800'}`}>
                      {t.temaName}
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                      {t.description}
                    </p>
                  </button>
                );
              })
            )}
          </div>

          {/* Right Column: Active Theme Deep Dive Details */}
          <div className="md:col-span-7 lg:col-span-8 p-6 overflow-y-auto space-y-5 bg-white">
            {activeTheme ? (
              <>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="bg-sky-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded">
                      {activeTheme.element}
                    </span>
                    <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded border border-emerald-200">
                      Kelas {activeTheme.recommendedGrades.join(', ')} (Semester {activeTheme.recommendedSemesters.join(', ')})
                    </span>
                    <span className="bg-slate-100 text-slate-700 text-[11px] font-semibold px-2 py-0.5 rounded border border-slate-200">
                      ID: {activeTheme.themeId}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-slate-900 leading-snug">
                    {activeTheme.temaName}
                  </h2>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {activeTheme.description}
                  </p>
                </div>

                {/* CP Mandate Snippet */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                    <span>Klausul Capaian Pembelajaran (CP) Resmi Terkait</span>
                  </div>
                  <p className="text-xs text-slate-800 leading-relaxed italic bg-white p-2.5 rounded-lg border border-slate-200">
                    "{activeTheme.cpClause}"
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1.5">
                    Dasar Regulasi: Keputusan Kepala Badan Kebijakan Pendidikan Dasar dan Menengah Nomor 020 Tahun 2026.
                  </p>
                </div>

                {/* Submateri Scope */}
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-sky-600" />
                    <span>Ruang Lingkup Materi & Submateri</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeTheme.submateriScope.map((sub, i) => (
                      <div key={i} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-2">
                        <span className="w-4 h-4 rounded bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span>{sub}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dalil Reference */}
                <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200">
                  <div className="text-[11px] font-bold text-amber-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Bookmark className="w-3.5 h-3.5 text-amber-700" />
                    <span>Rujukan Dalil Naqli: {activeTheme.dalilReference}</span>
                  </div>
                  {activeTheme.dalilMeaning && (
                    <p className="text-xs text-amber-950 leading-relaxed italic">
                      "{activeTheme.dalilMeaning}"
                    </p>
                  )}
                </div>

                {/* Suggested Learning Outcomes (TP) */}
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-sky-600" />
                    <span>Rekomendasi Tujuan Pembelajaran (TP) Berbasis Deep Learning</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {activeTheme.suggestedTpList.map((tp, idx) => (
                      <li key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{tp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Real-life Context Examples */}
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                    <span>Contoh Konteks Nyata / Stimulus Soal HOTS</span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {activeTheme.contextExamples.map((ctx, idx) => (
                      <span key={idx} className="bg-slate-100 text-slate-700 text-xs px-3 py-1 rounded-full border border-slate-200">
                        💡 {ctx}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action to use this theme in Assessment Generator */}
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-4">
                  <div className="text-xs text-slate-500">
                    Tema ini siap dimuat secara instan ke formulir pembuatan asesmen.
                  </div>
                  <button
                    id="btn-apply-selected-theme"
                    onClick={handleApplyTheme}
                    className="bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold px-5 py-2.5 rounded-lg shadow-sm transition-colors flex items-center gap-2"
                  >
                    <span>Gunakan Tema Ini untuk Asesmen</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-20 text-slate-400 text-xs">
                Pilih tema di kolom sebelah kiri untuk melihat rincian klasifikasi kurikulum CP.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
