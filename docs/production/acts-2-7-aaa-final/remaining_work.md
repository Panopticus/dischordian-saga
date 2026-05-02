# Remaining Work Tracker — Acts 2-7 Production

> **VERIFIED 2026-05-02 — see `docs/production/OPEN_ASSETS_2026-05-02.md` §1, §3, §6 for the current open list.**
>
> The triple-signal audit (`docs/production/audit/cdn-liveness.tsv`) found that this tracker is significantly out of date. Many items listed here are actually shipped; some "completed" items are not. Per-line verification below.

## COMPLETED

- 17 VFX atlases (all acts) <!-- 🔴 CONTRADICTED 2026-05-02: all 21 VFX atlases (not 17) declared in ASSET_MANIFEST.md return 403 on dgrsart. None are on CDN. See OPEN_ASSETS §3. -->
- Act 2 cinematic frames: 12 (6 cinematics × 2) <!-- 🟡 PARTIAL 2026-05-02: cinematic START/END key frames return 403 at every probed path. Final MP4s for Act 2: 4 of 6 live (cin_act2_silence and cin_act2_gamemaster_left are 403). See OPEN_ASSETS §1.1, §1.2. -->
- Act 3 cinematic frames: 14 (7 cinematics × 2) <!-- 🟡 PARTIAL 2026-05-02: START/END frames not on CDN. Final MP4s: 6 of 8 live (cin_act3_engineer_rec4 and cin_act3_engineer_rec5 are 403). See OPEN_ASSETS §1.1, §1.2. -->

## ACT 4 — 9 cinematics = 18 frames needed

1. CIN-ACT4-OPENER (start + end) — Kael in prison mirror <!-- ✅ MP4 SHIPPED 2026-05-02 (frames not on CDN; not required since MP4 lives) -->
2. CIN-ACT4-PATH-WILLING (shared start + end) — Human removes fedora willingly <!-- ✅ MP4 SHIPPED 2026-05-02 -->
3. CIN-ACT4-PATH-DISCOVERY (shared start + end) — Human scanlines fail <!-- ✅ MP4 SHIPPED 2026-05-02 -->
4. CIN-ACT4-PATH-BETRAYAL (shared start + end) — Human overdriven + violet glitch <!-- ✅ MP4 SHIPPED 2026-05-02 -->
5. CIN-ACT4-MEMORIAL-CORRIDOR (start + end) ★ KEY — Elara + Human first shared frame <!-- ✅ MP4 SHIPPED 2026-05-02 -->
6. CIN-ACT4-KAEL-EXTRACTION-1 (start + end) — The Cell <!-- ✅ MP4 SHIPPED 2026-05-02 -->
7. CIN-ACT4-KAEL-EXTRACTION-2 (start + end) — The Extraction <!-- ✅ MP4 SHIPPED 2026-05-02 -->
8. CIN-ACT4-KAEL-EXTRACTION-3 (start + end) — Warlord Rematch <!-- ✅ MP4 SHIPPED 2026-05-02 -->
9. CIN-ACT4-KAEL-EXTRACTION-4 (start + end) — White Oracle <!-- ✅ MP4 SHIPPED 2026-05-02 -->

Note: shared start for paths 2-4, shared start for extractions 1-4 = 14 unique frames

<!-- 🟡 ALL ACT 4 MP4s ARE LIVE on dgrsart 2026-05-02. The 18 frames called out here are intermediate Veo inputs that don't need to live on CDN unless re-rendering is commissioned. -->

## ACT 4.5 — 2 cinematics = 4 frames

1. CIN-ACT4_5-OPENER (start + end) — bone-chrome racetrack + casino table <!-- ✅ MP4 SHIPPED 2026-05-02 -->
2. CIN-ACT4_5-IDENTITY-WAGER (start + end) — DeGen places chip <!-- ✅ MP4 SHIPPED 2026-05-02 -->

## ACT 5 — 6 cinematics = 12 frames

1. CIN-ACT5-OPENER (start + end) — ration wrapper map <!-- ✅ MP4 SHIPPED 2026-05-02 -->
2. CIN-ACT5-BULB-DIMS (start + end) — sector consumption <!-- ✅ MP4 SHIPPED 2026-05-02 -->
3. CIN-ACT5-SECTOR-WAKES (start + end) — sector reclamation <!-- ✅ MP4 SHIPPED 2026-05-02 -->
4. CIN-ACT5-IRON-LION-FINAL (start + end) ★ KEY — Iron Lion death broadcast <!-- ✅ MP4 SHIPPED 2026-05-02 -->
5. CIN-ACT5-BRIDGE-OF-KAEL (start + end) — post-credits Engineer <!-- ✅ MP4 SHIPPED 2026-05-02 -->
6. CIN-ACT5-ENGINEER-RECORDING-7 (start + end) — final recording, bleakest <!-- ✅ MP4 SHIPPED 2026-05-02 -->

## ACT 6 — 4 cinematics = 8 frames

1. CIN-ACT6-OPENER (start + end) — three chairs <!-- ✅ MP4 SHIPPED 2026-05-02 -->
2. CIN-ACT6-ELARA-CONFESSION (start + end) — face resolves photoreal <!-- ✅ MP4 SHIPPED 2026-05-02 -->
3. CIN-ACT6-HUMAN-CONFESSION (start + end) — coat on chair, absence <!-- ✅ MP4 SHIPPED 2026-05-02 -->
4. CIN-ACT6-WATCHER-REVEAL (start + end) — shape in background <!-- ✅ MP4 SHIPPED 2026-05-02 -->

## ACT 7 — 7 cinematics = ~14 frames (some shared starts)

1. CIN-ACT7-OPENER (start + end) — army composite reveal <!-- ✅ MP4 SHIPPED 2026-05-02 -->
2. CIN-ACT7-TWO-WARS-DIAGRAM (start + end) — blackboard <!-- ✅ MP4 SHIPPED 2026-05-02 -->
3. CIN-ACT7-VOICES-ALIGN (start + end) ★★ KEY — chord ring <!-- ✅ MP4 SHIPPED 2026-05-02 -->
4. CIN-ACT7-STANCE-HUMANITY (shared start + end) <!-- ✅ MP4 SHIPPED 2026-05-02 -->
5. CIN-ACT7-STANCE-PATTERN (shared start + end) <!-- ✅ MP4 SHIPPED 2026-05-02 -->
6. CIN-ACT7-STANCE-BRIDGE (shared start + end) <!-- ✅ MP4 SHIPPED 2026-05-02 -->
7. CIN-ACT7-STANCE-COMMAND (shared start + end) <!-- ✅ MP4 SHIPPED 2026-05-02 -->

## MUSIC — 40 cues total (see production bible Part 8)

<!-- 🔴 OPEN 2026-05-02: only 5 of 40 cues live on CDN (act-{4,4_5,5,6,7}-intro.mp3). Acts 2-3 intros + ~30 stingers/character cues are unrendered. See OPEN_ASSETS §6.1, §6.2. -->

---

## VERIFICATION SUMMARY (2026-05-02)

| Item class | Tracker says | Reality |
|---|---|---|
| VFX atlases | 17 ✓ complete | **0 / 21 on CDN** — all 403 |
| Act 2 final MP4s | 12/12 ✓ | 4 / 6 live (2 missing) |
| Act 3 final MP4s | 14/14 ✓ | 6 / 8 live (engineer_rec4/5 missing) |
| Acts 4–7 + 4.5 final MP4s | "needs 18+4+12+8+14 = 56 frames" | All 28 final MP4s LIVE on CDN |
| Cinematic START/END key frames | listed as needed | not on CDN at any probed path; only required if re-rendering MP4s |
| Music cues | 40 needed | 5 act intros LIVE; ~35 still open |

The "still to be made" list is therefore much smaller than this tracker says:
- 5 Acts 2–3 cinematic MP4s (not all 56 frames) — see OPEN_ASSETS §1.1
- 21 VFX atlases — see OPEN_ASSETS §3
- ~35 music cues — see OPEN_ASSETS §6.2
