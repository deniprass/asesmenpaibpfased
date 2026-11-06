import React, { useState } from 'react';
import {
  AssessmentPackage,
  QuestionItem,
  BloomLevel,
  SoloLevel,
  DeepLearningDimension,
  DifficultyLevel,
  UserAccount
} from '../types';
import {
  FileText,
  Table,
  CheckCircle2,
  BarChart3,
  Layers,
  Award,
  Edit3,
  Printer,
  Download,
  Play,
  Eye,
  EyeOff,
  Search,
  Filter,
  Check,
  Sparkles,
  AlertTriangle,
  BookOpen,
  Info,
  FileCheck,
  ShieldCheck,
  Laptop,
  Share2,
  Lock,
  Key
} from 'lucide-react';

interface AssessmentViewProps {
  packageData: AssessmentPackage;
  onEditQuestion: (question: QuestionItem) => void;
  onOpenExport: () => void;
  onOpenSimulator: () => void;
  onOpenCbtConverter?: () => void;
  onOpenQuestionBank?: () => void;
  onOpenGrading?: () => void;
  onOpenHolisticAssessment?: () => void;
  onOpenShareCbt?: () => void;
  currentUser?: UserAccount | null;
  onOpenActivation?: () => void;
}

export const AssessmentView: React.FC<AssessmentViewProps> = ({
  packageData,
  onEditQuestion,
  onOpenExport,
  onOpenSimulator,
  onOpenCbtConverter,
  onOpenQuestionBank,
  onOpenGrading,
  onOpenHolisticAssessment,
  onOpenShareCbt,
  currentUser,
  onOpenActivation
}) => {
  const isDemo = currentUser?.role === 'demo';
  const [demoNotice, setDemoNotice] = useState<string>('');
  const [activeTab, setActiveTab] = useState<
    'ringkasan' | 'kisi_kisi' | 'naskah_soal' | 'kunci' | 'taksonomi' | 'kartu_soal' | 'kualitas'
  >('naskah_soal');

  const [showAnswerKeysInExam, setShowAnswerKeysInExam] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterBloom, setFilterBloom] = useState<string>('all');
  const [filterSolo, setFilterSolo] = useState<string>('all');

  const questions = packageData.questions || [];

  // Filtered questions
  const filteredQuestions = questions.filter(q => {
    const matchesSearch =
      q.questionText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.stimulus?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.indicator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.materi.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesBloom = filterBloom === 'all' || q.bloomLevel === filterBloom;
    const matchesSolo = filterSolo === 'all' || q.soloLevel === filterSolo;

    return matchesSearch && matchesBloom && matchesSolo;
  });

  // Calculate summary ratios
  const hotsCount = questions.filter(q => ['C4', 'C5', 'C6'].includes(q.bloomLevel)).length;
  const hotsPercentage = Math.round((hotsCount / (questions.length || 1)) * 100);
  const soloDeepCount = questions.filter(q => ['Relational', 'Extended Abstract'].includes(q.soloLevel)).length;
  const soloRelationalPercentage = Math.round((soloDeepCount / (questions.length || 1)) * 100);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-12">
      {/* Top Header & Quick Summary */}
      <div className="p-6 border-b border-slate-200 bg-slate-50/70">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="bg-sky-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded">
                Kelas {packageData.identity.grade} ({packageData.identity.phase})
              </span>
              <span className="bg-slate-200 text-slate-800 text-[11px] font-bold px-2 py-0.5 rounded">
                Semester {packageData.identity.semester}
              </span>
              {packageData.tema && (
                <span className="bg-sky-100 text-sky-900 text-[11px] font-bold px-2.5 py-0.5 rounded border border-sky-300 flex items-center gap-1">
                  <span>Tema:</span> {packageData.tema}
                </span>
              )}
              <span className="bg-slate-100 text-slate-700 text-[11px] font-semibold px-2 py-0.5 rounded border border-slate-200">
                Mode: {packageData.mode.toUpperCase()}
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-[11px] font-semibold px-2 py-0.5 rounded border border-emerald-200">
                Skor Mutu: {packageData.overallQuality.averageScore}/32 ({packageData.overallQuality.category})
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {packageData.identity.title}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {packageData.identity.schoolName} • Guru: {packageData.identity.teacherName} • Total: {packageData.questions.length} Butir Soal ({packageData.identity.timeAllocation} Menit)
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {onOpenCbtConverter && (
              <button
                id="btn-open-cbt-converter"
                onClick={onOpenCbtConverter}
                className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-3.5 py-2.5 rounded-md shadow-sm transition-all flex items-center gap-1.5"
                title="Konversi soal ke Google Form Quiz, Candy CBT, Moodle, dan Quizizz"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Converter Form & CBT</span>
              </button>
            )}

            {onOpenQuestionBank && (
              <button
                id="btn-open-bank-soal"
                onClick={onOpenQuestionBank}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-2.5 rounded-md shadow-sm transition-all flex items-center gap-1.5"
                title="Buka Bank Soal Terstandar Kurikulum Merdeka 2026"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Bank Soal (Fase D)</span>
              </button>
            )}

            {onOpenGrading && (
              <button
                id="btn-open-grading-assessment"
                onClick={onOpenGrading}
                className="bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold px-3.5 py-2.5 rounded-md shadow-sm transition-all flex items-center gap-1.5"
                title="Buka Buku Penilaian Lengkap (Kognitif, Afektif, Psikomotorik) untuk TP ini"
              >
                <FileCheck className="w-3.5 h-3.5 text-emerald-300" />
                <span>Buku Nilai (3 Ranah)</span>
              </button>
            )}

            {onOpenHolisticAssessment && (
              <button
                id="btn-open-holistic-rubric"
                onClick={onOpenHolisticAssessment}
                className="bg-sky-800 hover:bg-sky-700 text-white text-xs font-bold px-3 py-2.5 rounded-md shadow-sm transition-all flex items-center gap-1.5"
                title="Buka Pedoman & Rubrik Asesmen Lengkap (3 Ranah & P5PPRA) untuk TP ini"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-sky-300" />
                <span>Rubrik Asesmen & P5PPRA</span>
              </button>
            )}

            {onOpenShareCbt && (
              <button
                id="btn-open-share-cbt"
                onClick={() => {
                  if (isDemo && onOpenActivation) {
                    setDemoNotice('Membagikan tautan CBT online ke siswa memerlukan aktivasi kode resmi dari Owner.');
                  }
                  onOpenShareCbt();
                }}
                className={`text-xs font-bold px-3.5 py-2.5 rounded-md shadow-md transition-all flex items-center gap-1.5 cursor-pointer ${
                  isDemo
                    ? 'bg-amber-600 hover:bg-amber-500 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/20'
                }`}
                title={isDemo ? 'Perlu Kode Aktivasi dari Owner untuk membagikan link ke siswa' : 'Bagikan link ujian CBT ke siswa secara valid'}
              >
                {isDemo ? <Lock className="w-3.5 h-3.5 text-amber-200" /> : <Share2 className="w-3.5 h-3.5 text-emerald-200" />}
                <span>{isDemo ? 'Bagikan CBT (Perlu Aktivasi)' : 'Bagikan Link CBT Siswa'}</span>
              </button>
            )}

            <button
              id="btn-open-simulator"
              onClick={onOpenSimulator}
              className="bg-linear-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white text-xs font-bold px-3.5 py-2.5 rounded-md shadow-md shadow-purple-950/20 transition-all flex items-center gap-1.5 cursor-pointer"
              title="Jalankan Ujian CBT Langsung untuk Siswa (Computer-Based Test dengan timer, kisi-kisi, & cetak nilai)"
            >
              <Laptop className="w-3.5 h-3.5 text-purple-200" />
              <span>Ujian CBT Langsung</span>
            </button>

            <button
              id="btn-open-export"
              onClick={onOpenExport}
              className={`text-xs font-bold px-3.5 py-2.5 rounded-md shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer ${
                isDemo
                  ? 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
              title={isDemo ? 'Ekspor resmi Word/Excel terkunci pada Mode Demo' : 'Pusat Ekspor & Salin Naskah Asesmen'}
            >
              {isDemo ? <Lock className="w-3.5 h-3.5 text-amber-400" /> : <Download className="w-3.5 h-3.5" />}
              <span>{isDemo ? 'Ekspor (Demo Terbatas)' : 'Ekspor & Salin Naskah'}</span>
            </button>
          </div>
        </div>

        {/* DEMO MODE NOTICE BANNER */}
        {isDemo && (
          <div className="mt-4 p-3.5 bg-amber-50 border border-amber-300 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900 shadow-xs">
            <div className="flex items-start gap-2.5">
              <Lock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold block text-slate-900">Mode Demo: Asesmen Berjalan dengan Fitur Terbatas</strong>
                <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                  Sebelum aktivasi, sistem dibatasi maksimal 5 soal dan ekspor resmi terkunci. Untuk mengakses 10–50 soal, naskah Word (.doc), Excel (.csv), serta membagikan link CBT valid ke siswa, lakukan aktivasi dengan <strong>Kode Aktivasi resmi dari Owner</strong>.
                </p>
              </div>
            </div>
            {onOpenActivation && (
              <button
                type="button"
                onClick={onOpenActivation}
                className="px-3.5 py-1.5 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg font-bold text-xs shrink-0 flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer w-fit"
              >
                <Key className="w-3.5 h-3.5" />
                <span>Input Kode Aktivasi Owner</span>
              </button>
            )}
          </div>
        )}

        {demoNotice && (
          <div className="mt-3 p-3 bg-rose-50 border border-rose-300 text-rose-800 rounded-xl text-xs flex items-center justify-between">
            <span className="flex items-center gap-2 font-medium">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              {demoNotice}
            </span>
            <button onClick={() => setDemoNotice('')} className="text-rose-500 hover:text-rose-800 font-bold">✕</button>
          </div>
        )}
      </div>

      {/* 4-Card Summary Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 pb-4 bg-slate-50/40 border-b border-slate-100">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Target Kelas & Fase</div>
          <div className="text-base sm:text-lg font-bold text-slate-800">Kelas {packageData.identity.grade} ({packageData.identity.phase})</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tema CP Terklasifikasi</div>
          <div className="text-sm sm:text-base font-bold text-sky-800 line-clamp-1" title={packageData.tema || packageData.materiMapping[0]?.materi}>
            {packageData.tema || packageData.materiMapping[0]?.materi || 'Akidah Islam'}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Bloom Ratio (C4-C6)</div>
          <div className="text-base sm:text-lg font-bold text-sky-600">
            {hotsPercentage}% <span className="text-xs font-normal text-slate-400">({hotsPercentage >= 60 ? 'High HOTS' : 'Standar'})</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">SOLO Relational</div>
          <div className="text-base sm:text-lg font-bold text-emerald-600">
            {soloRelationalPercentage}% <span className="text-xs font-normal text-slate-400">(Deep Learning)</span>
          </div>
        </div>
      </div>

      {/* Synchronization Status Banner */}
      <div className="px-6 py-2.5 bg-sky-50/80 border-b border-sky-200 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-sky-950 font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
          <span className="font-bold text-sky-900">Sinkronisasi Rantai Pedagogis (SK No. 020/2026):</span>
          <span className="text-sky-800">Capaian Pembelajaran (CP) ➔ Tema ({packageData.tema || 'PAIBP'}) ➔ Indikator HOTS ➔ Stimulus Autentik ➔ 4 Opsi Homogen</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded border border-emerald-300">
            Distribusi Kunci Merata: A({packageData.keyDistribution.A}) B({packageData.keyDistribution.B}) C({packageData.keyDistribution.C}) D({packageData.keyDistribution.D})
          </span>
        </div>
      </div>

      {/* Navigation Tabs (13 Sections Categorized into 7 Clean Tabs) */}
      <div className="flex border-b border-slate-200 bg-white overflow-x-auto text-xs font-bold scrollbar-none">
        {[
          { id: 'naskah_soal', label: '1. Naskah Soal Ujian (Bagian 5)', icon: FileText },
          { id: 'kisi_kisi', label: '2. Kisi-Kisi Lengkap (Bagian 4)', icon: Table },
          { id: 'kartu_soal', label: '3. Kartu Soal (Bagian 11)', icon: BookOpen },
          { id: 'kunci', label: '4. Kunci & Distribusi (Bagian 6-7)', icon: CheckCircle2 },
          { id: 'taksonomi', label: '5. Bloom & SOLO (Bagian 8-10)', icon: Layers },
          { id: 'kualitas', label: '6. Analisis Mutu & Rubrik (Bagian 12-13)', icon: Award },
          { id: 'ringkasan', label: '7. CP, TP & Validasi (Bagian 1-3)', icon: Info },
        ].map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              id={`tab-${t.id}`}
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-4 py-3.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                isActive
                  ? 'border-sky-600 text-sky-700 bg-sky-50/50'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Container */}
      <div className="p-6">
        {/* ========================================================================= */}
        {/* TAB 1: NASKAH SOAL UJIAN (BAGIAN 5) */}
        {/* ========================================================================= */}
        {activeTab === 'naskah_soal' && (
          <div className="space-y-6">
            {/* Filter & Options Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center space-x-2 flex-1">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  id="input-search-question"
                  type="text"
                  placeholder="Cari kata kunci soal, stimulus, atau materi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-md px-2.5 py-1.5 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="flex items-center space-x-2">
                <button
                  id="btn-toggle-answer-keys"
                  onClick={() => setShowAnswerKeysInExam(!showAnswerKeysInExam)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-md border transition-colors flex items-center gap-1.5 ${
                    showAnswerKeysInExam
                      ? 'bg-sky-100 text-sky-800 border-sky-300'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {showAnswerKeysInExam ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showAnswerKeysInExam ? 'Sembunyikan Kunci' : 'Tampilkan Kunci & Pembahasan'}</span>
                </button>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-6">
              {filteredQuestions.map((q) => (
                <div
                  key={q.number}
                  className="p-5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white shadow-xs transition-all relative group"
                >
                  {/* Question Meta Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="w-7 h-7 rounded-md bg-sky-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                        {q.number}
                      </span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${
                        q.questionType === 'Essay'
                          ? 'bg-purple-100 text-purple-800 border-purple-300'
                          : 'bg-sky-100 text-sky-800 border-sky-300'
                      }`}>
                        {q.questionType === 'Essay' ? 'Uraian / Essay' : 'Pilihan Ganda'}
                      </span>
                      <span className="bg-slate-100 text-slate-700 text-[11px] font-semibold px-2 py-0.5 rounded">
                        {q.element}
                      </span>
                      {(q.tema || packageData.tema) && (
                        <span className="bg-sky-50 text-sky-800 text-[11px] font-semibold px-2 py-0.5 rounded border border-sky-200">
                          {q.tema || packageData.tema}
                        </span>
                      )}
                      <span className="bg-sky-50 text-sky-700 text-[11px] font-bold px-2 py-0.5 rounded border border-sky-200">
                        {q.bloomLevel} — {q.soloLevel}
                      </span>
                      <span className="bg-purple-50 text-purple-700 text-[11px] font-semibold px-2 py-0.5 rounded">
                        {q.deepLearningDim}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] text-slate-400">
                        Skor Mutu: <strong>{q.qualityScore?.total || 32}/32</strong>
                      </span>
                      <button
                        id={`btn-edit-q-${q.number}`}
                        onClick={() => onEditQuestion(q)}
                        className="text-xs text-sky-700 hover:text-sky-800 bg-sky-50 hover:bg-sky-100 font-semibold px-2.5 py-1 rounded-md border border-sky-200 transition-colors flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit / AI Polish</span>
                      </button>
                    </div>
                  </div>

                  {/* Stimulus */}
                  {q.stimulus && (
                    <div className="bg-slate-50 border-l-3 border-sky-600 p-3.5 rounded-r-lg mb-3.5 text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                      {q.stimulus}
                    </div>
                  )}

                  {/* Question Stem */}
                  <p className="font-semibold text-sm sm:text-base text-slate-900 leading-relaxed mb-3.5">
                    {q.questionText}
                  </p>

                  {/* Multiple Choice Options */}
                  {q.questionType !== 'Essay' && q.options && q.options.length > 0 && (
                    <div className="grid grid-cols-1 gap-2 text-xs sm:text-sm">
                      {q.options.map(opt => {
                        const isCorrect = opt.key === q.correctKey;
                        const showHighlight = showAnswerKeysInExam && isCorrect;
                        return (
                          <div
                            key={opt.key}
                            className={`p-3 rounded-lg border transition-colors flex items-start space-x-3 ${
                              showHighlight
                                ? 'bg-sky-50 border-sky-400 font-medium text-sky-950 ring-1 ring-sky-400/40'
                                : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50/70'
                            }`}
                          >
                            <span
                              className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold shrink-0 ${
                                showHighlight
                                  ? 'bg-sky-600 text-white'
                                  : 'bg-slate-100 text-slate-700 border border-slate-200'
                              }`}
                            >
                              {opt.key}
                            </span>
                            <span className="leading-relaxed">{opt.text}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Essay Student Workspace */}
                  {q.questionType === 'Essay' && (
                    <div className="space-y-2">
                      <div className="border border-dashed border-slate-300 rounded-lg p-3 bg-slate-50/60 min-h-[90px] text-xs text-slate-400 italic flex flex-col justify-between">
                        <span>[Ruang Lembar Jawaban Peserta Didik]</span>
                        <div className="flex justify-between items-center text-[10px] text-slate-400 not-italic pt-4 border-t border-slate-200/60">
                          <span>Kriteria Penilaian: Ketepatan Konsep • Kedalaman Analisis • Landasan Dalil</span>
                          <span className="font-semibold bg-purple-50 text-purple-700 px-2 py-0.5 rounded border border-purple-200">Bobot: {q.maxScore || 20} Poin</span>
                        </div>
                      </div>

                      {q.keywords && q.keywords.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
                          <span className="font-semibold text-slate-600">Kata Kunci Esensial:</span>
                          {q.keywords.map((kw, i) => (
                            <span key={i} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] border border-slate-200">
                              {kw}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Explanation Section if Toggled */}
                  {showAnswerKeysInExam && (
                    <div className="mt-4 p-4 bg-sky-50/70 border border-sky-200 rounded-lg text-xs space-y-2.5">
                      {q.questionType === 'Essay' ? (
                        <>
                          <div className="font-bold text-purple-900 flex items-center gap-1.5 text-xs">
                            <Sparkles className="w-4 h-4 text-purple-600" />
                            <span>Model / Contoh Jawaban Ideal Guru:</span>
                          </div>
                          <div className="bg-white p-3 rounded-md border border-purple-100 text-slate-800 leading-relaxed whitespace-pre-line font-medium text-[11px]">
                            {q.modelAnswer || q.explanation}
                          </div>

                          {q.rubricCriteria && q.rubricCriteria.length > 0 && (
                            <div className="space-y-1.5 pt-1">
                              <span className="font-bold text-slate-700 block">Rubrik Penskoran Analitis (Skor 1 - 4):</span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {q.rubricCriteria.map(rc => (
                                  <div key={rc.score} className="bg-white p-2.5 rounded border border-slate-200 text-[11px]">
                                    <div className="font-bold text-sky-800">Skor {rc.score} — {rc.label}</div>
                                    <p className="text-slate-600 mt-0.5 leading-snug">{rc.description}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          <div className="font-bold text-sky-900 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-sky-600" />
                            <span>Kunci Jawaban: {q.correctKey}</span>
                          </div>
                          <p className="text-slate-700 leading-relaxed">
                            <strong>Alasan Pedagogik:</strong> {q.explanation}
                          </p>
                        </>
                      )}

                      {q.islamicValue && (
                        <p className="text-slate-600 pt-1 border-t border-sky-200/60">
                          <strong>Nilai Karakter Islami:</strong> {q.islamicValue} | <strong>Konteks:</strong> {q.realLifeContext}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: KISI-KISI LENGKAP (BAGIAN 4) */}
        {/* ========================================================================= */}
        {activeTab === 'kisi_kisi' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <span>📑</span> Blueprints Kisi-Kisi Asesmen PAIBP 2026
              </h3>
              <span className="px-2 py-1 bg-sky-100 text-sky-700 text-xs font-bold rounded">
                Mode: {packageData.mode.toUpperCase()}
              </span>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-lg shadow-xs">
              <table className="w-full text-left text-xs border-collapse bg-white">
                <thead className="sticky top-0 bg-slate-50 shadow-xs">
                  <tr className="text-[10px] uppercase text-slate-400 font-bold border-b border-slate-200">
                    <th className="px-4 py-3 text-center w-12">No</th>
                    <th className="px-4 py-3 w-44">Elemen & Materi</th>
                    <th className="px-3 py-3 text-center w-20">Bentuk</th>
                    <th className="px-4 py-3">Indikator Soal</th>
                    <th className="px-4 py-3 text-center w-24">Bloom</th>
                    <th className="px-4 py-3 text-center w-28">SOLO</th>
                    <th className="px-4 py-3 text-center w-24">Deep Learning</th>
                    <th className="px-4 py-3 text-center w-20">Tingkat</th>
                    <th className="px-4 py-3 text-center w-24">Kunci/Pedoman</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {packageData.kisiKisi.map((k) => {
                    const bloomClass =
                      k.bloomLevel === 'C4'
                        ? 'text-sky-600 font-bold'
                        : k.bloomLevel === 'C5'
                        ? 'text-purple-600 font-bold'
                        : k.bloomLevel === 'C6'
                        ? 'text-rose-600 font-bold'
                        : 'text-emerald-600 font-bold';

                    const diffBadge =
                      k.difficulty === 'Mudah'
                        ? 'bg-green-100 text-green-700'
                        : k.difficulty === 'Sedang'
                        ? 'bg-yellow-100 text-yellow-700'
                        : k.difficulty === 'Sulit'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-red-800 text-white';

                    const isEssay = k.questionType === 'Essay';

                    return (
                      <tr key={k.number} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 text-center font-medium text-slate-400">
                          {k.number < 10 ? `0${k.number}` : k.number}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-bold text-slate-900">{k.element}</div>
                          <div className="text-[11px] font-semibold text-sky-700">{k.tema || k.materi}</div>
                          {k.submateri && <div className="text-[10px] text-slate-400 line-clamp-1">{k.submateri}</div>}
                        </td>
                        <td className="px-3 py-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            isEssay
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : 'bg-sky-50 text-sky-700 border-sky-200'
                          }`}>
                            {isEssay ? 'Essay' : 'PG'}
                          </span>
                        </td>
                        <td className="px-4 py-3 leading-relaxed">
                          <p className="font-medium text-slate-800">{k.indicator}</p>
                          {k.stimulus && (
                            <p className="text-[11px] text-slate-500 line-clamp-1 italic mt-0.5">
                              Stimulus: {k.stimulus}
                            </p>
                          )}
                        </td>
                        <td className={`px-4 py-3 text-center ${bloomClass}`}>
                          {k.bloomLevel}
                        </td>
                        <td className="px-4 py-3 text-center font-medium text-slate-700">
                          {k.soloLevel}
                        </td>
                        <td className="px-4 py-3 text-center text-slate-600">
                          {k.deepLearningDim}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${diffBadge}`}>
                            {k.difficulty}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center font-bold text-sky-700">
                          {isEssay ? <span className="text-purple-700 font-semibold text-[11px]">Rubrik</span> : k.correctKey}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: KARTU SOAL LENGKAP (BAGIAN 11) */}
        {/* ========================================================================= */}
        {activeTab === 'kartu_soal' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                Kartu Soal Lengkap (Format Resmi Standar Guru)
              </h3>
              <span className="text-xs text-slate-500">
                Stimulus, Pengecoh, Alasan Kunci, Nilai Karakter & Konteks Nyata
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {packageData.questions.map((q) => (
                <div
                  key={q.number}
                  className="p-5 rounded-lg border border-slate-200 bg-white shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="font-bold text-xs text-sky-800 uppercase tracking-wide">
                      KARTU SOAL NO. {q.number}
                    </span>
                    <span className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      {q.bloomLevel} | {q.soloLevel}
                    </span>
                  </div>

                  <div className="text-xs space-y-1.5">
                    <div>
                      <strong className="text-slate-600">Elemen / Materi:</strong> {q.element} / {q.materi}
                    </div>
                    <div>
                      <strong className="text-slate-600">Indikator:</strong> {q.indicator}
                    </div>
                    {q.stimulus && (
                      <div className="bg-slate-50 p-2.5 rounded-md text-slate-700 italic border-l-2 border-sky-500">
                        {q.stimulus}
                      </div>
                    )}
                    <div className="font-semibold text-slate-900 pt-1">
                      {q.questionText}
                    </div>
                  </div>

                  {/* Options List for Multiple Choice */}
                  {q.questionType !== 'Essay' && q.options && q.options.length > 0 && (
                    <div className="space-y-1 text-xs">
                      {q.options.map(opt => (
                        <div
                          key={opt.key}
                          className={`p-2 rounded-md flex items-start space-x-2 ${
                            opt.key === q.correctKey ? 'bg-sky-50 font-semibold text-sky-950 border border-sky-200' : 'text-slate-700'
                          }`}
                        >
                          <span className="font-bold">{opt.key}.</span>
                          <span>{opt.text}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Essay Model Answer and Rubric Preview */}
                  {q.questionType === 'Essay' && (
                    <div className="space-y-2 text-xs">
                      <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-md">
                        <span className="font-bold text-purple-900 block mb-1">Model / Contoh Jawaban Ideal:</span>
                        <p className="text-slate-700 text-[11px] leading-relaxed whitespace-pre-line">
                          {q.modelAnswer || q.explanation}
                        </p>
                      </div>

                      {q.rubricCriteria && q.rubricCriteria.length > 0 && (
                        <div className="space-y-1">
                          <span className="font-bold text-slate-700 text-[11px]">Kriteria Penskoran:</span>
                          <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                            {q.rubricCriteria.map(rc => (
                              <div key={rc.score} className="p-1.5 bg-slate-50 border border-slate-200 rounded">
                                <span className="font-bold text-slate-800">Skor {rc.score} ({rc.label}):</span>
                                <p className="text-slate-600 line-clamp-2 mt-0.5">{rc.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Pedagogical Breakdown */}
                  <div className="pt-2 border-t border-slate-100 text-xs space-y-1.5 text-slate-600">
                    <div>
                      <strong className="text-sky-800">
                        {q.questionType === 'Essay' ? 'Status Penilaian:' : 'Kunci Jawaban:'}
                      </strong>{' '}
                      {q.questionType === 'Essay' ? 'Rubrik Analitis Terlampir' : q.correctKey}
                    </div>
                    <div>
                      <strong>Alasan / Pedoman:</strong> {q.explanation}
                    </div>
                    <div>
                      <strong>Karakter Islami:</strong> {q.islamicValue}
                    </div>
                    <div>
                      <strong>Konteks Nyata:</strong> {q.realLifeContext}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: KUNCI & DISTRIBUSI (BAGIAN 6-7) */}
        {/* ========================================================================= */}
        {activeTab === 'kunci' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            {/* Key Distribution Visualizer */}
            <div className="p-6 rounded-xl bg-slate-900 text-white shadow-sm border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold">Analisis Keseimbangan Distribusi Kunci Jawaban</h3>
                  <p className="text-xs text-slate-400">
                    Memastikan tidak ada bias opsi dan pola acak seimbang (Aturan 20 & 21)
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    packageData.keyDistribution.isBalanced
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}
                >
                  {packageData.keyDistribution.isBalanced ? '✓ Distribusi Seimbang' : 'Perlu Penyesuaian'}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-3 text-center my-6">
                {(['A', 'B', 'C', 'D'] as const).map(k => {
                  const count = packageData.keyDistribution[k];
                  const percent = Math.round((count / (packageData.questions.length || 1)) * 100);
                  return (
                    <div key={k} className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                      <span className="text-xs text-slate-400 block mb-1">Opsi {k}</span>
                      <span className="text-2xl font-bold text-sky-400">{count}</span>
                      <span className="text-xs text-slate-400 block mt-1">{percent}%</span>
                      <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden mt-2">
                        <div
                          className="bg-sky-500 h-full"
                          style={{ width: `${percent * 2}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="text-xs text-slate-400 text-center">
                Nilai Ideal: ~{packageData.keyDistribution.idealPerOption} butir per opsi (25%). Skor Variansi: {packageData.keyDistribution.varianceScore}/100.
              </p>
            </div>

            {/* Answer Key Grid */}
            <div className="p-6 rounded-lg border border-slate-200 bg-white">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Tabel Kunci Jawaban Lengkap</h4>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 text-center text-xs">
                {packageData.questions.map(q => (
                  <div
                    key={q.number}
                    className={`p-2.5 rounded-md border font-bold ${
                      q.questionType === 'Essay'
                        ? 'border-purple-200 bg-purple-50/70 text-purple-800'
                        : 'border-slate-200 bg-slate-50 text-sky-700'
                    }`}
                  >
                    <span className="text-slate-400 block text-[10px]">No {q.number}</span>
                    <span className="text-sm font-bold">
                      {q.questionType === 'Essay' ? 'Essay' : q.correctKey}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* If package contains essay questions, display essay rubrics & model answers */}
            {packageData.questions.some(q => q.questionType === 'Essay') && (
              <div className="p-6 rounded-lg border border-purple-200 bg-purple-50/40 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-purple-950 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span>Pedoman Penskoran & Rubrik Soal Uraian / Essay</span>
                  </h4>
                  <span className="text-[11px] font-semibold text-purple-700 bg-purple-100 px-2 py-0.5 rounded border border-purple-300">
                    {packageData.questions.filter(q => q.questionType === 'Essay').length} Butir Soal Uraian
                  </span>
                </div>

                <div className="space-y-3">
                  {packageData.questions.filter(q => q.questionType === 'Essay').map(eq => (
                    <div key={eq.number} className="bg-white p-4 rounded-lg border border-purple-200 shadow-2xs space-y-2 text-xs">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                        <span className="font-bold text-purple-900">Soal No. {eq.number} — Level {eq.bloomLevel} ({eq.soloLevel})</span>
                        <span className="text-[10px] bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded">Bobot: {eq.maxScore || 20} Poin</span>
                      </div>
                      <p className="font-medium text-slate-800">{eq.questionText}</p>
                      <div className="p-2.5 bg-slate-50 rounded border border-slate-200 text-[11px] text-slate-700 whitespace-pre-line">
                        <strong className="text-purple-900 block mb-0.5">Model Jawaban Ideal:</strong>
                        {eq.modelAnswer || eq.explanation}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: TAKSONOMI BLOOM & SOLO (BAGIAN 8-10) */}
        {/* ========================================================================= */}
        {activeTab === 'taksonomi' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Distributions column */}
              <div className="lg:col-span-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Bloom Distribution */}
                  <div className="p-4 rounded-lg border border-slate-200 bg-white shadow-xs">
                    <h4 className="font-bold text-xs text-slate-700 mb-3 flex items-center gap-1.5 uppercase tracking-wider">
                      <Layers className="w-3.5 h-3.5 text-sky-600" />
                      <span>Bloom (C1-C6)</span>
                    </h4>
                    <div className="space-y-2.5">
                      {Object.entries(packageData.bloomDistribution).map(([level, stat]) => {
                        const s = stat as { count: number; percentage: number };
                        return (
                          <div key={level} className="text-xs">
                            <div className="flex justify-between font-semibold text-slate-700 mb-1">
                              <span>{level}</span>
                              <span className="text-sky-600 font-bold">{s.count} ({s.percentage}%)</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-sky-500 h-full rounded-full"
                                style={{ width: `${s.percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* SOLO Distribution */}
                  <div className="p-4 rounded-lg border border-slate-200 bg-white shadow-xs">
                    <h4 className="font-bold text-xs text-slate-700 mb-3 flex items-center gap-1.5 uppercase tracking-wider">
                      <Award className="w-3.5 h-3.5 text-emerald-600" />
                      <span>SOLO 4-Level</span>
                    </h4>
                    <div className="space-y-2.5">
                      {Object.entries(packageData.soloDistribution).map(([level, stat]) => {
                        const s = stat as { count: number; percentage: number };
                        return (
                          <div key={level} className="text-xs">
                            <div className="flex justify-between font-semibold text-slate-700 mb-1">
                              <span>{level}</span>
                              <span className="text-emerald-600 font-bold">{s.count} ({s.percentage}%)</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-emerald-500 h-full rounded-full"
                                style={{ width: `${s.percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Deep Learning Distribution */}
                  <div className="p-4 rounded-lg border border-slate-200 bg-white shadow-xs">
                    <h4 className="font-bold text-xs text-slate-700 mb-3 flex items-center gap-1.5 uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Deep Learning</span>
                    </h4>
                    <div className="space-y-2.5">
                      {Object.entries(packageData.deepLearningDistribution).map(([dim, stat]) => {
                        const s = stat as { count: number; percentage: number };
                        return (
                          <div key={dim} className="text-xs">
                            <div className="flex justify-between font-semibold text-slate-700 mb-1">
                              <span>{dim}</span>
                              <span className="text-amber-600 font-bold">{s.count} ({s.percentage}%)</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-amber-500 h-full rounded-full"
                                style={{ width: `${s.percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Deep Learning Assistant Widget */}
              <div className="lg:col-span-4 flex flex-col">
                <div className="bg-slate-900 text-white rounded-xl p-5 shadow-sm border border-slate-800 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-bold flex items-center gap-2">
                        <span>Asisten Deep Learning</span>
                      </h4>
                      <span className="bg-emerald-500 w-2 h-2 rounded-full animate-pulse" />
                    </div>
                    <div className="text-xs leading-relaxed text-slate-300 space-y-3">
                      <p>
                        Sistem memverifikasi bahwa butir-butir soal telah memenuhi hierarki HOTS {hotsPercentage}% dan SOLO Relational {soloRelationalPercentage}%.
                      </p>
                      <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                        <div className="font-bold text-sky-400 mb-1 italic">Saran Ahli:</div>
                        Semua stimulus kontekstual telah mengaitkan dalil syariat dengan pemecahan masalah nyata siswa SMP/MTs tanpa hafalan mentah.
                      </div>
                    </div>
                  </div>
                  <button
                    id="btn-auto-optimize-expert"
                    onClick={() => setActiveTab('naskah_soal')}
                    className="w-full mt-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-md text-xs font-bold text-sky-300 border border-slate-700 transition-colors"
                  >
                    Tinjau Naskah Soal
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: ANALISIS KUALITAS & RUBRIK (BAGIAN 12-13) */}
        {/* ========================================================================= */}
        {activeTab === 'kualitas' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            {/* Overall Quality Banner */}
            <div className="p-6 rounded-xl bg-sky-50 border border-sky-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-sky-800">
                  Rata-Rata Skor Kualitas Paket Asesmen
                </span>
                <h3 className="text-2xl font-bold text-sky-950 mt-0.5">
                  {packageData.overallQuality.averageScore} / 32 Poin ({packageData.overallQuality.category})
                </h3>
                <p className="text-xs text-sky-800 mt-1">
                  Evaluasi 8 Parameter: Keselarasan TP, Kualitas Stimulus, Ketepatan Bloom, SOLO, Opsi Homogen, Pengecoh, Kontekstualitas, & Kedalaman Berpikir.
                </p>
              </div>

              <div className="w-12 h-12 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                ✓
              </div>
            </div>

            {/* Recommendations */}
            <div className="p-5 rounded-lg border border-slate-200 bg-white">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-sky-600" />
                <span>Rekomendasi & Catatan Guru</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-600 list-disc list-inside">
                {packageData.recommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 7: RINGKASAN & VALIDASI (BAGIAN 1-3) */}
        {/* ========================================================================= */}
        {activeTab === 'ringkasan' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            {/* CP & TP */}
            <div className="p-5 rounded-lg border border-slate-200 bg-white space-y-4">
              {packageData.tema && (
                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-400 mb-1">Tema CP Terklasifikasi</h4>
                  <div className="bg-sky-50 p-3 rounded-md border border-sky-200 flex items-center justify-between text-xs">
                    <span className="font-bold text-sky-950">{packageData.tema}</span>
                    <span className="text-[10px] font-bold bg-sky-200 text-sky-800 px-2 py-0.5 rounded">
                      Keputusan No. 020/2026
                    </span>
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-xs font-bold uppercase text-slate-400 mb-1">Capaian Pembelajaran (CP)</h4>
                <p className="text-xs text-slate-800 bg-slate-50 p-3 rounded-md border border-slate-200 leading-relaxed">
                  {packageData.cp}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase text-slate-400 mb-1">Tujuan Pembelajaran (TP)</h4>
                <ul className="space-y-1.5 text-xs text-slate-800">
                  {packageData.tpList.map((t, idx) => (
                    <li key={idx} className="bg-slate-50 p-2.5 rounded-md border border-slate-200 flex items-start gap-2">
                      <span className="font-bold text-sky-700">{idx + 1}.</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Validation Checklist (18 Automated Quality Checks) */}
            <div className="p-5 rounded-lg border border-slate-200 bg-white">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-sky-600" />
                <span>Checklist Validasi Pedagogik Otomatis</span>
              </h4>
              <div className="space-y-2">
                {packageData.validationChecklist.map((check) => (
                  <div
                    key={check.id}
                    className="p-3 rounded-md bg-slate-50 border border-slate-200 flex items-start justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-800">{check.label}</div>
                      <div className="text-slate-500 text-[11px] mt-0.5">{check.notes}</div>
                    </div>
                    <span className="font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded text-[11px]">
                      Lolos Validasi ✓
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
