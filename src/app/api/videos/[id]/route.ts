import { NextResponse } from "next/server";
import { getVideoJob } from "@/lib/data-store";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const job = getVideoJob(params.id);
  if (!job) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(job);
}
