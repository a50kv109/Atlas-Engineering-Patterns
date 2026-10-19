# Architecture and System Data Flow

## 1. System Mission & Architectural Intent

**Atlas Engineering Patterns** (`atlas-engineering-patterns`) is a specialized knowledge repository, ontology graph, and composition workbench for designing the human-machine interfaces of educational, research, and laboratory stands.

The core architectural principle is the **strict separation of reusable construction building blocks from assembled configurations and physical implementations**.

The architecture decouples:
1. Canonical knowledge storage (`src/atlas/canonicalData.ts`).
2. Graph ontology and relational semantics (`src/atlas/graphEngine.ts`).
3. Deterministic constraint evaluation and composition engine (`src/atlas/retrievalEngine.ts`).
4. Candidate proposal validation and intake pipeline (`src/atlas/ingestionEngine.ts`).
5. Acceptance audit verification test runner (`src/atlas/auditEngine.ts`, `tests/audit.test.ts`).
6. Interactive laboratory workbench UI (`src/atlas/components/`).

---

## 2. High-Level Data Flow

```
+-----------------------------------------------------------------------------------+
|                            STAND DESIGN SPECIFICATION                              |
| (Purpose, User Knowledge Level, Screen Setup, Peripherals, Hard Constraints, Caps)|
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                        RETRIEVAL & COMPOSITION ENGINE                             |
|  1. Candidate Filtering: Purpose & User Level Bounds                              |
|  2. Hard Constraints Check (Min Screens, Physical Peripherals, Safety Level)      |
|  3. Graph Neighborhood Expansion via USES & COMPOSES_WITH                         |
|  4. Mutual Incompatibility Elimination (CONFLICTS_WITH)                           |
|  5. Anti-Hallucination Gap Detection (Unmatched Exotic Requirements)              |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                           TRACEABLE STAND BLUEPRINT                               |
|  - Matched Patterns with Rationale & Trade-offs                                   |
|  - Construction Primitives mapped to 4 Layout Zones (Ribbon, Rail, Stage, Tray)   |
|  - Evidence Citations & Empirical Sample Links                                    |
|  - Alternative Pattern Identifiers                                                |
|  - Identified Knowledge Gaps (honest alerts for missing patterns)                 |
|  - Exportable Machine-Readable Manifest (JSON)                                    |
+-----------------------------------------------------------------------------------+
```

---

## 3. Core Subsystems

### 3.1 Canonical Data Layer (`src/atlas/canonicalData.ts`)

The canonical data layer is the single source of truth for all established engineering knowledge in the repository. It defines 23 vetted records across five distinct entity types:
- **8 Primitives (`prim-*`)**: Scrolling time-series strip, calibrated gauge dial, emergency e-stop banner, bounded numeric stepper, coordinate crosshair canvas, state annunciator matrix, asymmetric split console layout, and multichannel spectrographic waterfall.
- **6 Patterns (`pat-*`)**: Calibrated multi-sensor telemetry console, guided student experiment stepper, high-rate signal inspection, dual-operator safety interlock, multi-screen synced overview/drilldown console, and graceful hardware drift alerting.
- **3 Stand Configurations (`cfg-*`)**: Subsonic educational wind tunnel, continuous research chemostat bioreactor, and pulsed high-voltage testbed.
- **3 Implementations (`impl-*`)**: React 19 / Canvas 2D telemetry client, embedded Qt/QML touch client, and Qt 6 C++ interlocked console.
- **3 Evidence Records (`evid-*`)**: ISO 9241-110 ergonomic display study, 3-semester university aerospace student trial (n=420), and 3,400-cycle high-energy stand operational safety survey.

Each record is validated against strict TypeScript interfaces in `src/atlas/types.ts`.

### 3.2 Knowledge Graph Engine (`src/atlas/graphEngine.ts`)

The graph engine constructs an in-memory directed graph dynamically from the canonical records. It does **not** maintain a manually synchronized duplicate copy of nodes or edges.

- **Dynamic Edge Extraction**: Gathers explicit `relations`, implicit `USES` linkages from pattern primitive references, configuration pattern selections, and `VERIFIED_BY` links to empirical evidence.
- **Ontological Validation**: Checks every edge against `RELATION_RULES` for permitted source/target entity types, directionality, and dangling references.
- **Conflict Detection**: Evaluates pairwise active conflicts (`CONFLICTS_WITH`) across any arbitrary candidate set.

### 3.3 Retrieval and Composition Engine (`src/atlas/retrievalEngine.ts`)

The retrieval engine translates stand design requests into verified configurations using deterministic graph traversal:
- **Applicability Scoring**: Evaluates fit with stand purpose (e.g. `STUDENT_LAB_EXPERIMENT` vs `HAZARDOUS_FACILITY`) and operator knowledge level (`SECONDARY_SCHOOL` to `CERTIFIED_OPERATOR`).
- **Hard Constraints**: Rejects candidates that violate physical requirements (e.g., minimum screens, required hardware interlocks).
- **Anti-Hallucination Policy**: If an explicit capability cannot be satisfied by canonical records, the engine outputs an explicit `KnowledgeGap` with ingestion recommendations, rather than inventing imaginary components.
- **Traceability**: Outputs a blueprint assigning components to ergonomic layout zones (Top Ribbon, Left Rail, Center Stage, Bottom Tray).

### 3.4 Ingestion Pipeline (`src/atlas/ingestionEngine.ts`)

The ingestion pipeline handles new pattern proposals:
1. **Scope Boundary Audit**: Filters out out-of-scope submissions (e.g. general software, cryptocurrency, general AI frameworks, e-commerce).
2. **Duplicate Detection**: Computes token overlap (Jaccard similarity on titles and descriptions) against existing canonical records to flag redundancies.
3. **ID Generation**: Assigns stable, deterministic identifiers (`prim-*`, `pat-*`, etc.).
4. **Schema & Relation Validation**: Enforces mandatory fields and validates proposed graph edges against ontology rules.
5. **Audit Report**: Produces a review document with a recommendation (`ACCEPT_CANDIDATE`, `REQUEST_REVISIONS`, `FLAG_DUPLICATE`, `REJECT_OUT_OF_SCOPE`).

### 3.5 Acceptance Audit Engine (`src/atlas/auditEngine.ts`)

An automated evaluation framework running 12 formal criteria covering domain boundaries, entity separation, identifier stability, graph semantics, retrieval constraints, evidence calibration, boundary cases, and conflict handling.

---

## 4. Current Implementation Status vs Planned Capabilities

| Subsystem | Implemented & Verified | Limitations & Honest Status |
| :--- | :--- | :--- |
| **Canonical Records** | 23 typed records with stable IDs | Stored in in-memory TypeScript module; database-free. |
| **Graph Construction** | Dynamic edge extraction, typed validation | In-memory graph; graph query language (e.g. Cypher) not implemented. |
| **Retrieval Engine** | Deterministic rule-based scoring & gap detection | Heuristic scoring formula; ML/LLM-based semantic interpretation is optional. |
| **Live Stand Preview** | Canvas 2D waveform buffer & parameter controls | Interactive client-side simulation; real DAQ requires hardware WebSocket bridge. |
| **Ingestion Pipeline** | Scope filter, Jaccard duplicate check, report | Client-side acceptance adds to local state; canonical repository merge requires human peer review. |
| **Audit Runner** | 12 automated acceptance checks | Checks programmatic contracts; does not substitute for third-party institutional safety audits. |
