import { motion } from "framer-motion";
import { Mic, Square } from "lucide-react";

type Props = { recording: boolean; onClick: () => void; size?: number };

const HEX_CLIP = "polygon(25% 3%, 75% 3%, 100% 50%, 75% 97%, 25% 97%, 0% 50%)";

// Clean hexagonal mic button in dark grey with a white mic icon — replaces the old red-circle
// RecordButton everywhere in the arena. Glows a soft orange ring while actively recording.
export default function HexMicButton({ recording, onClick, size = 72 }: Props) {
  return (
    <motion.button
      onClick={onClick}
      aria-label={recording ? "Stop recording" : "Start recording"}
      className="relative flex items-center justify-center outline-none"
      style={{
        width: size,
        height: size,
        clipPath: HEX_CLIP,
        background: recording ? "#2a2a2a" : "#1f1f1f",
        boxShadow: recording ? "0 0 0 2px #f97316, 0 0 24px 6px rgba(249,115,22,0.45)" : "0 0 0 1px rgba(255,255,255,0.08)",
      }}
      animate={{ scale: recording ? [1, 1.04, 1] : 1 }}
      transition={{ duration: 1.1, repeat: recording ? Infinity : 0, ease: "easeInOut" }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
    >
      {recording ? <Square className="h-5 w-5 fill-white text-white" /> : <Mic className="h-6 w-6 text-white" />}
    </motion.button>
  );
}
