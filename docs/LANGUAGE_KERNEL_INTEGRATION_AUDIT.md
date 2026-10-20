# PATTERN LENS × AAM-V2 — Integration Contract Review & Architectural Audit

**Документ:** `docs/LANGUAGE_KERNEL_INTEGRATION_AUDIT.md`  
**Дата актуализации:** 2026-10-20  
**Статус:** `SPECIFICATION & CONTRACT REFINED — READY FOR EXTERNAL REVIEW`  
**Примечание о статусе аудита:** Настоящий документ подготовлен инженерным агентом в рамках пред-интеграционного ревью и предназначен для последующего независимого внешнего инженерного ревью. Исходный код модулей PATTERN LENS и каталога AAM-Language-Kernels не модифицировался; реализация шлюза заморожена до утверждения контракта.  
**Ревизия источников:** AAM-V2 (файлы репозитория `AAM-Language-Kernels-main`), PATTERN LENS v0.1 (`pattern_lens/`).

---

## 1. Источниковедческая проверка положений по документам AAM-V2

Была проведена сплошная проверка файлов распакованного репозитория `AAM-Language-Kernels-main`. Ниже представлены точные ссылки на файлы, разделы, фактическое содержание нормативных определений и статус их верификации.

### Обозначения статусов:
- `[SOURCE-CONFIRMED]` — положение полностью подтверждено текстом нормативного документа или кодом в репозитории.
- `[PROPOSED]` — проектное решение, сформулированное для будущего контракта интеграции.
- `[NOT SPECIFIED]` — положение или механизм отсутствует в документации репозитория (не детализировано).
- `[TESTED]` — фактически выполнено и проверено автоматическими тестами.

| Положение | Файл-источник и точный раздел | Фактическое определение в источнике | Статус проверки и инженерная оценка |
| :--- | :--- | :--- | :--- |
| **AXIS-10 и роль ESC** | `MASTER_AXIS10_CONFIG.md`, раздел `## 🔧 ENGINEERING SEMANTIC COMPILER (ESC) PROTOCOL` (строки 31–55); `docs/ARCHITECTURE.md`, раздел `### ESC Protocol` | ESC определён как 3-шаговый трансляционный протокол: 1. Идентификация SOL-тегов (`SOURCE → CONSTRAINT → DISSIPATE`); 2. Проверка физической каузальности (Axis-8); 3. Контекстный маппинг в Master Glossary (`CEV::ID`). В `SEMANTIC_GOVERNANCE.md` (принцип 1) зафиксировано: «Языковое ядро — это шлюз, а не исполнитель. Оно нормализует намерение, но не решает инженерных задач». | `[SOURCE-CONFIRMED]` ESC является валидатором причинно-следственной цепочки при переводе и нормализации, а не инженерным решателем. |
| **CEV и нормализация к `eng:10`** | `MASTER_AXIS10_CONFIG.md`, раздел `### Standard Equivalence Vector (SEV)` (строки 92–114); `docs/GLOSSARY.md`, раздел `## 🏗️ CEV Structure`; `SEMANTIC_GOVERNANCE.md`, принцип 3 | CEV структурирован как `CEV::ID-[DOMAIN]-[NUMBER]`, содержащий физическое определение (`Definition`), домен, SOL-тег и переводы (EN, FR, DE, RU, ZH, UK) с привязкой к стандартам (ISO, DIN, GB, ГОСТ). В `SEMANTIC_GOVERNANCE.md` сказано: «Ни одно ядро не является 'главным' по смыслу, кроме Golden Standard (EN:10) как точки первичной синхронизации». В `docs/GLOSSARY.md` (строка 125) зафиксировано: `Total CEVs: 4 (baseline)` (TC-001, TC-002, TC-003, CS-001). | `[SOURCE-CONFIRMED]` `eng:10` служит **технической точкой первичной синхронизации** в топологии репозитория, но **не источником инженерной истины**. Каноническая сущность определяется ID понятий, физическим смыслом и стандартами. Базовый реестр CEV на текущий момент содержит ровно 4 эталонные записи. |
| **Смысл SOL-тегов SOURCE, CONSTRAINT, DISSIPATE** | `MASTER_AXIS10_CONFIG.md`, раздел `## 📋 SOL-TAG CLASSIFICATION` (строки 14–29); `docs/GLOSSARY.md` | - **SOURCE:** Инициирующее действие или элемент; начало каузальной цепи («Fuel injector activates», «Элемент активации»). Должно предшествовать CONSTRAINT.<br>- **CONSTRAINT:** Граничное условие или ограничение; определяет пространство допустимых состояний («Pressure < 100 bar», «Тепловое ограничение»). Связывает SOURCE и DISSIPATE.<br>- **DISSIPATE:** Выход энергии/информации; завершение каузальной цепи («Heat dissipates to environment», «Рассеяние энергии»). | `[SOURCE-CONFIRMED]` SOL-теги описывают исключительно **физическую каузальность** в термодинамических и динамических системах. Они не являются мета-тегами поискового запроса агента. |
| **Формула Integrity Score (IS) и порог 0.85** | `MASTER_AXIS10_CONFIG.md`, раздел `## 📊 INTEGRITY SCORE CALCULATION` (строки 57–81); `docs/AXIS10_GUIDE.md`, раздел `## 🔧 Key Metrics` | Формула:<br>`IS = (Semantic_Fidelity × 0.5) + (Causality_Preservation × 0.3) + (Standard_Equivalence × 0.2)`<br>где `Semantic_Fidelity` — близость векторов ∈ [0, 1]; `Causality_Preservation` = 1 (если цепь валидна) или 0; `Standard_Equivalence` — доля совпадений стандартов ISO/DIN/ГОСТ.<br>Градация: $\ge 0.95$ EXCELLENT, $0.85 \le IS < 0.95$ ACCEPTABLE, $0.70 \le IS < 0.85$ REQUIRES_REVISION, $< 0.70$ INVALID. | `[SOURCE-CONFIRMED]` для концептуальной формулы. Порог 0.85 гарантирует сохранение физической цепочки (0.3) и стандартов (0.2). **Однако IS измеряет исключительно качество перевода и топологии текста, а не применимость паттерна.**<br>⚠️ `[NOT SPECIFIED]` — математическая реализация вычисления эмбеддингов векторов `Semantic_Fidelity` в кодовой базе AAM отсутствует (в архиве нет исполняемого кода, только Markdown). |
| **Определение и использование TDI** | `MASTER_AXIS10_CONFIG.md`, раздел `## 🎛️ TENSOR DIVERGENCE INDEX (TDI)` (строки 83–105); `language/master/AXIS10_FULL_TEMPLATE.md` | Формула:<br>`TDI = ||SourceTensor - TranslatedTensor|| / ||SourceTensor|| × Polysemy_Weight(target_language)`<br>Пороги: $\le 0.15$ STABLE, $0.15 < TDI \le 0.35$ MINOR_DRIFT, $0.35 < TDI \le 0.60$ MAJOR_DRIFT, $> 0.60$ CRITICAL_DIVERGENCE. | `[SOURCE-CONFIRMED]` Автоматическая метрика обнаружения смыслового дрейфа и полисемии.<br>⚠️ `[NOT SPECIFIED]` — численные значения коэффициентов `Polysemy_Weight` для языков и механизм расчёта тензорных норм в коде AAM не реализованы. |
| **Исполняемый код AAM-V2** | Корень `AAM-Language-Kernels-main/` | В архиве присутствуют файлы `.md` и скрипт `.cleanup.sh`. Файлы `.py`, `.ts` или иные исполняемые модули отсутствуют. | `[SOURCE-CONFIRMED]` Репозиторий AAM-V2 в текущем виде представляет собой **декларативную спецификацию, шаблоны и глоссарии**, а не готовый исполняемый сервис. |

---

## 2. Исправление концептуальных неоднозначностей проекта интеграции

### 2.1. Устранение ложного отождествления DISSIPATE с целями поиска или тезисами `[PROPOSED]`
- **Ошибка предшествующего наброска:** Отождествление `DISSIPATE → target_claim_ids / goals` являлось категорической ошибкой. В физике диссипация — это рассеяние энергии или информационный сток. В поисковом запросе агента цель («найти пошаговый интерфейс студенческого эксперимента») вообще не связана с термодинамической диссипацией.
- **Типизированное правило:**
  1. Если в запросе действительно описан физический процесс и выявлен тег `DISSIPATE`, он маппируется в предикаты физических ограничений `requested_constraints["dissipation"]` или характеристики среды.
  2. Инженерная цель запроса (`primary_intent`) извлекается из глагольно-целевой группы запроса.
  3. Идентификаторы проверяемых утверждений (`target_claim_ids`) извлекаются только при наличии явных ссылок на проверяемые свойства (`claim:...`, `req:...`) или при совпадении с реестром утверждений, но **никогда** не связываются с `DISSIPATE` по умолчанию.
  4. Если запрос архитектурный, алгоритмический или HMI, цепочка SOL помечается как `NOT_APPLICABLE` и не форсируется искусственно.

### 2.2. Запрет приравнивания семантической целостности к применимости паттерна `[SOURCE-CONFIRMED]`
- Высокий `Integrity Score (IS ≥ 0.85)` и низкий `TDI ≤ 0.35` означают лишь одно: **намерение пользователя сформулировано понятно, терминологически непротиворечиво и точно переведено**.
- Применимость паттерна (`ApplicationAuthorization`) в PATTERN LENS определяется **исключительно**:
  1. Выполнением жестких ограничений окружения (`ConstraintVerdict.SATISFIED`);
  2. Наличием и валидностью доказательств актуальной версии (`EvidenceRecord`, `object_version == pattern.version`);
  3. Отсутствием провалов по обязательным тезисам (`mandatory_claims`).
- **Инвариант безопасности:** Никакой семантический скор не может повысить статус авторизации с `CONDITIONAL` до `AUTHORIZED` и не может компенсировать нарушение ограничений или нехватку доказательств.

### 2.3. Разделение языка представления и канонической идентичности `[SOURCE-CONFIRMED]`
- Английский язык (`eng:10`) — это транспортный слой и координатная сетка репозитория AAM.
- Каноническая идентичность инженерного понятия инвариантна к языку и задается четверкой:
  $$\text{ConceptIdentity} = \langle \text{CEV\_ID}, \text{Domain}, \text{StandardRef}, \text{PhysicalDefinition} \rangle$$
- Например, понятие «Тепловое ограничение» идентифицируется кодом `CEV::ID-TC-002` и стандартом `ISO 80000-5`, независимо от того, введено ли оно на русском, немецком или китайском языке.

### 2.4. Резервный режим (PASSTHROUGH) и изоляция отказов AAM `[PROPOSED]`
- **Семантика PASSTHROUGH:** Резервная обработка означает передачу сырого запроса напрямую в автономный движок Pattern Lens **без подтверждённой семантической нормализации AAM**.
- **Требования к резервному режиму:**
  1. В итоговом ответе обязательно проставляется флаг `is_fallback_mode = True` и статус `InterpretationStatus.FALLBACK_PASSTHROUGH`.
  2. Исходный текст запроса сохраняется в `raw_query` без модификаций.
  3. Недоступность, сбой или отсутствие данных AAM **ни при каких обстоятельствах не должны повышать уровень авторизации** кандидатов и **не должны превращать `UNKNOWN` в `SATISFIED`**.
  4. Аппаратный сбой AAM (ошибка парсинга, исключение) должен строго отличаться от штатной работы: `InterpretationStatus.AAM_ERROR` против `InterpretationStatus.FALLBACK_PASSTHROUGH` против `InterpretationStatus.INTERPRETED`.
  5. *Примечание о коде:* Текущий код `pattern_lens/` не содержит логики шлюза; данное поведение специфицируется для будущего модуля `aam_gateway.py`.

### 2.5. Межъязыковая эквивалентность намерения (Cross-Language Intent Parity) `[PROPOSED]`
- Тест эквивалентности двух запросов на разных языках **не имеет права** считаться пройденным только на основании того, что оба запроса вернули одинаковый `pattern_id`.
- Для признания эквивалентности проверяется согласованность полного кортежа:
  $$\text{Parity} = (\text{CEV\_IDs} \land \text{ExtractedConstraints} \land \text{DeclaredContext} \land \text{AmbiguityStatus} \land \text{PrimaryIntent})$$
- Если два запроса вернули один и тот же паттерн, но при этом извлекли разные ограничения или разный контекст, тест фиксирует **нарушение семантической эквивалентности**.

### 2.6. Обработка неоднозначности (`NEEDS_CLARIFICATION`) и конфликтов `[SOURCE-CONFIRMED]`
- В соответствии с `SEMANTIC_GOVERNANCE.md` (принцип 4 «Conflict Transparency»), при обнаружении расхождения контекстов или превышении порога полисемии ($TDI > 0.35$) запрещено принудительно угадывать смысл.
- Шлюз переходит в состояние `NEEDS_CLARIFICATION` и формирует структурированный запрос на уточнение пользователю/агенту, не передавая сомнительные ограничения в поисковый движок.

---

## 3. Спецификация контракта: типизированное DTO запроса и происхождение данных

Ниже представлена проектная спецификация структуры данных для будущего шлюза.

> **Статус реализации:** Данная структура является **проектной спецификацией для будущего адаптера (`[PROPOSED]`)**. Существующий в кодовой базе `pattern_lens/models.py` класс `ParsedQuery` остаётся стабильным базовым интерфейсом PATTERN LENS v0.1 и принимает уже нормализованные скалярные поля. Никакие новые поля не объявляются частью текущего API PATTERN LENS до их реализации в коде.

```python
from dataclasses import dataclass, field
from typing import List, Dict, Set, Optional, Any
from enum import Enum

class InterpretationStatus(str, Enum):
    INTERPRETED = "INTERPRETED"                     # Успешная семантическая нормализация AAM
    FALLBACK_PASSTHROUGH = "FALLBACK_PASSTHROUGH"   # Штатный резервный режим (без AAM-нормализации)
    AAM_ERROR = "AAM_ERROR"                         # Ошибка/исключение внутри языкового ядра
    NEEDS_CLARIFICATION = "NEEDS_CLARIFICATION"     # Полисемия / высокий TDI (> 0.35), требуется уточнение
    CONFLICT_DETECTED = "CONFLICT_DETECTED"         # Неразрешимый семантический конфликт
    UNSUPPORTED_DOMAIN = "UNSUPPORTED_DOMAIN"       # Терминология вне известных онтологий

@dataclass(frozen=True)
class DisambiguatedTerm:
    """
    Точный инженерный термин с фиксацией происхождения (Provenance).
    [PROPOSED DTO]
    """
    # Обязательные поля
    concept_id: str                      # CEV::ID (напр., 'CEV::ID-TC-002') или 'UNKNOWN'
    canonical_term: str                  # Каноническое наименование понятия
    source_fragment: str                 # Исходный точный фрагмент/подстрока запроса оператора
    
    # Опциональные поля происхождения (заполняются по мере доступности)
    sol_tag: Optional[str] = None               # SOURCE | CONSTRAINT | DISSIPATE | None
    standard_reference: Optional[str] = None    # ISO / DIN / ГОСТ / GB
    source_rule_or_glossary: Optional[str] = None # Ссылка на раздел глоссария или правило сопоставления
    kernel_version: Optional[str] = None        # Версия языкового ядра (напр., 'RU:07 v2.20')
    tdi: Optional[float] = None                 # Зафиксированный индекс тензорной дивергенции
    polysemy_warning: Optional[str] = None      # Предупреждение о полисемии

@dataclass
class SemanticInterpretationReport:
    """
    Полный эпистемический отчёт семантического слоя AAM-V2.
    [PROPOSED DTO]
    """
    status: InterpretationStatus
    source_language: str                        # 'ru', 'en', 'zh', etc.
    primary_intent: str                         # Нормализованная формулировка намерения
    is_fallback_mode: bool = False              # Флаг резервной обработки без AAM
    
    # Метрики AAM (None при FALLBACK_PASSTHROUGH или сбое метрик)
    integrity_score: Optional[float] = None     # IS ∈ [0.0, 1.0]
    tensor_divergence: Optional[float] = None   # TDI ∈ [0.0, ∞)
    
    # Происхождение и альтернативы
    identified_concepts: List[DisambiguatedTerm] = field(default_factory=list)
    alternative_hypotheses: List[str] = field(default_factory=list)
    selection_rationale: str = ""
    clarification_options: List[str] = field(default_factory=list)
    error_details: Optional[str] = None

@dataclass
class SemanticQueryDTO:
    """
    Контрактное DTO для передачи намерения от AAM Gateway в PATTERN LENS.
    [PROPOSED DTO]
    
    Инварианты:
    1. raw_query никогда не модифицируется и хранит оригинальный ввод оператора.
    2. Если interpretation.status != INTERPRETED и != FALLBACK_PASSTHROUGH, движок Pattern Lens
       НЕ производит поиск и авторизацию, а возвращает структурированный запрос уточнения.
    3. interpretation.integrity_score НИКОГДА не используется как фактор ранжирования или допуска.
    4. При is_fallback_mode == True результат помечается как предварительный без AAM-верификации.
    """
    # Первичные данные запроса (Обязательные)
    raw_query: str
    source_language: str
    declared_context: Dict[str, Any]
    inventory_is_complete: bool
    
    # Семантический слой (AAM-V2)
    interpretation: SemanticInterpretationReport
    
    # Проекция на поисковое ядро Pattern Lens
    tokens: List[str]
    intent_tokens: List[str]
    domain_tags: List[str]
    explicit_pattern_ids: List[str]
    requested_constraints: Dict[str, Any]
    target_claim_ids: Set[str] = field(default_factory=set)

    def validate_invariants(self) -> None:
        """Проверка инвариантов контракта перед передачей в ядро."""
        if not self.raw_query.strip():
            raise ValueError("raw_query cannot be empty")
        if self.interpretation.integrity_score is not None:
            if not (0.0 <= self.interpretation.integrity_score <= 1.0):
                raise ValueError("Integrity Score must be within [0.0, 1.0]")
        if self.interpretation.tensor_divergence is not None:
            if self.interpretation.tensor_divergence < 0.0:
                raise ValueError("TDI cannot be negative")
```

---

## 4. Разделение ответственности и состояний по 6 границам системы

В проектируемой архитектуре зоны ответственности строго изолированы. Каждое состояние принадлежит ровно одной подсистеме:

| Уровень | Подсистема | Входные данные | Состояния / Вердикты | Граница ответственности |
| :--- | :--- | :--- | :--- | :--- |
| **1. Языковая интерпретация** | **AAM Language Kernel** | Сырой текст на естественном языке (RU, EN, ZH и др.) | `LANGUAGE_DETECTED`, `LEXICAL_NORMALIZED`, `TOKENIZED` | Очистка от морфологии, токенизация, определение языка. `[SOURCE-CONFIRMED]` |
| **2. Инженерная семантика** | **AAM ESC & AXIS-10** | Лексические токены, контекст предметной области | `INTERPRETED`, `NEEDS_CLARIFICATION`, `CONFLICT_DETECTED`, `TDI_HIGH`, `FALLBACK_PASSTHROUGH`, `AAM_ERROR` | Поиск в `Master Glossary` (`CEV::ID`), проверка физической цепи, расчет $IS$ и $TDI$. **ЗАПРЕТ:** не решает инженерных задач! `[SOURCE-CONFIRMED]` |
| **3. Поиск (Retrieval)** | **Pattern Lens (`retrieval.py`)** | Токены намерения, теги, ID, предикаты | `Tier 0 (EXPLICIT_ID)`, `Tier 1 (INTENT/CLAIM)`, `Tier 2 (DOMAIN/TAGS)`, `Tier 3 (BROAD)` | Детерминированный многоуровневый отбор кандидатов из репозитория. `[TESTED: 20/20 unit tests]` |
| **4. Проверка ограничений** | **Pattern Lens (`constraints.py`)** | `ConstraintRecord`, `query_environment` | `SATISFIED`, `VIOLATED`, `UNKNOWN`, `NOT_APPLICABLE` | Оценка предикатов (`requires`, `numeric`, `in`, `units`). Отделение неполного инвентаря (`UNKNOWN`) от нарушения (`VIOLATED`). `[TESTED: 20/20 unit tests]` |
| **5. Оценка доказательств** | **Pattern Lens (`evidence.py`)** | `EvidenceRecord`, `mandatory_claims` | `PASSED`, `FAILED`, `NOT_EXECUTED`, `INCONCLUSIVE`, `STALE_VERSION` | Сверка версий (`object_version == pattern.version`), учет серьезности тезисов (`mandatory_claims`). `[TESTED: 20/20 unit tests]` |
| **6. Авторизация применения** | **Pattern Lens (`ranking.py` & `engine.py`)** | Вердикты ограничений и аудита доказательств | `AUTHORIZED`, `CONDITIONAL`, `DENIED`; выдача: `recommended` vs `diagnostic` | Лексикографический порядок («Сначала контракт, потом вес»). Полная изоляция от семантических скоров. `[TESTED: 20/20 unit tests]` |

---

## 5. План реализации отдельного адаптера и расширенная программа тестов

Реализация адаптера планируется как **внешнее расширение**, не затрагивающее автономный режим `pattern_lens`:

### 5.1. Архитектурная изоляция `[PROPOSED]`
1. **Автономный запуск Pattern Lens** работает напрямую (уже реализован и протестирован):
   ```python
   engine = PatternLensEngine(AtlasCanonicalAdapter())
   res = engine.search("pat-preview-validate-commit")
   ```
2. **Запуск через семантический шлюз** работает как внешний фасад:
   ```python
   gateway = AAMPatternGateway(engine, kernels_dir="/app/applet/aam_kernels")
   res = gateway.search_semantic("Нам нужен пошаговый мастер студенческого эксперимента")
   ```

### 5.2. Расширенная программа тестов интеграции (12 сценариев)

> **Статус программы тестов:** Все 12 сценариев ниже имеют статус **`[PROPOSED - NOT YET IMPLEMENTED/TESTED]`**. Ни один тест из этого списка не объявляется выполненным до фактической реализации шлюза и запуска тестового набора.

| № | Название теста | Входные данные и условия | Ожидаемый результат | Проверяемый инвариант безопасности |
| :- | :--- | :--- | :--- | :--- |
| **1** | `test_cross_language_intent_parity` | Запрос A (RU): «Пошаговый мастер студенческого эксперимента»<br>Запрос B (EN): «Guided student experiment stepper with phase validation» | Совпадение: 1. CEV ID; 2. Ограничений; 3. Контекста; 4. Статуса неоднозначности; 5. Выбранного паттерна `pat-guided-student-experiment-stepper`. | **Межъязыковая семантическая эквивалентность:** совпадение только `pattern_id` при расхождении ограничений или контекста бракует тест. |
| **2** | `test_polysemy_discrimination` | Омоним («ключ» шифрования vs гаечный ключ vs ключ-коммутатор) при отсутствии контекста. | Фиксация $TDI > 0.35$, отсечение нерелевантных доменов, переход в `NEEDS_CLARIFICATION`. | **Защита от семантического дрейфа:** запрет угадывания домена без контекста. |
| **3** | `test_ambiguous_query_needs_clarification` | Намеренно неполный запрос («сделай систему надежной») без граничных условий. | Статус `NEEDS_CLARIFICATION`, заполненный список `clarification_options`, поисковый движок не запускает допуск. | **Запрет домысливания:** отсутствие ограничений не превращается в произвольные предикаты. |
| **4** | `test_incomplete_inventory_preserves_unknown` | Запрос требует `hardware.can_capture`, но в инвентаре свойство не указано (`inventory_is_complete=False`). | Ограничение получает вердикт `UNKNOWN` (с флагом `incomplete_inventory`), авторизация — `CONDITIONAL`. | **Контракт неполноты:** неполные сведения никогда не превращаются в `SATISFIED`. |
| **5** | `test_semantic_conflict_detection` | Запрос с логически несовместимыми требованиями (например, взаимоисключающие SOL-теги). | Статус `CONFLICT_DETECTED`, событие логируется в аудит, автоматический допуск блокируется. | **Прозрачность конфликтов:** запрет автоматического примирения противоречий. |
| **6** | `test_graceful_passthrough_fallback` | Инициализация шлюза при отсутствии или отключении каталога `aam_kernels`. | Переход в `FALLBACK_PASSTHROUGH`, `is_fallback_mode = True`, запуск автономного поиска по сырому тексту, исключений нет. | **Отказоустойчивость:** автономный режим сохраняет полную работоспособность. |
| **7** | `test_distinguish_passthrough_from_error` | Случай A: штатное отключение AAM.<br>Случай B: синтаксическая ошибка/исключение парсера в AAM. | Случай A $\to$ `FALLBACK_PASSTHROUGH`.<br>Случай B $\to$ `AAM_ERROR` с сохранением `error_details` в отчёте. | **Различение состояний:** отказ подсистемы не маскируется под штатный резервный режим. |
| **8** | `test_high_is_cannot_upgrade_conditional` | Запрос с идеальным $IS = 1.0$, но с нарушенным ограничением или проваленным доказательством. | Паттерн получает `ApplicationAuthorization.DENIED` и исключается в `diagnostic_candidates`. | **Семантическая изоляция:** семантический скор не влияет на авторизацию и не повышает допуск. |
| **9** | `test_unknown_cev_id_handling` | Запрос содержит терминологию, отсутствующую в 4 базовых CEV Master Glossary. | Термин помечается `concept_id = "UNKNOWN"`, выставляется предупреждение, угадывание стандарта запрещено. | **Словарная честность:** отсутствие понятия в реестре не подменяется ложным маппингом. |
| **10** | `test_corrupted_aam_data_isolation` | Повреждённые файлы разметки (некорректный Markdown/JSON) внутри каталога языкового ядра. | Ошибка изолируется внутри шлюза, логируется `AAM_ERROR`, процесс не падает аварийно. | **Изоляция сбоев:** некорректные данные одного языка не ломают движок поиска. |
| **11** | `test_kernel_glossary_version_mismatch` | Версия паспорта ядра (`RU:07 v2.20`) не совпадает с версией Master Glossary (`v1.0`). | Фиксация флага риска `VERSION_MISMATCH` в `SemanticInterpretationReport`, требование ревизии. | **Версионная строгость:** предотвращение рассинхронизации стандартов. |
| **12** | `test_metric_calculation_failure_handling` | Ошибка вычисления формулы (деление на 0 при нулевой длине вектора или NaN). | Поля `integrity_score` и `tensor_divergence` выставляются в `None`, флаг `METRIC_UNAVAILABLE`. | **Арифметическая безопасность:** сбой численных метрик не блокирует обработку запроса. |

---

## 6. Перечень будущих изменений

Никаких изменений в существующий код `pattern_lens/` и `tests_pattern_lens/` до утверждения данного документа **не вносилось**.

Предстоящие шаги реализации (после подтверждения внешним рецензентом):
1. Создание отдельного модуля `pattern_lens/aam_gateway.py` с реализацией `AAMPatternGateway`, `SemanticQueryDTO` и состояний `InterpretationStatus`.
2. Создание набора тестов `tests_pattern_lens/test_aam_integration.py` по всем 12 сценариям из раздела 5.2.
3. Прогон тестов с фактической фиксацией результатов и публикацией отчёта выполнения.
