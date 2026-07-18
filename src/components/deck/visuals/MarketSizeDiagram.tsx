type Props = { color: string };

// Concentric TAM / SAM / SOM circles illustrating market size
export default function MarketSizeDiagram({ color }: Props) {
  return (
    <svg width="140" height="140" viewBox="0 0 140 140" className="shrink-0">
      <circle cx="70" cy="70" r="65" fill={`${color}14`} stroke={color} strokeOpacity={0.35} />
      <circle cx="70" cy="70" r="42" fill={`${color}22`} stroke={color} strokeOpacity={0.5} />
      <circle cx="70" cy="70" r="20" fill={`${color}66`} stroke={color} />
      <text x="70" y="14" textAnchor="middle" fontSize="9" fill={color} fontWeight={700}>
        TAM
      </text>
      <text x="70" y="34" textAnchor="middle" fontSize="8" fill={color} fontWeight={700}>
        SAM
      </text>
      <text x="70" y="73" textAnchor="middle" fontSize="8" fill="#fff" fontWeight={700}>
        SOM
      </text>
    </svg>
  );
}
