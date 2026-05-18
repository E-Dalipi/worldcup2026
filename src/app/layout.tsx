import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "World Cup 2026 — Match Tracker",
  description:
    "Track every match, goal, and highlight of the 2026 FIFA World Cup across USA, Canada & Mexico.",
};

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg-primary)]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <a href="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="text-2xl">⚽</span>
          <span className="bg-gradient-to-r from-[var(--accent)] to-purple-400 bg-clip-text text-transparent">
            WC 2026
          </span>
        </a>
        <div className="flex items-center gap-6 text-sm">
          <a
            href="/"
            className="text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
          >
            Calendar
          </a>
          <a
            href="/groups"
            className="text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
          >
            Groups
          </a>
          <a
            href="/knockout"
            className="text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
          >
            Knockout
          </a>
          <a
            href="/teams"
            className="text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
          >
            Teams
          </a>
          <a
            href="/watch-parties"
            className="text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
          >
            🍻 Watch
          </a>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="mt-16 border-t border-[var(--border)] py-8 text-center text-xs text-[var(--text-muted)]">
      <p>
        FIFA World Cup 2026™ — USA 🇺🇸 Canada 🇨🇦 Mexico 🇲🇽
      </p>
      <p className="mt-1">
        June 11 – July 19, 2026 • 48 Teams • 104 Matches • 16 Cities
      </p>
    </footer>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
