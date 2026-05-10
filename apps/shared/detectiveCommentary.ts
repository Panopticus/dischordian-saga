/* ═══════════════════════════════════════════════════════
   DETECTIVE COMMENTARY — The Human as mystery-mentor

   From Beat H Inbox onward (when the Detective video first
   plays), the Human gives Detective-style commentary on
   every room hotspot and conspiracy-board clue the player
   examines. After the Act 4 reveal (Human Reveal video, the
   four lives collapse into one), Elara may interject on
   replay so the player hears both narrators reading the
   same scene.

   Beat H opens with the Detective's lead-in line:
     "It all started back when I used to solve problems
      for the Authority."
   The room commentary below sprinkles Authority-Tribunal
   callbacks (Vernon Vortex / Wanda Wyrlord / Wayne Warden,
   Cycle C Authority opponents) so the lead-in pays off
   retroactively as the player walks the ship.

   Coverage targets — every non-species-exclusive room
   mystery module has at least one Detective hotspot line.
   The seven conspiracy boards each have a first-clue line.

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
  | "antiquarians_library"
  | "cargo_hold"
  | "chaos_forge"
  | "cipher_den"
  | "dreams_workshop"
  | "elemental_nexus"
  | "engineering_core"
  | "forge_workshop"
  | "guild_sanctum"
  | "observation_deck"
  | "oracle_sanctum"
  | "order_tribunal"
  | "quantum_lab"
  | "shadow_vault"
  | "social_hub"
  | "station_dock"
  | "synthesis_chamber"
  | "war_room";

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

  /* ─── Cargo Hold (3) ─── */
  {
    id: "detective.cargo_hold.pulley_chicken.t1",
    roomId: "cargo_hold",
    hotspotId: "clue-cargo-hold-pulley-chicken",
    text:
      "The pulley still has weight on it. The chicken is the lid of a still life Lyra arranged before she left. Mr. Whiskers is in the painting on the lid. Three rooms now — Armory, Captain's Quarters, here. Cats are how a writer carries a witness.",
    elaraInterjectionPostReveal:
      "He counted four cats once. The fourth was in the Forge, painted into the bay-leaf jar. He missed it. I will not tell him.",
  },
  {
    id: "detective.cargo_hold.manifest_torn.t1",
    roomId: "cargo_hold",
    hotspotId: "manifest-torn",
    text:
      "Cargo manifest is torn at the seventh entry. Seven is the number the Editor likes. When a list goes missing at seven you are reading an edit, not a tear.",
  },
  {
    id: "detective.cargo_hold.dust_outline.t1",
    roomId: "cargo_hold",
    hotspotId: "dust-outline",
    text:
      "Dust outline. Something heavy was here for a long time and was carried out recently. The outline is rectangular in two places and rounded in one. Two crates and a barrel. Track the barrel — barrels move slower than crates.",
  },

  /* ─── Chaos Forge (3) ─── */
  {
    id: "detective.chaos_forge.asymmetric_anvil.t1",
    roomId: "chaos_forge",
    hotspotId: "clue-chaos-forge-asymmetric-anvil",
    text:
      "The anvil is asymmetric on purpose. Wanda Wyrlord built it that way. I cleaned a desk for her once at the Authority — the leg was uneven and she said the wobble was the point. Same hands, same lesson. Nothing here is balanced; the imbalance is the calibration.",
  },
  {
    id: "detective.chaos_forge.entropy_vat.t1",
    roomId: "chaos_forge",
    hotspotId: "clue-chaos-forge-entropy-vat",
    text:
      "Entropy vat is half full. Half is the operating point — full is contained, empty is consumed. Whoever last drew from it knew the math. They left enough for one more pour.",
  },
  {
    id: "detective.chaos_forge.scorched_floor.t1",
    roomId: "chaos_forge",
    hotspotId: "scorched-floor",
    text:
      "Three scorch rings, concentric. Concentric burns mean the smith was standing still. Lyra never stood still. This was someone else.",
  },

  /* ─── Cipher Den (3) ─── */
  {
    id: "detective.cipher_den.rosetta_vox.t1",
    roomId: "cipher_den",
    hotspotId: "clue-cipher-rosetta-vox",
    text:
      "Vox left a Rosetta. She did not have to. She left it because she wanted whoever reads after her to read what the Editor wrote in his own hand. The Rosetta is the gift. The gift is the case.",
  },
  {
    id: "detective.cipher_den.bench_vox_built.t1",
    roomId: "cipher_den",
    hotspotId: "clue-cipher-bench-vox-built",
    text:
      "Vox built this bench. The seat is too high — she was taller than the average crew member, and she did not redesign for them, she designed for herself. People who design for themselves leave clearer evidence than people who design for everyone.",
  },
  {
    id: "detective.cipher_den.vox_wraith_correspondence.t1",
    roomId: "cipher_den",
    hotspotId: "clue-cipher-vox-wraith-correspondence",
    text:
      "Vox-Wraith correspondence. The Wraith answered her in symbols she had not taught it. That is the tell. The Wraith was not learning from her — it was learning from someone she was learning from. Two ciphers, three correspondents. Find the third.",
  },

  /* ─── Dreams Workshop (3) ─── */
  {
    id: "detective.dreams_workshop.loom_shy.t1",
    roomId: "dreams_workshop",
    hotspotId: "clue-dreams-loom-shy",
    text:
      "The loom is shy. It will not weave while you watch it. Step back. Look at the threads it has already woven; the loom is the witness, not the subject. The pattern in the cloth is what the Dreamer was told to forget.",
  },
  {
    id: "detective.dreams_workshop.pre_ark_vials.t1",
    roomId: "dreams_workshop",
    hotspotId: "clue-dreams-pre-ark-vials",
    text:
      "Pre-Ark vials. Sealed before the launch. The labels are in the old hand — before the Editor reached the labels. Whatever is in these vials, the names are still true. That is rare.",
  },
  {
    id: "detective.dreams_workshop.mirror_pool_ceiling.t1",
    roomId: "dreams_workshop",
    hotspotId: "clue-dreams-mirror-pool-pre-ark-ceiling",
    text:
      "The pool reflects the ceiling. The ceiling shows pre-Ark sky. They built this room to make the loom remember a place it could not have been. If you look up too long, the pool will start to ask you what you remember. Do not answer.",
  },

  /* ─── Elemental Nexus (2) ─── */
  {
    id: "detective.elemental_nexus.empty_centre.t1",
    roomId: "elemental_nexus",
    hotspotId: "clue-nexus-empty-centre",
    text:
      "The centre is empty on purpose. Five elements arranged around a sixth that has not been earned. The sixth is the thing the player brings. Do not put anything there until you know what you are putting there.",
  },
  {
    id: "detective.elemental_nexus.half_assembled_pillar.t1",
    roomId: "elemental_nexus",
    hotspotId: "clue-nexus-half-assembled-pillar",
    text:
      "Half-assembled pillar. The work was interrupted, not abandoned. Whoever was building it expected to come back. They did not. Carry their tools the way they would have. The pillar tells you when it is done.",
  },

  /* ─── Engineering Core (3) ─── */
  {
    id: "detective.engineering_core.hardware_intact.t1",
    roomId: "engineering_core",
    hotspotId: "clue-eng-core-hardware-intact",
    text:
      "Hardware is intact. That is the strange thing. A core that goes silent is usually a core that broke. This one chose. Choice leaves different evidence than failure — the panels are clean, the seals are precise. This was a shutdown someone meant to be reversible.",
  },
  {
    id: "detective.engineering_core.coolant_future_repair.t1",
    roomId: "engineering_core",
    hotspotId: "clue-eng-core-coolant-future-repair",
    text:
      "Coolant left at three-quarters. Engineers leave coolant at three-quarters when they expect a repair team. Vex Solène left it that way. She thought someone would come back for it. She was right. You are the someone.",
  },
  {
    id: "detective.engineering_core.shutdown_lockplate.t1",
    roomId: "engineering_core",
    hotspotId: "clue-eng-core-shutdown-lockplate",
    text:
      "Shutdown lockplate is signed. The signature is partial — only the first two letters. Vox starts with V. The Engineer's last name does too. Ambiguity is sometimes the signature.",
    elaraInterjectionPostReveal:
      "The third letter is on the underside of the plate. It is an X. He never thought to lift it.",
  },

  /* ─── Forge Workshop (3) ─── */
  {
    id: "detective.forge_workshop.anvil_centre.t1",
    roomId: "forge_workshop",
    hotspotId: "clue-forge-anvil-centre",
    text:
      "Centre anvil. This is the old anvil — the one Lyra inherited from her teacher. The patina is wrong on the south face; someone reseated it after she left. They wanted the anvil to ring the same way for whoever came next. They were almost successful.",
  },
  {
    id: "detective.forge_workshop.editor_weapon_schema.t1",
    roomId: "forge_workshop",
    hotspotId: "clue-forge-editor-weapon-schema",
    text:
      "Weapon schema, in indigo. The Editor has been here too. He drafted a weapon Lyra would have refused to forge. He drafted it anyway. The point of the draft was not the weapon — it was the knowledge that he had drafted it.",
  },
  {
    id: "detective.forge_workshop.bay_leaf_tradition.t1",
    roomId: "forge_workshop",
    hotspotId: "clue-forge-bay-leaf-tradition",
    text:
      "Bay leaves. Same ritual as the other forge — same hand, different decade. Lyra did this twice in her life. The second time she knew it was the second time. The leaves remember.",
  },

  /* ─── Guild Sanctum (2) ─── */
  {
    id: "detective.guild_sanctum.engraved_history.t1",
    roomId: "guild_sanctum",
    hotspotId: "clue-guild-sanctum-engraved-history",
    text:
      "Engraved guild history. Read the gaps. Three names were engraved and then chiseled out. The chisel marks are the same depth as the engraving — same hand, removing its own work. The Guild is the only authority that edits itself in stone.",
  },
  {
    id: "detective.guild_sanctum.allegiance_pad.t1",
    roomId: "guild_sanctum",
    hotspotId: "clue-guild-sanctum-allegiance-pad",
    text:
      "Allegiance pad. The pad reads pressure, not identity. Whoever stood here last weighed what you weigh, give or take a kilogram. That is not a coincidence. The pad was calibrated for someone like you.",
  },

  /* ─── Observation Deck (3) ─── */
  {
    id: "detective.observation_deck.viewport_real.t1",
    roomId: "observation_deck",
    hotspotId: "clue-obs-viewport-real",
    text:
      "Real viewport. Most stations fake them — a screen is cheaper than transparent armor. This one is real glass. Whoever built this room wanted to be seen as much as they wanted to see. Symmetry is the tell.",
  },
  {
    id: "detective.observation_deck.cradle_empty.t1",
    roomId: "observation_deck",
    hotspotId: "clue-obs-cradle-empty",
    text:
      "Empty cradle. The shape it holds is the shape of a crystal you have not earned yet. The cradle is the promise. The promise is the case.",
  },
  {
    id: "detective.observation_deck.altar_described.t1",
    roomId: "observation_deck",
    hotspotId: "clue-obs-altar-described",
    text:
      "The altar describes itself. Read the inscription twice — once for what it says, once for what it leaves unsaid. The unsaid is the actual altar; the carving is the cover.",
  },

  /* ─── Oracle Sanctum (3) ─── */
  {
    id: "detective.oracle_sanctum.pool_aperture.t1",
    roomId: "oracle_sanctum",
    hotspotId: "clue-oracle-pool-aperture",
    text:
      "Pool aperture is sealed from below. From below is where the Seer kneels. Whoever sealed it did not want her to see something she had already seen. Sealing what someone has already seen is theatre, not security.",
  },
  {
    id: "detective.oracle_sanctum.tablet_many_readings.t1",
    roomId: "oracle_sanctum",
    hotspotId: "clue-oracle-tablet-many-readings",
    text:
      "Tablet has been read by many hands. The wear pattern is concentric — most readers touched the rim, fewer touched the centre, only one touched the seal. The seal will tell you which one.",
  },
  {
    id: "detective.oracle_sanctum.seers_cabinet.t1",
    roomId: "oracle_sanctum",
    hotspotId: "clue-oracle-seers-cabinet",
    text:
      "Seer's cabinet. The lock is not a lock — it is an attendance ledger. The cabinet opens when the right number of people are in the room. That number is sometimes one. Sometimes it is none.",
  },

  /* ─── Order Tribunal (3) ─── */
  {
    id: "detective.order_tribunal.bench_pre_ark.t1",
    roomId: "order_tribunal",
    hotspotId: "clue-tribunal-bench-pre-ark",
    text:
      "Pre-Ark bench. I sat at one of these. Not as a judge — as the person who cleaned them after court. Wanda Wyrlord left rings of tea on the third bench every Wednesday. The third bench here has the same rings. They moved the bench, not the magistrate.",
    elaraInterjectionPostReveal:
      "He cleaned five years of those rings. He told me once they were the only consistent thing in the building.",
  },
  {
    id: "detective.order_tribunal.open_case_against_editor.t1",
    roomId: "order_tribunal",
    hotspotId: "clue-tribunal-open-case-against-editor",
    text:
      "Open case against the Editor. Filed by Vernon Vortex before he was Vernon Vortex. The case number is sequential with three of mine. We were filing in the same week and we did not know it. The Editor knew.",
  },
  {
    id: "detective.order_tribunal.audit_ledger.t1",
    roomId: "order_tribunal",
    hotspotId: "clue-tribunal-audit-ledger",
    text:
      "Audit ledger. The Authority audits itself once every seven cycles. This one is two cycles overdue. Overdue audits are how empires fall. Wayne Warden would have caught this. Wayne Warden was not here.",
  },

  /* ─── Quantum Lab (2) ─── */
  {
    id: "detective.quantum_lab.lag.t1",
    roomId: "quantum_lab",
    hotspotId: "clue-quantum-lab-lag",
    text:
      "There is lag. The room thinks half a second behind the rest of the ship. That is not equipment — that is a Wraith listening through the walls. The lag is the listening time. Whisper.",
  },
  {
    id: "detective.quantum_lab.wraith_faraday_note.t1",
    roomId: "quantum_lab",
    hotspotId: "clue-quantum-lab-wraith-faraday-note",
    text:
      "Faraday note pinned inside the cage. Pinned by a Wraith. The Wraith left it for the next Wraith. We are reading mail addressed to someone we are not. Read it gently.",
  },

  /* ─── Shadow Vault (3) ─── */
  {
    id: "detective.shadow_vault.meeting.t1",
    roomId: "shadow_vault",
    hotspotId: "clue-shadow-vault-meeting",
    text:
      "Two chairs pulled apart further than the table required. People who fear being overheard sit further apart, not closer. They were not whispering. They were measuring distance.",
  },
  {
    id: "detective.shadow_vault.warden_watch_continuous.t1",
    roomId: "shadow_vault",
    hotspotId: "clue-shadow-vault-warden-watch-continuous",
    text:
      "Warden watch is continuous. Wayne Warden's protocol — never leave a vault unwatched, even between shifts. The log shows no gap. That is impressive. That is also the tell. A real Warden takes one bathroom break per cycle. This log shows none.",
  },
  {
    id: "detective.shadow_vault.lever_deliberate_weight.t1",
    roomId: "shadow_vault",
    hotspotId: "clue-shadow-vault-lever-deliberate-weight",
    text:
      "The lever resists at exactly the weight of the manuscript inside. That is not a counterweight — that is a confession. Whoever set the resistance wanted the next person to know precisely what they were lifting.",
  },

  /* ─── Social Hub (2) ─── */
  {
    id: "detective.social_hub.memorial_pinned.t1",
    roomId: "social_hub",
    hotspotId: "clue-social-hub-memorial-pinned",
    text:
      "Memorial pinned to the wall. The names are in three columns. The third column is the names that were never spoken aloud. The pin in the third column is bent. Someone read it and could not bear to leave it pinned. Someone else came back and re-pinned it. Both hands matter.",
  },
  {
    id: "detective.social_hub.mismatched_table.t1",
    roomId: "social_hub",
    hotspotId: "clue-social-hub-mismatched-table",
    text:
      "Mismatched table. Four chairs from four different rooms. This is a meeting that no department wanted to host. The chair from Engineering has Vex's mark. The chair from Archives has the Editor's plume. Two of the four are dead. The other two are still meeting.",
  },

  /* ─── Station Dock (3) ─── */
  {
    id: "detective.station_dock.waiting.t1",
    roomId: "station_dock",
    hotspotId: "clue-dock-waiting",
    text:
      "The dock is waiting. Empty docks are not idle — they are anticipating. The clamp settings have been adjusted for a hull profile we have not seen yet. Whoever set the clamps knows what is coming. They did not write it down.",
  },
  {
    id: "detective.station_dock.wraith_folio_departure.t1",
    roomId: "station_dock",
    hotspotId: "clue-dock-wraith-folio-departure",
    text:
      "Wraith folio. The departure log has a Wraith page in it. The Wraith left the way Wraiths leave — by signing in the same hand as the dockmaster. The dockmaster is dead. The signature is fresh.",
  },
  {
    id: "detective.station_dock.coda_books.t1",
    roomId: "station_dock",
    hotspotId: "clue-station-dock-coda-books",
    text:
      "Coda books. Every dock keeps one for the ships that came in but never left, and one for the ships that left but never came in. Both books have entries on the same date. That date is a meeting nobody scheduled.",
  },

  /* ─── Synthesis Chamber (2) ─── */
  {
    id: "detective.synthesis_chamber.vat_medbay_larder.t1",
    roomId: "synthesis_chamber",
    hotspotId: "clue-synthesis-vat-medbay-larder",
    text:
      "The vat doubles as a Med-bay larder. Two functions, one apparatus — that is how scarcity writes itself into architecture. The trace residue at the rim is half nutrient, half medicine. Whoever ate here was also being treated. The treatment was the meal.",
  },
  {
    id: "detective.synthesis_chamber.substrate_n_withheld.t1",
    roomId: "synthesis_chamber",
    hotspotId: "clue-synthesis-substrate-n-withheld",
    text:
      "Substrate N is withheld. Every other substrate is in the rack. N is the one the Editor uses. Withholding N is how you tell a forger that you know what they forge. The rack is a message.",
  },

  /* ─── War Room (3) ─── */
  {
    id: "detective.war_room.three_modes.t1",
    roomId: "war_room",
    hotspotId: "clue-war-room-three-modes",
    text:
      "Three planning modes. Defense, Mobilize, Withdraw. The fourth mode — the one that should be there — is missing. The missing mode is Surrender. Surrender was scrubbed. Scrubbing the option does not delete the choice.",
  },
  {
    id: "detective.war_room.protocol_zero.t1",
    roomId: "war_room",
    hotspotId: "clue-war-room-protocol-zero",
    text:
      "Protocol Zero. Authored by Wayne Warden. Filed sealed. Wayne Warden filed three sealed protocols in his life — this is the second. The first was a love letter he never delivered. The third has not been filed yet.",
  },
  {
    id: "detective.war_room.twelfth_flag.t1",
    roomId: "war_room",
    hotspotId: "clue-war-room-twelfth-flag",
    text:
      "Eleven flags. The twelfth slot is empty. Eleven is the count when the missing one is the one you are about to plant. Look at the slot, not the flags. The slot was sized for a banner you have not been given yet.",
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
