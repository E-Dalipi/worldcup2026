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
  
  // If matchId provided, return goals + highlights for that match
  if (matchId) {
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
  
  // Watch party approvals
  const approveParty = searchParams.get("approveParty");
  if (approveParty) {
    await prisma.watchParty.update({
      where: { id: parseInt(approveParty) },
      data: { approved: true },
    });
    return NextResponse.json({ success: true });
  }

  // List pending watch parties
  const pendingParties = searchParams.get("pendingParties");
  if (pendingParties === "true") {
    const parties = await prisma.watchParty.findMany({
      where: { approved: false },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(parties);
  }

  // Otherwise return all matches
  const matches = await prisma.match.findMany({
    include: { homeTeam: true, awayTeam: true },
    orderBy: [{ date: "asc" }, { matchNumber: "asc" }],
  });
  
  return NextResponse.json(matches);
}
