import type { FounderKit } from "../../types/founderKit";
import type { Theme } from "../../hooks/useTheme";
import FounderKitCard from "./FounderKitCard";

type Props = { founderKit: FounderKit | null; isGenerating: boolean; failed: boolean; theme: Theme };

// Renders the generated Founder Kit documents in a responsive grid, or a loading/failure/empty state
export default function FounderKitPanel({ founderKit, isGenerating, failed, theme }: Props) {
  const isDark = theme === "dark";
  if (isGenerating) return <p className={`text-sm ${isDark ? "text-white/50" : "text-black/50"}`}>Generating your founder kit…</p>;
  if (failed) return <p className="text-sm text-red-400">Generation failed — try reopening this tab.</p>;
  if (!founderKit) {
    return (
      <p className={`text-sm ${isDark ? "text-white/40" : "text-black/40"}`}>
        Record or type a pitch on the Deck tab first — your Founder Kit builds from it.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <FounderKitCard label="One-liner" content={founderKit.oneLiner} theme={theme} />
      <FounderKitCard label="Target customer" content={founderKit.targetCustomer} theme={theme} />
      <FounderKitCard label="Elevator pitch — 15 sec" content={founderKit.elevatorPitch.fifteenSec} theme={theme} />
      <FounderKitCard label="Elevator pitch — 30 sec" content={founderKit.elevatorPitch.thirtySec} theme={theme} />
      <FounderKitCard label="Elevator pitch — 60 sec" content={founderKit.elevatorPitch.sixtySec} theme={theme} />
      <FounderKitCard label="GTM strategy" content={founderKit.gtmStrategy} theme={theme} />
      <FounderKitCard label="Problem statement" content={founderKit.problemStatement} theme={theme} />
      <FounderKitCard label="Value proposition" content={founderKit.valueProposition} theme={theme} />
      <FounderKitCard label="Validation questions" content={founderKit.validationQuestions} theme={theme} />
    </div>
  );
}
