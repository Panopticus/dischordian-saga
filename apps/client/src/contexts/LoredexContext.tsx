import { createContext, useContext, useState, useMemo, type ReactNode } from "react";
import loredexData from "../data/loredex-data.json";

export interface SongAppearance {
  song: string;
  album: string;
  music_video?: Record<string, string>;
}

export interface LoredexEntry {
  id: string;
  type: string;
  name: string;
  aliases?: string[];
  era?: string;
  date_aa?: string;
  date_ad?: string;
  date_in_saga?: string;
  season?: string;
  affiliation?: string;
  status?: string;
  bio?: string;
  history?: string;
  connections?: string[];
  conexus_stories?: string[];
  song_appearances?: SongAppearance[];
  image?: string;
  priority?: string;
  streaming_links?: Record<string, string>;
  // Song-specific
  album?: string;
  track_number?: number;
  release_date?: string;
  release_year?: string;
  artist?: string;
  characters_featured?: string[];
  music_video?: Record<string, string>;
  audio_url?: string;
  reveal_video?: string;
}

export interface Relationship {
  source: string;
  target: string;
  relationship_type: string;
  type?: string;
  source_type?: string;
  album?: string;
}

export interface EpisodeInfo {
  title: string;
  video_count?: number;
  playlist_id?: string;
  description?: string;
  characters?: string[];
  [key: string]: unknown;
}

interface LoredexContextType {
  entries: LoredexEntry[];
  relationships: Relationship[];
  musicVideos: Record<string, Record<string, string>>;
  stats: Record<string, number>;
  // Lookups
  getEntry: (name: string) => LoredexEntry | undefined;
  getEntryById: (id: string) => LoredexEntry | undefined;
  getRelated: (name: string) => LoredexEntry[];
  search: (query: string) => LoredexEntry[];
  getByType: (type: string) => LoredexEntry[];
  getByAlbum: (album: string) => LoredexEntry[];
  getSongsForCharacter: (name: string) => LoredexEntry[];
  // New: alias resolution
  resolveAlias: (nameOrAlias: string) => LoredexEntry | undefined;
  getAliases: (name: string) => string[];
  // New: episodes & stories
  episodes: Record<string, (EpisodeInfo | string)[]>;
  // New: album-level streaming links
  albumStreamingLinks: Record<string, Record<string, string>>;
  // New: song-character map
  songCharacterMap: Record<string, string[]>;
  // Discovery
  discoveredIds: Set<string>;
  discoverEntry: (id: string) => void;
  discoveryProgress: number;
}

const LoredexContext = createContext<LoredexContextType | null>(null);

export function LoredexProvider({ children }: { children: ReactNode }) {
  const [discoveredIds, setDiscoveredIds] = useState<Set<string>>(() => {
    const saved = localStorage.getItem("loredex_discovered");
    return saved ? new Set(JSON.parse(saved)) : new Set<string>();
  });

  const entries = loredexData.entries as LoredexEntry[];
  const relationships = loredexData.relationships as Relationship[];
  const musicVideos = (loredexData.music_videos || {}) as Record<string, Record<string, string>>;
  const stats = loredexData.stats as Record<string, number>;
  const episodes = (loredexData.episodes || {}) as Record<string, (EpisodeInfo | string)[]>;
  const albumStreamingLinks = (loredexData.streaming_links || {}) as Record<string, Record<string, string>>;
  const songCharacterMap = (loredexData.song_character_map || {}) as Record<string, string[]>;

  // Build alias map: alias -> canonical name
  const aliasMap = useMemo(() => {
    const map = new Map<string, string>();
    const rawAliases = (loredexData as Record<string, unknown>).aliases as Record<string, string[]> | undefined;
    if (rawAliases) {
      Object.entries(rawAliases).forEach(([canonical, aliasList]) => {
        aliasList.forEach(alias => {
          map.set(alias.toLowerCase(), canonical);
        });
      });
    }
    // Also add per-entry aliases
    entries.forEach(e => {
      if (e.aliases) {
        e.aliases.forEach(alias => {
          map.set(alias.toLowerCase(), e.name);
        });
      }
    });
    return map;
  }, [entries]);

  // Build entry map: name/id/alias -> entry
  const entryMap = useMemo(() => {
    const map = new Map<string, LoredexEntry>();
    entries.forEach((e) => {
      map.set(e.name.toLowerCase(), e);
      map.set(e.id, e);
    });
    return map;
  }, [entries]);

  const getEntry = (name: string) => {
    const direct = entryMap.get(name.toLowerCase());
    if (direct) return direct;
    // Try alias resolution
    const canonical = aliasMap.get(name.toLowerCase());
    if (canonical) return entryMap.get(canonical.toLowerCase());
    return undefined;
  };

  const getEntryById = (id: string) => entryMap.get(id);

  const resolveAlias = (nameOrAlias: string): LoredexEntry | undefined => {
    return getEntry(nameOrAlias);
  };

  const getAliases = (name: string): string[] => {
    const rawAliases = (loredexData as Record<string, unknown>).aliases as Record<string, string[]> | undefined;
    if (rawAliases && rawAliases[name]) return rawAliases[name];
    const entry = getEntry(name);
    if (entry?.aliases) return entry.aliases;
    return [];
  };

  const getRelated = (name: string): LoredexEntry[] => {
    const related = new Set<string>();
    const lowerName = name.toLowerCase();
    relationships.forEach((r) => {
      if (r.source.toLowerCase() === lowerName) related.add(r.target);
      if (r.target.toLowerCase() === lowerName) related.add(r.source);
    });
    return Array.from(related)
      .map((n) => entryMap.get(n.toLowerCase()))
      .filter(Boolean) as LoredexEntry[];
  };

  const search = (query: string): LoredexEntry[] => {
    const q = query.toLowerCase().trim();
    if (!q) return [];

    // Check alias match first
    const aliasMatch = aliasMap.get(q);
    const aliasEntry = aliasMatch ? entryMap.get(aliasMatch.toLowerCase()) : undefined;

    const results = entries.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        (e.bio && e.bio.toLowerCase().includes(q)) ||
        (e.era && e.era.toLowerCase().includes(q)) ||
        (e.album && e.album.toLowerCase().includes(q)) ||
        (e.affiliation && e.affiliation.toLowerCase().includes(q)) ||
        (e.aliases && e.aliases.some(a => a.toLowerCase().includes(q))) ||
        (e.history && e.history.toLowerCase().includes(q))
    );

    // If alias matched an entry not already in results, prepend it
    if (aliasEntry && !results.find(r => r.id === aliasEntry.id)) {
      results.unshift(aliasEntry);
    }

    return results;
  };

  const getByType = (type: string) => entries.filter((e) => e.type === type);
  const getByAlbum = (album: string) =>
    entries
      .filter((e) => e.type === "song" && e.album === album)
      .sort((a, b) => (a.track_number || 0) - (b.track_number || 0));

  const getSongsForCharacter = (name: string): LoredexEntry[] => {
    const lowerName = name.toLowerCase();
    // Check song_character_map first for broader coverage
    const fromMap = Object.entries(songCharacterMap)
      .filter(([, chars]) => chars.some(c => c.toLowerCase() === lowerName))
      .map(([songName]) => entries.find(e => e.type === "song" && e.name === songName))
      .filter(Boolean) as LoredexEntry[];

    // Also check characters_featured on entries
    const fromEntries = entries.filter(
      (e) =>
        e.type === "song" &&
        e.characters_featured?.some(
          (c) => c.toLowerCase() === lowerName
        )
    );

    // Merge and deduplicate
    const seen = new Set<string>();
    const merged: LoredexEntry[] = [];
    [...fromMap, ...fromEntries].forEach(e => {
      if (!seen.has(e.id)) {
        seen.add(e.id);
        merged.push(e);
      }
    });
    return merged;
  };

  const discoverEntry = (id: string) => {
    setDiscoveredIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      localStorage.setItem("loredex_discovered", JSON.stringify(Array.from(next)));
      return next;
    });
  };

  const discoveryProgress = entries.length > 0 ? (discoveredIds.size / entries.length) * 100 : 0;

  return (
    <LoredexContext.Provider
      value={{
        entries,
        relationships,
        musicVideos,
        stats,
        getEntry,
        getEntryById,
        getRelated,
        search,
        getByType,
        getByAlbum,
        getSongsForCharacter,
        resolveAlias,
        getAliases,
        episodes,
        albumStreamingLinks,
        songCharacterMap,
        discoveredIds,
        discoverEntry,
        discoveryProgress,
      }}
    >
      {children}
    </LoredexContext.Provider>
  );
}

export function useLoredex() {
  const ctx = useContext(LoredexContext);
  if (!ctx) throw new Error("useLoredex must be used within LoredexProvider");
  return ctx;
}
