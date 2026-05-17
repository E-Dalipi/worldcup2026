import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  const { password, matchId, teamId, playerName, minute, minuteExtra, assistName, goalType } =
    await request.json();
  
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  const goal = await prisma.goalEvent.create({
    data: { matchId, teamId, playerName, minute, minuteExtra, assistName, goalType },
  });
  
  // Get match number for revalidation
  const match = await prisma.match.findUnique({ where: { id: matchId } });
  if (match) {
    revalidatePath(`/match/${match.matchNumber}`);
    revalidatePath("/");
  }
  
  return NextResponse.json({ success: true, goal });
}
