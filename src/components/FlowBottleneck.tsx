import React from "react";
import { StationData } from "../types";
import { STATIONS_DATA } from "../data/mockData";
import { 
  GitCommit, 
  AlertCircle, 
  TrendingDown, 
  Clock, 
  Zap, 
  Layers, 
  ArrowRight,
  Gauge,
  Timer
} from "lucide-react";

interface FlowBottleneckProps {
  stations?: StationData[];
}

export const FlowBottleneck: React.FC<FlowBottleneckProps> = ({ stations: propsStations }) => {
  const stations = propsStations || STATIONS_DATA;
  const bottleneck = stations.find((s) => s.isBottleneck) || stations[2];

  // Calculate line balance and throughput loss
  // Theoretical max throughput based on nominal pacing vs bottleneck pacing
  const nominalBottleneckCycle = Math.max(...stations.map((s) => s.nominalCycleTimeSec)); // 13.2s -> 272 units/hr
  const actualBottleneckCycle = bottleneck.actualCycleTimeSec; // 15.6s -> 230 units/hr
  const theoreticalUnitsPerHour = Math.round(3600 / nominalBottleneckCycle);
  const actualUnitsPerHour = Math.round(3600 / actualBottleneckCycle);
  const throughputLossUnitsPerHour = theoreticalUnitsPerHour - actualUnitsPerHour; // 42 units lost per hr!
  const financialLossPerHour = throughputLossUnitsPerHour * 32.5; // based on unit contribution margin

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-xl text-slate-100">
      {/* Header matching Module 7 */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-500/30">
              Module 7 • Flow & Bottleneck Engine
            </span>
            <span className="text-xs font-semibold text-slate-400">
              Optimize • Balance • Improve
            </span>
          </div>
          <h3 className="text-base font-bold text-slate-100 mt-1">
            Production Flow Balance & WIP Queue Bottleneck Detector
          </h3>
        </div>

        {/* Throughput Loss Highlight Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs">
          <TrendingDown className="w-4 h-4 text-rose-400" />
          <span className="text-slate-300 font-mono">
            Line Imbalance Loss: <strong className="text-rose-400">-{throughputLossUnitsPerHour} units/hr</strong> (~${Math.round(financialLossPerHour)}/hr)
          </span>
        </div>
      </div>

      {/* Top 3 KPI Flow Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
        <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800 font-mono">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Critical Bottleneck Station</span>
            <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="text-base font-bold text-rose-300">
            {bottleneck.id} • {bottleneck.name.split(" ")[0]}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Cycle: <strong className="text-rose-400">{bottleneck.actualCycleTimeSec}s</strong> (Target: {bottleneck.nominalCycleTimeSec}s)
          </div>
        </div>

        <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800 font-mono">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>WIP Buffer Accumulation</span>
            <Layers className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-base font-bold text-amber-300">
            {bottleneck.wipQueueCount} Units Queued
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Buffer Dwell Time: <strong className="text-amber-400">17.6 min wait</strong>
          </div>
        </div>

        <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800 font-mono">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Effective Line Cadence</span>
            <Timer className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-base font-bold text-cyan-300">
            {actualUnitsPerHour} units / hour
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Theoretical Line Potential: <strong className="text-emerald-400">{theoreticalUnitsPerHour} units/hr</strong>
          </div>
        </div>
      </div>

      {/* Visual Station Sequence & Cycle Time Waterfall */}
      <div className="mt-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
          <span>Station-by-Station Cycle Time & WIP Waterfall</span>
          <span className="text-[11px] font-mono text-slate-500">Takt Time Target: 12.0s</span>
        </h4>

        <div className="space-y-3">
          {stations.map((st, idx) => {
            const isBottleneck = st.isBottleneck;
            const cycleDelta = st.actualCycleTimeSec - st.nominalCycleTimeSec;
            const barWidth = Math.min(100, (st.actualCycleTimeSec / 20) * 100);

            return (
              <div
                key={st.id}
                className={`p-3 rounded-lg border transition-all ${
                  isBottleneck
                    ? "bg-rose-950/30 border-rose-500/60 ring-1 ring-rose-500/30"
                    : "bg-slate-950/50 border-slate-800/80"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs mb-1.5 font-mono">
                  <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs ${
                      isBottleneck ? "bg-rose-600 text-white" : "bg-slate-800 text-slate-300"
                    }`}>
                      {st.id}
                    </span>
                    <span className="font-bold text-slate-200">{st.name}</span>
                    {isBottleneck && (
                      <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/30">
                        BOTTLENECK
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-[11px]">
                    <span className="text-slate-400">
                      WIP: <strong className={st.wipQueueCount > 30 ? "text-amber-400 font-bold" : "text-slate-200"}>{st.wipQueueCount}</strong>
                    </span>
                    <span className="text-slate-400">
                      Utilization: <strong className={st.utilizationRate > 90 ? "text-rose-400 font-bold" : "text-slate-200"}>{st.utilizationRate}%</strong>
                    </span>
                    <span className="text-slate-400">
                      Actual Cycle: <strong className={isBottleneck ? "text-rose-400 font-bold" : "text-slate-200"}>{st.actualCycleTimeSec}s</strong>
                      <span className="text-slate-500 text-[10px] ml-1">({st.nominalCycleTimeSec}s nom)</span>
                    </span>
                  </div>
                </div>

                {/* Progress bar comparing nominal vs actual */}
                <div className="relative w-full h-2.5 bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      isBottleneck
                        ? "bg-gradient-to-r from-amber-500 to-rose-500"
                        : "bg-gradient-to-r from-cyan-600 to-emerald-500"
                    }`}
                    style={{ width: `${barWidth}%` }}
                  />
                  {/* Takt time indicator line at 60% */}
                  <div className="absolute top-0 bottom-0 left-[60%] w-0.5 bg-white/70 shadow-sm" title="Takt Target" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
