# Ground Truth Matrix — SOL-Tag Mapping (NO:14)

## Master Referansekobling
Dette dokumentet sikrer full semantisk kompatibilitet med DE:12 og IT:13 gjennom felles ontologiske identifikatorer.

| SOL-Tagg | Norsk Term (Bokmål) | Tysk Ekvivalent (DE:12) | Italiensk Ekvivalent (IT:13) | Akse |
| :--- | :--- | :--- | :--- | :--- |
| `SOL_ENG_08_001` | **Subsea-systemer** | Unterseesysteme | Sistemi sottomarini | 8 |
| `SOL_ENG_08_002` | **Offshor-teknologi** | Offshore-Technologie | Tecnologie offshore | 8 |
| `SOL_ENG_08_003` | **Prosessikkerhet** | Prozesssicherheit | Sicurezza di processo | 8 |
| `SOL_MED_09_001` | **Helse-teknologi** | Medizintechnik | Tecnologie sanitarie | 9 |
| `SOL_MED_09_002` | **Akuttmedisin** | Notfallmedizin | Medicina d'urgenza | 9 |
| `SOL_SPE_10_001` | **Maritim automasjon** | Maritime Automatisierung | Automazione marittima | 10 |
| `SOL_SPE_10_002` | **Bærekraftig teknologi** | Nachhaltige Technologie | Tecnologiske sostenibili | 10 |
| `[S-001]` | **System** | System | Sistema | 1 |
| `[S-002]` | **Kjerne** | Kern | Nucleo | 1 |
| `[C-001]` | **Invarians** | Invarianz | Invarianza | 1 |
| `[D-001]` | **Avvik** | Abweichung | Deviazione | 1 |

## 🛡 CONSENSUS_PROTOCOL
```yaml
CONSENSUS_PROTOCOL:
  ON_CONFLICT: "LOG_EVENT_AND_REPORT"
  LOG_FORMAT: 
    STATUS: "CONFLICT_DETECTED"
    CANDIDATES: ["TAG_A", "TAG_B"]
    ACTION: "WAITING_FOR_ARCHITECT_REVIEW"
```
