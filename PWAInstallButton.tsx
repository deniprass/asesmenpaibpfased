import React, { useState } from 'react';
import { Download, Smartphone, X, Check, Laptop } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'nav' | 'hero' | 'compact';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'nav'
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  // If already running as an installed PWA, do not render
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const ok = await install();
      if (ok) {
        setInstallSuccess(true);
        setTimeout(() => setInstallSuccess(false), 3000);
      }
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else {
      // In browsers where beforeinstallprompt was already dismissed or not triggered, show helper modal
      setShowIOSGuide(true);
    }
  };

  return (
    <>
      {installSuccess ? (
        <span className="px-2.5 py-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-bold flex items-center gap-1.5 animate-fadeIn">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>Aplikasi Terpasang!</span>
        </span>
      ) : variant === 'hero' ? (
        <button
          onClick={handleInstallClick}
          className={`px-6 py-3.5 bg-linear-to-r from-emerald-700 via-teal-700 to-emerald-800 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xs rounded-xl shadow-lg border border-emerald-500/40 transition-all flex items-center justify-center gap-2 cursor-pointer ${className}`}
          title="Pasang aplikasi PAIBP ke layar utama perangkat untuk mode offline penuh"
        >
          <Download className="w-4 h-4 text-emerald-300" />
          <span>Pasang Aplikasi (Mode Offline)</span>
        </button>
      ) : (
        <button
          id="btn-pwa-install"
          onClick={handleInstallClick}
          className={`px-2.5 sm:px-3 py-1.5 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 hover:text-white rounded-md border border-emerald-500/40 transition-colors flex items-center gap-1.5 text-xs font-bold shadow-xs cursor-pointer ${className}`}
          title="Pasang aplikasi PAIBP 2026 ke laptop atau ponsel agar bisa digunakan tanpa internet"
        >
          <Download className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Pasang PWA</span>
          <span className="sm:hidden">Install</span>
        </button>
      )}

      {/* Guide Modal for iOS or manual install */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-6 text-white shadow-2xl relative space-y-4">
            <button
              onClick={() => setShowIOSGuide(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Pasang Aplikasi PAIBP</h3>
                <p className="text-xs text-slate-400">Jalankan offline kapan saja</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <p className="font-semibold text-emerald-400">Langkah Pemasangan di Ponsel / Tablet:</p>
              <ol className="list-decimal list-inside space-y-2 text-slate-300">
                <li>
                  Buka menu peramban (<strong className="text-white">Bagikan</strong> di Safari iOS atau <strong className="text-white">Titik Tiga</strong> di Chrome Android).
                </li>
                <li>
                  Pilih opsi <strong className="text-emerald-300">"Tambahkan ke Layar Utama"</strong> (<em>Add to Home Screen</em>) atau <strong className="text-emerald-300">"Instal Aplikasi"</strong>.
                </li>
                <li>
                  Ikon aplikasi PAIBP 2026 akan muncul di beranda dan dapat dibuka langsung tanpa kuota internet.
                </li>
              </ol>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full rounded-xl bg-slate-800 hover:bg-slate-700 py-2.5 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
            >
              Mengerti & Tutup
            </button>
          </div>
        </div>
      )}
    </>
  );
};
