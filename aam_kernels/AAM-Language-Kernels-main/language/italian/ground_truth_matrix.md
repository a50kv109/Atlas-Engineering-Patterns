# Matrice di Verità Fondamentale (Ground Truth Matrix): IT:13

## 🎯 MAPPATURA SEMANTICA AXIS-10 (SOL-TAGS)

| Lemma (IT) | Lemma (EN) | Tag SOL | Definizione Operativa | Affidabilità |
| :--- | :--- | :--- | :--- | :--- |
| `Sistema` | `System` | `[S-001]` | Insieme di componenti interagenti. | 1.00 |
| `Nucleo` | `Kernel` | `[S-002]` | Parte centrale di controllo (Kern). | 0.99 |
| `Invarianza` | `Invariance`| `[C-001]` | Proprietà di rimanere immutato. | 1.00 |
| `Deviazione` | `Deviation` | `[D-001]` | Scostamento dal riferimento SDT. | 0.98 |
| `Processo` | `Process` | `[P-001]` | Ciclo di esecuzione tecnica. | 1.00 |
| `Qualità` | `Quality` | `[QLT-001]` | Conformità agli standard (Asse 10). | 1.00 |
| `Ingegneria` | `Engineering` | `[E-001]` | Disciplina tecnica (Asse 8). | 1.00 |
| `Progettazione` | `Design` | `[D-010]` | Sintesi tra ingegneria e design. | 1.00 |
| `Tolleranza` | `Tolerance` | `[T-002]` | Deviazione massima consentita (UNI). | 0.98 |

---
*Nota: I lemmi sono sincronizzati con l'etallone inglese Golden Standard (EN:10).*

## 🛡 CONSENSUS_PROTOCOL
```yaml
CONSENSUS_PROTOCOL:
  ON_CONFLICT: "LOG_EVENT_AND_REPORT"
  LOG_FORMAT: 
    STATUS: "CONFLICT_DETECTED"
    CANDIDATES: ["TAG_A", "TAG_B"]
    ACTION: "WAITING_FOR_ARCHITECT_REVIEW"
```
