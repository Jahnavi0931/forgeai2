import React, { useState } from "react";
import { CurrencySymbol, QualityImpactScore } from "../types";
import { 
  Play, 
  Pause, 
  FastForward, 
  RotateCcw, 
  PlusCircle, 
  Sun, 
  Moon, 
  HelpCircle,
  ShieldAlert,
  ChevronDown
} from "lucide-react";

interface HeaderProps {
  isSampleData: boolean;
  currency: CurrencySymbol;
  onChangeCurrency: (c: CurrencySymbol) => void;
  onOpenInsertImage: () => void;
  isReplaying: boolean;
  onToggleReplay: () => void;
  replaySpeed: number;
  onChangeReplaySpeed: (speed: number) => void;
  onStepNext: () => void;
  currentReplayTime: string;
  profitAtRisk: number;
  qis: QualityImpactScore;
  theme: "dark" | "light";
  onToggleTheme: () => void;
  onOpenQisModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isSampleData,
  currency,
  onChangeCurrency,
  onOpenInsertImage,
  isReplaying,
  onToggleReplay,
  replaySpeed,
  onChangeReplaySpeed,
  onStepNext,
  currentReplayTime,
  profitAtRisk,
  qis,
  theme,
  onToggleTheme,
  onOpenQisModal
}) => {
  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false);
  const currencies: CurrencySymbol[] = ["₹", "$", "€", "£", "¥"];

  // QIS color coding
  const qisColor = 
    qis.band === "Healthy" ? "text-emerald-400 border-emerald-500/30 bg-emerald-950/40" :
    qis.band === "Watch" ? "text-amber-400 border-amber-500/30 bg-amber-950/40" :
    "text-rose-400 border-rose-500/30 bg-rose-950/40";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#0A1020]/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: Brand & Tagline & Dataset Status */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-600 p-0.5 shadow-lg shadow-teal-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-[#0A1020] rounded-[10px] flex items-center justify-center">
              <span className="font-heading font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-cyan-400 text-sm tracking-tighter">
                Q2C
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-base sm:text-lg font-bold text-slate-100 tracking-tight flex items-center gap-2">
                Quality-to-Cash Control Room
              </h1>
              
              {/* Dataset Status Chip: Mandatory Honest Label */}
              {isSampleData ? (
                <div 
                  className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-mono font-semibold flex items-center gap-1 cursor-help"
                  title="Benchmark dataset active. Upload your production files in Stop 1: Data Dock."
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  SAMPLE DATA - not your dataset
                </div>
              ) : (
                <div className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  USER DATASET ACTIVE
                </div>
              )}
            </div>
            
            <p className="text-[11px] text-slate-400 font-sans tracking-wide">
              From defect to decision to dollars • <span className="text-teal-400 font-medium">NEURAX 3.0</span>
            </p>
          </div>
        </div>

        {/* Center: Replay Clock Controls */}
        <div className="hidden lg:flex items-center gap-2 bg-[#121C33] border border-slate-800 px-3 py-1.5 rounded-xl shadow-inner text-xs font-mono">
          <span className="text-slate-400 text-[11px] uppercase tracking-wider mr-1">Replay:</span>
          <span className="text-cyan-300 font-bold px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700">
            {currentReplayTime}
          </span>

          <button
            onClick={onToggleReplay}
            className={`p-1 rounded-md transition ${
              isReplaying 
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" 
                : "bg-slate-800 hover:bg-slate-700 text-slate-200"
            }`}
            title={isReplaying ? "Pause continuous playback" : "Play continuous playback"}
          >
            {isReplaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={onStepNext}
            className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title="Step to next log record"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              const speeds = [1, 5, 10, 50];
              const next = speeds[(speeds.indexOf(replaySpeed) + 1) % speeds.length];
              onChangeReplaySpeed(next);
            }}
            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center gap-1 text-[11px]"
            title="Cycle replay playback speed"
          >
            <FastForward className="w-3 h-3 text-cyan-400" />
            <span>{replaySpeed}x</span>
          </button>
        </div>

        {/* Right Controls: Money Meter, QIS, Currency, + Insert Image, Theme */}
        <div className="flex items-center gap-2.5 sm:gap-3 font-mono">
          
          {/* Money Meter (Signature Element 2): Profit at Risk */}
          <div 
            className="px-3 py-1.5 rounded-xl bg-rose-950/30 border border-rose-500/30 flex items-center gap-2 shadow-sm"
            title="Total potential revenue & rework cost exposed to detected flaws in active stream"
          >
            <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <div>
              <div className="text-[9px] uppercase tracking-wider text-rose-300/80 font-bold">
                Profit at Risk
              </div>
              <div className="text-xs sm:text-sm font-extrabold text-rose-300">
                {currency}{Math.round(profitAtRisk).toLocaleString()}
              </div>
            </div>
          </div>

          {/* QIS Gauge (Signature Element 3) */}
          <button
            onClick={onOpenQisModal}
            className={`px-2.5 py-1.5 rounded-xl border flex items-center gap-2 transition hover:brightness-110 ${qisColor}`}
            title="Quality Impact Score (0-100, higher is worse). Click for formula breakdown."
          >
            <div>
              <div className="text-[9px] uppercase tracking-wider opacity-80 font-bold">
                QIS Score
              </div>
              <div className="text-xs sm:text-sm font-extrabold flex items-center gap-1">
                <span>{qis.score.toFixed(1)}</span>
                <span className="text-[10px] uppercase font-bold opacity-75">
                  ({qis.band})
                </span>
              </div>
            </div>
            <HelpCircle className="w-3 h-3 opacity-60" />
          </button>

          {/* Configurable Currency Selector (Mandatory Rule) */}
          <div className="relative">
            <button
              onClick={() => setShowCurrencyMenu(!showCurrencyMenu)}
              className="px-2 py-1.5 rounded-xl bg-[#121C33] border border-slate-700 hover:border-teal-500/50 text-slate-200 text-xs flex items-center gap-1 transition"
              title="Change active currency symbol (default: ₹)"
            >
              <span className="font-bold text-teal-400">{currency}</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {showCurrencyMenu && (
              <div className="absolute right-0 mt-1 w-24 bg-[#172341] border border-slate-700 rounded-xl shadow-xl py-1 z-50">
                {currencies.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      onChangeCurrency(c);
                      setShowCurrencyMenu(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-800 transition flex items-center justify-between ${
                      c === currency ? "text-teal-300 font-bold bg-teal-500/10" : "text-slate-300"
                    }`}
                  >
                    <span>{c}</span>
                    <span className="text-[10px] text-slate-500">
                      {c === "₹" ? "INR" : c === "$" ? "USD" : c === "€" ? "EUR" : c === "£" ? "GBP" : "JPY"}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Primary Action Button: + Insert Image */}
          <button
            onClick={onOpenInsertImage}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-teal-500/20 transition flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="font-sans">Insert Image</span>
          </button>

          {/* Light/Dark Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl bg-[#121C33] border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition"
            title={theme === "dark" ? "Switch to Light Paper theme" : "Switch to Dark Control Room theme"}
          >
            {theme === "dark" ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-cyan-400" />}
          </button>
        </div>

      </div>
    </header>
  );
};
