# _ORPHAN_POSTER_VEO_BRIEF.md — 3 cutscene animations pending

Closes `_MISSING_ART_PROMPTS.md` **§A**. Three cutscenes shipped with
producer-authored `_start.png` posters in `NEW_CUTSCENES_67.zip` but
no matching `.mp4`. This brief is a self-contained handoff to render
the missing animations.

## Schema (per `_PRODUCTION_FINAL.md` §0.3–§0.4)

```
VEO_MODEL:                 veo-3.1-generate-001
VEO_DURATION_DEFAULT:      8           # 4 | 6 | 8 supported
VEO_ASPECT:                "16:9"
VEO_RESOLUTION:            "1080p"
VEO_REF_IMAGE_CAP:         4           # subject refs only

FPV_LOCK_PHRASE_VEO:
  > POV shot from the protagonist's eyes; first-person; the camera is
  > the character's head; only hands and forearms enter frame from
  > below; the camera never cuts to third-person; no mirrors or
  > reflective surfaces show the player

VEO_NEGATIVE_PROMPT (passed verbatim to `negativePrompt`):
  > third-person view; character's full body visible; mouth out of sync;
  > motion smear; extra fingers; mirror or reflection of the player;
  > on-screen text other than diegetic signage already present in the
  > location; modern logos; watermark
```

**Subject-reference workflow**: each clip below pulls its first
frame from the producer-supplied `_start.png` poster that's already
on CDN. Use that URL as the Veo subject-reference image so the clip
opens on a frame identical to the poster, then animates the beat
described.

Seed namespace reservation (per `_PRODUCTION_FINAL.md` §0.5):
**190000–190099** — orphan-poster Veo clips.

CDN delivery layout:
```
cdn/client-public/art/cutscenes/<category>/<cutscene_id>.mp4
```

The manifest entry for each cutscene id already exists in
`apps/shared/expansionArt/chessCutscenes.data.ts` /
`expansionCutscenes.data.ts` / equivalent — no code change needed
on delivery, just upload the mp4 to the canonical path.

---

## §A.1 `cs_guild_iron_first_arrival`

- **Category**: `guild_room`
- **CDN dest**: `cdn/client-public/art/cutscenes/guild_room/cs_guild_iron_first_arrival.mp4`
- **Poster subject-reference (already on CDN)**:
  `https://dgrsart.s3.us-east-2.amazonaws.com/cdn/client-public/art/cutscenes/guild_room/cs_guild_iron_first_arrival_start.png`

```
VEO_MODEL:    veo-3.1-generate-001
DURATION:     8s   ASPECT: 16:9   RESOLUTION: 1080p
SEED:         190001
SUBJECT_REFS: [cs_guild_iron_first_arrival_start.png]
NEGATIVE_PROMPT: VEO_NEGATIVE_PROMPT

1. CINEMATOGRAPHY: FPV from the player's eyes; static lockoff 0–2s holding the
   first frame; slow dolly forward 2–5s toward the iron-anvil dais; gentle
   pan-down 5–7s to the embers in the brazier; settle 7–8s on the anvil
   surface as a single hammer-strike rings out. 35mm equivalent. Smooth.

2. SUBJECT + ACTION: Guild common-room of the House of Iron — first-arrival POV.
   Iron-anvil dais centred at frame; brass-and-bronze hearth; ember braziers
   to either side; banners of beaten iron hanging from the rafters. The
   chamber breathes with forge heat. As the camera settles on the anvil, a
   single spark drifts up from the embers — the room recognising you.

3. ENVIRONMENT: warm forge-glow (amber + crimson); aesthetic_tier
   solar_punk_cathedral_industrial; iron-grey walls + brass dado +
   reinforced steel column-bases. Honour the palette + props + lighting of
   the supplied poster verbatim.

4. STYLE: classical guild-hall first-impression; FPV trait-lock applies;
   void-energy compliant.

5. CONSTRAINTS: FPV_LOCK_PHRASE_VEO; subject-reference = cs_guild_iron_first_arrival_start.png.

AUDIO: forge-bed (low hum, distant hammer-fall every 2s); single closing
       hammer-strike at 07:50.

TIMESTAMPS:
  [00:00–00:02] hold on first frame (matches poster verbatim).
  [00:02–00:05] slow dolly forward toward the anvil.
  [00:05–00:07] pan-down to embers; spark drifts.
  [00:07–00:08] settle on anvil; single hammer-strike rings.
```

---

## §A.2 `cs_audit_day21_warden`

- **Category**: `mechronis_audit`
- **CDN dest**: `cdn/client-public/art/cutscenes/mechronis_audit/cs_audit_day21_warden.mp4`
- **Poster subject-reference (already on CDN)**:
  `https://dgrsart.s3.us-east-2.amazonaws.com/cdn/client-public/art/cutscenes/mechronis_audit/cs_audit_day21_warden_start.png`

```
VEO_MODEL:    veo-3.1-generate-001
DURATION:     8s   ASPECT: 16:9   RESOLUTION: 1080p
SEED:         190002
SUBJECT_REFS: [cs_audit_day21_warden_start.png]
NEGATIVE_PROMPT: VEO_NEGATIVE_PROMPT

1. CINEMATOGRAPHY: FPV from the apprentice's chair (NOT the player — per
   _PRODUCTION_FINAL.md §AC.4.2, the audit chamber uses FPV-of-apprentice).
   Static lockoff 0–3s; slow push-in 3–6s toward the verdict pillar;
   the pillar's Warden dial illuminates 6–8s in cold blue. 50mm equivalent.

2. SUBJECT + ACTION: Mechronis audit chamber — day 21, Warden segment. The
   verdict pillar at the head of the chamber holds five dials. The Warden
   dial (third from left, marked with a Warden's keyhole sigil) snaps to
   the lit position; pale blue judgement light floods the dock. A Warden
   official in a high-collared uniform stands at the lectern reading
   charges from a leather folio; only the lower half of his face is visible.

3. ENVIRONMENT: cold blue + austere stone; aesthetic_tier hierarchy_ritual;
   brass-and-marble fittings; banners of the Mechronis seal hanging
   behind the verdict pillar. Honour the palette of the supplied poster.

4. STYLE: courtroom-procedural with theological weight; FPV trait-lock
   applies to the APPRENTICE host; void-energy compliant.

5. CONSTRAINTS: FPV_LOCK_PHRASE_VEO (apprentice host); subject-reference
   = cs_audit_day21_warden_start.png.

AUDIO: chamber-ambient bed (low choir-drone, distant footfall, parchment
       rustle); soft hydraulic click as the dial snaps at 06:00; warden's
       voice in the distance reading charges (unintelligible — lay VO
       in post).

TIMESTAMPS:
  [00:00–00:03] hold on first frame.
  [00:03–00:06] slow push-in toward verdict pillar.
  [00:06–00:08] Warden dial illuminates; cold blue floods the dock.
```

---

## §A.3 `cs_mission_return_success`

- **Category**: `mission`
- **CDN dest**: `cdn/client-public/art/cutscenes/mission/cs_mission_return_success.mp4`
- **Poster subject-reference (already on CDN)**:
  `https://dgrsart.s3.us-east-2.amazonaws.com/cdn/client-public/art/cutscenes/mission/cs_mission_return_success_start.png`

```
VEO_MODEL:    veo-3.1-generate-001
DURATION:     8s   ASPECT: 16:9   RESOLUTION: 1080p
SEED:         190003
SUBJECT_REFS: [cs_mission_return_success_start.png]
NEGATIVE_PROMPT: VEO_NEGATIVE_PROMPT

1. CINEMATOGRAPHY: FPV from the war-room threshold; static lockoff 0–2s;
   slow dolly forward 2–5s as the squad files in from the deployment
   hatch carrying full crates; arc the camera 5–7s to follow the lead
   squadmate as they set a crate on the tactical map table; settle 7–8s
   on the table's holo-display flickering green (mission complete).
   35mm equivalent. Smooth.

2. SUBJECT + ACTION: Mission-briefing war room — return success beat. The
   squad enters from the deployment hatch in the south wall, four crew
   abreast carrying loot crates + an extracted survivor on a stretcher.
   The lead squadmate sets a crate on the tactical map; the survivor
   raises a weak hand in salute. The tactical-map holo flips from amber
   "DEPLOYED" to green "RETURN/SUCCESS" as the lights warm. Mood:
   triumphant relief.

3. ENVIRONMENT: warm tactical-amber + relief-green accents (HUD flips);
   aesthetic_tier solar_punk_cathedral_military_hybrid; brass instrument
   walls + tactical map plinth at centre. Honour palette + props of the
   supplied poster.

4. STYLE: military-procedural with emotional payoff; FPV trait-lock
   applies; void-energy compliant.

5. CONSTRAINTS: FPV_LOCK_PHRASE_VEO; subject-reference = cs_mission_return_success_start.png.

AUDIO: war-room ambient bed; boots on metal deck; soft chatter
       (unintelligible — lay VO in post); single chime as holo flips
       green at 06:00.

TIMESTAMPS:
  [00:00–00:02] hold on first frame (squad silhouettes at hatch).
  [00:02–00:05] dolly forward as squad enters with crates + stretcher.
  [00:05–00:07] arc to follow lead squadmate setting crate.
  [00:07–00:08] settle on holo flipping green; survivor raises hand.
```

---

## Delivery checklist

For each clip:

1. Veo render against `veo-3.1-generate-001` with the schema block
   above. Subject-reference the existing `_start.png` poster so the
   first frame matches verbatim — this preserves continuity with the
   poster already in-game.
2. Output filename matches the `CDN dest` path stem (e.g.
   `cs_guild_iron_first_arrival.mp4`).
3. Bundle the three mp4s into `ORPHAN_POSTERS_VEO_3.zip` preserving
   the `art/cutscenes/<category>/<file>.mp4` layout.
4. Upload via the existing wrapper:

   ```bash
   ./apps/scripts/upload_cutscenes.sh --zip ~/Downloads/ORPHAN_POSTERS_VEO_3.zip
   pnpm tsx scripts/_check-art-coverage.mjs
   ```

5. On delivery, three triggers can be registered in
   `apps/shared/roomCutscenes/roomCutsceneTriggers.ts`:

   ```ts
   { cutsceneId: "cs_guild_iron_first_arrival",  kind: "room_first_enter", zipDir: "house_of_iron", oneShot: true },
   { cutsceneId: "cs_audit_day21_warden",        kind: "flag_set", flagId: "audit_day21_warden_active", oneShot: true },
   { cutsceneId: "cs_mission_return_success",    kind: "mission_phase", missionPhase: "return_success", oneShot: true },
   ```

   (These trigger slots were stubbed in PR #621 and #623 — code
   addresses are reserved.)
