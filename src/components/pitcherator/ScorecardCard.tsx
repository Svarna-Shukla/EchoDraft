import { motion } from "framer-motion";
import { Wand2 } from "lucide-react";
import type { Scorecard } from "../../types/pitcherator";
import { overallScore, letterGrade } from "../../lib/scoring";
import CopyButton from "../CopyButton";
import Button from "../Button";

type Props = { scorecard: Scorecard; onGenerateImprovedDeck: () => void };

const LABELS: { key: keyof Scorecard["ratings"]; label: string }[] = [
  { key: "clarity", label: "Clarity" },
  { key: "confidence", label: "Confidence" },
  { key: "marketUnderstanding", label: "Market Understanding" },
  { key: "problemStrength", label: "Problem Strength" },
  { key: "defensibility", label: "Defensibility" },
  { key: "ask", label: "Ask" },
];

// Renders the 6 rating bars, overall grade, and improvement suggestions from a completed Pitcherator scorecard
export default function ScorecardCard({ scorecard, onGenerateImprovedDeck }: Props) {
  const total = overallScore(scorecard.ratings);
  const grade = letterGrade(total);
  const copyText = () =>
    `Overall: ${total}/60 (${grade})\n` +
    LABELS.map((l) => `${l.label}: ${scorecard.ratings[l.key]}/10`).join("\n") +
    "\n\nImprove:\n" +
    scorecard.suggestions.map((s) => `- ${s}`).join("\n");

  return (
    <div className="w-full max-w-md rounded-2xl border border-[color:var(--color-border-strong)] bg-[#0f0f1a] p-6 shadow-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-lg font-semibold text-white">Your Scorecard</h3>
          <p className="text-sm text-white/50">
            Overall <span className="font-bold text-[color:var(--color-accent)]">{total}/60</span>{" "}
            <span className="font-bold text-[color:var(--color-accent)]">({grade})</span>
          </p>
        </div>
        <CopyButton getText={copyText} />
      </div>
      <div className="mt-4 flex flex-col gap-3">
        {LABELS.map((l, i) => (
          <div key={l.key}>
            <div className="flex justify-between text-xs text-white/60">
              <span>{l.label}</span>
              <span>{scorecard.ratings[l.key]}/10</span>
            </div>
            <div className="mt-1 h-2.5 rounded-full bg-white/10">
              <motion.div
                className="h-2.5 origin-left rounded-full bg-[color:var(--color-accent)]"
                style={{ width: `${scorecard.ratings[l.key] * 10}%`, transformPerspective: 300 }}
                initial={{ scaleX: 0, rotateY: -55, z: -30, opacity: 0.3 }}
                animate={{ scaleX: 1, rotateY: 0, z: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </div>
        ))}
      </div>
      <h4 className="mt-5 text-xs font-bold uppercase tracking-widest text-white/50">Improve</h4>
      <ul className="mt-2 space-y-1.5">
        {scorecard.suggestions.map((s, i) => (
          <li key={i} className="text-sm text-white/80">
            - {s}
          </li>
        ))}
      </ul>
      <Button onClick={onGenerateImprovedDeck} className="mt-5 w-full">
        <Wand2 className="h-4 w-4" /> Generate Improved Deck
      </Button>
    </div>
  );
}
