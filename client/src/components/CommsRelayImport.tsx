/* ═══════════════════════════════════════════════════════
   COMMS RELAY — NFT Batch Import System
   Connects to Communication Relay on the Comms Array.
   Allows batch wallet linking + scanning + claiming.
   ═══════════════════════════════════════════════════════ */
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { useState, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Radio, Wallet, Link2, Scan, Sparkles, Check, Loader2, X,
  Plus, AlertTriangle, ChevronRight, Shield, Zap, Signal
} from "lucide-react";
import { toast } from "sonner";

const getEthersProvider = async () => {
  const { BrowserProvider } = await import("ethers");
  return BrowserProvider;
};

/* ─── Elara narrative dialog lines ─── */
const ELARA_INTRO_LINES = [
  "The Communication Relay. I've been trying to re-establish contact with the other vessels in the fleet — the ones that carried the first wave of Potentials into the void.",
  "Most channels are dead. Static. But I've detected faint neural signatures on some frequencies — subconscious echoes from Potentials who may have survived the transit.",
  "If you can connect your wallet — the quantum signature tied to your Potential's neural pathway — I can scan for any dormant identities linked to your consciousness.",
  "Each Potential you own carries a unique 1/1 identity card encoded in their DNA. Once I verify ownership, I can extract that card and add it to your collection. This is a one-time extraction — once claimed, the card is permanently bound to you.",
  "Many operatives have Potentials scattered across multiple wallets. You can keep linking wallets and I'll scan them all. Ready to begin?",
];

type Phase = "intro" | "wallets" | "scanning" | "results";

export default function CommsRelayImport({ onClose }: { onClose: () => void }) {
  const { user, isAuthenticated } = useAuth();
  const [phase, setPhase] = useState<Phase>("intro");
  const [introLine, setIntroLine] = useState(0);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isLinking, setIsLinking] = useState(false);

  // tRPC
  const linkedWallets = trpc.nft.getLinkedWallets.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const scanAll = trpc.nft.scanAllWallets.useQuery(undefined, {
    enabled: isAuthenticated && phase === "scanning",
  });
  const batchClaimAll = trpc.nft.batchClaimAllWallets.useMutation({
    onSuccess: (data) => {
      if (data.claimed > 0) {
        toast.success(`Extracted ${data.claimed} identity cards from the neural pathways!`);
      } else {
        toast.info("No new identity cards to extract.");
      }
      scanAll.refetch();
      linkedWallets.refetch();
    },
    onError: (err) => toast.error(err.message),
  });
  const linkWallet = trpc.nft.linkWallet.useMutation({
    onSuccess: () => {
      toast.success("Neural pathway linked successfully!");
      linkedWallets.refetch();
      setIsLinking(false);
    },
    onError: (err) => {
      toast.error(err.message);
      setIsLinking(false);
    },
  });
  const unlinkWallet = trpc.nft.unlinkWallet.useMutation({
    onSuccess: () => {
      toast.success("Wallet disconnected");
      linkedWallets.refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  // Connect + link wallet
  const connectAndLink = useCallback(async () => {
    if (!(window as any).ethereum) {
      toast.error("No Ethereum wallet detected. Install MetaMask or a compatible wallet.");
      return;
    }
    if (!isAuthenticated || !user) {
      window.location.href = getLoginUrl();
      return;
    }

    setIsConnecting(true);
    try {
      const BP = await getEthersProvider();
      const provider = new BP((window as any).ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      // Check if already linked
      const existing = linkedWallets.data?.find(
        (w) => w.walletAddress.toLowerCase() === address.toLowerCase()
      );
      if (existing) {
        toast.info("This wallet is already linked!");
        setIsConnecting(false);
        return;
      }

      // Sign message
      setIsLinking(true);
      const timestamp = Date.now();
      const message = `LOREDEX OS — Link Wallet\n\nI am linking wallet ${address} to my Loredex account.\n\nUser: ${user.id}\nTimestamp: ${timestamp}\nChain: Ethereum`;
      const signature = await signer.signMessage(message);

      await linkWallet.mutateAsync({ walletAddress: address, message, signature });
    } catch (err: any) {
      if (err.code === "ACTION_REJECTED") {
        toast.error("Signature rejected");
      } else {
        toast.error(err.message || "Failed to connect wallet");
      }
      setIsLinking(false);
    } finally {
      setIsConnecting(false);
    }
  }, [isAuthenticated, user, linkedWallets.data, linkWallet]);

  const walletCount = linkedWallets.data?.length ?? 0;
  const totalOwned = scanAll.data?.totalOwned ?? 0;
  const totalUnclaimed = scanAll.data?.totalUnclaimed ?? 0;

  // Auto-advance from scanning when data arrives
  useEffect(() => {
    if (phase === "scanning" && scanAll.data && !scanAll.isLoading) {
      setPhase("results");
    }
  }, [phase, scanAll.data, scanAll.isLoading]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.85)" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg relative"
        style={{
          background: "linear-gradient(135deg, rgba(10,10,20,0.98) 0%, rgba(20,15,35,0.98) 100%)",
          border: "1px solid rgba(168,85,247,0.3)",
          boxShadow: "0 0 40px rgba(168,85,247,0.15), inset 0 0 60px rgba(0,0,0,0.5)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5" style={{ borderBottom: "1px solid rgba(168,85,247,0.15)" }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{
              background: "rgba(168,85,247,0.15)",
              border: "1px solid rgba(168,85,247,0.4)",
              boxShadow: "0 0 12px rgba(168,85,247,0.3)",
            }}>
              <Radio size={16} className="text-purple-400" />
            </div>
            <div>
              <h2 className="font-display text-sm font-bold tracking-[0.15em] text-foreground">COMMUNICATION RELAY</h2>
              <p className="font-mono text-[9px] text-purple-400/60 tracking-wider">NEURAL PATHWAY SCANNER // BATCH IMPORT</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:bg-white/10"
            style={{ border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <X size={14} className="text-muted-foreground" />
          </button>
        </div>

        <div className="p-4 sm:p-5">
          <AnimatePresence mode="wait">
            {/* ═══ INTRO PHASE — Elara Narrative ═══ */}
            {phase === "intro" && (
              <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* Elara portrait + dialog */}
                <div className="flex gap-4 mb-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex-shrink-0 overflow-hidden" style={{
                    border: "2px solid rgba(51,226,230,0.4)",
                    boxShadow: "0 0 15px rgba(51,226,230,0.2)",
                  }}>
                    <div className="w-full h-full bg-gradient-to-br from-cyan-900/50 to-purple-900/50 flex items-center justify-center">
                      <Signal size={20} className="text-cyan-400" />
                    </div>
                  </div>
                  <div className="flex-1 rounded-lg p-3 sm:p-4" style={{
                    background: "rgba(51,226,230,0.05)",
                    border: "1px solid rgba(51,226,230,0.15)",
                  }}>
                    <p className="font-mono text-[10px] text-cyan-400/60 tracking-wider mb-1.5">ELARA // COMMS RELAY</p>
                    <p className="font-mono text-xs sm:text-sm text-foreground/90 leading-relaxed">
                      {ELARA_INTRO_LINES[introLine]}
                    </p>
                  </div>
                </div>

                {/* Navigation dots */}
                <div className="flex items-center justify-center gap-1.5 mb-4">
                  {ELARA_INTRO_LINES.map((_, i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full transition-all"
                      style={{
                        background: i === introLine ? "rgba(51,226,230,0.8)" : "rgba(255,255,255,0.15)",
                        boxShadow: i === introLine ? "0 0 6px rgba(51,226,230,0.5)" : "none",
                      }}
                    />
                  ))}
                </div>

                <div className="flex justify-end gap-2">
                  {introLine > 0 && (
                    <button
                      onClick={() => setIntroLine(introLine - 1)}
                      className="px-4 py-2 rounded-md font-mono text-xs transition-all"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}
                    >
                      BACK
                    </button>
                  )}
                  {introLine < ELARA_INTRO_LINES.length - 1 ? (
                    <button
                      onClick={() => setIntroLine(introLine + 1)}
                      className="px-4 py-2 rounded-md font-mono text-xs transition-all flex items-center gap-1.5"
                      style={{
                        background: "rgba(51,226,230,0.1)",
                        border: "1px solid rgba(51,226,230,0.3)",
                        color: "var(--neon-cyan)",
                      }}
                    >
                      CONTINUE <ChevronRight size={12} />
                    </button>
                  ) : (
                    <button
                      onClick={() => setPhase("wallets")}
                      className="px-5 py-2 rounded-md font-mono text-xs transition-all flex items-center gap-2"
                      style={{
                        background: "rgba(168,85,247,0.15)",
                        border: "1px solid rgba(168,85,247,0.4)",
                        color: "#a855f7",
                        boxShadow: "0 0 12px rgba(168,85,247,0.2)",
                      }}
                    >
                      <Wallet size={14} /> BEGIN SCAN
                    </button>
                  )}
                  <button
                    onClick={() => setPhase("wallets")}
                    className="px-3 py-2 rounded-md font-mono text-[10px] transition-all"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    SKIP
                  </button>
                </div>
              </motion.div>
            )}

            {/* ═══ WALLETS PHASE — Link & Manage Wallets ═══ */}
            {phase === "wallets" && (
              <motion.div key="wallets" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {!isAuthenticated ? (
                  <div className="text-center py-8">
                    <Shield size={32} className="mx-auto mb-3 text-muted-foreground/40" />
                    <p className="font-mono text-sm text-muted-foreground mb-4">Authentication required to link wallets</p>
                    <a
                      href={getLoginUrl()}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md font-mono text-xs"
                      style={{ background: "rgba(51,226,230,0.1)", border: "1px solid rgba(51,226,230,0.3)", color: "var(--neon-cyan)" }}
                    >
                      <Shield size={14} /> LOG IN
                    </a>
                  </div>
                ) : (
                  <>
                    {/* Linked wallets list */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-3">
                        <p className="font-mono text-[10px] text-purple-400/70 tracking-[0.2em]">LINKED NEURAL PATHWAYS ({walletCount})</p>
                      </div>

                      {linkedWallets.isLoading ? (
                        <div className="flex items-center justify-center py-6">
                          <Loader2 size={20} className="animate-spin text-purple-400/50" />
                        </div>
                      ) : walletCount === 0 ? (
                        <div className="rounded-lg p-4 text-center" style={{
                          background: "rgba(168,85,247,0.05)",
                          border: "1px dashed rgba(168,85,247,0.2)",
                        }}>
                          <Wallet size={24} className="mx-auto mb-2 text-purple-400/30" />
                          <p className="font-mono text-xs text-muted-foreground/60">No wallets linked yet</p>
                          <p className="font-mono text-[10px] text-muted-foreground/40 mt-1">Connect your first wallet to begin scanning</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {linkedWallets.data?.map((w) => (
                            <div
                              key={w.walletAddress}
                              className="flex items-center justify-between rounded-md px-3 py-2.5"
                              style={{
                                background: "rgba(168,85,247,0.05)",
                                border: "1px solid rgba(168,85,247,0.15)",
                              }}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{
                                  background: "rgba(34,197,94,0.15)",
                                  border: "1px solid rgba(34,197,94,0.3)",
                                }}>
                                  <Check size={10} className="text-green-400" />
                                </div>
                                <div className="min-w-0">
                                  <p className="font-mono text-xs text-foreground/80 truncate">
                                    {w.walletAddress.slice(0, 6)}...{w.walletAddress.slice(-4)}
                                  </p>
                                  <p className="font-mono text-[9px] text-muted-foreground/40">
                                    Linked {w.linkedAt ? new Date(w.linkedAt).toLocaleDateString() : ""}
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => {
                                  if (confirm("Disconnect this wallet?")) {
                                    unlinkWallet.mutate({ walletAddress: w.walletAddress });
                                  }
                                }}
                                className="text-red-400/50 hover:text-red-400 transition-colors p-1"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Add wallet button */}
                    <button
                      onClick={connectAndLink}
                      disabled={isConnecting || isLinking}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-md font-mono text-xs transition-all mb-4"
                      style={{
                        background: isConnecting || isLinking ? "rgba(168,85,247,0.05)" : "rgba(168,85,247,0.1)",
                        border: `1px solid ${isConnecting || isLinking ? "rgba(168,85,247,0.1)" : "rgba(168,85,247,0.3)"}`,
                        color: isConnecting || isLinking ? "rgba(168,85,247,0.4)" : "#a855f7",
                      }}
                    >
                      {isConnecting || isLinking ? (
                        <><Loader2 size={14} className="animate-spin" /> {isLinking ? "SIGNING..." : "CONNECTING..."}</>
                      ) : (
                        <><Plus size={14} /> ADD ANOTHER WALLET</>
                      )}
                    </button>

                    {/* Scan button */}
                    {walletCount > 0 && (
                      <button
                        onClick={() => {
                          setPhase("scanning");
                          scanAll.refetch();
                        }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-md font-mono text-sm font-bold transition-all"
                        style={{
                          background: "linear-gradient(135deg, rgba(51,226,230,0.15), rgba(168,85,247,0.15))",
                          border: "1px solid rgba(51,226,230,0.4)",
                          color: "var(--neon-cyan)",
                          boxShadow: "0 0 20px rgba(51,226,230,0.15)",
                        }}
                      >
                        <Scan size={16} /> SCAN ALL WALLETS ({walletCount})
                      </button>
                    )}

                    <p className="font-mono text-[9px] text-muted-foreground/30 text-center mt-3">
                      You can keep adding wallets and scan them all at once. Each Potential's 1/1 card can only be claimed once.
                    </p>
                  </>
                )}
              </motion.div>
            )}

            {/* ═══ SCANNING PHASE ═══ */}
            {phase === "scanning" && (
              <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="text-center py-12">
                  <div className="relative w-20 h-20 mx-auto mb-6">
                    <div className="absolute inset-0 rounded-full animate-ping" style={{
                      border: "2px solid rgba(168,85,247,0.3)",
                      animationDuration: "2s",
                    }} />
                    <div className="absolute inset-2 rounded-full animate-ping" style={{
                      border: "1px solid rgba(51,226,230,0.3)",
                      animationDuration: "1.5s",
                    }} />
                    <div className="absolute inset-0 rounded-full flex items-center justify-center" style={{
                      background: "rgba(168,85,247,0.1)",
                      border: "2px solid rgba(168,85,247,0.4)",
                    }}>
                      <Scan size={28} className="text-purple-400 animate-pulse" />
                    </div>
                  </div>
                  <p className="font-display text-sm font-bold tracking-[0.15em] text-foreground mb-2">SCANNING NEURAL PATHWAYS</p>
                  <p className="font-mono text-xs text-muted-foreground/60">
                    Checking {walletCount} wallet{walletCount !== 1 ? "s" : ""} for Potential signatures...
                  </p>
                  <p className="font-mono text-[10px] text-purple-400/40 mt-2">This may take a moment for large collections</p>
                </div>
              </motion.div>
            )}

            {/* ═══ RESULTS PHASE ═══ */}
            {phase === "results" && (
              <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* Summary stats */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    { label: "WALLETS", value: walletCount, icon: Wallet, color: "purple" },
                    { label: "OWNED", value: totalOwned, icon: Shield, color: "cyan" },
                    { label: "UNCLAIMED", value: totalUnclaimed, icon: Sparkles, color: "amber" },
                  ].map((stat) => {
                    const Icon = stat.icon;
                    const colors = {
                      purple: { bg: "rgba(168,85,247,0.08)", border: "rgba(168,85,247,0.2)", text: "#a855f7" },
                      cyan: { bg: "rgba(51,226,230,0.08)", border: "rgba(51,226,230,0.2)", text: "var(--neon-cyan)" },
                      amber: { bg: "rgba(255,183,77,0.08)", border: "rgba(255,183,77,0.2)", text: "#ffb74d" },
                    }[stat.color]!;
                    return (
                      <div key={stat.label} className="rounded-md p-3 text-center" style={{ background: colors.bg, border: `1px solid ${colors.border}` }}>
                        <Icon size={16} className="mx-auto mb-1.5" style={{ color: colors.text }} />
                        <p className="font-display text-lg font-bold" style={{ color: colors.text }}>{stat.value}</p>
                        <p className="font-mono text-[8px] text-muted-foreground/40 tracking-wider">{stat.label}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Per-wallet breakdown */}
                {scanAll.data?.wallets && scanAll.data.wallets.length > 0 && (
                  <div className="space-y-2 mb-5">
                    {scanAll.data.wallets.map((w) => (
                      <div
                        key={w.walletAddress}
                        className="rounded-md px-3 py-2.5"
                        style={{
                          background: "rgba(255,255,255,0.02)",
                          border: "1px solid rgba(255,255,255,0.06)",
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Wallet size={12} className="text-purple-400/50" />
                            <span className="font-mono text-xs text-foreground/70">
                              {w.walletAddress.slice(0, 6)}...{w.walletAddress.slice(-4)}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-[10px] text-muted-foreground/40">
                              {w.ownedTokenIds.length} owned
                            </span>
                            {w.unclaimedTokenIds.length > 0 && (
                              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded" style={{
                                background: "rgba(255,183,77,0.1)",
                                color: "#ffb74d",
                              }}>
                                {w.unclaimedTokenIds.length} unclaimed
                              </span>
                            )}
                            {w.error && (
                              <span className="font-mono text-[10px] text-red-400/60 flex items-center gap-1">
                                <AlertTriangle size={10} /> Error
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Elara comment */}
                <div className="rounded-lg p-3 mb-5" style={{
                  background: "rgba(51,226,230,0.03)",
                  border: "1px solid rgba(51,226,230,0.1)",
                }}>
                  <p className="font-mono text-[10px] text-cyan-400/50 tracking-wider mb-1">ELARA</p>
                  <p className="font-mono text-xs text-foreground/70 leading-relaxed">
                    {totalUnclaimed > 0
                      ? `I've detected ${totalUnclaimed} unclaimed Potential${totalUnclaimed !== 1 ? "s" : ""} across your wallets. Their neural signatures are intact — I can extract their identity cards now. This is a one-time process. Once extracted, these cards are permanently yours.`
                      : totalOwned > 0
                      ? "All Potentials in your wallets have already been claimed. Their identity cards are in your collection. You can add more wallets if you have Potentials elsewhere."
                      : "I'm not detecting any Potential signatures in your linked wallets. If you've recently acquired Potentials, try adding the wallet they're stored in."
                    }
                  </p>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col gap-2">
                  {totalUnclaimed > 0 && (
                    <button
                      onClick={() => batchClaimAll.mutate()}
                      disabled={batchClaimAll.isPending}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-md font-mono text-sm font-bold transition-all"
                      style={{
                        background: batchClaimAll.isPending
                          ? "rgba(255,183,77,0.05)"
                          : "linear-gradient(135deg, rgba(255,183,77,0.15), rgba(168,85,247,0.15))",
                        border: `1px solid ${batchClaimAll.isPending ? "rgba(255,183,77,0.1)" : "rgba(255,183,77,0.4)"}`,
                        color: batchClaimAll.isPending ? "rgba(255,183,77,0.4)" : "#ffb74d",
                        boxShadow: batchClaimAll.isPending ? "none" : "0 0 20px rgba(255,183,77,0.15)",
                      }}
                    >
                      {batchClaimAll.isPending ? (
                        <><Loader2 size={16} className="animate-spin" /> EXTRACTING IDENTITY CARDS...</>
                      ) : (
                        <><Zap size={16} /> CLAIM ALL {totalUnclaimed} CARDS</>
                      )}
                    </button>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => setPhase("wallets")}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md font-mono text-xs transition-all"
                      style={{
                        background: "rgba(168,85,247,0.08)",
                        border: "1px solid rgba(168,85,247,0.2)",
                        color: "#a855f7",
                      }}
                    >
                      <Plus size={12} /> ADD MORE WALLETS
                    </button>
                    <button
                      onClick={() => {
                        setPhase("scanning");
                        scanAll.refetch();
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md font-mono text-xs transition-all"
                      style={{
                        background: "rgba(51,226,230,0.08)",
                        border: "1px solid rgba(51,226,230,0.2)",
                        color: "var(--neon-cyan)",
                      }}
                    >
                      <Scan size={12} /> RE-SCAN
                    </button>
                  </div>
                </div>

                {/* Batch claim results */}
                {batchClaimAll.data && batchClaimAll.data.claimed > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 rounded-lg p-3"
                    style={{
                      background: "rgba(34,197,94,0.05)",
                      border: "1px solid rgba(34,197,94,0.2)",
                    }}
                  >
                    <p className="font-mono text-xs text-green-400 flex items-center gap-2 mb-2">
                      <Check size={14} /> {batchClaimAll.data.claimed} identity cards extracted successfully!
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {batchClaimAll.data.results
                        .filter((r) => r.success)
                        .map((r) => (
                          <span
                            key={r.tokenId}
                            className="font-mono text-[9px] px-1.5 py-0.5 rounded"
                            style={{ background: "rgba(34,197,94,0.1)", color: "#22c55e" }}
                          >
                            #{r.tokenId}
                          </span>
                        ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
