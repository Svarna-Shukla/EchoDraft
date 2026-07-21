import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { PersonalityConfig } from "../../../types/investor";
import type { MaskState } from "../../../lib/maskPose";
import { ARENA_MASKS } from "./arenaMaskRegistry";
import InvestorMaskParticles from "../preview/masks/InvestorMaskParticles";

type Props = {
  investor: PersonalityConfig;
  seatPosition: [number, number, number];
  isActive: boolean;
  activeState: MaskState;
  isSpeaking: boolean;
};

const SEAT_SCALE = 0.6;
const ACTIVE_SCALE_BOOST = 1.2;
const DIM_SCALE = 0.94;
const ACTIVE_Z_PUSH = 0.85;
const ACTIVE_LIGHT_INTENSITY = 7;
const DIM_LIGHT_INTENSITY = 1.2;

// One seat at "The Ultimate Tank" panel: an investor's own dedicated battle mask plus their own
// floating particle field, always animating — but a dedicated point light and a wrapping group's
// scale/z-position lerp toward a "spotlit, leaning forward" pose whenever this investor is the one
// currently grilling the founder, and dim/recede otherwise.
export default function BossMaskSlot({ investor, seatPosition, isActive, activeState, isSpeaking }: Props) {
  const wrapper = useRef<THREE.Group>(null);
  const light = useRef<THREE.PointLight>(null);
  const Mask = ARENA_MASKS[investor.id];

  useFrame((_, delta) => {
    const lerp = Math.min(1, delta * 4.5);
    if (wrapper.current) {
      const targetZ = seatPosition[2] + (isActive ? ACTIVE_Z_PUSH : 0);
      const targetScale = SEAT_SCALE * (isActive ? ACTIVE_SCALE_BOOST : DIM_SCALE);
      wrapper.current.position.z = THREE.MathUtils.lerp(wrapper.current.position.z, targetZ, lerp);
      wrapper.current.scale.setScalar(THREE.MathUtils.lerp(wrapper.current.scale.x, targetScale, lerp));
    }
    if (light.current) {
      light.current.intensity = THREE.MathUtils.lerp(light.current.intensity, isActive ? ACTIVE_LIGHT_INTENSITY : DIM_LIGHT_INTENSITY, lerp);
    }
  });

  return (
    <group ref={wrapper} position={seatPosition} scale={SEAT_SCALE}>
      <pointLight position={[0, -1.5, 2.4]} color={investor.maskTheme.pointLightColor} intensity={DIM_LIGHT_INTENSITY} distance={10} decay={2} ref={light} />
      <InvestorMaskParticles colors={investor.maskTheme.particleColors} count={30} speed={0.8} chaos={0.8} />
      <Mask state={isActive ? activeState : "idle"} intensity={investor.maskIntensity} isSpeaking={isActive && isSpeaking} theme={investor.maskTheme} />
    </group>
  );
}
