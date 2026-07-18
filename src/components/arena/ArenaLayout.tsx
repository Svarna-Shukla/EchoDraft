import type { ReactNode } from "react";
import EmberParticles from "./EmberParticles";

type Props = { children: ReactNode };

// Full-viewport interrogation shell: almost-pure-black backdrop with slow-drifting embers. Sits above
// the app's normal nav (z-30) so the arena fully takes over the screen while tabs stay clickable.
export default function ArenaLayout({ children }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "#0a0a0a" }}>
      <EmberParticles />
      <div className="relative z-10 flex h-full w-full flex-col overflow-y-auto pt-16">{children}</div>
    </div>
  );
}
