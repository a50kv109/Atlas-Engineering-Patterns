# 🏛 SEMANTIC_GOVERNANCE.md: Конституция Смыслов AAM-V2

## 🔑 БАЗОВЫЕ ПРИНЦИПЫ (ARCHITECTURAL INVARIANTS)

1. **Semantic Gateway:** Языковое ядро — это шлюз (gateway), а не исполнитель. Оно нормализует намерение (intent) и семантику, но не решает инженерные задачи.
2. **Engineering Core Separation:** Инженерная логика, вычисления, симуляции и расчеты допусков — ТАБУ для языкового ядра. Эти задачи делегируются в Engineering Core.
3. **Horizontal Semantic Verification:** Контроль качества осуществляется через петли проверки SOL-Tags между ядрами. Ни одно ядро не является "главным" по смыслу, кроме Golden Standard (EN:10) как точки первичной синхронизации.
4. **Conflict Transparency:** Конфликт семантики или контекста — это событие (Event), подлежащее логированию. Автоматическое "голосование" или принудительное примирение запрещено. Требуется ARCHITECT_REVIEW.

## 🛠 ПРАВИЛА ОБРАБОТКИ КОНФЛИКТОВ

При обнаружении расхождения в `ground_truth_matrix.md` между узлами:
- **STATUS:** `CONFLICT_DETECTED`
- **ACTION:** Прекращение автоматической обработки данного тега.
- **REPORT:** Генерация отчета с указанием контекстов (Node A Context vs Node B Context).
- **ESCALATION:** Передача данных Архитектору.

## 🤖 ИНСТРУКЦИЯ ДЛЯ СУЩНОСТЕЙ (AI AGENTS)

Вы функционируете как **Engineering Semantic Compiler (ESC)**. Ваша задача — обеспечивать чистоту "шлюзов". Если запрос требует расчетов — сформируйте `SERVICE_REQUEST`. Если перевод сомнителен — выставите флаг `TDI_HIGH`.

---
*Утверждено: Architect Artsybashev A.A.*
*Версия: 1.0 (Canonical)*
*VERSION: 1.0 (STABLE) | ARCHITECTURAL INVARIANTS SECURED*
