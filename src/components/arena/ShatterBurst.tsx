import { motion } from "framer-motion";

type Props = { durationMs: number };

// Small triangular fragments flung outward from the impact point once the projectile shatters
const SHARDS = [
  { x: -60, y: -40, rotate: -140 },
  { x: 55, y: -55, rotate: 120 },
  { x: -70, y: 30, rotate: 200 },
  { x: 65, y: 45, rotate: -200 },
  { x: 0, y: -70, rotate: 90 },
  { x: 0, y: 70, rotate: -90 },
];

// Brief burst of shard fragments flying outward from center, standing in for the projectile's impact
export default function ShatterBurst({ durationMs }: Props) {
  return (
    <div className="relative h-[70px] w-[70px]">
      {SHARDS.map((s, i) => (
        <motion.svg
          key={i}
          width="18"
          height="18"
          viewBox="0 0 18 18"
          className="absolute left-1/2 top-1/2"
          initial={{ x: -9, y: -9, opacity: 1, rotate: 0, scale: 1 }}
          animate={{ x: s.x, y: s.y, opacity: 0, rotate: s.rotate, scale: 0.4 }}
          transition={{ duration: durationMs / 1000, ease: "easeOut" }}
        >
          <polygon points="9,0 18,15 0,15" fill="#f97316" stroke="#7c2d12" strokeWidth="1" />
        </motion.svg>
      ))}
    </div>
  );
}
