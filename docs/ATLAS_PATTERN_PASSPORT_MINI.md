# Atlas Pattern Passport Mini (APPM v0.1)
## Minimal Engineering Contract for Reusable Interface Patterns

**Status:** Specification Draft (Stage P0)  
**Schema Identifier:** `atlas-pattern-passport/0.1`  
**Base Architecture Source:** Cognitive Skill Passport (CSP-0.1 / CSP-0.2) by Artsybashev A. O. (DOI: 10.5281/zenodo.19639060)  
**Domain Adaptation:** Laboratory, Research, and Industrial Testbench HMI Interfaces (Atlas Engineering Patterns)  

---

## 1. Executive Summary & Purpose

The **Atlas Pattern Passport Mini (APPM v0.1)** is a compact, machine-readable, implementation-independent engineering contract designed for reusable human-machine interface (HMI) patterns in testbench and laboratory environments.

In industrial testbeds, research benches, and educational laboratory stands, software interfaces are often coupled to idiosyncratic codebases or evaluated purely on visual appeal. APPM introduces a structured boundary that treats an interface pattern as a formal engineering artifact.

### Core Architectural Axiom

$$\text{Pattern} = \text{Passport} + \text{Implementation} + \text{Evidence}$$

These three components represent strictly separated epistemic concerns:

1. **Passport (Contract):** An immutable, portable specification of what the pattern is designed to achieve, its behavioural invariants, operational context, and compatibility envelope.
2. **Implementation (Realization):** Concrete code, UI widgets, or framework components instantiated in a host system (e.g. React/TypeScript, Qt, LabVIEW, SCADA).
3. **Evidence (Observation):** Reproducible automated assertions, scenario simulations, operator usability trials, or formal audit logs demonstrating how the implementation actually behaved.

> **Epistemic Guardrail:** The existence of a passport proves only that a contract was declared. It does not prove that an implementation is correct, safe, usable, or compliant with international standards.

---

## 2. Architectural Principles Derived from CSP

APPM v0.1 adapts key structural principles from **Cognitive Skill Passport (CSP-0.1 and CSP-0.2)**, adjusting them from autonomous cognitive agents to deterministic interface engineering:

1. **Identity & Declaration Independence (CSP-0.1 §1):** A pattern's declared contract is decoupled from runtime telemetry and concrete realizations.
2. **Additive Compatibility Layer (CSP-0.2 §4):** I/O interfaces, hardware peripherals, and target operator levels form an explicit, modular layer that does not mutate the pattern's core identity.
3. **Local Sovereignty / Host Admission Control (CSP-0.2 §7):** The receiving system (e.g., Atlas RetrievalEngine, safety supervisor, stand orchestrator) retains absolute authority over whether to admit, constrain, or reject a pattern for a given stand context.
4. **Separation of Verification from Ordinary Metadata (CSP-0.1 §4, CSP-TRUST §2):** Evidence, benchmarks, and claims must not be inferred from description text. They require dedicated claim records and verified references.
5. **Epistemic Anti-Conflation:** A successful scenario test does not establish standard compliance; absence of evidence is never evidence of compliance.

---

## 3. Machine-Readable Schema Specification

A valid APPM document must conform to the YAML / JSON schema defined below.

```yaml
pattern_passport:
  schema: "atlas-pattern-passport/0.1"

  identity:
    id: "pat-example-identifier"
    name: "Canonical Pattern Name"
    version: "0.1.0"
    status: "draft" # draft | candidate | active | deprecated
    category: "safety" # layout | telemetry | controls | safety | guidance | multi-screen

  intent:
    problem: "Concise description of the specific engineering or cognitive failure mode addressed."
    expected_outcome: "Observable positive state achieved when the pattern is correctly applied."

  context:
    applicable_when:
      - "Specific operational condition 1"
    not_applicable_when:
      - "Explicit exclusion or contraindication condition 1"
    prerequisites:
      - "Mandatory hardware, calibration, or interface precondition"

  contract:
    inputs:
      - name: "telemetry_stream"
        type: "Stream<SensorSample | null>"
        description: "Raw measurement stream including possible missing/null frames"
        required: true
    behavior:
      - "Invariable rule 1: Missing samples must never be coerced to numeric zero."
      - "Invariable rule 2: State annunciator must visibly indicate epistemic state."
    outputs:
      - name: "labeled_reading"
        type: "EpistemicSample"
        description: "Sample paired with explicit validity flag (VALID | NO_DATA | HEURISTIC)"
    constraints:
      - "Hard constraint: Downstream aggregators must exclude NO_DATA from numeric averages."

  compatibility:
    declared:
      stand_purposes:
        - "STUDENT_LAB_EXPERIMENT"
        - "RESEARCH_BENCH"
      operator_levels:
        - "SECONDARY_SCHOOL"
        - "UNDERGRADUATE"
        - "RESEARCHER"
      hardware:
        min_screens: 1
        required_peripherals: []
        optional_peripherals: ["rotary-encoder", "touch-screen"]
      dependencies:
        patterns: []
        primitives: ["prim-state-annunciator-matrix"]
      conflicts:
        - pattern_id: "pat-raw-unbuffered-stream"
          reason: "Direct stream rendering bypasses epistemic qualification."
    verified:
      stand_purposes:
        - "STUDENT_LAB_EXPERIMENT"
      operator_levels:
        - "UNDERGRADUATE"

  rationale:
    design_reasoning: "Engineering justification connecting cognitive ergonomics with physical risk mitigation."
    tradeoffs:
      advantages:
        - "Prevents catastrophic misinterpretation of sensor failure as zero reading."
      disadvantages:
        - "Adds visual overhead and requires classification metadata on all sensors."

  verification:
    overall_status: "scenario_verified" # not_assessed | design_reviewed | scenario_verified | user_evaluated | failed
    claims:
      - claim_id: "claim-no-zero-coercion"
        statement: "Missing telemetry sample (null) renders NO_DATA badge and is omitted from averages."
        status: "scenario_verified"
        method: "AUTOMATED_UNIT_ASSERTION"
        test_ref: "tests/nhfg.test.ts::verif-req-no-data-scenario-01"
        evidence_ref: "evid-cqns-001-interface-analysis"
        untested_boundaries:
          - "Packet loss exceeding 80% on saturated serial buses."
          - "Human operator reaction times during flashing alert states."
    gaps:
      - "Long-term operator fatigue trial under 8-hour continuous shift not documented."

  # Optional Normative & Human Factors Extension (Integrated with NHFG)
  guidance:
    mappings:
      - source_id: "src-iso9241-110-2020"
        principle_id: "prin-iso9241-110-self-descriptiveness"
        requirement_id: "req-iso9241-110-no-data-distinct"
        mapping_type: "engineering_interpretation" # source_requirement | engineering_interpretation | design_hypothesis
        applicability: "Multi-sensor laboratory stands subject to transducer disconnects"
        conformance_status: "not_established" # not_established | claimed
        conformance_disclaimer: "Design rationale and scenario test verified; does not constitute certified ISO 9241-110 compliance."
        limitations:
          - "Demonstrated in automated simulation; does not replace ISO accredited evaluation."

  provenance:
    author: "Atlas Engineering Consortium"
    origin: "CQNS-001 (DRA Lab Interface)"
    created: "2026-03-15"
    updated: "2026-10-20"
```

---

## 4. Field Semantics & Requirements Matrix

| Section / Field | Type | Obligation | Semantic Invariant |
| :--- | :--- | :--- | :--- |
| `schema` | String | **Mandatory** | Must strictly equal `"atlas-pattern-passport/0.1"`. |
| `identity.id` | String | **Mandatory** | Stable identifier formatted as `pat-[a-z0-9-]+`. Reuses existing Atlas canonical pattern ID. |
| `identity.name` | String | **Mandatory** | Human-readable title of the pattern. |
| `identity.version` | String | **Mandatory** | SemVer string (`MAJOR.MINOR.PATCH`). |
| `identity.status` | Enum | **Mandatory** | `draft`, `candidate`, `active`, or `deprecated`. |
| `identity.category`| Enum | **Mandatory** | Must match Atlas `DomainCategory`. |
| `intent.problem` | String | **Mandatory** | Precise operational failure mode or cognitive trap. |
| `intent.expected_outcome` | String | **Mandatory** | Tangible mitigation or state transition. |
| `context.applicable_when` | Array | **Mandatory** | List of explicit preconditions for relevance. |
| `context.not_applicable_when` | Array | **Mandatory** | Explicit boundary constraints preventing misapplication. |
| `context.prerequisites` | Array | Optional | Pre-existing hardware or calibration requirements. |
| `contract.inputs` | Array | **Mandatory** | Typed parameters/streams required by the pattern. |
| `contract.behavior` | Array | **Mandatory** | Invariable behavioural rules enforced by the pattern. |
| `contract.outputs` | Array | **Mandatory** | Guarantees provided to downstream components. |
| `contract.constraints`| Array | Optional | Hard constraints (e.g. interlocks, limits). |
| `compatibility.declared` | Object | **Mandatory** | Designer-declared target envelopes. |
| `compatibility.verified` | Object | Optional | Subsets of declared compatibility backed by real evidence. |
| `rationale.design_reasoning` | String | **Mandatory** | Architectural justification. |
| `rationale.tradeoffs`| Object | **Mandatory** | Both advantages and disadvantages must be disclosed. |
| `verification.overall_status` | Enum | **Mandatory** | Lowest common denominator of verified claims. |
| `verification.claims` | Array | Optional | Fine-grained, testable claims with test references. |
| `verification.gaps` | Array | Optional | Explicit disclosure of unmeasured or unverified bounds. |
| `guidance.mappings` | Array | Optional | References to NHFG source, principle, and requirement records. |
| `provenance.origin` | String | **Mandatory** | Source repository, paper, or research project. |
| `provenance.created`| String | **Mandatory** | ISO date string (`YYYY-MM-DD`). |

> **Non-Silent Default Rule:** Missing, omitted, or empty fields must NEVER be interpreted as satisfied requirements. If an operational constraint or test is absent, its status is explicitly `unknown` or `not_assessed`.

---

## 5. Verification Status Model & Epistemic Boundaries

APPM replaces vague "verified" labels with a strict, non-linear 5-tier status model:

```
[not_assessed]
      |
      v
[design_reviewed]  <-- Review of architectural reasoning and trade-offs
      |
      +----------------------------+
      |                            |
      v                            v
[scenario_verified]        [user_evaluated]
(Automated/CI assertions)   (Empirical trials with operators)
      |                            |
      +-------------+--------------+
                    |
                    v
          [Full Verification Envelope]
```

### Explicit Status Definitions:
1. `not_assessed`: The pattern contract has been drafted, but neither formal design review, scenario test, nor operator trial has been recorded.
2. `design_reviewed`: The design rationale, trade-offs, and boundary exclusions have been reviewed by peer engineers or an ingestion gatekeeper.
3. `scenario_verified`: A defined, reproducible scenario test (e.g. in Vitest, pytest, or CI/CD testbench harness) passed its assertions under specified conditions.
4. `user_evaluated`: Documented trials with representative target operators (e.g. undergraduate students, test engineers) demonstrated usability or error reduction.
5. `failed`: A formal test or trial yielded an invariant violation or unacceptable error rate.

### Critical Non-Conflation Rules:
- **Scenario Verification $\neq$ Standard Conformance:** Passing a test that implements an ISO 9241-110 recommendation does not constitute certified compliance with ISO 9241-110. Conformance requires an independent accredited audit.
- **Scenario Verification $\neq$ Safety Certification:** Verifying an emergency stop UI pattern in software does not constitute compliance with IEC 61508 or ISO 13849-1 hardware safety integrity levels (SIL/PL).
- **Declared Compatibility $\neq$ Verified Compatibility:** Declaring that a pattern works for `SECONDARY_SCHOOL` students remains a design hypothesis until verified in user trials.

---

## 6. Relationship with Existing Atlas & NHFG Architecture

APPM v0.1 does not replace or duplicate Atlas data structures; it functions as an external contract view:

```
+-----------------------------------------------------------------------------+
|                           ATLAS KNOWLEDGE GRAPH                             |
|  - CANONICAL_PATTERNS (53 Entities): Identity, category, relations, tags    |
|  - CANONICAL_PRIMITIVES: UI slots, DOM footprints, touch/keyboard support   |
+-----------------------------------------------------------------------------+
                                       ^
                                       | references by ID (pat-*)
                                       |
+-----------------------------------------------------------------------------+
|                      ATLAS PATTERN PASSPORT (APPM v0.1)                     |
|  - Formal I/O Contract (inputs, outputs, behavior, hard constraints)        |
|  - Declared vs Verified Compatibility envelopes                             |
|  - Testable claims with explicit test_ref & untested boundaries              |
+-----------------------------------------------------------------------------+
                                       |
                                       | references by ID (src-*, prin-*, req-*)
                                       v
+-----------------------------------------------------------------------------+
|                   NHFG (Normative & Human Factors Guidance)                 |
|  - Sources (ISO 9241-110, 210, 11 with official URLs & confirmed dates)    |
|  - Dialogue Principles & Atomic Requirements                                |
|  - Orthogonal Statuses (Design Rationale, Scenario, Conformance Method)     |
+-----------------------------------------------------------------------------+
```

---

## 7. Versioning & Evolution Protocol

1. **Additive Compatibility:** Adding optional fields (e.g. execution metrics, simulation hooks) must not break older APPM consumers.
2. **Passport Invariant Immutability:** Once a passport version is published, its behavioral contract cannot be altered without incrementing the SemVer `MINOR` or `MAJOR` version.
3. **Traceable Amendments:** Any change to constraints or claims must document the authorizing commit, test suite execution, or audit report in `provenance`.
