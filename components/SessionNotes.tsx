"use client";

import { useProgress } from "@/lib/useProgress";
import { useEffect, useRef, useState } from "react";

export default function SessionNotes({ sessionId }: { sessionId: string }) {
  const { notes, saveNote } = useProgress();
  const [text, setText] = useState("");
  const [saved, setSaved] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setText(notes[sessionId] ?? "");
  }, [notes, sessionId]);

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const val = e.target.value;
    setText(val);
    setSaved(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      saveNote(sessionId, val);
      setSaved(true);
    }, 800);
  }

  return (
    <section className="mt-14">
      <div
        className="font-sans text-xs uppercase tracking-widest mb-4"
        style={{ color: "var(--text-muted)" }}
      >
        Note personali
      </div>
      <textarea
        value={text}
        onChange={handleChange}
        placeholder="Scrivi qui le tue riflessioni…"
        rows={5}
        className="w-full rounded-xl border p-4 font-serif text-base resize-none focus:outline-none transition-colors"
        style={{
          backgroundColor: "var(--bg-surface)",
          borderColor: "var(--border)",
          color: "var(--text)",
          lineHeight: "1.7",
        }}
      />
      {saved && (
        <div className="font-sans text-xs mt-1" style={{ color: "var(--text-muted)" }}>
          Salvato
        </div>
      )}
    </section>
  );
}
