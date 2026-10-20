"""
PATTERN LENS v0.1 — Evidence & Authorization Engine
Pure Python Standard Library (Python 3.10+)

Инженерный принцип: «Сначала контракт, потом вес».
Гарантии:
1. Версионирование доказательств: evidence.object_version == pattern.version.
   При несовпадении версий доказательство признается устаревшим (STALE),
   не даёт права на статус AUTHORIZED и переводит в CONDITIONAL.
2. Никакого угадывания через strict_safety_mode: серьезность обязательного
   требования берется явно из pattern.mandatory_claims[claim_id] (CRITICAL / MAJOR / MINOR).
3. Четкое разделение FAILED, NOT_EXECUTED, INCONCLUSIVE:
   - FAILED критического/основного тезиса -> DENIED, EXCLUDED.
   - NOT_EXECUTED и INCONCLUSIVE -> CONDITIONAL, ELIGIBLE_FOR_REVIEW (не сбой, но и не допуск).
   - PASSED с совпадением версии -> подтверждение тезиса.
"""

from typing import List, Dict, Optional, Set, Tuple
from .models import (
    PatternRecord, EvidenceRecord, EvidenceResult, EvidenceSeverity,
    ConstraintCheckResult, ConstraintVerdict, ConstraintSeverity,
    SearchEligibility, ApplicationAuthorization, Candidate, ParsedQuery
)


def filter_pattern_evidence(
    pattern: PatternRecord,
    all_evidence: List[EvidenceRecord]
) -> List[EvidenceRecord]:
    """Отбирает доказательства, относящиеся к данному паттерну."""
    pattern_id = pattern.pattern_id
    evidence_refs = set(pattern.evidence_refs)
    return [
        ev for ev in all_evidence
        if ev.linked_pattern_id == pattern_id or ev.evidence_id in evidence_refs
    ]


def evaluate_evidence_and_authorization(
    pattern: PatternRecord,
    linked_evidence: List[EvidenceRecord],
    constraint_results: List[ConstraintCheckResult],
    query: Optional[ParsedQuery] = None
) -> Tuple[
    ApplicationAuthorization,
    SearchEligibility,
    Dict[str, int],  # counts: passed, failed, critical_failed, stale, inconclusive, unexecuted
    bool,            # has_verified_claim_for_intent
    List[str],       # unresolved_questions
    List[str]        # rejection_reasons
]:
    """
    Полный детерминированный аудит доказательств и ограничений паттерна.
    Возвращает статус авторизации, допуск к поиску, счетчики и диагностику.
    """
    passed_count = 0
    failed_count = 0
    critical_failed_count = 0
    stale_count = 0
    inconclusive_count = 0
    unexecuted_count = 0
    
    unresolved_questions: List[str] = []
    rejection_reasons: List[str] = []
    has_verified_claim_for_intent = False

    target_claims: Set[str] = query.target_claim_ids if query else set()

    # 1. Индексация доказательств по claim_id
    evidence_by_claim: Dict[str, List[EvidenceRecord]] = {}
    for ev in linked_evidence:
        evidence_by_claim.setdefault(ev.claim_id, []).append(ev)

    # 2. Проверка доказательств на версионирование и результаты
    for ev in linked_evidence:
        # Проверка версии объекта (Evidence Versioning)
        is_version_match = (ev.object_version == pattern.version)
        if not is_version_match:
            stale_count += 1
            unresolved_questions.append(
                f"Свидетельство '{ev.evidence_id}' получено на версии '{ev.object_version}', "
                f"а текущая версия паттерна '{pattern.version}' (STALE_VERSION_MISMATCH)"
            )

        if ev.result == EvidenceResult.PASSED:
            if is_version_match:
                passed_count += 1
                if ev.claim_id in target_claims:
                    has_verified_claim_for_intent = True
            else:
                # Устаревшее доказательство не считается подтвержденным для текущей версии
                inconclusive_count += 1
        elif ev.result == EvidenceResult.FAILED:
            failed_count += 1
            if ev.severity == EvidenceSeverity.CRITICAL:
                critical_failed_count += 1
                rejection_reasons.append(
                    f"Критический провал свидетельства '{ev.evidence_id}' для тезиса '{ev.claim_id}': {ev.claim}"
                )
            elif ev.severity == EvidenceSeverity.MAJOR:
                rejection_reasons.append(
                    f"Провал основного свидетельства '{ev.evidence_id}' для тезиса '{ev.claim_id}': {ev.claim}"
                )
        elif ev.result == EvidenceResult.INCONCLUSIVE:
            inconclusive_count += 1
            unresolved_questions.append(
                f"Неопределенный результат свидетельства '{ev.evidence_id}' по тезису '{ev.claim_id}'"
            )
        elif ev.result == EvidenceResult.NOT_EXECUTED:
            unexecuted_count += 1
            unresolved_questions.append(
                f"Тест '{ev.evidence_id}' для тезиса '{ev.claim_id}' не был выполнен (NOT_EXECUTED)"
            )

    # 3. Аудит обязательных тезисов (Mandatory Claims Audit)
    # Явная строгость берется из словаря mandatory_claims: claim_id -> EvidenceSeverity
    unverified_mandatory_claims: List[str] = []
    failed_mandatory_claims: List[str] = []

    for claim_id, expected_severity in pattern.mandatory_claims.items():
        claim_evidences = evidence_by_claim.get(claim_id, [])
        if not claim_evidences:
            unverified_mandatory_claims.append(claim_id)
            unresolved_questions.append(
                f"Отсутствуют свидетельства для обязательного тезиса '{claim_id}' (severity={expected_severity.value})"
            )
            continue

        # Ищем хотя бы одно валидное подтверждение для совпадающей версии
        has_valid_passed = False
        has_failed = False
        has_critical_or_major_failed = False

        for ev in claim_evidences:
            if ev.result == EvidenceResult.FAILED:
                has_failed = True
                effective_sev = expected_severity if expected_severity else ev.severity
                if effective_sev in {EvidenceSeverity.CRITICAL, EvidenceSeverity.MAJOR}:
                    has_critical_or_major_failed = True
            elif ev.result == EvidenceResult.PASSED and ev.object_version == pattern.version:
                has_valid_passed = True

        if has_critical_or_major_failed:
            failed_mandatory_claims.append(claim_id)
            rejection_reasons.append(
                f"Обязательный тезис '{claim_id}' ПРОВАЛЕН со степенью {expected_severity.value}"
            )
        elif not has_valid_passed:
            unverified_mandatory_claims.append(claim_id)
            unresolved_questions.append(
                f"Обязательный тезис '{claim_id}' не имеет актуального PASSED-свидетельства"
            )

    # 4. Аудит ограничений (Hard Constraints Audit)
    safety_violated = False
    functional_violated = False
    info_violated = False
    has_unknown_constraints = False

    for cr in constraint_results:
        if cr.verdict == ConstraintVerdict.VIOLATED:
            if cr.severity == ConstraintSeverity.SAFETY:
                safety_violated = True
                rejection_reasons.append(f"Нарушено ограничение безопасности '{cr.subject}': {cr.explanation}")
            elif cr.severity == ConstraintSeverity.FUNCTIONAL:
                functional_violated = True
                rejection_reasons.append(f"Нарушено функциональное ограничение '{cr.subject}': {cr.explanation}")
            else:
                info_violated = True
                unresolved_questions.append(f"Не выполнено информационное ограничение '{cr.subject}'")
        elif cr.verdict == ConstraintVerdict.UNKNOWN:
            if cr.severity in {ConstraintSeverity.SAFETY, ConstraintSeverity.FUNCTIONAL}:
                has_unknown_constraints = True
                unresolved_questions.append(
                    f"Неизвестный статус для критического/функционального ограничения '{cr.subject}'"
                )

    # 5. Определение ApplicationAuthorization и SearchEligibility
    # Строгие правила:
    # DENIED / EXCLUDED если:
    # - Нарушено ограничение SAFETY или FUNCTIONAL
    # - Провалено критическое свидетельство (critical_failed_count > 0)
    # - Провален обязательный критический/основной тезис
    if safety_violated or functional_violated or critical_failed_count > 0 or failed_mandatory_claims:
        auth = ApplicationAuthorization.DENIED
        eligibility = SearchEligibility.EXCLUDED
    # CONDITIONAL / ELIGIBLE_FOR_REVIEW если:
    # - Есть неизвестные функциональные/защитные ограничения
    # - Есть непроверенные обязательные тезисы (NOT_EXECUTED, INCONCLUSIVE, MISSING, STALE)
    # - Есть устаревшие свидетельства (stale_count > 0)
    # - Есть информационные нарушения
    elif (has_unknown_constraints or
          unverified_mandatory_claims or
          stale_count > 0 or
          inconclusive_count > 0 or
          unexecuted_count > 0 or
          info_violated):
        auth = ApplicationAuthorization.CONDITIONAL
        eligibility = SearchEligibility.ELIGIBLE_FOR_REVIEW
    # AUTHORIZED / ELIGIBLE только при полной чистоте:
    # - Все ограничения SATISFIED или NOT_APPLICABLE
    # - Все обязательные тезисы PASSED на актуальной версии
    # - Ноль сбоев, ноль невыполненных обязательных тестов
    else:
        auth = ApplicationAuthorization.AUTHORIZED
        eligibility = SearchEligibility.ELIGIBLE

    counts = {
        "passed": passed_count,
        "failed": failed_count,
        "critical_failed": critical_failed_count,
        "stale": stale_count,
        "inconclusive": inconclusive_count,
        "unexecuted": unexecuted_count
    }

    return (
        auth,
        eligibility,
        counts,
        has_verified_claim_for_intent,
        unresolved_questions,
        rejection_reasons
    )
