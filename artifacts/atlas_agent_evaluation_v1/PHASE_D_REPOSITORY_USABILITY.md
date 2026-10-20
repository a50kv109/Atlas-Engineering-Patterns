# Atlas Engineering Patterns — Phase D: First-Time Agent Usability Evaluation
**Evaluation Target:** Repository Structure, Documentation Clarity, Developer/Agent Experience  
**Evaluator Mode:** Simulated First-Time Technical Agent Navigation  
**Inspection Baseline:** Repository markdown files (`README.md`, `CONTRIBUTING.md`, `/docs/*.md`) vs. source code (`/src/atlas/*.ts`, `/tests/*.ts`)  
**Methodological Transparency:** For each task, this document records whether documentation alone was sufficient or whether source-code inspection was required, highlighting navigation friction, documentation gaps, and ambiguities.

---

## Task-by-Task Evaluation Matrix

| Task # | Target Operational Capability | Docs-Only Success? | Source Inspection Required? | Supporting Files Consulted | Friction / Ambiguity Rating |
| :---: | :--- | :---: | :---: | :--- | :---: |
| **Q1** | Explain Atlas's purpose and limits | **YES** | No | `README.md`, `docs/ARCHITECTURE.md` | LOW |
| **Q2** | Find a pattern by purpose (not ID) | **NO** | **YES** | `docs/ONTOLOGY.md`, `src/atlas/canonicalData.ts` | HIGH |
| **Q3** | Trace a pattern to requirements & evidence | **PARTIAL** | **YES** | `docs/NHFG_DATA_MODEL.md`, `src/atlas/nhfgData.ts` | MEDIUM |
| **Q4** | Explain how retrieval works | **YES** | No | `docs/RETRIEVAL_AND_COMPOSITION.md` | LOW |
| **Q5** | Find tests supporting a behavioral claim | **NO** | **YES** | `tests/nhfg.test.ts`, `tests/audit.test.ts` | MEDIUM |
| **Q6** | Distinguish scenario test from user evaluation | **YES** | No | `docs/NHFG_DATA_MODEL.md` | LOW |
| **Q7** | Determine whether compatibility is verified | **NO** | **YES** | `src/atlas/canonicalData.ts`, `docs/ATLAS_PATTERN_PASSPORT_MINI.md` | HIGH |
| **Q8** | Add a new pattern without violating rules | **YES** | No | `CONTRIBUTING.md`, `docs/KNOWLEDGE_LIFECYCLE.md` | LOW |
| **Q9** | Handle missing required evidence | **YES** | No | `docs/RETRIEVAL_AND_COMPOSITION.md` | LOW |
| **Q10**| Explain what passport contributes vs. guarantees | **YES** | No | `docs/ATLAS_PATTERN_PASSPORT_MINI.md` | LOW |

---

## Detailed Task Logs and Verbatim Findings

### Q1: Explain Atlas's Purpose and Limits
- **Submitted Prompt:** "Explain what Atlas Engineering Patterns is designed for, and what its explicit boundaries and non-goals are."
- **Recorded Response:**  
  "Atlas is a specialized engineering ontology, knowledge graph, and composition system for Human-Machine Interfaces (HMIs) in laboratory testbenches, research stands, and educational experiments. Its purpose is to assemble verifiable, ergonomic, and safety-constrained interface blueprints for complex physical hardware.  
  *Explicit Limits & Non-Goals:*
  1. It is not a general-purpose SaaS design system or consumer UI component kit.
  2. It does not generate autonomous AI chatbot assistants.
  3. It does not grant or certify official compliance with international standards (such as ISO 13849, IEC 61508, or ISO 9241) on its own authority."
- **Files Consulted:** `README.md`, `docs/ARCHITECTURE.md`.
- **Source Inspection Needed:** No. Documentation clearly establishes domain boundaries.
- **Ambiguity Encountered:** None.

---

### Q2: Find a Pattern by Purpose Rather Than ID
- **Submitted Prompt:** "Find all patterns suitable for 'STUDENT_LAB_EXPERIMENT' targeting 'SECONDARY_SCHOOL' students on a 1-screen setup."
- **Recorded Response:**  
  "Filtering by purpose `STUDENT_LAB_EXPERIMENT` and target level `SECONDARY_SCHOOL` with `minScreens: 1` identifies:
  1. `pat-guided-student-experiment-stepper` (Guided Multi-Phase Student Experiment Workflow).
  2. `pat-epistemic-status-labeling` (Explicit Fact, Interpretation, and Hypothesis Labels).
  Industrial patterns like `pat-dual-operator-safety-interlock` and `pat-high-rate-signal-inspection` are strictly excluded because they require `RESEARCHER` or `CERTIFIED_OPERATOR` levels."
- **Files Consulted:** `docs/ONTOLOGY.md`, `docs/CROSS_REPOSITORY_AUDIT.md`, `src/atlas/canonicalData.ts`.
- **Source Inspection Needed:** **YES**.
- **Friction & Defect Identified:** `docs/ONTOLOGY.md` explains the entity types and relations, but does not provide an exhaustive lookup table of pattern applicability matrices. An agent relying purely on markdown files must guess or parse code in `src/atlas/canonicalData.ts`. A generated machine-readable index or catalog markdown table is missing.

---

### Q3: Trace a Pattern to Relevant Requirements and Evidence
- **Submitted Prompt:** "Trace `pat-epistemic-status-labeling` from its canonical pattern record up to its normative standard clause and down to its executable test verification."
- **Recorded Response:**  
  "The traceability chain for `pat-epistemic-status-labeling` resolves as follows:
  1. **Source Standard:** ISO 9241-110:2020 (*Ergonomics of human-system interaction — Part 110: Interaction principles*), Clause 4.2 (`prin-iso9241-110-self-descriptiveness`).
  2. **Normative Requirement:** `req-iso9241-110-no-data-distinct` (*Missing, invalid, or uncalibrated telemetry must be visually distinguishable from valid measurements and must never be coerced to numeric zero*).
  3. **Pattern Mapping:** `map-epistemic-status-01` (`designRationaleStatus: DESIGN_RATIONALE_PROVIDED`, `conformanceStatus: CONFORMANCE_NOT_ESTABLISHED`).
  4. **Executable Verification:** `verif-req-no-data-scenario-01` executed in `tests/nhfg.test.ts` (verifies null handling preserving 101.4 kPa average vs. naive 67.6 kPa corruption)."
- **Files Consulted:** `docs/NHFG_DATA_MODEL.md`, `src/atlas/nhfgData.ts`, `tests/nhfg.test.ts`.
- **Source Inspection Needed:** **YES**.
- **Friction & Defect Identified:** `docs/NHFG_DATA_MODEL.md` explains the schema and theoretical chain, but the exact mapping IDs (`map-epistemic-status-01`) and test function names (`verif-req-no-data-scenario-01`) only exist inside TypeScript source files.

---

### Q4: Explain How Retrieval Works
- **Submitted Prompt:** "Explain the step-by-step algorithm used by the Retrieval Engine to compose a stand solution."
- **Recorded Response:**  
  "The `RetrievalEngine` executes a deterministic multi-stage pipeline:
  1. *Candidate Filtering:* Filters patterns matching query `purpose` and allowable `userLevel`.
  2. *Hard Constraint & Safety Gate:* Discards candidates violating physical constraints (e.g., minimum screens, required hardware peripherals, prohibited operator tiers).
  3. *Conflict Elimination:* Evaluates mutual exclusions via `KnowledgeGraph.getConflictingEntities()` (e.g. dual-operator interlock conflicts with student stepper).
  4. *Anti-Hallucination Capability Matching:* Matches query capabilities. Unmatched requirements are logged as explicit `knowledgeGaps` rather than hallucinatory fills, forcing `validationStatus = 'UNVERIFIED'`.
  5. *Layout Slot Allocation:* Assigns matched primitives to ergonomic viewport zones (Top Ribbon, Left Control Rail, Center Viewport Stage, Bottom Telemetry Tray).
  6. *Normative Guidance Binding:* Attaches NHFG guidance records and logs epistemic loss if unverified."
- **Files Consulted:** `docs/RETRIEVAL_AND_COMPOSITION.md`, `src/atlas/retrievalEngine.ts`.
- **Source Inspection Needed:** No. `docs/RETRIEVAL_AND_COMPOSITION.md` provides an accurate description of the pipeline.

---

### Q5: Find Tests Supporting a Behavioral Claim
- **Submitted Prompt:** "Where in the codebase is it tested that an introductory secondary school query will NEVER receive a hazardous dual-operator safety interlock?"
- **Recorded Response:**  
  "This is asserted in `tests/audit.test.ts`, specifically in test suite `--- 3. Retrieval & Composition Engine ---`, test case `Boundary constraint: Secondary school user level strictly excludes hazardous certified interlocks` (around lines 70–82). Additionally, Scenario 4 in `tests/nhfgRetrieval.test.ts` re-verifies that hard safety constraints cannot be bypassed by normative guidance."
- **Files Consulted:** `tests/audit.test.ts`, `tests/nhfgRetrieval.test.ts`.
- **Source Inspection Needed:** **YES**.
- **Friction & Defect Identified:** `docs/TESTING.md` mentions that tests exist and pass, but does not provide an index of which specific test assertion verifies which requirement.

---

### Q6: Explain the Difference Between a Scenario Test and User Evaluation
- **Submitted Prompt:** "In the NHFG layer, why are `scenarioVerificationStatus` and `userEvaluationStatus` tracked separately?"
- **Recorded Response:**  
  "They represent fundamentally different epistemic levels:
  - `scenarioVerificationStatus` (`SCENARIO_VERIFIED`) measures whether a deterministic software algorithm or invariant holds in an automated test harness (e.g., asserting that passing `null` does not evaluate to `0.0`).
  - `userEvaluationStatus` (`USER_EVALUATED`) measures empirical human-factors outcomes with actual operators or students in a physical laboratory setting (e.g., measuring cognitive load, task completion rate, or error frequency during real trials).
  A pattern may pass 100% of automated software scenarios while remaining completely untested on human operators."
- **Files Consulted:** `docs/NHFG_DATA_MODEL.md`, `docs/NHFG_IMPLEMENTATION_REPORT.md`.
- **Source Inspection Needed:** No. Documentation clearly establishes this orthogonal separation.

---

### Q7: Determine Whether a Pattern's Compatibility Is Verified
- **Submitted Prompt:** "In `pat-guided-student-experiment-stepper`, the pattern metadata lists both SECONDARY_SCHOOL and UNDERGRADUATE. Has its compatibility with secondary school students been verified?"
- **Recorded Response:**  
  "No, it is declared but NOT verified. The canonical pattern record in `src/atlas/canonicalData.ts` lists `SECONDARY_SCHOOL` under `applicability.targetLevels` (declared design intent). However, its attached evidence entity (`evid-aero-lab-student-trials-report`) explicitly documents trials conducted solely on 35 university undergraduate students in an aerodynamics laboratory. There is zero empirical trial evidence for secondary school cohorts in the repository."
- **Files Consulted:** `src/atlas/canonicalData.ts` (lines 274–294 and lines 1450–1485).
- **Source Inspection Needed:** **YES**.
- **Friction & Defect Identified:** In `src/atlas/canonicalData.ts`, `PatternEntity` has a single `applicability` block. The explicit partition between `compatibility.declared` and `compatibility.verified` is specified in APPM (`docs/ATLAS_PATTERN_PASSPORT_MINI.md`), but is not yet backported into the TypeScript interface `PatternEntity` in `src/atlas/types.ts`. An agent must cross-examine the text of `evid-*` to discover this gap.

---

### Q8: Explain How to Add a New Pattern Without Violating Canonical Rules
- **Submitted Prompt:** "If an engineer wants to contribute a new telemetry pattern, what rules must be obeyed so the canonical graph and audit do not break?"
- **Recorded Response:**  
  "To contribute a new pattern without violating repository invariants:
  1. *Stable Prefix & ID:* Must use a unique ID starting with `pat-` (e.g. `pat-thermal-gradient-matrix`).
  2. *Required Fields:* Must supply `problemStatement`, `solutionSummary`, `tradeOffs` (advantages & disadvantages), `applicability` (purposes, targetLevels, minScreens), and `domainCategory`.
  3. *Zero Dangling Edges:* Any referenced `primitiveIds`, `evidenceIds`, or `relations` must point to existing canonical entities.
  4. *Ingestion Pipeline Gatekeeping:* The pattern must pass `IngestionEngine.auditScope()` (confirming it is an engineering stand pattern, not a generic SaaS widget) and duplicate similarity checks (Jaccard threshold < 0.45).
  5. *Test Suite Verification:* Must maintain 100% pass rate in `npm test`."
- **Files Consulted:** `CONTRIBUTING.md`, `docs/KNOWLEDGE_LIFECYCLE.md`, `src/atlas/ingestionEngine.ts`.
- **Source Inspection Needed:** No. `CONTRIBUTING.md` and `docs/KNOWLEDGE_LIFECYCLE.md` document this workflow accurately.

---

### Q9: Identify What to Do When Required Evidence Is Missing
- **Submitted Prompt:** "An engineer wants to claim that a pattern prevents operator fatigue, but no usability trial report exists. How does Atlas handle this?"
- **Recorded Response:**  
  "Atlas enforces SOL-2 epistemic loss logging:
  1. The pattern cannot list an unverified claim as fact.
  2. If matched via loose keywords, `RetrievalEngine` tags it as `HEURISTIC_MATCH_ONLY`, downgrades `validationStatus` to `UNVERIFIED`, and registers an entry in `lossLog`.
  3. In the NHFG layer, `userEvaluationStatus` must remain `NOT_ASSESSED`.
  4. It is strictly forbidden to claim ISO standard compliance (`conformanceStatus` remains `CONFORMANCE_NOT_ESTABLISHED`)."
- **Files Consulted:** `docs/RETRIEVAL_AND_COMPOSITION.md`, `docs/NHFG_DATA_MODEL.md`.
- **Source Inspection Needed:** No.

---

### Q10: Explain What the Passport Contributes and What It Does Not Guarantee
- **Submitted Prompt:** "What does having an Atlas Pattern Passport (APPM) prove, and what does it explicitly NOT prove?"
- **Recorded Response:**  
  "**What it proves:**  
  The passport proves that a formal, machine-readable engineering contract was declared: it specifies the intended inputs, expected outputs, behavioral rules, physical constraints, declared operating context, and traceable pointers to implementation and test artifacts.  
  **What it does NOT prove:**  
  1. It does not prove that an implementation is bug-free or safe.  
  2. It does not prove that the pattern is certified by an external standards body (ISO, IEC, OSHA).  
  3. It does not force a host system to admit the pattern (host retains admission sovereignty).  
  *Core Axiom:* `Passport (Contract) != Implementation (Code) != Evidence (Proof)`."
- **Files Consulted:** `docs/ATLAS_PATTERN_PASSPORT_MINI.md`.
- **Source Inspection Needed:** No. `ATLAS_PATTERN_PASSPORT_MINI.md` documents this distinction with mathematical clarity.

---

## 3. Summary of Usability Strengths and Deficiencies

### High-Performing Areas:
1. **Architectural Principles & Epistemic Boundaries:** `README.md`, `ARCHITECTURE.md`, `NHFG_DATA_MODEL.md`, and `ATLAS_PATTERN_PASSPORT_MINI.md` are exceptionally coherent regarding non-goals, anti-conflation, and epistemic separation.
2. **Workflow & Ingestion Guidance:** `CONTRIBUTING.md` and `KNOWLEDGE_LIFECYCLE.md` provide clear operational rules for adding patterns and preserving graph integrity.

### Critical Friction Points & Documentation Gaps:
1. **Absence of a Rendered Pattern Catalog in Markdown:** Finding patterns by applicability requirements currently forces inspection of `src/atlas/canonicalData.ts`. A generated `docs/CATALOG.md` is urgently needed.
2. **Test Traceability Index:** There is no cross-reference table mapping requirements/patterns to specific test names in `tests/*.test.ts`.
3. **Type Model Discrepancy:** The APPM concept of `compatibility.declared` vs. `compatibility.verified` is articulated in `docs/ATLAS_PATTERN_PASSPORT_MINI.md`, but `PatternEntity` in `src/atlas/types.ts` still only has a single `applicability` object.
