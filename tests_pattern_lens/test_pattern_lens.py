"""
PATTERN LENS v0.1 — Comprehensive Test Suite
Verification of all Architectural Contracts & Edge Cases
Pure Python unittest
"""

import unittest
import math
from typing import Dict, Any

from pattern_lens.models import (
    PatternRecord, EvidenceRecord, ConstraintRecord, RelationRecord,
    LifecycleStatus, ConstraintVerdict, ConstraintSeverity,
    EvidenceResult, EvidenceSeverity, SearchEligibility, ApplicationAuthorization
)
from pattern_lens.constraints import (
    eval_requires, eval_numeric_comparison, eval_in_comparison,
    extract_value_and_unit, check_constraint
)
from pattern_lens.evidence import (
    evaluate_evidence_and_authorization, filter_pattern_evidence
)
from pattern_lens.retrieval import parse_query, match_pattern
from pattern_lens.ranking import partition_and_rank_candidates
from pattern_lens.adapter import InMemoryPatternAdapter, AtlasCanonicalAdapter
from pattern_lens.engine import PatternLensEngine


class TestRequiresOperator(unittest.TestCase):
    """Тестирование оператора 'requires' и инвариантов инвентаря возможностей."""

    def test_strict_bool_handling(self):
        # bool проверяется строго до int
        verdict, flags = eval_requires("test", True)
        self.assertEqual(verdict, ConstraintVerdict.SATISFIED)

        verdict, flags = eval_requires("test", False)
        self.assertEqual(verdict, ConstraintVerdict.VIOLATED)

    def test_numbers_not_treated_as_boolean_flags(self):
        # Числа не должны трактоваться как флаги присутствия
        verdict, flags = eval_requires("test", 1)
        self.assertEqual(verdict, ConstraintVerdict.UNKNOWN)
        self.assertIn("numeric_value_not_a_flag", flags)

        verdict, flags = eval_requires("test", 0)
        self.assertEqual(verdict, ConstraintVerdict.UNKNOWN)
        self.assertIn("numeric_value_not_a_flag", flags)

    def test_string_statuses(self):
        for pos in ["enabled", "available", "present", "active", "true", "on", "yes"]:
            verdict, _ = eval_requires("feature", pos)
            self.assertEqual(verdict, ConstraintVerdict.SATISFIED)

        for neg in ["disabled", "unavailable", "absent", "inactive", "false", "off", "no"]:
            verdict, _ = eval_requires("feature", neg)
            self.assertEqual(verdict, ConstraintVerdict.VIOLATED)

        verdict, flags = eval_requires("feature", "some_unrecognized_mode")
        self.assertEqual(verdict, ConstraintVerdict.UNKNOWN)

    def test_collections_incomplete_vs_complete_inventory(self):
        collection = ["feature_a", "feature_b"]
        
        # Наличие в коллекции -> SATISFIED независимо от полноты
        verdict, _ = eval_requires("feature_a", collection, inventory_is_complete=False)
        self.assertEqual(verdict, ConstraintVerdict.SATISFIED)

        # Отсутствие в неполном инвентаре -> UNKNOWN
        verdict, flags = eval_requires("feature_c", collection, inventory_is_complete=False)
        self.assertEqual(verdict, ConstraintVerdict.UNKNOWN)
        self.assertIn("incomplete_inventory", flags)

        # Отсутствие при гарантированно полном инвентаре -> VIOLATED
        verdict, flags = eval_requires("feature_c", collection, inventory_is_complete=True)
        self.assertEqual(verdict, ConstraintVerdict.VIOLATED)
        self.assertTrue(any("required_capability_absent" in f for f in flags))

    def test_nested_dictionary_and_incomplete_inventory(self):
        env = {
            "gpu": {
                "webgl": True,
                "driver": "present",
                "experimental": "disabled"
            },
            "network": "active"
        }

        # Прямой ключ в словаре
        verdict, _ = eval_requires("network", env, inventory_is_complete=False)
        self.assertEqual(verdict, ConstraintVerdict.SATISFIED)

        # Составной точечный путь к вложенному словарю
        verdict, _ = eval_requires("gpu.webgl", env, inventory_is_complete=False)
        self.assertEqual(verdict, ConstraintVerdict.SATISFIED)

        verdict, _ = eval_requires("gpu.experimental", env, inventory_is_complete=False)
        self.assertEqual(verdict, ConstraintVerdict.VIOLATED)

        # Отсутствующий ключ при неполном инвентаре -> UNKNOWN
        verdict, flags = eval_requires("sensor_calibrated", env, inventory_is_complete=False)
        self.assertEqual(verdict, ConstraintVerdict.UNKNOWN)
        self.assertIn("incomplete_inventory", flags)

        # Отсутствующий ключ при полном инвентаре -> VIOLATED
        verdict, flags = eval_requires("sensor_calibrated", env, inventory_is_complete=True)
        self.assertEqual(verdict, ConstraintVerdict.VIOLATED)

    def test_structured_dict_requirement_recursion_without_substituting_true(self):
        # pattern_requirement — словарь требований
        structured_req = {
            "webgl": True,
            "antialias": "enabled"
        }
        env = {
            "webgl": True,
            "antialias": "enabled",
            "extra_param": 100
        }
        # Все свойства удовлетворены -> SATISFIED
        verdict, _ = eval_requires(structured_req, env, inventory_is_complete=False)
        self.assertEqual(verdict, ConstraintVerdict.SATISFIED)

        # Одно свойство нарушено -> VIOLATED
        bad_env = {
            "webgl": True,
            "antialias": "disabled"
        }
        verdict, _ = eval_requires(structured_req, bad_env, inventory_is_complete=False)
        self.assertEqual(verdict, ConstraintVerdict.VIOLATED)

        # Одно свойство отсутствует в неполном инвентаре -> UNKNOWN
        missing_env = {
            "webgl": True
        }
        verdict, flags = eval_requires(structured_req, missing_env, inventory_is_complete=False)
        self.assertEqual(verdict, ConstraintVerdict.UNKNOWN)

        # Одно свойство отсутствует в полном инвентаре -> VIOLATED
        verdict, flags = eval_requires(structured_req, missing_env, inventory_is_complete=True)
        self.assertEqual(verdict, ConstraintVerdict.VIOLATED)


class TestNumericAndUnitComparisons(unittest.TestCase):
    """Тестирование числовых сравнений и строгости единиц измерения."""

    def test_extract_value_and_unit(self):
        val, unit = extract_value_and_unit({"value": 16, "unit": "GB"})
        self.assertEqual(val, 16)
        self.assertEqual(unit, "GB")

        val, unit = extract_value_and_unit((200, "ms"))
        self.assertEqual(val, 200)
        self.assertEqual(unit, "ms")

        val, unit = extract_value_and_unit(42)
        self.assertEqual(val, 42)
        self.assertIsNone(unit)

    def test_reject_boolean_in_numeric_fields(self):
        # Boolean внутри словаря или кортежа не должен проходить за число
        verdict, flags = eval_numeric_comparison("gte", 10, {"value": True})
        self.assertEqual(verdict, ConstraintVerdict.UNKNOWN)
        self.assertIn("boolean_cannot_be_numeric", flags)

    def test_nan_and_inf_protection(self):
        verdict, flags = eval_numeric_comparison("gte", float("nan"), 10)
        self.assertEqual(verdict, ConstraintVerdict.UNKNOWN)
        self.assertIn("non_finite_numeric_value", flags)

        verdict, flags = eval_numeric_comparison("lte", 10, float("inf"))
        self.assertEqual(verdict, ConstraintVerdict.UNKNOWN)
        self.assertIn("non_finite_numeric_value", flags)

    def test_unit_mismatch(self):
        # Расхождение единиц измерения без автоконвертации в v0.1
        verdict, flags = eval_numeric_comparison(
            operator="gte",
            pattern_threshold={"value": 1000, "unit": "ms"},
            query_environment={"value": 1, "unit": "s"},
            unit_required="ms"
        )
        self.assertEqual(verdict, ConstraintVerdict.UNKNOWN)
        self.assertTrue(any("unit_mismatch" in f for f in flags))

    def test_numeric_comparison_direction(self):
        # query >= pattern_threshold
        # Если стенд имеет 16GB, а паттерн требует gte 8GB -> SATISFIED
        verdict, _ = eval_numeric_comparison("gte", 8, 16)
        self.assertEqual(verdict, ConstraintVerdict.SATISFIED)

        verdict, _ = eval_numeric_comparison("gte", 32, 16)
        self.assertEqual(verdict, ConstraintVerdict.VIOLATED)


class TestEvidenceAndAuthorization(unittest.TestCase):
    """Тестирование правил допуска и доказательной базы."""

    def setUp(self):
        self.pattern = PatternRecord(
            pattern_id="pat-test",
            name="Test Pattern",
            intent="Test Intent",
            description="Test Description",
            domain="test",
            version="1.0.0",
            mandatory_claims={
                "claim-crit": EvidenceSeverity.CRITICAL,
                "claim-maj": EvidenceSeverity.MAJOR
            }
        )

    def test_version_mismatch_prevents_authorized(self):
        # Свидетельство на версии 0.9.0 при версии паттерна 1.0.0
        stale_ev = EvidenceRecord(
            evidence_id="ev-stale",
            claim_id="claim-crit",
            claim="Critical safety mechanism verified",
            method="AUTOMATED_UNIT_TEST",
            object_version="0.9.0",  # MISMATCH!
            result=EvidenceResult.PASSED,
            linked_pattern_id="pat-test",
            severity=EvidenceSeverity.CRITICAL
        )

        auth, eligibility, counts, _, unres_q, _ = evaluate_evidence_and_authorization(
            pattern=self.pattern,
            linked_evidence=[stale_ev],
            constraint_results=[]
        )

        # Не может быть AUTHORIZED из-за устаревшего свидетельства
        self.assertNotEqual(auth, ApplicationAuthorization.AUTHORIZED)
        self.assertEqual(auth, ApplicationAuthorization.CONDITIONAL)
        self.assertEqual(eligibility, SearchEligibility.ELIGIBLE_FOR_REVIEW)
        self.assertEqual(counts["stale"], 1)

    def test_critical_failure_triggers_denied_and_excluded(self):
        fail_ev = EvidenceRecord(
            evidence_id="ev-fail",
            claim_id="claim-crit",
            claim="Critical claim failed",
            method="AUTOMATED_UNIT_TEST",
            object_version="1.0.0",
            result=EvidenceResult.FAILED,
            linked_pattern_id="pat-test",
            severity=EvidenceSeverity.CRITICAL
        )

        auth, eligibility, counts, _, _, rej_reasons = evaluate_evidence_and_authorization(
            pattern=self.pattern,
            linked_evidence=[fail_ev],
            constraint_results=[]
        )

        self.assertEqual(auth, ApplicationAuthorization.DENIED)
        self.assertEqual(eligibility, SearchEligibility.EXCLUDED)
        self.assertEqual(counts["critical_failed"], 1)
        self.assertTrue(len(rej_reasons) > 0)

    def test_not_executed_triggers_conditional_not_denied(self):
        # NOT_EXECUTED не является провалом (FAILED), но требует допроверки (CONDITIONAL)
        unexec_ev = EvidenceRecord(
            evidence_id="ev-unexec",
            claim_id="claim-crit",
            claim="Critical claim not yet run",
            method="AUTOMATED_UNIT_TEST",
            object_version="1.0.0",
            result=EvidenceResult.NOT_EXECUTED,
            linked_pattern_id="pat-test",
            severity=EvidenceSeverity.CRITICAL
        )

        auth, eligibility, counts, _, unres_q, rej = evaluate_evidence_and_authorization(
            pattern=self.pattern,
            linked_evidence=[unexec_ev],
            constraint_results=[]
        )

        self.assertEqual(auth, ApplicationAuthorization.CONDITIONAL)
        self.assertEqual(eligibility, SearchEligibility.ELIGIBLE_FOR_REVIEW)
        self.assertEqual(counts["unexecuted"], 1)
        self.assertEqual(len(rej), 0)

    def test_full_pass_triggers_authorized(self):
        ev1 = EvidenceRecord(
            evidence_id="ev-1",
            claim_id="claim-crit",
            claim="Critical claim passed",
            method="AUTOMATED_UNIT_TEST",
            object_version="1.0.0",
            result=EvidenceResult.PASSED,
            linked_pattern_id="pat-test",
            severity=EvidenceSeverity.CRITICAL
        )
        ev2 = EvidenceRecord(
            evidence_id="ev-2",
            claim_id="claim-maj",
            claim="Major claim passed",
            method="AUTOMATED_UNIT_TEST",
            object_version="1.0.0",
            result=EvidenceResult.PASSED,
            linked_pattern_id="pat-test",
            severity=EvidenceSeverity.MAJOR
        )

        auth, eligibility, counts, _, _, _ = evaluate_evidence_and_authorization(
            pattern=self.pattern,
            linked_evidence=[ev1, ev2],
            constraint_results=[]
        )

        self.assertEqual(auth, ApplicationAuthorization.AUTHORIZED)
        self.assertEqual(eligibility, SearchEligibility.ELIGIBLE)
        self.assertEqual(counts["passed"], 2)


class TestRankingAndPartitioning(unittest.TestCase):
    """Тестирование детерминированного лексикографического ранжирования."""

    def test_critical_failure_excluded_to_diagnostic(self):
        p1 = PatternRecord(pattern_id="pat-1", name="P1", intent="I1", description="D1", domain="dom")
        p2 = PatternRecord(pattern_id="pat-2", name="P2", intent="I2", description="D2", domain="dom")

        from pattern_lens.models import Candidate

        c_good = Candidate(
            pattern=p1,
            match_type="TOKEN_MATCH",
            match_tier=3,
            search_eligibility=SearchEligibility.ELIGIBLE,
            application_authorization=ApplicationAuthorization.AUTHORIZED
        )

        c_bad = Candidate(
            pattern=p2,
            match_type="TOKEN_MATCH",
            match_tier=1,  # Даже при более высоком tier совпадения!
            search_eligibility=SearchEligibility.EXCLUDED,
            application_authorization=ApplicationAuthorization.DENIED,
            critical_evidence_failed=1
        )

        recommended, diagnostic = partition_and_rank_candidates([c_good, c_bad])

        self.assertEqual(len(recommended), 1)
        self.assertEqual(recommended[0].pattern_id, "pat-1")
        self.assertEqual(len(diagnostic), 1)
        self.assertEqual(diagnostic[0].pattern_id, "pat-2")

    def test_lexicographical_tie_breaking(self):
        p_a = PatternRecord(pattern_id="pat-alpha", name="Alpha", intent="I", description="D", domain="dom")
        p_b = PatternRecord(pattern_id="pat-beta", name="Beta", intent="I", description="D", domain="dom")

        from pattern_lens.models import Candidate
        # Одинаковые атрибуты ранжирования
        c_b = Candidate(
            pattern=p_b, match_type="MATCH", match_tier=2,
            search_eligibility=SearchEligibility.ELIGIBLE,
            application_authorization=ApplicationAuthorization.AUTHORIZED
        )
        c_a = Candidate(
            pattern=p_a, match_type="MATCH", match_tier=2,
            search_eligibility=SearchEligibility.ELIGIBLE,
            application_authorization=ApplicationAuthorization.AUTHORIZED
        )

        # Передаем в обратном порядке [c_b, c_a]
        recommended, _ = partition_and_rank_candidates([c_b, c_a])

        # Алфавитный тай-брейкер ставит pat-alpha перед pat-beta
        self.assertEqual(recommended[0].pattern_id, "pat-alpha")
        self.assertEqual(recommended[1].pattern_id, "pat-beta")


class TestEndToEndEngine(unittest.TestCase):
    """Сквозное тестирование PatternLensEngine с AtlasCanonicalAdapter."""

    def setUp(self):
        self.adapter = AtlasCanonicalAdapter()
        self.engine = PatternLensEngine(self.adapter)

    def test_explicit_id_query(self):
        result = self.engine.search(
            query="Нужен паттерн pat-preview-validate-commit для стенда",
            requested_constraints={
                "user_level": "engineer",
                "action_reversibility": "reversible_with_audit",
                "network_roundtrip_ms": {"value": 150, "unit": "ms"}
            }
        )

        self.assertEqual(result.search_status, "MATCH_FOUND")
        self.assertTrue(len(result.recommended_candidates) >= 1)
        top = result.recommended_candidates[0]
        self.assertEqual(top.pattern_id, "pat-preview-validate-commit")
        self.assertEqual(top.match_tier, 0)
        self.assertEqual(top.application_authorization, ApplicationAuthorization.AUTHORIZED)

    def test_constraint_violation_diagnostic_routing(self):
        # Задержка сети 500мс превышает лимит 200мс в pat-preview-validate-commit
        result = self.engine.search(
            query="pat-preview-validate-commit",
            requested_constraints={
                "user_level": "engineer",
                "action_reversibility": "reversible_with_audit",
                "network_roundtrip_ms": {"value": 500, "unit": "ms"}
            }
        )

        # Кандидат должен быть исключен в диагностический список
        self.assertEqual(result.search_status, "ALL_CANDIDATES_EXCLUDED")
        self.assertEqual(len(result.recommended_candidates), 0)
        self.assertEqual(len(result.diagnostic_candidates), 1)
        diag = result.diagnostic_candidates[0]
        self.assertEqual(diag.pattern_id, "pat-preview-validate-commit")
        self.assertEqual(diag.application_authorization, ApplicationAuthorization.DENIED)

    def test_diagnose_pattern_method(self):
        diag = self.engine.diagnose_pattern(
            pattern_id="pat-calibrated-telemetry-console",
            requested_constraints={"sample_rate_hz": {"value": 2000, "unit": "hz"}}
        )

        self.assertEqual(diag["pattern_id"], "pat-calibrated-telemetry-console")
        self.assertEqual(diag["application_authorization"], "AUTHORIZED")


if __name__ == "__main__":
    unittest.main()
