import { useCallback, useState } from "react";

export type VoiceEngine = "hd" | "fast";

const STORAGE_KEY = "pitchr:voice-engine";

// Reads the previously saved engine choice, defaulting to HD (ElevenLabs) so existing behavior is
// unchanged unless the founder explicitly opts into the credit-free Fast Voice mode.
function readEngine(): VoiceEngine {
  try {
    return localStorage.getItem(STORAGE_KEY) === "fast" ? "fast" : "hd";
  } catch {
    return "hd";
  }
}

// Drives the Arena header's "HD Voice (ElevenLabs) / Fast Voice (Browser Native)" toggle. Fast mode
// exists purely to stop burning ElevenLabs characters during local testing/demos — every investor
// line falls back to window.speechSynthesis instead of ever hitting the network.
export function useVoiceEngine() {
  const [engine, setEngineState] = useState<VoiceEngine>(readEngine);

  const toggle = useCallback(() => {
    setEngineState((e) => {
      const next: VoiceEngine = e === "hd" ? "fast" : "hd";
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // Storage unavailable — preference still switches for this session
      }
      return next;
    });
  }, []);

  return { engine, toggle };
}
