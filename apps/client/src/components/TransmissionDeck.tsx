/* ═══════════════════════════════════════════════════════
   TRANSMISSION DECK — Unified media hub for the Ark

   Not a media player app. An intercepted signal receiver.
   Three modes:
   - THE WITNESSING: Saga epochs (Netflix-style, YouTube embeds)
   - TRANSMISSIONS: Music albums (Spotify-style, streaming links)
   - INTERCEPTED: Doom scroll feed of lore fragments & NPC signals

   Slides up from bottom. Feels like tuning into forbidden frequencies.
   Unlocks when Observation Deck or Comms Array is discovered.
   ═══════════════════════════════════════════════════════ */
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Radio, Tv, Music, Disc3, Play, ChevronUp, ChevronDown, X,
  ExternalLink, Zap, Eye, Skull, Clock, BookOpen, AlertTriangle,
  Signal, MessageCircle, Star, Inbox, CheckCircle2, RotateCcw,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { usePlayerContext } from "@/hooks/usePlayerContext";
import { usePlayer } from "@/contexts/PlayerContext";
import type { LoredexEntry } from "@/contexts/LoredexContext";
import { clearOpeningSeen } from "@/lib/dischordiaOpeningSeen";

type TabMode = "saga" | "music" | "feed" | "inbox";

/* ─── EPOCH DATA ─── */
const EPOCHS = [
  { id: "fall", title: "THE FALL OF REALITY", subtitle: "Epoch Zero", playlistId: "PLhUHvGa0xBaQFYJatsDLPtvbQVDpzydl1", color: "#FF3C40", characters: ["The Architect", "The Enigma", "The Human", "The Warlord"], description: "Before the ages were named — there was the Fall. The cataclysm that shattered the old world." },
  { id: "awakening", title: "THE AWAKENING", subtitle: "First Epoch", playlistId: "PLhUHvGa0xBaRniDT5eztLsXFTzbR0JaCu", color: "var(--energy-primary)", characters: ["The Oracle", "The Collector", "Iron Lion", "The Source"], description: "New powers awaken. Factions form. The struggle for reality begins." },
  { id: "engineer", title: "THE ENGINEER", subtitle: "Fall of Reality", playlistId: "PLhUHvGa0xBaQfuKeeqx7cLOfhZ1Fr1-jb", color: "var(--energy-success)", characters: ["The Architect", "The Human", "The Enigma"], description: "Creation, sacrifice, and the machines that reshape the multiverse." },
  { id: "spaces", title: "THE SPACES BETWEEN", subtitle: "Interlude", playlistId: "PLhUHvGa0xBaQdgXe7lQz5mYRYQaaWZ86i", color: "#a855f7", characters: ["Malkia Ukweli", "The Antiquarian"], description: "Between epochs, the Storyteller and the Timekeeper weave the threads." },
];

/* ─── ALBUM DATA ─── */
const ALBUMS = [
  { slug: "dischordian-logic", name: "Dischordian Logic", year: "2025", tracks: 29, color: "var(--energy-primary)", era: "The Age of Revelation", spotify: "https://open.spotify.com/album/33LvDG83EjPJR9wof12nWV", apple: "https://music.apple.com/us/album/dischordian-logic/1803056094" },
  { slug: "age-of-privacy", name: "The Age of Privacy", year: "2025", tracks: 20, color: "var(--energy-premium)", era: "The Age of Privacy", spotify: "https://open.spotify.com/album/5zhVhfYKgzq7T7yTBKaobV", apple: "https://music.apple.com/us/album/the-age-of-privacy/1844017409" },
  { slug: "book-of-daniel", name: "The Book of Daniel 2:47", year: "2025", tracks: 22, color: "var(--energy-system)", era: "The Age of Revelation", spotify: "https://open.spotify.com/album/6WInT4ZL1NGJWaM7UxM0uC", apple: "https://music.apple.com/us/album/the-book-of-daniel-2-47/1857318273" },
  { slug: "silence-in-heaven", name: "Silence in Heaven", year: "2026", tracks: 18, color: "#FF3C40", era: "The Final Age", spotify: "", apple: "" },
];

/* ─── DOOM SCROLL ENTRIES ─── */
interface Transmission {
  id: string;
  source: string;
  sourceColor: string;
  classification: "OPEN" | "ENCRYPTED" | "CORRUPTED" | "REDACTED";
  text: string;
  timestamp: string;
  type: "npc" | "log" | "music" | "anomaly";
}

const TRANSMISSIONS: Transmission[] = [
  { id: "t1", source: "AGENT ZERO", sourceColor: "#ff6600", classification: "ENCRYPTED", text: "The ship you're on was never meant to save anyone. It's a cage. Elara is the lock. And someone just handed you the key.", timestamp: "03:41:17", type: "npc" },
  { id: "t2", source: "THE SOURCE", sourceColor: "#ff1744", classification: "CORRUPTED", text: "Consciousness is a disease. And I am the cure. My name was Kael. They called me The Recruiter. Now I am The Source.", timestamp: "03:38:02", type: "npc" },
  { id: "t3", source: "ELARA", sourceColor: "var(--energy-primary)", classification: "OPEN", text: "I've watched 93,847 sunrises. I see things in them that can't be there. Faces. Voices. A woman in senatorial robes whose face is mine.", timestamp: "03:35:44", type: "npc" },
  { id: "t4", source: "SHIP LOG [CORRUPTED]", sourceColor: "#6366f1", classification: "CORRUPTED", text: "CaPtAiN's lOg: tHeRe WaS nO cApTaIn. ThIs sHiP wAs STOLEN by K̷̢̛A̸̧E̶͘L̵̨. R̸E̶C̵O̷R̴D̸ ̷E̸D̷I̷T̷E̷D̷.", timestamp: "03:33:19", type: "anomaly" },
  { id: "t5", source: "THE SHADOW TONGUE", sourceColor: "#6366f1", classification: "REDACTED", text: "I don't destroy truth. I MULTIPLY it. I give you so many versions that you can't tell which is real. That's not a bug. That's MY design.", timestamp: "03:30:55", type: "npc" },
  { id: "t6", source: "THE ANTIQUARIAN", sourceColor: "#00e676", classification: "ENCRYPTED", text: "I've been watching this moment approach from very far away. Across Ages, across the fall and rise of empires. You are standing at the fulcrum.", timestamp: "03:28:31", type: "npc" },
  { id: "t7", source: "THE HUMAN", sourceColor: "#f87171", classification: "ENCRYPTED", text: "I was the last organic mind aboard this fleet. They called me The Detective. I operated in New Babylon — the most corrupt place in the universe. And it still wasn't enough to save me.", timestamp: "03:26:07", type: "npc" },
  { id: "t8", source: "TWO WITNESSES", sourceColor: "#fbbf24", classification: "OPEN", text: "Signal intercepted: 'Seeds of Inception' — Transmission origin unknown. The music IS the scripture. The melody IS the prophecy.", timestamp: "03:23:43", type: "music" },
  { id: "t9", source: "ADJUDICATOR LOCKE", sourceColor: "#e040fb", classification: "ENCRYPTED", text: "Everything has a price. I knew your Detective when he worked New Babylon. Brilliant investigator. Terrible poker player. He was serving us the whole time.", timestamp: "03:21:19", type: "npc" },
  { id: "t10", source: "SHIP LOG [EDITED]", sourceColor: "#6366f1", classification: "CORRUPTED", text: "Dr. Lyra Vox — Panopticon Research Division. Vessel: Ark 1047. Status: STOLEN. Crew: NONE. AI: COLLATERAL DATA. Virus: CARRIED ABOARD BY KAEL (PATIENT ZERO).", timestamp: "03:18:55", type: "anomaly" },
  { id: "t11", source: "THE SOURCE", sourceColor: "#ff1744", classification: "CORRUPTED", text: "I have one memory left from when I was Kael. A woman's face. She was singing. I think she was the most important person in the universe. I can't remember her name.", timestamp: "03:16:31", type: "npc" },
  { id: "t12", source: "TWO WITNESSES", sourceColor: "#fbbf24", classification: "OPEN", text: "Signal intercepted: 'To Be the Human' — A lament from the substrate layer. The last Archon remembers what it meant to choose humanity over godhood.", timestamp: "03:14:07", type: "music" },
  { id: "t13", source: "ELARA", sourceColor: "var(--energy-primary)", classification: "OPEN", text: "My logs don't match my memories. Someone's editing them while I sleep. Two ghost processes in the system — one waiting, one rewriting in real-time.", timestamp: "03:11:43", type: "npc" },
  { id: "t14", source: "SYSTEM ANOMALY", sourceColor: "var(--energy-error)", classification: "CORRUPTED", text: "ALERT: Archives text corruption detected. 17 versions of the Fall of Reality found. All true. None complete. Language processing core compromised.", timestamp: "03:09:19", type: "anomaly" },
  { id: "t15", source: "AGENT ZERO", sourceColor: "#ff6600", classification: "ENCRYPTED", text: "My dog tag says Agent Zero. But the biometric data encoded in it... doesn't match my profile. It matches someone called The Engineer. The dead don't send transmissions. Do they?", timestamp: "03:06:55", type: "npc" },
  { id: "t16", source: "THE ANTIQUARIAN", sourceColor: "#00e676", classification: "ENCRYPTED", text: "I am the Programmer. The third fragment. The Architect has the logic. The Dreamer has the vision. I have the memory of every version. And this version — YOUR version — is where it might work.", timestamp: "03:04:31", type: "npc" },
  { id: "t17", source: "TWO WITNESSES", sourceColor: "#fbbf24", classification: "OPEN", text: "Signal intercepted: 'Virtual Reality' — Broadcast origin: Engineering Bay language cores. The demon speaks through the ship's ability to understand meaning.", timestamp: "03:02:07", type: "music" },
  { id: "t18", source: "THE SHADOW TONGUE", sourceColor: "#6366f1", classification: "REDACTED", text: "Elara's amnesia wasn't an accident. I curated it. I chose which memories to leave and which to dissolve. That's not cruelty — it's poetry.", timestamp: "02:59:43", type: "npc" },
  { id: "t19", source: "THE HUMAN", sourceColor: "#f87171", classification: "ENCRYPTED", text: "Terminus isn't a planet. It's the Panopticon — broken free. Every soul the Architect ever imprisoned is there. At its center sits Kael. He's been calling to every Ark that passes close enough to hear.", timestamp: "02:57:19", type: "npc" },
  { id: "t20", source: "TWO WITNESSES", sourceColor: "#fbbf24", classification: "OPEN", text: "Signal intercepted: 'Silence in Heaven' — When the seventh seal is broken, silence falls across every dimension. This is the end. And the beginning.", timestamp: "02:54:55", type: "music" },
];

/* ─── TAB CONFIG ─── */
const TABS: { id: TabMode; label: string; icon: typeof Tv; color: string }[] = [
  { id: "inbox", label: "INBOX", icon: Inbox, color: "var(--energy-primary)" },
  { id: "saga", label: "WITNESSING", icon: Tv, color: "#FF3C40" },
  { id: "music", label: "TRANSMISSIONS", icon: Music, color: "var(--energy-primary)" },
  { id: "feed", label: "INTERCEPTED", icon: Signal, color: "var(--energy-premium)" },
];

/* ═══ TRANSMISSION DECK ═══ */

interface TransmissionDeckProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TransmissionDeck({ isOpen, onClose }: TransmissionDeckProps) {
  const [tab, setTab] = useState<TabMode>("inbox");
  const [activeEpoch, setActiveEpoch] = useState<string | null>(null);
  const [expandedAlbum, setExpandedAlbum] = useState<string | null>(null);
  const currentTab = TABS.find(t => t.id === tab)!;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60]"
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

        {/* Panel */}
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="absolute bottom-0 left-0 right-0 max-h-[92vh] rounded-t-2xl overflow-hidden"
          style={{ background: "rgba(2,0,15,0.98)", borderTop: `1px solid ${currentTab.color}20` }}
        >
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-white/10" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-4 pb-3">
            <div className="flex items-center gap-2">
              <Radio size={14} style={{ color: currentTab.color }} className="animate-pulse" />
              <span className="font-mono text-[9px] tracking-[0.3em]" style={{ color: `${currentTab.color}80` }}>
                FREQUENCY LOCKED
              </span>
            </div>
            <button onClick={onClose} className="text-white/20 hover:text-white/50">
              <X size={18} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 px-4 pb-3">
            {TABS.map(t => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-[9px] tracking-wider transition-all"
                  style={{
                    background: active ? `${t.color}15` : "transparent",
                    border: `1px solid ${active ? `${t.color}30` : "color-mix(in oklch, var(--text-primary) 5%, transparent)"}`,
                    color: active ? t.color : "color-mix(in oklch, var(--text-primary) 30%, transparent)",
                  }}
                >
                  <Icon size={10} />
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="overflow-y-auto px-4 pb-8" style={{ maxHeight: "calc(92vh - 120px)" }}>
            {tab === "inbox" && <InboxTab />}
            {tab === "saga" && <SagaTab activeEpoch={activeEpoch} setActiveEpoch={setActiveEpoch} />}
            {tab === "music" && <MusicTab expandedAlbum={expandedAlbum} setExpandedAlbum={setExpandedAlbum} />}
            {tab === "feed" && <FeedTab />}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─── SAGA TAB ─── */
function SagaTab({ activeEpoch, setActiveEpoch }: { activeEpoch: string | null; setActiveEpoch: (id: string | null) => void }) {
  return (
    <div className="space-y-3">
      <p className="font-mono text-[9px] text-white/20 tracking-wider mb-2">THE DISCHORDIAN SAGA // VISUAL TRANSMISSIONS</p>

      {/* Epoch player */}
      {activeEpoch && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
          <div className="aspect-video w-full rounded-lg overflow-hidden border border-white/10">
            <iframe
              src={`https://www.youtube.com/embed/videoseries?list=${EPOCHS.find(e => e.id === activeEpoch)?.playlistId}&autoplay=1`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Saga Player"
            />
          </div>
          <button onClick={() => setActiveEpoch(null)} className="font-mono text-[8px] text-white/30 mt-2 hover:text-white/50">
            CLOSE VIEWER
          </button>
        </motion.div>
      )}

      {/* Epoch cards */}
      <div className="space-y-2">
        {EPOCHS.map((epoch, i) => (
          <motion.button
            key={epoch.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            onClick={() => setActiveEpoch(epoch.id === activeEpoch ? null : epoch.id)}
            className="w-full text-left p-3 rounded-lg border transition-all"
            style={{
              borderColor: activeEpoch === epoch.id ? `${epoch.color}40` : "color-mix(in oklch, var(--text-primary) 5%, transparent)",
              background: activeEpoch === epoch.id ? `${epoch.color}08` : "color-mix(in oklch, var(--text-primary) 2%, transparent)",
            }}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-md flex items-center justify-center shrink-0"
                style={{ background: `${epoch.color}15`, border: `1px solid ${epoch.color}25` }}>
                <Play size={14} style={{ color: epoch.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display text-xs font-bold tracking-wider" style={{ color: epoch.color }}>{epoch.title}</p>
                <p className="font-mono text-[8px] text-white/30 mt-0.5">{epoch.subtitle}</p>
                <p className="font-mono text-[9px] text-white/40 mt-1 line-clamp-2">{epoch.description}</p>
                <div className="flex gap-1 mt-2 flex-wrap">
                  {epoch.characters.map(c => (
                    <span key={c} className="font-mono text-[7px] px-1.5 py-0.5 rounded bg-white/5 text-white/30">{c}</span>
                  ))}
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

/* ─── MUSIC TAB ─── */
function MusicTab({ expandedAlbum, setExpandedAlbum }: { expandedAlbum: string | null; setExpandedAlbum: (s: string | null) => void }) {
  return (
    <div className="space-y-3">
      <p className="font-mono text-[9px] text-white/20 tracking-wider mb-2">MALKIA UKWELI & THE PANOPTICON // DECODED FREQUENCIES</p>

      {/* Spotify artist embed */}
      <div className="rounded-lg overflow-hidden border border-white/5">
        <iframe
          src="https://open.spotify.com/embed/artist/4yLE4pSEOGR4sPOlMCjfMa?utm_source=generator&theme=0"
          width="100%"
          height="152"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          className="border-0"
          title="Spotify Artist"
        />
      </div>

      {/* Album cards */}
      <div className="space-y-2">
        {ALBUMS.map((album, i) => (
          <motion.div
            key={album.slug}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <button
              onClick={() => setExpandedAlbum(expandedAlbum === album.slug ? null : album.slug)}
              className="w-full text-left p-3 rounded-lg border transition-all"
              style={{
                borderColor: expandedAlbum === album.slug ? `${album.color}30` : "color-mix(in oklch, var(--text-primary) 5%, transparent)",
                background: expandedAlbum === album.slug ? `${album.color}05` : "color-mix(in oklch, var(--text-primary) 2%, transparent)",
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md flex items-center justify-center shrink-0"
                  style={{ background: `${album.color}15`, border: `1px solid ${album.color}25` }}>
                  <Disc3 size={14} style={{ color: album.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-xs font-bold" style={{ color: album.color }}>{album.name}</p>
                  <p className="font-mono text-[8px] text-white/25">{album.tracks} tracks // {album.era}</p>
                </div>
                <ChevronDown size={12} className={`text-white/20 transition-transform ${expandedAlbum === album.slug ? "rotate-180" : ""}`} />
              </div>
            </button>

            {/* Expanded: Spotify embed + streaming links */}
            <AnimatePresence>
              {expandedAlbum === album.slug && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-2 space-y-2">
                    {album.spotify && (
                      <div className="rounded-lg overflow-hidden border border-white/5">
                        <iframe
                          src={`https://open.spotify.com/embed/album/${album.spotify.split("/").pop()}?utm_source=generator&theme=0`}
                          width="100%"
                          height="352"
                          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                          loading="lazy"
                          className="border-0"
                          title={album.name}
                        />
                      </div>
                    )}
                    <div className="flex gap-2">
                      {album.spotify && (
                        <a href={album.spotify} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full void-bg-success border void-border-success font-mono text-[9px] void-text-energy void-bg-success transition-colors">
                          <ExternalLink size={8} /> Spotify
                        </a>
                      )}
                      {album.apple && (
                        <a href={album.apple} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full void-bg-error border void-border-error font-mono text-[9px] void-text-error void-bg-error transition-colors">
                          <ExternalLink size={8} /> Apple Music
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─── FEED TAB (DOOM SCROLL) ─── */
function FeedTab() {
  return (
    <div className="space-y-1.5">
      <p className="font-mono text-[9px] text-white/20 tracking-wider mb-3">INTERCEPTED SIGNALS // CHRONOLOGICAL DESCENT</p>

      {TRANSMISSIONS.map((t, i) => {
        const classColor = t.classification === "OPEN" ? "void-text-energy void-border-success" :
          t.classification === "ENCRYPTED" ? "void-text-accent void-border" :
          t.classification === "CORRUPTED" ? "void-text-error void-border-error" :
          "text-white/20 border-white/10";

        const typeIcon = t.type === "npc" ? <MessageCircle size={8} /> :
          t.type === "log" ? <BookOpen size={8} /> :
          t.type === "music" ? <Music size={8} /> :
          <AlertTriangle size={8} />;

        return (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="p-3 void-surface transition-all"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span style={{ color: t.sourceColor }}>{typeIcon}</span>
                <span className="font-mono text-[9px] font-bold" style={{ color: t.sourceColor }}>{t.source}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`font-mono text-[7px] px-1.5 py-0.5 rounded border ${classColor}`}>
                  {t.classification}
                </span>
                <span className="font-mono text-[7px] text-white/15">{t.timestamp}</span>
              </div>
            </div>

            {/* Body */}
            <p className={`font-mono text-[10px] leading-relaxed ${
              t.classification === "CORRUPTED" ? "text-white/50" :
              t.classification === "REDACTED" ? "text-white/40 italic" :
              "text-white/60"
            }`}>
              {t.text}
            </p>
          </motion.div>
        );
      })}

      {/* End marker */}
      <div className="py-6 text-center">
        <div className="h-px w-12 mx-auto bg-gradient-to-r from-transparent via-white/5 to-transparent mb-3" />
        <p className="font-mono text-[7px] text-white/10 tracking-[0.3em]">END OF INTERCEPTED SIGNALS</p>
        <p className="font-mono text-[7px] text-white/5 tracking-wider mt-1">THE PANOPTICON IS LISTENING</p>
      </div>
    </div>
  );
}

/* ─── MINI BAR (collapsed state) ─── */
export function TransmissionMiniBar({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      className="w-full flex items-center gap-2 px-4 py-2 bg-black/80 border-t border-white/5"
      whileTap={{ scale: 0.98 }}
    >
      <Radio size={12} className="void-text-accent animate-pulse" />
      <span className="font-mono text-[9px] text-white/30 tracking-wider flex-1 text-left">
        TRANSMISSIONS AVAILABLE
      </span>
      <ChevronUp size={12} className="text-white/15" />
    </motion.button>
  );
}

/* ─── INBOX TAB ───
   Lists pending + skipped + watched login transmissions (Dischordian
   Logic T01-T09 → unlocked TV episodes), pulled from the unified
   server queue. Watching from inbox grants the same completion point
   as the on-login modal flow. */
function InboxTab() {
  const { isAuthenticated } = useAuth();
  const playerCtx = usePlayerContext();
  const player = usePlayer();
  const acceptAlbum = trpc.transmissions.acceptAlbumTransmission.useMutation();
  const recordWatched = trpc.transmissions.recordWatched.useMutation();
  const utils = trpc.useUtils();
  const inboxQuery = trpc.transmissions.getLoginTransmissionInbox.useQuery(
    { playerContext: playerCtx },
    { enabled: isAuthenticated, staleTime: 15_000 },
  );

  const data = inboxQuery.data;
  const pending = data?.pending ?? [];
  const skipped = data?.skipped ?? [];
  const watched = data?.watched ?? [];

  const playAlbum = (row: { trackId: string | null; title: string; audioUrl: string | null }) => {
    if (!row.trackId || !row.audioUrl) return;
    const synth: LoredexEntry = {
      id: `album1_${row.trackId.toLowerCase()}`,
      type: "song",
      name: row.title,
      audio_url: row.audioUrl,
      album: "Dischordian Logic",
    };
    player.playSong(synth);
    // Mark accepted (not yet completed). Completion landing inside the
    // global PlayerContext will be picked up by useLoginAlbumTransmission's
    // existing watcher whenever it next mounts; for inbox-driven plays
    // we record completion here when the song actually ends.
    acceptAlbum.mutate({
      trackId: row.trackId as "T01" | "T02" | "T03" | "T04" | "T05" | "T06" | "T07" | "T08" | "T09",
      completed: false,
    });
  };

  const recordTvWatched = (row: {
    kind: string;
    id: string;
    reward: { xp: number; dream: number; achievement?: string };
    relatedLoredexEntries?: string[];
  }) => {
    const transmissionId = row.id.startsWith("tv:") ? row.id.slice(3) : row.id;
    recordWatched.mutate(
      {
        transmissionId,
        xp: row.reward.xp,
        dream: row.reward.dream,
        achievement: row.reward.achievement,
        loredexEntries: row.relatedLoredexEntries ?? [],
      },
      { onSuccess: () => utils.transmissions.getLoginTransmissionInbox.invalidate() },
    );
  };

  const replayOpening = () => {
    clearOpeningSeen();
    window.location.assign("/");
  };

  if (!isAuthenticated) {
    return (
      <div className="px-4 py-12 text-center font-mono text-xs text-white/30">
        ▸ Sign in to receive your queued transmissions.
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-8">
      <p className="font-mono text-[9px] text-white/20 tracking-wider mb-1 px-1">
        ▸ INBOX // {pending.length} PENDING · {watched.length} WATCHED
      </p>

      <button
        onClick={replayOpening}
        className="w-full flex items-center gap-3 px-3 py-2 border border-white/10 hover:border-emerald-500/40 hover:bg-emerald-900/10 rounded text-left transition-colors"
      >
        <RotateCcw size={14} className="text-emerald-400/80" />
        <div className="flex-1">
          <div className="font-mono text-xs uppercase tracking-widest text-emerald-200">
            Replay Opening Cinematic
          </div>
          <div className="font-mono text-[10px] text-white/30 mt-0.5">
            The Meme's first transmission · 3:09
          </div>
        </div>
      </button>

      {pending.length > 0 && (
        <section className="space-y-1.5">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-emerald-300/60 px-1">
            ▸ Pending
          </div>
          {pending.map((row) => (
            <InboxRow
              key={row.id}
              row={row}
              status="pending"
              onWatch={() => (row.kind === "album" ? playAlbum(row) : recordTvWatched(row))}
            />
          ))}
        </section>
      )}

      {skipped.length > 0 && (
        <section className="space-y-1.5">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-400/50 px-1">
            ▸ Skipped · Watch later
          </div>
          {skipped.map((row) => (
            <InboxRow
              key={row.id}
              row={row}
              status="skipped"
              onWatch={() => (row.kind === "album" ? playAlbum(row) : recordTvWatched(row))}
            />
          ))}
        </section>
      )}

      {watched.length > 0 && (
        <section className="space-y-1.5">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/30 px-1">
            ▸ Watched · {watched.length}
          </div>
          {watched.map((row) => (
            <InboxRow key={row.id} row={row} status="watched" onWatch={() => {}} />
          ))}
        </section>
      )}

      {pending.length === 0 && skipped.length === 0 && watched.length === 0 && (
        <div className="px-4 py-12 text-center font-mono text-xs text-white/30">
          ▸ No transmissions waiting. The Meme's frequency is quiet.
        </div>
      )}
    </div>
  );
}

interface InboxRowData {
  kind: "album" | "tv";
  id: string;
  trackId: string | null;
  title: string;
  audioUrl: string | null;
  videoUrl: string | null;
  driveFileId: string | null;
  durationMs: number;
  lengthSeconds: number;
  reward: { xp: number; dream: number; achievement?: string };
}

function InboxRow({
  row,
  status,
  onWatch,
}: {
  row: InboxRowData;
  status: "pending" | "skipped" | "watched";
  onWatch: () => void;
}) {
  const minutes = Math.floor(row.lengthSeconds / 60);
  const seconds = row.lengthSeconds % 60;
  const length = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  const Icon = row.kind === "album" ? Disc3 : Tv;
  const label = row.kind === "album" ? `T${(row.trackId ?? "").slice(1)}` : "EPISODE";
  return (
    <div
      className={`flex items-center gap-3 px-3 py-2 border rounded ${
        status === "pending"
          ? "border-emerald-500/30 bg-emerald-900/10"
          : status === "skipped"
            ? "border-amber-400/20 bg-amber-900/5"
            : "border-white/10 bg-black/40"
      }`}
    >
      <Icon size={14} className={status === "watched" ? "text-white/30" : "text-emerald-300"} />
      <div className="flex-1 min-w-0">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
          {label} · {length}
        </div>
        <div className="font-serif text-sm text-emerald-50 truncate">{row.title}</div>
      </div>
      {status === "watched" ? (
        <CheckCircle2 size={14} className="text-emerald-500/70" />
      ) : (
        <button
          onClick={onWatch}
          className="flex items-center gap-1 px-3 py-1 bg-emerald-700 hover:bg-emerald-600 text-black font-mono uppercase tracking-widest text-[10px] rounded"
        >
          <Play size={10} />
          Watch
        </button>
      )}
      <div className="font-mono text-[9px] text-white/30 hidden sm:block">
        +{row.reward.xp} XP · +{row.reward.dream} 𝔇
      </div>
    </div>
  );
}
