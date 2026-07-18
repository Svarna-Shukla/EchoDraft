import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Props = { trigger: number };

const DURATION = 0.7;

// A thin orange ring that expands outward and fades once per `trigger` change — fired whenever the
// mask enters its "speaking/attacking" state, standing in for a shockwave punch toward the viewer.
export default function ShockwaveRing({ trigger }: Props) {
  const mesh = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.MeshBasicMaterial>(null);
  const startedAt = useRef(-Infinity);
  const lastTrigger = useRef(trigger);

  useFrame((state) => {
    if (trigger !== lastTrigger.current) {
      lastTrigger.current = trigger;
      startedAt.current = state.clock.elapsedTime;
    }
    const age = state.clock.elapsedTime - startedAt.current;
    if (!mesh.current || !mat.current) return;
    if (age < 0 || age > DURATION) {
      mat.current.opacity = 0;
      return;
    }
    const p = age / DURATION;
    const scale = 1 + p * 2.2;
    mesh.current.scale.setScalar(scale);
    mat.current.opacity = 0.5 * (1 - p);
  });

  return (
    <mesh ref={mesh} position={[0, 0, 0.3]}>
      <ringGeometry args={[1.15, 1.28, 48]} />
      <meshBasicMaterial ref={mat} color="#f97316" transparent opacity={0} side={THREE.DoubleSide} toneMapped={false} />
    </mesh>
  );
}
