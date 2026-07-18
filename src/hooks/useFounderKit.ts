import { useCallback, useState } from "react";
import type { FounderKit } from "../types/founderKit";
import { fetchGroqJSON } from "../lib/groq";

const PROMPT = `You are helping a founder package their pitch. Based on the transcript below, return JSON only, no markdown, with this exact shape:
{"oneLiner":"the sharpest single sentence describing the business","elevatorPitch":{"fifteenSec":"...","thirtySec":"...","sixtySec":"..."},"problemStatement":"exactly two paragraphs separated by \\n\\n","targetCustomer":"a detailed description of the target customer","valueProposition":["bullet 1","bullet 2","bullet 3"],"gtmStrategy":"a concrete go-to-market strategy in 2-3 sentences","validationQuestions":["question 1","question 2","question 3","question 4","question 5"]}
validationQuestions are exactly 5 problem-validation interview questions a founder could ask prospective customers.

Transcript:`;

// Generates the Founder Kit (one-liner, elevator pitches, problem statement, target customer, value prop, GTM, validation questions) from a transcript
export function useFounderKit() {
  const [founderKit, setFounderKit] = useState<FounderKit | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [failed, setFailed] = useState(false);

  // Fires the single combined Groq call and stores the result
  const generate = useCallback(async (transcript: string) => {
    setIsGenerating(true);
    setFailed(false);
    const kit = await fetchGroqJSON<FounderKit>(PROMPT, transcript, 1200);
    if (kit) setFounderKit(kit);
    else setFailed(true);
    setIsGenerating(false);
  }, []);

  // Clears the kit so a fresh session can regenerate
  const reset = useCallback(() => {
    setFounderKit(null);
    setFailed(false);
  }, []);

  return { founderKit, isGenerating, failed, generate, reset };
}
