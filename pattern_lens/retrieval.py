"""
PATTERN LENS v0.1 — Query Parsing and Candidate Retrieval
Pure Python Standard Library (Python 3.10+)

Гарантии:
- Чистая нормализация русского и английского текстов без внешних зависимостей.
- Детерминированное извлечение явных идентификаторов паттернов (pat-...).
- Разделение совпадений по чётким уровням (Tiers 0-3):
  * Tier 0: Явный ID паттерна
  * Tier 1: Совпадение целевого тезиса или ядра намерения (Intent/Claim)
  * Tier 2: Совпадение по домену и инженерным тегам
  * Tier 3: Текстовое пересечение ключевых терминов
"""

import re
from typing import List, Dict, Set, Optional, Tuple, Any
from .models import ParsedQuery, PatternRecord

# Минимальные списки стоп-слов для инженерных запросов (RU / EN)
_STOP_WORDS: Set[str] = {
    "и", "в", "во", "не", "что", "он", "на", "я", "с", "со", "как", "а", "то", "все", "она",
    "так", "его", "но", "да", "ты", "к", "у", "же", "вы", "за", "бы", "по", "только", "ее",
    "мне", "было", "вот", "от", "меня", "еще", "нет", "о", "из", "ему", "теперь", "когда",
    "даже", "ну", "вдруг", "ли", "если", "уже", "или", "ни", "быть", "был", "него", "до",
    "вас", "нибудь", "опять", "уж", "вам", "ведь", "там", "потом", "себя", "ничего", "ей",
    "может", "они", "тут", "где", "есть", "надо", "ней", "для", "мы", "тебя", "их", "чем",
    "была", "сам", "чтоб", "без", "будто", "чего", "раз", "тоже", "себе", "под", "будет",
    "a", "an", "the", "and", "or", "of", "to", "in", "on", "at", "by", "for", "with",
    "about", "against", "between", "into", "through", "during", "before", "after",
    "above", "below", "from", "up", "down", "is", "are", "was", "were", "be", "been",
    "being", "have", "has", "had", "do", "does", "did", "can", "could", "should", "would"
}

_ID_PATTERN = re.compile(r"\b(pat-[a-z0-9-]+)\b", re.IGNORECASE)
_TAG_PATTERN = re.compile(r"#([a-z0-9_\-]+)", re.IGNORECASE)
_TOKEN_PATTERN = re.compile(r"[a-zа-яё0-9_\-]+", re.IGNORECASE)


def normalize_token(token: str) -> str:
    """Нормализует токен к нижнему регистру и очищает края."""
    return token.strip().lower()


def tokenize_text(text: str) -> List[str]:
    """Извлекает токены из произвольного текста без стоп-слов."""
    if not text:
        return []
    raw_tokens = _TOKEN_PATTERN.findall(text)
    filtered: List[str] = []
    for tok in raw_tokens:
        cleaned = normalize_token(tok)
        if len(cleaned) > 1 and cleaned not in _STOP_WORDS:
            filtered.append(cleaned)
    return filtered


def parse_query(
    raw_query: str,
    requested_constraints: Optional[Dict[str, Any]] = None,
    declared_context: Optional[Dict[str, Any]] = None,
    inventory_is_complete: bool = False,
    target_claim_ids: Optional[Set[str]] = None
) -> ParsedQuery:
    """Парсит входящий инженерный запрос агента в структурированный ParsedQuery."""
    raw = raw_query.strip()
    normalized = " ".join(raw.lower().split())

    # Извлечение явных ID паттернов
    explicit_ids = [normalize_token(m) for m in _ID_PATTERN.findall(raw)]

    # Извлечение тегов (#safety, #telemetry и т.д.)
    tags = [normalize_token(m) for m in _TAG_PATTERN.findall(raw)]

    # Все токены
    tokens = tokenize_text(raw)

    # Интенты (исключаем явные id и теги)
    id_set = set(explicit_ids)
    tag_set = set(tags)
    intent_tokens = [t for t in tokens if t not in id_set and t not in tag_set]

    return ParsedQuery(
        raw=raw,
        normalized=normalized,
        tokens=tokens,
        intent_tokens=intent_tokens,
        tags=tags,
        explicit_ids=explicit_ids,
        requested_constraints=requested_constraints or {},
        target_claim_ids=target_claim_ids or set(),
        declared_context=declared_context or {},
        inventory_is_complete=inventory_is_complete
    )


def match_pattern(
    pattern: PatternRecord,
    query: ParsedQuery
) -> Tuple[bool, int, str, List[str]]:
    """
    Определяет, релевантен ли паттерн запросу, и присваивает match_tier (0-3).
    
    Tiers:
    - 0: Explicit ID match (прямой запрос паттерна по ID)
    - 1: Target Claim match (запрос содержит целевой claim_id, поддерживаемый паттерном)
    - 2: Tag & Domain match (пересечение тегов или совпадение домена)
    - 3: Token Overlap match (пересечение терминов в названии, описании, интенте)
    
    Возвращает: (is_match, match_tier, match_type, matched_tokens)
    """
    pat_id_norm = pattern.pattern_id.strip().lower()

    # Tier 0: Прямое указание ID паттерна
    for exp_id in query.explicit_ids:
        if exp_id == pat_id_norm:
            return True, 0, "EXPLICIT_ID_MATCH", [exp_id]

    # Tier 1: Целевой тезис запроса
    if query.target_claim_ids:
        pat_claims = set(pattern.mandatory_claims.keys())
        intersect_claims = query.target_claim_ids.intersection(pat_claims)
        if intersect_claims:
            return True, 1, "TARGET_CLAIM_MATCH", sorted(list(intersect_claims))

    # Подготовка токенов паттерна
    pattern_tags = {normalize_token(t) for t in pattern.tags}
    pattern_domain = normalize_token(pattern.domain)

    # Tier 2: Совпадение по инженерным тегам или домену
    query_tags = set(query.tags)
    matched_tags = query_tags.intersection(pattern_tags)
    if matched_tags:
        return True, 2, "TAG_MATCH", sorted(list(matched_tags))
    
    # Если в запросе явно назван домен
    if pattern_domain and pattern_domain in query.tokens:
        return True, 2, "DOMAIN_MATCH", [pattern_domain]

    # Tier 3: Текстовое пересечение ключевых терминов
    name_tokens = set(tokenize_text(pattern.name))
    intent_tokens = set(tokenize_text(pattern.intent))
    desc_tokens = set(tokenize_text(pattern.description))
    all_pat_tokens = name_tokens.union(intent_tokens).union(desc_tokens).union(pattern_tags)

    query_intent_set = set(query.intent_tokens if query.intent_tokens else query.tokens)
    matched_text_tokens = query_intent_set.intersection(all_pat_tokens)

    # Если есть хотя бы 1 значимый токен (или если запрос пустой, все считаются кандидатами)
    if not query.raw:
        return True, 3, "BROAD_SCAN", []

    if matched_text_tokens:
        # Приоритет совпадений в названии и интенте
        core_matches = matched_text_tokens.intersection(name_tokens.union(intent_tokens))
        match_type = "NAME_OR_INTENT_TOKEN_MATCH" if core_matches else "DESCRIPTION_TOKEN_MATCH"
        return True, 3, match_type, sorted(list(matched_text_tokens))

    return False, 999, "NO_MATCH", []
