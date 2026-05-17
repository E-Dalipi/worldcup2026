import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  const { password, matchId, scoreHome, scoreAway, status } = await request.json();
  
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  const match = await prisma.match.update({
    where: { id: matchId },
    data: { scoreHome, scoreAway, status },
  });
  
  revalidatePath("/");
  revalidatePath("/groups");
  revalidatePath("/knockout");
  revalidatePath(`/match/${match.matchNumber}`);
  
  return NextResponse.json({ success: true, match });
}
