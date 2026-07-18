export type CardCategory = "B2B" | "B2C" | "Marketplace" | "SaaS";
export type Rarity = "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary";

export type Move = { name: string; damage: number };

export type BattleCard = {
  name: string;
  hp: number;
  category: CardCategory;
  moves: Move[];
  weakness: string;
  rarity: Rarity;
};

export type BattleCardForm = {
  companyName: string;
  tagline: string;
  industry: string;
  traction: string;
  teamSize: string;
  founderBackground: string;
  advantage: string;
  funding: string;
};
