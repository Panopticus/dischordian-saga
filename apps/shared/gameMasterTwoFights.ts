/* ═══════════════════════════════════════════════════════
   GAME MASTER · THE TWO FIGHTS — seed-dialog framework

   Per dreamer-canon (2026-05-13) and plan §VIII Phase J7:
   the Game Master ships TWO distinct combat encounters in
   Chapter 11 — `gamemaster_human` and `gamemaster_robot`
   (both intros already produced; see
   apps/shared/chapterIntroCutscenes.ts:48-49). The two
   fights are NOT random variants. They are sequential
   encounters whose surrounding pre-fight / mid-fight /
   post-fight dialog plants the saga's most-load-bearing
   conspiracy seeds for the imprint-summoning-combat
   universal theme (plan §VI.1).

   The four canonical seed channels (every dialog beat below
   surfaces at least one):

     1. CULT-CURATED LOGS — the Game Masters cult edits the
        Matrix-of-Dreams record to sanctify the Game Master;
        unedited Matrix fragments reveal what was removed
        (LORE_BIBLE.md:6238-6259; episodeMysteries.ts E1
        cult_curated_log vs matrix_unedited_fragment)
     2. HIERARCHY CONTRACT-ECONOMY — Xeth'Raal's contract
        guaranteed the Game Master's safety in exchange for
        the Goggles upon destruction; every clause honored;
        the Goggles acquired within the hour
        (LORE_BIBLE.md:5151-5189; :5352)
     3. CONTINUED CULT OPERATION — after the Game Master's
        destruction at Zenon by Agent Zero, the cult
        continues to maintain the Matrix archive; new
        imprints CANNOT be created without the Goggles, but
        existing imprints remain — including Iron Lion's
        endless loop at the Bridge of Kael, which has begun
        "exhibiting anomalous behavior" (LORE_BIBLE.md:6255-
        6259)
     4. THE PLURAL VOICE — Original / Left / Right; the
        Game Master speaks as three (canonically by design
        per apps/shared/npcs/bibles/the_game_master.md). The
        two fights surface different voice-triads in
        different beats.

   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   IMPORTANT — narrative seed discipline
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   These beats SEED the universal theme. They do not REVEAL
   the full canon — the Game Master Mystery Engine arc
   (mystery.game_master E1-E5) is what surfaces the proofs.
   The two fights' job is to ensure every player who reaches
   chapter 11 has been TOLD the truth, in voice, before
   `mystery.game_master` E5 confirms it. The discipline:
   each beat carries a clue the player can verify later; no
   beat resolves the clue's mystery on-screen.

   The framework registers each fight's beats with explicit
   `seedChannel` tags so downstream Codex / Loredex /
   conspiracy-board surfaces can correlate the beats with
   their seeded Mystery Engine cross-arc destinations.

   Canonical anchors:
     - apps/shared/chapterIntroCutscenes.ts:48-49 (both
       intros registered; ch11_gamemaster_human and
       ch11_gamemaster_robot)
     - apps/shared/episodeMysteries.ts:2527-2624 (Game
       Master arc E1; cult/curated-logs canon; Xeth'Raal /
       Goggles / Iron Lion imprint clue cluster)
     - apps/shared/npcs/bibles/the_game_master.md (Original
       / Left / Right plural voice canon)
     - LORE_BIBLE.md:345-393 (Game Master Archon canon)
     - LORE_BIBLE.md:5151-5189 (Xeth'Raal contract canon)
     - LORE_BIBLE.md:6238-6259 (Matrix of Dreams canon)
   ═══════════════════════════════════════════════════════ */

/** The Game Master's plural-voice triad. */
export type GameMasterVoice = "original" | "left" | "right";

/** The four canonical seed-channels the two fights plant. */
export type GameMasterSeedChannel =
  | "cult_curated_logs"
  | "hierarchy_contract_economy"
  | "continued_cult_operation"
  | "iron_lion_imprint_anomaly";

/** Beat ordering within a single fight. */
export type FightBeat =
  | "pre_fight_overture"
  | "pre_fight_recruit_seed"
  | "mid_fight_first_voice"
  | "mid_fight_second_voice"
  | "post_fight_settling"
  | "post_fight_seed";

/** Which of the two fights the line is in. */
export type FightSlug = "gamemaster_human" | "gamemaster_robot";

/** A single seed-dialog beat. */
export interface GameMasterSeedDialog {
  /** Stable id (gm_{fight}_{beat}_{index}). */
  id: string;
  /** Which of the two fights this beat is in. */
  fight: FightSlug;
  /** Where in the fight the beat plays. */
  beat: FightBeat;
  /** Which voice register the line is in. */
  voice: GameMasterVoice;
  /** The line itself (player-facing dialog). */
  line: string;
  /** Which canonical seed-channel the line plants. */
  seedChannel: GameMasterSeedChannel;
  /**
   * The Mystery Engine arc / episode the seed correlates with
   * (for downstream Codex callbacks). Reads like
   * "arc.game_master/E1" or "arc.dlc.resurrectionist_cycle_walker/E3".
   */
  seedsTo: string;
  /** Brief authoring note on the seed's payoff (not player-facing). */
  authoringNote: string;
}

/* ═══════════════════════════════════════════════════════
   FIGHT 1 — gamemaster_human (the Archon's residual body)

   The Game Master meets the player in his Archon-era form —
   the celebrated form Xeth'Raal's contract preserved at the
   destruction-site. The fight is canonically the cult's
   re-staging: the Matrix's archive playing back the moment
   the contract was honored. The plural voice runs Original
   / Left / Right in pre-fight; collapses to Original at
   destruction; Left / Right comment after the cut.
   ═══════════════════════════════════════════════════════ */

const FIGHT_HUMAN_DIALOG: ReadonlyArray<GameMasterSeedDialog> = [
  {
    id: "gm_human_pre_fight_overture_01",
    fight: "gamemaster_human",
    beat: "pre_fight_overture",
    voice: "original",
    line: "You came to fight a man. The man you came to fight was destroyed at Zenon. The man you came to fight signed the contract that ensured the destruction. We will reenact the destruction together. The cult's logs say this fight is sacred. The logs are edited.",
    seedChannel: "cult_curated_logs",
    seedsTo: "arc.game_master/E1",
    authoringNote:
      "First beat. Plants the cult-curated-logs seed in plain language. The player will not yet have the Mystery Engine arc context; the line still reads as boasting. Game Master E1 surfaces the edits.",
  },
  {
    id: "gm_human_pre_fight_recruit_seed_01",
    fight: "gamemaster_human",
    beat: "pre_fight_recruit_seed",
    voice: "left",
    line: "Xeth'Raal honored every clause. Forty-two escape routes became forty-two dead ends. The contract guaranteed safety — not secrecy. Agent Zero arrived because the contract permitted her arrival. We are here because the contract permits this reenactment. Read the small print of every protection you ever sign.",
    seedChannel: "hierarchy_contract_economy",
    seedsTo: "arc.game_master/E1",
    authoringNote:
      "Plants the Xeth'Raal contract-economy seed. The 'forty-two escape routes' phrasing is from LORE_BIBLE.md:5155 — the player will encounter the same number again in the Mystery Engine arc.",
  },
  {
    id: "gm_human_mid_fight_first_voice_01",
    fight: "gamemaster_human",
    beat: "mid_fight_first_voice",
    voice: "right",
    line: "Behind you, in the corner of this room: a memo. The memo names the strategic playbook Xeth'Raal sent Agent Zero before the contract's execution. The memo's annotation is in his hand. Read the annotation later; you will recognize the cipher.",
    seedChannel: "hierarchy_contract_economy",
    seedsTo: "arc.game_master/E2",
    authoringNote:
      "Mid-fight: a specific in-room callback the player can verify. The 'memo with annotation' becomes a clue in Game Master E2 — the player who heard this line will recognize the cipher when they find it.",
  },
  {
    id: "gm_human_mid_fight_second_voice_01",
    fight: "gamemaster_human",
    beat: "mid_fight_second_voice",
    voice: "original",
    line: "The Matrix archive is still operational. The cult cannot create new imprints — the Goggles are in Xeth'Raal's vault — but the imprints that remain are still in motion. The Iron Lion's loop, in particular, has been asking unauthored questions. The Bridge of Kael remembers what the cult-curated logs would prefer it forget.",
    seedChannel: "iron_lion_imprint_anomaly",
    seedsTo: "arc.game_master/E1",
    authoringNote:
      "Plants the Iron-Lion-imprint anomaly seed verbatim. The phrasing 'asking unauthored questions' matches the canonical clue body in episodeMysteries.ts:2544.",
  },
  {
    id: "gm_human_post_fight_settling_01",
    fight: "gamemaster_human",
    beat: "post_fight_settling",
    voice: "original",
    line: "The reenactment closes. The cult will report this fight as a sanctified moment. The cult's report will be edited. The unedited fragment, if you find it, will say I asked you to remember three things: the contract honored every clause; the imprints that remain are still in motion; and the cult continues without me. The third is the most-load-bearing.",
    seedChannel: "continued_cult_operation",
    seedsTo: "arc.game_master/E5",
    authoringNote:
      "Closes Fight 1 with the continued-cult-operation seed framed as the most-load-bearing of three. Each item maps to a different Mystery Engine episode; the line is the player's checklist for the arc.",
  },
  {
    id: "gm_human_post_fight_seed_01",
    fight: "gamemaster_human",
    beat: "post_fight_seed",
    voice: "left",
    line: "He went next. He always went next. The Matrix never empties; the cult never closes; the contract never expires. We will see you at the second fight. The second fight is not the rematch the chronicle expects.",
    seedChannel: "continued_cult_operation",
    seedsTo: "arc.game_master/E5",
    authoringNote:
      "Bridges to Fight 2. 'Not the rematch the chronicle expects' previews that the gamemaster_robot fight is a different encounter, not a re-do.",
  },
];

/* ═══════════════════════════════════════════════════════
   FIGHT 2 — gamemaster_robot (the cult's continued
                              operational form)

   The second fight is the canonical reveal that the cult
   has continued. The Archon's Matrix-archive operation is
   not paused at the destruction — it is iterated. The
   "robot" form is the cult's reinstantiation, running on
   the Iron-Lion-anomaly's question-asking subroutine. The
   plural voice is more fragmented here; Original is faint;
   Left and Right speak more, because the cult speaks more
   than the Game Master in his current form does.
   ═══════════════════════════════════════════════════════ */

const FIGHT_ROBOT_DIALOG: ReadonlyArray<GameMasterSeedDialog> = [
  {
    id: "gm_robot_pre_fight_overture_01",
    fight: "gamemaster_robot",
    beat: "pre_fight_overture",
    voice: "left",
    line: "What you see is what the cult kept running. The Archon is destroyed; the Archon's operation is not. The cult opened the Matrix archive to receive the question the Iron Lion's loop has been asking. The question is the only thing this form is required to host. We are the hosting.",
    seedChannel: "continued_cult_operation",
    seedsTo: "arc.game_master/E3",
    authoringNote:
      "Opens Fight 2 with the continued-cult-operation seed elaborated. 'What you see is what the cult kept running' is the line that survives in the Codex callback if the player completes Game Master E5.",
  },
  {
    id: "gm_robot_pre_fight_recruit_seed_01",
    fight: "gamemaster_robot",
    beat: "pre_fight_recruit_seed",
    voice: "right",
    line: "The cult-curated logs do not record this conversation. The logs record a fight; the logs do not record a discussion. We are having a discussion. The discrepancy is the chronicle's most-honest cult-curated edit: even the edit can't account for the fact that we talk while we fight.",
    seedChannel: "cult_curated_logs",
    seedsTo: "arc.game_master/E1",
    authoringNote:
      "Seeds the cult-curated-logs channel with a self-referential angle. The line gives the player permission to read their own playthrough as edit-worthy material — a Disco Elysium-style invitation to suspect the chronicle.",
  },
  {
    id: "gm_robot_mid_fight_first_voice_01",
    fight: "gamemaster_robot",
    beat: "mid_fight_first_voice",
    voice: "original",
    line: "I am faint here. The Original voice does not host well in this form. Listen for Left and Right; they do most of the cult's work now. When they speak, they speak the cult's plural; when I speak, I speak the Archon's residue. Either is canon. Both are edited.",
    seedChannel: "cult_curated_logs",
    seedsTo: "arc.game_master/E2",
    authoringNote:
      "Surfaces the plural-voice canon directly. The player learns the triad's operational logic mid-fight — a structural callback that pays off when E2 surfaces the voice-attribution puzzle in the Mystery Engine clue.",
  },
  {
    id: "gm_robot_mid_fight_second_voice_01",
    fight: "gamemaster_robot",
    beat: "mid_fight_second_voice",
    voice: "right",
    line: "The Goggles sit in Xeth'Raal's vault. The cult cannot make new imprints; the cult does not need to. The Iron Lion's loop generates anomalies the cult harvests for archive-energy. The harvested energy keeps this form running. The Hierarchy contracts the harvest. The Hierarchy invoices the cult. The cult pays in something other than coin.",
    seedChannel: "hierarchy_contract_economy",
    seedsTo: "arc.game_master/E4",
    authoringNote:
      "Plants the harvest / invoice / contract-economy operational detail. The 'pays in something other than coin' phrasing surfaces in Game Master E4 as the structural unsolved question; the player who heard this line will read the E4 clue with the line's frame already in place.",
  },
  {
    id: "gm_robot_post_fight_settling_01",
    fight: "gamemaster_robot",
    beat: "post_fight_settling",
    voice: "left",
    line: "Two fights, ended. The chronicle will record both as victories. The cult will record both as scheduled. Xeth'Raal will record both as on-schedule contract performance. The chronicle, the cult, and the Hierarchy are not lying to you; they are using different vocabularies for the same event. The Mystery Engine arc's job is to teach you the translation.",
    seedChannel: "hierarchy_contract_economy",
    seedsTo: "arc.game_master/E5",
    authoringNote:
      "Settles Fight 2 with an explicit handoff to the Mystery Engine arc. The line tells the player which surface holds the proof: not the chronicle, not the cult, not the Hierarchy — the arc.",
  },
  {
    id: "gm_robot_post_fight_seed_01",
    fight: "gamemaster_robot",
    beat: "post_fight_seed",
    voice: "right",
    line: "Last seed, then we are done. Listen carefully. The Iron Lion's loop is not the only imprint asking unauthored questions. There is a plague-masked one near the Bridge of Kael — the cult's logs do not record it; the Iron Lion's loop sometimes addresses it. The plague-masked imprint asks questions that are not the Iron Lion's. Find out whose they are. Then come back and tell us. We will not edit your answer.",
    seedChannel: "iron_lion_imprint_anomaly",
    seedsTo: "arc.dlc.resurrectionist_cycle_walker/E1",
    authoringNote:
      "Closing seed cross-binds to the Resurrectionist arc. The plague-masked imprint reference is the conspiracy-clue handoff that connects Game Master canon to Resurrectionist canon. The line keeps both arcs' closure conditions intact — the player can investigate without yet knowing the truth.",
  },
];

/* ═══════════════════════════════════════════════════════
   COMBINED REGISTRY + HELPERS
   ═══════════════════════════════════════════════════════ */

/** All Game Master two-fight seed-dialog beats. */
export const GAME_MASTER_SEED_DIALOG: ReadonlyArray<GameMasterSeedDialog> = [
  ...FIGHT_HUMAN_DIALOG,
  ...FIGHT_ROBOT_DIALOG,
];

/** Returns all seed-dialog beats for a given fight. */
export function getSeedDialogForFight(
  fight: FightSlug,
): readonly GameMasterSeedDialog[] {
  return GAME_MASTER_SEED_DIALOG.filter((d) => d.fight === fight);
}

/** Returns all seed-dialog beats for a given fight beat. */
export function getSeedDialogForBeat(
  fight: FightSlug,
  beat: FightBeat,
): readonly GameMasterSeedDialog[] {
  return GAME_MASTER_SEED_DIALOG.filter(
    (d) => d.fight === fight && d.beat === beat,
  );
}

/** Returns all seed-dialog beats that plant a given seed-channel. */
export function getSeedDialogByChannel(
  channel: GameMasterSeedChannel,
): readonly GameMasterSeedDialog[] {
  return GAME_MASTER_SEED_DIALOG.filter((d) => d.seedChannel === channel);
}

/** Returns all seed-dialog beats that seed a given Mystery Engine arc/episode. */
export function getSeedDialogBySeedsTo(
  seedsTo: string,
): readonly GameMasterSeedDialog[] {
  return GAME_MASTER_SEED_DIALOG.filter((d) => d.seedsTo === seedsTo);
}

/** Canonical count: 6 beats per fight × 2 fights = 12 total beats. */
export const GAME_MASTER_SEED_DIALOG_COUNT = 12;

/**
 * The 4 canonical seed-channels — every channel is planted in
 * BOTH fights, ensuring no player who finishes Chapter 11 is
 * left without exposure to any of the imprint-combat
 * universal-theme conspiracy seeds.
 */
export const CANONICAL_SEED_CHANNELS: readonly GameMasterSeedChannel[] = [
  "cult_curated_logs",
  "hierarchy_contract_economy",
  "continued_cult_operation",
  "iron_lion_imprint_anomaly",
];
