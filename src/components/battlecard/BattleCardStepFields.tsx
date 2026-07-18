import type { BattleCardForm } from "../../types/battleCard";

type Field = { key: keyof BattleCardForm; label: string; placeholder: string };

type Props = { step: number; form: BattleCardForm; onChange: (key: keyof BattleCardForm, value: string) => void; isDark: boolean };

const STEPS: Field[][] = [
  [
    { key: "companyName", label: "Company name", placeholder: "Acme Inc." },
    { key: "tagline", label: "Tagline", placeholder: "The future of..." },
    { key: "industry", label: "Industry", placeholder: "Fintech, Healthtech, ..." },
  ],
  [{ key: "traction", label: "Monthly revenue or users", placeholder: "$10k MRR, 5,000 users..." }],
  [
    { key: "teamSize", label: "Team size", placeholder: "3 people" },
    { key: "founderBackground", label: "Founder background", placeholder: "Ex-Google engineer..." },
  ],
  [{ key: "advantage", label: "Biggest competitive advantage", placeholder: "Proprietary data, 10x faster..." }],
  [{ key: "funding", label: "Funding raised or seeking", placeholder: "Raised $500k seed / Seeking $1M" }],
];

// Renders the input fields for the current wizard step
export default function BattleCardStepFields({ step, form, onChange, isDark }: Props) {
  const fields = STEPS[step] ?? [];
  return (
    <div className="flex flex-col gap-4">
      {fields.map((f) => (
        <div key={f.key}>
          <label className={`mb-1 block text-xs font-semibold uppercase tracking-wide ${isDark ? "text-white/50" : "text-black/50"}`}>
            {f.label}
          </label>
          <input
            value={form[f.key]}
            onChange={(e) => onChange(f.key, e.target.value)}
            placeholder={f.placeholder}
            className={`w-full rounded-lg border px-3 py-2 text-sm outline-none ${
              isDark ? "border-white/10 bg-white/5 text-white placeholder:text-white/30" : "border-black/10 bg-black/[0.02] text-black placeholder:text-black/30"
            }`}
          />
        </div>
      ))}
    </div>
  );
}
