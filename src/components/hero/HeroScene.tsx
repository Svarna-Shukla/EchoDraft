import { Canvas } from "@react-three/fiber";
import HeroMask from "./HeroMask";
import MaskParticles from "./MaskParticles";
import { useIsMobile } from "../../hooks/useIsMobile";

// Transparent WebGL hero scene: full low-poly mask + particle sparks on desktop, particles only on mobile
// for performance. Dramatic two-light rig — a strong orange uplight, a dim blue hemisphere from above.
export default function HeroScene() {
  const isMobile = useIsMobile();

  return (
    <Canvas
      camera={{ position: [0, 0, 4.6], fov: 36 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, isMobile ? 1.5 : 2]}
      style={{ background: "transparent" }}
    >
      <hemisphereLight args={["#3b5bdb", "#050505", 0.25]} />
      <pointLight position={[0, -2.4, 1.8]} color="#f97316" intensity={2.4} distance={8} decay={2} />
      <MaskParticles />
      {!isMobile && <HeroMask />}
    </Canvas>
  );
}
