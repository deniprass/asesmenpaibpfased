import React from 'react';
import { Sparkles, Key, AlertTriangle, ShieldCheck, ArrowRight, X } from 'lucide-react';
import { DemoSession, DemoSettings } from '../types';

interface DemoBannerProps {
  demoSession: DemoSession | null;
  demoSettings: DemoSettings;
  onOpenActivation: () => void;
  onExitDemo: () => void;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({
  demoSession,
  demoSettings,
  onOpenActivation,
  onExitDemo
}) => {
  const usageCount = demoSession?.usageCount ?? 0;
  const maxUsage = demoSettings.maxGenerationsPerSession || 2;
  const remaining = Math.max(0, maxUsage - usageCount);
  const maxQuestions = demoSettings.maxQuestionsPerGeneration || 5;

  return (
    <div className="bg-linear-to-r from-amber-950 via-slate-900 to-amber-950 border-b border-amber-500/40 text-amber-200 px-4 py-2 text-xs shadow-sm sticky top-16 z-30">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
        {/* Left Info */}
        <div className="flex items-center gap-2">
          <span className="bg-amber-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded tracking-wider uppercase shrink-0">
            MODE DEMO
          </span>
          <span className="text-slate-200">
            Anda sedang mencoba fitur evaluasi PAIBP Fase D dengan batas uji coba.
          </span>
          <span className="hidden md:inline-flex items-center gap-1 font-semibold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
            <span>Sisa Kuota:</span>
            <span className="font-bold">{remaining} / {maxUsage} generasi</span>
            <span>(Maks {maxQuestions} butir/sesi)</span>
          </span>
        </div>

        {/* Right CTA */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenActivation}
            className="px-3 py-1 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-md font-bold text-xs shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Key className="w-3.5 h-3.5" />
            <span>Aktifkan Lisensi Penuh</span>
            <ArrowRight className="w-3 h-3" />
          </button>

          <button
            onClick={onExitDemo}
            className="text-slate-400 hover:text-white px-2 py-1 rounded text-xs transition-colors cursor-pointer"
            title="Keluar dari mode demo dan kembali ke beranda"
          >
            Keluar Demo
          </button>
        </div>
      </div>
    </div>
  );
};
