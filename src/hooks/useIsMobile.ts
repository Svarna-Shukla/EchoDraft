import { useEffect, useState } from "react";

const QUERY = "(max-width: 767px)";

// Tracks whether the viewport is at or below Tailwind's md breakpoint, updating live on resize/rotation
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => (typeof window !== "undefined" ? window.matchMedia(QUERY).matches : false));

  useEffect(() => {
    const mql = window.matchMedia(QUERY);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return isMobile;
}
// this hook is used to determine if the viewport is at or below Tailwind's md breakpoint (767px), and it updates the state live on window resize or device rotation.