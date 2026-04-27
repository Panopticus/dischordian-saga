/**
 * Act 3 Cutscene — The Offer Presented.
 *
 * Plays ONCE per account on the first time the player opens any
 * Act 3 exclusive card. The Hierarchy formally acknowledges the
 * player; the three-path Loyalty Pledge gate visualizes; the
 * Soul Map's first sector decodes itself in front of the player.
 *
 * Five-beat structure totalling ~13s:
 *   1. crossroads-arrive   (2.5s)  player's footprints lead to
 *                                  the waymarker, three paths
 *                                  glow at low intensity
 *   2. doors-open-equal    (2.5s)  three doorframes brighten to
 *                                  matched intensity; no preferred
 *                                  path
 *   3. mol_garath-voice    (3.0s)  Mol'Garath's voice off-frame;
 *                                  no spoken language, just
 *                                  resonant acknowledgment-tone
 *   4. soul-map-decodes    (2.5s)  one of the Soul Map's twelve
 *                                  sectors decodes mid-air,
 *                                  visualizes the pledge being
 *                                  recognized
 *   5. card-from-altar     (2.5s)  card-back materializes from
 *                                  the central altar; hands off
 *                                  to standard flip-cycle
 *
 * Lore basis: Act 3 = "Eyes in the Dark / The Offer". The
 * three-path Loyalty Pledge mechanic (plan §5) activates HERE.
 * The Hierarchy formally enters (Ith'Rael scouts already at the
 * ridge, per Act 3 epic). Mol'Garath does not speak in language —
 * the canonical framing is procedural acknowledgment, never
 * address (matches the Hierarchy reveal cutscene's no-speech
 * framing for Mol'Garath).
 */
import type { CutscenePrompt } from "../types";

export const ACT3_CUTSCENE: Readonly<Record<string, CutscenePrompt>> = Object.freeze({
  "cutscene_act3_offer_presented": {
    id: "cutscene_act3_offer_presented",
    title: "Act 3 — The Offer Presented",
    subtitle: "Plays once on first Act 3 exclusive card pulled",
    trigger: "first ACT_EXCLUSIVES card with id-prefix act3_ pulled per account",
    estimatedDurationSec: 13,
    ambientTrack: "fnord23/three_path_crossroads_dawn (TBD — sustained chord with three faint timbral threads in green / cyan / crimson)",
    beats: [
      {
        beatId: "crossroads-arrive",
        durationSec: 2.5,
        speaker: "None",
        mood: "intense",
        cameraDirection:
          "Camera holds at the low-angle waymarker-behind position from the Three-Path Crossroads card, slow forward dolly (~10% over the beat) — the viewer is approaching the waymarker.",
        framingPrompt:
          "The Three-Path Crossroads from the Act 3 rare card — wide stone crossroads at substrate-twilight, three paths radiating outward, central waymarker stone. AT BEAT-START: all three engraved arrows on the waymarker glow at LOW intensity (each barely-luminous in its respective color — signal-green / cool-cyan / deep-crimson). The footprints from the card lead from off-frame foreground to the waymarker base — they are the player's, fresh, partially overlapping at the waymarker like the player paused.",
        motionPrompt:
          "Slow forward dolly along the footprints toward the waymarker. The three arrow-glyphs flicker faintly on the waymarker stone — each at a slightly different phase, the canonical Crossroads signature.",
        sfxCue: "ambient_substrate_twilight (sparse drone + faint footstep-echo as if recently stopped) + crossroads_threshold_hum (subtle three-tonal underlay matching the three path-colors)",
        existingVfxRef: "(none — pure 3D scene + shader-driven arrow-glow)",
      },
      {
        beatId: "doors-open-equal",
        durationSec: 2.5,
        speaker: "None",
        mood: "intense",
        cameraDirection:
          "Camera dolly stops; tilt up slightly to reveal the three doorframes at the path-ends in the distance. Each path's doorframe materializes as the camera catches it.",
        framingPrompt:
          "The far end of each path now reveals one of the THREE DOORFRAMES from The Offer — LEFT path: signal-green Insurgency frame; CENTRE path: cool-cyan Empire frame; RIGHT path: deep-crimson-and-rust Hierarchy frame. Over 2.5s all three doorframes' glow brightens to MATCHED INTENSITY (deliberately equal — no preferred path). The waymarker arrows on the foreground stone match the doorframe colors at their leading edge but remain low-intensity (the SHALLOW choice already exists; the doorframes-revealed are the FORMAL choice).",
        motionPrompt:
          "Camera tilt-up 12° smooth over 1s, then holds. Doorframes brighten in unison from 30% to 100% over 1.5s with smooth ease-in. Each doorframe's color-light pours faintly down its path toward the foreground (NOT reaching the waymarker; the choice is presented but not enacted).",
        sfxCue: "doorframes_brighten (three-tonal swell — green / cyan / crimson tones layered to identical loudness; total 1.5s ramp)",
        existingVfxRef: "(none — shader-driven doorframe-glow + path-light)",
      },
      {
        beatId: "mol_garath-voice",
        durationSec: 3.0,
        speaker: "Mol'Garath",
        line: "(no spoken language — the line is rendered as a deep resonant non-verbal acknowledgment-tone, three-syllabic in shape but in no human language; the Memoirist hears it as words being NOT-SAID)",
        mood: "intense",
        cameraDirection:
          "Camera holds. The viewer's perspective is held still while Mol'Garath's voice manifests as a vibrational presence in the scene.",
        framingPrompt:
          "Same crossroads composition. As Mol'Garath's voice begins, the scene's particle-density subtly increases — fine cool-cyan motes drift upward from the stone floor, more from the right (Hierarchy) path than the others. Behind the deep-crimson-and-rust Hierarchy doorframe in the distance, three small Ith'Rael scout-silhouettes become barely visible (matches the Act 3 epic Ith'Rael Scouting Party card — they are ALREADY there, observing). The faint warm-amber drop of frozen blood from Mol'Garath's contract appears mid-air at frame-centre at chest-height, hovering — visualizes the contract-acknowledgment without showing the contract itself.",
        motionPrompt:
          "Particle-density rise 0-1.5s; Ith'Rael silhouettes fade in at 0.8s and remain. Frozen blood-drop appears at 1.2s and hovers steady through the rest of the beat. No camera movement.",
        sfxCue: "mol_garath_acknowledgment_tone.mp3 (deep three-syllabic non-verbal resonant tone, ~2.5s, layered with sub-bass + faint brass underline; tone is RECOGNIZABLE as 'a being is acknowledging you' but unparseable as language)",
        existingVfxRef: "BattleVFX.particleEmitter (re-tuned for cool-cyan motes drifting upward)",
      },
      {
        beatId: "soul-map-decodes",
        durationSec: 2.5,
        speaker: "None",
        mood: "tender",
        cameraDirection:
          "Camera tilts down 8° and zooms slightly in (~10%) to focus on the Memoirist's hand visible at frame-foreground holding a translucent Soul-Map disc.",
        framingPrompt:
          "A translucent representation of the Soul Map's twelve sectors materializes at the frame-foreground, hovering in the Memoirist's open palm (only the palm + lower-forearm visible; no full figure). Eleven of the twelve sectors are scrambled-cyan static (matches the Act 3 Soul Map First Calibration card's nine-scrambled state — the Map is at this point three-decoded already in canon, but for this cutscene one MORE decodes here). Over the beat: ONE additional sector resolves from scrambled-cyan to sharp cool-cyan glyph-lines. The newly-decoded sector lights faintly with deep-violet ink (Engineer's-hand) annotation appearing in its margin.",
        motionPrompt:
          "Soul Map fade-in 0-0.5s in palm. One sector decodes from scrambled to clear over 0.5-1.8s (smooth resolution). Engineer's-hand annotation appears character-by-character in the margin from 1.8-2.5s.",
        sfxCue: "sector_decode_resolve (subtle musical-tonal resolution chord — the canon framing is that decoding sounds like a chord landing) + ink-stroke (faint quill-on-parchment for the annotation)",
        existingVfxRef: "(none — Soul Map shader + character-by-character text-render)",
      },
      {
        beatId: "card-from-altar",
        durationSec: 2.5,
        speaker: "None",
        mood: "neutral",
        cameraDirection:
          "Camera pulls back over 1.5s. The crossroads + doorframes + Map fade to cool-charcoal collector's-felt during the pull-back.",
        framingPrompt:
          "The Soul Map disc in the Memoirist's palm CONDENSES inward — twelve sectors collapse to the centre — and morphs into a standard playing-card shape, face-down, deep-violet Hierarchy-style back with the S1 sigil at centre. The collapsed-glyph-light becomes the card's faint perimeter-glow. The crossroads scene fades behind the materializing card. The card settles into the standard fan-position. Background fades to cool-charcoal collector's-felt.",
        motionPrompt:
          "Map condenses to card over 0-1.5s with smooth shape-morph. Camera pull-back synchronized over the same 1.5s. 1.5-2.5s: card holds in fan-position with subtle motion-blur pulse before standard flip-cycle begins.",
        sfxCue: "map_to_card_morph (subtle paper-folding-into-cardstock layered with the resolved-chord harmonic from beat 4 fading; transitions cleanly into the standard card-flip-cycle)",
        existingVfxRef: "BattleVFX.crossfade (re-tuned for map-to-card shape-morph)",
      },
    ],
    loreCitations: [
      "apps/shared/tcg-core/story/narrativeActs.ts:Act3",
      "docs/built/ALL_ACTS_ROADMAP.md §Act 3 — Eyes in the Dark / The Offer",
      "docs/built/DISCHORDIAN_SAGA_FULL_GAME_LAYOUT.md §Loyalty Pledge / three-path choice",
      "/root/.claude/plans/do-a-full-an-stateful-quill.md §5 Faction commitment",
      "(intra-set) §act3_exclusive_mythic_the_offer — three-doorframe framing source",
      "(intra-set) §act3_exclusive_rare_three_path_crossroads — waymarker + footprints framing",
      "(intra-set) §act3_exclusive_epic_ithrael_scouts — Ith'Rael silhouettes already-observing",
      "(intra-set) §act3_exclusive_rare_soul_map_calibration — Map sector-decode framing",
      "(intra-set) §s2_hierarchy_ceo_mol_garath — Mol'Garath voice + frozen-blood-drop continuity",
      "(intra-set) §cutscene_hierarchy_reveal — Mol'Garath no-spoken-language framing precedent",
    ],
  },
});
