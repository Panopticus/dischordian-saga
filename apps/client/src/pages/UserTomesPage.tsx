/* ═══════════════════════════════════════════════════════════════════
   USER TOMES PAGE — author + browse community CoNexus tomes.

   Two columns:
     LEFT  — author surface: drafts + new-tome editor
     RIGHT — public feed: most-endorsed published tomes

   The author column shows the lifecycle: draft → submitted →
   published (or rejected). Drafts can be freely edited; submitted
   locks until withdrawn or moderated. Published tomes can be
   withdrawn (retired) by their author.
   ═══════════════════════════════════════════════════════════════════ */
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  ChevronLeft, BookOpen, Pencil, Send, Trash2, Heart,
  HeartOff, Sparkles, FileText, Lock, AlertTriangle,
} from "lucide-react";

type Tab = "author" | "browse" | "read";

export default function UserTomesPage() {
  const [tab, setTab] = useState<Tab>("browse");
  const [readingId, setReadingId] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ChevronLeft size={18} /> Back
          </Link>
          <h1 className="font-display text-xl tracking-wider">CONEXUS · USER TOMES</h1>
          <span className="text-xs text-muted-foreground font-mono">
            "every tome is equally real"
          </span>
        </div>

        <nav className="flex gap-2 border-b border-border mb-6">
          <TabBtn active={tab === "browse"} onClick={() => { setTab("browse"); setReadingId(null); }}>
            <BookOpen size={14} /> Browse
          </TabBtn>
          <TabBtn active={tab === "author"} onClick={() => { setTab("author"); setReadingId(null); }}>
            <Pencil size={14} /> My Tomes
          </TabBtn>
        </nav>

        {readingId !== null
          ? <TomeReader id={readingId} onClose={() => setReadingId(null)} />
          : tab === "browse" ? <BrowseTab onRead={setReadingId} />
          : <AuthorTab onRead={setReadingId} />}
      </div>
    </div>
  );
}

function TabBtn({
  active, onClick, children,
}: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-2 text-sm border-b-2 -mb-px ${
        active ? "border-amber-400 text-amber-200" : "border-transparent text-muted-foreground hover:text-foreground"
      }`}
    >{children}</button>
  );
}

/* ═══ BROWSE ═══ */

function BrowseTab({ onRead }: { onRead: (id: number) => void }) {
  const [sort, setSort] = useState<"endorsed" | "newest">("endorsed");
  const feedQuery = trpc.userTomes.listPublished.useQuery({ sort, limit: 30, offset: 0 });

  return (
    <div>
      <div className="flex gap-2 mb-3 text-xs">
        <button
          className={sort === "endorsed" ? "text-amber-300 underline" : "text-muted-foreground"}
          onClick={() => setSort("endorsed")}
        >Most endorsed</button>
        <button
          className={sort === "newest" ? "text-amber-300 underline" : "text-muted-foreground"}
          onClick={() => setSort("newest")}
        >Newest</button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {(feedQuery.data ?? []).map(t => (
          <button
            key={t.id}
            onClick={() => onRead(t.id)}
            className="text-left rounded-lg border border-border p-4 hover:border-amber-500/40 transition"
          >
            <div className="flex items-baseline justify-between mb-1">
              <div className="font-display text-base">{t.title}</div>
              <div className="text-xs text-amber-300/80 inline-flex items-center gap-1">
                <Heart size={10} /> {t.endorsements}
              </div>
            </div>
            {t.cycleIndex && <div className="text-[10px] font-mono uppercase text-amber-300/70">{t.cycleIndex}</div>}
            {t.teaser && <p className="text-sm text-muted-foreground italic mt-1">{t.teaser}</p>}
            <div className="text-[10px] font-mono text-muted-foreground mt-2">
              by {t.authorName ?? "anonymous"} · {new Date(t.createdAt).toLocaleDateString()}
            </div>
          </button>
        ))}
        {feedQuery.data?.length === 0 && (
          <p className="text-sm text-muted-foreground italic col-span-2 text-center py-12">
            The Loredex has no community tomes yet. Be the first.
          </p>
        )}
      </div>
    </div>
  );
}

/* ═══ READ ═══ */

function TomeReader({ id, onClose }: { id: number; onClose: () => void }) {
  const tomeQuery = trpc.userTomes.getById.useQuery({ id });
  const utils = trpc.useUtils();
  const endorseMut = trpc.userTomes.endorse.useMutation({
    onSuccess: () => {
      toast.success("Endorsed.");
      utils.userTomes.getById.invalidate({ id });
      utils.userTomes.listPublished.invalidate();
    },
    onError: e => toast.error(e.message),
  });
  const t = tomeQuery.data;
  if (!t) return <div className="text-sm text-muted-foreground py-12 text-center">Loading…</div>;
  return (
    <article className="max-w-2xl mx-auto rounded-lg border border-amber-500/20 p-6">
      <button onClick={onClose} className="text-xs text-muted-foreground hover:text-foreground mb-4">
        ← back to feed
      </button>
      {t.cycleIndex && (
        <div className="text-[10px] font-mono uppercase text-amber-300/70 mb-1">{t.cycleIndex}</div>
      )}
      <h2 className="font-display text-2xl mb-2">{t.title}</h2>
      {t.teaser && <p className="text-sm italic text-muted-foreground mb-4">{t.teaser}</p>}
      <div className="text-sm leading-relaxed whitespace-pre-wrap">{t.body}</div>
      <div className="mt-6 pt-4 border-t border-border flex justify-between items-center">
        <div className="text-xs font-mono text-muted-foreground">
          {t.endorsements} endorsements
        </div>
        <Button
          size="sm"
          onClick={() => endorseMut.mutate({ id })}
          disabled={endorseMut.isPending}
        >
          <Heart size={12} className="mr-1" /> Endorse
        </Button>
      </div>
    </article>
  );
}

/* ═══ AUTHOR ═══ */

function AuthorTab({ onRead }: { onRead: (id: number) => void }) {
  const minesQuery = trpc.userTomes.listMine.useQuery();
  const utils = trpc.useUtils();
  const [editingId, setEditingId] = useState<number | null>(null);

  const refresh = () => {
    utils.userTomes.listMine.invalidate();
  };

  if (editingId !== null) {
    const editing = minesQuery.data?.find(t => t.id === editingId);
    return <TomeEditor
      tome={editing}
      onClose={() => { setEditingId(null); refresh(); }}
    />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setEditingId(0)}>
          <FileText size={14} className="mr-1" /> New Tome
        </Button>
      </div>

      <div className="space-y-2">
        {(minesQuery.data ?? []).map(t => (
          <div key={t.id} className="rounded border border-border p-3 flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-display text-base truncate">{t.title}</span>
                <StatusPill status={t.status} />
                {t.endorsements > 0 && (
                  <span className="text-[10px] font-mono text-amber-300/80">
                    <Heart size={9} className="inline" /> {t.endorsements}
                  </span>
                )}
              </div>
              {t.teaser && <p className="text-xs text-muted-foreground italic truncate">{t.teaser}</p>}
              {t.status === "rejected" && t.moderatorNote && (
                <p className="text-xs text-rose-300/80 mt-1">
                  <AlertTriangle size={10} className="inline mr-1" />
                  {t.moderatorNote}
                </p>
              )}
            </div>
            <AuthorActions tome={t} onEdit={() => setEditingId(t.id)} onRead={() => onRead(t.id)} onChange={refresh} />
          </div>
        ))}
        {minesQuery.data?.length === 0 && (
          <p className="text-sm text-muted-foreground italic text-center py-12">
            No tomes yet. Click "New Tome" to author one.
          </p>
        )}
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    draft: "border-border text-muted-foreground",
    submitted: "border-amber-500/40 text-amber-300",
    published: "border-emerald-500/40 text-emerald-300",
    rejected: "border-rose-500/40 text-rose-300",
    retired: "border-slate-500/40 text-slate-300",
  };
  return (
    <span className={`text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded border ${map[status] ?? ""}`}>
      {status}
    </span>
  );
}

function AuthorActions({
  tome, onEdit, onRead, onChange,
}: {
  tome: { id: number; status: string };
  onEdit: () => void;
  onRead: () => void;
  onChange: () => void;
}) {
  const submitMut = trpc.userTomes.submitForReview.useMutation({
    onSuccess: () => { toast.success("Submitted for review."); onChange(); },
    onError: e => toast.error(e.message),
  });
  const withdrawMut = trpc.userTomes.withdraw.useMutation({
    onSuccess: () => { toast.success("Withdrawn."); onChange(); },
    onError: e => toast.error(e.message),
  });
  const deleteMut = trpc.userTomes.deleteDraft.useMutation({
    onSuccess: () => { toast.success("Draft deleted."); onChange(); },
    onError: e => toast.error(e.message),
  });

  return (
    <div className="flex items-center gap-1.5">
      {tome.status === "draft" && (
        <>
          <button onClick={onEdit} className="text-xs text-foreground hover:underline inline-flex items-center gap-1">
            <Pencil size={10} /> edit
          </button>
          <button
            onClick={() => submitMut.mutate({ id: tome.id })}
            className="text-xs text-amber-300 hover:underline inline-flex items-center gap-1"
            disabled={submitMut.isPending}
          >
            <Send size={10} /> submit
          </button>
          <button
            onClick={() => deleteMut.mutate({ id: tome.id })}
            className="text-xs text-rose-300 hover:underline inline-flex items-center gap-1"
            disabled={deleteMut.isPending}
          >
            <Trash2 size={10} /> delete
          </button>
        </>
      )}
      {tome.status === "submitted" && (
        <>
          <span className="text-[10px] font-mono text-amber-300/70 inline-flex items-center gap-1">
            <Lock size={10} /> locked
          </span>
          <button
            onClick={() => withdrawMut.mutate({ id: tome.id })}
            className="text-xs text-muted-foreground hover:underline"
            disabled={withdrawMut.isPending}
          >
            withdraw
          </button>
        </>
      )}
      {tome.status === "published" && (
        <>
          <button onClick={onRead} className="text-xs text-emerald-300 hover:underline">
            view public
          </button>
          <button
            onClick={() => withdrawMut.mutate({ id: tome.id })}
            className="text-xs text-muted-foreground hover:underline inline-flex items-center gap-1"
            disabled={withdrawMut.isPending}
          >
            <HeartOff size={10} /> retire
          </button>
        </>
      )}
      {tome.status === "rejected" && (
        <button onClick={onEdit} className="text-xs text-foreground hover:underline inline-flex items-center gap-1">
          <Pencil size={10} /> revise
        </button>
      )}
    </div>
  );
}

/* ═══ EDITOR ═══ */

function TomeEditor({
  tome, onClose,
}: {
  tome: { id: number; title: string; teaser: string | null; body: string; cycleIndex: string | null; status: string } | undefined;
  onClose: () => void;
}) {
  const isNew = !tome;
  const [title, setTitle] = useState(tome?.title ?? "");
  const [teaser, setTeaser] = useState(tome?.teaser ?? "");
  const [body, setBody] = useState(tome?.body ?? "");
  const [cycleIndex, setCycleIndex] = useState(tome?.cycleIndex ?? "");

  // If editing a rejected tome, the user should be able to revise it
  // but we treat it as a draft transition path. The server enforces.
  const editable = isNew || tome?.status === "draft" || tome?.status === "rejected";

  useEffect(() => {
    setTitle(tome?.title ?? "");
    setTeaser(tome?.teaser ?? "");
    setBody(tome?.body ?? "");
    setCycleIndex(tome?.cycleIndex ?? "");
    // Hydrate ONLY when the underlying tome row identity changes —
    // re-running on every body keystroke would wipe in-progress edits.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tome?.id]);

  const submitMut = trpc.userTomes.submitDraft.useMutation({
    onSuccess: () => { toast.success("Draft created."); onClose(); },
    onError: e => toast.error(e.message),
  });
  const updateMut = trpc.userTomes.updateDraft.useMutation({
    onSuccess: () => { toast.success("Saved."); onClose(); },
    onError: e => toast.error(e.message),
  });

  const wordCount = body.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="max-w-3xl mx-auto rounded-lg border border-border p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg flex items-center gap-2">
          <Sparkles size={16} className="text-amber-300" />
          {isNew ? "New Tome" : "Edit Tome"}
        </h3>
        {!editable && <span className="text-xs text-amber-300/70">read-only — withdraw to edit</span>}
      </div>

      <input
        className="w-full bg-background border border-border rounded px-3 py-2 text-base font-display"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        maxLength={120}
        disabled={!editable}
      />
      <input
        className="w-full bg-background border border-border rounded px-3 py-1.5 text-sm font-mono"
        placeholder="CoNexus index (e.g. 'CoNexus 0319')"
        value={cycleIndex}
        onChange={e => setCycleIndex(e.target.value)}
        maxLength={32}
        disabled={!editable}
      />
      <input
        className="w-full bg-background border border-border rounded px-3 py-2 text-sm italic"
        placeholder="One-line teaser (240 chars)"
        value={teaser}
        onChange={e => setTeaser(e.target.value)}
        maxLength={240}
        disabled={!editable}
      />
      <textarea
        className="w-full bg-background border border-border rounded px-3 py-2 text-sm leading-relaxed min-h-[300px]"
        placeholder="Tome body — 200–400 words is the bible convention. A single character, a single decision, a single resonance."
        value={body}
        onChange={e => setBody(e.target.value)}
        maxLength={4000}
        disabled={!editable}
      />
      <div className="flex justify-between items-center text-xs text-muted-foreground">
        <span>{wordCount} words · {body.length}/4000 chars</span>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={onClose} size="sm">Cancel</Button>
          {editable && (
            <Button
              onClick={() => {
                if (isNew) {
                  submitMut.mutate({
                    title, body,
                    teaser: teaser || undefined,
                    cycleIndex: cycleIndex || undefined,
                  });
                } else if (tome) {
                  updateMut.mutate({
                    id: tome.id,
                    title, body,
                    teaser: teaser || null,
                    cycleIndex: cycleIndex || null,
                  });
                }
              }}
              disabled={title.length < 3 || body.length < 50 || submitMut.isPending || updateMut.isPending}
              size="sm"
            >
              {isNew ? "Create Draft" : "Save"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
