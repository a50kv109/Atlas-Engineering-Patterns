# Ground Truth Matrix: English Kernel (EN)

## 🎯 AXIS-10 SEMANTIC MAPPINGS

| Term | SOL-Tag | Definition (Canonical) | Reliability_Index | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `System` | `[S-001]` | A set of interacting or interdependent component parts forming a complex/intricate whole. | 1.00 | Base entity |
| `Kernel` | `[S-002]` | The central or most important part of something, enabling core functionality. | 0.99 | AAM-Structural |
| `Invariance` | `[C-001]` | Property of remaining unchanged regardless of changes in the conditions of measurement. | 1.00 | Verification focus |
| `Deviation` | `[D-001]` | Difference between the observed value and the reference value in SDT. | 0.98 | Error tracking |

---
*Note: This matrix serves as the primary semantic anchor for cross-language synchronization.*

## 🛡 CONSENSUS_PROTOCOL
```yaml
CONSENSUS_PROTOCOL:
  ON_CONFLICT: "LOG_EVENT_AND_REPORT"
  LOG_FORMAT: 
    STATUS: "CONFLICT_DETECTED"
    CANDIDATES: ["TAG_A", "TAG_B"]
    ACTION: "WAITING_FOR_ARCHITECT_REVIEW"
```
