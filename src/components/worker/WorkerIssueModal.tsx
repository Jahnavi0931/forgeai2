import React from "react";
import { 
  X, 
  Clock, 
  Check, 
  UserCheck, 
  Wrench, 
  CheckCircle2, 
  AlertTriangle,
  ExternalLink,
  ShieldAlert
} from "lucide-react";
import { WorkerIssue } from "../../types";

interface WorkerIssueModalProps {
  issue: WorkerIssue | null;
  onClose: () => void;
}

export const WorkerIssueModal: React.FC<WorkerIssueModalProps> = ({
  issue,
  onClose
}) => {
  if (!issue) return null;

  const steps = [
    { id: "Submitted", title: "SUBMITTED", desc: `Reported by ${issue.submittedBy}` },
    { id: "Under Review", title: "UNDER REVIEW", desc: issue.assignedTo || "In triage" },
    { id: "Action Assigned", title: "ACTION ASSIGNED", desc: issue.actionTaken || "Work order pending" },
    { id: "Resolved", title: "RESOLVED", desc: issue.resolutionNotes || "Sign-off pending" },
  ];

  const getStepStatus = (stepId: string) => {
    const order = ["Submitted", "Under Review", "Action Assigned", "Resolved"];
    const currentIndex = order.indexOf(issue.status);
    const stepIndex = order.indexOf(stepId);

    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "active";
    return "upcoming";
  };

  const priorityColor = 
    issue.priority === "Critical" ? "text-rose-400 bg-rose-500/10 border-rose-500/30" :
    issue.priority === "High" ? "text-amber-400 bg-amber-500/10 border-amber-500/30" :
    "text-slate-400 bg-slate-800/80 border-slate-700";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-3xl max-h-[90vh] bg-[#121C33] border border-slate-700 rounded-2xl shadow-2xl overflow-y-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-[#121C33]/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-extrabold text-teal-300 bg-teal-500/10 border border-teal-500/30 px-2.5 py-1 rounded-lg">
              {issue.id}
            </span>
            <span className="px-2 py-0.5 rounded text-xs font-mono font-semibold bg-slate-800 border border-slate-700 text-slate-200">
              Station {issue.station}
            </span>
            <span className={`px-2 py-0.5 rounded text-xs font-mono font-semibold border ${priorityColor}`}>
              {issue.priority} Priority
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          <div>
            <h3 className="font-heading text-lg font-bold text-slate-100">
              {issue.title}
            </h3>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Reported by {issue.submittedBy} ({issue.workerId}) on {issue.date} {issue.batchId ? `• ${issue.batchId}` : ""}
            </p>
          </div>

          {/* Status Timeline */}
          <div className="p-4 rounded-xl bg-[#09101e] border border-slate-800 space-y-3">
            <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-teal-400" />
              <span>Status Timeline (Shop Floor to Resolution)</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {steps.map((step) => {
                const status = getStepStatus(step.id);
                return (
                  <div
                    key={step.id}
                    className={`p-2.5 rounded-lg border text-xs ${
                      status === "completed"
                        ? "bg-teal-500/10 border-teal-500/30 text-teal-300"
                        : status === "active"
                        ? "bg-amber-500/15 border-amber-500/50 text-amber-300 font-bold"
                        : "bg-slate-900/40 border-slate-800 text-slate-500"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[10px] font-bold">{step.title}</span>
                      {status === "completed" && <Check className="w-3 h-3 text-teal-400 stroke-[3]" />}
                      {status === "active" && <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />}
                    </div>
                    <div className="text-[10px] text-slate-400 line-clamp-1">{step.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Description & Evidence */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                Worker Field Description
              </div>
              <div className="p-3.5 rounded-xl bg-[#09101e] border border-slate-800 text-xs text-slate-300 leading-relaxed min-h-[100px]">
                {issue.description}
              </div>

              <div className="p-3.5 rounded-xl bg-[#09101e] border border-slate-800 space-y-1">
                <div className="text-[11px] font-mono text-slate-500">Assigned Lead:</div>
                <div className="text-xs font-bold text-slate-200">{issue.assignedTo || "In queue"}</div>
              </div>
            </div>

            <div>
              <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
                Photographic Evidence
              </div>
              {issue.evidenceImage ? (
                <div className="rounded-xl overflow-hidden border border-slate-700 bg-black/40">
                  <img
                    src={issue.evidenceImage}
                    alt="Defect evidence"
                    className="w-full h-44 object-cover"
                  />
                </div>
              ) : (
                <div className="p-8 rounded-xl border border-dashed border-slate-800 bg-[#09101e] text-center text-slate-500 text-xs">
                  No photo attached
                </div>
              )}
            </div>
          </div>

          {/* Action Taken & Resolution */}
          <div className="p-4 rounded-xl bg-[#09101e] border border-slate-800 space-y-3">
            <div>
              <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5" />
                <span>Action Taken</span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                {issue.actionTaken || "Investigation pending by maintenance engineering."}
              </p>
            </div>

            {issue.resolutionNotes && (
              <div className="pt-2 border-t border-slate-800">
                <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Resolution Notes</span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  {issue.resolutionNotes}
                </p>
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-end bg-[#121C33]">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
