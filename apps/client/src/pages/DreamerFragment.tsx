/**
 * `/dreamer` — 404-styled vision fragment (Liminal touch §4 from
 * /root/.claude/plans/continue-your-qr-assessment-mighty-valley.md).
 *
 * SPA constraint: we can't return a 404 HTTP status from a client
 * route. Practical implementation: render a 404-styled page (mirror
 * of NotFound.tsx) that *also* surfaces a cryptic vision fragment in
 * the visible body. Wanons who type `/dreamer` directly into the URL
 * bar see this. Players who navigate via the app never reach it.
 *
 * Distinct from the actual NotFound catch-all (which fires for genuine
 * unknown routes); this one is intercepted before the catch-all and
 * carries lore.
 */
import { useEffect } from "react";
import { Link } from "wouter";
import { AlertCircle, Home } from "lucide-react";

const VISION_FRAGMENT: readonly string[] = [
  "the Dreamer is many",
  "and the Dreamer is one",
  "the board is smaller than they told you",
  "you will know when to come down",
];

export default function DreamerFragment() {
  // Set the document title to 404 so the URL bar / tab title also
  // reads as "not found." Wanons who screenshot the tab title see
  // the texture confirmed.
  useEffect(() => {
    const previous = document.title;
    document.title = "404 — Loredex OS";
    return () => {
      document.title = previous;
    };
  }, []);

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-black text-white/80 p-8"
      role="article"
      aria-label="Dreamer vision fragment (404)"
    >
      <div className="max-w-lg w-full text-center">
        <div className="flex justify-center mb-6" aria-hidden="true">
          <AlertCircle className="h-16 w-16 text-white/40" />
        </div>

        <h1 className="text-4xl font-bold mb-2 text-white/90">404</h1>
        <h2 className="text-xl font-semibold mb-8 text-white/60">
          Page Not Found
        </h2>

        {/* The body text is the lore. A casual visitor reads it as
            placeholder copy; a wanon recognises the Vision 4 caption
            register from /root/.claude/plans/...mighty-valley.md
            §Part 1.5. */}
        <div className="space-y-2 font-serif text-sm leading-relaxed mb-12 text-white/50 italic">
          {VISION_FRAGMENT.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg border border-white/20 hover:border-white/40 transition-colors text-white/70 hover:text-white"
        >
          <Home className="w-4 h-4" />
          <span>Go Home</span>
        </Link>

        <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/20 mt-12">
          (no signature)
        </p>
      </div>
    </div>
  );
}

// Exposed for tests.
export const _VISION_FRAGMENT_FOR_TEST = VISION_FRAGMENT;
