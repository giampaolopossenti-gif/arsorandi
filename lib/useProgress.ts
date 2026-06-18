"use client";

import { useEffect, useState } from "react";

const KEY = "arsorandi-progress";

export interface CourseProgress {
  completedSessions: string[];
  lastVisited: string | null;
  notes: Record<string, string>;
}

function load(): CourseProgress {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const p = JSON.parse(raw);
      return { completedSessions: [], lastVisited: null, notes: {}, ...p };
    }
  } catch {}
  return { completedSessions: [], lastVisited: null, notes: {} };
}

function save(p: CourseProgress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {}
}

export function useProgress() {
  const [progress, setProgress] = useState<CourseProgress>({
    completedSessions: [],
    lastVisited: null,
    notes: {},
  });

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

  function saveNote(sessionId: string, text: string) {
    setProgress((prev) => {
      const next: CourseProgress = {
        ...prev,
        notes: { ...prev.notes, [sessionId]: text },
      };
      save(next);
      return next;
    });
  }

  function reset() {
    const next: CourseProgress = { completedSessions: [], lastVisited: null, notes: {} };
    save(next);
    setProgress(next);
  }

  return { ...progress, toggle, markVisited, saveNote, reset };
}
