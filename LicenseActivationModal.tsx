import React, { useState } from 'react';
import {
  Key,
  CheckCircle2,
  AlertCircle,
  X,
  School,
  User,
  Mail,
  Sparkles,
  ShieldCheck,
  Clock,
  Award,
  Zap
} from 'lucide-react';
import { validateLicenseCode, activateLicense } from '../services/licenseService';
import { UserAccount } from '../types';

interface LicenseActivationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserAccount) => void;
}

export const LicenseActivationModal: React.FC<LicenseActivationModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [licenseCode, setLicenseCode] = useState<string>('');
  const [teacherName, setTeacherName] = useState<string>('');
  const [schoolName, setSchoolName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [isActivating, setIsActivating] = useState<boolean>(false);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  if (!isOpen) return null;

  const handleValidate = async (codeToTest?: string) => {
    const targetCode = (codeToTest || licenseCode).trim().toUpperCase();
    if (!targetCode) {
      setErrorMessage('Masukkan kode lisensi.');
      return;
    }

    setIsValidating(true);
    setErrorMessage('');
    try {
      const result = await validateLicenseCode(targetCode);
      if (result.valid && result.license) {
        setValidationResult(result.license);
        setLicenseCode(targetCode);
        setErrorMessage('');
      } else {
        setValidationResult(null);
        setErrorMessage(result.message || 'Kode lisensi tidak valid atau telah kedaluwarsa.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal memvalidasi kode lisensi.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseCode.trim()) {
      setErrorMessage('Masukkan kode lisensi.');
      return;
    }
    if (!teacherName.trim()) {
      setErrorMessage('Nama Lengkap Guru wajib diisi.');
      return;
    }

    setIsActivating(true);
    setErrorMessage('');
    try {
      const result = await activateLicense({
        code: licenseCode.trim().toUpperCase(),
        name: teacherName.trim(),
        email: email.trim(),
        schoolName: schoolName.trim() || 'SMP / MTs'
      });

      if (result.success && result.user) {
        onSuccess(result.user);
        onClose();
      } else {
        setErrorMessage(result.message || 'Aktivasi lisensi gagal.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kesalahan sistem saat aktivasi.');
    } finally {
      setIsActivating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 text-white shadow-2xl relative max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Aktivasi Fitur Lengkap
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30 uppercase">
                Kode dari Owner
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Sebelum input kode aktivasi, aplikasi berada dalam Mode Demo terbatas. Masukkan kode dari Owner untuk akses penuh.
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-950/60 border border-red-500/40 rounded-xl text-xs text-red-200 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Aktivasi Tidak Dapat Dilanjutkan</p>
              <p className="text-[11px] text-red-300 mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleActivate} className="space-y-4">
          {/* License Code Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1.5 flex items-center justify-between">
              <span>Kode Lisensi / Kode Rahasia Aktivasi</span>
              <span className="text-[11px] text-amber-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Diterbitkan oleh Owner
              </span>
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={licenseCode}
                  onChange={(e) => {
                    setLicenseCode(e.target.value.toUpperCase());
                    setValidationResult(null);
                    setErrorMessage('');
                  }}
                  placeholder="Masukkan kode lisensi atau kode rahasia dari Owner..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white uppercase font-mono tracking-wider focus:outline-hidden focus:border-emerald-500"
                  required
                />
              </div>
              <button
                type="button"
                onClick={() => handleValidate()}
                disabled={isValidating || !licenseCode.trim()}
                className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl border border-emerald-600 transition-colors disabled:opacity-50 shrink-0 cursor-pointer shadow-xs"
              >
                {isValidating ? 'Cek...' : 'Periksa Kode'}
              </button>
            </div>
          </div>

          {/* Validation Result Badge */}
          {validationResult && (
            <div className="p-3 bg-emerald-950/70 border border-emerald-500/50 rounded-xl text-xs space-y-1.5 animate-fadeIn">
              <div className="flex items-center gap-1.5 text-emerald-300 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>
                  {validationResult.isMasterSecret
                    ? 'Kode Rahasia Owner Diterima — Akses Penuh Semua Fitur'
                    : 'Kode Lisensi Valid & Aktif'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 pt-1">
                <div>
                  <span className="text-slate-400 block">Paket:</span>
                  <span className="font-semibold text-white">{validationResult.packageName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Masa Berlaku:</span>
                  <span className="font-semibold text-emerald-300">
                    {validationResult.durationDays === 0 ? 'Selamanya (Akses Penuh Lifetime)' : `${validationResult.durationDays} Hari`}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Status Fitur:</span>
                  <span className="font-semibold text-emerald-400">
                    Semua Fitur Terbuka Penuh
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Tipe Lisensi:</span>
                  <span className="font-semibold text-white capitalize">{validationResult.packageType}</span>
                </div>
              </div>
            </div>
          )}

          {/* Official Owner Issuance Notice (Do NOT show raw codes to non-owner users) */}
          <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1.5 text-xs text-slate-300">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold text-[11px]">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Kode Lisensi & Aktivasi Khusus dari Owner</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Semua fitur (Pembuat Soal HOTS tak terbatas, Ujian CBT Siswa, Ekspor Resmi, dan Buku Nilai 3 Ranah) terbuka penuh setelah aktivasi dengan kode dari <strong>Owner</strong>. Pengguna tanpa kode tetap dapat mengakses <em>Mode Demo (fitur terbatas)</em>.
            </p>
          </div>

          {/* Teacher Info */}
          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Nama Lengkap Guru Pengampu *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  placeholder="Contoh: Ahmad Fauzan, S.Pd.I"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white focus:outline-hidden focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Nama Sekolah / Madrasah
                </label>
                <div className="relative">
                  <School className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    placeholder="SMP Negeri 1..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Email (Opsional untuk Backup)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="guru@sekolah.sch.id"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Benefits summary */}
          <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-3 text-[11px] text-slate-300 space-y-1">
            <div className="font-semibold text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Hak Akses Guru Berlisensi:</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-slate-400 pl-1">
              <li>Generasi soal HOTS tak terbatas (Kelas VII, VIII, IX)</li>
              <li>Ujian CBT Langsung & Anti-Curang dengan Rombel A, B, C, D</li>
              <li>Buku Nilai Komprehensif (Kognitif, Afektif, Psikomotorik)</li>
              <li>Ekspor PDF, DOCX, & Google Forms tanpa watermark</li>
              <li>Ruang kerja pribadi yang aman dan terisolasi</li>
            </ul>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isActivating || !licenseCode.trim() || !teacherName.trim()}
              className="w-full py-3 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isActivating ? (
                <span>Memproses Aktivasi Lisensi...</span>
              ) : (
                <>
                  <Key className="w-4 h-4" />
                  <span>Aktifkan Akun Guru & Masuk Dashboard</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
