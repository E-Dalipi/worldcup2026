import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import MatchCard from "@/components/MatchCard";

export default async function TeamPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const team = await prisma.team.findFirst({
    where: { code: { equals: code.toUpperCase() } },
  });

  if (!team) notFound();

  const matches = await prisma.match.findMany({
    where: {
      OR: [{ homeTeamId: team.id }, { awayTeamId: team.id }],
    },
    include: { homeTeam: true, awayTeam: true },
    orderBy: [{ date: "asc" }, { matchNumber: "asc" }],
  });

  const groupTeams = await prisma.team.findMany({
    where: { groupName: team.groupName },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      {/* Team header */}
      <div className="mb-8 flex items-center gap-4">
        <span className="text-6xl">{team.flag}</span>
        <div>
          <h1 className="text-3xl font-bold">{team.name}</h1>
          <p className="text-[var(--text-secondary)]">
            Group {team.groupName} • {team.code}
          </p>
        </div>
      </div>

      {/* Group mates */}
      <div className="mb-8 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4">
        <h2 className="mb-3 text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider">
          Group {team.groupName} Teams
        </h2>
        <div className="flex flex-wrap gap-4">
          {groupTeams.map((t) => (
            <a
              key={t.id}
              href={`/teams/${t.code.toLowerCase()}`}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 transition ${
                t.id === team.id
                  ? "bg-[var(--accent-glow)] border border-[var(--accent)]"
                  : "hover:bg-[var(--bg-card-hover)]"
              }`}
            >
              <span className="text-xl">{t.flag}</span>
              <span className="text-sm font-medium">{t.name}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Matches */}
      <h2 className="mb-4 text-xl font-bold">
        Matches ({matches.length})
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {matches.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>
    </div>
  );
}
