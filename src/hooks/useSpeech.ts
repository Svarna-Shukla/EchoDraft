import { useCallback, useEffect, useRef, useState } from "react";

// True when the browser implements the Web Speech API under either its standard or webkit-prefixed
// name — safe to call outside a hook (e.g. to decide a default UI mode before any component mounts)
export function isSpeechRecognitionSupported() {
  return typeof window !== "undefined" && !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

// Wraps the Web Speech API to capture live voice and build a running transcript. Most mobile
// browsers other than Chrome on Android don't implement SpeechRecognition at all, so callers must
// check `supported` and keep a text-input fallback visible regardless.
//
// `isAISpeaking` is a feedback-loop guard: while true (the AI investor's own voice is playing back),
// any recognition result is dropped and the transcript cleared instead of being treated as the
// founder's answer, so the mic never transcribes the app's own audio. It's read via a ref inside the
// mount-time recognition callback below rather than recreated per-render, since the SpeechRecognition
// instance itself is only ever constructed once.
export function useSpeech(isAISpeaking = false) {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isAISpeakingRef = useRef(isAISpeaking);
  const supported = isSpeechRecognitionSupported();

  useEffect(() => {
    isAISpeakingRef.current = isAISpeaking;
    if (isAISpeaking) setTranscript("");
  }, [isAISpeaking]);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";
    rec.onresult = (e) => {
      if (isAISpeakingRef.current) {
        setTranscript("");
        return;
      }
      let text = "";
      for (let i = 0; i < e.results.length; i++) text += e.results[i][0].transcript;
      setTranscript(text.trim());
    };
    rec.onend = () => setIsListening(false);
    recognitionRef.current = rec;
  }, []);

  // Starts the browser speech recogniser and clears the previous transcript
  const start = useCallback(() => {
    setTranscript("");
    try {
      recognitionRef.current?.start();
    } catch (err) {
      console.error("[useSpeech] start() failed", err);
    }
    setIsListening(true);
  }, []);

  // Stops the browser speech recogniser
  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  return { transcript, isListening, start, stop, supported };
}