import { motion, AnimatePresence } from "framer-motion";
import type { PersonalityConfig } from "../../types/investor";
import { getInvestorColor } from "../../lib/investorProfiles";

type Props = { investor: PersonalityConfig | null };

// "The Ultimate Tank" (Boss Mode) HUD overlay: since a random investor takes the floor every turn,
// this makes it unmistakable who the founder is currently answering — name, title/archetype, and a
// small crown badge naming the mode, right below the round counter.
export default function ActiveSpeakerBadge({ investor }: Props) {
  if (!investor) return null;
  const color = getInvestorColor(investor);

  return (
    <div className="flex w-full justify-center pt-2">
      <AnimatePresence mode="wait">
        <motion.div
          key={investor.id}
          className="flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-4 py-1.5 backdrop-blur-md"
          initial={{ opacity: 0, y: -6, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 6, scale: 0.96 }}
          transition={{ duration: 0.3 }}
        >
          <span className="text-xs font-black uppercase tracking-widest text-amber-400">👑 Boss Mode</span>
          <span className="h-3 w-px bg-white/20" />
          <span className="text-sm font-bold text-white">{investor.name}</span>
          <span className="text-xs font-semibold uppercase tracking-wide" style={{ color }}>
            {investor.archetype}
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
