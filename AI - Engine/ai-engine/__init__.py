"""
SkillGraph AI Engine Package.
Exposes the core intelligence layer interfaces for Student 2 (FastAPI) and services.
"""

import sys
from pathlib import Path

# Add current directory to sys.path to enable smooth relative/direct imports
_current_dir = str(Path(__file__).resolve().parent)
if _current_dir not in sys.path:
    sys.path.insert(0, _current_dir)

from validators import (
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
from ollama_client import (
    OllamaClient,
    OllamaClientError,
    OllamaConnectionError,
    OllamaTimeoutError,
    OllamaInvalidResponseError,
)
from skill_mapper import SkillMapper
from extractor import SkillExtractor
from gap_engine import GapEngine
from mission_generator import MissionGenerator

__all__ = [
    "OllamaClient",
    "OllamaClientError",
    "OllamaConnectionError",
    "OllamaTimeoutError",
    "OllamaInvalidResponseError",
    "SkillExtractor",
    "SkillMapper",
    "GapEngine",
    "MissionGenerator",
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
]
