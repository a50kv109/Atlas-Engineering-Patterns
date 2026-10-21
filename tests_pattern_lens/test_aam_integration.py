"""
PATTERN LENS × AAM-V2 — AAM Gateway Integration Test Suite
Comprehensive validation of canonical AAMPatternGateway against PatternLensEngine.
"""

import unittest
from typing import Any, Dict, Optional, Set

from pattern_lens.aam_gateway import (
    AAMPatternGateway,
    GatewayConfig,
    GatewayProcessingMode,
    InterpretationStatus,
    SemanticInterpretationReport,
    DisambiguatedTerm,
    GatewayResult,
    validate_semantic_interpretation_report,
)
from pattern_lens.retrieval import parse_query
from pattern_lens.engine import PatternLensEngine
from pattern_lens.adapter import PatternSourceAdapter
from pattern_lens.models import (
    PatternRecord,
    ApplicationAuthorization,
    ConstraintRecord,
    ConstraintSeverity,
    SearchResult,
)


class MockAdapter(PatternSourceAdapter):
    def get_patterns(self):
        return [
            PatternRecord(
                pattern_id="pat-test-1",
                name="Test Pattern",
                intent="Testing gateway",
                description="A test pattern",
                domain="TestDomain",
                tags=["#test"]
            )
        ]

    def get_evidence(self):
        return []


class RestrictedMockAdapter(PatternSourceAdapter):
    """Адаптер с обязательным жестким ограничением для проверки отсутствия эскалации авторизации."""
    def get_patterns(self):
        return [
            PatternRecord(
                pattern_id="pat-restricted",
                name="Restricted Safety Pattern",
                intent="Restricted testing",
                description="Requires expert operator level",
                domain="TestDomain",
                constraints=[
                    ConstraintRecord(
                        constraint_id="con-expert-only",
                        subject="user_level",
                        operator="eq",
                        value="expert",
                        severity=ConstraintSeverity.FUNCTIONAL,
                        description="Expert user level is strictly required"
                    )
                ]
            )
        ]

    def get_evidence(self):
        return []


class SpyEngine(PatternLensEngine):
    """
    Тестовый шпион для PatternLensEngine.
    Служит строгим доказательством того, вызывался ли метод search().
    """
    def __init__(self, adapter: Optional[PatternSourceAdapter] = None):
        super().__init__(adapter or MockAdapter())
        self.search_call_count = 0
        self.last_query = None

    def search(
        self,
        query: str,
        requested_constraints: Optional[Dict[str, Any]] = None,
        declared_context: Optional[Dict[str, Any]] = None,
        inventory_is_complete: bool = False,
        target_claim_ids: Optional[Set[str]] = None
    ) -> SearchResult:
        self.search_call_count += 1
        self.last_query = query
        return super().search(
            query=query,
            requested_constraints=requested_constraints,
            declared_context=declared_context,
            inventory_is_complete=inventory_is_complete,
            target_claim_ids=target_claim_ids
        )


class TestAAMGatewayIntegration(unittest.TestCase):

    def test_1_exact_raw_query_preservation(self):
        """1. Точное сохранение исходного запроса (включая пробелы) и неизвестных IDs."""
        raw = "   pat-unknown-id #unknown-tag with spaces   "
        gateway = AAMPatternGateway()
        res = gateway.process_query(raw)
        self.assertEqual(res.raw_query, raw)
        self.assertEqual(res.parsed_query.raw, "pat-unknown-id #unknown-tag with spaces")
        self.assertIn("pat-unknown-id", res.parsed_query.explicit_ids)
        self.assertIn("unknown-tag", res.parsed_query.tags)

    def test_2_passthrough_parity_with_parse_query(self):
        """2. Parity с parse_query() в режиме PASSTHROUGH."""
        raw = "pat-test-1 #safety"
        gateway = AAMPatternGateway()
        res = gateway.process_query(raw)
        direct_parsed = parse_query(raw)
        self.assertEqual(res.parsed_query, direct_parsed)
        self.assertEqual(res.status, InterpretationStatus.FALLBACK_PASSTHROUGH)

    def test_3_empty_and_whitespace_query(self):
        """3. Корректная обработка пустого и пробельного запроса."""
        for q in ["", "   ", "\t"]:
            gateway = AAMPatternGateway()
            res = gateway.process_query(q)
            self.assertEqual(res.raw_query, q)
            self.assertEqual(res.parsed_query.raw, "")
            self.assertEqual(res.status, InterpretationStatus.FALLBACK_PASSTHROUGH)

    def test_4_runtime_adapter_invocation_in_aam_runtime_mode(self):
        """4. Проверка реального вызова runtime adapter в режиме AAM_RUNTIME."""
        adapter_calls = []

        def mock_runtime_adapter(query, **kwargs):
            adapter_calls.append((query, kwargs))
            return SemanticInterpretationReport(
                status=InterpretationStatus.INTERPRETED,
                source_language="ru",
                primary_intent=query,
                identified_concepts=[
                    DisambiguatedTerm(
                        concept_id="c-01",
                        canonical_term="тестовый концепт",
                        source_fragment=query
                    )
                ]
            )

        spy_engine = SpyEngine()
        config = GatewayConfig(mode=GatewayProcessingMode.AAM_RUNTIME, runtime_adapter=mock_runtime_adapter)
        gateway = AAMPatternGateway(pattern_engine=spy_engine, config=config)

        res = gateway.process_query("test query", declared_context={"env": "lab"})
        self.assertEqual(len(adapter_calls), 1)
        self.assertEqual(adapter_calls[0][0], "test query")
        self.assertEqual(adapter_calls[0][1].get("declared_context"), {"env": "lab"})
        self.assertEqual(res.status, InterpretationStatus.INTERPRETED)
        self.assertEqual(spy_engine.search_call_count, 1)
        self.assertIsNotNone(res.search_result)

    def test_5_strict_refusal_runtime_unavailable(self):
        """5. Строгий отказ при недоступном runtime (strict_runtime_required=True): поисковый движок не вызывается."""
        spy_engine = SpyEngine()
        config = GatewayConfig(mode=GatewayProcessingMode.AAM_RUNTIME, strict_runtime_required=True, runtime_adapter=None)
        gateway = AAMPatternGateway(pattern_engine=spy_engine, config=config)

        res = gateway.process_query("test query", execute_search=True)
        self.assertEqual(res.status, InterpretationStatus.AAM_RUNTIME_UNAVAILABLE)
        self.assertEqual(spy_engine.search_call_count, 0)
        self.assertIsNone(res.parsed_query)
        self.assertIsNone(res.search_result)

    def test_6_runtime_exception_isolation_no_search_no_fallback(self):
        """6. Изоляция реального исключения runtime: возвращает AAM_ERROR без вызова поиска и без неявного fallback."""
        def crashing_adapter(raw, **kwargs):
            raise RuntimeError("AAM Language Kernel Connection Dropped")

        spy_engine = SpyEngine()
        config = GatewayConfig(mode=GatewayProcessingMode.AAM_RUNTIME, runtime_adapter=crashing_adapter)
        gateway = AAMPatternGateway(pattern_engine=spy_engine, config=config)

        res = gateway.process_query("test query", execute_search=True)
        self.assertEqual(res.status, InterpretationStatus.AAM_ERROR)
        self.assertIn("AAM Language Kernel Connection Dropped", res.error_message)
        # Доказываем, что поисковый движок НЕ вызывался и скрытый fallback НЕ произошел
        self.assertEqual(spy_engine.search_call_count, 0)
        self.assertIsNone(res.search_result)

    def test_7_rejection_malformed_runtime_response_and_invalid_status(self):
        """7. Отклонение некорректного типа ответа и некорректного статуса (AAM_ERROR без запуска поиска)."""
        # 7a: Адаптер возвращает объект неподходящего типа (не SemanticInterpretationReport)
        def malformed_type_adapter(raw, **kwargs):
            return {"status": "INTERPRETED", "data": "raw dict"}

        spy_engine = SpyEngine()
        config = GatewayConfig(mode=GatewayProcessingMode.AAM_RUNTIME, runtime_adapter=malformed_type_adapter)
        gateway = AAMPatternGateway(pattern_engine=spy_engine, config=config)

        res = gateway.process_query("test query", execute_search=True)
        self.assertEqual(res.status, InterpretationStatus.AAM_ERROR)
        self.assertIn("Expected SemanticInterpretationReport", res.error_message)
        self.assertEqual(spy_engine.search_call_count, 0)
        self.assertIsNone(res.search_result)

        # 7b: Адаптер возвращает SemanticInterpretationReport с недопустимым статусом
        def invalid_status_adapter(raw, **kwargs):
            report = SemanticInterpretationReport(
                status="COMPLETELY_INVALID_STATUS",
                source_language="ru",
                primary_intent=raw
            )
            return report

        config_invalid_status = GatewayConfig(mode=GatewayProcessingMode.AAM_RUNTIME, runtime_adapter=invalid_status_adapter)
        gateway_invalid_status = AAMPatternGateway(pattern_engine=spy_engine, config=config_invalid_status)

        res_status = gateway_invalid_status.process_query("test query", execute_search=True)
        self.assertEqual(res_status.status, InterpretationStatus.AAM_ERROR)
        self.assertIn("Invalid InterpretationStatus", res_status.error_message)
        self.assertEqual(spy_engine.search_call_count, 0)
        self.assertIsNone(res_status.search_result)

        # 7c: Адаптер возвращает SemanticInterpretationReport с пустым обязательным полем source_language
        def invalid_fields_adapter(raw, **kwargs):
            return SemanticInterpretationReport(
                status=InterpretationStatus.INTERPRETED,
                source_language="",  # пустое поле нарушает валидацию
                primary_intent=raw
            )

        config_invalid_fields = GatewayConfig(mode=GatewayProcessingMode.AAM_RUNTIME, runtime_adapter=invalid_fields_adapter)
        gateway_invalid_fields = AAMPatternGateway(pattern_engine=spy_engine, config=config_invalid_fields)

        res_fields = gateway_invalid_fields.process_query("test query", execute_search=True)
        self.assertEqual(res_fields.status, InterpretationStatus.AAM_ERROR)
        self.assertIn("source_language must be a non-empty string", res_fields.error_message)
        self.assertEqual(spy_engine.search_call_count, 0)
        self.assertIsNone(res_fields.search_result)

    def test_8_blocking_search_upon_clarification(self):
        """8. Блокировка поиска при NEEDS_CLARIFICATION: поисковый движок не вызывается."""
        def clarification_adapter(raw, **kwargs):
            return SemanticInterpretationReport(
                status=InterpretationStatus.NEEDS_CLARIFICATION,
                source_language="ru",
                primary_intent=raw,
                clarification_options=["Option A (Educational)", "Option B (Industrial)"]
            )

        spy_engine = SpyEngine()
        config = GatewayConfig(mode=GatewayProcessingMode.AAM_RUNTIME, runtime_adapter=clarification_adapter)
        gateway = AAMPatternGateway(pattern_engine=spy_engine, config=config)

        res = gateway.process_query("ambiguous sensor setup", execute_search=True)
        self.assertEqual(res.status, InterpretationStatus.NEEDS_CLARIFICATION)
        self.assertIsNotNone(res.interpretation_report)
        self.assertEqual(len(res.interpretation_report.clarification_options), 2)
        # Доказываем через счетчик вызовов шпиона, что поисковый движок НЕ вызывался
        self.assertEqual(spy_engine.search_call_count, 0)
        self.assertIsNone(res.search_result)

    def test_9_blocking_search_upon_conflict_and_unsupported_domain(self):
        """9. Блокировка поиска при CONFLICT_DETECTED и UNSUPPORTED_DOMAIN: поисковый движок не вызывается."""
        # 9a: CONFLICT_DETECTED
        def conflict_adapter(raw, **kwargs):
            return SemanticInterpretationReport(
                status=InterpretationStatus.CONFLICT_DETECTED,
                source_language="ru",
                primary_intent=raw,
                error_details="Contradictory semantic intent detected"
            )

        spy_engine = SpyEngine()
        config_conflict = GatewayConfig(mode=GatewayProcessingMode.AAM_RUNTIME, runtime_adapter=conflict_adapter)
        gateway_conflict = AAMPatternGateway(pattern_engine=spy_engine, config=config_conflict)

        res_conflict = gateway_conflict.process_query("conflict query", execute_search=True)
        self.assertEqual(res_conflict.status, InterpretationStatus.CONFLICT_DETECTED)
        self.assertEqual(spy_engine.search_call_count, 0)
        self.assertIsNone(res_conflict.search_result)

        # 9b: UNSUPPORTED_DOMAIN
        def unsupported_adapter(raw, **kwargs):
            return SemanticInterpretationReport(
                status=InterpretationStatus.UNSUPPORTED_DOMAIN,
                source_language="ru",
                primary_intent=raw,
                error_details="Domain out of scope"
            )

        config_unsupported = GatewayConfig(mode=GatewayProcessingMode.AAM_RUNTIME, runtime_adapter=unsupported_adapter)
        gateway_unsupported = AAMPatternGateway(pattern_engine=spy_engine, config=config_unsupported)

        res_unsupported = gateway_unsupported.process_query("cooking recipe", execute_search=True)
        self.assertEqual(res_unsupported.status, InterpretationStatus.UNSUPPORTED_DOMAIN)
        self.assertEqual(spy_engine.search_call_count, 0)
        self.assertIsNone(res_unsupported.search_result)

    def test_10_absence_of_engine(self):
        """10. Корректное поведение при отсутствии движка (pattern_engine=None)."""
        gateway = AAMPatternGateway(pattern_engine=None)
        res = gateway.process_query("test query", execute_search=True)
        self.assertEqual(res.status, InterpretationStatus.FALLBACK_PASSTHROUGH)
        self.assertIsNotNone(res.parsed_query)
        self.assertIsNone(res.search_result)

    def test_11_independent_operation_pattern_lens(self):
        """11. Автономная работа PATTERN LENS без шлюза."""
        engine = PatternLensEngine(MockAdapter())
        search_res = engine.search("pat-test-1")
        self.assertEqual(search_res.search_status, "MATCH_FOUND")
        self.assertEqual(len(search_res.recommended_candidates), 1)

    def test_12_no_authorization_escalation_upon_constraint_violation(self):
        """12. Защита от эскалации авторизации: нарушение обязательного ограничения сохраняет фактический вердикт движка."""
        engine = PatternLensEngine(RestrictedMockAdapter())
        # Прямой поиск движка с нарушением ограничения user_level через requested_constraints
        direct_result = engine.search(
            query="pat-restricted",
            requested_constraints={"user_level": "beginner"}
        )
        self.assertEqual(direct_result.search_status, "ALL_CANDIDATES_EXCLUDED")
        self.assertEqual(len(direct_result.recommended_candidates), 0)
        self.assertTrue(len(direct_result.diagnostic_candidates) > 0)
        diag_cand = direct_result.diagnostic_candidates[0]
        self.assertEqual(diag_cand.application_authorization, ApplicationAuthorization.DENIED)

        # Вызов через шлюз с тем же нарушением
        gateway = AAMPatternGateway(pattern_engine=engine)
        res = gateway.process_query(
            raw_query="pat-restricted",
            requested_constraints={"user_level": "beginner"}
        )
        self.assertIsNotNone(res.search_result)
        # Доказываем, что шлюз сохранил вердикт движка и не поднял его до AUTHORIZED
        self.assertEqual(res.search_result.search_status, "ALL_CANDIDATES_EXCLUDED")
        self.assertEqual(len(res.search_result.recommended_candidates), 0)
        self.assertEqual(
            res.search_result.diagnostic_candidates[0].application_authorization,
            ApplicationAuthorization.DENIED
        )


if __name__ == "__main__":
    unittest.main()
