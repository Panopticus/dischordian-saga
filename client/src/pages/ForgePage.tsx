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
import { useGame } from "@/contexts/GameContext";
import { useGamification } from "@/contexts/GamificationContext";
import {
  CRAFTING_SKILLS, CRAFTING_RECIPES, MATERIALS, CATEGORY_INFO,
  type CraftingSkillId, type CraftingRecipe, type RecipeCategory,
  getRecipesByCategory, getRecipesBySkill, canCraftRecipe, calculateSuccessRate,
  getMaterialById,
} from "@/data/craftingData";

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
      ${enough ? "border-green-500/20 bg-green-500/5 text-green-400" : "border-red-500/20 bg-red-500/5 text-red-400"}`}>
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
    common: { text: "text-gray-400", border: "border-gray-500/20", bg: "bg-gray-500/5" },
    uncommon: { text: "text-green-400", border: "border-green-500/20", bg: "bg-green-500/5" },
    rare: { text: "text-blue-400", border: "border-blue-500/20", bg: "bg-blue-500/5" },
    epic: { text: "text-purple-400", border: "border-purple-500/20", bg: "bg-purple-500/5" },
    legendary: { text: "text-amber-400", border: "border-amber-500/20", bg: "bg-amber-500/5" },
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
          <span className={`font-mono text-[9px] ${successRate >= 0.8 ? "text-green-400" : successRate >= 0.5 ? "text-amber-400" : "text-red-400"}`}>
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
  const gameCtx = useGame();
  const gameState = gameCtx.state;
  const gam = useGamification();

  // Crafting state
  const [selectedCategory, setSelectedCategory] = useState<RecipeCategory | "all">("all");
  const [selectedRecipe, setSelectedRecipe] = useState<CraftingRecipe | null>(null);
  const [isCrafting, setIsCrafting] = useState(false);
  const [craftProgress, setCraftProgress] = useState(0);
  const [craftResult, setCraftResult] = useState<"success" | "failure" | null>(null);
  const [showSkills, setShowSkills] = useState(false);

  // Player crafting data from game state
  const skillLevels = useMemo<Record<CraftingSkillId, number>>(() => ({
    weaponsmith: gameState.craftingSkills?.weaponsmith || 0,
    armorsmith: gameState.craftingSkills?.armorsmith || 0,
    enchanting: gameState.craftingSkills?.enchanting || 0,
    alchemy: gameState.craftingSkills?.alchemy || 0,
    engineering: gameState.craftingSkills?.engineering || 0,
  }), [gameState.craftingSkills]);

  const skillXp = useMemo<Record<CraftingSkillId, number>>(() => ({
    weaponsmith: gameState.craftingXp?.weaponsmith || 0,
    armorsmith: gameState.craftingXp?.armorsmith || 0,
    enchanting: gameState.craftingXp?.enchanting || 0,
    alchemy: gameState.craftingXp?.alchemy || 0,
    engineering: gameState.craftingXp?.engineering || 0,
  }), [gameState.craftingXp]);

  const materials = useMemo<Record<string, number>>(() => {
    return gameState.craftingMaterials || {};
  }, [gameState.craftingMaterials]);

  // Dream tokens come from server-side dream balance, not game state
  // For crafting, we track a local crafting-specific dream pool
  const dreamTokens = 0; // Will be populated from tRPC dream balance query

  // Filtered recipes
  const filteredRecipes = useMemo(() => {
    if (selectedCategory === "all") return CRAFTING_RECIPES;
    return getRecipesByCategory(selectedCategory);
  }, [selectedCategory]);

  // Craft handler
  const handleCraft = useCallback(() => {
    if (!selectedRecipe || isCrafting) return;

    const { canCraft } = canCraftRecipe(selectedRecipe, skillLevels, materials, dreamTokens);
    if (!canCraft) return;

    setIsCrafting(true);
    setCraftProgress(0);
    setCraftResult(null);

    // Simulate crafting progress
    const totalTime = selectedRecipe.craftTime * 100; // Speed up for demo (10x)
    const interval = 50;
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += interval;
      setCraftProgress(Math.min(elapsed / totalTime, 1));

      if (elapsed >= totalTime) {
        clearInterval(timer);

        // Calculate success
        const successRate = calculateSuccessRate(selectedRecipe, skillLevels[selectedRecipe.skill] || 0);
        const success = Math.random() < successRate;

        setCraftResult(success ? "success" : "failure");
        setIsCrafting(false);

        if (success) {
          // Crafting success — update game state
          gameCtx.craftItem(
            selectedRecipe.id,
            selectedRecipe.materials,
            selectedRecipe.dreamCost,
            selectedRecipe.skill,
            selectedRecipe.xpGain,
            selectedRecipe.outputItemId,
            selectedRecipe.outputQuantity,
          );
        } else {
          // On failure, still consume half materials
          gameCtx.craftFailed(
            selectedRecipe.id,
            Object.fromEntries(
              Object.entries(selectedRecipe.materials).map(([k, v]) => [k, Math.ceil(v / 2)])
            ),
            Math.ceil(selectedRecipe.dreamCost / 2),
            selectedRecipe.skill,
            Math.ceil(selectedRecipe.xpGain / 3), // Still get some XP on failure
          );
        }
      }
    }, interval);
  }, [selectedRecipe, isCrafting, skillLevels, materials, dreamTokens, gameCtx]);

  const craftCheck = selectedRecipe
    ? canCraftRecipe(selectedRecipe, skillLevels, materials, dreamTokens)
    : { canCraft: false, reasons: [] };

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="nebula-blob w-[500px] h-[500px] bg-orange-600 top-[-100px] right-[-100px]" style={{ animationDelay: "-5s" }} />
        <div className="nebula-blob w-[400px] h-[400px] bg-red-700 bottom-[-100px] left-[-100px]" style={{ animationDelay: "-12s" }} />
        <div className="absolute inset-0 grid-bg opacity-60" />
      </div>

      {/* Header */}
      <div className="relative z-10 border-b border-border/40 bg-muted/50 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/games" className="font-mono text-[10px] text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5">
            <ChevronLeft size={12} /> SAGAVERSE
          </Link>
          <div className="flex items-center gap-2">
            <Hammer size={14} className="text-orange-400" />
            <span className="font-display text-xs font-bold tracking-[0.3em] text-orange-400">THE FORGE</span>
          </div>
          <button
            onClick={() => setShowSkills(!showSkills)}
            className="font-mono text-[10px] text-muted-foreground hover:text-orange-400 transition-colors flex items-center gap-1"
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
                <h3 className="font-display text-[10px] tracking-[0.3em] text-orange-400 mb-3 flex items-center gap-2">
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
                ${selectedCategory === "all" ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" : "text-muted-foreground/60 hover:text-foreground hover:bg-muted/30"}`}
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
                    ${selectedCategory === cat ? "bg-orange-500/10 border border-orange-500/20" : "text-muted-foreground/60 hover:text-foreground hover:bg-muted/30"}`}
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
            <div className="flex items-center gap-2 px-2 py-2 rounded-md bg-purple-500/5 border border-purple-500/10">
              <Gem size={12} className="text-purple-400" />
              <span className="font-mono text-[10px] text-purple-400">{dreamTokens} DT</span>
            </div>
          </div>

          {/* CENTER: Recipe List */}
          <div className="space-y-2">
            <h3 className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground/50 mb-2">
              RECIPES ({filteredRecipes.length})
            </h3>
            <div className="space-y-1.5 max-h-[calc(100vh-200px)] overflow-y-auto pr-1">
              {filteredRecipes.map(recipe => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  skillLevels={skillLevels}
                  materials={materials}
                  dreamTokens={dreamTokens}
                  onSelect={() => setSelectedRecipe(recipe)}
                  isSelected={selectedRecipe?.id === recipe.id}
                />
              ))}
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
                        { common: "text-gray-400", uncommon: "text-green-400", rare: "text-blue-400", epic: "text-purple-400", legendary: "text-amber-400" }[selectedRecipe.rarity]
                      }`}>
                        {selectedRecipe.name}
                      </span>
                      <span className={`font-mono text-[8px] px-1.5 py-0.5 rounded ${
                        { common: "bg-gray-500/10 text-gray-400", uncommon: "bg-green-500/10 text-green-400", rare: "bg-blue-500/10 text-blue-400", epic: "bg-purple-500/10 text-purple-400", legendary: "bg-amber-500/10 text-amber-400" }[selectedRecipe.rarity]
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
                      <Check size={12} className="text-green-400 ml-auto" />
                    ) : (
                      <Lock size={12} className="text-red-400 ml-auto" />
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
                        ${dreamTokens >= selectedRecipe.dreamCost ? "border-purple-500/20 bg-purple-500/5 text-purple-400" : "border-red-500/20 bg-red-500/5 text-red-400"}`}>
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
                          className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400"
                          style={{ width: `${craftProgress * 100}%` }}
                        />
                      </div>
                      <p className="font-mono text-[10px] text-orange-400 text-center animate-pulse">
                        FORGING... {Math.round(craftProgress * 100)}%
                      </p>
                    </div>
                  ) : craftResult ? (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={`p-3 rounded-lg border text-center ${
                        craftResult === "success"
                          ? "border-green-500/30 bg-green-500/10"
                          : "border-red-500/30 bg-red-500/10"
                      }`}
                    >
                      {craftResult === "success" ? (
                        <>
                          <Check size={24} className="text-green-400 mx-auto mb-1" />
                          <p className="font-display text-sm font-bold text-green-400">CRAFTING SUCCESS!</p>
                          <p className="font-mono text-[10px] text-green-400/60">
                            {selectedRecipe.name} x{selectedRecipe.outputQuantity} created
                          </p>
                        </>
                      ) : (
                        <>
                          <X size={24} className="text-red-400 mx-auto mb-1" />
                          <p className="font-display text-sm font-bold text-red-400">CRAFTING FAILED</p>
                          <p className="font-mono text-[10px] text-red-400/60">
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
                            <div key={i} className="flex items-center gap-1.5 text-[9px] font-mono text-red-400/70">
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
                            ? "bg-gradient-to-r from-orange-600 to-amber-500 text-white hover:from-orange-500 hover:to-amber-400 shadow-lg shadow-orange-500/20"
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
