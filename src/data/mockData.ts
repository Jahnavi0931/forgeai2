import { 
  UnitInspectionData, 
  StationData, 
  DriftCell, 
  EconomicData, 
  StressTestResult, 
  MendeleyDatasetMeta 
} from "../types";

export const DEFAULT_ECONOMICS: EconomicData = {
  sellingPrice: 145.0,
  materialCost: 38.0,
  laborCost: 16.5,
  scrapCost: 45.0,
  reworkCost: 14.0,
  missedDefectWarrantyCost: 480.0,
  falseAlarmCost: 45.0
};

export const KNOWN_DEFECT_CLASSES = [
  "Pass (Defect-Free)",
  "Surface Crack",
  "Porosity / Void",
  "Machining Burr",
  "Pinhole Leak",
  "Weld Inclusion",
  "Scratch / Gouge"
];

export const INITIAL_UNITS: UnitInspectionData[] = [
  {
    id: "A1042",
    batchId: "Batch B27",
    stationId: "S03",
    timestamp: "10:42:18",
    componentType: "High-Pressure Turbine Rotor Seal",
    defectType: "Surface Crack",
    severity: "Critical",
    confidence: 94.2,
    uncertaintyScore: 5.8,
    isAnomalyNovelty: false,
    boundingBox: {
      x: 62,
      y: 18,
      width: 24,
      height: 22,
      regionName: "Upper-Right Quadrant (Flange Rib)"
    },
    processData: {
      temperature: 184.2,
      tempBaseline: 170.5, // +8.0%
      pressure: 4.85,
      pressureBaseline: 4.60, // +5.4%
      cycleTime: 14.8,
      cycleTimeBaseline: 13.2, // +12.1%
      vibrationRms: 2.14,
      vibrationBaseline: 1.80,
      feedSpeed: 110,
      feedSpeedBaseline: 120
    },
    economics: DEFAULT_ECONOMICS,
    calculatedLane: "Reject",
    finalDecision: "Reject",
    similarPastDefectsCount: 14,
    surfacePatternType: "machined_metal"
  },
  {
    id: "A1043",
    batchId: "Batch B27",
    stationId: "S02",
    timestamp: "10:42:35",
    componentType: "Multilayer Power Controller PCB",
    defectType: "Solder Void",
    severity: "Minor",
    confidence: 68.4,
    uncertaintyScore: 31.6,
    isAnomalyNovelty: false,
    boundingBox: {
      x: 34,
      y: 45,
      width: 18,
      height: 16,
      regionName: "BGA Substrate Ball Grid 4"
    },
    processData: {
      temperature: 218.0,
      tempBaseline: 215.0,
      pressure: 3.2,
      pressureBaseline: 3.2,
      cycleTime: 13.4,
      cycleTimeBaseline: 13.2,
      vibrationRms: 1.82,
      vibrationBaseline: 1.80,
      feedSpeed: 120,
      feedSpeedBaseline: 120
    },
    economics: DEFAULT_ECONOMICS,
    calculatedLane: "Review",
    finalDecision: "Review",
    similarPastDefectsCount: 6,
    surfacePatternType: "circuit_board"
  },
  {
    id: "A1044",
    batchId: "Batch B27",
    stationId: "S01",
    timestamp: "10:42:51",
    componentType: "Aircraft Grade Titanium Bracket",
    defectType: "Pass (Defect-Free)",
    severity: "None",
    confidence: 99.4,
    uncertaintyScore: 0.6,
    isAnomalyNovelty: false,
    boundingBox: {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      regionName: "Full Geometry Passed"
    },
    processData: {
      temperature: 171.0,
      tempBaseline: 170.5,
      pressure: 4.62,
      pressureBaseline: 4.60,
      cycleTime: 13.1,
      cycleTimeBaseline: 13.2,
      vibrationRms: 1.78,
      vibrationBaseline: 1.80,
      feedSpeed: 121,
      feedSpeedBaseline: 120
    },
    economics: DEFAULT_ECONOMICS,
    calculatedLane: "Accept",
    finalDecision: "Accept",
    similarPastDefectsCount: 0,
    surfacePatternType: "machined_metal"
  },
  {
    id: "A1045",
    batchId: "Batch B27",
    stationId: "S02",
    timestamp: "10:43:08",
    componentType: "Precision Stamped Copper Heat Spreader",
    defectType: "Burr / Edge Defect",
    severity: "Major",
    confidence: 91.8,
    uncertaintyScore: 8.2,
    isAnomalyNovelty: false,
    boundingBox: {
      x: 78,
      y: 65,
      width: 16,
      height: 25,
      regionName: "Perimeter Shear Edge B"
    },
    processData: {
      temperature: 174.5,
      tempBaseline: 170.5,
      pressure: 5.10,
      pressureBaseline: 4.60,
      cycleTime: 13.9,
      cycleTimeBaseline: 13.2,
      vibrationRms: 2.45,
      vibrationBaseline: 1.80,
      feedSpeed: 114,
      feedSpeedBaseline: 120
    },
    economics: DEFAULT_ECONOMICS,
    calculatedLane: "Reject",
    finalDecision: "Reject",
    similarPastDefectsCount: 11,
    surfacePatternType: "machined_metal"
  },
  {
    id: "A1046",
    batchId: "Batch B27",
    stationId: "S05",
    timestamp: "10:43:24",
    componentType: "Optical Silicon Sensor Die",
    defectType: "Foreign Particulate",
    severity: "Major",
    confidence: 62.1,
    uncertaintyScore: 37.9,
    isAnomalyNovelty: true, // Out of distribution / unknown rare flaw!
    boundingBox: {
      x: 42,
      y: 28,
      width: 14,
      height: 14,
      regionName: "Active Micro-Lens Array Aperture"
    },
    processData: {
      temperature: 172.0,
      tempBaseline: 170.5,
      pressure: 4.58,
      pressureBaseline: 4.60,
      cycleTime: 13.0,
      cycleTimeBaseline: 13.2,
      vibrationRms: 1.79,
      vibrationBaseline: 1.80,
      feedSpeed: 122,
      feedSpeedBaseline: 120
    },
    economics: DEFAULT_ECONOMICS,
    calculatedLane: "Review",
    finalDecision: "Review",
    similarPastDefectsCount: 2,
    surfacePatternType: "semiconductor_wafer"
  },
  {
    id: "A1047",
    batchId: "Batch B27",
    stationId: "S04",
    timestamp: "10:43:40",
    componentType: "Automotive Transmission Planetary Carrier",
    defectType: "Pass (Defect-Free)",
    severity: "None",
    confidence: 98.7,
    uncertaintyScore: 1.3,
    isAnomalyNovelty: false,
    boundingBox: {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      regionName: "Pass"
    },
    processData: {
      temperature: 169.8,
      tempBaseline: 170.5,
      pressure: 4.61,
      pressureBaseline: 4.60,
      cycleTime: 13.2,
      cycleTimeBaseline: 13.2,
      vibrationRms: 1.77,
      vibrationBaseline: 1.80,
      feedSpeed: 120,
      feedSpeedBaseline: 120
    },
    economics: DEFAULT_ECONOMICS,
    calculatedLane: "Accept",
    finalDecision: "Accept",
    similarPastDefectsCount: 0,
    surfacePatternType: "machined_metal"
  },
  {
    id: "A1048",
    batchId: "Batch B27",
    stationId: "S03",
    timestamp: "10:43:56",
    componentType: "Ceramic Thermal Barrier Tile",
    defectType: "Dimensional Warp",
    severity: "Critical",
    confidence: 89.5,
    uncertaintyScore: 10.5,
    isAnomalyNovelty: false,
    boundingBox: {
      x: 20,
      y: 50,
      width: 55,
      height: 35,
      regionName: "Planar Curvature Zone C"
    },
    processData: {
      temperature: 186.0,
      tempBaseline: 170.5, // +9.1%
      pressure: 4.95,
      pressureBaseline: 4.60,
      cycleTime: 15.2,
      cycleTimeBaseline: 13.2, // +15.1%
      vibrationRms: 2.22,
      vibrationBaseline: 1.80,
      feedSpeed: 108,
      feedSpeedBaseline: 120
    },
    economics: DEFAULT_ECONOMICS,
    calculatedLane: "Reject",
    finalDecision: "Reject",
    similarPastDefectsCount: 9,
    surfacePatternType: "machined_metal"
  },
  {
    id: "A1049",
    batchId: "Batch B27",
    stationId: "S01",
    timestamp: "10:44:12",
    componentType: "Multilayer Power Controller PCB",
    defectType: "Pass (Defect-Free)",
    severity: "None",
    confidence: 99.1,
    uncertaintyScore: 0.9,
    isAnomalyNovelty: false,
    boundingBox: {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      regionName: "Pass"
    },
    processData: {
      temperature: 170.2,
      tempBaseline: 170.5,
      pressure: 4.60,
      pressureBaseline: 4.60,
      cycleTime: 13.1,
      cycleTimeBaseline: 13.2,
      vibrationRms: 1.81,
      vibrationBaseline: 1.80,
      feedSpeed: 120,
      feedSpeedBaseline: 120
    },
    economics: DEFAULT_ECONOMICS,
    calculatedLane: "Accept",
    finalDecision: "Accept",
    similarPastDefectsCount: 0,
    surfacePatternType: "circuit_board"
  },
  {
    id: "A1050",
    batchId: "Batch B27",
    stationId: "S03",
    timestamp: "10:44:28",
    componentType: "High-Pressure Turbine Rotor Seal",
    defectType: "Pore & Pinhole",
    severity: "Minor",
    confidence: 71.3,
    uncertaintyScore: 28.7,
    isAnomalyNovelty: false,
    boundingBox: {
      x: 52,
      y: 38,
      width: 15,
      height: 15,
      regionName: "Center Web Porosity Cluster"
    },
    processData: {
      temperature: 178.4,
      tempBaseline: 170.5,
      pressure: 4.75,
      pressureBaseline: 4.60,
      cycleTime: 14.1,
      cycleTimeBaseline: 13.2,
      vibrationRms: 1.95,
      vibrationBaseline: 1.80,
      feedSpeed: 116,
      feedSpeedBaseline: 120
    },
    economics: DEFAULT_ECONOMICS,
    calculatedLane: "Review",
    finalDecision: "Review",
    similarPastDefectsCount: 5,
    surfacePatternType: "machined_metal"
  }
];

export const STATIONS_DATA: StationData[] = [
  {
    id: "S01",
    name: "Sheet Stamping & Blanking",
    nominalCycleTimeSec: 10.5,
    actualCycleTimeSec: 10.8,
    wipQueueCount: 14,
    utilizationRate: 78.5,
    downtimeMinutesToday: 12,
    defectRate: 1.1,
    isBottleneck: false,
    driftStatus: "normal"
  },
  {
    id: "S02",
    name: "5-Axis CNC Precision Milling",
    nominalCycleTimeSec: 12.0,
    actualCycleTimeSec: 12.4,
    wipQueueCount: 22,
    utilizationRate: 86.2,
    downtimeMinutesToday: 18,
    defectRate: 2.4,
    isBottleneck: false,
    driftStatus: "normal"
  },
  {
    id: "S03",
    name: "Thermal Press & Sintering",
    nominalCycleTimeSec: 13.2,
    actualCycleTimeSec: 15.6, // Bottleneck Station! +18% cycle time
    wipQueueCount: 68,        // High WIP accumulation!
    utilizationRate: 98.4,    // Pegged utilization
    downtimeMinutesToday: 42,
    defectRate: 7.9,          // Elevated defect rate
    isBottleneck: true,
    driftStatus: "critical"
  },
  {
    id: "S04",
    name: "Automated Optical Inspection (AOI)",
    nominalCycleTimeSec: 8.5,
    actualCycleTimeSec: 8.6,
    wipQueueCount: 8,
    utilizationRate: 64.0,
    downtimeMinutesToday: 4,
    defectRate: 0.2,
    isBottleneck: false,
    driftStatus: "normal"
  },
  {
    id: "S05",
    name: "Robotic Micro-Assembly",
    nominalCycleTimeSec: 11.0,
    actualCycleTimeSec: 11.3,
    wipQueueCount: 19,
    utilizationRate: 81.0,
    downtimeMinutesToday: 15,
    defectRate: 1.8,
    isBottleneck: false,
    driftStatus: "warning"
  },
  {
    id: "S06",
    name: "Final Ultrasonic Wash & Cure",
    nominalCycleTimeSec: 9.0,
    actualCycleTimeSec: 9.1,
    wipQueueCount: 11,
    utilizationRate: 69.5,
    downtimeMinutesToday: 6,
    defectRate: 0.5,
    isBottleneck: false,
    driftStatus: "normal"
  }
];

export const DRIFT_MATRIX_DATA: DriftCell[] = [
  // Batch B25
  { batchId: "Batch B25", stationId: "S01", defectRate: 0.9, sampleCount: 800, driftAlert: false, primaryDefect: "Burr / Edge Defect", driftZScore: 0.2 },
  { batchId: "Batch B25", stationId: "S02", defectRate: 1.8, sampleCount: 800, driftAlert: false, primaryDefect: "Dimensional Warp", driftZScore: 0.4 },
  { batchId: "Batch B25", stationId: "S03", defectRate: 2.5, sampleCount: 800, driftAlert: false, primaryDefect: "Surface Crack", driftZScore: 0.7 },
  { batchId: "Batch B25", stationId: "S04", defectRate: 0.2, sampleCount: 800, driftAlert: false, primaryDefect: "Foreign Particulate", driftZScore: 0.1 },
  { batchId: "Batch B25", stationId: "S05", defectRate: 1.4, sampleCount: 800, driftAlert: false, primaryDefect: "Solder Void", driftZScore: 0.3 },
  { batchId: "Batch B25", stationId: "S06", defectRate: 0.4, sampleCount: 800, driftAlert: false, primaryDefect: "Pore & Pinhole", driftZScore: 0.1 },

  // Batch B26
  { batchId: "Batch B26", stationId: "S01", defectRate: 1.0, sampleCount: 850, driftAlert: false, primaryDefect: "Burr / Edge Defect", driftZScore: 0.3 },
  { batchId: "Batch B26", stationId: "S02", defectRate: 2.1, sampleCount: 850, driftAlert: false, primaryDefect: "Dimensional Warp", driftZScore: 0.5 },
  { batchId: "Batch B26", stationId: "S03", defectRate: 4.8, sampleCount: 850, driftAlert: true, primaryDefect: "Surface Crack", driftZScore: 2.1 }, // Drift warning!
  { batchId: "Batch B26", stationId: "S04", defectRate: 0.3, sampleCount: 850, driftAlert: false, primaryDefect: "Foreign Particulate", driftZScore: 0.2 },
  { batchId: "Batch B26", stationId: "S05", defectRate: 1.6, sampleCount: 850, driftAlert: false, primaryDefect: "Solder Void", driftZScore: 0.4 },
  { batchId: "Batch B26", stationId: "S06", defectRate: 0.5, sampleCount: 850, driftAlert: false, primaryDefect: "Pore & Pinhole", driftZScore: 0.1 },

  // Batch B27 (Current Active Batch!)
  { batchId: "Batch B27", stationId: "S01", defectRate: 1.2, sampleCount: 920, driftAlert: false, primaryDefect: "Burr / Edge Defect", driftZScore: 0.4 },
  { batchId: "Batch B27", stationId: "S02", defectRate: 2.4, sampleCount: 920, driftAlert: false, primaryDefect: "Solder Void", driftZScore: 0.6 },
  { batchId: "Batch B27", stationId: "S03", defectRate: 8.7, sampleCount: 920, driftAlert: true, primaryDefect: "Surface Crack", driftZScore: 3.8 }, // Critical Drift Alert!!
  { batchId: "Batch B27", stationId: "S04", defectRate: 0.2, sampleCount: 920, driftAlert: false, primaryDefect: "Pass (Defect-Free)", driftZScore: 0.1 },
  { batchId: "Batch B27", stationId: "S05", defectRate: 2.2, sampleCount: 920, driftAlert: false, primaryDefect: "Foreign Particulate", driftZScore: 0.9 },
  { batchId: "Batch B27", stationId: "S06", defectRate: 0.6, sampleCount: 920, driftAlert: false, primaryDefect: "Pore & Pinhole", driftZScore: 0.2 },

  // Batch B28 (Simulated / Predictive)
  { batchId: "Batch B28", stationId: "S01", defectRate: 1.1, sampleCount: 750, driftAlert: false, primaryDefect: "Burr / Edge Defect", driftZScore: 0.3 },
  { batchId: "Batch B28", stationId: "S02", defectRate: 2.0, sampleCount: 750, driftAlert: false, primaryDefect: "Dimensional Warp", driftZScore: 0.4 },
  { batchId: "Batch B28", stationId: "S03", defectRate: 6.4, sampleCount: 750, driftAlert: true, primaryDefect: "Surface Crack", driftZScore: 2.9 },
  { batchId: "Batch B28", stationId: "S04", defectRate: 0.3, sampleCount: 750, driftAlert: false, primaryDefect: "Foreign Particulate", driftZScore: 0.1 },
  { batchId: "Batch B28", stationId: "S05", defectRate: 1.9, sampleCount: 750, driftAlert: false, primaryDefect: "Solder Void", driftZScore: 0.7 },
  { batchId: "Batch B28", stationId: "S06", defectRate: 0.5, sampleCount: 750, driftAlert: false, primaryDefect: "Pore & Pinhole", driftZScore: 0.1 }
];

export const TEST_BENCH_BENCHMARKS: StressTestResult[] = [
  {
    runId: "TB-BASELINE",
    timestamp: "10:15 AM",
    samplesTested: 500,
    hits: 472,
    misses: 8,
    falseAlarms: 20,
    accuracy: 94.4,
    recall: 98.3,
    precision: 95.9,
    robustnessScore: 96.2
  },
  {
    runId: "TB-LOW-LIGHT",
    timestamp: "10:22 AM",
    samplesTested: 500,
    hits: 458,
    misses: 22,
    falseAlarms: 20,
    accuracy: 91.6,
    recall: 95.4,
    precision: 95.8,
    robustnessScore: 91.0
  },
  {
    runId: "TB-TILT-25DEG",
    timestamp: "10:30 AM",
    samplesTested: 500,
    hits: 449,
    misses: 31,
    falseAlarms: 20,
    accuracy: 89.8,
    recall: 93.5,
    precision: 95.7,
    robustnessScore: 88.4
  }
];

export const MENDELEY_DATASET_META: MendeleyDatasetMeta = {
  title: "Manufacturing Data Shared Facility - Discrete-Event Simulation",
  doi: "10.17632/3rw227zxt7.2",
  mendeleyUrl: "https://data.mendeley.com/datasets/3rw227zxt7/2",
  authors: ["Marsel Rabaev", "Handy Pratama", "Ka Ching Chan"],
  institution: "University of New South Wales (UNSW)",
  simulationEngine: "Rockwell Arena Simulation (Discrete-Event Simulation)",
  version: "Version 2 (Published 3 July 2019)",
  publishedDate: "2019-07-03",
  license: "CC BY 4.0 International",
  description: "Comprehensive synthetic manufacturing dataset generated via Discrete-Event Simulation (DES) for machine learning benchmark problems in shared facility job scheduling, bottleneck detection, queue dwell dynamics, and quality gate triage."
};

export const MENDELEY_STATIONS_DATA: StationData[] = [
  {
    id: "M01",
    name: "Shared Prep & Rough Milling (M1)",
    nominalCycleTimeSec: 10.5,
    actualCycleTimeSec: 11.2,
    wipQueueCount: 14,
    utilizationRate: 78.4,
    downtimeMinutesToday: 12,
    defectRate: 1.1,
    isBottleneck: false,
    driftStatus: "normal"
  },
  {
    id: "M02",
    name: "Shared 5-Axis CNC Machining (M2)",
    nominalCycleTimeSec: 14.0,
    actualCycleTimeSec: 14.8,
    wipQueueCount: 26,
    utilizationRate: 88.5,
    downtimeMinutesToday: 18,
    defectRate: 2.2,
    isBottleneck: false,
    driftStatus: "normal"
  },
  {
    id: "M03",
    name: "Shared Thermal Anneal & Bonding (M3)",
    nominalCycleTimeSec: 13.0,
    actualCycleTimeSec: 17.4, // Contention bottleneck in shared facility!
    wipQueueCount: 78,
    utilizationRate: 98.8,
    downtimeMinutesToday: 54,
    defectRate: 8.9,
    isBottleneck: true,
    driftStatus: "critical"
  },
  {
    id: "M04",
    name: "Precision Surface Grinding (M4)",
    nominalCycleTimeSec: 11.0,
    actualCycleTimeSec: 11.5,
    wipQueueCount: 18,
    utilizationRate: 72.0,
    downtimeMinutesToday: 8,
    defectRate: 1.8,
    isBottleneck: false,
    driftStatus: "normal"
  },
  {
    id: "M05",
    name: "Optical & Coordinate Inspection (M5)",
    nominalCycleTimeSec: 8.5,
    actualCycleTimeSec: 9.0,
    wipQueueCount: 9,
    utilizationRate: 64.2,
    downtimeMinutesToday: 0,
    defectRate: 0.4,
    isBottleneck: false,
    driftStatus: "normal"
  },
  {
    id: "M06",
    name: "Secondary Triage & Dispatch (M6)",
    nominalCycleTimeSec: 12.0,
    actualCycleTimeSec: 12.4,
    wipQueueCount: 11,
    utilizationRate: 69.1,
    downtimeMinutesToday: 5,
    defectRate: 0.9,
    isBottleneck: false,
    driftStatus: "normal"
  }
];

export const MENDELEY_UNITS: UnitInspectionData[] = [
  {
    id: "DES-A201",
    batchId: "Lot-DES-01",
    stationId: "M03",
    timestamp: "11:04:12",
    componentType: "Aero Housing (Job Type A)",
    defectType: "Surface Crack",
    severity: "Critical",
    confidence: 93.8,
    uncertaintyScore: 6.2,
    isAnomalyNovelty: false,
    boundingBox: {
      x: 64,
      y: 22,
      width: 22,
      height: 20,
      regionName: "Shared Thermal Fixture Contact Zone"
    },
    processData: {
      temperature: 188.6,
      tempBaseline: 172.0, // +9.6% thermal surge
      pressure: 5.10,
      pressureBaseline: 4.65,
      cycleTime: 17.4,
      cycleTimeBaseline: 13.0, // +33% dwell due to shared queue
      vibrationRms: 2.38,
      vibrationBaseline: 1.85,
      feedSpeed: 95,
      feedSpeedBaseline: 120,
      queueWaitTimeMin: 28.5,
      setupTimeMin: 12.0,
      jobType: "Job A (Housing)",
      resourceContentionPct: 98.8
    },
    economics: DEFAULT_ECONOMICS,
    calculatedLane: "Reject",
    finalDecision: "Reject",
    similarPastDefectsCount: 19,
    surfacePatternType: "machined_metal"
  },
  {
    id: "DES-B202",
    batchId: "Lot-DES-01",
    stationId: "M02",
    timestamp: "11:05:40",
    componentType: "Impeller Disc (Job Type B)",
    defectType: "Burr / Edge Defect",
    severity: "Minor",
    confidence: 76.5,
    uncertaintyScore: 23.5,
    isAnomalyNovelty: false,
    boundingBox: {
      x: 74,
      y: 62,
      width: 18,
      height: 16,
      regionName: "Peripheral Bevel Edge"
    },
    processData: {
      temperature: 173.5,
      tempBaseline: 170.0,
      pressure: 4.70,
      pressureBaseline: 4.60,
      cycleTime: 14.8,
      cycleTimeBaseline: 14.0,
      vibrationRms: 2.20,
      vibrationBaseline: 1.80,
      feedSpeed: 115,
      feedSpeedBaseline: 120,
      queueWaitTimeMin: 14.2,
      setupTimeMin: 6.5,
      jobType: "Job B (Impeller)",
      resourceContentionPct: 88.5
    },
    economics: DEFAULT_ECONOMICS,
    calculatedLane: "Review",
    finalDecision: "Review",
    similarPastDefectsCount: 7,
    surfacePatternType: "turbine_blade"
  },
  {
    id: "DES-C203",
    batchId: "Lot-DES-02",
    stationId: "M04",
    timestamp: "11:07:15",
    componentType: "Precision Flange (Job Type C)",
    defectType: "Dimensional Warp",
    severity: "Major",
    confidence: 89.1,
    uncertaintyScore: 10.9,
    isAnomalyNovelty: false,
    boundingBox: {
      x: 20,
      y: 28,
      width: 58,
      height: 48,
      regionName: "Flange Flatness Datum"
    },
    processData: {
      temperature: 176.2,
      tempBaseline: 171.0,
      pressure: 4.88,
      pressureBaseline: 4.60,
      cycleTime: 12.8,
      cycleTimeBaseline: 11.0,
      vibrationRms: 2.05,
      vibrationBaseline: 1.80,
      feedSpeed: 105,
      feedSpeedBaseline: 115,
      queueWaitTimeMin: 19.8,
      setupTimeMin: 8.0,
      jobType: "Job C (Flange)",
      resourceContentionPct: 74.0
    },
    economics: DEFAULT_ECONOMICS,
    calculatedLane: "Reject",
    finalDecision: "Reject",
    similarPastDefectsCount: 11,
    surfacePatternType: "machined_metal"
  },
  {
    id: "DES-A204",
    batchId: "Lot-DES-02",
    stationId: "M01",
    timestamp: "11:09:00",
    componentType: "Aero Housing (Job Type A)",
    defectType: "Pass (Defect-Free)",
    severity: "None",
    confidence: 99.4,
    uncertaintyScore: 0.6,
    isAnomalyNovelty: false,
    boundingBox: {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      regionName: "Full Inspection Pass"
    },
    processData: {
      temperature: 169.8,
      tempBaseline: 170.0,
      pressure: 4.62,
      pressureBaseline: 4.60,
      cycleTime: 10.8,
      cycleTimeBaseline: 10.5,
      vibrationRms: 1.78,
      vibrationBaseline: 1.80,
      feedSpeed: 120,
      feedSpeedBaseline: 120,
      queueWaitTimeMin: 4.5,
      setupTimeMin: 0.0,
      jobType: "Job A (Housing)",
      resourceContentionPct: 78.4
    },
    economics: DEFAULT_ECONOMICS,
    calculatedLane: "Accept",
    finalDecision: "Accept",
    similarPastDefectsCount: 0,
    surfacePatternType: "machined_metal"
  },
  {
    id: "DES-B205",
    batchId: "Lot-DES-03",
    stationId: "M03",
    timestamp: "11:11:22",
    componentType: "Impeller Disc (Job Type B)",
    defectType: "Surface Crack",
    severity: "Major",
    confidence: 91.5,
    uncertaintyScore: 8.5,
    isAnomalyNovelty: false,
    boundingBox: {
      x: 58,
      y: 25,
      width: 25,
      height: 22,
      regionName: "Thermal Root Fillet"
    },
    processData: {
      temperature: 186.4,
      tempBaseline: 172.0,
      pressure: 5.02,
      pressureBaseline: 4.65,
      cycleTime: 16.9,
      cycleTimeBaseline: 13.0,
      vibrationRms: 2.30,
      vibrationBaseline: 1.85,
      feedSpeed: 100,
      feedSpeedBaseline: 120,
      queueWaitTimeMin: 31.0,
      setupTimeMin: 14.5,
      jobType: "Job B (Impeller)",
      resourceContentionPct: 98.8
    },
    economics: DEFAULT_ECONOMICS,
    calculatedLane: "Reject",
    finalDecision: "Reject",
    similarPastDefectsCount: 16,
    surfacePatternType: "turbine_blade"
  },
  {
    id: "DES-C206",
    batchId: "Lot-DES-03",
    stationId: "M05",
    timestamp: "11:13:50",
    componentType: "Precision Flange (Job Type C)",
    defectType: "Pass (Defect-Free)",
    severity: "None",
    confidence: 98.7,
    uncertaintyScore: 1.3,
    isAnomalyNovelty: false,
    boundingBox: {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      regionName: "Full Inspection Pass"
    },
    processData: {
      temperature: 170.2,
      tempBaseline: 170.0,
      pressure: 4.61,
      pressureBaseline: 4.60,
      cycleTime: 8.8,
      cycleTimeBaseline: 8.5,
      vibrationRms: 1.79,
      vibrationBaseline: 1.80,
      feedSpeed: 120,
      feedSpeedBaseline: 120,
      queueWaitTimeMin: 2.0,
      setupTimeMin: 0.0,
      jobType: "Job C (Flange)",
      resourceContentionPct: 64.2
    },
    economics: DEFAULT_ECONOMICS,
    calculatedLane: "Accept",
    finalDecision: "Accept",
    similarPastDefectsCount: 0,
    surfacePatternType: "machined_metal"
  }
];

export const MENDELEY_DRIFT_MATRIX_DATA: DriftCell[] = [
  { batchId: "Lot-DES-01", stationId: "M01", defectRate: 1.2, sampleCount: 140, driftAlert: false, primaryDefect: "Burr / Edge Defect", driftZScore: 0.2 },
  { batchId: "Lot-DES-01", stationId: "M02", defectRate: 2.1, sampleCount: 140, driftAlert: false, primaryDefect: "Dimensional Warp", driftZScore: 0.5 },
  { batchId: "Lot-DES-01", stationId: "M03", defectRate: 9.2, sampleCount: 140, driftAlert: true, primaryDefect: "Surface Crack", driftZScore: 4.1 },
  { batchId: "Lot-DES-01", stationId: "M04", defectRate: 1.6, sampleCount: 140, driftAlert: false, primaryDefect: "Pore & Pinhole", driftZScore: 0.3 },
  { batchId: "Lot-DES-01", stationId: "M05", defectRate: 0.4, sampleCount: 140, driftAlert: false, primaryDefect: "Pass (Defect-Free)", driftZScore: 0.1 },
  { batchId: "Lot-DES-01", stationId: "M06", defectRate: 0.9, sampleCount: 140, driftAlert: false, primaryDefect: "Pass (Defect-Free)", driftZScore: 0.2 },

  { batchId: "Lot-DES-02", stationId: "M01", defectRate: 1.0, sampleCount: 140, driftAlert: false, primaryDefect: "Pass (Defect-Free)", driftZScore: 0.1 },
  { batchId: "Lot-DES-02", stationId: "M02", defectRate: 2.4, sampleCount: 140, driftAlert: false, primaryDefect: "Burr / Edge Defect", driftZScore: 0.6 },
  { batchId: "Lot-DES-02", stationId: "M03", defectRate: 8.5, sampleCount: 140, driftAlert: true, primaryDefect: "Surface Crack", driftZScore: 3.7 },
  { batchId: "Lot-DES-02", stationId: "M04", defectRate: 3.1, sampleCount: 140, driftAlert: false, primaryDefect: "Dimensional Warp", driftZScore: 1.1 },
  { batchId: "Lot-DES-02", stationId: "M05", defectRate: 0.5, sampleCount: 140, driftAlert: false, primaryDefect: "Pass (Defect-Free)", driftZScore: 0.1 },
  { batchId: "Lot-DES-02", stationId: "M06", defectRate: 0.8, sampleCount: 140, driftAlert: false, primaryDefect: "Pass (Defect-Free)", driftZScore: 0.2 },

  { batchId: "Lot-DES-03", stationId: "M01", defectRate: 1.1, sampleCount: 140, driftAlert: false, primaryDefect: "Pass (Defect-Free)", driftZScore: 0.2 },
  { batchId: "Lot-DES-03", stationId: "M02", defectRate: 2.0, sampleCount: 140, driftAlert: false, primaryDefect: "Burr / Edge Defect", driftZScore: 0.4 },
  { batchId: "Lot-DES-03", stationId: "M03", defectRate: 9.8, sampleCount: 140, driftAlert: true, primaryDefect: "Surface Crack", driftZScore: 4.4 },
  { batchId: "Lot-DES-03", stationId: "M04", defectRate: 1.9, sampleCount: 140, driftAlert: false, primaryDefect: "Dimensional Warp", driftZScore: 0.4 },
  { batchId: "Lot-DES-03", stationId: "M05", defectRate: 0.3, sampleCount: 140, driftAlert: false, primaryDefect: "Pass (Defect-Free)", driftZScore: 0.1 },
  { batchId: "Lot-DES-03", stationId: "M06", defectRate: 0.7, sampleCount: 140, driftAlert: false, primaryDefect: "Pass (Defect-Free)", driftZScore: 0.1 },

  { batchId: "Lot-DES-04", stationId: "M01", defectRate: 0.9, sampleCount: 140, driftAlert: false, primaryDefect: "Pass (Defect-Free)", driftZScore: 0.1 },
  { batchId: "Lot-DES-04", stationId: "M02", defectRate: 2.3, sampleCount: 140, driftAlert: false, primaryDefect: "Burr / Edge Defect", driftZScore: 0.5 },
  { batchId: "Lot-DES-04", stationId: "M03", defectRate: 8.9, sampleCount: 140, driftAlert: true, primaryDefect: "Surface Crack", driftZScore: 3.9 },
  { batchId: "Lot-DES-04", stationId: "M04", defectRate: 1.8, sampleCount: 140, driftAlert: false, primaryDefect: "Pass (Defect-Free)", driftZScore: 0.3 },
  { batchId: "Lot-DES-04", stationId: "M05", defectRate: 0.4, sampleCount: 140, driftAlert: false, primaryDefect: "Pass (Defect-Free)", driftZScore: 0.1 },
  { batchId: "Lot-DES-04", stationId: "M06", defectRate: 0.9, sampleCount: 140, driftAlert: false, primaryDefect: "Pass (Defect-Free)", driftZScore: 0.2 }
];

export const DEFAULT_DEFECT_CLASSES = [
  "Surface Crack",
  "Solder Void",
  "Burr / Edge Defect",
  "Foreign Particulate",
  "Dimensional Warp",
  "Pore & Pinhole",
  "Thermal Burn",
  "Pass (Defect-Free)"
];

export const DEFAULT_COLUMN_MAPPING = {
  unit_id: "unit_id",
  image_file: "image_file",
  timestamp: "timestamp",
  batch: "batch_id",
  station: "station_id",
  product_variant: "component_type",
  shift: "shift",
  cycle_time: "cycle_time_sec",
  downtime: "downtime_min",
  queue_wip: "queue_wip_units",
  defect_flag: "defect_type",
  process_params: ["temperature", "pressure", "vibration_rms", "feed_speed"],
  cost_material: "material_cost",
  cost_labour: "labor_cost",
  cost_energy: "energy_cost",
  cost_scrap: "scrap_cost",
  cost_rework: "rework_cost",
  cost_selling_price: "selling_price"
};

// Generate realistic CSV string of production logs
export function getSampleProductionLogsCsv(): string {
  const headers = [
    "unit_id",
    "batch_id",
    "station_id",
    "timestamp",
    "component_type",
    "defect_type",
    "severity",
    "confidence",
    "temperature",
    "pressure",
    "cycle_time_sec",
    "vibration_rms",
    "feed_speed",
    "shift",
    "queue_wip_units",
    "decision_lane"
  ];

  const rows = INITIAL_UNITS.map((u, i) => [
    u.id,
    u.batchId,
    u.stationId,
    u.timestamp,
    `"${u.componentType}"`,
    `"${u.defectType}"`,
    u.severity,
    u.confidence,
    u.processData.temperature,
    u.processData.pressure,
    u.processData.cycleTime,
    u.processData.vibrationRms,
    u.processData.feedSpeed,
    i % 2 === 0 ? "Shift A" : "Shift B",
    Math.floor(Math.random() * 8) + 2,
    u.finalDecision
  ]);

  return [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
}

export const DEFAULT_WORKER_PROFILE = {
  name: "Rajesh Kumar",
  workerId: "WRK-4092",
  department: "Precision Machining & Assembly",
  station: "S03 - Finish Machining",
  shift: "Shift A (08:00 - 16:30)",
  role: "Senior Station Machinist / Inspector",
  avatarInitials: "RK"
};

export const INITIAL_WORKER_ISSUES = [
  {
    id: "ISS-1042",
    title: "Thermal Excursion & Specular Reflection Flaws on Upper Flange",
    description: "Cooling fluid manifold pressure dropping intermittently during the 18.5s finish pass. Causes localized scorching and false pinhole flags on vision inspection.",
    station: "S03",
    category: "Quality" as const,
    priority: "High" as const,
    status: "Under Review" as const,
    submittedBy: "Rajesh Kumar",
    workerId: "WRK-4092",
    submittedAt: "10:14 AM",
    date: "Today, 10:14 AM",
    batchId: "Batch B26",
    evidenceImage: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
    assignedTo: "Dr. Aris Thorne (Quality Assurance Lead)",
    actionTaken: "Station S03 thermal manifold valve 3B inspected; root cause traced to particulate clog in auxiliary return line.",
    resolutionNotes: "Valve flush scheduled at next shift changeover (16:30). Temporary auxiliary coolant bypass engaged."
  },
  {
    id: "ISS-1038",
    title: "High Vibration Spike & Hydraulic Chatter on Deburring Spindle",
    description: "Spindle bearing vibration exceeded 2.4 mm/s RMS during edge chamfering. Risk of tool breakage and surface gouges.",
    station: "S02",
    category: "Equipment" as const,
    priority: "Critical" as const,
    status: "Action Assigned" as const,
    submittedBy: "Rajesh Kumar",
    workerId: "WRK-4092",
    submittedAt: "09:30 AM",
    date: "Today, 09:30 AM",
    batchId: "Batch B26",
    evidenceImage: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=800&auto=format&fit=crop&q=80",
    assignedTo: "Vikram Mehta (Lead Maintenance Engineer)",
    actionTaken: "Work order WO-8842 issued to maintenance crew. Secondary spindle balanced and collet retention pin replaced.",
    resolutionNotes: "Pending dynamic vibration certification before releasing to full 240 units/hr line speed."
  },
  {
    id: "ISS-1031",
    title: "Feed Rate Calibration Drift causing Pacing Lag",
    description: "Automatic feed rate was 215 mm/min instead of nominal 240 mm/min, generating 11-unit buffer queue at S03 conveyor diverter.",
    station: "S03",
    category: "Process" as const,
    priority: "Normal" as const,
    status: "Resolved" as const,
    submittedBy: "Rajesh Kumar",
    workerId: "WRK-4092",
    submittedAt: "08:15 AM",
    date: "Today, 08:15 AM",
    batchId: "Batch B25",
    evidenceImage: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80",
    assignedTo: "Priya Nair (Process Engineer)",
    actionTaken: "CNC servo driver gain reset to factory calibration; tachometer sensor cleaned.",
    resolutionNotes: "Takt time returned to 12.2s. Station backlog cleared in 18 minutes.",
    resolvedAt: "08:50 AM"
  },
  {
    id: "ISS-1029",
    title: "Raw Casting Micro-porosity on Ingot Infeed",
    description: "Found cluster of surface micro-pores on raw blade root before entering CNC mill. Supplier lot #C-901.",
    station: "S01",
    category: "Material" as const,
    priority: "High" as const,
    status: "Under Review" as const,
    submittedBy: "Rajesh Kumar",
    workerId: "WRK-4092",
    submittedAt: "Yesterday, 15:40",
    date: "Yesterday, 15:40",
    batchId: "Batch B25",
    assignedTo: "Kavita Sen (Supplier Quality)",
    actionTaken: "15 ingots quarantined for ultrasonic non-destructive testing.",
    resolutionNotes: "Supplier alerted for metallurgical inspection on melt lot #C-901."
  },
  {
    id: "ISS-1025",
    title: "Emergency Stop Lanyard Slack at Outfeed Diverter",
    description: "Pull-cord safety cable on conveyor outfeed has approx 15cm excess play before switch actuation.",
    station: "S05",
    category: "Safety" as const,
    priority: "High" as const,
    status: "Action Assigned" as const,
    submittedBy: "Rajesh Kumar",
    workerId: "WRK-4092",
    submittedAt: "Yesterday, 14:10",
    date: "Yesterday, 14:10",
    batchId: "Batch B24",
    assignedTo: "EHS Officer Suresh Patel",
    actionTaken: "Turnbuckle tightened and tension sensor tested for instant 0.15s cutoff."
  },
  {
    id: "ISS-1020",
    title: "Vision Camera Lens Specular Glare from New LED Fixture",
    description: "Reflections from overhead fixture causing false edge burr detections on high-finish rotor surfaces.",
    station: "S04",
    category: "Quality" as const,
    priority: "Normal" as const,
    status: "Under Review" as const,
    submittedBy: "Rajesh Kumar",
    workerId: "WRK-4092",
    submittedAt: "Yesterday, 11:20",
    date: "Yesterday, 11:20",
    batchId: "Batch B24",
    assignedTo: "Vision Specialist Daniel Wu"
  },
  {
    id: "ISS-1017",
    title: "Conveyor Belt Tracking Misalignment causing Unit Tilt",
    description: "Puck carriers slightly tilting at transfer bridge between S02 and S03.",
    station: "S02",
    category: "Equipment" as const,
    priority: "Normal" as const,
    status: "Under Review" as const,
    submittedBy: "Rajesh Kumar",
    workerId: "WRK-4092",
    submittedAt: "2 days ago",
    date: "2 days ago",
    batchId: "Batch B23"
  },
  {
    id: "ISS-1014",
    title: "Air Pressure Regulator Flutter on Pneumatic Clamps",
    description: "Clamp pressure fluctuating between 4.2 and 5.1 bar during high-speed cycle index.",
    station: "S03",
    category: "Equipment" as const,
    priority: "Normal" as const,
    status: "Under Review" as const,
    submittedBy: "Rajesh Kumar",
    workerId: "WRK-4092",
    submittedAt: "2 days ago",
    date: "2 days ago",
    batchId: "Batch B23"
  },
  {
    id: "ISS-1009",
    title: "Burr Residue in Finished Chamfer Groove",
    description: "De-burring brush worn down past 50% limit, leaving 0.3mm burr flags on bottom lip.",
    station: "S02",
    category: "Quality" as const,
    priority: "Normal" as const,
    status: "Resolved" as const,
    submittedBy: "Rajesh Kumar",
    workerId: "WRK-4092",
    submittedAt: "3 days ago",
    date: "3 days ago",
    batchId: "Batch B22",
    assignedTo: "Vikram Mehta",
    actionTaken: "Abrasive brush cartridge replaced and tested.",
    resolutionNotes: "All 20 parts re-inspected and cleared.",
    resolvedAt: "3 days ago"
  }
];

export const INITIAL_WORKER_NOTIFICATIONS = [
  {
    id: "NOTIF-1",
    issueId: "ISS-1042",
    title: "Issue Reviewed by Quality Lead",
    message: "Your issue ISS-1042 (Thermal Excursion on S03) has been reviewed by Dr. Aris Thorne.",
    timestamp: "10:35 AM",
    read: false,
    type: "review" as const
  },
  {
    id: "NOTIF-2",
    issueId: "ISS-1038",
    title: "Maintenance Action Assigned",
    message: "Action has been assigned for your reported equipment issue ISS-1038 (Spindle Vibration). Work order #WO-8842 opened.",
    timestamp: "09:48 AM",
    read: false,
    type: "action" as const
  },
  {
    id: "NOTIF-3",
    issueId: "ISS-1031",
    title: "Issue Resolved",
    message: "Issue ISS-1031 (Feed Rate Drift at S03) has been resolved. Line takt time normalized to 12.2s.",
    timestamp: "08:52 AM",
    read: true,
    type: "resolved" as const
  },
  {
    id: "NOTIF-4",
    issueId: "ISS-1025",
    title: "EHS Safety Work Order",
    message: "Action has been assigned for your reported safety issue ISS-1025. Turnbuckle inspected.",
    timestamp: "Yesterday, 16:00",
    read: true,
    type: "action" as const
  }
];

