export interface LetterData {
  /** Uppercase letter, e.g. "A" */
  letter: string;
  /** IPA phonetic, e.g. "/eɪ/" */
  phonetic: string;
  /** Example word starting with the letter */
  word: string;
  /** Farsi translation of the word */
  persianWord: string;
  /** Emoji illustrating the word */
  emoji: string;
  /** Vibrant hex color used for the letter display */
  color: string;
}

export const ALPHABET: LetterData[] = [
  { letter: "A", phonetic: "/eɪ/", word: "Apple", persianWord: "سیب", emoji: "🍎", color: "#FF6FA5" },
  { letter: "B", phonetic: "/biː/", word: "Ball", persianWord: "توپ", emoji: "⚽", color: "#FF8C42" },
  { letter: "C", phonetic: "/siː/", word: "Cat", persianWord: "گربه", emoji: "🐱", color: "#FFB020" },
  { letter: "D", phonetic: "/diː/", word: "Dog", persianWord: "سگ", emoji: "🐶", color: "#7BC96F" },
  { letter: "E", phonetic: "/iː/", word: "Elephant", persianWord: "فیل", emoji: "🐘", color: "#4ECDC4" },
  { letter: "F", phonetic: "/ɛf/", word: "Fish", persianWord: "ماهی", emoji: "🐟", color: "#45AAF2" },
  { letter: "G", phonetic: "/dʒiː/", word: "Grapes", persianWord: "انگور", emoji: "🍇", color: "#A55EEA" },
  { letter: "H", phonetic: "/eɪtʃ/", word: "House", persianWord: "خانه", emoji: "🏠", color: "#FD79A8" },
  { letter: "I", phonetic: "/aɪ/", word: "Ice cream", persianWord: "بستنی", emoji: "🍦", color: "#00CEC9" },
  { letter: "J", phonetic: "/dʒeɪ/", word: "Juice", persianWord: "آبمیوه", emoji: "🧃", color: "#F0932B" },
  { letter: "K", phonetic: "/keɪ/", word: "Kite", persianWord: "بادبادک", emoji: "🪁", color: "#E17055" },
  { letter: "L", phonetic: "/ɛl/", word: "Lion", persianWord: "شیر", emoji: "🦁", color: "#F39C12" },
  { letter: "M", phonetic: "/ɛm/", word: "Moon", persianWord: "ماه", emoji: "🌙", color: "#6C5CE7" },
  { letter: "N", phonetic: "/ɛn/", word: "Nose", persianWord: "بینی", emoji: "👃", color: "#00B894" },
  { letter: "O", phonetic: "/oʊ/", word: "Orange", persianWord: "پرتقال", emoji: "🍊", color: "#FF7675" },
  { letter: "P", phonetic: "/piː/", word: "Penguin", persianWord: "پنگوئن", emoji: "🐧", color: "#74B9FF" },
  { letter: "Q", phonetic: "/kjuː/", word: "Queen", persianWord: "ملکه", emoji: "👑", color: "#C56CF0" },
  { letter: "R", phonetic: "/ɑːr/", word: "Rainbow", persianWord: "رنگین‌کمان", emoji: "🌈", color: "#5DADE2" },
  { letter: "S", phonetic: "/ɛs/", word: "Star", persianWord: "ستاره", emoji: "⭐", color: "#FDCB6E" },
  { letter: "T", phonetic: "/tiː/", word: "Tree", persianWord: "درخت", emoji: "🌳", color: "#52BE80" },
  { letter: "U", phonetic: "/juː/", word: "Umbrella", persianWord: "چتر", emoji: "☂️", color: "#9B59B6" },
  { letter: "V", phonetic: "/viː/", word: "Violin", persianWord: "ویولن", emoji: "🎻", color: "#E5989B" },
  { letter: "W", phonetic: "/ˈdʌbəljuː/", word: "Whale", persianWord: "نهنگ", emoji: "🐳", color: "#3D9BE9" },
  { letter: "X", phonetic: "/ɛks/", word: "X-ray", persianWord: "اشعه ایکس", emoji: "🩻", color: "#7F8FA6" },
  { letter: "Y", phonetic: "/waɪ/", word: "Yo-yo", persianWord: "یویو", emoji: "🪀", color: "#FC427B" },
  { letter: "Z", phonetic: "/ziː/", word: "Zebra", persianWord: "گورخر", emoji: "🦓", color: "#596275" },
];

/** Motivational phrases shown every 5 collected stars (personalized for Sareh). */
export const PRAISE_PHRASES: string[] = [
  "آفرین ساره! خیلی باهوشی! 🌟",
  "عالی بود ساره جان! تو یک ستاره‌ای! ✨",
  "چه هوشمندانه! ساره تو بهترینی! 💖",
  "ایول ساره! ادامه بده، قهرمان! 🎀",
  "تو یک جادوگر حروف هستی ساره! 🪄",
];
