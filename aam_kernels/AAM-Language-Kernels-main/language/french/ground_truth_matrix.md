# Matrice de Vérité (Ground Truth Matrix) : FR:11

## 🎯 CARTOGRAPHIE SÉMANTIQUE AXIS-10 (SOL-TAGS)

| Tag SOL | Terme (FR) | Terme (EN) | Définition |
| :--- | :--- | :--- | :--- |
| `[S-001]` | **Système** | System | Un ensemble de composants interactifs. |
| `[S-002]` | **Noyau** | Kernel | Partie centrale de contrôle. |
| `[C-001]` | **Invariance** | Invariance | Propriété de rester inchangé. |
| `[D-001]` | **Déviation** | Deviation | Différence entre valeur observée et référence. |
| `SOL_ENG_08_001` | **Systèmes tech.** | Technical Systems | Ensembles d'ingénierie complexes. |
| `SOL_MED_09_001` | **Équip. médical** | Medical Equipment | Équipement de diagnostic et de soin. |
| `SOL_SPE_10_001` | **Automatisation** | Automation | Systèmes de contrôle autonome. |

---
*Note : Tous les lemmes sont synchronisés avec l'étalon anglais (Golden Standard).*

## 🛡 CONSENSUS_PROTOCOL
```yaml
CONSENSUS_PROTOCOL:
  ON_CONFLICT: "LOG_EVENT_AND_REPORT"
  LOG_FORMAT: 
    STATUS: "CONFLICT_DETECTED"
    CANDIDATES: ["TAG_A", "TAG_B"]
    ACTION: "WAITING_FOR_ARCHITECT_REVIEW"
```
