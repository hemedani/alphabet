"use client";

import { useEffect, useRef, useState } from "react";

const TOTAL_LETTERS = 26;

const toFa = (n: number) => n.toLocaleString("fa-IR", { useGrouping: false });

export default function ProgressBar({
  masteredCount,
  stars,
  onReset,
}: {
  masteredCount: number;
  stars: number;
  onReset: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Disarm the two-step reset if the user walks away
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleResetClick = () => {
    if (!confirming) {
      setConfirming(true);
      timerRef.current = setTimeout(() => setConfirming(false), 3000);
      return;
    }
    if (timerRef.current) clearTimeout(timerRef.current);
    setConfirming(false);
    onReset();
  };

  const pct = Math.round((masteredCount / TOTAL_LETTERS) * 100);
  const milestoneFill = stars > 0 && stars % 5 === 0 ? 5 : stars % 5;

  return (
    <section
      aria-label="پیشرفت بازی"
      className="flex w-full items-center gap-3 rounded-3xl border border-white/70 bg-white/60 p-3 shadow-lg backdrop-blur-md sm:p-4"
    >
      {/* progress toward mastering all letters */}
      <div className="min-w-0 flex-1">
        <p className="mb-1 truncate text-xs font-bold text-plum-light sm:text-sm">
          حرف‌هایی که یاد گرفتی: {toFa(masteredCount)} از {toFa(TOTAL_LETTERS)}
        </p>
        <div
          className="h-4 overflow-hidden rounded-full border border-white bg-white/80 shadow-inner"
          role="progressbar"
          aria-valuenow={masteredCount}
          aria-valuemin={0}
          aria-valuemax={TOTAL_LETTERS}
        >
          <div
            className="h-full rounded-full transition-[width] duration-700 ease-out"
            style={{
              width: `${pct}%`,
              background:
                "linear-gradient(90deg, #FFB7D9 0%, #E6E0F8 35%, #AEDFF7 65%, #B5EAD7 100%)",
            }}
          />
        </div>
      </div>

      {/* star meter: fills up every 5 collected stars */}
      <div className="flex shrink-0 flex-col items-center gap-1">
        <div className="flex items-center gap-0.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className={`text-lg leading-none transition-transform ${
                i < milestoneFill ? "scale-110" : "opacity-30 grayscale"
              }`}
              role="img"
              aria-hidden="true"
            >
              ⭐
            </span>
          ))}
        </div>
        <span className="text-xs font-bold text-plum-light">{toFa(stars)} ⭐</span>
      </div>

      {/* parent-gated reset */}
      <button
        type="button"
        onClick={handleResetClick}
        aria-label="شروع دوباره بازی"
        title="شروع دوباره"
        className={`shrink-0 rounded-2xl border px-3 py-2 text-xs font-bold transition-colors ${
          confirming
            ? "animate-pop border-red-300 bg-red-100 text-red-600"
            : "border-white/70 bg-white/70 text-plum-light hover:bg-white"
        }`}
      >
        {confirming ? "مطمئنی؟" : "↺ نو"}
      </button>
    </section>
  );
}
