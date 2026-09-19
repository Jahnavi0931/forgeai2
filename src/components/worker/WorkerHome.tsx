import React from "react";
import { 
  AlertTriangle, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Flame, 
  Activity, 
  ChevronRight,
  ShieldAlert,
  Bell,
  HardHat,
  Eye
} from "lucide-react";
import { WorkerProfile, WorkerIssue, WorkerNavPage } from "../../types";

interface WorkerHomeProps {
  profile: WorkerProfile;
  issues: WorkerIssue[];
  onNavigate: (tab: WorkerNavPage) => void;
  onSelectIssue: (issue: WorkerIssue) => void;
}

export const WorkerHome: React.FC<WorkerHomeProps> = ({
  profile,
  issues,
  onNavigate,
  onSelectIssue
}) => {
  // Compute metric counters
  const openIssues = issues.filter(i => i.status === "Submitted" || i.status === "Under Review" || i.status === "Action Assigned");
  const highPriorityIssues = issues.filter(i => (i.priority === "High" || i.priority === "Critical") && i.status !== "Resolved");
  const resolvedIssues = issues.filter(i => i.status === "Resolved");

  const recentReports = issues.slice(0, 4);

  return (
    <div className="space-y-6">
      
      {/* Worker Greeting & Station Status Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-[#121C33] to-[#0d162a] border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 p-0.5 shadow-md flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-[#0A1020] rounded-[14px] flex items-center justify-center">
                <span className="font-heading font-extrabold text-amber-400 text-lg">
                  {profile.avatarInitials}
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-100">
                  Welcome back, {profile.name}
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {profile.role} • <span className="text-teal-400 font-mono font-medium">{profile.workerId}</span>
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono">
                  {profile.department}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-mono">
                  Station: {profile.station}
                </span>
              </div>
            </div>
          </div>

          {/* Current Production Status Banner */}
          <div className="p-3.5 rounded-xl bg-[#09101e] border border-slate-800 flex flex-col gap-1.5 md:min-w-[260px]">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Production Status</span>
              <span className="flex items-center gap-1 text-emerald-400 font-mono font-bold text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                ACTIVE
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400 shrink-0" />
              <div className="text-xs text-slate-200">
                <span className="font-bold text-slate-100 font-mono">195</span> units/hr 
                <span className="text-slate-500 text-[11px] ml-1">(Target: 240)</span>
              </div>
            </div>
            <div className="text-[11px] text-amber-400/90 font-mono flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{profile.shift} • Pacing Lag at S03</span>
            </div>
          </div>
        </div>
      </div>

      {/* PRIMARY ACTION: REPORT AN ISSUE (Shop Floor Super Button) */}
      <button
        onClick={() => onNavigate("report")}
        className="w-full group p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:via-orange-400 hover:to-amber-500 text-slate-950 font-heading font-extrabold text-lg sm:text-xl shadow-xl shadow-amber-500/20 hover:shadow-amber-500/30 transition-all duration-200 flex items-center justify-between gap-4 border-2 border-amber-300/40"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-950/20 backdrop-blur-md flex items-center justify-center text-slate-950 shrink-0">
            <AlertTriangle className="w-7 h-7 stroke-[2.5]" />
          </div>
          <div className="text-left">
            <div className="tracking-tight flex items-center gap-2">
              <span>REPORT AN ISSUE</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-950/20 text-slate-950 font-bold uppercase">
                Shop Floor Priority
              </span>
            </div>
            <p className="text-xs sm:text-sm font-sans font-medium text-slate-900/80 mt-0.5">
              Spot a defect, equipment anomaly, safety hazard, or process bottleneck
            </p>
          </div>
        </div>

        <div className="w-10 h-10 rounded-xl bg-slate-950/15 flex items-center justify-center shrink-0 group-hover:translate-x-1 transition-transform">
          <ArrowRight className="w-5 h-5 stroke-[2.5]" />
        </div>
      </button>

      {/* Quick Status KPI Cards */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        
        {/* Open Issues */}
        <button
          onClick={() => onNavigate("my-issues")}
          className="p-4 rounded-xl bg-[#121C33] border border-slate-800 hover:border-teal-500/50 text-left transition group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Open Issues</span>
            <div className="w-7 h-7 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="font-heading text-2xl sm:text-3xl font-extrabold text-teal-300">
            {openIssues.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 group-hover:text-teal-400 transition">
            <span>In queue</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </button>

        {/* High Priority Issues */}
        <button
          onClick={() => onNavigate("my-issues")}
          className="p-4 rounded-xl bg-[#121C33] border border-slate-800 hover:border-rose-500/50 text-left transition group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">High Priority</span>
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <Flame className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="font-heading text-2xl sm:text-3xl font-extrabold text-rose-400">
            {highPriorityIssues.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 group-hover:text-rose-400 transition">
            <span>Urgent attention</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </button>

        {/* Resolved Issues */}
        <button
          onClick={() => onNavigate("my-issues")}
          className="p-4 rounded-xl bg-[#121C33] border border-slate-800 hover:border-emerald-500/50 text-left transition group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Resolved</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="font-heading text-2xl sm:text-3xl font-extrabold text-emerald-400">
            {resolvedIssues.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 group-hover:text-emerald-400 transition">
            <span>Actioned</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </button>

      </div>

      {/* Recent Reports Section */}
      <div className="p-5 rounded-2xl bg-[#121C33] border border-slate-800 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="font-heading text-base font-bold text-slate-100">
              Recent Shop-Floor Reports
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-xs font-mono">
              Last {recentReports.length} items
            </span>
          </div>

          <button
            onClick={() => onNavigate("my-issues")}
            className="text-xs text-teal-400 hover:text-teal-300 font-medium flex items-center gap-1 transition"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {recentReports.map((issue) => {
            const statusBadge = 
              issue.status === "Resolved" 
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" 
                : issue.status === "Action Assigned" 
                ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30" 
                : issue.status === "Under Review" 
                ? "bg-amber-500/10 text-amber-400 border-amber-500/30" 
                : "bg-slate-800 text-slate-300 border-slate-700";

            const priorityBadge = 
              issue.priority === "Critical" 
                ? "text-rose-400 bg-rose-500/10 border-rose-500/30" 
                : issue.priority === "High" 
                ? "text-amber-400 bg-amber-500/10 border-amber-500/30" 
                : "text-slate-400 bg-slate-800/80 border-slate-700";

            return (
              <div
                key={issue.id}
                onClick={() => onSelectIssue(issue)}
                className="p-3.5 rounded-xl bg-[#0b1324] border border-slate-800 hover:border-teal-500/40 hover:bg-[#0e172d] transition cursor-pointer flex items-center justify-between gap-3 group"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-teal-300">
                      {issue.id}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-800 border border-slate-700 text-slate-300">
                      {issue.station}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono border text-slate-300 border-slate-700">
                      {issue.category}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${priorityBadge}`}>
                      {issue.priority}
                    </span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-semibold text-slate-200 truncate group-hover:text-teal-200 transition">
                    {issue.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                    {issue.description}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-medium border ${statusBadge}`}>
                    {issue.status}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-slate-800/60 text-slate-400 group-hover:text-teal-300 group-hover:bg-teal-500/10 flex items-center justify-center transition">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
