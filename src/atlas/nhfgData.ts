/**
 * Atlas Engineering Patterns — Normative & Human Factors Guidance (NHFG) Dataset
 * Canonical Pilot Registry for ISO 9241 Standards, Principles, and Pattern Mappings.
 */

import {
  SourceRecord,
  PrincipleRecord,
  RequirementRecord,
  PatternMapping,
  VerificationRecord
} from './types';

/**
 * 1. Normative Sources Registry
 * Distinct representation of ISO standards with verified publication and affirmation dates.
 */
export const NHFG_SOURCES: SourceRecord[] = [
  {
    id: 'src-iso9241-110-2020',
    standard: 'ISO 9241-110:2020',
    title: 'Ergonomics of human-system interaction — Part 110: Interaction principles',
    edition: '2020',
    publicationDate: '2020-05',
    confirmedDate: '2025',
    atlasVerifiedDate: '2026-10-20',
    officialUrl: 'https://www.iso.org/standard/75258.html',
    verificationStatus: 'OFFICIAL_METADATA_VERIFIED',
    scopeSummary: 'Defines interaction principles and recommendations for the ergonomic design and evaluation of interactive systems.',
    targetAudience: ['system_designer', 'software_developer', 'requirements_analyst', 'evaluator'],
    safetyDisclaimer: 'The standard explicitly notes that it does not address all domain-specific requirements for safety-critical systems alone.',
    rightsNotice: 'Metadata and paraphrased summaries referenced under fair-use commentary. Full text copyright remains with ISO.'
  },
  {
    id: 'src-iso9241-210-2019',
    standard: 'ISO 9241-210:2019',
    title: 'Ergonomics of human-system interaction — Part 210: Human-centred design for interactive systems',
    edition: '2019',
    publicationDate: '2019-07',
    confirmedDate: '2025',
    atlasVerifiedDate: '2026-10-20',
    officialUrl: 'https://www.iso.org/standard/77520.html',
    verificationStatus: 'OFFICIAL_METADATA_VERIFIED',
    scopeSummary: 'Provides requirements and recommendations for human-centred design principles and activities throughout the life cycle of computer-based interactive systems.',
    targetAudience: ['system_designer', 'requirements_analyst', 'evaluator'],
    safetyDisclaimer: 'Focuses on the engineering process lifecycle rather than discrete widget interaction mechanics.',
    rightsNotice: 'Metadata referenced under fair-use commentary. Full text copyright remains with ISO.'
  },
  {
    id: 'src-iso9241-11-2018',
    standard: 'ISO 9241-11:2018',
    title: 'Ergonomics of human-system interaction — Part 11: Usability: Definitions and concepts',
    edition: '2018',
    publicationDate: '2018-11',
    confirmedDate: '2023',
    atlasVerifiedDate: '2026-10-20',
    officialUrl: 'https://www.iso.org/standard/63500.html',
    verificationStatus: 'OFFICIAL_METADATA_VERIFIED',
    scopeSummary: 'Defines usability (effectiveness, efficiency, satisfaction) and explains concepts relevant to users, goals, tasks, resources and context of use.',
    targetAudience: ['system_designer', 'requirements_analyst', 'evaluator'],
    safetyDisclaimer: 'Defines usability measurement frameworks; does not prescribe specific interface layouts or architectural patterns.',
    rightsNotice: 'Metadata referenced under fair-use commentary. Full text copyright remains with ISO.'
  }
];

/**
 * 2. Interaction Principles Registry
 * The 7 interaction principles of ISO 9241-110:2020.
 */
export const NHFG_PRINCIPLES: PrincipleRecord[] = [
  {
    id: 'prin-iso9241-110-suitability-for-task',
    sourceId: 'src-iso9241-110-2020',
    sectionRef: '4.1',
    principleKey: 'suitability-for-task',
    title: "Suitability for the User's Tasks",
    conciseSummary: 'The interaction system supports the user in completing their tasks effectively and efficiently, presenting only necessary interaction steps and avoiding gratuitous operational friction.',
    applicability: {
      safetyCriticalContextNeedsAdditionalGuidance: false,
      minUserLevel: 'ALL_LEVELS'
    },
    interpretationLimitations: [
      'Suitability depends strictly on domain context; what is suitable for a research testbed may overwhelm a secondary school laboratory.'
    ]
  },
  {
    id: 'prin-iso9241-110-self-descriptiveness',
    sourceId: 'src-iso9241-110-2020',
    sectionRef: '4.2',
    principleKey: 'self-descriptiveness',
    title: 'Self-Descriptiveness',
    conciseSummary: 'The interaction makes relevant system capabilities, internal operational states, and permitted next actions immediately apparent to the operator without requiring external manual lookup.',
    applicability: {
      safetyCriticalContextNeedsAdditionalGuidance: true,
      minUserLevel: 'ALL_LEVELS'
    },
    interpretationLimitations: [
      'Self-descriptiveness is not achieved merely by adding tooltips or labels; terminology must match the mental model and training of target operators.'
    ]
  },
  {
    id: 'prin-iso9241-110-conformity-expectations',
    sourceId: 'src-iso9241-110-2020',
    sectionRef: '4.3',
    principleKey: 'conformity-with-user-expectations',
    title: 'Conformity with User Expectations',
    conciseSummary: 'The system behaves predictably and consistently with established engineering conventions, cultural habits, and prior domain training.',
    applicability: {
      safetyCriticalContextNeedsAdditionalGuidance: false,
      minUserLevel: 'ALL_LEVELS'
    },
    interpretationLimitations: [
      'Conventions differ across disciplines (e.g. aerospace vs chemical engineering); consistency must align with the specific laboratory context.'
    ]
  },
  {
    id: 'prin-iso9241-110-learnability',
    sourceId: 'src-iso9241-110-2020',
    sectionRef: '4.4',
    principleKey: 'learnability',
    title: 'Learnability',
    conciseSummary: 'The system facilitates initial skill acquisition, enables progressive discovery of advanced features, and helps operators re-acquire competence after periods of inactivity.',
    applicability: {
      safetyCriticalContextNeedsAdditionalGuidance: false,
      minUserLevel: 'ALL_LEVELS'
    },
    interpretationLimitations: [
      'Presence of demo switchers or mock data does not prove that actual target students or operators can master the workflow.'
    ]
  },
  {
    id: 'prin-iso9241-110-controllability',
    sourceId: 'src-iso9241-110-2020',
    sectionRef: '4.5',
    principleKey: 'controllability',
    title: 'Controllability',
    conciseSummary: 'The operator maintains control over the pace, sequence, and direction of execution; interactions can be paused, resumed, or rolled back where safe.',
    applicability: {
      safetyCriticalContextNeedsAdditionalGuidance: true,
      minUserLevel: 'ALL_LEVELS'
    },
    interpretationLimitations: [
      'In high-speed physical testbeds, safety interlocks may intentionally restrict operator controllability during active hazardous phases.'
    ]
  },
  {
    id: 'prin-iso9241-110-use-error-robustness',
    sourceId: 'src-iso9241-110-2020',
    sectionRef: '4.6',
    principleKey: 'use-error-robustness',
    title: 'Use Error Robustness',
    conciseSummary: 'The system assists the user in preventing errors, tolerates minor operational slips without catastrophic failure, provides clear diagnostics, and minimizes damage from mistakes.',
    applicability: {
      safetyCriticalContextNeedsAdditionalGuidance: true,
      minUserLevel: 'ALL_LEVELS'
    },
    interpretationLimitations: [
      'Software confirmation dialogs alone do not fulfill use error robustness; physical interlocks are mandatory in hazardous stands.'
    ]
  },
  {
    id: 'prin-iso9241-110-user-engagement',
    sourceId: 'src-iso9241-110-2020',
    sectionRef: '4.7',
    principleKey: 'user-engagement',
    title: 'User Engagement',
    conciseSummary: 'The system presents an inviting, focused workspace that promotes sustained vigilance and task involvement through clear feedback, avoiding gratuitous distractions.',
    applicability: {
      safetyCriticalContextNeedsAdditionalGuidance: false,
      minUserLevel: 'ALL_LEVELS'
    },
    interpretationLimitations: [
      'User engagement must not be confused with mandatory confirmation gates or gamification; vigilance support is the primary engineering goal.'
    ]
  }
];

/**
 * 3. Verifiable Interface Requirements
 */
export const NHFG_REQUIREMENTS: RequirementRecord[] = [
  {
    id: 'req-iso9241-110-no-data-distinct',
    principleId: 'prin-iso9241-110-self-descriptiveness',
    sourceId: 'src-iso9241-110-2020',
    sectionRef: '4.2',
    statement: 'Missing, disconnected, or uncalibrated sensor measurements MUST be explicitly labeled as NO DATA or UNVERIFIED, and MUST NEVER be silently rendered or calculated as numeric zero.',
    requirementType: 'DATA_INTEGRITY_LABELING',
    verificationMethod: 'AUTOMATED_ASSERTION',
    successCriteria: [
      'Unmeasured telemetry channels render an explicit NO_DATA flag',
      'Aggregate calculation routines reject incomplete records and report missing inputs rather than treating absence as 0.0'
    ],
    safetyCritical: true
  },
  {
    id: 'req-iso9241-110-staged-commit-guard',
    principleId: 'prin-iso9241-110-use-error-robustness',
    sourceId: 'src-iso9241-110-2020',
    sectionRef: '4.6',
    statement: 'Destructive, irreversible, or physical actuator changes MUST execute via a staged three-phase lifecycle (Preview -> Validate -> Commit) with non-destructive abort capabilities prior to commit.',
    requirementType: 'OPERATOR_INTERLOCK',
    verificationMethod: 'AUTOMATED_ASSERTION',
    successCriteria: [
      'Direct one-click execution of high-risk actuator parameter writes is blocked',
      'Validation dry-run discloses all predicted side effects before the final commit action is enabled'
    ],
    safetyCritical: true
  },
  {
    id: 'req-iso9241-110-guided-milestones',
    principleId: 'prin-iso9241-110-suitability-for-task',
    sourceId: 'src-iso9241-110-2020',
    sectionRef: '4.1',
    statement: 'Student and novice operator interfaces MUST partition complex multistep experimental protocols into sequential milestones with preconditions clearly enforced at each stage.',
    requirementType: 'STATE_FEEDBACK',
    verificationMethod: 'AUTOMATED_ASSERTION',
    successCriteria: [
      'Current experimental phase is prominently displayed in the primary viewport',
      'Subsequent stages are locked until preceding experimental criteria are fulfilled'
    ],
    safetyCritical: false
  }
];

/**
 * 4. Traceable Pattern Mappings
 * Explicit linkages between principles/requirements and actual canonical Atlas patterns.
 */
export const NHFG_PATTERN_MAPPINGS: PatternMapping[] = [
  {
    id: 'map-prin-self-descriptiveness-pat-epistemic-status',
    principleId: 'prin-iso9241-110-self-descriptiveness',
    requirementId: 'req-iso9241-110-no-data-distinct',
    patternId: 'pat-epistemic-status-labeling',
    rationale: 'Pattern pat-epistemic-status-labeling prevents operators from misinterpreting missing sensor feeds as zero readings by attaching visual epistemic badges (NO DATA, HEURISTIC, VERIFIED).',
    epistemicCategory: 'VERIFIED_RESULT',
    status: {
      designRationaleStatus: 'DESIGN_RATIONALE_PROVIDED',
      scenarioVerificationStatus: 'SCENARIO_VERIFIED',
      userEvaluationStatus: 'NOT_ASSESSED',
      conformanceStatus: 'CONFORMANCE_NOT_ESTABLISHED',
      conformanceMethod: 'NONE'
    },
    applicabilityConditions: [
      'Multi-sensor laboratory stands subject to network packet loss or transducer disconnects'
    ],
    knownLimitations: [
      'Demonstrated via automated unit assertion; does not prove operator reaction times in live laboratory stress.'
    ],
    verificationReference: 'verif-req-no-data-scenario-01'
  },
  {
    id: 'map-prin-use-error-robustness-pat-preview-validate-commit',
    principleId: 'prin-iso9241-110-use-error-robustness',
    requirementId: 'req-iso9241-110-staged-commit-guard',
    patternId: 'pat-preview-validate-commit',
    rationale: 'Pattern pat-preview-validate-commit eliminates inadvertent actuator firing by enforcing staged preview diffs and pre-execution safety validation prior to hardware write.',
    epistemicCategory: 'VERIFIED_RESULT',
    status: {
      designRationaleStatus: 'DESIGN_RATIONALE_PROVIDED',
      scenarioVerificationStatus: 'SCENARIO_VERIFIED',
      userEvaluationStatus: 'NOT_ASSESSED',
      conformanceStatus: 'CONFORMANCE_NOT_ESTABLISHED',
      conformanceMethod: 'NONE'
    },
    applicabilityConditions: [
      'Parametric control interfaces commanding physical machinery, power supplies, or valves'
    ],
    knownLimitations: [
      'Simulated dry-run validation cannot detect unmodeled physical hardware drift occurring downstream of the controller.'
    ],
    verificationReference: 'verif-req-staged-commit-scenario-01'
  },
  {
    id: 'map-prin-suitability-for-task-pat-guided-student-experiment-stepper',
    principleId: 'prin-iso9241-110-suitability-for-task',
    requirementId: 'req-iso9241-110-guided-milestones',
    patternId: 'pat-guided-student-experiment-stepper',
    rationale: 'Pattern pat-guided-student-experiment-stepper structures complex laboratory exercises into sequential, step-by-step milestones appropriate for student cognitive loads.',
    epistemicCategory: 'VERIFIED_RESULT',
    status: {
      designRationaleStatus: 'DESIGN_RATIONALE_PROVIDED',
      scenarioVerificationStatus: 'SCENARIO_VERIFIED',
      userEvaluationStatus: 'NOT_ASSESSED',
      conformanceStatus: 'CONFORMANCE_NOT_ESTABLISHED',
      conformanceMethod: 'NONE'
    },
    applicabilityConditions: [
      'Educational demo benches and student laboratory stands'
    ],
    knownLimitations: [
      'Restricts operator flexibility; deliberately unsuitable for exploratory research benches.'
    ],
    verificationReference: 'verif-req-guided-milestones-scenario-01'
  },
  {
    id: 'map-prin-conformity-expectations-pat-calibrated-telemetry-console',
    principleId: 'prin-iso9241-110-conformity-expectations',
    patternId: 'pat-calibrated-telemetry-console',
    rationale: 'Pattern pat-calibrated-telemetry-console organizes multi-channel sensor feeds using standard SI engineering units, physical calibration curves, and established dial/strip conventions.',
    epistemicCategory: 'ENGINEERING_INTERPRETATION',
    status: {
      designRationaleStatus: 'DESIGN_RATIONALE_PROVIDED',
      scenarioVerificationStatus: 'NOT_ASSESSED',
      userEvaluationStatus: 'NOT_ASSESSED',
      conformanceStatus: 'CONFORMANCE_NOT_ESTABLISHED',
      conformanceMethod: 'NONE'
    },
    applicabilityConditions: [
      'Telemetry-heavy experimental benches with continuous physical probe monitoring'
    ],
    knownLimitations: [
      'Conformity to specific domain conventions requires configuring regional and disciplinary measurement units.'
    ]
  },
  {
    id: 'map-prin-self-descriptiveness-pat-live-object-health-indicator',
    principleId: 'prin-iso9241-110-self-descriptiveness',
    patternId: 'pat-live-object-health-indicator',
    rationale: 'Pattern pat-live-object-health-indicator renders non-blocking health and heartbeat badges directly on hardware object nodes to reveal physical connectivity states.',
    epistemicCategory: 'ENGINEERING_INTERPRETATION',
    status: {
      designRationaleStatus: 'DESIGN_RATIONALE_PROVIDED',
      scenarioVerificationStatus: 'NOT_ASSESSED',
      userEvaluationStatus: 'NOT_ASSESSED',
      conformanceStatus: 'CONFORMANCE_NOT_ESTABLISHED',
      conformanceMethod: 'NONE'
    },
    applicabilityConditions: [
      'Distributed laboratory rigs with networked microcontrollers and CAN/Modbus sensors'
    ],
    knownLimitations: [
      'Visual health badges must be paired with textual tooltips for operators with color vision deficiencies.'
    ]
  },
  {
    id: 'map-prin-controllability-pat-adjustable-split-workspace',
    principleId: 'prin-iso9241-110-controllability',
    patternId: 'pat-adjustable-split-workspace',
    rationale: 'Pattern pat-adjustable-split-workspace empowers operators to adjust viewport proportions freely between primary model inspection and telemetry analysis.',
    epistemicCategory: 'DESIGN_HYPOTHESIS',
    status: {
      designRationaleStatus: 'DESIGN_RATIONALE_PROVIDED',
      scenarioVerificationStatus: 'NOT_ASSESSED',
      userEvaluationStatus: 'NOT_ASSESSED',
      conformanceStatus: 'CONFORMANCE_NOT_ESTABLISHED',
      conformanceMethod: 'NONE'
    },
    applicabilityConditions: [
      'High-resolution operator consoles with dual modeling and telemetry requirements'
    ],
    knownLimitations: [
      'Design hypothesis: user freedom to resize panes has not been empirically verified to increase task speed.'
    ]
  }
];

/**
 * 5. Executable Scenario Verifications
 */
export const NHFG_VERIFICATIONS: VerificationRecord[] = [
  {
    id: 'verif-req-no-data-scenario-01',
    requirementId: 'req-iso9241-110-no-data-distinct',
    scenarioTitle: 'Missing Telemetry Packet Handling',
    testFileRef: 'tests/nhfg.test.ts',
    testName: 'Missing sensor measurement renders NO_DATA and is not computed as numeric zero',
    passed: true,
    executedAt: '2026-10-20',
    evidenceEntityId: 'evid-iso-9241-ergonomics-study-2023',
    untestedBoundaries: [
      'High packet loss (>80%) under saturated serial bus conditions',
      'Operator subjective reaction time to flashing badges'
    ]
  },
  {
    id: 'verif-req-staged-commit-scenario-01',
    requirementId: 'req-iso9241-110-staged-commit-guard',
    scenarioTitle: 'Preview-Validate-Commit Abort Cycle',
    testFileRef: 'tests/nhfg.test.ts',
    testName: 'Staged parameter mutation aborts cleanly during validation phase without hardware side effects',
    passed: true,
    executedAt: '2026-10-20',
    untestedBoundaries: [
      'Concurrent multi-operator conflicting commit commands'
    ]
  },
  {
    id: 'verif-req-guided-milestones-scenario-01',
    requirementId: 'req-iso9241-110-guided-milestones',
    scenarioTitle: 'Guided Stepper Milestone Lock',
    testFileRef: 'tests/nhfg.test.ts',
    testName: 'Subsequent experimental steps remain locked until preceding step criteria are satisfied',
    passed: true,
    executedAt: '2026-10-20',
    evidenceEntityId: 'evid-student-trial-wind-tunnel-2024',
    untestedBoundaries: [
      'Student manual override bypass in instructor-assisted sessions'
    ]
  }
];
