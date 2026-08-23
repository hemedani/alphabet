"use client";

import type { LetterData } from "@/data/alphabet";

interface LearnModeProps {
  data: LetterData;
  index: number;
  total: number;
  mastered: boolean;
  onPrev: () => void;
  onNext: () => void;
  speakLetterAndWord: (letter: string, word: string) => void;
  speak: (text: string, rate?: number) => void;
}

const toFa = (n: number) => n.toLocaleString("fa-IR", { useGrouping: false });

export default function LearnMode({
  data,
  index,
  total,
  mastered,
  onPrev,
  onNext,
  speakLetterAndWord,
  speak,
}: LearnModeProps) {
  return (
    <article className="flex w-full max-w-xl flex-col items-center gap-5 rounded-[2.5rem] border-2 border-white/80 bg-white/55 p-6 shadow-2xl backdrop-blur-md sm:p-8">
      {/* letter display */}
      <div
        key={data.letter}
        className="animate-bounce-in flex items-center justify-center gap-4"
        dir="ltr"
      >
        <span
          className="font-en text-[7rem] font-bold leading-none drop-shadow-lg sm:text-[9rem]"
          style={{ color: data.color }}
        >
          {data.letter}
        </span>
        <span className="font-en text-[4.5rem] font-bold leading-none text-plum/60 sm:text-7xl">
          {data.letter.toLowerCase()}
        </span>
        <span
          className="animate-float text-[4.5rem] leading-none sm:text-7xl"
          role="img"
          aria-label={data.word}
        >
          {data.emoji}
        </span>
      </div>

      {/* word + phonetic */}
      <div className="-mt-2 text-center" dir="ltr">
        <h2 className="font-en text-4xl font-bold sm:text-5xl" style={{ color: data.color }}>
          {data.word}
        </h2>
        <p className="font-en mt-1 text-xl text-plum-light">{data.phonetic}</p>
      </div>

      {/* farsi translation */}
      <p className="-mt-3 rounded-full bg-lavender px-6 py-1.5 text-2xl font-bold text-plum">
        {data.persianWord}
      </p>

      {mastered && (
        <p className="animate-pop rounded-full bg-mint px-4 py-1 text-sm font-bold text-plum">
          ✅ این حرف را یاد گرفتی!
        </p>
      )}

      {/* speak buttons */}
      <div className="flex w-full flex-col items-stretch gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => speakLetterAndWord(data.letter, data.word)}
          className="flex min-h-[64px] flex-1 items-center justify-center gap-3 rounded-full border-b-4 border-bubblegum-deep bg-gradient-to-b from-bubblegum to-bubblegum-deep text-xl font-bold text-white shadow-lg transition-transform active:translate-y-0.5 active:scale-[0.98]"
        >
          <span className="text-2xl" aria-hidden="true">
            🔊
          </span>
          گوش بده
        </button>
        <button
          type="button"
          onClick={() => speak(`${data.word}. ${data.word}`, 0.75)}
          aria-label={`تلفظ آهسته کلمه ${data.word}`}
          className="flex min-h-[64px] items-center justify-center gap-2 rounded-full border-2 border-babyblue-deep/40 bg-babyblue px-6 text-lg font-bold text-plum shadow transition-transform active:scale-95"
        >
          <span aria-hidden="true">🐢</span>
          آهسته‌تر
        </button>
      </div>

      {/* navigation — alphabet reads LTR, so "next" points right */}
      <div className="flex w-full items-center justify-between">
        <button
          type="button"
          onClick={onPrev}
          aria-label="حرف قبلی"
          className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-peach text-4xl font-bold text-plum shadow-lg transition-transform hover:scale-105 active:scale-95"
        >
          ›
        </button>
        <span className="text-sm font-bold text-plum-light">
          حرف {toFa(index + 1)} از {toFa(total)}
        </span>
        <button
          type="button"
          onClick={onNext}
          aria-label="حرف بعدی"
          className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-lavender-deep text-4xl font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
        >
          ‹
        </button>
      </div>
    </article>
  );
}
