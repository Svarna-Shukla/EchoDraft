type Props = { color: string; isDark: boolean };

const RIVALS: [number, number][] = [
  [45, 90],
  [30, 50],
  [100, 95],
];

// 2x2 competitive positioning matrix with "You" plotted in the winning quadrant
export default function PositioningMatrix({ color, isDark }: Props) {
  const axisColor = isDark ? "#ffffff33" : "#00000022";
  const textColor = isDark ? "#ffffff88" : "#00000088";
  return (
    <svg width="140" height="140" viewBox="0 0 140 140" className="shrink-0">
      <line x1="70" y1="10" x2="70" y2="130" stroke={axisColor} />
      <line x1="10" y1="70" x2="130" y2="70" stroke={axisColor} />
      <text x="70" y="10" textAnchor="middle" fontSize="7" fill={textColor}>
        Premium
      </text>
      <text x="70" y="135" textAnchor="middle" fontSize="7" fill={textColor}>
        Budget
      </text>
      <text x="8" y="73" fontSize="7" fill={textColor}>
        Slow
      </text>
      <text x="112" y="73" fontSize="7" fill={textColor}>
        Fast
      </text>
      {RIVALS.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={5} fill={textColor} />
      ))}
      <circle cx="95" cy="35" r="8" fill={color} />
      <text x="95" y="24" textAnchor="middle" fontSize="8" fontWeight={700} fill={color}>
        You
      </text>
    </svg>
  );
}
