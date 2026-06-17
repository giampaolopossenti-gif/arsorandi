"use client";

import { useProgress } from "@/lib/useProgress";
import { useState } from "react";

export default function ResetButton() {
  const { reset, completedSessions } = useProgress();
  const [confirmed, setConfirmed] = useState(false);

  if (completedSessions.length === 0) {
    return (
      <p className="font-sans text-sm" style={{ color: "var(--text-muted)" }}>
        Nessun progresso da azzerare.
      </p>
    );
  }

  if (!confirmed) {
    return (
      <button
        onClick={() => setConfirmed(true)}
        className="font-sans text-sm px-4 py-2 rounded-full border transition-colors"
        style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
      >
        Azzera progressi
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="font-sans text-sm" style={{ color: "var(--text-muted)" }}>
        Sei sicuro?
      </span>
      <button
        onClick={() => { reset(); setConfirmed(false); }}
        className="font-sans text-sm px-4 py-2 rounded-full border transition-colors"
        style={{ borderColor: "#c0392b", color: "#c0392b" }}
      >
        Sì, azzera
      </button>
      <button
        onClick={() => setConfirmed(false)}
        className="font-sans text-sm"
        style={{ color: "var(--text-muted)" }}
      >
        Annulla
      </button>
    </div>
  );
}
