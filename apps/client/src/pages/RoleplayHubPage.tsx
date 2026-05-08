/* ═══════════════════════════════════════════════════════════════════
   ROLEPLAY HUB — the single page that hosts the RP-card surface.

   Tabs:
     dossier     — public-facing RP card (chosen name, true name,
                   pronouns, bio, motto, calling, inner voice,
                   recognition mode)
     faction     — faction-channel feed (encrypted relay / bulletin)
     ledger      — Witnessed Ledger (Antiquarian's column + ripples)
     confession  — weekly Confession Booth
     cells       — guild cells + assignment
     charter     — sign / view guild charter
     rites       — schedule + view guild rites

   The page is intentionally one-file at first. Once it stabilises
   the per-tab subtrees can be split into per-file components.
   ═══════════════════════════════════════════════════════════════════ */
import { useState, useMemo } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  ChevronLeft, User, Eye, Megaphone, ScrollText,
  Gavel, Users2, BookHeart, CalendarClock, Lock, Sparkles,
} from "lucide-react";
import {
  CALLING_OPTIONS,
  PRONOUN_OPTIONS,
  INNER_VOICE_LABELS,
  TRIAL_CATEGORY_LABELS,
  type FactionKey,
  type InnerVoiceKey,
  type TrialCategoryKey,
} from "@shared/roleplayChat";

type Tab =
  | "dossier"
  | "faction"
  | "ledger"
  | "confession"
  | "cells"
  | "charter"
  | "rites";

const FACTION_TONE_BY_KEY = {
  empire: { label: "Empire — Bureaucratic Bulletin", className: "border-amber-500/30" },
  insurgency: { label: "Insurgency — Encrypted Relay", className: "border-rose-500/30" },
  witness: { label: "The Witness Choir", className: "border-cyan-500/30" },
  neutral: { label: "Public Notice Board", className: "border-slate-500/30" },
} as const;

export default function RoleplayHubPage() {
  const [tab, setTab] = useState<Tab>("dossier");
  const auth = useAuth();
  const userId = auth.user?.id ?? 0;

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ChevronLeft size={18} /> Back
          </Link>
          <h1 className="font-display text-xl tracking-wider">ROLEPLAY HUB</h1>
          <span className="text-xs text-muted-foreground font-mono">{auth.user?.name ?? ""}</span>
        </div>

        <nav className="flex flex-wrap gap-2 border-b border-border mb-6">
          <TabButton active={tab === "dossier"} onClick={() => setTab("dossier")} icon={<User size={14} />}>Dossier</TabButton>
          <TabButton active={tab === "faction"} onClick={() => setTab("faction")} icon={<Megaphone size={14} />}>Faction Channel</TabButton>
          <TabButton active={tab === "ledger"} onClick={() => setTab("ledger")} icon={<ScrollText size={14} />}>Witnessed Ledger</TabButton>
          <TabButton active={tab === "confession"} onClick={() => setTab("confession")} icon={<Gavel size={14} />}>Confession Booth</TabButton>
          <TabButton active={tab === "cells"} onClick={() => setTab("cells")} icon={<Users2 size={14} />}>Cells</TabButton>
          <TabButton active={tab === "charter"} onClick={() => setTab("charter")} icon={<BookHeart size={14} />}>Charter</TabButton>
          <TabButton active={tab === "rites"} onClick={() => setTab("rites")} icon={<CalendarClock size={14} />}>Rites</TabButton>
        </nav>

        {tab === "dossier" && <DossierTab userId={userId} />}
        {tab === "faction" && <FactionChannelTab />}
        {tab === "ledger" && <WitnessedLedgerTab />}
        {tab === "confession" && <ConfessionBoothTab userId={userId} />}
        {tab === "cells" && <CellsTab userId={userId} />}
        {tab === "charter" && <CharterTab />}
        {tab === "rites" && <RitesTab userId={userId} />}
      </div>
    </div>
  );
}

function TabButton({
  active, onClick, children, icon,
}: { active: boolean; onClick: () => void; children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-2 text-sm border-b-2 -mb-px transition-colors ${
        active
          ? "border-cyan-400 text-cyan-200"
          : "border-transparent text-muted-foreground hover:text-foreground"
      }`}
    >
      {icon} {children}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   DOSSIER TAB
   ═══════════════════════════════════════════════════════════════════ */
function DossierTab({ userId }: { userId: number }) {
  const dossierQuery = trpc.roleplay.getMyDossier.useQuery();
  const upsertMut = trpc.roleplay.upsertMyDossier.useMutation({
    onSuccess: () => {
      toast.success("Dossier saved.");
      dossierQuery.refetch();
    },
    onError: (e) => toast.error(e.message),
  });

  const d = dossierQuery.data;
  const [chosenName, setChosenName] = useState("");
  const [trueName, setTrueName] = useState("");
  const [pronouns, setPronouns] = useState("");
  const [bio, setBio] = useState("");
  const [motto, setMotto] = useState("");
  const [calling, setCalling] = useState("");
  const [innerVoice, setInnerVoice] = useState<InnerVoiceKey | "">("");
  const [factionAllegiance, setFactionAllegiance] = useState<FactionKey | "unaligned">("unaligned");
  const [recognitionMode, setRecognitionMode] = useState<"private" | "open" | "sealed">("private");

  // Hydrate form from query result on first load.
  useMemo(() => {
    if (!d) return;
    setChosenName(d.chosenName ?? "");
    setTrueName(d.trueName ?? "");
    setPronouns(d.pronouns ?? "");
    setBio(d.bio ?? "");
    setMotto(d.motto ?? "");
    setCalling(d.calling ?? "");
    setInnerVoice((d.innerVoice as InnerVoiceKey | null) ?? "");
    setFactionAllegiance((d.factionAllegiance as FactionKey | "unaligned") ?? "unaligned");
    setRecognitionMode((d.recognitionMode as "private" | "open" | "sealed") ?? "private");
  }, [d]);

  const recognitionsQuery = trpc.roleplay.listMyRecognitions.useQuery();

  if (dossierQuery.isLoading) return <Loading />;

  const save = () => {
    upsertMut.mutate({
      chosenName: chosenName || null,
      trueName: trueName || null,
      pronouns: pronouns || null,
      bio: bio || null,
      motto: motto || null,
      calling: calling || null,
      innerVoice: innerVoice || null,
      factionAllegiance: (factionAllegiance === "unaligned" ? "unaligned" : factionAllegiance) as any,
      recognitionMode,
    });
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* LEFT: dossier preview */}
      <DossierPreview
        chosenName={chosenName}
        trueName={trueName}
        pronouns={pronouns}
        bio={bio}
        motto={motto}
        calling={calling}
        innerVoice={(innerVoice || null) as InnerVoiceKey | null}
        faction={factionAllegiance}
        recognitionMode={recognitionMode}
      />

      {/* RIGHT: editor */}
      <div className="rounded-lg border border-border p-4 space-y-3 bg-card/50">
        <h2 className="font-display text-lg flex items-center gap-2"><Sparkles size={16} className="text-cyan-300" /> Edit Dossier</h2>

        <Field label="Chosen Name" hint="What the Insurgency calls you. Visible to everyone.">
          <input className={inputCls} value={chosenName} onChange={e => setChosenName(e.target.value)} maxLength={64} />
        </Field>

        <Field label="True Name" hint="The Authority's record. Hidden by Recognition Mode.">
          <input className={inputCls} value={trueName} onChange={e => setTrueName(e.target.value)} maxLength={64} />
        </Field>

        <Field label="Pronouns / Form of address">
          <select className={inputCls} value={pronouns} onChange={e => setPronouns(e.target.value)}>
            <option value="">— select —</option>
            {PRONOUN_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </Field>

        <Field label="Calling" hint="Your declared archetype.">
          <select className={inputCls} value={calling} onChange={e => setCalling(e.target.value)}>
            <option value="">— select —</option>
            {CALLING_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>

        <Field label="Inner Voice" hint="Your signature axis. Whispers in chat.">
          <select className={inputCls} value={innerVoice} onChange={e => setInnerVoice(e.target.value as any)}>
            <option value="">— none —</option>
            {Object.entries(INNER_VOICE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </Field>

        <Field label="Faction Allegiance">
          <select className={inputCls} value={factionAllegiance} onChange={e => setFactionAllegiance(e.target.value as any)}>
            <option value="unaligned">Unaligned</option>
            <option value="empire">Empire</option>
            <option value="insurgency">Insurgency</option>
            <option value="witness">Witness</option>
            <option value="neutral">Neutral</option>
          </select>
        </Field>

        <Field label="Motto" hint="One line. Shown to opponents at match start.">
          <input className={inputCls} value={motto} onChange={e => setMotto(e.target.value)} maxLength={140} />
        </Field>

        <Field label="Bio" hint="500 chars. In-character, please.">
          <textarea className={`${inputCls} min-h-[100px]`} value={bio} onChange={e => setBio(e.target.value)} maxLength={500} />
          <div className="text-[10px] text-muted-foreground text-right">{bio.length}/500</div>
        </Field>

        <Field label="Recognition Mode" hint="Who sees your True Name.">
          <select className={inputCls} value={recognitionMode} onChange={e => setRecognitionMode(e.target.value as any)}>
            <option value="private">Private — only those I have explicitly recognised</option>
            <option value="open">Open — anyone visiting my dossier</option>
            <option value="sealed">Sealed — locked; I must grant Recognition manually</option>
          </select>
        </Field>

        <div className="flex justify-end pt-2">
          <Button onClick={save} disabled={upsertMut.isPending}>
            {upsertMut.isPending ? "Saving…" : "Save Dossier"}
          </Button>
        </div>

        <div className="pt-4 border-t border-border">
          <h3 className="font-display text-sm flex items-center gap-2 mb-2"><Eye size={14} /> Recognitions</h3>
          <p className="text-xs text-muted-foreground mb-2">
            Granted: {recognitionsQuery.data?.granted.length ?? 0} · Received: {recognitionsQuery.data?.received.length ?? 0}
          </p>
          <p className="text-xs text-muted-foreground">
            To grant Recognition to another player, visit their dossier and use <em>Reveal True Name</em>.
          </p>
        </div>
      </div>
    </div>
  );
}

function DossierPreview({
  chosenName, trueName, pronouns, bio, motto, calling, innerVoice, faction, recognitionMode,
}: {
  chosenName: string; trueName: string; pronouns: string; bio: string;
  motto: string; calling: string; innerVoice: InnerVoiceKey | null;
  faction: string; recognitionMode: string;
}) {
  const trueNameVisible = recognitionMode === "open";
  return (
    <div className="rounded-lg border border-border p-5 bg-gradient-to-b from-cyan-950/30 to-background">
      <div className="text-[10px] uppercase font-mono tracking-wider text-cyan-400/70 mb-1">Dossier preview</div>
      <div className="font-display text-3xl tracking-wide">
        {chosenName || <span className="text-muted-foreground">[unnamed]</span>}
      </div>
      <div className="text-sm text-muted-foreground mb-3">
        {pronouns && <span>{pronouns}</span>}
        {pronouns && calling && <span> · </span>}
        {calling && <span className="italic">{calling}</span>}
      </div>

      <div className="space-y-2 text-sm">
        <Row k="True Name">
          {trueNameVisible
            ? (trueName || <span className="text-muted-foreground italic">unknown</span>)
            : (
              <span className="inline-flex items-center gap-1 text-muted-foreground italic">
                <Lock size={12} /> sealed by Recognition
              </span>
            )
          }
        </Row>
        <Row k="Faction">{faction === "unaligned" ? <span className="text-muted-foreground">unaligned</span> : faction}</Row>
        <Row k="Inner Voice">
          {innerVoice
            ? <span className="italic text-cyan-200">({INNER_VOICE_LABELS[innerVoice]})</span>
            : <span className="text-muted-foreground">—</span>}
        </Row>
        <Row k="Motto">
          {motto
            ? <span className="italic">"{motto}"</span>
            : <span className="text-muted-foreground">—</span>}
        </Row>
      </div>

      {bio && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="text-[10px] uppercase font-mono text-muted-foreground mb-1">Self-Account</div>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{bio}</p>
        </div>
      )}
    </div>
  );
}

function Row({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div className="flex">
      <div className="w-28 text-xs uppercase font-mono text-muted-foreground tracking-wider">{k}</div>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">{label}</div>
      {children}
      {hint && <div className="text-[10px] text-muted-foreground/70 mt-0.5">{hint}</div>}
    </label>
  );
}

const inputCls =
  "w-full bg-background border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-cyan-500/50";

/* ═══════════════════════════════════════════════════════════════════
   FACTION CHANNEL TAB
   ═══════════════════════════════════════════════════════════════════ */
function FactionChannelTab() {
  const [faction, setFaction] = useState<"empire" | "insurgency" | "witness" | "neutral">("insurgency");
  const [draft, setDraft] = useState("");
  const [tone, setTone] = useState<"intel" | "edict" | "vision" | "notice" | "rumor">("notice");

  const feedQuery = trpc.roleplay.listFactionChannel.useQuery({ faction });
  const postMut = trpc.roleplay.postFactionChannel.useMutation({
    onSuccess: () => {
      setDraft("");
      toast.success("Posted.");
      feedQuery.refetch();
    },
    onError: (e) => toast.error(e.message),
  });

  const tone_label = FACTION_TONE_BY_KEY[faction];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs font-mono uppercase text-muted-foreground">Channel:</span>
        {(["insurgency", "empire", "witness", "neutral"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFaction(f)}
            className={`text-xs px-3 py-1 rounded border ${faction === f ? "border-cyan-400 text-cyan-200" : "border-border text-muted-foreground hover:text-foreground"}`}
          >
            {FACTION_TONE_BY_KEY[f].label}
          </button>
        ))}
      </div>

      <div className={`rounded-lg border p-4 ${tone_label.className}`}>
        <h3 className="font-display text-sm tracking-wider mb-3">{tone_label.label}</h3>
        <div className="flex gap-2 mb-3">
          <select className={inputCls + " flex-shrink-0 w-32"} value={tone} onChange={e => setTone(e.target.value as any)}>
            <option value="notice">notice</option>
            <option value="intel">intel</option>
            <option value="edict">edict</option>
            <option value="vision">vision</option>
            <option value="rumor">rumor</option>
          </select>
          <input
            className={inputCls + " flex-1"}
            placeholder="Speak to the channel…"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            maxLength={500}
          />
          <Button
            onClick={() => draft.trim() && postMut.mutate({ faction, message: draft.trim(), tone })}
            disabled={!draft.trim() || postMut.isPending}
          >
            Post
          </Button>
        </div>

        <div className="space-y-2 max-h-[480px] overflow-y-auto">
          {(feedQuery.data ?? []).map(p => (
            <div key={p.id} className={`p-2 rounded border-l-2 ${p.pinned ? "border-amber-400 bg-amber-950/20" : "border-cyan-500/30"}`}>
              <div className="text-[10px] font-mono text-muted-foreground flex justify-between">
                <span>[{p.tone}] {p.authorChosenName ?? "anonymous"}</span>
                <span>{new Date(p.createdAt).toLocaleString()}</span>
              </div>
              <div className="text-sm">{p.message}</div>
            </div>
          ))}
          {feedQuery.data?.length === 0 && (
            <div className="text-sm text-muted-foreground italic text-center py-8">
              The channel is silent.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   WITNESSED LEDGER TAB
   ═══════════════════════════════════════════════════════════════════ */
function WitnessedLedgerTab() {
  const feedQuery = trpc.roleplay.ledgerFeed.useQuery({ limit: 40 });

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="rounded-lg border border-border p-4">
        <h3 className="font-display text-sm tracking-wider mb-3 flex items-center gap-2">
          <ScrollText size={14} className="text-amber-300" /> The Antiquarian's Column
        </h3>
        <div className="space-y-3 max-h-[640px] overflow-y-auto">
          {(feedQuery.data?.pins ?? []).map(p => (
            <article key={p.id} className="border-l-2 border-amber-400/40 pl-3">
              <div className="text-xs font-mono text-amber-300/70 mb-0.5">{p.category} · {new Date(p.pinnedAt).toLocaleDateString()}</div>
              <div className="font-display text-base">{p.headline}</div>
              {p.body && <p className="text-sm text-muted-foreground leading-relaxed mt-1">{p.body}</p>}
            </article>
          ))}
          {feedQuery.data?.pins.length === 0 && (
            <p className="text-sm text-muted-foreground italic">The Antiquarian has not yet inscribed this week.</p>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-border p-4">
        <h3 className="font-display text-sm tracking-wider mb-3 flex items-center gap-2">
          <Eye size={14} className="text-cyan-300" /> Recent Ripples
        </h3>
        <div className="space-y-1 max-h-[640px] overflow-y-auto font-mono text-xs">
          {(feedQuery.data?.ripples ?? []).map(r => (
            <div key={r.id} className="text-muted-foreground">
              <span className="text-cyan-400/70">{new Date(r.emittedAt).toLocaleTimeString()}</span>
              {" · "}
              <span className="text-foreground">{r.eventType}</span>
              {r.userId && <span className="opacity-50"> · #{r.userId}</span>}
            </div>
          ))}
          {feedQuery.data?.ripples.length === 0 && (
            <p className="text-muted-foreground italic">No ripples in the past fortnight.</p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   CONFESSION BOOTH TAB
   ═══════════════════════════════════════════════════════════════════ */
function ConfessionBoothTab({ userId: _userId }: { userId: number }) {
  const userId = _userId;
  const currentQuery = trpc.roleplay.currentConfessions.useQuery();
  const submitMut = trpc.roleplay.submitConfession.useMutation({
    onSuccess: () => {
      toast.success("Confession submitted.");
      setText("");
      currentQuery.refetch();
    },
    onError: (e) => toast.error(e.message),
  });
  const voteMut = trpc.roleplay.voteConfession.useMutation({
    onSuccess: () => {
      toast.success("Vote recorded.");
      currentQuery.refetch();
    },
    onError: (e) => toast.error(e.message),
  });

  const [text, setText] = useState("");
  const [trialCategory, setTrialCategory] = useState<TrialCategoryKey>("confession");

  const data = currentQuery.data;
  const myConfession = useMemo(
    () => data?.confessions.find(c => c.userId === userId),
    [data, userId],
  );

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="rounded-lg border border-border p-4">
        <h3 className="font-display text-sm tracking-wider mb-2 flex items-center gap-2">
          <Gavel size={14} className="text-amber-300" /> This Week's Booth — {data?.weekKey ?? "…"}
        </h3>
        {myConfession ? (
          <div className="text-sm space-y-2">
            <p className="text-muted-foreground">You have already confessed this week.</p>
            <div className="rounded border border-amber-500/30 p-3 bg-amber-950/10 italic">
              "{myConfession.text}"
            </div>
            <div className="text-xs font-mono text-muted-foreground">
              Acquittals {myConfession.acquittals} · Condemnations {myConfession.condemnations} · Abstentions {myConfession.abstentions}
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <Field label="Trial Category">
              <select className={inputCls} value={trialCategory} onChange={e => setTrialCategory(e.target.value as TrialCategoryKey)}>
                {Object.entries(TRIAL_CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </Field>
            <Field label="Confession" hint="Min 20 chars, max 500. In character.">
              <textarea
                className={`${inputCls} min-h-[120px]`}
                value={text}
                onChange={e => setText(e.target.value)}
                maxLength={500}
                placeholder="I, called Vessel-7, confess…"
              />
            </Field>
            <div className="flex justify-end">
              <Button
                onClick={() => submitMut.mutate({ text: text.trim(), trialCategory })}
                disabled={text.trim().length < 20 || submitMut.isPending}
              >
                Submit Confession
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-lg border border-border p-4">
        <h3 className="font-display text-sm tracking-wider mb-3">Tribunal Floor</h3>
        <div className="space-y-3 max-h-[560px] overflow-y-auto">
          {(data?.confessions ?? []).filter(c => c.userId !== userId).map(c => (
            <div key={c.id} className="rounded border border-border p-3">
              <div className="text-[10px] font-mono uppercase text-amber-300/70 mb-1">
                {TRIAL_CATEGORY_LABELS[c.trialCategory as TrialCategoryKey]}
              </div>
              <p className="text-sm italic mb-2">"{c.text}"</p>
              <div className="flex gap-2">
                <button
                  className="text-xs px-2 py-1 rounded border border-emerald-500/40 text-emerald-300 hover:bg-emerald-950/30"
                  onClick={() => voteMut.mutate({ confessionId: c.id, verdict: "acquit" })}
                  disabled={voteMut.isPending}
                >
                  Acquit ({c.acquittals})
                </button>
                <button
                  className="text-xs px-2 py-1 rounded border border-rose-500/40 text-rose-300 hover:bg-rose-950/30"
                  onClick={() => voteMut.mutate({ confessionId: c.id, verdict: "condemn" })}
                  disabled={voteMut.isPending}
                >
                  Condemn ({c.condemnations})
                </button>
                <button
                  className="text-xs px-2 py-1 rounded border border-slate-500/40 text-slate-300 hover:bg-slate-950/30"
                  onClick={() => voteMut.mutate({ confessionId: c.id, verdict: "abstain" })}
                  disabled={voteMut.isPending}
                >
                  Abstain ({c.abstentions})
                </button>
              </div>
            </div>
          ))}
          {(!data || data.confessions.length === 0) && (
            <p className="text-sm text-muted-foreground italic">No confessions on the floor.</p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   CELLS TAB
   ═══════════════════════════════════════════════════════════════════ */
function CellsTab({ userId: _userId }: { userId: number }) {
  void _userId;
  // We don't have the caller's guild id directly; the Cells UI is
  // surfaced from the guild router elsewhere. Here we focus on the
  // *self-discovery* part: list the cells of the player's guild
  // (server-resolved via dossier→ guild lookup is in roleplayRouter).
  // For the MVP we ask the user to enter their guild id; once a
  // hook for "myGuildId" is added on guild router, swap this in.
  const [guildIdInput, setGuildIdInput] = useState<string>("");
  const guildId = parseInt(guildIdInput, 10) || 0;
  const cellsQuery = trpc.roleplay.listCells.useQuery(
    { guildId },
    { enabled: guildId > 0 },
  );

  const [newCellName, setNewCellName] = useState("");
  const [newCellEthos, setNewCellEthos] = useState("");
  const createMut = trpc.roleplay.createCell.useMutation({
    onSuccess: () => {
      setNewCellName(""); setNewCellEthos("");
      toast.success("Cell created.");
      cellsQuery.refetch();
    },
    onError: e => toast.error(e.message),
  });

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border p-4 bg-card/30">
        <h3 className="font-display text-sm tracking-wider mb-2 flex items-center gap-2">
          <Users2 size={14} className="text-rose-300" /> Cells / Chambers / Circles / Chapters
        </h3>
        <p className="text-xs text-muted-foreground mb-3">
          Cells are sub-groups inside your guild — themed sub-chapters with their own ethos and (eventually) their own chat surface.
          A guild may have up to 6 cells. Cell vocabulary follows the guild's faction.
        </p>

        <Field label="Guild ID">
          <input className={inputCls} value={guildIdInput} onChange={e => setGuildIdInput(e.target.value)} placeholder="123" />
        </Field>

        {guildId > 0 && (
          <>
            <div className="mt-4 space-y-2">
              {(cellsQuery.data ?? []).map(c => (
                <div key={c.id} className="rounded border border-border p-3">
                  <div className="font-display">{c.name}</div>
                  {c.ethos && <p className="text-sm text-muted-foreground italic mt-1">"{c.ethos}"</p>}
                </div>
              ))}
              {cellsQuery.data?.length === 0 && (
                <p className="text-sm text-muted-foreground italic">No cells yet. Officers may create up to 6.</p>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-border">
              <h4 className="text-xs font-mono uppercase text-muted-foreground mb-2">Create cell (officers+)</h4>
              <div className="space-y-2">
                <input className={inputCls} placeholder="Cell name" value={newCellName} onChange={e => setNewCellName(e.target.value)} maxLength={64} />
                <input className={inputCls} placeholder="Ethos (what does this cell stand for, IC?)" value={newCellEthos} onChange={e => setNewCellEthos(e.target.value)} maxLength={280} />
                <div className="flex justify-end">
                  <Button
                    onClick={() => createMut.mutate({ name: newCellName, ethos: newCellEthos || undefined })}
                    disabled={newCellName.length < 2 || createMut.isPending}
                  >
                    Create Cell
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   CHARTER TAB
   ═══════════════════════════════════════════════════════════════════ */
function CharterTab() {
  const [oath, setOath] = useState("");
  const [vocab, setVocab] = useState<"rite" | "edict" | "weave" | "compact">("compact");
  const [presiding, setPresiding] = useState("");

  const signMut = trpc.roleplay.signGuildCharter.useMutation({
    onSuccess: () => toast.success("Charter signed. Faction locked for 30 days."),
    onError: e => toast.error(e.message),
  });

  return (
    <div className="rounded-lg border border-border p-4 max-w-2xl">
      <h3 className="font-display text-sm tracking-wider mb-2 flex items-center gap-2">
        <BookHeart size={14} className="text-rose-300" /> Sign the Guild Charter
      </h3>
      <p className="text-xs text-muted-foreground mb-3">
        The charter locks your guild's faction for 30 days, sets its vocabulary tier, and (in a future cutscene patch) triggers a guild-wide founding ceremony presided over by the chosen companion.
        Only the guild leader may sign.
      </p>

      <Field label="Guild Oath" hint="Public, in-character. 280 chars.">
        <textarea className={`${inputCls} min-h-[80px]`} value={oath} onChange={e => setOath(e.target.value)} maxLength={280} />
      </Field>

      <Field label="Vocabulary Tier" hint="Renames in-game terms across guild surfaces.">
        <select className={inputCls} value={vocab} onChange={e => setVocab(e.target.value as any)}>
          <option value="rite">Rite — Insurgency vocabulary (cells, strikes, cache)</option>
          <option value="edict">Edict — Empire vocabulary (chambers, affirmations, tithe)</option>
          <option value="weave">Weave — Witness vocabulary (circles, reckonings, reliquary)</option>
          <option value="compact">Compact — neutral vocabulary</option>
        </select>
      </Field>

      <Field label="Presiding Companion" hint="Who witnesses the signing? Elara, The Human, The Antiquarian, Locke, The Seer…">
        <input className={inputCls} value={presiding} onChange={e => setPresiding(e.target.value)} maxLength={48} />
      </Field>

      <div className="flex justify-end mt-3">
        <Button
          onClick={() => signMut.mutate({ oath, vocabularyTier: vocab, presidingCompanion: presiding || null })}
          disabled={oath.length < 10 || signMut.isPending}
        >
          Sign Charter
        </Button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   RITES TAB
   ═══════════════════════════════════════════════════════════════════ */
function RitesTab({ userId: _userId }: { userId: number }) {
  void _userId;
  const ritesQuery = trpc.roleplay.listGuildRites.useQuery();
  const scheduleMut = trpc.roleplay.scheduleRite.useMutation({
    onSuccess: () => {
      toast.success("Rite scheduled.");
      ritesQuery.refetch();
      setTitle(""); setDesc(""); setWhen("");
    },
    onError: e => toast.error(e.message),
  });
  const cancelMut = trpc.roleplay.cancelRite.useMutation({
    onSuccess: () => { toast.success("Cancelled."); ritesQuery.refetch(); },
    onError: e => toast.error(e.message),
  });

  const [riteType, setRiteType] = useState<"naming" | "witnessing" | "tribunal" | "investiture" | "rite_of_passage" | "other">("naming");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [when, setWhen] = useState("");

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="rounded-lg border border-border p-4">
        <h3 className="font-display text-sm tracking-wider mb-3">Schedule a Rite</h3>

        <Field label="Type">
          <select className={inputCls} value={riteType} onChange={e => setRiteType(e.target.value as any)}>
            <option value="naming">Naming Ceremony</option>
            <option value="witnessing">Witnessing</option>
            <option value="tribunal">Tribunal</option>
            <option value="investiture">Investiture</option>
            <option value="rite_of_passage">Rite of Passage</option>
            <option value="other">Other</option>
          </select>
        </Field>
        <Field label="Title">
          <input className={inputCls} value={title} onChange={e => setTitle(e.target.value)} maxLength={140} />
        </Field>
        <Field label="When (ISO)">
          <input className={inputCls} type="datetime-local" value={when} onChange={e => setWhen(e.target.value)} />
        </Field>
        <Field label="Description">
          <textarea className={`${inputCls} min-h-[80px]`} value={desc} onChange={e => setDesc(e.target.value)} maxLength={2000} />
        </Field>
        <div className="flex justify-end mt-2">
          <Button
            disabled={!title || !when || scheduleMut.isPending}
            onClick={() => scheduleMut.mutate({
              riteType, title, description: desc || undefined,
              scheduledAt: new Date(when),
            })}
          >Schedule</Button>
        </div>
      </div>

      <div className="rounded-lg border border-border p-4">
        <h3 className="font-display text-sm tracking-wider mb-3">Upcoming & Recent</h3>
        <div className="space-y-2">
          {(ritesQuery.data ?? []).map(r => (
            <div key={r.id} className={`rounded border p-3 ${r.status === "cancelled" ? "border-border opacity-50" : "border-cyan-500/30"}`}>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-[10px] font-mono uppercase text-muted-foreground">{r.riteType} · {r.status}</div>
                  <div className="font-display">{r.title}</div>
                  <div className="text-xs text-muted-foreground">{new Date(r.scheduledAt).toLocaleString()}</div>
                </div>
                {r.status === "scheduled" && (
                  <button
                    className="text-xs text-rose-400 hover:underline"
                    onClick={() => cancelMut.mutate({ riteId: r.id })}
                  >cancel</button>
                )}
              </div>
              {r.description && <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">{r.description}</p>}
            </div>
          ))}
          {ritesQuery.data?.length === 0 && (
            <p className="text-sm text-muted-foreground italic">No rites scheduled. Officers may schedule.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function Loading() {
  return <div className="text-sm text-muted-foreground py-12 text-center">Loading…</div>;
}
