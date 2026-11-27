# Atlas Engineering Patterns — Post-Audit Baseline v1

**Baseline Identifier:** `Post-Audit Baseline v1`  
**Audit Date:** 2026-11-27  
**Repository Name:** `Atlas-Engineering-Patterns` (`atlas-engineering-patterns@1.0.0`)  
**Repository URL:** `https://github.com/a50kv109/Atlas-Engineering-Patterns`  
**Confirmed GitHub Reference:** Branch `main`, commit `1e9234a4ef010550e9bf9477efc014acf9616eb9` (`2026-11-27T13:54:40Z`; `docs: update project documentation and repo hygiene`)  
**Pre-Sync Historical Reference:** Branch `main`, commit `660437b9cd3fc6004ff3898482d32fc79d322a8c` (`2026-11-27T13:11:09Z`)  
**Workspace Environment:** Google AI Studio workspace (`/app/applet`, synchronized via external GitHub workflow)

---

## A. Project Identity

* **Repository:** `a50kv109/Atlas-Engineering-Patterns` (`package.json` name: `atlas-engineering-patterns`, version: `1.0.0`)
* **Domain:** Structured knowledge repository, ontology graph, deterministic stand-interface composition engine, NHFG normative guidance layer, and Pattern Lens verification engine for educational, research, and laboratory stands.
* **Primary Assembly Flow:** Authored and verified inside Google AI Studio; synchronized externally with GitHub.
* **Baseline Goal:** Establish an empirically verified checkpoint covering GitHub synchronization status, audit report accuracy, documentation and canonical integrity, and AI-agent repository usability before any new feature or pattern cycle begins.

---

## B. Verified GitHub State

GitHub state was verified via the GitHub REST API (`api.github.com`) against `a50kv109/Atlas-Engineering-Patterns`.

| GitHub Dimension | Observed Remote State |
| :--- | :--- |
| **Default / Target Branch** | `main` |
| **All Remote Branches** | `main` (`1e9234a4ef010550e9bf9477efc014acf9616eb9`), `docs/stand-design-principles` (`9816f18115536a0deb0e0310e6b9727978be9f30`) |
| **Latest Confirmed Commit on `main`** | `1e9234a4ef010550e9bf9477efc014acf9616eb9` — `docs: update project documentation and repo hygiene` (`2026-11-27T13:54:40Z`; parent `660437b9cd3fc6004ff3898482d32fc79d322a8c`) |
| **Pull Requests (`state=all`)** | PR `#1` (`docs: add stand interface design principles`, `docs/stand-design-principles -> main`) — **CLOSED / MERGED** at `2026-11-27T13:07:13Z` via merge commit `8186e602babb39790bc5e44b2de160e664232bc5` |
| **Baseline v1 Delivery Method** | **Direct commit to `main`** (`1e9234a4ef010550e9bf9477efc014acf9616eb9`); no separate PR was created for the Post-Audit Baseline v1 synchronization |
| **Synchronization Status** | **SYNCHRONIZED** — local audit fixes and baseline documents were published directly to GitHub `main` (`1e9234a4ef010550e9bf9477efc014acf9616eb9`) |
| **Tracked Python Bytecode on `main`** | **0 entries** — previously tracked `.pyc` files under `pattern_lens/__pycache__/` and `tests_pattern_lens/__pycache__/` were removed in commit `1e9234a4ef010550e9bf9477efc014acf9616eb9`; current `main` tree contains no `*.pyc` files or `__pycache__` directories |

---

## C. Audit Verification

### 1. Synchronization Record of Audited Documentation & Hygiene Files

*(Historical note: prior to commit `1e9234a4ef010550e9bf9477efc014acf9616eb9`, GitHub `main` at `660437b9cd3f` held pre-audit versions of `docs/README.md`, `.gitignore`, and `docs/STAND_INTERFACE_DESIGN_PRINCIPLES.md`, and lacked `docs/REPOSITORY_AUDIT_REPORT.md` and `docs/POST_AUDIT_BASELINE_V1.md`. All 7 target files were synchronized in `1e9234a4ef010550e9bf9477efc014acf9616eb9`.)*

| File | Pre-Sync State (`660437b9cd3f`) | Synchronized State (`1e9234a4ef010550e9bf9477efc014acf9616eb9`) | Change Summary |
| :--- | :--- | :--- | :--- |
| `README.md` | Placeholder clone URL | **Published on `main` (`modified`)** | Updated clone URL to `https://github.com/a50kv109/Atlas-Engineering-Patterns.git` |
| `.gitignore` | Lacked Python cache ignore rules | **Published on `main` (`modified`)** | Added `__pycache__/` and `*.py[cod]` |
| `docs/README.md` | Contained duplicate `STAND_INTERFACE_DESIGN_PRINCIPLES.md` link | **Published on `main` (`modified`)** | Removed duplicate link; indexed `REPOSITORY_AUDIT_REPORT.md` and `POST_AUDIT_BASELINE_V1.md` |
| `docs/PROJECT_STATUS.md` | Contradicted Section 1B regarding `pattern_lens/aam_gateway.py` | **Published on `main` (`modified`)** | Reconciled Sections 2A & 4 with implemented `aam_gateway.py` v0 baseline and 34/34 tests |
| `docs/STAND_INTERFACE_DESIGN_PRINCIPLES.md` | Lacked explicit 3-level semantic separation in Section 6 | **Published on `main` (`modified`)** | Separated `P-01` vs `pat-reference-experiment-dual-workspace` vs VADP |
| `docs/REPOSITORY_AUDIT_REPORT.md` | Absent (`HTTP 404`) | **Published on `main` (`added`)** | Published audit report (updated in this pass with post-sync confirmation) |
| `docs/POST_AUDIT_BASELINE_V1.md` | Absent (`HTTP 404`) | **Published on `main` (`added`)** | Published baseline report (updated in this pass with post-sync confirmation) |

*(Additional local-only runtime lockfile `bun.lock` remains outside the published repository tree.)*

### 2. Verification of `docs/REPOSITORY_AUDIT_REPORT.md`

Evaluation of the audit report across the pre-sync review and current post-sync reconciliation:
* **Accurate Test Claims:** The reported `114/114` TypeScript assertions, `34/34` Python tests, zero `tsc --noEmit` errors, and clean `vite build` were independently re-executed and confirmed.
* **Historical Pre-Sync Calibration (Resolved):**
  1. The initial draft omitted `package.json` version (`1.0.0`) and pre-sync GitHub `main` SHA (`660437b9cd3f`); both were added before synchronization.
  2. The pre-sync pass explicitly recorded `LOCAL WORKSPACE CORRECTIONS APPLIED — GITHUB SYNC PENDING` and `Partially Resolved` for `AUDIT-02` until the tracked `.pyc` entries were deleted in Git.
  3. Following direct commit `1e9234a4ef010550e9bf9477efc014acf9616eb9` on `main`, both GitHub synchronization (`BL-01`) and removal of tracked Python bytecode (`BL-02` / `AUDIT-02`) are verified complete.
  4. Non-executed runtime checks remain explicitly scoped (browser E2E automation and live hardware DAQ WebSocket testing).

### 3. Independent Test, Lint, Build & Link Verification

Executed directly in `/app/applet`:

| Check | Command | Result | Status |
| :--- | :--- | :--- | :---: |
| **Audit Suite** | `npm run test:audit` | `19 / 19 passed (0 failed)` | **VERIFIED** |
| **Epistemic Loss Suite** | `npm run test:epistemic` | `8 / 8 passed (0 failed)` | **VERIFIED** |
| **NHFG Registry Suite** | `npm run test:nhfg` | `29 / 29 passed (0 failed)` | **VERIFIED** |
| **NHFG Retrieval Suite** | `npm run test:retrieval` | `17 / 17 passed (0 failed)` | **VERIFIED** |
| **Geometry Patterns Suite** | `npm run test:geometry` | `24 / 24 passed (0 failed)` | **VERIFIED** |
| **VADP Suite** | `npm run test:vadp` | `17 / 17 passed (0 failed)` | **VERIFIED** |
| **Combined TS Suite** | `npm test` | `114 / 114 passed` | **VERIFIED** |
| **Python Pattern Lens & AAM** | `PYTHONPATH=. python3 -m unittest discover -s tests_pattern_lens -v` | `34 / 34 passed (0.007s)` | **VERIFIED** |
| **TypeScript Typecheck / Lint** | `npm run lint` (`tsc --noEmit`) | `0 errors` | **VERIFIED** |
| **Production Build** | `npm run build` (`vite build`) | `1675 modules`, built cleanly | **VERIFIED** |
| **Local Markdown Links** | Python scan of all `86` `.md` files | `0` broken links in Atlas root/`docs/`/`artifacts/`; `11` broken relative links inside vendored `aam_kernels/AAM-Language-Kernels-main/` | **VERIFIED** |
| **GitHub `main` Sync & Bytecode Cleanup** | GitHub API inspection (`1e9234a4ef010550e9bf9477efc014acf9616eb9`) | All 7 target files synchronized directly to `main`; `0` `*.pyc` / `__pycache__` entries on `main` | **VERIFIED** |
| **Live Browser E2E UI** | Playwright / Cypress | Not configured / not executed | **NOT RUN** |

---

## D. Documentation Integrity

### 1. Structural Quality & Navigation
* `README.md` provides a clear root entry point covering scope boundaries, non-goals, the 5 entity classes, architectural layers, test commands, Pattern Lens/AAM integration, and external UMFP linkage.
* `docs/README.md` indexes **100%** of `.md` files inside `docs/` (`0` unindexed docs after indexing `REPOSITORY_AUDIT_REPORT.md` and `POST_AUDIT_BASELINE_V1.md`), with `0` broken links across root, `docs/`, and `artifacts/`.
* Clear epistemic separation is preserved between implemented core features, `PROPOSED`/`SPECIFIED` patterns (geometry extraction, VADP), `PRELIMINARY` design principles (`STAND_INTERFACE_DESIGN_PRINCIPLES.md`), and external tools (`UMFP`).

### 2. Repetition Analysis
* **Exact Duplication (Resolved / None Remaining in Core Docs):**
  * The duplicate `STAND_INTERFACE_DESIGN_PRINCIPLES.md` entry in `docs/README.md` (lines 11 & 14 on GitHub `main`) is removed locally.
* **Semantic Contradiction (Resolved in Living Status Doc):**
  * `docs/PROJECT_STATUS.md` previously contradicted itself between Section 1B (`34/34` tests including `14 AAM Gateway v0` tests) and Sections 2A/4 (`pattern_lens/aam_gateway.py is not yet implemented` / `12-test suite`). Sections 2 and 4 were reconciled to match the implemented `aam_gateway.py` v0 baseline while keeping open AAM-V2 runtime/IS/TDI work clearly preliminary.
* **Intentional Repetition (Justified — Retained Unchanged):**
  * Concise summaries of the 5 entity classes (`prim-*`, `pat-*`, `cfg-*`, `impl-*`, `evid-*`) and scope boundaries appear in `README.md`, `docs/ARCHITECTURE.md`, `docs/ONTOLOGY.md`, `CONTRIBUTING.md`, and `src/atlas/components/ContractDocView.tsx`. This cross-surface reinforcement is justified for human visitors, contributors, UI users, and agents entering at different points.
* **Historical Point-in-Time Snapshots (Retained Unchanged):**
  * Dated milestone reports (`CHANGELOG.md`, `docs/CROSS_REPOSITORY_AUDIT.md`, `docs/NHFG_IMPLEMENTATION_REPORT.md`, `docs/PATTERN_LENS_IMPLEMENTATION_REPORT.md`, `docs/LANGUAGE_KERNEL_INTEGRATION_AUDIT.md`, and `artifacts/atlas_agent_evaluation_v1/*`) accurately record earlier snapshots (`53` entities; `25`, `54`, or `71` tests; pre-gateway status). Per preservation rules, historical documents are left intact rather than rewritten.

### 3. Semantic Distinctions Verified
Section 6 of `docs/STAND_INTERFACE_DESIGN_PRINCIPLES.md` explicitly separates three distinct concepts that should never be merged:
1. **`P-01 Dual-Workspace Principle`:** Macro split between Visual/Experimental Workspace and Analytical Workspace.
2. **`pat-reference-experiment-dual-workspace`:** Micro-layout comparison of a locked baseline reference state against a mutable experimental perturbation state with delta highlighting.
3. **`pat-visual-analytical-discovery` (VADP):** 7-stage iterative visual discovery and formal verification workflow (`PROPOSED`, `evidenceIds: []`).

---

## E. Canonical Knowledge Integrity

Verified programmatically against `src/atlas/canonicalData.ts` and `KnowledgeGraph`:
* **Total Canonical Entities:** `56` (`56` strictly unique IDs; `0` prefix errors):
  * `primitive` (`prim-*`): **8**
  * `pattern` (`pat-*`): **34** (`31` baseline + `2` geometry patterns + `1` VADP)
  * `configuration` (`cfg-*`): **6**
  * `implementation` (`impl-*`): **4**
  * `evidence` (`evid-*`): **4**
* **Lifecycle Maturity Distribution:**
  * `INDEPENDENTLY_VERIFIED`: `14`
  * `TESTED`: `6`
  * `MEASURED`: `2`
  * `IMPLEMENTED`: `15`
  * `SPECIFIED`: `2`
  * `PROPOSED`: `17`
  * Entities at `TESTED` / `MEASURED` / `INDEPENDENTLY_VERIFIED` with empty `evidenceIds`: **0** (`emptyEvidenceTestedOrHigher: []`).
* **Graph Ontology & Integrity:**
  * `isValid: true`, `totalNodes: 56`, `totalEdges: 166`, `danglingEdges: 0`, `invalidTypeEdges: 0`.
  * `asymmetryWarnings: 28` (`22` pre-existing + `6` from VADP `COMPOSES_WITH`), consistent with documented in-memory graph behavior (`docs/ONTOLOGY.md` Section 4 & `docs/ROADMAP.md` Stage 3).

---

## F. AI-Agent Usability Assessment (14 Core Questions)

Evaluating an autonomous AI agent arriving with only the GitHub URL and no prior context:

| # | Agent Question | Authoritative Entry Files | Usability & Friction |
| :---: | :--- | :--- | :--- |
| **1** | What is Atlas Engineering Patterns? | `README.md`, `docs/ARCHITECTURE.md` | **Immediate** — clear scope & non-goals |
| **2** | What is inside the repository? | `README.md`, `docs/README.md`, `docs/PROJECT_STATUS.md` | **Good** — `artifacts/` & `CHANGELOG.md` lack explicit links in `docs/README.md` (minor) |
| **3** | Where is the authoritative architecture description? | `docs/ARCHITECTURE.md`, `README.md` | **Immediate** |
| **4** | What is a primitive (`prim-*`)? | `README.md`, `docs/ONTOLOGY.md` | **Immediate** |
| **5** | What is a pattern (`pat-*`)? | `README.md`, `docs/ONTOLOGY.md` | **Immediate** |
| **6** | What is a configuration (`cfg-*`)? | `README.md`, `docs/ONTOLOGY.md` | **Immediate** |
| **7** | What is an implementation (`impl-*`)? | `README.md`, `docs/ONTOLOGY.md` | **Immediate** |
| **8** | What is evidence (`evid-*`)? | `README.md`, `docs/ONTOLOGY.md` | **Immediate** |
| **9** | How does the agent search for an existing pattern? | `docs/RETRIEVAL_AND_COMPOSITION.md`, `src/atlas/canonicalData.ts`, `pattern_lens/` | **Friction (`MEDIUM`)** — pipeline is documented, but there is no compiled Markdown index (`docs/CATALOG.md`) by `purpose`/`userLevel`, forcing source inspection of `canonicalData.ts` |
| **10** | How does it distinguish an established pattern from a proposal? | `docs/KNOWLEDGE_LIFECYCLE.md`, `docs/NHFG_DATA_MODEL.md`, `src/atlas/types.ts` | **Good** — lifecycle states are clear; however, `PatternEntity.applicability` lacks a `declared` vs `verified` split in TS types (documented in APPM) |
| **11** | How does it avoid creating a duplicate? | `CONTRIBUTING.md`, `docs/KNOWLEDGE_LIFECYCLE.md`, `src/atlas/ingestionEngine.ts` | **Good** — Jaccard thresholds (`>=45%` composite / `>=60%` title) and `STAND_INTERFACE_DESIGN_PRINCIPLES.md` Section 7 are clear, though browsing all 34 patterns requires reading `canonicalData.ts` |
| **12** | How does it determine whether an implementation is verified? | `docs/ONTOLOGY.md`, `docs/KNOWLEDGE_LIFECYCLE.md`, `docs/NHFG_DATA_MODEL.md`, `src/atlas/canonicalData.ts` | **Moderate Friction** — rules are clear, but `evidenceIds` links must be inspected directly in `canonicalData.ts` |
| **13** | How does it trace a pattern to its examples and evidence? | `docs/ONTOLOGY.md`, `docs/NHFG_RETRIEVAL_INTEGRATION.md`, `src/atlas/canonicalData.ts`, `src/atlas/nhfgData.ts` | **Moderate Friction** — traceability matrix to test assertions (`docs/TESTING.md`) and `docs/CATALOG.md` are missing |
| **14** | How should it contribute new knowledge without breaking the ontology? | `CONTRIBUTING.md`, `docs/KNOWLEDGE_LIFECYCLE.md`, `docs/ONTOLOGY.md` | **Immediate** — schema, prefixes, relations, and CLI checks are clearly documented |

*(These findings align directly with the independent usability audit preserved in `artifacts/atlas_agent_evaluation_v1/PHASE_D_REPOSITORY_USABILITY.md`.)*

---

## G. Findings Classification & Recommendations

### 1. Confirmed Defects

| ID | Severity | Location | Finding & Evidence | Action / Status | Confidence |
| :--- | :---: | :--- | :--- | :--- | :---: |
| **BL-01** | **HIGH** | GitHub `main` (`1e9234a4ef010550e9bf9477efc014acf9616eb9`) | *(Historical pre-sync gap at `660437b9cd3f`)* Local audit corrections (`README.md`, `.gitignore`, `docs/README.md`, `docs/PROJECT_STATUS.md`, `docs/STAND_INTERFACE_DESIGN_PRINCIPLES.md`, `docs/REPOSITORY_AUDIT_REPORT.md`, `docs/POST_AUDIT_BASELINE_V1.md`) had not yet been pushed to GitHub. | **RESOLVED** — Synchronized directly to GitHub `main` in commit `1e9234a4ef010550e9bf9477efc014acf9616eb9` (`docs: update project documentation and repo hygiene`); no separate PR created. | **High** |
| **BL-02** | **HIGH** | GitHub tree `pattern_lens/__pycache__/`, `tests_pattern_lens/__pycache__/` | *(Historical pre-sync gap at `660437b9cd3f`)* Tracked Python bytecode entries remained in Git alongside missing ignore rules. | **RESOLVED** — `.gitignore` rules (`__pycache__/`, `*.py[cod]`) applied and all previously tracked `.cpython-310.pyc` / `__pycache__` entries removed from `main` in commit `1e9234a4ef010550e9bf9477efc014acf9616eb9` (verified `0` cache entries in `main` tree). | **High** |
| **BL-03** | **MEDIUM** | `docs/PROJECT_STATUS.md` (lines 20 vs 30–40 & 63–66) | Internal contradiction claiming `pattern_lens/aam_gateway.py` was not yet implemented despite `34/34` tests passing (including 14 gateway integration tests). | **Corrected in this pass** (Sections 2 & 4 reconciled with Section 1B). | **High** |
| **BL-04** | **MEDIUM** | `README.md` line 126 | Stale clone placeholder `https://github.com/<your-username>/atlas-engineering-patterns.git`. | **Corrected in this pass** to `https://github.com/a50kv109/Atlas-Engineering-Patterns.git`. | **High** |
| **BL-05** | **MEDIUM** | `docs/REPOSITORY_AUDIT_REPORT.md` | Omitted audited package version / GitHub commit SHA and marked `AUDIT-02` resolved without noting pending `git rm --cached` and missing GitHub sync. | **Corrected in this pass** (calibrated metadata & statuses). | **High** |
| **BL-06** | **MEDIUM** | `docs/` (Agent Usability) | No compiled Markdown catalog (`docs/CATALOG.md`) or test traceability matrix, requiring TS source inspection for pattern discovery (`Q2`, `Q3`, `Q5`, `Q7`, `Q12`, `Q13`). | **Recommended for next stage** (catalog & navigation phase; no feature code modified here). | **High** |
| **BL-07** | **MEDIUM** | `src/atlas/retrievalEngine.ts` (lines 89 vs 255 & 269) | Asymmetric tag matching between candidate scoring (`reqCap.includes(t)`) and `knowledgeGaps` (`t.includes(reqCap)` only), causing multi-word capability queries like `'symmetry detection'` to be marked both fulfilled in `selectionReason` and unmet in `knowledgeGaps`. | **Documented for next code-fix stage** (kept untouched in this documentation baseline). | **High** |

### 2. Minor Improvements (`LOW`)
* **`docs/ARCHITECTURE.md:57`:** Illustrative pattern list omits the newer geometry extraction patterns and VADP even though line 55 references 56 records.
* **`docs/README.md` Navigation:** Adding cross-links to `CHANGELOG.md` and `artifacts/atlas_agent_evaluation_v1/FINAL_EVALUATION_REPORT.md` would improve discoverability without duplicating content.
* **VADP `primitiveIds` Scoping (`src/atlas/canonicalData.ts:1364`):** Consider relaxing mandatory `USES` primitives in `pat-visual-analytical-discovery` to optional `COMPOSES_WITH` during the next pattern-quality pass.

### 3. Future Architectural Opportunities (`INFORMATIONAL`)
* Generate a deterministic `docs/CATALOG.md` script/artifact mapping all 56 entities by `type`, `purpose`, `userLevel`, `lifecycleStatus`, and `evidenceIds` for zero-code AI-agent lookup.
* Publish a concise `docs/TEST_TRACEABILITY_MATRIX.md` linking behavioral invariants to exact test files/assertions.
* Backport APPM's `compatibility.declared` vs `compatibility.verified` distinction into `PatternEntity` (`src/atlas/types.ts`).
* Implement automated reciprocal edge generation for symmetric ontology relations (`KnowledgeGraph`, Roadmap Stage 3).

### 4. Items Deliberately Unchanged
* All 56 canonical entities in `src/atlas/canonicalData.ts` (zero additions, merges, or status promotions).
* Historical reports (`CHANGELOG.md`, `docs/CROSS_REPOSITORY_AUDIT.md`, `docs/NHFG_IMPLEMENTATION_REPORT.md`, `docs/PATTERN_LENS_IMPLEMENTATION_REPORT.md`, `docs/LANGUAGE_KERNEL_INTEGRATION_AUDIT.md`, `artifacts/atlas_agent_evaluation_v1/*`).
* External reference snapshot `aam_kernels/AAM-Language-Kernels-main/` (including its 11 upstream relative link mismatches) and external UMFP references.
* Intentional introductory summaries across `README.md`, `docs/ARCHITECTURE.md`, `docs/ONTOLOGY.md`, and `src/atlas/components/ContractDocView.tsx`.

---

## H. Baseline Decision

**Baseline Verdict:** **`Post-Audit Baseline v1` — PUBLISHED AND SYNCHRONIZED ON GITHUB `main`.**

* **Confirmed GitHub Baseline Commit:** `1e9234a4ef010550e9bf9477efc014acf9616eb9` (`docs: update project documentation and repo hygiene`, committed directly to `main` at `2026-11-27T13:54:40Z`; no separate PR created).
* **Verified Baseline State:** Canonical dataset integrity (`56/56` unique records, `0` dangling edges, `0` type violations), full TypeScript test suite (`114/114`), full Python test suite (`34/34`), `tsc --noEmit` (`0` errors), `vite build`, internal documentation consistency, synchronization of all audited documentation and `.gitignore` updates to `main`, and complete removal of tracked `__pycache__` / `*.pyc` artifacts from GitHub `main` (`0` entries remaining).
* **Deferred Non-Blocking Items for Subsequent Stages:** `BL-06` (compiled `docs/CATALOG.md` and `docs/TEST_TRACEABILITY_MATRIX.md`) and `BL-07` (`src/atlas/retrievalEngine.ts` multi-word tag-matching asymmetry).
