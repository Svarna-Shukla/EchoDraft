import type { VoiceEngine } from "../../hooks/useVoiceEngine";

type Props = { engine: VoiceEngine; onToggle: () => void };

// Arena header toggle: "HD Voice (ElevenLabs)" vs "Fast Voice (Browser Native)". Fast mode routes
// every investor line through window.speechSynthesis instead of the ElevenLabs API, so no characters
// are ever burned during local testing/demos — most valuable in "The Ultimate Tank" where up to 5
// investors can each speak every single round.
export default function VoiceEngineToggle({ engine, onToggle }: Props) {
  const isHd = engine === "hd";
  return (
    <button
      onClick={onToggle}
      aria-label={isHd ? "Switch to Fast Voice (Browser Native)" : "Switch to HD Voice (ElevenLabs)"}
      className="fixed right-4 top-20 z-[65] flex min-h-[36px] items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white/60 backdrop-blur-md transition hover:border-white/25 hover:text-white/90"
    >
      <span className={`h-1.5 w-1.5 rounded-full ${isHd ? "bg-orange-400" : "bg-sky-400"}`} />
      {isHd ? "HD Voice (ElevenLabs)" : "Fast Voice (Browser Native)"}
    </button>
  );
}
