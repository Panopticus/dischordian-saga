/* ═══════════════════════════════════════════════════════════════════
   DECK OATH BANNER — surface a deck's oath/lore/signature card.

   Two modes:
     mode="banner"  — read-only, used at match-start screens. Loads
                      via trpc.roleplay.getDeckOath if `deckId` is
                      truthy.
     mode="editor"  — inline editor, used in DeckBuilderPage. Loads
                      current values, lets the deck owner save.

   The component returns null when the deck has no oath set and
   mode is "banner" (so it doesn't take vertical space until a
   roleplayer has authored something).
   ═══════════════════════════════════════════════════════════════════ */
import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Quote, Pencil, Save, X } from "lucide-react";

interface BannerProps {
  mode: "banner";
  deckId: number | null | undefined;
  /** When true, render even if no oath is set (DeckBuilder hint state). */
  showWhenEmpty?: boolean;
  className?: string;
}

interface EditorProps {
  mode: "editor";
  deckId: number | null | undefined;
  className?: string;
}

type Props = BannerProps | EditorProps;

export function DeckOathBanner(props: Props) {
  if (props.mode === "banner") return <Banner {...props} />;
  return <Editor {...props} />;
}

function Banner({ deckId, showWhenEmpty, className }: BannerProps) {
  const oathQuery = trpc.roleplay.getDeckOath.useQuery(
    { deckId: deckId ?? 0 },
    { enabled: !!deckId },
  );
  if (!deckId) return null;
  const o = oathQuery.data;
  if (!o && !showWhenEmpty) return null;

  if (!o || (!o.oath && !o.lore && !o.signatureCardId)) {
    return showWhenEmpty ? (
      <div className={`text-xs text-muted-foreground italic ${className ?? ""}`}>
        No deck oath set.
      </div>
    ) : null;
  }

  return (
    <div className={`rounded-lg border border-amber-500/30 bg-amber-950/10 p-3 ${className ?? ""}`}>
      {o.oath && (
        <div className="flex items-start gap-2">
          <Quote size={14} className="text-amber-300 mt-0.5 flex-shrink-0" />
          <div className="text-sm italic text-amber-100/90">"{o.oath}"</div>
        </div>
      )}
      {o.lore && (
        <p className="text-xs text-muted-foreground mt-2 whitespace-pre-wrap leading-relaxed">
          {o.lore}
        </p>
      )}
      {o.signatureCardId && (
        <div className="text-[10px] font-mono uppercase tracking-wider text-amber-300/70 mt-2">
          signature: {o.signatureCardId}
        </div>
      )}
    </div>
  );
}

function Editor({ deckId, className }: EditorProps) {
  const oathQuery = trpc.roleplay.getDeckOath.useQuery(
    { deckId: deckId ?? 0 },
    { enabled: !!deckId },
  );
  const upsertMut = trpc.roleplay.upsertDeckOath.useMutation({
    onSuccess: () => {
      toast.success("Oath saved.");
      oathQuery.refetch();
      setOpen(false);
    },
    onError: e => toast.error(e.message),
  });

  const [open, setOpen] = useState(false);
  const [oath, setOath] = useState("");
  const [lore, setLore] = useState("");
  const [signatureCardId, setSignatureCardId] = useState("");

  useEffect(() => {
    const o = oathQuery.data;
    if (o) {
      setOath(o.oath ?? "");
      setLore(o.lore ?? "");
      setSignatureCardId(o.signatureCardId ?? "");
    }
  }, [oathQuery.data]);

  if (!deckId) return null;

  if (!open) {
    return (
      <div className={`flex items-center gap-2 ${className ?? ""}`}>
        <Banner mode="banner" deckId={deckId} showWhenEmpty />
        <button
          onClick={() => setOpen(true)}
          className="text-[10px] font-mono uppercase tracking-wider text-amber-300/70 hover:text-amber-200 inline-flex items-center gap-1"
        >
          <Pencil size={10} /> oath
        </button>
      </div>
    );
  }

  return (
    <div className={`rounded-lg border border-amber-500/40 bg-amber-950/20 p-3 space-y-2 ${className ?? ""}`}>
      <div className="text-[10px] font-mono uppercase tracking-wider text-amber-300">Edit Deck Oath</div>
      <input
        className="w-full bg-background border border-amber-500/30 rounded px-2 py-1 text-sm"
        placeholder="One-line oath, shown to opponent at match start (140 chars)"
        value={oath}
        onChange={e => setOath(e.target.value)}
        maxLength={140}
      />
      <textarea
        className="w-full bg-background border border-amber-500/30 rounded px-2 py-1 text-xs min-h-[80px]"
        placeholder="Long-form deck lore — IC justification (1000 chars)"
        value={lore}
        onChange={e => setLore(e.target.value)}
        maxLength={1000}
      />
      <input
        className="w-full bg-background border border-amber-500/30 rounded px-2 py-1 text-xs font-mono"
        placeholder="Signature card id (optional)"
        value={signatureCardId}
        onChange={e => setSignatureCardId(e.target.value)}
        maxLength={96}
      />
      <div className="flex gap-2 justify-end">
        <button
          onClick={() => setOpen(false)}
          className="text-xs px-2 py-1 rounded border border-border text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
        >
          <X size={10} /> Cancel
        </button>
        <button
          onClick={() => upsertMut.mutate({
            deckId,
            oath: oath || null,
            lore: lore || null,
            signatureCardId: signatureCardId || null,
          })}
          disabled={upsertMut.isPending}
          className="text-xs px-2 py-1 rounded bg-amber-600 hover:bg-amber-500 text-amber-50 inline-flex items-center gap-1"
        >
          <Save size={10} /> {upsertMut.isPending ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}
