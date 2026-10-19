# Stand Interface Retrieval & Composition Engine

## 1. Request Input Specification

The retrieval engine (`src/atlas/retrievalEngine.ts`) accepts a structured query defined by `StandRequirementQuery`:

```typescript
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
```

### Supported Values:
- **`purpose`**:
  - `EDUCATIONAL_DEMO`: High-level didactic displays with visual clarity and guided steps.
  - `STUDENT_LAB_EXPERIMENT`: University laboratory practicums; requires procedural guardrails.
  - `RESEARCH_BENCH`: Advanced exploration; flexible manual controls and deep raw telemetry.
  - `INDUSTRIAL_TESTBED`: High-reliability continuous monitoring with alarm annunciators.
  - `HAZARDOUS_FACILITY`: High-voltage, explosive, or radiation testbeds; requires interlocked verification.
- **`userLevel`**:
  - `SECONDARY_SCHOOL`: Strict scaffolding, zero unconstrained hazards.
  - `UNDERGRADUATE`: Educational steppers with bound parameter scrubbers.
  - `RESEARCHER`: Full channel control and multi-screen drilldowns.
  - `CERTIFIED_OPERATOR`: Dual-station arming, SIL/PL interlock procedures.
  - `ALL_LEVELS`: Universal access.
- **`screensCount`**: Integer count (1, 2, or 3+ physical displays).
- **`peripherals`**: Declared hardware devices (e.g. `USB Pitot Manometer`, `Hardware E-Stop Mushroom Switch`).
- **`requiredCapabilities`**: Declared functional requirements (e.g. `telemetry`, `time-series`, `guided workflow`, `oscilloscope`, `annunciator`).

---

## 2. Retrieval & Composition Pipeline

```
+---------------------------------------------------------------------------------+
| 1. EXTRACT & NORMALIZE                                                          |
|    - Parse capabilities, peripherals, and user boundaries                       |
+---------------------------------------------------------------------------------+
                                       |
                                       v
+---------------------------------------------------------------------------------+
| 2. CANDIDATE SCORING & HARD CONSTRAINT FILTER                                   |
|    - Evaluate purpose match (+25 / -10)                                         |
|    - Evaluate user level compatibility (+20 / hard block if novice in hazard)   |
|    - Screen count check (hard reject if pattern.minScreens > available)         |
|    - Peripheral requirements check (hard reject if required peripheral missing) |
|    - Capability keyword match (+30 per matching capability)                     |
+---------------------------------------------------------------------------------+
                                       |
                                       v
+---------------------------------------------------------------------------------+
| 3. GRAPH EXPANSION & CONFLICT SUPPRESSION                                       |
|    - Traverse pattern.primitiveIds via USES relationship                        |
|    - Check active CONFLICTS_WITH links; suppress incompatible pairs             |
|    - Retrieve verified evidence links via VERIFIED_BY                           |
|    - Locate interchangeable alternatives via ALTERNATIVE_TO                     |
+---------------------------------------------------------------------------------+
                                       |
                                       v
+---------------------------------------------------------------------------------+
| 4. BLUEPRINT SYNTHESIS & ANTI-HALLUCINATION GAP DETECTION                       |
|    - Assign primitives to 4 layout zones: Ribbon, Rail, Stage, Tray             |
|    - For every unfulfilled capability, emit explicit KnowledgeGap alert         |
|    - Output machine-readable Stand Configuration Manifest (JSON)                |
+---------------------------------------------------------------------------------+
```

---

## 3. Conflict Handling and Anti-Hallucination Policy

### 3.1 Hard Constraint Enforcement
If a hard constraint is violated, the candidate pattern is disqualified immediately, regardless of its relevance score:
- **Novice Hazard Guard**: If `userLevel === 'SECONDARY_SCHOOL'`, industrial interlock and hazardous pulse patterns (e.g. `pat-dual-operator-safety-interlock`) are strictly blocked.
- **Display Output Bounds**: If a pattern requires 2 monitors (e.g. `pat-multi-screen-overview-detailed-drilldown`), it is excluded when the stand has only 1 screen.
- **Missing Safety Peripherals**: If a safety interlock pattern requires a physical hardware mushroom switch, the engine rejects it unless declared in `peripherals`.

### 3.2 Mutual Exclusion (`CONFLICTS_WITH`)
The engine evaluates pairwise conflicts in the knowledge graph. For example:
- `pat-guided-student-experiment-stepper` conflicts with `pat-dual-operator-safety-interlock` (pedagogical single-student stepping is incompatible with two-person certified industrial arming).
- When both are requested, the engine prioritizes the one aligned with the stand purpose and suppresses the conflicting companion.

### 3.3 Honest Knowledge Gap Detection (Anti-Hallucination)
When a user requests an exotic capability not satisfied by any registered canonical pattern or primitive:
- The engine **refuses to fabricate or hallucinate** a synthetic pattern.
- It outputs an explicit `knowledgeGaps` record detailing:
  1. The unmet requirement.
  2. The specific reason no canonical entity matched under the given constraints.
  3. Actionable recommendation to submit an ingestion proposal to the Atlas pipeline.

---

## 4. Current Implementation vs Planned Capabilities

| Capability | Real Current Implementation | Planned for Stage 4 |
| :--- | :--- | :--- |
| **Retrieval Algorithm** | Deterministic score ranking with hard constraint gates | Multi-objective Pareto optimization (cost, latency, complexity) |
| **Zone Allocation** | Heuristic slot mapping (ribbon, control-rail, viewport, strip) | Constraint-based dynamic 2D grid pack solver |
| **Manifest Export** | Fully structured JSON format with traceability links | Direct code generation for React / Qt scaffolding |
| **Live Stand Preview** | Interactive Canvas 2D simulation with reactive sliders | Native binary WebSocket DAQ bridge |
