"use client";

import { useCallback, useEffect, useRef } from "react";

const FEMALE_VOICE_HINTS = [
  "samantha",
  "zira",
  "ava",
  "aria",
  "jenny",
  "victoria",
  "karen",
  "moira",
  "tessa",
  "female",
];

/**
 * Web Speech API wrapper that prefers an American-English female voice.
 * Safe to call during SSR — only touches `speechSynthesis` inside effects/handlers.
 */
export function useSpeech() {
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    const pickVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      const english = voices.filter((v) => v.lang.toLowerCase().startsWith("en"));
      voiceRef.current =
        english.find(
          (v) =>
            v.lang === "en-US" &&
            FEMALE_VOICE_HINTS.some((h) => v.name.toLowerCase().includes(h)),
        ) ??
        english.find((v) => v.lang === "en-US") ??
        english[0] ??
        null;
    };

    pickVoice();
    window.speechSynthesis.addEventListener("voiceschanged", pickVoice);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", pickVoice);
      window.speechSynthesis.cancel();
    };
  }, []);

  const speak = useCallback((text: string, rate = 0.85) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = rate;
    utterance.pitch = 1.15;
    if (voiceRef.current) utterance.voice = voiceRef.current;
    synth.speak(utterance);
  }, []);

  /** Speaks e.g. "A. A is for Apple." */
  const speakLetterAndWord = useCallback(
    (letter: string, word: string) => {
      speak(`${letter}. ${letter} is for ${word}.`);
    },
    [speak],
  );

  return { speak, speakLetterAndWord };
}
