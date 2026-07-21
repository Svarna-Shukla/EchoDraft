import { motion } from "framer-motion";
import type { BossDamageLogEntry } from "../../lib/bossMode";

type Props = { damageLog: BossDamageLogEntry[] };

// Post-pitch "Ultimate Tank" analytics: a per-investor damage breakdown so the founder can see
// exactly which member of the panel hit them hardest across the whole session, sorted worst-first.
export default function BossDamageReport({ damageLog }: Props) {
  if (!damageLog.length) return null;
  const maxDamage = damageLog[0].totalDamage;

  return (
    <div className="w-full rounded-2xl border border-amber-400/20 bg-amber-400/5 p-4 text-left">
      <h3 className="mb-3 text-center text-sm font-bold uppercase tracking-widest text-amber-300">👑 Boss Mode Damage Report</h3>
      <div className="flex flex-col gap-2.5">
        {damageLog.map((entry, i) => (
          <div key={entry.investorId} className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-xs text-white/70">
              <span className="font-semibold text-white/90">
                {i === 0 && "🏆 "}
                {entry.investorName}
              </span>
              <span>
                -{entry.totalDamage} hp · {entry.hits} hit{entry.hits === 1 ? "" : "s"}
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-red-500"
                initial={{ width: 0 }}
                animate={{ width: `${(entry.totalDamage / maxDamage) * 100}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
