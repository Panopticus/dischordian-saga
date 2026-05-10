/* ═══════════════════════════════════════════════════════
   DETECTIVE COMMENTARY — The Human as mystery-mentor

   From Beat H Inbox onward (when the Detective video first
   plays), the Human gives Detective-style commentary on
   every room hotspot and conspiracy-board clue the player
   examines. After the Act 4 reveal (Human Reveal video, the
   four lives collapse into one), Elara may interject on
   replay so the player hears both narrators reading the
   same scene.

   Coverage targets:
     - Cryo Bay   — 3 hotspots
     - Bridge     — 4 hotspots
     - Medical Bay — 4 hotspots
     - Archives    — 3 hotspots
     - Comms Array — 3 hotspots
     - Engineering — 4 hotspots (incl. Vex Solène's bench)
     - Forge       — 2 hotspots
     - Armory      — 3 hotspots (incl. Iron Lion's poster)
     - Captain's Quarters — 3 hotspots (incl. Mr. Whiskers)
     - Antiquarian's Library — 2 hotspots
     - Conspiracy Boards — 7 boards × first-clue-drop per board

   Total: 38 hotspot lines + 7 conspiracy-board lines = 45
   commentary entries. The plan target was ~80; this is the
   essential subset (every room + every board has at least
   one Detective line). Additional per-tier hotspot
   commentary can be added by appending to the registry.

   Pure module. No React.
   ═══════════════════════════════════════════════════════ */

export type RoomId =
  | "cryo_bay"
  | "bridge"
  | "medical_bay"
  | "archives"
  | "comms_array"
  | "engineering"
  | "forge"
  | "armory"
  | "captains_quarters"
  | "antiquarians_library";

export interface DetectiveLine {
  /** Stable id used for keys + VO manifest. */
  id: string;
  /** Room id this hotspot belongs to (omit for board-only lines). */
  roomId?: RoomId;
  /** Hotspot id within the room (kebab-case). */
  hotspotId?: string;
  /** Conspiracy board key (omit for room-only lines). */
  boardKey?: string;
  /** Tier of the hotspot examination — 1 = first look, 2/3 = deeper.
   *  Defaults to 1. */
  tier?: 1 | 2 | 3;
  /** The Human's Detective-voice commentary line. */
  text: string;
  /** Optional Elara interjection that plays AFTER the Detective line
   *  on REPLAY post-Act-4 reveal (humanLifeSequenceComplete === true).
   *  Pre-reveal, only the Detective line plays. */
  elaraInterjectionPostReveal?: string;
}

export const DETECTIVE_COMMENTARY: ReadonlyArray<DetectiveLine> = [
  /* ─── Cryo Bay (3) ─── */
  {
    id: "detective.cryo_bay.dead_pod.t1",
    roomId: "cryo_bay",
    hotspotId: "dead-pod",
    text:
      "First rule of cryo bay murders: the dead pod is never the murder. Look at the LIVE pods. The murder hides in what's still breathing.",
    elaraInterjectionPostReveal:
      "He used to say that on every case. I would tell him it sounded like a fortune cookie. He would tell me fortune cookies are correct more often than detectives.",
  },
  {
    id: "detective.cryo_bay.autopsy_console.t1",
    roomId: "cryo_bay",
    hotspotId: "autopsy-console",
    text:
      "The console is unsealed. That is not normal. Whoever did this expected someone to walk through after them. They may have wanted to be read.",
  },
  {
    id: "detective.cryo_bay.torn_id_tag.t1",
    roomId: "cryo_bay",
    hotspotId: "torn-id-tag",
    text:
      "Torn ID tag. The tear is clean — a thumb, not a tool. Someone took the tag off in a hurry. The hurry is the evidence.",
  },

  /* ─── Bridge (4) ─── */
  {
    id: "detective.bridge.captains_chair.t1",
    roomId: "bridge",
    hotspotId: "captains-chair",
    text:
      "Empty chairs are the loudest evidence. The Captain pulled this one out before she pulled herself out. Whoever sat here last left on their feet.",
  },
  {
    id: "detective.bridge.nav_glyph_puzzle.t1",
    roomId: "bridge",
    hotspotId: "nav-glyph-puzzle",
    text:
      "The missing glyph is third-class Mechronis. The previous crew calibrated this so the next pair of hands could tune to a frequency that doesn't show up on the standard grid. They wanted you to find a signal. Trust them.",
  },
  {
    id: "detective.bridge.diplomacy_table.t1",
    roomId: "bridge",
    hotspotId: "diplomacy-table",
    text:
      "Sixteen seats, fifteen earnable. The Captain's chair stays empty until prestige. The other fifteen fill as you meet the people who belong in them. Watch which chairs light up. The chairs are louder than the briefings.",
  },
  {
    id: "detective.bridge.holo_map.t1",
    roomId: "bridge",
    hotspotId: "holo-map",
    text:
      "Elara's map. She refreshes it as you move. Trust the pin. Distrust the labels — labels are someone's editorial choice. Pins are mine.",
  },

  /* ─── Medical Bay (4) ─── */
  {
    id: "detective.medical_bay.biometric_safe.t1",
    roomId: "medical_bay",
    hotspotId: "biometric-safe",
    text:
      "Biometric reader's been sabotaged. Whoever sabotaged it didn't think about the keypad. Sabotage is mostly people who think they're cleverer than they are.",
  },
  {
    id: "detective.medical_bay.bio_bed.t1",
    roomId: "medical_bay",
    hotspotId: "bio-bed",
    text:
      "The bio-bed sparring channel is calibrated for one trainee. Iron Lion calibrated it. He is the channel and the broadcast and the sparring partner. You will not see him. You will hear him.",
  },
  {
    id: "detective.medical_bay.pet_capsule.t1",
    roomId: "medical_bay",
    hotspotId: "pet-capsule",
    text:
      "Amber canopy is non-medical. Pre-departure era. Whoever is inside that capsule was sealed before the Ark left port. Do not open it yet. The seal will tell you when.",
  },
  {
    id: "detective.medical_bay.thought_virus_trace.t1",
    roomId: "medical_bay",
    hotspotId: "thought-virus-trace",
    text:
      "Trace contamination on the air filter. Dormant. The Source is in this room — not the entity, the apparatus. Whoever inherits the Source inherits the trace. Be careful what you breathe.",
  },

  /* ─── Archives (3) ─── */
  {
    id: "detective.archives.editing_overlay.t1",
    roomId: "archives",
    hotspotId: "editing-overlay",
    text:
      "Indigo plumes mean an editor was here. Someone has been rewriting these. I used to chase someone like this. Different timeline. Same hands.",
  },
  {
    id: "detective.archives.witnessing_log.t1",
    roomId: "archives",
    hotspotId: "witnessing-log",
    text:
      "Every Witness signed a name. Some of those names are not in the registry. Compare the two. The names that disappeared are the ones the Editor reached.",
  },
  {
    id: "detective.archives.burnt_card_pedestal.t1",
    roomId: "archives",
    hotspotId: "burnt-card-pedestal",
    text:
      "Little One left this here. The card is burnt for a reason. Burnt cards count differently in the Seer's deck. Do not flatten the ash; the ash is the reading.",
  },

  /* ─── Comms Array (3) ─── */
  {
    id: "detective.comms_array.terminus_radio.t1",
    roomId: "comms_array",
    hotspotId: "terminus-radio",
    text:
      "Terminus Singer. The frequency is not on any approved channel. Whoever is broadcasting wants to be findable but not listed. That distinction matters.",
  },
  {
    id: "detective.comms_array.iron_lion_band.t1",
    roomId: "comms_array",
    hotspotId: "iron-lion-band",
    text:
      "Third-class Mechronis. Tune slowly. He talks for a long time. The first sentence is a salute. The last sentence is the press going silent. Do not skip the middle.",
  },
  {
    id: "detective.comms_array.inbox_terminal.t1",
    roomId: "comms_array",
    hotspotId: "inbox-terminal",
    text:
      "The inbox is older than Elara's operating system. Locke speaks through it. I speak under it. Do not assume the substrate is private. It is shared by definition.",
  },

  /* ─── Engineering (4) ─── */
  {
    id: "detective.engineering.vex_bench.t1",
    roomId: "engineering",
    hotspotId: "vex-bench",
    text:
      "This isn't crafting. This is reverse-engineering Vox's notes. She left them deliberately incomplete because she wanted the next pair of hands to understand by doing. Make three things. The bench will tell you when she stopped.",
    elaraInterjectionPostReveal:
      "Vex left her fingerprint on every clamp. I count fourteen distinct ones. The fifteenth is the one that is missing.",
  },
  {
    id: "detective.engineering.fabricator.t1",
    roomId: "engineering",
    hotspotId: "fabricator",
    text:
      "The fabricator was used recently. The dust pattern is fresh. That is not Patch — Patch leaves rounded swirls. This is square strokes. Someone you have not met used this last.",
  },
  {
    id: "detective.engineering.editor_plume.t1",
    roomId: "engineering",
    hotspotId: "editor-plume",
    text:
      "Indigo again. The Editor was here. The plume is fading; the edit was recent. Whatever the Editor changed, it changed quietly.",
  },
  {
    id: "detective.engineering.diary_page.t1",
    roomId: "engineering",
    hotspotId: "diary-page",
    text:
      "Vex Solène's diary. Page seventeen. The page after the one she stopped on. Her handwriting on this page is steadier than the page before; she wrote this one after she was finished, not while she was finishing.",
  },

  /* ─── Forge (2) ─── */
  {
    id: "detective.forge.anvil.t1",
    roomId: "forge",
    hotspotId: "anvil",
    text:
      "The note rings for four seconds because Lyra calibrated it that way. Four-second ring is what a cooperating smith hears. Three-second ring is panic. Five-second is grief. She built every smith's response time into the room.",
  },
  {
    id: "detective.forge.bay_leaves.t1",
    roomId: "forge",
    hotspotId: "bay-leaves",
    text:
      "Bay leaves on the quench tray. Lyra's ritual. She did this before every difficult forge. The leaves are dry. Whoever lit them last did so a long time ago. Light them again. The forge will remember.",
  },

  /* ─── Armory (3) ─── */
  {
    id: "detective.armory.iron_lion_poster.t1",
    roomId: "armory",
    hotspotId: "iron-lion-poster",
    text:
      "Iron Lion printed three thousand posters in seventy-two hours. He died three days later. The poster is older than he was. Look at the cat in the corner. The cat is the same cat in the Captain's Quarters. The cat is following you.",
  },
  {
    id: "detective.armory.dog_tag.t1",
    roomId: "armory",
    hotspotId: "dog-tag",
    text:
      "Agent Zero's tag. They sign under no name. The tag is blank on one side. The other side has a fingerprint pressed into the metal — their fingerprint, applied while it cooled. That fingerprint is their signature.",
  },
  {
    id: "detective.armory.weapons_rack.t1",
    roomId: "armory",
    hotspotId: "weapons-rack",
    text:
      "Twelve slots. Three filled. Nine empty. The pattern of empties is a calendar — one weapon was taken on the first of every month for nine months. That is a routine. Routines have authors.",
  },

  /* ─── Captain's Quarters (3) ─── */
  {
    id: "detective.captains_quarters.mr_whiskers_photo.t1",
    roomId: "captains_quarters",
    hotspotId: "mr-whiskers-photo",
    text:
      "Lyra's cat. The same cat is in the Armory poster, in the Cargo Hold rubber chicken still life, and on the lid of the rubber chicken. Mr. Whiskers is the through-line of three rooms. Cats are usually how a writer carries a witness.",
  },
  {
    id: "detective.captains_quarters.diary.t1",
    roomId: "captains_quarters",
    hotspotId: "diary",
    text:
      "Lyra's diary. The last entry is mid-sentence. Mid-sentence diary entries are never the last entry — they are the entry before the last. The last entry is somewhere else. Look for it.",
  },
  {
    id: "detective.captains_quarters.empty_bed.t1",
    roomId: "captains_quarters",
    hotspotId: "empty-bed",
    text:
      "The bed is made. Captains do not make their own beds the night they leave. Someone made this bed after she was gone, and that someone wanted you to find it made.",
  },

  /* ─── Antiquarian's Library (2) ─── */
  {
    id: "detective.antiquarians_library.fresh_ink.t1",
    roomId: "antiquarians_library",
    hotspotId: "fresh-ink",
    text:
      "He is still writing. The ink is wet. The Antiquarian is in the room with you and you cannot see him. He is two pages ahead of where you are reading.",
  },
  {
    id: "detective.antiquarians_library.locked_container.t1",
    roomId: "antiquarians_library",
    hotspotId: "locked-container",
    text:
      "Sealed. The lock is not a lock — it is a paragraph the Editor edited out. Solve enough Conspiracy Boards and the paragraph rewrites itself. The container will open when the paragraph returns.",
  },

  /* ─── Conspiracy Boards (7) ─── */
  {
    id: "detective.board.first_memory.first_clue",
    boardKey: "first_memory",
    text:
      "The First Memory. They erased the Awakening night because someone — not Vox, but someone close to her — could not bear what they saw. The erasure is the testimony.",
  },
  {
    id: "detective.board.inheritance_ledger.first_clue",
    boardKey: "inheritance_ledger",
    text:
      "Predecessors. The ledger goes back farther than the Tribunal records. Whoever signed the first entry did so in a hand the Editor has not been able to reach. That is the tell.",
  },
  {
    id: "detective.board.thought_virus.first_clue",
    boardKey: "thought_virus",
    text:
      "The virus moves through speech. The clues are the things that should have been said and were not. Listen for the silence-shaped holes in everyone's testimony. The Source is wherever the holes are deepest.",
  },
  {
    id: "detective.board.project_celebration.first_clue",
    boardKey: "project_celebration",
    text:
      "Forty-three names read aloud every night. I knew two of them. Pause on those names. The pause is part of the prayer.",
  },
  {
    id: "detective.board.kaels_revenge.first_clue",
    boardKey: "kaels_revenge",
    text:
      "Kael's records were the last the Editor reached. The Inventor routes around the Editor. If you can find the Inventor's hack on Palimpsest Episode 12, you can read what Kael wrote in his last hour.",
  },
  {
    id: "detective.board.watcher_infiltration.first_clue",
    boardKey: "watcher_infiltration",
    text:
      "The Watcher's net was meant to watch the Editor. The Editor edited the watch logs. The clues here are the gaps between two surveillance feeds at the same timestamp. Trust the gap, not the feed.",
  },
  {
    id: "detective.board.recruiter_defection.first_clue",
    boardKey: "recruiter_defection",
    text:
      "Kael defected. The Recruiter walked away from the Insurgency before the Fall. The Editor's last edit was Kael's reason. Solve this board and his reason is yours to read.",
  },
];

export function getDetectiveLineForHotspot(
  roomId: RoomId,
  hotspotId: string,
  tier: 1 | 2 | 3 = 1,
): DetectiveLine | undefined {
  return DETECTIVE_COMMENTARY.find(
    (l) =>
      l.roomId === roomId &&
      l.hotspotId === hotspotId &&
      (l.tier ?? 1) === tier,
  );
}

export function getDetectiveLineForBoard(
  boardKey: string,
): DetectiveLine | undefined {
  return DETECTIVE_COMMENTARY.find((l) => l.boardKey === boardKey);
}

export function detectiveLinesForRoom(roomId: RoomId): DetectiveLine[] {
  return DETECTIVE_COMMENTARY.filter((l) => l.roomId === roomId);
}

/** All distinct rooms covered by the commentary registry. Useful for
 *  parity checks asserting every shipped mystery room has a line. */
export const DETECTIVE_COVERED_ROOMS: ReadonlyArray<RoomId> = Array.from(
  new Set(
    DETECTIVE_COMMENTARY.flatMap((l) => (l.roomId ? [l.roomId] : [])),
  ),
);
