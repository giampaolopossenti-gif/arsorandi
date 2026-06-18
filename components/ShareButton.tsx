"use client";

interface Props {
  text: string;
  reference: string;
}

export default function ShareButton({ text, reference }: Props) {
  if (typeof navigator === "undefined" || !navigator.share) return null;

  async function share() {
    try {
      await navigator.share({
        text: `«${text}»\n— ${reference}`,
      });
    } catch {}
  }

  return (
    <button
      onClick={share}
      aria-label="Condividi versetto"
      className="inline-flex items-center gap-1.5 font-sans text-xs px-3 py-1.5 rounded-full border mt-4 transition-colors"
      style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
        <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
      </svg>
      Condividi
    </button>
  );
}
