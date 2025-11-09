import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const cup = form.get("cup") as File | null;
  if (!cup) return NextResponse.json({ error: "cup image required" }, { status: 400 });
  const plate = form.get("plate") as File | null;
  const motifs = [
    { name: "Balık", meaning: "Bereket kapıda." },
    { name: "Yol", meaning: "Yeni bir davet alabilirsin." },
  ];
  const result = {
    summary: "Fincanın etrafında spiral enerji var; içgüdülerini takip et.",
    motifs,
  };
  const reading = await prisma.reading.create({
    data: {
      userId: "demo-user",
      type: "COFFEE",
      inputJson: { notes: form.get("notes") },
      images: [cup.name, plate?.name].filter(Boolean) as string[],
      resultJson: result,
    },
  });
  return NextResponse.json({ id: reading.id, ...result });
}
