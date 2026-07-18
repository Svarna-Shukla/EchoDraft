import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { Presentation, TrendingUp, Users } from "lucide-react";
import type { Theme } from "../../hooks/useTheme";
import { easeOutExpo } from "../../lib/motion";

const HeroScene = lazy(() => import("./HeroScene"));

type Props = { theme: Theme; onStartPitching: () => void; onTypeInstead: () => void };

const STATS = [
  { icon: Users, label: "10,000+ founders trained" },
  { icon: TrendingUp, label: "Avg score improvement: 34%" },
  { icon: Presentation, label: "Used in 50+ pitch rooms" },
];

// Editorial hero: left-aligned bold headline + copy + CTA on the left, the low-poly WebGL mask on the
// right on desktop (centered above the copy on mobile, mask itself swapped for particles-only there).
export default function Hero({ theme, onStartPitching, onTypeInstead }: Props) {
  const isDark = theme === "dark";
  const textPrimary = isDark ? "var(--color-text-primary)" : "var(--color-text-primary-light)";
  const textSecondary = isDark ? "var(--color-text-secondary)" : "var(--color-text-secondary-light)";

  return (
    <section className="relative flex w-full flex-col items-center gap-8 px-6 pt-6 md:min-h-[600px] md:flex-row md:items-center md:justify-between md:gap-10 md:px-14 lg:px-20">
      <div className="flex max-w-xl flex-col items-center text-center md:items-start md:text-left">
        <div className="overflow-hidden">
          <motion.h1
            className="font-display text-[42px] font-bold leading-[1.05] tracking-tight sm:text-[56px] md:text-[72px]"
            style={{ color: textPrimary }}
            initial={{ y: "110%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 0.7, delay: 0.1, ease: easeOutExpo }}
          >
            Meet Your Harshest Critic.
          </motion.h1>
        </div>

        <motion.p
          className="mt-5 max-w-md text-base leading-relaxed sm:text-lg"
          style={{ color: textSecondary }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: easeOutExpo }}
        >
          Pitch your idea. Get grilled by an AI investor that never goes easy. Walk out ready for anything.
        </motion.p>

        <motion.div
          className="mt-8 flex flex-col items-center gap-3 sm:flex-row md:items-start"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55, ease: easeOutExpo }}
        >
          <button
            onClick={onStartPitching}
            className="inline-flex items-center gap-2 rounded-full bg-[#111111] px-7 py-3.5 text-base font-semibold text-white transition hover:bg-black"
          >
            Start Pitching <span aria-hidden>→</span>
          </button>
          <button
            onClick={onTypeInstead}
            className="text-sm font-medium underline underline-offset-4 transition hover:opacity-70"
            style={{ color: textSecondary }}
          >
            or type your idea instead
          </button>
        </motion.div>

        <motion.div
          className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 md:justify-start"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.75 }}
        >
          {STATS.map((s) => (
            <div key={s.label} className="flex items-center gap-1.5 text-xs font-medium" style={{ color: textSecondary }}>
              <s.icon className="h-3.5 w-3.5" style={{ color: "var(--color-accent)" }} />
              {s.label}
            </div>
          ))}
        </motion.div>
      </div>

      <div className="relative h-[300px] w-full max-w-sm md:h-[560px] md:max-w-none md:flex-1">
        <Suspense fallback={<HeroScenePlaceholder />}>
          <HeroScene />
        </Suspense>
      </div>
    </section>
  );
}

// Lightweight pulsing placeholder shown while the WebGL scene chunk is still loading
function HeroScenePlaceholder() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <motion.div
        className="h-40 w-40 rounded-full"
        style={{ background: "radial-gradient(circle, #f9731633, transparent 70%)" }}
        animate={{ opacity: [0.4, 0.8, 0.4], scale: [0.95, 1.05, 0.95] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
