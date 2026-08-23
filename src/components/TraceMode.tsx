"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import type { LetterData } from "@/data/alphabet";

const INK_COLOR = "#FF6FA5";
const INK_WIDTH = 16;

export default function TraceMode({ data }: { data: LetterData }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const hueRef = useRef(280);
  const [rainbow, setRainbow] = useState(false);
  const rainbowRef = useRef(false);

  useEffect(() => {
    rainbowRef.current = rainbow;
  }, [rainbow]);

  const getCtx = () => canvasRef.current?.getContext("2d") ?? null;

  const clearInk = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = getCtx();
    if (!canvas || !ctx) return;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }, []);

  // Size canvas to its wrapper using devicePixelRatio for crisp strokes
  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      canvas.getContext("2d")?.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(wrap);
    return () => observer.disconnect();
  }, []);

  // Fresh page for each letter
  useEffect(() => {
    clearInk();
  }, [data.letter, clearInk]);

  const pointFrom = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handlePointerDown = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drawingRef.current = true;
    lastPointRef.current = pointFrom(e);

    // draw a dot so taps leave a mark too
    const ctx = getCtx();
    const p = lastPointRef.current;
    if (!ctx || !p) return;
    ctx.beginPath();
    ctx.fillStyle = rainbowRef.current ? `hsl(${hueRef.current % 360} 85% 62%)` : INK_COLOR;
    ctx.arc(p.x, p.y, INK_WIDTH / 2, 0, Math.PI * 2);
    ctx.fill();
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    e.preventDefault();
    const ctx = getCtx();
    const from = lastPointRef.current;
    if (!ctx || !from) return;
    const to = pointFrom(e);

    hueRef.current += Math.hypot(to.x - from.x, to.y - from.y) / 3;
    ctx.strokeStyle = rainbowRef.current ? `hsl(${hueRef.current % 360} 85% 62%)` : INK_COLOR;
    ctx.lineWidth = INK_WIDTH;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    lastPointRef.current = to;
  };

  const endDrawing = () => {
    drawingRef.current = false;
    lastPointRef.current = null;
  };

  return (
    <div className="flex w-full max-w-xl flex-col items-center gap-4">
      <p className="text-lg font-bold text-plum">
        با انگشتت روی <span style={{ color: data.color }}>{data.letter}{data.letter.toLowerCase()}</span> بکش! ✨
      </p>

      {/* notebook page */}
      <div
        ref={wrapRef}
        className="relative aspect-[4/3] w-full rounded-[2rem] border-2 border-dashed border-lavender-deep/50 bg-white/70 shadow-xl backdrop-blur-md"
        style={{
          backgroundImage:
            "repeating-linear-gradient(180deg, transparent 0px, transparent 37px, rgba(185,167,232,.25) 38px)",
        }}
      >
        {/* dotted guide letter */}
        <svg
          viewBox="0 0 400 300"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          <text
            x="200"
            y="158"
            textAnchor="middle"
            fontSize="210"
            fontWeight="700"
            fill={data.color}
            opacity="0.13"
            className="font-en"
          >
            {data.letter}
            {data.letter.toLowerCase()}
          </text>
          <text
            x="200"
            y="158"
            textAnchor="middle"
            fontSize="210"
            fontWeight="700"
            fill="none"
            stroke="#B9A7E8"
            strokeWidth="2.5"
            strokeDasharray="7 10"
            className="font-en"
          >
            {data.letter}
            {data.letter.toLowerCase()}
          </text>
        </svg>

        {/* ink layer */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full cursor-crosshair touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrawing}
          onPointerCancel={endDrawing}
          aria-label={`صفحه تمرین نوشتن حرف ${data.letter}`}
        />
      </div>

      {/* controls */}
      <div className="flex w-full gap-3">
        <button
          type="button"
          onClick={() => setRainbow((r) => !r)}
          aria-pressed={rainbow}
          className={`flex min-h-[64px] flex-1 items-center justify-center gap-2 rounded-full border-b-4 text-lg font-bold shadow-lg transition-transform active:translate-y-0.5 active:scale-[0.98] ${
            rainbow
              ? "border-purple-400 bg-gradient-to-r from-pink-400 via-yellow-300 to-sky-400 text-white"
              : "border-plum-light/30 bg-white/80 text-plum"
          }`}
        >
          <span className="text-2xl" aria-hidden="true">
            🌈
          </span>
          {rainbow ? "رنگین‌کمان روشن!" : "مداد رنگین‌کمان"}
        </button>
        <button
          type="button"
          onClick={clearInk}
          className="flex min-h-[64px] flex-1 items-center justify-center gap-2 rounded-full border-b-4 border-peach-deep bg-peach text-lg font-bold text-plum shadow-lg transition-transform active:translate-y-0.5 active:scale-[0.98]"
        >
          <span className="text-2xl" aria-hidden="true">
            🧽
          </span>
          پاک کن
        </button>
      </div>
    </div>
  );
}
