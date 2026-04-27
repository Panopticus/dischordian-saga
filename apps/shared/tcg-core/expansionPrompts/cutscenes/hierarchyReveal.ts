/**
 * Hierarchy Reveal — first-S2-pack-open cutscene.
 *
 * Plays ONCE per account, on the first time the player opens any
 * S2_HIERARCHY pack (Memoir Booster S2 / Display / Faction Starter
 * S2 / Collector / Founder). The cutscene precedes the regular
 * card-pack-opening flow on that one occasion only — afterward
 * S2 packs use the canonical card-pack-opening cutscene without
 * the reveal preamble.
 *
 * Five-beat structure totalling ~15s:
 *   1. boardroom-doors    (2.5s)  Mol'Garath's apex chamber doors
 *                                  open to camera
 *   2. mol_garath-stand    (3.5s)  Mol'Garath rises from boardroom
 *                                  table; faces camera
 *   3. contract-extend     (2.5s)  Mol'Garath extends the
 *                                  guillotine-folded contract
 *   4. signature-line      (3.0s)  contract zooms to player's
 *                                  empty signature line; pen lifts
 *   5. reveal-handoff      (3.5s)  scene blurs into the regular
 *                                  card-pack-opening pre-roll
 *
 * Lore basis: Mol'Garath canon (LORE_BIBLE §Mol'Garath) + the
 * Hierarchy contract framing (LORE_BIBLE §Mol'Garath / Contracts
 * as sacred law). The player's first S2 pack-open is canonically
 * the moment Mol'Garath formally acknowledges the player as a
 * Hierarchy contract-holder — the cutscene visualizes that
 * acknowledgment as a signature-line presented, never signed
 * during the cutscene (the actual signature is the player buying
 * the SKU, retroactively).
 */
import type { CutscenePrompt } from "../types";

export const HIERARCHY_REVEAL_CUTSCENE: Readonly<Record<string, CutscenePrompt>> = Object.freeze({
  "cutscene_hierarchy_reveal": {
    id: "cutscene_hierarchy_reveal",
    title: "Hierarchy Reveal — Mol'Garath's First Acknowledgment",
    subtitle: "Plays once, on first S2_HIERARCHY pack open",
    trigger: "first S2_HIERARCHY pack open per account (idempotency: stash a one-shot flag in the user record)",
    estimatedDurationSec: 15,
    ambientTrack: "fnord23/hierarchy_apex_chamber_drone (TBD — Hierarchy-canonical sub-bass + brass-tonal bed)",
    beats: [
      {
        beatId: "boardroom-doors",
        durationSec: 2.5,
        speaker: "None",
        mood: "intense",
        cameraDirection:
          "Camera holds at low-angle hero position facing a pair of vast obsidian-and-brass apex-chamber doors. Doors fill upper two-thirds of frame.",
        framingPrompt:
          "Vast obsidian-and-brass double doors of Mol'Garath's apex boardroom — twelve metres tall, etched with the Hierarchy crest at chest-height across the seam. Faint dim-red phosphor lines trace the etchings. The doors are CLOSED at beat-start; the floor before them is polished obsidian reflecting only the doors and a faint warm-amber down-light from a single overhead source. NO figures. The doors are sealed by a pair of heavy chrome bolts that begin to retract over the first 1.5s.",
        motionPrompt:
          "Bolts retract (0-1.5s) with deep mechanical rumble. Doors begin to open inward (1.5-2.5s) revealing a slim sliver of the apex chamber's red-black abyss-light beyond — the abyss-light is warmer than the antechamber light, deep crimson. Doors stop opening at 2.5s with the gap roughly 30% of full open.",
        sfxCue: "hierarchy_apex_door_unlock (0.4s chrome-bolt retraction × 2) + hierarchy_apex_door_groan (1.5s low groaning hinge-reverb)",
        existingVfxRef: "BattleVFX.ScreenFlash (none — this beat is mechanical, no flash)",
      },
      {
        beatId: "mol_garath-stand",
        durationSec: 3.5,
        speaker: "Mol'Garath",
        line: "(no spoken line — Mol'Garath does not speak; the framing is procedural acknowledgment, not address)",
        mood: "intense",
        cameraDirection:
          "Camera dolly-in slowly through the opening doors over 1.5s, settling at low-angle hero shot of Mol'Garath at the boardroom table head, reading the player's incoming presence. Camera holds for the remaining 2s.",
        framingPrompt:
          "Mol'Garath's apex boardroom interior — the obsidian-and-bone roundtable suspended over the churning red-black abyss. Mol'Garath stands at the table's head: enormous twelve-foot horned silhouette in tailored matte-black executive suit veined with dim red phosphor (matching his canonical S2 mythic art). The four small inset eyes on his sculpted onyx mask track toward the camera as it enters. His left hand rests palm-down on the table; his right hand holds a Contract — the parchment-folded-as-guillotine-blade from his S2 mythic, edge weeping a single drop of frozen blood. Behind him: the wall-window onto the Labyrinth of Unmaking, geometry shifting when not directly observed.",
        motionPrompt:
          "Camera dolly-in through doors (0-1.5s); Mol'Garath remains motionless until camera settles. At 1.5s his head turns 5° toward camera (procedural acknowledgment, not greeting). 1.5-3.5s: he holds the pose, the contract in his right hand catches a faint bureaucratic-green provoke-glow rim. The Labyrinth window's geometry visibly turns when the camera flicks momentarily off it (subtle background motion — the Labyrinth is restless).",
        sfxCue: "ambient_apex_chamber (deep churning red-black abyss sub-bass + bureaucratic-green provoke-rim hum harmonic) — held throughout the beat",
        existingVfxRef: "(none — pure 3D character + scene render; rim-light is shader-driven not particle-VFX)",
      },
      {
        beatId: "contract-extend",
        durationSec: 2.5,
        speaker: "None",
        mood: "intense",
        cameraDirection:
          "Camera pulls slightly forward and angles slightly upward as Mol'Garath extends the contract. The contract becomes the visual focal point, Mol'Garath's mask softens to background-focus.",
        framingPrompt:
          "Mol'Garath's right hand extends the Contract toward the camera in a slow procedural gesture — palm-up, the parchment-folded-as-guillotine-blade resting flat across his palm. The contract's edge weeps the same single drop of blood (still frozen mid-fall). The blade-fold at the contract's lower edge points toward the camera, leaving the open signature-page facing upward and slightly toward the viewer. Behind: Mol'Garath's torso and the Labyrinth window remain visible but in soft-focus depth-of-field.",
        motionPrompt:
          "Mol'Garath's right arm extends from torso-position to fully-extended over 1.5s (smooth ease). The contract rotates 90° during the extension to present the signature-page upward (not the edge). Camera angles up 8° during the extension. Final 1s: contract held steady, the frozen blood-drop catches a single specular highlight that shimmers momentarily.",
        sfxCue: "contract_extend (slow Mylar-paper unfolding sound layered with subdued brass-tonal underline; total 1.5s with 1s held silence after)",
        existingVfxRef: "(none — character animation + shader-highlight only)",
      },
      {
        beatId: "signature-line",
        durationSec: 3.0,
        speaker: "None",
        mood: "tender",
        cameraDirection:
          "Camera zooms into the contract's surface over 1.5s, ending at a tight close-up of the signature-page. Mol'Garath becomes background blur; the page fills the frame.",
        framingPrompt:
          "Tight close-up on the Hierarchy contract's signature-page. Top of page: Hierarchy crest + formal contract heading 'HIERARCHY OF THE DAMNED — STANDING ACKNOWLEDGMENT' in bureaucratic typeset. Body of contract: dense Hierarchy legal text rendered legibly enough to read 'present', 'acknowledge', 'in perpetuity', 'as agreed', 'signed below by the Memoirist' across visible lines. At the page's lower-third: a single empty signature-line — labeled 'MEMOIRIST' beneath. The line is BLANK. To the line's right: a small obsidian-and-brass quill resting in a small inkwell, the inkwell holding deep-violet ink (matching Engineer's-hand canon). At 2.5-3s: the quill LIFTS itself out of the inkwell on its own, hovering an inch above the signature-line — but does NOT descend. The signature is awaited, not given. (Lore: the player's purchase IS the signature; the contract is retroactive.)",
        motionPrompt:
          "Camera zoom-in over 1.5s (smooth ease-out). 1.5-2.5s: page held at full frame, viewer reads. 2.5-3.0s: quill lifts from inkwell on its own, tip wet with deep-violet ink, hovers above the empty signature-line. The quill DOES NOT descend — it holds, awaiting.",
        sfxCue: "page_zoom_settle (subtle paper-rustle as camera arrives) + quill_lift (faint scratchy-pickup sound + soft drip of ink as the quill emerges from the inkwell at 2.5s)",
        existingVfxRef: "(none — text rendering + 3D quill animation)",
      },
      {
        beatId: "reveal-handoff",
        durationSec: 3.5,
        speaker: "Mol'Garath",
        line: "(no spoken line)",
        mood: "neutral",
        cameraDirection:
          "Camera pulls back rapidly out of the contract over 1.5s, then dissolves into the standard card-pack-opening cutscene's preroll position. Mol'Garath remains visible at the periphery during the pull-back, then fades.",
        framingPrompt:
          "Camera retreats from the signature-page, the contract recedes into Mol'Garath's still-extended hand. Mol'Garath visible at frame-mid as the camera pulls back 75%, then a soft motion-blur transitions into the cool-charcoal collector's-felt background of the standard card-pack-opening preroll. The sealed S2_HIERARCHY pack appears in the centre of the frame at 35° forward tilt — the same pack that was about to be opened when the cutscene triggered. The Hierarchy reveal is OVER; the pack-opening cinematic begins from this beat's end.",
        motionPrompt:
          "Camera pull-back over 1.5s with smooth acceleration-into-motion-blur (0.5s). 1.5-2.5s: motion-blur transition from apex-chamber background to collector's-felt background. 2.5-3.5s: pack settles into preroll-position with the standard slow-rotation-loop already in motion. Mol'Garath's silhouette remains barely visible in the warm-amber bokeh for the final second as a subtle reminder of the acknowledgment just received, then fades.",
        sfxCue: "transition_swell (Hierarchy apex-chamber drone fades over 1.5s as collector's-felt ambient hum fades in to match the standard pack-open preroll's ambient bed)",
        existingVfxRef: "BattleVFX.crossfade (re-tuned for 1.5s motion-blur transition)",
      },
    ],
    loreCitations: [
      "docs/built/LORE_BIBLE.md §Mol'Garath",
      "docs/built/LORE_BIBLE.md §Mol'Garath / Contracts as sacred law",
      "docs/built/LORE_BIBLE.md §Hierarchy as infernal corporation",
      "(intra-set) §s2_hierarchy_ceo_mol_garath — character-anchor canon (Mol'Garath's S2 mythic appearance)",
      "(intra-set) §cutscene_card_pack_opening — handoff to standard pack-open flow",
      "/root/.claude/plans/do-a-full-an-stateful-quill.md §S2 Hierarchy of the Damned expansion",
    ],
  },
});
