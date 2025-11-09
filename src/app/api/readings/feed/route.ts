import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const items = await prisma.reading.findMany({
    select: { id: true, type: true, createdAt: true },
    orderBy: { createdAt: "desc" },
    take: 6,
  });
  return NextResponse.json({ items });
}
