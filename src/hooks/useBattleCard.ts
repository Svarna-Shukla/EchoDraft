import { useCallback, useState } from "react";
import type { BattleCard, BattleCardForm } from "../types/battleCard";
import { fetchGroqJSON } from "../lib/groq";

const TOTAL_STEPS = 5;

const PROMPT = `You are generating Pokemon-trading-card-style business cards for a startup battle game. Based on the founder's answers below, return JSON only, no markdown, with this exact shape:
{"player":{"name":"company name","hp":0-999,"category":"B2B|B2C|Marketplace|SaaS","moves":[{"name":"Product Attack","damage":0-150},{"name":"Market Attack","damage":0-150},{"name":"Team Attack","damage":0-150},{"name":"Revenue Attack","damage":0-150}],"weakness":"their biggest vulnerability","rarity":"Common|Uncommon|Rare|Epic|Legendary"},"competitors":[/* 3 to 4 objects with the exact same shape, realistic rival companies in the same space */]}
HP reflects traction/scale. Rarity reflects overall strength (Legendary = strongest). Moves are punchy 2-3 word names with a damage score reflecting how strong that dimension is.

Founder answers:
`;

const INITIAL_FORM: BattleCardForm = {
  companyName: "",
  tagline: "",
  industry: "",
  traction: "",
  teamSize: "",
  founderBackground: "",
  advantage: "",
  funding: "",
};

// Drives the 5-step Battle Card wizard and generates the player + competitor Pokemon-style cards via Groq
export function useBattleCard() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<BattleCardForm>(INITIAL_FORM);
  const [player, setPlayer] = useState<BattleCard | null>(null);
  const [competitors, setCompetitors] = useState<BattleCard[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [failed, setFailed] = useState(false);

  // Updates one field of the wizard form
  const updateField = useCallback((key: keyof BattleCardForm, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
  }, []);

  // Advances to the next wizard step
  const next = useCallback(() => setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1)), []);

  // Returns to the previous wizard step
  const back = useCallback(() => setStep((s) => Math.max(s - 1, 0)), []);

  // Fires the single Groq call producing the player card plus 3-4 competitor cards
  const generate = useCallback(async () => {
    setIsGenerating(true);
    setFailed(false);
    const content = `Company: ${form.companyName}\nTagline: ${form.tagline}\nIndustry: ${form.industry}\nTraction (revenue or users): ${form.traction}\nTeam size: ${form.teamSize}\nFounder background: ${form.founderBackground}\nBiggest competitive advantage: ${form.advantage}\nFunding raised or seeking: ${form.funding}`;
    const raw = await fetchGroqJSON<{ player: BattleCard; competitors: BattleCard[] }>(PROMPT, content, 1800);
    if (raw?.player && Array.isArray(raw.competitors) && raw.competitors.length) {
      setPlayer(raw.player);
      setCompetitors(raw.competitors.slice(0, 4));
    } else {
      setFailed(true);
    }
    setIsGenerating(false);
  }, [form]);

  // Resets the whole wizard back to step 1 with a clean form
  const reset = useCallback(() => {
    setStep(0);
    setForm(INITIAL_FORM);
    setPlayer(null);
    setCompetitors([]);
    setFailed(false);
  }, []);

  return { step, form, player, competitors, isGenerating, failed, updateField, next, back, generate, reset };
}
