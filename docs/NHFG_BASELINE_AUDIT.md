# NHFG (Normative & Human Factors Guidance) Layer — Baseline Architecture Audit

## 1. Executive Summary

This document presents the baseline architectural audit (Stage A of the NHFG integration plan) for introducing the **Normative & Human Factors Guidance (NHFG)** layer into **Atlas Engineering Patterns**. 

The goal of NHFG is to link existing Atlas patterns and primitives (`pat-*`, `prim-*`) to recognized normative standards (such as ISO 9241-110, ISO 9241-210, and ISO 9241-11), formal design principles, verifiable requirements, scenario checks, and evidence records, while strictly preserving epistemic discipline (SOL-2) and anti-hallucination guarantees.

---

## 2. Confirmed Project Structure

The existing repository (`atlas-engineering-patterns`) is structured as follows:

```
/
├── src/
│   ├── atlas/
│   │   ├── types.ts           # Core types (EntityType, LifecycleStatus, GraphRelation, etc.)
│   │   ├── canonicalData.ts     # 53 vetted canonical records (primitives, patterns, configs, implementations, evidence)
│   │   ├── graphEngine.ts       # Directed graph construction, relation validation (RELATION_RULES)
│   │   ├── retrievalEngine.ts   # Stand specification matching, hard constraints, SOL-2 epistemic loss accounting
│   │   ├── ingestionEngine.ts   # Scope boundary check, Jaccard duplicate detection, schema validation
│   │   ├── auditEngine.ts       # Automated 12-criteria acceptance audit runner
│   │   └── components/          # UI views (RepositoryView, ComposerView, GraphView, IngestionView, AuditView, ContractDocView, Header)
│   ├── App.tsx                  # Root application shell & tab navigation
│   ├── main.tsx                 # React entry point
│   └── index.css                # Tailwind CSS v4 styling
├── tests/
│   ├── audit.test.ts            # 17 automated acceptance & graph structure tests
│   └── epistemicLoss.test.ts    # 8 epistemic refinement & loss log tests
├── docs/                        # Architectural documentation, testing guides, and patterns (DRA)
└── package.json                 # Build & test scripts (tsx test suites, Vite build)
```

---

## 3. Existing Suitable Entities & Mechanisms

The current architecture already provides several solid foundational structures that will support NHFG without requiring a rewrite:
1. **`BaseEntity` & Entity Types (`src/atlas/types.ts`)**: Supports typed records with unique IDs, metadata, lifecycle statuses, tags, and relations.
2. **`GraphRelation` (`src/atlas/types.ts`)**: Supports directed edges (`USES`, `COMPOSES_WITH`, `REQUIRES`, `ALTERNATIVE_TO`, `CONFLICTS_WITH`, `IMPLEMENTED_IN`, `VERIFIED_BY`) with optional rationales.
3. **`evidenceIds` (`BaseEntity`)**: Links entities to existing evidence records (`evid-*`), which can be extended to point to NHFG verification records.
4. **SOL-2 Epistemic Provenance (`src/atlas/retrievalEngine.ts`)**: Tracks `lossLog`, `knowledgeGaps`, and validation statuses (`VERIFIED`, `UNVERIFIED`, `INCOMPATIBLE`, `UNKNOWN`), ensuring heuristic matches are never conflated with formal proof.
5. **Acceptance Audit (`src/atlas/auditEngine.ts`, `tests/audit.test.ts`)**: Provides automated verification of dataset integrity and graph constraints.

---

## 4. Missing Capabilities for NHFG Layer

To fully support Normative & Human Factors Guidance, the following data structures and relationships are currently absent and must be introduced:
1. **`SourceRecord`**: Representation of external standards (e.g., ISO 9241-110:2020) with official metadata, sections, and verification status.
2. **`PrincipleRecord`**: Representation of formal design principles (e.g., self-descriptiveness, use error robustness) derived from sources.
3. **`RequirementRecord`**: Testable system or interface requirements tied to principles and applicable context.
4. **`PatternMapping`**: Explicit, justified mapping between a principle/requirement and an Atlas pattern (`pat-*`), complete with applicability conditions, known limitations, and validation status (`NOT_ASSESSED`, `DESIGN_RATIONALE_PROVIDED`, `SCENARIO_VERIFIED`, `USER_EVALUATED`, `CONFORMANCE_NOT_ESTABLISHED`).
5. **`VerificationRecord` & `EvidenceRecord` extensions**: Structured scenario check definitions, success criteria, and test results.

---

## 5. Files Requiring Modification or Addition

| File Path | Action | Description |
| :--- | :--- | :--- |
| `src/atlas/types.ts` | Modify | Add NHFG TypeScript interfaces (`SourceRecord`, `PrincipleRecord`, `RequirementRecord`, `PatternMapping`, `VerificationRecord`, mapping statuses). |
| `src/atlas/nhfgData.ts` | Create | Define canonical ISO 9241 sources, principles (ISO 9241-110 7 principles), and initial pattern mappings for Atlas patterns. |
| `src/atlas/nhfgEngine.ts` | Create | Provide helper functions for querying NHFG mappings, evaluating principle coverage, and validating requirement-to-pattern links. |
| `tests/nhfg.test.ts` | Create | Add automated unit tests verifying NHFG entity uniqueness, valid source references, mapping integrity, and status transitions. |
| `src/atlas/components/NhfgView.tsx` | Create | Introduce a minimal UI tab/view to inspect ISO sources, principles, and pattern mappings with their evidence statuses. |
| `src/App.tsx` | Modify | Register `NhfgView` in application navigation. |

---

## 6. Compatibility Risks & Mitigation

1. **Risk of breaking existing tests**: Introducing new types could cause TypeScript compilation errors if existing entities are mismatched.
   - *Mitigation*: NHFG records will be stored in a dedicated module (`src/atlas/nhfgData.ts`) and referenced via relations or mappings rather than modifying the core `BaseEntity` schema directly. Existing tests will remain 100% untouched and passing.
2. **Risk of overstating standard compliance**: Conflating a successful UI pattern with full normative compliance.
   - *Mitigation*: Enforce explicit mapping statuses (e.g., `DESIGN_RATIONALE_PROVIDED` vs `SCENARIO_VERIFIED`) and prohibit automatic status escalation without test evidence.

---

## 7. Minimal Implementation Plan (Stages B–G)

- **Stage B (Data Model)**: Define NHFG types in `src/atlas/types.ts`.
- **Stage C (ISO 9241 Pilot)**: Populate `src/atlas/nhfgData.ts` with the 7 ISO 9241-110 principles, ISO 9241-210, and ISO 9241-11 metadata.
- **Stage D (Pattern Integration)**: Map core Atlas patterns (`pat-epistemic-status-labeling`, `pat-guided-student-experiment-stepper`, `pat-calibrated-telemetry-console`, `pat-preview-validate-commit`, `pat-live-object-health-indicator`) to applicable principles with detailed rationales.
- **Stage E (Evidence & Statuses)**: Enforce evidence tracking and non-linear status evaluation.
- **Stage F (Quality Assurance)**: Add `tests/nhfg.test.ts` validating link integrity, unique IDs, and orphan checks.
- **Stage G (Minimal UI)**: Implement `NhfgView.tsx` for browsing normative guidance and evidence linkages.

---

## 8. Open Questions & Resolutions

1. *Should standards text be copied into the repository?*
   - **Resolution**: No. Per instructions and copyright considerations, only short summaries, section IDs, URLs, and official metadata will be stored.
2. *Should NHFG be merged into `canonicalData.ts` or kept separate?*
   - **Resolution**: Kept in a dedicated `nhfgData.ts` to maintain clean separation between UI construction patterns and normative guidance sources.
