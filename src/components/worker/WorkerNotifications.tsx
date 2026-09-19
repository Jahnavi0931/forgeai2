import React from "react";
import { 
  Bell, 
  CheckCheck, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Wrench, 
  AlertTriangle,
  Info,
  ChevronRight
} from "lucide-react";
import { WorkerNotification, WorkerIssue } from "../../types";

interface WorkerNotificationsProps {
  notifications: WorkerNotification[];
  issues: WorkerIssue[];
  onSelectIssue: (issue: WorkerIssue) => void;
  onMarkAllAsRead: () => void;
  onMarkAsRead: (id: string) => void;
}

export const WorkerNotifications: React.FC<WorkerNotificationsProps> = ({
  notifications,
  issues,
  onSelectIssue,
  onMarkAllAsRead,
  onMarkAsRead
}) => {
  const handleNotificationClick = (notif: WorkerNotification) => {
    onMarkAsRead(notif.id);
    const relatedIssue = issues.find(i => i.id === notif.issueId);
    if (relatedIssue) {
      onSelectIssue(relatedIssue);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-[#121C33] border border-slate-800">
        <div>
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Bell className="w-6 h-6 text-teal-400" />
            <span>Worker Notifications</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time updates regarding your reported issues, supervisor review, and physical work orders.
          </p>
        </div>

        <button
          onClick={onMarkAllAsRead}
          className="self-start sm:self-center px-3.5 py-2 rounded-xl bg-[#0b1324] border border-slate-700 hover:border-teal-500/50 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition"
        >
          <CheckCheck className="w-4 h-4 text-teal-400" />
          <span>Mark all as read</span>
        </button>
      </div>

      {/* Notifications List */}
      <div className="rounded-2xl bg-[#121C33] border border-slate-800 shadow-xl divide-y divide-slate-800/80 overflow-hidden">
        {notifications.map((notif) => {
          const icon = 
            notif.type === "resolved" ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> :
            notif.type === "action" ? <Wrench className="w-5 h-5 text-cyan-400" /> :
            notif.type === "review" ? <Clock className="w-5 h-5 text-amber-400" /> :
            <Info className="w-5 h-5 text-teal-400" />;

          return (
            <div
              key={notif.id}
              onClick={() => handleNotificationClick(notif)}
              className={`p-4 sm:p-5 transition cursor-pointer flex items-start gap-3.5 sm:gap-4 hover:bg-[#0e1830] group ${
                !notif.read ? "bg-teal-500/[0.04]" : ""
              }`}
            >
              <div className="p-2.5 rounded-xl bg-[#09101e] border border-slate-800 shrink-0">
                {icon}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-bold text-xs sm:text-sm text-slate-200 group-hover:text-teal-200 transition">
                      {notif.title}
                    </span>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                    )}
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 shrink-0">
                    {notif.timestamp}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {notif.message}
                </p>

                <div className="mt-2 flex items-center gap-2 text-[11px] font-mono text-teal-400">
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-teal-300 font-bold">
                    {notif.issueId}
                  </span>
                  <span className="group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    <span>View Issue Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {notifications.length === 0 && (
          <div className="p-12 text-center text-slate-500 text-xs">
            No notifications right now. All alerts are cleared!
          </div>
        )}
      </div>

    </div>
  );
};
