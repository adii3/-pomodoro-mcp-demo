## Parent PRD

`docs/prd-pomodoro-app.md`

## What to build

Create the first end-to-end backend slice for the pomodoro app. The backend should persist app settings and completed sessions in SQLite, validate incoming session payloads, and return recent sessions in a stable API shape that the frontend can consume.

## Acceptance criteria

- [ ] The backend exposes settings read and write endpoints
- [ ] The backend exposes session list and session create endpoints
- [ ] Settings are persisted on disk in SQLite
- [ ] Completed sessions store phase, duration, completed time, and note
- [ ] Invalid session payloads are rejected with a clear error

## Blocked by

None - can start immediately

## User stories addressed

- User story 6
- User story 7
- User story 8
- User story 9
- User story 10
- User story 11
- User story 12
- User story 13
