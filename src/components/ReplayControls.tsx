import React from "react";
import { Play, Pause, FastForward, RotateCcw, Clock } from "lucide-react";

interface ReplayControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  speed: number;
  onChangeSpeed: (speed: number) => void;
  currentSimMinutes: number; // 0 to 510 (8.5 hrs shift: 08:00 to 16:30)
  onSeek: (minutes: number) => void;
}

export const ReplayControls: React.FC<ReplayControlsProps> = ({
  isPlaying,
  onTogglePlay,
  speed,
  onChangeSpeed,
  currentSimMinutes,
  onSeek
}) => {
  // Format minutes into HH:MM AM/PM starting from 08:00
  const startHour = 8;
  const totalMinutes = startHour * 60 + currentSimMinutes;
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = hours > 12 ? hours - 12 : hours;
  const formattedTime = `${displayHours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")} ${ampm}`;

  return (
    <div className="bg-[#121C33] border border-slate-800 rounded-2xl p-3 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 text-xs font-mono">
      
      {/* Left: Play/Pause and Clock */}
      <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
        <div className="flex items-center gap-2">
          <button
            onClick={onTogglePlay}
            className={`p-2 rounded-xl border font-bold transition flex items-center gap-1.5 ${
              isPlaying
                ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                : "bg-teal-500/20 text-teal-300 border-teal-500/40 hover:bg-teal-500/30"
            }`}
            title={isPlaying ? "Pause Shift Replay" : "Play Shift Replay"}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isPlaying ? "PAUSE" : "PLAY"}</span>
          </button>

          <button
            onClick={() => onSeek(0)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition"
            title="Rewind to Shift Start (08:00)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Current Time Display */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
          <Clock className="w-4 h-4 text-teal-400" />
          <span className="text-slate-200 font-bold text-sm tracking-wider">{formattedTime}</span>
          <span className="text-[10px] text-slate-500">Shift 1</span>
        </div>
      </div>

      {/* Center: Shift Timeline Scrubber */}
      <div className="flex-1 w-full flex items-center gap-3 px-2">
        <span className="text-[10px] text-slate-500 font-bold shrink-0">08:00 AM</span>
        <input
          type="range"
          min="0"
          max="510"
          value={currentSimMinutes}
          onChange={(e) => onSeek(parseInt(e.target.value))}
          className="w-full accent-teal-400 cursor-pointer"
        />
        <span className="text-[10px] text-slate-500 font-bold shrink-0">04:30 PM</span>
      </div>

      {/* Right: Speed buttons */}
      <div className="flex items-center gap-1.5 w-full md:w-auto justify-end">
        <span className="text-[10px] text-slate-400 mr-1">Speed:</span>
        {[0.5, 1, 2, 5].map((s) => (
          <button
            key={s}
            onClick={() => onChangeSpeed(s)}
            className={`px-2 py-1 rounded-lg text-[11px] font-bold transition ${
              speed === s
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                : "bg-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            {s}x
          </button>
        ))}
      </div>

    </div>
  );
};
