/**
 * Atlas Engineering Patterns — Canonical Repository Records
 * Strictly within the scope of educational, research, and laboratory stand interfaces.
 */

import {
  PrimitiveEntity,
  PatternEntity,
  ConfigurationEntity,
  ImplementationEntity,
  EvidenceEntity,
  AtlasEntity
} from './types';

export const CANONICAL_PRIMITIVES: PrimitiveEntity[] = [
  {
    id: 'prim-time-series-strip',
    type: 'primitive',
    title: 'Scrolling Time-Series Strip',
    shortDescription: 'Hardware-synchronized live waveform display with sliding window, baseline grid, and freeze-buffer.',
    fullDescription: 'Continuous strip chart rendering analog and digital sensor streams with configurable temporal window (1s to 600s), auto-ranging Y axes, and pause-for-inspection buffer.',
    lifecycleStatus: 'INDEPENDENTLY_VERIFIED',
    domainCategory: 'telemetry',
    tags: ['waveform', 'oscilloscope', 'canvas', 'high-rate', 'sensors'],
    uiSlot: 'strip',
    renderingTech: 'Canvas',
    minFootprintPixels: { width: 320, height: 160 },
    supportsTouch: true,
    supportsKeyboard: true,
    telemetryRateMaxHz: 1000,
    authorOrSource: 'Atlas Lab Interface Working Group',
    createdAt: '2025-01-15',
    updatedAt: '2026-02-10',
    evidenceIds: ['evid-iso-9241-ergonomics-study-2023'],
    relations: [
      { sourceId: 'prim-time-series-strip', relation: 'VERIFIED_BY', targetId: 'evid-iso-9241-ergonomics-study-2023' },
      { sourceId: 'prim-time-series-strip', relation: 'COMPOSES_WITH', targetId: 'prim-stepper-scrubber' }
    ]
  },
  {
    id: 'prim-calibrated-gauge-dial',
    type: 'primitive',
    title: 'Calibrated Polar Gauge Dial',
    shortDescription: 'Radial instrument needle display with segmented safe/warning/critical color bands and large tabular readout.',
    fullDescription: 'Radial indicator designed for instantaneous cognitive appraisal of critical physical parameters (RPM, pressure, temperature, torque). Compliant with high-glare laboratory environments.',
    lifecycleStatus: 'TESTED',
    domainCategory: 'telemetry',
    tags: ['gauge', 'radial', 'analog-feel', 'thresholds', 'meters'],
    uiSlot: 'viewport',
    renderingTech: 'SVG',
    minFootprintPixels: { width: 180, height: 180 },
    supportsTouch: false,
    supportsKeyboard: false,
    telemetryRateMaxHz: 60,
    authorOrSource: 'Aviation & Fluids Interface Lab',
    createdAt: '2025-02-01',
    updatedAt: '2026-01-20',
    evidenceIds: ['evid-iso-9241-ergonomics-study-2023'],
    relations: [
      { sourceId: 'prim-calibrated-gauge-dial', relation: 'VERIFIED_BY', targetId: 'evid-iso-9241-ergonomics-study-2023' },
      { sourceId: 'prim-calibrated-gauge-dial', relation: 'ALTERNATIVE_TO', targetId: 'prim-time-series-strip', rationale: 'Gauge dial optimizes for instantaneous threshold awareness; time-series strip optimizes for temporal drift analysis.' }
    ]
  },
  {
    id: 'prim-emergency-estop-banner',
    type: 'primitive',
    title: 'Interlocked Emergency E-Stop Banner',
    shortDescription: 'Pinned top safety banner with dual-confirmation hardware disarm state and latched auditory/visual warning.',
    fullDescription: 'Permanent high-priority banner commanding the stand emergency state. Requires deliberate 2-stage interaction or physical mushroom-switch acknowledgment to release.',
    lifecycleStatus: 'INDEPENDENTLY_VERIFIED',
    domainCategory: 'safety',
    tags: ['safety', 'interlock', 'e-stop', 'fail-safe', 'critical'],
    uiSlot: 'ribbon',
    renderingTech: 'DOM',
    minFootprintPixels: { width: 480, height: 48 },
    supportsTouch: true,
    supportsKeyboard: true,
    telemetryRateMaxHz: 200,
    authorOrSource: 'Lab Safety Engineering Standard WG',
    createdAt: '2024-11-10',
    updatedAt: '2026-03-01',
    evidenceIds: ['evid-high-voltage-safety-audit-2024'],
    relations: [
      { sourceId: 'prim-emergency-estop-banner', relation: 'VERIFIED_BY', targetId: 'evid-high-voltage-safety-audit-2024' },
      { sourceId: 'prim-emergency-estop-banner', relation: 'COMPOSES_WITH', targetId: 'prim-state-annunciator-matrix', rationale: 'Emergency banner coordinates state directly with the annunciator matrix.' }
    ]
  },
  {
    id: 'prim-stepper-scrubber',
    type: 'primitive',
    title: 'Bounded Numeric Stepper & Scrubber',
    shortDescription: 'Dual-speed rotary/linear parameter adjustment with hardware boundary clamping and direct keypad entry.',
    fullDescription: 'Combines fine arrow stepping, coarse dragging scrubber, and double-click direct numerical entry with explicit physical unit display (e.g. mm/s, kPa, deg C).',
    lifecycleStatus: 'TESTED',
    domainCategory: 'controls',
    tags: ['controls', 'input', 'bounds', 'stepper', 'units'],
    uiSlot: 'control-rail',
    renderingTech: 'DOM',
    minFootprintPixels: { width: 220, height: 48 },
    supportsTouch: true,
    supportsKeyboard: true,
    telemetryRateMaxHz: 60,
    authorOrSource: 'Industrial Automation Group',
    createdAt: '2025-01-20',
    updatedAt: '2026-02-15',
    evidenceIds: ['evid-aero-lab-student-trials-report'],
    relations: [
      { sourceId: 'prim-stepper-scrubber', relation: 'VERIFIED_BY', targetId: 'evid-aero-lab-student-trials-report' },
      { sourceId: 'prim-stepper-scrubber', relation: 'COMPOSES_WITH', targetId: 'prim-time-series-strip' }
    ]
  },
  {
    id: 'prim-crosshair-canvas',
    type: 'primitive',
    title: 'Coordinate Crosshair Inspection Canvas',
    shortDescription: 'Interactive 2D spatial canvas with hairline coordinate crosshairs, probe markers, and delta readouts.',
    fullDescription: 'Used for aerodynamic cross-sections, particle image velocimetry (PIV), laser beam alignment, and optical interferometry frames with micron-level coordinate readouts.',
    lifecycleStatus: 'IMPLEMENTED',
    domainCategory: 'telemetry',
    tags: ['spatial', '2d', 'crosshairs', 'inspection', 'optics'],
    uiSlot: 'viewport',
    renderingTech: 'Canvas',
    minFootprintPixels: { width: 400, height: 300 },
    supportsTouch: true,
    supportsKeyboard: true,
    telemetryRateMaxHz: 120,
    authorOrSource: 'Optical & Laser Mechanics Dept',
    createdAt: '2025-03-01',
    updatedAt: '2026-02-28',
    evidenceIds: ['evid-iso-9241-ergonomics-study-2023'],
    relations: [
      { sourceId: 'prim-crosshair-canvas', relation: 'VERIFIED_BY', targetId: 'evid-iso-9241-ergonomics-study-2023' },
      { sourceId: 'prim-crosshair-canvas', relation: 'COMPOSES_WITH', targetId: 'prim-stepper-scrubber' }
    ]
  },
  {
    id: 'prim-state-annunciator-matrix',
    type: 'primitive',
    title: 'State Annunciator & Interlock Matrix',
    shortDescription: 'Industrial-grade grid of discrete status cells with latched alarm acknowledgement and trip tracing.',
    fullDescription: 'Compact multi-cell annunciator display indicating valve positions, vacuum levels, interlock closures, and thermal limits with clear text and standardized IEC state indicators.',
    lifecycleStatus: 'INDEPENDENTLY_VERIFIED',
    domainCategory: 'safety',
    tags: ['annunciator', 'alarm', 'interlock', 'iec-60073', 'safety'],
    uiSlot: 'matrix',
    renderingTech: 'DOM',
    minFootprintPixels: { width: 300, height: 120 },
    supportsTouch: true,
    supportsKeyboard: true,
    telemetryRateMaxHz: 50,
    authorOrSource: 'Nuclear & High-Hazard Test Facility',
    createdAt: '2024-12-05',
    updatedAt: '2026-01-30',
    evidenceIds: ['evid-high-voltage-safety-audit-2024'],
    relations: [
      { sourceId: 'prim-state-annunciator-matrix', relation: 'VERIFIED_BY', targetId: 'evid-high-voltage-safety-audit-2024' },
      { sourceId: 'prim-state-annunciator-matrix', relation: 'COMPOSES_WITH', targetId: 'prim-emergency-estop-banner' }
    ]
  },
  {
    id: 'prim-split-console-layout',
    type: 'primitive',
    title: 'Asymmetric Split Console Layout',
    shortDescription: 'Ergonomic 3-zone layout: left parameter control rail, center visual inspection stage, bottom telemetry tray.',
    fullDescription: 'The baseline workspace layout for desktop and benchtop stands. Keeps input controls segregated from active visualization, preventing hand occlusions on touch monitors.',
    lifecycleStatus: 'INDEPENDENTLY_VERIFIED',
    domainCategory: 'layout',
    tags: ['layout', 'split-view', 'ergonomics', 'console', 'workspace'],
    uiSlot: 'viewport',
    renderingTech: 'DOM',
    minFootprintPixels: { width: 960, height: 600 },
    supportsTouch: true,
    supportsKeyboard: true,
    authorOrSource: 'Lab Workbench Architecture Group',
    createdAt: '2024-10-15',
    updatedAt: '2026-02-18',
    evidenceIds: ['evid-iso-9241-ergonomics-study-2023'],
    relations: [
      { sourceId: 'prim-split-console-layout', relation: 'VERIFIED_BY', targetId: 'evid-iso-9241-ergonomics-study-2023' }
    ]
  },
  {
    id: 'prim-multichannel-waterfall',
    type: 'primitive',
    title: 'Multi-Channel Spectrographic Waterfall',
    shortDescription: 'Color-indexed rolling spectral waterfall for vibrational, acoustic, and RF telemetry.',
    fullDescription: 'Renders continuous fast-Fourier-transform (FFT) density over time with adjustable color maps (Viridis, Coolwarm), peak tracking, and harmonic marker overlays.',
    lifecycleStatus: 'IMPLEMENTED',
    domainCategory: 'telemetry',
    tags: ['spectrogram', 'fft', 'waterfall', 'frequency', 'vibration'],
    uiSlot: 'viewport',
    renderingTech: 'Canvas',
    minFootprintPixels: { width: 360, height: 240 },
    supportsTouch: true,
    supportsKeyboard: false,
    telemetryRateMaxHz: 200,
    authorOrSource: 'Acoustic & Vibration Lab',
    createdAt: '2025-04-12',
    updatedAt: '2026-01-10',
    evidenceIds: ['evid-iso-9241-ergonomics-study-2023'],
    relations: [
      { sourceId: 'prim-multichannel-waterfall', relation: 'VERIFIED_BY', targetId: 'evid-iso-9241-ergonomics-study-2023' }
    ]
  }
];

export const CANONICAL_PATTERNS: PatternEntity[] = [
  {
    id: 'pat-calibrated-telemetry-console',
    type: 'pattern',
    title: 'Calibrated Multi-Sensor Telemetry Console',
    shortDescription: 'Unified time-synchronized monitoring console combining scrolling wave strips with immediate threshold dials.',
    fullDescription: 'Organizes disparate stand sensor streams into coordinated time-series strips anchored by high-visibility threshold dials for immediate cognitive triage and anomaly tracking.',
    lifecycleStatus: 'INDEPENDENTLY_VERIFIED',
    domainCategory: 'telemetry',
    tags: ['telemetry', 'monitoring', 'time-series', 'dials', 'synchronization'],
    problemStatement: 'Stand operators face split attention across multiple physical sensors (temperature, pressure, vibration) and struggle to correlate sudden spikes with parameter adjustments.',
    solutionSummary: 'Pair high-rate time-series strips with polar gauge dials on an asymmetric split console, with synchronized crosshair scrubs and auto-scaled Y limits.',
    tradeOffs: {
      advantages: [
        'Immediate pattern recognition of transient physical phenomena',
        'Direct correlation between actuator change and sensor response',
        'Zero layout jitter via tabular numerals and fixed canvas bounds'
      ],
      disadvantages: [
        'Demands minimum 1280x800 resolution or 24-inch monitor',
        'Higher CPU load if rendering >4 channels at >200Hz'
      ]
    },
    applicability: {
      purposes: ['RESEARCH_BENCH', 'STUDENT_LAB_EXPERIMENT', 'INDUSTRIAL_TESTBED'],
      targetLevels: ['UNDERGRADUATE', 'RESEARCHER', 'CERTIFIED_OPERATOR'],
      minScreens: 1,
      requiredPeripherals: ['Mouse or Touchscreen'],
      hardConstraints: ['Screen resolution >= 1280px wide']
    },
    primitiveIds: ['prim-split-console-layout', 'prim-time-series-strip', 'prim-calibrated-gauge-dial', 'prim-stepper-scrubber'],
    alternativePatternIds: ['pat-high-rate-signal-inspection'],
    authorOrSource: 'Atlas Lab Interface Working Group',
    createdAt: '2025-01-18',
    updatedAt: '2026-02-22',
    evidenceIds: ['evid-iso-9241-ergonomics-study-2023', 'evid-aero-lab-student-trials-report'],
    relations: [
      { sourceId: 'pat-calibrated-telemetry-console', relation: 'USES', targetId: 'prim-split-console-layout' },
      { sourceId: 'pat-calibrated-telemetry-console', relation: 'USES', targetId: 'prim-time-series-strip' },
      { sourceId: 'pat-calibrated-telemetry-console', relation: 'USES', targetId: 'prim-calibrated-gauge-dial' },
      { sourceId: 'pat-calibrated-telemetry-console', relation: 'USES', targetId: 'prim-stepper-scrubber' },
      { sourceId: 'pat-calibrated-telemetry-console', relation: 'ALTERNATIVE_TO', targetId: 'pat-high-rate-signal-inspection' },
      { sourceId: 'pat-calibrated-telemetry-console', relation: 'VERIFIED_BY', targetId: 'evid-iso-9241-ergonomics-study-2023' }
    ]
  },
  {
    id: 'pat-guided-student-experiment-stepper',
    type: 'pattern',
    title: 'Guided Multi-Phase Student Experiment Workflow',
    shortDescription: 'State-gated laboratory protocol stepper enforcing calibration prerequisites before energetic operation.',
    fullDescription: 'Progressive disclosure interface tailored for educational and training stands. Restricts actuator controls until baseline safety calibrations and hypothesis steps are satisfied.',
    lifecycleStatus: 'MEASURED',
    domainCategory: 'guidance',
    tags: ['education', 'workflow', 'prerequisites', 'guardrails', 'pedagogy'],
    problemStatement: 'Novice students in academic laboratories jump directly to high-power actuation without tare calibration, sensor zeroing, or recording baseline conditions.',
    solutionSummary: 'Enforce a 4-phase sequential workflow (Setup & Tare -> Baseline Sweep -> Active Experiment -> Post-Run Analysis) where actuation sliders unlock only when previous phases complete.',
    tradeOffs: {
      advantages: [
        'Reduces student procedural errors by 64%',
        'Protects sensitive physical stand hardware from out-of-sequence overdrive',
        'Embeds pedagogical context directly into the control surface'
      ],
      disadvantages: [
        'Restricts rapid manual exploration for expert researchers',
        'Requires bypass key for maintenance/technician mode'
      ]
    },
    applicability: {
      purposes: ['EDUCATIONAL_DEMO', 'STUDENT_LAB_EXPERIMENT'],
      targetLevels: ['SECONDARY_SCHOOL', 'UNDERGRADUATE'],
      minScreens: 1,
      requiredPeripherals: [],
      hardConstraints: ['Must provide technician bypass toggle']
    },
    primitiveIds: ['prim-split-console-layout', 'prim-stepper-scrubber', 'prim-emergency-estop-banner'],
    conflictPatternIds: ['pat-dual-operator-safety-interlock'],
    authorOrSource: 'Higher Engineering Pedagogy Consortium',
    createdAt: '2025-02-10',
    updatedAt: '2026-03-05',
    evidenceIds: ['evid-aero-lab-student-trials-report'],
    relations: [
      { sourceId: 'pat-guided-student-experiment-stepper', relation: 'USES', targetId: 'prim-split-console-layout' },
      { sourceId: 'pat-guided-student-experiment-stepper', relation: 'USES', targetId: 'prim-stepper-scrubber' },
      { sourceId: 'pat-guided-student-experiment-stepper', relation: 'USES', targetId: 'prim-emergency-estop-banner' },
      { sourceId: 'pat-guided-student-experiment-stepper', relation: 'VERIFIED_BY', targetId: 'evid-aero-lab-student-trials-report' },
      { sourceId: 'pat-guided-student-experiment-stepper', relation: 'CONFLICTS_WITH', targetId: 'pat-dual-operator-safety-interlock', rationale: 'Single-student curriculum experiments conflict with dual-operator industrial interlock protocols.' }
    ]
  },
  {
    id: 'pat-high-rate-signal-inspection',
    type: 'pattern',
    title: 'High-Rate Synchronized Signal & FFT Inspection',
    shortDescription: 'Dual oscilloscope and spectral waterfall interface with trigger controls and differential cursor probes.',
    fullDescription: 'Designed for aerodynamic boundary layer probing, acoustic vibration stands, and electrical characterization benches requiring multi-channel oscilloscope traces and FFT spectra.',
    lifecycleStatus: 'TESTED',
    domainCategory: 'telemetry',
    tags: ['oscilloscope', 'fft', 'waterfall', 'frequency', 'cursors'],
    problemStatement: 'Engineers investigating transient oscillations cannot simultaneously analyze time-domain waveform damping and frequency-domain harmonic modal peaks.',
    solutionSummary: 'Provide a split dual-stage viewport: top half displays synchronized multi-channel waveform strip, bottom half displays FFT waterfall, with linked time/frequency crosshairs.',
    tradeOffs: {
      advantages: [
        'Direct identification of harmonic distortion and flutter modes',
        'Cursor deltas calculate frequency and damping factors instantly'
      ],
      disadvantages: [
        'Requires hardware-accelerated Canvas/WebGL pipeline',
        'Complex interface not suitable for novice secondary students'
      ]
    },
    applicability: {
      purposes: ['RESEARCH_BENCH', 'INDUSTRIAL_TESTBED'],
      targetLevels: ['RESEARCHER', 'CERTIFIED_OPERATOR'],
      minScreens: 1,
      requiredPeripherals: ['Keyboard/Mouse for fine cursor placement'],
      hardConstraints: ['Client GPU acceleration enabled', 'User level >= UNDERGRADUATE']
    },
    primitiveIds: ['prim-time-series-strip', 'prim-multichannel-waterfall', 'prim-crosshair-canvas'],
    alternativePatternIds: ['pat-calibrated-telemetry-console'],
    authorOrSource: 'Signal Processing & Acoustics Lab',
    createdAt: '2025-03-01',
    updatedAt: '2026-02-12',
    evidenceIds: ['evid-iso-9241-ergonomics-study-2023'],
    relations: [
      { sourceId: 'pat-high-rate-signal-inspection', relation: 'USES', targetId: 'prim-time-series-strip' },
      { sourceId: 'pat-high-rate-signal-inspection', relation: 'USES', targetId: 'prim-multichannel-waterfall' },
      { sourceId: 'pat-high-rate-signal-inspection', relation: 'USES', targetId: 'prim-crosshair-canvas' },
      { sourceId: 'pat-high-rate-signal-inspection', relation: 'VERIFIED_BY', targetId: 'evid-iso-9241-ergonomics-study-2023' }
    ]
  },
  {
    id: 'pat-dual-operator-safety-interlock',
    type: 'pattern',
    title: 'Dual-Operator Software/Hardware Safety Interlock',
    shortDescription: 'Two-person or two-stage deadman verification architecture for hazardous laboratory stands.',
    fullDescription: 'Enforces independent verification before arming high-voltage, high-pressure, or radiation stands. Combines hardware sensor verification with software confirm locks.',
    lifecycleStatus: 'INDEPENDENTLY_VERIFIED',
    domainCategory: 'safety',
    tags: ['safety', 'high-voltage', 'hazard', 'two-person', 'annunciator'],
    problemStatement: 'In hazardous research stands (pulsed lasers, high-voltage discharges, pressurized reactors), accidental single-click activation risks equipment destruction or personnel injury.',
    solutionSummary: 'Integrate the emergency banner with an annunciator matrix requiring both stations or armed interlocks to register green before enabling high-energy discharge.',
    tradeOffs: {
      advantages: [
        'Zero recorded unintended discharges across >3,000 recorded operational test cycles',
        'Designed to integrate into dual-channel hardware safety loops (e.g., ISO 13849-1 PL e / IEC 62061 architectures)'
      ],
      disadvantages: [
        'Introduces deliberate operational friction (20-30s arming cycle)',
        'Unsuitable for rapid educational classrooms'
      ]
    },
    applicability: {
      purposes: ['HAZARDOUS_FACILITY', 'INDUSTRIAL_TESTBED', 'RESEARCH_BENCH'],
      targetLevels: ['CERTIFIED_OPERATOR', 'RESEARCHER'],
      minScreens: 1,
      requiredPeripherals: ['Hardware E-Stop Mushroom Switch', 'Interlocked Enclosure Sensor'],
      hardConstraints: ['User level must be CERTIFIED_OPERATOR or RESEARCHER']
    },
    primitiveIds: ['prim-emergency-estop-banner', 'prim-state-annunciator-matrix'],
    conflictPatternIds: ['pat-guided-student-experiment-stepper'],
    authorOrSource: 'High-Hazard Stand Safety Board',
    createdAt: '2024-11-20',
    updatedAt: '2026-03-01',
    evidenceIds: ['evid-high-voltage-safety-audit-2024'],
    relations: [
      { sourceId: 'pat-dual-operator-safety-interlock', relation: 'USES', targetId: 'prim-emergency-estop-banner' },
      { sourceId: 'pat-dual-operator-safety-interlock', relation: 'USES', targetId: 'prim-state-annunciator-matrix' },
      { sourceId: 'pat-dual-operator-safety-interlock', relation: 'VERIFIED_BY', targetId: 'evid-high-voltage-safety-audit-2024' }
    ]
  },
  {
    id: 'pat-multi-screen-overview-detailed-drilldown',
    type: 'pattern',
    title: 'Multi-Screen Synced Overview & Drilldown Console',
    shortDescription: 'Dual-monitor workspace decoupling broad plant/stand schematic from deep telemetry manipulation.',
    fullDescription: 'Primary screen renders high-level physical stand mimic diagram and safety bounds; secondary touchscreen hosts high-density channel calibration and parameter scrubbers.',
    lifecycleStatus: 'TESTED',
    domainCategory: 'multi-screen',
    tags: ['multi-monitor', 'dual-screen', 'schematic', 'drilldown', 'touch'],
    problemStatement: 'Complex laboratory stands with >20 actuators and sensors cause cognitive overload when crowded onto a single display, forcing frequent modal context switches.',
    solutionSummary: 'Decouple spatial layout: Display 1 (Static 24-27") renders physical mimic and system alarms; Display 2 (Touch 15-21") hosts interactive channel inspection and steppers.',
    tradeOffs: {
      advantages: [
        'Maintains situational awareness while performing fine parameter tuning',
        'Eliminates modal dialogs and window overlapping'
      ],
      disadvantages: [
        'Requires minimum 2 physical display outputs on host controller',
        'Window state persistence requires IPC or WebSocket coordination'
      ]
    },
    applicability: {
      purposes: ['RESEARCH_BENCH', 'INDUSTRIAL_TESTBED', 'HAZARDOUS_FACILITY'],
      targetLevels: ['RESEARCHER', 'CERTIFIED_OPERATOR'],
      minScreens: 2,
      requiredPeripherals: ['Dual Monitor Output', 'Auxiliary Touchscreen'],
      hardConstraints: ['Physical monitor count >= 2']
    },
    primitiveIds: ['prim-split-console-layout', 'prim-crosshair-canvas', 'prim-time-series-strip', 'prim-stepper-scrubber'],
    authorOrSource: 'Multiscreen Ergonomics Research Lab',
    createdAt: '2025-02-28',
    updatedAt: '2026-02-15',
    evidenceIds: ['evid-iso-9241-ergonomics-study-2023'],
    relations: [
      { sourceId: 'pat-multi-screen-overview-detailed-drilldown', relation: 'USES', targetId: 'prim-split-console-layout' },
      { sourceId: 'pat-multi-screen-overview-detailed-drilldown', relation: 'USES', targetId: 'prim-crosshair-canvas' },
      { sourceId: 'pat-multi-screen-overview-detailed-drilldown', relation: 'USES', targetId: 'prim-time-series-strip' },
      { sourceId: 'pat-multi-screen-overview-detailed-drilldown', relation: 'REQUIRES', targetId: 'prim-split-console-layout' }
    ]
  },
  {
    id: 'pat-graceful-hardware-drift-alerting',
    type: 'pattern',
    title: 'Graceful Hardware Drift & Zero-Offset Alerting',
    shortDescription: 'Non-disruptive telemetry ribbon reporting sensor calibration drift without breaking active test runs.',
    fullDescription: 'Monitors thermocouple aging, pressure transducer zero-drift, and ambient baseline shifts in the background. Alerts operator gently without modal popups.',
    lifecycleStatus: 'IMPLEMENTED',
    domainCategory: 'telemetry',
    tags: ['drift', 'calibration', 'sensors', 'alerting', 'non-blocking'],
    problemStatement: 'Long 12-hour laboratory experiments suffer from sensor drift; aggressive error dialogs interrupt active data logging, while silent drift ruins test validity.',
    solutionSummary: 'Render a persistent hairline telemetry alert strip indicating estimated calibration drift ($\Delta < \pm 1.5\%$) with non-blocking one-click recalibration schedule.',
    tradeOffs: {
      advantages: [
        'Prevents experimental invalidation from unnoticed transducer drift',
        'Zero modal interruptions during active automated sweeps'
      ],
      disadvantages: [
        'Requires statistical drift modeling algorithm on host controller'
      ]
    },
    applicability: {
      purposes: ['RESEARCH_BENCH', 'INDUSTRIAL_TESTBED'],
      targetLevels: ['RESEARCHER', 'CERTIFIED_OPERATOR', 'UNDERGRADUATE'],
      minScreens: 1,
      requiredPeripherals: [],
      hardConstraints: []
    },
    primitiveIds: ['prim-time-series-strip', 'prim-state-annunciator-matrix'],
    authorOrSource: 'Sensor Calibration Metrology Group',
    createdAt: '2025-03-14',
    updatedAt: '2026-01-25',
    evidenceIds: ['evid-iso-9241-ergonomics-study-2023'],
    relations: [
      { sourceId: 'pat-graceful-hardware-drift-alerting', relation: 'USES', targetId: 'prim-time-series-strip' },
      { sourceId: 'pat-graceful-hardware-drift-alerting', relation: 'COMPOSES_WITH', targetId: 'pat-calibrated-telemetry-console' }
    ]
  },
  {
    id: 'pat-adjustable-split-workspace',
    type: 'pattern',
    title: 'Adjustable Split Workspace (CQNS-001 / PAT-001)',
    shortDescription: 'Draggable layout splitter separating primary work canvas and analytical telemetry panel with quick reset.',
    fullDescription: 'Divides the stand viewport into a primary active workspace and an analytical panel. An interactive divider allows continuous ratio adjustment (e.g. 70/30, 50/50, 30/70) and instant double-click reset to equal proportions, avoiding modal occlusions.',
    lifecycleStatus: 'IMPLEMENTED',
    domainCategory: 'layout',
    tags: ['workspace', 'splitter', 'layout', 'panels', 'cqns-001'],
    problemStatement: 'Stand operators switch between manipulating geometric/physical models and inspecting dense parameter streams; fixed single-column layouts cause visual clutter, while modal dialogs occlude context.',
    solutionSummary: 'Provide a dynamic dual-pane layout with a draggable split border that snaps to standardized ratios and restores equal division on double-click.',
    tradeOffs: {
      advantages: [
        'Adapts flexibly to varying operator focus (modeling vs deep analysis)',
        'Zero context loss from modal dialogs',
        'Fast double-click and keyboard reset to 50/50 split'
      ],
      disadvantages: [
        'Requires minimum 1024px horizontal resolution',
        'Requires responsive guards to prevent collapsing below minimum component footprint'
      ]
    },
    applicability: {
      purposes: ['RESEARCH_BENCH', 'STUDENT_LAB_EXPERIMENT', 'INDUSTRIAL_TESTBED'],
      targetLevels: ['UNDERGRADUATE', 'RESEARCHER', 'CERTIFIED_OPERATOR'],
      minScreens: 1,
      requiredPeripherals: ['Mouse or Touchpad'],
      hardConstraints: ['Viewport width >= 1024px']
    },
    primitiveIds: ['prim-split-console-layout'],
    authorOrSource: 'CQNS-001 (WorkspaceSplitter.tsx); 3D Geometry Stand (Persistent Viewport + Independent Sidebar)',
    createdAt: '2026-03-15',
    updatedAt: '2026-03-15',
    evidenceIds: ['evid-cqns-001-interface-analysis'],
    relations: [
      { sourceId: 'pat-adjustable-split-workspace', relation: 'USES', targetId: 'prim-split-console-layout' },
      { sourceId: 'pat-adjustable-split-workspace', relation: 'COMPOSES_WITH', targetId: 'pat-floating-context-palette' },
      { sourceId: 'pat-adjustable-split-workspace', relation: 'IMPLEMENTED_IN', targetId: 'impl-cqns-001-stand-interface' },
      { sourceId: 'pat-adjustable-split-workspace', relation: 'VERIFIED_BY', targetId: 'evid-cqns-001-interface-analysis' }
    ]
  },
  {
    id: 'pat-floating-context-palette',
    type: 'pattern',
    title: 'Floating Contextual Tool Palette (CQNS-001 / PAT-002)',
    shortDescription: 'Overlay toolbar repositionable across predefined anchor docking points with dynamic tool badges.',
    fullDescription: 'Renders an unobtrusive floating tool dock positioned over the active canvas. Operators can reposition the dock to predefined corner and edge anchors to clear sightlines during inspection, with visual badges indicating active modes and sub-tools.',
    lifecycleStatus: 'IMPLEMENTED',
    domainCategory: 'controls',
    tags: ['palette', 'toolbar', 'docking', 'floating', 'controls', 'cqns-001'],
    problemStatement: 'Fixed perimeter toolbars consume valuable viewport space and require long cursor excursions on high-resolution laboratory displays during continuous manipulation.',
    solutionSummary: 'Provide a lightweight, floating contextual palette that anchors to viewport corners and presents badges for active interaction modes.',
    tradeOffs: {
      advantages: [
        'Maximizes unobstructed central canvas inspection area',
        'Reduces cursor travel distance during continuous manipulation',
        'Clear mode and sub-tool state indication'
      ],
      disadvantages: [
        'May temporarily occlude underlying canvas objects if positioned poorly',
        'Requires anchor snap logic'
      ]
    },
    applicability: {
      purposes: ['RESEARCH_BENCH', 'STUDENT_LAB_EXPERIMENT'],
      targetLevels: ['UNDERGRADUATE', 'RESEARCHER'],
      minScreens: 1,
      requiredPeripherals: [],
      hardConstraints: []
    },
    primitiveIds: ['prim-crosshair-canvas', 'prim-stepper-scrubber'],
    authorOrSource: 'CQNS-001 (GeometryCanvas.tsx, ResearchPlaneControls.tsx)',
    createdAt: '2026-03-15',
    updatedAt: '2026-03-15',
    evidenceIds: ['evid-cqns-001-interface-analysis'],
    relations: [
      { sourceId: 'pat-floating-context-palette', relation: 'USES', targetId: 'prim-crosshair-canvas' },
      { sourceId: 'pat-floating-context-palette', relation: 'COMPOSES_WITH', targetId: 'pat-on-demand-object-discovery' },
      { sourceId: 'pat-floating-context-palette', relation: 'IMPLEMENTED_IN', targetId: 'impl-cqns-001-stand-interface' },
      { sourceId: 'pat-floating-context-palette', relation: 'VERIFIED_BY', targetId: 'evid-cqns-001-interface-analysis' }
    ]
  },
  {
    id: 'pat-experiment-history-state-restore',
    type: 'pattern',
    title: 'Experiment History with State Restoration (CQNS-001 / PAT-003)',
    shortDescription: 'Sequential snapshot timeline enabling instant rollback to previous experimental states and visual views.',
    fullDescription: 'Automatically captures an immutable chronological log of research states, parameter sweeps, and geometric configurations. Selecting any historic entry restores both the underlying data slice and its corresponding visual representation.',
    lifecycleStatus: 'IMPLEMENTED',
    domainCategory: 'guidance',
    tags: ['history', 'state-restoration', 'timeline', 'snapshot', 'parametric', 'cqns-001'],
    problemStatement: 'During exploratory laboratory sweeps, operators frequently test speculative parameters; without non-destructive history, reverting to previous stable states requires tedious manual re-entry.',
    solutionSummary: 'Maintain an indexed timeline of experimental states with instantaneous bidirectional rollback and visual state recreation.',
    tradeOffs: {
      advantages: [
        'Facilitates fearless parametric exploration and hypothesis testing',
        'Eliminates manual parameter transcription errors',
        'Allows direct side-by-side run comparison'
      ],
      disadvantages: [
        'Increases client memory footprint for large trial sets (>500 snapshots)',
        'Requires deterministic state serialization'
      ]
    },
    applicability: {
      purposes: ['RESEARCH_BENCH', 'STUDENT_LAB_EXPERIMENT', 'INDUSTRIAL_TESTBED'],
      targetLevels: ['UNDERGRADUATE', 'RESEARCHER', 'CERTIFIED_OPERATOR'],
      minScreens: 1,
      requiredPeripherals: [],
      hardConstraints: []
    },
    primitiveIds: ['prim-time-series-strip'],
    authorOrSource: 'CQNS-001 (GeometryResearchTable)',
    createdAt: '2026-03-15',
    updatedAt: '2026-03-15',
    evidenceIds: ['evid-cqns-001-interface-analysis'],
    relations: [
      { sourceId: 'pat-experiment-history-state-restore', relation: 'COMPOSES_WITH', targetId: 'pat-reference-experiment-dual-workspace' },
      { sourceId: 'pat-experiment-history-state-restore', relation: 'COMPOSES_WITH', targetId: 'pat-guided-student-experiment-stepper' },
      { sourceId: 'pat-experiment-history-state-restore', relation: 'IMPLEMENTED_IN', targetId: 'impl-cqns-001-stand-interface' },
      { sourceId: 'pat-experiment-history-state-restore', relation: 'VERIFIED_BY', targetId: 'evid-cqns-001-interface-analysis' }
    ]
  },
  {
    id: 'pat-tabular-object-inspector',
    type: 'pattern',
    title: 'Data Table with Object Inspector (CQNS-001 / PAT-004)',
    shortDescription: 'Summary parameter matrix linked to focused inspector detailing individual object characteristics and relations.',
    fullDescription: 'Combines a high-density summary table displaying primary sensor channels or geometric elements with a dedicated object inspector drawer that reveals deep diagnostic attributes, topological links, and calibration deltas upon row or item selection.',
    lifecycleStatus: 'IMPLEMENTED',
    domainCategory: 'telemetry',
    tags: ['table', 'inspector', 'master-detail', 'diagnostics', 'telemetry', 'cqns-001'],
    problemStatement: 'Complex laboratory stands with dozens of physical probes produce wide tables that overwhelm operators if all attributes are displayed in columns simultaneously.',
    solutionSummary: 'Keep the primary table concise with essential status indicators, while rendering complete structural relationships and historical deltas in a linked inspector panel.',
    tradeOffs: {
      advantages: [
        'High information density without horizontal scroll fatigue',
        'Contextual deep-dive for individual sensors or objects',
        'Direct attribute editing and inspection in one place'
      ],
      disadvantages: [
        'Requires coordinated selection state management',
        'Takes secondary layout space'
      ]
    },
    applicability: {
      purposes: ['RESEARCH_BENCH', 'INDUSTRIAL_TESTBED', 'STUDENT_LAB_EXPERIMENT'],
      targetLevels: ['UNDERGRADUATE', 'RESEARCHER', 'CERTIFIED_OPERATOR'],
      minScreens: 1,
      requiredPeripherals: [],
      hardConstraints: []
    },
    primitiveIds: ['prim-state-annunciator-matrix', 'prim-split-console-layout'],
    authorOrSource: 'CQNS-001 (SummaryTablePanel); 3D Geometry Stand (Local Detail Inspector, Collapsible Diagnostic Panel)',
    createdAt: '2026-03-15',
    updatedAt: '2026-03-15',
    evidenceIds: ['evid-cqns-001-interface-analysis'],
    relations: [
      { sourceId: 'pat-tabular-object-inspector', relation: 'USES', targetId: 'prim-state-annunciator-matrix' },
      { sourceId: 'pat-tabular-object-inspector', relation: 'COMPOSES_WITH', targetId: 'pat-dual-state-representation' },
      { sourceId: 'pat-tabular-object-inspector', relation: 'IMPLEMENTED_IN', targetId: 'impl-cqns-001-stand-interface' },
      { sourceId: 'pat-tabular-object-inspector', relation: 'VERIFIED_BY', targetId: 'evid-cqns-001-interface-analysis' }
    ]
  },
  {
    id: 'pat-reference-experiment-dual-workspace',
    type: 'pattern',
    title: 'Reference and Experiment Dual Workspaces (CQNS-001 / PAT-005)',
    shortDescription: 'Side-by-side decoupled workspaces: a locked reference baseline and an active mutable experimental area.',
    fullDescription: 'Provides two synchronized viewports: a locked reference plane displaying certified baseline parameters, and an active experimental plane for live parameter perturbation. Ensures the baseline remains immune to accidental edits while highlighting comparative deltas.',
    lifecycleStatus: 'IMPLEMENTED',
    domainCategory: 'layout',
    tags: ['dual-workspace', 'baseline', 'comparative-study', 'locking', 'reference', 'cqns-001'],
    problemStatement: 'Comparing modifications against a calibrated baseline often results in accidental overwrite of reference parameters when performed within a single workspace.',
    solutionSummary: 'Establish two parallel workspaces with explicit reference locking and delta-highlighting between the reference and experimental states.',
    tradeOffs: {
      advantages: [
        'Protects golden baseline calibration from accidental edits',
        'Immediate visual differential analysis (delta overlay)',
        'Supports one-click experimental clone creation'
      ],
      disadvantages: [
        'Doubles rendering overhead for 2D/3D Canvas stages',
        'Requires wider viewport (>= 1280px) or dual-screen displays'
      ]
    },
    applicability: {
      purposes: ['RESEARCH_BENCH', 'STUDENT_LAB_EXPERIMENT', 'INDUSTRIAL_TESTBED'],
      targetLevels: ['UNDERGRADUATE', 'RESEARCHER', 'CERTIFIED_OPERATOR'],
      minScreens: 1,
      requiredPeripherals: [],
      hardConstraints: ['Viewport width >= 1280px']
    },
    primitiveIds: ['prim-split-console-layout', 'prim-crosshair-canvas'],
    authorOrSource: 'CQNS-001 (ResearchPlaneControls.tsx, planeClone.ts)',
    createdAt: '2026-03-15',
    updatedAt: '2026-03-15',
    evidenceIds: ['evid-cqns-001-interface-analysis'],
    relations: [
      { sourceId: 'pat-reference-experiment-dual-workspace', relation: 'USES', targetId: 'prim-split-console-layout' },
      { sourceId: 'pat-reference-experiment-dual-workspace', relation: 'COMPOSES_WITH', targetId: 'pat-experiment-history-state-restore' },
      { sourceId: 'pat-reference-experiment-dual-workspace', relation: 'IMPLEMENTED_IN', targetId: 'impl-cqns-001-stand-interface' },
      { sourceId: 'pat-reference-experiment-dual-workspace', relation: 'VERIFIED_BY', targetId: 'evid-cqns-001-interface-analysis' }
    ]
  },
  {
    id: 'pat-dual-state-representation',
    type: 'pattern',
    title: 'Dual State Representation (CQNS-001 / PAT-006)',
    shortDescription: 'Dual-format state display: interactive diagnostic view for operators and portable structured passport for export/integration.',
    fullDescription: 'Maintains system state simultaneously in an interactive diagnostic representation optimized for human manipulation and an open, portable structured schema (e.g. JSON passport / PGS format) for automated verification, AI agents, and long-term archival.',
    lifecycleStatus: 'IMPLEMENTED',
    domainCategory: 'telemetry',
    tags: ['state-representation', 'passport', 'serialization', 'interoperability', 'telemetry', 'cqns-001'],
    problemStatement: 'Internal UI component state is often tightly coupled to GUI framework widgets, preventing automated batch audits, external simulation passes, or machine-readable export.',
    solutionSummary: 'Decouple state into an internal reactive view model and a standardized external passport schema updated synchronously.',
    tradeOffs: {
      advantages: [
        'Seamless integration with external analysis tools and AI agents',
        'Lossless session export and reproducible archival',
        'Human-readable passport audit trail'
      ],
      disadvantages: [
        'Requires adapter serialization overhead',
        'Dual-schema maintenance during schema migrations'
      ]
    },
    applicability: {
      purposes: ['RESEARCH_BENCH', 'INDUSTRIAL_TESTBED', 'STUDENT_LAB_EXPERIMENT'],
      targetLevels: ['UNDERGRADUATE', 'RESEARCHER', 'CERTIFIED_OPERATOR'],
      minScreens: 1,
      requiredPeripherals: [],
      hardConstraints: []
    },
    primitiveIds: ['prim-state-annunciator-matrix'],
    authorOrSource: 'CQNS-001 (PassportPanel.tsx, pgsAdapter.ts)',
    createdAt: '2026-03-15',
    updatedAt: '2026-03-15',
    evidenceIds: ['evid-cqns-001-interface-analysis'],
    relations: [
      { sourceId: 'pat-dual-state-representation', relation: 'COMPOSES_WITH', targetId: 'pat-tabular-object-inspector' },
      { sourceId: 'pat-dual-state-representation', relation: 'IMPLEMENTED_IN', targetId: 'impl-cqns-001-stand-interface' },
      { sourceId: 'pat-dual-state-representation', relation: 'VERIFIED_BY', targetId: 'evid-cqns-001-interface-analysis' }
    ]
  },
  {
    id: 'pat-decoupled-view-transform',
    type: 'pattern',
    title: 'Separate View Rotation from Model State (CQNS-001 / PAT-007)',
    shortDescription: 'Decoupled viewport camera orientation that preserves intrinsic geometric coordinates during inspection.',
    fullDescription: 'Separates camera orientation (rotation, pan, zoom) from the coordinate system of the physical or geometric model. Operators can inspect structures from arbitrary viewpoints without triggering re-computation or accidental mutation of model vertex data.',
    lifecycleStatus: 'IMPLEMENTED',
    domainCategory: 'controls',
    tags: ['viewport', 'camera', 'rotation', 'coordinate-system', 'controls', 'cqns-001'],
    problemStatement: 'In complex 2D/3D stand views, manipulating the viewing perspective can inadvertently mutate the underlying coordinate vectors or invalidate sensor alignment matrices.',
    solutionSummary: 'Enforce a strict architectural boundary where view projection transforms are applied strictly at the viewport compositor layer without affecting model coordinates.',
    tradeOffs: {
      advantages: [
        'Prevents accidental spatial coordinate mutations',
        'Permits rapid multi-angle inspection with instant reset to standard projection (0°, 90°, 180°)',
        'Coordinate readouts remain anchored to true stand frame'
      ],
      disadvantages: [
        'Requires dual coordinate tracking (world space vs screen space)'
      ]
    },
    applicability: {
      purposes: ['RESEARCH_BENCH', 'STUDENT_LAB_EXPERIMENT', 'INDUSTRIAL_TESTBED'],
      targetLevels: ['ALL_LEVELS'],
      minScreens: 1,
      requiredPeripherals: [],
      hardConstraints: []
    },
    primitiveIds: ['prim-crosshair-canvas'],
    authorOrSource: 'CQNS-001 (CanvasRotationBar.tsx); 3D Geometry Stand (Camera–Scale–Model Isolation)',
    createdAt: '2026-03-15',
    updatedAt: '2026-03-15',
    evidenceIds: ['evid-cqns-001-interface-analysis'],
    relations: [
      { sourceId: 'pat-decoupled-view-transform', relation: 'USES', targetId: 'prim-crosshair-canvas' },
      { sourceId: 'pat-decoupled-view-transform', relation: 'COMPOSES_WITH', targetId: 'pat-floating-context-palette' },
      { sourceId: 'pat-decoupled-view-transform', relation: 'IMPLEMENTED_IN', targetId: 'impl-cqns-001-stand-interface' },
      { sourceId: 'pat-decoupled-view-transform', relation: 'VERIFIED_BY', targetId: 'evid-cqns-001-interface-analysis' }
    ]
  },
  {
    id: 'pat-epistemic-status-labeling',
    type: 'pattern',
    title: 'Explicit Fact, Interpretation, and Hypothesis Labels (CQNS-001 / PAT-008)',
    shortDescription: 'Visual badges and metadata explicitly distinguishing confirmed facts, computed interpretations, and speculative hypotheses.',
    fullDescription: 'Classifies and marks every piece of information presented to the operator by its epistemic status: empirically verified Fact, derived/modeled Interpretation, or unverified Hypothesis. Prevents users from treating approximations as ground truth.',
    lifecycleStatus: 'INDEPENDENTLY_VERIFIED',
    domainCategory: 'guidance',
    tags: ['epistemic-status', 'facts', 'interpretations', 'hypotheses', 'pedagogy', 'guidance', 'cqns-001'],
    problemStatement: 'In educational and research stands, operators and students frequently confuse mathematical model assumptions or preliminary inferences with empirical sensor ground truth, drawing flawed conclusions.',
    solutionSummary: 'Tag all visual conclusions and telemetry layers with explicit, unboxed epistemic markers (FACT / INTERPRETATION / HYPOTHESIS) and clear methodological provenance.',
    tradeOffs: {
      advantages: [
        'Dramatically reduces student misinterpretations (by >95% in empirical trials)',
        'Clear traceability of computational derivations',
        'Fosters rigorous scientific inquiry and error prevention'
      ],
      disadvantages: [
        'Requires authoring classification tags for all derived outputs',
        'Adds visual metadata to telemetry cards'
      ]
    },
    applicability: {
      purposes: ['EDUCATIONAL_DEMO', 'STUDENT_LAB_EXPERIMENT', 'RESEARCH_BENCH'],
      targetLevels: ['SECONDARY_SCHOOL', 'UNDERGRADUATE', 'RESEARCHER'],
      minScreens: 1,
      requiredPeripherals: [],
      hardConstraints: []
    },
    primitiveIds: ['prim-state-annunciator-matrix'],
    authorOrSource: 'CQNS-001 (EducationPanel, DRA)',
    createdAt: '2026-03-15',
    updatedAt: '2026-03-15',
    evidenceIds: ['evid-cqns-001-interface-analysis'],
    relations: [
      { sourceId: 'pat-epistemic-status-labeling', relation: 'COMPOSES_WITH', targetId: 'pat-guided-student-experiment-stepper' },
      { sourceId: 'pat-epistemic-status-labeling', relation: 'COMPOSES_WITH', targetId: 'pat-tabular-object-inspector' },
      { sourceId: 'pat-epistemic-status-labeling', relation: 'IMPLEMENTED_IN', targetId: 'impl-cqns-001-stand-interface' },
      { sourceId: 'pat-epistemic-status-labeling', relation: 'VERIFIED_BY', targetId: 'evid-cqns-001-interface-analysis' }
    ]
  },
  {
    id: 'pat-on-demand-object-discovery',
    type: 'pattern',
    title: 'On-Demand Object Discovery & Proximity Snapping (CQNS-001 / PAT-009)',
    shortDescription: 'Transient proximity preview of potential objects and snap targets before explicit commit.',
    fullDescription: 'Renders potential geometric features, tangent points, or sensor snap targets dynamically as the operator hovers or nears an active region. The discovered feature is rendered as a lightweight ghost preview and only added to the permanent model upon explicit confirmation.',
    lifecycleStatus: 'IMPLEMENTED',
    domainCategory: 'controls',
    tags: ['proximity-snapping', 'discovery', 'ghost-preview', 'interaction', 'controls', 'cqns-001'],
    problemStatement: 'Displaying all potential intersections, snap points, or auxiliary guides simultaneously produces severe visual clutter; hiding them entirely makes precise alignment tedious.',
    solutionSummary: 'Show auxiliary candidates contextually based on cursor proximity, with clear ghost rendering that converts to permanent elements only on deliberate operator click/gesture.',
    tradeOffs: {
      advantages: [
        'Clutter-free viewport during normal scanning',
        'Sub-pixel alignment precision without manual coordinate math',
        'Transient preview prevents accidental model pollution'
      ],
      disadvantages: [
        'Requires continuous proximity hit-testing algorithm',
        'Needs touch-friendly proximity radius compensation on touchscreens'
      ]
    },
    applicability: {
      purposes: ['RESEARCH_BENCH', 'STUDENT_LAB_EXPERIMENT'],
      targetLevels: ['UNDERGRADUATE', 'RESEARCHER'],
      minScreens: 1,
      requiredPeripherals: ['Mouse or Stylus'],
      hardConstraints: []
    },
    primitiveIds: ['prim-crosshair-canvas'],
    authorOrSource: 'CQNS-001 (auxiliaryEngine.ts, findSnapTarget); 3D Geometry Stand (Contextual Visual Guides)',
    createdAt: '2026-03-15',
    updatedAt: '2026-03-15',
    evidenceIds: ['evid-cqns-001-interface-analysis'],
    relations: [
      { sourceId: 'pat-on-demand-object-discovery', relation: 'USES', targetId: 'prim-crosshair-canvas' },
      { sourceId: 'pat-on-demand-object-discovery', relation: 'COMPOSES_WITH', targetId: 'pat-preview-validate-commit' },
      { sourceId: 'pat-on-demand-object-discovery', relation: 'IMPLEMENTED_IN', targetId: 'impl-cqns-001-stand-interface' },
      { sourceId: 'pat-on-demand-object-discovery', relation: 'VERIFIED_BY', targetId: 'evid-cqns-001-interface-analysis' }
    ]
  },
  {
    id: 'pat-preview-validate-commit',
    type: 'pattern',
    title: 'Preview, Validate, Commit Constraint Guard (CQNS-001 / PAT-010)',
    shortDescription: 'Three-stage mutation guard validating proposed changes against invariants before final commitment.',
    fullDescription: 'Enforces a strict transaction pattern for stand configuration changes: 1. Preview (transient visualization of requested adjustment), 2. Validate (automated verification against geometric, physical, or safety invariants), 3. Commit (permanent application only if all constraints pass; otherwise descriptive rejection with visual conflict highlighting).',
    lifecycleStatus: 'INDEPENDENTLY_VERIFIED',
    domainCategory: 'safety',
    tags: ['validation', 'invariants', 'guardrail', 'safety', 'commit', 'cqns-001'],
    problemStatement: 'In complex multi-parameter stands, applying parameter changes directly can introduce non-physical topologies, mathematical singularities, or hardware limit violations before the operator notices.',
    solutionSummary: 'Intercept every mutation with an automated invariant validator (TopologyGuard) that renders a preview and blocks invalid states with clear violation diagnostics.',
    tradeOffs: {
      advantages: [
        'Eliminates model corruption and invalid hardware states',
        'Operator sees immediate visual feedback explaining why an adjustment violates constraints',
        'Zero accidental destructive commits'
      ],
      disadvantages: [
        'Slight interaction latency while validation algorithms evaluate',
        'Requires formal definition of invariant rules'
      ]
    },
    applicability: {
      purposes: ['RESEARCH_BENCH', 'STUDENT_LAB_EXPERIMENT', 'INDUSTRIAL_TESTBED', 'HAZARDOUS_FACILITY'],
      targetLevels: ['UNDERGRADUATE', 'RESEARCHER', 'CERTIFIED_OPERATOR'],
      minScreens: 1,
      requiredPeripherals: [],
      hardConstraints: []
    },
    primitiveIds: ['prim-state-annunciator-matrix', 'prim-emergency-estop-banner'],
    authorOrSource: 'CQNS-001 (TopologyGuard); 3D Geometry Stand (Constraint-Preserving Direct Manipulation)',
    createdAt: '2026-03-15',
    updatedAt: '2026-03-15',
    evidenceIds: ['evid-cqns-001-interface-analysis'],
    relations: [
      { sourceId: 'pat-preview-validate-commit', relation: 'USES', targetId: 'prim-state-annunciator-matrix' },
      { sourceId: 'pat-preview-validate-commit', relation: 'COMPOSES_WITH', targetId: 'pat-on-demand-object-discovery' },
      { sourceId: 'pat-preview-validate-commit', relation: 'COMPOSES_WITH', targetId: 'pat-dual-operator-safety-interlock' },
      { sourceId: 'pat-preview-validate-commit', relation: 'IMPLEMENTED_IN', targetId: 'impl-cqns-001-stand-interface' },
      { sourceId: 'pat-preview-validate-commit', relation: 'VERIFIED_BY', targetId: 'evid-cqns-001-interface-analysis' }
    ]
  },
  {
    id: 'pat-unified-semantic-selection',
    type: 'pattern',
    title: 'Unified Semantic Selection',
    shortDescription: 'Synchronous selection highlighting across scene, tables, and graphs for specific model objects.',
    fullDescription: 'Ensures that selecting a model object in the 3D scene instantaneously updates highlighting in all related interface views, including parameter tables, telemetry graphs, and property panels.',
    lifecycleStatus: 'PROPOSED',
    domainCategory: 'telemetry',
    tags: ['selection', 'sync', 'semantic', 'interaction', '3d-geometry'],
    problemStatement: 'In complex multi-view interfaces, identifying which table row corresponds to a specific 3D model feature requires repetitive manual lookup.',
    solutionSummary: 'Implement a centralized selection-state manager that broadcasts highlighted object identifiers to all registered interface subscribers.',
    tradeOffs: { advantages: ['Reduces cognitive overhead of lookup'], disadvantages: ['Requires unified identifier schema across all subsystems'] },
    applicability: { purposes: ['RESEARCH_BENCH', 'STUDENT_LAB_EXPERIMENT'], targetLevels: ['UNDERGRADUATE', 'RESEARCHER'], minScreens: 1, requiredPeripherals: [], hardConstraints: [] },
    primitiveIds: ['prim-crosshair-canvas'],
    authorOrSource: '3D Geometry Stand (Unified Semantic Selection)',
    createdAt: '2026-10-19',
    updatedAt: '2026-10-19',
    evidenceIds: [],
    relations: []
  },
  {
    id: 'pat-causal-impact-highlighting',
    type: 'pattern',
    title: 'Causal Impact Highlighting',
    shortDescription: 'Visual distinction between changed elements and those maintaining system state.',
    fullDescription: 'After an object or parameter modification, the interface immediately distinguishes elements affected by the change from those that remain in their previous stable state.',
    lifecycleStatus: 'PROPOSED',
    domainCategory: 'telemetry',
    tags: ['impact', 'causal', 'highlight', 'interaction', '3d-geometry'],
    problemStatement: 'Users struggle to discern the local consequences of parameter adjustments within complex, interdependent 3D models.',
    solutionSummary: 'Compute impact sets via dependency graph traversal and visually render differential overlays on affected components.',
    tradeOffs: { advantages: ['Clarifies causal relations in complex systems'], disadvantages: ['Requires maintainance of accurate dependency graphs'] },
    applicability: { purposes: ['RESEARCH_BENCH'], targetLevels: ['RESEARCHER'], minScreens: 1, requiredPeripherals: [], hardConstraints: [] },
    primitiveIds: ['prim-crosshair-canvas'],
    authorOrSource: '3D Geometry Stand (Causal Impact Highlighting)',
    createdAt: '2026-10-19',
    updatedAt: '2026-10-19',
    evidenceIds: [],
    relations: []
  },
  {
    id: 'pat-agent-gateway-ledger',
    type: 'pattern',
    title: 'Agent Gateway with Evidence Ledger',
    shortDescription: 'Structured interface for AI agent proposals with independent ledger of verification and audit trail.',
    fullDescription: 'Provides an explicit interface for AI agents to submit configuration proposals, separated from the user workspace, with an automated ledger recording all interactions, agent rationale, and system verification results.',
    lifecycleStatus: 'PROPOSED',
    domainCategory: 'guidance',
    tags: ['ai', 'agent', 'gateway', 'audit', '3d-geometry'],
    problemStatement: 'Direct integration of AI agent suggestions into the main viewport often masks the source of changes and hampers manual audit.',
    solutionSummary: 'Route all AI-suggested changes through a gatekeeper panel that logs rationales and records system validation results before any user-requested commit.',
    tradeOffs: { advantages: ['Transparency of AI contributions'], disadvantages: ['Adds intermediate workflow step'] },
    applicability: { purposes: ['RESEARCH_BENCH', 'STUDENT_LAB_EXPERIMENT'], targetLevels: ['UNDERGRADUATE', 'RESEARCHER'], minScreens: 1, requiredPeripherals: [], hardConstraints: [] },
    primitiveIds: ['prim-state-annunciator-matrix'],
    authorOrSource: '3D Geometry Stand (Agent Gateway with Evidence Ledger)',
    createdAt: '2026-10-19',
    updatedAt: '2026-10-19',
    evidenceIds: [],
    relations: []
  },
  {
    id: 'pat-live-object-health-indicator',
    type: 'pattern',
    title: 'Live Object Health Indicators',
    shortDescription: 'Compact UI badges indicating structural integrity and operational state of geometric model objects.',
    fullDescription: 'Displays real-time structural health or configuration status (e.g., normal, transformed, degenerate, constrained) for individual model objects via compact visual badges integrated directly into the workspace.',
    lifecycleStatus: 'PROPOSED',
    domainCategory: 'telemetry',
    tags: ['health', 'status', 'indicators', '3d-geometry'],
    problemStatement: 'Operators fail to detect structural issues or degenerate configurations until they break downstream analysis or simulation tasks.',
    solutionSummary: 'Monitor core structural invariants per object and render persistent, lightweight status badges (e.g. green for normal, red for degeneracy, amber for transformation warning).',
    tradeOffs: { advantages: ['Immediate visual feedback on model health'], disadvantages: ['Requires low-overhead health monitoring'] },
    applicability: { purposes: ['RESEARCH_BENCH'], targetLevels: ['RESEARCHER'], minScreens: 1, requiredPeripherals: [], hardConstraints: [] },
    primitiveIds: ['prim-state-annunciator-matrix'],
    authorOrSource: '3D Geometry Stand (Live Object Health Indicators)',
    createdAt: '2026-10-19',
    updatedAt: '2026-10-19',
    evidenceIds: [],
    relations: []
  },



  {
    id: 'pat-hierarchical-workspace-composition',
    type: 'pattern',
    title: 'Hierarchical Workspace Composition (BL-PAT-001)',
    shortDescription: 'Recursive subdivision of workspaces into manageable nested areas.',
    fullDescription: 'Allows defining complex workspace layouts through hierarchical splitting, similar to Blender screen areas.',
    lifecycleStatus: 'PROPOSED',
    domainCategory: 'layout',
    tags: ['blender', 'workspace', 'layout', 'hierarchical'],
    problemStatement: 'Complex stand interfaces require varied layouts that are hard to manage as flat structures.',
    solutionSummary: 'Implement a recursive area-splitting engine where each area can host either content or further subdivisions.',
    tradeOffs: { advantages: ['Highly flexible layout'], disadvantages: ['Complexity in management'] },
    applicability: { purposes: ['RESEARCH_BENCH'], targetLevels: ['RESEARCHER'], minScreens: 1, requiredPeripherals: [], hardConstraints: [] },
    primitiveIds: ['prim-split-console-layout'],
    authorOrSource: 'Blender (Hierarchical Workspace Composition)',
    createdAt: '2026-10-19',
    updatedAt: '2026-10-19',
    evidenceIds: [],
    relations: [{ sourceId: 'pat-hierarchical-workspace-composition', relation: 'USES', targetId: 'prim-split-console-layout' }]
  },
  {
    id: 'pat-pluggable-editor-in-stable-area',
    type: 'pattern',
    title: 'Pluggable Editor in Stable Area (BL-PAT-002)',
    shortDescription: 'Area-based layout where any editor can be switched into any area.',
    fullDescription: 'Each area in the workspace can hold any available type of editor, allowing users to tailor their interface to the task.',
    lifecycleStatus: 'PROPOSED',
    domainCategory: 'layout',
    tags: ['blender', 'editor', 'layout'],
    problemStatement: 'Fixed area roles limit user flexibility in designing task-specific interfaces.',
    solutionSummary: 'Define areas as content-agnostic containers that can host a pluggable set of editors.',
    tradeOffs: { advantages: ['Maximum UI flexibility'], disadvantages: ['Can lead to suboptimal layouts'] },
    applicability: { purposes: ['RESEARCH_BENCH'], targetLevels: ['RESEARCHER'], minScreens: 1, requiredPeripherals: [], hardConstraints: [] },
    primitiveIds: ['prim-split-console-layout'],
    authorOrSource: 'Blender (Pluggable Editor in Stable Area)',
    createdAt: '2026-10-19',
    updatedAt: '2026-10-19',
    evidenceIds: [],
    relations: [{ sourceId: 'pat-pluggable-editor-in-stable-area', relation: 'USES', targetId: 'prim-split-console-layout' }]
  },
  {
    id: 'pat-task-oriented-workspace-profiles',
    type: 'pattern',
    title: 'Task-Oriented Workspace Profiles (BL-PAT-003)',
    shortDescription: 'Predefined layout profiles for specific workflows.',
    fullDescription: 'Enables quick switching between optimized layouts designed for specific tasks (e.g., Modeling, Analysis, Recording).',
    lifecycleStatus: 'PROPOSED',
    domainCategory: 'layout',
    tags: ['blender', 'profiles', 'tasks'],
    problemStatement: 'Switching between different activities often requires manual re-layouting.',
    solutionSummary: 'Provide persistent named workspace profiles that instantly reconfigure the area layout and editor types.',
    tradeOffs: { advantages: ['Fast workflow switching'], disadvantages: ['Requires managing multiple profile states'] },
    applicability: { purposes: ['RESEARCH_BENCH'], targetLevels: ['RESEARCHER'], minScreens: 1, requiredPeripherals: [], hardConstraints: [] },
    primitiveIds: ['prim-split-console-layout'],
    authorOrSource: 'Blender (Task-Oriented Workspace Profiles)',
    createdAt: '2026-10-19',
    updatedAt: '2026-10-19',
    evidenceIds: [],
    relations: [{ sourceId: 'pat-task-oriented-workspace-profiles', relation: 'USES', targetId: 'prim-split-console-layout' }]
  },
  {
    id: 'pat-contextual-direct-manipulation-gizmos',
    type: 'pattern',
    title: 'Direct Manipulation with Contextual Gizmos (BL-PAT-004)',
    shortDescription: 'In-viewport interaction tools based on selected context.',
    fullDescription: 'Uses specialized gizmos (e.g., move, rotate, scale) that appear directly over the object of interest.',
    lifecycleStatus: 'PROPOSED',
    domainCategory: 'controls',
    tags: ['blender', 'gizmo', 'interaction'],
    problemStatement: 'Manipulating objects solely via menus is indirect and slow.',
    solutionSummary: 'Provide interactive, contextual gizmos for direct viewport manipulation.',
    tradeOffs: { advantages: ['Intuitive manipulation'], disadvantages: ['Gizmos can clutter the view'] },
    applicability: { purposes: ['RESEARCH_BENCH'], targetLevels: ['RESEARCHER'], minScreens: 1, requiredPeripherals: [], hardConstraints: [] },
    primitiveIds: ['prim-crosshair-canvas'],
    authorOrSource: 'Blender (Direct Manipulation with Contextual Gizmos)',
    createdAt: '2026-10-19',
    updatedAt: '2026-10-19',
    evidenceIds: [],
    relations: [{ sourceId: 'pat-contextual-direct-manipulation-gizmos', relation: 'USES', targetId: 'prim-crosshair-canvas' }]
  },
  {
    id: 'pat-cross-editor-selection-sync',
    type: 'pattern',
    title: 'Cross-Editor Selection Synchronization (BL-PAT-005)',
    shortDescription: 'Selection persistence across different editor views.',
    fullDescription: 'When an object is selected in one editor, it is immediately selected/highlighted in all other active editors.',
    lifecycleStatus: 'IMPLEMENTED',
    domainCategory: 'telemetry',
    tags: ['blender', 'selection', 'sync'],
    problemStatement: 'Operators struggle to maintain context when selection is editor-local.',
    solutionSummary: 'Centralize selection state management across all editors.',
    tradeOffs: { advantages: ['Coherent state perception'], disadvantages: ['Performance impact on large datasets'] },
    applicability: { purposes: ['RESEARCH_BENCH'], targetLevels: ['RESEARCHER'], minScreens: 1, requiredPeripherals: [], hardConstraints: [] },
    primitiveIds: ['prim-crosshair-canvas'],
    authorOrSource: 'Blender (Cross-Editor Selection Synchronization); Atlas (Unified Semantic Selection)',
    createdAt: '2026-10-19',
    updatedAt: '2026-10-19',
    evidenceIds: [],
    relations: [
        { sourceId: 'pat-cross-editor-selection-sync', relation: 'ALTERNATIVE_TO', targetId: 'pat-unified-semantic-selection' },
        { sourceId: 'pat-cross-editor-selection-sync', relation: 'SPECIALIZES', targetId: 'pat-unified-semantic-selection' }
    ]
  },
  {
    id: 'pat-data-properties-tool-separation',
    type: 'pattern',
    title: 'Separate Tools from Data Properties (BL-PAT-006)',
    shortDescription: 'Division between interaction tools and object data properties.',
    fullDescription: 'Keeps tools that act on data separate from the data properties themselves to reduce viewport clutter.',
    lifecycleStatus: 'PROPOSED',
    domainCategory: 'controls',
    tags: ['blender', 'separation', 'properties'],
    problemStatement: 'Mixing tools and properties leads to overcrowded interfaces.',
    solutionSummary: 'Maintain a clear separation in the UI between action tools and object data property panels.',
    tradeOffs: { advantages: ['Cleaner workspace'], disadvantages: ['Requires extra navigation'] },
    applicability: { purposes: ['RESEARCH_BENCH'], targetLevels: ['RESEARCHER'], minScreens: 1, requiredPeripherals: [], hardConstraints: [] },
    primitiveIds: ['prim-split-console-layout'],
    authorOrSource: 'Blender (Separate Tools from Data Properties)',
    createdAt: '2026-10-19',
    updatedAt: '2026-10-19',
    evidenceIds: [],
    relations: [{ sourceId: 'pat-data-properties-tool-separation', relation: 'USES', targetId: 'prim-split-console-layout' }]
  },
  {
    id: 'pat-typed-node-socket-graph',
    type: 'pattern',
    title: 'Typed Node-and-Socket Graph (BL-PAT-007)',
    shortDescription: 'Directed graph interface with type-safe socket connections.',
    fullDescription: 'Uses a node-based graph interface where typed data (e.g., color, value, vector) can only be connected via matching input/output sockets.',
    lifecycleStatus: 'PROPOSED',
    domainCategory: 'telemetry',
    tags: ['blender', 'node', 'graph', 'type-safe'],
    problemStatement: 'Connecting arbitrary node outputs to arbitrary inputs leads to runtime failures in engineering workflows.',
    solutionSummary: 'Enforce type-safety on graph connections using socket type-checking.',
    tradeOffs: { advantages: ['Prevents invalid connections'], disadvantages: ['Stricter workflow definition'] },
    applicability: { purposes: ['RESEARCH_BENCH'], targetLevels: ['RESEARCHER'], minScreens: 1, requiredPeripherals: [], hardConstraints: [] },
    primitiveIds: ['prim-split-console-layout'],
    authorOrSource: 'Blender (Typed Node-and-Socket Graph)',
    createdAt: '2026-10-19',
    updatedAt: '2026-10-19',
    evidenceIds: [],
    relations: [{ sourceId: 'pat-typed-node-socket-graph', relation: 'USES', targetId: 'prim-split-console-layout' }]
  },
  {
    id: 'pat-reversible-area-maximization',
    type: 'pattern',
    title: 'Reversible Area Maximization (BL-PAT-008)',
    shortDescription: 'Quick full-screen view for specific editors.',
    fullDescription: 'Allows any area/editor to instantly maximize to full workspace size and be restored, similar to Blender area maximization.',
    lifecycleStatus: 'PROPOSED',
    domainCategory: 'layout',
    tags: ['blender', 'maximize', 'layout'],
    problemStatement: 'Limited screen real-estate hampers detailed editor work.',
    solutionSummary: 'Enable a fast, reversible toggle to maximize any editor area.',
    tradeOffs: { advantages: ['Focused workspace'], disadvantages: ['Loses overall context'] },
    applicability: { purposes: ['RESEARCH_BENCH'], targetLevels: ['RESEARCHER'], minScreens: 1, requiredPeripherals: [], hardConstraints: [] },
    primitiveIds: ['prim-split-console-layout'],
    authorOrSource: 'Blender (Reversible Area Maximization)',
    createdAt: '2026-10-19',
    updatedAt: '2026-10-19',
    evidenceIds: [],
    relations: [{ sourceId: 'pat-reversible-area-maximization', relation: 'USES', targetId: 'prim-split-console-layout' }]
  },
  {
    id: 'pat-searchable-operator-invocation',
    type: 'pattern',
    title: 'Searchable Operator Invocation (BL-PAT-009)',
    shortDescription: 'Quick-search mechanism for triggering system operations.',
    fullDescription: 'Provides a global search-as-you-type input to find and execute any operator or action in the system.',
    lifecycleStatus: 'PROPOSED',
    domainCategory: 'controls',
    tags: ['blender', 'search', 'operator'],
    problemStatement: 'Large command sets are difficult to navigate via standard menus.',
    solutionSummary: 'Implement a global command search utility.',
    tradeOffs: { advantages: ['Faster command access'], disadvantages: ['Requires command indexing'] },
    applicability: { purposes: ['RESEARCH_BENCH'], targetLevels: ['RESEARCHER'], minScreens: 1, requiredPeripherals: [], hardConstraints: [] },
    primitiveIds: ['prim-state-annunciator-matrix'],
    authorOrSource: 'Blender (Searchable Operator Invocation)',
    createdAt: '2026-10-19',
    updatedAt: '2026-10-19',
    evidenceIds: [],
    relations: [{ sourceId: 'pat-searchable-operator-invocation', relation: 'USES', targetId: 'prim-state-annunciator-matrix' }]
  },
  {
    id: 'pat-consistent-editor-anatomy',
    type: 'pattern',
    title: 'Consistent Editor Anatomy (BL-PAT-010)',
    shortDescription: 'Standardized layout structure across different editors.',
    fullDescription: 'Ensures all editors share a consistent internal structure (e.g., header, workspace, toolbar, property panel).',
    lifecycleStatus: 'PROPOSED',
    domainCategory: 'layout',
    tags: ['blender', 'anatomy', 'consistent'],
    problemStatement: 'Inconsistent editor layouts increase cognitive load for operators.',
    solutionSummary: 'Define and enforce a consistent architectural template for all editor components.',
    tradeOffs: { advantages: ['Reduced cognitive load'], disadvantages: ['May limit specialized UI needs'] },
    applicability: { purposes: ['RESEARCH_BENCH'], targetLevels: ['RESEARCHER'], minScreens: 1, requiredPeripherals: [], hardConstraints: [] },
    primitiveIds: ['prim-split-console-layout'],
    authorOrSource: 'Blender (Consistent Editor Anatomy)',
    createdAt: '2026-10-19',
    updatedAt: '2026-10-19',
    evidenceIds: [],
    relations: [{ sourceId: 'pat-consistent-editor-anatomy', relation: 'USES', targetId: 'prim-split-console-layout' }]
  },
  {
    id: 'pat-deterministic-reasoning-anchor',
    type: 'pattern',
    title: 'Deterministic Reasoning Anchor (DRA)',
    shortDescription: 'Agent reasoning pattern where the agent autonomously identifies a formalizable problem fragment, decides whether external deterministic verification is warranted, projects it into a tool, and separates tool-verified facts from agent interpretation and hypothesis.',
    fullDescription: 'A reasoning pattern in which an agent autonomously identifies a formalizable fragment of an applied problem, decides whether external deterministic verification is warranted, projects that fragment into a tool\'s formal input language, obtains a reproducible result, separates the tool-verified fact from agent interpretation and hypothesis, and updates its subsequent reasoning accordingly.',
    lifecycleStatus: 'SPECIFIED',
    domainCategory: 'guidance',
    tags: ['reasoning', 'dra', 'epistemic', 'verification', 'external-tools', 'agent-logic'],
    problemStatement: 'Agents using generic tool calling lack autonomous judgment on whether task fragments require external deterministic verification versus direct reasoning, leading to unverified hallucinations or unnecessary tool overhead.',
    solutionSummary: 'Implement the 7-stage Deterministic Reasoning Anchor cycle: Problem -> Structural Recognition -> Applicability Decision (with intentional refusal) -> Semantic Projection -> Deterministic Operation -> Epistemic Separation (Tool Fact vs Agent Interpretation vs Agent Hypothesis) -> Reasoning Update.',
    tradeOffs: {
      advantages: [
        'Strict epistemic separation of verified facts from agent interpretation and hypothesis',
        'Enables principled refusal of unnecessary tool calls',
        'Provides robust externalized anchors for complex agent reasoning'
      ],
      disadvantages: [
        'Requires structured formalizable problem fragments',
        'Adds metacognitive overhead to agent reasoning cycles'
      ]
    },
    applicability: {
      purposes: ['RESEARCH_BENCH', 'STUDENT_LAB_EXPERIMENT', 'INDUSTRIAL_TESTBED', 'EDUCATIONAL_DEMO', 'HAZARDOUS_FACILITY'],
      targetLevels: ['UNDERGRADUATE', 'RESEARCHER', 'CERTIFIED_OPERATOR', 'ALL_LEVELS'],
      minScreens: 1,
      requiredPeripherals: [],
      hardConstraints: []
    },
    primitiveIds: ['prim-split-console-layout', 'prim-state-annunciator-matrix'],
    authorOrSource: 'Atlas x SOL-2 Architectural Research Group',
    createdAt: '2026-03-01',
    updatedAt: '2026-03-20',
    evidenceIds: [],
    relations: [
      { sourceId: 'pat-deterministic-reasoning-anchor', relation: 'USES', targetId: 'prim-split-console-layout', rationale: 'DRA reasoning requires a structured layout console to display epistemic separation states.' },
      { sourceId: 'pat-deterministic-reasoning-anchor', relation: 'COMPOSES_WITH', targetId: 'pat-epistemic-status-labeling', rationale: 'Complements explicit fact, interpretation, and hypothesis labeling.' }
    ]
  },
];

export const CANONICAL_CONFIGURATIONS: ConfigurationEntity[] = [
  {
    id: 'cfg-aerodynamics-wind-tunnel-edustand',
    type: 'configuration',
    title: 'Subsonic Wind Tunnel Educational Interface',
    shortDescription: 'Validated configuration for educational wind tunnels: guided angle-of-attack sweep, Pitot telemetry, lift/drag polar canvas.',
    fullDescription: 'Turn-key interface configuration assembled specifically for university fluid dynamics laboratory stands. Features guided phase transitions, bound stepper sliders for fan RPM and airfoil pitch, and automated CSV export.',
    lifecycleStatus: 'INDEPENDENTLY_VERIFIED',
    domainCategory: 'layout',
    tags: ['wind-tunnel', 'aerodynamics', 'education', 'undergraduate', 'pitot'],
    targetStand: {
      standName: 'Aerolab Subsonic Educational Wind Tunnel WT-300',
      purpose: 'STUDENT_LAB_EXPERIMENT',
      targetLevel: 'UNDERGRADUATE',
      screenSetup: 'Single 1920x1080 24-inch Industrial Monitor',
      peripherals: ['USB Pitot Manometer', 'Angle Stepper Motor Controller', 'Safety Enclosure Interlock']
    },
    selectedPatterns: ['pat-guided-student-experiment-stepper', 'pat-calibrated-telemetry-console'],
    selectedPrimitives: [
      'prim-split-console-layout',
      'prim-emergency-estop-banner',
      'prim-time-series-strip',
      'prim-calibrated-gauge-dial',
      'prim-stepper-scrubber',
      'prim-crosshair-canvas'
    ],
    layoutRecipe: {
      screenLayout: 'asymmetric-split',
      panelArrangement: [
        { zone: 'top-ribbon', componentId: 'prim-emergency-estop-banner', proportion: 'h-12' },
        { zone: 'left-rail', componentId: 'prim-stepper-scrubber', proportion: 'w-80' },
        { zone: 'center-stage', componentId: 'prim-crosshair-canvas', proportion: 'flex-1' },
        { zone: 'bottom-tray', componentId: 'prim-time-series-strip', proportion: 'h-64' }
      ]
    },
    safetyLevel: 'INTERLOCKED',
    authorOrSource: 'Higher Engineering Pedagogy Consortium & Aerolab',
    createdAt: '2025-02-15',
    updatedAt: '2026-03-01',
    evidenceIds: ['evid-aero-lab-student-trials-report', 'evid-iso-9241-ergonomics-study-2023'],
    relations: [
      { sourceId: 'cfg-aerodynamics-wind-tunnel-edustand', relation: 'USES', targetId: 'pat-guided-student-experiment-stepper' },
      { sourceId: 'cfg-aerodynamics-wind-tunnel-edustand', relation: 'USES', targetId: 'pat-calibrated-telemetry-console' },
      { sourceId: 'cfg-aerodynamics-wind-tunnel-edustand', relation: 'IMPLEMENTED_IN', targetId: 'impl-aerolab-v2-web-console' },
      { sourceId: 'cfg-aerodynamics-wind-tunnel-edustand', relation: 'VERIFIED_BY', targetId: 'evid-aero-lab-student-trials-report' }
    ]
  },
  {
    id: 'cfg-geometry-research-lab-view',
    type: 'configuration',
    title: 'Research Lab View (Geometry Reasoning Stand)',
    shortDescription: 'Configuration for geometry research and observation.',
    fullDescription: 'Supports geometry exploration and recording of experimental observations using split-view layout and history-aware command dispatch.',
    lifecycleStatus: 'PROPOSED',
    domainCategory: 'layout',
    tags: ['geometry', 'research', 'analysis'],
    targetStand: {
      standName: 'Geometry Reasoning Stand',
      purpose: 'RESEARCH_BENCH',
      targetLevel: 'RESEARCHER',
      screenSetup: 'Standard Dual Monitor',
      peripherals: []
    },
    selectedPatterns: ['pat-adjustable-split-workspace', 'pat-experiment-history-state-restore'],
    selectedPrimitives: ['prim-crosshair-canvas'],
    layoutRecipe: { screenLayout: 'asymmetric-split', panelArrangement: [] },
    safetyLevel: 'STANDARD',
    authorOrSource: 'Geometry Reasoning Stand',
    createdAt: '2026-10-19',
    updatedAt: '2026-10-19',
    evidenceIds: [],
    relations: []
  },
  {
    id: 'cfg-geometry-school-classroom-view',
    type: 'configuration',
    title: 'School Classroom View (Geometry Reasoning Stand)',
    shortDescription: 'Configuration for educational geometry construction.',
    fullDescription: 'Supports educational geometry construction and exploration with simplified mode-driven interface.',
    lifecycleStatus: 'PROPOSED',
    domainCategory: 'layout',
    tags: ['geometry', 'education', 'construction'],
    targetStand: {
      standName: 'Geometry Reasoning Stand',
      purpose: 'EDUCATIONAL_DEMO',
      targetLevel: 'SECONDARY_SCHOOL',
      screenSetup: 'Single Monitor',
      peripherals: []
    },
    selectedPatterns: ['pat-guided-student-experiment-stepper'],
    selectedPrimitives: ['prim-crosshair-canvas'],
    layoutRecipe: { screenLayout: 'single-pane', panelArrangement: [] },
    safetyLevel: 'STANDARD',
    authorOrSource: 'Geometry Reasoning Stand',
    createdAt: '2026-10-19',
    updatedAt: '2026-10-19',
    evidenceIds: [],
    relations: []
  },
  {
    id: 'cfg-bioreactor-fermentation-research',
    type: 'configuration',
    title: 'Research Chemostat Bioreactor Console',
    shortDescription: 'Validated configuration for continuous fermentation: DO2/pH regulation, peristaltic pump scrubbers, and 24h drift tracking.',
    fullDescription: 'Precision interface for microbiological and biotech research benches. Emphasizes slow-drift trend monitoring, multi-channel peristaltic pump control, and non-blocking sensor drift alerts.',
    lifecycleStatus: 'TESTED',
    domainCategory: 'telemetry',
    tags: ['bioreactor', 'chemostat', 'ph', 'dissolved-oxygen', 'biotech'],
    targetStand: {
      standName: 'BioFlow Research Fermentor Rig 5L',
      purpose: 'RESEARCH_BENCH',
      targetLevel: 'RESEARCHER',
      screenSetup: 'Single 1080p Touch Monitor (15.6-inch)',
      peripherals: ['Serial RS-485 Modbus pH/DO2 probes', 'Quad Peristaltic Pump Controller']
    },
    selectedPatterns: ['pat-calibrated-telemetry-console', 'pat-graceful-hardware-drift-alerting'],
    selectedPrimitives: [
      'prim-split-console-layout',
      'prim-time-series-strip',
      'prim-calibrated-gauge-dial',
      'prim-stepper-scrubber',
      'prim-state-annunciator-matrix'
    ],
    layoutRecipe: {
      screenLayout: 'asymmetric-split',
      panelArrangement: [
        { zone: 'left-rail', componentId: 'prim-stepper-scrubber', proportion: 'w-72' },
        { zone: 'center-stage', componentId: 'prim-time-series-strip', proportion: 'flex-1' },
        { zone: 'bottom-tray', componentId: 'prim-state-annunciator-matrix', proportion: 'h-48' }
      ]
    },
    safetyLevel: 'STANDARD',
    authorOrSource: 'Bioprocess Instrumentation Lab',
    createdAt: '2025-03-01',
    updatedAt: '2026-02-18',
    evidenceIds: ['evid-iso-9241-ergonomics-study-2023'],
    relations: [
      { sourceId: 'cfg-bioreactor-fermentation-research', relation: 'USES', targetId: 'pat-calibrated-telemetry-console' },
      { sourceId: 'cfg-bioreactor-fermentation-research', relation: 'USES', targetId: 'pat-graceful-hardware-drift-alerting' },
      { sourceId: 'cfg-bioreactor-fermentation-research', relation: 'IMPLEMENTED_IN', targetId: 'impl-biotech-lab-touch-rig' }
    ]
  },
  {
    id: 'cfg-high-voltage-pulse-lab',
    type: 'configuration',
    title: 'High-Voltage Pulse Generator Hazardous Testbed',
    shortDescription: 'Dual-operator interlocked configuration for pulsed discharge stands with microsecond transient oscilloscope inspection.',
    fullDescription: 'Mission-critical interface configuration for capacitor bank discharge benches. Enforces strict hardware interlock matrices, dual-key verification before charging, and instantaneous oscilloscope dump.',
    lifecycleStatus: 'INDEPENDENTLY_VERIFIED',
    domainCategory: 'safety',
    tags: ['high-voltage', 'pulse', 'safety', 'dual-operator', 'oscilloscope'],
    targetStand: {
      standName: 'PulsePower 50kV Capacitor Discharge Stand',
      purpose: 'HAZARDOUS_FACILITY',
      targetLevel: 'CERTIFIED_OPERATOR',
      screenSetup: 'Dual 24-inch Monitors + Dedicated Emergency Mushroom Button',
      peripherals: ['50kV Optical Isolation Trigger', 'Interlocked Enclosure Cage', 'Digitizing Oscilloscope 1GHz']
    },
    selectedPatterns: ['pat-dual-operator-safety-interlock', 'pat-high-rate-signal-inspection'],
    selectedPrimitives: [
      'prim-emergency-estop-banner',
      'prim-state-annunciator-matrix',
      'prim-time-series-strip',
      'prim-multichannel-waterfall',
      'prim-split-console-layout'
    ],
    layoutRecipe: {
      screenLayout: 'multi-monitor-sync',
      panelArrangement: [
        { zone: 'monitor-1-safety-ribbon', componentId: 'prim-emergency-estop-banner', proportion: 'w-full h-14' },
        { zone: 'monitor-1-annunciator', componentId: 'prim-state-annunciator-matrix', proportion: 'w-full h-64' },
        { zone: 'monitor-2-oscilloscope', componentId: 'prim-time-series-strip', proportion: 'flex-1' }
      ]
    },
    safetyLevel: 'HAZARD_RATED',
    authorOrSource: 'Pulsed Power Laboratory Consortium',
    createdAt: '2024-12-10',
    updatedAt: '2026-03-02',
    evidenceIds: ['evid-high-voltage-safety-audit-2024'],
    relations: [
      { sourceId: 'cfg-high-voltage-pulse-lab', relation: 'USES', targetId: 'pat-dual-operator-safety-interlock' },
      { sourceId: 'cfg-high-voltage-pulse-lab', relation: 'USES', targetId: 'pat-high-rate-signal-inspection' },
      { sourceId: 'cfg-high-voltage-pulse-lab', relation: 'IMPLEMENTED_IN', targetId: 'impl-pulse-power-rig-qt' },
      { sourceId: 'cfg-high-voltage-pulse-lab', relation: 'VERIFIED_BY', targetId: 'evid-high-voltage-safety-audit-2024' }
    ]
  },
  {
    id: 'cfg-cqns-001-geometric-research-stand',
    type: 'configuration',
    title: 'CQNS-001 Geometric Research Stand Interface',
    shortDescription: 'Validated interface configuration for interactive geometric modeling, comparative dual workspaces, and invariant-guarded analysis.',
    fullDescription: 'Comprehensive interface recipe assembled for the CQNS-001 geometric and parametric research stand. Combines an adjustable split workspace, floating tool palettes, dual reference/experiment viewports, state rollback history, and TopologyGuard invariant validation.',
    lifecycleStatus: 'IMPLEMENTED',
    domainCategory: 'layout',
    tags: ['cqns-001', 'geometry', 'research-stand', 'dual-workspace', 'topology-guard'],
    targetStand: {
      standName: 'CQNS-001 Interactive Geometric Research Stand',
      purpose: 'RESEARCH_BENCH',
      targetLevel: 'RESEARCHER',
      screenSetup: 'Single 1440p / 4K Precision Display (or Dual 1080p)',
      peripherals: ['Precision Stylus / Mouse', 'Numeric Keypad', 'Hardware Calibration Rig']
    },
    selectedPatterns: [
      'pat-adjustable-split-workspace',
      'pat-floating-context-palette',
      'pat-experiment-history-state-restore',
      'pat-tabular-object-inspector',
      'pat-reference-experiment-dual-workspace',
      'pat-dual-state-representation',
      'pat-decoupled-view-transform',
      'pat-epistemic-status-labeling',
      'pat-on-demand-object-discovery',
      'pat-preview-validate-commit'
    ],
    selectedPrimitives: [
      'prim-split-console-layout',
      'prim-crosshair-canvas',
      'prim-state-annunciator-matrix',
      'prim-time-series-strip',
      'prim-stepper-scrubber'
    ],
    layoutRecipe: {
      screenLayout: 'asymmetric-split',
      panelArrangement: [
        { zone: 'center-stage', componentId: 'prim-crosshair-canvas', proportion: 'w-7/12 flex-1' },
        { zone: 'right-analysis-rail', componentId: 'prim-split-console-layout', proportion: 'w-5/12' },
        { zone: 'bottom-inspector', componentId: 'prim-state-annunciator-matrix', proportion: 'h-48' }
      ]
    },
    safetyLevel: 'STANDARD',
    authorOrSource: 'CQNS-001 Interface Engineering Group',
    createdAt: '2026-03-15',
    updatedAt: '2026-03-15',
    evidenceIds: ['evid-cqns-001-interface-analysis'],
    relations: [
      { sourceId: 'cfg-cqns-001-geometric-research-stand', relation: 'USES', targetId: 'pat-adjustable-split-workspace' },
      { sourceId: 'cfg-cqns-001-geometric-research-stand', relation: 'USES', targetId: 'pat-preview-validate-commit' },
      { sourceId: 'cfg-cqns-001-geometric-research-stand', relation: 'IMPLEMENTED_IN', targetId: 'impl-cqns-001-stand-interface' },
      { sourceId: 'cfg-cqns-001-geometric-research-stand', relation: 'VERIFIED_BY', targetId: 'evid-cqns-001-interface-analysis' }
    ]
  }
];

export const CANONICAL_IMPLEMENTATIONS: ImplementationEntity[] = [
  {
    id: 'impl-aerolab-v2-web-console',
    type: 'implementation',
    title: 'AeroLab Web Console (React 19 + Canvas 2D)',
    shortDescription: 'Production web SPA fronting wind tunnel DAQ over binary WebSockets with zero-latency buffer.',
    fullDescription: 'Production client deployed across 6 university wind tunnel installations. Connects to National Instruments DAQ hardware via an Express WebSocket proxy.',
    lifecycleStatus: 'TESTED',
    domainCategory: 'layout',
    tags: ['react', 'websocket', 'canvas', 'aerodynamics', 'production'],
    techStack: ['React 19', 'TypeScript', 'HTML5 Canvas 2D', 'WebSockets', 'Tailwind CSS'],
    targetEnvironment: 'Web SPA',
    verifiedInHardware: true,
    hardwareStandName: 'Aerolab Subsonic Educational Wind Tunnel WT-300',
    sourceRepoUri: 'https://github.com/atlas-engineering/impl-aerolab-v2-web-console',
    codeSample: `// Synchronized telemetry frame ingestion loop
const onWebSocketMessage = (event: MessageEvent) => {
  const frame = parseBinaryTelemetryFrame(event.data);
  timeSeriesCanvasRenderer.pushPoint(frame.timestamp, frame.pitotPressure);
  gaugeDialRenderer.updateAngle(frame.angleDegrees);
};`,
    authorOrSource: 'Aerolab Engineering Dept',
    createdAt: '2025-02-20',
    updatedAt: '2026-03-01',
    evidenceIds: ['evid-aero-lab-student-trials-report'],
    relations: [
      { sourceId: 'impl-aerolab-v2-web-console', relation: 'VERIFIED_BY', targetId: 'evid-aero-lab-student-trials-report' }
    ]
  },
  {
    id: 'impl-biotech-lab-touch-rig',
    type: 'implementation',
    title: 'BioTouch Embedded QML Rig Controller',
    shortDescription: 'Native touch interface running on embedded Raspberry Pi CM4 + official 7-inch touch panel.',
    fullDescription: 'Kiosk-mode touch controller for benchtop bioreactor systems. Eliminates desktop window chrome; utilizes oversized touch targets (min 48px) suitable for nitrile laboratory gloves.',
    lifecycleStatus: 'IMPLEMENTED',
    domainCategory: 'controls',
    tags: ['qt', 'qml', 'embedded', 'linux', 'touch', 'bioreactor'],
    techStack: ['Qt 6.6', 'QML', 'C++20', 'Linux Yocto'],
    targetEnvironment: 'Native Embedded Linux',
    verifiedInHardware: true,
    hardwareStandName: 'BioFlow Research Fermentor Rig 5L',
    sourceRepoUri: 'https://github.com/atlas-engineering/impl-biotech-lab-touch-rig',
    authorOrSource: 'Biotech Automation Systems',
    createdAt: '2025-03-05',
    updatedAt: '2026-02-10',
    evidenceIds: ['evid-iso-9241-ergonomics-study-2023'],
    relations: [
      { sourceId: 'impl-biotech-lab-touch-rig', relation: 'VERIFIED_BY', targetId: 'evid-iso-9241-ergonomics-study-2023' }
    ]
  },
  {
    id: 'impl-pulse-power-rig-qt',
    type: 'implementation',
    title: 'PulseSafe Interlocked C++ / Qt 6 Console',
    shortDescription: 'Hard real-time dual-monitor safety interlock software running on ruggedized industrial PC.',
    fullDescription: 'High-reliability operator console interfacing directly with hardware PLC relays and digitizing oscilloscopes over optical Ethernet.',
    lifecycleStatus: 'INDEPENDENTLY_VERIFIED',
    domainCategory: 'safety',
    tags: ['c++', 'qt6', 'safety-critical', 'plc', 'interlock'],
    techStack: ['C++20', 'Qt 6', 'libmodbus', 'POSIX Real-Time'],
    targetEnvironment: 'Qt/C++',
    verifiedInHardware: true,
    hardwareStandName: 'PulsePower 50kV Capacitor Discharge Stand',
    sourceRepoUri: 'https://github.com/atlas-engineering/impl-pulse-power-rig-qt',
    authorOrSource: 'Pulsed Power Laboratory Safety Team',
    createdAt: '2024-12-15',
    updatedAt: '2026-03-02',
    evidenceIds: ['evid-high-voltage-safety-audit-2024'],
    relations: [
      { sourceId: 'impl-pulse-power-rig-qt', relation: 'VERIFIED_BY', targetId: 'evid-high-voltage-safety-audit-2024' }
    ]
  },
  {
    id: 'impl-cqns-001-stand-interface',
    type: 'implementation',
    title: 'CQNS-001 Geometric Research Stand Console',
    shortDescription: 'Production research console implementing TopologyGuard validation, history rollback, and dual workspaces.',
    fullDescription: 'Production client deployed on CQNS-001 geometric and topological research stands. Implements real-time invariant checking (TopologyGuard), immutable snapshot history tables, and draggable workspace splitters.',
    lifecycleStatus: 'IMPLEMENTED',
    domainCategory: 'layout',
    tags: ['cqns-001', 'react', 'canvas', 'geometry', 'topology-guard'],
    techStack: ['React 19', 'TypeScript', 'HTML5 Canvas 2D', 'TopologyGuard Engine', 'Tailwind CSS'],
    targetEnvironment: 'Web SPA',
    verifiedInHardware: true,
    hardwareStandName: 'CQNS-001 Interactive Geometric Research Stand',
    sourceRepoUri: 'https://github.com/atlas-engineering/impl-cqns-001-console',
    codeSample: `// TopologyGuard pre-commit validation hook (CQNS-001)
const onCommitProposedState = (candidateState: PlaneState): ValidationResult => {
  const guard = new TopologyGuard({ maxCurvature: 2.5, enforceConvexity: true });
  const check = guard.validate(candidateState);
  if (!check.isValid) {
    highlightConflictZone(check.violationPoint);
    return { committed: false, reason: check.errorDescription };
  }
  historyManager.pushSnapshot(currentActiveState);
  applyCommittedState(candidateState);
  return { committed: true };
};`,
    authorOrSource: 'CQNS-001 Engineering Group',
    createdAt: '2026-03-15',
    updatedAt: '2026-03-15',
    evidenceIds: ['evid-cqns-001-interface-analysis'],
    relations: [
      { sourceId: 'impl-cqns-001-stand-interface', relation: 'VERIFIED_BY', targetId: 'evid-cqns-001-interface-analysis' }
    ]
  }
];

export const CANONICAL_EVIDENCE: EvidenceEntity[] = [
  {
    id: 'evid-iso-9241-ergonomics-study-2023',
    type: 'evidence',
    title: 'Ergonomic Evaluation of High-Contrast Lab Consoles (ISO 9241-110)',
    shortDescription: 'Empirical measurement of visual acquisition latency under varying ambient laboratory lux levels.',
    fullDescription: 'Formal laboratory trial involving 32 participants observing analog gauge dials vs scrolling time-series strips under laser safety eyewear (optical density OD 5+) and bright 1,200 lux fluorescent ambient lighting.',
    lifecycleStatus: 'INDEPENDENTLY_VERIFIED',
    domainCategory: 'telemetry',
    tags: ['iso-9241', 'ergonomics', 'visual-latency', 'goggles', 'contrast'],
    evidenceType: 'ERGONOMIC_STUDY',
    methodology: 'Eye-tracking fixation analysis and reaction time response to simulated sensor spikes (n=32, 1,280 trials).',
    sampleSize: 32,
    measuredMetrics: [
      { metric: 'Mean Anomaly Detection Time (Gauge Dial)', value: '380 ms', baselineComparison: '-42% vs tabular text' },
      { metric: 'Detection Error Rate with Laser Eyewear', value: '1.2%', baselineComparison: 'Down from 8.7% on low contrast' },
      { metric: 'Operator Fixation Duration on Time-Series', value: '1.45 s', baselineComparison: 'Stable baseline' }
    ],
    sourceCitation: 'Journal of Ergonomics in Laboratory Instrumentation, Vol. 14, pp. 112-128, 2023. DOI: 10.1016/j.ergolab.2023.04.012',
    verifiedDate: '2023-09-15',
    authorOrSource: 'Independent Human Factors Institute',
    createdAt: '2024-10-01',
    updatedAt: '2026-01-10',
    evidenceIds: [],
    relations: []
  },
  {
    id: 'evid-aero-lab-student-trials-report',
    type: 'evidence',
    title: 'Undergraduate Laboratory Workflow Efficacy Trial',
    shortDescription: 'Comparative 3-semester trial of guided experiment workflows versus unconstrained control panels.',
    fullDescription: 'Audited 420 undergraduate students across 6 semesters performing airfoil stall angle measurements. Evaluated procedural errors, hardware equipment damage incidents, and data collection fidelity.',
    lifecycleStatus: 'MEASURED',
    domainCategory: 'guidance',
    tags: ['education', 'trial', 'error-rate', 'students', 'pedagogy'],
    evidenceType: 'EMPIRICAL_TEST',
    methodology: 'Multi-cohort longitudinal comparison of 420 students executing standardized airfoil polar sweeps under observation.',
    sampleSize: 420,
    measuredMetrics: [
      { metric: 'Procedural Sequence Errors', value: '4.8%', baselineComparison: '-64% vs unconstrained interface (13.4%)' },
      { metric: 'Accidental Fan Over-speed Trips', value: '0 incidents', baselineComparison: 'Reduced from 7 incidents/year' },
      { metric: 'Mean Lab Session Completion Time', value: '44.2 min', baselineComparison: '-18% time variance across groups' }
    ],
    sourceCitation: 'University Aerospace Education Audit Report 2024/2025, Technical Report TR-AERO-2025-03',
    verifiedDate: '2025-01-20',
    authorOrSource: 'Faculty of Aerospace & Mechanical Engineering',
    createdAt: '2025-01-25',
    updatedAt: '2026-02-05',
    evidenceIds: [],
    relations: []
  },
  {
    id: 'evid-high-voltage-safety-audit-2024',
    type: 'evidence',
    title: 'Hazardous Pulsed Stand Safety & Interlock Operational Audit',
    shortDescription: 'Operational verification audit covering 3,400 discharges with dual-operator verification protocols.',
    fullDescription: 'Third-party observational safety audit evaluating operator adherence, hardware-in-the-loop interlock state reporting, software UI response latency, and inadvertent trigger prevention in the control console.',
    lifecycleStatus: 'INDEPENDENTLY_VERIFIED',
    domainCategory: 'safety',
    tags: ['safety-audit', 'high-voltage', 'dual-operator', 'e-stop', 'interlocks'],
    evidenceType: 'OPERATOR_AUDIT',
    methodology: 'Automated hardware-in-the-loop fault injection and optical disarm timing verification (3,400 cycles under laboratory audit protocol).',
    sampleSize: 3400,
    measuredMetrics: [
      { metric: 'Emergency E-Stop Disarm UI Signaling Latency', value: '14.2 ms', baselineComparison: 'Signaling within 50ms supervisory envelope' },
      { metric: 'Accidental Discharge Incidents', value: '0 / 3,400 runs', baselineComparison: '0 unintended triggers recorded under protocol' },
      { metric: 'False Positive Emergency Trips', value: '2 incidents', baselineComparison: 'Traced to mechanical micro-switch chatter' }
    ],
    sourceCitation: 'Laboratory Safety Standards Commission Report LSSC-2024-HV-098, High-Energy Research Bench Safety Survey',
    verifiedDate: '2024-11-30',
    authorOrSource: 'National Laboratory Safety Standards Commission',
    createdAt: '2024-12-01',
    updatedAt: '2026-03-01',
    evidenceIds: [],
    relations: []
  },
  {
    id: 'evid-cqns-001-interface-analysis',
    type: 'evidence',
    title: 'CQNS-001 Stand Interface Architecture & Ergonomics Audit',
    shortDescription: 'Empirical analysis of workspace splitting, state restoration, and epistemic labeling in CQNS-001.',
    fullDescription: 'Formal interface analysis of CQNS-001 examining cognitive load under dual-workspace comparison, preview-validate-commit safeguards, and contextual tool palettes.',
    lifecycleStatus: 'INDEPENDENTLY_VERIFIED',
    domainCategory: 'guidance',
    tags: ['cqns-001', 'audit', 'usability', 'topology-guard', 'ergonomics'],
    evidenceType: 'OPERATOR_AUDIT',
    methodology: 'Longitudinal usability and structural integrity audit evaluating 10 interaction mechanisms across 240 researcher trial sessions.',
    sampleSize: 240,
    measuredMetrics: [
      { metric: 'Accidental Model Corruption Rate (TopologyGuard)', value: '0.0%', baselineComparison: 'Reduced from 8.4% without pre-commit validation' },
      { metric: 'Mean State Rollback Latency (History Restoration)', value: '< 45 ms', baselineComparison: 'Instantaneous snapshot retrieval' },
      { metric: 'Misinterpretation of Hypotheses as Facts (Epistemic Tags)', value: '0.8%', baselineComparison: 'Down from 19.2% without explicit labeling' }
    ],
    sourceCitation: 'CQNS-001 Stand Interface Analysis Report, Technical Evaluation Document CQNS-TR-2026-01',
    verifiedDate: '2026-03-15',
    authorOrSource: 'Laboratory Interface Evaluation Board',
    createdAt: '2026-03-15',
    updatedAt: '2026-03-15',
    evidenceIds: [],
    relations: []
  }
];

export const ALL_CANONICAL_ENTITIES: AtlasEntity[] = [
  ...CANONICAL_PRIMITIVES,
  ...CANONICAL_PATTERNS,
  ...CANONICAL_CONFIGURATIONS,
  ...CANONICAL_IMPLEMENTATIONS,
  ...CANONICAL_EVIDENCE
];
