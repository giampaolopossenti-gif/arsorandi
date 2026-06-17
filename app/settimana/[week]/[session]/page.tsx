import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllWeeks, getSession, getPrevNextSession } from "@/lib/content";
import Breadcrumb from "@/components/Breadcrumb";
import SessionContent from "@/components/SessionContent";
import Timer from "@/components/Timer";
import CompleteButton from "@/components/CompleteButton";

export async function generateStaticParams() {
  return getAllWeeks().flatMap((w) =>
    w.sessions.map((s) => ({ week: String(w.number), session: String(s.sessionNumber) }))
  );
}

export default function SessionPage({ params }: { params: { week: string; session: string } }) {
  const weekNumber = parseInt(params.week, 10);
  const sessionNumber = parseInt(params.session, 10);
  const session = getSession(weekNumber, sessionNumber);
  if (!session) notFound();

  const { prev, next } = getPrevNextSession(weekNumber, sessionNumber);

  const weekLabel = weekNumber === 0 ? "Introduzione" : `Settimana ${weekNumber}`;

  return (
    <div className="pb-24">
      <Breadcrumb
        crumbs={[
          { label: "Home", href: "/" },
          { label: weekLabel, href: `/settimana/${weekNumber}` },
          { label: `Sessione ${sessionNumber}` },
        ]}
      />

      {/* Soglia */}
      <div className="mb-12 text-center">
        <div
          className="font-serif text-xl sm:text-2xl italic leading-relaxed mb-3"
          style={{ color: "var(--text)", maxWidth: "50ch", margin: "0 auto 0.75rem" }}
        >
          &ldquo;{session.soglia.text}&rdquo;
        </div>
        <div
          className="font-sans text-xs uppercase tracking-widest"
          style={{ color: "var(--text-muted)" }}
        >
          {session.soglia.reference}
        </div>
      </div>

      <div
        className="border-t mb-12"
        style={{ borderColor: "var(--border)" }}
      />

      {/* Audio banner */}
      {session.hasAudio && (
        <div
          className="mb-8 rounded-lg p-4 border font-sans text-sm"
          style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)", color: "var(--text-muted)" }}
        >
          🎧 Traccia audio in preparazione
        </div>
      )}

      {/* Orientamento */}
      <section className="mb-12">
        <div
          className="font-sans text-xs uppercase tracking-widest mb-6"
          style={{ color: "var(--text-muted)" }}
        >
          Orientamento
        </div>
        <SessionContent markdown={session.orientamento} />
      </section>

      {/* La pratica */}
      <section className="mb-12">
        <div
          className="font-sans text-xs uppercase tracking-widest mb-6"
          style={{ color: "var(--text-muted)" }}
        >
          La pratica
        </div>
        <SessionContent markdown={session.pratica} />
        {session.timerMinutes !== null && (
          <div className="mt-6">
            <Timer minutes={session.timerMinutes} />
          </div>
        )}
      </section>

      {/* Chiusura */}
      <section className="mb-14">
        <div
          className="font-sans text-xs uppercase tracking-widest mb-6"
          style={{ color: "var(--text-muted)" }}
        >
          Chiusura
        </div>
        <SessionContent markdown={session.chiusura} />
      </section>

      {/* Complete button */}
      <div className="flex justify-center mb-14">
        <CompleteButton sessionId={session.id} />
      </div>

      {/* Prev / Next navigation */}
      <div
        className="border-t pt-8 flex justify-between gap-4"
        style={{ borderColor: "var(--border)" }}
      >
        {prev ? (
          <Link
            href={`/settimana/${prev.weekNumber}/${prev.sessionNumber}`}
            className="font-sans text-sm flex flex-col gap-0.5 max-w-[45%]"
          >
            <span style={{ color: "var(--text-muted)" }} className="text-xs">← Precedente</span>
            <span style={{ color: "var(--text)" }}>{prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/settimana/${next.weekNumber}/${next.sessionNumber}`}
            className="font-sans text-sm flex flex-col gap-0.5 items-end max-w-[45%] text-right"
          >
            <span style={{ color: "var(--text-muted)" }} className="text-xs">Successiva →</span>
            <span style={{ color: "var(--text)" }}>{next.title}</span>
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
