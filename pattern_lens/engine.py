"""
PATTERN LENS v0.1 — Core Engine Facade
Pure Python Standard Library (Python 3.10+)

Инженерный принцип: «Сначала контракт, потом вес».
Гарантии:
- Нулевые внешние зависимости (только чистый Python 3.10+).
- Единый пайплайн: Query Parsing -> Match Filtering -> Constraint Auditing -> Evidence & Authorization -> Deterministic Ranking.
- Четкое разделение на рекомендованную и диагностическую выдачу.
"""

from typing import Optional, Dict, Any, Set, List
from .models import (
    SearchResult, Candidate, PatternRecord, EvidenceRecord,
    SearchEligibility, ApplicationAuthorization, ParsedQuery
)
from .adapter import PatternSourceAdapter
from .retrieval import parse_query, match_pattern
from .constraints import check_constraint
from .evidence import filter_pattern_evidence, evaluate_evidence_and_authorization
from .ranking import partition_and_rank_candidates


class PatternLensEngine:
    """Главный координатор поисково-аналитического движка PATTERN LENS."""

    def __init__(
        self,
        adapter: PatternSourceAdapter,
        index_version: str = "0.1.0"
    ):
        self.adapter = adapter
        self.index_version = index_version

    def search(
        self,
        query: str,
        requested_constraints: Optional[Dict[str, Any]] = None,
        declared_context: Optional[Dict[str, Any]] = None,
        inventory_is_complete: bool = False,
        target_claim_ids: Optional[Set[str]] = None
    ) -> SearchResult:
        """
        Выполняет полный детерминированный поиск паттернов по запросу агента.
        """
        # 1. Парсинг запроса
        parsed_query = parse_query(
            raw_query=query,
            requested_constraints=requested_constraints,
            declared_context=declared_context,
            inventory_is_complete=inventory_is_complete,
            target_claim_ids=target_claim_ids
        )

        all_patterns = self.adapter.get_patterns()
        all_evidence = self.adapter.get_evidence()

        candidates: List[Candidate] = []
        scanned_count = len(all_patterns)

        # 2. Фильтрация и сопоставление по уровням (Match Tiers)
        for pattern in all_patterns:
            is_match, match_tier, match_type, matched_tokens = match_pattern(pattern, parsed_query)
            if not is_match:
                continue

            # 3. Аудит ограничений (Constraints Check)
            constraint_results = [
                check_constraint(c, parsed_query)
                for c in pattern.constraints
            ]

            # 4. Аудит доказательств и авторизация (Evidence & Authorization)
            linked_ev = filter_pattern_evidence(pattern, all_evidence)
            (
                auth,
                eligibility,
                counts,
                has_verified_claim,
                unresolved_q,
                rejection_reasons
            ) = evaluate_evidence_and_authorization(
                pattern=pattern,
                linked_evidence=linked_ev,
                constraint_results=constraint_results,
                query=parsed_query
            )

            # Формируем кандидата
            unknown_constraints_count = sum(
                1 for cr in constraint_results if cr.verdict.value == "UNKNOWN"
            )

            candidate = Candidate(
                pattern=pattern,
                match_type=match_type,
                match_tier=match_tier,
                matched_tokens=matched_tokens,
                constraint_results=constraint_results,
                search_eligibility=eligibility,
                application_authorization=auth,
                passed_evidence_count=counts["passed"],
                failed_evidence_count=counts["failed"],
                critical_evidence_failed=counts["critical_failed"],
                stale_evidence_count=counts["stale"],
                inconclusive_evidence_count=counts["inconclusive"],
                unexecuted_evidence_count=counts["unexecuted"],
                unknown_constraints_count=unknown_constraints_count,
                has_verified_claim_for_intent=has_verified_claim,
                linked_evidence=linked_ev,
                unresolved_questions=unresolved_q,
                match_reasons=[f"Tier {match_tier}: {match_type} ({', '.join(matched_tokens)})"] if matched_tokens else [f"Tier {match_tier}: {match_type}"]
            )
            candidates.append(candidate)

        # 5. Детерминированное разделение и ранжирование
        recommended, diagnostic = partition_and_rank_candidates(candidates)

        # 6. Определение общего статуса поиска
        if not candidates:
            search_status = "NO_MATCH"
        elif not recommended and diagnostic:
            search_status = "ALL_CANDIDATES_EXCLUDED"
        else:
            search_status = "MATCH_FOUND"

        # 7. Формирование ограничений и оговорок (Limitations)
        limitations: List[str] = []
        if any(r.application_authorization == ApplicationAuthorization.CONDITIONAL for r in recommended):
            limitations.append(
                "Часть рекомендуемых паттернов имеет статус CONDITIONAL и требует подтверждения оператором перед применением."
            )
        if any(r.unknown_constraints_count > 0 for r in recommended):
            limitations.append(
                "Некоторые параметры стенда не были указаны в запросе и требуют ручной валидации на совместимость."
            )

        telemetry = {
            "scanned_patterns_count": scanned_count,
            "evaluated_candidates_count": len(candidates),
            "recommended_count": len(recommended),
            "diagnostic_count": len(diagnostic),
            "inventory_is_complete": parsed_query.inventory_is_complete
        }

        return SearchResult(
            query_raw=query,
            search_status=search_status,
            recommended_candidates=recommended,
            diagnostic_candidates=diagnostic,
            limitations=limitations,
            index_version=self.index_version,
            telemetry=telemetry
        )

    def diagnose_pattern(
        self,
        pattern_id: str,
        requested_constraints: Optional[Dict[str, Any]] = None,
        declared_context: Optional[Dict[str, Any]] = None,
        inventory_is_complete: bool = False
    ) -> Dict[str, Any]:
        """
        Детальная диагностика конкретного паттерна по идентификатору.
        """
        all_patterns = {p.pattern_id: p for p in self.adapter.get_patterns()}
        if pattern_id not in all_patterns:
            return {"error": f"Паттерн '{pattern_id}' не найден в репозитории"}

        pattern = all_patterns[pattern_id]
        parsed_query = parse_query(
            raw_query=f"explicit:{pattern_id}",
            requested_constraints=requested_constraints,
            declared_context=declared_context,
            inventory_is_complete=inventory_is_complete
        )

        constraint_results = [
            check_constraint(c, parsed_query)
            for c in pattern.constraints
        ]

        linked_ev = filter_pattern_evidence(pattern, self.adapter.get_evidence())
        (
            auth,
            eligibility,
            counts,
            has_verified_claim,
            unresolved_q,
            rejection_reasons
        ) = evaluate_evidence_and_authorization(
            pattern=pattern,
            linked_evidence=linked_ev,
            constraint_results=constraint_results,
            query=parsed_query
        )

        return {
            "pattern_id": pattern.pattern_id,
            "name": pattern.name,
            "version": pattern.version,
            "lifecycle_status": pattern.lifecycle_status.value,
            "application_authorization": auth.value,
            "search_eligibility": eligibility.value,
            "evidence_counts": counts,
            "constraint_results": [
                {
                    "constraint_id": cr.constraint_id,
                    "subject": cr.subject,
                    "severity": cr.severity.value,
                    "verdict": cr.verdict.value,
                    "explanation": cr.explanation,
                    "flags": cr.flags
                }
                for cr in constraint_results
            ],
            "unresolved_questions": unresolved_q,
            "rejection_reasons": rejection_reasons
        }
