"use client";

import { useState, useEffect, useCallback } from "react";

interface WatchParty {
  id: number;
  city: string;
  country: string;
  venueName: string;
  address: string | null;
  description: string | null;
  teamFanbase: string | null;
}

const POPULAR_CITIES = [
  "Toronto", "New York", "Los Angeles", "Houston", "Miami",
  "Chicago", "Dallas", "Vancouver", "Mexico City", "Montreal",
  "Philadelphia", "Atlanta", "Seattle", "San Francisco", "Boston",
];

export default function WatchPartiesPage() {
  const [parties, setParties] = useState<WatchParty[]>([]);
  const [cityFilter, setCityFilter] = useState("");
  const [teamFilter, setTeamFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitMsg, setSubmitMsg] = useState("");

  // Form state
  const [formCity, setFormCity] = useState("");
  const [formCountry, setFormCountry] = useState("US");
  const [formVenue, setFormVenue] = useState("");
  const [formAddress, setFormAddress] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formTeam, setFormTeam] = useState("");
  const [formName, setFormName] = useState("");

  const fetchParties = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (cityFilter) params.set("city", cityFilter);
    if (teamFilter) params.set("team", teamFilter);
    const res = await fetch(`/api/watchparty?${params}`);
    if (res.ok) {
      const data = await res.json();
      setParties(data);
    }
    setLoading(false);
  }, [cityFilter, teamFilter]);

  useEffect(() => {
    fetchParties();
  }, [fetchParties]);

  async function submitVenue(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/watchparty", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        city: formCity,
        country: formCountry,
        venueName: formVenue,
        address: formAddress || null,
        description: formDesc || null,
        teamFanbase: formTeam || null,
        submittedBy: formName || null,
      }),
    });
    if (res.ok) {
      setSubmitMsg("✅ Thanks! Your venue will appear after review.");
      setShowForm(false);
      setFormCity("");
      setFormVenue("");
      setFormAddress("");
      setFormDesc("");
      setFormTeam("");
      setFormName("");
    } else {
      setSubmitMsg("❌ Failed to submit. Please try again.");
    }
  }

  return (
    <div>
      {/* Hero */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          <span className="bg-gradient-to-r from-[var(--gold)] to-orange-400 bg-clip-text text-transparent">
            🍻 Watch Party Finder
          </span>
        </h1>
        <p className="mt-2 text-[var(--text-secondary)]">
          Find the best bars, venues, and fan zones to watch the 2026 World Cup near you.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[200px]">
          <label className="mb-1 block text-xs text-[var(--text-muted)] uppercase">City</label>
          <input
            type="text"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            placeholder="Search by city..."
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-4 py-2 text-sm focus:border-[var(--accent)] focus:outline-none"
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="mb-1 block text-xs text-[var(--text-muted)] uppercase">Team Fanbase</label>
          <input
            type="text"
            value={teamFilter}
            onChange={(e) => setTeamFilter(e.target.value)}
            placeholder="e.g. Argentina, Mexico..."
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-4 py-2 text-sm focus:border-[var(--accent)] focus:outline-none"
          />
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition"
        >
          + Add Venue
        </button>
      </div>

      {/* Quick city filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        {POPULAR_CITIES.map((city) => (
          <button
            key={city}
            onClick={() => setCityFilter(cityFilter === city ? "" : city)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              cityFilter === city
                ? "bg-[var(--accent)] text-white"
                : "border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--accent)]"
            }`}
          >
            {city}
          </button>
        ))}
      </div>

      {submitMsg && (
        <div className="mb-4 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-4 py-2 text-sm">
          {submitMsg}
        </div>
      )}

      {/* Submit form */}
      {showForm && (
        <form
          onSubmit={submitVenue}
          className="mb-6 rounded-xl border border-[var(--accent)]/30 bg-[var(--bg-card)] p-6 space-y-3"
        >
          <h2 className="text-lg font-bold">📍 Submit a Watch Party Venue</h2>
          <p className="text-xs text-[var(--text-muted)]">
            Know a great place to watch the World Cup? Share it with the community!
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs text-[var(--text-muted)]">Venue Name *</label>
              <input
                type="text"
                value={formVenue}
                onChange={(e) => setFormVenue(e.target.value)}
                placeholder="e.g. The Football Pub"
                required
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-2 text-sm focus:border-[var(--accent)] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-[var(--text-muted)]">City *</label>
              <input
                type="text"
                value={formCity}
                onChange={(e) => setFormCity(e.target.value)}
                placeholder="e.g. Toronto"
                required
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-2 text-sm focus:border-[var(--accent)] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-[var(--text-muted)]">Country</label>
              <select
                value={formCountry}
                onChange={(e) => setFormCountry(e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-2 text-sm focus:border-[var(--accent)] focus:outline-none"
              >
                <option value="US">🇺🇸 United States</option>
                <option value="CA">🇨🇦 Canada</option>
                <option value="MX">🇲🇽 Mexico</option>
                <option value="other">🌍 Other</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-[var(--text-muted)]">Team Fanbase (opt.)</label>
              <input
                type="text"
                value={formTeam}
                onChange={(e) => setFormTeam(e.target.value)}
                placeholder="e.g. Argentina, Mexico, any"
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-2 text-sm focus:border-[var(--accent)] focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs text-[var(--text-muted)]">Address (opt.)</label>
              <input
                type="text"
                value={formAddress}
                onChange={(e) => setFormAddress(e.target.value)}
                placeholder="123 Main St"
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-2 text-sm focus:border-[var(--accent)] focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs text-[var(--text-muted)]">Description (opt.)</label>
              <textarea
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                placeholder="Big screens, drink specials, outdoor patio..."
                rows={2}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-2 text-sm focus:border-[var(--accent)] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-[var(--text-muted)]">Your Name (opt.)</label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-2 text-sm focus:border-[var(--accent)] focus:outline-none"
              />
            </div>
          </div>
          <button
            type="submit"
            className="rounded-lg bg-[var(--accent)] px-6 py-2 text-sm font-medium text-white hover:opacity-90 transition"
          >
            Submit Venue
          </button>
        </form>
      )}

      {/* Results */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5 animate-pulse">
              <div className="h-4 w-32 rounded bg-[var(--bg-primary)] mb-2" />
              <div className="h-3 w-48 rounded bg-[var(--bg-primary)]" />
            </div>
          ))}
        </div>
      ) : parties.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--bg-card)] p-12 text-center">
          <p className="text-4xl mb-3">🏟️</p>
          <p className="text-[var(--text-secondary)] font-medium">
            No watch party venues found{cityFilter ? ` in "${cityFilter}"` : ""}.
          </p>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            Be the first to add one! Click &quot;+ Add Venue&quot; above.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {parties.map((party) => (
            <div
              key={party.id}
              className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-5 transition hover:border-[var(--accent)]/30"
            >
              <h3 className="text-lg font-bold">{party.venueName}</h3>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                📍 {party.city}, {party.country}
              </p>
              {party.address && (
                <p className="text-xs text-[var(--text-muted)]">{party.address}</p>
              )}
              {party.description && (
                <p className="mt-2 text-sm text-[var(--text-secondary)]">{party.description}</p>
              )}
              {party.teamFanbase && (
                <span className="mt-2 inline-block rounded-full bg-[var(--accent-glow)] px-2.5 py-0.5 text-xs font-medium text-[var(--accent)]">
                  ⚽ {party.teamFanbase} fans
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* SEO structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Watch Party Finder - FIFA World Cup 2026",
            description:
              "Find bars, pubs, and fan zones showing the 2026 FIFA World Cup in your city. Submit your own venue.",
          }),
        }}
      />
    </div>
  );
}
