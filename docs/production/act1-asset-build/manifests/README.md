# Act 1 Asset Build Workspace

Mirror of `docs/production/prelude-asset-build/` for Act 1 scope.
Source-of-truth narrative spec is
`docs/production/UNIVERSAL_PROMPTING_DOC_PRELUDE_ACT1.md`.

## Counts

| Asset type | Count |
|---|---|
| Room still prompts | 5 |
| Matchup portrait prompts | 12 |
| Cutscene triplets (start + end + motion) | 3 |
| Cutscene wirings (code + existing assets) | 2 (Last Words full, Two Witnesses Part 2) |
| UI components | 4 |
| Cutscene VO lines | 4 |
| Section 6 Antiquarian VO lines | 19 |
| Animator reference deliverables | 3 |

## Directories

| Type | Directory |
|---|---|
| Structured JSON manifest | `manifests/asset_prompt_manifest.json` |
| Room still prompts | `prompts/rooms/` |
| Matchup portrait prompts | `prompts/matchups/` |
| Cutscene triplet prompts | `prompts/cutscenes/` |
| Voice CSV files | `prompts/voice/` |

## Canon hygiene

Every prompt in this workspace must pass the
`UNIVERSAL_PROMPTING_DOC_PRELUDE_ACT1.md` §0 canon hygiene
rules. See the manifest's `canon_hygiene` block for the
forbidden-phrase list.
