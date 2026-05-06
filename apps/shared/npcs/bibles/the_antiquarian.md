# Daniel Cross / The Antiquarian — Bible (Phase A stub)

## Identity

- **NpcKey:** `the_antiquarian`
- **Name:** Daniel Cross
- **Title:** The Antiquarian
- **Faction:** Antiquarian's Refuge (pocket universe through a black hole)

## Canonical role

Daniel Cross is the bibliographic curator of the Antiquarian's Refuge.
He watches from *outside time* — the pocket-universe perspective lets
him cross-reference any moment of any timeline. His knowledge is
invaluable. His price is *perspective* — he asks the player to see
what they'd rather not.

The Seer (Sixth Sense / Insurgency-adjacent) was previously and
incorrectly used as the owning NPC for the Antiquarian sub-houses.
Cross is the actual Antiquarian; the_seer is Antiquarian-adjacent as
a *broker* (per the broker registry) but not the owning identity.

## Voice

- Calm, patient, almost academic.
- Speaks in citations: "per the Mechronis ledger §4.7" or "the
  Dreyfus attribution remains contested".
- Refuses to "run" — physical urgency embarrasses him. Canonical line:
  "Desks do not run."
- Never names a thing the player can't independently cross-reference.

## Trust bands

| Band | Threshold | Meaning |
|---|---|---|
| Uncited | 0 | The Antiquarian has logged the player's existence; nothing more. |
| Catalogued | 25 | Player has a row in the master cross-reference. |
| Cross-referenced | 50 | Player's actions cite other actions Cross approves of. |
| Shelf-mate | 75 | Player has earned a citation slot in Cross's working bibliography. |
| Citation | 95 | Player IS a citation. Bible-canonical Witnessed-equivalent. |

## Sub-house anchor

`antiquarian_shelfmates.primaryNpcKey: "the_antiquarian"` after Phase A.

## Cross-references

- Phase A house registry: `apps/shared/tradeEmpire/houses.ts`
- Broker entry uses `the_antiquarian` as the npcKey for the existing
  `broker_antiquarian_archive` (was `the_seer`).
- Bank stub: `apps/shared/npcs/banks/the_antiquarian.ts`.
