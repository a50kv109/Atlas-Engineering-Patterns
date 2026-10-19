# Atlas Engineering Patterns Roadmap

This roadmap tracks the development, verification, and expansion of Atlas Engineering Patterns.

Stages are updated based on demonstrable codebase evidence. A stage is never marked `COMPLETE` without verified test results.

---

## Stage Breakdown & Status

### Stage 1: GitHub Publication and Reproducibility
- **Status**: `READY FOR INITIAL PUBLICATION`
- **Objective**: Establish transparent repository organization, clean documentation, reproducible build and test commands (`npm test`, `npm run build`, `npm run lint`), and elimination of unsupported claims.
- **Evidence**:
  - `npm test` runs 16 automated tests across canonical data, graph engine, retrieval, ingestion, and internal audit runner with 0 failures.
  - `npm run build` generates the production Vite SPA bundle with zero build errors.
  - Zero proprietary secrets or hardcoded environment keys in repository.
- **Remaining Task**: Repository owner pushes to GitHub via Google AI Studio integration and selects an open-source or institutional license.

---

### Stage 2: Independent Inspection and Correction of Implementation
- **Status**: `IN PROGRESS`
- **Objective**: Identify conceptual flaws, standard conflations (e.g. ISO 13849 PL vs IEC 61508 SIL), dangling edges, and loose heuristics in the existing code.
- **Completed Corrections**:
  - Removed dangling reference `prim-modal-distractor` from `prim-emergency-estop-banner`.
  - Replaced inaccurate claim of "ISO 13849-1 SIL-3" in `canonicalData.ts` and `ComposerView.tsx` with accurate dual-channel hardware interlock terminology.
  - Refined capability matching in `retrievalEngine.ts` to prevent generic keywords from falsely satisfying specialized requirements.
  - Calibrated duplicate detection heuristic threshold to $\ge 45\%$ composite or $\ge 60\%$ title similarity.

---

### Stage 3: Ontology and Graph Validation
- **Status**: `IMPLEMENTED & TESTED (IN-MEMORY BASELINE)`
- **Objective**: Formalize the 5 entity classes and 8 relation concepts (`USES`, `COMPOSES_WITH`, `REQUIRES`, `ALTERNATIVE_TO`, `SPECIALIZES`, `CONFLICTS_WITH`, `IMPLEMENTED_IN`, `VERIFIED_BY`).
- **Evidence**:
  - `KnowledgeGraph.validateGraph()` verifies zero dangling edges and zero type constraint violations.
- **Next Steps**:
  - Add reciprocal edge generation for symmetric relations (`COMPOSES_WITH`, `ALTERNATIVE_TO`).
  - Introduce machine-readable JSON Schema / SHACL shapes for standalone record validation.

---

### Stage 4: Reliable Retrieval and Configuration Composition
- **Status**: `IMPLEMENTED & TESTED (RULE-BASED ENGINE)`
- **Objective**: Synthesize traceable stand interface configurations from user queries; enforce hard constraints and report knowledge gaps honestly.
- **Evidence**:
  - Successfully generates traceable blueprints with zone allocations for educational wind tunnels and research bioreactors.
  - Tested suppression of hazardous patterns for novice secondary school queries.
  - Tested anti-hallucination knowledge gap reporting for exotic requirements.
- **Next Steps**:
  - Support multi-objective optimization (e.g. balancing cognitive load vs telemetry frequency).
  - Add visual drag-and-drop 2D grid customization for the generated blueprint.

---

### Stage 5: Controlled Knowledge Ingestion Workflow
- **Status**: `PROTOTYPE IMPLEMENTED (CLIENT-SIDE)`
- **Objective**: Establish an auditable pipeline for reviewing incoming pattern proposals, detecting duplicates, checking scope, and assigning stable IDs.
- **Current Status**:
  - Interactive submission form and automated review engine running in browser client.
  - Flags duplicates and rejects out-of-scope non-stand proposals.
- **Next Steps (Pending Production Release)**:
  - Transition from in-browser client state to Git PR-based review (`proposals/*.json`).
  - Implement two-person peer sign-off before merging proposed records into canonical storage.

---

### Stage 6: Expansion of the Canonical Pattern Library
- **Status**: `PLANNED`
- **Objective**: Expand beyond the initial 23 seed records to cover additional specialized laboratory domains:
  - Cryogenic vacuum test stands.
  - Particle accelerator radio-frequency cavities.
  - Mobile robotic teleoperation consoles.
  - Microfluidic chip optical observation benches.
- **Invariant**: Every new pattern must satisfy strict scope boundaries and declare explicit trade-offs and applicability constraints.

---

### Stage 7: Evidence-Backed Testing and Independent Verification
- **Status**: `PLANNED`
- **Objective**: Partner with university laboratories and industrial test facilities to conduct formal empirical trials comparing stands built with Atlas configurations against unguided ad-hoc interfaces.
- **Metrics to Track**:
  - Mean time to anomaly detection under high laboratory glare.
  - Operator sequence error rates during emergency shutdown procedures.
  - Student lab completion times and equipment damage incident counts.
