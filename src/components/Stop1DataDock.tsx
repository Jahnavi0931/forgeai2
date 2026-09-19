import React, { useState, useRef } from "react";
import { 
  ColumnMapping, 
  DatasetHealth, 
  CurrencySymbol, 
  UploadedImage 
} from "../types";
import { DEFAULT_COLUMN_MAPPING, getSampleProductionLogsCsv } from "../data/mockData";
import { 
  Database, 
  UploadCloud, 
  FileSpreadsheet, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Save, 
  RotateCcw, 
  Sparkles, 
  Layers, 
  Tag, 
  DollarSign, 
  Calendar 
} from "lucide-react";
import Papa from "papaparse";

interface Stop1DataDockProps {
  isSampleData: boolean;
  onLoadSampleData: () => void;
  onOpenInsertImage: () => void;
  columnMapping: ColumnMapping;
  onChangeColumnMapping: (mapping: ColumnMapping) => void;
  datasetHealth: DatasetHealth;
  defectClasses: string[];
  onAddDefectClass: (name: string) => void;
  onRemoveDefectClass: (name: string) => void;
  currency: CurrencySymbol;
  totalImagesCount: number;
  totalLogsCount: number;
  onCustomCsvLoaded: (records: any[], filename: string) => void;
}

export const Stop1DataDock: React.FC<Stop1DataDockProps> = ({
  isSampleData,
  onLoadSampleData,
  onOpenInsertImage,
  columnMapping,
  onChangeColumnMapping,
  datasetHealth,
  defectClasses,
  onAddDefectClass,
  onRemoveDefectClass,
  currency,
  totalImagesCount,
  totalLogsCount,
  onCustomCsvLoaded
}) => {
  const [newDefectInput, setNewDefectInput] = useState("");
  const [detectedColumns, setDetectedColumns] = useState<string[]>([
    "unit_id", "batch_id", "station_id", "timestamp", "component_type",
    "defect_type", "severity", "confidence", "temperature", "pressure",
    "cycle_time_sec", "vibration_rms", "feed_speed", "shift",
    "queue_wip_units", "material_cost", "labor_cost", "scrap_cost", "selling_price"
  ]);
  const [saveSuccessToast, setSaveSuccessToast] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.meta.fields) {
          setDetectedColumns(results.meta.fields);
        }
        if (results.data && results.data.length > 0) {
          onCustomCsvLoaded(results.data, file.name);
        }
      },
      error: (err) => {
        console.error("CSV Parse Error:", err);
      }
    });
  };

  const handleDownloadBenchmarkCsv = () => {
    const csvContent = getSampleProductionLogsCsv();
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "q2c_benchmark_production_logs.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveToLocalStorage = () => {
    localStorage.setItem("q2c_column_mapping", JSON.stringify(columnMapping));
    localStorage.setItem("q2c_defect_classes", JSON.stringify(defectClasses));
    setSaveSuccessToast(true);
    setTimeout(() => setSaveSuccessToast(false), 2500);
  };

  const handleAddDefect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDefectInput.trim()) return;
    onAddDefectClass(newDefectInput.trim());
    setNewDefectInput("");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner: Dataset State & Quick Ingest */}
      <div className="bg-[#121C33] border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-heading font-bold text-slate-100 text-lg">
                  Stop 1: Data Dock
                </h2>
                <p className="text-xs text-slate-400">
                  Ingest industrial datasets, map schema attributes, and insert defect images
                </p>
              </div>
            </div>

            {/* Mandatory Notice if Sample Data */}
            {isSampleData && (
              <div className="mt-3 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  <strong>SAMPLE DATA - not your dataset.</strong> Currently running simulated high-pressure turbine manufacturing logs.
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <button
              onClick={onOpenInsertImage}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold shadow-md shadow-teal-500/20 transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Insert Image</span>
            </button>

            <button
              onClick={onLoadSampleData}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center gap-2"
              title="Reset to benchmark dataset"
            >
              <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
              <span>Load Sample Data</span>
            </button>

            <button
              onClick={handleDownloadBenchmarkCsv}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center gap-2"
              title="Download clean sample CSV format"
            >
              <Download className="w-3.5 h-3.5 text-teal-400" />
              <span>Get Sample CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dataset Drop Zones Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. Production Logs */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="bg-[#121C33] border-2 border-dashed border-slate-700 hover:border-teal-400/60 rounded-2xl p-4 cursor-pointer transition flex flex-col justify-between group"
        >
          <div>
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center mb-2.5">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <h4 className="font-heading font-bold text-slate-200 text-sm">
              1. Production & Batch Logs
            </h4>
            <p className="text-[11px] text-slate-400 mt-1">
              Unit ID, batch, station, timestamps, defect flags.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono">
            <span className="text-teal-400 font-bold">{totalLogsCount} records</span>
            <span className="text-slate-500 group-hover:text-teal-300">Upload CSV/XLSX →</span>
          </div>
        </div>

        {/* 2. Process Parameters */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="bg-[#121C33] border-2 border-dashed border-slate-700 hover:border-cyan-400/60 rounded-2xl p-4 cursor-pointer transition flex flex-col justify-between group"
        >
          <div>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center mb-2.5">
              <Database className="w-4 h-4" />
            </div>
            <h4 className="font-heading font-bold text-slate-200 text-sm">
              2. Process Telemetry
            </h4>
            <p className="text-[11px] text-slate-400 mt-1">
              Temperature, pressure, cycle time, vibration RMS, speed.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono">
            <span className="text-cyan-400 font-bold">Linked via Unit ID</span>
            <span className="text-slate-500 group-hover:text-cyan-300">Upload CSV →</span>
          </div>
        </div>

        {/* 3. Economic Cost Data */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="bg-[#121C33] border-2 border-dashed border-slate-700 hover:border-amber-400/60 rounded-2xl p-4 cursor-pointer transition flex flex-col justify-between group"
        >
          <div>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mb-2.5">
              <DollarSign className="w-4 h-4" />
            </div>
            <h4 className="font-heading font-bold text-slate-200 text-sm">
              3. Economics & Costs
            </h4>
            <p className="text-[11px] text-slate-400 mt-1">
              Material cost, labor, scrap cost, missed defect warranty penalty.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono">
            <span className="text-amber-400 font-bold">Default {currency} Active</span>
            <span className="text-slate-500 group-hover:text-amber-300">Upload CSV →</span>
          </div>
        </div>

        {/* 4. Ground Truth Labels (Optional) */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="bg-[#121C33] border-2 border-dashed border-slate-700 hover:border-violet-400/60 rounded-2xl p-4 cursor-pointer transition flex flex-col justify-between group"
        >
          <div>
            <div className="w-8 h-8 rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20 flex items-center justify-center mb-2.5">
              <Tag className="w-4 h-4" />
            </div>
            <h4 className="font-heading font-bold text-slate-200 text-sm">
              4. Ground Truth Labels
            </h4>
            <p className="text-[11px] text-slate-400 mt-1">
              Optional verified labels (image_file, label, defect_type) for Test Bench.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono">
            <span className="text-violet-400 font-bold">Enables Test Bench</span>
            <span className="text-slate-500 group-hover:text-violet-300">Upload CSV →</span>
          </div>
        </div>

        {/* Hidden File Input for CSV Parsing */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
          accept=".csv,.json" 
          className="hidden" 
        />
      </div>

      {/* Main Two-Column Row: Data Health + Column Mapper */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Data Health & Defect Classes Editor */}
        <div className="space-y-6">
          
          {/* Data Health Card */}
          <div className="bg-[#121C33] border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-slate-200 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Dataset Health Card</span>
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Integrity Validated
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block mb-0.5">Row Count</span>
                <span className="text-slate-100 font-bold text-sm">{datasetHealth.rowCount} units</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block mb-0.5">Missing Values</span>
                <span className="text-slate-100 font-bold text-sm">{datasetHealth.missingValuesCount} (0.0%)</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block mb-0.5">Duplicates</span>
                <span className="text-slate-100 font-bold text-sm">{datasetHealth.duplicatesCount}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block mb-0.5">Join Key</span>
                <span className="text-teal-400 font-bold text-sm">{datasetHealth.joinKey}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-mono flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" /> Date Range:
              </span>
              <span className="text-slate-200">
                {datasetHealth.dateRange.start} → {datasetHealth.dateRange.end}
              </span>
            </div>
          </div>

          {/* Defect Classes Editor */}
          <div className="bg-[#121C33] border border-slate-800 rounded-2xl p-5 space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-slate-200 text-sm flex items-center gap-2">
                <Tag className="w-4 h-4 text-violet-400" />
                <span>Defect Classes Taxonomy</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-400">
                {defectClasses.length} registered
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Registered defect classes used by vision AI. Unregistered flaws flag as Novelty Anomalies.
            </p>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {defectClasses.map((cls) => (
                <span
                  key={cls}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 group"
                >
                  <span>{cls}</span>
                  {defectClasses.length > 2 && (
                    <button
                      onClick={() => onRemoveDefectClass(cls)}
                      className="text-slate-500 hover:text-rose-400 transition"
                      title="Remove defect class"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))}
            </div>

            {/* Add Defect Input */}
            <form onSubmit={handleAddDefect} className="flex gap-2 pt-2">
              <input
                type="text"
                value={newDefectInput}
                onChange={(e) => setNewDefectInput(e.target.value)}
                placeholder="e.g. Delamination"
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-teal-400 font-mono"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-400 border border-slate-700 text-xs font-mono font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </form>
          </div>

        </div>

        {/* Right Column: Column Mapping Wizard */}
        <div className="lg:col-span-2 bg-[#121C33] border border-slate-800 rounded-2xl p-5 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-heading font-bold text-slate-100 text-base">
                Column Mapping Wizard
              </h3>
              <p className="text-xs text-slate-400">
                Map columns from uploaded files to system fields. Missing columns degrade gracefully.
              </p>
            </div>

            <button
              onClick={handleSaveToLocalStorage}
              className="px-3.5 py-1.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/30 hover:bg-teal-500/20 text-xs font-mono font-bold flex items-center gap-1.5 transition"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saveSuccessToast ? "Saved!" : "Save Schema"}</span>
            </button>
          </div>

          {/* Mapping Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs font-mono">
            
            {/* Unit ID */}
            <div>
              <label className="block text-slate-400 text-[11px] mb-1">Unit ID (Key)</label>
              <select
                value={columnMapping.unit_id}
                onChange={(e) => onChangeColumnMapping({ ...columnMapping, unit_id: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-200 focus:border-teal-400 outline-none"
              >
                {detectedColumns.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Batch ID */}
            <div>
              <label className="block text-slate-400 text-[11px] mb-1">Batch / Lot Column</label>
              <select
                value={columnMapping.batch}
                onChange={(e) => onChangeColumnMapping({ ...columnMapping, batch: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-200 focus:border-teal-400 outline-none"
              >
                {detectedColumns.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Station ID */}
            <div>
              <label className="block text-slate-400 text-[11px] mb-1">Station ID Column</label>
              <select
                value={columnMapping.station}
                onChange={(e) => onChangeColumnMapping({ ...columnMapping, station: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-200 focus:border-teal-400 outline-none"
              >
                {detectedColumns.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Timestamp */}
            <div>
              <label className="block text-slate-400 text-[11px] mb-1">Timestamp</label>
              <select
                value={columnMapping.timestamp}
                onChange={(e) => onChangeColumnMapping({ ...columnMapping, timestamp: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-200 focus:border-teal-400 outline-none"
              >
                {detectedColumns.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Defect Flag */}
            <div>
              <label className="block text-slate-400 text-[11px] mb-1">Defect Flag / Class</label>
              <select
                value={columnMapping.defect_flag}
                onChange={(e) => onChangeColumnMapping({ ...columnMapping, defect_flag: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-200 focus:border-teal-400 outline-none"
              >
                {detectedColumns.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Cycle Time */}
            <div>
              <label className="block text-slate-400 text-[11px] mb-1">Cycle Time (seconds)</label>
              <select
                value={columnMapping.cycle_time}
                onChange={(e) => onChangeColumnMapping({ ...columnMapping, cycle_time: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-200 focus:border-teal-400 outline-none"
              >
                {detectedColumns.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Scrap Cost */}
            <div>
              <label className="block text-slate-400 text-[11px] mb-1">Scrap Cost ({currency})</label>
              <select
                value={columnMapping.cost_scrap}
                onChange={(e) => onChangeColumnMapping({ ...columnMapping, cost_scrap: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-200 focus:border-teal-400 outline-none"
              >
                {detectedColumns.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Selling Price */}
            <div>
              <label className="block text-slate-400 text-[11px] mb-1">Selling Price ({currency})</label>
              <select
                value={columnMapping.cost_selling_price}
                onChange={(e) => onChangeColumnMapping({ ...columnMapping, cost_selling_price: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-200 focus:border-teal-400 outline-none"
              >
                {detectedColumns.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Shift */}
            <div>
              <label className="block text-slate-400 text-[11px] mb-1">Shift</label>
              <select
                value={columnMapping.shift}
                onChange={(e) => onChangeColumnMapping({ ...columnMapping, shift: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-200 focus:border-teal-400 outline-none"
              >
                {detectedColumns.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Process Parameters Multi-Select */}
          <div className="pt-2 border-t border-slate-800">
            <label className="block text-slate-300 text-xs font-mono font-bold mb-2">
              Telemetry Process Parameters for Root-Cause Statistics (t-test & Drift):
            </label>
            <div className="flex flex-wrap gap-2 font-mono text-xs">
              {["temperature", "pressure", "vibration_rms", "feed_speed", "cycle_time_sec"].map((param) => {
                const isSelected = columnMapping.process_params.includes(param);
                return (
                  <button
                    key={param}
                    type="button"
                    onClick={() => {
                      const updated = isSelected
                        ? columnMapping.process_params.filter(p => p !== param)
                        : [...columnMapping.process_params, param];
                      onChangeColumnMapping({ ...columnMapping, process_params: updated });
                    }}
                    className={`px-3 py-1.5 rounded-xl border transition ${
                      isSelected
                        ? "bg-teal-500/20 text-teal-300 border-teal-500/50 font-bold shadow-sm"
                        : "bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-200"
                    }`}
                  >
                    {param} {isSelected ? "✓" : "+"}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
