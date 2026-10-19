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
  }
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
  }
];

export const ALL_CANONICAL_ENTITIES: AtlasEntity[] = [
  ...CANONICAL_PRIMITIVES,
  ...CANONICAL_PATTERNS,
  ...CANONICAL_CONFIGURATIONS,
  ...CANONICAL_IMPLEMENTATIONS,
  ...CANONICAL_EVIDENCE
];
