import { startTransition, useEffect, useState } from "react";

import {
  createSession,
  loadSessions,
  loadSettings,
  updateSettings,
} from "../lib/api";


function getPhaseDurationSeconds(phase, settings) {
  return (phase === "focus" ? settings.focus_minutes : settings.short_break_minutes) * 60;
}


export function usePomodoroController() {
  const [settings, setSettings] = useState({
    focus_minutes: 25,
    short_break_minutes: 5,
  });
  const [timerPhase, setTimerPhase] = useState("focus");
  const [timerStatus, setTimerStatus] = useState("idle");
  const [remainingSeconds, setRemainingSeconds] = useState(25 * 60);
  const [sessions, setSessions] = useState([]);
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [isSavingSession, setIsSavingSession] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadInitialData() {
      try {
        const [fetchedSettings, fetchedSessions] = await Promise.all([
          loadSettings(),
          loadSessions(),
        ]);

        if (ignore) {
          return;
        }

        startTransition(() => {
          setSettings(fetchedSettings);
          setSessions(fetchedSessions);
          setRemainingSeconds(getPhaseDurationSeconds("focus", fetchedSettings));
        });
      } catch (error) {
        if (!ignore) {
          setErrorMessage(error.message || "Unable to load pomodoro data.");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadInitialData();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (timerStatus !== "running") {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setRemainingSeconds((currentSeconds) => {
        if (currentSeconds <= 1) {
          window.clearInterval(intervalId);
          setTimerStatus("idle");
          return 0;
        }

        return currentSeconds - 1;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [timerStatus]);

  const phaseDurationSeconds = getPhaseDurationSeconds(timerPhase, settings);
  const elapsedSeconds = phaseDurationSeconds - remainingSeconds;

  async function saveSettings(event) {
    event.preventDefault();
    setIsSavingSettings(true);
    setErrorMessage("");

    try {
      const savedSettings = await updateSettings(settings);
      startTransition(() => {
        setSettings(savedSettings);
        if (timerStatus === "idle") {
          setRemainingSeconds(getPhaseDurationSeconds(timerPhase, savedSettings));
        }
      });
    } catch (error) {
      setErrorMessage(error.message || "Unable to save settings.");
    } finally {
      setIsSavingSettings(false);
    }
  }

  async function completeSession() {
    setIsSavingSession(true);
    setErrorMessage("");

    try {
      const savedSession = await createSession({
        phase: timerPhase,
        duration_seconds: Math.max(1, elapsedSeconds || phaseDurationSeconds),
        note,
        completed_at: new Date().toISOString(),
      });

      startTransition(() => {
        setSessions((currentSessions) => [savedSession, ...currentSessions]);
        setNote("");
        setTimerStatus("idle");
        setRemainingSeconds(getPhaseDurationSeconds(timerPhase, settings));
      });
    } catch (error) {
      setErrorMessage(error.message || "Unable to save session.");
    } finally {
      setIsSavingSession(false);
    }
  }

  function resetTimer() {
    setTimerStatus("idle");
    setRemainingSeconds(getPhaseDurationSeconds(timerPhase, settings));
  }

  function activateBreak() {
    setTimerPhase("break");
    setTimerStatus("idle");
    setRemainingSeconds(getPhaseDurationSeconds("break", settings));
  }

  function activateFocus() {
    setTimerPhase("focus");
    setTimerStatus("idle");
    setRemainingSeconds(getPhaseDurationSeconds("focus", settings));
  }

  function startTimer() {
    if (remainingSeconds === 0) {
      setRemainingSeconds(getPhaseDurationSeconds(timerPhase, settings));
    }

    setTimerStatus("running");
  }

  function pauseTimer() {
    setTimerStatus("paused");
  }

  return {
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
  };
}
