/* ═══════════════════════════════════════════════════════
   OCULARUM CELL REDACTIONS

   The 627 cells the Shadow Tongue has reached.

   See apps/shared/ocularumCanon.ts:OCULARUM_SHADOW_TONGUE_REDACTION
   for the canonical doctrine — the cells whose institutional names
   have been edited out by the saga's record-editor. Each redacted
   cell is canonically active; only the name is gone from any
   substrate the editor can ride. What this file carries is the
   TRACE — a one-line hint of what survives the edit, preserved in
   memory-substrate by the order against the editor's reach.

   The cells: 72..98 (between the curated ninja-clan band and Mira),
   100..699 (between Mira and the Seventh Whisper). 27 + 600 = 627.

   The redaction is canon; the trace is what the order has saved.
   ═══════════════════════════════════════════════════════ */
import type { OcularumBranch, OcularumMemberEntry } from "./ocularumCanon";

/**
 * 80 trace templates. Each uses `{n}` for the cell number so every
 * redacted cell receives a personalized hidden-history hint. With
 * 80 templates rotated across 627 cells (~8 per template), and a
 * cell-number-specific variation in every entry, no two cells
 * carry the same trace. The templates encode the order's working
 * substrates for non-editable memory: indigo cord, gesture, song,
 * scent, footstep cadence, knot pattern, room arrangement, smell.
 */
const TRACE_TEMPLATES: readonly string[] = [
  "a knot tied in the indigo cord at induction — knot N°{n} in Cell 52's ledger",
  "a hand-gesture preserved in Mira's archive (Cell 99) at glyph {n}",
  "a footstep cadence Old Tanjin (Cell 1) still taps at the {n}th hour of his daily rote",
  "a song the Mute Choir (Cell 66) hums between phrases of the {n}th hymn in the Walk-Mikō songbook",
  "a pebble arrangement Cell 67 keeps at the {n}th turn of an unnamed alley",
  "a roof-tile tilted by Cell 64 at the {n}th course above the Atago shrine's eaves",
  "a meal-portion in the Ban House ledger keyed to bowl-size {n}",
  "the {n}th feeding of the Carrier-Hawk Line's continuous bird",
  "Cell 19's threshold-breath, counted at {n} beats per minute by the Togakure Lantern",
  "Cell 43's contract obligation N°{n} held against the Hierarchy of the Damned",
  "the {n}th apology in the Nakai House's diplomatic record",
  "Cell 20's silk-thread press, applied to nerve-point {n} of the Gyokko spine catalogue",
  "the {n}th bone in Cell 21's Tiger-Fall break-order",
  "a poison entry N°{n} in the Sugino House's seventy-two-plant list",
  "a kitchen scent Cell 56 logs in their {n}th observation report",
  "the {n}th lock sound in the Akutagawa lock-manual",
  "a beacon-fire smoke pattern Cell 68 reads from valley {n}",
  "the {n}th step in the Kosaka counting-walk through a New Babylon corridor",
  "Cell 30's contract clause N°{n} in the unchanged 1577 template",
  "a fold in the Mochizuki Mirror's preserved walking-route map at fold {n}",
  "the {n}th stitch in Cell 69's Three-Stitched Sleeve inheritance",
  "Cell 70's heron-watch position N°{n}, occupied during the Atago compact",
  "an indigo-ink character in the four refusing students' letter (Cell 39) at stroke {n}",
  "the {n}th eel-skin annotation in Cell 60's 1604 artifact margin",
  "Cell 24's Mirror-Justice ruling N°{n} in the unwritten internal record",
  "the {n}th breath in Cell 19's threshold-breath count",
  "a Cell 41 abbreviation key entry N°{n}, never written down",
  "the {n}th pace in Cell 16's Toyama dark-walk",
  "the {n}th tooth-marker in the Salt-Reader's poison taste-catalogue",
  "Cell 38's white-sleeve flash logged at engagement N°{n}",
  "a Cell 33 misdirection script entry, scene {n}",
  "Cell 50's Iga-refugee bridge curriculum hour {n}",
  "the {n}th beacon-grammar smoke shape rehearsed by Cell 58 every seventh day",
  "Cell 9's flood-swim N°{n}, performed in a flood season the Ugai house counted",
  "the {n}th oni-mask in Cell 22's misidentification archive",
  "a Cell 25 standing-ground vigil N°{n} at a door the Authority knocked on",
  "Cell 26's treaty clause N°{n} in a treaty the counterparty could not afford to break",
  "Cell 27's withdrawn-weapon ledger entry N°{n}, signed by Locke",
  "the {n}th Nazu sister's footstep recorded by Cell 36",
  "Cell 23's intake-interview question N°{n}, asked of every recruit before Cell 700",
  "a Tarao House refusal-letter to a patron N°{n}",
  "Cell 47's Karasuma triad rotation N°{n}",
  "the {n}th paired half-message carried by the Six-Sleeve Vigil",
  "Cell 49's double-refusal application N°{n}",
  "the {n}th Sandayū III rotation in Cell 40's identity-shift schedule",
  "Cell 31's forgettable-meal observation report N°{n}",
  "the {n}th branch in Cell 32's Sarutobi tree-canopy crossing route",
  "Cell 34's redistribution-ledger entry N°{n}, dated and quietly cleared",
  "the {n}th tone in the Mute Choir's musical-cipher table",
  "Cell 62's facsimile seal N°{n}, never used twice",
  "the {n}th pebble in Cell 67's safe-house signal lexicon",
  "a Cell 65 hawk's training log entry N°{n}",
  "the {n}th sleeve-corner in Cell 69's misimitation register",
  "Cell 28's cold-weather vigil position N°{n}, snowline-marked",
  "the {n}th Atago compact re-visit on the seventh-night rotation",
  "Cell 51's First Refusal ledger entry N°{n}",
  "a Cell 53 dossier line on Authority operative N°{n}",
  "the {n}th un-edited Archives mirror document Cell 54 carries in memory",
  "Cell 55's two-operative staggered-cadence walk at floor-tile N°{n}",
  "the {n}th oral-archive recitation by a Cell 58 operative",
  "Cell 59's indigo-cord re-tying of the founding entry-path at iteration {n}",
  "the {n}th Cell 71 forged document in Locke's cover dossier",
  "a Cell 42 single-stroke portrait from a crowd-glimpse at glance {n}",
  "the {n}th line of Cell 4's un-edited Bansenshūkai marginalia",
  "Cell 5's wind-reading entry for storm N°{n} on the Hōjō coast",
  "the {n}th gesture in the Walk-Mikō handoff grammar",
  "Cell 8's Ban household meal-cipher key at bowl-arrangement {n}",
  "the {n}th wading-position in Cell 70's underwater wait-roster",
  "Cell 17's Iwami deep-cover identity N°{n}, in year {n} of its lifetime",
  "the {n}th apology-template in the Nakai House's diplomatic library",
  "Cell 11's Nakai correspondence draft N°{n}, sent to the Ashikaga court",
  "the {n}th smoke-pattern Cell 10's Naiki House lit across two valleys",
  "Cell 15's small-poison dose N°{n} calibrated for thirty-second incapacitation",
  "the {n}th ration in Cell 13's Ueno black-rice supply",
  "Cell 14's Akutagawa lock-manual entry at type-by-sound N°{n}",
  "the {n}th tile in Cell 64's New Babylon Roof-Tile Cipher run",
  "Cell 12's Tarao refusal of patron offer N°{n}",
  "the {n}th meal Cell 17's deep-cover operative ate as a temple cook",
  "Cell 6's Mochizuki Mirror walking-route refresh N°{n}",
  "the {n}th Atago-shrine glyph-check by Cell 60 on the seventh night of the seventh month",
  "Cell 18's Kosaka counting-step distance-measurement at pace {n}",
];

/**
 * Branch rotation across the redacted body — keeps canonical
 * variety. Approximately resistance:reunified:apparatus = 70:15:15.
 */
function pickBranch(n: number): OcularumBranch {
  const r = n % 20;
  if (r < 3) return "apparatus";
  if (r < 6) return "reunified";
  return "resistance";
}

function redactedCell(n: number): OcularumMemberEntry {
  const trace = TRACE_TEMPLATES[n % TRACE_TEMPLATES.length].replace(
    /\{n\}/g,
    String(n),
  );
  return {
    id: `cell_${n}_redacted`,
    name: `Cell ${n} — name redacted`,
    cellNumber: n,
    role: "cell-member",
    branch: pickBranch(n),
    status: "shadow-tongue-redacted",
    otherIdentities: [],
    domain:
      `Cell ${n}'s institutional record has been edited out by the Shadow Tongue — name, ` +
      `cover documents, recruitment annotation, every paper substrate the editor could ` +
      `reach. The cell continues to operate. What the order has saved against the edit, ` +
      `held in memory-substrate the editor cannot ride: ${trace}.`,
    loreSource:
      "Shadow Tongue redaction (ninja-clan wave); OCULARUM_SHADOW_TONGUE_REDACTION in apps/shared/ocularumCanon.ts; apps/shared/roomMysteries/archives.ts (editor canon)",
    additionalSources: [],
    canonNote:
      "Status `shadow-tongue-redacted`. Cell remains canonically active. The redaction is canon; the DLC will not restore institutional names onto redacted cells — the order operates without them, by design.",
  };
}

const REDACTED_NUMBERS: readonly number[] = (() => {
  const ns: number[] = [];
  for (let n = 72; n <= 98; n++) ns.push(n);
  for (let n = 100; n <= 699; n++) ns.push(n);
  return ns;
})();

/**
 * The 627 Shadow-Tongue-redacted Ocularum cells. Spread into
 * OCULARUM_MEMBERS in ocularumCanon.ts so the cell-coverage gate
 * sees all 700 cells of the canonical operational body.
 */
export const SHADOW_TONGUE_REDACTED_CELLS: readonly OcularumMemberEntry[] =
  REDACTED_NUMBERS.map(redactedCell);
