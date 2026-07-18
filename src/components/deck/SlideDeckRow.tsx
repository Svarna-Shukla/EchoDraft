import type { Slide } from "../../types/slide";
import type { Theme } from "../../hooks/useTheme";
import DeckSlideCard from "./DeckSlideCard";

type Props = { slides: Slide[]; theme: Theme };

// Horizontal, snap-scrolling row of 16:9 slide cards — a real presentation deck laid out left to right
export default function SlideDeckRow({ slides, theme }: Props) {
  return (
    <div className="flex w-full snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-6">
      {slides.map((slide, i) => (
        <DeckSlideCard key={i} slide={slide} index={i} total={slides.length} theme={theme} />
      ))}
    </div>
  );
}
