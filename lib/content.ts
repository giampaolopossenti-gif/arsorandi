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

function parseSogliaBlockquote(text: string): Soglia {
  // > *Soglia: "Testo del versetto." (Riferimento)*
  // or > *Soglia: "Testo" (Rif)*
  const match = text.match(/>\s*\*Soglia:\s*"(.+?)"\s*\((.+?)\)\*/s);
  if (match) {
    return { text: match[1].trim(), reference: match[2].trim() };
  }
  return { text: "", reference: "" };
}

function splitByH3(text: string): Record<string, string> {
  const result: Record<string, string> = {};
  const h3Regex = /^###\s+(Orientamento|(?:La )?[Pp]ratica|Chiusura)\s*$/gm;
  const labels: { label: string; start: number }[] = [];
  let m;
  while ((m = h3Regex.exec(text)) !== null) {
    const label = m[1].match(/pratica/i) ? "La pratica" : m[1];
    labels.push({ label, start: m.index + m[0].length });
  }
  for (let i = 0; i < labels.length; i++) {
    const end = i + 1 < labels.length ? text.lastIndexOf("\n###", labels[i + 1].start) : text.length;
    result[labels[i].label] = text.slice(labels[i].start, end).trim();
  }
  return result;
}

function parseSessionH3(afterTitle: string, weekNumber: number, sessionNumber: number, title: string): Session {
  const soglia = parseSogliaBlockquote(afterTitle);
  const labeled = splitByH3(afterTitle);

  const { cleaned: praticaWithAudio, hasAudio } = extractAudio(labeled["La pratica"] || "");
  const { cleaned: pratica, minutes: timerMinutes } = extractTimer(praticaWithAudio);
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

function parseSession(block: string, weekNumber: number): Session | null {
  const lines = block.trim().split("\n");

  const titleLine = lines.find((l) => l.startsWith("## Sessione"));
  if (!titleLine) return null;

  const titleMatch = titleLine.match(/## Sessione (\d+)\s*[—–-]\s*(.+)/);
  if (!titleMatch) return null;

  const sessionNumber = parseInt(titleMatch[1], 10);
  const title = titleMatch[2].trim();

  const afterTitle = block.slice(block.indexOf(titleLine) + titleLine.length);

  // Try new format first: ### headers and blockquote soglia
  const hasH3Sections = /^###\s+(Orientamento|La pratica|Chiusura)/m.test(afterTitle);

  if (hasH3Sections) {
    return parseSessionH3(afterTitle, weekNumber, sessionNumber, title);
  }

  // Old format: **Label** with --- separators
  const sections = afterTitle.split(/\n---\n/);
  const labeled: Record<string, string> = {};
  let currentLabel = "";

  for (const section of sections) {
    const trimmed = section.trim();
    if (!trimmed) continue;

    const labelMatch = trimmed.match(/^\*\*(Soglia|Orientamento|(?:La )?[Pp]ratica|Chiusura)\*\*/m);
    if (labelMatch) {
      currentLabel = labelMatch[1].match(/pratica/i) ? "La pratica" : labelMatch[1];
      const labelLine = `**${labelMatch[1]}**`;
      const afterLabel = trimmed.slice(trimmed.indexOf(labelLine) + labelLine.length).trim();
      labeled[currentLabel] = afterLabel;
    } else if (currentLabel) {
      labeled[currentLabel] = (labeled[currentLabel] || "") + "\n\n" + trimmed;
    }
  }

  const hasLabels = Object.keys(labeled).length > 0;
  if (!hasLabels) {
    // Free-form session (e.g. settimana 0)
    const body = afterTitle.trim();
    const { cleaned: bodyWithTimer, minutes: timerMinutes } = extractTimer(body);
    const { cleaned: orientamento, hasAudio } = extractAudio(bodyWithTimer);
    return {
      id: `${weekNumber}-${sessionNumber}`,
      weekNumber,
      sessionNumber,
      title,
      soglia: { text: "", reference: "" },
      orientamento: orientamento.trim(),
      pratica: "",
      timerMinutes,
      chiusura: "",
      hasAudio,
    };
  }

  const soglia = parseSoglia(labeled["Soglia"] || "");
  const { cleaned: praticaWithAudio, hasAudio } = extractAudio(labeled["La pratica"] || "");
  const { cleaned: pratica, minutes: timerMinutes } = extractTimer(praticaWithAudio);
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

  // Split by ## Sessione headers to reliably separate sessions in all formats
  const sessionBlocks: string[] = [];
  const headerRegex = /^## Sessione /gm;
  const indices: number[] = [];
  let m;
  while ((m = headerRegex.exec(content)) !== null) {
    indices.push(m.index);
  }
  for (let i = 0; i < indices.length; i++) {
    const end = i + 1 < indices.length ? indices[i + 1] : content.length;
    sessionBlocks.push(content.slice(indices[i], end));
  }

  const sessions: Session[] = [];
  for (const block of sessionBlocks) {
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
