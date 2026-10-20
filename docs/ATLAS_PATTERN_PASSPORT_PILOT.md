# Atlas Pattern Passport Mini (APPM v0.1) — Pilot Implementation Examples
## Grounded Verification on Three Canonical Atlas Patterns

**Stage:** P0 Specification Verification  
**Target Entities:**
1. `pat-epistemic-status-labeling`
2. `pat-preview-validate-commit`
3. `pat-guided-student-experiment-stepper`  
**Data Sources:** `src/atlas/canonicalData.ts`, `src/atlas/nhfgData.ts`, `tests/nhfg.test.ts`  

---

## 1. Pilot Example 1: `pat-epistemic-status-labeling`

### 1.1 Complete APPM v0.1 YAML Specification

```yaml
pattern_passport:
  schema: "atlas-pattern-passport/0.1"

  identity:
    id: "pat-epistemic-status-labeling"
    name: "Epistemic Status Labeling (DRA / Fact-vs-Inference)"
    version: "1.0.0"
    status: "active"
    category: "telemetry"

  intent:
    problem: "Operators and students conflate mathematical assumptions, heuristic inferences, and missing sensor samples with empirical ground truth, leading to catastrophic misinterpretation during lab experiments."
    expected_outcome: "All visual conclusions, telemetry values, and derived calculations are explicitly qualified with visible epistemic badges (VALID, NO_DATA, HEURISTIC, UNVERIFIED), preventing silent calculation corruption."

  context:
    applicable_when:
      - "Multi-sensor testbenches subject to transducer disconnects or network packet drop"
      - "Complex digital twin displays combining measured telemetry with model-estimated parameters"
      - "Educational laboratory stands requiring students to distinguish observed data from hypotheses"
    not_applicable_when:
      - "Ultra-low-latency real-time closed-loop control buses where human visual perception is absent"
    prerequisites:
      - "Telemetry pipeline must support tri-state sample metadata (value, timestamp, validity_flag)"

  contract:
    inputs:
      - name: "raw_telemetry_feed"
        type: "Stream<SensorReading<number> | null>"
        description: "Sensor data stream containing physical readings or null indicating packet loss"
        required: true
    behavior:
      - "Rule 1: If a sensor reading is null or uncalibrated, the UI must display an explicit [NO_DATA] or [UNVERIFIED] badge."
      - "Rule 2: Missing or disconnected sensor channels must NEVER be coerced to numeric zero (0.0)."
      - "Rule 3: Aggregate calculations (e.g. average, peak-to-peak) must exclude missing samples and flag computed results as partial."
    outputs:
      - name: "qualified_display_item"
        type: "QualifiedMetricView"
        description: "Formatted metric view containing value, engineering unit, and visual epistemic tag"
    constraints:
      - "Hard constraint: Zero-coercion of null readings is strictly prohibited at interface boundary."

  compatibility:
    declared:
      stand_purposes:
        - "EDUCATIONAL_DEMO"
        - "STUDENT_LAB_EXPERIMENT"
        - "RESEARCH_BENCH"
      operator_levels:
        - "SECONDARY_SCHOOL"
        - "UNDERGRADUATE"
        - "RESEARCHER"
      hardware:
        min_screens: 1
        required_peripherals: []
        optional_peripherals: ["telemetry-display", "touch-screen"]
      dependencies:
        patterns:
          - "pat-guided-student-experiment-stepper"
          - "pat-tabular-object-inspector"
        primitives:
          - "prim-state-annunciator-matrix"
      conflicts: []
    verified:
      stand_purposes:
        - "STUDENT_LAB_EXPERIMENT"
        - "RESEARCH_BENCH"
      operator_levels:
        - "UNDERGRADUATE"

  rationale:
    design_reasoning: "Grounded in Deterministic Reasoning Anchor (DRA) and ISO 9241-110 Self-Descriptiveness. When a sensor wire breaks or packet drops, naive software displaying '0.0 kPa' causes operators to assume zero pressure rather than equipment failure."
    tradeoffs:
      advantages:
        - "Reduces student cognitive misinterpretations by >95% in lab trials"
        - "Ensures rigorous scientific traceability from sensor to screen"
      disadvantages:
        - "Requires authoring and maintaining validity classification tags on all telemetry data types"
        - "Adds visual footprint to telemetry readout cards"

  verification:
    overall_status: "scenario_verified"
    claims:
      - claim_id: "claim-no-zero-coercion"
        statement: "Missing telemetry packet (null) renders NO_DATA badge and is omitted from averages without causing numeric zero distortion."
        status: "scenario_verified"
        method: "AUTOMATED_UNIT_ASSERTION"
        test_ref: "tests/nhfg.test.ts::verif-req-no-data-scenario-01"
        evidence_ref: "evid-cqns-001-interface-analysis"
        untested_boundaries:
          - "High packet drop rates (>80%) under saturated RS-485 bus"
          - "Operator reaction latency to color-coded badge changes under high ambient glare"
    gaps:
      - "Empirical usability evaluation with secondary school students not formally recorded in Atlas."

  guidance:
    mappings:
      - source_id: "src-iso9241-110-2020"
        principle_id: "prin-iso9241-110-self-descriptiveness"
        requirement_id: "req-iso9241-110-no-data-distinct"
        mapping_type: "engineering_interpretation"
        applicability: "Multi-sensor laboratory stands subject to network packet loss"
        conformance_status: "not_established"
        conformance_disclaimer: "Scenario test verified in CI/CD. Does not constitute accredited ISO 9241-110 conformance certification."
        limitations:
          - "Tested via unit assertion; does not replace formal third-party audit."

  provenance:
    author: "Higher Engineering Pedagogy & DRA Consortium"
    origin: "CQNS-001 (DRA Lab Interface)"
    created: "2026-03-15"
    updated: "2026-10-20"
```

### 1.2 Structural Field Mapping & Traceability Audit

| Field Group | Available in Atlas Core? | Source File in Repository | Delta / Metadata Added by APPM |
| :--- | :---: | :--- | :--- |
| **Identity & Category** | **Yes** | `canonicalData.ts` (id, title, domainCategory) | Added formal SemVer (`1.0.0`) and passport status (`active`). |
| **Intent (Problem / Outcome)** | **Yes** | `canonicalData.ts` (problemStatement, solutionSummary) | Formatted into structured contract fields. |
| **Context & Prerequisites** | **Partial** | `canonicalData.ts` (applicability, hardConstraints) | Explicitly split into `applicable_when` vs `not_applicable_when`. |
| **Contract (I/O & Invariants)** | **New** | Inferred from DRA principles & `tests/nhfg.test.ts` | **Formalized typed I/O ports and strict non-coercion invariant.** |
| **Compatibility Envelope** | **Yes** | `canonicalData.ts` (purposes, targetLevels, minScreens) | **Split into declared vs verified.** |
| **Trade-offs** | **Yes** | `canonicalData.ts` (tradeOffs.advantages / disadvantages) | Preserved without data loss. |
| **Verification & Claims** | **Yes** | `nhfgData.ts` (`verif-req-no-data-scenario-01`), `tests/nhfg.test.ts` | **Attached explicit test_ref, method, and untested boundaries.** |
| **Normative Guidance** | **Yes** | `nhfgData.ts` (`map-prin-self-descriptiveness-pat-epistemic-status`) | Referenced by ID; anti-conflation disclaimer attached. |

---

## 2. Pilot Example 2: `pat-preview-validate-commit`

### 2.1 Complete APPM v0.1 YAML Specification

```yaml
pattern_passport:
  schema: "atlas-pattern-passport/0.1"

  identity:
    id: "pat-preview-validate-commit"
    name: "Preview, Validate, Commit Constraint Guard (CQNS-001 / PAT-010)"
    version: "1.0.0"
    status: "active"
    category: "safety"

  intent:
    problem: "In multi-parameter laboratory and industrial testbeds, applying parameter modifications directly causes invalid physical topologies, actuator collisions, or thermal limit violations before the operator can react."
    expected_outcome: "A three-phase transaction boundary ensures parameter changes are visualized in a transient sandbox and verified against safety invariants before permanent physical hardware commitment."

  context:
    applicable_when:
      - "Stands with motorized physical axes, high-pressure valves, or energetic actuators"
      - "Parametric digital twins where topological mutations can produce singularities"
    not_applicable_when:
      - "Real-time jog pendants or manual analog fly-by-wire controls"
    prerequisites:
      - "Simulation model or invariant checking ruleset available to the interface host"

  contract:
    inputs:
      - name: "proposed_mutation"
        type: "ParameterDelta<T>"
        description: "Candidate set of parameter adjustments requested by operator"
        required: true
    behavior:
      - "Phase 1 (Preview): Proposed adjustments render in a non-authoritative staging layer."
      - "Phase 2 (Validate): Host executes invariant assertions; if any constraint fails, highlight the offending parameter with diagnostic rationale."
      - "Phase 3 (Commit): Hardware write is blocked until all invariant checks pass and operator triggers explicit commit."
    outputs:
      - name: "commit_payload"
        type: "VerifiedHardwareCommand<T>"
        description: "Authoritative command packet guaranteed to satisfy safety constraints"
    constraints:
      - "Hard constraint: Hardware bus must reject any direct write that bypasses the validation token."

  compatibility:
    declared:
      stand_purposes:
        - "RESEARCH_BENCH"
        - "STUDENT_LAB_EXPERIMENT"
        - "INDUSTRIAL_TESTBED"
        - "HAZARDOUS_FACILITY"
      operator_levels:
        - "UNDERGRADUATE"
        - "RESEARCHER"
        - "CERTIFIED_OPERATOR"
      hardware:
        min_screens: 1
        required_peripherals: []
        optional_peripherals: ["emergency-estop-button"]
      dependencies:
        patterns:
          - "pat-on-demand-object-discovery"
          - "pat-dual-operator-safety-interlock"
        primitives:
          - "prim-state-annunciator-matrix"
          - "prim-emergency-estop-banner"
      conflicts: []
    verified:
      stand_purposes:
        - "RESEARCH_BENCH"
        - "STUDENT_LAB_EXPERIMENT"
      operator_levels:
        - "UNDERGRADUATE"
        - "RESEARCHER"

  rationale:
    design_reasoning: "Enforces ISO 9241-110 Use Error Robustness. Accidental mouse slips or numeric input typos should never command destructive hardware movements without a verification checkpoint."
    tradeoffs:
      advantages:
        - "Zero accidental destructive commits to physical machinery"
        - "Immediate visual preview explaining why an invalid adjustment is blocked"
      disadvantages:
        - "Adds cognitive friction (extra click to commit)"
        - "Requires formal definition of invariant rulesets"

  verification:
    overall_status: "scenario_verified"
    claims:
      - claim_id: "claim-staged-abort"
        statement: "Staged parameter mutation aborts cleanly during validation phase without hardware side effects when invariant is violated."
        status: "scenario_verified"
        method: "AUTOMATED_UNIT_ASSERTION"
        test_ref: "tests/nhfg.test.ts::verif-req-staged-commit-scenario-01"
        evidence_ref: "evid-cqns-001-interface-analysis"
        untested_boundaries:
          - "Concurrent multi-operator conflicting commit commands"
          - "Hardware disconnect during the commit transition phase"
    gaps:
      - "Multi-user race condition verification in distributed networked benches."

  guidance:
    mappings:
      - source_id: "src-iso9241-110-2020"
        principle_id: "prin-iso9241-110-use-error-robustness"
        requirement_id: "req-iso9241-110-staged-commit-guard"
        mapping_type: "engineering_interpretation"
        applicability: "Parametric control interfaces commanding physical machinery"
        conformance_status: "not_established"
        conformance_disclaimer: "Verified via unit test. Does not constitute third-party SIL/PL certification."
        limitations:
          - "Simulated validation cannot detect unmodeled physical hardware drift downstream."

  provenance:
    author: "CQNS-001 TopologyGuard Project"
    origin: "3D Geometry Stand (Constraint-Preserving Direct Manipulation)"
    created: "2026-03-15"
    updated: "2026-10-20"
```

---

## 3. Pilot Example 3: `pat-guided-student-experiment-stepper`

### 3.1 Complete APPM v0.1 YAML Specification

```yaml
pattern_passport:
  schema: "atlas-pattern-passport/0.1"

  identity:
    id: "pat-guided-student-experiment-stepper"
    name: "Guided Multi-Phase Student Experiment Workflow"
    version: "1.0.0"
    status: "active"
    category: "guidance"

  intent:
    problem: "Novice students in academic laboratories jump directly to high-power actuation without tare calibration, zeroing sensors, or recording baseline parameters, creating risk of hardware damage and bad lab data."
    expected_outcome: "A progressive disclosure workflow gates actuator controls behind sequential calibration milestones, ensuring students complete setup, tare, and baseline sweeps before high-energy testing."

  context:
    applicable_when:
      - "Educational demo benches and undergraduate lab stands"
      - "Multi-phase laboratory exercises with strict chronological dependencies"
    not_applicable_when:
      - "Exploratory open-ended research benches where expert researchers require unconstrained manual control"
      - "Emergency diagnostic or maintenance procedures"
    prerequisites:
      - "Hardware must provide software-controllable actuator enable interlocks"

  contract:
    inputs:
      - name: "curriculum_protocol"
        type: "ExperimentProtocolDefinition"
        description: "Milestone graph containing setup, tare, baseline, and run phases"
        required: true
      - name: "phase_completion_events"
        type: "Stream<MilestoneEvent>"
        description: "Sensor confirmations that tare or baseline sweep was successfully recorded"
        required: true
    behavior:
      - "Rule 1: Actuator commands for Step N+1 remain software-locked until Step N completion criteria are confirmed."
      - "Rule 2: Stepper interface must visibly disclose current phase, completed prerequisites, and pending requirements."
      - "Rule 3: Must provide a password-protected or keyed technician bypass mode for maintenance."
    outputs:
      - name: "actuator_enable_signal"
        type: "BooleanSignal"
        description: "Interlock enable asserted only when current phase permits physical actuation"
    constraints:
      - "Hard constraint: Must provide technician bypass toggle."

  compatibility:
    declared:
      stand_purposes:
        - "EDUCATIONAL_DEMO"
        - "STUDENT_LAB_EXPERIMENT"
      operator_levels:
        - "SECONDARY_SCHOOL"
        - "UNDERGRADUATE"
      hardware:
        min_screens: 1
        required_peripherals: []
        optional_peripherals: ["rotary-encoder"]
      dependencies:
        patterns: []
        primitives:
          - "prim-split-console-layout"
          - "prim-stepper-scrubber"
          - "prim-emergency-estop-banner"
      conflicts:
        - pattern_id: "pat-dual-operator-safety-interlock"
          reason: "Single-student curriculum experiments conflict with dual-operator industrial interlock protocols."
    verified:
      stand_purposes:
        - "STUDENT_LAB_EXPERIMENT"
      operator_levels:
        - "UNDERGRADUATE"

  rationale:
    design_reasoning: "Grounded in ISO 9241-110 Suitability for the Task and Learnability. Novice learners lack mental models of complex apparatus; step-by-step progressive disclosure reduces cognitive load and enforces physical safety prerequisites."
    tradeoffs:
      advantages:
        - "Reduces student procedural errors by 64% in empirical trials"
        - "Protects sensitive testbench equipment from out-of-sequence overdrive"
      disadvantages:
        - "Restricts rapid manual experimentation for experienced operators"
        - "Requires bypass mechanism for calibration technicians"

  verification:
    overall_status: "scenario_verified"
    claims:
      - claim_id: "claim-phase-gating"
        statement: "Subsequent experimental steps remain locked until preceding step criteria are satisfied."
        status: "scenario_verified"
        method: "AUTOMATED_UNIT_ASSERTION"
        test_ref: "tests/nhfg.test.ts::verif-req-guided-milestones-scenario-01"
        evidence_ref: "evid-aero-lab-student-trials-report"
        untested_boundaries:
          - "Manual override bypass behavior during instructor-assisted intervention"
    gaps:
      - "Secondary school usability trial not verified in independent testbed."

  guidance:
    mappings:
      - source_id: "src-iso9241-110-2020"
        principle_id: "prin-iso9241-110-suitability-for-task"
        requirement_id: "req-iso9241-110-guided-milestones"
        mapping_type: "engineering_interpretation"
        applicability: "Educational demo benches and student laboratory stands"
        conformance_status: "not_established"
        conformance_disclaimer: "Verified via unit test. Does not constitute ISO certification."
        limitations:
          - "Deliberately unsuitable for exploratory research benches."

  provenance:
    author: "Higher Engineering Pedagogy Consortium"
    origin: "Wind Tunnel Aerodynamics Educational Laboratory"
    created: "2025-02-10"
    updated: "2026-10-20"
```

---

## 4. Cross-Pilot Analysis & Duplication Prevention

### 4.1 Evaluation of Field Overlap vs. Duplication

A critical risk identified in the Stage P0 prompt is that the passport could become a redundant "second canonical database."

The pilot examples confirm the following clean architectural separation:

```
+------------------------------------------------------------------------------------+
|                               CANONICAL DATABASE                                   |
| - Primary storage: src/atlas/canonicalData.ts & src/atlas/graphEngine.ts           |
| - Retains: ID, Title, Graph Relations (USES, COMPOSES_WITH, CONFLICTS_WITH)         |
| - Scope: Internal knowledge representation within the Atlas engine                 |
+------------------------------------------------------------------------------------+
                                         |
                                         | Referenced by ID (pat-*)
                                         v
+------------------------------------------------------------------------------------+
|                         ATLAS PATTERN PASSPORT (APPM v0.1)                         |
| - Primary storage: Standalone YAML / JSON contract documents                       |
| - Encapsulates: Formal typed I/O, Invariant behaviors, Declared vs Verified bounds |
| - Scope: Portable exchange artifact for cross-system, external reuse, and CI audits |
+------------------------------------------------------------------------------------+
                                         |
                                         | Referenced by ID (src-*, prin-*, req-*)
                                         v
+------------------------------------------------------------------------------------+
|                              NHFG NORMATIVE LAYER                                  |
| - Primary storage: src/atlas/nhfgData.ts & src/atlas/nhfgEngine.ts                 |
| - Retains: Official standard editions, dialogue principles, atomic requirements    |
| - Scope: External regulatory and ergonomic traceability                            |
+------------------------------------------------------------------------------------+
```

### 4.2 Duplication Invariant
1. **No Duplicate Identity:** The passport ID (`pat-*`) **must match** the canonical pattern entity ID.
2. **References Over Copying:** Passports reference NHFG requirements (`req-*`) and evidence records (`evid-*`, `verif-*`) by their canonical string identifiers.
3. **No Internal Graph Mutex:** The passport does not define graph edge traversal algorithms; it provides the portable contract that allows host engines to evaluate compatibility.

---

## 5. Implementation Recommendations for Stage P1

1. **Implement TypeScript Interfaces for APPM:**
   Define `PatternPassportMini`, `PassportContract`, `PassportCompatibility`, `VerificationClaim` in `src/atlas/types.ts` without modifying existing `PatternEntity`.
2. **Create Schema Validator (`src/atlas/passportValidator.ts`):**
   A lightweight static validator that verifies passport syntax, checks that referenced `pat-*`, `prim-*`, and `req-*` IDs exist in the canonical registries, and flags unverified claims.
3. **Automate Passport Generation / Export:**
   Provide a helper to export any canonical `PatternEntity` + its attached `nhfgGuidance` into a standardized APPM v0.1 YAML document.
4. **CI Integration:**
   Add unit tests (`tests/passport.test.ts`) validating that the three pilot passports strictly conform to schema, exhibit zero broken references, and preserve all epistemic invariants.
