"use client";

import { useState, useEffect, useCallback } from "react";

interface PredictionWidgetProps {
  matchId: number;
  matchStatus: string;
  homeName: string;
  awayName: string;
  homeFlag: string;
  awayFlag: string;
  actualHome: number | null;
  actualAway: number | null;
}

function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("wc2026_visitor_id");
  if (!id) {
    id = Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem("wc2026_visitor_id", id);
  }
  return id;
}

export default function PredictionWidget({
  matchId,
  matchStatus,
  homeName,
  awayName,
  homeFlag,
  awayFlag,
  actualHome,
  actualAway,
}: PredictionWidgetProps) {
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{
    total: number;
    homeWinPct: number;
    drawPct: number;
    awayWinPct: number;
    avgHome: number;
    avgAway: number;
    userPrediction: { predictedHome: number; predictedAway: number } | null;
  } | null>(null);

  const fetchStats = useCallback(async () => {
    const vid = getVisitorId();
    const res = await fetch(`/api/predict?matchId=${matchId}&visitorId=${vid}`);
    if (res.ok) {
      const data = await res.json();
      setStats(data);
      if (data.userPrediction) {
        setSubmitted(true);
        setHomeScore(data.userPrediction.predictedHome);
        setAwayScore(data.userPrediction.predictedAway);
      }
    }
    setLoading(false);
  }, [matchId]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  async function submitPrediction() {
    setLoading(true);
    const vid = getVisitorId();
    const res = await fetch("/api/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        matchId,
        visitorId: vid,
        predictedHome: homeScore,
        predictedAway: awayScore,
      }),
    });
    if (res.ok) {
      setSubmitted(true);
      fetchStats();
    }
    setLoading(false);
  }

  if (loading && !stats) {
    return (
      <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-6 animate-pulse">
        <div className="h-4 w-40 rounded bg-[var(--bg-primary)]" />
      </div>
    );
  }

  const isScheduled = matchStatus === "scheduled";
  const isFinished = matchStatus === "finished";

  return (
    <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-6">
      <h2 className="mb-4 text-lg font-bold">🗳️ Fan Predictions</h2>

      {/* Prediction form - only for scheduled matches */}
      {isScheduled && !submitted && (
        <div className="mb-4">
          <p className="mb-3 text-sm text-[var(--text-secondary)]">
            What&apos;s your score prediction?
          </p>
          <div className="flex items-center justify-center gap-4">
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl">{homeFlag}</span>
              <span className="text-xs text-[var(--text-muted)]">{homeName}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setHomeScore(Math.max(0, homeScore - 1))}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-lg hover:border-[var(--accent)] transition"
                >
                  −
                </button>
                <span className="w-8 text-center text-2xl font-bold tabular-nums">
                  {homeScore}
                </span>
                <button
                  onClick={() => setHomeScore(homeScore + 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-lg hover:border-[var(--accent)] transition"
                >
                  +
                </button>
              </div>
            </div>

            <span className="text-xl text-[var(--text-muted)] mt-6">:</span>

            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl">{awayFlag}</span>
              <span className="text-xs text-[var(--text-muted)]">{awayName}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAwayScore(Math.max(0, awayScore - 1))}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-lg hover:border-[var(--accent)] transition"
                >
                  −
                </button>
                <span className="w-8 text-center text-2xl font-bold tabular-nums">
                  {awayScore}
                </span>
                <button
                  onClick={() => setAwayScore(awayScore + 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-lg hover:border-[var(--accent)] transition"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={submitPrediction}
            disabled={loading}
            className="mt-4 w-full rounded-lg bg-[var(--accent)] px-4 py-2.5 font-medium text-white hover:opacity-90 transition disabled:opacity-50"
          >
            Submit Prediction
          </button>
        </div>
      )}

      {/* User's prediction */}
      {submitted && stats?.userPrediction && (
        <div className="mb-4 rounded-lg border border-[var(--accent)]/30 bg-[var(--accent-glow)] p-3">
          <p className="text-sm text-[var(--accent)]">
            ✅ Your prediction:{" "}
            <span className="font-bold">
              {homeName} {stats.userPrediction.predictedHome} - {stats.userPrediction.predictedAway} {awayName}
            </span>
            {isFinished && actualHome !== null && actualAway !== null && (
              stats.userPrediction.predictedHome === actualHome &&
              stats.userPrediction.predictedAway === actualAway ? (
                <span className="ml-2 text-[var(--green)] font-bold">🎯 Perfect!</span>
              ) : (
                <span className="ml-2 text-[var(--text-muted)]">
                  (Actual: {actualHome} - {actualAway})
                </span>
              )
            )}
          </p>
        </div>
      )}

      {/* Community stats */}
      {stats && stats.total > 0 && (
        <div>
          <p className="mb-3 text-xs text-[var(--text-muted)] uppercase tracking-wider">
            Community Prediction ({stats.total} vote{stats.total !== 1 ? "s" : ""})
          </p>

          {/* Win probability bar */}
          <div className="mb-3 flex items-center gap-2 text-xs">
            <span className="w-16 text-right font-medium">{homeName}</span>
            <div className="flex-1 flex h-6 rounded-full overflow-hidden bg-[var(--bg-primary)]">
              {stats.homeWinPct > 0 && (
                <div
                  className="flex items-center justify-center bg-blue-500/80 text-white text-[10px] font-bold transition-all"
                  style={{ width: `${stats.homeWinPct}%` }}
                >
                  {stats.homeWinPct}%
                </div>
              )}
              {stats.drawPct > 0 && (
                <div
                  className="flex items-center justify-center bg-gray-500/80 text-white text-[10px] font-bold transition-all"
                  style={{ width: `${stats.drawPct}%` }}
                >
                  {stats.drawPct}%
                </div>
              )}
              {stats.awayWinPct > 0 && (
                <div
                  className="flex items-center justify-center bg-red-500/80 text-white text-[10px] font-bold transition-all"
                  style={{ width: `${stats.awayWinPct}%` }}
                >
                  {stats.awayWinPct}%
                </div>
              )}
            </div>
            <span className="w-16 font-medium">{awayName}</span>
          </div>

          {/* Average predicted score */}
          <div className="flex items-center justify-center gap-4 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] p-3">
            <span className="text-sm text-[var(--text-muted)]">Avg. prediction:</span>
            <span className="text-xl font-bold tabular-nums">
              {stats.avgHome} - {stats.avgAway}
            </span>
          </div>
        </div>
      )}

      {/* Empty state */}
      {stats && stats.total === 0 && !isScheduled && (
        <p className="text-sm text-[var(--text-muted)] text-center py-2">
          No predictions were made for this match.
        </p>
      )}
    </div>
  );
}
