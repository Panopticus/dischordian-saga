/**
 * PetGardenPage — §2.5 post-Prelude pet-bond arc.
 *
 * The Pet Garden is the calm, contemplative room a player unlocks
 * after completing the Prelude. Per NARRATIVE_ARCHITECTURE.md §2.5
 * it is the bonding space for the Ark's small living things — the
 * pets the player accrues across the campaign — and the narrator
 * threads §2.5 commentary through every interaction.
 *
 * The page renders:
 *   1. A roster of the player's pets (read defensively from
 *      `state.pets`; static placeholders if none are tracked yet).
 *   2. A "tend the garden" interaction that nudges the active pet's
 *      bond. The button calls `gainCompanionXp(petId, 1)` when the
 *      helper is available, otherwise records a local "tended" tick
 *      and updates the in-page status line. Either way the page
 *      remains functional.
 *   3. The MobileNarratorSlot in the upper-right, seeded with
 *      `roomId="pet_garden"` so the §2.5 dialog tree fires.
 */
import { useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useGame } from "@/contexts/GameContext";
import { MobileNarratorSlot } from "@/components/MobileNarratorSlot";
import { BreedingPanel } from "@/components/BreedingPanel";

interface PetEntry {
  id: string;
  name: string;
  species: string;
  bond: number;
  whisper: string;
}

const FALLBACK_PETS: ReadonlyArray<PetEntry> = [
  {
    id: "pet_finch",
    name: "Finch",
    species: "Cryo-finch",
    bond: 12,
    whisper: "He hums in the same key as the substrate.",
  },
  {
    id: "pet_moss",
    name: "Moss",
    species: "Garden cat",
    bond: 28,
    whisper: "She sleeps wherever the light is warmest.",
  },
  {
    id: "pet_signal",
    name: "Signal",
    species: "Repair drone",
    bond: 40,
    whisper: "It mistakes your shadow for a friend, and is right.",
  },
];

interface MaybePetRecord {
  id?: string;
  petId?: string;
  name?: string;
  species?: string;
  bond?: number;
  bondLevel?: number;
  whisper?: string;
}

function readPets(state: unknown): ReadonlyArray<PetEntry> {
  if (!state || typeof state !== "object") return FALLBACK_PETS;
  const candidate = (state as { pets?: unknown }).pets;
  if (!Array.isArray(candidate) || candidate.length === 0) return FALLBACK_PETS;
  return candidate.map((raw, i): PetEntry => {
    const r = raw as MaybePetRecord;
    return {
      id: r.id ?? r.petId ?? `pet_dynamic_${i}`,
      name: r.name ?? "Unnamed",
      species: r.species ?? "Companion",
      bond: r.bond ?? r.bondLevel ?? 0,
      whisper: r.whisper ?? "They wait for you here.",
    };
  });
}

export default function PetGardenPage() {
  const game = useGame();
  const pets = useMemo(() => readPets(game.state), [game.state]);

  const [selectedId, setSelectedId] = useState<string>(() => pets[0]?.id ?? "");
  const [tendCounts, setTendCounts] = useState<Record<string, number>>({});
  const [statusLine, setStatusLine] = useState<string>(
    "The garden is quiet. Pick a creature, sit with them.",
  );

  const selected = pets.find((p) => p.id === selectedId) ?? pets[0];

  const tend = useCallback(() => {
    if (!selected) return;
    setTendCounts((prev) => ({
      ...prev,
      [selected.id]: (prev[selected.id] ?? 0) + 1,
    }));
    // Best-effort bond nudge — `gainCompanionXp` is the closest
    // existing helper. If the runtime no longer accepts pet ids
    // (e.g. when companion validation tightens) the call is wrapped
    // so the page stays interactive.
    try {
      game.gainCompanionXp?.(selected.id, 1);
    } catch {
      // intentionally swallowed — UI must not break on a soft helper
    }
    setStatusLine(`You sit with ${selected.name}. They lean in.`);
  }, [selected, game]);

  if (!selected) {
    return (
      <div className="min-h-screen w-full void-bg-canvas void-text p-8 sm:p-12 relative">
        <MobileNarratorSlot roomId="pet_garden" />
        <div className="max-w-lg mx-auto pt-16 text-center">
          <h1 className="font-serif text-3xl void-text">The Pet Garden</h1>
          <p className="font-serif text-sm void-text-dim mt-4">
            Nothing alive is here yet. Bring something small back from
            the Ark and the garden will hold it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full void-bg-canvas void-text p-8 sm:p-12 relative overflow-hidden">
      <MobileNarratorSlot roomId="pet_garden" />
      <div className="max-w-3xl mx-auto">
        <motion.header
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] void-text-muted">
            ark · pet garden
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl void-text mt-2">
            Where Small Things Grow
          </h1>
          <p className="font-serif text-sm italic void-text-dim mt-3">
            The Prelude is over. The garden was always here, waiting
            for you to notice.
          </p>
        </motion.header>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          {pets.map((pet, i) => {
            const isActive = pet.id === selected.id;
            const tended = tendCounts[pet.id] ?? 0;
            return (
              <motion.button
                key={pet.id}
                type="button"
                onClick={() => setSelectedId(pet.id)}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                data-active={isActive ? "true" : "false"}
                className="text-left rounded-lg p-4 void-border void-bg-elevated transition-colors hover:void-bg-surface data-[active=true]:void-bg-surface"
                data-testid={`pet-card-${pet.id}`}
              >
                <p className="font-serif text-base void-text">{pet.name}</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] void-text-muted mt-1">
                  {pet.species}
                </p>
                <p className="font-mono text-[10px] void-text-dim mt-3">
                  bond {pet.bond + tended}
                </p>
              </motion.button>
            );
          })}
        </div>

        <motion.section
          key={selected.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="rounded-lg p-6 void-border void-bg-sunk"
        >
          <h2 className="font-serif text-xl void-text">{selected.name}</h2>
          <p className="font-serif text-sm italic void-text-dim mt-2">
            {selected.whisper}
          </p>
          <p className="font-mono text-[11px] void-text-muted mt-6">
            {statusLine}
          </p>
          <button
            type="button"
            onClick={tend}
            className="mt-5 px-4 py-2 rounded-md void-border void-bg-elevated font-mono text-[11px] uppercase tracking-[0.2em] void-text-dim hover:void-text transition-colors"
            data-testid="pet-tend-button"
          >
            tend the garden
          </button>
          <p className="font-mono text-[9px] uppercase tracking-[0.3em] void-text-muted mt-6">
            tended today: {tendCounts[selected.id] ?? 0}
          </p>
        </motion.section>

        <section className="mt-10">
          <BreedingPanel state={game.state} />
        </section>

        <div className="mt-8">
          <BreedingPanel state={game.state} />
        </div>
      </div>
    </div>
  );
}
