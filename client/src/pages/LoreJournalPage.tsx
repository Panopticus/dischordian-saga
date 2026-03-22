/* ═══════════════════════════════════════════════════════
   LORE JOURNAL PAGE — Personal writing, word count XP,
   writing streaks, community reading
   ═══════════════════════════════════════════════════════ */
import { trpc } from "@/lib/trpc";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "wouter";
import {
  ChevronLeft, BookOpen, PenTool, Eye, Trash2,
  Star, Clock, Flame, Globe, ChevronRight, Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Tab = "my_entries" | "write" | "community" | "stats";

export default function LoreJournalPage() {
  const [tab, setTab] = useState<Tab>("my_entries");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("character_study");
  const [isPublic, setIsPublic] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const { data: myEntries, isLoading, refetch } = trpc.loreJournal.getMyEntries.useQuery({ limit: 50 });
  const { data: publicEntries } = trpc.loreJournal.getPublicEntries.useQuery(
    { limit: 20 },
    { enabled: tab === "community" }
  );
  const { data: myStats } = trpc.loreJournal.getMyStats.useQuery(undefined, { enabled: tab === "stats" });
  const { data: categories } = trpc.loreJournal.getCategories.useQuery();

  const createMut = trpc.loreJournal.createEntry.useMutation({
    onSuccess: (d: any) => {
      toast.success(`Entry saved! +${d.xpEarned} XP`);
      setTitle(""); setContent(""); refetch(); setTab("my_entries");
    },
    onError: (e: any) => toast.error(e.message),
  });
  const updateMut = trpc.loreJournal.updateEntry.useMutation({
    onSuccess: () => { toast.success("Entry updated!"); refetch(); setEditingId(null); setTab("my_entries"); },
    onError: (e: any) => toast.error(e.message),
  });
  const deleteMut = trpc.loreJournal.deleteEntry.useMutation({
    onSuccess: () => { toast.success("Entry deleted"); refetch(); },
    onError: (e: any) => toast.error(e.message),
  });

  const wordCount = content.split(/\s+/).filter(Boolean).length;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
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
          <BookOpen size={18} className="text-primary" />
          <h1 className="font-display text-sm font-bold tracking-[0.15em]">LORE JOURNAL</h1>
        </div>
        <div className="px-4 sm:px-6 flex gap-1 pb-2">
          {(["my_entries", "write", "community", "stats"] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${
                tab === t ? "bg-primary/20 text-primary border border-primary/30" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "my_entries" ? "MY ENTRIES" : t === "write" ? "WRITE" : t === "community" ? "COMMUNITY" : "STATS"}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 sm:px-6 pt-4 space-y-4">
        {tab === "my_entries" && (
          <>
            <div className="flex items-center justify-between">
              <p className="font-mono text-[10px] text-muted-foreground/60 tracking-wider">
                MY ENTRIES ({myEntries?.length || 0})
              </p>
              <Button size="sm" variant="outline" onClick={() => setTab("write")}>
                <Plus size={12} className="mr-1" /> New Entry
              </Button>
            </div>
            {myEntries && myEntries.length > 0 ? (
              <div className="space-y-2">
                {myEntries.map((entry: any, i: number) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="rounded-lg border border-border/30 bg-card/30 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <PenTool size={14} className="text-primary shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-mono text-xs font-semibold truncate">{entry.title}</p>
                        <p className="font-mono text-[10px] text-muted-foreground flex items-center gap-2">
                          <span>{entry.category}</span>
                          <span>•</span>
                          <span>{entry.wordCount} words</span>
                          <span>•</span>
                          <span>{new Date(entry.createdAt).toLocaleDateString()}</span>
                          {entry.published && <Globe size={9} className="text-primary" />}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => {
                            setEditingId(entry.id);
                            setTitle(entry.title);
                            setContent(entry.content);
                            setCategory(entry.category);
                            setIsPublic(entry.published);
                            setTab("write");
                          }}
                          className="text-muted-foreground/40 hover:text-primary transition-colors"
                        >
                          <PenTool size={12} />
                        </button>
                        <button
                          onClick={() => deleteMut.mutate({ entryId: entry.id })}
                          className="text-muted-foreground/40 hover:text-destructive transition-colors"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <BookOpen size={48} className="mx-auto text-muted-foreground/20 mb-4" />
                <p className="font-mono text-sm text-muted-foreground">No journal entries yet</p>
                <p className="font-mono text-xs text-muted-foreground/60 mt-1">Write about the Dischordian Saga lore!</p>
              </div>
            )}
          </>
        )}

        {tab === "write" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h3 className="font-display text-sm font-bold tracking-wide">
              {editingId ? "EDIT ENTRY" : "NEW ENTRY"}
            </h3>

            <div>
              <label className="font-mono text-[10px] text-muted-foreground/60 tracking-wider block mb-1">TITLE</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Entry title..."
                className="w-full px-3 py-2 rounded-md bg-card/30 border border-border/30 font-mono text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50"
              />
            </div>

            <div>
              <label className="font-mono text-[10px] text-muted-foreground/60 tracking-wider block mb-1">CATEGORY</label>
              <div className="flex gap-1.5 flex-wrap">
                {(categories || ["character_study", "faction_lore", "event_chronicle", "song_analysis", "world_building", "theory", "fan_fiction"]).map((cat: any) => {
                  const catKey = typeof cat === "string" ? cat : cat.key;
                  return (
                    <button
                      key={catKey}
                      onClick={() => setCategory(catKey)}
                      className={`px-2.5 py-1 rounded text-[10px] font-mono transition-colors ${
                        category === catKey
                          ? "bg-primary/20 text-primary border border-primary/30"
                          : "bg-card/30 border border-border/20 text-muted-foreground"
                      }`}
                    >
                      {catKey.replace(/_/g, " ").toUpperCase()}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-mono text-[10px] text-muted-foreground/60 tracking-wider">CONTENT</label>
                <span className={`font-mono text-[10px] ${wordCount >= 100 ? "text-primary" : "text-muted-foreground/60"}`}>
                  {wordCount} words
                </span>
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your lore entry..."
                rows={12}
                className="w-full px-3 py-2 rounded-md bg-card/30 border border-border/30 font-mono text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 resize-none"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="rounded border-border"
              />
              <span className="font-mono text-xs text-muted-foreground">
                <Globe size={10} className="inline mr-1" />
                Publish to community
              </span>
            </label>

            <div className="flex gap-2">
              {editingId ? (
                <Button
                  className="flex-1"
                  onClick={() => updateMut.mutate({
                    entryId: editingId,
                    title,
                    content,
                    published: isPublic,
                  })}
                  disabled={updateMut.isPending || !title.trim() || !content.trim()}
                >
                  <PenTool size={14} className="mr-1" />
                  {updateMut.isPending ? "Saving..." : "Update Entry"}
                </Button>
              ) : (
                <Button
                  className="flex-1"
                  onClick={() => createMut.mutate({
                    title,
                    content,
                    category,
                    published: isPublic,
                  })}
                  disabled={createMut.isPending || !title.trim() || !content.trim()}
                >
                  <PenTool size={14} className="mr-1" />
                  {createMut.isPending ? "Saving..." : "Save Entry"}
                </Button>
              )}
              {editingId && (
                <Button variant="outline" onClick={() => { setEditingId(null); setTitle(""); setContent(""); }}>
                  Cancel
                </Button>
              )}
            </div>
          </motion.div>
        )}

        {tab === "community" && (
          <div className="space-y-2">
            {publicEntries && publicEntries.length > 0 ? (
              publicEntries.map((entry: any, i: number) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="rounded-lg border border-border/30 bg-card/30 p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen size={12} className="text-primary" />
                    <p className="font-mono text-xs font-semibold">{entry.title}</p>
                    <span className="ml-auto font-mono text-[9px] text-muted-foreground/60">{entry.category}</span>
                  </div>
                  <p className="font-mono text-xs text-muted-foreground line-clamp-3">{entry.content}</p>
                  <div className="flex items-center gap-3 mt-2 font-mono text-[10px] text-muted-foreground/60">
                    <span>Player #{entry.userId}</span>
                    <span>{entry.wordCount} words</span>
                    <span>{new Date(entry.createdAt).toLocaleDateString()}</span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-16">
                <Globe size={48} className="mx-auto text-muted-foreground/20 mb-4" />
                <p className="font-mono text-sm text-muted-foreground">No community entries yet</p>
              </div>
            )}
          </div>
        )}

        {tab === "stats" && myStats && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "ENTRIES", value: myStats.totalEntries, icon: BookOpen, color: "text-primary" },
                { label: "WORDS", value: myStats.totalWords, icon: PenTool, color: "text-accent" },
                { label: "STREAK", value: `${myStats.writingStreak}d`, icon: Flame, color: "text-destructive" },
                { label: "XP EARNED", value: myStats.totalXp, icon: Star, color: "text-chart-4" },
              ].map(stat => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="rounded-lg border border-border/30 bg-card/30 p-3">
                    <Icon size={16} className={`${stat.color} mb-2`} />
                    <p className="font-display text-lg font-bold">{stat.value}</p>
                    <p className="font-mono text-[10px] text-muted-foreground/60">{stat.label}</p>
                  </div>
                );
              })}
            </div>

            {/* Writing stats summary */}
            <div className="rounded-lg border border-primary/20 bg-card/40 p-4">
              <h4 className="font-display text-xs font-bold tracking-wide mb-2 flex items-center gap-2">
                <Star size={12} className="text-primary" /> WRITING PROGRESS
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div>
                  <span className="text-muted-foreground/60">Total XP:</span>{" "}
                  <span className="text-primary">{myStats.totalXp}</span>
                </div>
                <div>
                  <span className="text-muted-foreground/60">Avg Words/Entry:</span>{" "}
                  <span className="text-accent">{myStats.totalEntries > 0 ? Math.round(myStats.totalWords / myStats.totalEntries) : 0}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
