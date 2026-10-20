# ATLAS NHFG × RetrievalEngine Integration Specification (Stage D)

## 1. Architectural Intent & Integration Point

The goal of Stage D is to connect the **Normative & Human Factors Guidance (NHFG)** layer directly into the **Retrieval & Composition Engine** (`src/atlas/retrievalEngine.ts`), transforming Atlas from a catalog of interface widgets into an engineering tool that answers **why** a pattern is proposed, under what constraints, and what evidence supports it.

### Integration Principles:
1. **Complementary, Not Overriding**: Retrieval candidate scoring, purpose matching, user-level bounds, and physical constraint checks remain strictly deterministic and uninflated.
2. **Zero False Conformance**: Linking a pattern to an ISO 9241-110 principle does **not** grant or imply certified standard compliance (`CONFORMANCE_NOT_ESTABLISHED` is maintained).
3. **Explicit Epistemic Epoch**: Relationships marked as `DESIGN_HYPOTHESIS` are disclosed as unverified hypotheses in the epistemic provenance.
4. **Graceful Degradation**: If a pattern or query lacks normative guidance, the system operates identically to baseline Atlas.

---

## 2. Data Flow & Execution Pipeline

```
+-----------------------------------------------------------------------------------+
|                           STAND REQUIREMENT QUERY                                  |
| (Name, Purpose, User Level, Required Capabilities, Screen Setup, Hard Constraints)|
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                         RETRIEVAL ENGINE (Core Filter)                            |
|  1. Candidate Filtering: Purpose & User Level Bounds                              |
|  2. Hard Constraints Check (Min Screens, Peripherals, Safety Level)                |
|  3. Conflict Elimination (Mutual Exclusions via Graph Engine)                      |
|  4. Anti-Hallucination Gap Detection (Unmatched Capabilities -> knowledgeGaps)     |
+-----------------------------------------------------------------------------------+
                                         |
                       Accepted Pattern Candidates (pat-*)
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                        NHFG GUIDANCE TRACE (`NhfgEngine`)                         |
|  For each accepted pattern:                                                       |
|  - traceChain(pattern.id): Pattern -> Mapping -> Requirement -> Principle -> Src  |
|  - Attach NhfgPatternGuidance: Official Standard URL, Edition, Rationale,         |
|    Orthogonal Statuses (Design, Scenario, User, Conformance), Missing Evidence    |
|  - Epistemic Provenance: Log DESIGN_HYPOTHESIS as UNKNOWN, disclaim compliance     |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                         COMPOSED STAND BLUEPRINT                                  |
|  - matchedPatterns with attached nhfgGuidance                                     |
|  - nhfgSummary: Aggregate normative mappings, principles covered, disclaimers     |
|  - epistemicProvenance: SOL-2 Loss Log + Honest evidence limits                   |
|  - Layout Blueprint: Zone assignments (Ribbon, Rail, Stage, Tray)                 |
+-----------------------------------------------------------------------------------+
```

---

## 3. Data Contracts & Extended Types (`src/atlas/types.ts`)

### 3.1 `NhfgPatternGuidance`
Attached to each matched pattern in `ComposedStandSolution.matchedPatterns`:

```typescript
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
```

### 3.2 `NhfgGuidanceSummary`
Attached to `ComposedStandSolution`:

```typescript
export interface NhfgGuidanceSummary {
  totalNormativeMappings: number;
  principlesCovered: string[];
  unverifiedMappingsCount: number;
  hypothesisMappingsCount: number;
  verifiedScenariosCount: number;
  conformanceClaimedCount: number;
  conformanceDisclaimers: string[];
}
```

---

## 4. Query Scenarios & Verified Behaviors

### Scenario 1: Missing Measurement & Epistemic Labeling
- **Query**: Research stand with `requiredCapabilities: ['epistemic labeling', 'telemetry']`.
- **Selected Pattern**: `pat-epistemic-status-labeling`.
- **Attached Guidance**:
  - **Source**: `ISO 9241-110:2020` (*Interaction principles*, confirmed 2025).
  - **Principle**: `Self-Descriptiveness` (Section 4.2).
  - **Requirement**: `req-iso9241-110-no-data-distinct`: Missing or disconnected telemetry must be rendered as `NO DATA` and never calculated as `0.0`.
  - **Status**: `scenarioVerificationStatus: 'SCENARIO_VERIFIED'`, `conformanceStatus: 'CONFORMANCE_NOT_ESTABLISHED'`.
  - **Missing Evidence**: Explicit disclosure that operator trial and third-party certification are absent.

### Scenario 2: Baseline Experiment Without Normative Mappings
- **Query**: Educational wind tunnel with general time-series requirement.
- **Behavior**: Baseline patterns match cleanly. Patterns without NHFG mappings have `nhfgGuidance: undefined`. No phantom normative links are fabricated.

### Scenario 3: Explicit `DESIGN_HYPOTHESIS` Handling
- **Query**: Research bench matching `pat-adjustable-split-workspace`.
- **Attached Guidance**: Linked to `Controllability` (Section 4.5).
- **Epistemic Category**: `DESIGN_HYPOTHESIS`.
- **Epistemic Provenance**: Explicit statement logged with status `UNKNOWN`:  
  *"Pattern 'pat-adjustable-split-workspace' is linked to principle 'Controllability' strictly as a DESIGN_HYPOTHESIS awaiting empirical trials."*

### Scenario 4: Anti-Bias & Safety Invariant
- **Query**: Secondary school student demo requesting `safety interlock`.
- **Behavior**: `pat-dual-operator-safety-interlock` is strictly excluded due to user-level constraints. NHFG guidance does **not** bypass or override hard safety exclusions.

---

## 5. Verification & Test Suite (`tests/nhfgRetrieval.test.ts`)

The integration is verified across 17 automated assertions:
1. Retrieval matching of `pat-epistemic-status-labeling` and guidance attachment.
2. Verified linkage to official ISO URL and section.
3. Anti-conflation verification: `conformanceStatus === 'CONFORMANCE_NOT_ESTABLISHED'`.
4. Honest disclosure of missing evidence (`missingEvidence.length > 0`).
5. Aggregation into `nhfgSummary`.
6. Zero false conformance claims across solution.
7. Clean operation of normal queries without NHFG links.
8. Explicit tagging of `DESIGN_HYPOTHESIS`.
9. Insertion of `UNKNOWN` epistemic provenance for hypotheses.
10. Preservation of hard constraint filtering and safety interlock exclusion for secondary school users.

All 17 tests pass with exit code 0.
