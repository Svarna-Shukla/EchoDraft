import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { buildMaskGeometries } from "../../lib/maskGeometry";

const REDUCED_MOTION = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const BASE_SPEED = 0.16;
const HOVER_SPEED = 0.28;
const IDLE_AMPLITUDE = 0.55;

// The low-poly geometric mask: a shrunk, cracked charcoal shell over a solid orange-emissive backing,
// with two glowing eye sockets. Idles with a slow left-right yaw, subtly follows the pointer, and
// intensifies its glow + spin when hovered — driven entirely by useFrame, no OrbitControls.
export default function HeroMask() {
  const { shell, backing, eyePositions } = useMemo(() => buildMaskGeometries(), []);
  useEffect(
    () => () => {
      shell.dispose();
      backing.dispose();
    },
    [shell, backing]
  );

  const group = useRef<THREE.Group>(null);
  const shellMat = useRef<THREE.MeshStandardMaterial>(null);
  const backingMat = useRef<THREE.MeshStandardMaterial>(null);
  const eyeMats = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  const [hovered, setHovered] = useState(false);
  const clock = useRef(0);
  const glow = useRef(0.4);

  useFrame((state, delta) => {
    if (!group.current) return;

    clock.current += delta * (hovered ? HOVER_SPEED : BASE_SPEED);
    const idleY = Math.sin(clock.current) * IDLE_AMPLITUDE;
    const pointerY = REDUCED_MOTION ? 0 : state.pointer.x * 0.35;
    const pointerX = REDUCED_MOTION ? 0 : -state.pointer.y * 0.2;

    group.current.rotation.y += (idleY + pointerY - group.current.rotation.y) * 0.05;
    group.current.rotation.x += (pointerX - group.current.rotation.x) * 0.05;

    const targetGlow = hovered ? 1.2 : 0.15;
    glow.current += (targetGlow - glow.current) * 0.08;
    if (shellMat.current) shellMat.current.emissiveIntensity = 0.03 + glow.current * 0.12;
    if (backingMat.current) backingMat.current.emissiveIntensity = 1.1 + glow.current * 0.8;
    const eyeIntensity = hovered ? 3.4 : 2;
    for (const mat of eyeMats.current) if (mat) mat.emissiveIntensity += (eyeIntensity - mat.emissiveIntensity) * 0.1;
  });

  return (
    <group ref={group} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      <mesh geometry={backing} position={[0, 0, -0.08]}>
        <meshStandardMaterial
          ref={backingMat}
          color="#210900"
          emissive="#f97316"
          emissiveIntensity={1.3}
          roughness={0.5}
          side={THREE.DoubleSide}
          flatShading
        />
      </mesh>
      <mesh geometry={shell}>
        <meshStandardMaterial
          ref={shellMat}
          color="#1a1a1a"
          emissive="#f97316"
          emissiveIntensity={0.08}
          roughness={0.65}
          metalness={0.2}
          flatShading
        />
      </mesh>
      {eyePositions.map((p, i) => (
        <mesh key={i} position={p}>
          <circleGeometry args={[0.13, 12]} />
          <meshStandardMaterial
            ref={(m) => {
              eyeMats.current[i] = m;
            }}
            color="#ff9a4d"
            emissive="#ffb347"
            emissiveIntensity={2}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}
