import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Auth service is not configured in this demo." }, { status: 501 });
}

export async function POST() {
  return NextResponse.json({ message: "Auth service is not configured in this demo." }, { status: 501 });
}
