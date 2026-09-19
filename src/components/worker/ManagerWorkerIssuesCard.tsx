import React from "react";
import { 
  HardHat, 
  AlertTriangle, 
  Flame, 
  Clock, 
  ChevronRight, 
  ExternalLink,
  ArrowRight
} from "lucide-react";
import { WorkerIssue } from "../../types";

interface ManagerWorkerIssuesCardProps {
  issues: WorkerIssue[];
  onSelectIssue: (issue: WorkerIssue) => void;
  onSwitchToWorker: () => void;
}

export const ManagerWorkerIssuesCard: React.FC<ManagerWorkerIssuesCardProps> = ({
  issues,
  onSelectIssue,
  onSwitchToWorker
}) => {
  const openCount = issues.filter(i => i.status !== "Resolved").length;
  const highCount = issues.filter(i => i.priority === "High" && i.status !== "Resolved").length;
  const criticalCount = issues.filter(i => i.priority === "Critical" && i.status !== "Resolved").length;

  const recentIssues = issues.slice(0, 3);

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[#121C33] border border-slate-800 shadow-xl space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
            <HardHat className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading text-sm font-bold text-slate-100 flex items-center gap-2">
              <span>Shop-Floor Worker Reports</span>
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            </h3>
            <p className="text-[11px] text-slate-400">
              Live feedback loop from machine operators to quality management
            </p>
          </div>
        </div>

        <button
          onClick={onSwitchToWorker}
          className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 transition"
          title="Switch to Worker Interface view"
        >
          <span>Worker View</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* KPI Counters as requested:
          Open: 8
          High Priority: 3
          Critical: 1
      */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="p-2.5 rounded-xl bg-[#09101e] border border-slate-800 text-center">
          <div className="text-[10px] text-slate-400 font-mono uppercase">Open</div>
          <div className="font-heading text-xl font-bold text-teal-300 mt-0.5">{openCount}</div>
        </div>
        <div className="p-2.5 rounded-xl bg-[#09101e] border border-slate-800 text-center">
          <div className="text-[10px] text-slate-400 font-mono uppercase">High Priority</div>
          <div className="font-heading text-xl font-bold text-amber-400 mt-0.5">{highCount}</div>
        </div>
        <div className="p-2.5 rounded-xl bg-[#09101e] border border-slate-800 text-center">
          <div className="text-[10px] text-slate-400 font-mono uppercase">Critical</div>
          <div className="font-heading text-xl font-bold text-rose-400 mt-0.5">{criticalCount}</div>
        </div>
      </div>

      {/* Recent Issues List */}
      <div className="space-y-2">
        <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
          Recent Shop-Floor Submissions
        </div>

        {recentIssues.map((issue) => {
          const priorityBadge = 
            issue.priority === "Critical" ? "text-rose-400 bg-rose-500/10 border-rose-500/30" :
            issue.priority === "High" ? "text-amber-400 bg-amber-500/10 border-amber-500/30" :
            "text-slate-400 bg-slate-800 border-slate-700";

          return (
            <div
              key={issue.id}
              onClick={() => onSelectIssue(issue)}
              className="p-2.5 rounded-xl bg-[#0b1324] border border-slate-800 hover:border-teal-500/40 hover:bg-[#0e172d] transition cursor-pointer flex items-center justify-between gap-3 group"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-mono text-xs font-bold text-teal-300">
                    {issue.id}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                    {issue.station}
                  </span>
                  <span className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded border ${priorityBadge}`}>
                    {issue.priority}
                  </span>
                </div>
                <div className="text-xs font-medium text-slate-200 truncate group-hover:text-teal-200">
                  {issue.title}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
                  {issue.status}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-teal-400 transition" />
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
