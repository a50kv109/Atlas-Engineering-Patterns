# CSP-0.1 / CSP-0.2 Architectural Mapping & Analysis
## Evaluating Cognitive Skill Passport Principles for Atlas Engineering Patterns

**Specification Target:** Atlas Pattern Passport Mini (APPM v0.1)  
**Reference Archive:** Cognitive Skill Passport v0.1 & v0.2 (Artsybashev A. O., DOI: 10.5281/zenodo.19639060 / 10.5281/zenodo.20034069)  
**Evaluation Scope:** Stage P0 Architecture Audit  

---

## 1. Executive Context & Methodology

The Cognitive Skill Passport (CSP) provides a rigorous foundational framework for portable, verifiable cognitive skills in AI agent ecosystems. 

While CSP was conceived for autonomous cognitive units (agents, procedures, operators), its core architectural insight — **separating immutable identity, declared contracts, compatibility interfaces, and external empirical observations** — applies directly to software engineering patterns in laboratory and testbench interfaces.

This document systematically examines each architectural principle from CSP-0.1, CSP-0.2, the CSP Reference Architecture, and the CSP Trust Concept, documenting formal decisions: **ADOPT**, **ADAPT**, **DEFER**, or **REJECT**.

---

## 2. Core Architectural Evaluation Matrix

| CSP Principle | CSP Source Section | Atlas Pattern Adaptation | Decision | Engineering Rationale & Known Limitations |
| :--- | :--- | :--- | :---: | :--- |
| **Separation of Contract from Observed Behavior** | CSP-0.1 §1<br>`Skill = Passport + Runtime` | **Pattern = Passport + Implementation + Evidence**.<br>The passport specifies intended behavior; concrete code implements it; test traces verify it. | **ADOPT** | **Rationale:** Prevents marketing or design intent from being mistaken for verified code.<br>**Limitations:** Requires maintaining separate links to test harnesses and implementations. |
| **Additive Compatibility Layer** | CSP-0.2 §4<br>`compatibility:` block (I/O, capabilities, constraints) | Explicit `compatibility` section specifying stand purposes, user levels, screen setups, and hardware peripherals without mutating pattern identity. | **ADOPT** | **Rationale:** In CSP-0.2, compatibility is an I/O envelope separate from core identity. Similarly, an HMI pattern (e.g. `pat-epistemic-status-labeling`) maintains a stable identity whether deployed on a 1-screen educational bench or a 4-screen wind tunnel console. |
| **Host System Sovereignty (Admission Control)** | CSP-0.2 §7<br>`policy.admission` | The host system (Atlas `RetrievalEngine` / stand supervisor) retains absolute authority to admit, constrain, or reject a pattern based on query constraints and user levels. | **ADOPT** | **Rationale:** A passport declaring applicability to `SECONDARY_SCHOOL` does not force the host to accept it if safety interlocks conflict.<br>**Invariant:** `No Passport -> No Admission`. |
| **Explicit Evidence Binding for Claims** | CSP-0.1 §4<br>`verification:`<br>CSP-TRUST §3 | Every verification claim must specify `claim_id`, `statement`, `method`, `test_ref`, and `untested_boundaries`. | **ADOPT** | **Rationale:** Replaces hollow "production-ready" claims with deterministic references to automated test suites (`tests/nhfg.test.ts`) and empirical trial reports. |
| **Additive Evolution & Versioning** | CSP-0.2 §9<br>Reference Arch §7 | SemVer versioning (`MAJOR.MINOR.PATCH`). Backward compatibility for older consumers when optional fields are added. | **ADOPT** | **Rationale:** Ensures that new extensions (e.g. NHFG normative links or hardware simulation profiles) can be attached without breaking baseline graph queries. |
| **Attestation as External Ecosystem Metadata** | CSP-TRUST §2<br>Execution Attestation Layer | Verification and attestation records are stored externally in `evid-*` or NHFG records, never rewriting the author's passport contract. | **ADOPT** | **Rationale:** Preserves author intent while allowing third-party laboratories to publish independent trial findings. |
| **DBE (Dynamic Benchmark Engine)** | CSP-0.1 §4.1<br>CSP-0.2 §6 | **Adapted into Automated Testbench Scenarios:** Formal executable assertions simulating physical packet loss, sensor failures, or out-of-order operator inputs. | **ADAPT** | **Rationale:** CSP DBE tests cognitive agent prompt drift; in Atlas, DBE manifests as deterministic Vitest/TypeScript scenarios asserting physical UI invariants (e.g., `verif-req-no-data-scenario-01`). |
| **CORE Classification Taxonomy (`Nature.Action.Domain`)** | CSP-0.1 §2<br>e.g. `AG.SY.DATA` | **Adapted into Atlas Domain & Role Taxonomy:** `category` (`layout`, `telemetry`, `controls`, `safety`, `guidance`, `multi-screen`) and `uiSlot` (`ribbon`, `rail`, `stage`, `tray`). | **ADAPT** | **Rationale:** `CORE` in CSP assumes an autonomous cognitive agent (`AG`, `MI`, `OP`, `PR`). HMI patterns are structural interaction mechanisms, not reasoning agents. We retain the concise structural classification principle, but align it with Atlas engineering domains. |
| **Declared vs. Verified Compatibility** | CSP-0.2 §4 | Explicit partition in the passport between `compatibility.declared` (author's design hypothesis) and `compatibility.verified` (empirically tested combinations). | **ADAPT** | **Rationale:** Crucial for safety-critical stands: an author may declare a pattern suitable for high-voltage testbeds, but until verified, the host orchestrator must treat this as unverified. |
| **Cryptographic Attestations & Signatures** | CSP-TRUST §3<br>`passport_hash`, public key signatures | Deferred to future distributed registry phases. Current verification uses Git commit hashes, content-addressed IDs, and CI/CD test logs. | **DEFER** | **Rationale:** In the current standalone Atlas repository, cryptographic key infrastructure adds operational friction without immediate engineering gain. Content hashes and traceable file paths satisfy current integrity needs. |
| **TDI (Tensor Divergence Index)** | CSP-0.1 §4.2<br>TDI metric (0.0 to 1.0) | Replaced by deterministic invariant violation checks and epistemic loss logging (`LossLog`, `knowledgeGaps`). | **REJECT** | **Rationale:** TDI measures probabilistic distribution drift in neural language/tensor outputs. Engineering stand interfaces require strict boolean invariant satisfaction (e.g. "Did missing telemetry render as zero? YES/NO"), not statistical divergence scores. |
| **Economic Revenue Sharing Layer** | CSP-0.2 §8<br>`developer_share: 0.80` | Completely excluded from Atlas Pattern Passport. | **REJECT** | **Rationale:** Atlas is an open engineering knowledge ontology, educational tool, and research bench synthesis engine, not a commercial agent marketplace. Economic fields introduce irrelevant noise into an engineering contract. |

---

## 3. Deep-Dive on Evaluated Principles

### 3.1 Principle 1: Contract Independence vs. Observed Behavior
- **CSP Doctrine:** `Skill = Passport + Runtime Behavior`. The passport is invariant; host runtime telemetry updates continuously.
- **Atlas Reality:** In Atlas, patterns frequently suffered from "claim inflation" — describing what an ideal pattern *should* do while having only a partial prototype.
- **APPM Adaptation:** The passport defines the contract; implementation records (`impl-*`) define realization; evidence records (`evid-*`, `verif-*`) capture what has passed in tests. If an implementation violates the passport contract, the passport is not rewritten — the implementation is marked non-conforming.

### 3.2 Principle 2: Compatibility as an Additive Layer
- **CSP Doctrine:** Added in CSP-0.2 without changing CSP-0.1 `CORE`. Focuses on I/O categories, formats, and capabilities.
- **Atlas Reality:** Different stands have wildly differing hardware topologies (e.g. single 1080p touch monitor vs. triple 4K display + hardware rotary consoles + safety relay racks).
- **APPM Adaptation:** A pattern's core purpose (e.g., staging mutations before commit) remains constant. Its `compatibility` block explicitly states minimum screens, required peripherals, and supported student/operator levels.

### 3.3 Principle 3: Host Admission Sovereignty
- **CSP Doctrine:** `Immutable Passport + Local Control`. `No Passport -> No Execution`.
- **Atlas Reality:** When an operator requests a stand configuration for secondary school students, `RetrievalEngine` must enforce that dangerous industrial interlocks or overly complex telemetry suites are excluded, even if those patterns have valid passports.
- **APPM Adaptation:** The passport provides the metadata; the host engine evaluates compatibility against query constraints. The pattern author cannot force admission.

---

## 4. Invariants Summary for APPM

1. **Identity Stability:** Pattern ID (`pat-*`) and version identify the specification, not a transient React component.
2. **Epistemic Honesty:** Missing evidence is never interpreted as passed verification.
3. **No Automatic Conformance:** Implementing an ISO guideline or possessing an APPM passport does not confer certified compliance.
4. **Local Host Veto:** The host environment can always reject a pattern on safety, policy, or hardware mismatch grounds.
