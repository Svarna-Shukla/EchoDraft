import { useCallback, useRef, useState } from "react";
import type { AnswerTier } from "../types/arena";

const MAX_HEALTH = 100;
const FOUNDER_HIT_DAMAGE = 34;
const NEUTRAL_HIT_DAMAGE = 20;
const MIN_INVESTOR_DAMAGE = 15;
const MAX_INVESTOR_DAMAGE = 34;
const EVIDENCE_KEYWORDS = ["data", "users", "revenue", "growth", "customers", "%", "traction", "proof"];
const STREAK_THRESHOLD = 3;

// How much a judged answer costs the founder: a strong answer parries the question entirely, a
// neutral one still stings, and a weak/timeout answer lands the full hit
const TIER_DAMAGE: Record<AnswerTier, number> = {
  strong: 0,
  neutral: NEUTRAL_HIT_DAMAGE,
  weak: FOUNDER_HIT_DAMAGE,
  timeout: FOUNDER_HIT_DAMAGE,
};

// Fired by StreakBadge whenever 3 strong ("fire") or 3 weak/timeout ("critical") answers land in a row
export type StreakEvent = { type: "fire" | "critical"; key: number } | null;

// Cheap, dependency-free proxy for answer strength: longer, more evidence-backed answers hit harder.
// This never touches the network — the real 6-metric grade still comes from one Groq call at the end.
function estimateAnswerStrength(answer: string): number {
  const words = answer.trim().split(/\s+/).filter(Boolean).length;
  const lower = answer.toLowerCase();
  const evidenceHits = EVIDENCE_KEYWORDS.filter((kw) => lower.includes(kw)).length;
  const raw = words * 1.2 + evidenceHits * 4;
  return Math.min(MAX_INVESTOR_DAMAGE, Math.max(MIN_INVESTOR_DAMAGE, raw));
}

// Tracks both fighters' health bars and exposes the two damage events a battle round can trigger
export function useArenaHealth() {
  const [investorHealth, setInvestorHealth] = useState(MAX_HEALTH);
  const [founderHealth, setFounderHealth] = useState(MAX_HEALTH);
  const [streakCount, setStreakCount] = useState(0);
  const [streakEvent, setStreakEvent] = useState<StreakEvent>(null);
  const streakKey = useRef(0);

  // Applied when an investor question lands on the founder (projectile collision)
  const damageFounder = useCallback(() => {
    setFounderHealth((h) => Math.max(0, h - FOUNDER_HIT_DAMAGE));
  }, []);

  // Applied once the founder's answer to a round is judged
  const damageInvestor = useCallback((answer: string) => {
    setInvestorHealth((h) => Math.max(0, h - estimateAnswerStrength(answer)));
  }, []);

  // Judges a completed round: docks the founder's health by the tier's damage, tracks the running
  // strong/weak streak, and fires a StreakBadge event once the streak hits 3 in either direction.
  // Returns the founder's health after this round so callers can check for game-over inline.
  const applyResult = useCallback((tier: AnswerTier) => {
    let finalHealth = MAX_HEALTH;
    setFounderHealth((h) => {
      finalHealth = Math.max(0, h - TIER_DAMAGE[tier]);
      return finalHealth;
    });

    setStreakCount((count) => {
      let next = 0;
      if (tier === "strong") next = count > 0 ? count + 1 : 1;
      else if (tier === "weak" || tier === "timeout") next = count < 0 ? count - 1 : -1;

      if (Math.abs(next) >= STREAK_THRESHOLD) {
        streakKey.current += 1;
        setStreakEvent({ type: next > 0 ? "fire" : "critical", key: streakKey.current });
        return 0;
      }
      return next;
    });

    return finalHealth;
  }, []);

  // Resets both bars and the streak tracker to full for a fresh battle
  const reset = useCallback(() => {
    setInvestorHealth(MAX_HEALTH);
    setFounderHealth(MAX_HEALTH);
    setStreakCount(0);
    setStreakEvent(null);
  }, []);

  return { investorHealth, founderHealth, damageFounder, damageInvestor, applyResult, streakEvent, streakCount, reset };
}
