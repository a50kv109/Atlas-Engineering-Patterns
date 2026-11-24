# Visual Analytical Discovery Pattern (VADP)

**Canonical ID:** `pat-visual-analytical-discovery`  
**Lifecycle Status:** `PROPOSED` (`evidenceIds: []`)  
**Domain Scope:** Research & Laboratory Stand Analytical Interfaces  
**Related Documents:** `docs/ARCHITECTURE.md`, `docs/ONTOLOGY.md`, `docs/PATTERN_DRA.md`, `docs/GEOMETRY_PATTERN_EXTRACTION.md`

---

## 1. Mission & Core Principle

**Visual Analytical Discovery Pattern (VADP)** is a reusable engineering pattern for designing interactive visual analytical stand interfaces that help human researchers and AI agents investigate parameterized systems, observe variable relationships, detect candidate regularities, formulate testable hypotheses, and route those hypotheses to independent mathematical or computational verification.

> **Core Principle:**  
> *When direct reasoning does not reveal a useful regularity, change the representation of the system and investigate its visual behavior.*

Instead of looping indefinitely over symbolic equations, prose descriptions, or isolated numeric tables when hitting an analytical impasse, the interface projects the parameterized system into an interactive visual state space where structural features become observable as candidate hypotheses.

---

## 2. Strict Architectural Boundary (Three-Layer Separation)

**Atlas Engineering Patterns** strictly governs the configuration of interfaces for educational, research, and laboratory stands. VADP does **not** transform Atlas into a universal mathematical engine, a physics simulator, a symbolic CAS, a theorem prover, or a general-purpose AI research platform.

To preserve architectural clarity, Atlas separates three distinct concerns:

| Layer | Responsibility | Examples in Ecosystem |
| :--- | :--- | :--- |
| **1. VADP Methodology (`pat-visual-analytical-discovery`)** | Defines *how* a stand organizes a 7-stage visual investigation workflow, parameter synchronization, representation selection, and epistemic guardrails. | `docs/PATTERN_VADP.md`, `pat-visual-analytical-discovery` |
| **2. Visual Analytical Primitives (`prim-*`)** | Reusable UI building blocks that render plots, synchronized curves, coordinate crosshairs, waterfalls, and bounded parameter controls. | `prim-crosshair-canvas`, `prim-time-series-strip`, `prim-stepper-scrubber`, `prim-multichannel-waterfall` |
| **3. Executable Verification & Agent Runtimes** | External or stand-specific solvers, CAS tools, proof assistants, formula analyzers (e.g., UMFP), or geometric engines (e.g., future GRVS). | External mathematical/symbolic tools, stand-specific DAQ/model solvers |

**Crucial distinction:** VADP describes how the analytical interface and investigation loop are structured; it does **not** itself execute mathematical proofs or implement an autonomous research agent.

---

## 3. Seven-Stage Iterative Workflow

VADP organizes investigation into seven sequential stages with explicit backward iteration when a better parameterization, normalization, or visual representation is needed:

1. **Stage 1 — `SYSTEM_DECOMPOSITION`**  
   Identify system components, independent parameters, dependent variables, constraints, mathematical/computational relationships, and available observations.
2. **Stage 2 — `PARAMETRIC_MODELING`**  
   Construct a parametric model describing how dependent variables vary over one or more parameters. Explicitly record parameter domains, physical units, normalization basis, boundary conditions, assumptions, and unavailable/missing data (`NO_DATA` rather than silent zero coercion). Normalized quantities must never be conflated with absolute physical measurements.
3. **Stage 3 — `VISUAL_ANALYTICS`**  
   Select a representation matched to the structure of the data—not every problem should be forced into a Cartesian 2D graph:
   - Cartesian function plots and multi-curve comparative overlays
   - Time-series waveforms
   - Phase diagrams and parametric trajectories
   - 2D/3D surfaces and heatmaps
   - Spectral / waterfall plots
   - Network and dependency graphs  
   All plotted elements must reflect real model-derived or measured data from one authoritative state.
4. **Stage 4 — `PATTERN_DETECTION`**  
   Scan the visual representation for the 12 candidate visual feature classes (`V-01`–`V-12`). These are **candidate discovery triggers**, not guaranteed mathematical theorems.
5. **Stage 5 — `HYPOTHESIS_FORMATION`**  
   For each visual feature observed, formulate an explicit testable statement specifying: suspected relationship, involved variables, parameter domain, predicted mathematical expression, underlying assumptions, and verification method. Keep visual observation strictly distinct from mathematical claims.
6. **Stage 6 — `FORMAL_VERIFICATION`**  
   Evaluate candidate hypotheses using independent methods outside the visual renderer: symbolic derivation, high-precision numerical evaluation, independent computational re-implementation, invariant checks, limiting/boundary case analysis, or statistical testing.
7. **Stage 7 — `KNOWLEDGE_EXTRACTION`**  
   Record confirmed relationships, rejected hypotheses, unresolved candidates, discovered invariants, open research questions, supporting evidence links, and validity bounds. If no useful regularity emerges or ambiguity persists, iterate back to Stage 2/3 to adjust parameter range, scale, normalization, or visual representation.

---

## 4. Taxonomy of Candidate Visual Feature Classes (`V-01`–`V-12`)

| Code | Feature Class | Visual Signal to Inspect | Follow-up Verification Trigger |
| :--- | :--- | :--- | :--- |
| `V-01` | **Symmetry** | Mirror or inversion regions across curves/surfaces | Search for parameter transformation (e.g. $t \mapsto 1/t$) leaving form invariant |
| `V-02` | **Complementarity** | Paired curves summing/differing to a constant or envelope | Test conservation identity (e.g. $F_1(t) + F_2(t) = c$) |
| `V-03` | **Intersections** | Crossings between multiple functions or reference lines | Solve $F_i(t) = F_j(t)$ analytically/numerically; check for pixel artifacts |
| `V-04` | **Extrema** | Local/global maxima and minima | Evaluate $\partial F / \partial p = 0$ and boundary behavior |
| `V-05` | **Invariance** | Flat lines or constant ratios across parameter sweeps | Verify exact constant equality across full valid domain |
| `V-06` | **Monotonicity** | Strictly increasing/decreasing regions | Check derivative sign and potential inflection points |
| `V-07` | **Asymptotic Behavior** | Limiting plateaus, divergences, or boundary decay | Evaluate limits as $p \to 0^+$, $p \to \infty$, or singular points |
| `V-08` | **Periodicity** | Repeating oscillations or cyclic returns in phase space | Compute period/frequency spectrum and exact recurrence check |
| `V-09` | **Correlation** | Co-variation between dependent outputs | Measure functional dependence vs spurious confounding scale |
| `V-10` | **Regime Transitions** | Sharp slope changes or threshold switches | Inspect piecewise boundary conditions or mode switches |
| `V-11` | **Scaling & Self-Similarity** | Collapse of curves under rescaling/normalization | Test dimensionless ratio transformation $(u = x/L)$ |
| `V-12` | **Bifurcation** | Splitting or stability change in solution branches | Perform eigenvalue/stability continuation across control parameter |

---

## 5. VADP Interface Requirements

A stand interface implementing `pat-visual-analytical-discovery` should expose:
- A declared independent parameter (with domain bounds and units).
- Multiple synchronized dependent functions plotted against a shared parameter axis (or domain-appropriate projection).
- A moving inspection cursor with synchronized markers across all active curves.
- Tabular/numerical cursor readouts paired with meaningful reference points (e.g. $t=1$, intersections, extrema).
- Explicit display scale selection and normalization basis metadata (preserving separation between raw values, units, normalization basis $L$, and display scale $S$).
- Interactive parameter adjustment controls (`prim-stepper-scrubber`).
- Single authoritative state synchronization so the geometric/physical model, plotted series, and numeric cursor readouts never diverge.

---

## 6. Epistemic Safeguards & Artifact Controls

Visual intuition is fallible. Interfaces implementing VADP must preserve strict epistemic classification and never promote visual resemblance to proven truth:

- **Required Epistemic States:**
  - `OBSERVED_VISUAL_FEATURE` — apparent curve/plot feature detected visually.
  - `COMPUTATIONAL_OBSERVATION` — numeric/sampling property measured by software.
  - `DESIGN_HYPOTHESIS` — proposed mathematical relationship derived from visual cues.
  - `ANALYTICALLY_VERIFIED` — symbolically proven under explicit domain conditions.
  - `NUMERICALLY_SUPPORTED` — corroborated across dense independent numerical checks (still distinct from symbolic proof).
  - `REJECTED` — falsified by counterexample, boundary check, or formal derivation.
  - `UNKNOWN` — unverified or insufficient evidence/domain coverage.
- **Mandatory Artifact Disclosures:** Interfaces and logs must account for sampling density, plotting scale/zoom, floating-point numerical precision, missing data (`NO_DATA`, never `0.0`), parameter domain bounds, normalization assumptions, and interpolation artifacts.

---

## 7. Illustrative Design Case: Pythagoras Four Circles Laboratory

> **Note:** This design case illustrates how VADP emerged in practice; it is an **illustrative design motivation**, **not** empirical validation (`evidenceIds: []`).

In an interactive four-circle geometric stand parameterized by ratio $t$, four normalized curvature ratios were plotted simultaneously over $t$:
$$F_1(t) = \frac{K_a}{K_c}, \quad F_2(t) = \frac{K_b}{K_c}, \quad F_3(t) = \frac{K_c}{K_c} = 1, \quad F_4(t) = \frac{K_i}{K_c}$$

Visual multi-curve inspection surfaced candidate features that immediately guided formal checks:

| Visual Feature (`V-*`) | Visual Observation | Candidate Hypothesis | Verification Status in Case |
| :--- | :--- | :--- | :--- |
| `V-02` Complementarity | Paired opposing curves | $F_1(t) + F_2(t) = 1$ | Verified analytically |
| `V-01` Symmetry | Reflection around $t = 1$ (log scale) | Symmetry under $t \mapsto 1/t$ | Verified analytically |
| `V-04` Extremum | Peak of $F_4(t)$ at $t = 1$ | Maximum at $t = 1$ | Verified analytically |
| `V-05` Invariance | Flat reference line | $F_3(t) = 1$ | Identity by construction |

### Illustrative Machine-Readable Observation Record *(Non-Executable Schema Illustration)*

```json
{
  "pattern": "VADP",
  "version": "1.0",
  "research_id": "four-circles-001",
  "model": {
    "parameter": "t",
    "domain": [0.1, 10],
    "representation": "logarithmic"
  },
  "observations": [
    {
      "feature_class": "V-02",
      "type": "complementarity",
      "functions": ["K_a/K_c", "K_b/K_c"],
      "hypothesis": "F1(t) + F2(t) = 1",
      "verification": "analytical",
      "epistemic_status": "ANALYTICALLY_VERIFIED"
    },
    {
      "feature_class": "V-01",
      "type": "symmetry",
      "transformation": "t -> 1/t",
      "functions": ["K_i/K_c"],
      "verification": "analytical",
      "epistemic_status": "ANALYTICALLY_VERIFIED"
    }
  ]
}
```

---

## 8. Relationship Map to Existing Atlas Components

| Target Entity | Relation Type | Justification |
| :--- | :--- | :--- |
| `prim-crosshair-canvas` | `USES` | Provides interactive spatial canvas, moving cursor, and coordinate/probe readouts. |
| `prim-time-series-strip` | `USES` | Renders synchronized multi-curve traces and parameter-sweep profiles. |
| `prim-stepper-scrubber` | `USES` | Enables bounded interactive adjustment of model parameters $p$. |
| `prim-multichannel-waterfall` | `COMPOSES_WITH` | Optional composition for spectral/frequency-domain discovery; not a mandatory dependency for non-spectral plots. |
| `pat-parametric-geometry-identification` | `COMPOSES_WITH` | Supplies controllable parametric models $M(p)$ and alignment residuals for visual exploration. |
| `pat-scale-invariant-geometric-analytics` | `COMPOSES_WITH` | Provides scale-separable normalization $F = R(B, p; S)$ and display ruler controls without mutating raw invariants. |
| `pat-high-rate-signal-inspection` | `COMPOSES_WITH` | Adjacent high-rate waveform/FFT inspection pattern when discovery examines transient physical signals. |
| `pat-epistemic-status-labeling` | `COMPOSES_WITH` | Enforces clear visual badges distinguishing `OBSERVED_VISUAL_FEATURE`, `DESIGN_HYPOTHESIS`, and verified facts. |
| `pat-deterministic-reasoning-anchor` | `COMPOSES_WITH` | Grounds Stage 6 verification in external deterministic engines without conflating visual guesses with proof. |

---

## 9. Integration Test Plan (`tests/vadpPattern.test.ts`)

1. **Canonical Presence & Uniqueness:** Verify `pat-visual-analytical-discovery` exists in `CANONICAL_PATTERNS` with zero duplicate IDs across `ALL_CANONICAL_ENTITIES`.
2. **Epistemic Maturity & Non-Fabrication:** Verify `lifecycleStatus === 'PROPOSED'` and `evidenceIds.length === 0`.
3. **Schema & Contract Integrity:** Verify mandatory `PatternEntity` fields (`problemStatement`, `solutionSummary`, `tradeOffs`, `applicability`, `primitiveIds`) and typed `Contract` ports/constraints.
4. **Knowledge Graph Integrity:** Verify `KnowledgeGraph.validateGraph()` reports `isValid === true`, 0 dangling edges, and 0 invalid relation types.
5. **Valid Primitive & Pattern References:** Verify all `primitiveIds` exist in `CANONICAL_PRIMITIVES`, `prim-multichannel-waterfall` is `COMPOSES_WITH` (optional) rather than a mandatory `USES` dependency, and `detectConflicts(...)` returns 0 conflicts across related geometry/epistemic patterns.
6. **Retrieval Relevance & Guardrails:** Verify `RetrievalEngine.composeSolution()` retrieves `pat-visual-analytical-discovery` for a visual analytical research-bench query while returning `validationStatus === 'UNVERIFIED'` and logging `HEURISTIC_MATCH_ONLY` in `lossLog`.
7. **Backward Compatibility:** Verify all 55 pre-existing canonical entities (including the two geometry patterns) remain unchanged.
