import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const prompt = searchParams.get("prompt") || "billboard advertisement";
  const seed = searchParams.get("seed") || "1";

  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=768&height=1024&nologo=true&seed=${seed}`;

  const res = await fetch(url);
  if (!res.ok) return NextResponse.json({ error: "Error" }, { status: 500 });

  const blob = await res.blob();
  const buffer = await blob.arrayBuffer();

  return new NextResponse(buffer, {
    headers: { "Content-Type": "image/jpeg" },
  });
}