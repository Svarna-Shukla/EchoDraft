import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Hero from "../hero/Hero";
import { revealOnScroll } from "../../lib/motion";
import VoiceRecorderPanel from "./VoiceRecorderPanel";
import InstantGenerateForm from "./InstantGenerateForm";
import DeckDivider from "./DeckDivider";
import SlideDeckRow from "./SlideDeckRow";
import CompetitorRadarPanel from "../competitorradar/CompetitorRadarPanel";
import type { Slide } from "../../types/slide";
import type { Competitor } from "../../types/competitor";
import type { Theme } from "../../hooks/useTheme";

type Props = {
  isListening: boolean;
  onToggleRecord: () => void;
  transcript: string;
  audioLevels: number[];
  isGenerating: boolean;
  deckFailed: boolean;
  canPitcherate: boolean;
  onPitcherator: () => void;
  onInstantGenerate: (text: string) => void;
  slides: Slide[];
  theme: Theme;
  competitors: Competitor[] | null;
  isCompetitorsGenerating: boolean;
  competitorsFailed: boolean;
};

// Top half: voice recorder + instant text generate. Bottom half: the horizontal slide deck + competitor radar
export default function DeckPage(props: Props) {
  const deckRef = useRef<HTMLDivElement>(null);
  const recorderRef = useRef<HTMLDivElement>(null);
  const hasSlides = props.slides.length > 0;

  // Smooth-scrolls down to the freshly generated deck once slides land
  useEffect(() => {
    if (hasSlides) deckRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [hasSlides]);

  // "Start Pitching" scrolls to the recorder and, if not already listening, starts recording
  const handleStartPitching = () => {
    recorderRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    if (!props.isListening) props.onToggleRecord();
  };

  // "or type your idea instead" scrolls to and focuses the instant-generate textarea
  const handleTypeInstead = () => {
    const el = document.getElementById("idea-textarea");
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    (el as HTMLTextAreaElement | null)?.focus();
  };

  return (
    <div className="flex flex-col pb-28">
      <Hero theme={props.theme} onStartPitching={handleStartPitching} onTypeInstead={handleTypeInstead} />

      <section ref={recorderRef} className="flex flex-col items-center pt-10">
        <VoiceRecorderPanel
          isListening={props.isListening}
          onToggleRecord={props.onToggleRecord}
          transcript={props.transcript}
          audioLevels={props.audioLevels}
          isGenerating={props.isGenerating}
          canPitcherate={props.canPitcherate}
          onPitcherator={props.onPitcherator}
          theme={props.theme}
        />
        <InstantGenerateForm onGenerate={props.onInstantGenerate} disabled={props.isGenerating} theme={props.theme} />
        {props.deckFailed && (
          <p className="mt-4 text-sm text-red-400">Couldn't build a deck from that — try again with a bit more detail.</p>
        )}
      </section>

      {hasSlides && (
        <div ref={deckRef}>
          <DeckDivider theme={props.theme} />
          <SlideDeckRow slides={props.slides} theme={props.theme} />
          <motion.div className="mt-8" {...revealOnScroll}>
            <CompetitorRadarPanel
              competitors={props.competitors}
              isGenerating={props.isCompetitorsGenerating}
              failed={props.competitorsFailed}
              theme={props.theme}
            />
          </motion.div>
        </div>
      )}
    </div>
  );
}
