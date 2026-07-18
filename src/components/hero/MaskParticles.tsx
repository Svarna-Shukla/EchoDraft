import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const COUNT = 70;
const SPREAD_X = 2.6;
const SPREAD_Z = 1.6;
const HEIGHT = 3.2;
const REDUCED_MOTION = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Small orange/white sparks drifting slowly upward around the mask, looping once they clear the top bound
export default function MaskParticles() {
  const points = useRef<THREE.Points>(null);

  const { positions, colors, speeds } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const speeds = new Float32Array(COUNT);
    const white = new THREE.Color("#ffffff");
    const orange = new THREE.Color("#f97316");
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * SPREAD_X;
      positions[i * 3 + 1] = (Math.random() - 0.5) * HEIGHT;
      positions[i * 3 + 2] = (Math.random() - 0.5) * SPREAD_Z;
      const c = Math.random() > 0.65 ? white : orange;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
      speeds[i] = 0.15 + Math.random() * 0.35;
    }
    return { positions, colors, speeds };
  }, []);

  useFrame((state, delta) => {
    if (REDUCED_MOTION) return;
    const geo = points.current?.geometry;
    if (!geo) return;
    const pos = geo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < COUNT; i++) {
      let y = pos.getY(i) + speeds[i] * delta;
      if (y > HEIGHT / 2) y = -HEIGHT / 2;
      const x = pos.getX(i) + Math.sin(state.clock.elapsedTime * 0.6 + i) * 0.05 * delta;
      pos.setY(i, y);
      pos.setX(i, x);
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
