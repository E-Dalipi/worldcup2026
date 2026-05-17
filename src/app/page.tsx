import { prisma } from "@/lib/prisma";
import MatchCard from "@/components/MatchCard";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export default async function HomePage() {
  const matches = await prisma.match.findMany({
    include: { homeTeam: true, awayTeam: true },
    orderBy: [{ date: "asc" }, { matchNumber: "asc" }],
  });

  // Group matches by date
  const matchesByDate = new Map<string, typeof matches>();
  for (const match of matches) {
    const existing = matchesByDate.get(match.date) ?? [];
    existing.push(match);
    matchesByDate.set(match.date, existing);
  }

  function formatDate(dateStr: string) {
    const d = new Date(dateStr + "T12:00:00");
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  // Count stats
  const groupMatches = matches.filter((m) => m.stage.startsWith("Group")).length;
  const knockoutMatches = matches.length - groupMatches;
  const totalTeams = await prisma.team.count();

  return (
    <div>
      {/* Hero */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold md:text-5xl">
          <span className="bg-gradient-to-r from-[var(--accent)] via-purple-400 to-pink-400 bg-clip-text text-transparent">
            FIFA World Cup 2026
          </span>
        </h1>
        <p className="mt-2 text-[var(--text-secondary)]">
          🇺🇸 USA • 🇨🇦 Canada • 🇲🇽 Mexico — June 11 to July 19
        </p>

        {/* Quick stats */}
        <div className="mt-6 flex justify-center gap-6 text-sm">
          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-4 py-2">
            <span className="text-2xl font-bold text-[var(--accent)]">{totalTeams}</span>
            <span className="ml-1 text-[var(--text-muted)]">Teams</span>
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-4 py-2">
            <span className="text-2xl font-bold text-[var(--gold)]">{matches.length}</span>
            <span className="ml-1 text-[var(--text-muted)]">Matches</span>
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-4 py-2">
            <span className="text-2xl font-bold text-[var(--green)]">{groupMatches}</span>
            <span className="ml-1 text-[var(--text-muted)]">Group</span>
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-4 py-2">
            <span className="text-2xl font-bold text-purple-400">{knockoutMatches}</span>
            <span className="ml-1 text-[var(--text-muted)]">Knockout</span>
          </div>
        </div>
      </div>

      {/* Match Calendar */}
      <div className="space-y-8">
        {Array.from(matchesByDate.entries()).map(([date, dayMatches]) => (
          <section key={date}>
            <div className="sticky top-[57px] z-10 -mx-4 mb-4 border-b border-[var(--border)] bg-[var(--bg-primary)]/90 px-4 py-2 backdrop-blur-md">
              <h2 className="text-lg font-semibold">{formatDate(date)}</h2>
              <p className="text-xs text-[var(--text-muted)]">
                {dayMatches.length} match{dayMatches.length !== 1 ? "es" : ""}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {dayMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
