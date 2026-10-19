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

export interface ComposedStandSolution {
  query: StandRequirementQuery;
  matchedPatterns: {
    pattern: PatternEntity;
    selectionReason: string;
    evidenceStatus: LifecycleStatus;
    supportingEvidence: EvidenceEntity[];
    alternatives: PatternEntity[];
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
