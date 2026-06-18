"use client";

import { useEffect } from "react";
import { useProgress } from "@/lib/useProgress";

export default function VisitTracker({ sessionId }: { sessionId: string }) {
  const { markVisited } = useProgress();
  useEffect(() => { markVisited(sessionId); }, [sessionId]); // eslint-disable-line
  return null;
}
