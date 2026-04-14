from pathlib import Path

from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware

from backend.app.schemas import SessionCreate, SessionRecord, Settings
from backend.app.store import PomodoroStore


def create_app(db_path: Path | None = None) -> FastAPI:
    app = FastAPI(title="Pomodoro MCP Demo")
    store = PomodoroStore(db_path or Path("backend/data/pomodoro.db"))
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/api/settings", response_model=Settings)
    def get_settings() -> Settings:
        return store.load_settings()

    @app.put("/api/settings", response_model=Settings)
    def update_settings(settings: Settings) -> Settings:
        return store.save_settings(
            focus_minutes=settings.focus_minutes,
            short_break_minutes=settings.short_break_minutes,
        )

    @app.get("/api/sessions", response_model=list[SessionRecord])
    def get_sessions() -> list[SessionRecord]:
        return store.list_sessions()

    @app.post(
        "/api/sessions",
        response_model=SessionRecord,
        status_code=status.HTTP_201_CREATED,
    )
    def create_session(payload: SessionCreate) -> SessionRecord:
        return store.create_session(
            phase=payload.phase,
            duration_seconds=payload.duration_seconds,
            note=payload.note,
            completed_at=payload.completed_at.isoformat(),
        )

    return app


app = create_app()
