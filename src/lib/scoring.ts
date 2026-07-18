import type { ScorecardRatings } from "../types/pitcherator";

// Sums the 6 individual ratings into a single score out of 60
export function overallScore(ratings: ScorecardRatings): number {
  return Object.values(ratings).reduce((sum, v) => sum + v, 0);
}

// Converts a /60 overall score into a letter grade
export function letterGrade(score: number): string {
  if (score >= 48) return "A";
  if (score >= 42) return "B";
  if (score >= 30) return "C";
  if (score >= 18) return "D";
  return "F";
}
