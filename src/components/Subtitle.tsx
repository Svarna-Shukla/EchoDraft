import { motion } from "framer-motion";
import type { Theme } from "../hooks/useTheme";

type Props = { theme: Theme };

// Slides up the tagline after the headline finishes animating
export default function Subtitle({ theme }: Props) {
  const isDark = theme === "dark";
  return (
    <motion.p
      className={`mt-4 text-center text-lg ${isDark ? "text-white/60" : "text-black/50"}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.6, ease: "easeOut" }}
    >
      Forge your pitch.
    </motion.p>
  );
}
