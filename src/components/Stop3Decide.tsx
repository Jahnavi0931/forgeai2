import React, { useState } from "react";
import { 
  UnitInspectionData, 
  CurrencySymbol, 
  DecisionCutoffConfig, 
  ReviewerCorrection 
} from "../types";
import { 
  Split, 
  Sparkles, 
  DollarSign, 
  Sliders, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ArrowDownRight, 
  Cpu, 
  GraduationCap, 
  Check, 
  Trash2, 
  HelpCircle 
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine, 
  Area, 
  ComposedChart 
} from "recharts";

interface Stop3DecideProps {
  units: UnitInspectionData[];
  currency: CurrencySymbol;
  cutoffConfig: DecisionCutoffConfig;
  onChangeCutoffConfig: (config: DecisionCutoffConfig) => void;
  onUpdateDecision: (unitId: string, lane: "Accept" | "Reject" | "Review") => void;
  reviewerCorrections: ReviewerCorrection[];
  onAddReviewCorrection: (correction: ReviewerCorrection) => void;
  onClearReviewCorrections: () => void;
  onOpenEvidenceDrawer: (unit: UnitInspectionData) => void;
}

export const Stop3Decide: React.FC<Stop3DecideProps> = ({
  units,
  currency,
  cutoffConfig,
  onChangeCutoffConfig,
  onUpdateDecision,
  reviewerCorrections,
  onAddReviewCorrection,
  onClearReviewCorrections,
  onOpenEvidenceDrawer
}) => {
  const [reviewNote, setReviewNote] = useState<{ [unitId: string]: string }>({});

  const { costMissedDefect, costFalseReject, costReview, currentCutoff } = cutoffConfig;

  // Exact optimal cutoff formula: t* = C_fr / (C_fr + C_md)
  const optimalCutoff = costFalseReject / (costFalseReject + costMissedDefect);

  // Generate 20 points for the U-shaped Total Cost vs Cutoff curve
  const costCurveData = [];
  let minCost = Infinity;
  let costAt05 = 0;
  let costAtOptimal = 0;

  for (let t = 0.05; t <= 0.95; t += 0.05) {
    const tRounded = parseFloat(t.toFixed(2));
    // Empirical calculation over active units
    let totalCost = 0;
    units.forEach((u) => {
      const p = u.confidence / 100;
      // If we use cutoff t:
      if (p >= tRounded) {
        // Model rejects: false reject risk if truly good (1-p)
        totalCost += (1 - p) * costFalseReject;
      } else {
        // Model accepts: missed defect risk if truly defective (p)
        totalCost += p * costMissedDefect;
      }
    });

    if (totalCost < minCost) minCost = totalCost;
    if (Math.abs(tRounded - 0.50) < 0.02) costAt05 = totalCost;
    if (Math.abs(tRounded - optimalCutoff) < 0.06) costAtOptimal = totalCost;

    costCurveData.push({
      cutoff: tRounded,
      totalCost: Math.round(totalCost),
      isOptimal: Math.abs(tRounded - optimalCutoff) < 0.03
    });
  }

  const potentialSavings = Math.max(0, costAt05 - costAtOptimal);

  // Three Lanes Distribution based on Decision Theory:
  // E[accept] = p * C_md
  // E[reject] = (1 - p) * C_fr
  // Best auto cost = min(E[accept], E[reject])
  // If best auto cost > C_review or novelty flag -> Review lane
  // Else Reject if p >= currentCutoff, else Accept
  const acceptUnits: UnitInspectionData[] = [];
  const reviewUnits: UnitInspectionData[] = [];
  const rejectUnits: UnitInspectionData[] = [];

  units.forEach((u) => {
    const p = u.confidence / 100;
    const expAcceptCost = p * costMissedDefect;
    const expRejectCost = (1 - p) * costFalseReject;
    const bestAutoCost = Math.min(expAcceptCost, expRejectCost);

    const routesToReview = bestAutoCost > costReview || u.isAnomalyNovelty || u.uncertaintyScore > 35;

    if (routesToReview) {
      reviewUnits.push(u);
    } else if (p >= currentCutoff) {
      rejectUnits.push(u);
    } else {
      acceptUnits.push(u);
    }
  });

  const handleReviewAction = (unit: UnitInspectionData, finalLane: "Accept" | "Reject") => {
    onUpdateDecision(unit.id, finalLane);
    // Add reviewer correction to teach the model
    onAddReviewCorrection({
      id: `corr-${Date.now()}`,
      unitId: unit.id,
      originalDefect: unit.defectType,
      correctedDefect: finalLane === "Accept" ? "Pass (Defect-Free)" : unit.defectType,
      finalVerdict: finalLane,
      timestamp: new Date().toLocaleTimeString(),
      note: reviewNote[unit.id] || "Confirmed by expert human triage"
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="bg-[#121C33] border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 text-violet-400 border border-violet-500/30 flex items-center justify-center shadow-md">
              <Split className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-bold text-slate-100 text-lg">
                  Stop 3: Decide — Money Cutoff & Three Physical Lanes
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-violet-500/20 text-[#A78BFA] border border-violet-500/40 text-[10px] font-mono font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#A78BFA]" />
                  IDEA 1 & 2
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Cost-asymmetric decision policy & financial risk routing into Accept, Review, and Reject lanes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <div className="px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>
                Policy Savings vs Default: <strong>{currency}{Math.round(potentialSavings).toLocaleString()}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* IDEA 1: Money Cutoff Parameter Controls & U-Shaped Cost Curve */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Cost Matrix Sliders (5 cols) */}
        <div className="lg:col-span-5 bg-[#121C33] border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="font-heading font-bold text-slate-200 text-sm flex items-center gap-2">
              <Sliders className="w-4 h-4 text-teal-400" />
              <span>Economic Cost Matrix</span>
            </h3>
            <span className="text-[10px] font-mono text-violet-300">IDEA 1</span>
          </div>

          <div className="space-y-3.5 text-xs font-mono">
            {/* Cost of Missed Defect (C_md) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-slate-300 font-bold text-[11px] flex items-center gap-1">
                  <span className="text-rose-400">C_md</span>: Missed Defect (Warranty Escape)
                </span>
                <span className="text-rose-400 font-bold">
                  {currency}{costMissedDefect.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="1000"
                max="25000"
                step="500"
                value={costMissedDefect}
                onChange={(e) => onChangeCutoffConfig({ ...cutoffConfig, costMissedDefect: parseFloat(e.target.value) })}
                className="w-full accent-rose-500"
              />
              <span className="text-[10px] text-slate-500 block">Field recalls, warranty penalties, customer claims</span>
            </div>

            {/* Cost of False Reject (C_fr) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-slate-300 font-bold text-[11px] flex items-center gap-1">
                  <span className="text-amber-400">C_fr</span>: False Reject (Good Unit Scrapped)
                </span>
                <span className="text-amber-400 font-bold">
                  {currency}{costFalseReject.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="10000"
                step="250"
                value={costFalseReject}
                onChange={(e) => onChangeCutoffConfig({ ...cutoffConfig, costFalseReject: parseFloat(e.target.value) })}
                className="w-full accent-amber-500"
              />
              <span className="text-[10px] text-slate-500 block">Scrapped good material, wasted machining cycle</span>
            </div>

            {/* Cost of Human Review (C_review) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-slate-300 font-bold text-[11px] flex items-center gap-1">
                  <span className="text-teal-400">C_review</span>: Human Expert Triage Cost
                </span>
                <span className="text-teal-400 font-bold">
                  {currency}{costReview.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="1500"
                step="50"
                value={costReview}
                onChange={(e) => onChangeCutoffConfig({ ...cutoffConfig, costReview: parseFloat(e.target.value) })}
                className="w-full accent-teal-400"
              />
              <span className="text-[10px] text-slate-500 block">Labor rate per 2-minute visual QA inspection</span>
            </div>

            {/* Current Active Decision Cutoff Slider */}
            <div className="pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between mb-1">
                <span className="text-slate-200 font-bold text-[11px]">
                  Operational Cutoff (t):
                </span>
                <span className="text-cyan-300 font-extrabold text-sm">
                  {currentCutoff.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="0.10"
                max="0.90"
                step="0.02"
                value={currentCutoff}
                onChange={(e) => onChangeCutoffConfig({ ...cutoffConfig, currentCutoff: parseFloat(e.target.value) })}
                className="w-full accent-cyan-400"
              />
            </div>
          </div>

          {/* Mathematical Proof Box */}
          <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1.5 font-mono text-[11px]">
            <div className="text-teal-300 font-bold flex items-center justify-between">
              <span>Cost-Optimal Cutoff Formula:</span>
              <span className="text-slate-400 text-[10px]">Bayes Minimum Risk</span>
            </div>
            <div className="p-1.5 bg-slate-950 rounded border border-slate-800 text-center text-slate-200">
              t* = C_fr / (C_fr + C_md) = <strong className="text-teal-300">{optimalCutoff.toFixed(3)}</strong>
            </div>
            <p className="text-[10px] text-slate-400">
              Because a missed defect costs {currency}{costMissedDefect.toLocaleString()} vs false alarm {currency}{costFalseReject.toLocaleString()}, the optimal decision threshold shifts from 0.50 down to <strong>{optimalCutoff.toFixed(2)}</strong>.
            </p>
          </div>
        </div>

        {/* Total Cost vs Cutoff Chart (7 cols) */}
        <div className="lg:col-span-7 bg-[#121C33] border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-slate-100 text-sm">
                Total Quality Cost vs Decision Cutoff Curve
              </h3>
              <p className="text-xs text-slate-400">
                U-shaped curve demonstrating economic loss minimum at cost-optimal threshold t*
              </p>
            </div>

            <button
              onClick={() => onChangeCutoffConfig({ ...cutoffConfig, currentCutoff: parseFloat(optimalCutoff.toFixed(2)) })}
              className="px-2.5 py-1 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/40 text-[11px] font-mono font-bold hover:bg-teal-500/30 transition"
            >
              Snap to Optimal (t* = {optimalCutoff.toFixed(2)})
            </button>
          </div>

          {/* Chart View */}
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={costCurveData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                <XAxis 
                  dataKey="cutoff" 
                  stroke="#64748B" 
                  tick={{ fill: "#94A3B8", fontSize: 10 }}
                  label={{ value: "Decision Cutoff (t)", position: "insideBottom", offset: -3, fill: "#64748B", fontSize: 10 }}
                />
                <YAxis 
                  stroke="#64748B" 
                  tick={{ fill: "#94A3B8", fontSize: 10 }}
                  tickFormatter={(v) => `${currency}${Math.round(v / 1000)}k`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0F172A", borderColor: "#334155", borderRadius: "8px", fontSize: "12px", fontFamily: "monospace" }}
                  formatter={(val: any) => [`${currency}${Number(val).toLocaleString()}`, "Total Quality Cost"]}
                  labelFormatter={(lbl) => `Cutoff Threshold: ${lbl}`}
                />
                <Area 
                  type="monotone" 
                  dataKey="totalCost" 
                  fill="#2DD4BF" 
                  fillOpacity={0.15} 
                  stroke="#2DD4BF" 
                  strokeWidth={2.5} 
                />
                {/* Reference line for Default Cutoff (0.50) */}
                <ReferenceLine 
                  x={0.50} 
                  stroke="#F43F5E" 
                  strokeDasharray="4 4" 
                  label={{ value: "Default (0.50)", fill: "#F43F5E", fontSize: 10, position: "top" }} 
                />
                {/* Reference line for Optimal Cutoff (t*) */}
                <ReferenceLine 
                  x={parseFloat(optimalCutoff.toFixed(2))} 
                  stroke="#A78BFA" 
                  strokeDasharray="3 3" 
                  label={{ value: `Optimal t* (${optimalCutoff.toFixed(2)})`, fill: "#A78BFA", fontSize: 10, position: "top" }} 
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800">
            <span>Cost at Default (0.50): <strong className="text-rose-400">{currency}{Math.round(costAt05).toLocaleString()}</strong></span>
            <span>Cost at Optimal (t*): <strong className="text-teal-400">{currency}{Math.round(costAtOptimal).toLocaleString()}</strong></span>
            <span>Net Financial Gain: <strong className="text-emerald-300">+{currency}{Math.round(potentialSavings).toLocaleString()}</strong></span>
          </div>
        </div>

      </div>

      {/* IDEA 2: Three Physical Lanes (Accept, Review, Reject) */}
      <div className="bg-[#121C33] border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-bold text-slate-100 text-base">
                Three Physical Lanes Routing Engine
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-violet-500/20 text-[#A78BFA] border border-violet-500/40 text-[10px] font-mono font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#A78BFA]" />
                IDEA 2
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Borderline & high-uncertainty units routed to Human Review queue where reviewer decisions calibrate future AI prompts
            </p>
          </div>

          <div className="text-xs font-mono text-slate-400">
            Total Sorted: <strong className="text-slate-100">{units.length}</strong> units
          </div>
        </div>

        {/* Lanes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* 1. Accept Lane */}
          <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-emerald-500/20">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                    ✓
                  </div>
                  <span className="font-heading font-bold text-emerald-300 text-sm">
                    Accept Lane (Pass)
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold">
                  {acceptUnits.length}
                </span>
              </div>

              <p className="text-[11px] text-slate-400 mt-2 font-mono">
                p &lt; {currentCutoff.toFixed(2)} • Best auto cost &le; {currency}{costReview}
              </p>

              {/* Mini cards preview */}
              <div className="mt-3 space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {acceptUnits.slice(0, 5).map((u) => (
                  <div
                    key={u.id}
                    onClick={() => onOpenEvidenceDrawer(u)}
                    className="p-2 rounded-lg bg-slate-900/80 border border-emerald-500/20 hover:border-emerald-400 cursor-pointer transition font-mono text-[11px] flex items-center justify-between"
                  >
                    <div>
                      <span className="text-emerald-300 font-bold">{u.id}</span>
                      <span className="text-slate-400 ml-1.5 text-[10px]">{u.defectType}</span>
                    </div>
                    <span className="text-slate-500 text-[10px]">Conf: {u.confidence.toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-emerald-500/20 text-[10px] font-mono text-emerald-400">
              Dispatched directly to final shipping assembly
            </div>
          </div>

          {/* 2. Review Lane (Human Triage) */}
          <div className="bg-amber-950/20 border border-amber-500/40 rounded-xl p-4 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-amber-500/20">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                    !
                  </div>
                  <span className="font-heading font-bold text-amber-300 text-sm">
                    Review Lane (Triage)
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-xs font-bold animate-pulse">
                  {reviewUnits.length}
                </span>
              </div>

              <p className="text-[11px] text-slate-400 mt-2 font-mono">
                Auto risk &gt; {currency}{costReview} or Novelty Anomaly
              </p>

              {/* Review units preview with quick action */}
              <div className="mt-3 space-y-2 max-h-48 overflow-y-auto pr-1">
                {reviewUnits.length === 0 ? (
                  <div className="text-center py-6 text-slate-500 font-mono text-xs">
                    No units waiting in review queue
                  </div>
                ) : (
                  reviewUnits.map((u) => (
                    <div
                      key={u.id}
                      className="p-2.5 rounded-lg bg-slate-900/90 border border-amber-500/30 font-mono text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span 
                          onClick={() => onOpenEvidenceDrawer(u)}
                          className="text-amber-300 font-bold hover:underline cursor-pointer"
                        >
                          {u.id}
                        </span>
                        <span className="text-[10px] text-amber-400/90 font-bold">
                          Conf: {u.confidence.toFixed(1)}%
                        </span>
                      </div>

                      <div className="text-[10px] text-slate-300 truncate">
                        {u.defectType} ({u.boundingBox.regionName})
                      </div>

                      {/* Triage action buttons */}
                      <div className="flex items-center gap-1.5 pt-1">
                        <button
                          onClick={() => handleReviewAction(u, "Accept")}
                          className="flex-1 py-1 rounded bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold transition flex items-center justify-center gap-1"
                        >
                          <Check className="w-3 h-3" /> Pass
                        </button>
                        <button
                          onClick={() => handleReviewAction(u, "Reject")}
                          className="flex-1 py-1 rounded bg-rose-950 hover:bg-rose-900 border border-rose-500/40 text-rose-300 text-[10px] font-bold transition flex items-center justify-center gap-1"
                        >
                          <XCircle className="w-3 h-3" /> Scrap
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-amber-500/20 text-[10px] font-mono text-amber-400">
              Expert decisions feed the Few-Shot Prompt Engine
            </div>
          </div>

          {/* 3. Reject Lane */}
          <div className="bg-rose-950/20 border border-rose-500/30 rounded-xl p-4 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-rose-500/20">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs">
                    ✕
                  </div>
                  <span className="font-heading font-bold text-rose-300 text-sm">
                    Reject Lane (Scrap/Rework)
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono text-xs font-bold">
                  {rejectUnits.length}
                </span>
              </div>

              <p className="text-[11px] text-slate-400 mt-2 font-mono">
                p &ge; {currentCutoff.toFixed(2)} • Confirmed high flaw probability
              </p>

              {/* Reject units preview */}
              <div className="mt-3 space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {rejectUnits.slice(0, 5).map((u) => (
                  <div
                    key={u.id}
                    onClick={() => onOpenEvidenceDrawer(u)}
                    className="p-2 rounded-lg bg-slate-900/80 border border-rose-500/20 hover:border-rose-400 cursor-pointer transition font-mono text-[11px] flex items-center justify-between"
                  >
                    <div>
                      <span className="text-rose-300 font-bold">{u.id}</span>
                      <span className="text-slate-400 ml-1.5 text-[10px]">{u.defectType}</span>
                    </div>
                    <span className="text-slate-500 text-[10px]">Conf: {u.confidence.toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-rose-500/20 text-[10px] font-mono text-rose-400">
              Routed to destructive scrap or precision rework station
            </div>
          </div>

        </div>

        {/* Reviewer Teaches Model (Few-Shot Feedback Ledger) */}
        {reviewerCorrections.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-violet-400" />
                <span className="text-xs font-bold text-slate-200 font-mono">
                  Reviewer Feedback Ledger (Few-Shot Calibrations Learned: {reviewerCorrections.length})
                </span>
              </div>

              <button
                onClick={onClearReviewCorrections}
                className="text-[10px] font-mono text-slate-400 hover:text-rose-400 transition"
              >
                Clear Ledger
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {reviewerCorrections.slice(-3).map((c) => (
                <div key={c.id} className="p-2 rounded-lg bg-slate-900 border border-violet-500/30 text-[11px] font-mono">
                  <div className="flex items-center justify-between text-violet-300 font-bold">
                    <span>{c.unitId}</span>
                    <span>Verdict: {c.finalVerdict}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">
                    {c.originalDefect} → {c.correctedDefect}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
