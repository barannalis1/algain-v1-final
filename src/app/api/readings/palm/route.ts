import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const left = form.get("left") as File | null;
  const right = form.get("right") as File | null;
  if (!left || !right) {
    return NextResponse.json({ error: "two images required" }, { status: 400 });
  }
  const result = {
    summary: "Yaşam çizgin güçlü, sezgisel kalp çizgisi empatiyi öne çıkarıyor.",
    lines: [
      { name: "Life", interpretation: "Dayanıklılık ve enerji döngüsü yüksek." },
      { name: "Heart", interpretation: "Duygusal açıklık ve yeni başlangıçlara hazırlık." },
      { name: "Head", interpretation: "Hayal gücün stratejik düşünce ile dengede." },
    ],
  };
  const reading = await prisma.reading.create({
    data: {
      userId: "demo-user",
      type: "PALM",
      inputJson: { notes: form.get("notes") },
      images: [left.name, right.name],
      resultJson: result,
    },
  });
  return NextResponse.json({ id: reading.id, ...result });
}
