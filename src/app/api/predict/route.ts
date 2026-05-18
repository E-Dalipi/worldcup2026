import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/predict?matchId=102 — get prediction stats for a match
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const matchId = searchParams.get("matchId");
  const visitorId = searchParams.get("visitorId");

  if (!matchId) {
    return NextResponse.json({ error: "matchId required" }, { status: 400 });
  }

  const mid = parseInt(matchId);

  const predictions = await prisma.prediction.findMany({
    where: { matchId: mid },
  });

  const total = predictions.length;

  // Calculate stats
  let homeWins = 0;
  let draws = 0;
  let awayWins = 0;
  let avgHome = 0;
  let avgAway = 0;

  for (const p of predictions) {
    avgHome += p.predictedHome;
    avgAway += p.predictedAway;
    if (p.predictedHome > p.predictedAway) homeWins++;
    else if (p.predictedHome < p.predictedAway) awayWins++;
    else draws++;
  }

  if (total > 0) {
    avgHome = Math.round((avgHome / total) * 10) / 10;
    avgAway = Math.round((avgAway / total) * 10) / 10;
  }

  // Check if this visitor already predicted
  let userPrediction = null;
  if (visitorId) {
    const existing = await prisma.prediction.findUnique({
      where: { matchId_visitorId: { matchId: mid, visitorId } },
    });
    if (existing) {
      userPrediction = {
        predictedHome: existing.predictedHome,
        predictedAway: existing.predictedAway,
      };
    }
  }

  return NextResponse.json({
    total,
    homeWinPct: total > 0 ? Math.round((homeWins / total) * 100) : 0,
    drawPct: total > 0 ? Math.round((draws / total) * 100) : 0,
    awayWinPct: total > 0 ? Math.round((awayWins / total) * 100) : 0,
    avgHome,
    avgAway,
    userPrediction,
  });
}

// POST /api/predict — submit a prediction
export async function POST(request: Request) {
  const { matchId, visitorId, predictedHome, predictedAway } = await request.json();

  if (!matchId || !visitorId || predictedHome === undefined || predictedAway === undefined) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Check match is still scheduled
  const match = await prisma.match.findUnique({ where: { id: matchId } });
  if (!match || match.status !== "scheduled") {
    return NextResponse.json({ error: "Match already started or finished" }, { status: 400 });
  }

  // Upsert prediction
  const prediction = await prisma.prediction.upsert({
    where: { matchId_visitorId: { matchId, visitorId } },
    update: { predictedHome, predictedAway },
    create: { matchId, visitorId, predictedHome, predictedAway },
  });

  return NextResponse.json({ success: true, prediction });
}
