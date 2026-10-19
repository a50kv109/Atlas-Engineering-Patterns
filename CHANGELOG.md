# Changelog

All notable changes to the **Atlas Engineering Patterns** repository will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-10-19

### Initial Documented Baseline

This release establishes the formal initial baseline for Atlas Engineering Patterns, consolidating the architectural contract, canonical data models, knowledge graph engine, retrieval engine, ingestion pipeline, and technical acceptance audit runner.

#### Added
- **Core Entity Models & Schemas (`src/atlas/types.ts`)**:
  - Typed discriminants for 5 canonical entity types: `primitive`, `pattern`, `configuration`, `implementation`, `evidence`.
  - 7 lifecycle maturity states: `PROPOSED`, `SPECIFIED`, `IMPLEMENTED`, `TESTED`, `INDEPENDENTLY_VERIFIED`, `MEASURED`, `DEPRECATED`.
  - 8 directional relationship concepts: `USES`, `COMPOSES_WITH`, `REQUIRES`, `ALTERNATIVE_TO`, `SPECIALIZES`, `CONFLICTS_WITH`, `IMPLEMENTED_IN`, `VERIFIED_BY`.
- **Canonical Repository Storage (`src/atlas/canonicalData.ts`)**:
  - 8 Construction Primitives (`prim-time-series-strip`, `prim-calibrated-gauge-dial`, `prim-emergency-estop-banner`, `prim-stepper-scrubber`, `prim-crosshair-canvas`, `prim-state-annunciator-matrix`, `prim-split-console-layout`, `prim-multichannel-waterfall`).
  - 6 Interface Patterns (`pat-calibrated-telemetry-console`, `pat-guided-student-experiment-stepper`, `pat-high-rate-signal-inspection`, `pat-dual-operator-safety-interlock`, `pat-multi-screen-overview-detailed-drilldown`, `pat-graceful-hardware-drift-alerting`).
  - 3 Stand Configurations (`cfg-aerodynamics-wind-tunnel-edustand`, `cfg-bioreactor-fermentation-research`, `cfg-high-voltage-pulse-lab`).
  - 3 Implementation References (`impl-aerolab-v2-web-console`, `impl-biotech-lab-touch-rig`, `impl-pulse-power-rig-qt`).
  - 3 Calibrated Evidence Records (`evid-iso-9241-ergonomics-study-2023`, `evid-aero-lab-student-trials-report`, `evid-high-voltage-safety-audit-2024`).
- **Knowledge Graph Engine (`src/atlas/graphEngine.ts`)**:
  - In-memory graph builder extracting edges dynamically from canonical records.
  - Relational semantics and allowed source/target type validation (`RELATION_RULES`).
  - Pairwise conflict detection (`detectConflicts`).
- **Retrieval & Composition Engine (`src/atlas/retrievalEngine.ts`)**:
  - Deterministic multi-factor scoring matching stand purpose, user level, peripherals, and required capabilities.
  - Hard constraint enforcement (e.g. novice hazard prevention, minimum display counts).
  - Traceable layout blueprint generation across 4 zones: Top Ribbon, Left Rail, Center Stage, Bottom Tray.
  - Honest Knowledge Gap detection: explicitly flags unsupported capabilities rather than hallucinating synthetic patterns.
  - JSON Stand Manifest export.
- **Ingestion & Maintenance Pipeline (`src/atlas/ingestionEngine.ts`)**:
  - Automated scope boundary check against prohibited non-stand domains.
  - Jaccard similarity token overlap duplicate detector.
  - Stable prefix ID generator (`prim-*`, `pat-*`, etc.).
  - Formal audit review report generator with recommendations (`ACCEPT_CANDIDATE`, `REQUEST_REVISIONS`, `FLAG_DUPLICATE`, `REJECT_OUT_OF_SCOPE`).
- **Acceptance Audit Test Engine & CLI Suite (`src/atlas/auditEngine.ts`, `tests/audit.test.ts`)**:
  - 16-test automated verification suite covering dataset uniqueness, graph integrity, boundary retrieval, conflict suppression, duplicate gatekeeping, and the 12 criteria of Prompt 5.
- **Interactive Laboratory Workbench UI (`src/atlas/components/`)**:
  - Top navigation strictly adhering to the Top Bar Contract.
  - Repository browser with entity cards, search, type filters, and specification inspector.
  - Interactive SVG Knowledge Graph with pan, zoom, node selection, and edge inspector.
  - Stand Solution Composer with interactive layout simulation (E-stop banner, steppers, crosshair canvas, live Canvas 2D waveform buffer).
  - Proposal Ingestion form with preset testing scenarios.
  - Audit Runner with live execution and detailed findings viewer.
  - Architecture Contract documentation viewer.

#### Changed / Corrected
- Fixed dangling reference `prim-modal-distractor` in `prim-emergency-estop-banner`, replacing it with valid canonical target `prim-state-annunciator-matrix`.
- Corrected safety standard claims in `pat-dual-operator-safety-interlock` and `evid-high-voltage-safety-audit-2024`: eliminated inaccurate "ISO 13849-1 SIL-3" conflation, replacing it with accurate dual-channel hardware loop integration terminology.
- Refined capability fulfillment in `retrievalEngine.ts` to require exact tag or textual substring matches, preventing generic words like "telemetry" from falsely satisfying specialized queries (e.g. "quantum hall probe telemetry").
- Calibrated duplicate detection threshold in `ingestionEngine.ts` to recognize title similarity $\ge 60\%$ or composite similarity $\ge 45\%$.
- Updated `package.json` with project name `atlas-engineering-patterns` and `npm test` script.

---

## [1.1.0] - 2026-10-19

### SOL-2 Epistemic Integration & Deterministic Reasoning Anchor (DRA)

#### Added
- **SOL-2 Epistemic Discipline (`src/atlas/types.ts`, `src/atlas/retrievalEngine.ts`)**:
  - Separation of heuristic relevance matches from formal verified capability coverage (`HEURISTIC_MATCH_ONLY`, `VERIFIED_CAPABILITY`).
  - Epistemic Loss Ledger (`lossLog`) tracking `UNMET_REQUIREMENT`, `EXCLUDED_CANDIDATE`, `UNVERIFIED_CONNECTION`, `HEURISTIC_MATCH_ONLY`, and `HEURISTIC_MISMATCH`.
  - Robust `validationStatus` calculation ensuring that knowledge gaps, unverified connections (`UNKNOWN`), active conflicts (`CONFLICT`), or heuristic-only matches force `UNVERIFIED` rather than false `COMPATIBLE`.
- **Deterministic Reasoning Anchor (DRA) Pattern (`src/atlas/canonicalData.ts`, `docs/PATTERN_DRA.md`)**:
  - Added canonical pattern `pat-deterministic-reasoning-anchor` modeling autonomous problem fragment recognition, applicability decisions with intentional abstention, semantic projection, deterministic operation, epistemic separation (`TOOL_VERIFIED_FACT` vs `AGENT_INTERPRETATION` vs `AGENT_HYPOTHESIS`), and reasoning updates.
- **Enhanced Test Suites (`tests/epistemicLoss.test.ts`, `tests/audit.test.ts`)**:
  - Expanded test coverage to 25 automated assertions (17 audit tests + 8 epistemic loss tests).
  - Explicit test coverage for `HEURISTIC_MATCH_ONLY` loss logging and forced `UNVERIFIED` validation status.
- **Documentation Alignment (`docs/`)**:
  - Synchronized canonical entity count to 53 across all documentation files.
  - Added dedicated `docs/PATTERN_DRA.md` architecture guide.
