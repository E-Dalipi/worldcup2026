import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  const { password, matchId, title, description, minute, videoUrl, type } =
    await request.json();
  
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  const highlight = await prisma.highlight.create({
    data: { matchId, title, description, minute, videoUrl, type },
  });
  
  // Get match number for revalidation
  const match = await prisma.match.findUnique({ where: { id: matchId } });
  if (match) {
    revalidatePath(`/match/${match.matchNumber}`);
  }
  
  return NextResponse.json({ success: true, highlight });
}
