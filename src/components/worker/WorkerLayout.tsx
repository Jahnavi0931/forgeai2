import React from "react";
import { 
  Home, 
  AlertTriangle, 
  ClipboardList, 
  Bell, 
  User, 
  HardHat, 
  ArrowLeftRight,
  Radio,
  Sun,
  Moon
} from "lucide-react";
import { WorkerNavPage, WorkerProfile, WorkerNotification, UserRole } from "../../types";

interface WorkerLayoutProps {
  activeTab: WorkerNavPage;
  onSelectTab: (tab: WorkerNavPage) => void;
  profile: WorkerProfile;
  notifications: WorkerNotification[];
  onSwitchRole: (role: UserRole) => void;
  theme: "dark" | "light";
  onToggleTheme: () => void;
  children: React.ReactNode;
}

export const WorkerLayout: React.FC<WorkerLayoutProps> = ({
  activeTab,
  onSelectTab,
  profile,
  notifications,
  onSwitchRole,
  theme,
  onToggleTheme,
  children
}) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems: { id: WorkerNavPage; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: "home", label: "Worker Home", icon: Home },
    { id: "report", label: "Report Issue", icon: AlertTriangle },
    { id: "my-issues", label: "My Issues", icon: ClipboardList },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-100 flex flex-col font-sans pb-24 md:pb-8">
      {/* Top Shop-Floor Worker Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/90 bg-[#0A1020]/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          
          {/* Brand & Worker Identifier */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 p-0.5 shadow-lg shadow-amber-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-[#0A1020] rounded-[10px] flex items-center justify-center">
                <HardHat className="w-5 h-5 text-amber-400" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-slate-100 text-base sm:text-lg tracking-tight">
                  ForgeAI <span className="text-amber-400 font-semibold text-xs px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 ml-1">Shop Floor</span>
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                <span className="text-slate-200 font-semibold">{profile.name}</span>
                <span>•</span>
                <span className="text-teal-400">{profile.workerId}</span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline text-slate-400">{profile.station}</span>
              </div>
            </div>
          </div>

          {/* Right Controls & Role Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Station Pulse */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>{profile.station.split(" - ")[0]} Online</span>
            </div>

            {/* Shift Badge */}
            <div className="hidden lg:block px-2.5 py-1 rounded-lg bg-slate-800/70 border border-slate-700 text-slate-300 text-xs font-mono">
              {profile.shift}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl bg-[#121C33] border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition"
              title="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-400" />}
            </button>

            {/* Switch Role Button */}
            <button
              onClick={() => onSwitchRole("manager")}
              className="px-3 py-1.5 rounded-xl bg-[#121C33] border border-slate-700 hover:border-teal-500/50 text-slate-200 hover:text-teal-300 transition flex items-center gap-1.5 text-xs font-semibold"
              title="Switch to Management & Quality Officer Dashboard"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden sm:inline">Manager Mode</span>
              <span className="sm:hidden">Manager</span>
            </button>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <div className="hidden md:block border-t border-slate-800/60 bg-[#0c1427]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center gap-1 overflow-x-auto py-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const isReport = item.id === "report";

              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 relative ${
                    isActive
                      ? isReport
                        ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20"
                        : "bg-teal-500/20 text-teal-300 border border-teal-500/30"
                      : isReport
                      ? "bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive && isReport ? "text-slate-950" : ""}`} />
                  <span>{item.label}</span>
                  {item.id === "notifications" && unreadCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content View */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-5">
        {children}
      </main>

      {/* Mobile Fixed Bottom Navigation Bar (Shop-Floor Optimized Touch Targets) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0A1020]/95 backdrop-blur-lg border-t border-slate-800 px-3 py-2">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isReport = item.id === "report";

            if (isReport) {
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className="flex flex-col items-center justify-center -mt-5 relative"
                >
                  <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 p-0.5 shadow-lg shadow-amber-500/40 flex items-center justify-center">
                    <div className="w-full h-full rounded-full bg-gradient-to-b from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 font-bold">
                      <AlertTriangle className="w-6 h-6 text-slate-950" />
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-amber-400 mt-0.5">Report</span>
                </button>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg relative min-h-[44px] ${
                  isActive ? "text-teal-400 font-bold" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {item.id === "notifications" && unreadCount > 0 && (
                    <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] mt-1 font-sans">{item.label.replace("Worker ", "")}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
