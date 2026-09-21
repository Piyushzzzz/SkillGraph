from typing import Generic, TypeVar, Optional, Any
from pydantic import BaseModel, ConfigDict

T = TypeVar("T")


class APIResponse(BaseModel, Generic[T]):
    """
    Standardized response envelope across the entire API.
    Format:
    {
        "success": true,
        "data": { ... },
        "message": "..."
    }
    """
    success: bool = True
    data: Optional[T] = None
    message: str = "Operation completed successfully"

    model_config = ConfigDict(arbitrary_types_allowed=True, from_attributes=True)


class ErrorResponse(BaseModel):
    """
    Standardized error envelope.
    Format:
    {
        "success": false,
        "data": null,
        "message": "..."
    }
    """
    success: bool = False
    data: Optional[Any] = None
    message: str
