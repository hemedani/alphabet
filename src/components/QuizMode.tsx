"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ALPHABET, type LetterData } from "@/data/alphabet";

type QuestionType = "visual" | "audio";

interface Question {
  type: QuestionType;
  target: LetterData;
  options: LetterData[];
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const toFa = (n: number) => n.toLocaleString("fa-IR", { useGrouping: false });

export default function QuizMode({
  speak,
  onCorrect,
  onWrong,
}: {
  speak: (text: string, rate?: number) => void;
  onCorrect: (letter: string) => void;
  onWrong: () => void;
}) {
  const [question, setQuestion] = useState<Question | null>(null);
  const [score, setScore] = useState(0);
  const [wrongPicks, setWrongPicks] = useState<string[]>([]);
  const [solved, setSolved] = useState(false);
  const nextTimerRef = useRef<number | null>(null);

  // no leaked timers
  useEffect(() => {
    return () => {
      if (nextTimerRef.current !== null) window.clearTimeout(nextTimerRef.current);
    };
  }, []);

  const nextQuestion = useCallback((avoidLetter?: string) => {
    const pool = ALPHABET.filter((l) => l.letter !== avoidLetter);
    const target = pool[Math.floor(Math.random() * pool.length)];
    const distractors = shuffle(ALPHABET.filter((l) => l.letter !== target.letter)).slice(0, 3);
    setQuestion({
      type: Math.random() < 0.5 ? "visual" : "audio",
      target,
      options: shuffle([target, ...distractors]),
    });
    setWrongPicks([]);
    setSolved(false);
  }, []);

  const pick = (option: LetterData) => {
    if (!question || solved || wrongPicks.includes(option.letter)) return;

    if (option.letter === question.target.letter) {
      setSolved(true);
      setScore((s) => s + 1);
      onCorrect(option.letter);
      nextTimerRef.current = window.setTimeout(() => {
        nextQuestion(question.target.letter);
      }, 1500);
    } else {
      setWrongPicks((prev) => [...prev, option.letter]);
      onWrong();
    }
  };

  /* ---------- start screen ---------- */
  if (!question) {
    return (
      <div className="flex w-full max-w-xl flex-col items-center gap-6 rounded-[2.5rem] border-2 border-white/80 bg-white/55 p-10 text-center shadow-2xl backdrop-blur-md">
        <span className="animate-float text-7xl" aria-hidden="true">
          🎯
        </span>
        <h2 className="text-3xl font-bold text-plum">بازی حدس بزن!</h2>
        <p className="text-lg font-bold text-plum-light">
          ساره جان، آماده‌ای؟ با هر جواب درست یک ستاره می‌گیری! ⭐
        </p>
        <button
          type="button"
          onClick={() => nextQuestion()}
          className="flex min-h-[72px] w-full items-center justify-center gap-3 rounded-full border-b-4 border-mint-deep bg-gradient-to-b from-mint to-mint-deep text-2xl font-bold text-plum shadow-xl transition-transform active:translate-y-0.5 active:scale-[0.98]"
        >
          <span className="text-3xl" aria-hidden="true">
            ▶️
          </span>
          شروع بازی!
        </button>
      </div>
    );
  }

  /* ---------- playing screen ---------- */
  return (
    <div className="flex w-full max-w-xl flex-col items-center gap-5 rounded-[2.5rem] border-2 border-white/80 bg-white/55 p-6 shadow-2xl backdrop-blur-md sm:p-8">
      <div className="flex w-full items-center justify-between">
        <p className="rounded-full bg-lavender px-4 py-1 text-sm font-bold text-plum">
          امتیاز تو: {toFa(score)} 🏆
        </p>
        {question.type === "visual" ? (
          <p className="rounded-full bg-bubblegum/60 px-4 py-1 text-sm font-bold text-plum">🖼️ کلمه‌ها</p>
        ) : (
          <p className="rounded-full bg-babyblue px-4 py-1 text-sm font-bold text-plum">🔊 صداها</p>
        )}
      </div>

      {question.type === "visual" ? (
        <>
          <p className="text-center text-xl font-bold leading-relaxed text-plum">
            اول این کلمه با کدام حرف شروع می‌شود؟
          </p>
          <span
            key={question.target.emoji}
            className="animate-pop text-[7rem] leading-none drop-shadow-lg"
            role="img"
            aria-label="کلمه پنهان"
          >
            {question.target.emoji}
          </span>
        </>
      ) : (
        <>
          <p className="text-center text-xl font-bold leading-relaxed text-plum">
            گوش کن! چه حرفی شنیدی؟
          </p>
          <button
            type="button"
            onClick={() => speak(question.target.letter)}
            aria-label="پخش دوباره صدا"
            className="flex h-[96px] w-[96px] items-center justify-center rounded-full border-b-4 border-babyblue-deep bg-gradient-to-b from-babyblue to-babyblue-deep text-5xl shadow-xl transition-transform active:translate-y-0.5 active:scale-95 animate-float"
          >
            🔊
          </button>
        </>
      )}

      {/* options */}
      <div className="grid w-full grid-cols-2 gap-3" role="group" aria-label="گزینه‌ها">
        {question.options.map((option) => {
          const isWrong = wrongPicks.includes(option.letter);
          const isChosenRight = solved && option.letter === question.target.letter;
          return (
            <button
              key={option.letter}
              type="button"
              dir="ltr"
              onClick={() => pick(option)}
              disabled={solved || isWrong}
              className={`font-en flex min-h-[76px] items-center justify-center rounded-3xl border-b-4 text-5xl font-bold shadow-lg transition-all duration-200 ${
                isChosenRight
                  ? "animate-glow scale-105 border-mint-deep bg-mint text-plum"
                  : isWrong
                    ? "animate-shake border-red-300 bg-red-100 text-red-400 opacity-60"
                    : "border-black/5 bg-white text-plum hover:-translate-y-1 hover:shadow-xl active:scale-95"
              }`}
            >
              {option.letter}
            </button>
          );
        })}
      </div>

      {wrongPicks.length > 0 && !solved && (
        <p className="animate-pop rounded-full bg-peach px-5 py-1.5 text-sm font-bold text-plum">
          اشکالی نداره! دوباره امتحان کن 💪
        </p>
      )}
      {solved && (
        <p key={score} className="animate-pop rounded-full bg-mint px-5 py-1.5 text-base font-bold text-plum">
          آفرین! درست بود! 🎉
        </p>
      )}
    </div>
  );
}
