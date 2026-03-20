/* ═══════════════════════════════════════════════════════
   CONTENT ADMIN ROUTER — CRUD for Loredex entries, songs, albums
   Reads/writes to the static JSON data file.
   ═══════════════════════════════════════════════════════ */
import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import path from "path";
import fs from "fs";

// Admin guard
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

const DATA_PATH = path.resolve(import.meta.dirname, "../../client/src/data/loredex-data.json");

interface LoredexEntry {
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
  connections?: Array<{ target: string; type: string; description?: string }>;
  conexus_stories?: string[];
  song_appearances?: string[];
  image?: string;
  priority?: string;
  streaming_links?: Record<string, string>;
  // Song-specific fields
  album?: string;
  track_number?: number;
  release_date?: string;
  release_year?: number;
  artist?: string;
  characters_featured?: string[];
  music_video?: Record<string, string>;
  date_in_saga?: string;
  [key: string]: unknown;
}

interface LoredexData {
  entries: LoredexEntry[];
  relationships: Array<{ source: string; target: string; type: string; description?: string }>;
  music_videos: Record<string, Record<string, string>>;
  streaming_links: Record<string, Record<string, string>>;
  episodes: Record<string, unknown[]>;
  aliases: Record<string, string[]>;
  song_character_map: Record<string, string[]>;
  stats: Record<string, number>;
}

function readData(): LoredexData {
  try {
    const raw = fs.readFileSync(DATA_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to read loredex data" });
  }
}

function writeData(data: LoredexData): void {
  try {
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch {
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to write loredex data" });
  }
}

function recalcStats(data: LoredexData): void {
  const entries = data.entries;
  data.stats = {
    total_entries: entries.length,
    characters: entries.filter(e => e.type === "character").length,
    locations: entries.filter(e => e.type === "location").length,
    songs: entries.filter(e => e.type === "song").length,
    factions: entries.filter(e => e.type === "faction").length,
    concepts: entries.filter(e => e.type === "concept").length,
    relationships: data.relationships.length,
  };
}

const entrySchema = z.object({
  id: z.string().min(1),
  type: z.enum(["character", "location", "song", "faction", "concept"]),
  name: z.string().min(1),
  aliases: z.array(z.string()).optional(),
  era: z.string().optional(),
  date_aa: z.string().optional(),
  date_ad: z.string().optional(),
  season: z.string().optional(),
  affiliation: z.string().optional(),
  status: z.string().optional(),
  bio: z.string().optional(),
  history: z.string().optional(),
  image: z.string().optional(),
  priority: z.string().optional(),
  // Song-specific
  album: z.string().optional(),
  track_number: z.number().optional(),
  release_date: z.string().optional(),
  release_year: z.number().optional(),
  artist: z.string().optional(),
  characters_featured: z.array(z.string()).optional(),
  streaming_links: z.record(z.string(), z.string()).optional(),
  music_video: z.record(z.string(), z.string()).optional(),
  date_in_saga: z.string().optional(),
});

const relationshipSchema = z.object({
  source: z.string().min(1),
  target: z.string().min(1),
  type: z.string().min(1),
  description: z.string().optional(),
});

export const contentAdminRouter = router({
  /* ─── LIST ENTRIES ─── */
  listEntries: adminProcedure
    .input(z.object({
      type: z.string().optional(),
      search: z.string().optional(),
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(25),
    }).optional())
    .query(({ input }) => {
      const data = readData();
      let entries = data.entries;

      if (input?.type) {
        entries = entries.filter(e => e.type === input.type);
      }
      if (input?.search) {
        const q = input.search.toLowerCase();
        entries = entries.filter(e =>
          e.name.toLowerCase().includes(q) ||
          (e.bio && e.bio.toLowerCase().includes(q)) ||
          (e.id && e.id.toLowerCase().includes(q))
        );
      }

      const page = input?.page ?? 1;
      const limit = input?.limit ?? 25;
      const offset = (page - 1) * limit;

      return {
        entries: entries.slice(offset, offset + limit).map(e => ({
          id: e.id,
          type: e.type,
          name: e.name,
          era: e.era,
          season: e.season,
          affiliation: e.affiliation,
          status: e.status,
          image: e.image,
          album: e.album,
          track_number: e.track_number,
          priority: e.priority,
        })),
        total: entries.length,
        stats: data.stats,
      };
    }),

  /* ─── GET SINGLE ENTRY ─── */
  getEntry: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      const data = readData();
      const entry = data.entries.find(e => e.id === input.id);
      if (!entry) throw new TRPCError({ code: "NOT_FOUND", message: "Entry not found" });

      // Get relationships for this entry
      const relationships = data.relationships.filter(
        r => r.source === input.id || r.target === input.id
      );

      return { entry, relationships };
    }),

  /* ─── CREATE ENTRY ─── */
  createEntry: adminProcedure
    .input(entrySchema)
    .mutation(({ input }) => {
      const data = readData();

      // Check for duplicate ID
      if (data.entries.some(e => e.id === input.id)) {
        throw new TRPCError({ code: "CONFLICT", message: `Entry with ID "${input.id}" already exists` });
      }

      const newEntry: LoredexEntry = {
        ...input,
        connections: [],
        conexus_stories: [],
        song_appearances: [],
      };

      data.entries.push(newEntry);

      // Update aliases if provided
      if (input.aliases && input.aliases.length > 0) {
        data.aliases[input.name] = input.aliases;
      }

      // Update song_character_map for songs
      if (input.type === "song" && input.characters_featured && input.characters_featured.length > 0) {
        data.song_character_map[input.name] = input.characters_featured;
      }

      // Update streaming links
      if (input.streaming_links && Object.keys(input.streaming_links).length > 0) {
        data.streaming_links[input.name] = input.streaming_links;
      }

      recalcStats(data);
      writeData(data);

      return { success: true, id: input.id };
    }),

  /* ─── UPDATE ENTRY ─── */
  updateEntry: adminProcedure
    .input(z.object({
      id: z.string(),
      updates: entrySchema.partial(),
    }))
    .mutation(({ input }) => {
      const data = readData();
      const idx = data.entries.findIndex(e => e.id === input.id);
      if (idx === -1) throw new TRPCError({ code: "NOT_FOUND", message: "Entry not found" });

      const oldName = data.entries[idx].name;

      // Apply updates
      Object.entries(input.updates).forEach(([key, value]) => {
        if (value !== undefined) {
          (data.entries[idx] as Record<string, unknown>)[key] = value;
        }
      });

      // Update aliases if name changed
      if (input.updates.name && input.updates.name !== oldName) {
        if (data.aliases[oldName]) {
          data.aliases[input.updates.name] = data.aliases[oldName];
          delete data.aliases[oldName];
        }
        // Update relationships
        data.relationships.forEach(r => {
          if (r.source === input.id) r.source = input.id;
          if (r.target === input.id) r.target = input.id;
        });
      }

      // Update streaming links
      const entryName = data.entries[idx].name;
      if (input.updates.streaming_links) {
        data.streaming_links[entryName] = input.updates.streaming_links;
      }

      // Update song_character_map
      if (input.updates.characters_featured) {
        data.song_character_map[entryName] = input.updates.characters_featured;
      }

      recalcStats(data);
      writeData(data);

      return { success: true };
    }),

  /* ─── DELETE ENTRY ─── */
  deleteEntry: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => {
      const data = readData();
      const idx = data.entries.findIndex(e => e.id === input.id);
      if (idx === -1) throw new TRPCError({ code: "NOT_FOUND", message: "Entry not found" });

      const entry = data.entries[idx];

      // Remove from entries
      data.entries.splice(idx, 1);

      // Remove relationships
      data.relationships = data.relationships.filter(
        r => r.source !== input.id && r.target !== input.id
      );

      // Remove from aliases
      delete data.aliases[entry.name];

      // Remove from song_character_map
      delete data.song_character_map[entry.name];

      // Remove from streaming_links
      delete data.streaming_links[entry.name];

      recalcStats(data);
      writeData(data);

      return { success: true };
    }),

  /* ─── MANAGE RELATIONSHIPS ─── */
  addRelationship: adminProcedure
    .input(relationshipSchema)
    .mutation(({ input }) => {
      const data = readData();

      // Check both entries exist
      const sourceExists = data.entries.some(e => e.id === input.source);
      const targetExists = data.entries.some(e => e.id === input.target);
      if (!sourceExists || !targetExists) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Source or target entry not found" });
      }

      // Check for duplicate
      const exists = data.relationships.some(
        r => r.source === input.source && r.target === input.target && r.type === input.type
      );
      if (exists) {
        throw new TRPCError({ code: "CONFLICT", message: "Relationship already exists" });
      }

      data.relationships.push(input);
      recalcStats(data);
      writeData(data);

      return { success: true };
    }),

  removeRelationship: adminProcedure
    .input(z.object({
      source: z.string(),
      target: z.string(),
      type: z.string(),
    }))
    .mutation(({ input }) => {
      const data = readData();
      const before = data.relationships.length;
      data.relationships = data.relationships.filter(
        r => !(r.source === input.source && r.target === input.target && r.type === input.type)
      );
      if (data.relationships.length === before) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Relationship not found" });
      }
      recalcStats(data);
      writeData(data);
      return { success: true };
    }),

  /* ─── ALBUM MANAGEMENT ─── */
  listAlbums: adminProcedure.query(() => {
    const data = readData();
    const songs = data.entries.filter(e => e.type === "song");
    const albumMap = new Map<string, { name: string; trackCount: number; year?: number; artist?: string }>();

    for (const song of songs) {
      const album = song.album || "Unknown";
      if (!albumMap.has(album)) {
        albumMap.set(album, {
          name: album,
          trackCount: 0,
          year: song.release_year,
          artist: song.artist,
        });
      }
      albumMap.get(album)!.trackCount++;
    }

    return Array.from(albumMap.values()).sort((a, b) => (a.year ?? 0) - (b.year ?? 0));
  }),

  /* ─── BULK OPERATIONS ─── */
  getStats: adminProcedure.query(() => {
    const data = readData();
    return {
      stats: data.stats,
      totalRelationships: data.relationships.length,
      totalAliases: Object.keys(data.aliases).length,
      totalStreamingLinks: Object.keys(data.streaming_links).length,
      totalMusicVideos: Object.keys(data.music_videos).length,
      totalEpisodes: Object.keys(data.episodes).length,
    };
  }),

  /* ─── CSV EXPORT ─── */
  exportCsv: adminProcedure
    .input(z.object({ type: z.enum(["all", "character", "song", "location", "faction", "event", "concept", "technology"]).optional() }))
    .query(({ input }) => {
      const data = readData();
      let entries = data.entries;
      if (input.type && input.type !== "all") {
        entries = entries.filter((e: LoredexEntry) => e.type === input.type);
      }
      // CSV header
      const fields = ["id","type","name","era","date_aa","date_ad","season","affiliation","status","classification","threat_level","description","lore_significance","first_appearance","key_abilities","key_relationships","album","track_number","duration","genre","mood","themes"];
      const escCsv = (v: unknown) => {
        if (v == null) return "";
        const s = Array.isArray(v) ? v.join(";") : String(v);
        return s.includes(",") || s.includes('"') || s.includes("\n") ? `"${s.replace(/"/g, '""')}"` : s;
      };
      const rows = [fields.join(",")];
      for (const e of entries) {
        rows.push(fields.map(f => escCsv((e as any)[f])).join(","));
      }
      return { csv: rows.join("\n"), count: entries.length, type: input.type ?? "all" };
    }),

  /* ─── CSV IMPORT ─── */
  importCsv: adminProcedure
    .input(z.object({
      csv: z.string(),
      mode: z.enum(["merge", "replace"]).default("merge"),
    }))
    .mutation(({ input }) => {
      const lines = input.csv.split("\n").filter(l => l.trim());
      if (lines.length < 2) throw new TRPCError({ code: "BAD_REQUEST", message: "CSV must have header + at least 1 row" });
      // Parse CSV (handles quoted fields with commas)
      const parseCsvLine = (line: string): string[] => {
        const result: string[] = [];
        let current = "";
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
          const ch = line[i];
          if (ch === '"') {
            if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
            else { inQuotes = !inQuotes; }
          } else if (ch === "," && !inQuotes) {
            result.push(current.trim()); current = "";
          } else { current += ch; }
        }
        result.push(current.trim());
        return result;
      };
      const headers = parseCsvLine(lines[0]);
      const nameIdx = headers.indexOf("name");
      const idIdx = headers.indexOf("id");
      const typeIdx = headers.indexOf("type");
      if (nameIdx === -1) throw new TRPCError({ code: "BAD_REQUEST", message: "CSV must have 'name' column" });

      const data = readData();
      let created = 0, updated = 0, skipped = 0;
      const arrayFields = new Set(["key_abilities", "key_relationships", "themes"]);

      for (let i = 1; i < lines.length; i++) {
        const values = parseCsvLine(lines[i]);
        if (values.length < headers.length) { skipped++; continue; }
        const row: Record<string, any> = {};
        headers.forEach((h, idx) => {
          const val = values[idx];
          if (!val) return;
          if (arrayFields.has(h)) { row[h] = val.split(";").map((s: string) => s.trim()).filter(Boolean); }
          else if (h === "track_number") { row[h] = parseInt(val) || undefined; }
          else { row[h] = val; }
        });
        // Find existing entry by ID or name
        const existingIdx = data.entries.findIndex((e: LoredexEntry) =>
          (idIdx >= 0 && values[idIdx] && e.id === values[idIdx]) || e.name === values[nameIdx]
        );
        if (existingIdx >= 0) {
          if (input.mode === "merge") {
            // Merge: only overwrite non-empty fields
            Object.entries(row).forEach(([k, v]) => {
              if (v != null && v !== "") (data.entries[existingIdx] as any)[k] = v;
            });
            updated++;
          } else {
            // Replace: overwrite entire entry but keep ID
            const oldId = data.entries[existingIdx].id;
            data.entries[existingIdx] = { ...row, id: oldId } as LoredexEntry;
            updated++;
          }
        } else {
          // Create new entry
          const maxId = data.entries.reduce((max: number, e: LoredexEntry) => {
            const num = parseInt(e.id.replace("entity_", ""));
            return isNaN(num) ? max : Math.max(max, num);
          }, 0);
          const newEntry = { id: `entity_${maxId + 1 + created}`, type: typeIdx >= 0 ? values[typeIdx] || "character" : "character", ...row };
          data.entries.push(newEntry as LoredexEntry);
          created++;
        }
      }
      // Recalculate stats
      data.stats = {
        total_entries: data.entries.length,
        characters: data.entries.filter((e: LoredexEntry) => e.type === "character").length,
        songs: data.entries.filter((e: LoredexEntry) => e.type === "song").length,
        locations: data.entries.filter((e: LoredexEntry) => e.type === "location").length,
        factions: data.entries.filter((e: LoredexEntry) => e.type === "faction").length,
        events: data.entries.filter((e: LoredexEntry) => e.type === "event").length,
        concepts: data.entries.filter((e: LoredexEntry) => e.type === "concept").length,
        technologies: data.entries.filter((e: LoredexEntry) => e.type === "technology").length,
        relationships: data.relationships.length,
      };
      writeData(data);
      return { created, updated, skipped, total: data.entries.length };
    }),

  /* ─── BULK DELETE ─── */
  bulkDelete: adminProcedure
    .input(z.object({ ids: z.array(z.string()).min(1).max(500) }))
    .mutation(({ input }) => {
      const data = readData();
      const idSet = new Set(input.ids);
      const before = data.entries.length;
      data.entries = data.entries.filter((e: LoredexEntry) => !idSet.has(e.id));
      // Also remove relationships involving deleted entries
      data.relationships = data.relationships.filter((r: any) => !idSet.has(r.source) && !idSet.has(r.target));
      // Recalculate stats
      data.stats.total_entries = data.entries.length;
      data.stats.characters = data.entries.filter((e: LoredexEntry) => e.type === "character").length;
      data.stats.songs = data.entries.filter((e: LoredexEntry) => e.type === "song").length;
      data.stats.locations = data.entries.filter((e: LoredexEntry) => e.type === "location").length;
      data.stats.factions = data.entries.filter((e: LoredexEntry) => e.type === "faction").length;
      data.stats.relationships = data.relationships.length;
      writeData(data);
      return { deleted: before - data.entries.length, remaining: data.entries.length };
    }),
});
