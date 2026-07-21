import type { VoiceAnalytics } from "./voice";
import type { PersonalityId } from "./investor";

// Define all quality ratings for founder responses
export type AnswerTier = "strong" | "neutral" | "weak" | "timeout";

// The complete set of states the Battle Arena cycles through
export type BattlePhase =
  | "personality-select"
  | "input"
  | "scanning"
  | "attack_projectile"
  | "attacking"
  | "response"
  | "judgment"
  | "gameover"
  | "scorecard";

// One completed round of the investor interrogation: question, answer, and evaluation tier.
// investorId/healthDelta are only populated in "The Ultimate Tank" (Boss Mode), where a different
// random investor can take the floor each round — they let post-pitch analytics show exactly which
// investor asked which question and how much health it cost the founder.
export type ArenaRound = {
  question: string;
  answer: string;
  tier?: AnswerTier;
  reaction?: string;
  voiceAnalytics?: VoiceAnalytics;
  investorId?: PersonalityId;
  healthDelta?: number;
};

// Global health and round tracking state object for the arena session
export interface ArenaState {
  phase: BattlePhase;
  roundIndex: number;
  investorHealth: number;
  founderHealth: number;
  rounds: ArenaRound[];
}