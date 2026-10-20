"""
PATTERN LENS v0.1 — Deterministic Ranking Engine
Pure Python Standard Library (Python 3.10+)

Инженерный принцип: «Сначала контракт, потом вес» (Contract First, Weights Later).
Никаких произвольных числовых весов (0.4 * text + 0.3 * tag) в версии 0.1.
Ранжирование строится исключительно на строгом лексикографическом порядке кортежей.

Гарантии:
1. Кандидаты с критическими сбоями (FAILED CRITICAL/MAJOR) или нарушенными
   ограничениями (VIOLATED SAFETY/FUNCTIONAL) безоговорочно исключаются
   из рекомендуемой выдачи и направляются в diagnostic_candidates (DENIED / EXCLUDED).
2. Рекомендуемые кандидаты упорядочиваются по четкому кортежу приоритетов:
   (tier, eligibility_order, auth_order, verified_claim_order, unknown_constraints, -matched_tokens, pattern_id).
3. Полный детерминизм и воспроизводимость: при равенстве признаков
   применяется алфавитный tie-breaker по pattern_id.
"""

from typing import List, Tuple, Dict, Any
from .models import (
    Candidate, RankedCandidate, DiagnosticCandidate,
    SearchEligibility, ApplicationAuthorization,
    SEARCH_ELIGIBILITY_PRIORITY, ConstraintVerdict
)


def _recommended_sort_key(c: Candidate) -> Tuple[Any, ...]:
    """
    Лексикографический ключ сортировки для рекомендуемой выдачи:
    1. match_tier: 0 (Explicit ID), 1 (Claim/Intent), 2 (Tag/Domain), 3 (Text Overlap).
    2. eligibility_order: 0 (ELIGIBLE) < 1 (ELIGIBLE_FOR_REVIEW).
    3. authorization_order: 0 (AUTHORIZED) < 1 (CONDITIONAL).
    4. verified_claim_order: 0 (имеет подтвержденный тезис для задачи) < 1 (не имеет).
    5. unknown_constraints_count: меньше неизвестных ограничений -> выше.
    6. -len(matched_tokens): больше совпавших ключевых токенов -> выше.
    7. pattern_id: строковый алфавитный тай-брейкер для 100% повторяемости.
    """
    eligibility_order = SEARCH_ELIGIBILITY_PRIORITY.get(c.search_eligibility, 99)
    auth_order = 0 if c.application_authorization == ApplicationAuthorization.AUTHORIZED else 1
    verified_claim_order = 0 if c.has_verified_claim_for_intent else 1
    matched_count = len(c.matched_tokens)

    return (
        c.match_tier,
        eligibility_order,
        auth_order,
        verified_claim_order,
        c.unknown_constraints_count,
        -matched_count,
        c.pattern.pattern_id
    )


def partition_and_rank_candidates(
    candidates: List[Candidate]
) -> Tuple[List[RankedCandidate], List[DiagnosticCandidate]]:
    """
    Разделяет кандидатов на рекомендуемых и диагностических,
    после чего ранжирует рекомендуемых по лексикографическому контракту.
    """
    recommended_raw: List[Candidate] = []
    diagnostic_list: List[DiagnosticCandidate] = []

    for c in candidates:
        is_excluded = (
            c.search_eligibility == SearchEligibility.EXCLUDED or
            c.application_authorization == ApplicationAuthorization.DENIED or
            c.critical_evidence_failed > 0
        )

        if is_excluded:
            # Собираем данные для диагностического списка
            violated_constraints: List[Dict[str, Any]] = []
            for cr in c.constraint_results:
                if cr.verdict == ConstraintVerdict.VIOLATED:
                    violated_constraints.append({
                        "constraint_id": cr.constraint_id,
                        "subject": cr.subject,
                        "severity": cr.severity.value,
                        "explanation": cr.explanation,
                        "flags": cr.flags
                    })

            failed_crit_ev: List[Dict[str, Any]] = []
            for ev in c.linked_evidence:
                if ev.result.value == "FAILED":
                    failed_crit_ev.append({
                        "evidence_id": ev.evidence_id,
                        "claim_id": ev.claim_id,
                        "severity": ev.severity.value,
                        "claim": ev.claim
                    })

            # Формируем причины отклонения
            reasons = list(c.unresolved_questions)
            if c.critical_evidence_failed > 0:
                reasons.append(f"Обнаружен провал критических свидетельств ({c.critical_evidence_failed})")
            if any(cr.verdict == ConstraintVerdict.VIOLATED for cr in c.constraint_results):
                reasons.append("Нарушены обязательные ограничения окружения")

            diagnostic_list.append(DiagnosticCandidate(
                pattern_id=c.pattern.pattern_id,
                name=c.pattern.name,
                rejection_reasons=reasons or ["Кандидат исключен политикой допуска"],
                application_authorization=c.application_authorization,
                search_eligibility=c.search_eligibility,
                violated_constraints=violated_constraints,
                failed_critical_evidence=failed_crit_ev
            ))
        else:
            recommended_raw.append(c)

    # Лексикографическая сортировка рекомендуемых
    recommended_sorted = sorted(recommended_raw, key=_recommended_sort_key)

    # Присвоение рангов и формирование RankedCandidate
    ranked_recommended: List[RankedCandidate] = []
    for idx, c in enumerate(recommended_sorted, start=1):
        ranked_recommended.append(RankedCandidate(
            pattern_id=c.pattern.pattern_id,
            name=c.pattern.name,
            rank=idx,
            match_type=c.match_type,
            match_tier=c.match_tier,
            matched_tokens=c.matched_tokens,
            search_eligibility=c.search_eligibility,
            application_authorization=c.application_authorization,
            passed_evidence_count=c.passed_evidence_count,
            failed_evidence_count=c.failed_evidence_count,
            critical_evidence_failed=c.critical_evidence_failed,
            unknown_constraints_count=c.unknown_constraints_count,
            has_verified_claim_for_intent=c.has_verified_claim_for_intent,
            constraint_results=c.constraint_results,
            linked_evidence=c.linked_evidence,
            unresolved_questions=c.unresolved_questions,
            match_reasons=c.match_reasons or [f"Tier {c.match_tier}: {c.match_type}"]
        ))

    return ranked_recommended, diagnostic_list
