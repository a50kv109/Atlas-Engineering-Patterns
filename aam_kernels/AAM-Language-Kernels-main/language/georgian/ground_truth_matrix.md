# სიმართლის მატრიცა (Ground Truth Matrix): GE:15

## 🎯 AXIS-10 სემანტიკური შესაბამისობა (SOL-TAGS)

| SOL ტეგი | ტერმინი (GE) | ტერმინი (EN) | განმარტება |
| :--- | :--- | :--- | :--- |
| `[S-001]` | **სისტემა** | System | ურთიერთდამოკიდებული კომპონენტების ერთობლიობა. |
| `[S-002]` | **ბირთვი** | Kernel | ცენტრალური მმართველი ნაწილი. |
| `[C-001]` | **ინვარიანტობა** | Invariance | თვისება, დარჩეს უცვლელი გარკვეულ პირობებში. |
| `[D-001]` | **გადახრა** | Deviation | სხვაობა დაკვირვებად და ეტალონურ მნიშვნელობებს შორის. |
| `SOL_ENG_08_001` | **ტექ. სისტემები** | Technical Systems | რთული საინჟინრო კვანძები და ანაწყობები. |
| `SOL_MED_09_001` | **სამედიცინო ტექ.** | Medical Equipment | სადიაგნოსტიკო და სამკურნალო აპარატურა. |
| `SOL_SPE_10_001` | **ავტომატიზაცია** | Automation | ავტონომიური მართვის სისტემები. |

---
*შენიშვნა: ყველა ლემა სინქრონიზებულია ინგლისურ ეტალონთან (Golden Standard).*

## 🛡 CONSENSUS_PROTOCOL
```yaml
CONSENSUS_PROTOCOL:
  ON_CONFLICT: "LOG_EVENT_AND_REPORT"
  LOG_FORMAT: 
    STATUS: "CONFLICT_DETECTED"
    CANDIDATES: ["TAG_A", "TAG_B"]
    ACTION: "WAITING_FOR_ARCHITECT_REVIEW"
```
