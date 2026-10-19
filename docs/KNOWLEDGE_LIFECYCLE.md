# Knowledge Ingestion & Lifecycle Specification

## 1. Lifecycle States and Maturity Model

Entities in Atlas Engineering Patterns progress through defined lifecycle states that track maturity and verification status:

```
+-----------------------------------------------------------------------------------+
|  [IDEA / RAW PROPOSAL]                                                            |
|          |                                                                        |
|          v (Scope Check & Duplicate Screening)                                    |
|  [PROPOSED] (Initial candidate record with stable ID)                             |
|          |                                                                        |
|          v (Schema & Relation Rule Validation)                                    |
|  [SPECIFIED] (Formally defined with inputs, outputs, trade-offs)                  |
|          |                                                                        |
|          v (Software/Hardware Prototyping)                                        |
|  [IMPLEMENTED] (Instantiated in working client code on physical stand)            |
|          |                                                                        |
|          v (Longitudinal Laboratory Trials)                                       |
|  [TESTED] (Evaluated with recorded operator error metrics)                        |
|          |                                                                        |
|          +--------------------------+                                             |
|          |                          |                                             |
|          v                          v                                             |
|  [MEASURED]               [INDEPENDENTLY_VERIFIED]                                |
|  (Quantitative empirical  (Third-party safety/ergonomic                           |
|   data published)          audit verified)                                        |
|          |                          |                                             |
|          +--------------------------+                                             |
|          |                                                                        |
|          v (Superseded by superior ergonomic pattern)                              |
|  [DEPRECATED] (Preserved in history for backward traceability)                    |
+-----------------------------------------------------------------------------------+
```

---

## 2. Ingestion Pipeline Stages

### Stage 1: Scope Boundary Screening
Every incoming idea is evaluated against the strict project domain boundary:
- **In-Scope**: Layout, telemetry presentation, controls, status annunciators, multi-monitor ergonomics, operator error prevention for laboratory and educational stands.
- **Out-of-Scope (Immediate Rejection)**: General enterprise software, financial/cryptocurrency tools, e-commerce, generic AI chat interfaces, standalone PCB routing, or general-purpose physics simulations.

### Stage 2: Problem Formalization
The author must articulate:
1. The physical or cognitive problem faced by the stand operator.
2. The concrete interface mechanism proposed to resolve it.
3. The trade-offs (benefits vs computational/ergonomic overhead).

### Stage 3: Duplicate & Synonym Analysis
The ingestion engine compares the candidate's tokens against existing canonical records:
- **Algorithm**: Jaccard similarity across title tokens (weighted 70%) and description tokens (weighted 30%).
- **Heuristic Threshold**: If composite similarity $\ge 45\%$ or title similarity $\ge 60\%$, the candidate is flagged as `FLAG_DUPLICATE` with a reference to the existing entity.
- **Limitation**: Token-based Jaccard similarity is an algorithmic lexical heuristic; it detects literal token overlaps but cannot prove deep semantic equivalence.

### Stage 4: Stable Identifier Allocation
Generates a deterministic prefix-based identifier:
- `prim-*` for primitives
- `pat-*` for patterns
- `cfg-*` for configurations
- `impl-*` for implementations
- `evid-*` for evidence records

Ensures uniqueness against all registered entity IDs in the repository.

### Stage 5: Schema and Relational Validation
Verifies mandatory fields, category validity, and graph edge rules:
- Relations must connect only to existing target IDs (zero dangling edges).
- Source and target types must conform to `RELATION_RULES`.

### Stage 6: Pipeline Audit Report
Generates an ingestion review document with one of four recommendations:
- `ACCEPT_CANDIDATE`: Passes scope, schema, and relationship checks without duplicate conflict.
- `REQUEST_REVISIONS`: Missing required fields, invalid category, or dangling edge references.
- `FLAG_DUPLICATE`: Significant semantic overlap with an established entity.
- `REJECT_OUT_OF_SCOPE`: Proposed functionality falls outside stand interface configuration.

---

## 3. Critical Architectural Distinction: Automated Validation vs Human Review

**Passing automated checks is NOT proof of engineering validity.**

- **What Automated Validation Establishes**:
  - The submission is structurally well-formed (valid JSON/TypeScript schema).
  - The text mentions stand-related terms rather than banned keywords.
  - The declared graph edges connect to valid nodes without syntax errors.
  - The candidate does not share identical keywords with an existing card.

- **What Automated Validation CANNOT Establish**:
  - Whether the pattern actually improves operator performance on physical hardware.
  - Whether the proposed telemetry update rate is physically realistic for the DAQ.
  - Whether the layout causes cognitive tunnel vision during emergency events.
  - Whether empirical claims in the description are authentic.

---

## 4. Current Implementation Limitations & Gap Analysis

1. **Client-Side In-Memory Acceptance**:
   - In the interactive web prototype (`src/atlas/components/IngestionView.tsx`), clicking "Включить в канонический реестр" appends the approved candidate into client-side React state for immediate testing within the session.
   - **Correction Needed**: True canonical ingestion requires a Git-based pull-request workflow where candidate YAML/TypeScript files are committed to a `proposals/` branch, reviewed by human stand engineers, and validated in CI before merging into `src/atlas/canonicalData.ts`.
2. **Deprecation Audit Trail**:
   - Deprecated entities remain in code with `lifecycleStatus: 'DEPRECATED'`. In future stages, deprecation replacement pointers (e.g. `SUPERSEDED_BY`) should be formalized in the relation ontology.
