import { logger } from "@/lib/logger";

export type DreamAnalysis = {
  summary: string;
  symbols: string[];
  advice: string[];
  tone: "calm" | "positive" | "neutral";
  mood: string;
  storyboard: ScenePlan[];
};

export type ScenePlan = {
  title: string;
  subtitle: string;
  palette: string[];
  animation: "flat" | "kinetic" | "rotoscope";
  duration: number;
};

const fallbackPalettes = [
  ["#FCE7F3", "#FBCFE8", "#E0F2FE"],
  ["#FDE68A", "#FEF3C7", "#BFDBFE"],
  ["#DDD6FE", "#E9D5FF", "#C7D2FE"],
];

export async function analyzeDream(text: string): Promise<DreamAnalysis> {
  const sentences = text.split(/(?<=[.!?])\s+/).filter(Boolean);
  const mood = sentences.some((s) => /korku|fear|dark/i.test(s)) ? "mystic" : "hopeful";
  const summary = sentences.slice(0, 2).join(" ") || text.slice(0, 160);
  const symbols = ["istasyon", "balık", "zaman", "cesaret"].slice(0, Math.max(3, 3));
  const advice = [
    "Güne başlarken içsel pusulanı dinle",
    "Gecikmiş konuşmalar için küçük bir adım at",
    "Cesaretini hatırlatan objeleri gününe dahil et",
  ];
  const storyboard: ScenePlan[] = new Array(4).fill(0).map((_, idx) => ({
    title: `Sahne ${idx + 1}`,
    subtitle: sentences[idx] || "Rüya yolculuğu devam ediyor.",
    palette: fallbackPalettes[idx % fallbackPalettes.length],
    animation: idx % 2 === 0 ? "flat" : "kinetic",
    duration: 4,
  }));
  return {
    summary,
    symbols,
    advice,
    tone: "calm",
    mood,
    storyboard,
  };
}

export type TarotCard = {
  name: string;
  position: "upright" | "reversed";
  meaning: string;
};

const tarotDeck: TarotCard[] = [
  { name: "The Fool", position: "upright", meaning: "Yeni başlangıç ve cesaret" },
  { name: "The Magician", position: "upright", meaning: "Yaratıcı güç ve odak" },
  { name: "The High Priestess", position: "reversed", meaning: "İçgüdülerle temas" },
  { name: "The Empress", position: "upright", meaning: "Bereket ve bakım" },
  { name: "The Chariot", position: "upright", meaning: "İrade ve yön" },
];

export function drawTarotSpread(type: "three" | "celtic" = "three") {
  const cards = tarotDeck
    .sort(() => Math.random() - 0.5)
    .slice(0, type === "three" ? 3 : 10)
    .map((card, idx) => ({
      ...card,
      position: Math.random() > 0.5 ? "upright" : "reversed",
      slot: idx,
    }));
  const narrative = cards.map((card) => `${card.name} (${card.position}) → ${card.meaning}`).join(" • ");
  return { cards, narrative };
}

export async function generateCoachingPrompt(mood: string) {
  return `Sabahına ${mood} bir tonda başla. Üç derin nefes al, tren düdüğünün cesaretini gün boyu taşı. Yapmak istediğin tek küçük şeyi seç ve bugün onun için ilk adımı at.`;
}
