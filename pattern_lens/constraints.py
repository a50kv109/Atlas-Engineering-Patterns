"""
PATTERN LENS v0.1 — Constraint Checking Engine
Pure Python Standard Library (Python 3.10+)
"""

import math
from typing import Tuple, List, Any, Optional, Dict, Set
from .models import (
    ConstraintRecord, ConstraintVerdict, ConstraintSeverity,
    ConstraintCheckResult, ParsedQuery
)

_POSITIVE_STATUSES: Set[str] = {
    "enabled", "available", "present", "active", "true", "on", "yes", "1"
}
_NEGATIVE_STATUSES: Set[str] = {
    "disabled", "unavailable", "absent", "inactive", "false", "off", "no", "0"
}


# ============ PARSING VALUES AND UNITS ============

def extract_value_and_unit(value: Any) -> Tuple[Any, Optional[str]]:
    """
    Извлекает базовое значение и единицу измерения.
    Поддерживаемые форматы:
    - dict: {"value": 16, "unit": "GB"}
    - tuple/list: (16, "GB")
    - скаляр: 16
    """
    if isinstance(value, dict):
        return value.get("value"), value.get("unit")
    if isinstance(value, (list, tuple)) and len(value) == 2:
        return value[0], value[1]
    return value, None


# ============ OPERATOR: REQUIRES ============

def _eval_presence_value(val: Any) -> Tuple[ConstraintVerdict, List[str]]:
    """Оценивает семантику наличия/активности ресурса или свойства."""
    if val is None:
        return ConstraintVerdict.UNKNOWN, ["none_value_in_capability"]
    if isinstance(val, bool):
        return (ConstraintVerdict.SATISFIED if val is True else ConstraintVerdict.VIOLATED), []
    if isinstance(val, (int, float)):
        return ConstraintVerdict.UNKNOWN, ["numeric_value_not_a_flag"]
    if isinstance(val, str):
        s_norm = val.strip().lower()
        if s_norm in _POSITIVE_STATUSES:
            return ConstraintVerdict.SATISFIED, []
        if s_norm in _NEGATIVE_STATUSES:
            return ConstraintVerdict.VIOLATED, []
        return ConstraintVerdict.UNKNOWN, [f"unrecognized_status_string: '{val}'"]
    if isinstance(val, dict):
        nested_status = val.get("status", val.get("enabled", val.get("state")))
        if nested_status is not None:
            return _eval_presence_value(nested_status)
        if len(val) > 0:
            return ConstraintVerdict.SATISFIED, []
        return ConstraintVerdict.UNKNOWN, ["empty_capability_dictionary"]
    return ConstraintVerdict.UNKNOWN, ["unsupported_presence_value_type"]


def eval_requires(
    pattern_requirement: Any,
    query_environment: Any,
    inventory_is_complete: bool = False
) -> Tuple[ConstraintVerdict, List[str]]:
    """
    Семантика оператора 'requires'.
    Паттерн требует наличия свойства/ресурса в окружении.
    
    Гарантии контракта:
    1. Исходное требование никогда не подменяется на True при рекурсии.
    2. Если pattern_requirement — словарь (структурированное требование),
       каждое подтребование рекурсивно проверяется против соответствующего значения query_environment.
    3. Поддерживается навигация по точечным путям ("hardware.can_capture").
    4. Отсутствие ключа/элемента даёт VIOLATED только при inventory_is_complete=True,
       иначе UNKNOWN ['incomplete_inventory'].
    5. bool проверяется строго ДО int.
    6. Числа не считаются логическими флагами (UNKNOWN).
    7. Вложенные словари со свойствами 'status'/'enabled'/'state' проверяются по их семантике.
    """
    if query_environment is None:
        return ConstraintVerdict.UNKNOWN, ["missing_requirement_data"]

    # 1. Структурированное требование (pattern_requirement — словарь)
    if isinstance(pattern_requirement, dict):
        if not isinstance(query_environment, dict):
            return ConstraintVerdict.UNKNOWN, ["environment_must_be_dict_for_structured_requirement"]
        
        has_unknown = False
        unknown_reasons: List[str] = []
        
        for req_k, req_v in pattern_requirement.items():
            if req_k not in query_environment:
                if inventory_is_complete:
                    return ConstraintVerdict.VIOLATED, [f"required_key_absent: '{req_k}'"]
                has_unknown = True
                unknown_reasons.append(f"incomplete_inventory_missing_key: '{req_k}'")
                continue
            
            sub_verdict, sub_flags = eval_requires(req_v, query_environment[req_k], inventory_is_complete)
            if sub_verdict == ConstraintVerdict.VIOLATED:
                return ConstraintVerdict.VIOLATED, sub_flags
            if sub_verdict == ConstraintVerdict.UNKNOWN:
                has_unknown = True
                unknown_reasons.extend(sub_flags)
        
        if has_unknown:
            return ConstraintVerdict.UNKNOWN, unknown_reasons
        return ConstraintVerdict.SATISFIED, []

    # 2. Прямая проверка скалярного окружения через helper
    if isinstance(query_environment, (bool, int, float, str)):
        return _eval_presence_value(query_environment)

    # 3. Коллекции инвентаря (list, set, tuple)
    if isinstance(query_environment, (list, set, tuple)):
        req_key = str(pattern_requirement).strip().lower()
        normalized_collection = {str(item).strip().lower() for item in query_environment}

        if req_key in normalized_collection:
            return ConstraintVerdict.SATISFIED, []

        if inventory_is_complete:
            return ConstraintVerdict.VIOLATED, [f"required_capability_absent: '{pattern_requirement}'"]
        return ConstraintVerdict.UNKNOWN, ["incomplete_inventory"]

    # 4. Словари инвентаря возможностей
    if isinstance(query_environment, dict):
        # Поддержка навигации по составному пути с точкой ("hardware.can_capture")
        if isinstance(pattern_requirement, str) and "." in pattern_requirement:
            parts = pattern_requirement.split(".")
            curr: Any = query_environment
            for idx, part in enumerate(parts):
                if not isinstance(curr, dict) or part not in curr:
                    if inventory_is_complete:
                        return ConstraintVerdict.VIOLATED, [f"required_path_segment_absent: '{part}' in '{pattern_requirement}'"]
                    return ConstraintVerdict.UNKNOWN, [f"incomplete_inventory_missing_path: '{pattern_requirement}'"]
                curr = curr[part]
            return _eval_presence_value(curr)

        # Если само требование — непосредственный ключ в словаре
        if pattern_requirement in query_environment:
            return _eval_presence_value(query_environment[pattern_requirement])

        # Поиск ключа без учета регистра среди строковых ключей словаря
        req_lower = str(pattern_requirement).strip().lower()
        for k, v in query_environment.items():
            if str(k).strip().lower() == req_lower:
                return _eval_presence_value(v)

        # Ключа нет в словаре
        if inventory_is_complete:
            return ConstraintVerdict.VIOLATED, [f"required_key_absent: '{pattern_requirement}'"]
        return ConstraintVerdict.UNKNOWN, ["incomplete_inventory"]

    return ConstraintVerdict.UNKNOWN, ["unsupported_environment_type"]


# ============ OPERATORS: NUMERIC COMPARISON & UNITS ============

def eval_numeric_comparison(
    operator: str,
    pattern_threshold: Any,
    query_environment: Any,
    unit_required: Optional[str] = None
) -> Tuple[ConstraintVerdict, List[str]]:
    """
    Числовое сравнение с направлением 'query_environment vs pattern_threshold'
    и контролем единиц измерения.
    
    Исправления дефектов:
    1. Извлечение значения и единиц (extract_value_and_unit) происходит ДО проверок.
    2. Строгая проверка bool ПОСЛЕ извлечения (отклоняет {"value": True} и (True, "GB")).
    3. Защита от NaN, +inf, -inf через math.isfinite().
    4. Запрет автоконвертации единиц в v0.1: только точное соответствие.
    5. Любое несовпадение или отсутствие обязательной единицы -> UNKNOWN.
    """
    # 1. Извлечение скаляров и единиц
    q_val, q_unit = extract_value_and_unit(query_environment)
    p_val, p_unit = extract_value_and_unit(pattern_threshold)

    # 2. Проверка на bool ПОСЛЕ извлечения (критично для структур {"value": True})
    if isinstance(q_val, bool) or isinstance(p_val, bool):
        return ConstraintVerdict.UNKNOWN, ["boolean_cannot_be_numeric"]

    # 3. Нормализация единиц
    q_unit_norm = q_unit.strip().lower() if isinstance(q_unit, str) else None
    p_unit_norm = p_unit.strip().lower() if isinstance(p_unit, str) else None
    req_unit_norm = unit_required.strip().lower() if isinstance(unit_required, str) else None

    # 4. Проверка согласованности единиц
    if req_unit_norm is not None:
        if p_unit_norm is not None and p_unit_norm != req_unit_norm:
            return ConstraintVerdict.UNKNOWN, [
                f"unit_conflict_pattern_vs_required: pattern='{p_unit}', required='{unit_required}'"
            ]
        if q_unit_norm is None:
            return ConstraintVerdict.UNKNOWN, [f"missing_mandatory_unit: expected '{unit_required}'"]
        if q_unit_norm != req_unit_norm:
            return ConstraintVerdict.UNKNOWN, [f"unit_mismatch: got '{q_unit}', expected '{unit_required}'"]
    elif p_unit_norm is not None:
        if q_unit_norm is None:
            return ConstraintVerdict.UNKNOWN, [f"missing_mandatory_unit: expected '{p_unit}'"]
        if q_unit_norm != p_unit_norm:
            return ConstraintVerdict.UNKNOWN, [f"unit_mismatch: got '{q_unit}', expected '{p_unit}'"]

    # 5. Проверка числовых типов (int / float)
    if not isinstance(q_val, (int, float)) or not isinstance(p_val, (int, float)):
        return ConstraintVerdict.UNKNOWN, ["type_mismatch_not_a_number"]

    # 6. Защита от NaN и Inf
    if not math.isfinite(q_val) or not math.isfinite(p_val):
        return ConstraintVerdict.UNKNOWN, ["non_finite_numeric_value"]

    # 7. Направление сравнения: характеристика стенда (q_val) vs требование паттерна (p_val)
    if operator == "gte":
        return (ConstraintVerdict.SATISFIED if q_val >= p_val else ConstraintVerdict.VIOLATED), []
    elif operator == "lte":
        return (ConstraintVerdict.SATISFIED if q_val <= p_val else ConstraintVerdict.VIOLATED), []
    elif operator == "eq":
        return (ConstraintVerdict.SATISFIED if q_val == p_val else ConstraintVerdict.VIOLATED), []
    elif operator == "neq":
        return (ConstraintVerdict.SATISFIED if q_val != p_val else ConstraintVerdict.VIOLATED), []

    return ConstraintVerdict.UNKNOWN, [f"unsupported_numeric_operator: '{operator}'"]


# ============ OPERATOR: IN ============

def eval_in_comparison(pattern_collection: Any, query_val: Any) -> Tuple[ConstraintVerdict, List[str]]:
    """Проверка вхождения значения запроса в допустимый набор паттерна."""
    if isinstance(query_val, bool):
        return ConstraintVerdict.UNKNOWN, ["boolean_unsupported_in_collection"]
    if not isinstance(pattern_collection, (list, set, tuple)):
        return ConstraintVerdict.UNKNOWN, ["pattern_value_must_be_collection"]

    # Нормализуем для строковых значений
    if isinstance(query_val, str):
        q_norm = query_val.strip().lower()
        p_set = {str(item).strip().lower() for item in pattern_collection}
        return (ConstraintVerdict.SATISFIED if q_norm in p_set else ConstraintVerdict.VIOLATED), []

    is_satisfied = query_val in pattern_collection
    return (ConstraintVerdict.SATISFIED if is_satisfied else ConstraintVerdict.VIOLATED), []


# ============ DISPATCHER & CONTEXT SCOPE ============

def _is_explicitly_out_of_scope(constraint: ConstraintRecord, context: Dict[str, Any]) -> bool:
    """
    Проверяет, доказана ли неприменимость ограничения контекстом запроса.
    Пример: ограничение screens_count явно неприменимо, если контекст заявляет headless_daemon.
    """
    if not context:
        return False
    sys_type = str(context.get("system_type", "")).strip().lower()
    if constraint.subject in {"screens_count", "min_screens", "display"} and sys_type in {"headless_daemon", "embedded_firmware"}:
        return True
    return False


def check_constraint(
    constraint: ConstraintRecord,
    query: ParsedQuery
) -> ConstraintCheckResult:
    """
    Главная точка проверки ограничения.
    Семантика:
    - Не указан в запросе -> UNKNOWN (если неприменимость не доказана явно контекстом).
    - Несовместимость типов/операторов -> UNKNOWN.
    - Никакого неявного преобразования UNKNOWN в SATISFIED!
    """
    if constraint.subject not in query.requested_constraints:
        if _is_explicitly_out_of_scope(constraint, query.declared_context):
            return ConstraintCheckResult(
                constraint_id=constraint.constraint_id,
                subject=constraint.subject,
                severity=constraint.severity,
                verdict=ConstraintVerdict.NOT_APPLICABLE,
                explanation=f"Ограничение '{constraint.subject}' явно не относится к контексту ({query.declared_context.get('system_type')})"
            )
        return ConstraintCheckResult(
            constraint_id=constraint.constraint_id,
            subject=constraint.subject,
            severity=constraint.severity,
            verdict=ConstraintVerdict.UNKNOWN,
            explanation=f"Параметр '{constraint.subject}' не указан в запросе; применимость неизвестна",
            flags=["missing_query_parameter"]
        )

    query_val = query.requested_constraints[constraint.subject]
    op = constraint.operator.lower()

    if op == "requires":
        verdict, flags = eval_requires(constraint.value, query_val, query.inventory_is_complete)
        exp = f"Требование '{constraint.subject}' requires '{constraint.value}' -> {verdict.value}"
        return ConstraintCheckResult(constraint.constraint_id, constraint.subject, constraint.severity, verdict, exp, flags)

    if op in {"eq", "neq"}:
        # Проверка строковых значений (регистронезависимо)
        if isinstance(query_val, str) and isinstance(constraint.value, str):
            q_norm = query_val.strip().lower()
            p_norm = constraint.value.strip().lower()
            is_eq = (q_norm == p_norm)
            is_satisfied = is_eq if op == "eq" else not is_eq
            verdict = ConstraintVerdict.SATISFIED if is_satisfied else ConstraintVerdict.VIOLATED
            exp = f"Строковое сравнение '{constraint.subject}' {op} '{constraint.value}' -> {verdict.value}"
            return ConstraintCheckResult(constraint.constraint_id, constraint.subject, constraint.severity, verdict, exp, [])

        verdict, flags = eval_numeric_comparison(op, constraint.value, query_val, constraint.unit)
        exp = f"Числовое сравнение '{constraint.subject}' {op} {constraint.value} -> {verdict.value}"
        return ConstraintCheckResult(constraint.constraint_id, constraint.subject, constraint.severity, verdict, exp, flags)

    if op in {"gte", "lte"} and not isinstance(constraint.value, (list, set, tuple)):
        verdict, flags = eval_numeric_comparison(op, constraint.value, query_val, constraint.unit)
        exp = f"Числовое сравнение '{constraint.subject}' {op} {constraint.value} -> {verdict.value}"
        return ConstraintCheckResult(constraint.constraint_id, constraint.subject, constraint.severity, verdict, exp, flags)

    if op == "in":
        verdict, flags = eval_in_comparison(constraint.value, query_val)
        exp = f"Проверка '{constraint.subject}' in {constraint.value} -> {verdict.value}"
        return ConstraintCheckResult(constraint.constraint_id, constraint.subject, constraint.severity, verdict, exp, flags)

    return ConstraintCheckResult(
        constraint_id=constraint.constraint_id,
        subject=constraint.subject,
        severity=constraint.severity,
        verdict=ConstraintVerdict.UNKNOWN,
        explanation=f"Неподдерживаемый оператор '{constraint.operator}'",
        flags=["unsupported_operator"]
    )
