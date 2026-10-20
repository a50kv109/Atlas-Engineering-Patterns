# ATLAS NHFG — UI & Traceability Inspector Specification (Stage G)

## 1. Executive Summary & Design Intent

Stage G delivers the visual and interactive interface for the **Normative & Human Factors Guidance (NHFG)** layer within Atlas Engineering Patterns:
1. **Interactive NHFG Explorer (`src/atlas/components/NhfgView.tsx`)**: Allows researchers, engineers, and educators to explore international standards (ISO 9241-110, 210, 11), inspect the 7 dialogue principles, trace normative links to canonical Atlas patterns, and review executable verification records.
2. **Deep Retrieval Composer Integration (`src/atlas/components/ComposerView.tsx`)**: Seamlessly embeds normative guidance into synthesized stand configurations, providing per-pattern ISO citations, rationale cards, and aggregate principle coverage without cluttering the engineering workflow.
3. **Anti-Conflation Visual Guardrails**: Explicitly highlights that standard conformance is **not** established (`CONFORMANCE_NOT_ESTABLISHED`) until formal assessment or certification occurs, eliminating AI-generated false compliance claims.

---

## 2. Component Architecture

```
+---------------------------------------------------------------------------------+
|                                 App.tsx                                         |
|  - ActiveTab: 'repository' | 'graph' | 'composer' | 'nhfg' | 'ingestion' | ...  |
+---------------------------------------------------------------------------------+
           |                                                   |
           v                                                   v
+-----------------------------+             +-------------------------------------+
|         NhfgView            |             |            ComposerView             |
| - Filter by standard/epoch  |             | - Blueprint & UI Preview            |
| - 4-Step Chain Flow         |             | - Sub-tab: 'nhfg' (ISO Guidance)    |
| - Executable Scenarios demo |             | - Pattern cards with ISO badges     |
| - Registry Validation Panel |             | - Anti-conflation disclaimer bar    |
+-----------------------------+             +-------------------------------------+
```

---

## 3. Key UI Views and Capabilities

### 3.1 Traceability Inspector (`NhfgView` -> Mappings)
- **Master-Detail Flow**: Left column lists all 6 mapped patterns with category badges (`SOURCE_CONFIRMED`, `ENGINEERING_INTERPRETATION`, `DESIGN_HYPOTHESIS`); right column displays the full 4-step chain:
  1. *International Standard (Source)*: Title, official ISO URL, publication date, confirmed date.
  2. *Dialogue Principle*: ISO 9241-110 clause, concise statement, user impact.
  3. *Normative Requirement*: Atomic statement, safety criticality, requirement type.
  4. *Atlas Engineering Pattern*: Concrete UI mechanism, applicability conditions, known limitations, and missing evidence.

### 3.2 Executable Verification Sandbox (`NhfgView` -> Scenarios)
- Provides an interactive side-by-side comparison illustrating `verif-req-no-data-scenario-01`:
  - *Naive Fallback (No Pattern)*: Treating a missing telemetry sample (null) as `0.0`, resulting in a catastrophic 33.3% distortion of the average and false alarms.
  - *Atlas Epistemic Status (`pat-epistemic-status-labeling`)*: Strictly isolating missing samples, preserving average accuracy at 101.4 kPa, and visibly badging the channel as `NO_DATA`.

### 3.3 Composer Normative Integration (`ComposerView`)
- Added `Нормы ISO` sub-tab directly into the Stand Composer.
- Each matched pattern displays:
  - Dialogue principle & section number.
  - Atomic requirement statement.
  - Epistemic category and scenario verification status (`SCENARIO_VERIFIED`).
  - Standard compliance honesty disclosure (`CONFORMANCE_NOT_ESTABLISHED`).

### 3.4 Registry Integrity Verification (`NhfgView` -> Validation)
- Real-time audit of the NHFG layer against the 53 canonical Atlas records.
- Guarantees 0 broken references, 0 phantom pattern IDs, 0 illegal status combinations, and zero entity bloat in core.
