import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, CheckCircle2, ChevronRight, X, Database, Brain, Laptop, Layers } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const [wasOffline, setWasOffline] = useState(false);
  const [showReconnectedNotice, setShowReconnectedNotice] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true);
    } else if (wasOffline) {
      setShowReconnectedNotice(true);
      const timer = setTimeout(() => {
        setShowReconnectedNotice(false);
        setWasOffline(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  if (showReconnectedNotice) {
    return (
      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xl animate-bounce border border-emerald-400/40">
        <Wifi className="w-4 h-4 text-emerald-200" />
        <span>Koneksi Pulih — Data offline disinkronkan ke Cloud Database.</span>
      </div>
    );
  }

  if (isOnline) return null;

  return (
    <>
      <div className="fixed bottom-4 left-4 z-50 flex items-center gap-3 rounded-2xl bg-amber-950/95 border border-amber-500/50 px-4 py-2.5 text-xs font-medium text-amber-200 shadow-2xl backdrop-blur-md max-w-md">
        <span className="relative flex h-3 w-3 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
        </span>

        <div className="flex-1">
          <div className="flex items-center gap-1.5 font-bold text-white">
            <WifiOff className="w-3.5 h-3.5 text-amber-400" />
            <span>Mode Offline Aktif</span>
          </div>
          <p className="text-[11px] text-amber-300/90 mt-0.5">
            Aplikasi berjalan tanpa internet. Generator soal lokal & penilaian tetap aktif.
          </p>
        </div>

        <button
          onClick={() => setShowDetailsModal(true)}
          className="px-2.5 py-1 bg-amber-600/60 hover:bg-amber-600 text-white rounded-lg text-[11px] font-bold transition-colors cursor-pointer shrink-0"
        >
          Detail
        </button>
      </div>

      {showDetailsModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/40 rounded-2xl max-w-md w-full p-6 text-white shadow-2xl relative space-y-4">
            <button
              onClick={() => setShowDetailsModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <WifiOff className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Fitur Siap Mode Offline</h3>
                <p className="text-xs text-slate-400">PAIBP FASE D SMART LEARNING PRO 2026</p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-2.5">
                <Brain className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Generator Algoritmik Mandiri:</span>
                  <span className="text-[11px] text-slate-400">
                    Mesin penyusun soal CP No. 020/2026, Taksonomi Bloom C1-C6, dan SOLO Relational berjalan 100% di browser tanpa koneksi internet.
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-2.5">
                <Laptop className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Ujian CBT Siswa Offline:</span>
                  <span className="text-[11px] text-slate-400">
                    Siswa dapat mengerjakan ujian secara lokal, timer berjalan, dan skor dihitung otomatis.
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-start gap-2.5">
                <Database className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Penyimpanan Cache & Auto-Sync:</span>
                  <span className="text-[11px] text-slate-400">
                    Semua hasil asesmen & nilai tersimpan aman di memori perangkat dan otomatis disinkronkan saat terhubung internet.
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowDetailsModal(false)}
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Lanjutkan Bekerja Offline
            </button>
          </div>
        </div>
      )}
    </>
  );
};
