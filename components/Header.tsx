"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("arsorandi-theme", next ? "dark" : "light");
    } catch {}
  }

  return (
    <header
      className="sticky top-0 z-40 border-b"
      style={{
        backgroundColor: "var(--bg)",
        borderColor: "var(--border)",
      }}
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
          <Link
            href="/impostazioni"
            className="font-sans text-xs"
            style={{ color: "var(--text-muted)" }}
          >
            Impostazioni
          </Link>
          <button
            onClick={toggle}
            aria-label="Cambia tema"
            className="w-8 h-8 flex items-center justify-center rounded-full transition-colors"
            style={{ color: "var(--text-muted)" }}
          >
            {dark ? (
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            ) : (
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
