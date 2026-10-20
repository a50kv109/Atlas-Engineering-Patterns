"""
PATTERN LENS v0.1 — Data Source Adapters
Pure Python Standard Library (Python 3.10+)

Гарантии:
- Абстрактный интерфейс PatternSourceAdapter исключает привязку к конкретному фреймворку или БД.
- InMemoryPatternAdapter обеспечивает быстрое тестирование и интеграцию.
- AtlasCanonicalAdapter предоставляет доступ к каноническим паттернам Atlas и пилотным мини-паспортам.
"""

import json
from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
from .models import (
    PatternRecord, EvidenceRecord, ConstraintRecord, RelationRecord,
    LifecycleStatus, ConstraintSeverity, EvidenceResult, EvidenceSeverity
)


class PatternSourceAdapter(ABC):
    """Абстрактный интерфейс источника данных для PATTERN LENS."""

    @abstractmethod
    def get_patterns(self) -> List[PatternRecord]:
        """Возвращает список всех зарегистрированных паттернов."""
        pass

    @abstractmethod
    def get_evidence(self) -> List[EvidenceRecord]:
        """Возвращает список всех доступных свидетельств и результатов тестов."""
        pass


class InMemoryPatternAdapter(PatternSourceAdapter):
    """Универсальный in-memory адаптер для тестов и пользовательских коллекций."""

    def __init__(
        self,
        patterns: Optional[List[PatternRecord]] = None,
        evidence: Optional[List[EvidenceRecord]] = None
    ):
        self._patterns: List[PatternRecord] = patterns or []
        self._evidence: List[EvidenceRecord] = evidence or []

    def get_patterns(self) -> List[PatternRecord]:
        return list(self._patterns)

    def get_evidence(self) -> List[EvidenceRecord]:
        return list(self._evidence)

    def add_pattern(self, pattern: PatternRecord) -> None:
        self._patterns.append(pattern)

    def add_evidence(self, ev: EvidenceRecord) -> None:
        self._evidence.append(ev)


class AtlasCanonicalAdapter(PatternSourceAdapter):
    """
    Адаптер к каноническим инженерным паттернам и паспортам Atlas.
    Включает пилотные паспорта (Pilot APPM v0.1) и канонические контракты.
    """

    def __init__(self, json_file_path: Optional[str] = None):
        self._patterns: List[PatternRecord] = []
        self._evidence: List[EvidenceRecord] = []

        if json_file_path:
            self._load_from_json(json_file_path)
        else:
            self._load_builtin_canonical_patterns()

    def get_patterns(self) -> List[PatternRecord]:
        return list(self._patterns)

    def get_evidence(self) -> List[EvidenceRecord]:
        return list(self._evidence)

    def _load_from_json(self, path: str) -> None:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
            # Загрузка при наличии схемы JSON
            for p_raw in data.get("patterns", []):
                self._patterns.append(self._parse_pattern_dict(p_raw))
            for e_raw in data.get("evidence", []):
                self._evidence.append(self._parse_evidence_dict(e_raw))

    def _parse_pattern_dict(self, d: Dict[str, Any]) -> PatternRecord:
        constraints = [
            ConstraintRecord(
                constraint_id=c.get("constraint_id", ""),
                subject=c.get("subject", ""),
                operator=c.get("operator", "eq"),
                value=c.get("value"),
                severity=ConstraintSeverity(c.get("severity", "FUNCTIONAL")),
                unit=c.get("unit"),
                evidence_ref=c.get("evidence_ref"),
                description=c.get("description", "")
            )
            for c in d.get("constraints", [])
        ]
        relations = [
            RelationRecord(
                relation_type=r.get("relation_type", "USES"),
                target_id=r.get("target_id", ""),
                rationale=r.get("rationale")
            )
            for r in d.get("relations", [])
        ]
        mandatory_claims = {
            cid: EvidenceSeverity(sev)
            for cid, sev in d.get("mandatory_claims", {}).items()
        }
        return PatternRecord(
            pattern_id=d["pattern_id"],
            name=d["name"],
            intent=d.get("intent", ""),
            description=d.get("description", ""),
            domain=d.get("domain", "general_engineering"),
            version=d.get("version", "1.0.0"),
            lifecycle_status=LifecycleStatus(d.get("lifecycle_status", "IMPLEMENTED")),
            tags=d.get("tags", []),
            constraints=constraints,
            relations=relations,
            mandatory_claims=mandatory_claims,
            implementation_refs=d.get("implementation_refs", []),
            evidence_refs=d.get("evidence_refs", [])
        )

    def _parse_evidence_dict(self, d: Dict[str, Any]) -> EvidenceRecord:
        return EvidenceRecord(
            evidence_id=d["evidence_id"],
            claim_id=d["claim_id"],
            claim=d.get("claim", ""),
            method=d.get("method", "AUTOMATED_UNIT_TEST"),
            object_version=d.get("object_version", "1.0.0"),
            result=EvidenceResult(d.get("result", "PASSED")),
            verifier=d.get("verifier", "automated"),
            timestamp=d.get("timestamp", ""),
            linked_pattern_id=d.get("linked_pattern_id", ""),
            severity=EvidenceSeverity(d.get("severity", "MAJOR")),
            primary_artifact_ref=d.get("primary_artifact_ref")
        )

    def _load_builtin_canonical_patterns(self) -> None:
        """Инициализирует канонические паттерны Atlas и их доказательную базу."""
        # 1. pat-preview-validate-commit (Pilot 2)
        p_pvc = PatternRecord(
            pattern_id="pat-preview-validate-commit",
            name="Preview-Validate-Commit Two-Phase Action",
            intent="Предотвращение случайного применения необратимых параметров стенда оператором через двухфазный цикл предварительного просмотра и валидации.",
            description="Паттерн требует разделения модификации параметров стенда на этап валидации предпросмотра (Preview) и финального подтверждения (Commit) с обязательной проверкой пред-условий.",
            domain="safety_critical_hmi",
            version="1.0.0",
            lifecycle_status=LifecycleStatus.TESTED,
            tags=["safety", "hmi", "two-phase", "commit", "operator_action", "validation"],
            constraints=[
                ConstraintRecord(
                    constraint_id="c-pvc-1",
                    subject="user_level",
                    operator="in",
                    value=["engineer", "operator", "admin"],
                    severity=ConstraintSeverity.FUNCTIONAL,
                    description="Требует квалифицированного профиля оператора"
                ),
                ConstraintRecord(
                    constraint_id="c-pvc-2",
                    subject="action_reversibility",
                    operator="eq",
                    value="reversible_with_audit",
                    severity=ConstraintSeverity.SAFETY,
                    description="Обязательный аудит действий"
                ),
                ConstraintRecord(
                    constraint_id="c-pvc-3",
                    subject="network_roundtrip_ms",
                    operator="lte",
                    value=200,
                    unit="ms",
                    severity=ConstraintSeverity.FUNCTIONAL,
                    description="Максимальная задержка валидации 200мс"
                )
            ],
            mandatory_claims={
                "claim-pvc-pre-validation": EvidenceSeverity.CRITICAL,
                "claim-pvc-audit-trail": EvidenceSeverity.MAJOR
            },
            evidence_refs=["ev-pvc-001", "ev-pvc-002"]
        )

        ev_pvc_1 = EvidenceRecord(
            evidence_id="ev-pvc-001",
            claim_id="claim-pvc-pre-validation",
            claim="Блокировка передачи команды на исполнительный механизм до подтверждения валидности предпросмотра.",
            method="AUTOMATED_UNIT_TEST",
            object_version="1.0.0",
            result=EvidenceResult.PASSED,
            verifier="tests/audit.test.ts",
            linked_pattern_id="pat-preview-validate-commit",
            severity=EvidenceSeverity.CRITICAL
        )

        ev_pvc_2 = EvidenceRecord(
            evidence_id="ev-pvc-002",
            claim_id="claim-pvc-audit-trail",
            claim="Фиксация метаданных фиксации действия в неизменяемом журнале аудита.",
            method="AUTOMATED_UNIT_TEST",
            object_version="1.0.0",
            result=EvidenceResult.PASSED,
            verifier="tests/audit.test.ts",
            linked_pattern_id="pat-preview-validate-commit",
            severity=EvidenceSeverity.MAJOR
        )

        # 2. pat-epistemic-status-labeling (Pilot 1)
        p_esl = PatternRecord(
            pattern_id="pat-epistemic-status-labeling",
            name="Epistemic Status Labeling & Loss Indicator",
            intent="Явная маркировка эпистемического статуса данных (фактический, расчетный, синтетический, непроверенный) для исключения ложной уверенности оператора.",
            description="Отображает индикаторы доверия и предупреждает о потере эпистемической строгости при передаче сигналов между компонентами стенда.",
            domain="epistemic_hmi",
            version="1.0.0",
            lifecycle_status=LifecycleStatus.TESTED,
            tags=["epistemic", "telemetry", "uncertainty", "signal_integrity", "labeling"],
            constraints=[
                ConstraintRecord(
                    constraint_id="c-esl-1",
                    subject="epistemic_layer_supported",
                    operator="requires",
                    value=True,
                    severity=ConstraintSeverity.FUNCTIONAL,
                    description="Требует поддержки протокола метаданных достоверности"
                )
            ],
            mandatory_claims={
                "claim-esl-label-render": EvidenceSeverity.MAJOR
            },
            evidence_refs=["ev-esl-001"]
        )

        ev_esl_1 = EvidenceRecord(
            evidence_id="ev-esl-001",
            claim_id="claim-esl-label-render",
            claim="Каждая отображаемая телеметрическая точка помечается индикатором эпистемического статуса.",
            method="AUTOMATED_UNIT_TEST",
            object_version="1.0.0",
            result=EvidenceResult.PASSED,
            verifier="tests/epistemicLoss.test.ts",
            linked_pattern_id="pat-epistemic-status-labeling",
            severity=EvidenceSeverity.MAJOR
        )

        # 3. pat-guided-student-experiment-stepper (Pilot 3)
        p_gse = PatternRecord(
            pattern_id="pat-guided-student-experiment-stepper",
            name="Guided Student Experiment Stepper",
            intent="Пошаговое проведение учебного или исследовательского эксперимента с блокировкой перехода при незавершенных этапах.",
            description="Степпер с контролем выполнения обязательных проверок перед переходом к следующей фазе стендового испытания.",
            domain="educational_lab",
            version="1.0.0",
            lifecycle_status=LifecycleStatus.IMPLEMENTED,
            tags=["stepper", "student", "lab", "workflow", "experiment", "step-by-step"],
            constraints=[
                ConstraintRecord(
                    constraint_id="c-gse-1",
                    subject="screens_count",
                    operator="gte",
                    value=1,
                    severity=ConstraintSeverity.FUNCTIONAL,
                    description="Минимум один рабочий дисплей"
                )
            ],
            mandatory_claims={
                "claim-gse-step-gate": EvidenceSeverity.MAJOR
            },
            evidence_refs=["ev-gse-001"]
        )

        ev_gse_1 = EvidenceRecord(
            evidence_id="ev-gse-001",
            claim_id="claim-gse-step-gate",
            claim="Шаг N+1 недоступен до успешного завершения шага N.",
            method="AUTOMATED_UNIT_TEST",
            object_version="1.0.0",
            result=EvidenceResult.PASSED,
            verifier="tests/audit.test.ts",
            linked_pattern_id="pat-guided-student-experiment-stepper",
            severity=EvidenceSeverity.MAJOR
        )

        # 4. pat-calibrated-telemetry-console
        p_ctc = PatternRecord(
            pattern_id="pat-calibrated-telemetry-console",
            name="Calibrated Telemetry Console",
            intent="Вывод высокочастотных сигналов с калибровочными коэффициентами и контролем дрейфа нуля датчиков.",
            description="Специализированная консоль для операторов испытательных стендов с отображением границ погрешности и предупреждением о раскалибровке.",
            domain="sensor_telemetry",
            version="1.0.0",
            lifecycle_status=LifecycleStatus.TESTED,
            tags=["telemetry", "calibration", "drift", "sensors", "high-frequency"],
            constraints=[
                ConstraintRecord(
                    constraint_id="c-ctc-1",
                    subject="sample_rate_hz",
                    operator="gte",
                    value=1000,
                    unit="hz",
                    severity=ConstraintSeverity.FUNCTIONAL,
                    description="Минимальная частота дискретизации 1000 Гц"
                )
            ],
            mandatory_claims={
                "claim-ctc-drift-alert": EvidenceSeverity.CRITICAL
            },
            evidence_refs=["ev-ctc-001"]
        )

        ev_ctc_1 = EvidenceRecord(
            evidence_id="ev-ctc-001",
            claim_id="claim-ctc-drift-alert",
            claim="Индикация превышения допустимого порога дрейфа калибровки в реальном времени.",
            method="AUTOMATED_UNIT_TEST",
            object_version="1.0.0",
            result=EvidenceResult.PASSED,
            verifier="tests/audit.test.ts",
            linked_pattern_id="pat-calibrated-telemetry-console",
            severity=EvidenceSeverity.CRITICAL
        )

        # 5. pat-dual-operator-interlock
        p_doi = PatternRecord(
            pattern_id="pat-dual-operator-interlock",
            name="Dual-Operator Interlock Confirmation",
            intent="Предотвращение опасных стендовых операций без независимого подтверждения от второго оператора.",
            description="Реализует протокол «четырёх глаз» (Four-Eyes Principle) для физически опасных режимов стенда (высокое напряжение, криогеника).",
            domain="safety_critical_interlock",
            version="1.0.0",
            lifecycle_status=LifecycleStatus.TESTED,
            tags=["interlock", "safety", "dual-operator", "four-eyes", "critical"],
            constraints=[
                ConstraintRecord(
                    constraint_id="c-doi-1",
                    subject="operator_stations_count",
                    operator="gte",
                    value=2,
                    severity=ConstraintSeverity.SAFETY,
                    description="Требуются как минимум две независимые рабочие станции"
                )
            ],
            mandatory_claims={
                "claim-doi-independent-approval": EvidenceSeverity.CRITICAL
            },
            evidence_refs=["ev-doi-001"]
        )

        ev_doi_1 = EvidenceRecord(
            evidence_id="ev-doi-001",
            claim_id="claim-doi-independent-approval",
            claim="Операция физически блокируется при отсутствии криптографически подписанного согласия второго оператора.",
            method="AUTOMATED_UNIT_TEST",
            object_version="1.0.0",
            result=EvidenceResult.PASSED,
            verifier="tests/audit.test.ts",
            linked_pattern_id="pat-dual-operator-interlock",
            severity=EvidenceSeverity.CRITICAL
        )

        self._patterns.extend([p_pvc, p_esl, p_gse, p_ctc, p_doi])
        self._evidence.extend([ev_pvc_1, ev_pvc_2, ev_esl_1, ev_gse_1, ev_ctc_1, ev_doi_1])
