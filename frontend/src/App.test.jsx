import { act, fireEvent, render, screen } from "@testing-library/react";

import { App } from "./App";


function mockInitialFetches({ settings, sessions }) {
  global.fetch = vi
    .fn()
    .mockResolvedValueOnce({
      ok: true,
      json: async () => settings,
    })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => sessions,
    });
}


afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});


test("shows the main pomodoro heading", async () => {
  mockInitialFetches({
    settings: { focus_minutes: 25, short_break_minutes: 5 },
    sessions: [],
  });

  render(<App />);

  expect(await screen.findByText(/pomodoro focus board/i)).toBeInTheDocument();
  expect(screen.getByText("25:00")).toBeInTheDocument();
});


test("allows starting and pausing the focus timer", async () => {
  mockInitialFetches({
    settings: { focus_minutes: 25, short_break_minutes: 5 },
    sessions: [],
  });

  render(<App />);

  await screen.findByText("25:00");

  vi.useFakeTimers();
  fireEvent.click(screen.getByRole("button", { name: "Start" }));

  await act(async () => {
    vi.advanceTimersByTime(1000);
  });

  expect(screen.getByText("24:59")).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Pause" }));

  await act(async () => {
    vi.advanceTimersByTime(2000);
  });

  expect(screen.getByText("24:59")).toBeInTheDocument();
});
