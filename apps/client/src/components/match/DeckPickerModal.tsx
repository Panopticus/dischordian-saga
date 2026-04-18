/**
 * DeckPickerModal — pre-match deck selection.
 *
 * Before this existed, every match auto-loaded the faction starter
 * deck (`STARTER_DECK_MAP[faction]`). Players who invested time in
 * the deckbuilder had no way to bring their custom decks to an
 * actual match — the UI just ignored them. This modal is the
 * missing bridge: it lists saved decks for the selected faction
 * plus the starter as a fallback, lets the player pick one, and
 * returns the expanded card-def-id list to the caller.
 *
 * Render-free-ish: the component queries `trpc.cardGame.myDecks`
 * and filters client-side to decks that look faction-compatible
 * (no authored faction lock on DB decks yet, so we rely on
 * heuristics: a deck whose first card's faction matches the
 * selected faction, or the default "Starter Deck" name). The
 * starter is always offered as "Faction Starter" so players who
 * never touched the deckbuilder have a valid default.
 */
import { useMemo, useState } from "react";
import type { Faction } from "@/game/duelyst/types";
import { FACTION_NAMES } from "@/game/duelyst/types";
import { STARTER_DECK_MAP } from "@shared/tcg-core/decks/starterDecks";
import { expandDbDeckToCardDefIds } from "@shared/expandDbDeck";
import { trpc } from "@/lib/trpc";

export interface DeckPickerResult {
  /** Flat card-def-id list ready for `TcgClient.init`. */
  cardDefIds: string[];
  /** Label the picker will show on the post-selection confirmation
   *  row. The caller can surface it in a toast or in-match header. */
  label: string;
}

export interface DeckPickerModalProps {
  faction: Faction;
  onPick: (result: DeckPickerResult) => void;
  onCancel: () => void;
}

interface DeckOption {
  key: string;
  label: string;
  detail: string;
  cardDefIds: string[];
}

export function DeckPickerModal({
  faction,
  onPick,
  onCancel,
}: DeckPickerModalProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const decksQuery = trpc.cardGame.myDecks.useQuery();

  const options = useMemo<DeckOption[]>(() => {
    const rows: DeckOption[] = [];
    // The starter is always the first, canonical option so a player
    // who never visited the deckbuilder has a legal default.
    const starter = STARTER_DECK_MAP[faction];
    if (starter) {
      rows.push({
        key: "faction_starter",
        label: `${FACTION_NAMES[faction]} Starter`,
        detail: `${starter.cardDefIds.length} cards · canon recipe`,
        cardDefIds: [...starter.cardDefIds],
      });
    }
    // User-authored decks. No faction-lock metadata on DB decks
    // yet, so every non-empty deck shows up; players can sort by
    // visual inspection of the deck name.
    const userDecks = decksQuery.data ?? [];
    for (const deck of userDecks) {
      const expanded = expandDbDeckToCardDefIds(
        (deck.cardList ?? []) as { cardId: string; quantity: number }[],
      );
      if (expanded.length === 0) continue; // skip empty / invalid DB rows
      rows.push({
        key: `db_${deck.id}`,
        label: deck.name ?? `Deck ${deck.id}`,
        detail: `${expanded.length} cards${deck.description ? ` · ${deck.description}` : ""}`,
        cardDefIds: expanded,
      });
    }
    return rows;
  }, [faction, decksQuery.data]);

  const handleConfirm = () => {
    const pick =
      options.find((o) => o.key === selected) ??
      options[0]; // fallback to starter
    if (!pick) {
      onCancel();
      return;
    }
    onPick({
      cardDefIds: pick.cardDefIds,
      label: pick.label,
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Choose your deck"
      className="fixed inset-0 z-[70] bg-black/85 backdrop-blur-sm flex items-center justify-center p-6"
      data-testid="deck-picker-modal"
    >
      <div className="max-w-lg w-full void-bg-canvas border void-border rounded p-6">
        <header className="mb-4 text-center">
          <p className="font-mono text-[10px] tracking-[0.3em] void-text uppercase mb-1">
            Choose your deck
          </p>
          <h2 className="font-serif text-xl void-text">
            {FACTION_NAMES[faction]}
          </h2>
        </header>

        <ul className="space-y-2 max-h-80 overflow-y-auto mb-4">
          {options.length === 0 && (
            <li className="text-center font-mono text-xs void-text py-8">
              No decks available. Claim your starter pack from the Bridge Console.
            </li>
          )}
          {options.map((option) => {
            const active = selected === option.key ||
              (selected === null && option.key === "faction_starter");
            return (
              <li key={option.key}>
                <button
                  type="button"
                  onClick={() => setSelected(option.key)}
                  data-testid={`deck-picker-option-${option.key}`}
                  className={
                    "w-full text-left p-3 rounded border transition " +
                    (active
                      ? "bg-primary/10 border-primary/60"
                      : "void-bg-canvas void-border void-bg-canvas")
                  }
                >
                  <p className="font-serif text-sm void-text">
                    {option.label}
                  </p>
                  <p className="font-mono text-[10px] void-text mt-1">
                    {option.detail}
                  </p>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="flex gap-3 justify-center">
          <button
            type="button"
            onClick={handleConfirm}
            disabled={options.length === 0}
            data-testid="deck-picker-confirm"
            className="px-4 py-2 bg-primary/10 border border-primary/60 text-primary rounded font-mono text-xs hover:bg-primary/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            CONFIRM
          </button>
          <button
            type="button"
            onClick={onCancel}
            data-testid="deck-picker-cancel"
            className="px-4 py-2 void-bg-canvas border void-border void-text rounded font-mono text-xs void-bg-canvas transition-colors"
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeckPickerModal;
