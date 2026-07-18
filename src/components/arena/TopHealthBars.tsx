import { motion } from "framer-motion";

type Props = { investorHealth: number; founderHealth: number };

// Minimal health readout pinned to the very top of the arena: investor bar on the left, the founder's
// pitch-health bar on the right — small and clean, not the old bulky split-screen fighter panels.
export default function TopHealthBars({ investorHealth, founderHealth }: Props) {
  return (
    <div className="flex w-full max-w-2xl items-center justify-between gap-6 px-6 pt-4">
      <div className="flex-1">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-red-500/80">
          <span>Investor</span>
          <span>{Math.round(investorHealth)}</span>
        </div>
        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <motion.div className="h-full bg-red-600" animate={{ width: `${investorHealth}%` }} transition={{ duration: 0.6, ease: "easeOut" }} />
        </div>
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-sky-400/80">
          <span>Your Pitch</span>
          <span>{Math.round(founderHealth)}</span>
        </div>
        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <motion.div className="h-full bg-sky-400" animate={{ width: `${founderHealth}%` }} transition={{ duration: 0.6, ease: "easeOut" }} />
        </div>
      </div>
    </div>
  );
}
