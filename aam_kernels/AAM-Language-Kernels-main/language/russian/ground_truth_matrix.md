# Матрица истинности (Ground Truth Matrix): RU:07

## 🎯 СЕМАНТИЧЕСКОЕ СОПОСТАВЛЕНИЕ AXIS-10 (SOL-TAGS)

| Тэг SOL | Термин (RU) | Термин (EN) | Определение |
| :--- | :--- | :--- | :--- |
| `[S-001]` | **Система** | System | Набор взаимодействующих компонентов. |
| `[S-002]` | **Ядро** | Kernel | Центральная управляющая часть. |
| `[C-001]` | **Инвариантность** | Invariance | Свойство неизменности при измерениях. |
| `[D-001]` | **Отклонение** | Deviation | Разница между наблюдаемым и эталоном. |
| `SOL_ENG_08_001` | **Тех. системы** | Technical Systems | Сложные инженерные узлы и сборки. |
| `SOL_MED_09_001` | **Мед. техника** | Medical Equipment | Оборудование для диагностики и лечения. |
| `SOL_SPE_10_001` | **Автоматизация** | Automation | Системы автономного управления. |

---
*Примечание: Все леммы синхронизированы с английским эталоном (Golden Standard).*

## 🛡 CONSENSUS_PROTOCOL
```yaml
CONSENSUS_PROTOCOL:
  ON_CONFLICT: "LOG_EVENT_AND_REPORT"
  LOG_FORMAT: 
    STATUS: "CONFLICT_DETECTED"
    CANDIDATES: ["TAG_A", "TAG_B"]
    ACTION: "WAITING_FOR_ARCHITECT_REVIEW"
```
