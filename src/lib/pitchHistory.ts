import type { PersonalityId } from "../types/investor";

const STORAGE_KEY = "pitchr_session_history";
const MAX_ENTRIES = 50;

// One completed pitch battle, as read back by an Analytics dashboard component — deliberately flat
// and JSON-serializable so it needs nothing beyond localStorage to render a history view
export type PitchHistoryEntry = {
  id: string;
  createdAt: string;
  investorId: PersonalityId;
  investorName: string;
  grade: string;
  score: number;
  healthRemaining: number;
  questionsSurvived: number;
  transcript: string;
};

// Reads the saved pitch history from localStorage, tolerating a missing/corrupt value
function readHistory(): PitchHistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PitchHistoryEntry[]) : [];
  } catch {
    return [];
  }
}

// Appends one completed pitch to the local history, keeping only the most recent MAX_ENTRIES —
// this is the hackathon-demo analytics store: no backend, just localStorage under pitchr_session_history
export function savePitchResult(entry: Omit<PitchHistoryEntry, "id" | "createdAt">): void {
  const record: PitchHistoryEntry = {
    ...entry,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  const next = [record, ...readHistory()].slice(0, MAX_ENTRIES);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage unavailable or quota exceeded — skip persisting, this session's entry is just lost
  }
}

// Reads every completed pitch saved this browser, most recent first — used by the Analytics
// dashboard to chart score/grade trends across sessions without needing a database
export function getPitchHistory(): PitchHistoryEntry[] {
  return readHistory();
}
