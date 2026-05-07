#!/usr/bin/env tsx
/**
 * One-shot codemod: backfill `.references(() => users.id, { onDelete })`
 * on int columns whose name signals a user-id (userId, *UserId,
 * player1Id, player2Id, senderId, buyerId, sellerId, ownerId,
 * winnerId, creatorId, bidderId, highestBidderId, leaderId,
 * issuedToAdminId, targetAdminId).
 *
 * onDelete policy is heuristic on the SQL table name:
 *   restrict → audit / payment / match / consent / log / invoice /
 *              transaction / receipt / trial / leaderboard /
 *              tournament / journal — tables whose rows must
 *              survive the user being deleted (financial / historical
 *              / audit-trail concerns)
 *   cascade  → everything else (owned data, profiles, settings,
 *              session-state, in-game collections)
 *
 * Idempotent: re-running is a no-op (the column-shape pattern only
 * matches when no `.references(` is already present).
 *
 * Verification:
 *   pnpm ship:check --only=db.foreign_key_coverage  → gap drops
 *   pnpm check                                       → typecheck still clean
 *
 * Usage:
 *   pnpm tsx apps/scripts/backfill-user-fks.ts            (preview)
 *   pnpm tsx apps/scripts/backfill-user-fks.ts --apply    (write)
 */
import * as fs from "node:fs";
import * as path from "node:path";

const REPO_ROOT = path.resolve(import.meta.dirname, "..", "..");
const SCHEMA = path.join(REPO_ROOT, "apps/db/schema.ts");
const APPLY = process.argv.includes("--apply");

const USER_COLUMN_PATTERNS = [
  /^userId$/,
  /^[a-z]+UserId$/,            // blockerUserId, targetUserId, etc.
  /^player[12]Id$/,
  /^senderId$/,
  /^receiverId$/,
  /^buyerId$/,
  /^sellerId$/,
  /^ownerId$/,
  /^winnerId$/,
  /^creatorId$/,
  /^bidderId$/,
  /^highestBidderId$/,
  /^leaderId$/,
  /^issuedToAdminId$/,
  /^targetAdminId$/,
  /^attackerId$/,
  /^defenderId$/,
  /^defenderOwnerId$/,
  /^opponentId$/,
  /^challengerId$/,
  /^friendId$/,
  /^visitorId$/,
  /^adminId$/,
  /^authorId$/,
  /^donorId$/,
  /^recipientId$/,
  /^whitePlayerId$/,
  /^blackPlayerId$/,
  /^whiteId$/,
  /^blackId$/,
  /^guildAPlayerId$/,
  /^guildBPlayerId$/,
  /^reporterId$/,
  /^targetId$/,
  /^resolvedByUserId$/,
  /^lastWinnerId$/,
  /^firstDiscovererUserId$/,
];

/**
 * Intra-feature foreign keys — columns whose target is a non-user
 * table, mapped explicitly. The map's values name the Drizzle var
 * exporting the target table; a self-reference (column on the target
 * table itself) is skipped in {@link backfill}.
 *
 * onDelete defaults to cascade unless the parent is a permanent
 * historical row (matches, tournaments, seasons, etc.).
 */
const INTRA_TARGETS: Readonly<Record<string, { tableVar: string; onDelete: "cascade" | "restrict" }>> = {
  guildId: { tableVar: "guilds", onDelete: "cascade" },
  guildAId: { tableVar: "guilds", onDelete: "cascade" },
  guildBId: { tableVar: "guilds", onDelete: "cascade" },
  winnerGuildId: { tableVar: "guilds", onDelete: "restrict" },
  firstDiscovererGuildId: { tableVar: "guilds", onDelete: "restrict" },
  sectorId: { tableVar: "twSectors", onDelete: "cascade" },
  seasonId: { tableVar: "battlePassSeasons", onDelete: "restrict" },
  tournamentId: { tableVar: "chessTournaments", onDelete: "cascade" },
  eventId: { tableVar: "seasonalEvents", onDelete: "cascade" },
  raidId: { tableVar: "coopRaids", onDelete: "cascade" },
  gameId: { tableVar: "chessGames", onDelete: "restrict" },
  listingId: { tableVar: "marketListings", onDelete: "restrict" },
  auctionId: { tableVar: "marketAuctions", onDelete: "restrict" },
  promoCodeId: { tableVar: "promoCodes", onDelete: "restrict" },
  announcementId: { tableVar: "announcements", onDelete: "cascade" },
  warId: { tableVar: "guildWars", onDelete: "cascade" },
  selectedDeckId: { tableVar: "decks", onDelete: "set null" as "cascade" }, // nullable
  invitedByUserId: { tableVar: "users", onDelete: "cascade" }, // user ref
};

// `selectedDeckId` is genuinely nullable; need a different policy. Track separately.
const NULLABLE_INTRA: Readonly<Record<string, { tableVar: string; onDelete: "set null" }>> = {
  selectedDeckId: { tableVar: "decks", onDelete: "set null" },
};

const RESTRICT_TABLE_PATTERNS = [
  /audit/i,
  /agreement/i,
  /consent/i,
  /payment/i,
  /purchase/i,
  /receipt/i,
  /invoice/i,
  /transaction/i,
  /journal/i,
  /^pvp_matches$/,
  /^card_game_matches$/,
  /^chess_matches$/,
  /matches$/,
  /leaderboard/i,
  /tournament/i,
  /trial/i,
  /trophy/i,
  /log$/,
  /_log$/,
  /^stop_/,        // stop_audit_findings etc.
  /grants$/,       // support_impersonation_grants
];

interface Edit {
  table: string;
  column: string;
  policy: "cascade" | "restrict";
  before: string;
  after: string;
}

function pickPolicy(tableName: string): "cascade" | "restrict" {
  for (const pat of RESTRICT_TABLE_PATTERNS) {
    if (pat.test(tableName)) return "restrict";
  }
  return "cascade";
}

function isUserColumn(name: string): boolean {
  for (const pat of USER_COLUMN_PATTERNS) {
    if (pat.test(name)) return true;
  }
  return false;
}

/** Convert SQL snake_case table name to Drizzle camelCase var name. */
function toCamelCase(snake: string): string {
  return snake.replace(/_([a-z])/g, (_m, c) => (c as string).toUpperCase());
}

function backfill(): void {
  const src = fs.readFileSync(SCHEMA, "utf-8");
  const edits: Edit[] = [];

  // For each `mysqlTable("<name>", { … }`, walk its body and rewrite
  // matching int columns. Preserves multi-line indentation.
  const tableRe =
    /export\s+const\s+\w+\s*=\s*mysqlTable\(\s*["']([a-zA-Z0-9_]+)["']\s*,\s*\{([\s\S]*?)\n\s*\}\s*(?:,|\))/g;

  // Build the patched source as a list of (start, end, replacement)
  // splices applied right-to-left so offsets stay stable.
  const splices: Array<{ start: number; end: number; replacement: string }> =
    [];

  for (const tableMatch of src.matchAll(tableRe)) {
    const tableName = tableMatch[1];
    const policy = pickPolicy(tableName);

    // Find int(...) column declarations that don't already reference()
    // and whose name matches a user-pattern OR an intra-feature target.
    //
    // Tightened: `int\(` captures ONLY a quoted-string arg so the
    // regex can't backtrack through a multi-call chain (e.g. an
    // already-applied `.references(() => …)` no longer matches).
    const colRe = /^(\s+)([a-zA-Z_][a-zA-Z0-9_]*)\s*:\s*int\("([^"]+)"\)((?:\s*\.[a-zA-Z]+\([^()]*(?:\([^()]*\)[^()]*)*\))*)\s*,/gm;
    const bodyText = tableMatch[2];
    for (const colMatch of bodyText.matchAll(colRe)) {
      const columnName = colMatch[2];
      const chain = colMatch[4];
      if (/\.references\(/.test(chain)) continue;

      // Decide target + policy.
      let targetVar: string;
      let onDelete: "cascade" | "restrict" | "set null";
      if (isUserColumn(columnName)) {
        targetVar = "users";
        onDelete = policy;
      } else if (NULLABLE_INTRA[columnName]) {
        targetVar = NULLABLE_INTRA[columnName].tableVar;
        onDelete = NULLABLE_INTRA[columnName].onDelete;
        // set null only legal if column is nullable (no .notNull()).
        if (/\.notNull\(/.test(chain)) continue;
      } else if (INTRA_TARGETS[columnName]) {
        targetVar = INTRA_TARGETS[columnName].tableVar;
        onDelete = INTRA_TARGETS[columnName].onDelete;
      } else {
        continue;
      }

      // Skip self-references (e.g. tw_sectors.sectorId — that IS the
      // table's PK, not a foreign key).
      if (targetVar === toCamelCase(tableName)) continue;

      const lineStartInBody = colMatch.index!;
      const lineEndInBody = lineStartInBody + colMatch[0].length;
      const tableBodyAbsStart = tableMatch.index! + tableMatch[0].indexOf(bodyText);
      const commaAbs = tableBodyAbsStart + lineEndInBody - 1;
      const idCol = targetVar === "users" || /Id$/.test(columnName) ? "id" : "id";
      const replacement = `.references(() => ${targetVar}.${idCol}, { onDelete: "${onDelete}" })`;
      splices.push({
        start: commaAbs,
        end: commaAbs,
        replacement,
      });
      edits.push({
        table: tableName,
        column: columnName,
        policy: onDelete as "cascade" | "restrict",
        before: colMatch[0].trim(),
        after: colMatch[0].replace(/,$/, replacement + ",").trim(),
      });
    }
  }

  if (edits.length === 0) {
    console.log("backfill-user-fks: nothing to do (idempotent).");
    return;
  }

  // Apply splices right-to-left.
  splices.sort((a, b) => b.start - a.start);
  let next = src;
  for (const s of splices) {
    next = next.slice(0, s.start) + s.replacement + next.slice(s.end);
  }

  // Group by table for the report.
  const byTable = new Map<string, Edit[]>();
  for (const e of edits) {
    if (!byTable.has(e.table)) byTable.set(e.table, []);
    byTable.get(e.table)!.push(e);
  }
  for (const [t, es] of [...byTable.entries()].sort()) {
    const policy = es[0].policy;
    console.log(`  ${APPLY ? "✓" : "·"} ${t} (onDelete: ${policy}): ${es.map((e) => e.column).join(", ")}`);
  }
  console.log(
    `\nbackfill-user-fks: ${edits.length} column(s) across ${byTable.size} table(s) ` +
      (APPLY ? "rewritten." : "would be rewritten — re-run with --apply."),
  );

  if (APPLY) fs.writeFileSync(SCHEMA, next);
}

backfill();
