import { Suspense, lazy } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { MaskState } from "./mask/ArenaMask";

const ArenaMaskScene = lazy(() => import("./mask/ArenaMaskScene"));

type Props = { state: MaskState; attackTrigger: number; flash: "green" | "red" | null; flashKey: number; compact?: boolean };

// Top ~60%-of-screen stage: the big looming interrogation mask, a soft blue "processing" outline while
// listening to the founder's answer, and a full-screen color flash fired on judgment (green = strong
// answer, red = weak answer). Shrinks to a small watching presence once `compact` (the scorecard phase).
export default function MaskStage({ state, attackTrigger, flash, flashKey, compact = false }: Props) {
  return (
    <motion.div
      className="relative flex w-full shrink-0 items-center justify-center"
      animate={{ height: compact ? "20vh" : "52vh", opacity: compact ? 0.35 : 1 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <div
        className="pointer-events-none absolute h-[70%] w-[70%] max-w-[520px] rounded-full transition-opacity duration-500"
        style={{
          boxShadow: state === "listening" ? "0 0 90px 30px rgba(56,189,248,0.18), inset 0 0 60px 10px rgba(56,189,248,0.12)" : "none",
          opacity: state === "listening" ? 1 : 0,
        }}
      />
      <div className="h-full w-full max-w-2xl">
        <Suspense fallback={null}>
          <ArenaMaskScene state={state} attackTrigger={attackTrigger} />
        </Suspense>
      </div>

      <AnimatePresence>
        {flash && (
          <motion.div
            key={flashKey}
            className="pointer-events-none fixed inset-0 z-[70]"
            style={{ background: flash === "green" ? "radial-gradient(circle at 70% 50%, rgba(34,197,94,0.35), transparent 70%)" : "radial-gradient(circle at 70% 50%, rgba(220,38,38,0.4), transparent 70%)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
