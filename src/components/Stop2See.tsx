import React, { useState, useRef, useEffect } from "react";
import { 
  UnitInspectionData, 
  UploadedImage, 
  ReviewerCorrection, 
  ImageBox, 
  CurrencySymbol 
} from "../types";
import { drawApproximateHeatmap } from "../utils/imageUtils";
import { 
  Eye, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Search, 
  Filter, 
  Play, 
  RotateCw, 
  Sliders, 
  Info, 
  AlertOctagon, 
  CheckCheck 
} from "lucide-react";

interface Stop2SeeProps {
  units: UnitInspectionData[];
  selectedUnit: UnitInspectionData | null;
  onSelectUnit: (unit: UnitInspectionData) => void;
  onOpenEvidenceDrawer: (unit: UnitInspectionData) => void;
  reviewerCorrections: ReviewerCorrection[];
  knownClasses: string[];
  onAnalyzeUnit: (unitId: string) => Promise<void>;
  onAnalyzeAll: () => Promise<void>;
  isAnalyzingAll: boolean;
  analyzeProgress: { current: number; total: number };
  currency: CurrencySymbol;
  onOpenInsertModal: () => void;
}

export const Stop2See: React.FC<Stop2SeeProps> = ({
  units,
  selectedUnit,
  onSelectUnit,
  onOpenEvidenceDrawer,
  reviewerCorrections,
  knownClasses,
  onAnalyzeUnit,
  onAnalyzeAll,
  isAnalyzingAll,
  analyzeProgress,
  currency,
  onOpenInsertModal
}) => {
  const [overlayMode, setOverlayMode] = useState<"boxes" | "heatmap" | "none">("boxes");
  const [heatmapOpacity, setHeatmapOpacity] = useState<number>(0.65);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLaneFilter, setSelectedLaneFilter] = useState<string>("all");
  const [selectedDefectFilter, setSelectedDefectFilter] = useState<string>("all");
  const [isSingleAnalyzing, setIsSingleAnalyzing] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Active unit to display in big viewer
  const activeUnit = selectedUnit || units[0];

  useEffect(() => {
    if (!activeUnit || !canvasRef.current) return;

    if (overlayMode === "heatmap") {
      const boxes: ImageBox[] = activeUnit.boxes || [
        {
          label: activeUnit.defectType,
          box_2d: [
            activeUnit.boundingBox.y * 10,
            activeUnit.boundingBox.x * 10,
            (activeUnit.boundingBox.y + activeUnit.boundingBox.height) * 10,
            (activeUnit.boundingBox.x + activeUnit.boundingBox.width) * 10
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
  }, [activeUnit, overlayMode, heatmapOpacity]);

  const handleSingleAnalyze = async () => {
    if (!activeUnit) return;
    setIsSingleAnalyzing(true);
    await onAnalyzeUnit(activeUnit.id);
    setIsSingleAnalyzing(false);
  };

  // Filter gallery
  const filteredUnits = units.filter((u) => {
    const matchesSearch = 
      u.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.batchId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.defectType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLane = selectedLaneFilter === "all" || u.finalDecision === selectedLaneFilter;
    const matchesDefect = selectedDefectFilter === "all" || u.defectType === selectedDefectFilter;
    return matchesSearch && matchesLane && matchesDefect;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner & Batch Action */}
      <div className="bg-[#121C33] border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-heading font-bold text-slate-100 text-lg">
                  Stop 2: See — Vision Inspection & Heatmap
                </h2>
                <p className="text-xs text-slate-400">
                  Multimodal defect localization, confidence scoring, and novelty detection
                </p>
              </div>
            </div>

            {/* Few-Shot Feedback Counter */}
            {reviewerCorrections.length > 0 && (
              <div className="mt-2.5 flex items-center gap-2 text-[11px] font-mono text-violet-300 bg-violet-500/10 border border-violet-500/30 px-3 py-1 rounded-lg w-fit">
                <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                <span>{reviewerCorrections.length} reviewer feedback examples actively calibrating AI prompts</span>
              </div>
            )}
          </div>

          {/* Batch Inspect Button */}
          <div className="flex items-center gap-2.5 font-mono text-xs">
            {isAnalyzingAll ? (
              <div className="flex items-center gap-3 bg-slate-900 border border-slate-700 px-4 py-2 rounded-xl">
                <RotateCw className="w-4 h-4 text-teal-400 animate-spin" />
                <span className="text-slate-200 font-bold">
                  Analyzing {analyzeProgress.current} / {analyzeProgress.total} units...
                </span>
              </div>
            ) : (
              <button
                onClick={onAnalyzeAll}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold shadow-md shadow-teal-500/20 transition flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                <span>Analyze All ({units.length} Units)</span>
              </button>
            )}

            <button
              onClick={onOpenInsertModal}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              + Add Photos
            </button>
          </div>
        </div>
      </div>

      {/* Main Vision Stage & Result Panel */}
      {activeUnit && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Big Image Canvas Viewer (8 cols) */}
          <div className="lg:col-span-8 bg-[#121C33] border border-slate-800 rounded-2xl p-5 space-y-4">
            
            {/* Viewport Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800 font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="text-teal-400 font-bold text-sm">{activeUnit.id}</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-300">{activeUnit.componentType}</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400">{activeUnit.batchId} (Station {activeUnit.stationId})</span>
              </div>

              <button
                onClick={() => onOpenEvidenceDrawer(activeUnit)}
                className="text-xs text-teal-400 hover:text-teal-300 font-mono underline flex items-center gap-1"
              >
                <span>Full Evidence Card →</span>
              </button>
            </div>

            {/* The Image Viewport */}
            <div className="relative w-full aspect-[16/10] bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center select-none">
              
              {activeUnit.imageUrl ? (
                <img src={activeUnit.imageUrl} alt={activeUnit.id} className="w-full h-full object-contain" />
              ) : (
                <div className="w-full h-full relative flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
                  <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#2DD4BF_1px,transparent_1px)] [background-size:20px_20px]" />
                  
                  {/* High quality turbine rotor schematic illustration */}
                  <svg viewBox="0 0 500 320" className="w-4/5 h-4/5">
                    <circle cx="250" cy="160" r="110" fill="none" stroke="#334155" strokeWidth="8" />
                    <circle cx="250" cy="160" r="65" fill="#1e293b" stroke="#475569" strokeWidth="4" />
                    <circle cx="250" cy="160" r="24" fill="#0f172a" stroke="#64748b" strokeWidth="3" />
                    {[0, 24, 48, 72, 96, 120, 144, 168, 192, 216, 240, 264, 288, 312, 336].map((deg) => (
                      <line
                        key={deg}
                        x1="250"
                        y1="160"
                        x2={250 + 105 * Math.cos((deg * Math.PI) / 180)}
                        y2={160 + 105 * Math.sin((deg * Math.PI) / 180)}
                        stroke="#475569"
                        strokeWidth="3.5"
                      />
                    ))}
                    {activeUnit.defectType !== "Pass (Defect-Free)" && (
                      <path
                        d="M 285 98 Q 302 110 312 105"
                        fill="none"
                        stroke="#F43F5E"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                    )}
                  </svg>
                </div>
              )}

              {/* Bounding Box Layer */}
              {overlayMode === "boxes" && activeUnit.defectType !== "Pass (Defect-Free)" && (
                <div
                  className="absolute border-2 border-rose-500 bg-rose-500/15 rounded pointer-events-none transition-all"
                  style={{
                    left: `${activeUnit.boundingBox.x}%`,
                    top: `${activeUnit.boundingBox.y}%`,
                    width: `${activeUnit.boundingBox.width}%`,
                    height: `${activeUnit.boundingBox.height}%`
                  }}
                >
                  <div className="absolute -top-6 left-0 px-2 py-0.5 bg-rose-600 text-white font-mono text-[10px] font-bold rounded shadow-md whitespace-nowrap">
                    {activeUnit.defectType} ({activeUnit.confidence.toFixed(1)}%)
                  </div>
                </div>
              )}

              {/* Approximate Heatmap Canvas Layer */}
              <canvas
                ref={canvasRef}
                width={500}
                height={320}
                className={`absolute inset-0 w-full h-full pointer-events-none transition-opacity ${
                  overlayMode === "heatmap" ? "opacity-100" : "opacity-0"
                }`}
              />

              {/* Anomaly Novelty Banner if out of known classes */}
              {activeUnit.isAnomalyNovelty && (
                <div className="absolute top-3 right-3 px-3 py-1 rounded-lg bg-violet-600/90 text-white font-mono text-xs font-bold shadow-lg flex items-center gap-1.5 backdrop-blur-sm">
                  <AlertOctagon className="w-3.5 h-3.5" />
                  <span>Unknown Flaw — Novelty Anomaly</span>
                </div>
              )}
            </div>

            {/* Overlay Mode Switcher & Opacity Slider */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="text-slate-400">Display Layer:</span>
                <button
                  onClick={() => setOverlayMode("boxes")}
                  className={`px-3 py-1 rounded-lg transition ${
                    overlayMode === "boxes"
                      ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold"
                      : "bg-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Bounding Box
                </button>
                <button
                  onClick={() => setOverlayMode("heatmap")}
                  className={`px-3 py-1 rounded-lg transition ${
                    overlayMode === "heatmap"
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold"
                      : "bg-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Attention Heatmap
                </button>
                <button
                  onClick={() => setOverlayMode("none")}
                  className={`px-3 py-1 rounded-lg transition ${
                    overlayMode === "none"
                      ? "bg-teal-500/20 text-teal-300 border border-teal-500/40 font-bold"
                      : "bg-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Raw Inspection
                </button>
              </div>

              {overlayMode === "heatmap" && (
                <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
                  <span>Heatmap Opacity:</span>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={heatmapOpacity}
                    onChange={(e) => setHeatmapOpacity(parseFloat(e.target.value))}
                    className="w-24 accent-teal-400"
                  />
                  <span className="w-9 text-right">{Math.round(heatmapOpacity * 100)}%</span>
                </div>
              )}
            </div>

            {/* Mandatory Honest Heatmap Naming Disclaimer */}
            {overlayMode === "heatmap" && (
              <p className="text-[11px] text-slate-400 font-mono italic">
                * Note: Labeled strictly as "Approximate attention heatmap (from detected regions)" — not an internal Grad-CAM activation map.
              </p>
            )}
          </div>

          {/* Vision AI Inference Result Panel (4 cols) */}
          <div className="lg:col-span-4 bg-[#121C33] border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h3 className="font-heading font-bold text-slate-200 text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal-400" />
                  <span>AI Inference Results</span>
                </h3>
                <span className="text-[10px] font-mono text-slate-400">Gemini 2.5 Flash</span>
              </div>

              {/* Verdict & Defect Class */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-slate-400">Verdict</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                    activeUnit.finalDecision === "Reject" ? "bg-rose-500/20 text-rose-300 border border-rose-500/30" :
                    activeUnit.finalDecision === "Accept" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" :
                    "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  }`}>
                    {activeUnit.finalDecision}
                  </span>
                </div>

                <div>
                  <div className="text-base font-bold text-slate-100 font-sans">
                    {activeUnit.defectType}
                  </div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">
                    Severity: <strong className="text-slate-200">{activeUnit.severity}</strong> • Region: <strong className="text-teal-300">{activeUnit.boundingBox.regionName}</strong>
                  </div>
                </div>
              </div>

              {/* Confidence Ring Metric with Mandatory Honest Label */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">
                    Model-Reported Confidence
                  </span>
                  <span className="text-2xl font-extrabold font-mono text-teal-300">
                    {activeUnit.confidence.toFixed(1)}%
                  </span>
                  <span className="text-[10px] text-slate-500 block font-mono">
                    Uncertainty: {activeUnit.uncertaintyScore.toFixed(1)}%
                  </span>
                </div>

                <div className="w-12 h-12 rounded-full border-4 border-teal-500/30 border-t-teal-400 flex items-center justify-center font-mono font-bold text-xs text-teal-300">
                  {Math.round(activeUnit.confidence)}%
                </div>
              </div>

              {/* Visual Evidence Cues */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 font-mono block">
                  Visual Cues & Features:
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300 font-sans">
                  {(activeUnit.visualCues || [
                    "High-contrast discontinuity across upper-right flange",
                    "Surface luminance deviation exceeds tolerance boundary",
                    "Localized micro-pore cluster along stress axis"
                  ]).map((cue, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                      <span>{cue}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Re-Analyze Button */}
            <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
              <button
                onClick={handleSingleAnalyze}
                disabled={isSingleAnalyzing}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 border border-slate-700 font-mono text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isSingleAnalyzing ? "animate-spin text-teal-400" : ""}`} />
                <span>{isSingleAnalyzing ? "Analyzing with Gemini..." : "Re-Inspect Unit"}</span>
              </button>
            </div>

          </div>

        </div>
      )}

      {/* Gallery & Filter Strip */}
      <div className="bg-[#121C33] border border-slate-800 rounded-2xl p-5 space-y-4">
        
        {/* Filters Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-mono text-xs">
            <Filter className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-200 font-bold">Inspection Queue Gallery ({filteredUnits.length})</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search unit or batch..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:border-teal-400 outline-none w-44"
              />
            </div>

            {/* Lane Filter */}
            <select
              value={selectedLaneFilter}
              onChange={(e) => setSelectedLaneFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:border-teal-400 outline-none"
            >
              <option value="all">All Lanes</option>
              <option value="Accept">Accept Lane</option>
              <option value="Review">Review Lane</option>
              <option value="Reject">Reject Lane</option>
            </select>

            {/* Defect Filter */}
            <select
              value={selectedDefectFilter}
              onChange={(e) => setSelectedDefectFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:border-teal-400 outline-none"
            >
              <option value="all">All Defect Types</option>
              {knownClasses.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Units Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filteredUnits.map((u) => {
            const isSelected = activeUnit?.id === u.id;
            const laneBadgeColor = 
              u.finalDecision === "Reject" ? "bg-rose-500/20 text-rose-300 border-rose-500/30" :
              u.finalDecision === "Accept" ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" :
              "bg-amber-500/20 text-amber-300 border-amber-500/30";

            return (
              <div
                key={u.id}
                onClick={() => onSelectUnit(u)}
                className={`p-2.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? "bg-[#172341] border-teal-400 shadow-md shadow-teal-500/10 scale-[1.02]"
                    : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between font-mono text-[10px] mb-1.5">
                    <span className="font-bold text-slate-200">{u.id}</span>
                    <span className={`px-1.5 py-0.2 rounded border font-semibold ${laneBadgeColor}`}>
                      {u.finalDecision}
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-slate-300 truncate" title={u.defectType}>
                    {u.defectType}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">
                    {u.batchId} • S{u.stationId}
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-teal-400 font-bold">{u.confidence.toFixed(0)}%</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenEvidenceDrawer(u);
                    }}
                    className="text-slate-400 hover:text-teal-300 transition"
                    title="Open Evidence Card"
                  >
                    Evidence →
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
