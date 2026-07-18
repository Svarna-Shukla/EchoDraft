import { motion } from "framer-motion";
import Button from "../Button";

type Props = { outcome: "strong" | "weak"; text: string; isWinning: boolean; failed: boolean; onRetry: () => void };

// The verdict beat below the mask, right after a round is judged: a short reaction line in green
// (strong answer) or red (weak answer), plus an extra ominous line if the founder's pitch health has
// dropped low. Falls back to a retry prompt if the round's Groq call failed outright.
export default function JudgmentFlash({ outcome, text, isWinning, failed, onRetry }: Props) {
  if (failed) {
    return (
      <div className="flex flex-col items-center gap-4 px-6 text-center">
        <p className="text-sm text-red-400">Something went wrong judging that round — try again.</p>
        <Button onClick={onRetry}>Restart Battle</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2 px-6 text-center">
      <motion.p
        className="text-3xl font-black"
        style={{ color: outcome === "strong" ? "#4ade80" : "#f87171" }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
      >
        {text}
      </motion.p>
      {isWinning && (
        <motion.p className="text-sm font-semibold text-red-900" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          You are losing this pitch.
        </motion.p>
      )}
    </div>
  );
}
