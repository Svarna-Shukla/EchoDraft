import type { ArenaRound } from "../types/arena";
import type { PersonalityConfig, PersonalityId } from "../types/investor";
import { INVESTOR_PROFILES } from "./investorProfiles";

// Appended to the Groq round/opening prompt only in "The Ultimate Tank" (Boss Mode) — 5 investors
// take turns grilling the founder every round, so each individual line has to stay short enough that
// ElevenLabs TTS characters (and everyone's patience) don't get burned on a monologue.
export const BOSS_MODE_WORD_LIMIT_INSTRUCTION =
  "CRITICAL LENGTH RULE: This is a fast-fire panel round with 4 other investors waiting their turn. Your entire response — reaction and/or question combined — MUST be 15 to 25 words, no more. Be short, punchy, and aggressive. Never write more than one or two sentences.";

// Picks a random investor from the full panel to take the floor this turn, biased away from
// repeating whoever just spoke so the "random investor grills you" effect is actually felt turn to
// turn rather than the same face lingering by chance.
export function pickNextBossInvestor(excludeId?: PersonalityId): PersonalityConfig {
  const pool = INVESTOR_PROFILES.length > 1 ? INVESTOR_PROFILES.filter((p) => p.id !== excludeId) : INVESTOR_PROFILES;
  return pool[Math.floor(Math.random() * pool.length)];
}

export type BossDamageLogEntry = {
  investorId: PersonalityId;
  investorName: string;
  totalDamage: number;
  hits: number;
};

// Post-pitch analytics for Boss Mode: groups every round by whichever investor asked/judged it and
// sums how much founder health each one personally chipped away (healing rounds don't count as a
// "hit"), sorted so the hardest-hitting investor of the session shows first.
export function aggregateBossDamage(rounds: ArenaRound[]): BossDamageLogEntry[] {
  const byInvestor = new Map<PersonalityId, BossDamageLogEntry>();
  for (const round of rounds) {
    if (!round.investorId || round.healthDelta === undefined || round.healthDelta >= 0) continue;
    const profile = INVESTOR_PROFILES.find((p) => p.id === round.investorId);
    if (!profile) continue;
    const existing = byInvestor.get(round.investorId);
    const damage = Math.abs(round.healthDelta);
    if (existing) {
      existing.totalDamage += damage;
      existing.hits += 1;
    } else {
      byInvestor.set(round.investorId, { investorId: round.investorId, investorName: profile.name, totalDamage: damage, hits: 1 });
    }
  }
  return Array.from(byInvestor.values()).sort((a, b) => b.totalDamage - a.totalDamage);
}
