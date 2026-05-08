# Canon reference images — 2026-05-08 producer delivery

This folder is the holding area for producer-supplied **canon reference images**
that have been received but not yet uploaded to the CDN. Once a file here lands
on the CDN at its designated path (see `../../ART_DEPARTMENT_PRODUCTION.md` §5.2),
the file here can be deleted.

Files expected in this folder:

| Local filename | Target CDN path | Subject |
|---|---|---|
| `game_masters_diptych.png`           | `art/portraits/game-masters/diptych.png` | Two Game Masters (Left + Right side-by-side) |
| `game_master_left.png`               | `art/portraits/game-masters/left.png`    | Left Game Master (femme, demonic-elven) |
| `game_master_right.png`              | `art/portraits/game-masters/right.png`   | Right Game Master (masc, demonic-elven, horns) |
| `vex_solene_bust.png`                | `art/portraits/vex_solene/bust.png` + `npcs/vex_solene_bust.png` | Vex Solène — yellow raincoat / purple mask / brass goggles |
| `marion_kell_episode_4_live_feed.png`| `art/palimpsest/marion_kell/episode_4_live_feed.png` | Marion Kell Episode 4 ghost-contestant frame |

Canonical descriptions of each are in §5.2 of `ART_DEPARTMENT_PRODUCTION.md`.

Producer please upload the originals to this folder and ping #art-pipeline; the
upload-to-CDN step lives in `apps/scripts/upload-public-to-s3.ts`.
