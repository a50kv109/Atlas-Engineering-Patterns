"""
PATTERN LENS × AAM-V2 — AAM Gateway v0 (Isolation & Passthrough Adapter)
Pure Python Standard Library (Python 3.10+)
"""

from dataclasses import dataclass, field
from typing import List, Dict, Set, Optional, Any
from enum import Enum
from .models import ParsedQuery, SearchResult, ApplicationAuthorization, SearchEligibility
from .retrieval import parse_query

class GatewayProcessingMode(str, Enum):
    PASSTHROUGH = "PASSTHROUGH"
    AAM_RUNTIME = "AAM_RUNTIME"

class InterpretationStatus(str, Enum):
    INTERPRETED = "INTERPRETED"
    FALLBACK_PASSTHROUGH = "FALLBACK_PASSTHROUGH"
    AAM_ERROR = "AAM_ERROR"
    NEEDS_CLARIFICATION = "NEEDS_CLARIFICATION"
    CONFLICT_DETECTED = "CONFLICT_DETECTED"
    UNSUPPORTED_DOMAIN = "UNSUPPORTED_DOMAIN"
    AAM_RUNTIME_UNAVAILABLE = "AAM_RUNTIME_UNAVAILABLE"

@dataclass(frozen=True)
class GatewayConfig:
    mode: GatewayProcessingMode = GatewayProcessingMode.PASSTHROUGH
    kernels_dir: Optional[str] = None
    strict_runtime_required: bool = False
    runtime_adapter: Optional[Any] = None

@dataclass(frozen=True)
class DisambiguatedTerm:
    concept_id: str
    canonical_term: str
    source_fragment: str
    sol_tag: Optional[str] = None
    standard_reference: Optional[str] = None
    tdi: Optional[float] = None
    polysemy_warning: Optional[str] = None

@dataclass
class SemanticInterpretationReport:
    status: InterpretationStatus
    source_language: str
    primary_intent: str
    is_fallback_mode: bool = False
    integrity_score: Optional[float] = None
    tensor_divergence: Optional[float] = None
    identified_concepts: List[DisambiguatedTerm] = field(default_factory=list)
    clarification_options: List[str] = field(default_factory=list)
    error_details: Optional[str] = None

@dataclass
class SemanticQueryDTO:
    raw_query: str
    source_language: str = "ru"
    declared_context: Dict[str, Any] = field(default_factory=dict)
    inventory_is_complete: bool = False
    interpretation: Optional[SemanticInterpretationReport] = None
    domain_tags: List[str] = field(default_factory=list)
    explicit_pattern_ids: List[str] = field(default_factory=list)
    requested_constraints: Dict[str, Any] = field(default_factory=dict)
    target_claim_ids: Set[str] = field(default_factory=set)

@dataclass
class GatewayResult:
    raw_query: str
    status: InterpretationStatus
    parsed_query: Optional[ParsedQuery] = None
    interpretation_report: Optional[SemanticInterpretationReport] = None
    search_result: Optional[SearchResult] = None
    error_message: Optional[str] = None

class AAMPatternGateway:
    """
    Минимальный шлюз интеграции между AAM-V2 и PATTERN LENS v0.
    """
    def __init__(
        self,
        pattern_engine: Optional[Any] = None,
        config: Optional[GatewayConfig] = None
    ):
        self.pattern_engine = pattern_engine
        self.config = config or GatewayConfig()

    def process_query(
        self,
        raw_query: str,
        requested_constraints: Optional[Dict[str, Any]] = None,
        declared_context: Optional[Dict[str, Any]] = None,
        inventory_is_complete: bool = False,
        target_claim_ids: Optional[Set[str]] = None,
        execute_search: bool = True
    ) -> GatewayResult:
        """
        Обрабатывает входящий запрос через шлюз, выполняя passthrough или AAM runtime вызов,
        и опционально запуская поиск через PatternLensEngine.
        """
        original_raw = raw_query if raw_query is not None else ""

        # Если запрошен режим AAM_RUNTIME
        if self.config.mode == GatewayProcessingMode.AAM_RUNTIME:
            if self.config.strict_runtime_required and not self.config.runtime_adapter:
                report = SemanticInterpretationReport(
                    status=InterpretationStatus.AAM_RUNTIME_UNAVAILABLE,
                    source_language="ru",
                    primary_intent=original_raw,
                    is_fallback_mode=False,
                    error_details="AAM runtime is required (strict_runtime_required=True) but not available."
                )
                return GatewayResult(
                    raw_query=original_raw,
                    status=InterpretationStatus.AAM_RUNTIME_UNAVAILABLE,
                    interpretation_report=report,
                    error_message="AAM runtime unavailable"
                )

            if self.config.runtime_adapter is not None:
                try:
                    report = self.config.runtime_adapter(
                        original_raw,
                        requested_constraints=requested_constraints,
                        declared_context=declared_context
                    )
                    if not isinstance(report, SemanticInterpretationReport):
                        raise TypeError("Runtime adapter must return a SemanticInterpretationReport")

                    blocking_statuses = {
                        InterpretationStatus.NEEDS_CLARIFICATION,
                        InterpretationStatus.CONFLICT_DETECTED,
                        InterpretationStatus.UNSUPPORTED_DOMAIN,
                        InterpretationStatus.AAM_ERROR,
                        InterpretationStatus.AAM_RUNTIME_UNAVAILABLE
                    }

                    search_res: Optional[SearchResult] = None
                    parsed: Optional[ParsedQuery] = None

                    if report.status not in blocking_statuses:
                        parsed = parse_query(
                            raw_query=original_raw,
                            requested_constraints=requested_constraints,
                            declared_context=declared_context,
                            inventory_is_complete=inventory_is_complete,
                            target_claim_ids=target_claim_ids
                        )
                        if execute_search and self.pattern_engine is not None:
                            search_res = self.pattern_engine.search(
                                query=original_raw,
                                requested_constraints=requested_constraints,
                                declared_context=declared_context,
                                inventory_is_complete=inventory_is_complete,
                                target_claim_ids=target_claim_ids
                            )

                    return GatewayResult(
                        raw_query=original_raw,
                        status=report.status,
                        parsed_query=parsed,
                        interpretation_report=report,
                        search_result=search_res,
                        error_message=report.error_details
                    )
                except Exception as e:
                    error_msg = str(e)
                    err_report = SemanticInterpretationReport(
                        status=InterpretationStatus.AAM_ERROR,
                        source_language="ru",
                        primary_intent=original_raw,
                        is_fallback_mode=False,
                        error_details=error_msg
                    )
                    return GatewayResult(
                        raw_query=original_raw,
                        status=InterpretationStatus.AAM_ERROR,
                        interpretation_report=err_report,
                        error_message=error_msg
                    )

        # Стандартный режим PASSTHROUGH (или когда нет runtime_adapter)
        try:
            parsed = parse_query(
                raw_query=original_raw,
                requested_constraints=requested_constraints,
                declared_context=declared_context,
                inventory_is_complete=inventory_is_complete,
                target_claim_ids=target_claim_ids
            )
            report = SemanticInterpretationReport(
                status=InterpretationStatus.FALLBACK_PASSTHROUGH,
                source_language="ru",
                primary_intent=parsed.normalized,
                is_fallback_mode=True,
                integrity_score=None,
                tensor_divergence=None
            )
            search_res: Optional[SearchResult] = None
            if execute_search and self.pattern_engine is not None:
                search_res = self.pattern_engine.search(
                    query=original_raw,
                    requested_constraints=requested_constraints,
                    declared_context=declared_context,
                    inventory_is_complete=inventory_is_complete,
                    target_claim_ids=target_claim_ids
                )
            return GatewayResult(
                raw_query=original_raw,
                status=InterpretationStatus.FALLBACK_PASSTHROUGH,
                parsed_query=parsed,
                interpretation_report=report,
                search_result=search_res
            )
        except Exception as e:
            error_msg = str(e)
            report = SemanticInterpretationReport(
                status=InterpretationStatus.AAM_ERROR,
                source_language="ru",
                primary_intent=original_raw,
                is_fallback_mode=False,
                error_details=error_msg
            )
            return GatewayResult(
                raw_query=original_raw,
                status=InterpretationStatus.AAM_ERROR,
                interpretation_report=report,
                error_message=error_msg
            )
