import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  const payload = await request.text();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", { apiVersion: "2023-10-16" });

  if (!secret) {
    logger.warn("stripe webhook secret missing");
    return NextResponse.json({ error: "config" }, { status: 500 });
  }

  try {
    const signature = request.headers.get("stripe-signature") as string;
    const event = stripe.webhooks.constructEvent(payload, signature, secret);
    logger.info({ type: event.type }, "stripe webhook received");
    return NextResponse.json({ received: true });
  } catch (error: any) {
    logger.error({ error }, "stripe webhook error");
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
}
