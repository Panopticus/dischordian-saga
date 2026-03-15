/* ═══════════════════════════════════════════════════════
   LYRICS VIEWER — Annotated lyrics with lore entity highlights
   Fetches lyrics via LLM, highlights character/location/faction names,
   links them to dossier entries.
   ═══════════════════════════════════════════════════════ */
import { useState, useMemo, useCallback } from "react";
import { Link } from "wouter";
import { useLoredex, type LoredexEntry } from "@/contexts/LoredexContext";
import { trpc } from "@/lib/trpc";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Loader2, AlertCircle, Users, MapPin, Swords, Eye,
  ChevronRight, Sparkles, RefreshCw
} from "lucide-react";

const TYPE_COLORS: Record<string, string> = {
  character: "text-[var(--neon-cyan)] border-[var(--neon-cyan)]/30 bg-[var(--neon-cyan)]/5",
  location: "text-[var(--neon-amber)] border-[var(--neon-amber)]/30 bg-[var(--neon-amber)]/5",
  faction: "text-[var(--neon-red)] border-[var(--neon-red)]/30 bg-[var(--neon-red)]/5",
  concept: "text-[var(--orb-orange)] border-[var(--orb-orange)]/30 bg-[var(--orb-orange)]/5",
};

const TYPE_ICONS: Record<string, typeof Users> = {
  character: Users,
  location: MapPin,
  faction: Swords,
  concept: Eye,
};

interface LyricsViewerProps {
  songName: string;
  albumName?: string;
  artistName?: string;
  charactersFeature?: string[];
}

interface AnnotatedLine {
  text: string;
  segments: Array<{
    text: string;
    entity?: LoredexEntry;
  }>;
}

export default function LyricsViewer({ songName, albumName, artistName, charactersFeature }: LyricsViewerProps) {
  const { entries, getEntry } = useLoredex();
  const [isOpen, setIsOpen] = useState(false);
  const [lyrics, setLyrics] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hoveredEntity, setHoveredEntity] = useState<LoredexEntry | null>(null);

  const fetchLyrics = trpc.lyrics.generate.useMutation();

  // Build entity lookup for annotation
  const entityNames = useMemo(() => {
    const names: Array<{ name: string; entry: LoredexEntry }> = [];
    entries.forEach((e) => {
      if (e.type === "song") return;
      names.push({ name: e.name, entry: e });
      e.aliases?.forEach((alias) => {
        if (alias.length > 2) names.push({ name: alias, entry: e });
      });
    });
    // Sort by name length descending so longer names match first
    return names.sort((a, b) => b.name.length - a.name.length);
  }, [entries]);

  // Annotate a single line of lyrics
  const annotateLine = useCallback(
    (line: string): AnnotatedLine => {
      if (!line.trim()) return { text: line, segments: [{ text: line }] };

      const segments: AnnotatedLine["segments"] = [];
      let remaining = line;
      let pos = 0;

      while (remaining.length > 0) {
        let found = false;
        for (const { name, entry } of entityNames) {
          const idx = remaining.toLowerCase().indexOf(name.toLowerCase());
          if (idx === 0 || (idx > 0 && /\b/.test(remaining[idx - 1] || ""))) {
            if (idx >= 0) {
              // Check word boundary
              const before = idx > 0 ? remaining[idx - 1] : " ";
              const after = remaining[idx + name.length] || " ";
              if (/[\s,.:;!?'"()\-—]/.test(before) || idx === 0) {
                if (/[\s,.:;!?'"()\-—]/.test(after) || idx + name.length === remaining.length) {
                  if (idx > 0) {
                    segments.push({ text: remaining.substring(0, idx) });
                  }
                  segments.push({ text: remaining.substring(idx, idx + name.length), entity: entry });
                  remaining = remaining.substring(idx + name.length);
                  found = true;
                  break;
                }
              }
            }
          }
        }
        if (!found) {
          // No entity found at current position, advance one character
          const nextSpace = remaining.indexOf(" ", 1);
          if (nextSpace === -1) {
            segments.push({ text: remaining });
            remaining = "";
          } else {
            segments.push({ text: remaining.substring(0, nextSpace + 1) });
            remaining = remaining.substring(nextSpace + 1);
          }
        }
      }

      // Merge adjacent non-entity segments
      const merged: AnnotatedLine["segments"] = [];
      for (const seg of segments) {
        if (!seg.entity && merged.length > 0 && !merged[merged.length - 1].entity) {
          merged[merged.length - 1].text += seg.text;
        } else {
          merged.push(seg);
        }
      }

      return { text: line, segments: merged };
    },
    [entityNames]
  );

  const annotatedLines = useMemo(() => {
    if (!lyrics) return [];
    return lyrics.split("\n").map(annotateLine);
  }, [lyrics, annotateLine]);

  // Unique entities found in lyrics
  const foundEntities = useMemo(() => {
    const seen = new Set<string>();
    const result: LoredexEntry[] = [];
    annotatedLines.forEach((line) => {
      line.segments.forEach((seg) => {
        if (seg.entity && !seen.has(seg.entity.id)) {
          seen.add(seg.entity.id);
          result.push(seg.entity);
        }
      });
    });
    return result;
  }, [annotatedLines]);

  const handleFetchLyrics = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchLyrics.mutateAsync({
        songName,
        albumName: albumName || "",
        artistName: artistName || "Malkia Ukweli & the Panopticon",
        characters: charactersFeature || [],
      });
      setLyrics(result.lyrics);
    } catch (err: any) {
      setError(err.message || "Failed to generate lyrics analysis");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    if (!isOpen && !lyrics && !loading) {
      handleFetchLyrics();
    }
    setIsOpen(!isOpen);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.32 }}
      className="rounded-lg border border-[var(--neon-cyan)]/20 bg-[var(--neon-cyan)]/[0.02] overflow-hidden"
    >
      {/* Header / Toggle */}
      <button
        onClick={handleToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-[var(--neon-cyan)]/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          <BookOpen size={14} className="text-[var(--neon-cyan)]" />
          <span className="font-display text-xs font-bold tracking-[0.2em] text-[var(--neon-cyan)]">
            LYRICS & LORE ANNOTATIONS
          </span>
          <Sparkles size={10} className="text-[var(--neon-cyan)]/50" />
        </div>
        <ChevronRight
          size={14}
          className={`text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              {/* Loading State */}
              {loading && (
                <div className="flex items-center gap-3 py-8 justify-center">
                  <Loader2 size={16} className="animate-spin text-[var(--neon-cyan)]" />
                  <span className="font-mono text-xs text-muted-foreground">
                    Analyzing lyrics and cross-referencing lore database...
                  </span>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="flex items-center gap-3 py-4">
                  <AlertCircle size={14} className="text-destructive shrink-0" />
                  <span className="font-mono text-xs text-destructive">{error}</span>
                  <button
                    onClick={handleFetchLyrics}
                    className="ml-auto flex items-center gap-1 px-2 py-1 rounded text-[10px] font-mono text-primary border border-primary/30 hover:bg-primary/10 transition-colors"
                  >
                    <RefreshCw size={10} /> RETRY
                  </button>
                </div>
              )}

              {/* Lyrics Display */}
              {lyrics && !loading && (
                <div className="space-y-4">
                  {/* Annotation Legend */}
                  {foundEntities.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pb-3 border-b border-border/20">
                      <span className="font-mono text-[9px] text-muted-foreground/50 mr-1 self-center">
                        ENTITIES DETECTED:
                      </span>
                      {foundEntities.slice(0, 8).map((e) => {
                        const Icon = TYPE_ICONS[e.type] || Eye;
                        return (
                          <Link
                            key={e.id}
                            href={`/entity/${e.id}`}
                            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono border ${
                              TYPE_COLORS[e.type] || "text-foreground border-border/30"
                            } hover:opacity-80 transition-opacity`}
                          >
                            <Icon size={8} />
                            {e.name}
                          </Link>
                        );
                      })}
                      {foundEntities.length > 8 && (
                        <span className="text-[9px] font-mono text-muted-foreground/40 self-center">
                          +{foundEntities.length - 8} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Lyrics Lines */}
                  <div className="space-y-0.5 font-mono text-sm leading-relaxed relative">
                    {annotatedLines.map((line, i) => (
                      <div key={i} className={`${!line.text.trim() ? "h-4" : ""}`}>
                        {line.segments.map((seg, j) =>
                          seg.entity ? (
                            <Link
                              key={j}
                              href={`/entity/${seg.entity.id}`}
                              className={`inline border-b border-dashed cursor-pointer transition-all hover:opacity-80 ${
                                TYPE_COLORS[seg.entity.type]?.split(" ")[0] || "text-primary"
                              }`}
                              onMouseEnter={() => setHoveredEntity(seg.entity!)}
                              onMouseLeave={() => setHoveredEntity(null)}
                            >
                              {seg.text}
                            </Link>
                          ) : (
                            <span key={j} className="text-foreground/70">
                              {seg.text}
                            </span>
                          )
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Hovered Entity Tooltip */}
                  <AnimatePresence>
                    {hoveredEntity && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="sticky bottom-0 mt-3 p-3 rounded-lg border border-border/30 bg-card/95 backdrop-blur-sm"
                      >
                        <div className="flex items-center gap-3">
                          {hoveredEntity.image && (
                            <img
                              src={hoveredEntity.image}
                              alt={hoveredEntity.name}
                              className="w-10 h-10 rounded-md object-cover ring-1 ring-border/20"
                            />
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold">{hoveredEntity.name}</p>
                            <p className="text-[10px] font-mono text-muted-foreground truncate">
                              {hoveredEntity.type} {hoveredEntity.era ? `// ${hoveredEntity.era}` : ""}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Disclaimer */}
                  <p className="font-mono text-[9px] text-muted-foreground/30 pt-2 border-t border-border/10">
                    LYRICS GENERATED BY AI ANALYSIS // MAY NOT BE 100% ACCURATE // LORE ANNOTATIONS AUTO-DETECTED
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
