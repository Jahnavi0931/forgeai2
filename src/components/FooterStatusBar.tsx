import React from "react";
import { ShieldCheck, Cpu, RefreshCw, Layers } from "lucide-react";

interface FooterStatusBarProps {
  runSeed: number;
  onRandomizeSeed: () => void;
  isSampleData: boolean;
  totalUnitsCount: number;
  currentReplayTime: string;
}

export const FooterStatusBar: React.FC<FooterStatusBarProps> = ({
  runSeed,
  onRandomizeSeed,
  isSampleData,
  totalUnitsCount,
  currentReplayTime
}) => {
  return (
    <footer className="w-full bg-[#0A1020] border-t border-slate-800/80 py-2.5 px-4 sm:px-6 text-xs font-mono text-slate-400 select-none z-30">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: Non-Negotiable Permanent Advisory Chip */}
        <div className="flex items-center gap-2">
          <div className="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold text-[11px] flex items-center gap-1.5 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Simulated - Advisory only - No machine control</span>
          </div>

          <span className="text-slate-600 hidden md:inline">•</span>

          <span className="text-[11px] text-slate-400 hidden md:inline">
            NEURAX 3.0 Domain 2: AI in Industry & Automation
          </span>
        </div>

        {/* Right: Run Seed & Execution Telemetry */}
        <div className="flex items-center gap-3 text-[11px]">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Layers className="w-3.5 h-3.5 text-teal-400" />
            <span>Units Tracked: <strong className="text-slate-100">{totalUnitsCount}</strong></span>
          </div>

          <span className="text-slate-600">•</span>

          <div className="flex items-center gap-1 text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>Clock: <strong className="text-cyan-300">{currentReplayTime}</strong></span>
          </div>

          <span className="text-slate-600">•</span>

          {/* Seed with randomize button */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
            <span className="text-slate-400">Seed:</span>
            <span className="text-teal-300 font-bold">#{runSeed}</span>
            <button
              onClick={onRandomizeSeed}
              className="p-0.5 hover:text-teal-300 transition text-slate-400"
              title="Reseed stochastic variables"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
