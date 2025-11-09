import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const theme = `Bugünün teması: ${body.birthplace || "İstanbul"} gökyüzünde cesaret.`;
  const caution = "Sabırlı ol, acele karar verme.";
  const opportunity = "Sezgisel bağlantılar kur ve yeni işbirliği fırsatlarına açık ol.";
  const result = { theme, caution, opportunity };
  const reading = await prisma.reading.create({
    data: {
      userId: "demo-user",
      type: "ASTRO",
      inputJson: body,
      images: [],
      resultJson: result,
    },
  });
  return NextResponse.json({ id: reading.id, ...result });
}
