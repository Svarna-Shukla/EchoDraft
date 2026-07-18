import type { Theme } from "../hooks/useTheme";

type Props = { theme: Theme };

// Fixed, extremely faint animated perspective grid receding into the distance — pure CSS 3D, no WebGL,
// so it costs nothing and never competes with the hero canvas for GPU budget.
export default function BackgroundGrid({ theme }: Props) {
  const line = theme === "dark" ? "#1a1a1a" : "#f0f0f0";
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ perspective: "500px", perspectiveOrigin: "50% 30%" }}
    >
      <div
        className="bg-grid-move absolute left-1/2 top-[45%] h-[200vh] w-[220vw] -translate-x-1/2"
        style={{
          backgroundImage: `linear-gradient(${line} 1px, transparent 1px), linear-gradient(90deg, ${line} 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
          transform: "rotateX(78deg)",
        }}
      />
    </div>
  );
}
