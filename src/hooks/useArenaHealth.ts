import { useCallback, useState } from "react";

const MAX_HEALTH = 100;
const STRONG_PITCH_GAIN = 8;
const WEAK_PITCH_LOSS = 18;
const MIN_INVESTOR_DAMAGE = 15;
const MAX_INVESTOR_DAMAGE = 34;
const STRENGTH_MIDPOINT = (MIN_INVESTOR_DAMAGE + MAX_INVESTOR_DAMAGE) / 2;
const EVIDENCE_KEYWORDS = ["data", "users", "revenue", "growth", "customers", "%", "traction", "proof"];

// Cheap, dependency-free proxy for answer strength: longer, more evidence-backed answers hit harder.
// This never touches the network — the real 6-metric grade still comes from one Groq call at the end.
function estimateAnswerStrength(answer: string): number {
  const words = answer.trim().split(/\s+/).filter(Boolean).length;
  const lower = answer.toLowerCase();
  const evidenceHits = EVIDENCE_KEYWORDS.filter((kw) => lower.includes(kw)).length;
  const raw = words * 1.2 + evidenceHits * 4;
  return Math.min(MAX_INVESTOR_DAMAGE, Math.max(MIN_INVESTOR_DAMAGE, raw));
}

// Classifies a founder's answer as a strong or weak defense, driving the mask's judgment reaction
export function classifyAnswer(answer: string): "strong" | "weak" {
  return estimateAnswerStrength(answer) >= STRENGTH_MIDPOINT ? "strong" : "weak";
}

// Tracks both fighters' health bars: the investor's (worn down by strong answers) and the founder's
// pitch health (rises on strong answers, drops on weak ones)
export function useArenaHealth() {
  const [investorHealth, setInvestorHealth] = useState(MAX_HEALTH);
  const [founderHealth, setFounderHealth] = useState(MAX_HEALTH);

  // Applied once the founder's answer to a round is judged
  const judge = useCallback((answer: string) => {
    const outcome = classifyAnswer(answer);
    if (outcome === "strong") {
      setInvestorHealth((h) => Math.max(0, h - estimateAnswerStrength(answer)));
      setFounderHealth((h) => Math.min(MAX_HEALTH, h + STRONG_PITCH_GAIN));
    } else {
      setFounderHealth((h) => Math.max(0, h - WEAK_PITCH_LOSS));
    }
    return outcome;
  }, []);

  // Resets both bars to full for a fresh battle
  const reset = useCallback(() => {
    setInvestorHealth(MAX_HEALTH);
    setFounderHealth(MAX_HEALTH);
  }, []);

  return { investorHealth, founderHealth, judge, reset };
}
