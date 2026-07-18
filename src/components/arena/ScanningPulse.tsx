import { motion } from "framer-motion";

// Phase 2 of the arena: a brief red scan-line sweep across the screen while the investor's first 3
// brutal questions are being generated, before the mask launches its opening attack.
export default function ScanningPulse() {
  return (
    <div className="relative flex w-full flex-col items-center gap-4 overflow-hidden px-6 text-center">
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-0 h-10"
        style={{ background: "linear-gradient(90deg, transparent, rgba(220,38,38,0.55), transparent)" }}
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
      />
      <p className="font-mono text-sm uppercase tracking-[0.2em] text-red-500">Analyzing your pitch...</p>
    </div>
  );
}
