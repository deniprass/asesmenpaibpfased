import React, { useState } from 'react';
import {
  Key,
  Sparkles,
  ShieldCheck,
  BookOpen,
  CheckCircle2,
  Award,
  Layers,
  Laptop,
  FileCheck,
  Brain,
  Zap,
  ArrowRight,
  HelpCircle,
  School,
  Lock,
  ChevronRight,
  ChevronDown,
  Info
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface LandingPageProps {
  onEnterWithLicense: () => void;
  onEnterAsDemo: () => void;
  onOpenGuide: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterWithLicense,
  onEnterAsDemo,
  onOpenGuide
}) => {
  const [showFaq, setShowFaq] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-emerald-950/50">
              P
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-sm tracking-tight text-white leading-none">
                  PAIBP FASE D
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded tracking-wider border border-emerald-500/30 uppercase">
                  SMART LEARNING PRO 2026
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block mt-0.5">
                SMP/MTs Fase D (Kelas VII, VIII, IX) • Kurikulum Merdeka
              </p>
            </div>
          </div>

          {/* Quick Header Navigation */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <PWAInstallButton />

            <button
              onClick={onOpenGuide}
              className="text-slate-300 hover:text-white px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">Petunjuk Penggunaan</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-16 md:pb-24 border-b border-slate-800/80 bg-linear-to-b from-slate-900 via-slate-950 to-slate-950">
        {/* Ambient background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Header Badges */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-emerald-500/40 text-emerald-300 text-xs font-semibold mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Platform Multi-User Terintegrasi Standar Keputusan No. 020 Tahun 2026</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
            PAIBP FASE D <br />
            <span className="bg-linear-to-r from-emerald-400 via-teal-300 to-sky-400 bg-clip-text text-transparent">
              SMART LEARNING PRO 2026
            </span>
          </h1>

          <p className="mt-4 sm:mt-5 text-sm sm:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Aplikasi Pembuat Soal dan Asesmen Pendidikan Agama Islam dan Budi Pekerti SMP Fase D (Kelas VII, VIII, IX). Dirancang untuk guru profesional dengan standar HOTS C4–C6, Taksonomi SOLO, Deep Learning, CBT Langsung, dan Buku Nilai 3 Ranah per Rombel A, B, C, D.
          </p>

          {/* Access Policy Banner */}
          <div className="mt-6 max-w-2xl mx-auto p-3 bg-slate-900/90 border border-amber-500/30 rounded-xl text-xs text-amber-200/90 flex items-center justify-center gap-2">
            <Lock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Ketentuan Akses:</strong> Fitur lengkap hanya dapat diakses dengan <strong>Kode Lisensi Guru</strong> atau akun <strong>Owner</strong>. Akses terbuka tanpa lisensi khusus untuk <strong>Mode Demo (fitur terbatas)</strong>.
            </span>
          </div>

          {/* Primary Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-2xl mx-auto">
            {/* CTA 1: Masuk Dengan Kode Lisensi */}
            <button
              onClick={onEnterWithLicense}
              className="w-full sm:w-auto px-7 py-4 bg-linear-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-emerald-950/60 transition-all flex items-center justify-center gap-2.5 cursor-pointer transform hover:-translate-y-0.5"
            >
              <Key className="w-5 h-5 text-emerald-200" />
              <span>MASUK DENGAN KODE LISENSI (AKSES LENGKAP)</span>
              <ArrowRight className="w-4 h-4 text-emerald-200" />
            </button>

            {/* CTA 2: Coba Demo Gratis */}
            <button
              onClick={onEnterAsDemo}
              className="w-full sm:w-auto px-6 py-4 bg-slate-900 hover:bg-slate-850 text-sky-300 hover:text-white font-bold text-sm rounded-2xl border border-sky-500/40 transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-md"
              title="Coba Mode Demo gratis dengan batas maksimal 5 butir soal dan fitur terbatas"
            >
              <Sparkles className="w-5 h-5 text-sky-400" />
              <span>COBA MODE DEMO (FITUR TERBATAS)</span>
            </button>

            {/* CTA 3: PWA Offline Install */}
            <PWAInstallButton variant="hero" />
          </div>

          <p className="mt-4 text-xs text-slate-400">
            Akses bebas 10–50 butir soal, naskah resmi Word/PDF, CBT siswa valid, dan buku nilai rombel memerlukan kode aktivasi resmi.
          </p>

          {/* Value Props 4-Card Grid */}
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            <div className="bg-slate-900/80 border border-slate-800 p-4 sm:p-5 rounded-2xl hover:border-emerald-500/40 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                <Brain className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">HOTS & Deep Learning</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Penalaran kognitif C4–C6, Taksonomi SOLO Relational, dan stimulus kontekstual etika digital siswa.
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-4 sm:p-5 rounded-2xl hover:border-emerald-500/40 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-3">
                <Laptop className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Ujian CBT Anti-Curang</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Langsung diuji ke siswa dengan deteksi buka tab lain, batas waktu, pengacakan opsi, dan token ujian.
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-4 sm:p-5 rounded-2xl hover:border-emerald-500/40 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center mb-3">
                <FileCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Buku Nilai (Rombel A–D)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Rekap 3 ranah capaian (Kognitif, Afektif, Psikomotorik) per Tujuan Pembelajaran tersimpan di cloud.
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-4 sm:p-5 rounded-2xl hover:border-emerald-500/40 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Ruang Kerja Multi-User</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Isolasi data tiap guru secara mandiri, data tidak tertukar, aman dan dapat diakses bersamaan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Comparison Matrix (Demo vs Licensed) */}
      <section className="py-12 bg-slate-950 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Perbandingan Mode Demo & Akses Berlisensi Penuh
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Mode Demo gratis untuk pengenalan fitur. Akses penuh tanpa batas memerlukan Kode Lisensi resmi.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-300 border-b border-slate-800 text-[11px] font-bold">
                  <tr>
                    <th className="py-3 px-4">Fitur Sistem</th>
                    <th className="py-3 px-4 text-center bg-slate-900/60 text-slate-300 w-44">
                      Pengguna Demo (Gratis)
                    </th>
                    <th className="py-3 px-4 text-center bg-emerald-950/40 text-emerald-300 w-52">
                      Guru Berlisensi (Akses Penuh)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  <tr>
                    <td className="py-3 px-4 font-semibold text-white">Akses Generator Soal PAIBP</td>
                    <td className="py-3 px-4 text-center text-slate-400">Maksimal 5 butir / sesi</td>
                    <td className="py-3 px-4 text-center font-bold text-emerald-400">Tak Terbatas (10–50 Soal)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-white">Materi & Elemen Fase D</td>
                    <td className="py-3 px-4 text-center text-slate-400">Contoh Terpilih</td>
                    <td className="py-3 px-4 text-center font-bold text-emerald-400">Semua Kelas (VII, VIII, IX)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-white">Ujian CBT Langsung & Anti-Curang</td>
                    <td className="py-3 px-4 text-center text-slate-400">Simulasi Terbatas</td>
                    <td className="py-3 px-4 text-center font-bold text-emerald-400">Aktif Penuh (Rombel A–D)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-white">Buku Nilai (3 Ranah Capaian)</td>
                    <td className="py-3 px-4 text-center text-slate-400">Pratinjau Contoh</td>
                    <td className="py-3 px-4 text-center font-bold text-emerald-400">Simpan & Kelola Database Cloud</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-white">Ekspor Naskah PDF, DOCX, & CBT</td>
                    <td className="py-3 px-4 text-center text-slate-400">Dengan Batasan</td>
                    <td className="py-3 px-4 text-center font-bold text-emerald-400">Bebas Unduh Naskah Lengkap</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-white">Ruang Kerja Cloud Terisolasi</td>
                    <td className="py-3 px-4 text-center text-slate-400">Sesi Sementara</td>
                    <td className="py-3 px-4 text-center font-bold text-emerald-400">Permanen & Terproteksi</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ & Guide Section */}
      <section className="py-12 bg-slate-900/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Info className="w-4 h-4 text-sky-400" />
              <span>Petunjuk Singkat Penggunaan & Aktivasi</span>
            </h3>
            <button
              onClick={() => setShowFaq(!showFaq)}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <span>{showFaq ? 'Sembunyikan' : 'Buka Detail'}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showFaq ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
              <h4 className="font-bold text-white mb-1">Bagaimana cara mendapatkan Kode Lisensi?</h4>
              <p className="text-slate-400 leading-relaxed">
                Kode Lisensi diterbitkan secara resmi oleh Owner / Super Admin aplikasi. Anda dapat meminta kode lisensi melalui koordinator MGMP PAIBP atau pimpinan madrasah/sekolah Anda.
              </p>
            </div>

            {showFaq && (
              <>
                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 animate-fadeIn">
                  <h4 className="font-bold text-white mb-1">Apakah hasil kerja saya akan hilang jika lisensi kedaluwarsa?</h4>
                  <p className="text-slate-400 leading-relaxed">
                    Tidak. Seluruh bank soal, hasil ujian CBT, dan buku nilai siswa yang telah tersimpan di cloud database tetap aman tersimpan dan tidak akan dihapus. Anda hanya perlu memperpanjang kode lisensi untuk melanjutkan fitur penambahan asesmen baru.
                  </p>
                </div>

                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 animate-fadeIn">
                  <h4 className="font-bold text-white mb-1">Bagaimana isolasi data antar-guru bekerja?</h4>
                  <p className="text-slate-400 leading-relaxed">
                    Setiap guru yang mengaktifkan kode lisensi memiliki Workspace ID unik. Soal dan nilai yang Anda simpan tidak dapat dibaca, diedit, atau dihapus oleh guru lain meskipun berasal dari sekolah yang sama.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-slate-950 border-t border-slate-800 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <p className="text-slate-400 font-semibold">
              PAIBP FASE D SMART LEARNING PRO 2026
            </p>
            <p className="text-[11px] text-slate-500">
              Pendidikan Agama Islam dan Budi Pekerti • SMP/MTs Fase D (Kelas 7, 8, 9)
            </p>
          </div>
          <div className="text-[11px] text-slate-500">
            Hak Cipta Terpelihara © 2026 • Arsitektur Multi-User Terproteksi
          </div>
        </div>
      </footer>
    </div>
  );
};
