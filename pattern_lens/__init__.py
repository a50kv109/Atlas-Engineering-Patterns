"""
PATTERN LENS v0.1 — Engineering Pattern Discovery & Retrieval Engine
Pure Python Standard Library (Python 3.10+)
"""

from .models import (
    PatternRecord, EvidenceRecord, ConstraintRecord, RelationRecord,
    ParsedQuery, ConstraintCheckResult, Candidate, RankedCandidate,
    DiagnosticCandidate, SearchResult, LifecycleStatus, ConstraintVerdict,
    ConstraintSeverity, EvidenceResult, EvidenceSeverity, SearchEligibility,
    ApplicationAuthorization
)
from .constraints import (
    check_constraint, eval_requires, eval_numeric_comparison, eval_in_comparison
)
from .evidence import (
    evaluate_evidence_and_authorization, filter_pattern_evidence
)
from .retrieval import parse_query, match_pattern
from .ranking import partition_and_rank_candidates
from .adapter import (
    PatternSourceAdapter, InMemoryPatternAdapter, AtlasCanonicalAdapter
)
from .engine import PatternLensEngine

__version__ = "0.1.0"
__all__ = [
    "PatternRecord",
    "EvidenceRecord",
    "ConstraintRecord",
    "RelationRecord",
    "ParsedQuery",
    "ConstraintCheckResult",
    "Candidate",
    "RankedCandidate",
    "DiagnosticCandidate",
    "SearchResult",
    "LifecycleStatus",
    "ConstraintVerdict",
    "ConstraintSeverity",
    "EvidenceResult",
    "EvidenceSeverity",
    "SearchEligibility",
    "ApplicationAuthorization",
    "check_constraint",
    "eval_requires",
    "eval_numeric_comparison",
    "eval_in_comparison",
    "evaluate_evidence_and_authorization",
    "filter_pattern_evidence",
    "parse_query",
    "match_pattern",
    "partition_and_rank_candidates",
    "PatternSourceAdapter",
    "InMemoryPatternAdapter",
    "AtlasCanonicalAdapter",
    "PatternLensEngine",
    "__version__",
]
