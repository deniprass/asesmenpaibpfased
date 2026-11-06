import React, { useState } from 'react';
import { AssessmentPackage, UserAccount } from '../types';
import {
  generateGoogleFormsAppScript,
  generateAikenFormat,
  generateMoodleXml,
  generateCandyCbtCsv,
  generateQuizizzCsv,
  generateGoogleFormsFormattedText
} from '../services/cbtFormConverter';
import {
  X,
  Copy,
  Check,
  Download,
  FileCode2,
  ExternalLink,
  Laptop,
  Sparkles,
  HelpCircle,
  FileSpreadsheet,
  Layers,
  CheckCircle2,
  Code,
  Lock,
  Key,
  AlertTriangle
} from 'lucide-react';

interface CbtConverterModalProps {
  packageData: AssessmentPackage;
  onClose: () => void;
  currentUser?: UserAccount | null;
  onOpenActivation?: () => void;
}

type TabType = 'gform-script' | 'aiken' | 'cbt-candy' | 'moodle' | 'quizizz' | 'gform-text';

export const CbtConverterModal: React.FC<CbtConverterModalProps> = ({
  packageData,
  onClose,
  currentUser,
  onOpenActivation
}) => {
  const isDemo = currentUser?.role === 'demo';
  const [demoWarning, setDemoWarning] = useState<string>('');
  const [activeTab, setActiveTab] = useState<TabType>('gform-script');
  const [copied, setCopied] = useState<boolean>(false);

  // Generate contents based on current tab
  const getTabContent = () => {
    switch (activeTab) {
      case 'gform-script':
        return {
          title: 'Google Apps Script (Auto-Create Google Form Quiz)',
          desc: 'Skrip otomatis untuk membuat Google Form Kuis lengkap dengan kunci, skor nilai, stimulus, dan pembahasan hanya dengan 1 kali klik di Google Script.',
          fileExt: 'gs',
          mime: 'text/javascript',
          filename: `GoogleForm_AutoScript_PAIBP_${packageData.identity.grade}.gs`,
          content: generateGoogleFormsAppScript(packageData),
          howTo: [
            'Buka https://script.google.com pada peramban Anda (pastikan sudah login akun Google).',
            'Klik tombol "+ Proyek Baru" (+ New project).',
            'Hapus seluruh teks bawaan di editor, lalu paste kode yang telah Anda salin di bawah ini.',
            'Klik ikon Simpan (Disket), lalu klik tombol "Jalankan" (Run) fungsi createPaibpQuiz.',
            'Beri izin otorisasi saat Google meminta verifikasi akun.',
            'Selesai! Google Form Kuis interaktif siap pakai akan otomatis tercipta di Google Drive Anda.'
          ]
        };
      case 'aiken':
        return {
          title: 'Format Standar AIKEN (Google Forms Add-on & CBT)',
          desc: 'Format teks murni paling populer untuk diimpor ke Google Forms (menggunakan Add-on Form Builder/Recycler), Moodle, MauUjian, dan Canvas.',
          fileExt: 'txt',
          mime: 'text/plain',
          filename: `Format_AIKEN_PAIBP_${packageData.identity.grade}.txt`,
          content: generateAikenFormat(packageData),
          howTo: [
            'Salin atau download file teks format AIKEN ini.',
            'Buka Google Form Anda, instal add-on seperti "Form Builder" atau "Form Recycler".',
            'Pilih opsi import teks/file, naskah dan kunci jawaban akan otomatis terpetakan tanpa perlu ketik ulang satu per satu.'
          ]
        };
      case 'cbt-candy':
        return {
          title: 'Format Candy CBT / BeeSMART / Ujian Online (.csv)',
          desc: 'Format tabel CSV standar untuk server CBT sekolah (Candy CBT, BeeSMART, Javaclass, FlyExam, dll) dengan struktur kolom nomor, jenis soal, opsi A-D, kunci, dan pembahasan.',
          fileExt: 'csv',
          mime: 'text/csv',
          filename: `Template_CandyCBT_PAIBP_${packageData.identity.grade}.csv`,
          content: generateCandyCbtCsv(packageData),
          howTo: [
            'Download file CSV ini.',
            'Masuk ke panel Admin server CBT sekolah Anda (misal Candy CBT atau BeeSMART).',
            'Pilih menu Bank Soal ➔ Import Soal dari Excel/CSV.',
            'Pilih mata pelajaran PAIBP dan unggah file ini. Seluruh butir soal, stimulus, dan kunci langsung masuk ke bank soal CBT sekolah.'
          ]
        };
      case 'moodle':
        return {
          title: 'Format Moodle XML Quiz',
          desc: 'Format XML standar resmi Moodle LMS. Mendukung impor bank soal lengkap dengan kategori kelas, pembobotan, distraktor, dan umpan balik reflektif.',
          fileExt: 'xml',
          mime: 'application/xml',
          filename: `Moodle_Quiz_PAIBP_${packageData.identity.grade}.xml`,
          content: generateMoodleXml(packageData),
          howTo: [
            'Download file XML ini.',
            'Buka platform Moodle/LMS sekolah Anda.',
            'Buka Course PAIBP ➔ Course Management ➔ Question Bank ➔ Import.',
            'Pilih format "Moodle XML format" dan upload file ini.'
          ]
        };
      case 'quizizz':
        return {
          title: 'Format Quizizz Spreadsheet Import (.csv)',
          desc: 'Template CSV spreadsheet yang kompatibel dengan fitur import spreadsheet Quizizz untuk kuis interaktif kelas.',
          fileExt: 'csv',
          mime: 'text/csv',
          filename: `Quizizz_Import_PAIBP_${packageData.identity.grade}.csv`,
          content: generateQuizizzCsv(packageData),
          howTo: [
            'Download file CSV Quizizz ini.',
            'Buka https://quizizz.com/admin dan klik "Create Quiz".',
            'Pilih opsi "Import from spreadsheet".',
            'Unggah file CSV ini, kuis interaktif lengkap dengan durasi 60 detik dan kunci langsung siap dimainkan bersama siswa di kelas.'
          ]
        };
      case 'gform-text':
        return {
          title: 'Format Teks Rapi Copy-Paste Google Forms',
          desc: 'Format teks tersusun rapi dengan pemisah nomor, stimulus jelas, penanda kunci jawaban, dan pembahasan untuk kemudahan input cepat manual.',
          fileExt: 'txt',
          mime: 'text/plain',
          filename: `GoogleForms_CopyPaste_PAIBP_${packageData.identity.grade}.txt`,
          content: generateGoogleFormsFormattedText(packageData),
          howTo: [
            'Buka Google Form kuis baru Anda.',
            'Gunakan teks terstruktur di bawah ini untuk menyalin stimulus, pertanyaan, opsi, dan pembahasan secara cepat tanpa ribet.'
          ]
        };
    }
  };

  const currentTabInfo = getTabContent();

  const handleCopy = () => {
    if (isDemo) {
      setDemoWarning('Fitur salin naskah konverter CBT terkunci di Mode Demo. Masukkan Kode Aktivasi dari Owner!');
      return;
    }
    navigator.clipboard.writeText(currentTabInfo.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    if (isDemo) {
      setDemoWarning('Unduh berkas skrip / konverter CBT resmi terkunci di Mode Demo. Masukkan Kode Aktivasi dari Owner!');
      return;
    }
    const blob = new Blob([currentTabInfo.content], { type: `${currentTabInfo.mime};charset=utf-8;` });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentTabInfo.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-2xl max-w-4xl w-full p-6 text-slate-800 shadow-2xl relative max-h-[92vh] flex flex-col border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center shadow-md">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Converter Soal ke Google Form & CBT Sekolah
                </h3>
                <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-purple-200">
                  Auto-Export
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Konversi instan {packageData.questions.length} butir soal ke Google Form Quiz, Moodle XML, Candy CBT, BeeSMART, dan Quizizz.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* DEMO NOTICE BANNER */}
        {isDemo && (
          <div className="mt-3 p-3.5 bg-amber-50 border border-amber-300 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900 shadow-xs">
            <div className="flex items-start gap-2.5">
              <Lock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold block text-slate-900">Mode Demo: Converter CBT Dibatasi</strong>
                <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                  Fitur lengkap download Google Apps Script kuis otomatis, Moodle XML, dan Candy CBT hanya dapat digunakan setelah aktivasi dengan <strong>Kode Aktivasi resmi dari Owner</strong>.
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
                className="px-3.5 py-1.5 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg font-bold text-xs shrink-0 flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer w-fit"
              >
                <Key className="w-3.5 h-3.5" />
                <span>Aktivasi Kode Owner</span>
              </button>
            )}
          </div>
        )}

        {demoWarning && (
          <div className="mt-2 p-3 bg-rose-50 border border-rose-300 text-rose-800 rounded-xl text-xs flex items-center justify-between">
            <span className="flex items-center gap-2 font-medium">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              {demoWarning}
            </span>
            <button onClick={() => setDemoWarning('')} className="text-rose-500 hover:text-rose-800 font-bold">✕</button>
          </div>
        )}

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 overflow-x-auto text-xs font-semibold pt-2 scrollbar-none gap-1">
          {[
            { id: 'gform-script', label: '⚡ Google Form Auto (Script)', icon: FileCode2, highlight: true },
            { id: 'aiken', label: '📄 Format AIKEN (Standar)', icon: Layers },
            { id: 'cbt-candy', label: '🖥️ Candy CBT / BeeSMART (CSV)', icon: Laptop },
            { id: 'moodle', label: '🎓 Moodle LMS (XML)', icon: Code },
            { id: 'quizizz', label: '🎮 Quizizz (CSV)', icon: Sparkles },
            { id: 'gform-text', label: '📋 Teks Rapi Form', icon: Copy }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`px-3.5 py-2.5 flex items-center gap-1.5 shrink-0 border-b-2 transition-all text-xs ${
                activeTab === tab.id
                  ? 'border-purple-600 text-purple-700 font-bold bg-purple-50/60'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Details Banner */}
        <div className="py-3 px-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <h4 className="font-bold text-slate-900">{currentTabInfo.title}</h4>
            <p className="text-slate-500 text-[11px] leading-relaxed mt-0.5">{currentTabInfo.desc}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              id="btn-copy-cbt-content"
              onClick={handleCopy}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin!' : 'Salin Semua'}</span>
            </button>
            <button
              id="btn-download-cbt-file"
              onClick={handleDownload}
              className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-semibold text-xs py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-purple-600" />
              <span>Download File (.{currentTabInfo.fileExt})</span>
            </button>
          </div>
        </div>

        {/* Instructions Guide */}
        <div className="p-3 bg-purple-50/50 border-b border-purple-100 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-purple-900 mb-1">
            <HelpCircle className="w-3.5 h-3.5 text-purple-600" />
            <span>Petunjuk Penggunaan Cepat:</span>
          </div>
          <ol className="list-decimal list-inside text-slate-700 text-[11px] space-y-0.5">
            {currentTabInfo.howTo.map((step, idx) => (
              <li key={idx} className="leading-snug">{step}</li>
            ))}
          </ol>
        </div>

        {/* Code / Text Viewer */}
        <div className="flex-1 min-h-[220px] max-h-[360px] overflow-auto p-4 bg-slate-950 text-slate-200 font-mono text-xs rounded-b-xl relative">
          <pre className="whitespace-pre leading-relaxed">{currentTabInfo.content}</pre>
        </div>

        {/* Bottom Bar */}
        <div className="pt-3.5 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Total {packageData.questions.length} Soal • Kunci Jawaban A-D Siap Impor</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-medium rounded-lg transition-colors text-xs"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
