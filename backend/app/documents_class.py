from datetime import datetime
from typing import Optional

from fastapi import File, UploadFile
from pydantic import BaseModel, Field


class DocRequest(BaseModel):
    id_: Optional[int] = Field(description="ID is not needed on create", default=None)
    raw_text: str = Field(min_length=3, max_length=100)
    created_at: Optional[str] = Field(
        description="Datetime is already calculated at creation time",
        default=str(datetime.now().date()),
    )

    model_config = {
        "json_schema_extra": {
            "example": {
                "raw_text": "This is a new content for a card",
                "created_at": "2025-04-05",
            }
        }
    }


class DocRequestFile(BaseModel):
    file: UploadFile = File()
