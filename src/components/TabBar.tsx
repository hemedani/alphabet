"use client";

export type Mode = "learn" | "trace" | "quiz";

const TABS: { id: Mode; label: string; icon: string; activeBg: string }[] = [
  { id: "learn", label: "بیاموز", icon: "📖", activeBg: "bg-bubblegum" },
  { id: "trace", label: "بنویس", icon: "✏️", activeBg: "bg-mint" },
  { id: "quiz", label: "حدس بزن", icon: "🎯", activeBg: "bg-babyblue" },
];

export default function TabBar({
  mode,
  onChange,
}: {
  mode: Mode;
  onChange: (mode: Mode) => void;
}) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-2">
      <div className="mx-auto flex w-full max-w-xl gap-2 rounded-[2rem] border border-white/70 bg-white/70 p-2 shadow-xl backdrop-blur-md">
        {TABS.map((tab) => {
          const active = mode === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              aria-label={tab.label}
              aria-current={active ? "page" : undefined}
              className={`flex min-h-[64px] flex-1 flex-col items-center justify-center gap-0.5 rounded-3xl text-base font-bold transition-all duration-200 active:scale-95 ${
                active
                  ? `${tab.activeBg} scale-[1.03] shadow-lg`
                  : "text-plum-light hover:bg-white/80"
              }`}
            >
              <span className="text-2xl leading-none" role="img" aria-hidden="true">
                {tab.icon}
              </span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
