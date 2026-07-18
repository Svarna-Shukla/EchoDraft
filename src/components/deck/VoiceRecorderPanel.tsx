import RecordButton from "../RecordButton";
import Waveform from "../Waveform";
import Transcript from "../Transcript";
import PitcheratorButton from "../pitcherator/PitcheratorButton";
import type { Theme } from "../../hooks/useTheme";

type Props = {
  isListening: boolean;
  onToggleRecord: () => void;
  transcript: string;
  audioLevels: number[];
  isGenerating: boolean;
  canPitcherate: boolean;
  onPitcherator: () => void;
  theme: Theme;
};

// Voice recording controls: record button, live waveform, and live transcript
export default function VoiceRecorderPanel({
  isListening,
  onToggleRecord,
  transcript,
  audioLevels,
  isGenerating,
  canPitcherate,
  onPitcherator,
  theme,
}: Props) {
  return (
    <div className="flex flex-col items-center px-6 pt-8">
      <div className="flex items-center gap-4">
        <RecordButton recording={isListening} onClick={onToggleRecord} />
        <PitcheratorButton disabled={!canPitcherate} onClick={onPitcherator} />
      </div>
      <p className="mt-3 text-xs text-gray-500">
        {isListening ? "Listening… click to stop" : isGenerating ? "Building your deck…" : "Click to start speaking"}
      </p>
      <Waveform levels={audioLevels} active={isListening} />
      <Transcript text={transcript} isListening={isListening} theme={theme} />
    </div>
  );
}
