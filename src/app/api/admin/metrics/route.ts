import { NextResponse } from "next/server";
import { countUsers, countDreams, countVideoJobs } from "@/lib/data-store";

export async function GET() {
  const users = countUsers();
  const dreams = countDreams();
  const videos = countVideoJobs();
  return NextResponse.json({ users, dreams, videos });
}
