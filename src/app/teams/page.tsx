import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export default async function TeamsPage() {
  const teams = await prisma.team.findMany({
    orderBy: [{ groupName: "asc" }, { name: "asc" }],
  });

  // Organize by group
  const groups = new Map<string, typeof teams>();
  for (const team of teams) {
    const g = groups.get(team.groupName) ?? [];
    g.push(team);
    groups.set(team.groupName, g);
  }

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">
        <span className="bg-gradient-to-r from-[var(--green)] to-blue-400 bg-clip-text text-transparent">
          All 48 Teams
        </span>
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from(groups.entries())
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([letter, groupTeams]) => (
            <div
              key={letter}
              className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4"
            >
              <h2 className="mb-3 text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider">
                Group {letter}
              </h2>
              <div className="space-y-2">
                {groupTeams.map((team) => (
                  <Link
                    key={team.id}
                    href={`/teams/${team.code.toLowerCase()}`}
                    className="flex items-center gap-3 rounded-lg p-2 transition hover:bg-[var(--bg-card-hover)]"
                  >
                    <span className="text-3xl">{team.flag}</span>
                    <div>
                      <div className="font-medium">{team.name}</div>
                      <div className="text-xs text-[var(--text-muted)]">{team.code}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
