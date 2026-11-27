# Atlas Engineering Patterns — Post-Audit Baseline v1

**Baseline Identifier:** `Post-Audit Baseline v1`  
**Audit Date:** 2026-11-27  
**Repository Name:** `Atlas-Engineering-Patterns` (`atlas-engineering-patterns@1.0.0`)  
**Repository URL:** `https://github.com/a50kv109/Atlas-Engineering-Patterns`  
**Audited GitHub Reference:** Branch `main`, commit `660437b9cd3fc6004ff3898482d32fc79d322a8c` (`2026-11-27T13:11:09Z`)  
**Audited Local Environment:** Google AI Studio workspace (`/app/applet`, no local `.git` repository metadata)

---

## A. Project Identity

* **Repository:** `a50kv109/Atlas-Engineering-Patterns` (`package.json` name: `atlas-engineering-patterns`, version: `1.0.0`)
* **Domain:** Structured knowledge repository, ontology graph, deterministic stand-interface composition engine, NHFG normative guidance layer, and Pattern Lens verification engine for educational, research, and laboratory stands.
* **Primary Assembly Flow:** Authored and verified inside Google AI Studio; synchronized externally with GitHub.
* **Baseline Goal:** Establish an empirically verified checkpoint covering GitHub synchronization status, audit report accuracy, documentation and canonical integrity, and AI-agent repository usability before any new feature or pattern cycle begins.

---

## B. Verified GitHub State

GitHub state was inspected directly via the GitHub REST API (`api.github.com`) and raw file endpoints (`raw.githubusercontent.com`) against `a50kv109/Atlas-Engineering-Patterns`.

| GitHub Dimension | Observed Remote State |
| :--- | :--- |
| **Default / Target Branch** | `main` |
| **All Remote Branches** | `main` (`660437b9cd3fc6004ff3898482d32fc79d322a8c`), `docs/stand-design-principles` (`9816f18115536a0deb0e0310e6b9727978be9f30`) |
| **Latest Commit on `main`** | `660437b9cd3fc6004ff3898482d32fc79d322a8c` — `docs: update architecture documentation` (`2026-11-27T13:11:09Z`) |
| **Pull Requests (`state=all`)** | PR `#1` (`docs: add stand interface design principles`, `docs/stand-design-principles -> main`) — **CLOSED / MERGED** at `2026-11-27T13:07:13Z` via merge commit `8186e602babb39790bc5e44b2de160e664232bc5` |
| **PR for Post-Audit Corrections** | **Absent** (no open or closed PR exists for the 4 audit-modified files or subsequent corrections) |
| **Synchronization Status** | **NOT SYNCHRONIZED** — local AI Studio edits are ahead of GitHub `main` |
| **Local `.git` Working Tree Status** | **Unavailable in sandbox** (`git status` returns `fatal: not a git repository`); branch switching, commits, `git rm --cached`, and PR creation cannot be executed from bash inside AI Studio |
| **Tracked Python Bytecode on `main`** | **13 entries actively tracked** in GitHub tree (`pattern_lens/__pycache__/*` and `tests_pattern_lens/__pycache__/*`) |

---

## C. Audit Verification

### 1. Status of the Four Previously Modified Audit Files

| File | Local Exists? | GitHub `main` Exists? | Content Identical? | Included in Latest Commit (`660437b9cd3f`)? | Correspondence to Audit Corrections |
| :--- | :---: | :---: | :---: | :---: | :--- |
| `docs/README.md` | Yes | Yes (`HTTP 200`) | **No** | No (pre-audit version on `main`) | Local removes duplicate `STAND_INTERFACE_DESIGN_PRINCIPLES.md` link and indexes audit reports; GitHub `main` still contains the duplicate link |
| `.gitignore` | Yes | Yes (`HTTP 200`) | **No** | No (pre-audit version on `main`) | Local adds `__pycache__/` and `*.py[cod]`; GitHub `main` lacks these rules and still tracks 13 `.pyc` / `__pycache__` entries |
| `docs/STAND_INTERFACE_DESIGN_PRINCIPLES.md` | Yes | Yes (`HTTP 200`) | **No** | No (pre-audit version on `main`) | Local clarifies semantic separation in Section 6 (`P-01` vs `pat-reference-experiment-dual-workspace` vs VADP); GitHub `main` lacks this clarification |
| `docs/REPOSITORY_AUDIT_REPORT.md` | Yes | **No (`HTTP 404`)** | **No** | **No** | Exists only in local AI Studio workspace; not yet pushed to GitHub |

*(Additional local-only runtime lockfile observed: `bun.lock` exists locally and is absent from GitHub `main`.)*

### 2. Verification of `docs/REPOSITORY_AUDIT_REPORT.md`

Evaluation of the prior audit report against actual workspace and remote evidence:
* **Accurate Test Claims:** The reported `114/114` TypeScript assertions, `34/34` Python tests, zero `tsc --noEmit` errors, and clean `vite build` were independently re-executed and confirmed in the current workspace.
* **Calibration Gaps Identified & Corrected in This Baseline Review:**
  1. The prior report omitted the `package.json` version (`1.0.0`) and GitHub `main` commit SHA (`660437b9cd3f`), which were added in this pass.
  2. Its original summary (`ACCEPTED WITH CONTROLLED CORRECTIONS`) and `AUDIT-02 ... Resolved` overstated completion because GitHub sync had not happened and adding `.gitignore` rules does **not** untrack the 13 `__pycache__/*.pyc` entries already committed on GitHub `main`. Both were calibrated to reflect `LOCAL WORKSPACE CORRECTIONS APPLIED — GITHUB SYNC PENDING` and `Partially Resolved`.
  3. Explicitly noted checks not performed (GitHub remote sync prior to this baseline check, browser E2E automation, live hardware DAQ WebSocket testing).

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
| **GitHub Sync & Live E2E UI** | GitHub API inspection / Browser E2E | GitHub `main` behind local edits; Playwright/Cypress E2E not configured | **NOT SYNCHRONIZED / NOT RUN** |

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
| **BL-01** | **HIGH** | GitHub `main` (`660437b9cd3f`) vs `/app/applet` | Local audit corrections (`docs/README.md`, `.gitignore`, `STAND_INTERFACE_DESIGN_PRINCIPLES.md`, `REPOSITORY_AUDIT_REPORT.md`) and this baseline update are **not synchronized with GitHub**; no PR exists yet. | Pending external GitHub sync via branch + Pull Request (`.git` absent in AI Studio sandbox). | **High** |
| **BL-02** | **HIGH** | GitHub tree `pattern_lens/__pycache__/`, `tests_pattern_lens/__pycache__/` | 13 Python bytecode entries remain tracked in Git on `main`. `.gitignore` alone will not untrack them. | During Git sync, run `git rm -r --cached pattern_lens/__pycache__ tests_pattern_lens/__pycache__` before committing. | **High** |
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

**Baseline Verdict:** **`Post-Audit Baseline v1` — VERIFIED LOCALLY, NOT YET ESTABLISHED AS A SYNCHRONIZED GITHUB BASELINE.**

* **What IS verified:** Canonical dataset integrity (`56/56` unique records, `0` dangling edges, `0` type violations), full TypeScript test suite (`114/114`), full Python test suite (`34/34`), `tsc --noEmit` (`0` errors), `vite build`, internal documentation consistency, and all local audit fixes.
* **Exact unresolved conditions blocking final GitHub Baseline sign-off:**
  1. Synchronize local changes (`README.md`, `.gitignore`, `docs/README.md`, `docs/PROJECT_STATUS.md`, `docs/STAND_INTERFACE_DESIGN_PRINCIPLES.md`, `docs/REPOSITORY_AUDIT_REPORT.md`, and `docs/POST_AUDIT_BASELINE_V1.md`) to GitHub on a dedicated branch via Pull Request and merge into `main`.
  2. Untrack the 13 already-committed Python cache entries from Git index (`git rm -r --cached pattern_lens/__pycache__ tests_pattern_lens/__pycache__`) so `.gitignore` takes full effect on GitHub.
