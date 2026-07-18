type Props = { color: string; isDark: boolean };

const STEPS = ["Customer", "Product", "Revenue"];

// Simple 3-step revenue flow diagram: customer to product to revenue
export default function RevenueFlowDiagram({ color, isDark }: Props) {
  const textColor = isDark ? "#ffffff" : "#111111";
  return (
    <svg width="180" height="90" viewBox="0 0 180 90" className="shrink-0">
      <defs>
        <marker id="revenue-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 z" fill={color} />
        </marker>
      </defs>
      {STEPS.map((label, i) => (
        <g key={label}>
          <rect x={i * 65} y={30} width={50} height={30} rx={6} fill={`${color}22`} stroke={color} />
          <text x={i * 65 + 25} y={49} textAnchor="middle" fontSize="8" fill={textColor} fontWeight={600}>
            {label}
          </text>
          {i < STEPS.length - 1 && (
            <path d={`M${i * 65 + 50} 45 L${i * 65 + 63} 45`} stroke={color} strokeWidth={2} markerEnd="url(#revenue-arrow)" />
          )}
        </g>
      ))}
    </svg>
  );
}
