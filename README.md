# Pomodoro MCP Demo

Small React + FastAPI pomodoro application built to demonstrate MCP and skills workflow for the assignment.

## Workflow Artifacts

- `docs/prd-pomodoro-app.md`
- `docs/architecture-review.md`
- `docs/video-checklist.md`
- `issues/`

## Project Structure

- `backend/` FastAPI API with SQLite persistence
- `frontend/` React timer UI
- `docs/` PRD, architecture review, and demo notes
- `issues/` vertical-slice issue drafts for GitHub

## Run Locally

### Backend setup

- `uv sync --group dev --project .`
- `uv run uvicorn backend.app.main:app --host 127.0.0.1 --port 8000`

### Frontend setup

- `npm.cmd install --prefix frontend`
- `npm.cmd run dev --prefix frontend -- --host 127.0.0.1 --port 5173`

The frontend calls `http://127.0.0.1:8000` by default. Override with `VITE_API_BASE_URL` if needed.

## Verification

- `uv run pytest`
- `npm.cmd run test --prefix frontend`
- `npm.cmd run build --prefix frontend`

## Supported Behavior

- Single-user timer with focus and break modes
- Manual start, pause, resume, reset, complete, and break transitions
- Persistent settings for focus and short break durations
- Completed session history with optional notes

## Out of Scope

- Authentication
- Automatic work/break cycling
- Notifications and analytics
