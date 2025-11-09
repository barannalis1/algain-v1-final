import { NextResponse } from "next/server";
import { listReadings } from "@/lib/data-store";

export async function GET() {
  const items = listReadings(6).map((item) => ({
    id: item.id,
    type: item.type,
    createdAt: item.createdAt,
  }));
  return NextResponse.json({ items });
}
