/// <reference types="vite/client" />

// Tells TypeScript exactly what environment variables to expect so we get nice autocomplete
interface ImportMetaEnv {
  readonly VITE_GROQ_API_KEY: string;
  readonly VITE_ELEVENLABS_API_KEY: string;
  readonly VITE_ELEVENLABS_VOICE_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface Window {
  SpeechRecognition: new () => SpeechRecognition;
  webkitSpeechRecognition: new () => SpeechRecognition;
}
