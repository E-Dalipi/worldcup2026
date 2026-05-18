"use client";

import { useState } from "react";

interface EditorialHighlight {
  id: number;
  title: string;
  description: string | null;
  minute: number | null;
  videoUrl: string | null;
  type: string;
}

interface RedditHighlight {
  id: number;
  title: string;
  minute: number | null;
  videoUrl: string | null;
  type: string;
  subreddit: string | null;
  upvotes: number | null;
  redditUrl: string | null;
}

function formatUpvotes(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}

function TypeBadge({ type }: { type: string }) {
  const styles: Record<string, string> = {
    goal: "bg-green-900/50 text-green-400",
    card: "bg-yellow-900/50 text-yellow-400",
    save: "bg-blue-900/50 text-blue-400",
    moment: "bg-purple-900/50 text-purple-400",
  };
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase ${
        styles[type] || styles.moment
      }`}
    >
      {type}
    </span>
  );
}

function RedditBadge({ subreddit }: { subreddit: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-orange-900/30 px-2 py-0.5 text-[10px] font-medium text-orange-400">
      <svg viewBox="0 0 20 20" className="h-3 w-3 fill-current">
        <path d="M10 0a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm5.9 11.5c.1.4.1.8 0 1.1-.2.4-.5.7-.9.9-.1 1.3-1.6 2.4-3.6 2.8.2.3.3.7.3 1 0 .4-.1.7-.3 1h-2.8c-.2-.3-.3-.6-.3-1 0-.3.1-.7.3-1-2-.4-3.4-1.5-3.6-2.8-.4-.2-.7-.5-.9-.9-.1-.4-.1-.8 0-1.1.1-.4.4-.7.7-.9 0-.1 0-.2.1-.3.4-1.2 1.7-2.2 3.4-2.7-.1-.4-.2-.8-.2-1.3 0-.8.3-1.6.8-2.1.5-.6 1.2-.9 2-.9s1.5.3 2 .9c.5.5.8 1.3.8 2.1 0 .4-.1.9-.2 1.3 1.7.5 3 1.5 3.4 2.7 0 .1 0 .2.1.3.3.2.5.5.7.9zM7.5 10.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm5 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
      </svg>
      r/{subreddit}
    </span>
  );
}

export default function MatchTabs({
  editorialHighlights,
  redditHighlights,
}: {
  editorialHighlights: EditorialHighlight[];
  redditHighlights: RedditHighlight[];
}) {
  const [activeTab, setActiveTab] = useState<"highlights" | "fan">("highlights");

  const totalEditorial = editorialHighlights.length;
  const totalReddit = redditHighlights.length;

  // Don't render anything if there's no content
  if (totalEditorial === 0 && totalReddit === 0) return null;

  return (
    <div className="mt-6">
      {/* Tab bar */}
      <div className="flex rounded-t-xl border border-b-0 border-[var(--border)] bg-[var(--bg-card)] overflow-hidden">
        <button
          onClick={() => setActiveTab("highlights")}
          className={`flex-1 px-4 py-3 text-sm font-medium transition ${
            activeTab === "highlights"
              ? "bg-[var(--accent-glow)] text-[var(--accent)] border-b-2 border-[var(--accent)]"
              : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]"
          }`}
        >
          🎬 Highlights
          {totalEditorial > 0 && (
            <span className="ml-2 rounded-full bg-[var(--bg-primary)] px-2 py-0.5 text-xs">
              {totalEditorial}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("fan")}
          className={`flex-1 px-4 py-3 text-sm font-medium transition ${
            activeTab === "fan"
              ? "bg-orange-900/20 text-orange-400 border-b-2 border-orange-400"
              : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]"
          }`}
        >
          📢 Fan Reactions
          {totalReddit > 0 && (
            <span className="ml-2 rounded-full bg-[var(--bg-primary)] px-2 py-0.5 text-xs">
              {totalReddit}
            </span>
          )}
        </button>
      </div>

      {/* Tab content */}
      <div className="rounded-b-xl border border-[var(--border)] bg-[var(--bg-card)] p-4">
        {/* Editorial Highlights Tab */}
        {activeTab === "highlights" && (
          <div>
            {totalEditorial === 0 ? (
              <p className="py-6 text-center text-sm text-[var(--text-muted)]">
                No editorial highlights yet. Check the Fan Reactions tab for community clips.
              </p>
            ) : (
              <div className="space-y-3">
                {editorialHighlights.map((hl) => (
                  <div
                    key={hl.id}
                    className="rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] p-4 transition hover:border-[var(--accent)]/30"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {hl.minute && (
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent-glow)] text-xs font-bold text-[var(--accent)]">
                          {hl.minute}&apos;
                        </span>
                      )}
                      <span className="font-medium flex-1">{hl.title}</span>
                      <TypeBadge type={hl.type} />
                    </div>
                    {hl.description && (
                      <p className="mt-1 text-sm text-[var(--text-secondary)] pl-9">
                        {hl.description}
                      </p>
                    )}
                    {hl.videoUrl && (
                      <a
                        href={hl.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent-glow)] px-3 py-1.5 text-sm text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition ml-9"
                      >
                        ▶ Watch Clip
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Fan Reactions Tab (Reddit UGC) */}
        {activeTab === "fan" && (
          <div>
            {totalReddit === 0 ? (
              <div className="py-6 text-center">
                <p className="text-sm text-[var(--text-muted)]">
                  No fan clips yet. Reddit highlights from r/soccer, r/worldcup,
                  and r/footballhighlights will appear here during and after the match.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {redditHighlights.map((hl) => (
                  <div
                    key={hl.id}
                    className="rounded-lg border border-orange-900/30 bg-[var(--bg-primary)] p-4 transition hover:border-orange-400/30"
                  >
                    {/* Header row */}
                    <div className="flex items-start gap-2">
                      {hl.minute && (
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-900/30 text-xs font-bold text-orange-400">
                          {hl.minute}&apos;
                        </span>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm leading-snug">
                          {hl.title}
                        </p>
                        {/* Meta row */}
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          {hl.subreddit && (
                            <RedditBadge subreddit={hl.subreddit} />
                          )}
                          <TypeBadge type={hl.type} />
                          {hl.upvotes && hl.upvotes > 0 && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-[var(--text-muted)]">
                              <svg
                                viewBox="0 0 16 16"
                                className="h-3 w-3 fill-orange-400"
                              >
                                <path d="M8 1l2.5 5H14l-4 3.5 1.5 5.5L8 12l-3.5 3 1.5-5.5L2 6h3.5z" />
                              </svg>
                              {formatUpvotes(hl.upvotes)} upvotes
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="mt-3 flex items-center gap-2 pl-9">
                      {hl.videoUrl && (
                        <a
                          href={hl.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-orange-900/30 px-3 py-1.5 text-sm text-orange-400 hover:bg-orange-500 hover:text-white transition"
                        >
                          ▶ Watch Clip
                        </a>
                      )}
                      {hl.redditUrl && (
                        <a
                          href={hl.redditUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition"
                        >
                          💬 Discussion
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
