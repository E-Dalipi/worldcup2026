import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export const revalidate = 30; // Faster refresh for match pages

function getStageLabel(stage: string) {
  if (stage.startsWith("Group")) return stage;
  const labels: Record<string, string> = {
    R32: "Round of 32",
    R16: "Round of 16",
    QF: "Quarterfinal",
    SF: "Semifinal",
    "3rd": "Third-Place Match",
    Final: "🏆 Final",
  };
  return labels[stage] || stage;
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

export default async function MatchPage({
  params,
}: {
  params: Promise<{ matchNumber: string }>;
}) {
  const { matchNumber } = await params;
  const mn = parseInt(matchNumber, 10);

  const match = await prisma.match.findUnique({
    where: { matchNumber: mn },
    include: {
      homeTeam: true,
      awayTeam: true,
      goals: { include: { team: true }, orderBy: { minute: "asc" } },
      highlights: { orderBy: { minute: "asc" } },
    },
  });

  if (!match) notFound();

  const isFinished = match.status === "finished";
  const isLive = match.status === "live";
  const homeName = match.homeTeam?.name ?? match.homePlaceholder ?? "TBD";
  const awayName = match.awayTeam?.name ?? match.awayPlaceholder ?? "TBD";
  const homeFlag = match.homeTeam?.flag ?? "🏳️";
  const awayFlag = match.awayTeam?.flag ?? "🏳️";

  return (
    <div className="mx-auto max-w-3xl">
      {/* Back link */}
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition"
      >
        ← Back to Calendar
      </Link>

      {/* Match header card */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6 md:p-8">
        {/* Stage + date */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
          <span className="rounded-full bg-[var(--accent-glow)] px-3 py-1 text-sm font-medium text-[var(--accent)]">
            {getStageLabel(match.stage)}
          </span>
          <div className="text-sm text-[var(--text-muted)]">
            {isLive && (
              <span className="mr-2 inline-flex items-center gap-1 text-[var(--red)] font-bold">
                <span className="h-2 w-2 rounded-full bg-[var(--red)] animate-pulse" />
                LIVE
              </span>
            )}
            {isFinished && (
              <span className="mr-2 text-[var(--green)] font-medium">Full Time</span>
            )}
            Match {match.matchNumber}
          </div>
        </div>

        {/* Score display */}
        <div className="flex items-center justify-center gap-6 md:gap-10">
          {/* Home */}
          <div className="flex flex-col items-center gap-2 flex-1">
            <span className="text-5xl md:text-6xl">{homeFlag}</span>
            <span className="text-lg font-bold text-center">{homeName}</span>
            {match.homeTeam && (
              <Link
                href={`/teams/${match.homeTeam.code.toLowerCase()}`}
                className="text-xs text-[var(--accent)] hover:underline"
              >
                View Team →
              </Link>
            )}
          </div>

          {/* Score */}
          <div className="flex flex-col items-center">
            {isFinished || isLive ? (
              <div className="flex items-center gap-3">
                <span className="rounded-xl bg-[var(--bg-primary)] px-4 py-2 text-4xl font-bold tabular-nums md:text-5xl">
                  {match.scoreHome ?? 0}
                </span>
                <span className="text-2xl text-[var(--text-muted)]">:</span>
                <span className="rounded-xl bg-[var(--bg-primary)] px-4 py-2 text-4xl font-bold tabular-nums md:text-5xl">
                  {match.scoreAway ?? 0}
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <span className="text-3xl text-[var(--text-muted)]">vs</span>
                <span className="mt-2 text-sm text-[var(--text-muted)]">Scheduled</span>
              </div>
            )}
          </div>

          {/* Away */}
          <div className="flex flex-col items-center gap-2 flex-1">
            <span className="text-5xl md:text-6xl">{awayFlag}</span>
            <span className="text-lg font-bold text-center">{awayName}</span>
            {match.awayTeam && (
              <Link
                href={`/teams/${match.awayTeam.code.toLowerCase()}`}
                className="text-xs text-[var(--accent)] hover:underline"
              >
                View Team →
              </Link>
            )}
          </div>
        </div>

        {/* Match info */}
        <div className="mt-6 grid grid-cols-1 gap-3 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] p-4 sm:grid-cols-3">
          <div className="text-center">
            <div className="text-xs text-[var(--text-muted)] uppercase">Date</div>
            <div className="mt-1 text-sm font-medium">{formatDate(match.date)}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-[var(--text-muted)] uppercase">Kickoff</div>
            <div className="mt-1 text-sm font-medium">{match.time}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-[var(--text-muted)] uppercase">Venue</div>
            <div className="mt-1 text-sm font-medium">{match.venue}</div>
            <div className="text-xs text-[var(--text-muted)]">{match.city}</div>
          </div>
        </div>
      </div>

      {/* Goals timeline */}
      {match.goals.length > 0 && (
        <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-6">
          <h2 className="mb-4 text-lg font-bold">⚽ Goals</h2>
          <div className="space-y-3">
            {match.goals.map((goal) => {
              const isHome = goal.teamId === match.homeTeamId;
              return (
                <div
                  key={goal.id}
                  className={`flex items-center gap-3 ${
                    isHome ? "" : "flex-row-reverse text-right"
                  }`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--bg-primary)] text-sm font-bold text-[var(--accent)]">
                    {goal.minute}&apos;
                    {goal.minuteExtra ? `+${goal.minuteExtra}` : ""}
                  </div>
                  <div>
                    <div className="font-medium">
                      {goal.playerName}
                      {goal.goalType === "penalty" && (
                        <span className="ml-1 text-xs text-[var(--text-muted)]">(pen.)</span>
                      )}
                      {goal.goalType === "own-goal" && (
                        <span className="ml-1 text-xs text-[var(--red)]">(o.g.)</span>
                      )}
                    </div>
                    {goal.assistName && (
                      <div className="text-xs text-[var(--text-muted)]">
                        Assist: {goal.assistName}
                      </div>
                    )}
                  </div>
                  <span className="text-lg">{goal.team.flag}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Highlights */}
      {match.highlights.length > 0 && (
        <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-6">
          <h2 className="mb-4 text-lg font-bold">🎬 Highlights</h2>
          <div className="space-y-4">
            {match.highlights.map((hl) => (
              <div
                key={hl.id}
                className="rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] p-4"
              >
                <div className="flex items-center gap-2 mb-1">
                  {hl.minute && (
                    <span className="text-xs font-bold text-[var(--accent)]">
                      {hl.minute}&apos;
                    </span>
                  )}
                  <span className="font-medium">{hl.title}</span>
                </div>
                {hl.description && (
                  <p className="text-sm text-[var(--text-secondary)]">{hl.description}</p>
                )}
                {hl.videoUrl && (
                  <a
                    href={hl.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-sm text-[var(--accent)] hover:underline"
                  >
                    ▶ Watch Clip
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state for scheduled matches */}
      {match.status === "scheduled" && (
        <div className="mt-6 rounded-xl border border-dashed border-[var(--border)] bg-[var(--bg-card)] p-8 text-center">
          <p className="text-[var(--text-muted)]">
            This match hasn&apos;t been played yet. Goals, highlights, and match details will appear here after kickoff.
          </p>
        </div>
      )}
    </div>
  );
}
