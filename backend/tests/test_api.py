from datetime import UTC, datetime

from fastapi.testclient import TestClient

from backend.app.main import create_app


def test_default_settings_are_returned_when_database_is_empty(tmp_path) -> None:
    client = TestClient(create_app(db_path=tmp_path / "pomodoro.db"))
    response = client.get("/api/settings")

    assert response.status_code == 200
    assert response.json() == {
        "focus_minutes": 25,
        "short_break_minutes": 5,
    }


def test_settings_can_be_saved_and_loaded(tmp_path) -> None:
    client = TestClient(create_app(db_path=tmp_path / "pomodoro.db"))
    save_response = client.put(
        "/api/settings",
        json={"focus_minutes": 30, "short_break_minutes": 10},
    )

    assert save_response.status_code == 200
    assert save_response.json() == {
        "focus_minutes": 30,
        "short_break_minutes": 10,
    }

    load_response = client.get("/api/settings")
    assert load_response.status_code == 200
    assert load_response.json() == {
        "focus_minutes": 30,
        "short_break_minutes": 10,
    }


def test_completed_session_is_saved_and_returned_in_recent_history(tmp_path) -> None:
    client = TestClient(create_app(db_path=tmp_path / "pomodoro.db"))
    completed_at = datetime(2026, 4, 13, 16, 45, tzinfo=UTC).isoformat()

    create_response = client.post(
        "/api/sessions",
        json={
            "phase": "focus",
            "duration_seconds": 1500,
            "note": "Drafted the assignment PRD",
            "completed_at": completed_at,
        },
    )

    assert create_response.status_code == 201
    assert create_response.json()["note"] == "Drafted the assignment PRD"
    assert create_response.json()["phase"] == "focus"

    list_response = client.get("/api/sessions")

    assert list_response.status_code == 200
    assert list_response.json()[0]["duration_seconds"] == 1500
    assert list_response.json()[0]["note"] == "Drafted the assignment PRD"
    assert datetime.fromisoformat(
        list_response.json()[0]["completed_at"].replace("Z", "+00:00")
    ) == datetime.fromisoformat(completed_at)


def test_invalid_session_payload_is_rejected(tmp_path) -> None:
    client = TestClient(create_app(db_path=tmp_path / "pomodoro.db"))
    response = client.post(
        "/api/sessions",
        json={
            "phase": "focus",
            "duration_seconds": 0,
            "note": "bad payload",
            "completed_at": datetime.now(UTC).isoformat(),
        },
    )

    assert response.status_code == 422
