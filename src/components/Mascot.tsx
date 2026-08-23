"use client";

import type { CSSProperties } from "react";

export type Mood = "idle" | "happy" | "sad" | "excited";

const FUR = "#FFF3E6";
const INK = "#4A3742";

/** 5-point star (outer r=8, inner r=3.4) centered at origin — used for excited eyes. */
const STAR_POINTS =
  "0,-8 2.06,-2.75 7.61,-2.47 3.23,1.05 4.7,6.47 0,3.4 -4.7,6.47 -3.23,1.05 -7.61,-2.47 -2.06,-2.75";

interface MascotProps {
  mood?: Mood;
  /** Optional Farsi text shown in a speech bubble next to the cat. */
  message?: string;
}

function Eyes({ mood }: { mood: Mood }) {
  if (mood === "happy") {
    return (
      <g stroke={INK} strokeWidth={3.5} strokeLinecap="round" fill="none">
        <path d="M43,70 Q50,59 57,70" />
        <path d="M83,70 Q90,59 97,70" />
      </g>
    );
  }
  if (mood === "sad") {
    return (
      <g>
        <g stroke={INK} strokeWidth={3.5} strokeLinecap="round" fill="none">
          <path d="M43,64 Q50,72 57,64" />
          <path d="M83,64 Q90,72 97,64" />
        </g>
        <path d="M94,74 q5.5,9 0,13 q-5.5,-4 0,-13 z" fill="#82C8EE" />
      </g>
    );
  }
  if (mood === "excited") {
    return (
      <g fill="#FFD166" stroke={INK} strokeWidth={1.5} strokeLinejoin="round">
        <polygon points={STAR_POINTS} transform="translate(50,68)" />
        <polygon points={STAR_POINTS} transform="translate(90,68)" />
      </g>
    );
  }
  // idle: big shiny eyes
  return (
    <g fill={INK}>
      <circle cx={50} cy={68} r={6} />
      <circle cx={90} cy={68} r={6} />
      <circle cx={48} cy={66} r={2} fill="#fff" />
      <circle cx={88} cy={66} r={2} fill="#fff" />
    </g>
  );
}

function Mouth({ mood }: { mood: Mood }) {
  if (mood === "excited") {
    return (
      <g>
        <path d="M57,88 Q70,106 83,88 Z" fill="#B3405E" />
        <path d="M63,95 Q70,101 77,95 Q70,99 63,95 Z" fill="#FF8FBF" />
      </g>
    );
  }
  if (mood === "sad") {
    return (
      <path d="M60,96 Q70,87 80,96" stroke={INK} strokeWidth={3} strokeLinecap="round" fill="none" />
    );
  }
  if (mood === "happy") {
    return (
      <g>
        <path d="M58,89 Q70,102 82,89 Z" fill="#B3405E" />
        <ellipse cx={70} cy={95} rx={5} ry={2.6} fill="#FF8FBF" />
      </g>
    );
  }
  // idle: little "w" smile
  return (
    <path
      d="M61,91 Q65.5,95 70,91 Q74.5,95 79,91"
      stroke={INK}
      strokeWidth={2.5}
      strokeLinecap="round"
      fill="none"
    />
  );
}

const MOOD_ANIMATION: Record<Mood, { className?: string; style?: CSSProperties }> = {
  idle: { className: "animate-wiggle", style: { animationDuration: "4s" } },
  happy: { className: "animate-pop" },
  sad: { style: { transform: "translateY(4px) rotate(-2deg)" } },
  excited: { className: "animate-pop animate-wiggle" },
};

export default function Mascot({ mood = "idle", message }: MascotProps) {
  const anim = MOOD_ANIMATION[mood];
  return (
    <div className="relative inline-flex flex-col items-center">
      {message && (
        <div className="relative mb-2 max-w-[240px] rounded-2xl border-2 border-white/80 bg-white/85 px-4 py-2 text-center text-sm font-bold text-plum shadow-lg backdrop-blur-sm">
          {message}
          <span className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-b-2 border-r-2 border-white/80 bg-white/85" />
        </div>
      )}
      <div key={mood} className={`h-24 w-24 sm:h-28 sm:w-28 ${anim.className ?? ""}`} style={anim.style}>
        <svg viewBox="0 0 140 130" className="drop-shadow-lg" role="img" aria-label="گربه بازیگوش">
          {/* ears */}
          <polygon points="30,48 20,10 60,29" fill={FUR} />
          <polygon points="110,48 120,10 80,29" fill={FUR} />
          <polygon points="33,41 27,21 51,31" fill="#FFB7D9" />
          <polygon points="107,41 113,21 89,31" fill="#FFB7D9" />
          {/* head */}
          <ellipse cx="70" cy="74" rx="50" ry="44" fill={FUR} />
          {/* blush */}
          <ellipse cx="38" cy="86" rx="8.5" ry="5" fill="#FFB7D9" opacity=".65" />
          <ellipse cx="102" cy="86" rx="8.5" ry="5" fill="#FFB7D9" opacity=".65" />
          {/* whiskers */}
          <g stroke="#E0A9B8" strokeWidth={2} strokeLinecap="round">
            <line x1="14" y1="76" x2="36" y2="78" />
            <line x1="12" y1="88" x2="36" y2="86" />
            <line x1="126" y1="76" x2="104" y2="78" />
            <line x1="128" y1="88" x2="104" y2="86" />
          </g>
          <Eyes mood={mood} />
          <path d="M65,79 h10 l-5,7 z" fill="#FF8FBF" />
          <Mouth mood={mood} />
        </svg>
      </div>
    </div>
  );
}
