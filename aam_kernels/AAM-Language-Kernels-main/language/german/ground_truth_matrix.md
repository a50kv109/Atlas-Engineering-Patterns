# Ground Truth Matrix: German Kernel (DE)

## 🎯 AXIS-10 SEMANTIC MAPPINGS (SOL-TAGS)

| Term (DE) | Term (EN) | SOL-Tag | Description | Reliability |
| :--- | :--- | :--- | :--- | :--- |
| `System` | `System` | `[S-001]` | Понятие системы как целого. | 1.00 |
| `Kern` | `Kernel` | `[C-001]` | Центральное ядро управления. | 0.99 |
| `Prozess` | `Process` | `[P-001]` | Динамический технический процесс. | 1.00 |
| `Sprache` | `Language` | `[L-001]` | Языковая среда реализации. | 1.00 |
| `Qualität` | `Quality` | `[QLT-001]` | Стандарт качества (ось 10). | 1.00 |
| `Ingenieurwesen` | `Engineering` | `[E-001]` | Инженерная дисциплина (ось 8). | 1.00 |
| `Medizintechnik` | `MedTech` | `[M-001]` | Медицинские технологии (ось 9). | 1.00 |
| `Abweichung` | `Deviation` | `[D-001]` | Отклонение в рамках SDT/AAM. | 0.98 |

---
*Note: Technical terms are anchored to DIN/ISO semantic vectors.*

## 🛡 CONSENSUS_PROTOCOL
```yaml
CONSENSUS_PROTOCOL:
  ON_CONFLICT: "LOG_EVENT_AND_REPORT"
  LOG_FORMAT: 
    STATUS: "CONFLICT_DETECTED"
    CANDIDATES: ["TAG_A", "TAG_B"]
    ACTION: "WAITING_FOR_ARCHITECT_REVIEW"
```
