import { useCallback, useEffect, useRef, useState } from "react";
import type { MaskState } from "../components/arena/mask/ArenaMask";
import type { ArenaRound, BattlePhase } from "../types/arena";
import { useArenaHealth } from "./useArenaHealth";
import { usePitcherator } from "./usePitcherator";

const JUDGMENT_DISPLAY_MS = 1600;
const MIN_SCANNING_MS = 2000;
const LOSING_THRESHOLD = 40;
const STRONG_LINES = ["Decent.", "Not bad."];
const WEAK_LINES = ["Pathetic.", "Is that all?"];
// determines the quality of the answer given

// Orchestrates the full Battle Arena experience: wraps usePitcherator's Groq-backed question/scorecard
// generation with a presentation-facing phase machine, live health bars, the mask's current
// personality state, and the completed Q&A rounds needed later to regenerate the deck.
export function useBattleArena() {
  const pitcherator = usePitcherator();
  const health = useArenaHealth();
  const [phase, setPhase] = useState<BattlePhase>("input");
  const [rounds, setRounds] = useState<ArenaRound[]>([]);
  const [pitchTranscript, setPitchTranscript] = useState("");
  const [lastOutcome, setLastOutcome] = useState<{ outcome: "strong" | "weak"; text: string } | null>(null);
  const scanningReady = useRef(false);
  const attackTrigger = useRef(0);

  // Enforces a minimum 2s "Analyzing your pitch..." beat even if the Groq call resolves faster
  useEffect(() => {
    if (phase !== "scanning") return;
    scanningReady.current = false;
    const timer = window.setTimeout(() => {
      scanningReady.current = true;
      if (pitcherator.stage === "asking") {
        attackTrigger.current += 1;
        setPhase("attacking");
      }
    }, MIN_SCANNING_MS);
    return () => window.clearTimeout(timer);
  }, [phase, pitcherator.stage]);

  // Once question generation succeeds (and the minimum scan time has passed), the first attack fires
  useEffect(() => {
    if (pitcherator.stage === "asking" && phase === "scanning" && scanningReady.current) {
      attackTrigger.current += 1;
      setPhase("attacking");
    }
  }, [pitcherator.stage, phase]);

  // Once the final scorecard is ready, reveal it regardless of which phase was mid-flight
  useEffect(() => {
    if (pitcherator.stage === "scorecard" && phase !== "scorecard") setPhase("scorecard");
  }, [pitcherator.stage, phase]);

  // If question generation fails, drop back to the input step so the founder can retry
  useEffect(() => {
    if (pitcherator.failed && phase === "scanning") setPhase("input");
  }, [pitcherator.failed, phase]);

  // Kicks off a fresh battle from the founder's pitch transcript
  const submitPitch = useCallback(
    (transcript: string) => {
      if (!transcript.trim()) return;
      setRounds([]);
      setLastOutcome(null);
      setPitchTranscript(transcript);
      health.reset();
      setPhase("scanning");
      pitcherator.start(transcript);
    },
    [pitcherator, health]
  );

  // Once the question has fully typed out, the mask stops "speaking" and listens for the answer
  const questionTypedOut = useCallback(() => setPhase("response"), []);

  // Judges the founder's answer, updates both health bars, and either advances to the next attack or
  // leaves the arena on "judgment" display until the final scorecard lands
  const submitAnswer = useCallback(
    (text: string) => {
      const question = pitcherator.questions[pitcherator.currentQuestionIndex] ?? "";
      const outcome = health.judge(text);
      setRounds((r) => [...r, { question, answer: text, outcome }]);
      const lines = outcome === "strong" ? STRONG_LINES : WEAK_LINES;
      setLastOutcome({ outcome, text: lines[Math.floor(Math.random() * lines.length)] });
      setPhase("judgment");
      const isLastRound = pitcherator.currentQuestionIndex >= pitcherator.questions.length - 1;
      pitcherator.submitAnswer(text);
      if (!isLastRound) {
        window.setTimeout(() => {
          attackTrigger.current += 1;
          setPhase("attacking");
        }, JUDGMENT_DISPLAY_MS);
      }
    },
    [pitcherator, health]
  );

  // Flushes the battle entirely and returns to the pitch-intake step
  const fightAgain = useCallback(() => {
    setRounds([]);
    setPitchTranscript("");
    setLastOutcome(null);
    health.reset();
    pitcherator.reset();
    setPhase("input");
  }, [pitcherator, health]);

  const maskState: MaskState =
    phase === "attacking"
      ? "speaking"
      : phase === "response"
        ? "listening"
        : phase === "judgment"
          ? health.founderHealth < LOSING_THRESHOLD
            ? "winning"
            : (lastOutcome?.outcome ?? "idle")
          : "idle";

  return {
    phase,
    rounds,
    pitchTranscript,
    currentQuestion: pitcherator.questions[pitcherator.currentQuestionIndex] ?? "",
    roundNumber: pitcherator.currentQuestionIndex + 1,
    totalRounds: pitcherator.questions.length || 3,
    scorecard: pitcherator.scorecard,
    failed: pitcherator.failed,
    investorHealth: health.investorHealth,
    founderHealth: health.founderHealth,
    isWinning: health.founderHealth < LOSING_THRESHOLD,
    lastOutcome,
    maskState,
    attackTrigger: attackTrigger.current,
    submitPitch,
    questionTypedOut,
    submitAnswer,
    fightAgain,
  };
}
