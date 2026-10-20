# 真值矩阵 (Ground Truth Matrix): ZH:09

## 🎯 AXIS-10 语义映射 (SOL-TAGS)

| SOL 标签 | 术语 (ZH) | 术语 (EN) | 定义 |
| :--- | :--- | :--- | :--- |
| `[S-001]` | **系统** | System | 一组相互作用的组件。 |
| `[S-002]` | **核心** | Kernel | 中央控制部分。 |
| `[C-001]` | **不变性** | Invariance | 测量条件下保持不变的特性。 |
| `[D-001]` | **偏差** | Deviation | 观察值与标准值之间的差异。 |
| `SOL_ENG_08_001` | **技术系统** | Technical Systems | 复杂的工程组件。 |
| `SOL_MED_09_001` | **医疗设备** | Medical Equipment | 用于诊断和治疗的设备。 |
| `SOL_SPE_10_001` | **自动化** | Automation | 自行控制系统。 |

---
*注：所有引理均与英文基准 (Golden Standard) 同步。*

## 🛡 CONSENSUS_PROTOCOL
```yaml
CONSENSUS_PROTOCOL:
  ON_CONFLICT: "LOG_EVENT_AND_REPORT"
  LOG_FORMAT: 
    STATUS: "CONFLICT_DETECTED"
    CANDIDATES: ["TAG_A", "TAG_B"]
    ACTION: "WAITING_FOR_ARCHITECT_REVIEW"
```
