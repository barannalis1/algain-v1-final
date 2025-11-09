import { NextRequest, NextResponse } from "next/server";
import { createReading } from "@/lib/data-store";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const motifs = ["kanat", "ışık", "anahtar", "çınar"];
  const result = {
    motif: motifs[Math.floor(Math.random() * motifs.length)],
    meaning: "Hayatında yeni bir kapı aralanıyor, niyetlerini netleştir.",
    ritual: "Türk kahveni içtikten sonra fincanını kalbin üzerine koyup 3 derin nefes al.",
  };
  const reading = createReading({
    userId: "demo-user",
    type: "COFFEE",
    inputJson: body,
    images: Array.isArray(body.images) ? body.images : [],
    resultJson: result,
  });
  return NextResponse.json({ ...result, id: reading.id });
}
