import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  HelpCircle,
  FileText,
  CheckCircle2,
  Award,
  ExternalLink,
  X,
  ShieldCheck,
  FileCheck,
  Laptop,
  Database,
  Cloud,
  Key,
  LogOut,
  User,
  ChevronDown,
  Share2
} from 'lucide-react';
import { UserAccount } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  onOpenGuide: () => void;
  onOpenCatalog?: () => void;
  onOpenQuestionBank?: () => void;
  onOpenCbtConverter?: () => void;
  onOpenGrading?: () => void;
  onOpenHolisticAssessment?: () => void;
  onOpenDirectCbt?: () => void;
  onOpenShareCbt?: () => void;
  activeMode: string;
  currentUser?: UserAccount | null;
  onOpenActivation?: () => void;
  onOpenOwnerDashboard?: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenGuide,
  onOpenCatalog,
  onOpenQuestionBank,
  onOpenCbtConverter,
  onOpenGrading,
  onOpenHolisticAssessment,
  onOpenDirectCbt,
  onOpenShareCbt,
  activeMode,
  currentUser,
  onOpenActivation,
  onOpenOwnerDashboard,
  onLogout
}) => {
  const [showAbout, setShowAbout] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center text-white font-bold text-base shadow-sm">
              P
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-base tracking-tight text-white leading-none">PAIBP GEN</span>
                <span className="bg-sky-500/20 text-sky-300 text-[10px] font-bold px-2 py-0.5 rounded tracking-wider border border-sky-400/30 uppercase">
                  Deep Learning 2026
                </span>
                {currentUser?.role === 'owner' && (
                  <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-500/40 uppercase">
                    Owner / Super Admin
                  </span>
                )}
                {currentUser?.role === 'licensed' && (
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/40 uppercase flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Akses Berlisensi</span>
                  </span>
                )}
                {currentUser?.role === 'demo' && (
                  <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-500/40 uppercase">
                    Mode Demo (Fitur Terbatas)
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block mt-0.5">
                SMP/MTs Fase D (Kelas VII, VIII, IX) • Bloom C1–C6 & SOLO Relational
              </p>
            </div>
          </div>

          {/* Quick Badges & Actions */}
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            {currentUser?.role === 'demo' && onOpenActivation && (
              <button
                onClick={onOpenActivation}
                className="px-2.5 py-1.5 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-md text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer animate-pulse"
                title="Masukkan Kode Lisensi Guru untuk membuka seluruh fitur lengkap tanpa batas"
              >
                <Key className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Aktifkan Lisensi</span>
                <span className="sm:hidden">Lisensi</span>
              </button>
            )}
            {onOpenShareCbt && (
              <button
                id="btn-nav-share-cbt"
                onClick={onOpenShareCbt}
                className="px-2.5 sm:px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md border border-emerald-400/50 transition-colors flex items-center gap-1.5 text-xs font-bold shadow-xs cursor-pointer"
                title="Bagikan link ujian CBT ke siswa via WhatsApp / Tautan online valid"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-200" />
                <span>Bagikan Link CBT</span>
              </button>
            )}

            {onOpenDirectCbt && (
              <button
                id="btn-nav-direct-cbt"
                onClick={onOpenDirectCbt}
                className="px-2.5 sm:px-3 py-1.5 bg-linear-to-r from-purple-900 to-indigo-900 hover:from-purple-800 hover:to-indigo-800 text-purple-200 hover:text-white rounded-md border border-purple-500/50 transition-colors flex items-center gap-1.5 text-xs font-bold shadow-xs cursor-pointer"
                title="Buka Ujian CBT Langsung (Computer-Based Test) untuk siswa"
              >
                <Laptop className="w-3.5 h-3.5 text-purple-300" />
                <span>Ujian CBT Langsung</span>
              </button>
            )}

            {onOpenGrading && (
              <button
                id="btn-nav-grading"
                onClick={onOpenGrading}
                className="px-2.5 sm:px-3 py-1.5 bg-linear-to-r from-emerald-950 to-teal-950 hover:from-emerald-900 hover:to-teal-900 text-emerald-300 hover:text-white rounded-md border border-emerald-500/50 transition-colors flex items-center gap-1.5 text-xs font-bold shadow-xs cursor-pointer"
                title="Buku Penilaian Lengkap: Kognitif, Afektif, dan Psikomotorik per Tujuan Pembelajaran"
              >
                <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Buku Nilai (3 Ranah)</span>
              </button>
            )}

            {onOpenGrading && (
              <button
                onClick={onOpenGrading}
                className="hidden lg:flex px-2 py-1.5 bg-emerald-950/70 hover:bg-emerald-900 text-emerald-300 rounded-md border border-emerald-500/30 transition-colors items-center gap-1.5 text-xs font-semibold cursor-pointer"
                title="Cloud Database Firestore Terhubung: Data Siswa (NIS, Nama, Kelas) & Rekap Nilai Tersimpan Permanen"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                <span>Cloud DB Aktif</span>
              </button>
            )}

            {onOpenHolisticAssessment && (
              <button
                id="btn-nav-holistic-rubric"
                onClick={onOpenHolisticAssessment}
                className="hidden sm:flex px-2.5 sm:px-3 py-1.5 bg-sky-950/90 hover:bg-sky-900 text-sky-300 hover:text-white rounded-md border border-sky-500/40 transition-colors items-center gap-1.5 text-xs font-semibold"
                title="Panduan & Rubrik Asesmen PAIBP: 3 Ranah, 5 Elemen, dan 4 Pendekatan Kurikulum Merdeka (P5PPRA)"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                <span>Rubrik Asesmen & P5PPRA</span>
              </button>
            )}

            {onOpenQuestionBank && (
              <button
                id="btn-nav-question-bank"
                onClick={onOpenQuestionBank}
                className="px-2.5 sm:px-3 py-1.5 bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 hover:text-white rounded-md border border-indigo-500/40 transition-colors flex items-center gap-1.5 text-xs font-semibold"
                title="Bank Soal Terstandar PAIBP SMP/MTs"
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                <span>Bank Soal</span>
              </button>
            )}

            {onOpenCbtConverter && (
              <button
                id="btn-nav-cbt-converter"
                onClick={onOpenCbtConverter}
                className="px-2.5 sm:px-3 py-1.5 bg-purple-950/80 hover:bg-purple-900 text-purple-300 hover:text-white rounded-md border border-purple-500/40 transition-colors flex items-center gap-1.5 text-xs font-semibold"
                title="Converter Soal ke Google Form & CBT"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span className="hidden sm:inline">Converter</span> Form & CBT
              </button>
            )}

            {onOpenCatalog && (
              <button
                id="btn-nav-catalog"
                onClick={onOpenCatalog}
                className="hidden md:flex px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-sky-300 hover:text-white rounded-md border border-sky-500/30 transition-colors items-center gap-1.5 text-xs font-semibold"
                title="Katalog Tema CP PAIBP 2026"
              >
                <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                <span>Katalog Tema CP</span>
              </button>
            )}

            <button
              id="btn-nav-pedoman"
              onClick={() => setShowAbout(true)}
              className="px-3 py-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-md border border-slate-700/60 transition-colors flex items-center gap-1.5 text-xs font-medium"
              title="Pedoman Standar 2026"
            >
              <Award className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">Prinsip Sistem</span>
            </button>

            <button
              id="btn-nav-panduan"
              onClick={onOpenGuide}
              className="bg-sky-600 hover:bg-sky-500 text-white px-3.5 py-1.5 rounded-md font-medium text-xs sm:text-sm transition-all flex items-center gap-1.5 shadow-sm"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Panduan Guru</span>
            </button>

            {/* In-App PWA Offline Install Button */}
            <PWAInstallButton />

            {/* User Account / Role Menu */}
            {currentUser && (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={`px-2.5 py-1.5 rounded-md border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    currentUser.role === 'owner'
                      ? 'bg-amber-950/80 text-amber-300 border-amber-500/40 hover:bg-amber-900'
                      : currentUser.role === 'licensed'
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
                  }`}
                  title="Menu Akun & Lisensi"
                >
                  {currentUser.role === 'owner' ? (
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  ) : (
                    <User className="w-3.5 h-3.5" />
                  )}
                  <span className="max-w-[100px] truncate hidden md:inline">
                    {currentUser.displayName}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-3 text-xs space-y-2.5 z-50 animate-fadeIn">
                    <div className="pb-2 border-b border-slate-800">
                      <p className="font-bold text-white truncate">{currentUser.displayName}</p>
                      <p className="text-[11px] text-slate-400 truncate">{currentUser.email || currentUser.schoolName}</p>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          currentUser.role === 'owner'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : currentUser.role === 'licensed'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {currentUser.role === 'owner' ? 'Super Admin' : currentUser.role === 'licensed' ? 'Guru Berlisensi' : 'Mode Demo'}
                        </span>
                        {currentUser.role === 'owner' && currentUser.licenseCode && (
                          <span className="text-[10px] font-mono text-amber-400">
                            {currentUser.licenseCode}
                          </span>
                        )}
                      </div>
                    </div>

                    {currentUser.role === 'owner' && onOpenOwnerDashboard && (
                      <button
                        onClick={() => { setShowUserMenu(false); onOpenOwnerDashboard(); }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-900 text-amber-200 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-400" />
                        <span>Buka Dashboard Owner</span>
                      </button>
                    )}

                    {currentUser.role === 'demo' && onOpenActivation && (
                      <button
                        onClick={() => { setShowUserMenu(false); onOpenActivation(); }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 text-emerald-200 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <Key className="w-4 h-4 text-emerald-400" />
                        <span>Aktivasi Kode Lisensi</span>
                      </button>
                    )}

                    {onLogout && (
                      <button
                        onClick={() => { setShowUserMenu(false); onLogout(); }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-red-300 text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-red-400" />
                        <span>Keluar / Ganti Akun</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* About Modal */}
      {showAbout && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-2xl w-full p-6 text-slate-100 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              id="btn-close-about-modal"
              onClick={() => setShowAbout(false)}
              className="absolute top-4 right-4 p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 rounded bg-sky-500 text-white flex items-center justify-center font-bold">
                P
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Prinsip Asesmen Deep Learning PAIBP 2026</h3>
                <p className="text-xs text-slate-400">SMP/MTs Fase D (Kelas 7, 8, 9) Kurikulum Merdeka</p>
              </div>
            </div>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                <h4 className="font-bold text-sky-400 mb-2 flex items-center gap-2 text-xs uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Hierarki Kualitas Berpikir (Higher Order Thinking)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                  <div className="bg-slate-900 p-2.5 rounded border border-slate-700/80">
                    <span className="text-sky-300 font-bold block mb-0.5">Deep Understanding</span> &gt; Hafalan Rutin
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded border border-slate-700/80">
                    <span className="text-sky-300 font-bold block mb-0.5">Reasoning</span> &gt; Recall
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded border border-slate-700/80">
                    <span className="text-sky-300 font-bold block mb-0.5">Application</span> &gt; Definition
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded border border-slate-700/80">
                    <span className="text-emerald-300 font-bold block mb-0.5">Analysis</span> &gt; Recognition
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded border border-slate-700/80">
                    <span className="text-emerald-300 font-bold block mb-0.5">Reflection</span> &gt; Repetition
                  </div>
                  <div className="bg-slate-900 p-2.5 rounded border border-slate-700/80">
                    <span className="text-emerald-300 font-bold block mb-0.5">Transfer</span> &gt; Routine
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs bg-slate-800/50 p-3.5 rounded-lg border border-slate-700/60">
                <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">Kaidah Opsi Homogen & Distribusi Kunci:</h4>
                <p className="text-slate-400 leading-relaxed">
                  Semua opsi jawaban (A, B, C, D) disusun bernada positif dan masuk akal. Perbedaan opsi kunci bukan antara benar vs salah mentah, melainkan pada kedalaman pemahaman tauhid, ketepatan syariat, dan kemaslahatan moral.
                </p>
                <p className="text-slate-400 leading-relaxed">
                  Distribusi kunci jawaban (A, B, C, D) dihitung secara proporsional (~25% per kunci) tanpa urutan berpola agar reliabilitas tes terjamin.
                </p>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                id="btn-close-about-modal-footer"
                onClick={() => setShowAbout(false)}
                className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-md text-xs font-semibold transition-colors"
              >
                Tutup Pedoman
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
