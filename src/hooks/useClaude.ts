import { useCallback, useState } from "react";
import type { Slide } from "../types/slide";
import { fetchGroqJSON } from "../lib/groq";
import { SLIDE_TYPES } from "../lib/slideTheme";

const DECK_PROMPT = `You are an expert pitch deck consultant. Read the founder's pitch transcript below and produce a complete investor pitch deck as JSON only, no markdown, no commentary — a single JSON array of exactly 8 slide objects, one per type, in this exact order:
[
  {"title":"...","bullets":["...","...","..."],"type":"problem"},
  {"title":"...","bullets":["...","...","..."],"type":"solution"},
  {"title":"...","bullets":["...","...","..."],"type":"market"},
  {"title":"...","bullets":["...","...","..."],"type":"businessModel"},
  {"title":"...","bullets":["...","...","..."],"type":"traction"},
  {"title":"...","bullets":["...","...","..."],"type":"competitive"},
  {"title":"...","bullets":["...","...","..."],"type":"team"},
  {"title":"...","bullets":["...","...","..."],"type":"ask"}
]
Each slide needs a short punchy title (max 8 words) and exactly 3 short bullets (max 12 words each). If the transcript doesn't cover a topic, make a smart, realistic inference from context rather than leaving it generic or empty. Never omit a slide.

Transcript:`;

const IMPROVE_PROMPT = `You previously helped build a pitch deck from a transcript. The founder was then grilled with brutal investor questions and given specific improvement suggestions. Using the original transcript plus the Q&A and suggestions below, produce an IMPROVED complete pitch deck as JSON only, no markdown — a single JSON array of exactly 8 slide objects, one per type in this exact order: problem, solution, market, businessModel, traction, competitive, team, ask. Each slide: {"title":"...","bullets":["...","...","..."],"type":"..."}. Directly address the weaknesses the questions and suggestions exposed.

Original transcript, investor Q&A, and suggestions:
`;

// Forces one raw Groq slide into a safe shape, assigning a fallback type by position if the model omits it
function normalizeSlide(raw: Partial<Slide> | null | undefined, index: number): Slide | null {
  if (!raw || typeof raw.title !== "string" || !Array.isArray(raw.bullets)) return null;
  const bullets = raw.bullets.filter((b): b is string => typeof b === "string").slice(0, 3);
  if (!bullets.length) return null;
  const type = typeof raw.type === "string" && raw.type ? raw.type : SLIDE_TYPES[index] ?? "solution";
  return { title: raw.title, bullets, type };
}

// Validates a raw Groq response is a non-empty array of usable slides
function normalizeDeck(raw: Partial<Slide>[] | null): Slide[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((s, i) => normalizeSlide(s, i)).filter((s): s is Slide => s !== null);
}

// Generates and holds the full pitch deck from a single one-shot Groq call
export function useClaude() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [failed, setFailed] = useState(false);
  const [lastInput, setLastInput] = useState("");

  // Sends the entire transcript (or typed idea) once and parses the full 8-slide deck back
  const generate = useCallback(async (fullText: string) => {
    if (!fullText.trim()) return;
    setLastInput(fullText);
    setIsGenerating(true);
    setFailed(false);
    const raw = await fetchGroqJSON<Partial<Slide>[]>(DECK_PROMPT, fullText, 2400);
    const list = normalizeDeck(raw);
    if (list.length) setSlides(list);
    else setFailed(true);
    setIsGenerating(false);
  }, []);

  // Rebuilds the deck using the original transcript plus Pitcherator's investor Q&A and suggestions
  const regenerateWithFeedback = useCallback(
    async (transcript: string, qa: { question: string; answer: string }[], suggestions: string[]) => {
      setLastInput(transcript);
      setIsGenerating(true);
      setFailed(false);
      const qaText = qa.map((p) => `Q: ${p.question}\nA: ${p.answer}`).join("\n\n");
      const suggestionText = suggestions.map((s) => `- ${s}`).join("\n");
      const content = `${transcript}\n\nInvestor Q&A:\n${qaText}\n\nSuggestions to address:\n${suggestionText}`;
      const raw = await fetchGroqJSON<Partial<Slide>[]>(IMPROVE_PROMPT, content, 2400);
      const list = normalizeDeck(raw);
      if (list.length) setSlides(list);
      else setFailed(true);
      setIsGenerating(false);
    },
    []
  );

  // Resets everything
  const reset = useCallback(() => {
    setSlides([]);
    setFailed(false);
    setLastInput("");
  }, []);

  // Replaces the current deck with a previously saved one (used by Session Save)
  const loadSlides = useCallback((saved: Slide[]) => {
    setSlides(saved);
  }, []);

  return { slides, isGenerating, failed, lastInput, generate, regenerateWithFeedback, reset, loadSlides };
}
