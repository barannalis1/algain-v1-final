import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { analyzeDream } from "@/lib/ai";
import { logger } from "@/lib/logger";

export async function POST(_: NextRequest, { params }: { params: { id: string } }) {
  const dream = await prisma.dream.findUnique({ where: { id: params.id } });
  if (!dream) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const analysis = await analyzeDream(dream.transcript || dream.text);

  await prisma.interpretation.upsert({
    where: { dreamId: dream.id },
    update: {
      summary: analysis.summary,
      symbols: analysis.symbols,
      advice: analysis.advice,
      tone: analysis.tone,
      lang: "tr",
    },
    create: {
      dreamId: dream.id,
      summary: analysis.summary,
      symbols: analysis.symbols,
      advice: analysis.advice,
      tone: analysis.tone,
      lang: "tr",
    },
  });

  logger.info({ dreamId: dream.id }, "dream interpreted");

  return NextResponse.json({ ...analysis });
}
