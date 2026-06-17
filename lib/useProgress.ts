"use client";

import { useEffect, useState } from "react";

const KEY = "arsorandi-progress";

export interface CourseProgress {
  completedSessions: string[];
  lastVisited: string | null;
}

function load(): CourseProgress {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { completedSessions: [], lastVisited: null };
}

function save(p: CourseProgress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {}
}

export function useProgress() {
  const [progress, setProgress] = useState<CourseProgress>({ completedSessions: [], lastVisited: null });

  useEffect(() => {
    setProgress(load());
  }, []);

  function toggle(sessionId: string) {
    setProgress((prev) => {
      const exists = prev.completedSessions.includes(sessionId);
      const next: CourseProgress = {
        ...prev,
        completedSessions: exists
          ? prev.completedSessions.filter((id) => id !== sessionId)
          : [...prev.completedSessions, sessionId],
      };
      save(next);
      return next;
    });
  }

  function markVisited(sessionId: string) {
    setProgress((prev) => {
      const next = { ...prev, lastVisited: sessionId };
      save(next);
      return next;
    });
  }

  function reset() {
    const next: CourseProgress = { completedSessions: [], lastVisited: null };
    save(next);
    setProgress(next);
  }

  return { ...progress, toggle, markVisited, reset };
}
