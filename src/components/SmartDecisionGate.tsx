import React, { useState } from "react";
import { UnitInspectionData, DecisionLane, EconomicData } from "../types";
import { DollarSign, CheckCircle2, XCircle, Clock, ArrowRight, Brain, AlertCircle, Info, RefreshCw } from "lucide-react";

interface SmartDecisionGateProps {
  unit: UnitInspectionData;
  onDecisionChange: (unitId: string, newLane: DecisionLane, notes?: string) => void;
  economics: EconomicData;
  onUpdateEconomics: (updated: EconomicData) => void;
}

export const SmartDecisionGate: React.FC<SmartDecisionGateProps> = ({
  unit,
  onDecisionChange,
  economics,
  onUpdateEconomics
}) => {
  const [showCostSettings, setShowCostSettings] = useState(false);
  const [reviewNotes, setReviewNotes] = useState("");
  const [feedbackTaught, setFeedbackTaught] = useState(false);

  // Idea 1: Money Cutoff Formula
  // Optimal Bayes decision threshold for rejection:
  // p* = Cost(False Alarm) / [ Cost(False Alarm) + Cost(Missed Defect Warranty) ]
  const falseAlarmCost = economics.falseAlarmCost || 45;
  const missCost = economics.missedDefectWarrantyCost || 480;
  const optimalMoneyCutoffPct = (falseAlarmCost / (falseAlarmCost + missCost)) * 100;

  // Idea 2: Three Lanes calculation
  // Lane 1: Accept -> Defect probability < optimalMoneyCutoffPct / 2
  // Lane 2: Review -> Defect probability between (optimalMoneyCutoffPct / 2) and (optimalMoneyCutoffPct * 2) or High Uncertainty / OOD
  // Lane 3: Reject -> Defect probability > optimalMoneyCutoffPct * 2
  const defectProbability = unit.defectType === "Pass (Defect-Free)" ? (100 - unit.confidence) : unit.confidence;

  const handleReviewerAction = (decision: DecisionLane) => {
    onDecisionChange(unit.id, decision, reviewNotes);
    setFeedbackTaught(true);
    setTimeout(() => setFeedbackTaught(false), 3500);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-xl text-slate-100">
      {/* Header & Badges */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-500/30">
              Module 4 • Smart Decision Gate
            </span>
            <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-xs font-semibold">
              Idea 1 & Idea 2
            </span>
          </div>
          <h3 className="text-base font-bold text-slate-100 mt-1">
            Cost-Aware 3-Lane Gate & Active Learning Review
          </h3>
        </div>

        <button
          id="btn-toggle-cost-cutoff"
          onClick={() => setShowCostSettings(!showCostSettings)}
          className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700/80 px-2.5 py-1.5 rounded-lg border border-slate-700 transition"
        >
          <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
          <span>Money Cutoff Config</span>
        </button>
      </div>

      {/* Idea 1: Money Cutoff Panel */}
      {showCostSettings && (
        <div className="mt-4 p-4 bg-slate-950/80 rounded-lg border border-slate-800 text-xs space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-slate-300">
            <span className="font-semibold text-amber-300 flex items-center gap-1">
              <Info className="w-3.5 h-3.5" />
              Economic Cutoff Model (Loss Matrix Equilibrium)
            </span>
            <span className="font-mono text-emerald-400 font-bold">
              Cutoff Threshold: {optimalMoneyCutoffPct.toFixed(1)}% risk
            </span>
          </div>

          <p className="text-slate-400 leading-relaxed text-[11px]">
            The model does not use an arbitrary 50% threshold. It sets cutoff <span className="font-mono text-slate-200">p* = C_FA / (C_FA + C_Miss)</span>. 
            Because missing a defective rotor seal in the field costs <span className="text-rose-400 font-semibold">${missCost}</span> (warranty & recall liability), 
            while scrapping costs <span className="text-amber-400 font-semibold">${falseAlarmCost}</span>, the financial cutoff triggers at just <span className="text-emerald-400 font-bold">{optimalMoneyCutoffPct.toFixed(1)}%</span> defect risk.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="text-slate-400 text-[11px] block mb-1">
                Scrap / False Alarm Cost ($/unit)
              </label>
              <input
                type="number"
                id="input-false-alarm-cost"
                value={falseAlarmCost}
                onChange={(e) =>
                  onUpdateEconomics({
                    ...economics,
                    falseAlarmCost: Math.max(1, Number(e.target.value)),
                    scrapCost: Math.max(1, Number(e.target.value))
                  })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-slate-100 font-mono text-xs focus:border-amber-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-slate-400 text-[11px] block mb-1">
                Missed Defect Liability Cost ($/unit)
              </label>
              <input
                type="number"
                id="input-miss-cost"
                value={missCost}
                onChange={(e) =>
                  onUpdateEconomics({
                    ...economics,
                    missedDefectWarrantyCost: Math.max(1, Number(e.target.value))
                  })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-slate-100 font-mono text-xs focus:border-amber-500 focus:outline-hidden"
              />
            </div>
          </div>
        </div>
      )}

      {/* Idea 2: Three Lanes Status Bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-slate-400 font-mono">
            CURRENT UNIT: <strong className="text-slate-200">{unit.id}</strong> ({unit.defectType})
          </span>
          <span className="font-mono text-xs text-slate-300">
            Defect Risk: <strong className="text-amber-400">{defectProbability.toFixed(1)}%</strong> | Uncertainty: <strong className="text-cyan-400">{unit.uncertaintyScore}%</strong>
          </span>
        </div>

        {/* 3-Lane Visual Bar */}
        <div className="grid grid-cols-3 gap-2">
          {/* Lane 1: Accept */}
          <div
            className={`p-3 rounded-lg border text-center transition-all ${
              unit.finalDecision === "Accept"
                ? "bg-emerald-950/50 border-emerald-500 ring-2 ring-emerald-500/30 text-emerald-200"
                : "bg-slate-950/40 border-slate-800 text-slate-400 opacity-60"
            }`}
          >
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <CheckCircle2 className={`w-4 h-4 ${unit.finalDecision === "Accept" ? "text-emerald-400" : "text-slate-500"}`} />
              <span className="font-bold text-xs uppercase tracking-wider">Lane 1: Accept</span>
            </div>
            <p className="text-[10px] text-slate-400">High Confidence Pass (&gt;95%)</p>
            <span className="inline-block mt-1 text-[11px] font-mono font-semibold text-emerald-400">
              Auto-Routed
            </span>
          </div>

          {/* Lane 2: Review */}
          <div
            className={`p-3 rounded-lg border text-center transition-all ${
              unit.finalDecision === "Review"
                ? "bg-amber-950/50 border-amber-500 ring-2 ring-amber-500/30 text-amber-200"
                : "bg-slate-950/40 border-slate-800 text-slate-400 opacity-60"
            }`}
          >
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Clock className={`w-4 h-4 ${unit.finalDecision === "Review" ? "text-amber-400" : "text-slate-500"}`} />
              <span className="font-bold text-xs uppercase tracking-wider">Lane 2: Review</span>
            </div>
            <p className="text-[10px] text-slate-400">Uncertainty &gt; 20% or Novelty</p>
            <span className="inline-block mt-1 text-[11px] font-mono font-semibold text-amber-400">
              Human In The Loop
            </span>
          </div>

          {/* Lane 3: Reject */}
          <div
            className={`p-3 rounded-lg border text-center transition-all ${
              unit.finalDecision === "Reject"
                ? "bg-rose-950/50 border-rose-500 ring-2 ring-rose-500/30 text-rose-200"
                : "bg-slate-950/40 border-slate-800 text-slate-400 opacity-60"
            }`}
          >
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <XCircle className={`w-4 h-4 ${unit.finalDecision === "Reject" ? "text-rose-400" : "text-slate-500"}`} />
              <span className="font-bold text-xs uppercase tracking-wider">Lane 3: Reject</span>
            </div>
            <p className="text-[10px] text-slate-400">Risk &gt; Money Cutoff</p>
            <span className="inline-block mt-1 text-[11px] font-mono font-semibold text-rose-400">
              Quarantine / Scrap
            </span>
          </div>
        </div>
      </div>

      {/* Human Review & Feedback Loop ("Reviewer teaches the model") */}
      <div className="mt-4 pt-4 border-t border-slate-800 bg-slate-950/50 p-3.5 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-semibold text-slate-200">
              Human Reviewer Console (Active Learning Feedback Loop)
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            {unit.reviewedAt ? `Reviewed at ${unit.reviewedAt}` : "Awaiting Operator Sign-Off"}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2">
          <input
            type="text"
            id="input-reviewer-notes"
            placeholder="Add metallurgical/quality engineering observation notes..."
            value={reviewNotes}
            onChange={(e) => setReviewNotes(e.target.value)}
            className="w-full sm:flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
          />

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              id="btn-gate-accept"
              onClick={() => handleReviewerAction("Accept")}
              className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition flex items-center justify-center gap-1 shadow-sm"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Accept Part
            </button>
            <button
              id="btn-gate-review"
              onClick={() => handleReviewerAction("Review")}
              className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium transition flex items-center justify-center gap-1 shadow-sm"
            >
              <Clock className="w-3.5 h-3.5" />
              Flag Review
            </button>
            <button
              id="btn-gate-reject"
              onClick={() => handleReviewerAction("Reject")}
              className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium transition flex items-center justify-center gap-1 shadow-sm"
            >
              <XCircle className="w-3.5 h-3.5" />
              Confirm Reject
            </button>
          </div>
        </div>

        {/* Feedback taught feedback indicator */}
        {feedbackTaught && (
          <div className="mt-2.5 p-2 bg-cyan-950/60 border border-cyan-500/40 rounded flex items-center gap-2 text-xs text-cyan-300 animate-in fade-in">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>
              <strong>Reviewer teaches the model:</strong> Ground truth for <strong>{unit.id}</strong> recorded into online buffer. Model calibration weights updated.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
