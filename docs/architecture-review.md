# Architecture Review

## Selected Friction Point

The first working version concentrated nearly all frontend orchestration inside `frontend/src/App.jsx`. That component owned:

- initial API loading
- timer interval lifecycle
- settings persistence
- session save behavior
- note state
- timer mode transitions
- history updates

That shape worked for a small first pass, but it was a shallow boundary. The UI component had to understand too many unrelated concepts at once, which made it harder to scan, harder to test, and less obvious where timer behavior should evolve next.

## Deepening Move

The orchestration logic was extracted into `frontend/src/hooks/usePomodoroController.js`.

The new hook hides:

- API loading and save flows
- derived timer duration logic
- countdown lifecycle
- session completion rules
- focus and break mode transitions

`App.jsx` now consumes a smaller interface and focuses on rendering.

## Why This Is Better

- The UI boundary is easier to read because it mostly describes visible behavior.
- Timer and persistence logic now live behind one interface instead of being interleaved with markup.
- Future tests can target the rendered behavior while the hook remains the single place to change timer orchestration.
- The codebase is more AI-navigable because the main screen no longer mixes layout concerns with most state transitions.

## Residual Risk

The controller hook still owns multiple responsibilities. If the app grows further, the next deepening step would be to split timer-engine logic from API-backed session persistence while preserving the same UI-facing contract.
