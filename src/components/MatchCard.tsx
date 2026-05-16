import Link from "next/link";

interface Team {
  id: number;
  name: string;
  code: string;
  flag: string;
}

interface MatchCardProps {
  match: {
    id: number;
    matchNumber: number;
    date: string;
    time: string;
    stage: string;
    venue: string;
    city: string;
    scoreHome: number | null;
    scoreAway: number | null;
    status: string;
    homeTeam: Team | null;
    awayTeam: Team | null;
    homePlaceholder: string | null;
    awayPlaceholder: string | null;
  };
}

function getStageBadgeClass(stage: string) {
  if (stage.startsWith("Group")) return "stage-group";
  if (stage === "R32") return "stage-r32";
  if (stage === "R16") return "stage-r16";
  if (stage === "QF") return "stage-qf";
  if (stage === "SF" || stage === "3rd") return "stage-sf";
  if (stage === "Final") return "stage-final";
  return "stage-group";
}

function getStageLabel(stage: string) {
  if (stage.startsWith("Group")) return stage;
  const labels: Record<string, string> = {
    R32: "Round of 32",
    R16: "Round of 16",
    QF: "Quarterfinal",
    SF: "Semifinal",
    "3rd": "3rd Place",
    Final: "🏆 Final",
  };
  return labels[stage] || stage;
}

export default function MatchCard({ match }: MatchCardProps) {
  const isFinished = match.status === "finished";
  const isLive = match.status === "live";

  const homeName = match.homeTeam?.name ?? match.homePlaceholder ?? "TBD";
  const awayName = match.awayTeam?.name ?? match.awayPlaceholder ?? "TBD";
  const homeFlag = match.homeTeam?.flag ?? "🏳️";
  const awayFlag = match.awayTeam?.flag ?? "🏳️";

  return (
    <Link href={`/match/${match.matchNumber}`}>
      <div
        className={`group relative rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4 transition-all hover:border-[var(--accent)] hover:bg-[var(--bg-card-hover)] ${
          isLive ? "live-pulse border-[var(--accent)]" : ""
        } animate-fade-in`}
      >
        {/* Stage + Time header */}
        <div className="mb-3 flex items-center justify-between">
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getStageBadgeClass(
              match.stage
            )}`}
          >
            {getStageLabel(match.stage)}
          </span>
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
            {isLive && (
              <span className="flex items-center gap-1 text-[var(--red)] font-semibold">
                <span className="h-2 w-2 rounded-full bg-[var(--red)] animate-pulse" />
                LIVE
              </span>
            )}
            <span>{match.time}</span>
          </div>
        </div>

        {/* Teams + Score */}
        <div className="flex items-center justify-between">
          {/* Home team */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-2xl">{homeFlag}</span>
            <span className="font-medium truncate">{homeName}</span>
          </div>

          {/* Score */}
          <div className="mx-4 flex items-center gap-1">
            {isFinished || isLive ? (
              <>
                <span className="min-w-[2rem] rounded-lg bg-[var(--bg-primary)] px-2 py-1 text-center text-xl font-bold tabular-nums">
                  {match.scoreHome ?? 0}
                </span>
                <span className="text-[var(--text-muted)]">:</span>
                <span className="min-w-[2rem] rounded-lg bg-[var(--bg-primary)] px-2 py-1 text-center text-xl font-bold tabular-nums">
                  {match.scoreAway ?? 0}
                </span>
              </>
            ) : (
              <span className="text-sm text-[var(--text-muted)]">vs</span>
            )}
          </div>

          {/* Away team */}
          <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
            <span className="font-medium truncate text-right">{awayName}</span>
            <span className="text-2xl">{awayFlag}</span>
          </div>
        </div>

        {/* Venue */}
        <div className="mt-3 text-xs text-[var(--text-muted)] truncate">
          📍 {match.venue}, {match.city}
        </div>

        {/* Match number */}
        <div className="absolute right-3 top-3 text-[10px] text-[var(--text-muted)] opacity-0 transition group-hover:opacity-100">
          M{match.matchNumber}
        </div>
      </div>
    </Link>
  );
}
