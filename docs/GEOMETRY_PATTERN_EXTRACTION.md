# Geometry Pattern Extraction — Principles for 2D/3D Stand Interfaces

**Status:** `PRELIMINARY` (`SPECIFIED` for PATTERN-01; `PROPOSED` / Hypothesis for PATTERN-02)  
**Target Domain:** Educational, Research, and Geometric Inspection Stands (2D & 3D)  
**Canonical Entities:**
- `pat-parametric-geometry-identification` (`SPECIFIED`)
- `pat-scale-invariant-geometric-analytics` (`PROPOSED`)  
**Related Documents:** `docs/PATTERN_DRA.md`, `docs/ONTOLOGY.md`, `docs/ATLAS_PATTERN_PASSPORT_PILOT.md`

---

## 1. Purpose & Atlas Scope Alignment

Geometric and kinematic research stands (2D planar geometry benches, optical/laser alignment tables, linkage kinematics rigs, architectural plan analyzers, and 3D CAD/wireframe testbeds) share a recurring set of human-machine interface and analytical presentation challenges.

To keep **Atlas Engineering Patterns** strictly within its scope boundary (stand interfaces, telemetry/analytical presentation, parameter controls, and epistemic safeguards rather than standalone math/physics engines), this document extracts two reusable **interface & analytical architecture patterns**:

1. **Parametric Geometry Identification (`pat-parametric-geometry-identification`)** — how a stand interface presents, controls, and audits inverse model-to-observation alignment without masquerading inferred parameters as raw measurements.
2. **Scale-Separable Analytical Representation (`pat-scale-invariant-geometric-analytics`)** — how an analytical stand view decouples intrinsic geometric laws ($B$), variable perturbations ($p$), dimensionless normalization, physical units, and user-selectable measurement/display scales ($S$) under $F = R(B, p; S)$.

Both patterns are recorded as **generalized stand design experience** (`Evidence`: none yet; `evidenceIds: []`) rather than stand-specific empirical proofs.

---

## 2. Four Decoupled Mechanisms

To prevent conceptual conflation across future 2D and 3D stands, the pipeline is strictly separated into four orthogonal layers:

```
[Observed Drawing / Sensor Frame I]
        |
        +---> (1) Parametric Recognition: I -> M(p) -> min_p E(I, M(p))
        |             |
        |             v
        +---> (2) Three-Level Separation & Normalization: F = R(B, p; S), u = x / L, S / L^2, V / L^3
        |             |
        |             v
        +---> (3) Analytical Axis Scaling: Ruler F_k(u) = F(ku), Modes: Absolute..Comparative
                      |
                      v
              (4) Spectral Comparison & Epistemic Audit (G_image ~= G_model(p))
```

### 2.1 Mechanism 1: Parametric Recognition (Inverse Model Alignment)
* **Canonical ID:** `pat-parametric-geometry-identification`
* **Lifecycle Status:** `SPECIFIED` (conceptually formed with I/O contract; awaiting stand trials)
* **Core Principle:** Instead of relying solely on passive point-to-point coordinate measurement on an unknown 2D/3D drawing or camera frame $I$, the stand exposes a **controllable parametric model** $M(p)$ governed by known construction rules and minimizes an alignment error function $E(I, M(p))$:
  $$I \rightarrow M(p) \rightarrow \min_p E(I, M(p))$$
  $$\text{Model} \rightarrow \text{Parameter Variation} \rightarrow \text{Overlay Alignment} \rightarrow \text{Identification}$$
* **Interface & Operator Role:**
  - The viewport (`prim-crosshair-canvas`) overlays the parametric model $M(p)$ onto the observed geometry $I$.
  - Bounded controls (`prim-stepper-scrubber`) or constrained solver sweeps vary the free control parameters $p$ within declared bounds.
  - Geometric features/invariants (length ratios, angles, topological incidence) are extracted for matching.
  - An annunciator (`prim-state-annunciator-matrix`) displays the alignment error function $E(I, M(p))$ (residual discrepancy) and flags convergence vs. ambiguity.
* **Mandatory Scope & Physical Limitations:**
  - **Model-Family Boundary:** The method identifies parameters **only** within the geometric family representable by the declared model $M(p)$; out-of-family shapes yield high residual discrepancy rather than valid identification.
  - **Absolute Scale Limitation:** Dimensionless ratios and angles are identifiable independently of image scale, **however absolute physical scale (e.g., in `mm` or `m`) CANNOT be recovered from $I$ without an explicit dimensional reference standard (calibration bar / known physical datum)**.
* **Applicability Domains:** 2D constructions (polygons, circles, intersections), mechanical linkages/kinematics, architectural floorplan proportions, and 3D wireframe/volumetric assemblies.

### 2.2 Mechanism 2: Three-Level Separation & Normalization
* **Canonical ID:** `pat-scale-invariant-geometric-analytics` (Semantic scope: *Scale-Separable Analytical Representation*, $F = R(B, p; S)$)
* **Core Principle:** Separate any experimental geometric configuration into three explicit state tiers in the stand UI and data passport:
  $$F = R(B, p; S)$$
  - **Level A — Base Reference Configuration $B$ (Constants):** The immutable reference skeleton (e.g., anchor triangle, nominal angles, base ratios) serving as the experiment's coordinate datum.
  - **Level B — Variable Parameters $p$ (Perturbations):** Auxiliary constructions, deformations, swept angles, intersection loci, and derived areas/volumes governed by model rules.
  - **Level C — Analytical Presentation Scale $S$:** Independent display configuration controlling axis range, grid step, and normalization without mutating Level A ($B$) or Level B ($p$) state.
* **Dimensionless Normalization:** Given characteristic reference length $L > 0$:
  - Coordinates / lengths: $u = \frac{x}{L}$
  - Areas: $\tilde{A} = \frac{A}{L^2}$
  - Volumes: $\tilde{V} = \frac{V}{L^3}$
  Scaling a physical stand specimen or drawing by factor $\alpha$ leaves $(u, \tilde{A}, \tilde{V})$ invariant.

### 2.3 Mechanism 3: Axis Scaling vs. Spectral Normalization (Critical Distinction)
The stand interface must **never conflate** analytical data transformation with display axis range / ruler scaling on an analytical profile $F(x)$:

1. **Axis Ruler Scaling (Display Scale $S$):** Changing the tick marks, axis range, or rhythmic subdivision of the plot axes (analogous to musical time signatures $1/2, 3/4, 5/8, 1/10$):
   $$F_k(u) = F(ku)$$
   This alters visual inspection resolution and axis ticks without modifying raw data; if $k$ scales the argument $u$, the UI must explicitly disclose the scale factor $k$ so the operator does not misread slope or frequency.
2. **Analytical Data Transformation & Normalization (Reference Coordinate Transformation):** Expressing variable perturbations $p$ relative to the Level A reference configuration $B$ (characteristic scale $L$) so structurally similar objects of different physical sizes collapse onto the same normalized profile.

**Mandatory Programmatic Separation:** The interface state store (`pat-dual-state-representation`) must store four fields independently:
1. `rawValues` (unmodified measurements/coordinates),
2. `physicalUnits` (e.g., `mm`, `deg`, `rad`, `px`),
3. `normalizationBasis` (reference $B$ / length $L$ and power $L^d$, or `NONE`),
4. `displayScaleConfig` (active ruler/axis range $S$).

**Required Presentation Modes in the Analytical Panel:**

| Mode | Purpose | Underlying Data Mutated? |
| :--- | :--- | :---: |
| `Absolute` | Raw numeric values in physical/pixel units | No |
| `Relative` | Ratios relative to selected reference element $B$ | No |
| `Normalized` | Dimensionless quantities normalized by $L, L^2, L^3$ | No |
| `Scaled` | Custom user-selected axis ruler / range $S$ ($1/2, 3/4, 5/8, \dots$) | No |
| `Comparative` | Multi-series overlay across configurations or scales | No |

### 2.4 Mechanism 4: Spectral Comparison & Coupling
When **PATTERN-01** and **PATTERN-02** compose (`COMPOSES_WITH`):
1. The stand extracts a normalized geometric fingerprint $G_{\text{image}}$ from the observed drawing/frame $I$.
2. The parametric model generates candidate fingerprints $G_{\text{model}}(p)$ across parameter vector $p$.
3. Optimization/search minimizes spectral discrepancy $\|G_{\text{image}} - G_{\text{model}}(p)\|$ in the shared normalized coordinate system rather than raw pixel coordinates.
4. **Result Presented to Operator:** Identified parameter vector $\hat{p}$, dimensionless invariants, residual discrepancy, and explicit epistemic status.

---

## 3. Epistemic Integrity & Atlas Guardrails

In accordance with **Deterministic Reasoning Anchor (`pat-deterministic-reasoning-anchor`)** and **Epistemic Status Labeling (`pat-epistemic-status-labeling`)**:

- **Raw Observation vs. Model Fit:** Observed vertices/pixel segments are `OBSERVED_EVIDENCE` (subject to sensor/digitization tolerance). Fitted parameters $\hat{p}$ and identified class labels are **`INFERRED` (`AGENT_INTERPRETATION`)** until independently verified.
- **No Silent Unit/Scale Coercion:** Switching between `Absolute`, `Normalized`, and `Scaled` modes must update axis labels and mode badges immediately. Normalized dimensionless values must never be labeled with raw physical units (`mm`, `m^2`).
- **Missing Reference Basis:** If characteristic length $L \le 0$ or Level A reference is undefined, `Normalized` and `Relative` modes must display an explicit `[NO_DATA / UNDEFINED_BASIS]` state rather than coercing to `0.0` or falling back silently to `Absolute`.
- **Lifecycle Honesty:** Both patterns currently carry `evidenceIds: []`. In `RetrievalEngine`, matching these patterns on a stand query must log `HEURISTIC_MATCH_ONLY` and report `validationStatus: 'UNVERIFIED'` until empirical stand trials are recorded.

---

## 4. Atlas Pattern Passports (APPM v0.1)

### 4.1 `pat-parametric-geometry-identification`

```yaml
pattern_passport:
  schema: "atlas-pattern-passport/0.1"
  identity:
    id: "pat-parametric-geometry-identification"
    name: "Parametric Geometry Identification (Inverse Model Alignment)"
    version: "0.1.0"
    status: "specified"
    category: "telemetry"
  intent:
    problem: "Direct coordinate measurement on raw 2D/3D drawings fails when scale is unknown, parts are occluded, or structural relationships matter more than absolute pixel dimensions."
    expected_outcome: "Operator inspects and steers an overlaid parametric model whose parameters vary within valid bounds until geometric discrepancy is minimized, yielding auditable parameter estimates and residual error."
  contract:
    inputs:
      - name: "observed_geometry"
        type: "ObservedGeometryFrame"
        required: true
      - name: "parametric_model_family"
        type: "ParametricModelSpec"
        required: true
      - name: "parameter_bounds"
        type: "Record<string, [number, number]>"
        required: false
    outputs:
      - name: "fitted_parameters"
        type: "QualifiedParameterEstimate[]"
      - name: "alignment_residual"
        type: "DiscrepancyMetric"
      - name: "epistemic_fit_status"
        type: "'INFERRED' | 'CONVERGED' | 'AMBIGUOUS' | 'UNVERIFIED'"
    constraints:
      - "Model family and parameter bounds must be declared prior to matching."
      - "Fitted parameters must retain INFERRED epistemic labeling with explicit residual error."
  verification:
    overall_status: "not_assessed"
    claims: []
    gaps:
      - "Requires empirical alignment accuracy trials on 2D/3D laboratory drawings."
```

### 4.2 `pat-scale-invariant-geometric-analytics` (Scale-Separable Analytical Representation)

```yaml
pattern_passport:
  schema: "atlas-pattern-passport/0.1"
  identity:
    id: "pat-scale-invariant-geometric-analytics"
    name: "Scale-Separable Analytical Representation (Scale-Invariant Geometric Analytics)"
    version: "0.1.0"
    status: "proposed"
    category: "telemetry"
  intent:
    problem: "Locking analytical plots to a single fixed axis scale prevents operators from distinguishing scale-dependent magnitudes from scale-invariant geometric laws across differently sized constructions, or causes conflation between axis zooming and data normalization."
    expected_outcome: "Analytical stand views implement F = R(B, p; S) to isolate base reference constants (B / Level A), variable perturbations (p / Level B), physical units, dimensionless normalization, and display axis scale/range (S / Level C) without mutating raw data."
  contract:
    inputs:
      - name: "raw_geometric_spectrum"
        type: "RawSpectrumSeries"
        required: true
      - name: "reference_configuration"
        type: "ReferenceDatumSpec"
        required: true
      - name: "presentation_mode_config"
        type: "{ mode: 'Absolute' | 'Relative' | 'Normalized' | 'Scaled' | 'Comparative'; scaleFactor?: number }"
        required: true
    outputs:
      - name: "rendered_spectrum_view"
        type: "QualifiedSpectrumView"
      - name: "normalized_invariants"
        type: "DimensionlessInvariant[]"
      - name: "active_scale_metadata"
        type: "ScaleBasisDescriptor"
    constraints:
      - "Raw measurements, physical units, normalization basis L, and display ruler S must be stored separately."
      - "Data normalization and display axis range scaling must never be conflated."
      - "Zero, negative, non-finite, or undefined reference scale L must block Normalized mode with explicit UNDEFINED_BASIS / INVALID_SCALE_BASIS status (never coerce missing data to 0.0)."
  verification:
    overall_status: "not_assessed"
    claims: []
    gaps:
      - "Hypothesis pending invariance vs. discriminability benchmark (see Section 5)."
```

---

## 5. Verification & Falsification Protocol for `PATTERN-02` (Hypothesis Test Plan)

Before promoting `pat-scale-invariant-geometric-analytics` from `PROPOSED` to `TESTED` / `MEASURED`, the stand implementation must pass two falsifiable tests:

1. **Scale-Invariance Test (Same Family, Different Scale):**
   - Take two geometrically similar constructions differing by a pure uniform scale factor (e.g., $1\times$ and $10\times$).
   - Verify that in `Normalized` mode ($u = x/L$, $A/L^2$, $V/L^3$), their spectral fingerprints coincide within numerical tolerance ($\Delta G \le \varepsilon_{\text{tol}}$), while `Absolute` mode continues to report true distinct physical magnitudes.
2. **Structural Discriminability Test (Different Families):**
   - Take two genuinely distinct geometric configurations (e.g., different angle ratios or topological deformations).
   - Verify that `Normalized` mode preserves clear separation ($\Delta G \gg \varepsilon_{\text{tol}}$) and does **not** over-normalize distinct laws into false equivalence.
3. **Direction Evaluation (Ruler Scaling vs. Reference Frame):**
   - Treat **axis ruler scaling** ($1/2, 3/4, 5/8$) strictly as a Level C UI inspection lens (`Scaled` mode).
   - Treat **reference-datum coordinate normalization** (expressing perturbations relative to Level A base geometry) as the core Level B/C analytical representation (`Normalized` / `Relative` modes).
