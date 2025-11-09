export const LIMITS = {
  FREE: {
    interpretationsPerDay: 3,
    videosPerMonth: 0,
    videoQuality: "360p preview (filigran)",
  },
  PREMIUM: {
    interpretationsPerDay: Infinity,
    videosPerMonth: 5,
    videoQuality: "1080p, filigransız",
  },
  PRO: {
    interpretationsPerDay: Infinity,
    videosPerMonth: Infinity,
    videoQuality: "4K export, özel şablon",
  },
} as const;
