import React from "react";
import { QualityImpactScore, CurrencySymbol } from "../types";
import { X, ShieldCheck, HelpCircle, Activity } from "lucide-react";

interface QISModalProps {
  isOpen: boolean;
  onClose: () => void;
  qis: QualityImpactScore;
  currency: CurrencySymbol;
}

export const QISModal: React.FC<QISModalProps> = ({
  isOpen,
  onClose,
  qis,
  currency
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#121C33] border border-slate-700 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-slate-100 text-base">
                Quality Impact Score (QIS) Mathematical Model
              </h3>
              <p className="text-xs text-slate-400">
                Composite deterministic plant risk score (0 to 100, higher is worse)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Score Summary */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between font-mono">
          <div>
            <span className="text-xs text-slate-400 block">Current Plant QIS Score</span>
            <span className="text-3xl font-extrabold text-teal-300">{qis.score.toFixed(1)}</span>
            <span className="text-xs text-slate-500 block">Band: <strong className="text-slate-300">{qis.band}</strong></span>
          </div>

          <div className="text-right text-xs text-slate-400 space-y-1">
            <div>Healthy: <span className="text-emerald-400">&lt; 25.0</span></div>
            <div>Watch: <span className="text-amber-400">25.0 – 50.0</span></div>
            <div>Critical: <span className="text-rose-400">&gt; 50.0</span></div>
          </div>
        </div>

        {/* Mathematical Formula */}
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-teal-300 space-y-2">
          <div className="text-[11px] text-slate-400 uppercase font-bold">Standard Formula:</div>
          <div className="p-2 bg-slate-900 rounded border border-slate-800 text-center leading-relaxed">
            QIS = 0.30 × DefectRate + 0.30 × CostImpact + 0.20 × ThroughputLoss + 0.10 × ReviewUncertainty + 0.10 × Trend
          </div>
        </div>

        {/* Breakdown Table */}
        <div className="space-y-2 font-mono text-xs">
          <div className="text-slate-300 font-bold">Constituent Factor Contributions:</div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between p-2 rounded bg-slate-900/60">
              <span className="text-slate-300">1. Defect Rate (30% weight)</span>
              <strong className="text-teal-300">{qis.weightedDefectRate.toFixed(1)} pts</strong>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-slate-900/60">
              <span className="text-slate-300">2. Financial Cost Impact (30% weight)</span>
              <strong className="text-teal-300">{qis.weightedCostImpact.toFixed(1)} pts</strong>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-slate-900/60">
              <span className="text-slate-300">3. Line Throughput Loss (20% weight)</span>
              <strong className="text-teal-300">{qis.weightedThroughputLoss.toFixed(1)} pts</strong>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-slate-900/60">
              <span className="text-slate-300">4. Review Queue Uncertainty (10% weight)</span>
              <strong className="text-teal-300">{qis.weightedUncertainty.toFixed(1)} pts</strong>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-slate-900/60">
              <span className="text-slate-300">5. Batch Drift Trend (10% weight)</span>
              <strong className="text-teal-300">{qis.weightedDefectTrend.toFixed(1)} pts</strong>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold font-mono text-xs transition"
          >
            Close Explainer
          </button>
        </div>

      </div>
    </div>
  );
};
