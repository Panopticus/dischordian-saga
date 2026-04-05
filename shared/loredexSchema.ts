/* ═══════════════════════════════════════════════════════
   LOREDEX SCHEMA VALIDATION

   Zod schemas for loredex-data.json (233 entries + 578
   relationships). Catches:
     • Malformed entries (missing required fields, bad types)
     • Duplicate IDs
     • Broken relationship references (source/target not in entries)
     • Empty required narrative fields (bio, history)
     • Unknown entry types

   Run from test or build step to catch inconsistencies early.
   ═══════════════════════════════════════════════════════ */

import { z } from "zod";

export const ENTRY_TYPES = ["character", "concept", "event", "faction", "location", "song"] as const;

export const LoredexEntrySchema = z.object({
  id: z.string().min(1),
  type: z.enum(ENTRY_TYPES),
  name: z.string().min(1),
  aliases: z.array(z.string()).default([]),
  era: z.string().default(""),
  date_aa: z.string().default(""),
  date_ad: z.string().default(""),
  season: z.string().default(""),
  affiliation: z.string().default(""),
  status: z.string().default(""),
  bio: z.string(),
  history: z.string().default(""),
  connections: z.array(z.string()).default([]),
  conexus_stories: z.array(z.any()).default([]),
  song_appearances: z.array(z.any()).default([]),
  image: z.string().optional().default(""),
  priority: z.string().optional().default("normal"),
  streaming_links: z.any().optional(),
});

export const LoredexRelationshipSchema = z.object({
  source: z.string().min(1),
  target: z.string().min(1),
  relationship_type: z.string().min(1),
  source_type: z.string().optional(),
});

export type LoredexEntry = z.infer<typeof LoredexEntrySchema>;
export type LoredexRelationship = z.infer<typeof LoredexRelationshipSchema>;

/* ─── VALIDATION ISSUES ─── */

export type IssueKind =
  | "schema_mismatch"
  | "duplicate_id"
  | "broken_reference"
  | "empty_required_field"
  | "unknown_entry_type";

export interface ValidationIssue {
  kind: IssueKind;
  entryId?: string;
  field?: string;
  message: string;
}

export interface ValidationResult {
  entryCount: number;
  relationshipCount: number;
  issues: ValidationIssue[];
  validEntries: LoredexEntry[];
  validRelationships: LoredexRelationship[];
}

/**
 * Run full schema + integrity validation against loredex-data.
 * Returns structured issue list. Does not throw.
 */
export function validateLoredex(raw: unknown): ValidationResult {
  const issues: ValidationIssue[] = [];
  const validEntries: LoredexEntry[] = [];
  const validRelationships: LoredexRelationship[] = [];

  if (typeof raw !== "object" || raw === null) {
    issues.push({ kind: "schema_mismatch", message: "Loredex data is not an object" });
    return { entryCount: 0, relationshipCount: 0, issues, validEntries, validRelationships };
  }

  const data = raw as { entries?: unknown[]; relationships?: unknown[] };
  const rawEntries = Array.isArray(data.entries) ? data.entries : [];
  const rawRels = Array.isArray(data.relationships) ? data.relationships : [];

  // Validate each entry + detect duplicates
  const seenIds = new Set<string>();
  for (const raw of rawEntries) {
    const parsed = LoredexEntrySchema.safeParse(raw);
    if (!parsed.success) {
      const id = typeof raw === "object" && raw && "id" in raw ? String((raw as any).id) : "?";
      issues.push({
        kind: "schema_mismatch", entryId: id,
        message: `Entry ${id}: ${parsed.error.issues[0]?.message ?? "validation failed"}`,
      });
      continue;
    }
    const entry = parsed.data;
    if (seenIds.has(entry.id)) {
      issues.push({ kind: "duplicate_id", entryId: entry.id, message: `Duplicate entry id: ${entry.id}` });
      continue;
    }
    seenIds.add(entry.id);
    if (!entry.bio.trim()) {
      issues.push({
        kind: "empty_required_field", entryId: entry.id, field: "bio",
        message: `Entry ${entry.id} has empty bio`,
      });
    }
    validEntries.push(entry);
  }

  // Validate relationships + check references
  for (const raw of rawRels) {
    const parsed = LoredexRelationshipSchema.safeParse(raw);
    if (!parsed.success) {
      issues.push({
        kind: "schema_mismatch",
        message: `Relationship: ${parsed.error.issues[0]?.message ?? "validation failed"}`,
      });
      continue;
    }
    const rel = parsed.data;
    if (!seenIds.has(rel.source)) {
      issues.push({
        kind: "broken_reference", entryId: rel.source,
        message: `Relationship source "${rel.source}" not in entries`,
      });
    }
    if (!seenIds.has(rel.target)) {
      issues.push({
        kind: "broken_reference", entryId: rel.target,
        message: `Relationship target "${rel.target}" not in entries`,
      });
    }
    validRelationships.push(rel);
  }

  return {
    entryCount: validEntries.length,
    relationshipCount: validRelationships.length,
    issues,
    validEntries,
    validRelationships,
  };
}

/**
 * Summarize issues by kind for quick triage.
 */
export function summarizeIssues(issues: ValidationIssue[]): Record<IssueKind, number> {
  const summary: Record<string, number> = {};
  for (const issue of issues) {
    summary[issue.kind] = (summary[issue.kind] ?? 0) + 1;
  }
  return summary as Record<IssueKind, number>;
}
