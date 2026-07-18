import type { Competitor } from "../../types/competitor";
import type { Theme } from "../../hooks/useTheme";
import CompetitorCard from "./CompetitorCard";

type Props = { competitors: Competitor[] | null; isGenerating: boolean; failed: boolean; theme: Theme };

// Renders the AI-inferred competitor list as a 2x2 grid, or a loading/failure state while it's being produced
export default function CompetitorRadarPanel({ competitors, isGenerating, failed, theme }: Props) {
  const isDark = theme === "dark";
  if (isGenerating) return <p className={`px-6 text-sm ${isDark ? "text-white/50" : "text-black/50"}`}>Scanning for competitors…</p>;
  if (failed) return <p className="px-6 text-sm text-red-400">Couldn't find competitors — try Clear and generate again.</p>;
  if (!competitors || !competitors.length) return null;

  return (
    <div className="px-6">
      <h3 className={`mb-3 text-xs font-bold uppercase tracking-widest ${isDark ? "text-white/40" : "text-black/40"}`}>
        Competitor Radar
      </h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {competitors.slice(0, 4).map((c, i) => (
          <CompetitorCard key={`${c.name}-${i}`} competitor={c} theme={theme} />
        ))}
      </div>
    </div>
  );
}
