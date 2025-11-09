import { NextRequest, NextResponse } from "next/server";
import { findDream, createVideoJob } from "@/lib/data-store";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const dream = findDream(params.id);
  if (!dream) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  const body = await request.json().catch(() => ({}));
  const job = createVideoJob({
    userId: dream.userId,
    dreamId: dream.id,
    template: body.template || "2D-Flat-Dream",
    aspect: body.aspect || "9:16",
    fps: body.fps || 24,
  });
  logger.info({ jobId: job.id }, "video queued");
  return NextResponse.json(job);
}
