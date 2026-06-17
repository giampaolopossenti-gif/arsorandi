"use client";

import { useProgress } from "@/lib/useProgress";

export function WeekProgress({ weekNumber, total }: { weekNumber: number; total: number }) {
  const { completedSessions } = useProgress();
  const count = Array.from({ length: total }, (_, i) => i + 1).filter((n) =>
    completedSessions.includes(`${weekNumber}-${n}`)
  ).length;

  if (count === 0) return null;

  return (
    <span className="font-sans text-xs" style={{ color: "var(--text-muted)" }}>
      {count}/{total}
    </span>
  );
}

export function SessionCheck({ sessionId }: { sessionId: string }) {
  const { completedSessions } = useProgress();
  if (!completedSessions.includes(sessionId)) return null;
  return (
    <span className="text-xs" style={{ color: "var(--accent)" }}>✓</span>
  );
}
