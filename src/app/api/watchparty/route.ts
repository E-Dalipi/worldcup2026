import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/watchparty?city=Toronto&team=Argentina
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");
  const team = searchParams.get("team");

  const where: Record<string, unknown> = { approved: true };
  if (city) where.city = { contains: city, mode: "insensitive" };
  if (team) where.teamFanbase = { contains: team, mode: "insensitive" };

  const parties = await prisma.watchParty.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(parties);
}

// POST /api/watchparty — submit a new watch party venue
export async function POST(request: Request) {
  const { city, country, venueName, address, description, teamFanbase, submittedBy } =
    await request.json();

  if (!city || !venueName) {
    return NextResponse.json({ error: "City and venue name required" }, { status: 400 });
  }

  const party = await prisma.watchParty.create({
    data: {
      city,
      country: country || "US",
      venueName,
      address: address || null,
      description: description || null,
      teamFanbase: teamFanbase || null,
      submittedBy: submittedBy || null,
      approved: false,
    },
  });

  return NextResponse.json({ success: true, party });
}
