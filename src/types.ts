export type CurrencySymbol = "₹" | "$" | "€" | "£" | "¥";

export type StopId = 
  | "datadock"
  | "see"
  | "decide"
  | "cause"
  | "jam"
  | "money"
  | "fix"
  | "testbench";

export type DefectType = 
  | "Surface Crack"
  | "Solder Void"
  | "Burr / Edge Defect"
  | "Foreign Particulate"
  | "Dimensional Warp"
  | "Pore & Pinhole"
  | "Thermal Burn"
  | "Pass (Defect-Free)"
  | string;

export type DatasetMode = "sample_turbine" | "user_custom" | "mendeley_des";

export interface MendeleyDatasetMeta {
  title: string;
  doi: string;
  mendeleyUrl: string;
  authors: string[];
  institution: string;
  simulationEngine: string;
  version: string;
  publishedDate: string;
  license: string;
  description: string;
}

export interface StressTestResult {
  runId: string;
  timestamp: string;
  samplesTested: number;
  hits: number;
  misses: number;
  falseAlarms: number;
  accuracy: number;
  recall: number;
  precision: number;
  robustnessScore: number;
  scenarioName?: string;
  lightingVariationPct?: number;
  contrastShiftPct?: number;
  gaussianNoiseSigma?: number;
  blurRadiusPx?: number;
  degradedAccuracyPct?: number;
  vulnerabilityFlag?: boolean;
}

export type SeverityLevel = "None" | "Minor" | "Major" | "Critical";

export type DecisionLane = "Accept" | "Reject" | "Review";

export interface BoundingBox {
  x: number; // percent 0-100
  y: number; // percent 0-100
  width: number; // percent 0-100
  height: number; // percent 0-100
  regionName: string;
  label?: string;
}

export interface ImageBox {
  label: string;
  box_2d: [number, number, number, number]; // [ymin, xmin, ymax, xmax] 0-1000
}

export interface ProcessTelemetry {
  temperature: number;
  tempBaseline: number;
  pressure: number;
  pressureBaseline: number;
  cycleTime: number;
  cycleTimeBaseline: number;
  vibrationRms: number;
  vibrationBaseline: number;
  feedSpeed: number;
  feedSpeedBaseline: number;
  shift?: "Shift A" | "Shift B" | "Shift C" | string;
  productVariant?: string;
  queueWaitTimeMin?: number;
  setupTimeMin?: number;
  jobType?: string;
  resourceContentionPct?: number;
}

export interface EconomicData {
  sellingPrice: number;
  materialCost: number;
  laborCost: number;
  energyCost?: number;
  scrapCost: number;
  reworkCost: number;
  downtimeCostPerHour?: number;
  missedDefectWarrantyCost: number; // C_md
  falseAlarmCost: number;           // C_fr
  humanReviewCost?: number;         // C_review
}

export interface UnitInspectionData {
  id: string;
  batchId: string;
  stationId: string;
  timestamp: string;
  componentType: string;
  defectType: DefectType;
  severity: SeverityLevel;
  confidence: number; // Model-reported confidence 0 - 100
  calibratedConfidence?: number;
  uncertaintyScore: number; // 0 - 100
  isAnomalyNovelty: boolean; // Out of distribution / rare flaw
  boundingBox: BoundingBox;
  boxes?: ImageBox[];
  visualCues?: string[];
  processData: ProcessTelemetry;
  economics: EconomicData;
  calculatedLane: DecisionLane;
  finalDecision: DecisionLane;
  reviewerNotes?: string;
  reviewerName?: string;
  reviewedAt?: string;
  similarPastDefectsCount: number;
  imageUrl?: string;
  surfacePatternType?: "circuit_board" | "machined_metal" | "semiconductor_wafer" | "turbine_blade";
  trueLabel?: "Good" | "Defective" | string;
}

export interface UploadedImage {
  id: string;
  dataUrl: string;
  filename: string;
  unitId: string;
  batch: string;
  station: string;
  productVariant: string;
  trueLabel?: "Good" | "Defective" | "";
  verdict?: "Acceptable" | "Defective" | "Uncertain";
  defectType?: string;
  matchesKnownClass?: boolean;
  severity?: number;
  confidence?: number;
  boxes?: ImageBox[];
  visualCues?: string[];
  analyzed?: boolean;
  analyzing?: boolean;
  error?: string;
}

export interface ColumnMapping {
  unit_id: string;
  image_file: string;
  timestamp: string;
  batch: string;
  station: string;
  product_variant: string;
  shift: string;
  cycle_time: string;
  downtime: string;
  queue_wip: string;
  defect_flag: string;
  process_params: string[];
  cost_material: string;
  cost_labour: string;
  cost_energy: string;
  cost_scrap: string;
  cost_rework: string;
  cost_selling_price: string;
}

export interface DatasetHealth {
  rowCount: number;
  missingValuesCount: number;
  duplicatesCount: number;
  dateRange: { start: string; end: string };
  joinKey: string;
  isSampleData: boolean;
}

export interface StationData {
  id: string;
  name: string;
  nominalCycleTimeSec: number;
  actualCycleTimeSec: number;
  wipQueueCount: number;
  utilizationRate: number; // %
  downtimeMinutesToday: number;
  defectRate: number; // %
  isBottleneck: boolean;
  driftStatus: "normal" | "warning" | "critical";
  changeoversCount?: number;
}

export interface DriftCell {
  batchId: string;
  stationId: string;
  defectRate: number;
  sampleCount: number;
  driftAlert: boolean; // PSI > 0.2
  primaryDefect: DefectType;
  driftZScore: number;
  psiValue?: number;
}

export interface ShapFactor {
  feature: string;
  impact: string;
  direction: "risk_increase" | "risk_decrease" | "neutral";
}

export interface ReviewerCorrection {
  id: string;
  unitId: string;
  originalDefect: string;
  correctedDefect: string;
  finalVerdict: "Accept" | "Reject";
  timestamp: string;
  note?: string;
}

export interface DecisionCutoffConfig {
  costMissedDefect: number; // C_md
  costFalseReject: number;  // C_fr
  costReview: number;       // C_review
  optimalCutoff: number;    // t* = C_fr / (C_fr + C_md)
  currentCutoff: number;    // default 0.50
}

export interface WhatIfScenarioState {
  defectRateReductionPct: number;    // 0 - 50%
  bottleneckCapacityPct: number;     // 0 - 50%
  changeoverReductionPct: number;    // 0 - 50%
  fixTopRootCause: boolean;          // boolean
  cutoffShift: number;               // 0.1 - 0.9
}

export interface QualityImpactScore {
  score: number; // 0 - 100, higher is worse
  band: "Healthy" | "Watch" | "Critical";
  weightedDefectRate: number; // 30%
  weightedCostImpact: number; // 30%
  weightedThroughputLoss: number; // 20%
  weightedUncertainty: number; // 10%
  weightedDefectTrend: number; // 10%
}

export interface RecommendationCard {
  id: string;
  title: string;
  category: string;
  action: string;
  expectedImpact: string;
  evidenceNumbers: string;
  confidence: string;
}

export interface RunConfig {
  seed: number;
  currency: CurrencySymbol;
  costs: {
    cmd: number;
    cfr: number;
    creview: number;
  };
  cutoff: number;
  whatIf: WhatIfScenarioState;
  modelName: string;
  timestamp: string;
}
