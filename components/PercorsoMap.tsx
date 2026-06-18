"use client";

import Link from "next/link";
import { useProgress } from "@/lib/useProgress";
import type { Week } from "@/lib/content";

export default function PercorsoMap({ weeks }: { weeks: Week[] }) {
  const { completedSessions } = useProgress();

  const totalSessions = weeks.reduce((acc, w) => acc + w.sessions.length, 0);
  const totalCompleted = completedSessions.length;

  return (
    <div>
      {/* Riepilogo */}
      <div
        className="rounded-xl border p-4 mb-8 font-sans text-sm flex items-center justify-between"
        style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}
      >
        <span style={{ color: "var(--text-muted)" }}>Sessioni completate</span>
        <span className="font-medium" style={{ color: "var(--accent)" }}>
          {totalCompleted} / {totalSessions}
        </span>
      </div>

      {/* Mappa settimane */}
      <div className="flex flex-col gap-6">
        {weeks.map((week) => {
          const weekCompleted = week.sessions.filter((s) =>
            completedSessions.includes(s.id)
          ).length;

          return (
            <div key={week.number}>
              <div className="flex items-center justify-between mb-3">
                <div className="font-sans text-xs uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                  {week.number === 0 ? "Introduzione" : `Settimana ${week.number}`} — {week.title}
                </div>
                <div className="font-sans text-xs" style={{ color: "var(--text-muted)" }}>
                  {weekCompleted}/{week.sessions.length}
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                {week.sessions.map((session) => {
                  const done = completedSessions.includes(session.id);
                  return (
                    <Link
                      key={session.id}
                      href={`/settimana/${week.number}/${session.sessionNumber}`}
                      className="group flex flex-col items-center gap-1"
                      title={session.title}
                    >
                      <div
                        className="w-10 h-10 rounded-full border flex items-center justify-center font-sans text-sm transition-colors"
                        style={{
                          backgroundColor: done ? "var(--accent)" : "var(--bg-surface)",
                          borderColor: done ? "var(--accent)" : "var(--border)",
                          color: done ? "#fff" : "var(--text-muted)",
                        }}
                      >
                        {done ? "✓" : session.sessionNumber}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
