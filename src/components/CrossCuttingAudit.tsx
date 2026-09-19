import React from "react";
import { UnitInspectionData } from "../types";
import { ShieldCheck, Lock, Database, FileSpreadsheet, Download, CheckCircle, Terminal } from "lucide-react";

interface CrossCuttingAuditProps {
  units: UnitInspectionData[];
}

export const CrossCuttingAudit: React.FC<CrossCuttingAuditProps> = ({ units }) => {
  const exportAuditLog = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "UnitID,Batch,Station,DefectType,Confidence,Uncertainty,GateDecision,Timestamp\n" +
      units.map(u => `${u.id},${u.batchId},${u.stationId},"${u.defectType}",${u.confidence}%,${u.uncertaintyScore}%,${u.finalDecision},${u.timestamp}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `audit_trail_inspection_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-xl text-slate-100">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-500/30">
              Cross-Cutting Layer
            </span>
            <span className="text-xs font-semibold text-slate-400">
              Security • Data Governance • Monitoring • Audit Trail
            </span>
          </div>
          <h3 className="text-base font-bold text-slate-100 mt-1">
            IATF 16949 / ISO 9001 Quality Audit Trail & Governance Posture
          </h3>
        </div>

        <button
          onClick={exportAuditLog}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-medium border border-slate-700 transition"
        >
          <Download className="w-3.5 h-3.5 text-cyan-400" />
          <span>Export Audit Log (CSV)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4 text-xs font-mono">
        <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800">
          <div className="flex items-center gap-2 text-slate-400 mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-slate-200">Cryptographic Model Hash</span>
          </div>
          <span className="text-slate-400 text-[11px] block truncate">
            sha256:7f3b892a0e41cb8d9e...
          </span>
          <span className="text-[10px] text-emerald-400 mt-1 block">
            Tamper-Evident Weights
          </span>
        </div>

        <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800">
          <div className="flex items-center gap-2 text-slate-400 mb-1">
            <Database className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-slate-200">Data Lineage & Retention</span>
          </div>
          <span className="text-slate-300 text-[11px] block">
            100% Raw Telemetry Persisted
          </span>
          <span className="text-[10px] text-slate-500 mt-1 block">
            10-Year Automotive Retention
          </span>
        </div>

        <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800">
          <div className="flex items-center gap-2 text-slate-400 mb-1">
            <Lock className="w-4 h-4 text-purple-400" />
            <span className="font-bold text-slate-200">RBAC & Human Sign-Off</span>
          </div>
          <span className="text-slate-300 text-[11px] block">
            Dual Operator Authorization
          </span>
          <span className="text-[10px] text-purple-400 mt-1 block">
            Active Session: Inspector #492
          </span>
        </div>
      </div>

      {/* Audit Log Stream */}
      <div className="mt-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5 text-slate-400" />
          <span>Real-Time Immutable Decision Audit Log</span>
        </h4>

        <div className="bg-slate-950 rounded-lg border border-slate-800 p-3 font-mono text-[11px] max-h-52 overflow-y-auto space-y-1.5">
          {units.map((u) => (
            <div key={u.id} className="flex items-center justify-between text-slate-400 border-b border-slate-900 pb-1">
              <div className="flex items-center gap-2">
                <span className="text-slate-500">{u.timestamp}</span>
                <span className="text-slate-200 font-bold">{u.id}</span>
                <span className="text-slate-500">[{u.stationId}]</span>
                <span className={u.finalDecision === "Reject" ? "text-rose-400" : u.finalDecision === "Review" ? "text-amber-400" : "text-emerald-400"}>
                  {u.defectType} ({u.confidence}%)
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-slate-500">Gate: {u.calculatedLane}</span>
                <span className={`px-1.5 py-0.2 rounded font-bold text-[10px] ${
                  u.finalDecision === "Reject" ? "bg-rose-950 text-rose-300" :
                  u.finalDecision === "Review" ? "bg-amber-950 text-amber-300" : "bg-emerald-950 text-emerald-300"
                }`}>
                  {u.finalDecision}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
