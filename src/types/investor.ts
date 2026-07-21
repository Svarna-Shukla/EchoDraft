import type { AnswerTier } from "./arena";

// The 5 investor personalities the founder can choose to be grilled by
export type PersonalityId = "tailung" | "techbro" | "mogul" | "wildcard" | "mentor";

// Base geometry each investor's 3D preview head is built from — kept small and enum-like so
// InvestorHeadMesh can switch on it rather than accepting arbitrary geometry
export type MeshShape = "pentagon" | "icosahedron" | "pyramid" | "dodecahedron" | "sphere";

// How each investor's glowing eyes are rendered on their 3D preview head
export type EyeStyle = "glow-round" | "visor" | "narrow" | "offset" | "soft-oval";

// Drives the per-investor 3D rotating wireframe head shown in the pre-session preview modal
export type MeshConfig = {
  shape: MeshShape;
  color: string;
  accentColor?: string;
  eyeStyle: EyeStyle;
  rotationSpeed: number;
  erratic?: boolean;
};

// The single source of truth for one investor: identity/copy, their dedicated ElevenLabs voice,
// the tone guidance fed into the Groq round prompt, how intensely the battle-arena mask reacts,
// the short canned lines used for spoken feedback per answer tier, and their 3D preview head
export type PersonalityConfig = {
  id: PersonalityId;
  name: string;
  archetype: string;
  description: string;
  greetingText: string;
  voiceId: string;
  systemPrompt: string;
  maskIntensity: number;
  voiceLines: Record<AnswerTier, string[]>;
  meshConfig: MeshConfig;
};
