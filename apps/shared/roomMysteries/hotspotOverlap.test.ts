/* ═══════════════════════════════════════════════════════
   HOTSPOT-RECTANGLE OVERLAP TEST

   Identical-rectangle HotspotDefs within the same room are
   silent bugs: one always eats the other's clicks. With
   PR #671 + PR #672 adding ~300 HotspotDef entries across
   ROOM_DEFINITIONS — many with hand-assigned coordinates —
   it's worth catching any rectangles that collapse to the
   same (x, y, width, height) within a room.

   This is the structural twin of `hotspotIdParity.test.ts`:
   that file proves every wired id has a click target; this
   one proves every click target is actually reachable.

   What we DON'T flag:
   - Partial overlap (large "background" hotspots paired with
     smaller focused ones are an intentional pattern).
   - Cross-room collisions (rooms are independent click
     surfaces; same coordinates in different rooms are fine).
   ═══════════════════════════════════════════════════════ */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const GAME_CONTEXT_PATH = resolve(
  process.cwd(),
  "apps/client/src/contexts/GameContext.tsx",
);

interface ParsedRoom {
  roomId: string;
  hotspots: Array<{
    id: string;
    cx: number;
    cy: number;
    width: number;
    height: number;
    line: number;
  }>;
}

/** Walk GameContext.tsx top-to-bottom, locating each
 *  `id: "<roomId>"` followed by `hotspots: [...]` block.
 *  Within each block, parse every `{ id: ..., cx, cy, width,
 *  height, ... }` row.
 *
 *  Returns one entry per declared room, with its parsed
 *  hotspot rectangles. */
function parseRoomHotspots(): ParsedRoom[] {
  const src = readFileSync(GAME_CONTEXT_PATH, "utf8");
  const lines = src.split("\n");
  const rooms: ParsedRoom[] = [];

  let currentRoom: string | null = null;
  let inHotspots = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const idMatch = line.match(/^\s*id:\s*"([a-z0-9_-]+)",/);
    if (idMatch && !inHotspots) {
      currentRoom = idMatch[1];
      continue;
    }
    if (/^\s*hotspots:\s*\[/.test(line)) {
      inHotspots = true;
      if (currentRoom) {
        rooms.push({ roomId: currentRoom, hotspots: [] });
      }
      continue;
    }
    if (inHotspots && /^\s*\],/.test(line)) {
      inHotspots = false;
      currentRoom = null;
      continue;
    }
    if (inHotspots && currentRoom) {
      const hsMatch = line.match(
        /\{\s*id:\s*"([^"]+)"[\s\S]*?cx:\s*(-?\d+(?:\.\d+)?)\s*,\s*cy:\s*(-?\d+(?:\.\d+)?)\s*,\s*width:\s*(\d+(?:\.\d+)?)\s*,\s*height:\s*(\d+(?:\.\d+)?)/,
      );
      if (hsMatch) {
        const room = rooms[rooms.length - 1];
        room.hotspots.push({
          id: hsMatch[1],
          cx: Number(hsMatch[2]),
          cy: Number(hsMatch[3]),
          width: Number(hsMatch[4]),
          height: Number(hsMatch[5]),
          line: i + 1,
        });
      }
    }
  }
  return rooms;
}

describe("hotspot rectangle collisions (PR #672 follow-up)", () => {
  const rooms = parseRoomHotspots();

  it("parser found rooms with hotspots", () => {
    expect(rooms.length).toBeGreaterThan(0);
    expect(rooms.some((r) => r.hotspots.length > 0)).toBe(true);
  });

  for (const room of rooms) {
    if (room.hotspots.length < 2) continue;
    it(`${room.roomId}: no two hotspots share exact (cx,cy,w,h)`, () => {
      const seen = new Map<string, string>();
      const collisions: string[] = [];
      for (const hs of room.hotspots) {
        const key = `${hs.cx},${hs.cy},${hs.width},${hs.height}`;
        const prior = seen.get(key);
        if (prior) {
          collisions.push(
            `(${key}) shared by "${prior}" and "${hs.id}" (line ${hs.line})`,
          );
        } else {
          seen.set(key, hs.id);
        }
      }
      if (collisions.length > 0) {
        throw new Error(
          `${room.roomId} has ${collisions.length} identical-rectangle collision(s):\n  ${collisions.join("\n  ")}`,
        );
      }
    });
  }
});
