/**
 * Act 5 Cutscene — The Map Closes Year One.
 *
 * Plays ONCE per account on the first time the player opens any
 * Act 5 exclusive card. Year-One finale: Soul Map fully decoded,
 * Vortex Core cleared, Antiquarian prestige cycle unlocks.
 *
 * Five-beat structure totalling ~13s:
 *   1. work-table-finale     (2.5s)  Soul Map at three-decoded
 *                                    pre-state, candle warm-amber
 *   2. final-decode-cascade  (3.0s)  remaining nine sectors
 *                                    decode in cascading wave
 *   3. centre-dot-resolves   (2.5s)  the centre obsidian dot
 *                                    appears + camera pushes in
 *   4. antiquarian-line      (2.0s)  Antiquarian VO acknowledges
 *                                    the Year-One close; first
 *                                    Antiquarian voice in the cuts
 *   5. card-from-map         (3.0s)  Map condenses to card-back;
 *                                    hands off to standard flip
 *
 * Lore basis: Act 5 = "The Reckoning / The Map". Year-One closes
 * here; Antiquarian prestige cycle activates. Source's identity
 * is canonically revealed in Act 5 — the plan locks our prompts
 * to Epoch-2 cutoff, so the centre obsidian dot is shown but the
 * SOURCE-AS-KAEL-REBORN reveal remains STRICTLY EXCLUDED. The
 * Antiquarian's VO is the cutscene's first Antiquarian voice —
 * matches the Antiquarian prestige-cycle canon.
 */
import type { CutscenePrompt } from "../types";

export const ACT5_CUTSCENE: Readonly<Record<string, CutscenePrompt>> = Object.freeze({
  "cutscene_act5_map_year_one_close": {
    id: "cutscene_act5_map_year_one_close",
    title: "Act 5 — The Map Closes Year One",
    subtitle: "Plays once on first Act 5 exclusive card pulled",
    trigger: "first ACT_EXCLUSIVES card with id-prefix act5_ pulled per account",
    estimatedDurationSec: 13,
    ambientTrack: "fnord23/year_one_finale_warm_amber (TBD — sustained warm-amber bed transitioning to a single Antiquarian-tonal harmonic at decode-cascade)",
    beats: [
      {
        beatId: "work-table-finale",
        durationSec: 2.5,
        speaker: "None",
        mood: "tender",
        cameraDirection:
          "Camera holds at the top-down composition from the Soul Map First Calibration card (Act 3) and the Map Fully Decoded card (Act 5). Slow zoom-in (~5%) over the beat.",
        framingPrompt:
          "The same brass-edged Soul Map disc on the same alchemist's-style work-table. AT BEAT-START: the Map is at the THREE-DECODED state from the Act 3 calibration card (three sectors clear, nine scrambled, Engineer's deep-violet annotation only on the three decoded). The work-table holds: the open field-notebook, the obsidian tuning-rod, the warm-amber candle (slightly lower than Act 3 — lots of hours have passed). The candle is the only light source; the rest of the room is in soft warm-cream ambient.",
        motionPrompt:
          "Slow zoom-in 5% over the beat. Candle flame flickers naturally. The nine scrambled sectors continue their canonical scramble-cyan-static motion. No other movement.",
        sfxCue: "ambient_late_hour (faint candle-flame crackle + sparse warm-amber tonal underlay)",
        existingVfxRef: "(none — Soul Map shader + candle render)",
      },
      {
        beatId: "final-decode-cascade",
        durationSec: 3.0,
        speaker: "None",
        mood: "intense",
        cameraDirection:
          "Camera holds top-down. Continued slow zoom-in (~5% over the full beat).",
        framingPrompt:
          "The remaining NINE scrambled sectors begin to decode in a CASCADING WAVE — sector by sector, in radial order from the Map's outermost ring inward. Each sector resolves from scrambled-cyan to sharp cool-cyan glyph-lines, with Engineer's-hand deep-violet ink appearing in the margin (character-by-character) for each newly-decoded sector. The cascade takes 2.7s of the beat (the final 0.3s holds at full-decoded). The candle flame brightens slightly with each resolved sector.",
        motionPrompt:
          "Sector decode-cascade: sectors decode at ~3.3 per second (9 sectors over 2.7s). Each sector's resolution is 0.3s smooth; annotations appear character-by-character at ~30 chars/sec following the decode. Candle flame brightens by ~10% with each sector (cumulative).",
        sfxCue: "decode_cascade (rapid sequence of nine soft tonal-resolution chords landing one per sector + faint quill-stroke sounds for each annotation; total ~2.7s; final 0.3s held silence)",
        existingVfxRef: "(none — Soul Map shader + character-by-character text-render scaled to 9 sectors)",
      },
      {
        beatId: "centre-dot-resolves",
        durationSec: 2.5,
        speaker: "None",
        mood: "intense",
        cameraDirection:
          "Camera pushes in from top-down to the Map's exact centre over 1.5s (substantial push-in, ~50% of remaining distance to the Map's surface). Final 1s held tight on the centre point.",
        framingPrompt:
          "At the meeting-point of all twelve newly-decoded sectors, a small obsidian DOT materializes at the Map's exact centre — pure-black, smaller than any sector-glyph, deliberately sized to be the smallest detail in frame. Around the dot: the twelve sectors' glyph-light catches and reflects faintly off the dot's surface. The annotation-tags around each sector are now individually visible at this zoom-level but remain LEGIBLE-BUT-BLURRED (matching the Map Fully Decoded canon — 'present and readable to the Memoirist but not to the camera'). The candle is now off-frame.",
        motionPrompt:
          "Camera push-in over 0-1.5s (smooth ease-out). 1.5-2.5s: held tight on centre. The obsidian dot does NOT animate — it simply IS, present and unremarkable, as the canon framing requires. Sector glyph-light around the dot continues its faint pulse.",
        sfxCue: "dot_resolve (single low-frequency drone-tone landing at 1.5s and held to beat-end; the canon framing of the Source's centre as 'a presence, not an event')",
        existingVfxRef: "(none — Map shader at high zoom)",
      },
      {
        beatId: "antiquarian-line",
        durationSec: 2.0,
        speaker: "Narrator",
        line: "Year One closes. The Map is full. The next year begins with the next entry.",
        mood: "neutral",
        cameraDirection:
          "Camera holds tight on the centre dot. The line is delivered off-frame — the Antiquarian is not visible.",
        framingPrompt:
          "Same close-up on the centre dot from beat 3. The Antiquarian's VO comes from off-frame, reading as the cataloguer-of-endings (matches the Antiquarian's canon framing per LORE_BIBLE §Antiquarian). At line-end: a faint Antiquarian sigil-mark appears on the work-table beside the Map (just visible at frame-edge), the canon Antiquarian acknowledgment-mark.",
        motionPrompt:
          "Camera holds. Antiquarian sigil-mark fades in at frame-edge over 1.6-2.0s.",
        sfxCue: "antiquarian_act5_year_one_close.mp3 (deliver canon Antiquarian VO; total ~1.6s including breath; the line should read scholarly-patient, not triumphal — matches canon Antiquarian voice)",
        existingVfxRef: "(none — VO + Map shader)",
      },
      {
        beatId: "card-from-map",
        durationSec: 3.0,
        speaker: "None",
        mood: "neutral",
        cameraDirection:
          "Camera pulls back rapidly over 1.5s — back through the Map's full top-down view, then continues to standard pack-opening flip-cycle position. Background fades to cool-charcoal collector's-felt during the pull-back.",
        framingPrompt:
          "The Map condenses inward — the twelve sectors' glyph-light pulls into the centre, the brass disc shrinks, the entire Map collapses to the size and shape of a standard playing-card. Card-shape settles into the standard fan-position: face-down, deep-violet Hierarchy-style back with S1 sigil at centre. The work-table fades to background-felt during the pull-back. The card retains a faint warm-amber perimeter-glow (the candle's color, retained as visual continuity — the Map closes as Year One did).",
        motionPrompt:
          "Map condenses to card over 0-1.5s (smooth shape-morph, brass-edge dissolves, twelve sectors pull inward to centre). Camera pull-back synchronized over the same 1.5s. Background-felt fades in 0.5-1.5s. 1.5-3.0s: card holds in fan-position with subtle motion-blur pulse before standard flip-cycle begins.",
        sfxCue: "map_to_card_close (warm-amber tonal harmonic resolving + subtle brass-and-paper folding; transitions cleanly into the standard card-flip-cycle's per-card SFX)",
        existingVfxRef: "BattleVFX.crossfade (re-tuned for map-to-card shape-morph; second use of this primitive after Acts 1-4 pattern)",
      },
    ],
    loreCitations: [
      "apps/shared/tcg-core/story/narrativeActs.ts:Act5",
      "docs/built/ALL_ACTS_ROADMAP.md §Act 5 — The Reckoning / The Map",
      "(intra-set) §act3_exclusive_rare_soul_map_calibration — three-decoded baseline state",
      "(intra-set) §act5_exclusive_mythic_the_map — fully-decoded composition source",
      "(intra-set) §act5_exclusive_rare_antiquarian_prestige — Antiquarian VO + sigil-mark continuity",
      "docs/built/LORE_BIBLE.md §Antiquarian (cataloguer-of-endings framing)",
      "docs/built/LORE_BIBLE.md §Source (centre-dot framing — full identity reveal STRICTLY EXCLUDED, Act 5 reveal canon)",
      "(intra-set) §cutscene_card_pack_opening — handoff to standard card-flip",
    ],
  },
});
