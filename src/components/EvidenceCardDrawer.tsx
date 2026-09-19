import React, { useState, useRef, useEffect } from "react";
import { UnitInspectionData, CurrencySymbol, ImageBox } from "../types";
import { drawApproximateHeatmap } from "../utils/imageUtils";
import { 
  X, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Layers, 
  Thermometer, 
  Activity, 
  Gauge, 
  Copy, 
  Check, 
  ExternalLink, 
  Eye, 
  Sparkles 
} from "lucide-react";

interface EvidenceCardDrawerProps {
  unit: UnitInspectionData | null;
  isOpen: boolean;
  onClose: () => void;
  currency: CurrencySymbol;
  onUpdateDecision: (unitId: string, lane: "Accept" | "Reject" | "Review") => void;
  onSelectUnit?: (unitId: string) => void;
  allUnits: UnitInspectionData[];
}

export const EvidenceCardDrawer: React.FC<EvidenceCardDrawerProps> = ({
  unit,
  isOpen,
  onClose,
  currency,
  onUpdateDecision,
  onSelectUnit,
  allUnits
}) => {
  const [overlayMode, setOverlayMode] = useState<"boxes" | "heatmap" | "none">("boxes");
  const [heatmapOpacity, setHeatmapOpacity] = useState<number>(0.65);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!unit || !canvasRef.current) return;

    if (overlayMode === "heatmap") {
      const boxes: ImageBox[] = unit.boxes || [
        {
          label: unit.defectType,
          box_2d: [
            unit.boundingBox.y * 10,
            unit.boundingBox.x * 10,
            (unit.boundingBox.y + unit.boundingBox.height) * 10,
            (unit.boundingBox.x + unit.boundingBox.width) * 10
          ]
        }
      ];
      drawApproximateHeatmap(canvasRef.current, boxes, heatmapOpacity);
    } else {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  }, [unit, overlayMode, heatmapOpacity]);

  if (!isOpen || !unit) return null;

  // Process parameter delta calculations
  const p = unit.processData;
  const tempDelta = ((p.temperature - p.tempBaseline) / p.tempBaseline) * 100;
  const pressDelta = ((p.pressure - p.pressureBaseline) / p.pressureBaseline) * 100;
  const cycleDelta = ((p.cycleTime - p.cycleTimeBaseline) / p.cycleTimeBaseline) * 100;
  const vibDelta = ((p.vibrationRms - p.vibrationBaseline) / p.vibrationBaseline) * 100;

  // Find similar past defects
  const similarDefects = allUnits
    .filter((u) => u.id !== unit.id && u.defectType === unit.defectType && u.defectType !== "Pass (Defect-Free)")
    .slice(0, 3);

  // Copy summary to clipboard
  const handleCopySummary = () => {
    const summaryText = `[INSPECTION EVIDENCE CARD - ${unit.id}]
Defect: ${unit.defectType} (Severity: ${unit.severity})
Model-Reported Confidence: ${unit.confidence}%
Verdict: ${unit.finalDecision}
Region: ${unit.boundingBox.regionName}
Process Deviations:
- Temperature: ${p.temperature}°C (${tempDelta > 0 ? "+" : ""}${tempDelta.toFixed(1)}% vs baseline)
- Pressure: ${p.pressure} bar (${pressDelta > 0 ? "+" : ""}${pressDelta.toFixed(1)}% vs baseline)
- Cycle Time: ${p.cycleTime}s (${cycleDelta > 0 ? "+" : ""}${cycleDelta.toFixed(1)}% vs baseline)
- Vibration RMS: ${p.vibrationRms} mm/s
Visual Cues:
${(unit.visualCues || ["Edge fissure gradient deviation", "Surface reflectivity dip"]).map(c => `• ${c}`).join("\n")}
Financial Risk: Miss Cost=${currency}${unit.economics.missedDefectWarrantyCost}, Scrap Cost=${currency}${unit.economics.scrapCost}`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xl bg-[#0E162B] border-l border-slate-700 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
      
      {/* Top Header */}
      <div className="p-4 border-b border-slate-800 bg-[#121C33] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-violet-500/20 text-[#A78BFA] border border-violet-500/40 text-[10px] font-mono font-bold flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#A78BFA]" />
            IDEA 3
          </span>
          <h2 className="font-heading font-bold text-slate-100 text-base flex items-center gap-2">
            Evidence Card: <span className="font-mono text-teal-400">{unit.id}</span>
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopySummary}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition"
            title="Copy structured summary to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied!" : "Copy summary"}</span>
          </button>

          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Drawer Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs font-sans">
        
        {/* Component Image with Overlay */}
        <div className="bg-[#121C33] border border-slate-800 rounded-xl p-3 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300 font-bold">{unit.componentType}</span>
            <span className="text-slate-500">{unit.batchId} • Station {unit.stationId}</span>
          </div>

          {/* Visual Canvas Stage */}
          <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
            {/* Base SVG / Image rendering */}
            {unit.imageUrl ? (
              <img src={unit.imageUrl} alt={unit.id} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full relative flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
                {/* Industrial grid & component pattern */}
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#2DD4BF_1px,transparent_1px)] [background-size:16px_16px]" />
                
                {/* Synthetic turbine rotor component illustration */}
                <svg viewBox="0 0 400 240" className="w-4/5 h-4/5">
                  <circle cx="200" cy="120" r="85" fill="none" stroke="#334155" strokeWidth="6" />
                  <circle cx="200" cy="120" r="50" fill="#1e293b" stroke="#475569" strokeWidth="3" />
                  <circle cx="200" cy="120" r="18" fill="#0f172a" stroke="#64748b" strokeWidth="2" />
                  {/* Rotor blades */}
                  {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                    <line
                      key={deg}
                      x1="200"
                      y1="120"
                      x2={200 + 80 * Math.cos((deg * Math.PI) / 180)}
                      y2={120 + 80 * Math.sin((deg * Math.PI) / 180)}
                      stroke="#475569"
                      strokeWidth="3"
                    />
                  ))}
                  {/* Defect marker if defective */}
                  {unit.defectType !== "Pass (Defect-Free)" && (
                    <path
                      d="M 230 75 Q 242 85 250 82"
                      fill="none"
                      stroke="#F43F5E"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                  )}
                </svg>
              </div>
            )}

            {/* Bounding box layer */}
            {overlayMode === "boxes" && unit.defectType !== "Pass (Defect-Free)" && (
              <div
                className="absolute border-2 border-rose-500 bg-rose-500/15 rounded pointer-events-none transition-all"
                style={{
                  left: `${unit.boundingBox.x}%`,
                  top: `${unit.boundingBox.y}%`,
                  width: `${unit.boundingBox.width}%`,
                  height: `${unit.boundingBox.height}%`
                }}
              >
                <div className="absolute -top-5 left-0 px-1.5 py-0.2 bg-rose-600 text-white font-mono text-[9px] font-bold rounded shadow-md whitespace-nowrap">
                  {unit.defectType} ({unit.confidence.toFixed(1)}%)
                </div>
              </div>
            )}

            {/* Approximate Heatmap Canvas Layer */}
            <canvas
              ref={canvasRef}
              width={400}
              height={240}
              className={`absolute inset-0 w-full h-full pointer-events-none transition-opacity ${
                overlayMode === "heatmap" ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>

          {/* Overlay Controls */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-1.5 font-mono text-[11px]">
              <span className="text-slate-400">Layer:</span>
              <button
                onClick={() => setOverlayMode("boxes")}
                className={`px-2 py-0.5 rounded transition ${
                  overlayMode === "boxes"
                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                    : "bg-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                Bounding Box
              </button>
              <button
                onClick={() => setOverlayMode("heatmap")}
                className={`px-2 py-0.5 rounded transition ${
                  overlayMode === "heatmap"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                    : "bg-slate-800 text-slate-400 hover:text-slate-200"
                }`}
                title="Approximate attention heatmap (from detected regions)"
              >
                Heatmap
              </button>
              <button
                onClick={() => setOverlayMode("none")}
                className={`px-2 py-0.5 rounded transition ${
                  overlayMode === "none"
                    ? "bg-teal-500/20 text-teal-300 border border-teal-500/40"
                    : "bg-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                Raw Image
              </button>
            </div>

            {overlayMode === "heatmap" && (
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-400">
                <span>Opacity:</span>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={heatmapOpacity}
                  onChange={(e) => setHeatmapOpacity(parseFloat(e.target.value))}
                  className="w-16 accent-teal-400"
                />
                <span>{Math.round(heatmapOpacity * 100)}%</span>
              </div>
            )}
          </div>

          {/* Heatmap Honest Label Disclaimer */}
          {overlayMode === "heatmap" && (
            <p className="text-[10px] text-slate-400 font-mono italic">
              * Approximate attention heatmap (from detected regions) — not raw internal activation Grad-CAM.
            </p>
          )}
        </div>

        {/* Verdict, Defect & Confidence Summary */}
        <div className="grid grid-cols-3 gap-3 font-mono">
          <div className="p-3 bg-[#121C33] border border-slate-800 rounded-xl">
            <span className="text-[10px] text-slate-400 block mb-1 uppercase">Verdict</span>
            <div className="flex items-center gap-1.5">
              {unit.finalDecision === "Reject" ? (
                <span className="text-rose-400 font-bold flex items-center gap-1 text-sm">
                  <XCircle className="w-4 h-4" /> Reject
                </span>
              ) : unit.finalDecision === "Accept" ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1 text-sm">
                  <CheckCircle2 className="w-4 h-4" /> Accept
                </span>
              ) : (
                <span className="text-amber-400 font-bold flex items-center gap-1 text-sm">
                  <AlertTriangle className="w-4 h-4" /> Review
                </span>
              )}
            </div>
          </div>

          <div className="p-3 bg-[#121C33] border border-slate-800 rounded-xl">
            <span className="text-[10px] text-slate-400 block mb-1 uppercase">Defect Type</span>
            <div className="font-bold text-slate-100 text-xs truncate" title={unit.defectType}>
              {unit.defectType}
            </div>
            <span className="text-[10px] text-slate-400">Severity: {unit.severity}</span>
          </div>

          <div className="p-3 bg-[#121C33] border border-slate-800 rounded-xl">
            <span className="text-[10px] text-slate-400 block mb-1 uppercase" title="Model-reported confidence">
              Confidence
            </span>
            <div className="text-sm font-extrabold text-teal-300">
              {unit.confidence.toFixed(1)}%
            </div>
            <span className="text-[9px] text-slate-400 block">Model-reported</span>
          </div>
        </div>

        {/* Region & Visual Cues */}
        <div className="bg-[#121C33] border border-slate-800 rounded-xl p-3.5 space-y-2">
          <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Region & Visual Evidence Cues</span>
          </div>

          <p className="text-xs text-slate-300 font-mono bg-slate-900/60 p-2 rounded border border-slate-800">
            Detected in: <strong className="text-teal-300">{unit.boundingBox.regionName}</strong>
          </p>

          <ul className="space-y-1.5 pt-1">
            {(unit.visualCues || [
              "Continuous linear fissure gradient across radial rib boundary",
              "Surface reflectivity drop (>30%) inconsistent with nominal tooling",
              "Discontinuous edge contour exceeding dimensional tolerance"
            ]).map((cue, idx) => (
              <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                <span>{cue}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Contributing Process Factors Table */}
        <div className="bg-[#121C33] border border-slate-800 rounded-xl p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-amber-400" />
              <span>Contributing Telemetry Factors vs Baseline</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Station {unit.stationId}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-[11px] font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-left">
                  <th className="pb-1.5">Parameter</th>
                  <th className="pb-1.5 text-right">Actual</th>
                  <th className="pb-1.5 text-right">Baseline</th>
                  <th className="pb-1.5 text-right">Deviation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                <tr>
                  <td className="py-1.5 text-slate-200">Temperature</td>
                  <td className="py-1.5 text-right">{p.temperature.toFixed(1)}°C</td>
                  <td className="py-1.5 text-right text-slate-400">{p.tempBaseline.toFixed(1)}°C</td>
                  <td className={`py-1.5 text-right font-bold ${Math.abs(tempDelta) > 5 ? "text-rose-400" : "text-slate-400"}`}>
                    {tempDelta > 0 ? "+" : ""}{tempDelta.toFixed(1)}%
                  </td>
                </tr>
                <tr>
                  <td className="py-1.5 text-slate-200">Pressure</td>
                  <td className="py-1.5 text-right">{p.pressure.toFixed(2)} bar</td>
                  <td className="py-1.5 text-right text-slate-400">{p.pressureBaseline.toFixed(2)} bar</td>
                  <td className={`py-1.5 text-right font-bold ${Math.abs(pressDelta) > 5 ? "text-rose-400" : "text-slate-400"}`}>
                    {pressDelta > 0 ? "+" : ""}{pressDelta.toFixed(1)}%
                  </td>
                </tr>
                <tr>
                  <td className="py-1.5 text-slate-200">Cycle Time</td>
                  <td className="py-1.5 text-right">{p.cycleTime.toFixed(1)}s</td>
                  <td className="py-1.5 text-right text-slate-400">{p.cycleTimeBaseline.toFixed(1)}s</td>
                  <td className={`py-1.5 text-right font-bold ${Math.abs(cycleDelta) > 10 ? "text-amber-400" : "text-slate-400"}`}>
                    {cycleDelta > 0 ? "+" : ""}{cycleDelta.toFixed(1)}%
                  </td>
                </tr>
                <tr>
                  <td className="py-1.5 text-slate-200">Vibration RMS</td>
                  <td className="py-1.5 text-right">{p.vibrationRms.toFixed(2)}</td>
                  <td className="py-1.5 text-right text-slate-400">{p.vibrationBaseline.toFixed(2)}</td>
                  <td className={`py-1.5 text-right font-bold ${Math.abs(vibDelta) > 10 ? "text-amber-400" : "text-slate-400"}`}>
                    {vibDelta > 0 ? "+" : ""}{vibDelta.toFixed(1)}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Similar Past Defects */}
        {similarDefects.length > 0 && (
          <div className="bg-[#121C33] border border-slate-800 rounded-xl p-3.5 space-y-2">
            <div className="text-xs font-bold text-slate-200 flex items-center justify-between">
              <span>Similar Past Defects ({unit.defectType})</span>
              <span className="text-[10px] font-mono text-slate-400">{unit.similarPastDefectsCount} historical occurrences</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {similarDefects.map((sim) => (
                <button
                  key={sim.id}
                  onClick={() => onSelectUnit && onSelectUnit(sim.id)}
                  className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-teal-500/40 text-left transition font-mono"
                >
                  <div className="text-teal-300 font-bold text-[11px] flex items-center justify-between">
                    <span>{sim.id}</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                  </div>
                  <div className="text-[9px] text-slate-400 truncate">{sim.batchId}</div>
                  <div className="text-[9px] text-slate-500">Conf: {sim.confidence.toFixed(0)}%</div>
                </button>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Footer Action Buttons */}
      <div className="p-4 border-t border-slate-800 bg-[#121C33] flex items-center justify-between gap-2 font-mono">
        <span className="text-[11px] text-slate-400">Override Lane:</span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onUpdateDecision(unit.id, "Accept")}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
              unit.finalDecision === "Accept"
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500 shadow-md shadow-emerald-500/20"
                : "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Accept</span>
          </button>

          <button
            onClick={() => onUpdateDecision(unit.id, "Review")}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
              unit.finalDecision === "Review"
                ? "bg-amber-500/20 text-amber-300 border-amber-500 shadow-md shadow-amber-500/20"
                : "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Review</span>
          </button>

          <button
            onClick={() => onUpdateDecision(unit.id, "Reject")}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
              unit.finalDecision === "Reject"
                ? "bg-rose-500/20 text-rose-300 border-rose-500 shadow-md shadow-rose-500/20"
                : "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
            }`}
          >
            <XCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>Reject</span>
          </button>
        </div>
      </div>

    </div>
  );
};
