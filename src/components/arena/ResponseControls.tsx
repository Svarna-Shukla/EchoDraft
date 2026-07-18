import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import HexMicButton from "./HexMicButton";
import Transcript from "../Transcript";
import { useSpeech } from "../../hooks/useSpeech";
import ResponseTimer from "./ResponseTimer";

type Props = { visible: boolean; onSubmitAnswer: (text: string) => void };

// The bottom response bar: a countdown strip, the hexagonal mic button, and a text field to
// "...defend yourself". Owns its own isolated speech instance so it never clobbers the original pitch
// transcript. Only fades in once the investor's question has finished typing out above.
export default function ResponseControls({ visible, onSubmitAnswer }: Props) {
  const speech = useSpeech();
  const [typed, setTyped] = useState("");

  // Stopping the mic submits whatever was transcribed immediately, mirroring a real spoken answer
  const handleToggleRecord = () => {
    if (speech.isListening) {
      speech.stop();
      onSubmitAnswer(speech.transcript);
    } else {
      speech.start();
    }
  };

  const handleTypedSubmit = () => {
    if (!typed.trim()) return;
    onSubmitAnswer(typed.trim());
  };

  // If the 60s window runs out, submit whatever answer text is currently available
  const handleTimeout = () => {
    const text = typed.trim() || speech.transcript.trim();
    if (speech.isListening) speech.stop();
    onSubmitAnswer(text);
  };

  return (
    <motion.div
      className="flex w-full flex-col items-center gap-3 px-6 pb-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 12 }}
      transition={{ duration: 0.4 }}
      style={{ pointerEvents: visible ? "auto" : "none" }}
    >
      {visible && <ResponseTimer onTimeout={handleTimeout} />}
      <Transcript text={speech.transcript} isListening={speech.isListening} />
      <div className="flex w-full max-w-md items-center gap-3">
        <HexMicButton recording={speech.isListening} onClick={handleToggleRecord} size={56} />
        <input
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleTypedSubmit()}
          placeholder="...defend yourself"
          className="flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/30"
        />
        <button
          onClick={handleTypedSubmit}
          disabled={!typed.trim()}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Submit answer"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}
