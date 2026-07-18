import { useCallback, useState } from "react";
import type { Competitor, ThreatLevel } from "../types/competitor";
import { fetchGroqJSON } from "../lib/groq";

const MAX_COMPETITORS = 4;
const VALID_THREATS: ThreatLevel[] = ["low", "medium", "high"];

const PROMPT = `You have no live web search access. Using only your own knowledge and reasoning, intelligently infer exactly 4 realistic competitors for this pitch — real companies if you recognize the space, or plausible, realistically-named competitors if you don't. Return JSON array only, no markdown, exactly this shape:
[{"name":"...","whatTheyDo":"one line description","weakness":"their biggest weakness versus this idea","threat":"low|medium|high"}]

Transcript:`;

// Forces a raw Groq competitor into a safe shape so a bad or miscased LLM reply can never crash rendering
function normalize(raw: Partial<Competitor>): Competitor | null {
  if (!raw?.name || !raw.whatTheyDo || !raw.weakness) return null;
  const threat = String(raw.threat ?? "").toLowerCase() as ThreatLevel;
  return {
    name: raw.name,
    whatTheyDo: raw.whatTheyDo,
    weakness: raw.weakness,
    threat: VALID_THREATS.includes(threat) ? threat : "medium",
  };
}

// Pulls a usable competitor array out of whatever shape Groq returned — a bare array, or an object wrapping one
function extractArray(raw: unknown): Partial<Competitor>[] {
  if (Array.isArray(raw)) return raw;
  if (raw && typeof raw === "object") {
    const values = Object.values(raw as Record<string, unknown>);
    const arr = values.find((v) => Array.isArray(v));
    if (Array.isArray(arr)) return arr as Partial<Competitor>[];
  }
  return [];
}

// Generates a list of plausible competitors from the LLM's own knowledge, based on the pitch transcript
export function useCompetitorRadar() {
  const [competitors, setCompetitors] = useState<Competitor[] | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [failed, setFailed] = useState(false);

  // Fires the Groq call and stores the parsed, normalized competitor list — never throws, always resolves isGenerating
  const generate = useCallback(async (transcript: string) => {
    setIsGenerating(true);
    setFailed(false);
    try {
      const raw = await fetchGroqJSON<unknown>(PROMPT, transcript, 1000);
      const list = extractArray(raw).map(normalize).filter((c): c is Competitor => c !== null).slice(0, MAX_COMPETITORS);
      if (list.length) setCompetitors(list);
      else setFailed(true);
    } catch {
      setFailed(true);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  // Clears the results so a fresh session can regenerate
  const reset = useCallback(() => {
    setCompetitors(null);
    setFailed(false);
  }, []);

  return { competitors, isGenerating, failed, generate, reset };
}
