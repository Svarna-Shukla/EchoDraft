import { motion } from "framer-motion";
import type { Theme } from "../hooks/useTheme";

const COUNT = 30;

// Generates random starting positions for each particle
const particles = Array.from({ length: COUNT }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  delay: Math.random() * 8,
  duration: 10 + Math.random() * 10,
  size: 1 + Math.random() * 2,
}));

// Each particle floats up from the bottom and fades before looping
const floatUp = { y: [0, -1100], opacity: [0, 0.6, 0] };

type Props = { theme?: Theme };

// Renders small dots that drift slowly upward and fade out; skipped on light theme where they'd wash out
export default function Particles({ theme = "dark" }: Props) {
  if (theme === "light") return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white/40"
          style={{ left: p.left, bottom: "-10px", width: p.size, height: p.size }}
          animate={floatUp}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </div>
  );
}
