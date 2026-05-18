"use client";

import { useState, useEffect } from "react";

interface Team {
  id: number;
  name: string;
  flag: string;
  code: string;
}

interface Match {
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
}

interface GoalData {
  id: number;
  playerName: string;
  minute: number;
  minuteExtra: number | null;
  assistName: string | null;
  goalType: string;
  team: Team;
}

interface HighlightData {
  id: number;
  title: string;
  description: string | null;
  minute: number | null;
  videoUrl: string | null;
  type: string;
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Score form
  const [scoreHome, setScoreHome] = useState("");
  const [scoreAway, setScoreAway] = useState("");
  const [status, setStatus] = useState("scheduled");

  // Goal form
  const [goalPlayer, setGoalPlayer] = useState("");
  const [goalMinute, setGoalMinute] = useState("");
  const [goalMinuteExtra, setGoalMinuteExtra] = useState("");
  const [goalTeamId, setGoalTeamId] = useState("");
  const [goalAssist, setGoalAssist] = useState("");
  const [goalType, setGoalType] = useState("goal");

  // Existing data for selected match
  const [existingGoals, setExistingGoals] = useState<GoalData[]>([]);
  const [existingHighlights, setExistingHighlights] = useState<HighlightData[]>([]);

  // Highlight form
  const [hlTitle, setHlTitle] = useState("");
  const [hlDescription, setHlDescription] = useState("");
  const [hlMinute, setHlMinute] = useState("");
  const [hlVideoUrl, setHlVideoUrl] = useState("");
  const [hlType, setHlType] = useState("moment");

  async function login(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setAuthenticated(true);
      localStorage.setItem("admin_pwd", password);
      fetchMatches();
    } else {
      setMessage("❌ Wrong password");
    }
  }

  async function fetchMatches() {
    const pwd = localStorage.getItem("admin_pwd") || password;
    const res = await fetch(`/api/admin/matches?password=${encodeURIComponent(pwd)}`);
    if (res.ok) {
      const data = await res.json();
      setMatches(data);
    }
  }

  async function fetchMatchDetails(matchId: number) {
    const pwd = localStorage.getItem("admin_pwd") || password;
    const res = await fetch(`/api/admin/matchdetails?password=${encodeURIComponent(pwd)}&matchId=${matchId}`);
    if (res.ok) {
      const data = await res.json();
      setExistingGoals(data.goals);
      setExistingHighlights(data.highlights);
    }
  }

  async function deleteGoal(goalId: number) {
    const pwd = localStorage.getItem("admin_pwd") || password;
    const res = await fetch("/api/admin/goal", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pwd, goalId }),
    });
    if (res.ok) {
      setMessage("✅ Goal deleted!");
      if (selectedMatch) fetchMatchDetails(selectedMatch.id);
    } else {
      setMessage("❌ Failed to delete goal");
    }
  }

  async function deleteHighlight(highlightId: number) {
    const pwd = localStorage.getItem("admin_pwd") || password;
    const res = await fetch("/api/admin/highlight", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pwd, highlightId }),
    });
    if (res.ok) {
      setMessage("✅ Highlight deleted!");
      if (selectedMatch) fetchMatchDetails(selectedMatch.id);
    } else {
      setMessage("❌ Failed to delete highlight");
    }
  }

  async function updateScore(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedMatch) return;
    setLoading(true);
    const pwd = localStorage.getItem("admin_pwd") || password;
    const res = await fetch("/api/admin/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        password: pwd,
        matchId: selectedMatch.id,
        scoreHome: scoreHome ? parseInt(scoreHome) : null,
        scoreAway: scoreAway ? parseInt(scoreAway) : null,
        status,
      }),
    });
    setLoading(false);
    if (res.ok) {
      setMessage("✅ Score updated!");
      fetchMatches();
    } else {
      setMessage("❌ Failed to update score");
    }
  }

  async function addGoal(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedMatch) return;
    setLoading(true);
    const pwd = localStorage.getItem("admin_pwd") || password;
    const res = await fetch("/api/admin/goal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        password: pwd,
        matchId: selectedMatch.id,
        teamId: parseInt(goalTeamId),
        playerName: goalPlayer,
        minute: parseInt(goalMinute),
        minuteExtra: goalMinuteExtra ? parseInt(goalMinuteExtra) : null,
        assistName: goalAssist || null,
        goalType,
      }),
    });
    setLoading(false);
    if (res.ok) {
      setMessage("✅ Goal added!");
      setGoalPlayer("");
      setGoalMinute("");
      setGoalMinuteExtra("");
      setGoalAssist("");
      if (selectedMatch) fetchMatchDetails(selectedMatch.id);
    } else {
      setMessage("❌ Failed to add goal");
    }
  }

  async function addHighlight(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedMatch) return;
    setLoading(true);
    const pwd = localStorage.getItem("admin_pwd") || password;
    const res = await fetch("/api/admin/highlight", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        password: pwd,
        matchId: selectedMatch.id,
        title: hlTitle,
        description: hlDescription || null,
        minute: hlMinute ? parseInt(hlMinute) : null,
        videoUrl: hlVideoUrl || null,
        type: hlType,
      }),
    });
    setLoading(false);
    if (res.ok) {
      setMessage("✅ Highlight added!");
      setHlTitle("");
      setHlDescription("");
      setHlMinute("");
      setHlVideoUrl("");
      if (selectedMatch) fetchMatchDetails(selectedMatch.id);
    } else {
      setMessage("❌ Failed to add highlight");
    }
  }

  useEffect(() => {
    const saved = localStorage.getItem("admin_pwd");
    if (saved) {
      setPassword(saved);
      fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: saved }),
      }).then((res) => {
        if (res.ok) {
          setAuthenticated(true);
          setPassword(saved);
          fetch(`/api/admin/matches?password=${encodeURIComponent(saved)}`)
            .then((r) => r.json())
            .then(setMatches);
        }
      });
    }
  }, []);

  function selectMatch(match: Match) {
    setSelectedMatch(match);
    setScoreHome(match.scoreHome?.toString() ?? "");
    setScoreAway(match.scoreAway?.toString() ?? "");
    setStatus(match.status);
    setGoalTeamId(match.homeTeam?.id.toString() ?? "");
    setMessage("");
    fetchMatchDetails(match.id);
  }

  if (!authenticated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <form onSubmit={login} className="w-full max-w-sm space-y-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-8">
          <h1 className="text-2xl font-bold text-center">🔒 Admin Login</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] px-4 py-2 text-[var(--text-primary)] focus:border-[var(--accent)] focus:outline-none"
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-[var(--accent)] px-4 py-2 font-medium text-white hover:opacity-90 transition"
          >
            Log In
          </button>
          {message && <p className="text-center text-sm">{message}</p>}
        </form>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
      {/* Match selector sidebar */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4 max-h-[80vh] overflow-y-auto">
        <h2 className="mb-3 text-lg font-bold">Select Match</h2>
        <div className="space-y-1">
          {matches.map((match) => {
            const home = match.homeTeam?.name ?? match.homePlaceholder ?? "TBD";
            const away = match.awayTeam?.name ?? match.awayPlaceholder ?? "TBD";
            const isSelected = selectedMatch?.id === match.id;
            return (
              <button
                key={match.id}
                onClick={() => selectMatch(match)}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                  isSelected
                    ? "bg-[var(--accent)] text-white"
                    : "hover:bg-[var(--bg-card-hover)]"
                }`}
              >
                <div className="font-medium truncate">
                  M{match.matchNumber}: {home} vs {away}
                </div>
                <div className="text-xs opacity-70">
                  {match.date} • {match.status}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Edit panel */}
      <div className="space-y-6">
        {message && (
          <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-4 py-2 text-sm">
            {message}
          </div>
        )}

        {!selectedMatch ? (
          <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--bg-card)] p-12 text-center text-[var(--text-muted)]">
            ← Select a match to edit
          </div>
        ) : (
          <>
            {/* Match header */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4">
              <h2 className="text-lg font-bold">
                Match {selectedMatch.matchNumber}: {selectedMatch.homeTeam?.flag ?? "🏳️"}{" "}
                {selectedMatch.homeTeam?.name ?? selectedMatch.homePlaceholder} vs{" "}
                {selectedMatch.awayTeam?.name ?? selectedMatch.awayPlaceholder}{" "}
                {selectedMatch.awayTeam?.flag ?? "🏳️"}
              </h2>
              <p className="text-sm text-[var(--text-muted)]">
                {selectedMatch.date} • {selectedMatch.time} • {selectedMatch.venue}
              </p>
            </div>

            {/* Update Score */}
            <form onSubmit={updateScore} className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4 space-y-3">
              <h3 className="font-bold">📊 Update Score & Status</h3>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-[var(--text-muted)]">Home Score</label>
                  <input
                    type="number"
                    value={scoreHome}
                    onChange={(e) => setScoreHome(e.target.value)}
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-2 focus:border-[var(--accent)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-[var(--text-muted)]">Away Score</label>
                  <input
                    type="number"
                    value={scoreAway}
                    onChange={(e) => setScoreAway(e.target.value)}
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-2 focus:border-[var(--accent)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-[var(--text-muted)]">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-2 focus:border-[var(--accent)] focus:outline-none"
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="live">Live</option>
                    <option value="finished">Finished</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-[var(--accent)] px-4 py-2 font-medium text-white hover:opacity-90 transition disabled:opacity-50"
              >
                Update Score
              </button>
            </form>

            {/* Add Goal */}
            <form onSubmit={addGoal} className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4 space-y-3">
              <h3 className="font-bold">⚽ Add Goal</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[var(--text-muted)]">Player Name</label>
                  <input
                    type="text"
                    value={goalPlayer}
                    onChange={(e) => setGoalPlayer(e.target.value)}
                    placeholder="e.g. Mbappé"
                    required
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-2 focus:border-[var(--accent)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-[var(--text-muted)]">Team</label>
                  <select
                    value={goalTeamId}
                    onChange={(e) => setGoalTeamId(e.target.value)}
                    required
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-2 focus:border-[var(--accent)] focus:outline-none"
                  >
                    {selectedMatch.homeTeam && (
                      <option value={selectedMatch.homeTeam.id}>
                        {selectedMatch.homeTeam.flag} {selectedMatch.homeTeam.name}
                      </option>
                    )}
                    {selectedMatch.awayTeam && (
                      <option value={selectedMatch.awayTeam.id}>
                        {selectedMatch.awayTeam.flag} {selectedMatch.awayTeam.name}
                      </option>
                    )}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[var(--text-muted)]">Minute</label>
                  <input
                    type="number"
                    value={goalMinute}
                    onChange={(e) => setGoalMinute(e.target.value)}
                    required
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-2 focus:border-[var(--accent)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-[var(--text-muted)]">Added Time (opt.)</label>
                  <input
                    type="number"
                    value={goalMinuteExtra}
                    onChange={(e) => setGoalMinuteExtra(e.target.value)}
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-2 focus:border-[var(--accent)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-[var(--text-muted)]">Assist (opt.)</label>
                  <input
                    type="text"
                    value={goalAssist}
                    onChange={(e) => setGoalAssist(e.target.value)}
                    placeholder="e.g. Griezmann"
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-2 focus:border-[var(--accent)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-[var(--text-muted)]">Type</label>
                  <select
                    value={goalType}
                    onChange={(e) => setGoalType(e.target.value)}
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-2 focus:border-[var(--accent)] focus:outline-none"
                  >
                    <option value="goal">Goal</option>
                    <option value="penalty">Penalty</option>
                    <option value="free-kick">Free Kick</option>
                    <option value="own-goal">Own Goal</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-[var(--green)] px-4 py-2 font-medium text-black hover:opacity-90 transition disabled:opacity-50"
              >
                Add Goal
              </button>
            </form>

            {/* Add Highlight */}
            <form onSubmit={addHighlight} className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4 space-y-3">
              <h3 className="font-bold">🎬 Add Highlight</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-xs text-[var(--text-muted)]">Title</label>
                  <input
                    type="text"
                    value={hlTitle}
                    onChange={(e) => setHlTitle(e.target.value)}
                    placeholder="e.g. Stunning save by goalkeeper"
                    required
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-2 focus:border-[var(--accent)] focus:outline-none"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-[var(--text-muted)]">Description (opt.)</label>
                  <textarea
                    value={hlDescription}
                    onChange={(e) => setHlDescription(e.target.value)}
                    rows={2}
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-2 focus:border-[var(--accent)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-[var(--text-muted)]">Minute (opt.)</label>
                  <input
                    type="number"
                    value={hlMinute}
                    onChange={(e) => setHlMinute(e.target.value)}
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-2 focus:border-[var(--accent)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-[var(--text-muted)]">Type</label>
                  <select
                    value={hlType}
                    onChange={(e) => setHlType(e.target.value)}
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-2 focus:border-[var(--accent)] focus:outline-none"
                  >
                    <option value="moment">Key Moment</option>
                    <option value="goal">Goal</option>
                    <option value="card">Card</option>
                    <option value="save">Save</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-[var(--text-muted)]">Video URL (opt. — YouTube embed link)</label>
                  <input
                    type="url"
                    value={hlVideoUrl}
                    onChange={(e) => setHlVideoUrl(e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-2 focus:border-[var(--accent)] focus:outline-none"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-purple-500 px-4 py-2 font-medium text-white hover:opacity-90 transition disabled:opacity-50"
              >
                Add Highlight
              </button>
            </form>

            {/* Existing Goals */}
            {existingGoals.length > 0 && (
              <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4 space-y-3">
                <h3 className="font-bold">⚽ Existing Goals ({existingGoals.length})</h3>
                <div className="space-y-2">
                  {existingGoals.map((goal) => (
                    <div
                      key={goal.id}
                      className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-2"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[var(--accent)]">{goal.minute}&apos;{goal.minuteExtra ? `+${goal.minuteExtra}` : ""}</span>
                        <span>{goal.team.flag}</span>
                        <span className="text-sm font-medium">{goal.playerName}</span>
                        {goal.assistName && (
                          <span className="text-xs text-[var(--text-muted)]">(ast: {goal.assistName})</span>
                        )}
                        <span className="text-xs text-[var(--text-muted)]">[{goal.goalType}]</span>
                      </div>
                      <button
                        onClick={() => deleteGoal(goal.id)}
                        className="rounded px-2 py-1 text-xs text-[var(--red)] hover:bg-[var(--red)]/10 transition"
                      >
                        🗑 Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Existing Highlights */}
            {existingHighlights.length > 0 && (
              <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4 space-y-3">
                <h3 className="font-bold">🎬 Existing Highlights ({existingHighlights.length})</h3>
                <div className="space-y-2">
                  {existingHighlights.map((hl) => (
                    <div
                      key={hl.id}
                      className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-2"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          {hl.minute && (
                            <span className="text-xs font-bold text-[var(--accent)]">{hl.minute}&apos;</span>
                          )}
                          <span className="text-sm font-medium truncate">{hl.title}</span>
                          <span className="text-xs text-[var(--text-muted)]">[{hl.type}]</span>
                        </div>
                        {hl.description && (
                          <p className="text-xs text-[var(--text-muted)] truncate mt-0.5">{hl.description}</p>
                        )}
                      </div>
                      <button
                        onClick={() => deleteHighlight(hl.id)}
                        className="ml-2 rounded px-2 py-1 text-xs text-[var(--red)] hover:bg-[var(--red)]/10 transition shrink-0"
                      >
                        🗑 Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
