import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { recordWebhookLog } from "@/lib/data-store";

export async function POST(request: NextRequest) {
  const body = await request.text();
  logger.info({ body: body.slice(0, 256) }, "stripe webhook simulated");
  recordWebhookLog({ type: "stripe", status: "received" });
  return NextResponse.json({ received: true });
}
