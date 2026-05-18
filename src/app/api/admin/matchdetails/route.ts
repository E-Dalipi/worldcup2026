import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const password = searchParams.get("password");
  const matchId = searchParams.get("matchId");
  
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  if (!matchId) {
    return NextResponse.json({ error: "matchId required" }, { status: 400 });
  }
  
  const goals = await prisma.goalEvent.findMany({
    where: { matchId: parseInt(matchId) },
    include: { team: true },
    orderBy: { minute: "asc" },
  });
  
  const highlights = await prisma.highlight.findMany({
    where: { matchId: parseInt(matchId) },
    orderBy: { minute: "asc" },
  });
  
  return NextResponse.json({ goals, highlights });
}
