import { Download, History, Play, RotateCcw, Zap } from "lucide-react";
import type { Theme } from "../hooks/useTheme";

type Props = {
  hasSlides: boolean;
  pitcheratorActive: boolean;
  exporting: boolean;
  theme: Theme;
  onPitcherator: () => void;
  onPresent: () => void;
  onExport: () => void;
  onSessions: () => void;
  onClear: () => void;
};

// Floating glassmorphism bar with quick actions: Pitcherator, Present, Export, Sessions, Clear
export default function BottomBar({
  hasSlides,
  pitcheratorActive,
  exporting,
  theme,
  onPitcherator,
  onPresent,
  onExport,
  onSessions,
  onClear,
}: Props) {
  const isDark = theme === "dark";
  const idle = isDark ? "text-white/70 hover:bg-white/10" : "text-black/60 hover:bg-black/5";
  const base = `flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-30 ${idle}`;

  return (
    <div className="fixed inset-x-0 bottom-4 z-30 flex justify-center px-4">
      <div
        className={`flex flex-wrap items-center justify-center gap-2 rounded-full border px-3 py-2 backdrop-blur-xl ${
          isDark ? "border-white/10 bg-white/5" : "border-black/10 bg-white/70"
        }`}
      >
        <button onClick={onPitcherator} className={`${base} ${pitcheratorActive ? "bg-red-500/20 text-red-400" : ""}`}>
          <Zap className="h-4 w-4" /> Pitcherator
        </button>
        <button onClick={onPresent} disabled={!hasSlides} className={base}>
          <Play className="h-4 w-4" /> Present
        </button>
        <button onClick={onExport} disabled={!hasSlides || exporting} className={base}>
          <Download className="h-4 w-4" /> {exporting ? "Exporting…" : "Export"}
        </button>
        <button onClick={onSessions} className={base}>
          <History className="h-4 w-4" /> Sessions
        </button>
        <button onClick={onClear} className={base}>
          <RotateCcw className="h-4 w-4" /> Clear
        </button>
      </div>
    </div>
  );
}
