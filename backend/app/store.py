from __future__ import annotations

import sqlite3
from pathlib import Path

from backend.app.schemas import SessionRecord, Settings


DEFAULT_SETTINGS = Settings(focus_minutes=25, short_break_minutes=5)


class PomodoroStore:
    def __init__(self, db_path: Path) -> None:
        self.db_path = db_path
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        self._initialize()

    def _connect(self) -> sqlite3.Connection:
        connection = sqlite3.connect(self.db_path)
        connection.row_factory = sqlite3.Row
        return connection

    def _initialize(self) -> None:
        with self._connect() as connection:
            connection.execute(
                """
                CREATE TABLE IF NOT EXISTS settings (
                    singleton_id INTEGER PRIMARY KEY CHECK (singleton_id = 1),
                    focus_minutes INTEGER NOT NULL,
                    short_break_minutes INTEGER NOT NULL
                )
                """
            )
            connection.execute(
                """
                CREATE TABLE IF NOT EXISTS sessions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    phase TEXT NOT NULL,
                    duration_seconds INTEGER NOT NULL,
                    note TEXT NOT NULL,
                    completed_at TEXT NOT NULL
                )
                """
            )

    def load_settings(self) -> Settings:
        with self._connect() as connection:
            row = connection.execute(
                """
                SELECT focus_minutes, short_break_minutes
                FROM settings
                WHERE singleton_id = 1
                """
            ).fetchone()

        if row is None:
            return DEFAULT_SETTINGS

        return Settings(
            focus_minutes=row["focus_minutes"],
            short_break_minutes=row["short_break_minutes"],
        )

    def save_settings(self, focus_minutes: int, short_break_minutes: int) -> Settings:
        with self._connect() as connection:
            connection.execute(
                """
                INSERT INTO settings (singleton_id, focus_minutes, short_break_minutes)
                VALUES (1, ?, ?)
                ON CONFLICT(singleton_id)
                DO UPDATE SET
                    focus_minutes = excluded.focus_minutes,
                    short_break_minutes = excluded.short_break_minutes
                """,
                (focus_minutes, short_break_minutes),
            )

        return Settings(
            focus_minutes=focus_minutes,
            short_break_minutes=short_break_minutes,
        )

    def list_sessions(self) -> list[SessionRecord]:
        with self._connect() as connection:
            rows = connection.execute(
                """
                SELECT id, phase, duration_seconds, note, completed_at
                FROM sessions
                ORDER BY completed_at DESC, id DESC
                """
            ).fetchall()

        return [
            SessionRecord(
                id=row["id"],
                phase=row["phase"],
                duration_seconds=row["duration_seconds"],
                note=row["note"],
                completed_at=row["completed_at"],
            )
            for row in rows
        ]

    def create_session(
        self,
        *,
        phase: str,
        duration_seconds: int,
        note: str,
        completed_at: str,
    ) -> SessionRecord:
        with self._connect() as connection:
            cursor = connection.execute(
                """
                INSERT INTO sessions (phase, duration_seconds, note, completed_at)
                VALUES (?, ?, ?, ?)
                """,
                (phase, duration_seconds, note.strip(), completed_at),
            )
            session_id = cursor.lastrowid

        return SessionRecord(
            id=session_id,
            phase=phase,
            duration_seconds=duration_seconds,
            note=note.strip(),
            completed_at=completed_at,
        )
