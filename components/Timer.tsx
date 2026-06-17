"use client";

import { useEffect, useRef, useState } from "react";

type State = "idle" | "running" | "paused" | "done";

export default function Timer({ minutes }: { minutes: number }) {
  const total = minutes * 60;
  const [state, setState] = useState<State>("idle");
  const [remaining, setRemaining] = useState(total);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  function start() {
    setState("running");
    intervalRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(intervalRef.current!);
          setState("done");
          return 0;
        }
        return r - 1;
      });
    }, 1000);
  }

  function pause() {
    setState("paused");
    if (intervalRef.current) clearInterval(intervalRef.current);
  }

  function resume() {
    start();
  }

  function reset() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setState("idle");
    setRemaining(total);
  }

  const mins = Math.floor(remaining / 60).toString().padStart(2, "0");
  const secs = (remaining % 60).toString().padStart(2, "0");

  if (state === "idle") {
    return (
      <button
        onClick={start}
        className="font-sans text-sm px-4 py-2 rounded-full border transition-colors"
        style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
      >
        Avvia timer ({minutes} min)
      </button>
    );
  }

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 border-t py-3 px-4"
      style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}
    >
      <div className="max-w-prose mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className="font-sans text-2xl font-medium tabular-nums"
            style={{ color: state === "done" ? "var(--accent)" : "var(--text)" }}
          >
            {state === "done" ? "Tempo terminato" : `${mins}:${secs}`}
          </span>
          {state !== "done" && (
            <span className="font-sans text-xs" style={{ color: "var(--text-muted)" }}>
              {minutes} min
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {state === "running" && (
            <button
              onClick={pause}
              className="font-sans text-xs px-3 py-1.5 rounded-full border"
              style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
            >
              Pausa
            </button>
          )}
          {state === "paused" && (
            <button
              onClick={resume}
              className="font-sans text-xs px-3 py-1.5 rounded-full border"
              style={{ borderColor: "var(--accent)", color: "var(--accent)" }}
            >
              Riprendi
            </button>
          )}
          <button
            onClick={reset}
            className="font-sans text-xs px-3 py-1.5 rounded-full border"
            style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
          >
            Azzera
          </button>
        </div>
      </div>
    </div>
  );
}
