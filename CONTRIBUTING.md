# Contributing to Atlas Engineering Patterns

Thank you for your interest in contributing to **Atlas Engineering Patterns** (`atlas-engineering-patterns`).

Atlas is a structured, evidence-grounded knowledge repository. Contributions are welcomed from laboratory engineers, human factors researchers, and educators who design interfaces for laboratory, research, and educational stands.

---

## 1. Scope Boundary (Non-Negotiable)

Before drafting a proposal, ensure your submission fits the project's strict scope:

- **IN-SCOPE**: Interface layout, sensor and telemetry presentation (time-series waveforms, gauges, waterfalls), parameter input controls, status annunciators, multi-monitor consoles, and operator error prevention for physical stand equipment.
- **OUT-OF-SCOPE (Will Be Rejected)**: Generic software UI patterns, e-commerce, blockchain/Web3, CRM systems, standalone physics engines, general AI chatbots, or electronic circuit/PCB routing.

---

## 2. All Submissions Are Candidates Until Accepted

Submitting a proposal does not automatically make it part of canonical knowledge.

Every submission enters the repository as a **`PROPOSED` Candidate** and must undergo:
1. Automated scope and schema verification.
2. Duplicate and synonym screening against existing canonical records.
3. Ontological graph relationship validation.
4. Human peer review by laboratory instrumentation engineers.
5. Association with empirical trials, observational evidence, or standards compliance before reaching `TESTED` or `INDEPENDENTLY_VERIFIED`.

---

## 3. Required Fields by Entity Class

When preparing a proposal file, adhere to the TypeScript interfaces defined in `src/atlas/types.ts`:

### 3.1 For a Construction Primitive (`prim-*`)
- `id`: Stable ID with prefix `prim-` and kebab-case slug (e.g. `prim-rotary-encoder-dial`).
- `title`: Clean, descriptive title.
- `shortDescription` and `fullDescription`.
- `domainCategory`: One of `layout`, `telemetry`, `controls`, `safety`, `guidance`, `multi-screen`.
- `uiSlot`: One of `viewport`, `control-rail`, `ribbon`, `modal`, `strip`, `matrix`.
- `minFootprintPixels`: `{ width, height }`.
- `supportsTouch` and `supportsKeyboard` booleans.
- `telemetryRateMaxHz`: Real measured or tested update frequency limit.

### 3.2 For an Interface Pattern (`pat-*`)
- `id`: Stable ID with prefix `pat-` (e.g. `pat-dual-channel-coincidence-gate`).
- `title`: Problem-oriented title.
- `problemStatement`: Concrete physical or ergonomic challenge.
- `solutionSummary`: Interface mechanism resolving the challenge.
- `tradeOffs`:
  - `advantages`: Array of concrete benefits.
  - `disadvantages`: Operational frictions, CPU/GPU limits, or minimum monitor resolutions.
- `applicability`:
  - `purposes`: Valid `StandPurpose` values.
  - `targetLevels`: Valid `UserLevel` values.
  - `minScreens`: Integer monitor count.
  - `requiredPeripherals`: Array of physical devices.
  - `hardConstraints`: Explicit boundary limits.
- `primitiveIds`: Array of canonical primitive IDs consumed via `USES`.

### 3.3 For a Stand Configuration (`cfg-*`)
- `id`: Stable ID with prefix `cfg-`.
- `targetStand`: Physical stand name, purpose, target level, and screen setup.
- `selectedPatterns`: Array of valid `pat-*` IDs.
- `selectedPrimitives`: Array of valid `prim-*` IDs.
- `layoutRecipe`: Zone-by-zone proportion mapping.
- `safetyLevel`: `STANDARD`, `INTERLOCKED`, or `HAZARD_RATED`.

### 3.4 For an Evidence Record (`evid-*`)
- `id`: Stable ID with prefix `evid-`.
- `evidenceType`: `EMPIRICAL_TEST`, `ERGONOMIC_STUDY`, `OPERATOR_AUDIT`, `FAILURE_LOG`, or `STANDARD_COMPLIANCE`.
- `methodology`: Concrete experimental or audit protocol.
- `sampleSize`: Participant or test-cycle count.
- `measuredMetrics`: Array of `{ metric, value, baselineComparison }`.
- `sourceCitation`: Formal publication, institutional technical report, or standard reference.

---

## 4. Graph Relationship Conventions

Declare relationships using the 8 canonical relation types:
- `USES`: Consumes target as a building block (Pattern → Primitive, Configuration → Pattern).
- `COMPOSES_WITH`: Coordinates harmoniously in adjacent layout zones (Symmetric).
- `REQUIRES`: Hard functional or hardware dependency.
- `ALTERNATIVE_TO`: Interchangeable alternative with differing trade-offs (Symmetric).
- `SPECIALIZES`: Narrower variant of an existing pattern.
- `CONFLICTS_WITH`: Hazardous or ergonomically incompatible pairing (Symmetric).
- `IMPLEMENTED_IN`: Connects pattern/configuration to concrete codebase (`impl-*`).
- `VERIFIED_BY`: Connects entity to empirical evidence document (`evid-*`).

---

## 5. Testing and Validation Before Submitting

Always run the automated verification suite before submitting changes:

```bash
# Verify static types and schemas
npm run lint

# Execute the 16 automated tests covering graph integrity and audit checks
npm test

# Verify production build compilation
npm run build
```

Submissions with failing tests or unhandled type errors cannot be merged.
