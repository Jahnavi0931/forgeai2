import React from "react";
import { 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  Wrench, 
  FileText, 
  AlertTriangle,
  Building,
  Layers,
  Calendar,
  ExternalLink,
  ShieldCheck,
  Flame,
  Check
} from "lucide-react";
import { WorkerIssue } from "../../types";

interface WorkerIssueDetailsProps {
  issue: WorkerIssue;
  onBack: () => void;
}

export const WorkerIssueDetails: React.FC<WorkerIssueDetailsProps> = ({
  issue,
  onBack
}) => {
  // Timeline steps:
  // 1: SUBMITTED
  // 2: UNDER REVIEW
  // 3: ACTION ASSIGNED
  // 4: RESOLVED
  const steps = [
    { 
      id: "Submitted", 
      title: "SUBMITTED", 
      desc: `Logged by ${issue.submittedBy} at ${issue.submittedAt}`,
      date: issue.date
    },
    { 
      id: "Under Review", 
      title: "UNDER REVIEW", 
      desc: issue.assignedTo ? `Reviewed by ${issue.assignedTo}` : "Awaiting Quality Engineer triage",
      date: issue.status !== "Submitted" ? "In Progress" : "Pending"
    },
    { 
      id: "Action Assigned", 
      title: "ACTION ASSIGNED", 
      desc: issue.actionTaken || "Engineering work order generation",
      date: issue.status === "Action Assigned" || issue.status === "Resolved" ? "Dispatched" : "Pending"
    },
    { 
      id: "Resolved", 
      title: "RESOLVED", 
      desc: issue.resolutionNotes || "Physical countermeasure and quality sign-off",
      date: issue.resolvedAt || (issue.status === "Resolved" ? "Closed" : "Pending")
    }
  ];

  const getStepStatus = (stepId: string) => {
    const order = ["Submitted", "Under Review", "Action Assigned", "Resolved"];
    const currentIndex = order.indexOf(issue.status);
    const stepIndex = order.indexOf(stepId);

    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "active";
    return "upcoming";
  };

  const statusBadgeColor = 
    issue.status === "Resolved" ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" :
    issue.status === "Action Assigned" ? "bg-cyan-500/15 text-cyan-400 border-cyan-500/30" :
    issue.status === "Under Review" ? "bg-amber-500/15 text-amber-400 border-amber-500/30" :
    "bg-slate-800 text-slate-300 border-slate-700";

  const priorityColor = 
    issue.priority === "Critical" ? "text-rose-400 bg-rose-500/10 border-rose-500/30" :
    issue.priority === "High" ? "text-amber-400 bg-amber-500/10 border-amber-500/30" :
    "text-slate-400 bg-slate-800/80 border-slate-700";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-3.5 py-2 rounded-xl bg-[#121C33] border border-slate-800 hover:border-teal-500/50 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition"
        >
          <ArrowLeft className="w-4 h-4 text-teal-400" />
          <span>Back to Issues</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">Status:</span>
          <span className={`px-3 py-1 rounded-full font-mono text-xs font-bold border ${statusBadgeColor}`}>
            {issue.status}
          </span>
        </div>
      </div>

      {/* Main Issue Header Card */}
      <div className="p-6 sm:p-7 rounded-2xl bg-[#121C33] border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="font-mono text-base font-extrabold text-teal-300 bg-teal-500/10 border border-teal-500/30 px-2.5 py-0.5 rounded-md">
            {issue.id}
          </span>
          <span className="px-2.5 py-0.5 rounded font-mono font-semibold bg-slate-800 border border-slate-700 text-slate-300 text-xs">
            Station {issue.station}
          </span>
          <span className="px-2.5 py-0.5 rounded font-mono text-slate-300 border border-slate-700 text-xs">
            {issue.category}
          </span>
          <span className={`px-2.5 py-0.5 rounded font-mono text-xs font-bold border ${priorityColor}`}>
            {issue.priority} Priority
          </span>
          {issue.batchId && (
            <span className="px-2.5 py-0.5 rounded font-mono bg-slate-900 border border-slate-800 text-cyan-400 text-xs">
              {issue.batchId}
            </span>
          )}
        </div>

        <h1 className="font-heading text-xl sm:text-2xl font-bold text-slate-100">
          {issue.title}
        </h1>

        <div className="text-xs text-slate-400 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono pt-1 border-t border-slate-800/80">
          <span>Reported by: <strong className="text-slate-200">{issue.submittedBy}</strong></span>
          <span>•</span>
          <span>Time: <strong className="text-slate-200">{issue.date}</strong></span>
          {issue.assignedTo && (
            <>
              <span>•</span>
              <span>Assigned: <strong className="text-teal-300">{issue.assignedTo}</strong></span>
            </>
          )}
        </div>
      </div>

      {/* Visual Status Timeline (Required Spec) */}
      <div className="p-6 rounded-2xl bg-[#121C33] border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-base font-bold text-slate-100 flex items-center gap-2">
            <Clock className="w-4 h-4 text-teal-400" />
            <span>Resolution Timeline & Workflow</span>
          </h3>
          <span className="text-xs font-mono text-slate-500">
            Current: {issue.status}
          </span>
        </div>

        {/* Desktop Horizontal Timeline */}
        <div className="hidden sm:grid grid-cols-4 gap-2 pt-2">
          {steps.map((step, idx) => {
            const status = getStepStatus(step.id);

            return (
              <div
                key={step.id}
                className={`p-3.5 rounded-xl border transition relative ${
                  status === "completed"
                    ? "bg-teal-500/10 border-teal-500/40 text-teal-300"
                    : status === "active"
                    ? "bg-amber-500/15 border-amber-500/60 text-amber-300 shadow-lg shadow-amber-500/10"
                    : "bg-[#09101e] border-slate-800/80 text-slate-500 opacity-60"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider">
                    Step 0{idx + 1}
                  </span>
                  {status === "completed" ? (
                    <div className="w-5 h-5 rounded-full bg-teal-500 text-slate-950 flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  ) : status === "active" ? (
                    <div className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xs animate-pulse">
                      ●
                    </div>
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-700 bg-slate-800" />
                  )}
                </div>

                <div className="font-heading font-bold text-xs tracking-tight">
                  {step.title}
                </div>
                <div className="text-[11px] font-sans text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {step.desc}
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Vertical Timeline (SUBMITTED ↓ UNDER REVIEW ↓ ACTION ASSIGNED ↓ RESOLVED) */}
        <div className="sm:hidden space-y-3 pt-2">
          {steps.map((step, idx) => {
            const status = getStepStatus(step.id);

            return (
              <div key={step.id} className="flex gap-3 items-start">
                <div className="flex flex-col items-center">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    status === "completed" ? "bg-teal-500 text-slate-950" :
                    status === "active" ? "bg-amber-400 text-slate-950 animate-pulse" :
                    "bg-slate-800 text-slate-500 border border-slate-700"
                  }`}>
                    {status === "completed" ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
                  </div>
                  {idx < steps.length - 1 && (
                    <div className="w-0.5 h-10 bg-slate-800 my-1" />
                  )}
                </div>

                <div className={`flex-1 p-3 rounded-xl border ${
                  status === "active" ? "bg-amber-500/10 border-amber-500/40" :
                  status === "completed" ? "bg-teal-500/5 border-teal-500/20" :
                  "bg-[#09101e] border-slate-800 opacity-60"
                }`}>
                  <div className="font-heading font-bold text-xs text-slate-200">
                    {step.title}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {step.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Evidence & Action Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Column: Description & Uploaded Evidence */}
        <div className="p-6 rounded-2xl bg-[#121C33] border border-slate-800 shadow-xl space-y-4">
          <h3 className="font-heading text-sm font-bold text-slate-200 flex items-center gap-2">
            <FileText className="w-4 h-4 text-teal-400" />
            <span>Worker Field Description</span>
          </h3>

          <div className="p-4 rounded-xl bg-[#09101e] border border-slate-800 text-slate-300 text-xs sm:text-sm leading-relaxed font-sans">
            {issue.description}
          </div>

          {/* Uploaded Evidence Photo */}
          <div>
            <div className="text-xs font-mono font-bold text-slate-400 mb-2 uppercase tracking-wider">
              Uploaded Photographic Evidence
            </div>
            {issue.evidenceImage ? (
              <div className="rounded-xl overflow-hidden border border-slate-700 bg-black/40 group relative">
                <img
                  src={issue.evidenceImage}
                  alt="Issue photographic evidence"
                  className="w-full h-56 object-cover group-hover:scale-[1.02] transition-transform duration-300"
                />
                <div className="absolute bottom-2 left-2 right-2 px-3 py-1.5 rounded-lg bg-slate-950/80 backdrop-blur-md text-[11px] font-mono text-slate-300 flex items-center justify-between">
                  <span>Photo Attachment #{issue.id}-01</span>
                  <a
                    href={issue.evidenceImage}
                    target="_blank"
                    rel="noreferrer"
                    className="text-teal-300 hover:underline flex items-center gap-1"
                  >
                    <span>Full Resolution</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="p-8 rounded-xl border border-dashed border-slate-800 bg-[#09101e] text-center text-slate-500 text-xs">
                No visual evidence was uploaded for this issue report.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Engineering Action & Resolution Notes */}
        <div className="space-y-4">
          
          {/* Assignment Card */}
          <div className="p-5 rounded-2xl bg-[#121C33] border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-wider">
              <UserCheck className="w-4 h-4 text-teal-400" />
              <span>Supervisor & Engineering Assignment</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#09101e] border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400">Assigned Lead</div>
                <div className="font-bold text-sm text-slate-200 mt-0.5">
                  {issue.assignedTo || "Unassigned • In Triage Queue"}
                </div>
              </div>
              <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Action Taken Card */}
          <div className="p-5 rounded-2xl bg-[#121C33] border border-slate-800 shadow-xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-wider">
              <Wrench className="w-4 h-4 text-cyan-400" />
              <span>Action Taken & Shop-Floor Interventions</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#09101e] border border-slate-800 text-xs text-slate-300 leading-relaxed font-sans min-h-[70px]">
              {issue.actionTaken || "Investigation underway. Maintenance technicians dispatched to inspect physical station telemetry."}
            </div>
          </div>

          {/* Resolution Notes Card */}
          <div className="p-5 rounded-2xl bg-[#121C33] border border-slate-800 shadow-xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Resolution Notes & Verification</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#09101e] border border-slate-800 text-xs text-slate-300 leading-relaxed font-sans min-h-[70px]">
              {issue.resolutionNotes || "Awaiting final quality supervisor inspection sign-off and takt time verification."}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
