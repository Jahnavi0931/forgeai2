import React, { useState, useRef } from "react";
import { 
  AlertTriangle, 
  Upload, 
  X, 
  CheckCircle2, 
  ArrowRight, 
  Camera, 
  Sparkles,
  Info,
  ChevronRight,
  FileText,
  Clock,
  Layers
} from "lucide-react";
import { 
  WorkerIssue, 
  IssueCategory, 
  IssuePriority, 
  WorkerProfile 
} from "../../types";

interface WorkerReportIssueProps {
  profile: WorkerProfile;
  onSubmitIssue: (issue: WorkerIssue) => void;
  onNavigateToMyIssues: () => void;
  onViewIssueDetails: (issue: WorkerIssue) => void;
}

export const WorkerReportIssue: React.FC<WorkerReportIssueProps> = ({
  profile,
  onSubmitIssue,
  onNavigateToMyIssues,
  onViewIssueDetails
}) => {
  // Form State
  const [station, setStation] = useState("S03");
  const [category, setCategory] = useState<IssueCategory>("Quality");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<IssuePriority>("High");
  const [batchId, setBatchId] = useState("Batch B26");
  const [evidenceImage, setEvidenceImage] = useState<string | null>(null);
  
  // Validation Errors
  const [errors, setErrors] = useState<{ title?: string; description?: string; station?: string }>({});

  // Submission State
  const [submittedIssue, setSubmittedIssue] = useState<WorkerIssue | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const stations = [
    { id: "S01", name: "S01 - Raw Infeed & Rough Cast" },
    { id: "S02", name: "S02 - Edge Milling & De-burr" },
    { id: "S03", name: "S03 - Finish Machining (Bottleneck)" },
    { id: "S04", name: "S04 - Multi-Spectrum Optical Inspection" },
    { id: "S05", name: "S05 - Outfeed & Diverter Lane" },
  ];

  const categories: IssueCategory[] = [
    "Quality",
    "Equipment",
    "Process",
    "Safety",
    "Material",
    "Other"
  ];

  const priorities: { id: IssuePriority; label: string; desc: string; color: string }[] = [
    { id: "Normal", label: "Normal", desc: "Non-critical variance, line running safely", color: "border-slate-700 text-slate-300 hover:border-slate-500" },
    { id: "High", label: "High", desc: "Degrading quality or takt pacing lag", color: "border-amber-500/50 text-amber-300 hover:border-amber-400" },
    { id: "Critical", label: "Critical", desc: "Immediate safety hazard or scrap burst", color: "border-rose-500/60 text-rose-300 hover:border-rose-400" },
  ];

  // Handle Image Upload
  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (PNG, JPG, WebP)");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setEvidenceImage(result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageUpload(e.target.files[0]);
    }
  };

  // Sample Presets for Quick Shop-Floor Testing
  const handleApplyPreset = (type: "thermal" | "vibration" | "burr") => {
    if (type === "thermal") {
      setStation("S03");
      setCategory("Quality");
      setPriority("High");
      setBatchId("Batch B26");
      setTitle("Coolant Manifold Pressure Drop & Thermal Discoloration");
      setDescription("Auxiliary coolant pressure dipped below 3.8 bar during finish milling. Noticeable dark heat haze on the trailing edge of blade #1042.");
      setEvidenceImage("https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80");
    } else if (type === "vibration") {
      setStation("S02");
      setCategory("Equipment");
      setPriority("Critical");
      setBatchId("Batch B26");
      setTitle("De-burr Spindle Bearing Vibration Warning");
      setDescription("Acoustic sensor and vibration RMS spiked past 2.5 mm/s. Noticeable tool chatter marks along outer chamfer.");
      setEvidenceImage("https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=800&auto=format&fit=crop&q=80");
    } else {
      setStation("S03");
      setCategory("Process");
      setPriority("Normal");
      setBatchId("Batch B25");
      setTitle("Cycle Time Exceeded Nominal Takt by 6.2s");
      setDescription("Toolpath dwells for 5 extra seconds at apex turn. Buffer queue backing up into S02.");
      setEvidenceImage("https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80");
    }
    setErrors({});
  };

  // Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { title?: string; description?: string; station?: string } = {};

    if (!title.trim()) {
      newErrors.title = "Please provide a brief title or summary of the issue.";
    }
    if (!description.trim() || description.trim().length < 10) {
      newErrors.description = "Please describe what occurred in at least 10 characters.";
    }
    if (!station) {
      newErrors.station = "Please select an affected workstation.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    // Generate mock Issue ID
    const randomNum = Math.floor(Math.random() * 40) + 1045;
    const generatedId = `ISS-${randomNum}`;

    const newIssue: WorkerIssue = {
      id: generatedId,
      title: title.trim(),
      description: description.trim(),
      station,
      category,
      priority,
      status: "Submitted",
      submittedBy: profile.name,
      workerId: profile.workerId,
      submittedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      date: `Today, ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
      batchId: batchId.trim() || undefined,
      evidenceImage: evidenceImage || undefined
    };

    setTimeout(() => {
      onSubmitIssue(newIssue);
      setSubmittedIssue(newIssue);
      setIsSubmitting(false);
    }, 450);
  };

  // SUCCESS CONFIRMATION VIEW
  if (submittedIssue) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
        {/* Success Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#121C33] border border-emerald-500/40 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center space-y-3 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-100">
              Issue Submitted Successfully
            </h2>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              Your report has been logged and queued in the quality intelligence pipeline. Quality leads and maintenance supervisors have been alerted.
            </p>
          </div>

          {/* Issue Summary Box */}
          <div className="mt-6 p-4 rounded-xl bg-[#09101e] border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs text-slate-400 font-mono">Issue ID</span>
              <span className="font-mono text-base font-extrabold text-teal-300">
                {submittedIssue.id}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                <div className="text-[10px] text-slate-500 font-mono uppercase">Station</div>
                <div className="font-bold text-sm text-slate-200 mt-0.5">{submittedIssue.station}</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                <div className="text-[10px] text-slate-500 font-mono uppercase">Category</div>
                <div className="font-bold text-sm text-slate-200 mt-0.5">{submittedIssue.category}</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                <div className="text-[10px] text-slate-500 font-mono uppercase">Priority</div>
                <div className={`font-bold text-sm mt-0.5 ${
                  submittedIssue.priority === "Critical" ? "text-rose-400" :
                  submittedIssue.priority === "High" ? "text-amber-400" : "text-slate-200"
                }`}>
                  {submittedIssue.priority}
                </div>
              </div>
            </div>

            {/* Visual Status Tracker Requirement:
                ● Submitted
                ○ Under Review
                ○ Action Assigned
                ○ Resolved
            */}
            <div className="pt-4 border-t border-slate-800/80">
              <div className="text-xs font-mono font-semibold text-slate-400 mb-3 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-teal-400" />
                <span>Issue Resolution Status Tracker</span>
              </div>

              <div className="grid grid-cols-4 gap-1 sm:gap-2 text-center text-xs">
                
                {/* Step 1: Submitted (Active) */}
                <div className="p-2.5 rounded-xl bg-teal-500/15 border border-teal-500/40 text-teal-300 flex flex-col items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-teal-400 shadow-sm shadow-teal-400 animate-pulse" />
                  <span className="font-bold text-[11px] mt-0.5">● Submitted</span>
                  <span className="text-[9px] text-teal-400/80 font-mono">Logged</span>
                </div>

                {/* Step 2: Under Review */}
                <div className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-800 text-slate-400 flex flex-col items-center gap-1 opacity-70">
                  <div className="w-3 h-3 rounded-full border border-slate-600 bg-slate-800" />
                  <span className="font-medium text-[11px] mt-0.5">○ Under Review</span>
                  <span className="text-[9px] text-slate-600 font-mono">Pending</span>
                </div>

                {/* Step 3: Action Assigned */}
                <div className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-800 text-slate-400 flex flex-col items-center gap-1 opacity-70">
                  <div className="w-3 h-3 rounded-full border border-slate-600 bg-slate-800" />
                  <span className="font-medium text-[11px] mt-0.5">○ Action Assigned</span>
                  <span className="text-[9px] text-slate-600 font-mono">Pending</span>
                </div>

                {/* Step 4: Resolved */}
                <div className="p-2.5 rounded-xl bg-slate-900/40 border border-slate-800 text-slate-400 flex flex-col items-center gap-1 opacity-70">
                  <div className="w-3 h-3 rounded-full border border-slate-600 bg-slate-800" />
                  <span className="font-medium text-[11px] mt-0.5">○ Resolved</span>
                  <span className="text-[9px] text-slate-600 font-mono">Pending</span>
                </div>

              </div>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => onViewIssueDetails(submittedIssue)}
              className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold text-sm shadow-lg shadow-teal-500/20 transition flex items-center justify-center gap-2"
            >
              <span>View Issue Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setSubmittedIssue(null);
                setTitle("");
                setDescription("");
                setEvidenceImage(null);
              }}
              className="w-full sm:w-auto py-3 px-4 rounded-xl bg-[#09101e] border border-slate-700 hover:border-amber-500/50 text-slate-200 text-sm font-semibold transition"
            >
              Report Another Issue
            </button>

            <button
              onClick={onNavigateToMyIssues}
              className="w-full sm:w-auto py-3 px-4 rounded-xl bg-transparent border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-sm transition"
            >
              Go to My Issues
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-2xl bg-[#121C33] border border-slate-800">
        <div>
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-amber-400" />
            <span>Shop Floor Issue Report</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Log shop-floor defects, machine anomalies, or safety risks to notify supervisors and quality engineers.
          </p>
        </div>

        {/* Quick Presets for fast testing */}
        <div className="flex items-center gap-1.5 self-start sm:self-center">
          <span className="text-[11px] text-slate-500 font-mono hidden lg:inline">Presets:</span>
          <button
            type="button"
            onClick={() => handleApplyPreset("thermal")}
            className="px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[11px] font-mono border border-slate-700 transition"
            title="Load Station S03 Thermal anomaly preset"
          >
            Thermal
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset("vibration")}
            className="px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[11px] font-mono border border-slate-700 transition"
            title="Load S02 Spindle vibration preset"
          >
            Vibration
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset("burr")}
            className="px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[11px] font-mono border border-slate-700 transition"
            title="Load Takt time lag preset"
          >
            Takt Lag
          </button>
        </div>
      </div>

      {/* Main Issue Form */}
      <form onSubmit={handleSubmit} className="p-5 sm:p-7 rounded-2xl bg-[#121C33] border border-slate-800 shadow-xl space-y-6">
        
        {/* Field 1: Station Selector */}
        <div>
          <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-2">
            1. Workstation <span className="text-rose-400">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {stations.map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => {
                  setStation(st.id);
                  if (errors.station) setErrors({ ...errors, station: undefined });
                }}
                className={`p-3 rounded-xl border text-left text-xs font-sans transition flex items-center justify-between ${
                  station === st.id
                    ? "bg-teal-500/15 border-teal-500 text-teal-200 font-bold shadow-sm"
                    : "bg-[#0b1324] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                }`}
              >
                <div className="truncate">
                  <div className="font-mono font-bold text-sm text-slate-200">{st.id}</div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5">{st.name.replace(`${st.id} - `, "")}</div>
                </div>
                {station === st.id && (
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                )}
              </button>
            ))}
          </div>
          {errors.station && (
            <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1 font-mono">
              <AlertTriangle className="w-3 h-3" /> {errors.station}
            </p>
          )}
        </div>

        {/* Field 2: Issue Category */}
        <div>
          <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-2">
            2. Issue Category <span className="text-rose-400">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold text-center transition ${
                  category === cat
                    ? "bg-amber-500/20 border-amber-500 text-amber-300 shadow-sm"
                    : "bg-[#0b1324] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Field 3: Title & Description */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-2">
              Issue Summary / Headline <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors({ ...errors, title: undefined });
              }}
              placeholder="e.g. Thermal discoloration on blade trailing edge..."
              className={`w-full px-4 py-3 rounded-xl bg-[#0b1324] border text-slate-100 text-sm placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-teal-500 transition ${
                errors.title ? "border-rose-500" : "border-slate-800 focus:border-teal-500"
              }`}
            />
            {errors.title && (
              <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1 font-mono">
                <AlertTriangle className="w-3 h-3" /> {errors.title}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                3. Detailed Description <span className="text-rose-400">*</span>
              </label>
              <span className="text-[11px] text-slate-500 font-mono">
                {description.length} characters
              </span>
            </div>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) setErrors({ ...errors, description: undefined });
              }}
              placeholder="Describe observations: sensory noise, smell, heat, specific machine alarms, visual marks, or parts affected..."
              className={`w-full px-4 py-3 rounded-xl bg-[#0b1324] border text-slate-100 text-sm placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-teal-500 transition leading-relaxed ${
                errors.description ? "border-rose-500" : "border-slate-800 focus:border-teal-500"
              }`}
            />
            {errors.description && (
              <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1 font-mono">
                <AlertTriangle className="w-3 h-3" /> {errors.description}
              </p>
            )}
          </div>
        </div>

        {/* Field 4: Upload Evidence (Image / Photo) */}
        <div>
          <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-2">
            4. Upload Evidence (Photo / Visual Inspection)
          </label>

          {evidenceImage ? (
            <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-[#09101e] p-2 max-w-md">
              <img
                src={evidenceImage}
                alt="Uploaded defect evidence"
                className="w-full h-48 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => setEvidenceImage(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-950/80 hover:bg-rose-600 text-slate-200 hover:text-white transition shadow-lg"
                title="Remove photo"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="mt-2 flex items-center justify-between text-xs text-slate-400 px-1">
                <span className="flex items-center gap-1 text-teal-300">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Photo Attached
                </span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-teal-400 hover:underline text-[11px]"
                >
                  Change Image
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleImageUpload(e.dataTransfer.files[0]);
                }
              }}
              className="p-6 rounded-xl border-2 border-dashed border-slate-800 hover:border-teal-500/50 bg-[#0b1324] hover:bg-[#0e172d] transition cursor-pointer text-center space-y-2 group"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-slate-400 group-hover:text-teal-400 mx-auto flex items-center justify-center transition">
                <Camera className="w-6 h-6" />
              </div>
              <div className="text-xs text-slate-300 font-medium">
                <span className="text-teal-400 font-semibold underline">Click to take photo or upload</span> or drag and drop
              </div>
              <p className="text-[11px] text-slate-500">
                Supports camera snapshot, JPG, PNG, WebP up to 10MB
              </p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Field 5: Priority / Urgency */}
        <div>
          <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-2">
            5. Priority & Urgency <span className="text-rose-400">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {priorities.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPriority(p.id)}
                className={`p-3 rounded-xl border text-left transition ${
                  priority === p.id
                    ? p.id === "Critical"
                      ? "bg-rose-500/20 border-rose-500 shadow-sm"
                      : p.id === "High"
                      ? "bg-amber-500/20 border-amber-500 shadow-sm"
                      : "bg-slate-800/80 border-teal-500 shadow-sm"
                    : "bg-[#0b1324] border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-bold text-sm ${
                    p.id === "Critical" ? "text-rose-400" :
                    p.id === "High" ? "text-amber-400" : "text-slate-200"
                  }`}>
                    {p.label}
                  </span>
                  {priority === p.id && (
                    <div className="w-2 h-2 rounded-full bg-teal-400" />
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  {p.desc}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Field 6: Optional Affected Batch ID */}
        <div>
          <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-2">
            6. Affected Batch ID <span className="text-slate-500 font-normal font-sans">(Optional)</span>
          </label>
          <input
            type="text"
            value={batchId}
            onChange={(e) => setBatchId(e.target.value)}
            placeholder="e.g. Batch B26, Lot #402"
            className="w-full sm:w-64 px-4 py-2.5 rounded-xl bg-[#0b1324] border border-slate-800 text-slate-100 text-sm font-mono placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 transition"
          />
        </div>

        {/* Submit Issue Button */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <Info className="w-4 h-4 text-teal-400 shrink-0" />
            <span>Submitting as: <strong className="text-slate-200 font-mono">{profile.name} ({profile.workerId})</strong></span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:via-orange-400 hover:to-amber-500 text-slate-950 font-heading font-extrabold text-base shadow-xl shadow-amber-500/20 hover:shadow-amber-500/30 transition-all flex items-center justify-center gap-2 min-h-[52px]"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Logging Issue...</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-5 h-5 stroke-[2.5]" />
                <span>SUBMIT ISSUE</span>
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
};
