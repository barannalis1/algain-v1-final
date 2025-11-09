import { NextResponse } from "next/server";
import { generateCoachingPrompt } from "@/lib/ai";

export async function GET() {
  const message = await generateCoachingPrompt("hopeful");
  return NextResponse.json({ message });
}
