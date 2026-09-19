import React, { useState } from "react";
import { DriftCell, ShapFactor, StationData } from "../types";
import { DRIFT_MATRIX_DATA, STATIONS_DATA } from "../data/mockData";
import { 
  GitBranch, 
  AlertTriangle, 
  TrendingUp, 
  Cpu, 
  Layers, 
  Activity, 
  BarChart3, 
  CheckCircle2, 
  Info,
  Flame,
  ArrowUpRight
} from "lucide-react";

interface RootCauseDriftMapProps {
  onSelectCell?: (cell: DriftCell) => void;
  driftData?: DriftCell[];
  stations?: StationData[];
}

export const RootCauseDriftMap: React.FC<RootCauseDriftMapProps> = ({ 
  onSelectCell,
  driftData: propsDriftData,
  stations: propsStations
}) => {
  const activeDriftData = propsDriftData || DRIFT_MATRIX_DATA;
  const stations = propsStations || STATIONS_DATA;
  const batches = Array.from(new Set(activeDriftData.map((d) => d.batchId)));

  const [selectedCell, setSelectedCell] = useState<DriftCell | null>(
    activeDriftData.find((c) => c.driftAlert) || activeDriftData[0] || null
  );
  const [activeAnalysisMode, setActiveAnalysisMode] = useState<"drift" | "shap" | "chisquare">("drift");

  // SHAP Feature Impact factors from statistical validation
  const shapFactors: ShapFactor[] = [
    { feature: "Station S03 Chamber Temp (+8.0%)", impact: "+0.384", direction: "risk_increase" },
    { feature: "Cycle Dwell Time (+12.1%)", impact: "+0.292", direction: "risk_increase" },
    { feature: "Material Ingot Hardness (Lot B27)", impact: "+0.147", direction: "risk_increase" },
    { feature: "Clamping Pressure Deviation", impact: "+0.082", direction: "risk_increase" },
    { feature: "Line Ambient Humidity", impact: "-0.021", direction: "neutral" },
    { feature: "Shift Operator Crossover", impact: "-0.035", direction: "neutral" }
  ];

  // Helper to color heatmap cells
  const getCellColor = (rate: number, isAlert: boolean) => {
    if (isAlert || rate >= 6.0) {
      return "bg-rose-600/80 border-rose-400 text-white font-bold hover:bg-rose-500 shadow-sm shadow-rose-900/50";
    }
    if (rate >= 3.0) {
      return "bg-amber-600/70 border-amber-400 text-amber-100 font-semibold hover:bg-amber-500";
    }
    if (rate >= 1.5) {
      return "bg-amber-900/40 border-amber-700/60 text-amber-200 hover:bg-amber-800/50";
    }
    return "bg-emerald-950/40 border-emerald-800/40 text-emerald-300 hover:bg-emerald-900/40";
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-xl text-slate-100">
      {/* Header matching Architecture Module 6 */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-500/30">
              Module 6 • Root-Cause & Pattern Analysis
            </span>
            <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-xs font-semibold">
              Idea 4: Drift Map
            </span>
          </div>
          <h3 className="text-base font-bold text-slate-100 mt-1">
            Why Did It Happen? • Statistical Validation & Process Drift Heatmap
          </h3>
        </div>

        {/* Mode Toggles */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-medium">
          <button
            onClick={() => setActiveAnalysisMode("drift")}
            className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1 ${
              activeAnalysisMode === "drift"
                ? "bg-amber-500 text-slate-950 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Flame className="w-3 h-3" />
            Batch x Machine Drift Map
          </button>
          <button
            onClick={() => setActiveAnalysisMode("shap")}
            className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1 ${
              activeAnalysisMode === "shap"
                ? "bg-amber-500 text-slate-950 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <BarChart3 className="w-3 h-3" />
            SHAP Attribution
          </button>
          <button
            onClick={() => setActiveAnalysisMode("chisquare")}
            className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1 ${
              activeAnalysisMode === "chisquare"
                ? "bg-amber-500 text-slate-950 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Activity className="w-3 h-3" />
            Statistical Validation (χ²)
          </button>
        </div>
      </div>

      {/* Idea 4: Drift Map Grid */}
      {activeAnalysisMode === "drift" && (
        <div className="mt-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-300">Station x Batch Heatmap Grid</span>
              <span className="text-slate-500">• Defect percentage per station run</span>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-emerald-700/60 inline-block" /> &lt;1.5% Nominal
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-amber-600/70 inline-block" /> 3-5% Elevated
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-rose-600 inline-block animate-pulse" /> &gt;6% Critical Drift
              </span>
            </div>
          </div>

          {/* Matrix Grid */}
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                  <th className="py-2 px-3 font-semibold">BATCH / LOT</th>
                  {stations.map((st) => (
                    <th key={st.id} className="py-2 px-2 text-center">
                      <div className="font-bold text-slate-200">{st.id}</div>
                      <div className="text-[9px] text-slate-500 truncate max-w-[80px]">{st.name.split(" ")[0]}</div>
                    </th>
                  ))}
                  <th className="py-2 px-3 text-right">BATCH DRIFT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {batches.map((batch) => {
                  const batchCells = DRIFT_MATRIX_DATA.filter((c) => c.batchId === batch);
                  const hasBatchDrift = batchCells.some((c) => c.driftAlert);

                  return (
                    <tr key={batch} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-slate-200 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span>{batch}</span>
                          {batch === "Batch B27" && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold">
                              ACTIVE
                            </span>
                          )}
                        </div>
                      </td>

                      {stations.map((st) => {
                        const cell = batchCells.find((c) => c.stationId === st.id);
                        if (!cell) return <td key={st.id} className="p-2 text-center text-slate-700">-</td>;

                        const isSelected =
                          selectedCell?.batchId === cell.batchId && selectedCell?.stationId === cell.stationId;

                        return (
                          <td key={st.id} className="p-1.5 text-center">
                            <button
                              id={`btn-drift-cell-${cell.batchId.replace(/\s+/g, '')}-${cell.stationId}`}
                              onClick={() => {
                                setSelectedCell(cell);
                                if (onSelectCell) onSelectCell(cell);
                              }}
                              className={`w-full py-2 px-1 rounded-md border text-center transition-all cursor-pointer ${getCellColor(
                                cell.defectRate,
                                cell.driftAlert
                              )} ${isSelected ? "ring-2 ring-white scale-105" : ""}`}
                            >
                              <div className="text-xs">{cell.defectRate}%</div>
                              {cell.driftAlert && (
                                <div className="text-[9px] text-rose-200 font-sans flex items-center justify-center gap-0.5 mt-0.5">
                                  <AlertTriangle className="w-2.5 h-2.5" />
                                  <span>DRIFT</span>
                                </div>
                              )}
                            </button>
                          </td>
                        );
                      })}

                      <td className="py-2 px-3 text-right">
                        {hasBatchDrift ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold">
                            <AlertTriangle className="w-3 h-3" />
                            DRIFT ALERT
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                            <CheckCircle2 className="w-3 h-3" />
                            Stable
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Selected Cell Root Cause Forensic Drawer */}
          {selectedCell && (
            <div className="mt-4 p-4 bg-slate-950/80 rounded-xl border border-slate-800 text-xs animate-in fade-in">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-200 text-sm">
                    {selectedCell.batchId} × Station {selectedCell.stationId} Forensic Drill-Down
                  </span>
                  {selectedCell.driftAlert && (
                    <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold">
                      Z-Score: +{selectedCell.driftZScore}σ Deviant
                    </span>
                  )}
                </div>
                <span className="font-mono text-slate-400 text-[11px]">
                  Samples Analyzed: <strong>{selectedCell.sampleCount} units</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Primary Defect Signature</span>
                  <span className="font-bold text-amber-400 text-sm mt-0.5 block">{selectedCell.primaryDefect}</span>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Observed Defect Rate: <strong className="text-rose-400">{selectedCell.defectRate}%</strong> (Tolerance: &lt;1.5%)
                  </span>
                </div>

                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Root Cause Classification</span>
                  <span className="font-bold text-slate-200 text-sm mt-0.5 block">Process Deviation + Tool Wear</span>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Station S03 thermal manifold temperature +8% above nominal setpoint.
                  </span>
                </div>

                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Corrective Action</span>
                  <span className="font-bold text-emerald-400 text-sm mt-0.5 block">Interlock Recalibration</span>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Triggered automated maintenance ticket #WO-8492.
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SHAP Attribution Mode */}
      {activeAnalysisMode === "shap" && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>SHAP (Shapley Additive exPlanations) Global Defect Impact</span>
            <span className="font-mono text-[11px] text-cyan-400">Model: Explainable Gradient Tree / Vision Fusion</span>
          </div>

          <div className="space-y-2.5">
            {shapFactors.map((item, idx) => {
              const impactVal = parseFloat(item.impact);
              const widthPct = Math.min(100, Math.abs(impactVal) * 220);

              return (
                <div key={idx} className="p-2 bg-slate-950/60 rounded-lg border border-slate-800/80 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-slate-200">{item.feature}</span>
                    <span className={`font-mono font-bold ${
                      item.direction === "risk_increase" ? "text-rose-400" : "text-slate-400"
                    }`}>
                      {item.impact} SHAP
                    </span>
                  </div>
                  {/* Bar visualizer */}
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        item.direction === "risk_increase"
                          ? "bg-gradient-to-r from-amber-500 to-rose-500"
                          : "bg-slate-600"
                      }`}
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Chi-Square Statistical Validation Mode */}
      {activeAnalysisMode === "chisquare" && (
        <div className="mt-4 p-4 bg-slate-950/80 rounded-xl border border-slate-800 text-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-200 text-sm">Contingency Hypothesis Testing (Chi-Square)</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-xs">
              p-value = 0.00004 (&lt; 0.001)
            </span>
          </div>

          <p className="text-slate-300 text-[11px] leading-relaxed">
            Hypothesis: Defect rates across stations are independent of thermal operating temperature deviations.
            <strong> Result: Null hypothesis rejected with 99.99% confidence.</strong> Station S03 exhibits non-random defect clustering strongly correlated with the heating manifold duty cycle.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-center pt-2">
            <div className="p-2 bg-slate-900 rounded border border-slate-800">
              <span className="text-[10px] text-slate-500 block">χ² Statistic</span>
              <span className="text-base font-bold text-amber-400">42.85</span>
            </div>
            <div className="p-2 bg-slate-900 rounded border border-slate-800">
              <span className="text-[10px] text-slate-500 block">Degrees of Freedom</span>
              <span className="text-base font-bold text-slate-200">5</span>
            </div>
            <div className="p-2 bg-slate-900 rounded border border-slate-800">
              <span className="text-[10px] text-slate-500 block">Cramer's V (Effect)</span>
              <span className="text-base font-bold text-cyan-400">0.42 (Strong)</span>
            </div>
            <div className="p-2 bg-slate-900 rounded border border-slate-800">
              <span className="text-[10px] text-slate-500 block">Significance</span>
              <span className="text-base font-bold text-emerald-400">p &lt; 0.001</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
