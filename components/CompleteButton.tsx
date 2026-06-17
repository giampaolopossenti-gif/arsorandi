"use client";

import { useProgress } from "@/lib/useProgress";

export default function CompleteButton({ sessionId }: { sessionId: string }) {
  const { completedSessions, toggle } = useProgress();
  const done = completedSessions.includes(sessionId);

  return (
    <button
      onClick={() => toggle(sessionId)}
      className="font-sans text-sm px-5 py-2.5 rounded-full border transition-colors"
      style={
        done
          ? { borderColor: "var(--accent)", color: "var(--accent)", backgroundColor: "transparent" }
          : { borderColor: "var(--border)", color: "var(--text-muted)", backgroundColor: "transparent" }
      }
    >
      {done ? "Completata ✓ — annulla" : "Segna come completata"}
    </button>
  );
}
