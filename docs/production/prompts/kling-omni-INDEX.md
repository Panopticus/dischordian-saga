# Kling Omni Intro Cinematics — Master Index

**Scope:** 8 act intros + 10 mechanic intros = 18 cinematics. Each cinematic = 12 × 15-second Kling Omni shots = 3:00 total runtime. ~216 shot prompts.

**Why a new format on top of existing single-shot intros:** The mp4s in `apps/shared/expansionArt/cinematicsManifest.ts` (`03_act1_memoir` … `09_act7_convergence`) are short single-cuts. These prompts deliver the producer the *full 3-minute opening cut* — the long-form "collector's arena" / "meme video" register the user requested.

**Style precedent (read first):**
- `docs/production/prompts/kling-discovery-video-prompts.md` — start/end-frame keyframe recipe.
- `apps/shared/westByGodTracks.ts` — the canonical `klingPrompt` + `seedanceMotion` pairing the player has already been trained on.
- `docs/production/commission-packages/examples/veo-3.1_one-shot-cinematic.md` — multi-beat per-shot timestamp pattern.
- `docs/FNORD23_MUSIC_PROMPTS.md` — audio-bed cue ids cited per file.
- `docs/production/ART_PRODUCTION_BIBLE.md` + `VISUAL_PRODUCTION_BIBLE.md` — palette, faction colors, character look bibles.

---

## Per-shot prompt format (every file follows this)

```
## Shot NN (M:SS–M:SS) — {beat name}

START FRAME:
[One paragraph. Hyper-specific. Subject pose, wardrobe, expression, lighting,
 palette, lens, atmosphere, era cues, faction color signals, mood references.
 8K declared. Cel-shaded OR hyper-realistic declared. Camera angle declared.]

END FRAME:
[Same paragraph form. Shows the 15-second motion endpoint. What changed in the
 subject, what energy was revealed, what palette shifted. Camera angle held or
 stated motion. END frame ≈ next shot's START frame for identity-pin.]

MOTION (0:00→0:15):
[One sentence. Camera move + subject motion + atmosphere shift.]

CONTINUITY:
end-frame ≈ Shot {NN+1} start-frame — {what carries: subject identity, palette,
 prop, environment fragment}.

FLAG (final shot only):
On completion, fire `{flag_id}`. Phase 1 dialog density reads this flag to
 trigger {NPC} reactive comment {cc_act{N}_{moment}}.
```

## Per-file header format

```
# {ACT|MECHANIC} Intro — {Title}

**Total runtime:** 12 × 15s = 3:00
**Aesthetic:** {cel-shaded anime CB×CE×AS, 8K} | {hyper-realistic cinematic, 8K} | {hybrid — flashbacks cel, present hyper-real}
**Speaker accent palette:** {cyan = Elara | rose = Human | amber = Locke | violet = Seer | toxic green = Necromancer | gold = Architect}
**Audio bed:** FNORD-23 cue {OG_xxx} — see FNORD23_MUSIC_PROMPTS.md
**Lands on flag:** `{flag_id}` (Phase 1 hook)
**Replaces / complements:** {existing mp4 in cinematicsManifest.ts, if any}
```

---

## File map

### Act intros — `kling-omni-act-intros/`

| File | Cinematic | Aesthetic | Lands flag |
|---|---|---|---|
| `00_prelude.md` | Cryo Awakening — Ark 1047 | hyper-real | `prelude_awakening_seen` |
| `01_act1_memoir.md` | Memoir Opens — The Programmer's biography | cel-shaded CB×CE×AS | `act1_memoir_seen` |
| `02_act2_whisper.md` | Whisper Begins — Substrate ping | hybrid | `act2_substrate_seen` |
| `03_act3_offer.md` | Offer Presented — Three Kaels | hyper-real | `act3_offer_seen` |
| `04_act4_revelation.md` | Revelation Meets — Path A/B/C reveal | hyper-real | `act4_revelation_seen` |
| `05_act5_map.md` | Map / Year One Close — Coordinates decode | hyper-real | `act5_map_seen` |
| `06_act6_confession.md` | Confession Spoken — Faces revealed | hyper-real warm shift | `act6_confession_seen` |
| `07_act7_convergence.md` | Convergence Resolves — Architect dawn | hyper-real panopticon dawn | `act7_convergence_seen` |

### Mechanic intros — `kling-omni-mechanic-intros/`

| File | Mechanic | Aesthetic | Lands flag |
|---|---|---|---|
| `01_card_combat.md` | Card Combat (Dischordia Deck) | hyper-real arena | `mech_card_combat_intro_seen` |
| `02_deckbuilder.md` | Deckbuilder (Engineer's Bench) | cel-shaded workshop | `mech_deckbuilder_intro_seen` |
| `03_allegiances.md` | Allegiances (8 factions) | hyper-real banner ceremony | `mech_allegiances_intro_seen` |
| `04_witnessing.md` | Witnessing System (Light/Dark vote) | hybrid Elara cyan + Human rose | `mech_witnessing_intro_seen` |
| `05_soul_stones.md` | Soul Stones | hyper-real reliquary | `mech_soul_stones_intro_seen` |
| `06_oracle_deck.md` | Oracle Deck (3-card spread) | hyper-real prismatic temple | `mech_oracle_deck_intro_seen` |
| `07_chess.md` | Chess Subgame (Two Game Masters) | cel-shaded Antiquarian register | `mech_chess_intro_seen` |
| `08_sprite_proxy.md` | Sprite Proxy (companion bond) | hybrid jungle / lab | `mech_sprite_proxy_intro_seen` |
| `09_expansion_drops.md` | Expansion Drops / CoNexus | hyper-real foundry | `mech_expansion_drops_intro_seen` |
| `10_trade_empire.md` | Trade Empire (sector exploration) | cel-shaded port noir | `mech_trade_empire_intro_seen` |

---

## Self-check checklist (every file must pass before producer hand-off)

- [ ] Header declares aesthetic, palette, audio bed, lands-flag, replaces/complements.
- [ ] Exactly 12 shots, each 15s, timestamps `0:00–0:15` … `2:45–3:00`.
- [ ] Every shot has START FRAME, END FRAME, MOTION, CONTINUITY blocks.
- [ ] CONTINUITY between every adjacent shot pair declared (identity-pin against Kling drift).
- [ ] Final shot has FLAG block citing the named flag and the Phase 1 reactive comment id it triggers.
- [ ] Speaker accent colors (cyan/rose/amber/violet/etc.) appear in at least 2 shots each character is on screen.
- [ ] At least one shot per cinematic includes a Loredex visible cue (book, glyph, banner, monument plaque) for cross-reference with the Loredex codex.
- [ ] Mechanic cinematics: at least one shot shows the mechanic's diegetic UI surface (card frame, allegiance banner, soul stone, oracle spread, chess board, etc.) in-world before any abstracted UI.

---

## Phase 1 hook map (cinematic → dialog density tie-back)

Every cinematic's final shot fires a flag. Phase 1 then ships the matching reactive companion comment + ask-topic alternate. The mapping below is the contract — Phase 1 cannot ship without the listed entries.

| Flag fired | Phase 1 reactive id | NPC | Ask-topic |
|---|---|---|---|
| `prelude_awakening_seen` | `cc_prelude_awakening_first` | Elara | `ask_what_woke_me` |
| `act1_memoir_seen` | `cc_act1_memoir_first` | Elara + Human | `ask_who_was_programmer` |
| `act2_substrate_seen` | `cc_act2_substrate_first` | Human | `ask_what_is_substrate` |
| `act3_offer_seen` | `cc_act3_offer_first` | Elara | `ask_three_kaels` |
| `act4_revelation_seen` | `cc_act4_revelation_first` | Elara + Human (simultaneous) | `ask_path_a_b_c` |
| `act5_map_seen` | `cc_act5_map_first` | Elara | `ask_seventeen_thousand_years` |
| `act6_confession_seen` | `cc_act6_confession_first` | Elara + Human | `ask_who_are_you_really` |
| `act7_convergence_seen` | `cc_act7_convergence_first` | All | `ask_what_now` |
| `mech_card_combat_intro_seen` | `cc_mech_card_combat_first` | Elara | `ask_how_does_dischordia` |
| `mech_deckbuilder_intro_seen` | `cc_mech_deckbuilder_first` | Engineer | `ask_engineers_bench` |
| `mech_allegiances_intro_seen` | `cc_mech_allegiances_first` | Human | `ask_eight_factions` |
| `mech_witnessing_intro_seen` | `cc_mech_witnessing_first` | Elara + Human | `ask_light_or_dark` |
| `mech_soul_stones_intro_seen` | `cc_mech_soul_stones_first` | Antiquarian | `ask_soul_stones` |
| `mech_oracle_deck_intro_seen` | `cc_mech_oracle_deck_first` | Seer | `ask_oracle_spread` |
| `mech_chess_intro_seen` | `cc_mech_chess_first` | Game Master | `ask_chess_stakes` |
| `mech_sprite_proxy_intro_seen` | `cc_mech_sprite_proxy_first` | Elara | `ask_sprite_bond` |
| `mech_expansion_drops_intro_seen` | `cc_mech_expansion_drops_first` | Engineer | `ask_conexus_fabrication` |
| `mech_trade_empire_intro_seen` | `cc_mech_trade_empire_first` | Trade NPC | `ask_eight_sectors` |

---

## Producer dry-run gate

Before bulk-generating: take 1 act intro (recommend `01_act1_memoir.md` — strongest visual continuity case) and 1 mechanic intro (recommend `01_card_combat.md` — highest player exposure) through Kling Omni end-to-end. Verify identity-pin holds across all 12 shots before greenlighting the remaining 16.
