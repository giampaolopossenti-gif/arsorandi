# Arsorandi — Corso di preghiera

Web app per il corso digitale di preghiera cristiana Arsorandi (arsorandi.org).

## Stack

- **Next.js 14** (App Router) · TypeScript · Tailwind CSS
- **Markdown**: gray-matter + react-markdown + remark-gfm
- **Persistenza**: localStorage (niente backend, niente autenticazione)
- **Font**: Lora (serif, testi sessione) + Inter (sans, UI) via `next/font/google`
- **PWA**: @ducanh2912/next-pwa — service worker generato al build
- **Node.js**: installato in `~/local/node-v22.16.0-darwin-x64/bin/`, aggiunto al PATH in `~/.bash_profile`

Se npm/node non fosse nel PATH, aggiungi all'inizio del comando:
```bash
export PATH="$HOME/local/node-v22.16.0-darwin-x64/bin:$PATH"
```

## Deploy

- **GitHub**: https://github.com/giampaolopossenti-gif/arsorandi
- **Vercel**: https://arsorandi.vercel.app (progetto: `arsorandi`, scope: `giampaolopossenti-gifs-projects`)
- **Flusso**: modifica → `git push origin main` → Vercel ri-deploya automaticamente
- **Credenziali git**: salvate in `~/.git-credentials` (non chiedere il token)
- **Vercel token**: salvato in `~/.config/vercel/auth.json` (non chiedere il token)
- Per il deploy manuale: `npx vercel --prod --yes --scope giampaolopossenti-gifs-projects`

## Struttura del progetto

```
app/
  page.tsx                        ← Home (card settimane + Riprendi)
  layout.tsx                      ← Layout globale + font + PWA meta
  globals.css                     ← Palette CSS (light/dark/night)
  percorso/page.tsx               ← Mappa del percorso
  impostazioni/page.tsx           ← Reset progressi
  settimana/[week]/page.tsx       ← Lista sessioni della settimana
  settimana/[week]/[session]/page.tsx  ← Pagina sessione completa

components/
  Header.tsx          ← Logo, link Percorso/Impostazioni, toggle tema (3 modi)
  DarkModeScript.tsx  ← Script anti-flash per tema (light/dark/night)
  Breadcrumb.tsx
  ProgressDot.tsx     ← WeekProgress e SessionCheck (client, legge localStorage)
  CompleteButton.tsx  ← Segna/deseleziona sessione completata
  SessionContent.tsx  ← ReactMarkdown con video embed (YouTube/Vimeo) e audio player
  SessionNotes.tsx    ← Note personali per sessione (autosalvataggio 800ms)
  ShareButton.tsx     ← Web Share API per la soglia
  Timer.tsx           ← Timer countdown sticky in basso
  VisitTracker.tsx    ← Segna lastVisited in localStorage
  HomeResume.tsx      ← Card "Riprendi" / "Prossima sessione" in home
  PercorsoMap.tsx     ← Mappa cerchi sessioni con stato completamento
  AudioPlayer.tsx     ← Player HTML5 per file audio linkati nel markdown
  ResetButton.tsx     ← Conferma reset progressi

content/
  settimana-00-prima-di-cominciare.md
  settimana-01-entrare.md
  ... (8 file markdown, uno per settimana)

lib/
  content.ts      ← Parser markdown (build time): estrae 8 settimane / 40 sessioni
  useProgress.ts  ← Hook localStorage: completedSessions, lastVisited, notes

public/
  manifest.json, icon-*.png, apple-touch-icon.png, favicon*
  (sw.js e workbox-*.js generati al build, in .gitignore)

scripts/
  generate-icons.mjs  ← Genera icone PWA dal file "Logo italiano png.png"
```

## Struttura dati

```typescript
interface Session {
  id: string;           // "weekNumber-sessionNumber", es. "1-3"
  weekNumber: number;
  sessionNumber: number;
  title: string;
  soglia: { text: string; reference: string };
  orientamento: string;   // markdown
  pratica: string;        // markdown (⏱ già estratto)
  timerMinutes: number | null;
  chiusura: string;       // markdown
  hasAudio: boolean;
}

// localStorage key: "arsorandi-progress"
interface CourseProgress {
  completedSessions: string[];
  lastVisited: string | null;
  notes: Record<string, string>;  // sessionId → testo nota
}
```

## Temi

Tre temi ciclabili dall'icona in header (localStorage key: `arsorandi-theme`):
- **light** → classe nessuna, sfondo crema `#FAF7F2`
- **dark** → classe `.dark`, sfondo quasi-nero `#1C1916`
- **night** → classe `.night`, sfondo `#110F0D`, font più grande (20px), toni ambra

## Contenuto markdown — convenzioni speciali

Nel rendering di `SessionContent.tsx`:
- `[Titolo](https://youtube.com/watch?v=xxx)` → video embed YouTube inline
- `[Titolo](https://vimeo.com/123)` → video embed Vimeo inline
- `[Titolo](https://url.mp3)` → audio player HTML5 inline
- `🎧 *[AUDIO — descrizione]*` → banner "Traccia audio in preparazione"
- `⏱ *N minuti*` → estratto dal parser, genera pulsante Timer

## Funzionalità implementate

- [x] Home con 8 card settimane e indicatori progresso
- [x] Card "Riprendi" / "Prossima sessione" in home
- [x] Pagina settimana con lista sessioni
- [x] Pagina sessione: soglia, orientamento, pratica, chiusura
- [x] Timer countdown sticky (Avvia/Pausa/Riprendi/Azzera)
- [x] Segna come completata (localStorage)
- [x] Note personali per sessione (autosalvataggio)
- [x] Condivisione versetto (Web Share API)
- [x] Navigazione prev/next cross-settimana
- [x] Breadcrumb
- [x] Mappa percorso (/percorso)
- [x] Dark mode + night mode
- [x] PWA (manifest, icone, service worker offline)
- [x] Video embed YouTube/Vimeo inline
- [x] Audio player inline
- [x] Reset progressi (/impostazioni)

## Funzionalità da aggiungere in futuro

- [ ] File audio reali (da caricare su Vercel Blob)
- [ ] Collegare dominio arsorandi.org a Vercel

## Note utente

- I testi delle sessioni sono in `/content/*.md` — possono essere modificati liberamente e in qualsiasi momento senza toccare il codice
- Il logo sorgente è `"Logo italiano png.png"` nella root del progetto
- Per rigenerare le icone PWA: `node scripts/generate-icons.mjs`
