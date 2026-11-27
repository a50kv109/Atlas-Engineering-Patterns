# Atlas Engineering Patterns

**Repository**: `atlas-engineering-patterns`  
**Domain**: Interface Configuration for Educational, Research, and Laboratory Stands

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![Tests](https://img.shields.io/badge/tests-114%20passed%20%2F%200%20failed-brightgreen.svg)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-ES2022-blue.svg)]()
[![Ontology](https://img.shields.io/badge/Ontology-5%20Classes%20%C2%B7%208%20Relations-cyan.svg)]()
[![NHFG](https://img.shields.io/badge/NHFG-Retrieval%20Integrated-purple.svg)]()

---

## 1. Project Purpose & Problem Statement

Engineering stands in educational institutions and research laboratories (such as wind tunnels, bioreactors, laser benches, and power testbeds) require specialized human-machine interfaces. In practice, these interfaces are often built ad-hoc:
- Controls are placed without consideration for operator cognitive workload or user experience levels.
- Safety interlocks and telemetry displays are frequently mixed without procedural guardrails, leading to student mistakes or equipment trips.
- Interface solutions developed in one department are rarely reused across different laboratory installations.

**Atlas Engineering Patterns** is a structured, continuously extensible knowledge repository, graph ontology, and deterministic composition engine. It helps engineers, educators, and software systems design, verify, and assemble safe, ergonomic, and reusable interface configurations for laboratory stands.

---

## 2. Strict Scope Boundary & Non-Goals

The scope of Atlas Engineering Patterns is strictly confined to the configuration of stand interfaces.

### In-Scope:
- Interface layout and ergonomic workspace organization (e.g. split console layouts, multi-monitor decoupling).
- Interface construction primitives (time-series strips, polar gauges, annunciator matrices, bounded steppers).
- Presentation of sensor measurements, diagrams, waveforms, and experimental states.
- Operator interaction, control patterns, and parameter adjustment mechanisms.
- Procedural guidance, state-gating, and error-prevention guardrails.
- Adaptation to operator qualification (Secondary School, Undergraduate, Researcher, Certified Operator).
- Physical display and peripheral configuration (touch panels, hardware E-stop switches).
- Traceable interface configurations for specific stand types.

### Out-of-Scope (Non-Goals):
- General-purpose engineering encyclopedias or software design pattern catalogs.
- Physics simulation or mathematical modeling engines.
- Electronics, hardware circuit design, and PCB routing.
- General AI-agent frameworks or chat interfaces.
- Standalone administrative, billing, inventory, or laboratory management software.
- E-commerce, blockchain, or consumer mobile applications.

---

## 3. Principal Users and Use Cases

1. **Laboratory Instructors & Pedagogical Engineers**:
   - Assemble guided, error-resistant interfaces for undergraduate practicums where actuators unlock only after safety calibrations are completed.
2. **Research Scientists & Testbed Developers**:
   - Configure high-rate multi-sensor telemetry benches with synchronized time-series and spectral waterfalls.
3. **Stand Facility Operators & Safety Engineers**:
   - Design dual-operator interlock consoles that interface with hardware safety loops to prevent unintended high-energy discharge.
4. **AI Agents & Automated Toolchains**:
   - Query the repository with machine-readable stand constraints and receive traceable interface blueprints with explicit evidence backing and gap detection.

---

## 4. Five Canonical Entity Classes

Atlas strictly separates reusable building blocks from assembled stand configurations:

| Entity Class | Storage Prefix | Responsibility | Canonical Examples |
| :--- | :--- | :--- | :--- |
| **Primitives** | `prim-*` | Independently reusable UI elements or mechanisms. | `prim-time-series-strip`, `prim-calibrated-gauge-dial`, `prim-emergency-estop-banner`, `prim-stepper-scrubber` |
| **Patterns** | `pat-*` | Reusable solutions to recurring stand interface problems. | `pat-calibrated-telemetry-console`, `pat-guided-student-experiment-stepper`, `pat-dual-operator-safety-interlock` |
| **Configurations** | `cfg-*` | Compatible combinations assembled for a specific physical stand. | `cfg-aerodynamics-wind-tunnel-edustand`, `cfg-bioreactor-fermentation-research`, `cfg-high-voltage-pulse-lab` |
| **Implementations** | `impl-*` | Concrete code running on real hardware DAQs. | `impl-aerolab-v2-web-console`, `impl-biotech-lab-touch-rig`, `impl-pulse-power-rig-qt` |
| **Evidence** | `evid-*` | Empirical trials, ergonomic measurements, and audits. | `evid-iso-9241-ergonomics-study-2023`, `evid-aero-lab-student-trials-report` |

See [docs/ONTOLOGY.md](docs/ONTOLOGY.md) for full relationship rules and semantics.

---

## 5. Architectural Overview

The system operates across three decoupled layers:
1. **Canonical Knowledge Storage**: 56 canonical records (53 baseline records + 2 geometry stand patterns in `SPECIFIED`/`PROPOSED` status + `pat-visual-analytical-discovery` in `PROPOSED` status) typed in `src/atlas/types.ts` and housed in `src/atlas/canonicalData.ts`.
2. **Knowledge Graph Engine (`src/atlas/graphEngine.ts`)**: Dynamically extracts typed directional relationships (`USES`, `COMPOSES_WITH`, `REQUIRES`, `ALTERNATIVE_TO`, `SPECIALIZES`, `CONFLICTS_WITH`, `IMPLEMENTED_IN`, `VERIFIED_BY`) and validates structural integrity.
3. **Retrieval & Composition Engine (`src/atlas/retrievalEngine.ts`)**: Deterministically evaluates stand requirements against user levels, screen counts, and physical peripherals; enforces hard constraints; detects mutual conflicts; distinguishes heuristic matches (`HEURISTIC_MATCH_ONLY`) from verified coverage; and reports honest **Knowledge Gaps** when requirements exceed canonical knowledge.

For deep architectural documentation, see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), [docs/PATTERN_DRA.md](docs/PATTERN_DRA.md) (Deterministic Reasoning Anchor), and [docs/PATTERN_VADP.md](docs/PATTERN_VADP.md) (Visual Analytical Discovery Pattern).

---

## 6. Available Application Functions

The included laboratory workbench UI provides:
- **Registry Browser**: Filter, search, and inspect the 56 canonical records with complete schema details and trade-offs.
- **Interactive Knowledge Graph Visualizer**: Pan, zoom, inspect nodes, and highlight incoming/outgoing relational edges on an interactive SVG canvas.
- **Stand Solution Composer**: Select a stand scenario (Wind Tunnel, Bioreactor, High-Voltage, or Custom), evaluate constraints, inspect component selection rationales, test an interactive live layout simulation (E-stop ribbon, steppers, crosshairs, 1000Hz Canvas waveform buffer), and export a machine-readable JSON manifest.
- **Pattern Ingestion Workbench**: Submit candidate ideas through automated scope verification, Jaccard token duplicate detection, stable ID generation, and schema validation.
- **Acceptance Audit Runner**: Execute all criteria of the acceptance specification with real-time pass/fail evidence reporting.
- **Contract Documentation**: In-app viewer for the architectural contract and project mission.

---

## 7. Current Implementation Status

| Capability | Real Current Status |
| :--- | :--- |
| **Data Models & Types** | **Implemented & Inspected** in `src/atlas/types.ts`. |
| **Canonical Records** | **Implemented & Tested**: 56 canonical records with stable IDs in `src/atlas/canonicalData.ts` (53 baseline records + 2 geometry stand patterns + `pat-visual-analytical-discovery` in `SPECIFIED`/`PROPOSED` status with `evidenceIds: []`). |
| **Knowledge Graph** | **Implemented & Tested**: In-memory builder, 0 dangling edges, validated semantics. |
| **Retrieval Engine & SOL-2** | **Implemented & Tested**: Heuristic vs verified separation (`HEURISTIC_MATCH_ONLY`), loss log, gap reporting. |
| **Deterministic Reasoning Anchor (DRA)** | **Implemented & Documented**: 7-stage agent reasoning anchor (`docs/PATTERN_DRA.md`). |
| **Visual Analytical Discovery Pattern (VADP)** | **Proposed & Documented**: 7-stage visual hypothesis & formal verification workflow (`pat-visual-analytical-discovery`, `PROPOSED`, `evidenceIds: []`; see `docs/PATTERN_VADP.md`). |
| **Normative Guidance (NHFG Layer)** | **Implemented & Integrated (Stage D)**: 3 ISO sources, 7 ISO 9241-110 principles, integrated with `RetrievalEngine`, traceable mappings, non-linear status model (`docs/NHFG_RETRIEVAL_INTEGRATION.md`). |
| **Automated Test Suites** | **Implemented & Tested**: 114 executed TypeScript assertions pass via `npm test` (19 audit + 8 epistemic loss + 29 NHFG pilot + 17 retrieval integration + 24 geometry patterns + 17 VADP assertions); plus 34/34 Python Pattern Lens + AAM Gateway v0 unit tests. |
| **Physical Safety** | **Not Claimed**: UI components integrate with hardware loops; software does not substitute for hardware functional safety. |

---

## 8. Installation & Reproduction

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm (v9.0.0 or higher)

### Installation
```bash
# Clone the repository
git clone https://github.com/a50kv109/Atlas-Engineering-Patterns.git
cd Atlas-Engineering-Patterns

# Install verified dependencies
npm install
```

### Development Server
```bash
# Start the local development server (port 3000)
npm run dev
```

### Static Type Checking & Linting
```bash
npm run lint
```

### Automated Test Suite Execution
```bash
# Runs all 6 TypeScript test suites (114 executed assertions across audit, epistemic loss, NHFG, retrieval integration, geometry patterns, and VADP)
npm test
```

### Production Build
```bash
npm run build
```

---

## 9. Pattern Lens & AAM-Language-Kernels Integration Specification

In addition to the Atlas Core React/TypeScript application, the repository includes specifications and modular engines for **Pattern Lens** and **AAM-Language-Kernels**:

1. **Pattern Lens v0.1**:
   - An autonomous search, constraint verification, and evidence audit engine implemented in pure Python 3.10+ (zero external dependencies).
   - Verified with 34/34 total unit tests in `tests_pattern_lens/` (20 core Pattern Lens tests + 14 AAM Gateway v0 integration tests).
   - Operates independently to evaluate requirements, inventory completeness (`UNKNOWN` vs `VIOLATED`), evidence versioning, and deterministic lexicographical ranking.
2. **AAM-Language-Kernels v2**:
   - A multi-lingual semantic normalization architecture (AXIS-10, Engineering Semantic Compiler protocol, Integrity Score, and Tensor Divergence Index).
   - Provides glossaries and translation governance across 10 natural languages.
3. **AAM Integration Gateway (`pattern_lens/aam_gateway.py`)**:
   - Implemented as v0 (`PASSTHROUGH` baseline and runtime adapter contract per `docs/LANGUAGE_KERNEL_INTEGRATION_AUDIT.md`).
   - Designed as an isolated adapter to pass normalized semantic intent from AAM language kernels into Pattern Lens without coupling or altering its core mechanics.
   - Enforces strict safety invariants: high linguistic Integrity Score cannot elevate authorization or override failed constraints/evidence.
   - Includes `PASSTHROUGH` handling, ambiguity detection (`NEEDS_CLARIFICATION`), and 14 integration safety tests (`tests_pattern_lens/test_aam_integration.py`).

For complete documentation indexes, see [docs/README.md](docs/README.md) and [docs/PROJECT_STATUS.md](docs/PROJECT_STATUS.md).

---

## 10. Related Research & Mathematical Reasoning Tools

- **[Universal Mathematical Formula Passport (UMFP)](https://github.com/a50kv109/universal-Mathematical-formula-Passport)** *(External Research Tool / Independent Repository — `0.1.x` Pre-release)*
  - **Role & Complementarity with Atlas**: While **Atlas Engineering Patterns** helps engineers and AI agents organize laboratory stand interface solutions (`pat-*`, `prim-*`, constraints, layout composition, and evidence boundaries), **UMFP** is an independent, deterministic TypeScript tool for structured pre-analysis of mathematical expressions and generating a `FormulaPassport`.
  - **Key Capabilities Described in UMFP**:
    - Separates original surface notation from normalized structure (`RAW AST` / `NORMALIZED AST`).
    - Identifies structural mathematical constructs (e.g., fractions, radicals, indexed sums/products, matrices, integrals, limits).
    - Separates free and bound variables with lexical scope tracking.
    - Tracks provenance of number-domain requirements (`requested`, `required`, `effective`).
    - Surfaces constraints, ambiguities, and diagnostic states (`UNKNOWN`, `NUMBER_DOMAIN_CONFLICT`, constant vs. variable disambiguation).
    - Compares mathematical expressions while distinguishing proven canonical identity, numerical refutation, numerical support, and uncertainty (`unknown` / `not_applicable`).
  - **Intended Usage for AI Agents**: Useful as an optional external structural grounding layer when an engineering, geometric, or research stand task involves parsing formulas, variables, or domain constraints prior to interface composition.
  - **Strict Scope & Boundary Safeguards**:
    - UMFP is a **standalone external repository** (`Related Research Tool / External Mathematical Reasoning Resource`), not a canonical Atlas entity, runtime dependency, or built-in automated call in Atlas.
    - UMFP is **not** a Computer Algebra System (CAS), an automated theorem prover, or a universal STEM domain classifier (`domains` in `0.1.x` are restricted to `ALGEBRA | GEOMETRY | UNKNOWN`). Structural recognition of a formula does **not** constitute proof of its mathematical truth.

---

## 11. Current Limitations & Factual Safeguards

1. **No Software-Only Safety Certification**:
   - The interface components (such as `prim-emergency-estop-banner` and `pat-dual-operator-safety-interlock`) are designed to participate in supervisory control loops alongside physical hardware (e-stop buttons, safety relays, enclosure interlocks).
   - A software interface alone **does not and cannot** establish functional safety under standards such as ISO 13849-1 or IEC 62061 without dedicated safety-rated hardware.
2. **Lexical Duplicate Detection Heuristic**:
   - The ingestion duplicate detector uses token-based Jaccard similarity. While effective for literal and synonym overlap, it does not perform deep neural semantic embeddings.
3. **Client-Side Ingestion Sandbox**:
   - Accepting a proposal in the web UI adds it to client-side session state for immediate evaluation. Merging into canonical storage requires human peer review via a pull request.

---

## 12. Roadmap

- **Stage 1**: GitHub publication, documentation transparency, and test suite reproducibility (**Current Stage**).
- **Stage 2**: Independent inspection and refinement of existing canonical records (**In Progress**).
- **Stage 3**: Machine-readable JSON Schema / SHACL shapes for standalone record validation.
- **Stage 4**: Multi-objective Pareto optimization for stand retrieval.
- **Stage 5**: Git-based PR ingestion pipeline (`proposals/*.json`) with human reviewer sign-off.
- **Stage 6**: Expansion of canonical library to cryogenic, RF, and microfluidic stands.
- **Stage 7**: Multi-institution empirical trials measuring operator error rates and anomaly detection latency.

See [docs/ROADMAP.md](docs/ROADMAP.md) for full details.

---

## 13. Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on submitting new primitives, patterns, configurations, and empirical evidence.

All new proposals are treated as candidates until validated and reviewed.

---

## 14. License

**License Status**: Not yet assigned.

Before publishing or redistributing this repository, the repository owner must select and add a formal license file (e.g. Apache 2.0, MIT, or an institutional academic license).
