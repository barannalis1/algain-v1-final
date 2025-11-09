import { NextRequest, NextResponse } from "next/server";
import { drawTarotSpread } from "@/lib/ai";
import { createReading } from "@/lib/data-store";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const spread = body.spread === "celtic" ? "celtic" : "three";
  const result = drawTarotSpread(spread === "three" ? "three" : "celtic");
  const reading = createReading({
    userId: "demo-user",
    type: "TAROT",
    inputJson: body,
    images: [],
    resultJson: result,
  });
  return NextResponse.json({ ...result, id: reading.id });
}
