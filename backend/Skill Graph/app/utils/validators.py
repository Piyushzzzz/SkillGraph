import re
from typing import Optional

GRADE_PATTERN = re.compile(r"^(O|A\+|A|B\+|B|C\+|C|D|P|F|S|[0-9]{1,3}(\.[0-9]+)?%?)$", re.IGNORECASE)
URL_PATTERN = re.compile(r"^https?://[a-zA-Z0-9\-._~:/?#\[\]@!$&'()*+,;=]+$", re.IGNORECASE)


def validate_cgpa_value(v: Optional[float]) -> Optional[float]:
    if v is None:
        return v
    if not (0.0 <= v <= 10.0):
        raise ValueError("CGPA must be between 0.0 and 10.0")
    return round(v, 2)


def validate_semester_value(v: Optional[int]) -> Optional[int]:
    if v is None:
        return v
    if not (1 <= v <= 12):
        raise ValueError("Semester must be between 1 and 12")
    return v


def validate_grade_value(v: str) -> str:
    cleaned = v.strip().upper()
    if not GRADE_PATTERN.match(cleaned):
        raise ValueError(f"Invalid grade '{v}'. Expected academic grade (e.g. 'A+', 'O', 'B') or percentage.")
    return cleaned


def validate_url_value(v: Optional[str]) -> Optional[str]:
    if v is None or v == "":
        return None
    cleaned = v.strip()
    if not URL_PATTERN.match(cleaned):
        raise ValueError(f"Invalid URL '{v}'. Must be a valid HTTP or HTTPS URL.")
    return cleaned


def validate_evidence_type_value(v: str) -> str:
    cleaned = v.strip().lower()
    allowed = {"project", "hackathon", "certificate"}
    if cleaned not in allowed:
        raise ValueError(f"Invalid evidence type '{v}'. Allowed types: {', '.join(sorted(allowed))}")
    return cleaned
