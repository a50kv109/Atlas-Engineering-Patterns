# AAM Language Kernel: French Core Entrypoint (AAM-V2)

**Version:** 2.0 (Upgraded from AAM-V1)  
**Language:** French  
**Code:** FR  
**Domain:** Domain 1 (Technical Drawing & Mechanical Design)  
**Configuration Status:** AXIS-10_COMPLIANT  
**Last Updated:** 2026-07-04

---

## 📌 Purpose

This index serves as the single entry point and navigation hub for the French language kernel package within the AAM-Language-Kernels repository. It describes the modular structure and reading sequence for all 14 documentation layers.

**Key Enhancement:** Now integrated with AXIS-10 (Translation & Interpretation Axis) for engineering semantic verification.

---

## 🗂️ Repository File Map

| File Name | Document Layer | Functional Purpose | AXIS-10 Integration |
|:---|:---|:---|:---|
| `INDEX.md` | Access Layer | Navigation manifest and reading graph | Entry point |
| `README.md` | Manifest Layer | French kernel overview and metrics | Baseline data |
| `STATUS.md` | Control Layer | Operational state monitoring dashboard | Real-time metrics |
| `CREDITS.md` | Attribution Layer | Authorship and citation rules | Metadata |
| `CHANGELOG.md` | History Layer | Version history and changes | Compliance tracking |
| `context.md` | Context Layer | Semantic boundaries and applicable standards | SOL-tag context |
| `passport.md` | Metadata Layer | **AXIS-10 CONFIG** - Technical passport with SOL-mapping | ⭐ PRIMARY |
| `audit_status.md` | Metric Layer | Readiness formulas and calculations | IS/TDI metrics |
| `evidence_inventory.md` | Evidence Layer | Registry of available evidence and sources | Validation data |
| `audit_execution_plan.md` | Plan Layer | Step-by-step roadmap for unlocking statuses | Implementation plan |
| `ground_truth_matrix.md` | Terminology Layer | **CEV REGISTRY** - Sterilized term traceability matrix | ⭐ PRIMARY |
| `semantic_risk_register.md` | Risk Layer | **TDI MONITORING** - Semantic drift zones and polysemy traps | ⭐ PRIMARY |
| `failure_modes.md` | Diagnostics Layer | Catalog of known AI configuration failures | Error handling |
| `benchmark_validation_pack.md` | Validation Layer | **ESC TEST SUITE** - Calibration tests and examples | ⭐ PRIMARY |

---

## 🔗 Repository Reading Sequence

For correct cognitive tracing of the kernel, study the documentation package in the following recommended order:

```
[INDEX.md] ──> [README.md] ──> [STATUS.md] ──> [CREDITS.md] ──> [CHANGELOG.md]
    │
    └──> [context.md] ──> [passport.md] ──> [audit_status.md]
            │
            └──> [evidence_inventory.md] ──> [audit_execution_plan.md]
                    │
                    └──> [ground_truth_matrix.md] ──> [semantic_risk_register.md]
                            │
                            └──> [failure_modes.md] ──> [benchmark_validation_pack.md]
```

---

## ⭐ AXIS-10 Integration Summary

**Three files are PRIMARY for AXIS-10 compliance:**

1. **passport.md** — Contains full `AXIS_10_CONFIG` block with:
   - ESC (Engineering Semantic Compiler) status
   - SOL-tag implementation status
   - Integrity Score targets and measurements
   - TDI (Tensor Divergence Index) monitoring
   - Standard Equivalence Vector (CEV) mappings

2. **ground_truth_matrix.md** — SOL-tag registry with:
   - All domain terms tagged with SOURCE/CONSTRAINT/DISSIPATE
   - CEV references (CEV::ID-DOMAIN-NUMBER)
   - Standard alignment (ISO/DIN/GB/GOST)

3. **benchmark_validation_pack.md** — ESC test suite with:
   - T-001: SOL-tag identification
   - T-002: Physical causality verification
   - T-003: Standard equivalence
   - Pass/fail criteria and Integrity Score calculation

---

## 📊 Quick Metrics

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| **Integrity Score (IS)** | ≥ 0.90 | 0.89 | ⏳ IN_PROGRESS |
| **TDI Index** | ≤ 0.35 | 0.22 | 🟢 STABLE |
| **CEV Coverage** | 100% | 75% | ⏳ IN_PROGRESS |
| **AXIS-10 Ready** | ✅ YES | ✅ YES | ✅ COMPLIANT |

---

## 🧠 AXIS-10 Core Principles (French Kernel)

### SOL-Tag System
- **[SOURCE::FR-001]** → Activation element (Élément d'activation)
- **[CONSTRAINT::FR-C-003]** → Thermal constraint (Contrainte thermique)
- **[DISSIPATE::FR-D-008]** → Energy dissipation (Dissipation d'énergie)

### ESC Verification Protocol
1. Identify SOL-tags in source text
2. Verify physical causality (Axis-8)
3. Map to Master Glossary (CEV lookup)
4. Calculate Integrity Score (IS ≥ 0.85)
5. Monitor TDI (Tensor Divergence Index ≤ 0.35)

### Standard Alignment
- **ISO 80000** (Quantities and units) — ✅ MAPPED
- **ISO 13715** (Technical drawing) — ✅ MAPPED
- **DIN 5** (Language standards) — ✅ MAPPED
- **GOST 1.5** (Standardization) — ⏳ IN_PROGRESS

---

## 📚 Related Documentation

- **Master Template:** [Master_Kernel_Template.md](../../../Master_Kernel_Template.md)
- **AXIS-10 Specification:** [MASTER_AXIS10_CONFIG.md](../../../MASTER_AXIS10_CONFIG.md)
- **Implementation Guide:** [docs/AXIS10_GUIDE.md](../../../docs/AXIS10_GUIDE.md)
- **Global Glossary:** [docs/GLOSSARY.md](../../../docs/GLOSSARY.md)
- **Architecture Overview:** [docs/ARCHITECTURE.md](../../../docs/ARCHITECTURE.md)

---

## ✅ Compliance Status

- ✅ AXIS-10 compliant
- ✅ SOL-tags implemented
- ✅ ESC protocol active
- ✅ TDI monitoring enabled
- ⏳ CEV registry in progress (target: 2026-07-11)
- ⏳ Full validation suite pending (target: 2026-07-18)

---

**Protocol Authority:** AAM-V2_ARTSYBASHEV  
**Kernel Status:** ACTIVE  
**Next Review:** 2026-07-11
