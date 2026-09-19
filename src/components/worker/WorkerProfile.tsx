import React from "react";
import { 
  User, 
  HardHat, 
  Building, 
  Clock, 
  Shield, 
  ArrowLeftRight, 
  CheckCircle2, 
  MapPin,
  Briefcase,
  Layers,
  Award
} from "lucide-react";
import { WorkerProfile as IWorkerProfile, UserRole } from "../../types";

interface WorkerProfileProps {
  profile: IWorkerProfile;
  onSwitchRole: (role: UserRole) => void;
}

export const WorkerProfile: React.FC<WorkerProfileProps> = ({
  profile,
  onSwitchRole
}) => {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* Profile Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#121C33] border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 relative z-10 text-center sm:text-left">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 p-1 shadow-lg shadow-amber-500/20 flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-[#0A1020] rounded-[14px] flex items-center justify-center">
              <span className="font-heading font-extrabold text-amber-400 text-2xl">
                {profile.avatarInitials}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="font-heading text-2xl font-bold text-slate-100">
                {profile.name}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono text-xs font-semibold">
                Shop-Floor Worker
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Worker ID: <span className="text-teal-300 font-bold">{profile.workerId}</span>
            </p>
            <p className="text-xs text-slate-300 font-medium">
              {profile.role}
            </p>
          </div>
        </div>

        {/* Profile Attributes Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-6 border-t border-slate-800/80">
          
          <div className="p-3.5 rounded-xl bg-[#09101e] border border-slate-800 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center shrink-0">
              <Building className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-mono uppercase">Department</div>
              <div className="text-xs font-semibold text-slate-200 mt-0.5">{profile.department}</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#09101e] border border-slate-800 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-mono uppercase">Assigned Station</div>
              <div className="text-xs font-semibold text-slate-200 mt-0.5">{profile.station}</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#09101e] border border-slate-800 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-mono uppercase">Current Shift</div>
              <div className="text-xs font-semibold text-slate-200 mt-0.5">{profile.shift}</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#09101e] border border-slate-800 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-mono uppercase">System Role</div>
              <div className="text-xs font-semibold text-slate-200 mt-0.5">Shop-Floor Operator / Inspector</div>
            </div>
          </div>

        </div>

        {/* Role Switcher Action */}
        <div className="mt-8 p-4 rounded-xl bg-[#0b1426] border border-teal-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-teal-400" />
              <span>Switch to Management Interface</span>
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Access the complete Quality-to-Cash Control Room, AI vision inspector, drift maps, and cost analytics.
            </p>
          </div>

          <button
            onClick={() => onSwitchRole("manager")}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-teal-500/20 transition flex items-center justify-center gap-2 shrink-0"
          >
            <ArrowLeftRight className="w-4 h-4" />
            <span>Switch to Manager</span>
          </button>
        </div>

      </div>

    </div>
  );
};
