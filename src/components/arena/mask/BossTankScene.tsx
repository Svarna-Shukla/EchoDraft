import { Canvas } from "@react-three/fiber";
import type { PersonalityId } from "../../../types/investor";
import type { MaskState } from "../../../lib/maskPose";
import { INVESTOR_PROFILES } from "../../../lib/investorProfiles";
import BossMaskSlot from "./BossMaskSlot";
import ShockwaveRing from "./ShockwaveRing";

type Props = { state: MaskState; attackTrigger: number; activeInvestorId: PersonalityId; isSpeaking?: boolean };

const SEAT_SPACING = 2.15;
const CENTER_INDEX = (INVESTOR_PROFILES.length - 1) / 2;

// Positions all 5 investors along a single subtle curved arc — a "panel table" seen from the front:
// evenly spaced on X, curving gently back in Z toward the outer seats, all at a slight downward Y so
// they read as seated rather than floating at eye level.
function seatPosition(index: number): [number, number, number] {
  const offset = index - CENTER_INDEX;
  const x = offset * SEAT_SPACING;
  const z = -Math.pow(offset / CENTER_INDEX, 2) * 1.1;
  return [x, -0.35, z];
}

// The single 3D scene for "The Ultimate Tank" (Boss Mode): all 5 investors' own hand-sculpted
// low-poly masks seated side-by-side in a curved arc, each with their own ambient float animation and
// particle field running simultaneously. Whichever investor is currently grilling the founder gets
// the Active Speaker treatment (BossMaskSlot handles the actual scale/z/light lerp per seat).
export default function BossTankScene({ state, attackTrigger, activeInvestorId, isSpeaking = false }: Props) {
  return (
    <Canvas camera={{ position: [0, 0.1, 7.4], fov: 48 }} gl={{ alpha: true }}>
      <hemisphereLight args={["#1e1b4b", "#050505", 0.4]} />
      {INVESTOR_PROFILES.map((investor, i) => (
        <BossMaskSlot
          key={investor.id}
          investor={investor}
          seatPosition={seatPosition(i)}
          isActive={investor.id === activeInvestorId}
          activeState={state}
          isSpeaking={isSpeaking}
        />
      ))}
      <ShockwaveRing trigger={attackTrigger} />
    </Canvas>
  );
}
