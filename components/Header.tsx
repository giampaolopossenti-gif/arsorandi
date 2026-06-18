"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "night";

function getTheme(): Theme {
  try {
    const t = localStorage.getItem("arsorandi-theme");
    if (t === "dark" || t === "night") return t;
  } catch {}
  if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
  return "light";
}

function applyTheme(t: Theme) {
  document.documentElement.classList.remove("dark", "night");
  if (t === "dark") document.documentElement.classList.add("dark");
  if (t === "night") document.documentElement.classList.add("night");
  try { localStorage.setItem("arsorandi-theme", t); } catch {}
}

export default function Header() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    setTheme(getTheme());
  }, []);

  function cycleTheme() {
    const next: Theme = theme === "light" ? "dark" : theme === "dark" ? "night" : "light";
    setTheme(next);
    applyTheme(next);
  }

  return (
    <header
      className="sticky top-0 z-40 border-b"
      style={{ backgroundColor: "var(--bg)", borderColor: "var(--border)" }}
    >
      <div className="max-w-prose mx-auto px-4 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="font-sans font-semibold text-sm tracking-wide uppercase"
          style={{ color: "var(--accent)" }}
        >
          Arsorandi
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/percorso" className="font-sans text-xs" style={{ color: "var(--text-muted)" }}>
            Percorso
          </Link>
          <Link href="/impostazioni" className="font-sans text-xs" style={{ color: "var(--text-muted)" }}>
            Impostazioni
          </Link>
          <button
            onClick={cycleTheme}
            aria-label="Cambia tema"
            className="w-8 h-8 flex items-center justify-center rounded-full"
            style={{ color: "var(--text-muted)" }}
            title={theme === "light" ? "Passa a scuro" : theme === "dark" ? "Passa a notturno" : "Passa a chiaro"}
          >
            {theme === "light" && (
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
            {theme === "dark" && (
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z" /><path d="M19 3v4m2-2h-4" />
              </svg>
            )}
            {theme === "night" && (
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
