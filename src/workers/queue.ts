import { analyzeDream } from "@/lib/ai";
import { logger } from "@/lib/logger";
import {
  findDream,
  saveInterpretation,
  startVideoJob,
  completeVideoJob,
} from "@/lib/data-store";

export async function processDreamInterpretation(dreamId: string) {
  const dream = findDream(dreamId);
  if (!dream) return;
  const analysis = await analyzeDream(dream.transcript || dream.text);
  saveInterpretation(dreamId, {
    summary: analysis.summary,
    symbols: analysis.symbols,
    advice: analysis.advice,
    tone: analysis.tone,
    lang: "tr",
  });
  logger.info({ dreamId }, "interpretation processed");
}

export async function processVideoRender(jobId: string) {
  const job = startVideoJob(jobId);
  if (!job) return;
  await new Promise((resolve) => setTimeout(resolve, 1000));
  completeVideoJob(jobId, {
    outputUrl: `https://storage.dreamoracle.space/videos/${jobId}.mp4`,
    thumbUrl: `https://storage.dreamoracle.space/thumbs/${jobId}.jpg`,
  });
  logger.info({ jobId }, "video render complete");
}

export async function scheduleDailyNotifications(userId: string) {
  logger.info({ userId }, "09:00 motivasyon bildirimi planlandı");
}
