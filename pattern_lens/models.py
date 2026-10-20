"""
PATTERN LENS v0.1 — Models and Data Contracts
Pure Python Standard Library (Python 3.10+)
"""

from dataclasses import dataclass, field
from typing import List, Dict, Optional, Any, Set
from enum import Enum


# ============ ENUMS ============

class LifecycleStatus(str, Enum):
    PROPOSED = "PROPOSED"
    SPECIFIED = "SPECIFIED"
    IMPLEMENTED = "IMPLEMENTED"
    TESTED = "TESTED"
    INDEPENDENTLY_VERIFIED = "INDEPENDENTLY_VERIFIED"
    DEPRECATED = "DEPRECATED"


class ConstraintVerdict(str, Enum):
    SATISFIED = "SATISFIED"          # Значение совместимо, предикат истинен
    VIOLATED = "VIOLATED"            # Значение совместимо, предикат ложен
    UNKNOWN = "UNKNOWN"              # Данные отсутствуют, type mismatch, неизвестный оператор
    NOT_APPLICABLE = "NOT_APPLICABLE"# Ограничение явно исключено контекстом запроса


class ConstraintSeverity(str, Enum):
    SAFETY = "SAFETY"                # Аварийная защита, физическая безопасность
    FUNCTIONAL = "FUNCTIONAL"        # Аппаратные ресурсы, протоколы, разрядность
    INFORMATIONAL = "INFORMATIONAL"  # Рекомендации по оформлению, предпочтения


class EvidenceResult(str, Enum):
    PASSED = "PASSED"
    FAILED = "FAILED"
    INCONCLUSIVE = "INCONCLUSIVE"
    NOT_EXECUTED = "NOT_EXECUTED"


class EvidenceSeverity(str, Enum):
    CRITICAL = "CRITICAL"            # Провал блокирует применение (DENIED)
    MAJOR = "MAJOR"                  # Провал блокирует применение при обязательности (DENIED)
    MINOR = "MINOR"                  # Провал переводит в CONDITIONAL


class SearchEligibility(str, Enum):
    ELIGIBLE = "ELIGIBLE"                       # Допущен в рекомендуемую выдачу
    ELIGIBLE_FOR_REVIEW = "ELIGIBLE_FOR_REVIEW" # Допущен с флагом допроверки
    EXCLUDED = "EXCLUDED"                       # Исключён из рекомендуемой выдачи (в diagnostic)


class ApplicationAuthorization(str, Enum):
    AUTHORIZED = "AUTHORIZED"       # Применение разрешено
    CONDITIONAL = "CONDITIONAL"     # Требует обязательного подтверждения оператором
    DENIED = "DENIED"               # Применение категорически запрещено


# ============ ЯВНЫЕ ПРИОРИТЕТЫ (ВМЕСТО ЛЕКСИКОГРАФИИ СТРОК) ============

SEVERITY_PRIORITY: Dict[EvidenceSeverity, int] = {
    EvidenceSeverity.CRITICAL: 0,
    EvidenceSeverity.MAJOR: 1,
    EvidenceSeverity.MINOR: 2,
}

EVIDENCE_RESULT_PRIORITY: Dict[EvidenceResult, int] = {
    EvidenceResult.PASSED: 0,
    EvidenceResult.FAILED: 1,
    EvidenceResult.INCONCLUSIVE: 2,
    EvidenceResult.NOT_EXECUTED: 3,
}

SEARCH_ELIGIBILITY_PRIORITY: Dict[SearchEligibility, int] = {
    SearchEligibility.ELIGIBLE: 0,
    SearchEligibility.ELIGIBLE_FOR_REVIEW: 1,
    SearchEligibility.EXCLUDED: 2,
}


# ============ МОДЕЛИ ============

@dataclass(frozen=True)
class ConstraintRecord:
    """Универсальное ограничение (предикат над средой)."""
    constraint_id: str
    subject: str                    # Например: 'user_level', 'screens_count', 'voltage_max'
    operator: str                   # 'eq', 'neq', 'gte', 'lte', 'in', 'requires'
    value: Any                      # Значение порога или требование
    severity: ConstraintSeverity = ConstraintSeverity.FUNCTIONAL
    unit: Optional[str] = None      # Обязательная единица измерения ('GB', 'V', 'ms')
    evidence_ref: Optional[str] = None
    description: str = ""


@dataclass(frozen=True)
class RelationRecord:
    relation_type: str              # USES, REQUIRES, COMPOSES_WITH, CONFLICTS_WITH, ALTERNATIVE_TO
    target_id: str
    rationale: Optional[str] = None


@dataclass(frozen=True)
class EvidenceRecord:
    """Свидетельство проверки конкретного тезиса."""
    evidence_id: str
    claim_id: str                   # Идентификатор проверяемого тезиса
    claim: str                      # Текст утверждения
    method: str                     # 'AUTOMATED_UNIT_TEST', 'EMPIRICAL_STUDY', 'FORMAL_PROOF'
    object_version: str             # Версия объекта, на которой проводился тест
    result: EvidenceResult
    verifier: str = "unknown"
    timestamp: str = ""             # Целочисленный таймстамп или ISO строка
    linked_pattern_id: str = ""
    severity: EvidenceSeverity = EvidenceSeverity.MAJOR
    primary_artifact_ref: Optional[str] = None
    untested_boundaries: Optional[str] = None


@dataclass
class PatternRecord:
    """Универсальный инженерный паттерн."""
    pattern_id: str
    name: str
    intent: str
    description: str
    domain: str
    version: str = "1.0.0"
    lifecycle_status: LifecycleStatus = LifecycleStatus.PROPOSED
    tags: List[str] = field(default_factory=list)
    constraints: List[ConstraintRecord] = field(default_factory=list)
    relations: List[RelationRecord] = field(default_factory=list)
    implementation_refs: List[str] = field(default_factory=list)
    evidence_refs: List[str] = field(default_factory=list)
    source_refs: List[str] = field(default_factory=list)
    
    # Реестр обязательных утверждений с ЯВНОЙ серьезностью: claim_id -> EvidenceSeverity
    mandatory_claims: Dict[str, EvidenceSeverity] = field(default_factory=dict)
    
    # Для обратной совместимости, если передается списком
    mandatory_claim_ids: List[str] = field(default_factory=list)
    
    # Изолированное HMI-расширение для Atlas
    hmi_extension: Optional[Dict[str, Any]] = None

    def __post_init__(self):
        # Синхронизация mandatory_claim_ids и mandatory_claims
        if self.mandatory_claim_ids and not self.mandatory_claims:
            # Если переданы только ID без severity, задаем MAJOR по умолчанию
            self.mandatory_claims = {cid: EvidenceSeverity.MAJOR for cid in self.mandatory_claim_ids}
        elif self.mandatory_claims and not self.mandatory_claim_ids:
            self.mandatory_claim_ids = list(self.mandatory_claims.keys())


@dataclass
class ParsedQuery:
    raw: str
    normalized: str
    tokens: List[str]
    intent_tokens: List[str]
    tags: List[str]
    explicit_ids: List[str]
    requested_constraints: Dict[str, Any]
    target_claim_ids: Set[str] = field(default_factory=set)
    declared_context: Dict[str, Any] = field(default_factory=dict)
    inventory_is_complete: bool = False


@dataclass
class ConstraintCheckResult:
    constraint_id: str
    subject: str
    severity: ConstraintSeverity
    verdict: ConstraintVerdict
    explanation: str
    flags: List[str] = field(default_factory=list)


@dataclass
class Candidate:
    pattern: PatternRecord
    match_type: str
    match_tier: int
    matched_tokens: List[str] = field(default_factory=list)
    constraint_results: List[ConstraintCheckResult] = field(default_factory=list)
    search_eligibility: SearchEligibility = SearchEligibility.ELIGIBLE_FOR_REVIEW
    application_authorization: ApplicationAuthorization = ApplicationAuthorization.CONDITIONAL
    passed_evidence_count: int = 0
    failed_evidence_count: int = 0
    critical_evidence_failed: int = 0
    stale_evidence_count: int = 0
    inconclusive_evidence_count: int = 0
    unexecuted_evidence_count: int = 0
    unknown_constraints_count: int = 0
    has_verified_claim_for_intent: bool = False
    linked_evidence: List[EvidenceRecord] = field(default_factory=list)
    unresolved_questions: List[str] = field(default_factory=list)
    match_reasons: List[str] = field(default_factory=list)


@dataclass
class RankedCandidate:
    pattern_id: str
    name: str
    rank: int
    match_type: str
    match_tier: int
    matched_tokens: List[str]
    search_eligibility: SearchEligibility
    application_authorization: ApplicationAuthorization
    passed_evidence_count: int
    failed_evidence_count: int
    critical_evidence_failed: int
    unknown_constraints_count: int
    has_verified_claim_for_intent: bool
    constraint_results: List[ConstraintCheckResult]
    linked_evidence: List[EvidenceRecord]
    unresolved_questions: List[str]
    match_reasons: List[str]


@dataclass
class DiagnosticCandidate:
    pattern_id: str
    name: str
    rejection_reasons: List[str]
    application_authorization: ApplicationAuthorization
    search_eligibility: SearchEligibility
    violated_constraints: List[Dict[str, Any]]
    failed_critical_evidence: List[Dict[str, Any]]


@dataclass
class SearchResult:
    query_raw: str
    search_status: str       # MATCH_FOUND, ALL_CANDIDATES_EXCLUDED, NO_MATCH, INSUFFICIENT_DATA, SOURCE_ERROR
    recommended_candidates: List[RankedCandidate]
    diagnostic_candidates: List[DiagnosticCandidate]
    limitations: List[str]
    index_version: str
    telemetry: Dict[str, Any]
