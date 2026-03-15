/* ═══════════════════════════════════════════════════════
   MISSION BRIEFING — User favorites, playlists, and
   personalized recommendations based on exploration.
   ═══════════════════════════════════════════════════════ */
import { useState, useMemo, useCallback } from "react";
import { Link } from "wouter";
import { useLoredex, type LoredexEntry } from "@/contexts/LoredexContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { useGamification } from "@/contexts/GamificationContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star, Heart, Play, Music, Users, MapPin, Swords, Eye,
  Tv, Disc3, ChevronRight, Trash2, Plus, Shuffle, ListMusic,
  Bookmark, Clock, Zap, Shield, ArrowRight
} from "lucide-react";

/* ─── LOCAL STORAGE HELPERS ─── */
const FAVORITES_KEY = "loredex-favorites";
const PLAYLISTS_KEY = "loredex-playlists";

interface UserPlaylist {
  id: string;
  name: string;
  description?: string;
  songIds: string[];
  createdAt: number;
}

function getFavorites(): string[] {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
  } catch {
    return [];
  }
}

function setFavorites(ids: string[]) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
}

function getPlaylists(): UserPlaylist[] {
  try {
    return JSON.parse(localStorage.getItem(PLAYLISTS_KEY) || "[]");
  } catch {
    return [];
  }
}

function savePlaylists(playlists: UserPlaylist[]) {
  localStorage.setItem(PLAYLISTS_KEY, JSON.stringify(playlists));
}

/* ─── HOOKS ─── */
export function useFavorites() {
  const [favorites, setFavoritesState] = useState<string[]>(getFavorites);

  const toggleFavorite = useCallback((id: string) => {
    setFavoritesState((prev) => {
      const next = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id];
      setFavorites(next);
      return next;
    });
  }, []);

  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);

  return { favorites, toggleFavorite, isFavorite };
}

export function useUserPlaylists() {
  const [playlists, setPlaylistsState] = useState<UserPlaylist[]>(getPlaylists);

  const createPlaylist = useCallback((name: string, description?: string) => {
    const newPlaylist: UserPlaylist = {
      id: `pl-${Date.now()}`,
      name,
      description,
      songIds: [],
      createdAt: Date.now(),
    };
    setPlaylistsState((prev) => {
      const next = [...prev, newPlaylist];
      savePlaylists(next);
      return next;
    });
    return newPlaylist;
  }, []);

  const addToPlaylist = useCallback((playlistId: string, songId: string) => {
    setPlaylistsState((prev) => {
      const next = prev.map((p) =>
        p.id === playlistId && !p.songIds.includes(songId)
          ? { ...p, songIds: [...p.songIds, songId] }
          : p
      );
      savePlaylists(next);
      return next;
    });
  }, []);

  const removeFromPlaylist = useCallback((playlistId: string, songId: string) => {
    setPlaylistsState((prev) => {
      const next = prev.map((p) =>
        p.id === playlistId ? { ...p, songIds: p.songIds.filter((s) => s !== songId) } : p
      );
      savePlaylists(next);
      return next;
    });
  }, []);

  const deletePlaylist = useCallback((playlistId: string) => {
    setPlaylistsState((prev) => {
      const next = prev.filter((p) => p.id !== playlistId);
      savePlaylists(next);
      return next;
    });
  }, []);

  return { playlists, createPlaylist, addToPlaylist, removeFromPlaylist, deletePlaylist };
}

/* ─── TYPE HELPERS ─── */
const TYPE_ICONS: Record<string, typeof Users> = {
  character: Users,
  location: MapPin,
  faction: Swords,
  song: Music,
  concept: Eye,
};

const TYPE_COLORS: Record<string, string> = {
  character: "text-[var(--neon-cyan)]",
  location: "text-[var(--neon-amber)]",
  faction: "text-[var(--neon-red)]",
  song: "text-destructive",
  concept: "text-[var(--orb-orange)]",
};

type TabType = "favorites" | "playlists" | "recommended";

/* ═══ MAIN COMPONENT ═══ */
export default function FavoritesPage() {
  const { entries, getEntryById, getByAlbum, stats } = useLoredex();
  const { playSong, setQueue } = usePlayer();
  const gamification = useGamification();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { playlists, createPlaylist, addToPlaylist, removeFromPlaylist, deletePlaylist } = useUserPlaylists();
  const [activeTab, setActiveTab] = useState<TabType>("favorites");
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);

  // Resolve favorite entries
  const favoriteEntries = useMemo(() => {
    return favorites.map((id) => getEntryById(id)).filter(Boolean) as LoredexEntry[];
  }, [favorites, getEntryById]);

  const favoriteSongs = favoriteEntries.filter((e) => e.type === "song");
  const favoriteCharacters = favoriteEntries.filter((e) => e.type === "character");
  const favoriteOther = favoriteEntries.filter((e) => e.type !== "song" && e.type !== "character");

  // Recommendations based on what user has discovered
  const recommendations = useMemo(() => {
    const discovered = new Set(gamification.progress?.discoveredEntries || []);
    const favNames = new Set(favoriteEntries.map((e) => e.name));

    // Find entries connected to favorites but not yet discovered
    const recs: LoredexEntry[] = [];
    const seen = new Set<string>();

    entries.forEach((entry) => {
      if (discovered.has(entry.id) || favNames.has(entry.name) || seen.has(entry.id)) return;
      // Check if this entry shares connections with any favorite
      const isRelated = favoriteEntries.some((fav) => {
        if (fav.type === "song" && entry.type === "song" && fav.album === entry.album) return true;
        if (fav.affiliation && entry.affiliation === fav.affiliation) return true;
        if (fav.era && entry.era === fav.era) return true;
        return false;
      });
      if (isRelated) {
        recs.push(entry);
        seen.add(entry.id);
      }
    });

    return recs.slice(0, 12);
  }, [entries, favoriteEntries, gamification.progress]);

  const handleCreatePlaylist = () => {
    if (!newPlaylistName.trim()) return;
    createPlaylist(newPlaylistName.trim());
    setNewPlaylistName("");
    setShowCreateForm(false);
  };

  const playPlaylist = (playlist: UserPlaylist, shuffle = false) => {
    const songs = playlist.songIds.map((id) => getEntryById(id)).filter(Boolean) as LoredexEntry[];
    if (songs.length === 0) return;
    const ordered = shuffle ? [...songs].sort(() => Math.random() - 0.5) : songs;
    setQueue(ordered);
    playSong(ordered[0]);
  };

  const playAllFavorites = (shuffle = false) => {
    if (favoriteSongs.length === 0) return;
    const ordered = shuffle ? [...favoriteSongs].sort(() => Math.random() - 0.5) : favoriteSongs;
    setQueue(ordered);
    playSong(ordered[0]);
  };

  return (
    <div className="animate-fade-in pb-8">
      {/* Header */}
      <div className="px-4 sm:px-6 pt-4 pb-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-px flex-1 max-w-8 bg-gradient-to-r from-transparent to-primary/50" />
          <span className="font-mono text-[10px] text-primary/70 tracking-[0.3em]">PERSONAL // CLASSIFIED</span>
          <div className="h-px flex-1 max-w-8 bg-gradient-to-l from-transparent to-primary/50" />
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-black tracking-wider text-foreground mb-2">
          MISSION <span className="text-accent glow-amber">BRIEFING</span>
        </h1>
        <p className="font-mono text-xs text-muted-foreground max-w-2xl">
          Your personal collection of bookmarked entities, custom playlists, and AI-recommended discoveries.
        </p>
      </div>

      {/* Tabs */}
      <div className="px-4 sm:px-6 mb-4">
        <div className="flex gap-1.5">
          {[
            { key: "favorites" as TabType, label: "FAVORITES", icon: Heart, count: favorites.length },
            { key: "playlists" as TabType, label: "PLAYLISTS", icon: ListMusic, count: playlists.length },
            { key: "recommended" as TabType, label: "RECOMMENDED", icon: Zap, count: recommendations.length },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-mono tracking-wider border transition-all ${
                  activeTab === tab.key
                    ? "bg-primary/10 border-primary/40 text-primary"
                    : "bg-secondary/30 border-border/30 text-muted-foreground hover:border-primary/20"
                }`}
              >
                <Icon size={10} />
                {tab.label}
                <span className="text-[9px] opacity-60">({tab.count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══ FAVORITES TAB ═══ */}
      {activeTab === "favorites" && (
        <div className="px-4 sm:px-6 space-y-6">
          {favorites.length === 0 ? (
            <div className="text-center py-12 border border-border/20 rounded-lg bg-card/20">
              <Heart size={32} className="mx-auto text-muted-foreground/30 mb-3" />
              <p className="font-display text-sm font-bold text-muted-foreground mb-1">NO FAVORITES YET</p>
              <p className="font-mono text-xs text-muted-foreground/50 max-w-sm mx-auto">
                Bookmark characters, songs, locations, and factions from their dossier pages to build your personal collection.
              </p>
              <Link
                href="/search"
                className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 rounded-md text-xs font-mono bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-all"
              >
                EXPLORE DATABASE <ArrowRight size={11} />
              </Link>
            </div>
          ) : (
            <>
              {/* Favorite Songs */}
              {favoriteSongs.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="font-display text-xs font-bold tracking-[0.2em] text-destructive flex items-center gap-2">
                      <Music size={13} /> SONGS ({favoriteSongs.length})
                    </h2>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => playAllFavorites(true)}
                        className="flex items-center gap-1 px-2 py-1 rounded text-[9px] font-mono text-muted-foreground border border-border/30 hover:border-primary/30 hover:text-primary transition-all"
                      >
                        <Shuffle size={9} /> SHUFFLE
                      </button>
                      <button
                        onClick={() => playAllFavorites(false)}
                        className="flex items-center gap-1 px-2 py-1 rounded text-[9px] font-mono text-primary border border-primary/30 hover:bg-primary/10 transition-all"
                      >
                        <Play size={9} /> PLAY ALL
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {favoriteSongs.map((song, i) => (
                      <motion.div
                        key={song.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="flex items-center gap-3 p-2 rounded-md border border-border/15 hover:bg-secondary/20 group transition-all"
                      >
                        <button
                          onClick={() => {
                            setQueue(favoriteSongs);
                            playSong(song);
                          }}
                          className="shrink-0"
                        >
                          {song.image ? (
                            <img src={song.image} alt="" className="w-9 h-9 rounded object-cover ring-1 ring-border/20" />
                          ) : (
                            <div className="w-9 h-9 rounded bg-secondary flex items-center justify-center">
                              <Music size={14} className="text-muted-foreground" />
                            </div>
                          )}
                        </button>
                        <div className="min-w-0 flex-1">
                          <Link href={`/song/${song.id}`} className="text-xs font-medium truncate block hover:text-primary transition-colors">
                            {song.name}
                          </Link>
                          <p className="text-[10px] font-mono text-muted-foreground/50 truncate">{song.album}</p>
                        </div>
                        <button
                          onClick={() => toggleFavorite(song.id)}
                          className="shrink-0 p-1 text-destructive/60 hover:text-destructive transition-colors"
                        >
                          <Heart size={12} fill="currentColor" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}

              {/* Favorite Characters */}
              {favoriteCharacters.length > 0 && (
                <section>
                  <h2 className="font-display text-xs font-bold tracking-[0.2em] text-[var(--neon-cyan)] mb-3 flex items-center gap-2">
                    <Users size={13} /> CHARACTERS ({favoriteCharacters.length})
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {favoriteCharacters.map((char, i) => (
                      <motion.div
                        key={char.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                      >
                        <Link
                          href={`/entity/${char.id}`}
                          className="group block rounded-lg border border-border/20 bg-card/20 overflow-hidden hover:border-primary/20 transition-all"
                        >
                          <div className="aspect-square overflow-hidden relative">
                            {char.image ? (
                              <img src={char.image} alt={char.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                            ) : (
                              <div className="w-full h-full bg-secondary flex items-center justify-center">
                                <Users size={24} className="text-muted-foreground" />
                              </div>
                            )}
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleFavorite(char.id);
                              }}
                              className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/50 text-destructive hover:bg-black/70 transition-all"
                            >
                              <Heart size={10} fill="currentColor" />
                            </button>
                          </div>
                          <div className="p-2">
                            <p className="font-mono text-xs font-semibold truncate group-hover:text-primary transition-colors">{char.name}</p>
                            <p className="font-mono text-[9px] text-muted-foreground/50 truncate">{char.era || char.affiliation || ""}</p>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </section>
              )}

              {/* Other Favorites */}
              {favoriteOther.length > 0 && (
                <section>
                  <h2 className="font-display text-xs font-bold tracking-[0.2em] text-muted-foreground mb-3 flex items-center gap-2">
                    <Bookmark size={13} /> OTHER ({favoriteOther.length})
                  </h2>
                  <div className="space-y-1">
                    {favoriteOther.map((entry) => {
                      const Icon = TYPE_ICONS[entry.type] || Eye;
                      const color = TYPE_COLORS[entry.type] || "text-foreground";
                      return (
                        <Link
                          key={entry.id}
                          href={`/entity/${entry.id}`}
                          className="flex items-center gap-3 p-2 rounded-md border border-border/15 hover:bg-secondary/20 group transition-all"
                        >
                          <div className={`p-1.5 rounded ${color}`}>
                            <Icon size={14} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium truncate group-hover:text-primary transition-colors">{entry.name}</p>
                            <p className="text-[10px] font-mono text-muted-foreground/50">{entry.type}</p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleFavorite(entry.id);
                            }}
                            className="shrink-0 p-1 text-destructive/60 hover:text-destructive transition-colors"
                          >
                            <Heart size={12} fill="currentColor" />
                          </button>
                        </Link>
                      );
                    })}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      )}

      {/* ═══ PLAYLISTS TAB ═══ */}
      {activeTab === "playlists" && (
        <div className="px-4 sm:px-6 space-y-4">
          {/* Create Playlist */}
          <div>
            {showCreateForm ? (
              <div className="flex items-center gap-2 p-3 rounded-lg border border-primary/30 bg-primary/5">
                <input
                  type="text"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreatePlaylist()}
                  placeholder="Playlist name..."
                  className="flex-1 bg-transparent border-none text-sm font-mono text-foreground placeholder:text-muted-foreground/30 focus:outline-none"
                  autoFocus
                />
                <button
                  onClick={handleCreatePlaylist}
                  className="px-3 py-1 rounded text-[10px] font-mono bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 transition-all"
                >
                  CREATE
                </button>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="px-2 py-1 rounded text-[10px] font-mono text-muted-foreground hover:text-foreground transition-colors"
                >
                  CANCEL
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowCreateForm(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-border/30 text-xs font-mono text-muted-foreground hover:border-primary/30 hover:text-primary w-full transition-all"
              >
                <Plus size={14} /> CREATE NEW PLAYLIST
              </button>
            )}
          </div>

          {playlists.length === 0 && !showCreateForm ? (
            <div className="text-center py-12 border border-border/20 rounded-lg bg-card/20">
              <ListMusic size={32} className="mx-auto text-muted-foreground/30 mb-3" />
              <p className="font-display text-sm font-bold text-muted-foreground mb-1">NO PLAYLISTS YET</p>
              <p className="font-mono text-xs text-muted-foreground/50">
                Create custom playlists to organize your favorite tracks from the Dischordian Saga.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {playlists.map((playlist) => {
                const songs = playlist.songIds.map((id) => getEntryById(id)).filter(Boolean) as LoredexEntry[];
                const isExpanded = selectedPlaylist === playlist.id;

                return (
                  <div key={playlist.id} className="rounded-lg border border-border/20 bg-card/20 overflow-hidden">
                    <button
                      onClick={() => setSelectedPlaylist(isExpanded ? null : playlist.id)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-secondary/20 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-md bg-accent/10 flex items-center justify-center shrink-0">
                        <ListMusic size={18} className="text-accent" />
                      </div>
                      <div className="min-w-0 flex-1 text-left">
                        <p className="font-display text-xs font-bold tracking-wide">{playlist.name}</p>
                        <p className="font-mono text-[10px] text-muted-foreground/50">{songs.length} tracks</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {songs.length > 0 && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                playPlaylist(playlist, true);
                              }}
                              className="p-1.5 rounded text-muted-foreground hover:text-primary transition-colors"
                            >
                              <Shuffle size={12} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                playPlaylist(playlist);
                              }}
                              className="p-1.5 rounded text-primary hover:text-primary/80 transition-colors"
                            >
                              <Play size={12} />
                            </button>
                          </>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deletePlaylist(playlist.id);
                          }}
                          className="p-1.5 rounded text-muted-foreground/30 hover:text-destructive transition-colors"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: "auto" }}
                          exit={{ height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-border/10 p-2 space-y-0.5">
                            {songs.length === 0 ? (
                              <p className="text-center py-4 font-mono text-[10px] text-muted-foreground/40">
                                No tracks yet. Add songs from their dossier pages.
                              </p>
                            ) : (
                              songs.map((song) => (
                                <div
                                  key={song.id}
                                  className="flex items-center gap-2 p-1.5 rounded hover:bg-secondary/20 transition-colors"
                                >
                                  <button
                                    onClick={() => {
                                      setQueue(songs);
                                      playSong(song);
                                    }}
                                    className="shrink-0"
                                  >
                                    {song.image ? (
                                      <img src={song.image} alt="" className="w-7 h-7 rounded object-cover" />
                                    ) : (
                                      <div className="w-7 h-7 rounded bg-secondary flex items-center justify-center">
                                        <Music size={10} />
                                      </div>
                                    )}
                                  </button>
                                  <Link href={`/song/${song.id}`} className="text-[11px] font-medium truncate flex-1 hover:text-primary transition-colors">
                                    {song.name}
                                  </Link>
                                  <button
                                    onClick={() => removeFromPlaylist(playlist.id, song.id)}
                                    className="shrink-0 p-1 text-muted-foreground/30 hover:text-destructive transition-colors"
                                  >
                                    <Trash2 size={10} />
                                  </button>
                                </div>
                              ))
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ═══ RECOMMENDED TAB ═══ */}
      {activeTab === "recommended" && (
        <div className="px-4 sm:px-6 space-y-4">
          {recommendations.length === 0 ? (
            <div className="text-center py-12 border border-border/20 rounded-lg bg-card/20">
              <Zap size={32} className="mx-auto text-muted-foreground/30 mb-3" />
              <p className="font-display text-sm font-bold text-muted-foreground mb-1">EXPLORING...</p>
              <p className="font-mono text-xs text-muted-foreground/50 max-w-sm mx-auto">
                Discover more entries and add favorites to get personalized recommendations based on your exploration patterns.
              </p>
            </div>
          ) : (
            <>
              <p className="font-mono text-[10px] text-muted-foreground/50">
                BASED ON YOUR FAVORITES AND EXPLORATION PATTERNS // {recommendations.length} MATCHES
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {recommendations.map((entry, i) => {
                  const Icon = TYPE_ICONS[entry.type] || Eye;
                  const color = TYPE_COLORS[entry.type] || "text-foreground";
                  return (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <Link
                        href={entry.type === "song" ? `/song/${entry.id}` : `/entity/${entry.id}`}
                        className="flex items-center gap-3 p-3 rounded-lg border border-border/20 bg-card/20 hover:bg-card/40 hover:border-primary/20 group transition-all"
                      >
                        {entry.image ? (
                          <img src={entry.image} alt="" className="w-10 h-10 rounded-md object-cover ring-1 ring-border/20 shrink-0" loading="lazy" />
                        ) : (
                          <div className={`w-10 h-10 rounded-md bg-secondary flex items-center justify-center shrink-0 ${color}`}>
                            <Icon size={16} />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium truncate group-hover:text-primary transition-colors">{entry.name}</p>
                          <p className="text-[10px] font-mono text-muted-foreground/50 truncate">{entry.type} {entry.era ? `// ${entry.era}` : ""}</p>
                        </div>
                        <ChevronRight size={12} className="text-muted-foreground/20 group-hover:text-primary/50 shrink-0 transition-colors" />
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
