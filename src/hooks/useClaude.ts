import { useCallback, useRef, useState } from "react";
import type { Slide } from "../types/slide";

const PROMPT = `Return ONE pitch deck slide as JSON only, no markdown:
{"title":"...","bullets":["...","...","..."],"type":"problem|solution|market|traction|team|ask"}`;

// Pulls a slide JSON object out of the response text
function parseSlide(text: string): Slide | null {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]) as Slide;
  } catch {
    return null;
  }
}

// Calls Groq API (free, no credit card) and returns one parsed slide
async function fetchSlide(chunk: string): Promise<Slide | null> {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      max_tokens: 512,
      messages: [{ role: "user", content: `${PROMPT}\n\nTranscript:\n${chunk}` }],
    }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  const text = data.choices?.[0]?.message?.content ?? "";
  return parseSlide(text);
}

// Manages slide generation queue
export function useClaude() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const sentIndex = useRef(0);
  const queue = useRef<string[]>([]);
  const processing = useRef(false);

  // Processes the next queued transcript chunk
  const processQueue = useCallback(async () => {
    if (processing.current || !queue.current.length) return;
    processing.current = true;
    setIsGenerating(true);
    const chunk = queue.current.shift()!;
    const slide = await fetchSlide(chunk);
    if (slide) setSlides((s) => [...s, slide]);
    processing.current = false;
    setIsGenerating(queue.current.length > 0);
    if (queue.current.length) processQueue();
  }, []);

  // Adds a transcript chunk to the queue
  const enqueue = useCallback(
    (text: string) => {
      queue.current.push(text);
      processQueue();
    },
    [processQueue]
  );

  // Sends every 2-3 sentences to Groq
  const feedTranscript = useCallback(
    (full: string) => {
      const unsent = full.slice(sentIndex.current);
      const matches = [...unsent.matchAll(/[^.!?]+[.!?]+/g)];
      if (matches.length < 2) return;
      const count = Math.min(3, matches.length);
      const chunk = matches.slice(0, count).map((m) => m[0]).join(" ");
      sentIndex.current += chunk.length;
      enqueue(chunk);
    },
    [enqueue]
  );

  // Sends remaining transcript when recording stops
  const flush = useCallback(
    (full: string) => {
      const rest = full.slice(sentIndex.current).trim();
      if (rest) enqueue(rest);
    },
    [enqueue]
  );

  // Resets everything
  const reset = useCallback(() => {
    setSlides([]);
    sentIndex.current = 0;
    queue.current = [];
  }, []);

  return { slides, isGenerating, feedTranscript, flush, reset };
}