import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";

export async function POST() {
  logger.info("sending test notification via Resend + Push");
  return NextResponse.json({ status: "queued" });
}
