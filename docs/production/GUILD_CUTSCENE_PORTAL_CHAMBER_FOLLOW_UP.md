# Guild Cutscene Follow-On — Portal Chamber Asset Spec

The 2026-05-01 producer drop `DischordianSaga_GuildCutscenes_Complete.zip` shipped 174 of the planned 175 assets. The Portal Chamber room-unlock cinematic (F.5.3.b) is the lone gap: its VO line `architect_portal_001` is recorded ("Twelve voices unlock the door. The chamber is yours. Use it well.") and the runtime falls back to the generic `cs_room_unlock` visuals, but the room deserves a dedicated drop.

This doc gives the producer everything needed to generate the missing three files and have them slot in without code changes.

## Files to deliver

| Filename | Slot | Resolution / Duration | Bundle path |
|---|---|---|---|
| `cs_signature_room_unlock_portal_chamber_start.png` | F.5 still (start) | 2752 × 1536 | `stills/f5_guild_hall/` |
| `cs_signature_room_unlock_portal_chamber_end.png` | F.5 still (end) | 2752 × 1536 | `stills/f5_guild_hall/` |
| `cs_signature_room_unlock_portal_chamber.mp4` | F.5 video | 6.0 s @ 30 fps, H.264 | `videos/f5_guild_hall/` |

## Style anchor (verbatim from `PRODUCTION_PLAN.md`)

Prepend this to every still prompt:

> AAA video game cinematic concept art, BioWare cinematic lighting meets Blade Runner palette meets bio-mechanical horror with corporate cool, dark academia overtones for Mechronis interiors. Base deep-space black `#010020`, primary cyan `#22d3ee`, rose accent `#f43f5e`. Volumetric fog at ankle height, anamorphic lens flare on the brightest element only. Film grain 3% intensity, 1920x1080, 16:9, no letterbox bars, no rendered text, no logos, no watermarks.

## Scene continuity reference

The Portal Chamber follows the Oracle Pool reveal (F.5.3.a) as the second of the two Sanctum-tier signature-room unlocks. Where the Oracle Pool hinges on a slow inward-swinging door + still water, the Portal Chamber's visual language is **rotational lock + 12-rune ignition sequence + dormant central portal-arch**. The two reveals must read as siblings (same hallway palette, same Sanctum architecture) with distinct mechanisms.

Reference frame: the Oracle Pool is bathed in cool cyan + reflective starfield. The Portal Chamber leans warmer — the Mechronis brass-school B-flat-major key — with the cyan/rose accents reserved for the rune ignitions and the still-dormant arch's potential glow.

## Start frame prompt — Nano Banana

> [STYLE ANCHOR]. Establishing wide shot, camera 4 metres back at standing eye height, looking down a Mechronis-Sanctum-tier hallway at a previously-sealed circular doorway set into a vaulted stone wall. The door is a flush metal disc 3 metres in diameter, dark brushed bronze with bio-mechanical fluting. Embedded around the doorframe in a perfect ring: 12 small inactive runic stones, one per Archon, each the size of a closed fist, all currently unlit and matte. Hallway floor: polished basalt with thin cyan emergency-strip lighting along the edges. Ceiling: vaulted with hexagonal coffers, dim. Volumetric ankle-fog drifts toward the door. The doorway is the visual anchor — slightly off-centre to the left to give negative space for the chamber reveal direction. No people. No glowing elements other than the cool cyan floor strips and the faintest rose pinprick at the doorframe centre (the dormant portal hum). Mood: anticipation, sealed potential, ceremonial hush.

**Negative prompts:** rendered text, doorway already open, runes already lit, people, weapons, lens flare except the rose pinprick, warm light sources visible.

## End frame prompt — Nano Banana

> [STYLE ANCHOR]. Same hallway, same camera position, same vaulted Sanctum architecture as the start frame — but the doorway has rotated open like a lock-mechanism (the disc has spiralled inward into the wall, exposing a circular opening 3 m across). The 12 runic stones around the frame are now ignited in sequence: one cyan at top, then the 11 others ringing the frame in graduated hue from cyan through warm white to rose, each glowing strongly enough to throw thin radial light onto the stone around them. Through the opening: the Portal Chamber is revealed — a vaulted hexagonal room, walls of polished basalt with brass inlay running floor-to-ceiling, soft B-flat-major-warm overhead light from a recessed ceiling source. At the chamber's exact centre stands a single large central portal-arch: a 4-metre tall freestanding stone-and-brass arch, currently dormant but visibly humming with potential — a thin standing-wave shimmer fills the arch's interior, neither image nor reflection, just *almost-there* energy. The chamber floor radiates concentric rings outward from the arch's base. Camera composition leads the eye through the doorway to the arch, depth visible. Anamorphic lens flare on the topmost (cyan) rune only. Mood: keys-have-aligned, threshold crossed, infrastructure activated.

**Negative prompts:** rendered text, anything inside the portal-arch (it should be dormant — no visible destination), people, weapons, blue/white shimmer overdone, fluorescent or industrial lighting tone.

## Video prompt — Veo 3.1 (6.0 s)

Reference frames: `cs_signature_room_unlock_portal_chamber_start.png` (t=0) → `cs_signature_room_unlock_portal_chamber_end.png` (t=5.0s, hold to t=6.0s).

**Beat plan:**

| t (s) | Beat | Motion / lighting |
|---|---|---|
| 0.0 – 0.5 | hold start frame | dormant doorway, fog drifts, faint rose pinprick pulses at doorframe centre once |
| 0.5 – 3.5 | **runic stone ignition sequence** | the 12 runic stones ignite one-by-one in canonical 1–12 Archon order around the doorframe ring; ~250 ms per stone; each ignition throws a brief thin radial light + a single chimed pixel-bloom; sequence resolves with all 12 lit by t=3.5 s |
| 3.5 – 5.0 | **lock rotation** | the circular door disc rotates inward like a vault lock — visible spiral motion (1.5 s slow rotation around its center axis), revealing the chamber opening; thin granular dust falls from the rotation seam |
| 2.0 – 4.6 | (overlapping) **camera push-in** | gentle 0.8 m forward dolly toward the doorway; depth of field shallows so the Portal Chamber comes into focus as the door clears |
| 5.0 – 6.0 | hold end frame | portal-arch shimmer breathes once (subtle dilate-contract), warm overhead light settles, all 12 runes hold at full brightness |

**Camera:** static-with-push (no truck, no tilt). Anamorphic 2.39:1 letterbox NOT applied — output stays 16:9.

**Motion negative prompts:** the portal-arch must NOT activate (no destination visible, no traversal); no characters appear; no rotation of the chamber itself; no flash-cuts.

## Audio (already specified in `GUILD_CUTSCENE_BIBLE.md` §F.5.3.b — listed here for completeness)

- **Music bed:** `cs_signature_room_unlock_portal_chamber_bed.ogg` — 6 s, 76 BPM, B-flat major (Mechronis school anthem mode), full ensemble + brass swell at portal reveal, −17 LUFS, one-shot.
- **SFX:** 12 sequential rune-ignition chimes (ascending C5 → C6 chromatic, each −12 dB), stone-and-metal lock-rotation (granular, −10 dB peak), portal-hum activation (low sustained drone, −14 dB).
- **VO:** The Architect, line `architect_portal_001` ("Twelve voices unlock the door. The chamber is yours. Use it well.") — already generated in `architectVoManifest.json`.

## Pipeline integration

When the producer ships these three files, the runtime auto-discovers them — no code change required:

1. Drop the new files into the bundle directory used by `pnpm assets:upload-guild-cutscenes --bundle=<path>` (paths above).
2. Re-run the upload (idempotent ETag-compare; the existing 174 files skip).
3. Update `apps/shared/expansionArt/guildCutscenesManifest.ts` so the `cs_signature_room_unlock_portal_chamber` entry's `bundleSlug` flips from the fallback `"cs_room_unlock"` to `"cs_signature_room_unlock_portal_chamber"` (single-line change).
4. The 13-case test suite at `apps/shared/expansionArt/__tests__/guildCutscenes.test.ts` already covers the registry contract and will pass on the new paths.

## Acceptance checklist for QA

- [ ] Both stills are 2752 × 1536 PNG, base palette `#010020` / `#22d3ee` / `#f43f5e`, 3% film grain.
- [ ] Start frame: 12 runes visible but unlit; doorway sealed; no portal visible.
- [ ] End frame: all 12 runes lit in graduated cyan → rose; doorway opened; portal-arch dormant inside chamber (no destination).
- [ ] Video lands at 6.0 s @ 30 fps, H.264, 16:9 1920×1080 (or 2752×1536 downscaled — match the producer's existing F.5 output size).
- [ ] Rune-ignition sequence reads as 12 discrete events spaced ~250 ms apart, NOT a wash.
- [ ] No spoken dialogue baked into the audio stem (VO is layered separately at runtime).
- [ ] Portal-arch shimmer breathes once near end-of-clip but does NOT activate (no destination visible).
