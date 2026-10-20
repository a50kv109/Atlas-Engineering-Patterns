# Master Glossary - Canonical Equivalence Vector Registry

**Classification:** REFERENCE_DOCUMENT  
**Version:** 2.0  
**Protocol:** AAM-V2_ARTSYBASHEV  
**Last Updated:** 2026-07-04

---

## 📖 Overview

This document serves as the central registry for all **Canonical Equivalence Vectors (CEV)** used across all language kernels in the AAM-Language-Kernels repository.

Each CEV maps a single semantic concept across multiple languages while preserving physical causality and engineering meaning.

---

## 🏗️ CEV Structure

```yaml
CEV::ID-[DOMAIN]-[NUMBER]
  Term: [Primary concept]
  Definition: [Physical meaning in engineering context]
  Domain: [DOMAIN_NAME]
  SOL_Tag: [SOURCE | CONSTRAINT | DISSIPATE]
  Translations:
    EN: [English] (ISO/DIN/GB/ГОСТ)
    FR: [French] (ISO/DIN/GB/ГОСТ)
    DE: [German] (ISO/DIN/GB/ГОСТ)
    RU: [Russian] (ISO/DIN/GB/ГОСТ)
    ZH: [Chinese] (ISO/DIN/GB/ГОСТ)
    UK: [Ukrainian] (ISO/DIN/GB/ГОСТ)
  Status: [✅ APPROVED | ⏳ IN_REVIEW | ❌ DEPRECATED]
  Polysemy_Risks: [List of language-specific ambiguities]
  TDI_Threshold: [Recommended maximum divergence]
```

---

## 📂 DOMAIN 1: Technical Drawing & Mechanical Design

### CEV::ID-TC-001
- **Term:** Activation Element
- **Definition:** A primary mechanical component that initiates a process chain through physical force transmission
- **SOL_Tag:** SOURCE
- **Translations:**
  - EN: Activation element (ISO 13715)
  - FR: Élément d'activation (ISO 13715)
  - DE: Aktivierungselement (DIN 5)
  - RU: Элемент активации (ГОСТ 2.301)
  - ZH: 激活元件 (GB/T 1000)
  - UK: Елемент активації (ГОСТ 1.5)
- **Status:** ✅ APPROVED
- **Polysemy_Risks:** "Activation" may mean electrical trigger in electronics domain
- **TDI_Threshold:** 0.20

### CEV::ID-TC-002
- **Term:** Thermal Constraint
- **Definition:** A boundary condition limiting heat transfer rate or temperature range in a system
- **SOL_Tag:** CONSTRAINT
- **Translations:**
  - EN: Thermal constraint (ISO 80000-5)
  - FR: Contrainte thermique (ISO 80000-5)
  - DE: Thermische Beschränkung (DIN 5)
  - RU: Тепловое ограничение (ГОСТ 1.5)
  - ZH: 热约束 (GB/T 1000)
  - UK: Теплове обмеження (ГОСТ 1.5)
- **Status:** ✅ APPROVED
- **Polysemy_Risks:** "Constraint" may imply restriction vs. physical law; clarify context
- **TDI_Threshold:** 0.25

### CEV::ID-TC-003
- **Term:** Energy Dissipation
- **Definition:** Process by which mechanical or thermal energy exits a system into surroundings
- **SOL_Tag:** DISSIPATE
- **Translations:**
  - EN: Energy dissipation (ISO 80000-2)
  - FR: Dissipation d'énergie (ISO 80000-2)
  - DE: Energiedissipation (DIN 5)
  - RU: Рассеяние энергии (ГОСТ 1.5)
  - ZH: 能量耗散 (GB/T 1000)
  - UK: Розсіяння енергії (ГОСТ 1.5)
- **Status:** ✅ APPROVED
- **Polysemy_Risks:** "Dissipation" in chemistry context (dissolution) vs. physics (energy loss)
- **TDI_Threshold:** 0.18

---

## 📂 DOMAIN 2: Control Systems & Automation

### CEV::ID-CS-001
- **Term:** Feedback Loop
- **Definition:** A closed causal chain where output state influences input through control mechanism
- **SOL_Tag:** SOURCE
- **Translations:**
  - EN: Feedback loop (ISO/IEC 61131)
  - FR: Boucle de rétroaction (ISO/IEC 61131)
  - DE: Rückkopplungsschleife (DIN 66001)
  - RU: Обратная связь (ГОСТ 15488)
  - ZH: 反馈回路 (GB/T 13502)
  - UK: Петля зворотного зв'язку (ГОСТ 15488)
- **Status:** ✅ APPROVED
- **Polysemy_Risks:** May conflate feedback with control signal
- **TDI_Threshold:** 0.22

---

## 🛠️ Adding New CEVs

To add a new CEV to this registry:

1. **Define the concept** — Physical meaning in engineering context
2. **Assign SOL-Tag** — SOURCE, CONSTRAINT, or DISSIPATE
3. **Translate to all languages** — Using appropriate standards
4. **Calculate TDI threshold** — Based on expected drift
5. **Document polysemy risks** — Known ambiguities per language
6. **Submit for review** — File PR with new CEV entry

---

## 📊 Registry Statistics

| Metric | Count |
|--------|-------|
| Total CEVs | 4 (baseline) |
| Languages | 6 (EN, FR, DE, RU, ZH, UK) |
| Domains | 2 (TC, CS) |
| Standards | 8+ (ISO, DIN, GB, ГОСТ, IEC) |

---

## ✅ Update Log

| Date | Change | Author |
|------|--------|--------|
| 2026-07-04 | Created baseline CEV registry with TC & CS domains | Repository Architect |

---

**Repository:** [AAM-Language-Kernels](https://github.com/a50kv109/AAM-Language-Kernels)  
**Authority:** MASTER_AXIS10_CONFIG.md  
**Next Review:** 2026-08-04
