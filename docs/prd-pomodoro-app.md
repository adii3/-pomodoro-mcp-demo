## Problem Statement

Students and solo developers often want a simple pomodoro timer that helps them stay focused and keep a record of completed work sessions. Many timer apps are either too minimal to preserve useful history or too feature-heavy for a quick proof of concept. For this assignment, the goal is to build a small, explainable product that demonstrates a realistic software workflow across planning, implementation, testing, and architecture review.

## Solution

Build a single-user pomodoro web app with a React frontend and FastAPI backend. The frontend owns the active countdown experience and manual phase controls. The backend persists timer settings and completed sessions in SQLite, including a short note for each finished focus or break session. The app presents one main screen with current timer controls, editable durations, and a recent history list.

## User Stories

1. As a solo user, I want to start a focus timer, so that I can begin a pomodoro session quickly.
2. As a solo user, I want to pause and resume the timer, so that interruptions do not force me to restart the session.
3. As a solo user, I want to reset the current timer, so that I can abandon the current countdown cleanly.
4. As a solo user, I want to manually mark a focus session complete, so that I control when a finished session is recorded.
5. As a solo user, I want to start a break timer manually after a focus session, so that the app supports a simple pomodoro rhythm without automatic cycling.
6. As a solo user, I want to configure my focus duration, so that the timer matches my preferred work interval.
7. As a solo user, I want to configure my short break duration, so that the break timer matches my preferred rest interval.
8. As a solo user, I want the app to remember my settings, so that I do not re-enter durations every time I open it.
9. As a solo user, I want to save a short note with a completed session, so that I can remember what I worked on.
10. As a solo user, I want to see recent completed sessions, so that I can review my latest focus and break activity.
11. As a developer, I want the backend to persist only settings and completed sessions, so that live timer complexity stays in the browser.
12. As a developer, I want a small SQLite-backed API, so that the project remains easy to explain and run locally.
13. As a developer, I want the project covered by behavior-focused tests, so that the supported workflow is trustworthy.
14. As a developer, I want the codebase organized into clear frontend and backend boundaries, so that the architecture review step is meaningful.

## Implementation Decisions

- Use a single-user product with no authentication.
- Use React for the frontend and FastAPI for the backend.
- Run the active timer in the browser instead of on the server.
- Store settings and completed sessions in a SQLite database on disk.
- Keep one primary screen with timer controls, settings, and recent session history.
- Support manual transitions only: start, pause, resume, reset, complete, and start break.
- Persist completed sessions with phase, duration, completion time, and a short free-text note.
- Keep the backend API intentionally small: load and save settings, list sessions, and create completed sessions.
- Favor thin vertical slices that can be demonstrated independently.

## Testing Decisions

- Good tests verify external behavior through public interfaces rather than internal implementation details.
- Backend tests should cover settings persistence, session creation validation, and session listing behavior.
- Frontend tests should prioritize observable timer and form behavior instead of implementation details of component state.
- End-to-end browser verification should exercise the real user path: load settings, run a timer flow, save a session with a note, and confirm it appears in recent history.
- The initial TDD loop should focus on one behavior at a time instead of writing all tests upfront.

## Out of Scope

- Authentication or multiple users
- Automatic work/break cycling
- Notifications, alarms, or background scheduling guarantees
- Daily streaks, analytics dashboards, or productivity reports
- Cloud deployment infrastructure beyond what is needed to demo the project locally

## Further Notes

- The project is intentionally small so the assignment can emphasize workflow evidence instead of product breadth.
- The repository should preserve artifacts for the required skills workflow, including this PRD, issue slices, test evidence, and an architecture review note.
