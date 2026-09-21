"""
Proxy package mapping 'ai_engine' to 'ai-engine' for Python import compatibility.
Enables standard 'from ai_engine import ...' syntax while maintaining the prompt-specified 'ai-engine/' directory.
"""

import sys
from pathlib import Path

# Add ai-engine directory to sys.path at runtime
_ai_engine_dir = Path(__file__).resolve().parent.parent / "ai-engine"
if str(_ai_engine_dir) not in sys.path:
    sys.path.insert(0, str(_ai_engine_dir))

# Explicit imports with type: ignore for static analyzers (Pylance/Pyright)
from validators import (  # type: ignore
    EvidenceType,
    ConfidenceLevel,
    SkillCategory,
    EvidenceItem,
    ExtractedSkill,
    SkillExtractionResult,
    AcademicRecord,
    HackathonRecord,
    SkillGapDetail,
    GapAnalysisResult,
    ProjectMission,
    StudentProfileInput,
)
from ollama_client import (  # type: ignore
    OllamaClient,
    OllamaClientError,
    OllamaConnectionError,
    OllamaTimeoutError,
    OllamaInvalidResponseError,
)
from skill_mapper import SkillMapper  # type: ignore
from extractor import SkillExtractor  # type: ignore
from gap_engine import GapEngine  # type: ignore
from mission_generator import MissionGenerator  # type: ignore
from prompts import (  # type: ignore
    SKILL_EXTRACTION_SYSTEM_PROMPT,
    SKILL_EXTRACTION_USER_PROMPT,
    GAP_ANALYSIS_SYSTEM_PROMPT,
    GAP_ANALYSIS_USER_PROMPT,
    MISSION_GENERATION_SYSTEM_PROMPT,
    MISSION_GENERATION_USER_PROMPT,
)

__all__ = [
    "EvidenceType",
    "ConfidenceLevel",
    "SkillCategory",
    "EvidenceItem",
    "ExtractedSkill",
    "SkillExtractionResult",
    "AcademicRecord",
    "HackathonRecord",
    "SkillGapDetail",
    "GapAnalysisResult",
    "ProjectMission",
    "StudentProfileInput",
    "OllamaClient",
    "OllamaClientError",
    "OllamaConnectionError",
    "OllamaTimeoutError",
    "OllamaInvalidResponseError",
    "SkillMapper",
    "SkillExtractor",
    "GapEngine",
    "MissionGenerator",
    "SKILL_EXTRACTION_SYSTEM_PROMPT",
    "SKILL_EXTRACTION_USER_PROMPT",
    "GAP_ANALYSIS_SYSTEM_PROMPT",
    "GAP_ANALYSIS_USER_PROMPT",
    "MISSION_GENERATION_SYSTEM_PROMPT",
    "MISSION_GENERATION_USER_PROMPT",
]
