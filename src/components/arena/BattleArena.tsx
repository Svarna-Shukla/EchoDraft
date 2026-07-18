import type { useBattleArena } from "../../hooks/useBattleArena";
import ArenaLayout from "./ArenaLayout";
import TopHealthBars from "./TopHealthBars";
import MaskStage from "./MaskStage";
import PitchIntake from "./PitchIntake";
import ScanningPulse from "./ScanningPulse";
import QuestionPanel from "./QuestionPanel";
import ResponseControls from "./ResponseControls";
import JudgmentFlash from "./JudgmentFlash";
import ScorecardOverlay from "./ScorecardOverlay";

type Props = {
  arena: ReturnType<typeof useBattleArena>;
  isListening: boolean;
  transcript: string;
  audioLevels: number[];
  onToggleRecord: () => void;
  onGenerateDeck: () => void;
  isGeneratingDeck: boolean;
};

// Top-level Battle Arena coordinator: the mask fills the top of the screen throughout, reacting to
// whichever phase is live, while the bottom slot swaps between pitch intake, scanning, the current
// question + response controls, judgment, and finally the scorecard.
export default function BattleArena({ arena, isListening, transcript, audioLevels, onToggleRecord, onGenerateDeck, isGeneratingDeck }: Props) {
  const showBars = arena.phase === "attacking" || arena.phase === "response" || arena.phase === "judgment";
  const flash = arena.phase === "judgment" && arena.lastOutcome ? (arena.lastOutcome.outcome === "strong" ? "green" : "red") : null;

  return (
    <ArenaLayout>
      {showBars && <TopHealthBars investorHealth={arena.investorHealth} founderHealth={arena.founderHealth} />}
      <MaskStage
        state={arena.maskState}
        attackTrigger={arena.attackTrigger}
        flash={flash}
        flashKey={arena.rounds.length}
        compact={arena.phase === "scorecard"}
      />

      <div className="flex flex-1 flex-col items-center justify-start gap-6 pb-6">
        {arena.phase === "input" && (
          <PitchIntake
            isListening={isListening}
            transcript={transcript}
            audioLevels={audioLevels}
            onToggleRecord={onToggleRecord}
            onSubmitPitch={arena.submitPitch}
          />
        )}
        {arena.phase === "scanning" && <ScanningPulse />}
        {(arena.phase === "attacking" || arena.phase === "response") && (
          <>
            <QuestionPanel
              question={arena.currentQuestion}
              roundNumber={arena.roundNumber}
              totalRounds={arena.totalRounds}
              onTypedComplete={arena.questionTypedOut}
            />
            <ResponseControls visible={arena.phase === "response"} onSubmitAnswer={arena.submitAnswer} />
          </>
        )}
        {arena.phase === "judgment" && arena.lastOutcome && (
          <JudgmentFlash
            outcome={arena.lastOutcome.outcome}
            text={arena.lastOutcome.text}
            isWinning={arena.isWinning}
            failed={arena.failed}
            onRetry={arena.fightAgain}
          />
        )}
        {arena.phase === "scorecard" && arena.scorecard && (
          <ScorecardOverlay
            scorecard={arena.scorecard}
            onFightAgain={arena.fightAgain}
            onGenerateDeck={onGenerateDeck}
            isGeneratingDeck={isGeneratingDeck}
          />
        )}
      </div>
    </ArenaLayout>
  );
}
