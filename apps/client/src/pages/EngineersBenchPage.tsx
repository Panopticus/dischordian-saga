/* ═══════════════════════════════════════════════════════
   ENGINEER'S BENCH — §6.2 Act 2 immersive crafting room

   The Forge, reframed as a diegetic workshop inside the Ark.
   Plays on `/engineers-bench` (distinct from `/forge`). Wires:

     - §6.2 framing lines: firstPowerOn (modal), elaraAmbient /
       humanAmbient (companion comments), firstLightCraft /
       firstDarkCraft (modals), outOfMemoryEnergy (pinch modal).
     - §6.3 Zephyr-9 Classroom sidebar (chess depth tier).
     - Memory Energy HUD with rarity-priced crafts.
     - Engineer Recording log (right rail).

   The recipe browse/craft flow uses the same server mutation
   ForgePage uses (trpc.crafting.craftRecipe). The bench ALSO
   deducts Memory Energy via the client-side `craftItem` action
   in GameContext so narrative gates (`crafting_mastered`,
   first-light, first-dark) fire reliably regardless of the
   server outcome. The Forge remains available at `/forge` as
   the pre-Act-2 skin.
   ═══════════════════════════════════════════════════════ */
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  Hammer,
  Lock,
  Play,
  Power,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useGame } from "@/contexts/GameContext";
import { fireCompanionComment } from "@/lib/companionCommentQueue";
import {
  CRAFTING_RECIPES,
  canCraftRecipe,
  type CraftingRecipe,
  type CraftingSkillId,
} from "@/data/craftingData";
import {
  ENGINEERS_BENCH_FRAMING,
  ZEPHYR_9_CLASSROOM,
} from "@shared/act2Interlude";
import {
  canAffordMemoryEnergy,
  getMemoryEnergyCostForRarity,
} from "@shared/memoryEnergy";
import {
  currentClassroomTier,
  nextClassroomTier,
} from "@shared/act2ClassroomUnlocks";
import {
  ENGINEER_RECORDINGS,
  getDiscoveredRecordings,
} from "@shared/engineerRecordings";
import MemoryEnergyBadge from "@/components/MemoryEnergyBadge";
import LivingBackground from "@/components/LivingBackground";

type Modal =
  | { kind: "none" }
  | { kind: "firstPowerOn" }
  | { kind: "firstLightCraft" }
  | { kind: "firstDarkCraft" }
  | { kind: "outOfEnergy"; cost: number };

export default function EngineersBenchPage() {
  const { isAuthenticated } = useAuth();
  const {
    state,
    setNarrativeFlag,
    getMemoryEnergyCap,
    adjustMemoryEnergy,
    craftItem,
  } = useGame();

  const flags = state.narrativeFlags ?? {};
  const memoryEnergy = state.memoryEnergy ?? 0;
  const cap = getMemoryEnergyCap();
  const chessDepth = state.chessDepth ?? 0;

  const tierNow = currentClassroomTier({ chessDepth, flags });
  const tierNext = nextClassroomTier({ chessDepth, flags });

  const recordings = useMemo(
    () => getDiscoveredRecordings(flags),
    [flags],
  );

  const [selectedRecipe, setSelectedRecipe] = useState<CraftingRecipe | null>(null);
  const [isCrafting, setIsCrafting] = useState(false);
  const [modal, setModal] = useState<Modal>(() =>
    flags.engineers_bench_powered_on ? { kind: "none" } : { kind: "firstPowerOn" },
  );

  // Power the bench on for the first time. Fires once per save.
  useEffect(() => {
    if (!flags.engineers_bench_powered_on) {
      setNarrativeFlag("engineers_bench_powered_on", true);
      // Queue the ambient lines a moment after the cinematic so the
      // first-power-on modal isn't fighting the toast queue for space.
      const t = window.setTimeout(() => {
        fireCompanionComment("bench_elara_ambient");
        fireCompanionComment("bench_human_ambient");
      }, 4200);
      return () => window.clearTimeout(t);
    }
  }, [flags.engineers_bench_powered_on, setNarrativeFlag]);

  // Trpc: read authoritative crafting profile. We'll use this for the
  // server-authoritative craft mutation when the player is signed in.
  const profileQuery = trpc.crafting.getCraftingProfile.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const dreamQuery = trpc.crafting.getDreamBalance.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const utils = trpc.useUtils();

  const skillLevels = useMemo<Record<CraftingSkillId, number>>(() => {
    const p = profileQuery.data;
    return {
      weaponsmith: p?.skills.weaponsmith?.level ?? 0,
      armorsmith: p?.skills.armorsmith?.level ?? 0,
      enchanting: p?.skills.enchanting?.level ?? 0,
      alchemy: p?.skills.alchemy?.level ?? 0,
      engineering: p?.skills.engineering?.level ?? 0,
    };
  }, [profileQuery.data]);
  const materials = useMemo<Record<string, number>>(
    () => profileQuery.data?.materials ?? {},
    [profileQuery.data],
  );
  const dreamTokens = dreamQuery.data?.dream ?? 0;

  const craftMutation = trpc.crafting.craftRecipe.useMutation({
    onSuccess: (res) => {
      setIsCrafting(false);
      if (!res.success) {
        toast.error(res.error ?? "Crafting failed");
        return;
      }
      if (res.crafted) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
      void utils.crafting.getCraftingProfile.invalidate();
      void utils.crafting.getDreamBalance.invalidate();
    },
    onError: (err) => {
      setIsCrafting(false);
      toast.error(err.message);
    },
  });

  const previewCost = useMemo(
    () =>
      selectedRecipe
        ? getMemoryEnergyCostForRarity(selectedRecipe.rarity)
        : 0,
    [selectedRecipe],
  );

  const handleCraft = useCallback(() => {
    if (!selectedRecipe || isCrafting) return;
    const cost = getMemoryEnergyCostForRarity(selectedRecipe.rarity);
    if (!canAffordMemoryEnergy(memoryEnergy, cost)) {
      setModal({ kind: "outOfEnergy", cost });
      if (!flags.out_of_memory_energy_line_seen) {
        setNarrativeFlag("out_of_memory_energy_line_seen", true);
      }
      return;
    }
    const { canCraft } = canCraftRecipe(
      selectedRecipe,
      skillLevels,
      materials,
      dreamTokens,
    );
    if (!canCraft) {
      toast.error("Bench rejects — check materials, skill, and dream cost.");
      return;
    }

    setIsCrafting(true);

    // Deduct Memory Energy immediately + record the craft in the
    // client-side bag so `crafting_mastered` can fire against
    // state.craftedItems.length.
    craftItem(
      selectedRecipe.id,
      selectedRecipe.materials,
      selectedRecipe.dreamCost,
      selectedRecipe.skill,
      selectedRecipe.xpGain,
      selectedRecipe.outputItemId,
      selectedRecipe.outputQuantity,
      cost,
    );

    // First-light / first-dark framing hooks.
    if (selectedRecipe.alignment === "light" && !flags.first_light_craft_seen) {
      setNarrativeFlag("first_light_craft_seen", true);
      fireCompanionComment("first_light_craft");
      setModal({ kind: "firstLightCraft" });
    } else if (
      selectedRecipe.alignment === "dark" &&
      !flags.first_dark_craft_seen
    ) {
      setNarrativeFlag("first_dark_craft_seen", true);
      fireCompanionComment("first_dark_craft");
      setModal({ kind: "firstDarkCraft" });
    }

    // Server mutation when signed-in — the server remains the source of
    // truth for XP, level-ups, and randomized success rolls.
    if (isAuthenticated) {
      craftMutation.mutate({
        recipeId: selectedRecipe.id,
        skill: selectedRecipe.skill,
        requiredLevel: selectedRecipe.requiredLevel,
        materials: selectedRecipe.materials,
        dreamCost: selectedRecipe.dreamCost,
        baseSuccessRate: selectedRecipe.baseSuccessRate,
        xpGain: selectedRecipe.xpGain,
        outputItemId: selectedRecipe.outputItemId,
        outputQuantity: selectedRecipe.outputQuantity,
      });
    } else {
      // Guest mode: resolve the client-side animation directly.
      setTimeout(() => {
        setIsCrafting(false);
        toast.success(`Crafted ${selectedRecipe.name}.`);
      }, Math.max(500, selectedRecipe.craftTime * 100));
    }
  }, [
    selectedRecipe,
    isCrafting,
    memoryEnergy,
    flags,
    skillLevels,
    materials,
    dreamTokens,
    isAuthenticated,
    craftItem,
    craftMutation,
    setNarrativeFlag,
  ]);

  const handleDevEarn = useCallback(() => {
    // Dev affordance for untethered playtests — only shown when the
    // bench is out of energy and we're in a non-production build.
    adjustMemoryEnergy(10);
    toast.info("Memory Energy +10 (dev)");
  }, [adjustMemoryEnergy]);

  const benchAccent =
    memoryEnergy === 0
      ? "rgba(239, 68, 68, 0.35)"
      : "rgba(99, 102, 241, 0.35)";

  return (
    <div className="relative min-h-screen bg-stone-950 text-stone-100">
      <LivingBackground
        src="/art/rooms/room-engineers-bench.png"
        accent={benchAccent}
        opacity={0.12}
        particleCount={4}
        scanlines={false}
      />

      <header className="relative z-10 flex items-center justify-between border-b border-indigo-500/30 bg-stone-950/80 px-4 py-3 backdrop-blur">
        <Link
          to="/ark"
          className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-indigo-300/80 hover:text-indigo-100"
        >
          <ChevronLeft size={14} />
          Engineering
        </Link>
        <div className="text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-indigo-300/80">
            §6.2 · The Engineer's Bench
          </p>
          <p className="mt-1 font-serif text-lg italic text-indigo-50">
            The Forged Hand
          </p>
        </div>
        <MemoryEnergyBadge
          current={memoryEnergy}
          cap={cap}
          previewCost={previewCost}
        />
      </header>

      <main className="relative z-10 mx-auto grid max-w-6xl gap-4 px-4 py-6 lg:grid-cols-[240px_1fr_260px]">
        {/* ── ZEPHYR-9 CLASSROOM SIDEBAR ── */}
        <aside className="space-y-3" aria-label="Zephyr-9 Classroom">
          <div className="rounded-md border border-indigo-500/30 bg-stone-950/60 p-4">
            <p className="font-mono text-[9px] uppercase tracking-wider text-indigo-300/80">
              Zephyr-9 · Classroom
            </p>
            <p className="mt-2 font-serif text-[12px] italic text-indigo-100/85">
              Current depth: <span className="tabular-nums">{chessDepth}</span>
              {tierNow > 0 && (
                <>
                  {" · Tier "}
                  <span className="tabular-nums">{tierNow}</span>
                </>
              )}
            </p>
            <div className="mt-3 space-y-2">
              {ZEPHYR_9_CLASSROOM.map((tier) => {
                const achieved = chessDepth >= tier.depth;
                return (
                  <div
                    key={tier.depth}
                    className={[
                      "rounded border px-2 py-1.5",
                      achieved
                        ? "border-emerald-500/40 bg-emerald-950/20"
                        : "border-stone-700 bg-stone-900/30",
                    ].join(" ")}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[9px] tracking-wider text-stone-400">
                        Depth {tier.depth}
                      </span>
                      {achieved ? (
                        <Sparkles size={10} className="text-emerald-300" />
                      ) : (
                        <Lock size={10} className="text-stone-600" />
                      )}
                    </div>
                    <p className="mt-1 font-mono text-[9px] text-stone-300">
                      {tier.reward.replace(/_/g, " ")}
                    </p>
                  </div>
                );
              })}
            </div>
            {tierNext && (
              <p className="mt-3 font-serif text-[11px] italic text-indigo-200/80">
                Next: <em>{tierNext.zephyrLine}</em>
              </p>
            )}
            <Link
              to="/chess"
              className="mt-3 block rounded border border-indigo-500/40 bg-indigo-950/30 px-3 py-2 text-center font-mono text-[10px] uppercase tracking-wider text-indigo-100 hover:bg-indigo-900/40"
            >
              Enter the Board
            </Link>
          </div>
        </aside>

        {/* ── RECIPE GRID + SELECTED RECIPE ── */}
        <section className="space-y-3">
          <div className="rounded-md border border-indigo-500/30 bg-stone-950/60 p-4">
            <p className="font-mono text-[9px] uppercase tracking-wider text-indigo-300/80">
              Bench · Recipes
            </p>
            <div className="mt-3 grid max-h-[480px] grid-cols-1 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
              {CRAFTING_RECIPES.slice(0, 24).map((r) => {
                const cost = getMemoryEnergyCostForRarity(r.rarity);
                const isSelected = selectedRecipe?.id === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSelectedRecipe(r)}
                    className={[
                      "rounded border px-3 py-2 text-left transition-colors",
                      isSelected
                        ? "border-indigo-400 bg-indigo-950/40"
                        : "border-stone-700 bg-stone-900/30 hover:border-indigo-500/40",
                    ].join(" ")}
                    data-testid={`bench-recipe-${r.id}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-serif text-[13px] text-indigo-50">
                        {r.name}
                      </span>
                      <span className="font-mono text-[9px] uppercase text-stone-500">
                        {r.rarity}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-[10px] text-stone-400">
                      <span className="inline-flex items-center gap-1">
                        <Zap size={10} />
                        {cost}
                      </span>
                      <span>{r.description.slice(0, 60)}…</span>
                    </div>
                    {r.alignment && (
                      <div className="mt-1">
                        <span
                          className={[
                            "rounded px-1 py-0.5 font-mono text-[8px] uppercase tracking-wider",
                            r.alignment === "light"
                              ? "bg-cyan-900/30 text-cyan-200"
                              : "bg-violet-900/30 text-violet-200",
                          ].join(" ")}
                        >
                          {r.alignment}
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {selectedRecipe && (
            <div className="rounded-md border border-indigo-500/30 bg-stone-950/70 p-4">
              <div className="flex items-center justify-between">
                <span className="font-serif text-base text-indigo-50">
                  {selectedRecipe.name}
                </span>
                <span className="font-mono text-[10px] uppercase text-stone-400">
                  {selectedRecipe.rarity}
                </span>
              </div>
              <p className="mt-2 font-mono text-[11px] text-stone-300">
                {selectedRecipe.description}
              </p>
              <div className="mt-3 flex items-center gap-3 text-[11px] text-stone-400">
                <span className="inline-flex items-center gap-1">
                  <Zap size={12} />
                  Memory Energy: {previewCost}
                </span>
                <span>Dream: {selectedRecipe.dreamCost}</span>
                <span>
                  Skill: {selectedRecipe.skill} Lv.
                  {selectedRecipe.requiredLevel}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCraft}
                disabled={isCrafting}
                className={[
                  "mt-3 w-full rounded border px-4 py-3 font-mono text-[11px] uppercase tracking-[0.2em]",
                  canAffordMemoryEnergy(memoryEnergy, previewCost) && !isCrafting
                    ? "border-indigo-500 bg-indigo-950/40 text-indigo-100 hover:bg-indigo-900/60"
                    : "border-stone-700 bg-stone-900/40 text-stone-500",
                ].join(" ")}
                data-testid="bench-craft-button"
              >
                <Hammer size={12} className="mr-2 inline" />
                {isCrafting ? "Forging…" : "Forge"}
              </button>
              {!canAffordMemoryEnergy(memoryEnergy, previewCost) && (
                <p
                  className="mt-2 font-serif text-[11px] italic text-amber-300/80"
                  data-testid="bench-out-of-energy-hint"
                >
                  The bench waits. Memory Energy reserve is short by
                  {" "}
                  <span className="tabular-nums">
                    {Math.max(0, previewCost - memoryEnergy)}
                  </span>
                  .
                </p>
              )}
            </div>
          )}
        </section>

        {/* ── ENGINEER RECORDING FEED ── */}
        <aside className="space-y-3" aria-label="Engineer Recordings">
          <div className="rounded-md border border-indigo-500/30 bg-stone-950/60 p-4">
            <p className="font-mono text-[9px] uppercase tracking-wider text-indigo-300/80">
              Holograms · Discovered
            </p>
            <div className="mt-3 space-y-2">
              {recordings.length === 0 && (
                <p className="font-serif text-[11px] italic text-stone-500">
                  No recordings yet. Win card battles and visit the rooms
                  marked on your Ark charts.
                </p>
              )}
              {recordings.map((r) => (
                <div
                  key={r.id}
                  className="rounded border border-stone-700 bg-stone-900/30 px-2 py-1.5"
                >
                  <p className="font-mono text-[9px] tracking-wider text-amber-300/80">
                    #{r.order} · {r.title}
                  </p>
                  <p className="mt-1 font-serif text-[11px] italic text-stone-300">
                    {r.transcript.slice(0, 120)}…
                  </p>
                </div>
              ))}
            </div>
            {ENGINEER_RECORDINGS.length > recordings.length && (
              <p className="mt-3 font-mono text-[9px] text-stone-500">
                {recordings.length}/{ENGINEER_RECORDINGS.length} recovered.
              </p>
            )}
          </div>
        </aside>
      </main>

      {/* ── MODALS ── */}
      <AnimatePresence>
        {modal.kind === "firstPowerOn" && (
          <FramingModal
            key="firstPowerOn"
            icon={<Power size={16} className="text-indigo-300" />}
            label="Bench · First Power On"
            body={ENGINEERS_BENCH_FRAMING.firstPowerOn}
            onClose={() => setModal({ kind: "none" })}
          />
        )}
        {modal.kind === "firstLightCraft" && (
          <FramingModal
            key="firstLightCraft"
            icon={<Sparkles size={16} className="text-cyan-300" />}
            label="Bench · First Light Craft"
            body={ENGINEERS_BENCH_FRAMING.firstLightCraft}
            onClose={() => setModal({ kind: "none" })}
          />
        )}
        {modal.kind === "firstDarkCraft" && (
          <FramingModal
            key="firstDarkCraft"
            icon={<Sparkles size={16} className="text-violet-300" />}
            label="Bench · First Dark Craft"
            body={ENGINEERS_BENCH_FRAMING.firstDarkCraft}
            onClose={() => setModal({ kind: "none" })}
          />
        )}
        {modal.kind === "outOfEnergy" && (
          <FramingModal
            key="outOfEnergy"
            icon={<Zap size={16} className="text-amber-300" />}
            label="Bench · Reserve Empty"
            body={ENGINEERS_BENCH_FRAMING.outOfMemoryEnergy}
            onClose={() => setModal({ kind: "none" })}
            extra={
              import.meta.env.DEV ? (
                <button
                  type="button"
                  onClick={handleDevEarn}
                  className="font-mono text-[10px] uppercase tracking-wider text-amber-200/70 hover:text-amber-100"
                >
                  [dev: +10]
                </button>
              ) : null
            }
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function FramingModal({
  icon,
  label,
  body,
  onClose,
  extra,
}: {
  icon: React.ReactNode;
  label: string;
  body: string;
  onClose: () => void;
  extra?: React.ReactNode;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-40 flex items-center justify-center bg-stone-950/85 backdrop-blur"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      data-testid="bench-framing-modal"
    >
      <motion.div
        className="max-w-lg rounded-md border border-indigo-500/40 bg-stone-950/90 p-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <p className="font-mono text-[10px] uppercase tracking-wider text-indigo-300/80">
              {label}
            </p>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="text-stone-400 hover:text-stone-100"
          >
            <X size={14} />
          </button>
        </div>
        <p className="mt-4 font-serif text-[14px] italic leading-relaxed text-indigo-100">
          {body}
        </p>
        <div className="mt-5 flex items-center justify-between">
          {extra}
          <button
            type="button"
            onClick={onClose}
            className="ml-auto flex items-center gap-2 rounded border border-indigo-500/40 bg-indigo-950/40 px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-indigo-100 hover:bg-indigo-900/60"
          >
            <Play size={12} />
            Continue
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
