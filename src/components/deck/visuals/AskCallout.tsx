type Props = { title: string; bullets: string[]; color: string; isDark: boolean };

// Extracts the first dollar-amount-looking token from the title/bullets, or falls back to the title
function extractAmount(title: string, bullets: string[]): string {
  const match = `${title} ${bullets.join(" ")}`.match(/\$[\d,.]+[kKmMbB]?/);
  return match ? match[0] : title;
}

// Large centered funding amount with the use-of-funds bullets beneath it
export default function AskCallout({ title, bullets, color, isDark }: Props) {
  const amount = extractAmount(title, bullets);
  return (
    <div className="flex flex-col items-center text-center">
      <span className="text-4xl font-black" style={{ color }}>
        {amount}
      </span>
      <ul className="mt-3 space-y-1">
        {bullets.slice(0, 3).map((b, i) => (
          <li key={i} className={`text-xs ${isDark ? "text-white/70" : "text-black/60"}`}>
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}
