import { Canvas } from "@react-three/fiber";
import type { MeshConfig } from "../../../types/investor";
import InvestorHeadMesh from "./InvestorHeadMesh";

type Props = { meshConfig: MeshConfig };

// Transparent WebGL scene for one investor's 3D preview head — small dramatic two-light rig (a cool
// hemisphere fill plus a colored point light matched to the investor's own wireframe color) so each
// preview reads as a distinct, glowing presence. Lazy-loaded by InvestorHeadPreview.
export default function InvestorHeadScene({ meshConfig }: Props) {
  return (
    <Canvas
      camera={{ position: [0, 0, 3.4], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
      style={{ width: "100%", height: "100%", background: "transparent" }}
    >
      <hemisphereLight args={["#ffffff", "#050505", 0.35]} />
      <pointLight position={[1.5, 1.5, 2.5]} color={meshConfig.color} intensity={2.2} distance={10} decay={2} />
      <InvestorHeadMesh meshConfig={meshConfig} />
    </Canvas>
  );
}
