// The 6 states the Battle Arena cycles through, from first pitch input to the final scorecard
export type BattlePhase = "input" | "scanning" | "attacking" | "response" | "judgment" | "scorecard";

// One completed round of the investor grilling: the question thrown, the founder's answer, and
// whether that answer landed as a strong or weak defense (drives the mask's judgment reaction)
export type ArenaRound = {
  question: string;
  answer: string;
  outcome: "strong" | "weak";
};


