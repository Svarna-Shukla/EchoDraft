import { motion } from "framer-motion";
import { Flame } from "lucide-react";

// Fades in the Pitchr wordmark with a flame icon on page load
export default function Logo() {
  return (
    <motion.div
      className="flex items-center gap-2"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Flame className="h-5 w-5 text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.8)]" />
      <h1 className="bg-gradient-to-r from-orange-400 to-purple-400 bg-clip-text text-2xl font-bold text-transparent">
        Pitchr
      </h1>
    </motion.div>
  );
}
