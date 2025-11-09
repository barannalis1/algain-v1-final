import { NextRequest, NextResponse } from "next/server";
import { createReading } from "@/lib/data-store";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const result = {
    lifeLine: "Enerjini dengede tutman için haftalık dinlenme molaları planla.",
    headLine: "Zihinsel berraklığı artırmak için yazılı niyet çalışmaları önerilir.",
    heartLine: "Duygusal sınırlarını nazikçe güçlendirme zamanı.",
    disclaimer: "Palm okuma eğlence amaçlıdır; bilimsel tanı değildir.",
  };
  const reading = createReading({
    userId: "demo-user",
    type: "PALM",
    inputJson: body,
    images: Array.isArray(body.images) ? body.images : [],
    resultJson: result,
  });
  return NextResponse.json({ ...result, id: reading.id });
}
