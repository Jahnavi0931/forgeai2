import React from "react";
import { StationData, CurrencySymbol } from "../types";
import { 
  Flame, 
  Clock, 
  Layers, 
  AlertTriangle, 
  TrendingDown, 
  CheckCircle2, 
  ArrowRight, 
  RotateCw 
} from "lucide-react";

interface Stop5JamProps {
  stations: StationData[];
  currency: CurrencySymbol;
}

export const Stop5Jam: React.FC<Stop5JamProps> = ({ stations, currency }) => {
  // Find bottleneck station (highest cycle time)
  const maxCycleTime = Math.max(...stations.map((s) => s.actualCycleTimeSec));
  const bottleneckStation = stations.find((s) => s.actualCycleTimeSec === maxCycleTime) || stations[0];

  // Target cycle time is nominal or fastest station
  const targetCycleTime = 12.0; // seconds
  const targetUnitsPerHour = 3600 / targetCycleTime; // 300 units/hr
  const actualUnitsPerHour = 3600 / maxCycleTime; // bottleneck limits entire line
  const lostUnitsPerHour = Math.max(0, targetUnitsPerHour - actualUnitsPerHour);
  const throughputLossPct = ((lostUnitsPerHour / targetUnitsPerHour) * 100);

  // Economic loss calculation (assuming average selling price ~ 145 or scrap margin)
  const hourlyRevenueLoss = lostUnitsPerHour * 145;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="bg-[#121C33] border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shadow-md">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-slate-100 text-lg">
                Stop 5: Jam — Line Bottleneck & WIP Flow Analysis
              </h2>
              <p className="text-xs text-slate-400">
                Goldratt Theory of Constraints: Line throughput is bounded by the slowest active process station
              </p>
            </div>
          </div>

          {/* Key KPI Chips */}
          <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs">
            <div className="px-3 py-1.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-rose-400" />
              <span>
                Throughput Cap: <strong>{actualUnitsPerHour.toFixed(1)} u/hr</strong> (-{throughputLossPct.toFixed(1)}%)
              </span>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200">
              Pacing Loss: <strong className="text-amber-300">-{lostUnitsPerHour.toFixed(1)} u/hr</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Production Line Flow Visualization (Proportional Widths) */}
      <div className="bg-[#121C33] border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div>
            <h3 className="font-heading font-bold text-slate-100 text-base">
              Line Flow & Physical Station Pacing
            </h3>
            <p className="text-xs text-slate-400">
              Box widths are optically proportional to average cycle time. Note WIP pile-up buffering before bottleneck.
            </p>
          </div>

          <span className="text-[11px] font-mono text-rose-400 font-bold flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            Bottleneck: Station {bottleneckStation.id} ({bottleneckStation.actualCycleTimeSec}s)
          </span>
        </div>

        {/* Stations Line Chain */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 pt-2">
          {stations.map((st, idx) => {
            const isBottleneck = st.id === bottleneckStation.id;
            const cycleDelta = ((st.actualCycleTimeSec - st.nominalCycleTimeSec) / st.nominalCycleTimeSec) * 100;

            return (
              <div key={st.id} className="relative flex flex-col justify-between">
                
                {/* Station Card */}
                <div 
                  className={`p-4 rounded-xl border transition-all flex flex-col justify-between h-full ${
                    isBottleneck
                      ? "bg-rose-950/30 border-rose-500 shadow-lg shadow-rose-500/20 ring-1 ring-rose-500"
                      : "bg-slate-900/80 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between font-mono text-xs mb-2">
                      <span className={`font-bold text-sm ${isBottleneck ? "text-rose-400" : "text-slate-100"}`}>
                        {st.id}
                      </span>
                      {isBottleneck ? (
                        <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 font-bold text-[9px] border border-rose-500/40">
                          BOTTLENECK
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">Station {idx + 1}</span>
                      )}
                    </div>

                    <div className="text-xs font-semibold text-slate-200 line-clamp-1" title={st.name}>
                      {st.name}
                    </div>

                    {/* Cycle Time Bar Indicator */}
                    <div className="mt-3 space-y-1 font-mono text-xs">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-400">Cycle Time:</span>
                        <strong className={isBottleneck ? "text-rose-400" : "text-slate-200"}>
                          {st.actualCycleTimeSec.toFixed(1)}s
                        </strong>
                      </div>
                      <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${isBottleneck ? "bg-rose-500" : "bg-teal-400"}`}
                          style={{ width: `${Math.min(100, (st.actualCycleTimeSec / maxCycleTime) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* WIP Queue Inflow */}
                  <div className="mt-4 pt-3 border-t border-slate-800 font-mono text-[11px] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">WIP Queue:</span>
                      <span className={`font-bold ${st.wipQueueCount > 5 ? "text-amber-400" : "text-slate-300"}`}>
                        {st.wipQueueCount} units
                      </span>
                    </div>

                    {/* Graphical WIP Dots */}
                    <div className="flex gap-1 overflow-hidden h-3 items-center">
                      {Array.from({ length: Math.min(8, st.wipQueueCount) }).map((_, i) => (
                        <span 
                          key={i} 
                          className={`w-2 h-2 rounded-full ${
                            isBottleneck ? "bg-rose-400 animate-pulse" : "bg-teal-400/80"
                          }`} 
                        />
                      ))}
                      {st.wipQueueCount > 8 && (
                        <span className="text-[9px] text-slate-500">+{st.wipQueueCount - 8}</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                      <span>Util: {st.utilizationRate.toFixed(0)}%</span>
                      <span>Defects: {st.defectRate.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>

                {/* Arrow connector between stations (desktop) */}
                {idx < stations.length - 1 && (
                  <div className="hidden md:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-slate-600">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Station Flow & Downtime Metrics Table */}
      <div className="bg-[#121C33] border border-slate-800 rounded-2xl p-5 space-y-4">
        <h3 className="font-heading font-bold text-slate-100 text-base">
          Production Flow Telemetry & Capacity Balances
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-left">
                <th className="pb-2.5">Station</th>
                <th className="pb-2.5">Description</th>
                <th className="pb-2.5 text-right">Nominal Cycle</th>
                <th className="pb-2.5 text-right">Actual Cycle</th>
                <th className="pb-2.5 text-right">WIP Inflow Queue</th>
                <th className="pb-2.5 text-right">Utilization %</th>
                <th className="pb-2.5 text-right">Downtime Today</th>
                <th className="pb-2.5 text-right">Defect Rate</th>
                <th className="pb-2.5 text-right">Constraint Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {stations.map((st) => {
                const isBottleneck = st.id === bottleneckStation.id;

                return (
                  <tr key={st.id} className={isBottleneck ? "bg-rose-950/20 font-semibold" : "hover:bg-slate-900/30"}>
                    <td className={`py-2.5 font-bold ${isBottleneck ? "text-rose-400" : "text-teal-300"}`}>
                      {st.id}
                    </td>
                    <td className="py-2.5 text-slate-200">{st.name}</td>
                    <td className="py-2.5 text-right text-slate-400">{st.nominalCycleTimeSec.toFixed(1)}s</td>
                    <td className={`py-2.5 text-right font-bold ${isBottleneck ? "text-rose-400" : "text-slate-200"}`}>
                      {st.actualCycleTimeSec.toFixed(1)}s
                    </td>
                    <td className="py-2.5 text-right">{st.wipQueueCount} units</td>
                    <td className="py-2.5 text-right">{st.utilizationRate.toFixed(1)}%</td>
                    <td className="py-2.5 text-right">{st.downtimeMinutesToday} min</td>
                    <td className={`py-2.5 text-right ${st.defectRate > 5 ? "text-rose-400 font-bold" : "text-slate-300"}`}>
                      {st.defectRate.toFixed(1)}%
                    </td>
                    <td className="py-2.5 text-right">
                      {isBottleneck ? (
                        <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px]">
                          Primary Bottleneck
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[11px]">Normal</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Financial Implication Banner */}
        <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-slate-300">
              Station {bottleneckStation.id} cycle time pacing imposes an estimated financial bottleneck cost of{" "}
              <strong className="text-rose-400">{currency}{Math.round(hourlyRevenueLoss).toLocaleString()}/hour</strong> in unrealized throughput.
            </span>
          </div>

          <span className="text-teal-400 font-bold shrink-0">
            Fix available in Stop 6 &amp; 7 →
          </span>
        </div>
      </div>

    </div>
  );
};
