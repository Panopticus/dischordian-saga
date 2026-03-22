/* ═══════════════════════════════════════════════════════
   COSMETIC SHOP PAGE — Card art variants, skins, themes
   RPG-gated premium items
   ═══════════════════════════════════════════════════════ */
import { trpc } from "@/lib/trpc";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "wouter";
import {
  ChevronLeft, Sparkles, ShoppingBag, Check, Lock,
  Star, Crown, Palette, Eye, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Tab = "shop" | "owned" | "equipped";

export default function CosmeticShopPage() {
  const [tab, setTab] = useState<Tab>("shop");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: shopItems, isLoading, refetch } = trpc.cosmeticShop.getShopItems.useQuery();
  const { data: equipped } = trpc.cosmeticShop.getEquipped.useQuery();

  const purchaseMut = trpc.cosmeticShop.purchaseCosmetic.useMutation({
    onSuccess: () => { toast.success("Cosmetic purchased!"); refetch(); },
    onError: (e: any) => toast.error(e.message),
  });
  const equipMut = trpc.cosmeticShop.toggleEquip.useMutation({
    onSuccess: () => { toast.success("Cosmetic toggled!"); refetch(); },
    onError: (e: any) => toast.error(e.message),
  });

  const categories = ["all", "card_art", "avatar_frame", "title", "theme", "emote", "trail"];
  const filteredItems = shopItems?.filter((item: any) =>
    selectedCategory === "all" || item.category === selectedCategory
  ) || [];
  const ownedItems = shopItems?.filter((item: any) => item.owned) || [];
  const equippedItems = equipped || [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-chart-4 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="border-b border-border/30 bg-card/30 backdrop-blur-sm sticky top-0 z-20">
        <div className="px-4 sm:px-6 py-3 flex items-center gap-3">
          <Link href="/ark" className="text-muted-foreground hover:text-primary transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <Sparkles size={18} className="text-chart-4" />
          <h1 className="font-display text-sm font-bold tracking-[0.15em]">COSMETIC SHOP</h1>
        </div>
        <div className="px-4 sm:px-6 flex gap-1 pb-2">
          {(["shop", "owned", "equipped"] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${
                tab === t ? "bg-chart-4/20 text-chart-4 border border-chart-4/30" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 sm:px-6 pt-4 space-y-4">
        {tab === "shop" && (
          <>
            {/* Category filter */}
            <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded text-[10px] font-mono whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? "bg-chart-4/20 text-chart-4 border border-chart-4/30"
                      : "bg-card/30 border border-border/20 text-muted-foreground"
                  }`}
                >
                  {cat.replace(/_/g, " ").toUpperCase()}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filteredItems.map((item: any, i: number) => (
                <motion.div
                  key={item.key || i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className={`rounded-lg border overflow-hidden ${
                    item.owned ? "border-primary/30 bg-primary/5" : "border-border/30 bg-card/30"
                  }`}
                >
                  <div className="aspect-square bg-muted/10 flex items-center justify-center relative">
                    {item.locked ? (
                      <Lock size={24} className="text-muted-foreground/30" />
                    ) : (
                      <Sparkles size={24} className={item.rarity === "legendary" ? "text-chart-4" : item.rarity === "epic" ? "text-chart-4" : "text-primary"} />
                    )}
                    {item.rarity && (
                      <span className={`absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold ${
                        item.rarity === "legendary" ? "bg-chart-4/20 text-chart-4" :
                        item.rarity === "epic" ? "bg-chart-4/20 text-chart-4" :
                        item.rarity === "rare" ? "bg-primary/20 text-primary" :
                        "bg-muted/20 text-muted-foreground"
                      }`}>
                        {item.rarity.toUpperCase()}
                      </span>
                    )}
                    {item.owned && (
                      <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-primary/20 text-primary text-[8px] font-mono">
                        OWNED
                      </span>
                    )}
                  </div>
                  <div className="p-2.5">
                    <p className="font-mono text-xs font-semibold truncate">{item.name}</p>
                    <p className="font-mono text-[10px] text-muted-foreground/60 truncate mb-2">
                      {item.category?.replace(/_/g, " ")}
                    </p>
                    {!item.owned ? (
                      <Button
                        size="sm"
                        className="w-full text-[10px]"
                        disabled={item.locked || purchaseMut.isPending}
                        onClick={() => purchaseMut.mutate({ itemKey: item.key })}
                      >
                        <ShoppingBag size={10} className="mr-1" />
                        {item.locked ? "LOCKED" : `${item.price || 0} DREAM`}
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full text-[10px]"
                        onClick={() => equipMut.mutate({ itemKey: item.key })}
                        disabled={equipMut.isPending}
                      >
                        <Eye size={10} className="mr-1" /> EQUIP
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {tab === "owned" && (
          <div className="space-y-2">
            {ownedItems.length > 0 ? (
              ownedItems.map((item: any, i: number) => (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="rounded-lg border border-primary/20 bg-card/30 p-3 flex items-center gap-3"
                >
                  <Sparkles size={16} className="text-primary" />
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-xs font-semibold">{item.name}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">{item.category?.replace(/_/g, " ")} • {item.rarity}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => equipMut.mutate({ itemKey: item.key })}
                    disabled={equipMut.isPending}
                  >
                    <Eye size={10} />
                  </Button>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-16">
                <ShoppingBag size={48} className="mx-auto text-muted-foreground/20 mb-4" />
                <p className="font-mono text-sm text-muted-foreground">No cosmetics owned yet</p>
              </div>
            )}
          </div>
        )}

        {tab === "equipped" && (
          <div className="space-y-2">
            {equippedItems.length > 0 ? (
              equippedItems.map((item: any, i: number) => (
                <motion.div
                  key={item.id || i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="rounded-lg border border-chart-4/20 bg-card/30 p-3 flex items-center gap-3"
                >
                  <Star size={16} className="text-chart-4" />
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-xs font-semibold">{item.itemKey}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">Equipped</p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => equipMut.mutate({ itemKey: item.itemKey })}
                    disabled={equipMut.isPending}
                  >
                    Unequip
                  </Button>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-16">
                <Palette size={48} className="mx-auto text-muted-foreground/20 mb-4" />
                <p className="font-mono text-sm text-muted-foreground">No cosmetics equipped</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
