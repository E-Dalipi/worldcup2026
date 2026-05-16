import { prisma } from "@/lib/prisma";
import MatchCard from "@/components/MatchCard";

export default async function GroupsPage() {
  const teams = await prisma.team.findMany({
    orderBy: [{ groupName: "asc" }, { name: "asc" }],
  });

  const matches = await prisma.match.findMany({
    where: { stage: { startsWith: "Group" } },
    include: { homeTeam: true, awayTeam: true },
    orderBy: [{ date: "asc" }, { matchNumber: "asc" }],
  });

  // Organize by group
  const groups = new Map<string, { teams: typeof teams; matches: typeof matches }>();
  for (const team of teams) {
    const g = groups.get(team.groupName) ?? { teams: [], matches: [] };
    g.teams.push(team);
    groups.set(team.groupName, g);
  }
  for (const match of matches) {
    const groupLetter = match.stage.replace("Group ", "");
    const g = groups.get(groupLetter);
    if (g) g.matches.push(match);
  }

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">
        <span className="bg-gradient-to-r from-blue-400 to-[var(--accent)] bg-clip-text text-transparent">
          Group Stage
        </span>
      </h1>

      <div className="space-y-10">
        {Array.from(groups.entries())
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([letter, group]) => (
            <section key={letter} id={`group-${letter}`}>
              <h2 className="mb-4 text-xl font-bold">
                Group {letter}
              </h2>

              {/* Standings table */}
              <div className="mb-4 overflow-x-auto rounded-lg border border-[var(--border)] bg-[var(--bg-card)]">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border)] text-[var(--text-muted)]">
                      <th className="px-4 py-2 text-left">#</th>
                      <th className="px-4 py-2 text-left">Team</th>
                      <th className="px-4 py-2 text-center">P</th>
                      <th className="px-4 py-2 text-center">W</th>
                      <th className="px-4 py-2 text-center">D</th>
                      <th className="px-4 py-2 text-center">L</th>
                      <th className="px-4 py-2 text-center">GF</th>
                      <th className="px-4 py-2 text-center">GA</th>
                      <th className="px-4 py-2 text-center">GD</th>
                      <th className="px-4 py-2 text-center font-bold">PTS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.teams.map((team, i) => (
                      <tr
                        key={team.id}
                        className={`border-b border-[var(--border)] last:border-0 ${
                          i < 2
                            ? "bg-[var(--accent-glow)]"
                            : ""
                        }`}
                      >
                        <td className="px-4 py-2 text-[var(--text-muted)]">{i + 1}</td>
                        <td className="px-4 py-2">
                          <a
                            href={`/teams/${team.code.toLowerCase()}`}
                            className="flex items-center gap-2 hover:text-[var(--accent)]"
                          >
                            <span className="text-lg">{team.flag}</span>
                            <span className="font-medium">{team.name}</span>
                          </a>
                        </td>
                        <td className="px-4 py-2 text-center">0</td>
                        <td className="px-4 py-2 text-center">0</td>
                        <td className="px-4 py-2 text-center">0</td>
                        <td className="px-4 py-2 text-center">0</td>
                        <td className="px-4 py-2 text-center">0</td>
                        <td className="px-4 py-2 text-center">0</td>
                        <td className="px-4 py-2 text-center">0</td>
                        <td className="px-4 py-2 text-center font-bold">0</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Group matches */}
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {group.matches.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            </section>
          ))}
      </div>
    </div>
  );
}
