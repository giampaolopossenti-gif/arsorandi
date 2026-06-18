import Link from "next/link";
import { getAllWeeks } from "@/lib/content";
import { WeekProgress } from "@/components/ProgressDot";
import HomeResume from "@/components/HomeResume";

export default function HomePage() {
  const weeks = getAllWeeks();

  return (
    <div>
      <div className="mb-10">
        <h1 className="font-serif text-3xl sm:text-4xl font-medium mb-3" style={{ color: "var(--text)" }}>
          Arsorandi
        </h1>
        <p className="font-sans text-base leading-relaxed" style={{ color: "var(--text-muted)" }}>
          Un corso di preghiera in otto settimane, secondo il metodo di Pietro d&apos;Alcantara e la Lectio Divina.
        </p>
      </div>

      {/* Riprendi / prossima sessione — client component */}
      <HomeResume weeks={weeks} />

      <div className="flex flex-col gap-3">
        {weeks.map((week) => (
          <Link
            key={week.number}
            href={`/settimana/${week.number}`}
            className="group block rounded-xl p-5 border transition-colors"
            style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-sans text-xs uppercase tracking-widest mb-1" style={{ color: "var(--text-muted)" }}>
                  {week.number === 0 ? "Introduzione" : `Settimana ${week.number}`} · {week.theme}
                </div>
                <div className="font-serif text-lg font-medium" style={{ color: "var(--text)" }}>
                  {week.title}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 pt-1">
                <WeekProgress weekNumber={week.number} total={week.sessions.length} />
                <svg
                  width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth={2}
                  style={{ color: "var(--border)" }}
                  className="group-hover:translate-x-0.5 transition-transform"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
