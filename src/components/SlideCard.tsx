import { motion } from "framer-motion";
import type { Slide } from "../types/slide";

type Props = { slide: Slide; index: number };

// Colour scheme for each slide type
const TYPE_CONFIG: Record<string, { border: string; badge: string; dot: string; glow: string }> = {
  problem:  { border: "border-red-500",    badge: "bg-red-500/20 text-red-400",    dot: "bg-red-400",    glow: "shadow-red-500/20" },
  solution: { border: "border-blue-500",   badge: "bg-blue-500/20 text-blue-400",  dot: "bg-blue-400",   glow: "shadow-blue-500/20" },
  market:   { border: "border-green-500",  badge: "bg-green-500/20 text-green-400",dot: "bg-green-400",  glow: "shadow-green-500/20" },
  traction: { border: "border-yellow-500", badge: "bg-yellow-500/20 text-yellow-400",dot: "bg-yellow-400",glow: "shadow-yellow-500/20" },
  team:     { border: "border-purple-500", badge: "bg-purple-500/20 text-purple-400",dot: "bg-purple-400",glow: "shadow-purple-500/20" },
  ask:      { border: "border-orange-500", badge: "bg-orange-500/20 text-orange-400",dot: "bg-orange-400",glow: "shadow-orange-500/20" },
};

const DEFAULT = { border: "border-white/20", badge: "bg-white/10 text-white/60", dot: "bg-white/40", glow: "shadow-white/10" };

// Renders one premium pitch deck slide card with colour coded type and animations
export default function SlideCard({ slide, index }: Props) {
  const cfg = TYPE_CONFIG[slide.type] ?? DEFAULT;

  return (
    <motion.div
      className={`rounded-2xl border-l-4 ${cfg.border} bg-[#0f0f1a] p-6 shadow-2xl ${cfg.glow}`}
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      {/* Slide type badge */}
      <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest ${cfg.badge}`}>
        {slide.type}
      </span>

      {/* Slide title */}
      <h3 className="mt-4 text-xl font-bold leading-snug text-white">
        {slide.title}
      </h3>

      {/* Divider */}
      <div className={`mt-3 h-px w-12 rounded ${cfg.border.replace("border", "bg")}`} />

      {/* Bullet points */}
      <ul className="mt-4 space-y-3">
        {slide.bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-white/75 leading-relaxed">
            <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${cfg.dot}`} />
            {b}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

// updated slide card to be more professional