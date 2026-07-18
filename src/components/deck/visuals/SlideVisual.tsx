import type { Slide } from "../../../types/slide";
import MarketSizeDiagram from "./MarketSizeDiagram";
import RevenueFlowDiagram from "./RevenueFlowDiagram";
import TractionBarChart from "./TractionBarChart";
import PositioningMatrix from "./PositioningMatrix";
import ProblemStat from "./ProblemStat";
import SolutionGrid from "./SolutionGrid";
import TeamAvatars from "./TeamAvatars";
import AskCallout from "./AskCallout";

export const FULL_WIDTH_VISUAL_TYPES = new Set(["solution", "team", "ask"]);

type Props = { slide: Slide; color: string; isDark: boolean };

// Picks the right decorative or content visual for a slide, based on its type
export default function SlideVisual({ slide, color, isDark }: Props) {
  switch (slide.type) {
    case "market":
      return <MarketSizeDiagram color={color} />;
    case "businessModel":
      return <RevenueFlowDiagram color={color} isDark={isDark} />;
    case "traction":
      return <TractionBarChart color={color} />;
    case "competitive":
      return <PositioningMatrix color={color} isDark={isDark} />;
    case "problem":
      return <ProblemStat color={color} />;
    case "solution":
      return <SolutionGrid bullets={slide.bullets} color={color} isDark={isDark} />;
    case "team":
      return <TeamAvatars bullets={slide.bullets} color={color} isDark={isDark} />;
    case "ask":
      return <AskCallout title={slide.title} bullets={slide.bullets} color={color} isDark={isDark} />;
    default:
      return null;
  }
}
