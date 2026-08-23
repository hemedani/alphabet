"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ALPHABET, PRAISE_PHRASES } from "@/data/alphabet";
import { useConfetti } from "@/hooks/useConfetti";
import { useProgress } from "@/hooks/useProgress";
import { useSpeech } from "@/hooks/useSpeech";
import LearnMode from "./LearnMode";
import Mascot, { type Mood } from "./Mascot";
import ProgressBar from "./ProgressBar";
import QuizMode from "./QuizMode";
import SkyBackground from "./SkyBackground";
import TabBar, { type Mode } from "./TabBar";
import TraceMode from "./TraceMode";

export default function AlphabetApp() {
  const [mode, setMode] = useState<Mode>("learn");
  const [letterIndex, setLetterIndex] = useState(0);
  const [mood, setMood] = useState<Mood>("idle");
  const [mascotMessage, setMascotMessage] = useState(
    "سلام ساره جان! آماده‌ی یک ماجراجویی هستی؟ 💖",
  );
  const [praise, setPraise] = useState<string | null>(null);

  const moodTimerRef = useRef<number | null>(null);
  const prevStarsRef = useRef<number | null>(null);

  const { progress, addStar, resetGame } = useProgress();
  const burst = useConfetti();
  const { speak, speakLetterAndWord } = useSpeech();

  const current = ALPHABET[letterIndex];

  /** Mascot reacts, then drifts back to idle. */
  const react = useCallback((next: Mood, message?: string, durationMs = 2400) => {
    setMood(next);
    if (message) setMascotMessage(message);
    if (moodTimerRef.current !== null) window.clearTimeout(moodTimerRef.current);
    moodTimerRef.current = window.setTimeout(() => setMood("idle"), durationMs);
  }, []);

  useEffect(() => {
    return () => {
      if (moodTimerRef.current !== null) window.clearTimeout(moodTimerRef.current);
    };
  }, []);

  /** Every 5th star → confetti + motivational praise. */
  useEffect(() => {
    const prev = prevStarsRef.current;
    prevStarsRef.current = progress.stars;
    if (prev === null || progress.stars <= prev || progress.stars % 5 !== 0) return;

    setPraise(PRAISE_PHRASES[(progress.stars / 5 - 1) % PRAISE_PHRASES.length]);
    burst();
    react("excited", "واااای چه ستاره‌هایی! 🌟", 3200);
    const timer = window.setTimeout(() => setPraise(null), 3400);
    return () => window.clearTimeout(timer);
  }, [progress.stars, burst, react]);

  const goToLetter = useCallback(
    (delta: number) => {
      setLetterIndex((i) => (i + delta + ALPHABET.length) % ALPHABET.length);
    },
    [],
  );

  const handleQuizCorrect = useCallback(
    (letter: string) => {
      addStar(letter);
      burst();
      react("excited", "آفرین ساره! درست جواب دادی! 🎉");
    },
    [addStar, burst, react],
  );

  const handleQuizWrong = useCallback(() => {
    react("sad", "اشکالی نداره عزیزم، دوباره امتحان کن! 🌸");
  }, [react]);

  /** Speaks the letter/word and makes the mascot smile along. */
  const speakAndSmile = useCallback(
    (letter: string, word: string) => {
      speakLetterAndWord(letter, word);
      react("happy", "چه تلفظ قشنگی! 🎵", 1800);
    },
    [speakLetterAndWord, react],
  );

  const handleReset = useCallback(() => {
    resetGame();
    setLetterIndex(0);
    setPraise(null);
    prevStarsRef.current = 0;
    react("happy", "بازی از نو شروع شد! بریم! ✨");
  }, [resetGame, react]);

  return (
    <div className="flex min-h-dvh flex-col">
      <SkyBackground />

      {/* header: mascot + greeting */}
      <header className="mx-auto flex w-full max-w-xl items-end gap-2 px-4 pt-[calc(1rem+env(safe-area-inset-top))]">
        <Mascot mood={mood} message={mascotMessage} />
        <div className="min-w-0 flex-1 pb-1 text-right">
          <h1 className="text-2xl font-black leading-tight text-plum drop-shadow-sm sm:text-3xl">
            ماجراجویی الفبا ✨
          </h1>
          <p className="truncate text-xs font-bold text-plum-light sm:text-sm">
            سلام ساره‌ی عزیز! بیا حروف انگلیسی رو با هم یاد بگیریم!
          </p>
        </div>
      </header>

      {/* persistent progress */}
      <div className="z-10 mx-auto mt-3 w-full max-w-xl px-4">
        <ProgressBar
          masteredCount={progress.mastered.length}
          stars={progress.stars}
          onReset={handleReset}
        />
      </div>

      {/* active mode */}
      <main className="flex flex-1 justify-center px-4 pb-44 pt-5">
        {mode === "learn" && (
          <LearnMode
            key={`learn-${letterIndex}`}
            data={current}
            index={letterIndex}
            total={ALPHABET.length}
            mastered={progress.mastered.includes(current.letter)}
            onPrev={() => goToLetter(-1)}
            onNext={() => goToLetter(1)}
            speakLetterAndWord={speakAndSmile}
            speak={speak}
          />
        )}
        {mode === "trace" && <TraceMode data={current} />}
        {mode === "quiz" && (
          <QuizMode
            speak={speak}
            onCorrect={handleQuizCorrect}
            onWrong={handleQuizWrong}
          />
        )}
      </main>

      {/* bottom navigation */}
      <TabBar
        mode={mode}
        onChange={(next) => {
          setMode(next);
        }}
      />

      {/* every-5-stars celebration */}
      {praise && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-plum/20 p-6 backdrop-blur-[2px]"
          role="alertdialog"
          aria-label="پیام تشویق"
          onClick={() => setPraise(null)}
        >
          <div
            key={praise}
            className="animate-bounce-in rounded-[2.5rem] border-4 border-white bg-gradient-to-b from-white to-lavender/70 p-8 text-center shadow-2xl"
          >
            <p className="animate-float text-7xl" aria-hidden="true">
              🎉
            </p>
            <p className="mt-3 text-2xl font-black text-plum">{praise}</p>
            <p className="mt-2 text-3xl tracking-widest" aria-hidden="true">
              ⭐⭐⭐⭐⭐
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
