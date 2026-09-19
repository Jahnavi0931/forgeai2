import React, { useState } from "react";
import { 
  ClipboardList, 
  Search, 
  Filter, 
  ChevronRight, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Flame, 
  PlusCircle,
  Eye,
  Calendar
} from "lucide-react";
import { WorkerIssue, WorkerNavPage } from "../../types";

interface WorkerMyIssuesProps {
  issues: WorkerIssue[];
  onSelectIssue: (issue: WorkerIssue) => void;
  onNavigateToReport: () => void;
}

export const WorkerMyIssues: React.FC<WorkerMyIssuesProps> = ({
  issues,
  onSelectIssue,
  onNavigateToReport
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch = 
      issue.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.station.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (issue.batchId && issue.batchId.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === "all" || issue.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || issue.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-[#121C33] border border-slate-800">
        <div>
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-teal-400" />
            <span>My Submitted Issues</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Track real-time investigation status, engineering work orders, and resolution notes from supervisors.
          </p>
        </div>

        <button
          onClick={onNavigateToReport}
          className="self-start sm:self-center px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report New Issue</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-xl bg-[#121C33] border border-slate-800 space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Issue ID (ISS-1042), keyword, station (S03), or batch..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0b1324] border border-slate-800 text-slate-100 text-xs placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 transition"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs text-slate-500 font-mono shrink-0 hidden sm:inline">Status:</span>
            {["all", "Submitted", "Under Review", "Action Assigned", "Resolved"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono shrink-0 transition ${
                  statusFilter === st
                    ? "bg-teal-500/20 text-teal-300 border border-teal-500/40 font-bold"
                    : "bg-[#0b1324] text-slate-400 border border-slate-800 hover:text-slate-200"
                }`}
              >
                {st === "all" ? "All Statuses" : st}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Issues Table / List */}
      <div className="rounded-2xl bg-[#121C33] border border-slate-800 shadow-xl overflow-hidden">
        
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800/80 bg-[#0c1527] text-[11px] font-mono uppercase tracking-wider text-slate-400">
                <th className="py-3.5 px-4">Issue ID</th>
                <th className="py-3.5 px-4">Date / Time</th>
                <th className="py-3.5 px-4">Station</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Summary</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredIssues.map((issue) => {
                const statusColor = 
                  issue.status === "Resolved" ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" :
                  issue.status === "Action Assigned" ? "text-cyan-400 bg-cyan-500/10 border-cyan-500/30" :
                  issue.status === "Under Review" ? "text-amber-400 bg-amber-500/10 border-amber-500/30" :
                  "text-slate-300 bg-slate-800 border-slate-700";

                const priorityColor = 
                  issue.priority === "Critical" ? "text-rose-400 bg-rose-500/10 border-rose-500/30 font-bold" :
                  issue.priority === "High" ? "text-amber-400 bg-amber-500/10 border-amber-500/30 font-bold" :
                  "text-slate-400 bg-slate-800/60 border-slate-700";

                return (
                  <tr
                    key={issue.id}
                    onClick={() => onSelectIssue(issue)}
                    className="hover:bg-[#0d172e] transition cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-teal-300">
                      {issue.id}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">
                      {issue.date}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded font-mono font-semibold bg-slate-800 border border-slate-700 text-slate-300">
                        {issue.station}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-medium">
                      {issue.category}
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-semibold text-slate-200 group-hover:text-teal-200 truncate">
                        {issue.title}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {issue.description}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded font-mono text-[11px] border ${priorityColor}`}>
                        {issue.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full font-mono text-[11px] border ${statusColor}`}>
                        {issue.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1 text-xs text-teal-400 group-hover:translate-x-0.5 transition-transform">
                        <span>Details</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile & Tablet Card List View */}
        <div className="lg:hidden divide-y divide-slate-800/60">
          {filteredIssues.map((issue) => {
            const statusColor = 
              issue.status === "Resolved" ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" :
              issue.status === "Action Assigned" ? "text-cyan-400 bg-cyan-500/10 border-cyan-500/30" :
              issue.status === "Under Review" ? "text-amber-400 bg-amber-500/10 border-amber-500/30" :
              "text-slate-300 bg-slate-800 border-slate-700";

            const priorityColor = 
              issue.priority === "Critical" ? "text-rose-400 bg-rose-500/10 border-rose-500/30" :
              issue.priority === "High" ? "text-amber-400 bg-amber-500/10 border-amber-500/30" :
              "text-slate-400 bg-slate-800/60 border-slate-700";

            return (
              <div
                key={issue.id}
                onClick={() => onSelectIssue(issue)}
                className="p-4 hover:bg-[#0d172e] transition cursor-pointer space-y-2.5 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-teal-300">
                      {issue.id}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-800 border border-slate-700 text-slate-300">
                      {issue.station}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${priorityColor}`}>
                      {issue.priority}
                    </span>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono border ${statusColor}`}>
                    {issue.status}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-slate-200 group-hover:text-teal-200 transition">
                    {issue.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">
                    {issue.description}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-1">
                  <span>{issue.date}</span>
                  <div className="flex items-center gap-1 text-teal-400">
                    <span>View Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredIssues.length === 0 && (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-500 mx-auto flex items-center justify-center">
              <ClipboardList className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-300">No issues found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No reported issues matched your filter criteria. Try clearing search filters or report a new shop-floor issue.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setCategoryFilter("all");
              }}
              className="text-xs text-teal-400 hover:underline pt-2 inline-block"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>

    </div>
  );
};
