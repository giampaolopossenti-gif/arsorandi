import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllWeeks, getWeek } from "@/lib/content";
import Breadcrumb from "@/components/Breadcrumb";
import { SessionCheck } from "@/components/ProgressDot";

export async function generateStaticParams() {
  return getAllWeeks().map((w) => ({ week: String(w.number) }));
}

export default function WeekPage({ params }: { params: { week: string } }) {
  const weekNumber = parseInt(params.week, 10);
  const week = getWeek(weekNumber);
  if (!week) notFound();

  return (
    <div>
      <Breadcrumb
        crumbs={[
          { label: "Home", href: "/" },
          { label: week.number === 0 ? "Introduzione" : `Settimana ${week.number}` },
        ]}
      />

      <div className="mb-10">
        <div className="font-sans text-xs uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>
          {week.number === 0 ? "Introduzione" : `Settimana ${week.number}`} · {week.theme}
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-medium" style={{ color: "var(--text)" }}>
          {week.title}
        </h1>
      </div>

      {week.underConstruction && (
        <div
          className="rounded-xl border p-5 font-sans text-sm leading-relaxed"
          style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)", color: "var(--text-muted)" }}
        >
          <p className="font-serif text-base font-medium mb-2" style={{ color: "var(--text)" }}>
            Pagina in costruzione
          </p>
          <p className="mb-3">
            Questa settimana è in fase di revisione e sarà disponibile presto.
          </p>
          <p>
            Nel frattempo puoi già leggere e sperimentare la{" "}
            <Link href="/settimana/7" className="underline" style={{ color: "var(--accent)" }}>
              Settimana 7 — La parola nel silenzio
            </Link>
            , già rivista: si può affrontare anche prima delle settimane 5 e 6.
          </p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {week.sessions.map((session) => (
          <Link
            key={session.id}
            href={`/settimana/${week.number}/${session.sessionNumber}`}
            className="group block rounded-xl p-5 border"
            style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="font-sans text-xs mb-1" style={{ color: "var(--text-muted)" }}>
                  Sessione {session.sessionNumber}
                </div>
                <div className="font-serif text-base font-medium mb-2" style={{ color: "var(--text)" }}>
                  {session.title}
                </div>
                <div className="font-serif text-sm italic truncate" style={{ color: "var(--text-muted)" }}>
                  &ldquo;{session.soglia.text}&rdquo;
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 pt-1">
                <SessionCheck sessionId={session.id} />
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
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
