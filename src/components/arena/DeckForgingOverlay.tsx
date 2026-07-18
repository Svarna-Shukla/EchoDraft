import { motion } from "framer-motion";

// Full-screen takeover shown while "Generate My Deck" is building the expanded slide framework
// from the battle transcript, so the founder isn't staring at a static scorecard mid-request
export default function DeckForgingOverlay() {
  return (
    <motion.div
      className="fixed inset-0 z-[80] flex flex-col items-center justify-center gap-6 bg-[#080808]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="h-20 w-20 rounded-full border-2 border-orange-400/40 border-t-orange-400"
        animate={{ rotate: 360 }}
        transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
      />
      <motion.p
        className="font-display text-xl font-bold text-white"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      >
        Forging your deck…
      </motion.p>
    </motion.div>
  );
}
