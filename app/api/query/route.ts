import { NextRequest, NextResponse } from "next/server";
import { runPipeline } from "@/lib/pipeline";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const message = typeof body?.message === "string" ? body.message.trim() : "";

  if (!message) {
    return NextResponse.json({ error: "message is required" }, { status: 400 });
  }

  const result = await runPipeline(message);
  return NextResponse.json(result);
}
