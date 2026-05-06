/* ═══════════════════════════════════════════════════════
   CIVILOPEDIA PAGE — unified reference index UI

   Plan §D3. Renders apps/shared/civilopedia.ts as a
   Civilization-style searchable, cross-linked reference. The
   index entries name their source surface (codex /
   conspiracy_board / lore_journal / loredex / song_trigger_map /
   act_completion / narrative_audit) so each card surfaces a
   "see in <surface>" deep-link for the player who wants the
   full canonical record.

   The page is intentionally compact — list on the left,
   detail on the right at desktop width, single-column
   scroll on mobile. No new content surfaces are
   introduced; this page only indexes and cross-links the
   surfaces that already ship.
   ═══════════════════════════════════════════════════════ */
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, BookMarked, Search } from "lucide-react";
import {
  CIVILOPEDIA_INDEX,
  getCivilopediaEntry,
  listEntriesByCategory,
  searchCivilopedia,
  type CivilopediaCategory,
  type CivilopediaEntry,
  type CivilopediaOrigin,
} from "@shared/civilopedia";

const CATEGORY_LABELS: Record<CivilopediaCategory, string> = {
  faction: "Factions",
  character: "Characters",
  era: "Eras",
  artifact: "Artifacts",
  song: "Songs",
  location: "Locations",
  system: "Systems",
};

const CATEGORY_ORDER: CivilopediaCategory[] = [
  "faction",
  "character",
  "era",
  "system",
  "song",
  "artifact",
  "location",
];

/** Per-origin deep-link resolver. Maps a Civilopedia entry's
 *  origin tag to the canonical detail surface so the "see in"
 *  button takes the player to the right page with the right id. */
function deepLinkFor(entry: CivilopediaEntry): { href: string; label: string } | null {
  switch (entry.origin) {
    case "codex":
      return { href: `/codex#${entry.originId}`, label: "Open in Codex" };
    case "loredex":
      return { href: `/entity/${entry.originId}`, label: "Open in Loredex" };
    case "song_trigger_map":
      return { href: `/song/${entry.originId}`, label: "Open Song" };
    case "lore_journal":
      return { href: `/lore-journal#${entry.originId}`, label: "Open in Journal" };
    case "conspiracy_board":
      return { href: `/conspiracy#${entry.originId}`, label: "See on Conspiracy Board" };
    case "act_completion":
      return null; // act-completion entries surface their detail inline
    case "narrative_audit":
      return null; // audit entries are documentation-only
  }
}

const ORIGIN_LABEL: Record<CivilopediaOrigin, string> = {
  codex: "Codex",
  conspiracy_board: "Conspiracy Board",
  lore_journal: "Lore Journal",
  loredex: "Loredex",
  song_trigger_map: "Song",
  act_completion: "Act Completion",
  narrative_audit: "Narrative Audit",
};

export default function CivilopediaPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<CivilopediaCategory | "all">("all");
  const [selectedId, setSelectedId] = useState<string | null>(
    CIVILOPEDIA_INDEX[0]?.id ?? null,
  );

  const visible = useMemo<CivilopediaEntry[]>(() => {
    if (query.trim()) return searchCivilopedia(query);
    if (activeCategory === "all") return [...CIVILOPEDIA_INDEX];
    return listEntriesByCategory(activeCategory);
  }, [query, activeCategory]);

  // Group the visible list by category for the left rail. Order
  // categories by CATEGORY_ORDER so the rail layout is stable
  // regardless of how the registry happens to be sorted.
  const grouped = useMemo(() => {
    const buckets = new Map<CivilopediaCategory, CivilopediaEntry[]>();
    for (const entry of visible) {
      const list = buckets.get(entry.category) ?? [];
      list.push(entry);
      buckets.set(entry.category, list);
    }
    return CATEGORY_ORDER.filter((c) => buckets.has(c)).map((c) => ({
      category: c,
      entries: buckets.get(c) ?? [],
    }));
  }, [visible]);

  const selected = selectedId ? getCivilopediaEntry(selectedId) ?? null : null;
  const related = useMemo<CivilopediaEntry[]>(() => {
    if (!selected) return [];
    return (selected.related ?? [])
      .map((id) => getCivilopediaEntry(id))
      .filter((e): e is CivilopediaEntry => !!e);
  }, [selected]);

  const deepLink = selected ? deepLinkFor(selected) : null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <BookMarked className="text-primary" size={20} />
          <h1 className="font-display text-lg tracking-[0.2em] uppercase">Civilopedia</h1>
          <span className="font-mono text-[10px] text-muted-foreground/50 ml-auto">
            {CIVILOPEDIA_INDEX.length} entries
          </span>
        </div>

        {/* Search + category chips */}
        <div className="space-y-2 mb-4">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40"
            />
            <input
              type="search"
              placeholder="Search names, summaries, lore…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-md bg-muted/30 border border-border/30 text-sm font-mono focus:outline-none focus:border-primary/40"
              data-testid="civilopedia-search"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            <CategoryChip
              label="All"
              active={activeCategory === "all"}
              onClick={() => setActiveCategory("all")}
            />
            {CATEGORY_ORDER.map((c) => (
              <CategoryChip
                key={c}
                label={CATEGORY_LABELS[c]}
                active={activeCategory === c}
                onClick={() => setActiveCategory(c)}
              />
            ))}
          </div>
        </div>

        {/* Two-column layout: list on the left, detail on the right.
            Stacks vertically below md. */}
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-4">
          {/* Left rail — grouped entry list */}
          <nav className="space-y-3" data-testid="civilopedia-list">
            {grouped.length === 0 && (
              <p className="text-xs font-mono text-muted-foreground/50 px-2">
                No entries match.
              </p>
            )}
            {grouped.map(({ category, entries }) => (
              <div key={category}>
                <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 mb-1.5 px-2">
                  {CATEGORY_LABELS[category]}
                </h2>
                <ul className="space-y-0.5">
                  {entries.map((entry) => (
                    <li key={entry.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedId(entry.id)}
                        data-testid={`civilopedia-entry-${entry.id}`}
                        className={`w-full text-left px-2 py-1.5 rounded font-mono text-xs transition-colors ${
                          selectedId === entry.id
                            ? "bg-primary/10 text-primary border-l-2 border-primary"
                            : "hover:bg-muted/40 text-foreground/80"
                        }`}
                      >
                        {entry.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          {/* Right column — detail card */}
          <article
            className="rounded-md border border-border/40 bg-muted/10 p-4 space-y-3"
            data-testid="civilopedia-detail"
          >
            {!selected && (
              <p className="font-mono text-xs text-muted-foreground/50">
                Select an entry on the left.
              </p>
            )}
            {selected && (
              <>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground/50">
                      {CATEGORY_LABELS[selected.category]} · {ORIGIN_LABEL[selected.origin]}
                    </p>
                    <h2 className="font-display text-base mt-0.5">{selected.title}</h2>
                  </div>
                </div>
                <p className="font-mono text-sm text-foreground/85 leading-relaxed">
                  {selected.summary}
                </p>

                {selected.triggerMilestone && (
                  <div className="rounded-sm border border-border/30 bg-background/40 px-2 py-1.5">
                    <p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground/50">
                      Discovered when
                    </p>
                    <p className="font-mono text-[11px] text-foreground/80">
                      {selected.triggerMilestone}
                    </p>
                  </div>
                )}

                {related.length > 0 && (
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-1">
                      See also
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {related.map((r) => (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => setSelectedId(r.id)}
                          className="px-2 py-1 rounded font-mono text-[10px] bg-muted/40 hover:bg-muted/60 text-foreground/80"
                          data-testid={`civilopedia-related-${r.id}`}
                        >
                          {r.title}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {deepLink && (
                  <Link
                    href={deepLink.href}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-primary/30 bg-primary/5 text-primary font-mono text-[11px] hover:bg-primary/10 transition-colors"
                    data-testid="civilopedia-deeplink"
                  >
                    {deepLink.label}
                    <ArrowRight size={12} />
                  </Link>
                )}
              </>
            )}
          </article>
        </div>
      </div>
    </div>
  );
}

function CategoryChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-2.5 py-1 rounded-full font-mono text-[10px] uppercase tracking-wider border transition-colors ${
        active
          ? "border-primary/50 bg-primary/10 text-primary"
          : "border-border/30 bg-muted/20 text-muted-foreground/70 hover:bg-muted/40"
      }`}
    >
      {label}
    </button>
  );
}
