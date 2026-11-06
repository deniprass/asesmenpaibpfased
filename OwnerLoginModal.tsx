import React, { useState } from 'react';
import { ShieldCheck, Key, LogIn, X, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { loginAsOwner } from '../services/authService';
import { UserAccount } from '../types';

interface OwnerLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserAccount) => void;
}

export const OwnerLoginModal: React.FC<OwnerLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [loginMethod, setLoginMethod] = useState<'key' | 'google'>('key');
  const [secretKey, setSecretKey] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  if (!isOpen) return null;

  const handleLoginWithKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!secretKey.trim()) {
      setErrorMessage('Masukkan Kunci Rahasia Owner.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    try {
      const result = await loginAsOwner('key', secretKey.trim());
      if (result.success && result.user) {
        onSuccess(result.user);
        onClose();
      } else {
        setErrorMessage(result.message || 'Kunci rahasia tidak cocok.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginWithGoogle = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const result = await loginAsOwner('google');
      if (result.success && result.user) {
        onSuccess(result.user);
        onClose();
      } else {
        setErrorMessage(result.message || 'Akun Google ini bukan akun Owner terdaftar (denyprass37@gmail.com).');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal login via Google.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-amber-500/30 rounded-2xl max-w-md w-full p-6 text-white shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-1.5">
              Portal Owner & Super Admin
              <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-500/30 uppercase">
                Akses Terproteksi
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Kelola Lisensi, Pengguna, dan Konfigurasi Mode Demo
            </p>
          </div>
        </div>

        {/* Method Switcher */}
        <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 mb-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setLoginMethod('key'); setErrorMessage(''); }}
            className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              loginMethod === 'key'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Kunci Rahasia Owner</span>
          </button>
          <button
            type="button"
            onClick={() => { setLoginMethod('google'); setErrorMessage(''); }}
            className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              loginMethod === 'google'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Google Owner Auth</span>
          </button>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-950/60 border border-red-500/40 rounded-xl text-xs text-red-200 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {loginMethod === 'key' ? (
          <form onSubmit={handleLoginWithKey} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Kunci Rahasia Super Admin (Master Passkey)
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  placeholder="Masukkan Kunci Rahasia Owner..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-hidden focus:border-amber-500 font-mono tracking-wider"
                  required
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Kunci otentikasi rahasia khusus Pemilik Aplikasi / Super Admin.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-linear-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>Memvalidasi Akses Owner...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Masuk Dashboard Owner</span>
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1.5">
              <p className="font-semibold text-amber-300">Akun Email Owner Terdaftar:</p>
              <p className="font-mono text-white text-[11px] bg-slate-900 p-2 rounded border border-slate-800">
                denyprass37@gmail.com
              </p>
              <p className="text-[11px] text-slate-400">
                Hanya email Owner resmi yang akan diberikan hak Super Admin untuk mengelola sistem multi-user.
              </p>
            </div>

            <button
              type="button"
              onClick={handleLoginWithGoogle}
              disabled={isLoading}
              className="w-full py-2.5 bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.27 21.36 7.35 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.27 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span>{isLoading ? 'Memverifikasi Google Sign-In...' : 'Masuk dengan Akun Google Owner'}</span>
            </button>
          </div>
        )}

        <div className="mt-5 pt-3 border-t border-slate-800 text-center text-[11px] text-slate-500">
          PAIBP FASE D SMART LEARNING PRO 2026 • Security Architecture
        </div>
      </div>
    </div>
  );
};
