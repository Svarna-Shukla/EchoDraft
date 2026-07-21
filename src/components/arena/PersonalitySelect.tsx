import { useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, Cpu, Heart, Shuffle, Swords } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { PersonalityConfig, PersonalityId } from "../../types/investor";
import { INVESTOR_PROFILES } from "../../lib/investorProfiles";
import PersonalityCard from "./PersonalityCard";
import InvestorPreviewModal from "./preview/InvestorPreviewModal";

type Props = { onSelect: (id: PersonalityId) => void };

const ICONS: Record<PersonalityId, LucideIcon> = { tailung: Swords, mentor: Heart, mogul: Briefcase, wildcard: Shuffle, techbro: Cpu };

// Phase 0 of the arena: before pitching, the founder picks which investor personality will grill
// them — each reshapes question tone, mask intensity, and voice feedback for the whole session.
// Clicking a card opens a live preview (3D head, voice sample, copy) rather than committing
// immediately; the modal's own "Start Battle" button is what actually calls onSelect.
export default function PersonalitySelect({ onSelect }: Props) {
  const [previewing, setPreviewing] = useState<PersonalityConfig | null>(null);

  return (
    <motion.div
      className="flex w-full max-w-2xl flex-col items-center gap-6 px-6 py-8 text-center"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="font-display text-3xl font-bold text-white">Choose Your Investor</h2>
      <p className="text-sm text-white/50">Every investor grills differently. Pick your fight.</p>
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
        {INVESTOR_PROFILES.map((p) => (
          <PersonalityCard key={p.id} config={p} icon={ICONS[p.id]} onSelect={() => setPreviewing(p)} />
        ))}
      </div>

      {previewing && (
        <InvestorPreviewModal
          investor={previewing}
          onClose={() => setPreviewing(null)}
          onStartBattle={() => {
            onSelect(previewing.id);
            setPreviewing(null);
          }}
        />
      )}
    </motion.div>
  );
}
