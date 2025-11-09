import { NextRequest, NextResponse } from "next/server";
import { createReading } from "@/lib/data-store";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const result = {
    theme: "Günlük odak: iç denge",
    attention: "Sabah saatlerinde iletişim kanallarını temizle",
    opportunity: "Saat 17:00 sonrası yaratıcı fikirlerin kabarması",
    ritual: "Çam tütsüsü yak ve kısa bir meditasyon yap",
  };
  const reading = createReading({
    userId: "demo-user",
    type: "ASTRO",
    inputJson: body,
    images: [],
    resultJson: result,
  });
  return NextResponse.json({ ...result, id: reading.id });
}
