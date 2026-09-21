import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import init_db
from app.seed.seed_data import seed_database
from app.routes import api_router
from app.schemas.common import ErrorResponse

logger = logging.getLogger("uvicorn.error")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan handler: runs on startup and shutdown."""
    logger.info("Initializing SkillGraph database and schema...")
    try:
        init_db()
        seed_database()
        logger.info("Database initialized and seeded successfully.")
    except Exception as e:
        logger.error(f"Error during database initialization or seeding: {e}")
    yield
    logger.info("SkillGraph Backend shutting down.")


app = FastAPI(
    title="SkillGraph API",
    description="Backend API service for SkillGraph - student evidence, skill graph visualization, role gap analysis, and missions.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# CORS Configuration for Student 1 (Frontend Developer)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for local dev and preview deployments
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(api_router)


# --------------------------------------------------
# Standardized Error Exception Handlers
# --------------------------------------------------

def _serialize_error(err: ErrorResponse) -> dict:
    return err.model_dump() if hasattr(err, "model_dump") else err.dict()


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Ensures HTTP exceptions adhere to { success: false, data: null, message: ... }"""
    return JSONResponse(
        status_code=exc.status_code,
        content=_serialize_error(ErrorResponse(
            success=False,
            data=None,
            message=str(exc.detail),
        )),
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Formats Pydantic validation errors into standard error format."""
    error_messages = []
    for error in exc.errors():
        location = " -> ".join(str(loc) for loc in error.get("loc", []))
        msg = error.get("msg", "Invalid value")
        error_messages.append(f"{location}: {msg}")
    
    formatted_message = "; ".join(error_messages) if error_messages else "Request validation failed"
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=_serialize_error(ErrorResponse(
            success=False,
            data=None,
            message=formatted_message,
        )),
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Catches unhandled exceptions and formats standard 500 error response."""
    logger.exception(f"Unhandled Server Error: {exc}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content=_serialize_error(ErrorResponse(
            success=False,
            data=None,
            message="Internal Server Error. Please inspect server logs.",
        )),
    )


@app.get("/", tags=["Health"])
def root():
    return {
        "success": True,
        "data": {
            "name": settings.APP_NAME,
            "version": "1.0.0",
            "environment": settings.ENVIRONMENT,
            "docs_url": "/docs",
            "openapi_url": "/openapi.json",
        },
        "message": "SkillGraph API is up and running.",
    }
