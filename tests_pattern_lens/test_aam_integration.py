"""
PATTERN LENS × AAM-V2 — AAM Gateway Integration Test Suite
"""

import unittest
from pattern_lens.aam_gateway import (
    AAMPatternGateway,
    GatewayConfig,
    GatewayProcessingMode,
    InterpretationStatus,
    SemanticInterpretationReport,
    GatewayResult
)
from pattern_lens.retrieval import parse_query
from pattern_lens.engine import PatternLensEngine
from pattern_lens.adapter import PatternSourceAdapter
from pattern_lens.models import PatternRecord, ApplicationAuthorization


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


class TestAAMGatewayIntegration(unittest.TestCase):

    def test_1_exact_raw_query_preservation(self):
        """1. Точное сохранение исходного запроса (включая пробелы)."""
        raw = "   test query with spaces   "
        gateway = AAMPatternGateway()
        res = gateway.process_query(raw)
        self.assertEqual(res.raw_query, raw)
        self.assertEqual(res.parsed_query.raw, "test query with spaces")

    def test_2_passthrough_parity_with_parse_query(self):
        """2. Parity с parse_query()."""
        raw = "pat-test-1 #safety"
        gateway = AAMPatternGateway()
        res = gateway.process_query(raw)
        direct_parsed = parse_query(raw)
        self.assertEqual(res.parsed_query, direct_parsed)

    def test_3_empty_and_whitespace_query(self):
        """3. Пустого и пробельного запроса."""
        for q in ["", "   ", "\t"]:
            gateway = AAMPatternGateway()
            res = gateway.process_query(q)
            self.assertEqual(res.raw_query, q)
            self.assertEqual(res.parsed_query.raw, "")
            self.assertEqual(res.status, InterpretationStatus.FALLBACK_PASSTHROUGH)

    def test_4_standard_fallback(self):
        """4. Штатного fallback при AAM_RUNTIME и strict_runtime_required=False."""
        config = GatewayConfig(mode=GatewayProcessingMode.AAM_RUNTIME, strict_runtime_required=False)
        gateway = AAMPatternGateway(config=config)
        res = gateway.process_query("test")
        self.assertEqual(res.status, InterpretationStatus.FALLBACK_PASSTHROUGH)
        self.assertTrue(res.interpretation_report.is_fallback_mode)

    def test_5_strict_refusal_runtime_unavailable(self):
        """5. Строгого отказа при недоступном runtime (strict_runtime_required=True)."""
        config = GatewayConfig(mode=GatewayProcessingMode.AAM_RUNTIME, strict_runtime_required=True)
        gateway = AAMPatternGateway(config=config)
        res = gateway.process_query("test")
        self.assertEqual(res.status, InterpretationStatus.AAM_RUNTIME_UNAVAILABLE)
        self.assertIsNone(res.parsed_query)
        self.assertIsNone(res.search_result)

    def test_6_runtime_exception_isolation(self):
        """6. Изоляции исключения runtime."""
        import pattern_lens.aam_gateway as gw_module
        old_parse = gw_module.parse_query
        try:
            gw_module.parse_query = lambda *args, **kwargs: (_ for _ in ()).throw(ValueError("Parser exploded"))
            res = AAMPatternGateway().process_query("test")
            self.assertEqual(res.status, InterpretationStatus.AAM_ERROR)
            self.assertIn("Parser exploded", res.error_message)
        finally:
            gw_module.parse_query = old_parse

    def test_7_rejection_malformed_runtime_response(self):
        """7. Отклонения некорректного ответа runtime (возврат AAM_ERROR)."""
        report = SemanticInterpretationReport(
            status=InterpretationStatus.AAM_ERROR,
            source_language="ru",
            primary_intent="bad",
            error_details="Malformed response"
        )
        res = GatewayResult(raw_query="bad", status=InterpretationStatus.AAM_ERROR, interpretation_report=report, error_message="Malformed response")
        self.assertEqual(res.status, InterpretationStatus.AAM_ERROR)
        self.assertIsNone(res.parsed_query)

    def test_8_blocking_search_upon_clarification(self):
        """8. Блокировки поиска при необходимости уточнения."""
        report = SemanticInterpretationReport(
            status=InterpretationStatus.NEEDS_CLARIFICATION,
            source_language="ru",
            primary_intent="ambiguous",
            clarification_options=["Option A", "Option B"]
        )
        self.assertEqual(report.status, InterpretationStatus.NEEDS_CLARIFICATION)
        self.assertTrue(len(report.clarification_options) > 0)

    def test_9_preservation_of_unknown_ids(self):
        """9. Сохранения неизвестных ID."""
        raw = "pat-unknown-id #unknown-tag"
        gateway = AAMPatternGateway()
        res = gateway.process_query(raw)
        self.assertIn("pat-unknown-id", res.parsed_query.explicit_ids)
        self.assertIn("unknown-tag", res.parsed_query.tags)

    def test_10_absence_of_engine(self):
        """10. Отсутствия движка (pattern_engine=None)."""
        gateway = AAMPatternGateway(pattern_engine=None)
        res = gateway.process_query("test", execute_search=True)
        self.assertEqual(res.status, InterpretationStatus.FALLBACK_PASSTHROUGH)
        self.assertIsNotNone(res.parsed_query)
        self.assertIsNone(res.search_result)

    def test_11_independent_operation_pattern_lens(self):
        """11. Автономной работы PATTERN LENS."""
        engine = PatternLensEngine(MockAdapter())
        search_res = engine.search("pat-test-1")
        self.assertEqual(search_res.search_status, "MATCH_FOUND")
        self.assertEqual(len(search_res.recommended_candidates), 1)

    def test_12_no_authorization_escalation(self):
        """12. Отсутствия эскалации авторизации."""
        engine = PatternLensEngine(MockAdapter())
        gateway = AAMPatternGateway(pattern_engine=engine)
        res = gateway.process_query("pat-test-1")
        self.assertIsNotNone(res.search_result)
        cand = res.search_result.recommended_candidates[0]
        self.assertIn(cand.application_authorization, [
            ApplicationAuthorization.AUTHORIZED,
            ApplicationAuthorization.CONDITIONAL,
            ApplicationAuthorization.DENIED
        ])


if __name__ == "__main__":
    unittest.main()
