import React, { useState, useMemo, useRef } from 'react';
import {
  X,
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  FileText,
  Download,
  Copy,
  Check,
  Users,
  Sparkles,
  ArrowRight,
  Info,
  Trash2,
  Filter
} from 'lucide-react';
import { GradeLevel, Semester, PaibpElement, StudentInfo, StudentTpGradeRecord, GradingConfiguration } from '../types';
import { recalculateStudentRecord } from '../services/gradingService';

export interface ParsedStudentRow {
  id: string;
  nis: string;
  name: string;
  classGroup: string;
  gender: 'L' | 'P';
  isValid: boolean;
  errorNote?: string;
}

interface StudentImportModalProps {
  onClose: () => void;
  onImportSuccess: (importedStudents: StudentTpGradeRecord[], isAppend: boolean) => void;
  currentGrade: GradeLevel;
  currentSemester: Semester;
  currentElement: PaibpElement | string;
  currentTpId: string;
  currentTpText: string;
  config: GradingConfiguration;
  existingCount: number;
}

export const StudentImportModal: React.FC<StudentImportModalProps> = ({
  onClose,
  onImportSuccess,
  currentGrade,
  currentSemester,
  currentElement,
  currentTpId,
  currentTpText,
  config,
  existingCount
}) => {
  const [activeTab, setActiveTab] = useState<'paste' | 'upload' | 'template'>('paste');
  const [rawText, setRawText] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [defaultClass, setDefaultClass] = useState<string>(`${currentGrade}-A`);
  const [importMode, setImportMode] = useState<'replace' | 'append'>('replace');
  const [initialScoreOption, setInitialScoreOption] = useState<'sample' | 'blank'>('sample');
  const [copiedTemplate, setCopiedTemplate] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sample data to quickly test paste
  const sampleDataText = `NIS\tNama Siswa\tKelas\tJenis Kelamin
24001\tAhmad Fauzi Pratama\t${currentGrade}-A\tL
24002\tAisyah Nur Ramadhani\t${currentGrade}-A\tP
24003\tBilal Hafizh Robbani\t${currentGrade}-A\tL
24004\tDina Khairunnisa\t${currentGrade}-A\tP
24005\tFadhil Ihsan Maulana\t${currentGrade}-A\tL
24006\tFatimah Zahra Wardani\t${currentGrade}-A\tP
24007\tHafiz Al-Ghifari\t${currentGrade}-A\tL
24008\tKayla Azzahra Putri\t${currentGrade}-A\tP
24009\tMuhammad Rayyan Akbar\t${currentGrade}-A\tL
24010\tNabila Syakira Anwar\t${currentGrade}-A\tP`;

  // Parse lines into structured rows
  const parsedRows: ParsedStudentRow[] = useMemo(() => {
    if (!rawText.trim()) return [];

    const lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const results: ParsedStudentRow[] = [];

    // Common header indicator words to skip
    const headerIndicators = ['nis', 'nisn', 'nama', 'siswa', 'kelas', 'gender', 'jenis kelamin', 'no', 'nomor'];

    lines.forEach((line, index) => {
      // Determine delimiter: tab, comma, semicolon, or pipe
      let parts: string[] = [];
      if (line.includes('\t')) {
        parts = line.split('\t');
      } else if (line.includes(';')) {
        parts = line.split(';');
      } else if (line.includes('|')) {
        parts = line.split('|');
      } else if (line.includes(',')) {
        parts = line.split(',');
      } else {
        // Space separated with at least 2 tokens (e.g. "24001 Ahmad Fauzi")
        parts = line.split(/\s{2,}/); // 2 or more spaces
        if (parts.length < 2) {
          parts = line.split(' ');
        }
      }

      parts = parts.map(p => p.trim()).filter(p => p.length > 0);
      if (parts.length === 0) return;

      // Check if this looks like a header row
      const firstTwoLower = parts.slice(0, 3).map(p => p.toLowerCase());
      const isHeader = firstTwoLower.some(token => 
        headerIndicators.some(h => token === h || token.startsWith(h) || token.includes('nama siswa'))
      );

      if (isHeader && index === 0) {
        // Skip header
        return;
      }

      // Map columns intelligently:
      // Pattern A: [No, NIS, Nama, Kelas, Gender] (5 columns)
      // Pattern B: [NIS, Nama, Kelas, Gender] (4 columns)
      // Pattern C: [NIS, Nama, Kelas] (3 columns)
      // Pattern D: [NIS, Nama] (2 columns)
      // Pattern E: [Nama, Kelas] (2 columns if first is text)
      let nis = '';
      let name = '';
      let classGroup = defaultClass;
      let gender: 'L' | 'P' = 'L';

      if (parts.length >= 5) {
        // Assume col 0 is No, col 1 is NIS, col 2 is Name, col 3 is Class, col 4 is Gender
        if (/^\d+$/.test(parts[0]) && parts[0].length <= 3) {
          nis = parts[1];
          name = parts[2];
          classGroup = parts[3] || defaultClass;
          const g = parts[4]?.toUpperCase();
          if (g === 'P' || g === 'PEREMPUAN' || g === 'WANITA' || g === 'F') gender = 'P';
        } else {
          nis = parts[0];
          name = parts[1];
          classGroup = parts[2] || defaultClass;
          const g = parts[3]?.toUpperCase();
          if (g === 'P' || g === 'PEREMPUAN' || g === 'WANITA' || g === 'F') gender = 'P';
        }
      } else if (parts.length === 4) {
        // [NIS, Nama, Kelas, Gender]
        nis = parts[0];
        name = parts[1];
        classGroup = parts[2] || defaultClass;
        const g = parts[3]?.toUpperCase();
        if (g === 'P' || g === 'PEREMPUAN' || g === 'WANITA' || g === 'F') gender = 'P';
      } else if (parts.length === 3) {
        // [NIS, Nama, Kelas]
        nis = parts[0];
        name = parts[1];
        classGroup = parts[2] || defaultClass;
      } else if (parts.length === 2) {
        // [NIS, Nama]
        if (/^\d+$/.test(parts[0])) {
          nis = parts[0];
          name = parts[1];
        } else {
          name = parts[0];
          classGroup = parts[1];
          nis = `24${(results.length + 1).toString().padStart(3, '0')}`;
        }
      } else if (parts.length === 1) {
        name = parts[0];
        nis = `24${(results.length + 1).toString().padStart(3, '0')}`;
      }

      // Basic validation
      let isValid = true;
      let errorNote = '';

      if (!name || name.trim().length < 2) {
        isValid = false;
        errorNote = 'Nama siswa tidak valid / kosong';
      }

      if (!nis || nis.trim().length === 0) {
        nis = `24${(results.length + 1).toString().padStart(3, '0')}`;
      }

      // Clean up class
      if (!classGroup || classGroup.trim().length === 0) {
        classGroup = defaultClass;
      }

      results.push({
        id: `s-import-${Date.now()}-${results.length}`,
        nis: nis.trim(),
        name: name.trim(),
        classGroup: classGroup.trim(),
        gender,
        isValid,
        errorNote
      });
    });

    return results;
  }, [rawText, defaultClass]);

  const validRows = useMemo(() => parsedRows.filter(r => r.isValid), [parsedRows]);
  const invalidRows = useMemo(() => parsedRows.filter(r => !r.isValid), [parsedRows]);

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setRawText(content);
        setActiveTab('paste');
      }
    };
    reader.readAsText(file);
  };

  // Download template as CSV
  const handleDownloadCsvTemplate = () => {
    const headers = 'NIS,Nama Siswa,Kelas,Jenis Kelamin\n';
    const sampleRows = [
      `24001,Ahmad Fauzi Pratama,${currentGrade}-A,L`,
      `24002,Aisyah Nur Ramadhani,${currentGrade}-A,P`,
      `24003,Bilal Hafizh Robbani,${currentGrade}-A,L`,
      `24004,Dina Khairunnisa,${currentGrade}-A,P`,
      `24005,Fadhil Ihsan Maulana,${currentGrade}-A,L`
    ].join('\n');

    const blob = new Blob([headers + sampleRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `template_import_siswa_kelas_${currentGrade}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Copy sample template to clipboard
  const handleCopySample = () => {
    navigator.clipboard.writeText(sampleDataText);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2000);
  };

  // Fill sample text directly
  const handleFillSampleDirectly = () => {
    setRawText(sampleDataText);
  };

  // Execute import
  const handleExecuteImport = () => {
    if (validRows.length === 0) return;

    const newRecords: StudentTpGradeRecord[] = validRows.map((row, idx) => {
      let tugas = 0;
      let diagnostik = 0;
      let formatif = 0;
      let sumatif = 0;
      let sikap = 0;
      let keaktifan = 0;
      let presensiSholat = 0;
      let adabEtika = 0;
      let praktik = 0;
      let unjukKerja = 0;
      let produkProyek = 0;

      if (initialScoreOption === 'sample') {
        const baseVariance = (idx * 7) % 19;
        const base = 78 + (baseVariance - 5);
        tugas = Math.min(100, Math.max(70, base + ((idx * 3) % 9) - 2));
        diagnostik = Math.min(100, Math.max(68, base - 3 + ((idx * 5) % 7)));
        formatif = Math.min(100, Math.max(72, base + ((idx * 2) % 10) - 2));
        sumatif = Math.min(100, Math.max(70, base + ((idx * 4) % 11) - 3));

        sikap = Math.min(100, Math.max(78, 83 + ((idx * 3) % 14)));
        keaktifan = Math.min(100, Math.max(75, 81 + ((idx * 4) % 16) - 2));
        presensiSholat = Math.min(100, Math.max(82, 86 + ((idx * 2) % 13)));
        adabEtika = Math.min(100, Math.max(80, 85 + ((idx * 5) % 12)));

        praktik = Math.min(100, Math.max(72, base + ((idx * 3) % 11) - 1));
        unjukKerja = Math.min(100, Math.max(74, base + ((idx * 2) % 9)));
        produkProyek = Math.min(100, Math.max(75, base + ((idx * 4) % 10) - 2));
      }

      const rec: StudentTpGradeRecord = {
        studentId: row.id,
        studentName: row.name,
        nis: row.nis,
        nisn: `00${Math.floor(10000000 + Math.random() * 90000000)}`,
        classGroup: row.classGroup,
        gender: row.gender,
        tpId: currentTpId,
        tpText: currentTpText,
        element: currentElement,
        grade: currentGrade,
        semester: currentSemester,
        kognitif: {
          tugas: initialScoreOption === 'sample' ? tugas : undefined,
          diagnostik: initialScoreOption === 'sample' ? diagnostik : undefined,
          formatif: initialScoreOption === 'sample' ? formatif : undefined,
          sumatif: initialScoreOption === 'sample' ? sumatif : undefined,
          rataRata: 0
        },
        afektif: {
          sikap: initialScoreOption === 'sample' ? sikap : undefined,
          keaktifan: initialScoreOption === 'sample' ? keaktifan : undefined,
          presensiSholat: initialScoreOption === 'sample' ? presensiSholat : undefined,
          adabEtika: initialScoreOption === 'sample' ? adabEtika : undefined,
          rataRata: 0,
          predikat: initialScoreOption === 'sample' ? 'Baik' : 'Cukup'
        },
        psikomotorik: {
          praktik: initialScoreOption === 'sample' ? praktik : undefined,
          unjukKerja: initialScoreOption === 'sample' ? unjukKerja : undefined,
          produkProyek: initialScoreOption === 'sample' ? produkProyek : undefined,
          rataRata: 0,
          predikat: initialScoreOption === 'sample' ? 'Mahir' : 'Cukup'
        },
        nilaiAkhir: 0,
        isTuntas: false,
        deskripsiCapaian: ''
      };

      return recalculateStudentRecord(rec, config);
    });

    onImportSuccess(newRecords, importMode === 'append');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-60 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-linear-to-r from-emerald-900 via-teal-900 to-slate-900 text-white px-6 py-4.5 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Import Data Siswa: NIS, Nama & Kelas
                </h3>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  Excel & CSV Ready
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Salin langsung dari Microsoft Excel / Google Sheets atau unggah berkas CSV daftar peserta didik
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Database Persistence Banner */}
        <div className="bg-emerald-950/40 border-b border-emerald-500/30 px-6 py-2.5 flex items-center justify-between text-xs text-emerald-200 shrink-0">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>
              <strong>Database Cloud Firestore Terhubung:</strong> Seluruh data siswa (NIS, Nama, Kelas) yang di-import otomatis tersimpan permanen di cloud database & tidak akan terhapus.
            </span>
          </div>
          <span className="hidden sm:inline text-[11px] bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-400/30 text-emerald-300 font-mono">
            Firestore Active
          </span>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-slate-100 border-b border-slate-200 px-6 pt-3 flex items-center justify-between shrink-0">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('paste')}
              className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-all flex items-center gap-2 ${
                activeTab === 'paste'
                  ? 'bg-white text-emerald-800 border-t-2 border-emerald-600 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Salin & Tempel (Excel / Teks)</span>
            </button>

            <button
              onClick={() => setActiveTab('upload')}
              className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-all flex items-center gap-2 ${
                activeTab === 'upload'
                  ? 'bg-white text-emerald-800 border-t-2 border-emerald-600 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Unggah Berkas (.csv / .tsv / .txt)</span>
            </button>

            <button
              onClick={() => setActiveTab('template')}
              className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-all flex items-center gap-2 ${
                activeTab === 'template'
                  ? 'bg-white text-emerald-800 border-t-2 border-emerald-600 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Format & Template CSV</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center text-xs text-slate-500 gap-1.5 pb-2">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>Siswa Saat Ini: <strong className="text-slate-700">{existingCount}</strong> siswa</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Default Class & Options Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Kelas Default (Bila Kolom Kosong)
              </label>
              <input
                type="text"
                value={defaultClass}
                onChange={(e) => setDefaultClass(e.target.value)}
                placeholder="Contoh: VII-A, VIII-B, IX-1"
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Metode Impor Roster
              </label>
              <select
                value={importMode}
                onChange={(e) => setImportMode(e.target.value as 'replace' | 'append')}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500"
              >
                <option value="replace">Ganti Semua Siswa ({existingCount} dihapus)</option>
                <option value="append">Tambahkan ke Siswa Saat Ini (+)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Nilai Awal (Baseline TP)
              </label>
              <select
                value={initialScoreOption}
                onChange={(e) => setInitialScoreOption(e.target.value as 'sample' | 'blank')}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500"
              >
                <option value="sample">Nilai Realistis Kurikulum Merdeka (75-92)</option>
                <option value="blank">Kosongkan Nilai (0 - Input Manual Guru)</option>
              </select>
            </div>
          </div>

          {/* TAB 1: PASTE FROM EXCEL */}
          {activeTab === 'paste' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>Tempel Data Siswa (Kolom: NIS | Nama Siswa | Kelas | Jenis Kelamin):</span>
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleFillSampleDirectly}
                    className="text-xs text-emerald-700 hover:text-emerald-800 font-bold bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-md transition-colors flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Isi Contoh 10 Siswa</span>
                  </button>
                  {rawText && (
                    <button
                      type="button"
                      onClick={() => setRawText('')}
                      className="text-xs text-rose-600 hover:text-rose-700 font-medium bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2 py-1 rounded-md transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Bersihkan</span>
                    </button>
                  )}
                </div>
              </div>

              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                rows={7}
                placeholder={`Salin data dari Excel lalu tekan Ctrl+V di sini...\n\nContoh format baris:\n24001\tAhmad Fauzi Pratama\t${currentGrade}-A\tL\n24002\tAisyah Nur Ramadhani\t${currentGrade}-A\tP\n24003\tBilal Hafizh Robbani\t${currentGrade}-A\tL`}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-xs font-mono text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 leading-relaxed"
              />

              <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span>Mendukung pemisah TAB (Excel copy-paste), Koma (CSV), Titik Koma (;), atau Garis Tegak (|). Baris judul/header otomatis dilewati.</span>
              </p>
            </div>
          )}

          {/* TAB 2: UPLOAD FILE */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/40 hover:bg-emerald-50/80 rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-3"
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
                  <Upload className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-emerald-950">
                    Klik untuk Memilih Berkas CSV / TSV / TXT
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-md">
                    Format file yang didukung: berkas teks terpisahkan koma (Comma Separated Values) atau tabulasi teks.
                  </p>
                </div>
                {fileName && (
                  <div className="inline-flex items-center gap-1.5 bg-white border border-emerald-300 text-emerald-800 px-3 py-1.5 rounded-lg text-xs font-bold shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Berkas terpilih: {fileName}</span>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.tsv,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-slate-800">Butuh Template Excel / CSV?</h5>
                  <p className="text-[11px] text-slate-500">Unduh format resmi kolom NIS, Nama, Kelas, dan Gender</p>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadCsvTemplate}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Unduh Format CSV</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: TEMPLATE & FORMAT GUIDELINES */}
          {activeTab === 'template' && (
            <div className="space-y-4">
              <div className="bg-sky-50 border border-sky-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-sky-950 flex items-center gap-1.5">
                    <FileSpreadsheet className="w-4 h-4 text-sky-700" />
                    <span>Format Kolom yang Dianjurkan:</span>
                  </h4>
                  <button
                    onClick={handleCopySample}
                    className="text-xs bg-sky-600 hover:bg-sky-500 text-white px-2.5 py-1 rounded-md font-bold flex items-center gap-1"
                  >
                    {copiedTemplate ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedTemplate ? 'Tersalin!' : 'Salin Contoh Teks'}</span>
                  </button>
                </div>

                <div className="bg-slate-900 text-slate-200 rounded-lg p-3 text-xs font-mono overflow-x-auto leading-relaxed">
                  <div className="text-emerald-400 font-bold mb-1">NIS	Nama Siswa	Kelas	Jenis Kelamin</div>
                  <div>24001	Ahmad Fauzi Pratama	{currentGrade}-A	L</div>
                  <div>24002	Aisyah Nur Ramadhani	{currentGrade}-A	P</div>
                  <div>24003	Bilal Hafizh Robbani	{currentGrade}-A	L</div>
                  <div>24004	Dina Khairunnisa	{currentGrade}-A	P</div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    onClick={handleDownloadCsvTemplate}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh Template CSV ({currentGrade})</span>
                  </button>
                  <button
                    onClick={() => {
                      handleFillSampleDirectly();
                      setActiveTab('paste');
                    }}
                    className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Gunakan Contoh Ini Langsung</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="font-bold text-slate-800 block mb-1">✓ Fleksibilitas Kolom</span>
                  <p className="text-[11px] leading-relaxed text-slate-500">
                    Bisa berupa 3 kolom (NIS, Nama, Kelas) atau 2 kolom (NIS, Nama) di mana kelas akan otomatis diisi dengan Kelas Default.
                  </p>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="font-bold text-slate-800 block mb-1">✓ Terintegrasi Buku Nilai</span>
                  <p className="text-[11px] leading-relaxed text-slate-500">
                    Semua siswa yang diimpor akan langsung memiliki entri nilai kognitif, afektif, dan psikomotorik sesuai TP yang sedang aktif.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* REAL-TIME PREVIEW TABLE */}
          {parsedRows.length > 0 && (
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs bg-white">
              <div className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold">
                    Pratinjau Data Siswa Terbaca: {validRows.length} Siswa Siap Diimpor
                  </span>
                  {invalidRows.length > 0 && (
                    <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded font-bold">
                      {invalidRows.length} Baris Tidak Lengkap
                    </span>
                  )}
                </div>
                <span className="text-slate-400 text-[11px]">
                  Fase D • Kelas {currentGrade} • Semester {currentSemester}
                </span>
              </div>

              <div className="max-h-60 overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-600 border-b border-slate-200 sticky top-0">
                      <th className="py-2 px-3 w-12 text-center font-bold">No</th>
                      <th className="py-2 px-3 w-28 font-bold">NIS</th>
                      <th className="py-2 px-3 font-bold">Nama Lengkap Siswa</th>
                      <th className="py-2 px-3 w-28 font-bold">Kelas</th>
                      <th className="py-2 px-3 w-16 text-center font-bold">L/P</th>
                      <th className="py-2 px-3 w-24 text-center font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {parsedRows.map((row, idx) => (
                      <tr
                        key={row.id}
                        className={`hover:bg-slate-50 transition-colors ${
                          !row.isValid ? 'bg-rose-50/70 text-rose-800' : ''
                        }`}
                      >
                        <td className="py-1.5 px-3 text-center text-slate-500 font-mono text-[11px]">
                          {idx + 1}
                        </td>
                        <td className="py-1.5 px-3 font-mono font-bold text-slate-800 text-[11px]">
                          {row.nis}
                        </td>
                        <td className="py-1.5 px-3 font-semibold text-slate-900">
                          {row.name}
                        </td>
                        <td className="py-1.5 px-3 font-medium text-slate-700">
                          <span className="bg-slate-100 border border-slate-200 text-slate-800 px-2 py-0.5 rounded text-[11px]">
                            {row.classGroup}
                          </span>
                        </td>
                        <td className="py-1.5 px-3 text-center">
                          <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            row.gender === 'L' ? 'bg-sky-100 text-sky-800' : 'bg-pink-100 text-pink-800'
                          }`}>
                            {row.gender}
                          </span>
                        </td>
                        <td className="py-1.5 px-3 text-center">
                          {row.isValid ? (
                            <span className="text-emerald-700 font-bold text-[11px] inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Valid</span>
                            </span>
                          ) : (
                            <span className="text-rose-700 font-bold text-[11px] inline-flex items-center gap-1" title={row.errorNote}>
                              <AlertCircle className="w-3 h-3 text-rose-600" />
                              <span>Error</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="bg-slate-100 border-t border-slate-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-600 text-center sm:text-left">
            {validRows.length > 0 ? (
              <span>
                Siap memproses <strong className="text-emerald-800 font-bold">{validRows.length} siswa</strong> ke dalam buku nilai TP PAIBP.
              </span>
            ) : (
              <span className="text-slate-500">
                Tempel data atau pilih file untuk melihat pratinjau sebelum menyimpan.
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 bg-white hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition-colors"
            >
              Batal
            </button>

            <button
              type="button"
              disabled={validRows.length === 0}
              onClick={handleExecuteImport}
              className={`flex-1 sm:flex-none px-5 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all ${
                validRows.length > 0
                  ? 'bg-linear-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white cursor-pointer'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>
                {importMode === 'replace'
                  ? `Impor & Simpan ke Database (${validRows.length} Siswa)`
                  : `Tambahkan & Simpan ke Database (${validRows.length} Siswa)`}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
