import fs from "fs";
import path from "path";

export interface Soglia {
  text: string;
  reference: string;
}

export interface Session {
  id: string;
  weekNumber: number;
  sessionNumber: number;
  title: string;
  soglia: Soglia;
  orientamento: string;
  pratica: string;
  timerMinutes: number | null;
  chiusura: string;
  hasAudio: boolean;
}

export interface Week {
  number: number;
  title: string;
  theme: string;
  sessions: Session[];
}

export interface CourseProgress {
  completedSessions: string[];
  lastVisited: string | null;
}

const WEEKS_META = [
  { number: 0, title: "Prima di cominciare", theme: "Introduzione" },
  { number: 1, title: "Entrare nella preghiera", theme: "Ingresso" },
  { number: 2, title: "Leggere", theme: "Ascolto" },
  { number: 3, title: "Meditare", theme: "Meditazione" },
  { number: 4, title: "Ringraziamento", theme: "Gratitudine" },
  { number: 5, title: "Dono di sé", theme: "Offerta" },
  { number: 6, title: "Intercessione", theme: "Intercessione" },
  { number: 7, title: "La parola nel silenzio", theme: "Contemplazione" },
];

const CONTENT_DIR = path.join(process.cwd(), "content");

const WEEK_FILES = [
  "settimana-00-prima-di-cominciare.md",
  "settimana-01-entrare.md",
  "settimana-02-leggere.md",
  "settimana-03-meditare.md",
  "settimana-04-ringraziamento.md",
  "settimana-05-dono-di-se.md",
  "settimana-06-intercessione.md",
  "settimana-07-parola-silenzio.md",
];

function parseSoglia(raw: string): Soglia {
  // Expects: *"Testo del versetto."* (Riferimento)
  const match = raw.match(/\*"(.+?)"\*\s*\((.+?)\)/s);
  if (match) {
    return { text: match[1].trim(), reference: match[2].trim() };
  }
  return { text: raw.trim(), reference: "" };
}

function extractTimer(text: string): { cleaned: string; minutes: number | null } {
  // Match ⏱ *N minuti* (only a plain number, not compound text)
  const timerRegex = /⏱\s*\*(\d+)\s*minuti\*/g;
  let minutes: number | null = null;
  const cleaned = text.replace(timerRegex, (_, n) => {
    minutes = parseInt(n, 10);
    return "";
  });
  return { cleaned: cleaned.trim(), minutes };
}

function extractAudio(text: string): { cleaned: string; hasAudio: boolean } {
  const audioRegex = /🎧\s*\*\[AUDIO[^\]]*\]\*/g;
  let hasAudio = false;
  const cleaned = text.replace(audioRegex, () => {
    hasAudio = true;
    return "";
  });
  return { cleaned: cleaned.trim(), hasAudio };
}

function parseSession(block: string, weekNumber: number): Session | null {
  const lines = block.trim().split("\n");

  // First non-empty line: ## Sessione N — Title
  const titleLine = lines.find((l) => l.startsWith("## Sessione"));
  if (!titleLine) return null;

  const titleMatch = titleLine.match(/## Sessione (\d+)\s*[—–-]\s*(.+)/);
  if (!titleMatch) return null;

  const sessionNumber = parseInt(titleMatch[1], 10);
  const title = titleMatch[2].trim();

  // Split the body (everything after the title line) by single --- separators
  const afterTitle = block.slice(block.indexOf(titleLine) + titleLine.length);

  // Split by \n---\n (section separator within a session)
  const sections = afterTitle.split(/\n---\n/);

  // sections[0]: empty / Soglia area
  // We need to find the parts labeled **Soglia**, **Orientamento**, **La pratica**, **Chiusura**
  const labeled: Record<string, string> = {};
  let currentLabel = "";

  for (const section of sections) {
    const trimmed = section.trim();
    if (!trimmed) continue;

    const labelMatch = trimmed.match(/^\*\*(Soglia|Orientamento|La pratica|Chiusura)\*\*/m);
    if (labelMatch) {
      currentLabel = labelMatch[1];
      // Content is everything after the label line
      const labelLine = `**${currentLabel}**`;
      const afterLabel = trimmed.slice(trimmed.indexOf(labelLine) + labelLine.length).trim();
      labeled[currentLabel] = afterLabel;
    } else if (currentLabel) {
      labeled[currentLabel] = (labeled[currentLabel] || "") + "\n\n" + trimmed;
    }
  }

  const soglia = parseSoglia(labeled["Soglia"] || "");

  const { cleaned: praticaWithAudio, hasAudio } = extractAudio(labeled["La pratica"] || "");
  const { cleaned: pratica, minutes: timerMinutes } = extractTimer(praticaWithAudio);

  // Also check orientamento for audio (edge case)
  const { cleaned: orientamento, hasAudio: orientamentoAudio } = extractAudio(labeled["Orientamento"] || "");

  return {
    id: `${weekNumber}-${sessionNumber}`,
    weekNumber,
    sessionNumber,
    title,
    soglia,
    orientamento: orientamento.trim(),
    pratica: pratica.trim(),
    timerMinutes,
    chiusura: (labeled["Chiusura"] || "").trim(),
    hasAudio: hasAudio || orientamentoAudio,
  };
}

function parseWeekFile(filePath: string, weekMeta: (typeof WEEKS_META)[0]): Week {
  const content = fs.readFileSync(filePath, "utf-8");

  // Split sessions by double separator ---\n---
  // The pattern between sessions is: \n---\n---\n
  const sessionBlocks = content.split(/\n---\n---\n/);

  const sessions: Session[] = [];
  for (const block of sessionBlocks) {
    if (!block.includes("## Sessione")) continue;
    const session = parseSession(block, weekMeta.number);
    if (session) sessions.push(session);
  }

  return {
    number: weekMeta.number,
    title: weekMeta.title,
    theme: weekMeta.theme,
    sessions,
  };
}

let _cache: Week[] | null = null;

export function getAllWeeks(): Week[] {
  if (_cache) return _cache;

  _cache = WEEKS_META.map((meta, i) => {
    const filePath = path.join(CONTENT_DIR, WEEK_FILES[i]);
    return parseWeekFile(filePath, meta);
  });

  return _cache;
}

export function getWeek(weekNumber: number): Week | undefined {
  return getAllWeeks().find((w) => w.number === weekNumber);
}

export function getSession(weekNumber: number, sessionNumber: number): Session | undefined {
  return getWeek(weekNumber)?.sessions.find((s) => s.sessionNumber === sessionNumber);
}

export function getPrevNextSession(
  weekNumber: number,
  sessionNumber: number
): { prev: Session | null; next: Session | null } {
  const all = getAllWeeks().flatMap((w) => w.sessions);
  const idx = all.findIndex((s) => s.weekNumber === weekNumber && s.sessionNumber === sessionNumber);
  return {
    prev: idx > 0 ? all[idx - 1] : null,
    next: idx < all.length - 1 ? all[idx + 1] : null,
  };
}
