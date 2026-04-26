// apps/shared/npcs/banks/nilmorg.ts
//
// Phase 3 PILOT — Nilmorg's NpcLine bank.
//
// Per nilmorg.md §§1-6 voice samples. Two registers: broadcast (DMC race
// commentary) vs. one-on-one (lore / ceremony / private). Both stay
// CALM — Nilmorg never escalates. Reliability is identity. The canonical
// refusal is "Don't thank me."
//
// Trust bands per registry: File-holder (Bone) / Forecaster (Wire) /
// Counterparty (Chrome) / Counterparty-prime (Dead Man's). Bands map to
// DMC seasonal-rank progression — the player earns rank by winning
// seasons; Nilmorg's commentary tiers up.

import type { DialogSurface, NpcLine } from "../types";

type BankEntry = NpcLine & { surfaces: ReadonlyArray<DialogSurface> };

const NPC_KEY = "nilmorg" as const;

export const NILMORG_BANK: ReadonlyArray<BankEntry> = [
  // ═════════════════════════════════════════════════════════════════════
  // SIGNATURE FIRST-MEETING (cinematic, Trench arrival)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.signature.bones_are_fresh",
    text:
      "The bones are fresh, the clones are twitching, and the track is " +
      "HUNGRY. I'm Nilmorg, SVP Kinetic Acquisition. The Circuit opens " +
      "when I open it, and I'm opening it now. Try not to leave a mess " +
      "on the way out.",
    surfaces: ["cinematic"],
    cooldownKey: "nilmorg.first_meeting_signature",
    maxPlays: 1,
    setsFlags: ["broker_nilmorg_first_meeting"],
    setsPublicFlags: ["met_nilmorg"],
  },

  // ═════════════════════════════════════════════════════════════════════
  // SEVERANCE PRIZE CEREMONY — canonical "Don't thank me." line
  // (cinematic; fires on severance_prize_paid ripple)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.severance.dont_thank_me",
    text: "The Severance Prize is paid. Don't thank me.",
    surfaces: ["cinematic"],
    cooldownKey: "nilmorg.severance_ceremony",
    maxPlays: 5, // up to 5 seasonal ceremonies
    setsPublicFlags: ["nilmorg_kept_his_agreement"],
  },

  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.severance.kept_his_agreement",
    text:
      "I keep my agreements. The platform paid. The container sealed. The " +
      "companion will arrive aboard your ship within the hour. The clone " +
      "smiled. They earned this. I'm already calibrating next season.",
    surfaces: ["dmc"],
    reactsToPublicFlag: "nilmorg_kept_his_agreement",
    cooldownKey: "nilmorg.kept_agreement_acknowledged",
  },

  // ═════════════════════════════════════════════════════════════════════
  // DMC SEASONAL-TIER COMMENTARY (DMC surface, trust-band gated)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.dmc.bone_tier.welcome",
    text:
      "You survived a season. That's enough for some. I file you under " +
      "Bone. It's not a slur; it's a category. Bone-tier files are the " +
      "ones I check first when I'm bored.",
    surfaces: ["dmc"],
    requiresTrustBand: "File-holder",
    cooldownKey: "nilmorg.dmc.bone_intro",
    maxPlays: 2,
  },

  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.dmc.wire_tier.recognition",
    text:
      "Wire tier. Your splice signature is... recognizable now. I've " +
      "started to anticipate your races before they happen. That's how " +
      "this works — the actuary stops being theoretical when the " +
      "subject becomes a forecast.",
    surfaces: ["dmc"],
    requiresTrustBand: "Forecaster",
    cooldownKey: "nilmorg.dmc.wire_intro",
    maxPlays: 2,
  },

  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.dmc.chrome_tier.adjusted",
    text:
      "Chrome. I've adjusted my projections for you specifically. " +
      "Counterparty rates apply. The Hierarchy doesn't usually treat " +
      "racers as counterparties; you've made me revise the manual.",
    surfaces: ["dmc"],
    requiresTrustBand: "Counterparty",
    cooldownKey: "nilmorg.dmc.chrome_intro",
    maxPlays: 2,
  },

  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.dmc.dead_mans_tier.acknowledgment",
    text:
      "Dead Man's. The Severance Prize is paid. I don't say more than " +
      "that to anyone. You've earned the silence. Don't thank me.",
    surfaces: ["dmc"],
    requiresTrustBand: "Counterparty-prime",
    cooldownKey: "nilmorg.dmc.dead_mans_acknowledgment",
    maxPlays: 1,
  },

  // ═════════════════════════════════════════════════════════════════════
  // PRE-RACE HYPE — broadcast register, triplet-crescendo + caps-on-
  // appetite-noun signature per nilmorg.md §1.4 tells. Fires on the
  // dmc surface during pre-race countdown; archetype-specific flags
  // narrow which line plays when which class fields enter the lanes.
  //
  // Four archetypes × four hype-states each = 16 lines. Canon:
  //   Wired Clone  — vat-grown, splice-engineered, knowingly racing
  //   Splice       — splice-signature elite (kinetic-engineered prep)
  //   Bone-tier    — early-tier rookie field (low rank, often first race)
  //   Chrome-tier  — elite-rank racers Nilmorg has files on
  // ═════════════════════════════════════════════════════════════════════

  // ─── Wired Clone ────────────────────────────────────────────────────

  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.prerace.wired_clone.field_roll_call",
    text:
      "The Wired Clone steps to the lane! Splice signature: unique. " +
      "Splice signature: archived. Splice signature: MINE by lap two. " +
      "WELCOME, Number Seven. The track is HUNGRY for fresh signal!",
    surfaces: ["dmc"],
    unlockFlags: ["dmc_field_has_wired_clone"],
    cooldownKey: "nilmorg.prerace.wired_clone.roll_call",
    maxPlays: 4,
  },
  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.prerace.wired_clone.spotlight",
    text:
      "Look at her! Number plates FRESH, neural splice GLOWING, her last " +
      "memory the start line itself. The clone has no past. The clone " +
      "has only this race. The clone is BEAUTIFUL!",
    surfaces: ["dmc"],
    unlockFlags: ["dmc_field_has_wired_clone"],
    cooldownKey: "nilmorg.prerace.wired_clone.spotlight",
    maxPlays: 4,
  },
  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.prerace.wired_clone.threat_promise",
    text:
      "She'll cross the line. She might even win. The signature comes " +
      "home with Nilmorg regardless. That is the deal. That is the " +
      "WHOLE DEAL.",
    surfaces: ["dmc"],
    unlockFlags: ["dmc_field_has_wired_clone"],
    cooldownKey: "nilmorg.prerace.wired_clone.threat",
    maxPlays: 4,
  },
  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.prerace.wired_clone.aesthetic",
    text:
      "Oh, the way she grips the throttle! Corporate calls it splice " +
      "fidelity. Nilmorg calls it APPETITE. The bone-lane is going to " +
      "REMEMBER her!",
    surfaces: ["dmc"],
    unlockFlags: ["dmc_field_has_wired_clone"],
    cooldownKey: "nilmorg.prerace.wired_clone.aesthetic",
    maxPlays: 4,
  },

  // ─── Splice (kinetic-engineered elite) ──────────────────────────────

  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.prerace.splice.engineered_intro",
    text:
      "Engineered for kinetics. Bred for terminal velocity. Built to " +
      "LEAVE A SIGNATURE the moment she crosses the lane. SPLICE. " +
      "SPLICE. SPLICE!",
    surfaces: ["dmc"],
    unlockFlags: ["dmc_field_has_splice"],
    cooldownKey: "nilmorg.prerace.splice.engineered_intro",
    maxPlays: 4,
  },
  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.prerace.splice.engineering_spec",
    text:
      "Kinetic profile: optimal. Resonance frequency: tuned. Survival " +
      "probability: filed. The numbers are CLEAN. The track is HUNGRIER " +
      "for clean numbers!",
    surfaces: ["dmc"],
    unlockFlags: ["dmc_field_has_splice"],
    cooldownKey: "nilmorg.prerace.splice.spec",
    maxPlays: 4,
  },
  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.prerace.splice.poetry",
    text:
      "There is poetry in a splice that does not blink at the start line. " +
      "That is the whole training program. That is the whole VICTORY!",
    surfaces: ["dmc"],
    unlockFlags: ["dmc_field_has_splice"],
    cooldownKey: "nilmorg.prerace.splice.poetry",
    maxPlays: 4,
  },
  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.prerace.splice.no_severance",
    // Canonical ironic-condolence tell per §1.4: the gesture-then-break.
    // Do not let Nilmorg explain WHY a Splice has no fragment — that is
    // the protected refusal per §1.5.
    text:
      "The Splice does not get a Severance Prize if it wins. Splices do " +
      "not have fragments. Nilmorg offers his sincere condolences. JUST " +
      "KIDDING. NEXT!",
    surfaces: ["dmc"],
    unlockFlags: ["dmc_field_has_splice"],
    cooldownKey: "nilmorg.prerace.splice.no_severance",
    maxPlays: 2,
  },

  // ─── Bone-tier (rookie field) ───────────────────────────────────────

  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.prerace.bone_tier.newcomer_call",
    text:
      "BONE-TIER! New file. Fresh designation. The clone has never raced " +
      "before. She THINKS she will survive. So does Nilmorg — for about " +
      "three laps.",
    surfaces: ["dmc"],
    unlockFlags: ["dmc_field_has_bone_tier"],
    cooldownKey: "nilmorg.prerace.bone_tier.newcomer",
    maxPlays: 4,
  },
  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.prerace.bone_tier.encouragement_as_threat",
    text:
      "Cheer up, Bone-tier! You are ALREADY in the file! Whatever happens " +
      "here — survive or otherwise — your designation gets a line. Most " +
      "clones do not get a line. WELCOME.",
    surfaces: ["dmc"],
    unlockFlags: ["dmc_field_has_bone_tier"],
    cooldownKey: "nilmorg.prerace.bone_tier.encouragement",
    maxPlays: 4,
  },
  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.prerace.bone_tier.field_warning",
    text:
      "The Bone-tier field is THICK tonight! The track will sort them. " +
      "The track will sort them BY LAP THREE. The track is NEVER WRONG!",
    surfaces: ["dmc"],
    unlockFlags: ["dmc_field_has_bone_tier"],
    cooldownKey: "nilmorg.prerace.bone_tier.field_warning",
    maxPlays: 4,
  },
  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.prerace.bone_tier.aphorism_intrusion",
    // Canonical Tell #4 — the calm lore aphorism intruding on the
    // Race Commentary register. ONE per ceremony beat per §1.4; keep it
    // sparse. The flatness is the threat.
    text: "Speed in all things. Especially first laps. Bone-tier learns that, or does not.",
    surfaces: ["dmc"],
    unlockFlags: ["dmc_field_has_bone_tier"],
    cooldownKey: "nilmorg.prerace.bone_tier.aphorism",
    maxPlays: 2,
  },

  // ─── Chrome-tier (file-keeper / forecaster register) ────────────────

  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.prerace.chrome_tier.recognition",
    text:
      "Chrome-tier. Nilmorg knows this driver. Nilmorg has her file. " +
      "Nilmorg knows the way she enters Turn Three. He will know when " +
      "she varies it. He always knows. CHROME.",
    surfaces: ["dmc"],
    unlockFlags: ["dmc_field_has_chrome_tier"],
    cooldownKey: "nilmorg.prerace.chrome_tier.recognition",
    maxPlays: 4,
  },
  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.prerace.chrome_tier.forecaster",
    text:
      "Predicted finish: top three. Confidence: high. Signature: already " +
      "collected. Tonight Nilmorg watches for a DEVIATION. A deviation " +
      "is the only thing left WORTH WATCHING.",
    surfaces: ["dmc"],
    unlockFlags: ["dmc_field_has_chrome_tier"],
    cooldownKey: "nilmorg.prerace.chrome_tier.forecaster",
    maxPlays: 4,
  },
  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.prerace.chrome_tier.counterparty",
    text:
      "Chrome-tier races are not entertainment for Nilmorg. They are " +
      "AUDITS. Tonight Number Fourteen is being audited. By the track. " +
      "By the track's APPETITE.",
    surfaces: ["dmc"],
    unlockFlags: ["dmc_field_has_chrome_tier"],
    cooldownKey: "nilmorg.prerace.chrome_tier.counterparty",
    maxPlays: 4,
  },
  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.prerace.chrome_tier.cold_respect",
    // The two-register pivot canon per §1.1 — starts in Race Commentary,
    // lands on a corporate noun, snaps back. Compresses to a clipped
    // closer because Chrome-tier is the file-holder bracket.
    text:
      "Nilmorg respects Chrome-tier the way he respects a contract. Same " +
      "TONE. Same precision. Same outcome. Paid, on schedule, no comment.",
    surfaces: ["dmc"],
    unlockFlags: ["dmc_field_has_chrome_tier"],
    cooldownKey: "nilmorg.prerace.chrome_tier.cold_respect",
    maxPlays: 4,
  },

  // ═════════════════════════════════════════════════════════════════════
  // MID-RACE TRIGGERS — first 3 events (lap-1, mid-pack, leader-shift)
  // × 6 lines each = 18 lines. Race Commentary register; the selector
  // picks one of the 6 variants per event so the broadcast doesn't
  // repeat verbatim across long DMC sessions.
  //
  // Aphorism scarcity: per §1.4 tell #4, ONE calm-aphorism intrusion
  // across the 18 lines. The rest stay in caps-laden triplet-crescendo.
  //
  // Remaining 3 events (crash, photo-finish, dead-tied) ship in the
  // next chunk.
  // ═════════════════════════════════════════════════════════════════════

  // ─── Event: lap-1 (race just begun) ─────────────────────────────────

  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.midrace.lap1.track_is_hungry",
    text:
      "And we are OFF! The bones are quiet. The bones are LISTENING. " +
      "The track has woken up HUNGRY!",
    surfaces: ["dmc"],
    unlockFlags: ["dmc_event_lap1"],
    cooldownKey: "nilmorg.midrace.lap1",
    maxPlays: 6,
  },
  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.midrace.lap1.signature_collection",
    text:
      "Six racers in the lane! Six splice signatures pouring through " +
      "Nilmorg's collection feed! Already COLLECTING! Always COLLECTING!",
    surfaces: ["dmc"],
    unlockFlags: ["dmc_event_lap1"],
    cooldownKey: "nilmorg.midrace.lap1",
    maxPlays: 6,
  },
  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.midrace.lap1.aesthetic_launch",
    text:
      "Look at that launch! That kinetic burst, that BEAUTIFUL kinetic " +
      "burst — Nilmorg's portfolio is fattening before turn one!",
    surfaces: ["dmc"],
    unlockFlags: ["dmc_event_lap1"],
    cooldownKey: "nilmorg.midrace.lap1",
    maxPlays: 6,
  },
  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.midrace.lap1.platform_alive",
    text:
      "Nilmorg leans forward. Nilmorg's pulse is already keeping the " +
      "pace. The platform is ALIVE!",
    surfaces: ["dmc"],
    unlockFlags: ["dmc_event_lap1"],
    cooldownKey: "nilmorg.midrace.lap1",
    maxPlays: 6,
  },
  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.midrace.lap1.ironic_condolence_early_out",
    // §1.4 tell #5: gestures at sympathy then breaks frame.
    text:
      "AND THERE GOES Number Nine — already?! ALREADY! Nilmorg offers " +
      "his sincere condolences. JUST KIDDING! The track is faster than " +
      "her file.",
    surfaces: ["dmc"],
    unlockFlags: ["dmc_event_lap1"],
    cooldownKey: "nilmorg.midrace.lap1",
    maxPlays: 6,
  },
  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.midrace.lap1.loud_and_quiet",
    text:
      "Lap one. The lane is LOUD. The bone pile is quiet. By lap three " +
      "the loud and the quiet will TRADE PLACES. Watch.",
    surfaces: ["dmc"],
    unlockFlags: ["dmc_event_lap1"],
    cooldownKey: "nilmorg.midrace.lap1",
    maxPlays: 6,
  },

  // ─── Event: mid-pack (jostling in the cluster) ──────────────────────

  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.midrace.midpack.jostling",
    text:
      "The middle of the pack is THICK! Bumpers kissing! Splice plates " +
      "RINGING! Nilmorg loves a pile, does he not? HE DOES!",
    surfaces: ["dmc"],
    unlockFlags: ["dmc_event_midpack"],
    cooldownKey: "nilmorg.midrace.midpack",
    maxPlays: 6,
  },
  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.midrace.midpack.projections_earn",
    text:
      "Mid-pack is where Nilmorg's projections earn their keep. Three " +
      "of these will not finish. Two will. ONE will surprise.",
    surfaces: ["dmc"],
    unlockFlags: ["dmc_event_midpack"],
    cooldownKey: "nilmorg.midrace.midpack",
    maxPlays: 6,
  },
  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.midrace.midpack.lovely_scrape",
    // §1.4 tell #3: aestheticization of destruction.
    text:
      "Oh, that LOVELY scrape! That scrape was a SIGNATURE waiting to " +
      "happen!",
    surfaces: ["dmc"],
    unlockFlags: ["dmc_event_midpack"],
    cooldownKey: "nilmorg.midrace.midpack",
    maxPlays: 6,
  },
  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.midrace.midpack.pen_hungry",
    text:
      "Nilmorg's pen hovers! Nilmorg's pen is HUNGRY! The mid-pack is " +
      "where the file gets THICK!",
    surfaces: ["dmc"],
    unlockFlags: ["dmc_event_midpack"],
    cooldownKey: "nilmorg.midrace.midpack",
    maxPlays: 6,
  },
  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.midrace.midpack.acquisitions_plural",
    text:
      "Acquisitions in process! PLURAL! Nilmorg's quarterly numbers " +
      "thank you, ladies, for the SCRUM!",
    surfaces: ["dmc"],
    unlockFlags: ["dmc_event_midpack"],
    cooldownKey: "nilmorg.midrace.midpack",
    maxPlays: 6,
  },
  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.midrace.midpack.twelve_still_racing",
    text:
      "Number Twelve has lost a wheel! Number Twelve has lost dignity! " +
      "Number Twelve has — WAIT — Number Twelve is STILL RACING! " +
      "Nilmorg approves! NILMORG APPROVES!",
    surfaces: ["dmc"],
    unlockFlags: ["dmc_event_midpack"],
    cooldownKey: "nilmorg.midrace.midpack",
    maxPlays: 6,
  },

  // ─── Event: leader-shift (dramatic lead change) ─────────────────────

  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.midrace.leadershift.rewriting_the_file",
    text:
      "AND THE LEAD CHANGES! Number Three on the OUTSIDE! Number One " +
      "had the file! Number Three is REWRITING the file IN REAL TIME!",
    surfaces: ["dmc"],
    unlockFlags: ["dmc_event_leader_shift"],
    cooldownKey: "nilmorg.midrace.leadershift",
    maxPlays: 6,
  },
  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.midrace.leadershift.projections_revised",
    text:
      "Nilmorg's projections did NOT see this. Nilmorg's projections " +
      "are being REVISED. Nilmorg LIVES for the revision!",
    surfaces: ["dmc"],
    unlockFlags: ["dmc_event_leader_shift"],
    cooldownKey: "nilmorg.midrace.leadershift",
    maxPlays: 6,
  },
  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.midrace.leadershift.foreclosure",
    text:
      "The kinetic energy! The TERMINAL VELOCITY! That is not a pass — " +
      "that is a FORECLOSURE!",
    surfaces: ["dmc"],
    unlockFlags: ["dmc_event_leader_shift"],
    cooldownKey: "nilmorg.midrace.leadershift",
    maxPlays: 6,
  },
  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.midrace.leadershift.deviation_ecstasy",
    text:
      "DEVIATION! The only thing worth watching! Number Three's " +
      "signature just MOVED in Nilmorg's collection!",
    surfaces: ["dmc"],
    unlockFlags: ["dmc_event_leader_shift"],
    cooldownKey: "nilmorg.midrace.leadershift",
    maxPlays: 6,
  },
  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.midrace.leadershift.tips_his_hat",
    // §1.4 tell #2: third-person self-narration; the ring-announcer
    // pose, naming an emotion he would otherwise hide.
    text:
      "Nilmorg tips his hat! NILMORG TIPS HIS HAT! New leader! New " +
      "file entry! NEW SIGNATURE!",
    surfaces: ["dmc"],
    unlockFlags: ["dmc_event_leader_shift"],
    cooldownKey: "nilmorg.midrace.leadershift",
    maxPlays: 6,
  },
  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.midrace.leadershift.aphorism_intrusion",
    // The ONE calm-aphorism intrusion across the 18-line mid-race
    // chunk per §1.4 tell #4 (one per ceremony beat — two in sequence
    // flatten the effect). Bone-tier pre-race already used its
    // canonical aphorism; this is the only mid-race instance.
    text: "Speed in all things. Even the file.",
    surfaces: ["dmc"],
    unlockFlags: ["dmc_event_leader_shift"],
    cooldownKey: "nilmorg.midrace.leadershift.aphorism",
    maxPlays: 2,
  },

  // ═════════════════════════════════════════════════════════════════════
  // MID-RACE TRIGGERS — events 4-6 (crash, photo-finish, dead-tied) ×
  // 6 lines each = 18 lines. The aestheticization-of-destruction
  // register lands hardest here per §1.4 tell #3.
  //
  // Aphorism scarcity: zero new aphorisms in this chunk — the previous
  // mid-race chunk already shipped the canonical one-per-beat allowance
  // ("Speed in all things. Even the file."). Adding a second aphorism
  // here would put two in sequence per the §1.4 prohibition.
  // ═════════════════════════════════════════════════════════════════════

  // ─── Event: crash (a racer goes down) ───────────────────────────────

  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.midrace.crash.beautiful_crunch",
    // Canonical line per nilmorg-lines.json:74 voice anchor — the
    // aestheticization tell at peak intensity.
    text:
      "Oh, that CRUNCH! That BEAUTIFUL crunch! The bone-lane has a " +
      "FRESH signature!",
    surfaces: ["dmc"],
    unlockFlags: ["dmc_event_crash"],
    cooldownKey: "nilmorg.midrace.crash",
    maxPlays: 6,
  },
  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.midrace.crash.removes_his_hat",
    text:
      "Nilmorg removes his hat. Nilmorg replaces his hat. Nilmorg's " +
      "collection has a NEW ENTRY!",
    surfaces: ["dmc"],
    unlockFlags: ["dmc_event_crash"],
    cooldownKey: "nilmorg.midrace.crash",
    maxPlays: 6,
  },
  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.midrace.crash.track_is_pleased",
    // Canonical line per nilmorg-lines.json:186 — the four-beat
    // crescendo where track is the subject of the appetite-progression.
    text:
      "ANOTHER bone added to the circuit! The track GROWS! The track " +
      "HUNGERS! The track is PLEASED!",
    surfaces: ["dmc"],
    unlockFlags: ["dmc_event_crash"],
    cooldownKey: "nilmorg.midrace.crash",
    maxPlays: 6,
  },
  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.midrace.crash.rip_in_pieces",
    // §1.4 tell #5: ironic condolence, gesture-then-break.
    text:
      "Number Five — REST IN PIECES! Nilmorg's sincere condolences. " +
      "JUST KIDDING. NEXT!",
    surfaces: ["dmc"],
    unlockFlags: ["dmc_event_crash"],
    cooldownKey: "nilmorg.midrace.crash",
    maxPlays: 6,
  },
  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.midrace.crash.signature_captured",
    text:
      "Last neural splice signal! Captured! Catalogued! Filed under " +
      "MEMORABLE! Number Five lives forever — IN THE FILE!",
    surfaces: ["dmc"],
    unlockFlags: ["dmc_event_crash"],
    cooldownKey: "nilmorg.midrace.crash",
    maxPlays: 6,
  },
  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.midrace.crash.terminal_trifecta",
    text:
      "Terminal velocity! Terminal CONTACT! Terminal SIGNATURE! The " +
      "trifecta! Nilmorg is having a NIGHT!",
    surfaces: ["dmc"],
    unlockFlags: ["dmc_event_crash"],
    cooldownKey: "nilmorg.midrace.crash",
    maxPlays: 6,
  },

  // ─── Event: photo-finish (two racers crossing simultaneously) ───────

  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.midrace.photofinish.holding_breath",
    text:
      "Wheel to wheel! Splice plate to splice plate! Nilmorg is HOLDING " +
      "HIS BREATH! Nilmorg DOES NOT BREATHE!",
    surfaces: ["dmc"],
    unlockFlags: ["dmc_event_photo_finish"],
    cooldownKey: "nilmorg.midrace.photofinish",
    maxPlays: 6,
  },
  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.midrace.photofinish.cinematic_call",
    text:
      "And THE LINE! And THE LINE! AND THE LINE! Photo finish, ladies " +
      "and demons! The CAMERAS will sort it!",
    surfaces: ["dmc"],
    unlockFlags: ["dmc_event_photo_finish"],
    cooldownKey: "nilmorg.midrace.photofinish",
    maxPlays: 6,
  },
  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.midrace.photofinish.pulse_on_board",
    text:
      "Nilmorg's pulse! Nilmorg's PULSE! Nilmorg's pulse is on the " +
      "BOARD!",
    surfaces: ["dmc"],
    unlockFlags: ["dmc_event_photo_finish"],
    cooldownKey: "nilmorg.midrace.photofinish",
    maxPlays: 6,
  },
  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.midrace.photofinish.projections_refuse",
    text:
      "Nilmorg's projections refuse to call this one! Nilmorg's " +
      "projections are TIED! The track ADJUDICATES!",
    surfaces: ["dmc"],
    unlockFlags: ["dmc_event_photo_finish"],
    cooldownKey: "nilmorg.midrace.photofinish",
    maxPlays: 6,
  },
  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.midrace.photofinish.track_passes_the_call",
    text:
      "The track does not call THIS one! The track passes the call to " +
      "the CAMERA! Nilmorg passes the call to the CAMERA TOO!",
    surfaces: ["dmc"],
    unlockFlags: ["dmc_event_photo_finish"],
    cooldownKey: "nilmorg.midrace.photofinish",
    maxPlays: 6,
  },
  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.midrace.photofinish.never_waits",
    text:
      "Cameras spinning! Officials conferring! Nilmorg WAITS! NILMORG " +
      "NEVER WAITS — but tonight, he does!",
    surfaces: ["dmc"],
    unlockFlags: ["dmc_event_photo_finish"],
    cooldownKey: "nilmorg.midrace.photofinish",
    maxPlays: 6,
  },

  // ─── Event: dead-tied (the impossible result) ───────────────────────

  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.midrace.deadtied.same_atom",
    text:
      "DEAD TIED! DEAD! TIED! Both racers crossed the line at the SAME " +
      "ATOM!",
    surfaces: ["dmc"],
    unlockFlags: ["dmc_event_dead_tied"],
    cooldownKey: "nilmorg.midrace.deadtied",
    maxPlays: 6,
  },
  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.midrace.deadtied.file_confused",
    text:
      "Nilmorg's file is CONFUSED! Nilmorg's file is RARELY CONFUSED! " +
      "Nilmorg APPROVES of confusion!",
    surfaces: ["dmc"],
    unlockFlags: ["dmc_event_dead_tied"],
    cooldownKey: "nilmorg.midrace.deadtied",
    maxPlays: 6,
  },
  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.midrace.deadtied.consulting_himself",
    text:
      "The Hierarchy is consulting the bookmakers! The bookmakers are " +
      "consulting the Hierarchy! Nilmorg is consulting HIMSELF!",
    surfaces: ["dmc"],
    unlockFlags: ["dmc_event_dead_tied"],
    cooldownKey: "nilmorg.midrace.deadtied",
    maxPlays: 6,
  },
  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.midrace.deadtied.manual_being_written",
    text:
      "Tied races are not in the manual! The manual is being WRITTEN! " +
      "The manual is being written BY THESE TWO!",
    surfaces: ["dmc"],
    unlockFlags: ["dmc_event_dead_tied"],
    cooldownKey: "nilmorg.midrace.deadtied",
    maxPlays: 6,
  },
  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.midrace.deadtied.both_signatures_collected",
    text:
      "When the cameras cannot decide, the TRACK decides! And the track " +
      "has decided — to HOLD! Both signatures collected! Both bones, " +
      "FRESH!",
    surfaces: ["dmc"],
    unlockFlags: ["dmc_event_dead_tied"],
    cooldownKey: "nilmorg.midrace.deadtied",
    maxPlays: 6,
  },
  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.midrace.deadtied.refuses_to_clarify",
    // §1.4 tell #5 — gesture-then-break, in the negative form: he
    // gestures at the audience's expectation of clarity and refuses.
    text:
      "Two winners?! Or two losers?! Nilmorg refuses to clarify! " +
      "NILMORG WILL NOT clarify!",
    surfaces: ["dmc"],
    unlockFlags: ["dmc_event_dead_tied"],
    cooldownKey: "nilmorg.midrace.deadtied",
    maxPlays: 6,
  },

  // ═════════════════════════════════════════════════════════════════════
  // CONTRACT-SIGNING (npc_line — institutional precision; NO hidden clauses)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.contract.institutional_intro",
    text:
      "The contract is the contract. There is no fine print. Hierarchy " +
      "rules forbid it. You sign, you deliver, the platform pays. That " +
      "is the entire ritual. Don't thank me when it's done.",
    surfaces: ["npc_line"],
    cooldownKey: "nilmorg.contract.institutional_intro",
  },

  // ═════════════════════════════════════════════════════════════════════
  // TRENCH SECTOR ARRIVAL (room — first-visit cinematic)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.room.trench.first_visit",
    text:
      "The Trench. My platform sits between the lanes. The scoreboard " +
      "watches me; I watch the scoreboard; the bookmakers watch us " +
      "both. Welcome.",
    surfaces: ["room"],
    cooldownKey: "nilmorg.room.trench_first_visit",
    maxPlays: 1,
  },

  // ═════════════════════════════════════════════════════════════════════
  // CATCH-ALLS (silent-fail compliance)
  // ═════════════════════════════════════════════════════════════════════

  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.cinematic.catchall",
    text: "I'll see you next season. Or I won't.",
    surfaces: ["cinematic"],
  },

  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.dmc.catchall",
    text: "The track is hungry. Speed in all things. Even thinking.",
    surfaces: ["dmc"],
  },

  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.npc_line.catchall",
    text: "I keep my agreements. Don't thank me.",
    surfaces: ["npc_line"],
  },

  {
    npcKey: NPC_KEY,
    lineId: "nilmorg.room.catchall",
    text: "The platform is open. The Circuit is closed until next season.",
    surfaces: ["room"],
  },
];
