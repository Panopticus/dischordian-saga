/* ═══════════════════════════════════════════════════
   THE FORGE — Crafting station page
   Browse recipes, manage materials, craft items, and
   level up crafting skills.
   ═══════════════════════════════════════════════════ */
import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  ChevronLeft, Hammer, Flame, Shield, Sword, Gem, FlaskConical,
  Rocket, Sparkles, Lock, Check, X, Clock, AlertTriangle,
  ChevronRight, Star, Zap, ArrowUp, Package, Info, Wrench,
} from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import {
  CRAFTING_SKILLS, CRAFTING_RECIPES, MATERIALS, CATEGORY_INFO,
  type CraftingSkillId, type CraftingRecipe, type RecipeCategory,
  getRecipesByCategory, getRecipesBySkill, canCraftRecipe, calculateSuccessRate,
  getMaterialById,
} from "@/data/craftingData";
import { EmptyForge } from "@/components/EmptyStates";

/* ── ICON MAP ── */
const CATEGORY_ICONS: Record<RecipeCategory, typeof Sword> = {
  weapon: Sword, armor: Shield, accessory: Gem,
  potion: FlaskConical, ship_upgrade: Rocket,
  card_enhancement: Sparkles, intermediate: Wrench,
};

/* ── SKILL PROGRESS BAR ── */
function SkillBar({ skillId, level, xp, maxXp, color }: {
  skillId: string; level: number; xp: number; maxXp: number; color: string;
}) {
  const pct = maxXp > 0 ? Math.min((xp / maxXp) * 100, 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-md flex items-center justify-center"
        style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}>
        <span className="text-sm">{CRAFTING_SKILLS.find(s => s.id === skillId)?.icon || "⚒️"}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className="font-mono text-[10px] tracking-[0.15em]" style={{ color }}>
            {CRAFTING_SKILLS.find(s => s.id === skillId)?.name.toUpperCase() || skillId}
          </span>
          <span className="font-mono text-[9px] text-muted-foreground/50">LV.{level}</span>
        </div>
        <div className="h-1.5 rounded-full bg-muted/40 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: color }}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <span className="font-mono text-[8px] text-muted-foreground/30">{xp}/{maxXp} XP</span>
      </div>
    </div>
  );
}

/* ── MATERIAL BADGE ── */
function MaterialBadge({ materialId, required, have }: {
  materialId: string; required: number; have: number;
}) {
  const mat = getMaterialById(materialId);
  if (!mat) return null;
  const enough = have >= required;
  return (
    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md border text-[10px] font-mono
      ${enough ? "void-border-success void-bg-success void-text-energy" : "void-border-error void-bg-error void-text-error"}`}>
      <span>{mat.icon}</span>
      <span className="truncate max-w-[80px]">{mat.name}</span>
      <span className="font-bold">{have}/{required}</span>
    </div>
  );
}

/* ── RECIPE CARD ── */
function RecipeCard({ recipe, skillLevels, materials, dreamTokens, onSelect, isSelected }: {
  recipe: CraftingRecipe;
  skillLevels: Record<CraftingSkillId, number>;
  materials: Record<string, number>;
  dreamTokens: number;
  onSelect: () => void;
  isSelected: boolean;
}) {
  const { canCraft } = canCraftRecipe(recipe, skillLevels, materials, dreamTokens);
  const successRate = calculateSuccessRate(recipe, skillLevels[recipe.skill] || 0);
  const rarityColors = {
    common: { text: "text-muted-foreground", border: "void-border", bg: "void-bg-canvas" },
    uncommon: { text: "void-text-energy", border: "void-border-success", bg: "void-bg-success" },
    rare: { text: "void-text-energy", border: "void-border", bg: "void-bg-sunk" },
    epic: { text: "void-text-system", border: "void-border-system", bg: "void-bg-system" },
    legendary: { text: "void-text-accent", border: "void-border", bg: "void-bg-sunk" },
  };
  const rc = rarityColors[recipe.rarity];
  const CatIcon = CATEGORY_ICONS[recipe.category];

  return (
    <motion.button
      onClick={onSelect}
      whileHover={{ x: 2 }}
      whileTap={{ scale: 0.98 }}
      className={`w-full text-left p-3 rounded-lg border transition-all
        ${isSelected
          ? `${rc.border} ${rc.bg} ring-1 ring-primary/30`
          : `border-border/20 bg-card/20 hover:${rc.border}`
        }
        ${!canCraft ? "opacity-60" : ""}`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${rc.bg}`}>
          <CatIcon size={14} className={rc.text} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`font-mono text-xs font-bold ${rc.text} truncate`}>{recipe.name}</span>
            {!canCraft && <Lock size={10} className="text-muted-foreground/40 shrink-0" />}
          </div>
          <span className={`font-mono text-[8px] ${rc.text} opacity-60`}>
            {recipe.rarity.toUpperCase()} • {CRAFTING_SKILLS.find(s => s.id === recipe.skill)?.name} Lv.{recipe.requiredLevel}
          </span>
          <p className="font-mono text-[9px] text-muted-foreground/40 mt-0.5 line-clamp-1">{recipe.description}</p>
          {/* Benefits preview */}
          <div className="flex flex-wrap gap-1 mt-1">
            {recipe.benefits.slice(0, 2).map((b, i) => (
              <span key={i} className="font-mono text-[7px] px-1 py-0.5 rounded bg-primary/5 text-primary/60 border border-primary/10">
                {b.target === "fight_arena" ? "⚔️" : b.target === "card_battles" ? "🃏" : b.target === "trade_empire" ? "🚀" : "🌟"} {b.description.slice(0, 30)}
              </span>
            ))}
          </div>
        </div>
        <div className="text-right shrink-0">
          <span className={`font-mono text-[9px] ${successRate >= 0.8 ? "void-text-energy" : successRate >= 0.5 ? "void-text-accent" : "void-text-error"}`}>
            {Math.round(successRate * 100)}%
          </span>
        </div>
      </div>
    </motion.button>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN FORGE PAGE
   ═══════════════════════════════════════════════════ */
export default function ForgePage() {
  const { isAuthenticated } = useAuth();

  // Crafting state
  const [selectedCategory, setSelectedCategory] = useState<RecipeCategory | "all">("all");
  const [selectedRecipe, setSelectedRecipe] = useState<CraftingRecipe | null>(null);
  const [isCrafting, setIsCrafting] = useState(false);
  const [craftProgress, setCraftProgress] = useState(0);
  const [craftResult, setCraftResult] = useState<"success" | "failure" | null>(null);
  const [showSkills, setShowSkills] = useState(false);

  // ── Server-sourced crafting profile (skills, materials, crafted items) ──
  const utils = trpc.useUtils();
  const profileQuery = trpc.crafting.getCraftingProfile.useQuery(undefined, {
    enabled: isAuthenticated,
    staleTime: 10_000,
  });
  const dreamQuery = trpc.crafting.getDreamBalance.useQuery(undefined, {
    enabled: isAuthenticated,
    staleTime: 10_000,
  });

  const profile = profileQuery.data;

  const skillLevels = useMemo<Record<CraftingSkillId, number>>(() => ({
    weaponsmith: profile?.skills.weaponsmith?.level ?? 0,
    armorsmith: profile?.skills.armorsmith?.level ?? 0,
    enchanting: profile?.skills.enchanting?.level ?? 0,
    alchemy: profile?.skills.alchemy?.level ?? 0,
    engineering: profile?.skills.engineering?.level ?? 0,
  }), [profile]);

  const skillXp = useMemo<Record<CraftingSkillId, number>>(() => ({
    weaponsmith: profile?.skills.weaponsmith?.xp ?? 0,
    armorsmith: profile?.skills.armorsmith?.xp ?? 0,
    enchanting: profile?.skills.enchanting?.xp ?? 0,
    alchemy: profile?.skills.alchemy?.xp ?? 0,
    engineering: profile?.skills.engineering?.xp ?? 0,
  }), [profile]);

  const materials = useMemo<Record<string, number>>(
    () => profile?.materials ?? {},
    [profile],
  );

  // Dream tokens from the authoritative server-side balance.
  const dreamTokens = dreamQuery.data?.dream ?? 0;

  // ── Server-side craft mutation ──
  // The server is the source of truth for success rolls, XP grants,
  // level-ups and material deductions. We keep the client-side craftTime
  // animation so the UI feels responsive, but the actual outcome comes
  // from the server's response.
  const craftMutation = trpc.crafting.craftRecipe.useMutation({
    onSuccess: (res) => {
      // res.success is "did the RPC complete" (e.g. validation passed);
      // res.crafted is "did the success roll land".
      if (!res.success) {
        setIsCrafting(false);
        setCraftProgress(0);
        toast.error(res.error ?? "Crafting failed");
        return;
      }
      setCraftResult(res.crafted ? "success" : "failure");
      setIsCrafting(false);
      setCraftProgress(1);
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
      setCraftProgress(0);
      toast.error(err.message);
    },
  });

  // Filtered recipes
  const filteredRecipes = useMemo(() => {
    if (selectedCategory === "all") return CRAFTING_RECIPES;
    return getRecipesByCategory(selectedCategory);
  }, [selectedCategory]);

  // Craft handler — fires the server mutation immediately and plays a
  // client-side progress animation of length recipe.craftTime (capped so
  // the UI never stalls longer than the server takes).
  const handleCraft = useCallback(() => {
    if (!selectedRecipe || isCrafting) return;

    const { canCraft } = canCraftRecipe(selectedRecipe, skillLevels, materials, dreamTokens);
    if (!canCraft) return;

    setIsCrafting(true);
    setCraftProgress(0);
    setCraftResult(null);

    // Visual progress animation — the real outcome is decided server-side.
    const totalTime = Math.max(500, selectedRecipe.craftTime * 100); // 10x speed-up, 0.5s floor
    const intervalMs = 50;
    let elapsed = 0;
    const timer = setInterval(() => {
      elapsed += intervalMs;
      setCraftProgress(Math.min(elapsed / totalTime, 0.95)); // cap at 95% until server responds
      if (elapsed >= totalTime) clearInterval(timer);
    }, intervalMs);

    // Fire the server mutation — success/failure comes from res.crafted.
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
  }, [selectedRecipe, isCrafting, skillLevels, materials, dreamTokens, craftMutation]);

  const craftCheck = selectedRecipe
    ? canCraftRecipe(selectedRecipe, skillLevels, materials, dreamTokens)
    : { canCraft: false, reasons: [] };

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="nebula-blob w-[500px] h-[500px] void-bg-sunk top-[-100px] right-[-100px]" style={{ animationDelay: "-5s" }} />
        <div className="nebula-blob w-[400px] h-[400px] void-bg-error bottom-[-100px] left-[-100px]" style={{ animationDelay: "-12s" }} />
        <div className="absolute inset-0 grid-bg opacity-60" />
      </div>

      {/* Header */}
      <div className="relative z-10 border-b border-border/40 bg-muted/50 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/games" className="font-mono text-[10px] text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5">
            <ChevronLeft size={12} /> SAGAVERSE
          </Link>
          <div className="flex items-center gap-2">
            <Hammer size={14} className="void-text-premium" />
            <span className="font-display text-xs font-bold tracking-[0.3em] void-text-premium page-title-reveal">THE FORGE</span>
          </div>
          <button
            onClick={() => setShowSkills(!showSkills)}
            className="font-mono text-[10px] text-muted-foreground void-text-premium transition-colors flex items-center gap-1"
          >
            <ArrowUp size={10} /> SKILLS
          </button>
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* ── SKILLS PANEL (Collapsible) ── */}
        <AnimatePresence>
          {showSkills && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-4"
            >
              <div className="glass-float rounded-lg p-4">
                <h3 className="font-display text-[10px] tracking-[0.3em] void-text-premium mb-3 flex items-center gap-2">
                  <Flame size={12} /> CRAFTING SKILLS
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  {CRAFTING_SKILLS.map(skill => {
                    const level = skillLevels[skill.id];
                    const xp = skillXp[skill.id];
                    const nextLevelXp = level < skill.maxLevel ? skill.xpPerLevel[level] : 0;
                    return (
                      <SkillBar
                        key={skill.id}
                        skillId={skill.id}
                        level={level}
                        xp={xp}
                        maxXp={nextLevelXp}
                        color={skill.color}
                      />
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── MAIN LAYOUT: Categories + Recipes + Detail ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_1fr] gap-4">
          {/* LEFT: Categories */}
          <div className="space-y-2">
            <h3 className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground/50 mb-2">CATEGORIES</h3>
            <button
              onClick={() => { setSelectedCategory("all"); setSelectedRecipe(null); }}
              className={`w-full text-left px-3 py-2 rounded-md font-mono text-xs transition-all flex items-center gap-2
                ${selectedCategory === "all" ? "void-bg-sunk void-text-premium border void-border" : "text-muted-foreground/60 hover:text-foreground hover:bg-muted/30"}`}
            >
              <Package size={12} /> All Recipes
              <span className="ml-auto text-[9px] text-muted-foreground/30">{CRAFTING_RECIPES.length}</span>
            </button>
            {(Object.entries(CATEGORY_INFO) as [RecipeCategory, typeof CATEGORY_INFO[RecipeCategory]][]).map(([cat, info]) => {
              const CatIcon = CATEGORY_ICONS[cat];
              const count = getRecipesByCategory(cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => { setSelectedCategory(cat); setSelectedRecipe(null); }}
                  className={`w-full text-left px-3 py-2 rounded-md font-mono text-xs transition-all flex items-center gap-2
                    ${selectedCategory === cat ? "void-bg-sunk border void-border" : "text-muted-foreground/60 hover:text-foreground hover:bg-muted/30"}`}
                  style={selectedCategory === cat ? { color: info.color } : undefined}
                >
                  <CatIcon size={12} /> {info.label}
                  <span className="ml-auto text-[9px] text-muted-foreground/30">{count}</span>
                </button>
              );
            })}

            {/* Materials inventory summary */}
            <div className="border-t border-border/40 pt-3 mt-3">
              <h3 className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground/50 mb-2">MATERIALS</h3>
              <div className="space-y-1 max-h-[200px] overflow-y-auto">
                {MATERIALS.filter(m => (materials[m.id] || 0) > 0).map(mat => (
                  <div key={mat.id} className="flex items-center gap-2 px-2 py-1 rounded text-[10px] font-mono">
                    <span>{mat.icon}</span>
                    <span className="truncate flex-1 text-muted-foreground/60">{mat.name}</span>
                    <span className="font-bold" style={{ color: mat.color }}>{materials[mat.id]}</span>
                  </div>
                ))}
                {Object.values(materials).every(v => !v) && (
                  <p className="font-mono text-[9px] text-muted-foreground/30 text-center py-2">No materials yet</p>
                )}
              </div>
            </div>

            {/* Dream Token balance */}
            <div className="flex items-center gap-2 px-2 py-2 rounded-md void-bg-system border void-border-system">
              <Gem size={12} className="void-text-system" />
              <span className="font-mono text-[10px] void-text-system">{dreamTokens} DT</span>
            </div>
          </div>

          {/* CENTER: Recipe List */}
          <div className="space-y-2">
            <h3 className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground/50 mb-2">
              RECIPES ({filteredRecipes.length})
            </h3>
            <div className="space-y-1.5 max-h-[calc(100dvh-200px)] overflow-y-auto pr-1">
              {filteredRecipes.length === 0 ? (
                <EmptyForge className="my-8" />
              ) : (
                filteredRecipes.map(recipe => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    skillLevels={skillLevels}
                    materials={materials}
                    dreamTokens={dreamTokens}
                    onSelect={() => setSelectedRecipe(recipe)}
                    isSelected={selectedRecipe?.id === recipe.id}
                  />
                ))
              )}
            </div>
          </div>

          {/* RIGHT: Recipe Detail + Craft Button */}
          <div>
            <AnimatePresence mode="wait">
              {selectedRecipe ? (
                <motion.div
                  key={selectedRecipe.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="glass-float rounded-lg p-4 sm:p-5 space-y-4 sticky top-4"
                >
                  {/* Recipe Header */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-display text-base font-bold tracking-wider ${
                        { common: "text-muted-foreground", uncommon: "void-text-energy", rare: "void-text-energy", epic: "void-text-system", legendary: "void-text-accent" }[selectedRecipe.rarity]
                      }`}>
                        {selectedRecipe.name}
                      </span>
                      <span className={`font-mono text-[8px] px-1.5 py-0.5 rounded ${
                        { common: "void-bg-canvas text-muted-foreground", uncommon: "void-bg-success void-text-energy", rare: "void-bg-sunk void-text-energy", epic: "void-bg-system void-text-system", legendary: "void-bg-sunk void-text-accent" }[selectedRecipe.rarity]
                      }`}>
                        {selectedRecipe.rarity.toUpperCase()}
                      </span>
                    </div>
                    <p className="font-mono text-[10px] text-muted-foreground/60">{selectedRecipe.description}</p>
                  </div>

                  {/* Skill Requirement */}
                  <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-muted/30 border border-border/20">
                    <span className="text-sm">{CRAFTING_SKILLS.find(s => s.id === selectedRecipe.skill)?.icon}</span>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {CRAFTING_SKILLS.find(s => s.id === selectedRecipe.skill)?.name} Level {selectedRecipe.requiredLevel}
                    </span>
                    {(skillLevels[selectedRecipe.skill] || 0) >= selectedRecipe.requiredLevel ? (
                      <Check size={12} className="void-text-energy ml-auto" />
                    ) : (
                      <Lock size={12} className="void-text-error ml-auto" />
                    )}
                  </div>

                  {/* Materials Required */}
                  <div>
                    <h4 className="font-mono text-[9px] tracking-[0.15em] text-muted-foreground/50 mb-2">MATERIALS REQUIRED</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {Object.entries(selectedRecipe.materials).map(([matId, qty]) => (
                        <MaterialBadge
                          key={matId}
                          materialId={matId}
                          required={qty}
                          have={materials[matId] || 0}
                        />
                      ))}
                      <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md border text-[10px] font-mono
                        ${dreamTokens >= selectedRecipe.dreamCost ? "void-border-system void-bg-system void-text-system" : "void-border-error void-bg-error void-text-error"}`}>
                        <Gem size={10} />
                        <span>{dreamTokens}/{selectedRecipe.dreamCost} DT</span>
                      </div>
                    </div>
                  </div>

                  {/* Game Benefits */}
                  <div>
                    <h4 className="font-mono text-[9px] tracking-[0.15em] text-muted-foreground/50 mb-2">GAME BENEFITS</h4>
                    <div className="space-y-1.5">
                      {selectedRecipe.benefits.map((benefit, i) => (
                        <div key={i} className="flex items-start gap-2 px-2 py-1.5 rounded-md bg-primary/5 border border-primary/10">
                          <span className="text-[10px] shrink-0">
                            {benefit.target === "fight_arena" ? "⚔️" : benefit.target === "card_battles" ? "🃏" : benefit.target === "trade_empire" ? "🚀" : "🌟"}
                          </span>
                          <span className="font-mono text-[10px] text-primary/80">{benefit.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Crafting Info */}
                  <div className="flex items-center gap-4 text-[10px] font-mono text-muted-foreground/50">
                    <span className="flex items-center gap-1"><Clock size={10} /> {selectedRecipe.craftTime}s</span>
                    <span className="flex items-center gap-1"><Star size={10} /> +{selectedRecipe.xpGain} XP</span>
                    <span className="flex items-center gap-1">
                      <Zap size={10} />
                      {Math.round(calculateSuccessRate(selectedRecipe, skillLevels[selectedRecipe.skill] || 0) * 100)}% success
                    </span>
                  </div>

                  {/* Craft Progress / Button */}
                  {isCrafting ? (
                    <div className="space-y-2">
                      <div className="h-3 rounded-full bg-muted/40 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r void-bg-success"
                          style={{ width: `${craftProgress * 100}%` }}
                        />
                      </div>
                      <p className="font-mono text-[10px] void-text-premium text-center animate-pulse">
                        FORGING... {Math.round(craftProgress * 100)}%
                      </p>
                    </div>
                  ) : craftResult ? (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={`p-3 rounded-lg border text-center ${
                        craftResult === "success"
                          ? "void-border-success void-bg-success"
                          : "void-border-error void-bg-error"
                      }`}
                    >
                      {craftResult === "success" ? (
                        <>
                          <Check size={24} className="void-text-energy mx-auto mb-1" />
                          <p className="font-display text-sm font-bold void-text-energy">CRAFTING SUCCESS!</p>
                          <p className="font-mono text-[10px] void-text-energy">
                            {selectedRecipe.name} x{selectedRecipe.outputQuantity} created
                          </p>
                        </>
                      ) : (
                        <>
                          <X size={24} className="void-text-error mx-auto mb-1" />
                          <p className="font-display text-sm font-bold void-text-error">CRAFTING FAILED</p>
                          <p className="font-mono text-[10px] void-text-error">
                            Half materials lost. Try again with higher skill.
                          </p>
                        </>
                      )}
                      <button
                        onClick={() => setCraftResult(null)}
                        className="font-mono text-[10px] text-muted-foreground/50 hover:text-foreground mt-2 transition-colors"
                      >
                        DISMISS
                      </button>
                    </motion.div>
                  ) : (
                    <div>
                      {!craftCheck.canCraft && craftCheck.reasons.length > 0 && (
                        <div className="mb-2 space-y-1">
                          {craftCheck.reasons.map((r, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-[9px] font-mono void-text-error">
                              <AlertTriangle size={10} /> {r}
                            </div>
                          ))}
                        </div>
                      )}
                      <button
                        onClick={handleCraft}
                        disabled={!craftCheck.canCraft}
                        className={`w-full py-3 rounded-lg font-display text-sm font-bold tracking-[0.2em] transition-all flex items-center justify-center gap-2
                          ${craftCheck.canCraft
                            ? "bg-gradient-to-r void-bg-success text-foreground hover:opacity-90"
                            : "bg-muted/30 text-muted-foreground/30 cursor-not-allowed border border-border/20"
                          }`}
                      >
                        <Hammer size={16} />
                        {craftCheck.canCraft ? "FORGE ITEM" : "REQUIREMENTS NOT MET"}
                      </button>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass-float rounded-lg p-8 text-center"
                >
                  <Hammer size={40} className="text-muted-foreground/15 mx-auto mb-3" />
                  <p className="font-display text-sm font-bold tracking-wider text-muted-foreground/30 mb-1">SELECT A RECIPE</p>
                  <p className="font-mono text-[10px] text-muted-foreground/20">
                    Choose a recipe from the list to view details and begin crafting
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
