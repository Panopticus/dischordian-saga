/* ═══════════════════════════════════════════════════════
   STORY ARC — Shows how a character appears across
   albums, epochs, and CoNexus games chronologically.
   Embedded on EntityPage for characters.
   ═══════════════════════════════════════════════════════ */
import { useMemo } from "react";
import { Link } from "wouter";
import { useLoredex, type LoredexEntry } from "@/contexts/LoredexContext";
import { motion } from "framer-motion";
import { Music, Tv, Gamepad2, ChevronRight, Disc3, Play } from "lucide-react";
import { usePlayer } from "@/contexts/PlayerContext";

/* ─── EPOCH ORDER ─── */
const EPOCH_ORDER = [
  "Age of Privacy",
  "Age of Revelation",
  "Fall of Reality",
  "Age of Potentials",
  "Age of Dischord",
];

const ALBUM_ORDER = [
  "Dischordian Logic",
  "The Age of Privacy",
  "The Book of Daniel 2:47",
  "Silence in Heaven",
];

const ALBUM_EPOCH_MAP: Record<string, string> = {
  "Dischordian Logic": "Age of Dischord",
  "The Age of Privacy": "Age of Privacy",
  "The Book of Daniel 2:47": "Age of Revelation",
  "Silence in Heaven": "Fall of Reality",
};

/* ─── CONEXUS GAMES ─── */
const CONEXUS_GAMES = [
  { title: "The Necromancer's Lair", epoch: "Age of Revelation", characters: ["The Necromancer", "Akai Shi", "The Collector", "The Warlord"] },
  { title: "Awaken the Clone", epoch: "Age of Potentials", characters: ["The Clone", "The Oracle", "The Hierophant"] },
  { title: "Sundown Bazaar", epoch: "Age of Privacy", characters: ["The Collector", "The Enigma", "The Merchant", "Agent Zero"] },
  { title: "The Inception Ark", epoch: "Age of Potentials", characters: ["The Architect", "The Source", "The Human", "Iron Lion"] },
];

interface StoryArcEvent {
  type: "song" | "game" | "epoch";
  title: string;
  subtitle: string;
  epoch: string;
  link?: string;
  image?: string;
  entry?: LoredexEntry;
}

export default function StoryArc({ characterName }: { characterName: string }) {
  const { entries, getByAlbum } = useLoredex();
  const { playSong, setQueue } = usePlayer();

  const arcEvents = useMemo(() => {
    const events: StoryArcEvent[] = [];
    const charLower = characterName.toLowerCase();

    // Find songs that mention this character
    ALBUM_ORDER.forEach((albumName) => {
      const albumSongs = getByAlbum(albumName);
      albumSongs.forEach((song) => {
        // Check if the character appears in this song's connections or name
        const songConnections = song.connections || [];
        const appearsInSong =
          songConnections.some((c: string) => c.toLowerCase().includes(charLower)) ||
          (song.song_appearances && Array.isArray(song.song_appearances) &&
            song.song_appearances.some((a: { song: string; album: string }) => a.song.toLowerCase().includes(charLower)));

        // Also check if the song name references the character
        const nameMatch = song.name.toLowerCase().includes(charLower.replace("the ", ""));

        if (appearsInSong || nameMatch) {
          events.push({
            type: "song",
            title: song.name,
            subtitle: albumName,
            epoch: ALBUM_EPOCH_MAP[albumName] || "Unknown",
            link: `/song/${song.id}`,
            image: song.image,
            entry: song,
          });
        }
      });
    });

    // Find CoNexus games featuring this character
    CONEXUS_GAMES.forEach((game) => {
      if (game.characters.some((c) => c.toLowerCase() === charLower)) {
        events.push({
          type: "game",
          title: game.title,
          subtitle: "CoNexus Stories",
          epoch: game.epoch,
        });
      }
    });

    // Sort by epoch order
    events.sort((a, b) => {
      const aIdx = EPOCH_ORDER.indexOf(a.epoch);
      const bIdx = EPOCH_ORDER.indexOf(b.epoch);
      return (aIdx === -1 ? 99 : aIdx) - (bIdx === -1 ? 99 : bIdx);
    });

    return events;
  }, [characterName, entries, getByAlbum]);

  if (arcEvents.length === 0) return null;

  // Group by epoch
  const epochGroups = arcEvents.reduce<Record<string, StoryArcEvent[]>>((acc, event) => {
    if (!acc[event.epoch]) acc[event.epoch] = [];
    acc[event.epoch].push(event);
    return acc;
  }, {});

  const songEvents = arcEvents.filter((e) => e.type === "song" && e.entry);

  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-px flex-1 max-w-6 bg-gradient-to-r from-transparent to-accent/50" />
        <h3 className="font-display text-xs font-bold tracking-[0.2em] text-accent">STORY ARC</h3>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-accent/50" />
      </div>

      <p className="font-mono text-[10px] text-muted-foreground/50 mb-4">
        {characterName}'s journey across {arcEvents.length} appearances in {Object.keys(epochGroups).length} epoch{Object.keys(epochGroups).length !== 1 ? "s" : ""}
      </p>

      {/* Timeline */}
      <div className="relative pl-6 space-y-4">
        {/* Vertical line */}
        <div className="absolute left-2 top-0 bottom-0 w-px bg-gradient-to-b from-accent/40 via-primary/20 to-transparent" />

        {Object.entries(epochGroups).map(([epoch, events], groupIdx) => (
          <motion.div
            key={epoch}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: groupIdx * 0.1 }}
          >
            {/* Epoch marker */}
            <div className="flex items-center gap-2 mb-2 -ml-6">
              <div className="w-4 h-4 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center z-10">
                <div className="w-1.5 h-1.5 rounded-full bg-accent" />
              </div>
              <span className="font-display text-[10px] font-bold tracking-[0.15em] text-accent">{epoch.toUpperCase()}</span>
            </div>

            {/* Events in this epoch */}
            <div className="space-y-1.5 ml-0">
              {events.map((event, i) => (
                <div
                  key={`${event.title}-${i}`}
                  className="flex items-center gap-2.5 p-2 rounded-md border border-border/10 hover:bg-secondary/20 transition-all group"
                >
                  {/* Connector dot */}
                  <div className="absolute left-[5px] w-1.5 h-1.5 rounded-full bg-border/30" />

                  {/* Icon / Image */}
                  {event.image ? (
                    <img src={event.image} alt="" className="w-8 h-8 rounded object-cover ring-1 ring-border/20 shrink-0" loading="lazy" />
                  ) : (
                    <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 ${
                      event.type === "song" ? "bg-destructive/10 text-destructive" :
                      event.type === "game" ? "bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)]" :
                      "bg-accent/10 text-accent"
                    }`}>
                      {event.type === "song" ? <Music size={12} /> :
                       event.type === "game" ? <Gamepad2 size={12} /> :
                       <Tv size={12} />}
                    </div>
                  )}

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    {event.link ? (
                      <Link href={event.link} className="text-[11px] font-medium truncate block hover:text-primary transition-colors">
                        {event.title}
                      </Link>
                    ) : (
                      <p className="text-[11px] font-medium truncate">{event.title}</p>
                    )}
                    <p className="text-[9px] font-mono text-muted-foreground/40 truncate">
                      {event.type === "song" ? <><Disc3 size={8} className="inline mr-1" />{event.subtitle}</> :
                       event.type === "game" ? <><Gamepad2 size={8} className="inline mr-1" />{event.subtitle}</> :
                       event.subtitle}
                    </p>
                  </div>

                  {/* Play button for songs */}
                  {event.type === "song" && event.entry && (
                    <button
                      onClick={() => {
                        if (event.entry) {
                          setQueue(songEvents.map((e) => e.entry!));
                          playSong(event.entry);
                        }
                      }}
                      className="shrink-0 p-1 text-muted-foreground/30 hover:text-primary opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Play size={10} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Play all appearances */}
      {songEvents.length > 1 && (
        <button
          onClick={() => {
            const songs = songEvents.map((e) => e.entry!);
            setQueue(songs);
            playSong(songs[0]);
          }}
          className="mt-4 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md text-[10px] font-mono bg-accent/10 border border-accent/30 text-accent hover:bg-accent/20 transition-all"
        >
          <Play size={10} /> PLAY ALL APPEARANCES ({songEvents.length} TRACKS)
        </button>
      )}
    </div>
  );
}
