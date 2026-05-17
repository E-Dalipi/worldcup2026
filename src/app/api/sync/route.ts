import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// API-Football endpoint to sync live match data
// Call this via a cron job during live matches (e.g. every 60 seconds)
// GET /api/sync?key=YOUR_SECRET
//
// Set up a cron job on cron-job.org (free) or Vercel Cron:
// - During match days: every 1 minute
// - Off days: disabled

const API_FOOTBALL_BASE = "https://v3.football.api-sports.io";

// 2026 World Cup league ID in API-Football (will be confirmed closer to tournament)
const WORLD_CUP_LEAGUE_ID = 1; // Placeholder — update when API-Football confirms
const WORLD_CUP_SEASON = 2026;

interface ApiFixture {
  fixture: {
    id: number;
    status: { short: string };
  };
  teams: {
    home: { name: string };
    away: { name: string };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
  events?: Array<{
    time: { elapsed: number; extra: number | null };
    team: { name: string };
    player: { name: string };
    assist: { name: string | null };
    type: string;
    detail: string;
  }>;
}

// Map API-Football status codes to our status
function mapStatus(apiStatus: string): string {
  const liveStatuses = ["1H", "2H", "HT", "ET", "P", "BT", "LIVE"];
  const finishedStatuses = ["FT", "AET", "PEN"];
  
  if (liveStatuses.includes(apiStatus)) return "live";
  if (finishedStatuses.includes(apiStatus)) return "finished";
  return "scheduled";
}

// Map API-Football event detail to our goal type
function mapGoalType(detail: string): string {
  if (detail === "Penalty") return "penalty";
  if (detail === "Own Goal") return "own-goal";
  return "goal";
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");
  
  // Verify sync key
  if (key !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  const apiKey = process.env.API_FOOTBALL_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API_FOOTBALL_KEY not configured" }, { status: 500 });
  }
  
  try {
    // Fetch today's World Cup fixtures
    const today = new Date().toISOString().split("T")[0];
    const res = await fetch(
      `${API_FOOTBALL_BASE}/fixtures?league=${WORLD_CUP_LEAGUE_ID}&season=${WORLD_CUP_SEASON}&date=${today}`,
      {
        headers: {
          "x-apisports-key": apiKey,
        },
      }
    );
    
    if (!res.ok) {
      return NextResponse.json({ error: "API-Football request failed" }, { status: 502 });
    }
    
    const data = await res.json();
    const fixtures: ApiFixture[] = data.response || [];
    
    let updatedCount = 0;
    
    for (const fixture of fixtures) {
      const homeTeamName = fixture.teams.home.name;
      const awayTeamName = fixture.teams.away.name;
      
      // Find matching match in our DB by team names
      const homeTeam = await prisma.team.findFirst({
        where: { name: { contains: homeTeamName } },
      });
      const awayTeam = await prisma.team.findFirst({
        where: { name: { contains: awayTeamName } },
      });
      
      if (!homeTeam || !awayTeam) continue;
      
      const match = await prisma.match.findFirst({
        where: {
          homeTeamId: homeTeam.id,
          awayTeamId: awayTeam.id,
        },
      });
      
      if (!match) continue;
      
      // Update score and status
      const newStatus = mapStatus(fixture.fixture.status.short);
      await prisma.match.update({
        where: { id: match.id },
        data: {
          scoreHome: fixture.goals.home,
          scoreAway: fixture.goals.away,
          status: newStatus,
        },
      });
      
      // Sync goal events
      if (fixture.events) {
        const goalEvents = fixture.events.filter((e) => e.type === "Goal");
        
        for (const event of goalEvents) {
          // Find which team scored
          const scoringTeam =
            event.team.name.includes(homeTeamName) ? homeTeam : awayTeam;
          
          // Check if this goal already exists
          const existingGoal = await prisma.goalEvent.findFirst({
            where: {
              matchId: match.id,
              minute: event.time.elapsed,
              playerName: event.player.name,
            },
          });
          
          if (!existingGoal) {
            await prisma.goalEvent.create({
              data: {
                matchId: match.id,
                teamId: scoringTeam.id,
                playerName: event.player.name,
                minute: event.time.elapsed,
                minuteExtra: event.time.extra,
                assistName: event.assist.name,
                goalType: mapGoalType(event.detail),
              },
            });
          }
        }
      }
      
      // Revalidate pages
      revalidatePath(`/match/${match.matchNumber}`);
      updatedCount++;
    }
    
    // Revalidate main pages
    revalidatePath("/");
    revalidatePath("/groups");
    revalidatePath("/knockout");
    
    return NextResponse.json({
      success: true,
      date: today,
      fixturesFound: fixtures.length,
      matchesUpdated: updatedCount,
    });
  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
