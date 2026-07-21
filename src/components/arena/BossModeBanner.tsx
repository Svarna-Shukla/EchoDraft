import { motion } from "framer-motion";
import { Crown } from "lucide-react";

type Props = { onSelect: () => void };

// The flagship hero entry point: a high-visibility banner above the normal investor grid, so hitting
// "The Ultimate Tank" is the first thing anyone sees on the Arena selection screen. Skips the usual
// single-investor preview modal — clicking straight-up commits to Boss Mode and moves to pitch intake.
export default function BossModeBanner({ onSelect }: Props) {
  return (
    <motion.button
      onClick={onSelect}
      className="group relative flex w-full flex-col items-center gap-2 overflow-hidden rounded-2xl border-2 border-amber-400/60 p-6 text-center shadow-[0_0_40px_rgba(251,191,36,0.15)] transition hover:border-amber-300 hover:shadow-[0_0_60px_rgba(251,191,36,0.3)]"
      style={{ background: "linear-gradient(135deg, rgba(251,191,36,0.16), rgba(249,115,22,0.12), rgba(0,0,0,0.4))" }}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <span className="absolute right-3 top-3 rounded-full bg-amber-400 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-black">
        Featured
      </span>
      <Crown className="h-8 w-8 text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
      <h3 className="font-display text-xl font-black uppercase tracking-wide text-white sm:text-2xl">
        👑 The Ultimate Tank <span className="text-amber-300">(Boss Mode)</span>
      </h3>
      <p className="max-w-md text-sm text-white/70">
        Face all 5 AI investors at once. They sit together on one panel — a random one grills you every single round.
      </p>
      <span className="mt-1 rounded-full border border-amber-400/40 bg-black/30 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-amber-300 transition group-hover:bg-amber-400/10">
        Enter the Tank
      </span>
    </motion.button>
  );
}
