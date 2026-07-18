import type { Theme } from "../../hooks/useTheme";

type Props = { theme: Theme };

// Thin horizontal rule separating the recorder section from the slide deck section
export default function DeckDivider({ theme }: Props) {
  return <div className={`my-10 h-px w-full ${theme === "dark" ? "bg-white/10" : "bg-black/10"}`} />;
}
