/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  UnitInspectionData, 
  CurrencySymbol, 
  QualityImpactScore, 
  DecisionCutoffConfig, 
  WhatIfScenarioState, 
  ReviewerCorrection, 
  RecommendationCard, 
  StationData, 
  DriftCell, 
  RunConfig, 
  UploadedImage,
  StopId,
  ColumnMapping,
  DatasetHealth
} from "./types";
import { 
  INITIAL_UNITS, 
  STATIONS_DATA, 
  DRIFT_MATRIX_DATA, 
  KNOWN_DEFECT_CLASSES,
  DEFAULT_ECONOMICS,
  DEFAULT_COLUMN_MAPPING
} from "./data/mockData";
import { calculateQIS } from "./utils/stats";

// Layout & Components
import { Header } from "./components/Header";
import { ConveyorRibbon } from "./components/ConveyorRibbon";
import { ReplayControls } from "./components/ReplayControls";
import { FooterStatusBar } from "./components/FooterStatusBar";
import { EvidenceCardDrawer } from "./components/EvidenceCardDrawer";
import { InsertImageModal } from "./components/InsertImageModal";
import { QISModal } from "./components/QISModal";

// 8 Stops Components
import { Stop1DataDock } from "./components/Stop1DataDock";
import { Stop2See } from "./components/Stop2See";
import { Stop3Decide } from "./components/Stop3Decide";
import { Stop4Cause } from "./components/Stop4Cause";
import { Stop5Jam } from "./components/Stop5Jam";
import { Stop6Money } from "./components/Stop6Money";
import { Stop7Fix } from "./components/Stop7Fix";
import { Stop8TestBench } from "./components/Stop8TestBench";

function formatSimTime(minutesFromShiftStart: number): string {
  const startHour = 8; // 08:00 AM shift
  const totalMinutes = startHour * 60 + minutesFromShiftStart;
  const hours = Math.floor(totalMinutes / 60) % 24;
  const mins = totalMinutes % 60;
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  const paddedMins = mins < 10 ? `0${mins}` : mins;
  return `${displayHours}:${paddedMins} ${ampm}`;
}

export default function App() {
  // Navigation: Active Stop along Conveyor Ribbon
  const [currentStop, setCurrentStop] = useState<StopId>("datadock");

  // Global Datasets & Data State
  const [isSampleData, setIsSampleData] = useState<boolean>(true);
  const [units, setUnits] = useState<UnitInspectionData[]>(INITIAL_UNITS);
  const [selectedUnitId, setSelectedUnitId] = useState<string>("A1042");
  const [currency, setCurrency] = useState<CurrencySymbol>("₹");
  const [stations, setStations] = useState<StationData[]>(STATIONS_DATA);
  const [driftMatrix, setDriftMatrix] = useState<DriftCell[]>(DRIFT_MATRIX_DATA);
  const [defectClasses, setDefectClasses] = useState<string[]>(KNOWN_DEFECT_CLASSES);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>(DEFAULT_COLUMN_MAPPING);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const [datasetHealth] = useState<DatasetHealth>({
    rowCount: INITIAL_UNITS.length * 52,
    missingValuesCount: 0,
    duplicatesCount: 0,
    dateRange: { start: "Today 08:00", end: "Today 16:30" },
    joinKey: "unit_id",
    isSampleData: true
  });

  // Modals & Drawers
  const [isInsertModalOpen, setIsInsertModalOpen] = useState<boolean>(false);
  const [evidenceDrawerUnit, setEvidenceDrawerUnit] = useState<UnitInspectionData | null>(null);
  const [isQisModalOpen, setIsQisModalOpen] = useState<boolean>(false);

  // Replay Clock Simulation State
  const [isPlayingReplay, setIsPlayingReplay] = useState<boolean>(false);
  const [replaySpeed, setReplaySpeed] = useState<number>(1);
  const [currentSimMinutes, setCurrentSimMinutes] = useState<number>(162); // ~10:42 AM

  // Idea 1 & 2: Decision Cutoff Configuration
  const [cutoffConfig, setCutoffConfig] = useState<DecisionCutoffConfig>({
    costMissedDefect: 12000,
    costFalseReject: 4200,
    costReview: 350,
    optimalCutoff: 4200 / (4200 + 12000), // ~0.259
    currentCutoff: 0.35
  });

  // Idea 5: What-If Scenario State
  const [whatIfState, setWhatIfState] = useState<WhatIfScenarioState>({
    defectRateReductionPct: 20,
    bottleneckCapacityPct: 15,
    changeoverReductionPct: 25,
    fixTopRootCause: true,
    cutoffShift: 0.35
  });

  // Reviewer Feedback Engine (Few-shot calibrated prompts)
  const [reviewerCorrections, setReviewerCorrections] = useState<ReviewerCorrection[]>([
    {
      id: "corr-init-1",
      unitId: "A1044",
      originalDefect: "Surface Pinhole",
      correctedDefect: "Pass (Defect-Free)",
      finalVerdict: "Accept",
      timestamp: "09:45 AM",
      note: "Specular reflection artifact mistaken for pinhole pore by vision edge filter"
    }
  ]);

  // AI Advice & Action Directives
  const [recommendations, setRecommendations] = useState<RecommendationCard[]>([
    {
      id: "rec-1",
      title: "Station S03 Thermal Manifold Calibration",
      action: "Inspect and flush cooling circuit 3B flow valve to eliminate the +8.0°C thermal excursion during the 18.5s finish machining pass.",
      expectedImpact: "Projected 40% reduction in micro-fractures; yields ₹84,000/day net margin recovery.",
      evidenceNumbers: "Welch t=3.82 (p < 0.001, Cohen's d=0.88), PSI=0.24 on Batch B26.",
      category: "Thermal Process Control",
      confidence: "High (Validated χ²)"
    },
    {
      id: "rec-2",
      title: "De-bottleneck Station S03 Pacing",
      action: "Shift pre-buffing toolpath from S03 to Station S02, trimming S03 cycle time from 18.5s down to 14.0s.",
      expectedImpact: "Expands line throughput from 194.6 to 240 units/hr; +₹65,000/hr unrealized output.",
      evidenceNumbers: "Actual cycle 18.5s vs nominal 12.0s; S03 WIP queue buffers 11 units.",
      category: "Takt Time Balance",
      confidence: "Verified Constraint"
    },
    {
      id: "rec-3",
      title: "Lower Operational Cutoff to Cost-Optimal t* = 0.26",
      action: "Shift automated reject threshold from 0.50 down to 0.26 to account for the 2.85x cost asymmetry of warranty escapes (₹12,000) vs scrap (₹4,200).",
      expectedImpact: "Saves ₹36,200 per batch in escaped defect liability.",
      evidenceNumbers: "Bayes risk formula t* = 4200 / (4200 + 12000) = 0.259.",
      category: "Decision Policy",
      confidence: "Mathematical Optimal"
    }
  ]);

  // Analysis status
  const [isAnalyzingAll, setIsAnalyzingAll] = useState(false);
  const [analyzeProgress, setAnalyzeProgress] = useState({ current: 0, total: units.length });
  const [isGeneratingAdvice, setIsGeneratingAdvice] = useState(false);
  const [runSeed, setRunSeed] = useState<number>(4920);

  // Selected Unit
  const selectedUnit = units.find((u) => u.id === selectedUnitId) || units[0];

  // Dynamic Money Meter calculation
  const rejectedCount = units.filter((u) => u.finalDecision === "Reject").length;
  const reviewCount = units.filter((u) => u.finalDecision === "Review").length;
  const scrapLoss = rejectedCount * cutoffConfig.costFalseReject * 0.45;
  const reworkCost = reviewCount * cutoffConfig.costReview;
  const potentialSavings = Math.max(0, 18500 * (whatIfState.defectRateReductionPct / 100));

  // Dynamic QIS calculation
  const qis: QualityImpactScore = calculateQIS(
    (rejectedCount / Math.max(1, units.length)) * 100,
    scrapLoss + reworkCost,
    18.5 - 12.0, // bottleneck delay
    (reviewCount / Math.max(1, units.length)) * 100,
    4.2 // trend rate
  );

  // Replay Clock Tick
  useEffect(() => {
    if (!isPlayingReplay) return;

    const interval = setInterval(() => {
      setCurrentSimMinutes((prev) => {
        const next = (prev + 1) % 510;
        // Cycle selected unit periodically
        if (next % 6 === 0) {
          setUnits((currentUnits) => {
            const curIdx = currentUnits.findIndex((u) => u.id === selectedUnitId);
            const nextIdx = (curIdx + 1) % currentUnits.length;
            setSelectedUnitId(currentUnits[nextIdx].id);
            return currentUnits;
          });
        }
        return next;
      });
    }, 1000 / replaySpeed);

    return () => clearInterval(interval);
  }, [isPlayingReplay, replaySpeed, selectedUnitId]);

  // Data Loading Handlers
  const handleLoadSampleData = () => {
    setUnits(INITIAL_UNITS);
    setStations(STATIONS_DATA);
    setDriftMatrix(DRIFT_MATRIX_DATA);
    setIsSampleData(true);
    setSelectedUnitId("A1042");
  };

  const handleCustomCsvLoaded = (records: any[], filename: string) => {
    setIsSampleData(false);
    if (records.length > 0) {
      console.log(`Loaded ${records.length} records from ${filename}`);
    }
  };

  // Add uploaded images from modal
  const handleAddImages = (uploaded: UploadedImage[]) => {
    const newUnits: UnitInspectionData[] = uploaded.map((img, idx) => ({
      id: `IMG-${Date.now()}-${idx + 1}`,
      imageUrl: img.dataUrl,
      componentType: "Turbine Rotor Blade",
      defectType: (img.defectType as any) || "Pass (Defect-Free)",
      severity: "Major",
      confidence: img.confidence || 88.5,
      uncertaintyScore: 11.5,
      isAnomalyNovelty: img.verdict === "Uncertain",
      finalDecision: (img.confidence || 88.5) > 75 ? "Reject" : "Review",
      calculatedLane: (img.confidence || 88.5) > 75 ? "Reject" : "Review",
      batchId: img.batch || "Batch B29",
      stationId: img.station || "S03",
      timestamp: new Date().toLocaleTimeString(),
      boundingBox: {
        x: 45,
        y: 35,
        width: 25,
        height: 25,
        regionName: "Upper Flange"
      },
      visualCues: [
        "Localized surface luminance gradient deviation",
        "Edge discontinuity along stress boundary"
      ],
      processData: {
        temperature: 154.2,
        tempBaseline: 150.0,
        pressure: 4.95,
        pressureBaseline: 4.80,
        cycleTime: 18.2,
        cycleTimeBaseline: 14.0,
        vibrationRms: 0.88,
        vibrationBaseline: 0.80,
        feedSpeed: 215,
        feedSpeedBaseline: 220
      },
      economics: DEFAULT_ECONOMICS,
      similarPastDefectsCount: 0
    }));

    setUnits((prev) => [...newUnits, ...prev]);
    setSelectedUnitId(newUnits[0].id);
    setCurrentStop("see"); // Jump to Stop 2: See
  };

  // Single unit inference via Gemini API
  const handleAnalyzeUnit = async (unitId: string) => {
    const target = units.find((u) => u.id === unitId);
    if (!target) return;

    try {
      const resp = await fetch("/api/analyze-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: target.imageUrl || "",
          knownClasses: defectClasses,
          fewShotCorrections: reviewerCorrections
        })
      });

      if (resp.ok) {
        const result = await resp.json();
        setUnits((prev) =>
          prev.map((u) => {
            if (u.id === unitId) {
              const p = (result.confidence || 85) / 100;
              const isReject = p >= cutoffConfig.currentCutoff;
              return {
                ...u,
                defectType: result.defectType || u.defectType,
                severity: result.severity || u.severity,
                confidence: result.confidence || u.confidence,
                uncertaintyScore: result.uncertaintyScore || 10,
                finalDecision: result.isAnomalyNovelty ? "Review" : isReject ? "Reject" : "Accept",
                visualCues: result.visualCues || u.visualCues,
                boxes: result.boxes,
                isAnomalyNovelty: result.isAnomalyNovelty
              };
            }
            return u;
          })
        );
      }
    } catch (err) {
      console.warn("API inference fallback:", err);
    }
  };

  // Batch analyze all units with concurrency
  const handleAnalyzeAll = async () => {
    setIsAnalyzingAll(true);
    setAnalyzeProgress({ current: 0, total: units.length });

    for (let i = 0; i < units.length; i++) {
      await handleAnalyzeUnit(units[i].id);
      setAnalyzeProgress({ current: i + 1, total: units.length });
    }

    setIsAnalyzingAll(false);
  };

  // Decision update in review loop
  const handleUpdateDecision = (unitId: string, lane: "Accept" | "Reject" | "Review") => {
    setUnits((prev) =>
      prev.map((u) => (u.id === unitId ? { ...u, finalDecision: lane } : u))
    );
  };

  // Regenerate advice via Gemini
  const handleRegenerateAdvice = async () => {
    setIsGeneratingAdvice(true);
    try {
      const resp = await fetch("/api/generate-advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          evidenceNumbers: {
            welchTStat: 3.82,
            welchPValue: 0.0004,
            cohensD: 0.88,
            chiSquare: 18.4,
            bottleneckCycle: 18.5,
            nominalCycle: 12.0,
            hourlyThroughputLoss: 45.4,
            optimalCutoff: cutoffConfig.costFalseReject / (cutoffConfig.costFalseReject + cutoffConfig.costMissedDefect),
            qisScore: qis.score
          }
        })
      });

      if (resp.ok) {
        const data = await resp.json();
        if (data.recommendations && Array.isArray(data.recommendations)) {
          setRecommendations(data.recommendations);
        }
      }
    } catch (err) {
      console.warn("Advice generation fallback:", err);
    } finally {
      setIsGeneratingAdvice(false);
    }
  };

  // Report Export (HTML file download)
  const handleDownloadReport = () => {
    const reportHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Quality-to-Cash Executive Run Report</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0A1020; color: #E2E8F0; padding: 40px; margin: 0; }
          .card { background: #121C33; border: 1px solid #334155; border-radius: 12px; padding: 24px; margin-bottom: 24px; }
          h1 { color: #2DD4BF; margin-top: 0; }
          h2 { color: #60A5FA; border-bottom: 1px solid #1E293B; padding-bottom: 8px; }
          table { width: 100%; border-collapse: collapse; margin-top: 12px; font-family: monospace; font-size: 13px; }
          th, td { padding: 10px; border-bottom: 1px solid #1E293B; text-align: left; }
          th { color: #94A3B8; }
          .advisory { color: #F59E0B; font-weight: bold; font-size: 12px; margin-top: 30px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>Quality-to-Cash Control Room — Run Audit</h1>
          <p>Tagline: From defect to decision to dollars • NEURAX Hackathon 3.0</p>
          <p>Timestamp: ${new Date().toLocaleString()} • Run Seed: #${runSeed} • Units Evaluated: ${units.length}</p>
        </div>

        <div class="card">
          <h2>1. Executive Summary & Financial Exposure</h2>
          <p>Current Plant Quality Impact Score (QIS): <strong>${qis.score.toFixed(1)} (${qis.band})</strong></p>
          <p>Total Estimated Quality Loss Today: <strong>${currency}${Math.round(scrapLoss + reworkCost).toLocaleString()}</strong></p>
          <p>Actionable Policy Savings Identified: <strong>${currency}${Math.round(potentialSavings).toLocaleString()}</strong></p>
        </div>

        <div class="card">
          <h2>2. Statistical Root-Cause Verification (Stop 4)</h2>
          <p>• Station S03 Thermal Excursion: Welch t = 3.82, p &lt; 0.001, Cohen's d = 0.88 (Large effect size)</p>
          <p>• Station-Batch Association: Chi-Square χ² = 18.4 (df=5, p=0.002, Cramer's V=0.34)</p>
          <p>• Primary Constraint: Station S03 Cycle Time = 18.5s (Limits line throughput to 194.6 units/hr)</p>
        </div>

        <div class="card">
          <h2>3. Actionable Directives (Stop 7)</h2>
          ${recommendations.map(r => `
            <div style="margin-bottom: 16px; padding: 12px; background: #172341; border-radius: 8px;">
              <strong style="color: #2DD4BF;">${r.title}</strong> [${r.category}]
              <p style="margin: 6px 0; font-size: 13px;">${r.action}</p>
              <p style="margin: 4px 0; color: #10B981; font-size: 12px;"><strong>Impact:</strong> ${r.expectedImpact}</p>
              <p style="margin: 4px 0; color: #94A3B8; font-size: 11px;">Evidence: ${r.evidenceNumbers}</p>
            </div>
          `).join("")}
        </div>

        <div class="advisory">
          Simulated - Advisory only - No machine control
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([reportHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `quality-to-cash-audit-run-${runSeed}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export JSON Run Config
  const handleExportRunConfig = () => {
    const config: RunConfig = {
      seed: runSeed,
      currency,
      costs: {
        cmd: cutoffConfig.costMissedDefect,
        cfr: cutoffConfig.costFalseReject,
        creview: cutoffConfig.costReview
      },
      cutoff: cutoffConfig.currentCutoff,
      whatIf: whatIfState,
      modelName: "Gemini 2.5 Flash",
      timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `q2c-run-config-${runSeed}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON Run Config
  const handleImportRunConfig = (cfg: any) => {
    if (cfg.cutoffConfig) setCutoffConfig(cfg.cutoffConfig);
    if (cfg.whatIf) setWhatIfState(cfg.whatIf);
    if (cfg.currency) setCurrency(cfg.currency);
    if (cfg.seed) setRunSeed(cfg.seed);
  };

  return (
    <div className="min-h-screen bg-[#0A1020] text-slate-100 flex flex-col font-sans selection:bg-teal-500/30 selection:text-teal-200">
      
      {/* 1. Header with Money Meter, Currency Selector & QIS */}
      <Header
        isSampleData={isSampleData}
        currency={currency}
        onChangeCurrency={setCurrency}
        onOpenInsertImage={() => setIsInsertModalOpen(true)}
        isReplaying={isPlayingReplay}
        onToggleReplay={() => setIsPlayingReplay(!isPlayingReplay)}
        replaySpeed={replaySpeed}
        onChangeReplaySpeed={setReplaySpeed}
        onStepNext={() => {
          setCurrentSimMinutes((prev) => (prev + 5) % 510);
          setUnits((currentUnits) => {
            const curIdx = currentUnits.findIndex((u) => u.id === selectedUnitId);
            const nextIdx = (curIdx + 1) % currentUnits.length;
            setSelectedUnitId(currentUnits[nextIdx].id);
            return currentUnits;
          });
        }}
        currentReplayTime={formatSimTime(currentSimMinutes)}
        profitAtRisk={scrapLoss + reworkCost}
        qis={qis}
        theme={theme}
        onToggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")}
        onOpenQisModal={() => setIsQisModalOpen(true)}
      />

      {/* 2. 8-Stop Conveyor Navigation Ribbon */}
      <ConveyorRibbon
        activeStop={currentStop}
        onSelectStop={setCurrentStop}
      />

      {/* 3. Replay Clock Bar */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 pt-3">
        <ReplayControls
          isPlaying={isPlayingReplay}
          onTogglePlay={() => setIsPlayingReplay(!isPlayingReplay)}
          speed={replaySpeed}
          onChangeSpeed={setReplaySpeed}
          currentSimMinutes={currentSimMinutes}
          onSeek={setCurrentSimMinutes}
        />
      </div>

      {/* 4. Active Stop Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {currentStop === "datadock" && (
          <Stop1DataDock
            isSampleData={isSampleData}
            onLoadSampleData={handleLoadSampleData}
            onOpenInsertImage={() => setIsInsertModalOpen(true)}
            columnMapping={columnMapping}
            onChangeColumnMapping={setColumnMapping}
            datasetHealth={datasetHealth}
            defectClasses={defectClasses}
            onAddDefectClass={(name) => setDefectClasses([...defectClasses, name])}
            onRemoveDefectClass={(name) => setDefectClasses(defectClasses.filter(c => c !== name))}
            currency={currency}
            totalImagesCount={units.length}
            totalLogsCount={units.length * 48}
            onCustomCsvLoaded={handleCustomCsvLoaded}
          />
        )}

        {currentStop === "see" && (
          <Stop2See
            units={units}
            selectedUnit={selectedUnit}
            onSelectUnit={(u) => setSelectedUnitId(u.id)}
            onOpenEvidenceDrawer={(u) => setEvidenceDrawerUnit(u)}
            reviewerCorrections={reviewerCorrections}
            knownClasses={defectClasses}
            onAnalyzeUnit={handleAnalyzeUnit}
            onAnalyzeAll={handleAnalyzeAll}
            isAnalyzingAll={isAnalyzingAll}
            analyzeProgress={analyzeProgress}
            currency={currency}
            onOpenInsertModal={() => setIsInsertModalOpen(true)}
          />
        )}

        {currentStop === "decide" && (
          <Stop3Decide
            units={units}
            currency={currency}
            cutoffConfig={cutoffConfig}
            onChangeCutoffConfig={setCutoffConfig}
            onUpdateDecision={handleUpdateDecision}
            reviewerCorrections={reviewerCorrections}
            onAddReviewCorrection={(corr) => setReviewerCorrections((prev) => [...prev, corr])}
            onClearReviewCorrections={() => setReviewerCorrections([])}
            onOpenEvidenceDrawer={(u) => setEvidenceDrawerUnit(u)}
          />
        )}

        {currentStop === "cause" && (
          <Stop4Cause
            units={units}
            driftMatrix={driftMatrix}
            currency={currency}
            onFilterByBatchStation={(batch, station) => {
              const matched = units.find((u) => u.batchId === batch && u.stationId === station);
              if (matched) setSelectedUnitId(matched.id);
            }}
          />
        )}

        {currentStop === "jam" && (
          <Stop5Jam
            stations={stations}
            currency={currency}
          />
        )}

        {currentStop === "money" && (
          <Stop6Money
            currency={currency}
            whatIfState={whatIfState}
            onChangeWhatIf={setWhatIfState}
            qis={qis}
            stations={stations}
            onOpenQisModal={() => setIsQisModalOpen(true)}
          />
        )}

        {currentStop === "fix" && (
          <Stop7Fix
            recommendations={recommendations}
            onRegenerateAdvice={handleRegenerateAdvice}
            isGenerating={isGeneratingAdvice}
            currency={currency}
            onDownloadReport={handleDownloadReport}
            runSeed={runSeed}
          />
        )}

        {currentStop === "testbench" && (
          <Stop8TestBench
            units={units}
            selectedUnit={selectedUnit}
            currency={currency}
            runSeed={runSeed}
            onChangeSeed={setRunSeed}
            cutoffConfig={cutoffConfig}
            onExportRunConfig={handleExportRunConfig}
            onImportRunConfig={handleImportRunConfig}
          />
        )}
      </main>

      {/* 5. Persistent Status Bar & Mandatory Legal Chip */}
      <FooterStatusBar
        runSeed={runSeed}
        onRandomizeSeed={() => setRunSeed(Math.floor(1000 + Math.random() * 9000))}
        isSampleData={isSampleData}
        totalUnitsCount={units.length}
        currentReplayTime={formatSimTime(currentSimMinutes)}
      />

      {/* Modals & Drawers */}
      <InsertImageModal
        isOpen={isInsertModalOpen}
        onClose={() => setIsInsertModalOpen(false)}
        onImagesAdded={handleAddImages}
        knownClasses={defectClasses}
      />

      <EvidenceCardDrawer
        isOpen={evidenceDrawerUnit !== null}
        onClose={() => setEvidenceDrawerUnit(null)}
        unit={evidenceDrawerUnit}
        currency={currency}
        onUpdateDecision={handleUpdateDecision}
        onSelectUnit={(id) => {
          setSelectedUnitId(id);
          const found = units.find(u => u.id === id);
          if (found) setEvidenceDrawerUnit(found);
        }}
        allUnits={units}
      />

      <QISModal
        isOpen={isQisModalOpen}
        onClose={() => setIsQisModalOpen(false)}
        qis={qis}
        currency={currency}
      />

    </div>
  );
}
