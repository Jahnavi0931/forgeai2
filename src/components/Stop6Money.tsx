import React, { useState } from "react";
import { 
  CurrencySymbol, 
  WhatIfScenarioState, 
  QualityImpactScore, 
  StationData 
} from "../types";
import { 
  DollarSign, 
  Sparkles, 
  Sliders, 
  TrendingUp, 
  TrendingDown, 
  RotateCcw, 
  ShieldCheck, 
  HelpCircle, 
  Layers, 
  ArrowRight, 
  Cpu 
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  LineChart, 
  Line 
} from "recharts";

interface Stop6MoneyProps {
  currency: CurrencySymbol;
  whatIfState: WhatIfScenarioState;
  onChangeWhatIf: (state: WhatIfScenarioState) => void;
  qis: QualityImpactScore;
  stations: StationData[];
  onOpenQisModal: () => void;
}

export const Stop6Money: React.FC<Stop6MoneyProps> = ({
  currency,
  whatIfState,
  onChangeWhatIf,
  qis,
  stations,
  onOpenQisModal
}) => {
  // Baseline financials (per day across 800 nominal units)
  const nominalDailyUnits = 800;
  const unitSellingPrice = 145;
  const unitMaterialCost = 38;
  const unitLaborCost = 16.5;
  const unitEnergyCost = 4.2;
  const baselineDefectRate = 0.125; // 12.5%
  const baselineDefectiveUnits = nominalDailyUnits * baselineDefectRate;
  const scrapCostPerUnit = 45;
  const reworkCostPerUnit = 14;

  const grossRevenue = nominalDailyUnits * unitSellingPrice;
  const totalMaterialCost = nominalDailyUnits * unitMaterialCost;
  const totalLaborCost = nominalDailyUnits * unitLaborCost;
  const totalEnergyCost = nominalDailyUnits * unitEnergyCost;
  const totalScrapCost = baselineDefectiveUnits * 0.7 * scrapCostPerUnit;
  const totalReworkCost = baselineDefectiveUnits * 0.3 * reworkCostPerUnit;
  const totalDowntimeCost = 2800; // downtime loss

  const baselineNetMargin = grossRevenue - (
    totalMaterialCost + 
    totalLaborCost + 
    totalEnergyCost + 
    totalScrapCost + 
    totalReworkCost + 
    totalDowntimeCost
  );

  // What-If Simulation calculations (IDEA 5)
  const simulatedDefectReduction = (whatIfState.defectRateReductionPct / 100) + (whatIfState.fixTopRootCause ? 0.40 : 0);
  const effectiveDefectRate = Math.max(0.015, baselineDefectRate * (1 - Math.min(0.85, simulatedDefectReduction)));
  const simulatedDefectiveUnits = nominalDailyUnits * effectiveDefectRate;

  // Bottleneck throughput expansion
  const capacityGain = 1 + (whatIfState.bottleneckCapacityPct / 100) * 0.45;
  const simulatedDailyUnits = nominalDailyUnits * capacityGain;

  const simulatedRevenue = simulatedDailyUnits * unitSellingPrice;
  const simulatedScrap = simulatedDefectiveUnits * 0.7 * scrapCostPerUnit;
  const simulatedRework = simulatedDefectiveUnits * 0.3 * reworkCostPerUnit;
  const simulatedDowntimeCost = totalDowntimeCost * (1 - (whatIfState.changeoverReductionPct / 100) * 0.5);

  const simulatedNetMargin = simulatedRevenue - (
    simulatedDailyUnits * unitMaterialCost +
    simulatedDailyUnits * unitLaborCost +
    simulatedDailyUnits * unitEnergyCost +
    simulatedScrap +
    simulatedRework +
    simulatedDowntimeCost
  );

  const dailyGain = simulatedNetMargin - baselineNetMargin;

  // Margin Waterfall Data
  const waterfallData = [
    { stage: "Gross Revenue", amount: grossRevenue, fill: "#2DD4BF" },
    { stage: "- Material", amount: -totalMaterialCost, fill: "#64748B" },
    { stage: "- Labor", amount: -totalLaborCost, fill: "#64748B" },
    { stage: "- Energy", amount: -totalEnergyCost, fill: "#64748B" },
    { stage: "- Scrap Loss", amount: -totalScrapCost, fill: "#F43F5E" },
    { stage: "- Rework", amount: -totalReworkCost, fill: "#F59E0B" },
    { stage: "- Downtime", amount: -totalDowntimeCost, fill: "#F43F5E" },
    { stage: "= Net Margin", amount: baselineNetMargin, fill: "#10B981" }
  ];

  // Reset what-if sliders
  const handleResetWhatIf = () => {
    onChangeWhatIf({
      defectRateReductionPct: 0,
      bottleneckCapacityPct: 0,
      changeoverReductionPct: 0,
      fixTopRootCause: false,
      cutoffShift: 0.50
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="bg-[#121C33] border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 text-violet-400 border border-violet-500/30 flex items-center justify-center shadow-md">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-bold text-slate-100 text-lg">
                  Stop 6: Money — Margin Waterfall, QIS Score & What-If Simulator
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-violet-500/20 text-[#A78BFA] border border-violet-500/40 text-[10px] font-mono font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#A78BFA]" />
                  IDEA 5
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Translating physical defect reduction into tangible gross margin recovery and daily cash velocity
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <button
              onClick={onOpenQisModal}
              className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 transition hover:brightness-110 ${
                qis.band === "Healthy" ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-300" :
                qis.band === "Watch" ? "bg-amber-950/40 border-amber-500/30 text-amber-300" :
                "bg-rose-950/40 border-rose-500/30 text-rose-300"
              }`}
            >
              <span>QIS Score: <strong className="font-bold">{qis.score.toFixed(1)}</strong> ({qis.band})</span>
              <HelpCircle className="w-3.5 h-3.5 opacity-70" />
            </button>
          </div>
        </div>
      </div>

      {/* Margin Waterfall Chart & Regression Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Margin Waterfall Chart (7 cols) */}
        <div className="lg:col-span-7 bg-[#121C33] border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h3 className="font-heading font-bold text-slate-100 text-base">
                Daily Manufacturing Margin Waterfall
              </h3>
              <p className="text-xs text-slate-400">
                From gross revenue to net realized cash after accounting for material, energy, scrap, rework, and downtime
              </p>
            </div>
            <span className="text-[11px] font-mono text-teal-300 font-bold">
              Base Margin: {((baselineNetMargin / grossRevenue) * 100).toFixed(1)}%
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={waterfallData} margin={{ top: 10, right: 10, left: 15, bottom: 25 }}>
                <XAxis 
                  dataKey="stage" 
                  stroke="#64748B" 
                  tick={{ fill: "#CBD5E1", fontSize: 10, fontFamily: "monospace" }}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis 
                  stroke="#64748B" 
                  tick={{ fill: "#94A3B8", fontSize: 10 }}
                  tickFormatter={(v) => `${currency}${Math.round(v / 1000)}k`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0F172A", borderColor: "#334155", borderRadius: "8px", fontSize: "12px", fontFamily: "monospace" }}
                  formatter={(val: any) => [`${currency}${Math.abs(Number(val)).toLocaleString()}`, "Financial Value"]}
                />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                  {waterfallData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800">
            <span>Gross Revenue: <strong className="text-slate-100">{currency}{grossRevenue.toLocaleString()}</strong></span>
            <span>Total Quality Cost: <strong className="text-rose-400">-{currency}{(totalScrapCost + totalReworkCost + totalDowntimeCost).toLocaleString()}</strong></span>
            <span>Realized Margin: <strong className="text-emerald-400">{currency}{Math.round(baselineNetMargin).toLocaleString()}</strong></span>
          </div>
        </div>

        {/* Quality Impact Score (QIS) Gauge Card (5 cols) */}
        <div className="lg:col-span-5 bg-[#121C33] border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-heading font-bold text-slate-100 text-base flex items-center gap-2">
                <span>Quality Impact Score (QIS)</span>
              </h3>
              <span className="text-[10px] font-mono text-violet-300">Composite Health</span>
            </div>

            <p className="text-xs text-slate-400 mt-1">
              Deterministic 0–100 operational risk index (higher is worse).
            </p>

            {/* Circular Gauge Presentation */}
            <div className="my-4 flex items-center justify-center">
              <div className="relative w-36 h-36 rounded-full border-8 border-slate-800 flex items-center justify-center">
                <div 
                  className={`w-32 h-32 rounded-full border-4 flex flex-col items-center justify-center font-mono ${
                    qis.band === "Healthy" ? "border-emerald-500 bg-emerald-950/20 text-emerald-300" :
                    qis.band === "Watch" ? "border-amber-500 bg-amber-950/20 text-amber-300" :
                    "border-rose-500 bg-rose-950/20 text-rose-300"
                  }`}
                >
                  <span className="text-3xl font-extrabold">{qis.score.toFixed(1)}</span>
                  <span className="text-xs font-bold uppercase tracking-wider">{qis.band}</span>
                </div>
              </div>
            </div>

            {/* Sub-Metric Weights Breakdown */}
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Defect Rate (30% weight):</span>
                <span>{qis.weightedDefectRate.toFixed(1)} pts</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Cost Impact (30% weight):</span>
                <span>{qis.weightedCostImpact.toFixed(1)} pts</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Throughput Loss (20% weight):</span>
                <span>{qis.weightedThroughputLoss.toFixed(1)} pts</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Review Uncertainty (10% weight):</span>
                <span>{qis.weightedUncertainty.toFixed(1)} pts</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Batch Drift Trend (10% weight):</span>
                <span>{qis.weightedDefectTrend.toFixed(1)} pts</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-[10px] font-mono text-slate-500 flex items-center justify-between">
            <span>Healthy: &lt;25 • Watch: 25–50 • Critical: &gt;50</span>
            <button onClick={onOpenQisModal} className="text-teal-400 hover:underline">
              View Formula →
            </button>
          </div>
        </div>

      </div>

      {/* IDEA 5: What-If Scenario Simulator */}
      <div className="bg-[#121C33] border border-slate-800 rounded-2xl p-5 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-bold text-slate-100 text-base">
                What-If Engineering & Capacity Simulator
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-violet-500/20 text-[#A78BFA] border border-violet-500/40 text-[10px] font-mono font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#A78BFA]" />
                IDEA 5
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Interactive sandbox simulating financial and takt time returns before committing physical CAPEX or tooling shifts
            </p>
          </div>

          <button
            onClick={handleResetWhatIf}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Sliders</span>
          </button>
        </div>

        {/* Sliders Grid & Live Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Sliders (6 cols) */}
          <div className="lg:col-span-6 space-y-4 text-xs font-mono">
            
            {/* Defect Reduction */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300 font-bold">1. Defect Rate Reduction (%):</span>
                <span className="text-teal-300 font-bold">-{whatIfState.defectRateReductionPct}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={whatIfState.defectRateReductionPct}
                onChange={(e) => onChangeWhatIf({ ...whatIfState, defectRateReductionPct: parseInt(e.target.value) })}
                className="w-full accent-teal-400"
              />
            </div>

            {/* Bottleneck Capacity */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300 font-bold">2. Add Capacity at Bottleneck S03 (%):</span>
                <span className="text-cyan-300 font-bold">+{whatIfState.bottleneckCapacityPct}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={whatIfState.bottleneckCapacityPct}
                onChange={(e) => onChangeWhatIf({ ...whatIfState, bottleneckCapacityPct: parseInt(e.target.value) })}
                className="w-full accent-cyan-400"
              />
            </div>

            {/* Changeover Time Reduction */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300 font-bold">3. SMED Changeover Reduction (%):</span>
                <span className="text-amber-300 font-bold">-{whatIfState.changeoverReductionPct}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={whatIfState.changeoverReductionPct}
                onChange={(e) => onChangeWhatIf({ ...whatIfState, changeoverReductionPct: parseInt(e.target.value) })}
                className="w-full accent-amber-400"
              />
            </div>

            {/* Checkbox: Fix Top Root Cause */}
            <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-slate-200 font-bold block">4. Recalibrate Station S03 Cooling Manifold</span>
                <span className="text-[10px] text-slate-400">Eliminates thermal excursion; projected 40% defect reduction</span>
              </div>
              <input
                type="checkbox"
                checked={whatIfState.fixTopRootCause}
                onChange={(e) => onChangeWhatIf({ ...whatIfState, fixTopRootCause: e.target.checked })}
                className="w-5 h-5 accent-teal-400 rounded cursor-pointer"
              />
            </div>

          </div>

          {/* Live Before vs After Comparison Card (6 cols) */}
          <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-mono font-bold text-slate-200">
                Simulated Operational Outcome
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-mono font-bold">
                SIMULATED PREDICTION
              </span>
            </div>

            {/* 3 Metrics: Throughput, Defect Rate, Daily Margin */}
            <div className="grid grid-cols-3 gap-3 text-center font-mono">
              
              {/* Daily Throughput */}
              <div className="p-3 rounded-xl bg-[#121C33] border border-slate-800">
                <span className="text-[10px] text-slate-400 block mb-1">Throughput</span>
                <div className="text-xs text-slate-500 line-through">{nominalDailyUnits} u/day</div>
                <div className="text-base font-extrabold text-cyan-300">
                  {Math.round(simulatedDailyUnits)} u/d
                </div>
                <span className="text-[10px] text-emerald-400">
                  +{Math.round(simulatedDailyUnits - nominalDailyUnits)} units
                </span>
              </div>

              {/* Defect Rate */}
              <div className="p-3 rounded-xl bg-[#121C33] border border-slate-800">
                <span className="text-[10px] text-slate-400 block mb-1">Defect Rate</span>
                <div className="text-xs text-slate-500 line-through">{(baselineDefectRate * 100).toFixed(1)}%</div>
                <div className="text-base font-extrabold text-teal-300">
                  {(effectiveDefectRate * 100).toFixed(1)}%
                </div>
                <span className="text-[10px] text-emerald-400">
                  -{((baselineDefectRate - effectiveDefectRate) * 100).toFixed(1)}% pts
                </span>
              </div>

              {/* Net Daily Margin */}
              <div className="p-3 rounded-xl bg-[#121C33] border border-slate-800">
                <span className="text-[10px] text-slate-400 block mb-1">Net Margin / Day</span>
                <div className="text-xs text-slate-500 line-through">
                  {currency}{Math.round(baselineNetMargin / 1000)}k
                </div>
                <div className="text-base font-extrabold text-emerald-400">
                  {currency}{Math.round(simulatedNetMargin / 1000)}k
                </div>
                <span className="text-[10px] text-emerald-400 font-bold">
                  +{currency}{Math.round(dailyGain).toLocaleString()}
                </span>
              </div>

            </div>

            {/* Total Simulated Value Gain Callout */}
            <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 font-mono text-xs text-emerald-300 flex items-center justify-between">
              <span>Annualized Value Recovery (300 Work Days):</span>
              <strong className="text-sm font-extrabold text-emerald-400">
                +{currency}{Math.round((dailyGain * 300) / 100000).toFixed(2)} Lakh / year
              </strong>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
