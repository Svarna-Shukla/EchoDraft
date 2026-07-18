import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

type Props = { onTimeout: () => void };

const RESPONSE_WINDOW_SECONDS = 60;

// 60-second countdown strip for the founder's response window; calls onTimeout exactly once if the
// clock runs out before an answer is submitted
export default function ResponseTimer({ onTimeout }: Props) {
  const [secondsLeft, setSecondsLeft] = useState(RESPONSE_WINDOW_SECONDS);
  const firedTimeout = useRef(false);

  // Ticks the countdown down once per second and fires the timeout callback exactly once at zero
  useEffect(() => {
    const id = window.setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          window.clearInterval(id);
          if (!firedTimeout.current) {
            firedTimeout.current = true;
            onTimeout();
          }
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full max-w-md">
      <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-1 rounded-full bg-red-500"
          animate={{ width: `${(secondsLeft / RESPONSE_WINDOW_SECONDS) * 100}%` }}
          transition={{ duration: 0.9, ease: "linear" }}
        />
      </div>
    </div>
  );
}
