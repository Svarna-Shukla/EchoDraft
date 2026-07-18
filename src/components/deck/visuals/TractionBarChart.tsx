type Props = { color: string };

const HEIGHTS = [18, 30, 45, 65, 85];

// Decorative ascending bar chart illustrating growth traction
export default function TractionBarChart({ color }: Props) {
  return (
    <svg width="140" height="100" viewBox="0 0 140 100" className="shrink-0">
      {HEIGHTS.map((h, i) => (
        <rect key={i} x={i * 26 + 5} y={95 - h} width={18} height={h} rx={3} fill={color} fillOpacity={0.35 + i * 0.13} />
      ))}
      <line x1="0" y1="95" x2="140" y2="95" stroke={color} strokeOpacity={0.3} />
    </svg>
  );
}
