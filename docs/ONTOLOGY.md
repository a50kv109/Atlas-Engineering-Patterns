# Ontology and Relationship Specification

## 1. Five Canonical Entity Classes

The Atlas Engineering Patterns ontology strictly isolates five distinct classes of engineering knowledge to prevent conceptual conflation:

```
                  +-------------------+
                  |     EVIDENCE      |
                  |     (evid-*)      |
                  +-------------------+
                            ^
                            | VERIFIED_BY
                            |
   +----------------+ USES  +---------------+ COMPOSES_WITH +---------------+
   | CONFIGURATION  |------>|    PATTERN    |<------------->|    PATTERN    |
   |    (cfg-*)     |       |    (pat-*)    |               |    (pat-*)    |
   +----------------+       +---------------+               +---------------+
          |                         |                               |
          | USES                    | USES                          | USES
          v                         v                               v
   +----------------+ COMPOSES_WITH +---------------+ ALTERNATIVE  +---------------+
   |   PRIMITIVE    |<------------->|   PRIMITIVE   |<------------->|   PRIMITIVE   |
   |    (prim-*)    |               |    (prim-*)   |               |    (prim-*)   |
   +----------------+               +---------------+               +---------------+
          |
          | IMPLEMENTED_IN
          v
   +-------------------+
   |  IMPLEMENTATION   |
   |     (impl-*)      |
   +-------------------+
```

### 1.1 Primitives (`prim-*`)
- **Responsibility**: Independently reusable interface construction elements or fundamental mechanisms.
- **Scope**: Atomic UI components, telemetry rendering widgets, bounded input scrubbers, and spatial layout frames.
- **Key Attributes**: `uiSlot`, `renderingTech`, `minFootprintPixels`, `supportsTouch`, `supportsKeyboard`, `telemetryRateMaxHz`.
- **Constraint**: Must be self-contained; cannot depend on complex domain business logic.

### 1.2 Patterns (`pat-*`)
- **Responsibility**: Reusable solutions to recurring interface-design problems encountered in stand environments.
- **Scope**: Cognitive workload triage, protocol step-gating, multi-channel wave inspection, dual-operator arming procedures.
- **Key Attributes**: `problemStatement`, `solutionSummary`, `tradeOffs` (advantages and disadvantages), `applicability` (purposes, user levels, minimum screens, required peripherals, hard constraints), `primitiveIds`.
- **Constraint**: A pattern must describe problem, solution, and trade-offs; it incorporates primitives through `USES` relationships.

### 1.3 Configurations (`cfg-*`)
- **Responsibility**: Concrete, compatible combinations of primitives and patterns assembled for a specific physical stand scenario.
- **Scope**: Full workstation recipes (e.g. Subsonic Wind Tunnel Educational Interface, Bioreactor Fermentation Console).
- **Key Attributes**: `targetStand` (name, purpose, level, screenSetup, peripherals), `selectedPatterns`, `selectedPrimitives`, `layoutRecipe`, `safetyLevel`.
- **Constraint**: References existing canonical primitives and patterns rather than duplicating their specifications inline.

### 1.4 Implementations (`impl-*`)
- **Responsibility**: Concrete software or hardware-software instantiations running on actual stand hardware.
- **Scope**: Software clients across tech stacks (React SPA, Qt 6 / C++, Embedded QML / Linux).
- **Key Attributes**: `techStack`, `targetEnvironment`, `codeSample`, `sourceRepoUri`, `verifiedInHardware`, `hardwareStandName`.
- **Constraint**: Must represent real code running against hardware DAQs, not hypothetical pseudocode.

### 1.5 Evidence (`evid-*`)
- **Responsibility**: Empirical backing, formal observational studies, failure logs, and standard verification surveys.
- **Scope**: User trials, reaction latency measurements, ergonomic benchmark studies.
- **Key Attributes**: `evidenceType`, `methodology`, `sampleSize`, `measuredMetrics` (metric, value, baselineComparison), `sourceCitation`, `verifiedDate`.
- **Constraint**: Must report measured data with concrete units and verifiable citations.

---

## 2. Relationship Vocabulary & Relational Semantics

The ontology defines eight directional relationship types in `src/atlas/graphEngine.ts`. Every declared edge in the repository is checked against these rules:

| Relation | Semantic Meaning | Allowed Source Types | Allowed Target Types | Symmetric? | Automated Validation in Code |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`USES`** | Source incorporates target as an architectural building block. | `pattern`, `configuration` | `primitive`, `pattern` | No (Directed) | Enforced via `RELATION_RULES` & node existence checks. |
| **`COMPOSES_WITH`** | Source coordinates harmoniously in adjacent spatial or functional layout zones. | `primitive`, `pattern` | `primitive`, `pattern` | Yes (Bidirectional) | Validated for allowed types; reciprocal link warning logged if asymmetric. |
| **`REQUIRES`** | Source strictly depends on target component or hardware capability. | `pattern`, `configuration` | `primitive`, `pattern` | No (Directed) | Validated against target node existence and type compatibility. |
| **`ALTERNATIVE_TO`** | Source provides an interchangeable solution with differing trade-offs. | `primitive`, `pattern` | `primitive`, `pattern` | Yes (Bidirectional) | Checked for type parity and target existence. |
| **`SPECIALIZES`** | Source is a constrained, narrow, or domain-adapted variant of target. | `pattern` | `pattern` | No (Directed) | Validated for pattern-to-pattern hierarchy. |
| **`CONFLICTS_WITH`** | Source and target cannot safely or ergonomically coexist in the same interface configuration. | `primitive`, `pattern`, `configuration` | `primitive`, `pattern`, `configuration` | Yes (Bidirectional) | Evaluated during retrieval to suppress incompatible candidate pairs. |
| **`IMPLEMENTED_IN`** | Source concept is instantiated in concrete software/hardware codebase. | `pattern`, `configuration` | `implementation` | No (Directed) | Enforced: target must be of type `implementation`. |
| **`VERIFIED_BY`** | Source design decision is substantiated by empirical trial or audit. | `primitive`, `pattern`, `configuration`, `implementation` | `evidence` | No (Directed) | Enforced: target must be of type `evidence`. |

---

## 3. Structural Graph Invariants

The `KnowledgeGraph.validateGraph()` method enforces:
1. **Zero Dangling Edges**: Every edge `sourceId` and `targetId` must resolve to an existing registered entity.
2. **Type-Safety Compliance**: Source and target types must belong to the allowed sets declared in `RELATION_RULES`.
3. **No Unintentional Cycles in `USES`**: While `COMPOSES_WITH` and `ALTERNATIVE_TO` are symmetric, `USES` is strictly acyclic.
4. **Reciprocal Conflict Symmetry**: If Entity A declares `CONFLICTS_WITH` Entity B, the conflict engine treats the relationship as mutually exclusive regardless of direction.

---

## 4. Current Limitations of the Semantic Graph

1. **In-Memory Graph Construction**: The graph is built in memory on client startup. It is not persisted in a specialized graph database (e.g. Neo4j, Oxigraph).
2. **Heuristic Symmetry**: While `COMPOSES_WITH` and `ALTERNATIVE_TO` are semantically symmetric, physical storage in records may be recorded unidirectionally. The graph engine logs an asymmetry warning unless a reciprocal edge is present.
3. **Property Graph Edges**: Edges currently carry an optional string `rationale`. Rich edge properties (e.g., conditionality matrices or temporal weights) are planned for Stage 3.
