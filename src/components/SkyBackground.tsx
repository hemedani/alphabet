const CLOUDS = [
  { top: "6%", scale: 1.1, duration: 75, delay: -10, opacity: 0.9 },
  { top: "16%", scale: 0.7, duration: 95, delay: -45, opacity: 0.7 },
  { top: "30%", scale: 1.35, duration: 120, delay: -80, opacity: 0.8 },
  { top: "44%", scale: 0.55, duration: 65, delay: -25, opacity: 0.5 },
  { top: "58%", scale: 0.9, duration: 105, delay: -60, opacity: 0.55 },
];

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Deterministic star field — identical on server and client (no hydration mismatch). */
const STARS = (() => {
  const rand = mulberry32(20260822);
  return Array.from({ length: 42 }, (_, i) => ({
    id: i,
    top: `${rand() * 70}%`,
    left: `${rand() * 100}%`,
    size: 2 + rand() * 3,
    delay: -(rand() * 3),
    duration: 2 + rand() * 2.5,
    gold: rand() > 0.7,
  }));
})();

function Cloud({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 100" className={className} aria-hidden="true">
      <g fill="#ffffff">
        <ellipse cx="60" cy="70" rx="45" ry="28" />
        <ellipse cx="110" cy="50" rx="52" ry="38" />
        <ellipse cx="165" cy="68" rx="46" ry="30" />
      </g>
    </svg>
  );
}

export default function SkyBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0 animate-sky"
        style={{
          backgroundImage:
            "linear-gradient(180deg, #e6e0f8 0%, #c9b8f0 22%, #aedff7 48%, #ffe4f1 78%, #ffdab9 100%)",
          backgroundSize: "100% 300%",
        }}
      />
      {/* sun glow */}
      <div
        className="absolute -top-16 -start-16 h-72 w-72 rounded-full opacity-60 blur-3xl"
        style={{ background: "radial-gradient(circle, #fff3c4 0%, transparent 70%)" }}
      />
      {STARS.map((s) => (
        <span
          key={s.id}
          className={`absolute animate-twinkle rounded-full ${s.gold ? "bg-yellow-200" : "bg-white"}`}
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            boxShadow: s.gold ? "0 0 6px 1px rgba(253,224,71,.8)" : "0 0 5px 1px rgba(255,255,255,.8)",
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
      {CLOUDS.map((c, i) => (
        <div
          key={i}
          className="animate-drift absolute w-56"
          style={{
            top: c.top,
            opacity: c.opacity,
            animationDuration: `${c.duration}s`,
            animationDelay: `${c.delay}s`,
          }}
        >
          <Cloud className="w-full drop-shadow-lg" />
        </div>
      ))}
    </div>
  );
}
