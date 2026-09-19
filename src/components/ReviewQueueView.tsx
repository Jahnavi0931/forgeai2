import React from "react";
import { UnitInspectionData, DecisionLane } from "../types";
import { Clock, CheckCircle2, XCircle, AlertTriangle, ArrowRight, ShieldAlert, FileText } from "lucide-react";

interface ReviewQueueViewProps {
  units: UnitInspectionData[];
  onSelectUnit: (unit: UnitInspectionData) => void;
  onDecisionChange: (unitId: string, decision: DecisionLane, notes?: string) => void;
}

export const ReviewQueueView: React.FC<ReviewQueueViewProps> = ({
  units,
  onSelectUnit,
  onDecisionChange
}) => {
  const reviewUnits = units.filter((u) => u.finalDecision === "Review");

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-xl text-slate-100">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-500/30">
              Module 9 • Review Queue
            </span>
            <span className="text-xs font-semibold text-slate-400">
              Human-in-the-Loop Verification
            </span>
          </div>
          <h3 className="text-base font-bold text-slate-100 mt-1">
            Uncertain Defect Queue & High-Risk Batch Escalations
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-mono font-bold border border-amber-500/30">
            {reviewUnits.length} Pending Actions
          </span>
        </div>
      </div>

      {reviewUnits.length === 0 ? (
        <div className="py-12 text-center text-slate-500 space-y-2">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
          <p className="text-sm font-semibold text-slate-300">All Uncertain Units Triaged</p>
          <p className="text-xs">No pending units in Lane 2 human review queue.</p>
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                <th className="py-2.5 px-3">UNIT ID</th>
                <th className="py-2.5 px-3">BATCH</th>
                <th className="py-2.5 px-3">STATION</th>
                <th className="py-2.5 px-3">SUSPECTED DEFECT</th>
                <th className="py-2.5 px-3">CONFIDENCE</th>
                <th className="py-2.5 px-3">UNCERTAINTY</th>
                <th className="py-2.5 px-3">REASON</th>
                <th className="py-2.5 px-3 text-right">OPERATOR ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {reviewUnits.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-bold text-amber-400">
                    <button
                      onClick={() => onSelectUnit(u)}
                      className="hover:underline flex items-center gap-1"
                    >
                      {u.id}
                    </button>
                  </td>
                  <td className="py-3 px-3 text-slate-300">{u.batchId}</td>
                  <td className="py-3 px-3 text-slate-300">{u.stationId}</td>
                  <td className="py-3 px-3 font-semibold text-slate-200">
                    <div className="flex items-center gap-1.5">
                      <span>{u.defectType}</span>
                      {u.isAnomalyNovelty && (
                        <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 text-[9px] font-bold">
                          OOD
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-300">{u.confidence}%</td>
                  <td className="py-3 px-3 font-bold text-amber-400">{u.uncertaintyScore}%</td>
                  <td className="py-3 px-3 text-[11px] text-slate-400">
                    {u.isAnomalyNovelty ? "Novelty / Rare Flaw" : "Calibrated Risk in Boundary Zone"}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onSelectUnit(u)}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px]"
                      >
                        Inspect
                      </button>
                      <button
                        onClick={() => onDecisionChange(u.id, "Accept", "Operator visual pass")}
                        className="px-2 py-1 rounded bg-emerald-700/80 hover:bg-emerald-600 text-white text-[11px] font-medium"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => onDecisionChange(u.id, "Reject", "Operator confirmed flaw")}
                        className="px-2 py-1 rounded bg-rose-700/80 hover:bg-rose-600 text-white text-[11px] font-medium"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
