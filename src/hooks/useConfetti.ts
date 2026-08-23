"use client";

import { useCallback, useEffect, useRef } from "react";

const COLORS = ["#FF8FBF", "#FFD166", "#7FD6B5", "#82C8EE", "#B9A7E8", "#FFC48F"];
const PIECE_COUNT = 130;
const GRAVITY = 0.35;

interface Piece {
  el: HTMLDivElement;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
}

/** Confetti bursts rendered outside the React tree; one rAF loop drives all pieces. */
export function useConfetti() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const piecesRef = useRef<Piece[]>([]);
  const rafRef = useRef<number | null>(null);

  const ensureContainer = useCallback(() => {
    let container = containerRef.current;
    if (!container) {
      container = document.createElement("div");
      container.setAttribute("aria-hidden", "true");
      Object.assign(container.style, {
        position: "fixed",
        inset: "0",
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: "9999",
      } satisfies Partial<CSSStyleDeclaration>);
      document.body.appendChild(container);
      containerRef.current = container;
    }
    return container;
  }, []);

  const burst = useCallback(() => {
    const container = ensureContainer();

    for (let i = 0; i < PIECE_COUNT; i++) {
      const el = document.createElement("div");
      const size = 8 + Math.random() * 10;
      Object.assign(el.style, {
        position: "absolute",
        top: "0",
        left: "0",
        width: `${size}px`,
        height: `${Math.random() > 0.5 ? size : size / 2}px`,
        backgroundColor: COLORS[i % COLORS.length],
        borderRadius: Math.random() > 0.7 ? "50%" : "2px",
        willChange: "transform",
      } satisfies Partial<CSSStyleDeclaration>);
      el.style.transform = "translate3d(-100px, -100px, 0)";
      container.appendChild(el);
      piecesRef.current.push({
        el,
        x: Math.random() * window.innerWidth,
        y: -20 - Math.random() * 80,
        vx: (Math.random() - 0.5) * 5,
        vy: 1 + Math.random() * 3,
        rot: Math.random() * 360,
        vr: (Math.random() - 0.5) * 14,
      });
    }

    if (rafRef.current !== null) return; // loop already running

    const step = () => {
      let alive = false;
      for (const piece of piecesRef.current) {
        piece.vy += GRAVITY;
        piece.x += piece.vx;
        piece.y += piece.vy;
        piece.rot += piece.vr;
        if (piece.y < window.innerHeight + 40) alive = true;
        piece.el.style.transform = `translate3d(${piece.x}px, ${piece.y}px, 0) rotate(${piece.rot}deg)`;
      }
      if (alive) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        for (const piece of piecesRef.current) piece.el.remove();
        piecesRef.current = [];
        rafRef.current = null;
      }
    };
    rafRef.current = requestAnimationFrame(step);
  }, [ensureContainer]);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      for (const piece of piecesRef.current) piece.el.remove();
      piecesRef.current = [];
      containerRef.current?.remove();
      containerRef.current = null;
    };
  }, []);

  return burst;
}
