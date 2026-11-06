import React, { useState, useMemo } from 'react';
import {
  X,
  Award,
  Heart,
  Zap,
  BookOpen,
  Printer,
  Copy,
  Check,
  Sparkles,
  Layers,
  Compass,
  FileCheck,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  BookmarkCheck,
  ArrowRight,
  Lock,
  Key
} from 'lucide-react';
import {
  GradeLevel,
  Semester,
  PaibpElement,
  AssessmentDomainType,
  AssessmentApproachType,
  HolisticTpAssessmentGuide,
  UserAccount
} from '../types';
import {
  CURRICULUM_TOPICS,
  CurriculumTopic
} from '../data/curriculumData';
import {
  generateHolisticAssessmentGuide,
  printHolisticAssessmentDocument,
  ELEMENT_ASSESSMENT_SPECS
} from '../services/assessmentRubricService';

interface HolisticAssessmentModalProps {
  onClose: () => void;
  onOpenGradingBook?: () => void;
  initialGrade?: GradeLevel;
  initialSemester?: Semester;
  initialElement?: PaibpElement | string;
  initialTopicId?: string;
  schoolName?: string;
  teacherName?: string;
  currentUser?: UserAccount | null;
  onOpenActivation?: () => void;
}

export const HolisticAssessmentModal: React.FC<HolisticAssessmentModalProps> = ({
  onClose,
  onOpenGradingBook,
  initialGrade = 'VIII',
  initialSemester = '1',
  initialElement = 'Akidah',
  initialTopicId,
  schoolName = 'SMP Negeri 1 Nusantara',
  teacherName = 'Guru Pengampu PAIBP',
  currentUser,
  onOpenActivation
}) => {
  const isDemo = currentUser?.role === 'demo';
  // Navigation & Filter
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(initialGrade);
  const [selectedSemester, setSelectedSemester] = useState<Semester>(initialSemester);
  const [selectedElement, setSelectedElement] = useState<PaibpElement>(
    (initialElement as PaibpElement) || 'Akidah'
  );

  // Available topics for selected Grade, Semester, & Element
  const availableTopics = useMemo(() => {
    return CURRICULUM_TOPICS.filter(
      t =>
        t.grade === selectedGrade &&
        t.semester === selectedSemester &&
        (t.element === selectedElement || (selectedElement === "Al-Qur'an Hadis" && t.element.includes("Qur'an")))
    );
  }, [selectedGrade, selectedSemester, selectedElement]);

  const [selectedTopicId, setSelectedTopicId] = useState<string>(
    initialTopicId || availableTopics[0]?.id || 'custom-topic'
  );

  // Keep topic selection synchronized
  const currentTopic = useMemo(() => {
    const found = availableTopics.find(t => t.id === selectedTopicId);
    if (found) return found;
    return availableTopics[0] || CURRICULUM_TOPICS[0];
  }, [availableTopics, selectedTopicId]);

  const [selectedTpIndex, setSelectedTpIndex] = useState<number>(0);
  const currentTpText =
    currentTopic.suggestedTpList[selectedTpIndex] ||
    currentTopic.suggestedTpList[0] ||
    `Peserta didik mampu menganalisis dan menerapkan nilai-nilai ${currentTopic.materi}`;

  // Active Tab: 'domains' | 'elements' | 'approaches' | 'rubric_tables'
  const [activeMainTab, setActiveMainTab] = useState<
    'domains' | 'elements' | 'approaches' | 'rubric_tables'
  >('domains');

  // Sub Tab for domains: 'kognitif' | 'afektif' | 'psikomotorik'
  const [activeDomainSubTab, setActiveDomainSubTab] = useState<AssessmentDomainType>('kognitif');

  // Sub Tab for approaches: 'diagnostik' | 'formatif' | 'sumatif' | 'autentik_p5ppra'
  const [activeApproachSubTab, setActiveApproachSubTab] = useState<AssessmentApproachType>('diagnostik');

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Generate holistic guide
  const guide: HolisticTpAssessmentGuide = useMemo(() => {
    return generateHolisticAssessmentGuide(currentTopic, currentTpText);
  }, [currentTopic, currentTpText]);

  const handleCopyText = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handlePrint = () => {
    if (isDemo) {
      onOpenActivation?.();
      return;
    }
    printHolisticAssessmentDocument(guide, schoolName, teacherName);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-7xl max-h-[94vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* ========================================================================= */}
        {/* 1. HEADER MODAL */}
        {/* ========================================================================= */}
        <div className="bg-slate-900 text-white px-5 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md font-bold">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Sistem Penilaian & Asesmen Holistik PAIBP 2026
                </h2>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30 uppercase tracking-wide">
                  3 Ranah • 5 Elemen • 4 Pendekatan
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Instrumen Otentik Kurikulum Merdeka Fase D (Kognitif, Afektif, Psikomotorik & Proyek P5PPRA per TP)
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {onOpenGradingBook && (
              <button
                onClick={() => {
                  onClose();
                  onOpenGradingBook();
                }}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                title="Buka Buku Nilai untuk Menginput Skor Siswa"
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>Buka Buku Nilai Siswa</span>
              </button>
            )}

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              title={isDemo ? "Fitur cetak terkunci di Mode Demo (Perlu Lisensi)" : "Cetak Seluruh Perangkat Instrumen & Rubrik Asesmen Ini"}
            >
              {isDemo ? <Lock className="w-3.5 h-3.5 text-amber-300" /> : <Printer className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isDemo ? 'Cetak (Terkunci)' : 'Cetak Dokumen Asesmen'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
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
                <span className="font-bold">Mode Demo Terbatas:</span> Anda dapat menelaah instrumen rubrik di layar. Cetak resmi seluruh perangkat asesmen dan modul ajar memerlukan <strong>Kode Aktivasi Lisensi dari Owner</strong>.
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
        {/* 2. BAR FILTER TOPIK & TUJUAN PEMBELAJARAN */}
        {/* ========================================================================= */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 shrink-0">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Filter Kelas, Sem, Elemen */}
            <div className="md:col-span-5 flex flex-wrap sm:flex-nowrap gap-2 items-center">
              <div className="w-28 shrink-0">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Kelas
                </label>
                <select
                  value={selectedGrade}
                  onChange={(e) => {
                    const g = e.target.value as GradeLevel;
                    setSelectedGrade(g);
                    setSelectedTpIndex(0);
                  }}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="VII">Kelas VII (Fase D)</option>
                  <option value="VIII">Kelas VIII (Fase D)</option>
                  <option value="IX">Kelas IX (Fase D)</option>
                </select>
              </div>

              <div className="w-24 shrink-0">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Semester
                </label>
                <select
                  value={selectedSemester}
                  onChange={(e) => {
                    const s = e.target.value as Semester;
                    setSelectedSemester(s);
                    setSelectedTpIndex(0);
                  }}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500"
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
                  onChange={(e) => {
                    const elem = e.target.value as PaibpElement;
                    setSelectedElement(elem);
                    setSelectedTpIndex(0);
                  }}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-emerald-900 focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Al-Qur'an Hadis">Al-Qur'an Hadis</option>
                  <option value="Akidah">Akidah</option>
                  <option value="Akhlak">Akhlak</option>
                  <option value="Fikih">Fikih</option>
                  <option value="Sejarah Peradaban Islam">Sejarah Peradaban Islam</option>
                </select>
              </div>
            </div>

            {/* Pemilihan Tujuan Pembelajaran */}
            <div className="md:col-span-7">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>Tujuan Pembelajaran (TP) yang Diases:</span>
                <span className="text-emerald-700 font-bold">
                  Dalil: {currentTopic.dalilReference}
                </span>
              </label>
              <select
                value={selectedTpIndex}
                onChange={(e) => setSelectedTpIndex(Number(e.target.value))}
                className="w-full bg-white border border-emerald-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 shadow-2xs"
              >
                {currentTopic.suggestedTpList.map((tp, idx) => (
                  <option key={idx} value={idx}>
                    TP {idx + 1}: {tp}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. TABS UTAMA (3 RANAH, 5 ELEMEN, 4 PENDEKATAN, RUBRIK PENILAIAN LENGKAP) */}
        {/* ========================================================================= */}
        <div className="border-b border-slate-200 px-5 pt-2 flex flex-wrap gap-2 bg-white shrink-0">
          <button
            onClick={() => setActiveMainTab('domains')}
            className={`px-3 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeMainTab === 'domains'
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Award className="w-4 h-4 text-emerald-600" />
            <span>1. Tiga Ranah Kompetensi (Kognitif, Afektif, Psikomotorik)</span>
          </button>

          <button
            onClick={() => setActiveMainTab('elements')}
            className={`px-3 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeMainTab === 'elements'
                ? 'border-sky-600 text-sky-700 bg-sky-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4 text-sky-600" />
            <span>2. Panduan Asesmen Elemen ({guide.element})</span>
          </button>

          <button
            onClick={() => setActiveMainTab('approaches')}
            className={`px-3 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeMainTab === 'approaches'
                ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Compass className="w-4 h-4 text-indigo-600" />
            <span>3. Empat Pendekatan Asesmen (Diagnostik, Formatif, Sumatif, P5PPRA)</span>
          </button>

          <button
            onClick={() => setActiveMainTab('rubric_tables')}
            className={`px-3 py-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeMainTab === 'rubric_tables'
                ? 'border-purple-600 text-purple-700 bg-purple-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-4 h-4 text-purple-600" />
            <span>4. Tabel Rubrik 4 Jenjang Capaian (Perlu Bimbingan s.d. Sangat Mahir)</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* 4. CONTENT AREA */}
        {/* ========================================================================= */}
        <div className="flex-1 overflow-auto bg-slate-50 p-4 sm:p-5">
          {/* TAB 1: TIGA RANAH KOMPETENSI */}
          {activeMainTab === 'domains' && (
            <div className="space-y-4">
              {/* Domain Subtabs */}
              <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-slate-200">
                <button
                  onClick={() => setActiveDomainSubTab('kognitif')}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    activeDomainSubTab === 'kognitif'
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  <span>Ranah Kognitif (Pengetahuan)</span>
                </button>
                <button
                  onClick={() => setActiveDomainSubTab('afektif')}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    activeDomainSubTab === 'afektif'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Heart className="w-4 h-4" />
                  <span>Ranah Afektif (Sikap & Budi Pekerti)</span>
                </button>
                <button
                  onClick={() => setActiveDomainSubTab('psikomotorik')}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    activeDomainSubTab === 'psikomotorik'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  <span>Ranah Psikomotorik (Keterampilan & Praktik)</span>
                </button>
              </div>

              {/* Detail Ranah Kognitif */}
              {activeDomainSubTab === 'kognitif' && (
                <div className="bg-white rounded-xl border border-sky-200 shadow-xs p-4 sm:p-5 space-y-4">
                  <div className="flex items-start justify-between border-b border-sky-100 pb-3">
                    <div>
                      <span className="text-[10px] font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded uppercase tracking-wider">
                        Taksonomi Pengetahuan Holistik
                      </span>
                      <h3 className="text-base font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                        <Award className="w-5 h-5 text-sky-600" />
                        Ranah Kognitif (Pengetahuan & Penalaran Agama)
                      </h3>
                      <p className="text-xs text-slate-600 mt-1">
                        Menilai pemahaman konsep keagamaan, hafalan dalil naqli, dan pemikiran kritis (HOTS) terhadap ajaran Islam pada TP: <em>"{guide.tp}"</em>.
                      </p>
                    </div>
                    <span className="bg-sky-50 text-sky-900 text-xs font-bold px-3 py-1.5 rounded-lg border border-sky-200 shrink-0">
                      Standar Bobot: 40%
                    </span>
                  </div>

                  {/* 3 Sub-Aspek Kognitif */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-sky-50/60 p-3.5 rounded-xl border border-sky-100 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-sky-950">
                        <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                        <span>1. Pemahaman Konsep Keagamaan</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Penguasaan fakta, konsep, dan hukum fikih/akidah. Siswa tidak hanya tahu istilah tapi memahami esensi ajarannya.
                      </p>
                      <span className="inline-block text-[10px] font-bold text-sky-800 bg-white px-2 py-0.5 rounded border border-sky-200">
                        Bentuk: Tugas Harian & Formatif
                      </span>
                    </div>

                    <div className="bg-sky-50/60 p-3.5 rounded-xl border border-sky-100 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-sky-950">
                        <BookmarkCheck className="w-4 h-4 text-sky-600 shrink-0" />
                        <span>2. Hafalan & Penguasaan Dalil</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Ketepatan merujuk ayat Al-Qur'an ({guide.dalilReference}) dan hadis sahih beserta arti dan pesan utamanya.
                      </p>
                      <span className="inline-block text-[10px] font-bold text-sky-800 bg-white px-2 py-0.5 rounded border border-sky-200">
                        Bentuk: Tes Hafalan & Kuis Dalil
                      </span>
                    </div>

                    <div className="bg-sky-50/60 p-3.5 rounded-xl border border-sky-100 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-sky-950">
                        <Sparkles className="w-4 h-4 text-sky-600 shrink-0" />
                        <span>3. Pemikiran Kritis (HOTS)</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Kemampuan menganalisis dilema moral, asbabun nuzul, dan memecahkan problematika kekinian dengan sudut pandang Islam.
                      </p>
                      <span className="inline-block text-[10px] font-bold text-sky-800 bg-white px-2 py-0.5 rounded border border-sky-200">
                        Bentuk: Asesmen Sumatif TP (C4–C6)
                      </span>
                    </div>
                  </div>

                  {/* Kategori Opsi Asesmen Kognitif di Buku Nilai */}
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                    <span className="font-bold text-slate-800 block mb-1">
                      Opsi Penilaian Kognitif yang Tersedia pada Menu Buku Nilai:
                    </span>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-[11px] text-slate-700">
                      <li className="bg-white p-2 rounded border border-slate-200">
                        <strong>Nilai Tugas:</strong> LKPD, rangkuman dalil, pemetaan peta konsep.
                      </li>
                      <li className="bg-white p-2 rounded border border-slate-200">
                        <strong>Asesmen Diagnostik:</strong> Tes kesiapan kognitif & pemetaan awal.
                      </li>
                      <li className="bg-white p-2 rounded border border-slate-200">
                        <strong>Asesmen Formatif:</strong> Kuis berkala, umpan balik proses per indikator.
                      </li>
                      <li className="bg-white p-2 rounded border border-slate-200">
                        <strong>Asesmen Sumatif:</strong> Ujian akhir lingkup materi TP berstandar KKTP.
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Detail Ranah Afektif */}
              {activeDomainSubTab === 'afektif' && (
                <div className="bg-white rounded-xl border border-amber-200 shadow-xs p-4 sm:p-5 space-y-4">
                  <div className="flex items-start justify-between border-b border-amber-100 pb-3">
                    <div>
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded uppercase tracking-wider">
                        Taksonomi Sikap & Budi Pekerti
                      </span>
                      <h3 className="text-base font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                        <Heart className="w-5 h-5 text-amber-600" />
                        Ranah Afektif (Sikap, Budi Pekerti & Pembiasaan Religius)
                      </h3>
                      <p className="text-xs text-slate-600 mt-1">
                        Menilai penghayatan nilai, akhlak mulia, sikap moderat, toleransi, serta pembiasaan perilaku religius harian (sholat 5 waktu & adab pergaulan).
                      </p>
                    </div>
                    <span className="bg-amber-50 text-amber-900 text-xs font-bold px-3 py-1.5 rounded-lg border border-amber-200 shrink-0">
                      Standar Bobot: 30%
                    </span>
                  </div>

                  {/* 4 Sub-Aspek Afektif */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-amber-50/60 p-3.5 rounded-xl border border-amber-100 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950">
                        <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Sikap & Akhlak Mulia</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Integritas, kejujuran batin, tawadhu, kedisiplinan, dan tanggung jawab amanah harian.
                      </p>
                    </div>

                    <div className="bg-amber-50/60 p-3.5 rounded-xl border border-amber-100 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950">
                        <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Sikap Moderat & Toleransi</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Tasamuh (toleransi), tawassuth (moderat), menghargai perbedaan khilafiyah fikih & keberagaman.
                      </p>
                    </div>

                    <div className="bg-amber-50/60 p-3.5 rounded-xl border border-amber-200/90 space-y-1.5 shadow-2xs">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950">
                        <Calendar className="w-4 h-4 text-amber-700 shrink-0" />
                        <span>Presensi Sholat 5 Waktu</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Kedisiplinan sholat fardu 5 waktu, keikutsertaan sholat berjamaah di mushola, serta mutaba'ah harian.
                      </p>
                    </div>

                    <div className="bg-amber-50/60 p-3.5 rounded-xl border border-amber-100 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950">
                        <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Keaktifan & Adab Belajar</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Partisipasi aktif dalam diskusi kelas, adab berguru, dan kesantunan etika digital/medsos (tabayyun).
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-200 text-xs text-amber-900">
                    <strong>Catatan Guru:</strong> Penilaian afektif dilakukan melalui observasi berkesinambungan menggunakan lembar jurnal harian, penilaian diri (self-assessment), penilaian antarteman, dan buku mutaba'ah yaumiyah sholat 5 waktu siswa.
                  </div>
                </div>
              )}

              {/* Detail Ranah Psikomotorik */}
              {activeDomainSubTab === 'psikomotorik' && (
                <div className="bg-white rounded-xl border border-purple-200 shadow-xs p-4 sm:p-5 space-y-4">
                  <div className="flex items-start justify-between border-b border-purple-100 pb-3">
                    <div>
                      <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded uppercase tracking-wider">
                        Taksonomi Keterampilan & Unjuk Kerja
                      </span>
                      <h3 className="text-base font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                        <Zap className="w-5 h-5 text-purple-600" />
                        Ranah Psikomotorik (Keterampilan, Praktik Ibadah & Kinerja)
                      </h3>
                      <p className="text-xs text-slate-600 mt-1">
                        Menilai kemampuan teknis dan praktis ibadah, keterampilan membaca/menghafal Al-Qur'an dan Hadis, praktik salat, unjuk kerja demonstrasi, dan karya proyek.
                      </p>
                    </div>
                    <span className="bg-purple-50 text-purple-900 text-xs font-bold px-3 py-1.5 rounded-lg border border-purple-200 shrink-0">
                      Standar Bobot: 30%
                    </span>
                  </div>

                  {/* 3 Sub-Aspek Psikomotorik */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-purple-50/60 p-3.5 rounded-xl border border-purple-100 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-purple-950">
                        <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                        <span>1. Praktik Ibadah Teknis</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Keterampilan teknis ibadah nyata: praktik salat, wudu, macam sujud (syukur, sahwi, tilawah), tata cara jenazah, manasik haji/umrah, kurban, dsb.
                      </p>
                    </div>

                    <div className="bg-purple-50/60 p-3.5 rounded-xl border border-purple-100 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-purple-950">
                        <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                        <span>2. Membaca & Menghafal Al-Qur'an</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Keterampilan teknis membaca Al-Qur'an dengan tartil, fasih makharijul huruf, kaidah ilmu tajwid, dan kelancaran unjuk kerja hafalan ayat/hadis.
                      </p>
                    </div>

                    <div className="bg-purple-50/60 p-3.5 rounded-xl border border-purple-100 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-purple-950">
                        <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                        <span>3. Unjuk Kerja & Produk Proyek</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Demonstrasi pemecahan masalah, presentasi kelompok, pembuatan infografis dakwah digital, dan portofolio karya nyata pelajar muslim.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-purple-50/50 rounded-lg border border-purple-200 text-xs text-purple-900">
                    <strong>Catatan Guru:</strong> Ranah psikomotorik dinilai secara autentik dengan rubrik pengamatan langsung (lembar observasi performa ibadah/tahfiz) dan rubrik penilaian produk portofolio.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PANDUAN ASESMEN BERDASARKAN ELEMEN PAIBP */}
          {activeMainTab === 'elements' && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs">
                <div className="flex items-center space-x-2 border-b border-slate-100 pb-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center font-bold">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Standar Ruang Lingkup Asesmen Elemen: {guide.elementGuidelines.elementName}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Ketentuan resmi indikator capaian yang diases pada elemen mata pelajaran PAI dan Budi Pekerti
                    </p>
                  </div>
                </div>

                <div className="bg-sky-50 border border-sky-200 rounded-lg p-3 text-xs text-sky-950 leading-relaxed mb-4">
                  <strong>Ruang Lingkup Asesmen:</strong> {guide.elementGuidelines.scopeSummary}
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-800 block">
                    Keterampilan & Objek Penilaian Spesifik Elemen {guide.element}:
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    {guide.elementGuidelines.keySkillsToAssess.map((skill, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-start space-x-2"
                      >
                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="text-slate-800">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Rangkuman 5 Elemen PAIBP Lengkap */}
              <div className="bg-slate-100/70 rounded-xl p-4 border border-slate-200 space-y-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Matriks Ringkas Objek Asesmen 5 Elemen PAIBP Kurikulum Merdeka:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 text-[11px]">
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                    <strong className="text-sky-700 block mb-1">1. Al-Qur’an dan Hadis</strong>
                    <p className="text-slate-600">
                      Membaca tartil (tajwid), menulis ayat, menghafal dalil, analisis arti & asbabun nuzul, penerapan ayat/hadis.
                    </p>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                    <strong className="text-emerald-700 block mb-1">2. Akidah</strong>
                    <p className="text-slate-600">
                      Pemahaman & keyakinan rukun iman, sifat Allah Swt., ketauhidan, serta pencegahan syirik dan khurafat.
                    </p>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                    <strong className="text-amber-700 block mb-1">3. Akhlak</strong>
                    <p className="text-slate-600">
                      Evaluasi moral kepada Allah, diri sendiri, sesama (toleransi, husnuzan, kasih sayang), dan lingkungan alam.
                    </p>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                    <strong className="text-purple-700 block mb-1">4. Fikih</strong>
                    <p className="text-slate-600">
                      Pemahaman & praktik ibadah mahdhah (shalat, sujud, jenazah, haji/umrah) dan muamalah serta rukhsah ibadah.
                    </p>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                    <strong className="text-indigo-700 block mb-1">5. Sejarah Peradaban (SPI)</strong>
                    <p className="text-slate-600">
                      Pemahaman teladan Nabi, Khulafaur Rasyidin, kemajuan peradaban dinasti Islam, dan ibrah kemajuan sains.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: EMPAT PENDEKATAN ASESMEN (DIAGNOSTIK, FORMATIF, SUMATIF, P5PPRA) */}
          {activeMainTab === 'approaches' && (
            <div className="space-y-4">
              {/* Approach Subtabs */}
              <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-slate-200">
                <button
                  onClick={() => setActiveApproachSubTab('diagnostik')}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    activeApproachSubTab === 'diagnostik'
                      ? 'bg-sky-700 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>1. Asesmen Diagnostik (Awal)</span>
                </button>
                <button
                  onClick={() => setActiveApproachSubTab('formatif')}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    activeApproachSubTab === 'formatif'
                      ? 'bg-teal-700 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>2. Asesmen Formatif (Proses)</span>
                </button>
                <button
                  onClick={() => setActiveApproachSubTab('sumatif')}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    activeApproachSubTab === 'sumatif'
                      ? 'bg-indigo-700 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>3. Asesmen Sumatif (Akhir)</span>
                </button>
                <button
                  onClick={() => setActiveApproachSubTab('autentik_p5ppra')}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    activeApproachSubTab === 'autentik_p5ppra'
                      ? 'bg-purple-700 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>4. Autentik & Proyek P5PPRA</span>
                </button>
              </div>

              {/* 1. Diagnostik */}
              {activeApproachSubTab === 'diagnostik' && (
                <div className="bg-white rounded-xl border border-sky-200 p-4 sm:p-5 shadow-xs space-y-3">
                  <div className="border-b border-sky-100 pb-2">
                    <span className="text-[10px] font-bold text-sky-700 uppercase tracking-wider bg-sky-100 px-2 py-0.5 rounded">
                      Sebelum Pembelajaran Dimulai
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1">
                      Asesmen Diagnostik (Pemetaan Kesiapan Belajar, Gaya Belajar & Kesiapan Religius)
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">{guide.diagnostic.purpose}</p>
                  </div>

                  <div className="space-y-3">
                    {guide.diagnostic.items.map((item, idx) => (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sky-900 flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-full bg-sky-200 text-sky-800 text-[10px] flex items-center justify-center font-bold">
                              {idx + 1}
                            </span>
                            {item.targetAspect}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">ID: {item.id}</span>
                        </div>
                        <div className="bg-white p-2.5 rounded-lg border border-slate-200 font-medium text-slate-800">
                          {item.questionPrompt}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                          <div className="bg-emerald-50 p-2 rounded border border-emerald-200 text-emerald-900">
                            <strong>Kriteria Siap / Paham:</strong> {item.diagnosticCriteria.ready}
                          </div>
                          <div className="bg-rose-50 p-2 rounded border border-rose-200 text-rose-900">
                            <strong>Kriteria Perlu Bimbingan:</strong> {item.diagnosticCriteria.needsSupport}
                          </div>
                        </div>
                        <div className="text-[11px] text-slate-600 pt-1 border-t border-slate-200">
                          <strong>Tindak Lanjut Diferensiasi:</strong> {item.remedialFollowUp}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Formatif */}
              {activeApproachSubTab === 'formatif' && (
                <div className="bg-white rounded-xl border border-teal-200 p-4 sm:p-5 shadow-xs space-y-3">
                  <div className="border-b border-teal-100 pb-2">
                    <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider bg-teal-100 px-2 py-0.5 rounded">
                      Selama Pembelajaran Berlangsung (As & For Learning)
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1">
                      Asesmen Formatif (Umpan Balik Berkelanjutan & Pembentukan Karakter)
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">{guide.formative.purpose}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {guide.formative.items.map((item, idx) => (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-xl border border-teal-100 bg-teal-50/40 space-y-2 text-xs flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-1.5 font-bold text-teal-950 mb-1">
                            <span className="w-5 h-5 rounded-full bg-teal-200 text-teal-900 text-[10px] flex items-center justify-center font-bold">
                              {idx + 1}
                            </span>
                            <span>{item.activityType}</span>
                          </div>
                          <div className="bg-white p-2 rounded border border-teal-200/60 mb-2 font-medium text-slate-800 text-[11px]">
                            {item.focusSkill}
                          </div>
                          <p className="text-[11px] text-slate-600 mb-1">
                            <strong>Metode Feedback:</strong> {item.feedbackMethod}
                          </p>
                        </div>
                        <div className="pt-2 border-t border-teal-200 text-[11px] text-emerald-800 font-semibold">
                          Indikator Pertumbuhan: {item.growthIndicator}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Sumatif */}
              {activeApproachSubTab === 'sumatif' && (
                <div className="bg-white rounded-xl border border-indigo-200 p-4 sm:p-5 shadow-xs space-y-3">
                  <div className="border-b border-indigo-100 pb-2">
                    <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider bg-indigo-100 px-2 py-0.5 rounded">
                      Akhir Lingkup Materi & Semester (Of Learning)
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1">
                      Asesmen Sumatif (Pengukuran Capaian & Penetapan KKTP)
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">{guide.summative.purpose}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Target KKTP</span>
                      <strong className="text-2xl text-emerald-600 font-black">
                        {guide.summative.spec.kktpThreshold}
                      </strong>
                      <span className="text-[11px] text-slate-600 block mt-1">Skor Ketercapaian Minimal</span>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Tingkat Berpikir</span>
                      <strong className="text-base text-indigo-900 font-bold block mt-1">
                        {guide.summative.spec.cognitiveLevel}
                      </strong>
                      <span className="text-[11px] text-slate-600 block mt-1">Standar HOTS & Analisis</span>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Struktur Soal</span>
                      <strong className="text-base text-slate-900 font-bold block mt-1">
                        {guide.summative.spec.testComponents.multipleChoiceCount} PG + {guide.summative.spec.testComponents.essayCount} Essay
                      </strong>
                      <span className="text-[11px] text-slate-600 block mt-1">Berbasis Stimulus Kasus</span>
                    </div>
                  </div>

                  <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-xs text-indigo-950">
                    <strong>Komponen Unjuk Kerja Sumatif:</strong> {guide.summative.spec.testComponents.practicalDemo}
                  </div>
                </div>
              )}

              {/* 4. Autentik & Proyek P5PPRA */}
              {activeApproachSubTab === 'autentik_p5ppra' && (
                <div className="bg-white rounded-xl border border-purple-200 p-4 sm:p-5 shadow-xs space-y-3">
                  <div className="border-b border-purple-100 pb-2">
                    <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider bg-purple-100 px-2 py-0.5 rounded">
                      Penilaian Kinerja & Portofolio Karakter
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1">
                      Penilaian Autentik & Proyek P5PPRA (Isu Sosial & Etika Digital)
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Mengaitkan nilai agama Islam dengan isu sosial nyata atau etika digital bagi Profil Pelajar Pancasila & Rahmatan Lil'Alamin.
                    </p>
                  </div>

                  {/* Project Info Header */}
                  <div className="bg-linear-to-r from-purple-900 to-indigo-900 text-white p-4 rounded-xl shadow-xs space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                        Tema P5: {guide.authenticP5ppra.p5Theme}
                      </span>
                      <span className="bg-amber-400 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded">
                        Nilai PPRA: {guide.authenticP5ppra.ppraValue}
                      </span>
                    </div>
                    <h4 className="text-sm sm:text-base font-bold text-white">
                      {guide.authenticP5ppra.title}
                    </h4>
                    <p className="text-xs text-purple-200">
                      <strong>Isu Sosial / Konteks Digital:</strong> {guide.authenticP5ppra.socialOrDigitalContext}
                    </p>
                  </div>

                  {/* Rubrik Kriteria Autentik P5PPRA */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-800 block">
                      Rubrik Penilaian Kinerja & Portofolio (4 Tingkat Capaian):
                    </span>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
                        <thead>
                          <tr className="bg-slate-900 text-white text-[11px]">
                            <th className="p-2.5 w-1/4">Kriteria Penilaian</th>
                            <th className="p-2.5 w-1/4">Perlu Bimbingan (&lt;70)</th>
                            <th className="p-2.5 w-1/4">Cukup (70-79)</th>
                            <th className="p-2.5 w-1/4 bg-purple-950 text-purple-200">Sangat Baik (85-100)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 text-[11px] text-slate-700">
                          {guide.authenticP5ppra.rubricCriteria.map((rc, idx) => (
                            <tr key={idx} className="hover:bg-purple-50/30">
                              <td className="p-2.5 font-bold text-slate-900">{rc.criteria}</td>
                              <td className="p-2.5 text-slate-500">{rc.perluBimbingan}</td>
                              <td className="p-2.5 text-slate-600">{rc.cukup}</td>
                              <td className="p-2.5 text-purple-900 font-semibold bg-purple-50/40">{rc.sangatBaik}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: TABEL RUBRIK 4 JENJANG LENGKAP */}
          {activeMainTab === 'rubric_tables' && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Tabel Rubrik Analitik 4 Tingkat Capaian Kompetensi Seluruh Ranah
                    </h3>
                    <p className="text-xs text-slate-500">
                      Pedoman pemberian skor obyektif (Perlu Bimbingan &lt;70, Cukup 70-79, Mahir 80-90, Sangat Mahir 91-100)
                    </p>
                  </div>
                  <button
                    onClick={handlePrint}
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Cetak Rubrik</span>
                  </button>
                </div>

                {/* Kognitif Rubrics */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-sky-900 flex items-center gap-1.5 uppercase tracking-wide">
                    <Award className="w-4 h-4 text-sky-600" />
                    A. Rubrik Ranah Kognitif
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
                      <thead>
                        <tr className="bg-sky-950 text-white text-[11px]">
                          <th className="p-2.5 w-1/5">Aspek</th>
                          <th className="p-2.5 w-1/5">Perlu Bimbingan (&lt;70)</th>
                          <th className="p-2.5 w-1/5">Cukup (70-79)</th>
                          <th className="p-2.5 w-1/5">Mahir (80-90)</th>
                          <th className="p-2.5 w-1/5 bg-sky-900 text-sky-200">Sangat Mahir (91-100)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 text-[11px] text-slate-700">
                        {guide.domains.kognitif.rubrics.map((r, i) => (
                          <tr key={i} className="hover:bg-sky-50/30">
                            <td className="p-2.5 font-bold text-slate-900">
                              {r.aspectName}
                              <span className="block text-[10px] text-slate-400 font-normal">Bobot: {r.weight}%</span>
                            </td>
                            <td className="p-2.5">{r.levels.find(l => l.level === 'Perlu Bimbingan')?.descriptor}</td>
                            <td className="p-2.5">{r.levels.find(l => l.level === 'Cukup')?.descriptor}</td>
                            <td className="p-2.5">{r.levels.find(l => l.level === 'Mahir')?.descriptor}</td>
                            <td className="p-2.5 font-semibold text-sky-900 bg-sky-50/40">
                              {r.levels.find(l => l.level === 'Sangat Mahir')?.descriptor}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Afektif Rubrics */}
                <div className="space-y-2 pt-3 border-t border-slate-200">
                  <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5 uppercase tracking-wide">
                    <Heart className="w-4 h-4 text-amber-600" />
                    B. Rubrik Ranah Afektif (Sikap, Moderasi & Sholat 5 Waktu)
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
                      <thead>
                        <tr className="bg-amber-950 text-white text-[11px]">
                          <th className="p-2.5 w-1/5">Aspek</th>
                          <th className="p-2.5 w-1/5">Perlu Bimbingan (&lt;70)</th>
                          <th className="p-2.5 w-1/5">Cukup (70-79)</th>
                          <th className="p-2.5 w-1/5">Mahir (80-90)</th>
                          <th className="p-2.5 w-1/5 bg-amber-900 text-amber-200">Sangat Mahir (91-100)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 text-[11px] text-slate-700">
                        {guide.domains.afektif.rubrics.map((r, i) => (
                          <tr key={i} className="hover:bg-amber-50/30">
                            <td className="p-2.5 font-bold text-slate-900">
                              {r.aspectName}
                              <span className="block text-[10px] text-slate-400 font-normal">Bobot: {r.weight}%</span>
                            </td>
                            <td className="p-2.5">{r.levels.find(l => l.level === 'Perlu Bimbingan')?.descriptor}</td>
                            <td className="p-2.5">{r.levels.find(l => l.level === 'Cukup')?.descriptor}</td>
                            <td className="p-2.5">{r.levels.find(l => l.level === 'Mahir')?.descriptor}</td>
                            <td className="p-2.5 font-semibold text-amber-900 bg-amber-50/40">
                              {r.levels.find(l => l.level === 'Sangat Mahir')?.descriptor}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Psikomotorik Rubrics */}
                <div className="space-y-2 pt-3 border-t border-slate-200">
                  <h4 className="text-xs font-bold text-purple-900 flex items-center gap-1.5 uppercase tracking-wide">
                    <Zap className="w-4 h-4 text-purple-600" />
                    C. Rubrik Ranah Psikomotorik (Praktik Ibadah, Tajwid & Kinerja)
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
                      <thead>
                        <tr className="bg-purple-950 text-white text-[11px]">
                          <th className="p-2.5 w-1/5">Aspek</th>
                          <th className="p-2.5 w-1/5">Perlu Bimbingan (&lt;70)</th>
                          <th className="p-2.5 w-1/5">Cukup (70-79)</th>
                          <th className="p-2.5 w-1/5">Mahir (80-90)</th>
                          <th className="p-2.5 w-1/5 bg-purple-900 text-purple-200">Sangat Mahir (91-100)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 text-[11px] text-slate-700">
                        {guide.domains.psikomotorik.rubrics.map((r, i) => (
                          <tr key={i} className="hover:bg-purple-50/30">
                            <td className="p-2.5 font-bold text-slate-900">
                              {r.aspectName}
                              <span className="block text-[10px] text-slate-400 font-normal">Bobot: {r.weight}%</span>
                            </td>
                            <td className="p-2.5">{r.levels.find(l => l.level === 'Perlu Bimbingan')?.descriptor}</td>
                            <td className="p-2.5">{r.levels.find(l => l.level === 'Cukup')?.descriptor}</td>
                            <td className="p-2.5">{r.levels.find(l => l.level === 'Mahir')?.descriptor}</td>
                            <td className="p-2.5 font-semibold text-purple-900 bg-purple-50/40">
                              {r.levels.find(l => l.level === 'Sangat Mahir')?.descriptor}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* 5. MODAL FOOTER */}
        {/* ========================================================================= */}
        <div className="bg-slate-900 text-white px-5 py-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 text-xs">
          <div className="flex items-center space-x-2 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>
              Perangkat Asesmen PAIBP: <strong>Kelas {guide.grade} Sem. {guide.semester}</strong> • Topik: <em>{guide.materi}</em>
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {onOpenGradingBook && (
              <button
                onClick={() => {
                  onClose();
                  onOpenGradingBook();
                }}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>Masuk ke Buku Nilai Siswa</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-semibold transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
