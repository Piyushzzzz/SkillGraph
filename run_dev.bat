@echo off
title SkillGraph Full-Stack Launcher
echo Starting SkillGraph (AI Engine + Backend + Frontend)...
if exist .venv\Scripts\python.exe (
    .venv\Scripts\python.exe start_all.py
) else (
    python start_all.py
)
pause
