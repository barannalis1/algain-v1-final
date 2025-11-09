import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const dream = await prisma.dream.findUnique({ where: { id: params.id } });
  if (!dream) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  const body = await request.json().catch(() => ({}));
  const job = await prisma.videoJob.create({
    data: {
      userId: dream.userId,
      dreamId: dream.id,
      template: body.template || "2D-Flat-Dream",
      aspect: body.aspect || "9:16",
      fps: body.fps || 24,
      status: "QUEUED",
    },
  });
  logger.info({ jobId: job.id }, "video queued");
  return NextResponse.json(job);
}
