/* ═══════════════════════════════════════════════════════
   CHAPTER CARD GALLERY — story-so-far visual strip.

   Renders the 28 chapter cards from the 2026-05-12 producer
   drop as a per-act grouped grid. Each card resolves through
   `newArtChapterCardUrl(stem)`; the stem is derived from the
   relPath under the `chapter_cards` top-category bucket.

   First non-test consumer of {@link newArtManifest}. Closes
   the assets.expansion_art_render_reachability gap surfaced
   by ship:check.
   ═══════════════════════════════════════════════════════ */
import { useMemo } from "react";
import {
  newArtAssetsByCategory,
  newArtChapterCardUrl,
} from "@shared/expansionArt/newArtManifest";

interface ChapterCard {
  stem: string;
  act: string;
  slug: string;
  url: string;
}

// File-stem shape: "chapter_act<N>_<slug>". Any chapter_cards entry
// the producer ships under another shape would be skipped — that's a
// drop-format change worth surfacing in code review, not silently
// rewriting the parser.
const STEM_RE = /^art\/chapter_cards\/(chapter_act([0-9]+)_(.+))\.png$/;

export function ChapterCardGallery() {
  const byAct = useMemo(() => {
    const assets = newArtAssetsByCategory("chapter_cards");
    const parsed: ChapterCard[] = [];
    for (const a of assets) {
      const m = a.relPath.match(STEM_RE);
      if (!m) continue;
      const [, stem, actNum, rawSlug] = m;
      const url = newArtChapterCardUrl(stem);
      if (!url) continue;
      parsed.push({
        stem,
        act: `Act ${actNum}`,
        slug: rawSlug.replace(/_/g, " "),
        url,
      });
    }
    const m = new Map<string, ChapterCard[]>();
    for (const c of parsed) {
      const bucket = m.get(c.act) ?? [];
      bucket.push(c);
      m.set(c.act, bucket);
    }
    return Array.from(m.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, []);

  return (
    <div className="space-y-6">
      {byAct.map(([act, cards]) => (
        <div key={act}>
          <h3 className="text-sm uppercase tracking-wide opacity-60 mb-2">
            {act}
          </h3>
          <ul
            className="grid gap-3"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            }}
          >
            {cards.map((c) => (
              <li
                key={c.stem}
                className="overflow-hidden rounded-md border border-white/5 bg-black/20"
              >
                <img
                  src={c.url}
                  alt={`${act} — ${c.slug}`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto block"
                  style={{ aspectRatio: "3 / 4", objectFit: "cover" }}
                />
                <div className="px-2 py-1.5 text-xs leading-tight opacity-90">
                  {c.slug}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
