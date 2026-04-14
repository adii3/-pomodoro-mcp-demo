import { usePomodoroController } from "./hooks/usePomodoroController";


function formatSeconds(totalSeconds) {
  const safeSeconds = Math.max(0, totalSeconds);
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function getPhaseDurationSeconds(phase, settings) {
  return (phase === "focus" ? settings.focus_minutes : settings.short_break_minutes) * 60;
}

function describeSession(session) {
  return `${session.phase} - ${Math.round(session.duration_seconds / 60)} min`;
}

export function App() {
  const {
    settings,
    setSettings,
    timerPhase,
    timerStatus,
    remainingSeconds,
    sessions,
    note,
    setNote,
    isLoading,
    isSavingSettings,
    isSavingSession,
    errorMessage,
    saveSettings,
    completeSession,
    resetTimer,
    activateBreak,
    activateFocus,
    startTimer,
    pauseTimer,
  } = usePomodoroController();

  return (
    <main className="app-shell">
      <section className="hero-card">
        <p className="eyebrow">Assignment Demo</p>
        <h1>Pomodoro Focus Board</h1>
        <p className="lede">
          Single-user pomodoro timer with browser-owned countdown state and a
          FastAPI backend for settings and completed sessions.
        </p>
      </section>

      {errorMessage ? <p className="error-banner">{errorMessage}</p> : null}

      <section className="grid-layout">
        <article className="panel timer-panel">
          <div className="panel-heading">
            <div>
              <p className="panel-label">Current timer</p>
              <h2>{timerPhase === "focus" ? "Focus Session" : "Break Session"}</h2>
            </div>
            <span className={`status-pill status-${timerStatus}`}>{timerStatus}</span>
          </div>

          <div className="timer-readout" aria-live="polite">
            {isLoading ? "Loading..." : formatSeconds(remainingSeconds)}
          </div>

          <div className="button-row">
            <button type="button" onClick={startTimer}>
              {timerStatus === "paused" ? "Resume" : "Start"}
            </button>
            <button
              type="button"
              onClick={pauseTimer}
              disabled={timerStatus !== "running"}
            >
              Pause
            </button>
            <button type="button" onClick={resetTimer}>
              Reset
            </button>
            <button type="button" onClick={activateBreak}>
              Start Break
            </button>
            <button type="button" onClick={activateFocus}>
              Focus Mode
            </button>
          </div>

          <label className="note-field">
            <span>Session note</span>
            <textarea
              rows="3"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="What did you work on?"
            />
          </label>

          <button
            type="button"
            className="accent-button"
            onClick={completeSession}
            disabled={isLoading || isSavingSession}
          >
            {isSavingSession ? "Saving..." : "Complete Session"}
          </button>
        </article>

        <article className="panel settings-panel">
          <div className="panel-heading">
            <div>
              <p className="panel-label">Settings</p>
              <h2>Session lengths</h2>
            </div>
          </div>

          <form onSubmit={saveSettings} className="settings-form">
            <label>
              <span>Focus minutes</span>
              <input
                type="number"
                min="1"
                max="180"
                value={settings.focus_minutes}
                onChange={(event) =>
                  setSettings((currentSettings) => ({
                    ...currentSettings,
                    focus_minutes: Number(event.target.value),
                  }))
                }
              />
            </label>
            <label>
              <span>Short break minutes</span>
              <input
                type="number"
                min="1"
                max="60"
                value={settings.short_break_minutes}
                onChange={(event) =>
                  setSettings((currentSettings) => ({
                    ...currentSettings,
                    short_break_minutes: Number(event.target.value),
                  }))
                }
              />
            </label>
            <button type="submit" className="secondary-button" disabled={isSavingSettings}>
              {isSavingSettings ? "Saving..." : "Save Settings"}
            </button>
          </form>
        </article>

        <article className="panel history-panel">
          <div className="panel-heading">
            <div>
              <p className="panel-label">Recent sessions</p>
              <h2>History</h2>
            </div>
          </div>

          <ul className="history-list">
            {sessions.length === 0 ? (
              <li className="history-empty">No completed sessions yet.</li>
            ) : (
              sessions.map((session) => (
                <li key={session.id} className="history-item">
                  <div>
                    <strong>{describeSession(session)}</strong>
                    <p>{new Date(session.completed_at).toLocaleString()}</p>
                  </div>
                  <p>{session.note || "No note provided."}</p>
                </li>
              ))
            )}
          </ul>
        </article>
      </section>
    </main>
  );
}
