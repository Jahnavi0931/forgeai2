import React, { useState } from "react";
import { RecommendationCard, CurrencySymbol } from "../types";
import { 
  Wrench, 
  Sparkles, 
  Download, 
  RotateCw, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  FileText, 
  Layers, 
  ExternalLink 
} from "lucide-react";

interface Stop7FixProps {
  recommendations: RecommendationCard[];
  onRegenerateAdvice: () => Promise<void>;
  isGenerating: boolean;
  currency: CurrencySymbol;
  onDownloadReport: () => void;
  runSeed: number;
}

export const Stop7Fix: React.FC<Stop7FixProps> = ({
  recommendations,
  onRegenerateAdvice,
  isGenerating,
  currency,
  onDownloadReport,
  runSeed
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="bg-[#121C33] border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center shadow-md">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-slate-100 text-lg">
                Stop 7: Fix — Actionable Engineering Directives & Report Export
              </h2>
              <p className="text-xs text-slate-400">
                Data-grounded corrective actions derived strictly from statistical evidence, cycle times & cost balance
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs">
            <button
              onClick={onRegenerateAdvice}
              disabled={isGenerating}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-teal-300 border border-teal-500/30 transition flex items-center gap-2"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isGenerating ? "animate-spin text-teal-400" : ""}`} />
              <span>{isGenerating ? "Synthesizing with Gemini..." : "Regenerate AI Advice"}</span>
            </button>

            <button
              onClick={onDownloadReport}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold shadow-md shadow-teal-500/20 transition flex items-center gap-2"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Run Report (HTML)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recommendations Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-bold text-slate-100 text-base flex items-center gap-2">
            <span>Prioritized Engineering Directives ({recommendations.length})</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">
            Grounding: strictly computed statistics & constraint metrics
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {recommendations.map((rec, idx) => (
            <div
              key={rec.id || idx}
              className="bg-[#121C33] border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4 relative group hover:border-slate-700 transition"
            >
              <div className="space-y-3">
                {/* Category & Confidence Badge */}
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <span className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/30 font-bold">
                    {rec.category}
                  </span>
                  <span className="text-slate-400">{rec.confidence}</span>
                </div>

                {/* Title */}
                <h4 className="font-heading font-bold text-slate-100 text-base">
                  {rec.title}
                </h4>

                {/* Action Directive */}
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                    Engineering Action
                  </span>
                  <p className="text-xs text-slate-200 font-sans leading-relaxed">
                    {rec.action}
                  </p>
                </div>

                {/* Simulated Financial & Throughput Impact */}
                <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold block">
                    Expected Impact (Simulated)
                  </span>
                  <p className="text-xs text-emerald-300 font-sans leading-relaxed">
                    {rec.expectedImpact}
                  </p>
                </div>

                {/* Evidence Metrics */}
                <div className="text-[11px] font-mono text-slate-400 space-y-0.5 pt-1">
                  <span className="text-slate-500 block text-[10px] uppercase">Computed Evidence:</span>
                  <p className="text-slate-300">{rec.evidenceNumbers}</p>
                </div>
              </div>

              {/* Mandatory Advisory Stamp on Every Card */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-amber-300/80">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-amber-400" />
                  Simulated - Advisory only
                </span>
                <span className="text-slate-500">Run #{runSeed}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Report Summary & Export Banner */}
      <div className="bg-[#121C33] border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-800 text-cyan-400 border border-slate-700 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-heading font-bold text-slate-200 text-sm">
              Comprehensive Audit Report Ready
            </h4>
            <p className="text-xs text-slate-400">
              Generates self-contained HTML audit file with data health metrics, Chi-square tables, t-tests, and waterfall chart summary
            </p>
          </div>
        </div>

        <button
          onClick={onDownloadReport}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-mono text-xs font-bold transition flex items-center gap-2"
        >
          <Download className="w-4 h-4 text-teal-400" />
          <span>Export Executive Audit</span>
        </button>
      </div>

    </div>
  );
};
