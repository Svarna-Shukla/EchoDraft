import { CheckCircle2 } from "lucide-react";

type Props = { bullets: string[]; color: string; isDark: boolean };

// 3-column feature grid showcasing the solution's key capabilities
export default function SolutionGrid({ bullets, color, isDark }: Props) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {bullets.slice(0, 3).map((b, i) => (
        <div
          key={i}
          className={`rounded-xl border p-3 ${isDark ? "border-white/10 bg-white/5" : "border-black/10 bg-black/[0.03]"}`}
        >
          <CheckCircle2 className="h-4 w-4" style={{ color }} />
          <p className={`mt-2 text-xs leading-snug ${isDark ? "text-white/80" : "text-black/70"}`}>{b}</p>
        </div>
      ))}
    </div>
  );
}
