/**
 * Atlas Engineering Patterns — Core Domain Types and Schemas
 * Strict scope: Interface configuration of educational, research, and laboratory stands.
 */

export type EntityType = 'primitive' | 'pattern' | 'configuration' | 'implementation' | 'evidence';

export type LifecycleStatus =
  | 'PROPOSED'
  | 'SPECIFIED'
  | 'IMPLEMENTED'
  | 'TESTED'
  | 'INDEPENDENTLY_VERIFIED'
  | 'MEASURED'
  | 'DEPRECATED';

export type UserLevel =
  | 'SECONDARY_SCHOOL'
  | 'UNDERGRADUATE'
  | 'RESEARCHER'
  | 'CERTIFIED_OPERATOR'
  | 'ALL_LEVELS';

export type StandPurpose =
  | 'EDUCATIONAL_DEMO'
  | 'STUDENT_LAB_EXPERIMENT'
  | 'RESEARCH_BENCH'
  | 'INDUSTRIAL_TESTBED'
  | 'HAZARDOUS_FACILITY';

export type RelationType =
  | 'USES'
  | 'COMPOSES_WITH'
  | 'REQUIRES'
  | 'ALTERNATIVE_TO'
  | 'SPECIALIZES'
  | 'CONFLICTS_WITH'
  | 'IMPLEMENTED_IN'
  | 'VERIFIED_BY';

export interface GraphRelation {
  sourceId: string;
  relation: RelationType;
  targetId: string;
  rationale?: string;
  bidirectional?: boolean;
}

export interface Contract {
  inputPorts: { id: string; type: string; description: string; required: boolean }[];
  outputPorts: { id: string; type: string; description: string }[];
  guarantees: string[];
  constraints: string[];
  version: string;
}

export type CompatibilityResult = 'COMPATIBLE' | 'INCOMPATIBLE' | 'UNKNOWN';

export interface BaseEntity {
  id: string; // e.g. prim-analog-dial, pat-telemetry-console
  type: EntityType;
  title: string;
  shortDescription: string;
  fullDescription: string;
  lifecycleStatus: LifecycleStatus;
  domainCategory: 'layout' | 'telemetry' | 'controls' | 'safety' | 'guidance' | 'multi-screen';
  tags: string[];
  relations: GraphRelation[];
  evidenceIds: string[];
  createdAt: string;
  updatedAt: string;
  authorOrSource: string;
  contract?: Contract;
}

export interface PrimitiveEntity extends BaseEntity {
  type: 'primitive';
  uiSlot: 'viewport' | 'control-rail' | 'ribbon' | 'modal' | 'strip' | 'matrix';
  renderingTech?: 'SVG' | 'Canvas' | 'DOM' | 'WebGL';
  minFootprintPixels: { width: number; height: number };
  supportsTouch: boolean;
  supportsKeyboard: boolean;
  telemetryRateMaxHz?: number;
}

export interface PatternEntity extends BaseEntity {
  type: 'pattern';
  problemStatement: string;
  solutionSummary: string;
  tradeOffs: {
    advantages: string[];
    disadvantages: string[];
  };
  applicability: {
    purposes: StandPurpose[];
    targetLevels: UserLevel[];
    minScreens: number;
    requiredPeripherals?: string[];
    hardConstraints?: string[];
  };
  primitiveIds: string[];
  alternativePatternIds?: string[];
  conflictPatternIds?: string[];
}

export interface ConfigurationEntity extends BaseEntity {
  type: 'configuration';
  targetStand: {
    standName: string;
    purpose: StandPurpose;
    targetLevel: UserLevel;
    screenSetup: string; // e.g. "Dual 1080p + 7-inch touch console"
    peripherals: string[];
  };
  selectedPatterns: string[];
  selectedPrimitives: string[];
  layoutRecipe: {
    screenLayout: 'single-pane' | 'asymmetric-split' | 'multi-monitor-sync' | 'kiosk-locked';
    panelArrangement: {
      zone: string;
      componentId: string;
      proportion: string;
    }[];
  };
  safetyLevel: 'STANDARD' | 'INTERLOCKED' | 'HAZARD_RATED';
}

export interface ImplementationEntity extends BaseEntity {
  type: 'implementation';
  techStack: string[];
  targetEnvironment: 'Web SPA' | 'Desktop Electron' | 'Qt/C++' | 'Native Embedded Linux';
  codeSample?: string;
  sourceRepoUri?: string;
  verifiedInHardware: boolean;
  hardwareStandName: string;
}

export interface EvidenceEntity extends BaseEntity {
  type: 'evidence';
  evidenceType: 'EMPIRICAL_TEST' | 'ERGONOMIC_STUDY' | 'OPERATOR_AUDIT' | 'FAILURE_LOG' | 'STANDARD_COMPLIANCE';
  methodology: string;
  sampleSize?: number;
  measuredMetrics: {
    metric: string;
    value: string;
    baselineComparison?: string;
  }[];
  sourceCitation: string;
  verifiedDate: string;
}

export type AtlasEntity =
  | PrimitiveEntity
  | PatternEntity
  | ConfigurationEntity
  | ImplementationEntity
  | EvidenceEntity;

export interface StandRequirementQuery {
  standName: string;
  purpose: StandPurpose;
  userLevel: UserLevel;
  requiredCapabilities: string[];
  screensCount: number;
  peripherals: string[];
  hardConstraints: string[];
  accessibilityNeeds: string[];
  optionalPreferences: string[];
}

export interface NhfgPatternGuidance {
  source: {
    id: string;
    standard: string;
    title: string;
    officialUrl: string;
    publicationDate: string;
    confirmedDate?: string;
    atlasVerifiedDate: string;
  };
  principle: {
    id: string;
    title: string;
    sectionRef: string;
    conciseSummary: string;
  };
  requirement?: {
    id: string;
    statement: string;
    requirementType: RequirementType;
    safetyCritical: boolean;
  };
  mappingId: string;
  rationale: string;
  epistemicCategory: EpistemicCategory;
  status: MappingStatusModel;
  applicabilityConditions: string[];
  knownLimitations: string[];
  missingEvidence: string[];
}

export interface NhfgGuidanceSummary {
  totalNormativeMappings: number;
  principlesCovered: string[];
  unverifiedMappingsCount: number;
  hypothesisMappingsCount: number;
  verifiedScenariosCount: number;
  conformanceClaimedCount: number;
  conformanceDisclaimers: string[];
}

export interface ComposedStandSolution {
  query: StandRequirementQuery;
  matchedPatterns: {
    pattern: PatternEntity;
    selectionReason: string;
    evidenceStatus: LifecycleStatus;
    supportingEvidence: EvidenceEntity[];
    alternatives: PatternEntity[];
    nhfgGuidance?: NhfgPatternGuidance[];
  }[];
  matchedPrimitives: {
    primitive: PrimitiveEntity;
    parentPatternId?: string;
    slot: string;
  }[];
  activeConflicts: {
    entityA: string;
    entityB: string;
    reason: string;
  }[];
  knowledgeGaps: {
    unmetRequirement: string;
    reason: string;
    recommendation: string;
  }[];
  traceabilityManifest: {
    totalEntitiesUsed: number;
    evidenceBackingPercent: number;
    hardConstraintsSatisfied: boolean;
  };
  blueprint: {
    layoutType: string;
    zones: {
      name: string;
      assignedEntities: string[];
      role: string;
    }[];
  };
  compatibilityIssues?: {
    entityA: string;
    entityB: string;
    result: CompatibilityResult;
    reason?: string;
  }[];
  validationStatus: 'GENERATED' | 'COMPATIBLE' | 'INCOMPATIBLE' | 'UNVERIFIED';
  epistemicProvenance?: EpistemicProvenance[];
  lossLog?: LossItem[];
  nhfgSummary?: NhfgGuidanceSummary;
}

export type EpistemicStatus = 'OBSERVED_EVIDENCE' | 'INFERRED' | 'UNKNOWN' | 'CONFLICT';

export type LossItemType = 'UNMET_REQUIREMENT' | 'EXCLUDED_CANDIDATE' | 'UNVERIFIED_CONNECTION' | 'HEURISTIC_MISMATCH' | 'HEURISTIC_MATCH_ONLY';

export interface LossItem {
  type?: LossItemType;
  requirementId?: string;
  entityId?: string;
  sourceReference?: string;
  reason: string;
}

export interface EpistemicProvenance {
  statement: string;
  status: EpistemicStatus;
  sourceReference?: string;
}

export interface ProposalInput {
  title: string;
  targetType: EntityType;
  domainCategory: 'layout' | 'telemetry' | 'controls' | 'safety' | 'guidance' | 'multi-screen';
  problemStatement: string;
  solutionDescription: string;
  lifecycleStatus: LifecycleStatus;
  proposedRelations: {
    relation: RelationType;
    targetId: string;
    rationale?: string;
  }[];
  evidenceCitation?: string;
  author: string;
}

export interface IngestionReviewResult {
  scopeVerdict: 'IN_SCOPE' | 'OUT_OF_SCOPE';
  scopeReason: string;
  duplicateAnalysis: {
    isDuplicate: boolean;
    highestSimilarityPercent: number;
    conflictingEntityId?: string;
    explanation: string;
  };
  generatedId: string;
  schemaValid: boolean;
  schemaErrors: string[];
  relationValidation: {
    valid: boolean;
    errors: string[];
  };
  recommendation: 'ACCEPT_CANDIDATE' | 'REQUEST_REVISIONS' | 'REJECT_OUT_OF_SCOPE' | 'FLAG_DUPLICATE';
  reviewReport: string;
}

export interface AuditFinding {
  criterionNumber: number;
  criterionTitle: string;
  severity: 'PASS' | 'INFO' | 'WARNING' | 'CRITICAL';
  affectedComponent: string;
  expectedBehavior: string;
  observedBehavior: string;
  reproducibleEvidence: string;
  recommendedCorrection?: string;
}

export interface AcceptanceReport {
  timestamp: string;
  overallVerdict: 'ACCEPTED' | 'ACCEPTED WITH GAPS' | 'REJECTED';
  totalCriteria: number;
  passedCriteria: number;
  findings: AuditFinding[];
  summaryNote: string;
}

/**
 * ============================================================================
 * Normative & Human Factors Guidance (NHFG) Layer Types (Stage C Pilot)
 * ============================================================================
 */

export type SourceVerificationStatus =
  | 'OFFICIAL_METADATA_VERIFIED'
  | 'DRAFT_SPECIFICATION'
  | 'HISTORICAL_OBSOLETE'
  | 'UNVERIFIED_CITATION';

export interface SourceRecord {
  id: string; // e.g. "src-iso9241-110-2020"
  standard: string; // e.g. "ISO 9241-110:2020"
  title: string;
  edition: string; // e.g. "2020"
  publicationDate: string; // e.g. "2020-05"
  confirmedDate?: string; // e.g. "2025"
  atlasVerifiedDate: string; // e.g. "2026-10-20"
  officialUrl: string;
  verificationStatus: SourceVerificationStatus;
  scopeSummary: string;
  targetAudience: ('system_designer' | 'software_developer' | 'requirements_analyst' | 'evaluator')[];
  safetyDisclaimer: string;
  rightsNotice: string;
}

export type PrincipleKey =
  | 'suitability-for-task'
  | 'self-descriptiveness'
  | 'conformity-with-user-expectations'
  | 'learnability'
  | 'controllability'
  | 'use-error-robustness'
  | 'user-engagement';

export interface ApplicabilityContext {
  safetyCriticalContextNeedsAdditionalGuidance: boolean;
  minUserLevel: UserLevel;
  excludedDomains?: string[];
  mandatoryPeripherals?: string[];
}

export interface PrincipleRecord {
  id: string; // e.g. "prin-iso9241-110-self-descriptiveness"
  sourceId: string; // References SourceRecord.id
  sectionRef: string; // e.g. "4.2"
  principleKey: PrincipleKey;
  title: string;
  conciseSummary: string;
  applicability: ApplicabilityContext;
  interpretationLimitations: string[];
}

export type RequirementType =
  | 'INTERFACE_DISCLOSURE'
  | 'DATA_INTEGRITY_LABELING'
  | 'STATE_FEEDBACK'
  | 'OPERATOR_INTERLOCK'
  | 'REVERSIBLE_ACTION'
  | 'ERROR_TOLERANCE';

export interface RequirementRecord {
  id: string; // e.g. "req-iso9241-110-no-data-distinct"
  principleId: string; // References PrincipleRecord.id
  sourceId: string; // References SourceRecord.id
  sectionRef: string; // e.g. "4.2.3"
  statement: string;
  requirementType: RequirementType;
  verificationMethod: 'SCENARIO_SIMULATION' | 'AUTOMATED_ASSERTION' | 'OPERATOR_TRIAL' | 'EXPERT_INSPECTION';
  successCriteria: string[];
  safetyCritical: boolean;
}

export type EpistemicCategory =
  | 'SOURCE_CONFIRMED'
  | 'ENGINEERING_INTERPRETATION'
  | 'DESIGN_HYPOTHESIS'
  | 'VERIFIED_RESULT'
  | 'UNVERIFIED_OR_UNKNOWN';

export type ConformanceEvaluationMethod =
  | 'NONE'
  | 'FIRST_PARTY_SELF_ASSESSMENT'
  | 'SECOND_PARTY_AUDIT'
  | 'THIRD_PARTY_CERTIFICATION';

export interface MappingStatusModel {
  designRationaleStatus: 'NOT_ASSESSED' | 'DESIGN_RATIONALE_PROVIDED';
  scenarioVerificationStatus: 'NOT_ASSESSED' | 'SCENARIO_VERIFIED' | 'SCENARIO_FAILED';
  userEvaluationStatus: 'NOT_ASSESSED' | 'USER_EVALUATED' | 'USER_EVALUATION_FAILED';
  conformanceStatus: 'CONFORMANCE_NOT_ESTABLISHED' | 'CONFORMANCE_CLAIMED';
  conformanceMethod?: ConformanceEvaluationMethod;
}

export interface PatternMapping {
  id: string; // e.g. "map-prin-self-descriptiveness-pat-epistemic-status"
  principleId: string; // References PrincipleRecord.id
  requirementId?: string; // Optional reference to RequirementRecord.id
  patternId: string; // Strict reference to canonical pattern id
  rationale: string;
  epistemicCategory: EpistemicCategory;
  status: MappingStatusModel;
  applicabilityConditions: string[];
  knownLimitations: string[];
  verificationReference?: string; // e.g. "verif-req-no-data-scenario-01"
}

export interface VerificationRecord {
  id: string; // e.g. "verif-req-no-data-scenario-01"
  requirementId: string; // References RequirementRecord.id
  scenarioTitle: string;
  testFileRef: string;
  testName: string;
  passed: boolean;
  executedAt: string;
  evidenceEntityId?: string; // Optional link to evid-*
  untestedBoundaries: string[];
}

export interface NhfgRegistryValidationReport {
  isValid: boolean;
  totalSources: number;
  totalPrinciples: number;
  totalRequirements: number;
  totalMappings: number;
  totalVerifications: number;
  duplicateIds: string[];
  unresolvedSourceRefs: string[];
  unresolvedPrincipleRefs: string[];
  unresolvedRequirementRefs: string[];
  unresolvedPatternRefs: string[];
  invalidStatusMappings: { mappingId: string; error: string }[];
  unverifiedMappingsCount: number;
}

