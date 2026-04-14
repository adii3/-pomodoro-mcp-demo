from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


Phase = Literal["focus", "break"]


class Settings(BaseModel):
    focus_minutes: int = Field(ge=1, le=180)
    short_break_minutes: int = Field(ge=1, le=60)


class SessionCreate(BaseModel):
    phase: Phase
    duration_seconds: int = Field(ge=1, le=60 * 60 * 6)
    note: str = Field(default="", max_length=200)
    completed_at: datetime


class SessionRecord(SessionCreate):
    id: int

