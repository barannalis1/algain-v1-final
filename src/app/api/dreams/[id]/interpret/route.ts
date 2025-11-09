import { NextRequest, NextResponse } from "next/server";
import { analyzeDream } from "@/lib/ai";
import { findDream, saveInterpretation } from "@/lib/data-store";
import { logger } from "@/lib/logger";

export async function POST(_: NextRequest, { params }: { params: { id: string } }) {
  const dream = findDream(params.id);
  if (!dream) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const analysis = await analyzeDream(dream.transcript || dream.text);
  saveInterpretation(dream.id, {
    summary: analysis.summary,
    symbols: analysis.symbols,
    advice: analysis.advice,
    tone: analysis.tone,
    lang: "tr",
  });

  logger.info({ dreamId: dream.id }, "dream interpreted");

  return NextResponse.json({ ...analysis });
}
