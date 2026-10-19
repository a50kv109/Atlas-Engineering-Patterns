# Architectural Pattern: Deterministic Reasoning Anchor (DRA)

## 1. Overview & Purpose

The **Deterministic Reasoning Anchor (DRA)** pattern addresses a fundamental limitation in standard LLM tool calling:
- **Standard Tool Calling** asks: *«Can the agent call a tool when prompted or guided?»*
- **Deterministic Reasoning Anchor (DRA)** asks: *«Can the agent autonomously recognize when a problem fragment requires external deterministic verification, decide whether external verification is warranted, project the problem into a formal tool representation, and strictly separate tool-verified facts from agent interpretation and hypothesis?»*

DRA provides a principled mechanism for AI agents to anchor open-ended reasoning in deterministic external engines (such as graph analyzers, mathematical solvers, or constraint validators) without hallucinating capability coverage or conflating agent assumptions with verified facts.

---

## 2. The 7-Stage Deterministic Reasoning Anchor Lifecycle

When an agent encounters a complex engineering task or workspace configuration query, it executes (or evaluates through) the following 7 stages:

1. **Problem Identification**:  
   Ingesting the initial unstructured user query, constraints, and operational goals.
2. **Structural Recognition**:  
   Autonomously identifying which fragment of the problem possesses formalizable invariants (e.g., compatibility graphs, topological constraints, or requirement satisfaction sets).
3. **Applicability Decision (with Intentional Abstention)**:  
   Determining whether external deterministic verification is genuinely beneficial or if direct heuristic reasoning is sufficient. If verification is unwarranted or outside system scope, the agent **intentionally abstains** from external tooling.
4. **Semantic Projection**:  
   Projecting the structural problem fragment into the strict schema required by the verification engine (e.g., mapping stand requirements and candidate metadata into `RetrievalEngine` or `KnowledgeGraph` queries).
5. **Deterministic Operation**:  
   Executing the deterministic calculation or graph traversal outside the LLM context (e.g., evaluating `checkCompatibility()`, `detectConflicts()`, or graph validation).
6. **Epistemic Separation**:  
   Strictly categorizing the output into three distinct epistemic classes:
   - **`TOOL_VERIFIED_FACT`**: Results formally established by deterministic execution (e.g., graph connectivity, validated compatibility, explicit gap detection).
   - **`AGENT_INTERPRETATION`**: Reasoning conclusions derived by the agent from the tool output.
   - **`AGENT_HYPOTHESIS`**: Unverified candidate selections or heuristic matches awaiting formal evidence.
7. **Reasoning Update**:  
   Updating the agent's internal state and composition plan based solely on `TOOL_VERIFIED_FACT` while explicitly logging uncertainties or unverified matches in the epistemic loss ledger (`lossLog`).

---

## 3. Epistemic Separation & Evidence Boundaries

A core tenet of DRA and Atlas × SOL-2 integration is that **relevance is not proof**:
- **Heuristic Matches (`HEURISTIC_MATCH_ONLY`)**: Substring or tag matching against repository records indicates that a pattern or primitive is relevant to a capability requirement. However, it does **not** constitute formal verification.
- **Verified Coverage (`VERIFIED_CAPABILITY`)**: Requires explicit independent verification status (`INDEPENDENTLY_VERIFIED`, `MEASURED`, `TESTED`) or documented evidence records (`evidenceIds`).
- **Epistemic Loss Accounting**: Unverified heuristic matches are recorded in `lossLog` with type `HEURISTIC_MATCH_ONLY`, forcing the stand solution validation status to `UNVERIFIED` rather than assuming false `COMPATIBLE`.

---

## 4. Trade-Offs

### Advantages:
- **Strict Epistemic Integrity**: Prevents agents from passing off heuristic associations as verified engineering proofs.
- **Principled Refusal**: Empowers agents to intentionally abstain from unnecessary or out-of-scope tool calls.
- **Traceable Provenance**: Every composed solution maintains a clear audit trail of verified facts vs inferences and gaps.

### Disadvantages:
- **Metacognitive Overhead**: Requires structured formalization steps before accepting composition results.
- **Requires Formalizable Fragments**: Cannot deterministically verify vague qualitative requirements without explicit ontological representation.
