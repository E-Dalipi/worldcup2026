import { prisma } from "@/lib/prisma";
import MatchCard from "@/components/MatchCard";

export const revalidate = 60;

export default async function KnockoutPage() {
  const matches = await prisma.match.findMany({
    where: {
      NOT: { stage: { startsWith: "Group" } },
    },
    include: { homeTeam: true, awayTeam: true },
    orderBy: [{ date: "asc" }, { matchNumber: "asc" }],
  });

  const stages = [
    { key: "R32", label: "Round of 32", icon: "🔵" },
    { key: "R16", label: "Round of 16", icon: "🟣" },
    { key: "QF", label: "Quarterfinals", icon: "🟡" },
    { key: "SF", label: "Semifinals", icon: "🟢" },
    { key: "3rd", label: "Third-Place Match", icon: "🥉" },
    { key: "Final", label: "Final", icon: "🏆" },
  ];

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">
        <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Knockout Stage
        </span>
      </h1>

      <div className="space-y-10">
        {stages.map(({ key, label, icon }) => {
          const stageMatches = matches.filter((m) => m.stage === key);
          if (stageMatches.length === 0) return null;
          return (
            <section key={key}>
              <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
                <span>{icon}</span> {label}
                <span className="ml-2 text-sm font-normal text-[var(--text-muted)]">
                  {stageMatches.length} match{stageMatches.length !== 1 ? "es" : ""}
                </span>
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {stageMatches.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
