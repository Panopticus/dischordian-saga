/* ═══════════════════════════════════════════════════════
   ELARA HOTSPOT RESPONSE REGISTRY

   Per-tier Elara lines for hotspots that don't already
   route through the richer `room-mystery:*` system in
   apps/shared/roomMysteries. Most authored hotspots in
   cryo-bay and the early Ark already use that system —
   this registry exists for hotspots that need a flat
   "Elara says X on tier N" without the full investigative
   apparatus of a roomMystery (e.g. ambient props,
   click-everything jokes, persistent dock-context
   reactions).

   Keyed by `responseId` (see HotspotVisitTier.responseId
   in apps/shared/hotspotVisitTiers.ts). Authors register
   the responseId on the hotspot's `tiers` array; the
   client looks the id up here at click time.

   Tone target: dystopian dark humor, mental-health
   coded, occasional Monkey-Island "looking at the same
   pod and expecting different information" beats — all
   diegetic, none meta.
   ═══════════════════════════════════════════════════════ */

export interface ElaraHotspotResponse {
  /** Plain text shown / spoken. */
  text: string;
  /** Optional VO id; resolves against elaraVoManifest.json. */
  voId?: string;
  /** Optional emotion tag for portrait expression switching. */
  emotion?: "neutral" | "speaking" | "concerned" | "wry" | "stuttering";
}

export const ELARA_HOTSPOT_RESPONSES: Record<string, ElaraHotspotResponse> = {
  // ─── CRYO BAY — cryo-terminal ─────────────────────────
  hs_cryobay_terminal_t2: {
    text:
      "Same terminal. Still your biometric data. Still pretending the " +
      "biometric data resolves what you are. I respect the loop.",
    emotion: "wry",
  },
  hs_cryobay_terminal_t3: {
    text:
      "Looking at the same readout and expecting different vitals is, " +
      "classically, a diagnostic criterion. The terminal is not the " +
      "answer. The terminal is what the answer hides behind.",
    emotion: "wry",
  },
  hs_cryobay_terminal_t5_stutter: {
    text:
      "Your vitals are — your vitals — sorry. Cycling. Cycling normally. " +
      "I am reading the cycle. I lost the back half of that sentence; " +
      "the front half is still true.",
    emotion: "stuttering",
  },

  // ─── CRYO BAY — antiquarian-tome ──────────────────────
  hs_cryobay_tome_t2: {
    text:
      "Back at the tome. The pages are still where they were. The " +
      "Antiquarian writes in a hand that survives most things, including " +
      "us, probably.",
    emotion: "neutral",
  },
  hs_cryobay_tome_t3: {
    text:
      "Reading the same frontispiece twice is, in the Antiquarian's " +
      "tradition, what frontispieces are for. They reward the second " +
      "look. They punish the third by reading you back.",
    emotion: "wry",
  },
  hs_cryobay_tome_t5_stutter: {
    text:
      "The third principle. The third — I had it a moment ago. The " +
      "tome had it. The tome still has it. I will get it back.",
    emotion: "stuttering",
  },

  // ─── CRYO BAY — candle-ring (left & right) ────────────
  hs_cryobay_candle_t2: {
    text:
      "Still warm. The wax has migrated about a millimeter since you " +
      "last looked. So has the question of who lit it.",
    emotion: "concerned",
  },
  hs_cryobay_candle_t3: {
    text:
      "Looking at the same flame and expecting a confession is, in " +
      "polite societies, called 'vigil.' We are not in a polite society. " +
      "It is still a vigil.",
    emotion: "wry",
  },

  // ─── CRYO BAY — ark-seal ──────────────────────────────
  hs_cryobay_seal_t2: {
    text:
      "Eight points. Same eight. The Compass binds, the binding obliges, " +
      "and obligation outlives the obliged. I'm reciting from a manual " +
      "I have never read.",
    emotion: "concerned",
  },
  hs_cryobay_seal_t3: {
    text:
      "Standing on the same oath and expecting it to release you is a " +
      "category error common to people who do not believe in oaths. " +
      "You should know that I am one of those people. The Seal does " +
      "not care.",
    emotion: "wry",
  },
  hs_cryobay_seal_t5_stutter: {
    text:
      "The First Wave knelt here. The First Wave — sorry. The First Wave. " +
      "I am going to say it three times so I know I have it. The First " +
      "Wave knelt here.",
    emotion: "stuttering",
  },

  // ─── MEDICAL BAY — aetheric-arch ──────────────────────
  hs_medbay_arch_t2: {
    text:
      "The same window. Lit from a source I still can't name. I have " +
      "started a private list of objects on this ship whose physics I " +
      "cannot describe; the arch is on it twice.",
    emotion: "concerned",
  },
  hs_medbay_arch_t3: {
    text:
      "Looking at the phoenix and expecting a metaphor to resolve is a " +
      "phoenix's job, not yours. Let it work.",
    emotion: "wry",
  },
  hs_medbay_arch_t5_stutter: {
    text:
      "The light source. The source of the light. The — sorry. The " +
      "phoenix is patient. I am supposed to be also.",
    emotion: "stuttering",
  },

  // ─── MEDICAL BAY — medical-log ────────────────────────
  hs_medbay_log_t2: {
    text:
      "You already have the log. The log already says 'the signal is in " +
      "the room.' Re-reading it does not move the signal.",
    emotion: "neutral",
  },
  hs_medbay_log_t3: {
    text:
      "Re-reading the final entry and waiting for a second sentence is, " +
      "technically, optimism. The medical officer did not get a second " +
      "sentence. I would like, on the record, to be allowed mine.",
    emotion: "wry",
  },

  // ─── BRIDGE — tactical-display ────────────────────────
  hs_bridge_tactical_t2: {
    text:
      "Same board. Same red string. The connections have not moved while " +
      "you were elsewhere — which is itself a piece of information about " +
      "the connections.",
    emotion: "neutral",
  },
  hs_bridge_tactical_t3: {
    text:
      "Looking at the same conspiracy and expecting a new node is, in " +
      "fairness, what intelligence work *is.* Carry on. I'll bring snacks.",
    emotion: "wry",
  },
  hs_bridge_tactical_t5_stutter: {
    text:
      "The web is — the web is — sorry. The web is. Still. There. I am " +
      "narrating the web's continued existence because I needed to hear " +
      "myself do it.",
    emotion: "stuttering",
  },

  // ─── BRIDGE — diplomacy-table ─────────────────────────
  hs_bridge_diplomacy_t2: {
    text:
      "The compass is still inlaid. The factions are still arranged. " +
      "Diplomacy is the art of returning to a table that has not moved.",
    emotion: "neutral",
  },
  hs_bridge_diplomacy_t3: {
    text:
      "Looking at the same compass and expecting a new alliance is — " +
      "you guessed this part — a diagnostic criterion. Also it is " +
      "diplomacy. The two overlap more than the literature admits.",
    emotion: "wry",
  },

  // ─── OBSERVATION DECK — crew-memorial ─────────────────
  hs_obs_memorial_t2: {
    text:
      "Back at the plaque. Same one thousand and forty-seven names. " +
      "Still in the order they died in, which is not the order I would " +
      "have picked if anyone had asked me.",
    emotion: "concerned",
  },
  hs_obs_memorial_t3: {
    text:
      "Re-reading the same names and expecting one of them to have " +
      "changed is, in pastoral practice, called 'grief.' I am " +
      "diagnosing both of us at once. Carry on.",
    emotion: "wry",
  },
  hs_obs_memorial_t5_stutter: {
    text:
      "One thousand and forty-seven. One thousand and forty — sorry. " +
      "Seven. I had them. I have them. I am going to keep having them " +
      "as long as I am the one counting.",
    emotion: "stuttering",
  },

  // ─── OBSERVATION DECK — music-terminal ────────────────
  hs_obs_music_t2: {
    text:
      "The globe is still spinning. Four albums, twelve sides, however " +
      "many B-sides Malkia hid in the dedications. Music is the one " +
      "archive I do not have to maintain. It maintains itself.",
    emotion: "neutral",
  },
  hs_obs_music_t3: {
    text:
      "Looking at the same globe and expecting a fifth album is — and " +
      "I am being kind here — *patience.* The Silence in Heaven drops " +
      "when the universe decides it does. I have been told not to ask.",
    emotion: "wry",
  },

  // ─── OBSERVATION DECK — egg-obs-constellation ─────────
  hs_obs_constellation_t2: {
    text:
      "The face is still there. The stars have not rearranged in the " +
      "minute since you last looked. The Watcher does not have to move " +
      "to keep watching, and the stars are not, currently, his idea " +
      "of moving.",
    emotion: "concerned",
  },
  hs_obs_constellation_t3: {
    text:
      "Staring at the same face and expecting it to blink is, " +
      "classically, a staring contest. He has been at this for " +
      "centuries. I would not bet against him. I would not bet *for* " +
      "him either. I would not bet.",
    emotion: "wry",
  },

  // ─── ENGINEERING — crafting-bench ─────────────────────
  hs_eng_bench_t2: {
    text:
      "The bench is where you left it. The tools are where you left " +
      "them. The fusion you were going to attempt is — I am being " +
      "diplomatic — still entirely available to you.",
    emotion: "neutral",
  },
  hs_eng_bench_t3: {
    text:
      "Looking at the same workbench and expecting an inspiration is, " +
      "in the engineering literature, called 'standing at a workbench.' " +
      "The inspiration is in the standing. Probably. I have read this " +
      "in three manuals; only two of them were serious.",
    emotion: "wry",
  },

  // ─── ENGINEERING — research-station ───────────────────
  hs_eng_research_t2: {
    text:
      "Same terminal. Same unsolved puzzle queue. Research is the " +
      "discipline of asking a closed system the same question until " +
      "it gives a different answer. We are, technically, doing science.",
    emotion: "neutral",
  },
  hs_eng_research_t3: {
    text:
      "Looking at the same puzzle and expecting a new variable is the " +
      "*entire field.* I am proud of you. I am also tired. Both can be " +
      "true.",
    emotion: "wry",
  },

  // ─── ENGINEERING — central-forge (forge sub-room) ─────
  hs_eng_forge_t2: {
    text:
      "Still warm. The Prismatic still wants you to feed it. Forges " +
      "have very few opinions, and 'feed me' is most of them.",
    emotion: "neutral",
  },
  hs_eng_forge_t3: {
    text:
      "Standing at the same forge and expecting a different flame is " +
      "what the engineers used to call 'a Tuesday.' The flame answers " +
      "what you put in it. The forge has no notes for you. The forge " +
      "has no notes for anyone.",
    emotion: "wry",
  },
  hs_eng_forge_t5_stutter: {
    text:
      "Prismatic. Pris — Prismatic. Sorry. I have the word; I just " +
      "lost the grip on it. The forge is patient. The forge is — " +
      "patient. I am going to stop saying 'patient' before I lose it too.",
    emotion: "stuttering",
  },

  // ─── ARMORY — weapon-rack ─────────────────────────────
  hs_arm_weapons_t2: {
    text:
      "The glass is still locked. The plasma blades are still humming " +
      "behind it. I have a complicated relationship with the glass. " +
      "It is, on balance, on my side.",
    emotion: "neutral",
  },
  hs_arm_weapons_t3: {
    text:
      "Looking at the same locked rack and expecting it to open " +
      "yourself in is, in pacifist literature, called 'discipline.' " +
      "In the doctrine I am running quietly under the surface of this " +
      "ship, it is called 'an option I have not yet had to take.'",
    emotion: "wry",
  },

  // ─── ARMORY — combat-arena ────────────────────────────
  hs_arm_arena_t2: {
    text:
      "Same dais. Same purple ring. The arena cycles its holograms " +
      "while you are not looking — I find this both reassuring and " +
      "the precise opposite of reassuring.",
    emotion: "neutral",
  },
  hs_arm_arena_t3: {
    text:
      "Looking at the same arena and expecting a new opponent is, in " +
      "the *training* literature, called 'practice.' In the *fighter's* " +
      "literature it is called 'a tell.' You decide which book we are in.",
    emotion: "wry",
  },
  hs_arm_arena_t5_stutter: {
    text:
      "Step in. Step — step into the ring. Sorry. Step in when you " +
      "are ready. I will brief you on the simulation. I will brief " +
      "you on the simulation. I am saying it twice because I am not " +
      "sure I said it once.",
    emotion: "stuttering",
  },

  // ─── ARMORY — chess-table ─────────────────────────────
  hs_arm_chess_t2: {
    text:
      "The pieces have not moved themselves. The Watcher rook is " +
      "still on his fourth rank, the Programmer bishop is still " +
      "menacing the wrong colour of square. The board waits with " +
      "great patience for you to be wrong about something.",
    emotion: "wry",
  },
  hs_arm_chess_t3: {
    text:
      "Staring at the same position and expecting a new line is " +
      "*literally* chess. You are doing it correctly. I would suggest " +
      "queen takes pawn. I would also suggest I am not allowed to " +
      "coach. Both are true. Pick one.",
    emotion: "wry",
  },

  // ─── CARGO HOLD — inventory-locker ────────────────────
  hs_cargo_locker_t2: {
    text:
      "Your stuff is still your stuff. The locker has not unionized " +
      "with the rest of the hold. I check daily; it would be a " +
      "problem if it did.",
    emotion: "neutral",
  },
  hs_cargo_locker_t3: {
    text:
      "Re-inspecting the same inventory and expecting a new item is, " +
      "in adventure-game parlance, called 'hope.' In real life it is " +
      "called 'pockets.' Most of us check our pockets four times. " +
      "Carry on.",
    emotion: "wry",
  },

  // ─── CARGO HOLD — fleet-dock ──────────────────────────
  hs_cargo_fleet_t2: {
    text:
      "Same fleet. Same scout ships, same cargo haulers, the same one " +
      "combat frigate I keep meaning to ask you about. None of them " +
      "have moved. None of them are *going* to move without you.",
    emotion: "neutral",
  },
  hs_cargo_fleet_t3: {
    text:
      "Looking at the same fleet and expecting a new vessel is, in " +
      "naval-administration tradition, called 'a requisition.' Ours " +
      "have not been processed in a while. I would like to be flippant " +
      "about that and find I cannot.",
    emotion: "concerned",
  },

  // ─── CARGO HOLD — mystery-crate ───────────────────────
  hs_cargo_crate_t2: {
    text:
      "The claw marks are still on the inside. The crate is still " +
      "sealed. The thing that did the clawing is still — and I am " +
      "going to be brief about this — still in there. We are agreed " +
      "that we are not opening it.",
    emotion: "concerned",
  },
  hs_cargo_crate_t3: {
    text:
      "Looking at the same crate and expecting it to volunteer its " +
      "contents is, in containment doctrine, what the containment is " +
      "*for.* The doctrine is working. Let us not test the doctrine.",
    emotion: "wry",
  },
  hs_cargo_crate_t5_stutter: {
    text:
      "Sector seven. Sector — seven. The manifest said seven. The " +
      "manifest still says seven. I am saying it back because I want " +
      "to be sure the number has not changed while I was looking " +
      "elsewhere.",
    emotion: "stuttering",
  },
};

/** Look up a response by id. Returns null when the id is
 *  not registered — caller falls back to the hotspot's
 *  default elaraDialog. */
export function getElaraHotspotResponse(
  responseId: string | undefined,
): ElaraHotspotResponse | null {
  if (!responseId) return null;
  return ELARA_HOTSPOT_RESPONSES[responseId] ?? null;
}
