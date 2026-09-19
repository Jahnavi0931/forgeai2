import React from "react";
import { StopId } from "../types";
import { 
  Database, 
  Eye, 
  Split, 
  GitBranch, 
  Flame, 
  DollarSign, 
  Wrench, 
  FlaskConical, 
  Sparkles 
} from "lucide-react";

interface ConveyorRibbonProps {
  activeStop: StopId;
  onSelectStop: (stop: StopId) => void;
}

interface StopConfig {
  id: StopId;
  label: string;
  stepNum: number;
  icon: React.ElementType;
  ideaBadge?: string;
  sublabel: string;
}

const STOPS: StopConfig[] = [
  { id: "datadock", label: "Data Dock", stepNum: 1, icon: Database, sublabel: "Datasets & Ingest" },
  { id: "see", label: "See", stepNum: 2, icon: Eye, sublabel: "Vision AI & Heatmap" },
  { id: "decide", label: "Decide", stepNum: 3, icon: Split, ideaBadge: "IDEA 1 & 2", sublabel: "Money Cutoff & Lanes" },
  { id: "cause", label: "Cause", stepNum: 4, icon: GitBranch, ideaBadge: "IDEA 4", sublabel: "Drift & Statistics" },
  { id: "jam", label: "Jam", stepNum: 5, icon: Flame, sublabel: "Bottleneck & Flow" },
  { id: "money", label: "Money", stepNum: 6, icon: DollarSign, ideaBadge: "IDEA 5", sublabel: "What-If & QIS Score" },
  { id: "fix", label: "Fix", stepNum: 7, icon: Wrench, sublabel: "Action Advice & Report" },
  { id: "testbench", label: "Test Bench", stepNum: 8, icon: FlaskConical, ideaBadge: "IDEA 6", sublabel: "Stress & Reliability" }
];

export const ConveyorRibbon: React.FC<ConveyorRibbonProps> = ({
  activeStop,
  onSelectStop
}) => {
  const activeIndex = STOPS.findIndex((s) => s.id === activeStop);
  // Calculate position % for the traveling glowing unit
  const travelingProgressPercent = ((activeIndex + 0.5) / STOPS.length) * 100;

  return (
    <div className="w-full bg-[#0E162B] border-b border-slate-800 relative py-2.5 px-3 select-none overflow-x-auto">
      <div className="max-w-7xl mx-auto min-w-[760px] relative">
        
        {/* Conveyor Belt Background Track (Mechanical Texture) */}
        <div className="absolute top-[22px] left-6 right-6 h-2 bg-slate-900 border border-slate-800 rounded-full overflow-hidden">
          {/* Animated belt stripes */}
          <div className="w-full h-full opacity-30 bg-[repeating-linear-gradient(45deg,#2DD4BF_0,#2DD4BF_6px,transparent_6px,transparent_14px)] animate-[pulse_3s_ease-in-out_infinite]" />
        </div>

        {/* Traveling Glowing Unit (Signature Element 1) */}
        <div 
          className="absolute top-[17px] -translate-x-1/2 w-4 h-3 rounded-md bg-gradient-to-r from-teal-400 to-cyan-300 shadow-[0_0_12px_#2DD4BF] border border-white/80 transition-all duration-500 ease-out z-20 pointer-events-none flex items-center justify-center"
          style={{ left: `${travelingProgressPercent}%` }}
        >
          <div className="w-1.5 h-1 rounded-full bg-slate-950" />
        </div>

        {/* Stops List */}
        <div className="grid grid-cols-8 gap-2 relative z-10">
          {STOPS.map((stop, idx) => {
            const Icon = stop.icon;
            const isActive = stop.id === activeStop;
            const isPast = idx < activeIndex;

            return (
              <button
                key={stop.id}
                onClick={() => onSelectStop(stop.id)}
                className={`group flex flex-col items-center text-center p-1.5 rounded-xl transition-all relative ${
                  isActive 
                    ? "bg-[#172341] border border-teal-500/50 shadow-md shadow-teal-500/10" 
                    : "hover:bg-slate-900/60 border border-transparent"
                }`}
              >
                {/* Step Marker Node on Belt */}
                <div 
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                    isActive
                      ? "bg-teal-400 text-slate-950 font-bold shadow-lg shadow-teal-500/40 scale-105"
                      : isPast
                      ? "bg-slate-800 text-teal-400 border border-teal-500/30"
                      : "bg-slate-900 text-slate-400 border border-slate-800 group-hover:text-slate-200 group-hover:border-slate-700"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                {/* Stop Label & Step Number */}
                <div className="mt-1.5 flex flex-col items-center">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-mono opacity-50 font-semibold">
                      {stop.stepNum}.
                    </span>
                    <span 
                      className={`text-xs font-heading font-bold whitespace-nowrap ${
                        isActive ? "text-slate-100" : "text-slate-300 group-hover:text-slate-100"
                      }`}
                    >
                      {stop.label}
                    </span>
                  </div>

                  {/* Subtitle / context */}
                  <span className="text-[10px] text-slate-400 font-sans tracking-tight hidden sm:block whitespace-nowrap">
                    {stop.sublabel}
                  </span>

                  {/* Violet INNOVATION Badge (Mandatory: IDEA 1 to IDEA 6) */}
                  {stop.ideaBadge && (
                    <span className="mt-0.5 px-1.5 py-0.2 rounded-full bg-violet-500/20 text-[#A78BFA] border border-violet-500/40 text-[9px] font-mono font-bold flex items-center gap-0.5 shadow-sm">
                      <Sparkles className="w-2.5 h-2.5 text-[#A78BFA]" />
                      <span>{stop.ideaBadge}</span>
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
