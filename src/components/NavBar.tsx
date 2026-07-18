import { LayoutGrid, Sparkles, Swords } from "lucide-react";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import type { Theme } from "../hooks/useTheme";

export type NavTab = "deck" | "kit" | "battle";

type Props = {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  theme: Theme;
  onToggleTheme: () => void;
};

const TABS: { id: NavTab; label: string; icon: typeof LayoutGrid }[] = [
  { id: "deck", label: "Deck", icon: LayoutGrid },
  { id: "kit", label: "Founder Kit", icon: Sparkles },
  { id: "battle", label: "Battle Card", icon: Swords },
];

// Fixed top nav: logo + tagline, the Deck / Founder Kit / Battle Card tab bar, and the theme toggle
export default function NavBar({ activeTab, onTabChange, theme, onToggleTheme }: Props) {
  const isDark = theme === "dark";

  return (
    <div
      className={`fixed inset-x-0 top-0 z-30 flex items-center justify-between gap-4 border-b px-6 py-3 backdrop-blur-xl ${
        isDark ? "border-white/10 bg-white/5" : "border-black/10 bg-white/70"
      }`}
    >
      <div className="flex items-center gap-3">
        <Logo />
        <span className={`hidden text-xs md:inline ${isDark ? "text-white/40" : "text-black/40"}`}>Forge your pitch.</span>
      </div>

      <div className={`flex items-center gap-1 rounded-full border p-1 ${isDark ? "border-white/10" : "border-black/10"}`}>
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                active
                  ? isDark
                    ? "bg-white/10 text-white"
                    : "bg-black/5 text-black"
                  : isDark
                  ? "text-white/50 hover:text-white/80"
                  : "text-black/50 hover:text-black/80"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      <ThemeToggle theme={theme} onToggle={onToggleTheme} />
    </div>
  );
}
