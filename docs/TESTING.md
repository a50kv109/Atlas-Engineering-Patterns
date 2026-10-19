# Testing Setup, Audit Runner, and Verification

## 1. Test Execution Commands

The repository provides automated CLI verification scripts defined in `package.json`:

```bash
# Run the automated test suite (Graph, Retrieval, Ingestion, and Acceptance Audit)
npm test

# Run TypeScript static type and schema validation
npm run lint

# Build the production application bundle via Vite
npm run build
```

---

## 2. Test Architecture and Suites

Automated tests are housed in `tests/audit.test.ts` and `tests/epistemicLoss.test.ts` and executed via `npm test` (`tsx tests/audit.test.ts && tsx tests/epistemicLoss.test.ts`):

```
================================================================
ATLAS ENGINEERING PATTERNS — TEST SUITE EXECUTION
================================================================
--- 1. Canonical Dataset Structure & Stability ---
[PASS] Canonical entity count (53) meets baseline threshold
[PASS] All canonical entity IDs are strictly unique
[PASS] All 5 canonical entity types are populated
[PASS] Deterministic Reasoning Anchor pattern is present in canonical records

--- 2. Knowledge Graph & Relationship Rules ---
[PASS] Zero dangling edges in knowledge graph
[PASS] Zero type-constraint violations in graph edges
[PASS] Graph neighbor traversal returns connected nodes

--- 3. Retrieval & Composition Engine ---
[PASS] Normal case: guided stepper matched for undergraduate experiment
[PASS] Normal case: primitives populated in blueprint zones
[PASS] Boundary constraint: Secondary school user level strictly excludes hazardous certified interlocks
[PASS] Anti-hallucination check: missing capability correctly flagged as explicit Knowledge Gap
[PASS] Conflict prevention: incompatible patterns suppressed from co-selection

--- 4. Ingestion Pipeline & Scope Gatekeeping ---
[PASS] Ingestion gatekeeper: rejects out-of-scope non-stand proposal
[PASS] Ingestion gatekeeper: flags duplicate/synonym proposal
[PASS] Ingestion gatekeeper: accepts valid in-scope candidate

--- 5. Acceptance Audit Engine Execution ---
[PASS] Acceptance Audit formal verdict is ACCEPTED (12/12 criteria passed)
[PASS] Acceptance Audit reports zero critical findings
================================================================
TOTAL AUDIT TESTS: 17 | PASSED: 17 | FAILED: 0
================================================================

================================================================
ATLAS × SOL-2 — EPISTEMIC REFINEMENT & LOSS LOG TESTS (PHASE 1.3)
================================================================
[PASS] Test 1: Validation status correctly computed
[PASS] Test 2: Epistemic provenance is attached to solution
[PASS] Test 3: Knowledge gaps force UNVERIFIED validation status instead of false COMPATIBLE
[PASS] Test 4: Active conflicts tracked separately from technical incompatibility
[PASS] Test 5: Loss log registers unmet requirements
[PASS] Test 6: Excluded candidates correctly logged in lossLog
[PASS] Test 7: Heuristic-only match registers HEURISTIC_MATCH_ONLY and forces UNVERIFIED status
[PASS] Test 8: Backward compatibility preserved for matchedPatterns and matchedPrimitives
================================================================
TOTAL EPISTEMIC TESTS: 8 | PASSED: 8 | FAILED: 0
================================================================
```

---

## 3. Detailed Test Suite Coverage

### Suite 1: Canonical Dataset Integrity
- **Unique Stable Identifiers**: Validates that all IDs follow prefix conventions (`prim-*`, `pat-*`, `cfg-*`, `impl-*`, `evid-*`) and contain zero hash collisions.
- **Entity Type Partitioning**: Proves that all five entity classes are instantiated and distinct.

### Suite 2: Knowledge Graph Integrity
- **Dangling Reference Check**: Proves every edge connects an existing source to an existing target.
- **Type-Constraint Compliance**: Verifies that every edge adheres to `RELATION_RULES` (e.g. `USES` cannot target `evidence`; `VERIFIED_BY` must target `evidence`).
- **Graph Traversal**: Confirms that bidirectional neighborhood lookups resolve adjacent nodes.

### Suite 3: Retrieval & Constraint Evaluation
- **Normal Flow**: Confirms that an undergraduate aerodynamics stand query retrieves `pat-guided-student-experiment-stepper` and populates the 4 UI layout zones.
- **Boundary Restriction**: Confirms that novice secondary school users cannot be assigned certified-operator hazardous interlocks.
- **Anti-Hallucination Gap Detection**: Confirms that submitting an unrepresented exotic requirement (`superconducting levitation 3d magnetic tomography`) results in an explicit `KnowledgeGap` instead of a fabricated pattern.
- **Mutual Exclusion**: Confirms that `pat-guided-student-experiment-stepper` and `pat-dual-operator-safety-interlock` are not co-selected.

### Suite 4: Ingestion Pipeline Gatekeeping
- **Scope Rejection**: Rejects non-stand submissions (e.g. cryptocurrency, NFT, general e-commerce).
- **Duplicate Flagging**: Flags lexical/semantic duplicates (e.g. re-submitting an existing time-series strip) with `FLAG_DUPLICATE`.
- **Valid Intake**: Accepts well-formed in-scope candidates with `ACCEPT_CANDIDATE`.

### Suite 5: Internal Acceptance Audit Runner
- Executes the 12 criteria specified in Prompt 5, verifying that the live programmatic codebase satisfies all architectural invariants.

---

## 4. Limitations of the Internal Audit

**The internal audit runner checks programmatic code contracts; it does not constitute independent institutional verification.**

1. **What the Internal Audit Proves**:
   - The TypeScript schemas, graph structures, retrieval rules, and duplicate filters behave deterministically and pass all assertions.
   - There are no dangling references or unhandled type exceptions in the canonical records.
2. **What the Internal Audit CANNOT Prove**:
   - It cannot physically certify that a high-voltage interlock will save human lives on actual high-voltage laboratory machinery.
   - It cannot prove that an ergonomics study performed in 2023 applies universally to all display hardware.
   - Physical equipment safety requires hardware emergency-stop loops, independent safety relays, and certified functional safety compliance (e.g. ISO 13849-1, IEC 62061), which cannot be established by software UI configurations alone.

---

## 5. Known Untested Areas

- **Live WebSocket DAQ Ingestion**: The time-series Canvas renderer currently operates on an animated synthetic baseline. Physical DAQ binary serialization (e.g. LabVIEW, National Instruments, Modbus TCP) is not unit-tested in this suite.
- **Multi-Monitor Physical Output**: Multi-monitor window synchronization is tested logically in layout recipes, but not with multi-display physical GPU outputs.
- **End-to-End Browser UI Automation**: Playwright/Cypress end-to-end browser tests are not currently configured.
