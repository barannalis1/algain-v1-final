import { NextRequest, NextResponse } from "next/server";
import { createDream } from "@/lib/data-store";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const text = String(form.get("text") || "").trim();
  const audio = form.get("audio") as File | null;

  if (!text && !audio) {
    return NextResponse.json({ error: "text or audio required" }, { status: 400 });
  }

  const dream = createDream({
    userId: "demo-user",
    text: text || "Ses kaydından transkript bekleniyor",
    audioUrl: audio ? `supabase://uploads/${audio.name}` : null,
    transcript: text || null,
  });

  logger.info({ dreamId: dream.id }, "dream created");

  return NextResponse.json({ id: dream.id, text: dream.text });
}
