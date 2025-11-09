"use client";

import { create } from "zustand";

type Tier = "FREE" | "PREMIUM" | "PRO";

type DreamState = {
  id?: string;
  text: string;
  tags: string[];
  audioUrl?: string;
  transcript?: string;
  mood?: string;
  analysis?: {
    summary: string;
    symbols: string[];
    advice: string[];
    tone: string;
    videoPlan?: ScenePlan[];
  };
  services: {
    tarot: boolean;
    astro: boolean;
    palm: boolean;
    coffee: boolean;
  };
  video?: {
    status: "idle" | "queued" | "rendering" | "ready" | "error";
    template?: string;
    aspect?: string;
    fps?: number;
    url?: string;
    thumb?: string;
    error?: string;
  };
};

type ScenePlan = {
  title: string;
  subtitle: string;
  palette: string[];
  animation: string;
  duration: number;
};

type SessionState = {
  tier: Tier;
  dailyInterpretationsUsed: number;
  monthlyVideosUsed: number;
  dream: DreamState;
  setTier: (tier: Tier) => void;
  resetDream: () => void;
  updateDream: (data: Partial<DreamState>) => void;
};

const initialDream: DreamState = {
  text: "",
  tags: [],
  services: {
    tarot: true,
    astro: true,
    palm: false,
    coffee: false,
  },
};

export const useSessionStore = create<SessionState>((set) => ({
  tier: "FREE",
  dailyInterpretationsUsed: 0,
  monthlyVideosUsed: 0,
  dream: initialDream,
  setTier: (tier) => set({ tier }),
  resetDream: () => set({ dream: initialDream }),
  updateDream: (data) => set((state) => ({ dream: { ...state.dream, ...data } })),
}));
