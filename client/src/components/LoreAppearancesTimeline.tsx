/* ═══════════════════════════════════════════════════════
   LORE APPEARANCES TIMELINE — Unified chronological view
   of all a character's appearances across songs, games,
   episodes, and lore events.
   ═══════════════════════════════════════════════════════ */
import { useMemo } from "react";
import { Link } from "wouter";
import { useLoredex, type LoredexEntry } from "@/contexts/LoredexContext";
import { motion } from "framer-motion";
import { Music, Gamepad2, Tv, BookOpen, Scroll, ChevronRight } from "lucide-react";
import { CONEXUS_GAMES, type ConexusGame } from "@/data/conexusGames";

const AGE_ORDER = [
  "Age of Privacy",
  "Age of Revelation",
  "Fall of Reality",
  "Age of Potentials",
  "Age of Dischord",
  "Unknown",
];

const AGE_COLORS: Record<string, string> = {
  "Age of Privacy": "#33E2E6",
  "Age of Revelation": "#FFB700",
  "Fall of Reality": "#FF3C40",
  "Age of Potentials": "#A855F7",
  "Age of Dischord": "#22C55E",
  "Unknown": "#94A3B8",
};

const ALBUM_AGE_MAP: Record<string, string> = {
  "Dischordian Logic": "Age of Dischord",
  "The Age of Privacy": "Age of Privacy",
  "The Book of Daniel 2:47": "Age of Revelation",
  "Silence in Heaven": "Fall of Reality",
};

interface AppearanceEvent {
  id: string;
  title: string;
  subtitle: string;
  type: "song" | "game" | "episode" | "lore";
  age: string;
  icon: typeof Music;
  href?: string;
}

export default function LoreAppearancesTimeline({ characterName }: { characterName: string }) {
  const { entries, relationships, songCharacterMap } = useLoredex();

  const appearances = useMemo(() => {
    const events: AppearanceEvent[] = [];

    // Songs where this character appears
    const songs = entries.filter(e => {
      if (e.type !== "song") return false;
      const featured = e.characters_featured || songCharacterMap[e.name] || [];
      return featured.some((c: string) => c.toLowerCase() === characterName.toLowerCase());
    });

    songs.forEach(song => {
      const age = ALBUM_AGE_MAP[song.album || ""] || "Unknown";
      events.push({
        id: `song-${song.id}`,
        title: song.name,
        subtitle: song.album || "Unknown Album",
        type: "song",
        age,
        icon: Music,
        href: `/song/${song.id}`,
      });
    });

    // CoNexus games where this character appears
    CONEXUS_GAMES.forEach(game => {
      const chars = game.characters.map(c => c.toLowerCase());
      if (chars.includes(characterName.toLowerCase())) {
        events.push({
          id: `game-${game.id}`,
          title: game.title,
          subtitle: `${game.age} — ${game.difficulty}`,
          type: "game",
          age: game.age,
          icon: Gamepad2,
          href: "/conexus-portal",
        });
      }
    });

    // Relationships that mention this character (as lore connections)
    const charRels = relationships.filter(r =>
      r.source.toLowerCase() === characterName.toLowerCase() ||
      r.target.toLowerCase() === characterName.toLowerCase()
    );
    const uniqueConnected = new Set<string>();
    charRels.forEach(r => {
      const other = r.source.toLowerCase() === characterName.toLowerCase() ? r.target : r.source;
      if (!uniqueConnected.has(other.toLowerCase())) {
        uniqueConnected.add(other.toLowerCase());
      }
    });

    // Group by age and sort
    events.sort((a, b) => {
      const aIdx = AGE_ORDER.indexOf(a.age);
      const bIdx = AGE_ORDER.indexOf(b.age);
      if (aIdx !== bIdx) return aIdx - bIdx;
      return a.title.localeCompare(b.title);
    });

    return events;
  }, [characterName, entries, relationships, songCharacterMap]);

  if (appearances.length === 0) return null;

  // Group by age
  const grouped = useMemo(() => {
    const groups: Record<string, AppearanceEvent[]> = {};
    appearances.forEach(a => {
      if (!groups[a.age]) groups[a.age] = [];
      groups[a.age].push(a);
    });
    return groups;
  }, [appearances]);

  return (
    <div>
      <h2 className="font-display text-xs font-bold tracking-[0.2em] text-chart-4 mb-4 flex items-center gap-2">
        <Scroll size={13} /> LORE APPEARANCES TIMELINE
        <span className="text-[10px] text-muted-foreground font-normal ml-1">({appearances.length})</span>
      </h2>

      <div className="relative">
        {/* Vertical timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-px bg-border/30" />

        <div className="space-y-4">
          {AGE_ORDER.filter(age => grouped[age]).map((age, ageIdx) => (
            <div key={age}>
              {/* Age header */}
              <div className="flex items-center gap-3 mb-2 relative">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 bg-background"
                  style={{ borderColor: AGE_COLORS[age] }}
                >
                  <BookOpen size={12} style={{ color: AGE_COLORS[age] }} />
                </div>
                <span
                  className="font-display text-[10px] font-bold tracking-[0.2em]"
                  style={{ color: AGE_COLORS[age] }}
                >
                  {age.toUpperCase()}
                </span>
                <span className="font-mono text-[9px] text-muted-foreground/40">
                  {grouped[age].length} appearance{grouped[age].length !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Events in this age */}
              <div className="ml-9 space-y-1.5">
                {grouped[age].map((event, i) => {
                  const Icon = event.icon;
                  const content = (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.03 * (ageIdx * 5 + i) }}
                      className="flex items-center gap-2.5 p-2 rounded-md border border-border/15 hover:bg-secondary/20 hover:border-primary/20 transition-all group"
                    >
                      <div className={`p-1.5 rounded ${
                        event.type === "song" ? "bg-destructive/10" :
                        event.type === "game" ? "bg-chart-5/10" :
                        "bg-primary/10"
                      }`}>
                        <Icon size={11} className={
                          event.type === "song" ? "text-destructive" :
                          event.type === "game" ? "text-chart-5" :
                          "text-primary"
                        } />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium truncate group-hover:text-primary transition-colors">
                          {event.title}
                        </p>
                        <p className="font-mono text-[9px] text-muted-foreground/50 truncate">
                          {event.subtitle}
                        </p>
                      </div>
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono ${
                        event.type === "song" ? "bg-destructive/10 text-destructive" :
                        event.type === "game" ? "bg-chart-5/10 text-chart-5" :
                        "bg-primary/10 text-primary"
                      }`}>
                        {event.type.toUpperCase()}
                      </span>
                      {event.href && (
                        <ChevronRight size={10} className="text-muted-foreground/20 group-hover:text-primary/50 shrink-0" />
                      )}
                    </motion.div>
                  );

                  return event.href ? (
                    <Link key={event.id} href={event.href}>{content}</Link>
                  ) : (
                    <div key={event.id}>{content}</div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
