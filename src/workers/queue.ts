import "dotenv/config";
import { Queue, Worker, QueueScheduler, JobsOptions } from "bullmq";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { analyzeDream } from "@/lib/ai";

const connection = { connection: { url: process.env.REDIS_URL || "redis://localhost:6379" } };

export const interpretationQueue = new Queue("interpretation", connection);
export const videoQueue = new Queue("video", connection);
export const notifyQueue = new Queue("notify", connection);

new QueueScheduler("interpretation", connection);
new QueueScheduler("video", connection);
new QueueScheduler("notify", connection);

new Worker("interpretation", async (job) => {
  const dream = await prisma.dream.findUnique({ where: { id: job.data.dreamId } });
  if (!dream) return;
  const analysis = await analyzeDream(dream.text);
  await prisma.interpretation.upsert({
    where: { dreamId: dream.id },
    update: {
      summary: analysis.summary,
      symbols: analysis.symbols,
      advice: analysis.advice,
      tone: analysis.tone,
    },
    create: {
      dreamId: dream.id,
      summary: analysis.summary,
      symbols: analysis.symbols,
      advice: analysis.advice,
      tone: analysis.tone,
    },
  });
  logger.info({ dreamId: dream.id }, "interpretation worker complete");
}, connection);

new Worker("video", async (job) => {
  const video = await prisma.videoJob.update({
    where: { id: job.data.jobId },
    data: { status: "RENDERING" },
  });
  logger.info({ jobId: video.id }, "rendering started");
  await new Promise((resolve) => setTimeout(resolve, 2000));
  await prisma.videoJob.update({
    where: { id: job.data.jobId },
    data: { status: "DONE", outputUrl: `https://supabase.storage/${video.id}.mp4`, thumbUrl: `https://supabase.storage/${video.id}.jpg` },
  });
  logger.info({ jobId: video.id }, "rendering completed");
}, connection);

new Worker("notify", async (job) => {
  logger.info({ jobId: job.id }, "sending 09:00 notification");
}, connection);

export async function scheduleDailyNotifications(userId: string) {
  const jobOptions: JobsOptions = {
    repeat: { pattern: "0 9 * * *" },
    removeOnComplete: true,
  };
  await notifyQueue.add("daily", { userId }, jobOptions);
}
