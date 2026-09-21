"""
Reusable client for interacting with local Ollama LLM instances.
Provides robust connection, timeout, and JSON validation handling.
"""

import os
import json
import time
import logging
from typing import Optional, Dict, Any, Type, TypeVar, Tuple
import httpx
from dotenv import load_dotenv
from pydantic import BaseModel, ValidationError

load_dotenv()

logger = logging.getLogger("ai_engine.ollama_client")

T = TypeVar("T", bound=BaseModel)


class OllamaClientError(Exception):
    """Base exception for Ollama client errors."""
    pass


class OllamaConnectionError(OllamaClientError):
    """Raised when Ollama cannot be reached (offline or wrong URL)."""
    pass


class OllamaTimeoutError(OllamaClientError):
    """Raised when an Ollama request times out."""
    pass


class OllamaInvalidResponseError(OllamaClientError):
    """Raised when Ollama returns an empty or invalid/unparseable JSON response."""
    pass


class OllamaClient:
    """
    Client for interacting with local Ollama instances.
    Handles generate and generate_json with timeouts, retries, and strict schema validation.
    """

    _cached_status: Optional[Tuple[float, bool]] = None

    def __init__(
        self,
        base_url: Optional[str] = None,
        model: Optional[str] = None,
        timeout_seconds: Optional[float] = None,
    ):
        self.base_url = (base_url or os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")).rstrip("/")
        self.model = model or os.getenv("OLLAMA_MODEL", "llama3")
        try:
            self.timeout_seconds = float(timeout_seconds or os.getenv("OLLAMA_TIMEOUT_SECONDS", "30.0"))
        except (ValueError, TypeError):
            self.timeout_seconds = 30.0

    def is_available(self, timeout: float = 0.2) -> bool:
        """
        Check if the Ollama service is reachable and responsive.
        Uses fast socket probe and 10-second cache to prevent compounding latency on fallbacks.
        """
        now = time.time()
        if self._cached_status is not None:
            ts, available = self._cached_status
            if now - ts < 10.0:
                return available

        import socket
        from urllib.parse import urlparse
        try:
            parsed = urlparse(self.base_url)
            host = parsed.hostname or "127.0.0.1"
            if host == "localhost":
                host = "127.0.0.1"
            port = parsed.port or 11434
            
            s = socket.create_connection((host, port), timeout=timeout)
            s.close()
            self._cached_status = (now, True)
            return True
        except Exception:
            self._cached_status = (now, False)
            return False

    def generate(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        temperature: float = 0.1,
    ) -> str:
        """
        Send a generation request to Ollama and return raw text.
        """
        url = f"{self.base_url}/api/generate"
        payload: Dict[str, Any] = {
            "model": self.model,
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": temperature,
            },
        }
        if system_prompt:
            payload["system"] = system_prompt

        try:
            with httpx.Client(timeout=self.timeout_seconds) as client:
                res = client.post(url, json=payload)
                res.raise_for_status()
                data = res.json()
                response_text = data.get("response", "").strip()
                if not response_text:
                    raise OllamaInvalidResponseError("Ollama returned an empty response")
                return response_text

        except httpx.ConnectError as e:
            logger.warning(f"Failed to connect to Ollama at {self.base_url}: {e}")
            raise OllamaConnectionError(f"Could not connect to Ollama at {self.base_url}: {e}") from e
        except httpx.TimeoutException as e:
            logger.warning(f"Ollama request timed out after {self.timeout_seconds}s: {e}")
            raise OllamaTimeoutError(f"Ollama generation timed out after {self.timeout_seconds}s") from e
        except httpx.HTTPStatusError as e:
            logger.warning(f"Ollama HTTP error {e.response.status_code}: {e.response.text}")
            raise OllamaClientError(f"Ollama HTTP error {e.response.status_code}") from e
        except Exception as e:
            if isinstance(e, OllamaClientError):
                raise
            logger.error(f"Unexpected error calling Ollama: {e}")
            raise OllamaClientError(f"Unexpected error: {e}") from e

    def generate_json(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        model_cls: Optional[Type[T]] = None,
        temperature: float = 0.0,
    ) -> Any:
        """
        Request structured JSON output from Ollama.
        Validates output using Pydantic model_cls if provided.
        """
        url = f"{self.base_url}/api/generate"
        payload: Dict[str, Any] = {
            "model": self.model,
            "prompt": prompt,
            "stream": False,
            "format": "json",
            "options": {
                "temperature": temperature,
            },
        }
        if system_prompt:
            payload["system"] = system_prompt

        try:
            with httpx.Client(timeout=self.timeout_seconds) as client:
                res = client.post(url, json=payload)
                res.raise_for_status()
                data = res.json()
                raw_text = data.get("response", "").strip()

                if not raw_text:
                    raise OllamaInvalidResponseError("Ollama returned an empty JSON response")

                # Parse JSON
                try:
                    parsed_json = json.loads(raw_text)
                except json.JSONDecodeError as jde:
                    # Attempt to extract JSON substring if fenced in markdown codeblock
                    cleaned = self._extract_json_substring(raw_text)
                    try:
                        parsed_json = json.loads(cleaned)
                    except json.JSONDecodeError:
                        raise OllamaInvalidResponseError(f"Failed to parse JSON from response: {raw_text}") from jde

                # If a Pydantic model is supplied, validate it
                if model_cls is not None:
                    try:
                        return model_cls.model_validate(parsed_json)
                    except ValidationError as ve:
                        raise OllamaInvalidResponseError(f"Pydantic validation failed for {model_cls.__name__}: {ve}") from ve

                return parsed_json

        except httpx.ConnectError as e:
            raise OllamaConnectionError(f"Could not connect to Ollama at {self.base_url}: {e}") from e
        except httpx.TimeoutException as e:
            raise OllamaTimeoutError(f"Ollama generation timed out after {self.timeout_seconds}s") from e
        except httpx.HTTPStatusError as e:
            raise OllamaClientError(f"Ollama HTTP error {e.response.status_code}") from e
        except Exception as e:
            if isinstance(e, OllamaClientError):
                raise
            raise OllamaClientError(f"Unexpected error: {e}") from e

    def _extract_json_substring(self, text: str) -> str:
        """Helper to extract JSON from markdown fences or text."""
        text = text.strip()
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[1].split("```")[0].strip()
        return text
