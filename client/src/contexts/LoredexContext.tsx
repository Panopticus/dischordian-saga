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
  artist?: string;
  characters_featured?: string[];
  music_video?: Record<string, string>;
}

export interface Relationship {
  source: string;
  target: string;
  type: string;
  album?: string;
}

interface LoredexContextType {
  entries: LoredexEntry[];
  relationships: Relationship[];
  musicVideos: Record<string, Record<string, string>>;
  stats: Record<string, number>;
  getEntry: (name: string) => LoredexEntry | undefined;
  getEntryById: (id: string) => LoredexEntry | undefined;
  getRelated: (name: string) => LoredexEntry[];
  search: (query: string) => LoredexEntry[];
  getByType: (type: string) => LoredexEntry[];
  getByAlbum: (album: string) => LoredexEntry[];
  getSongsForCharacter: (name: string) => LoredexEntry[];
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
  const musicVideos = loredexData.music_videos as Record<string, Record<string, string>>;
  const stats = loredexData.stats as Record<string, number>;

  const entryMap = useMemo(() => {
    const map = new Map<string, LoredexEntry>();
    entries.forEach((e) => {
      map.set(e.name.toLowerCase(), e);
      map.set(e.id, e);
    });
    return map;
  }, [entries]);

  const getEntry = (name: string) => entryMap.get(name.toLowerCase());
  const getEntryById = (id: string) => entryMap.get(id);

  const getRelated = (name: string): LoredexEntry[] => {
    const related = new Set<string>();
    relationships.forEach((r) => {
      if (r.source.toLowerCase() === name.toLowerCase()) related.add(r.target);
      if (r.target.toLowerCase() === name.toLowerCase()) related.add(r.source);
    });
    return Array.from(related)
      .map((n) => entryMap.get(n.toLowerCase()))
      .filter(Boolean) as LoredexEntry[];
  };

  const search = (query: string): LoredexEntry[] => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return entries.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        (e.bio && e.bio.toLowerCase().includes(q)) ||
        (e.era && e.era.toLowerCase().includes(q)) ||
        (e.album && e.album.toLowerCase().includes(q)) ||
        (e.affiliation && e.affiliation.toLowerCase().includes(q))
    );
  };

  const getByType = (type: string) => entries.filter((e) => e.type === type);
  const getByAlbum = (album: string) =>
    entries
      .filter((e) => e.type === "song" && e.album === album)
      .sort((a, b) => (a.track_number || 0) - (b.track_number || 0));

  const getSongsForCharacter = (name: string): LoredexEntry[] => {
    return entries.filter(
      (e) =>
        e.type === "song" &&
        e.characters_featured?.some(
          (c) => c.toLowerCase() === name.toLowerCase()
        )
    );
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
