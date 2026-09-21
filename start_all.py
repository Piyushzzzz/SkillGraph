"""
SkillGraph Full-Stack Launcher (Unified Orchestration)
Runs the integrated subsystems:
  1. AI Engine (Student 3) - Embedded in backend with Ollama / Deterministic Fallback
  2. FastAPI Backend (Student 2) - http://127.0.0.1:8000 (Docs: /docs)
  3. React + Vite Frontend (Student 1) - http://localhost:3000
"""

import sys
import os
import subprocess
import time
import signal
from pathlib import Path

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

ROOT_DIR = Path(__file__).resolve().parent
VENV_PYTHON = ROOT_DIR / ".venv" / "Scripts" / "python.exe"
if not VENV_PYTHON.exists():
    VENV_PYTHON = Path(sys.executable)

BACKEND_DIR = ROOT_DIR / "backend" / "Skill Graph"
FRONTEND_DIR = ROOT_DIR / "forntend"


def print_banner():
    print("=" * 70)
    print("  🚀 SKILLGRAPH INTEGRATED FULL-STACK ENVIRONMENT")
    print("=" * 70)
    print("  • AI Engine:   Intelligence Layer (SkillExtractor, GapEngine, iNSIGHTS)")
    print("  • Backend:     FastAPI REST Service (Port 8000)")
    print("  • Frontend:    React 19 + Vite UI (Port 3000)")
    print("=" * 70)


def main():
    print_banner()

    # 1. Start FastAPI Backend
    print("\n[1/2] Launching FastAPI Backend on http://127.0.0.1:8000 ...")
    backend_env = os.environ.copy()
    backend_env["PYTHONPATH"] = str(ROOT_DIR / "AI - Engine") + os.pathsep + str(BACKEND_DIR)

    backend_proc = subprocess.Popen(
        [
            str(VENV_PYTHON),
            "-m",
            "uvicorn",
            "app.main:app",
            "--host",
            "127.0.0.1",
            "--port",
            "8000",
            "--reload",
        ],
        cwd=str(BACKEND_DIR),
        env=backend_env,
    )

    # Allow backend to initialize database & seed tables
    time.sleep(2.5)

    # 2. Start Vite Frontend
    print("[2/2] Launching React + Vite Frontend on http://localhost:3000 ...")
    # Use npx / npm via shell for Windows compatibility
    frontend_proc = subprocess.Popen(
        "npm run dev",
        cwd=str(FRONTEND_DIR),
        shell=True,
    )

    print("\n" + "=" * 70)
    print("  ✅ SKILLGRAPH SYSTEM IS FULLY OPERATIONAL!")
    print("=" * 70)
    print("  • Web Application:  http://localhost:3000")
    print("  • OpenAPI Swagger:  http://127.0.0.1:8000/docs")
    print("  • ReDoc Schema:     http://127.0.0.1:8000/redoc")
    print("  • Press Ctrl+C to terminate both servers.")
    print("=" * 70 + "\n")

    def shutdown(sig, frame):
        print("\nStopping SkillGraph services...")
        try:
            backend_proc.terminate()
        except Exception:
            pass
        try:
            frontend_proc.terminate()
        except Exception:
            pass
        sys.exit(0)

    signal.signal(signal.SIGINT, shutdown)
    signal.signal(signal.SIGTERM, shutdown)

    try:
        while True:
            time.sleep(1)
            if backend_proc.poll() is not None:
                print("Backend service exited.")
                break
            if frontend_proc.poll() is not None:
                print("Frontend service exited.")
                break
    except KeyboardInterrupt:
        shutdown(None, None)


if __name__ == "__main__":
    main()
