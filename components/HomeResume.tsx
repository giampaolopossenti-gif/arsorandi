"use client";

import Link from "next/link";
import { useProgress } from "@/lib/useProgress";
import type { Week } from "@/lib/content";

export default function HomeResume({ weeks }: { weeks: Week[] }) {
  const { completedSessions, lastVisited } = useProgress();

  const allSessions = weeks.flatMap((w) => w.sessions);

  // Prossima sessione non completata
  const next = allSessions.find((s) => !completedSessions.includes(s.id));

  // Ultima sessione visitata
  const last = lastVisited
    ? allSessions.find((s) => s.id === lastVisited)
    : null;

  if (!last && !next) return null;

  const target = last ?? next!;
  const isLast = !!last;

  return (
    <div className="mb-8">
      <Link
        href={`/settimana/${target.weekNumber}/${target.sessionNumber}`}
        className="flex items-center justify-between gap-4 rounded-xl border px-5 py-4 transition-colors"
        style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--accent)" }}
      >
        <div>
          <div className="font-sans text-xs uppercase tracking-widest mb-1" style={{ color: "var(--accent)" }}>
            {isLast ? "Riprendi" : "Prossima sessione"}
          </div>
          <div className="font-serif text-base font-medium" style={{ color: "var(--text)" }}>
            {target.title}
          </div>
          <div className="font-sans text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            {target.weekNumber === 0 ? "Introduzione" : `Settimana ${target.weekNumber}`} · Sessione {target.sessionNumber}
          </div>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ color: "var(--accent)", flexShrink: 0 }}>
          <path d="M9 18l6-6-6-6" />
        </svg>
      </Link>
    </div>
  );
}
