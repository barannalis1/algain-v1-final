import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [users, dreams, videos] = await Promise.all([
    prisma.user.count(),
    prisma.dream.count(),
    prisma.videoJob.count(),
  ]);
  return NextResponse.json({ users, dreams, videos });
}
