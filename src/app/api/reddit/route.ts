import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Scrape Reddit for World Cup highlights and UGC
// GET /api/scrape-reddit?key=YOUR_ADMIN_PASSWORD
//
// Searches r/soccer, r/worldcup, r/footballhighlights for:
// - Goal clips
// - Highlight reels
// - Key moments
// Then auto-adds them as highlights to the matching game

const SUBREDDITS = ["soccer", "worldcup", "footballhighlights"];
const USER_AGENT = "WorldCup2026Tracker/1.0";

interface RedditPost {
  data: {
    id: string;
    title: string;
    url: string;
    selftext: string;
    subreddit: string;
    score: number;
    created_utc: number;
    link_flair_text: string | null;
    is_video: boolean;
    media?: {
      reddit_video?: { fallback_url: string };
    };
    secure_media?: {
      reddit_video?: { fallback_url: string };
    };
    permalink: string;
  };
}

// Extract video URL from a Reddit post
function extractVideoUrl(post: RedditPost["data"]): string | null {
  const url = post.url;

  // Direct video links
  if (url.includes("streamable.com")) return url;
  if (url.includes("youtube.com") || url.includes("youtu.be")) return url;
  if (url.includes("streamff.com")) return url;
  if (url.includes("streamja.com")) return url;
  if (url.includes("clippituser.tv")) return url;
  if (url.includes("streamin.one")) return url;
  if (url.includes("dubz.link")) return url;

  // Reddit hosted video
  if (post.media?.reddit_video?.fallback_url) {
    return post.media.reddit_video.fallback_url;
  }
  if (post.secure_media?.reddit_video?.fallback_url) {
    return post.secure_media.reddit_video.fallback_url;
  }

  // Twitter/X links (often have video)
  if (url.includes("twitter.com") || url.includes("x.com")) return url;

  return null;
}

// Detect which match a post relates to based on team names in title
async function findMatchForPost(
  title: string,
  today: string
): Promise<{ matchId: number; matchNumber: number } | null> {
  // Get today's matches with team names
  const matches = await prisma.match.findMany({
    where: {
      date: today,
      status: { in: ["live", "finished"] },
    },
    include: { homeTeam: true, awayTeam: true },
  });

  const titleLower = title.toLowerCase();

  for (const match of matches) {
    const homeNames = [
      match.homeTeam?.name.toLowerCase(),
      match.homeTeam?.code.toLowerCase(),
    ].filter(Boolean) as string[];

    const awayNames = [
      match.awayTeam?.name.toLowerCase(),
      match.awayTeam?.code.toLowerCase(),
    ].filter(Boolean) as string[];

    // Check if both teams are mentioned, or at least one + "goal"/"highlight"
    const homeMatch = homeNames.some((n) => titleLower.includes(n));
    const awayMatch = awayNames.some((n) => titleLower.includes(n));

    if (homeMatch && awayMatch) {
      return { matchId: match.id, matchNumber: match.matchNumber };
    }

    // Single team mention + goal indicator
    if (
      (homeMatch || awayMatch) &&
      (titleLower.includes("goal") ||
        titleLower.includes("[1]") ||
        titleLower.includes("[2]") ||
        titleLower.includes("[3]") ||
        titleLower.includes("- 1") ||
        titleLower.includes("- 2") ||
        titleLower.includes("penalty") ||
        titleLower.includes("red card") ||
        titleLower.includes("highlight"))
    ) {
      return { matchId: match.id, matchNumber: match.matchNumber };
    }
  }

  return null;
}

// Detect highlight type from post title
function detectHighlightType(title: string): string {
  const lower = title.toLowerCase();
  if (
    lower.includes("goal") ||
    lower.includes("[1]") ||
    lower.includes("[2]") ||
    lower.includes("[3]")
  )
    return "goal";
  if (lower.includes("red card") || lower.includes("yellow card")) return "card";
  if (lower.includes("save") || lower.includes("denied")) return "save";
  return "moment";
}

// Extract minute from title like "Player Name 45'" or "23' - Goal"
function extractMinute(title: string): number | null {
  // Match patterns like "45'" or "90+3'" or "(45')" or "[45']"
  const patterns = [
    /(\d{1,3})['′]\s*(?:\+\d+)?/,
    /\((\d{1,3})['′]\)/,
    /\[(\d{1,3})['′]\]/,
  ];

  for (const pattern of patterns) {
    const match = title.match(pattern);
    if (match) return parseInt(match[1]);
  }

  return null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");

  if (key !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date().toISOString().split("T")[0];
  let totalAdded = 0;
  const errors: string[] = [];

  for (const subreddit of SUBREDDITS) {
    try {
      // Search for World Cup related posts from today
      const searchTerms = encodeURIComponent("World Cup 2026");
      const url = `https://www.reddit.com/r/${subreddit}/search.json?q=${searchTerms}&sort=new&t=day&limit=50`;

      const res = await fetch(url, {
        headers: { "User-Agent": USER_AGENT },
      });

      if (!res.ok) {
        errors.push(`r/${subreddit}: HTTP ${res.status}`);
        continue;
      }

      const data = await res.json();
      const posts: RedditPost[] = data?.data?.children || [];

      for (const post of posts) {
        const { title, score } = post.data;

        // Skip low-quality posts
        if (score < 5) continue;

        // Find which match this post relates to
        const matchInfo = await findMatchForPost(title, today);
        if (!matchInfo) continue;

        // Extract video URL
        const videoUrl =
          extractVideoUrl(post.data) ||
          `https://reddit.com${post.data.permalink}`;

        // Check if we already added this highlight (by reddit URL)
        const redditPermalink = `https://reddit.com${post.data.permalink}`;
        const existing = await prisma.highlight.findFirst({
          where: {
            matchId: matchInfo.matchId,
            redditUrl: redditPermalink,
          },
        });

        if (existing) {
          // Update upvotes if changed
          if (existing.upvotes !== score) {
            await prisma.highlight.update({
              where: { id: existing.id },
              data: { upvotes: score },
            });
          }
          continue;
        }

        // Add as highlight
        await prisma.highlight.create({
          data: {
            matchId: matchInfo.matchId,
            title: title.substring(0, 200),
            description: null,
            minute: extractMinute(title),
            videoUrl,
            type: detectHighlightType(title),
            source: "reddit",
            subreddit: post.data.subreddit,
            upvotes: score,
            redditUrl: redditPermalink,
          },
        });

        // Revalidate the match page
        revalidatePath(`/match/${matchInfo.matchNumber}`);
        totalAdded++;
      }
    } catch (err) {
      errors.push(`r/${subreddit}: ${(err as Error).message}`);
    }
  }

  // Revalidate main pages
  revalidatePath("/");

  return NextResponse.json({
    success: true,
    date: today,
    highlightsAdded: totalAdded,
    subredditsScraped: SUBREDDITS.length,
    errors: errors.length > 0 ? errors : undefined,
  });
}
