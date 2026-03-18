import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet, Link2, Unlink, Shield, Sparkles, Eye, ExternalLink,
  ChevronRight, AlertTriangle, Check, Loader2, X, Swords,
  Crown, Gem, Zap, Lock, Unlock, Copy, CheckCheck
} from "lucide-react";
import { toast } from "sonner";
import { BrowserProvider } from "ethers";

/* ═══════════════════════════════════════════════════════
   THE POTENTIALS — NFT Integration Page
   Connect wallet → Verify ownership → Claim 1/1 cards
   ═══════════════════════════════════════════════════════ */

const CONTRACT_ADDRESS = "0xfa511d5c4cce10321e6e86793cc083213c36278e";

// Trait-to-icon mapping for lore display
const CLASS_ICONS: Record<string, string> = {
  Spy: "🕵️",
  Oracle: "🔮",
  Assassin: "🗡️",
  Engineer: "⚙️",
  Soldier: "🎖️",
  "Ne-Yon": "✨",
};

const SPECIE_COLORS: Record<string, string> = {
  DeMagi: "text-blue-400",
  Quarchon: "text-purple-400",
  "Ne-Yon": "text-amber-400",
};

type ViewMode = "overview" | "wallet" | "gallery" | "my-claims";

export default function PotentialsPage() {
  const { user, isAuthenticated } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>("overview");
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedToken, setSelectedToken] = useState<number | null>(null);
  const [copiedAddress, setCopiedAddress] = useState(false);

  // tRPC queries
  const linkedWallets = trpc.nft.getLinkedWallets.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const collectionStats = trpc.nft.getCollectionStats.useQuery();
  const myClaims = trpc.nft.getMyClaims.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  // Ownership check (only when wallet is linked)
  const primaryWallet = linkedWallets.data?.[0]?.walletAddress;
  const ownership = trpc.nft.checkOwnership.useQuery(
    { walletAddress: primaryWallet || "" },
    { enabled: !!primaryWallet }
  );

  // Token metadata for selected token
  const tokenMetadata = trpc.nft.getTokenMetadata.useQuery(
    { tokenId: selectedToken ?? 0 },
    { enabled: selectedToken !== null }
  );

  // Claim status for selected token
  const claimStatus = trpc.nft.getClaimStatus.useQuery(
    { tokenId: selectedToken ?? 0 },
    { enabled: selectedToken !== null }
  );

  // Mutations
  const linkWallet = trpc.nft.linkWallet.useMutation({
    onSuccess: () => {
      toast.success("Wallet linked successfully!");
      linkedWallets.refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  const unlinkWallet = trpc.nft.unlinkWallet.useMutation({
    onSuccess: () => {
      toast.success("Wallet unlinked");
      linkedWallets.refetch();
      setWalletAddress(null);
    },
    onError: (err) => toast.error(err.message),
  });

  const claimCard = trpc.nft.claimCard.useMutation({
    onSuccess: (data) => {
      toast.success(`Claimed 1/1 card for ${data.name}!`);
      myClaims.refetch();
      claimStatus.refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  // Connect wallet via MetaMask/browser provider
  const connectWallet = useCallback(async () => {
    if (!(window as any).ethereum) {
      toast.error("No Ethereum wallet detected. Please install MetaMask.");
      return;
    }

    setIsConnecting(true);
    try {
      const provider = new BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setWalletAddress(address);
      toast.success(`Connected: ${address.slice(0, 6)}...${address.slice(-4)}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  }, []);

  // Sign message and link wallet
  const signAndLink = useCallback(async () => {
    if (!walletAddress || !isAuthenticated) return;

    try {
      const provider = new BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();

      const timestamp = Date.now();
      const message = `LOREDEX OS — Link Wallet\n\nI am linking wallet ${walletAddress} to my Loredex account.\n\nUser: ${user?.id}\nTimestamp: ${timestamp}\nChain: Ethereum`;

      const signature = await signer.signMessage(message);

      await linkWallet.mutateAsync({
        walletAddress,
        message,
        signature,
      });
    } catch (err: any) {
      if (err.code === "ACTION_REJECTED") {
        toast.error("Signature rejected by user");
      } else {
        toast.error(err.message || "Failed to link wallet");
      }
    }
  }, [walletAddress, isAuthenticated, user, linkWallet]);

  // Copy address helper
  const copyAddress = (addr: string) => {
    navigator.clipboard.writeText(addr);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const hasLinkedWallet = (linkedWallets.data?.length ?? 0) > 0;
  const ownedTokens = ownership.data?.ownedTokenIds || [];
  const claimedTokenIds = new Set((myClaims.data || []).map((c) => c.tokenId));

  return (
    <div className="min-h-screen pb-24">
      {/* ═══ HEADER ═══ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-background to-background" />
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="relative px-4 sm:px-6 pt-8 pb-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px flex-1 max-w-8 bg-gradient-to-r from-transparent to-purple-500/50" />
            <span className="font-mono text-[10px] text-purple-400/70 tracking-[0.3em]">
              ETHEREUM // CONTRACT {CONTRACT_ADDRESS.slice(0, 8)}...
            </span>
            <div className="h-px flex-1 max-w-8 bg-gradient-to-l from-transparent to-purple-500/50" />
          </div>

          <h1 className="font-display text-2xl sm:text-4xl font-black tracking-wider text-foreground mb-2">
            THE <span className="text-purple-400" style={{ textShadow: "0 0 20px rgba(168,85,247,0.5)" }}>POTENTIALS</span>
          </h1>
          <p className="font-mono text-xs sm:text-sm text-muted-foreground max-w-xl mb-5 leading-relaxed">
            1,000 unique operatives forged on the Ethereum blockchain. Connect your wallet to verify ownership
            and claim your exclusive <span className="text-purple-400">1/1 Loredex card</span> — each card can only be claimed once, forever.
          </p>

          {/* Stats bar */}
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-purple-500/10 border border-purple-500/20">
              <Gem size={14} className="text-purple-400" />
              <span className="font-mono text-xs text-purple-300">
                {collectionStats.data?.totalClaimed || 0} / 1,000 CLAIMED
              </span>
            </div>
            <a
              href={`https://opensea.io/collection/potentials-eth`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 rounded bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-colors"
            >
              <ExternalLink size={14} className="text-blue-400" />
              <span className="font-mono text-xs text-blue-300">OpenSea</span>
            </a>
            <a
              href={`https://etherscan.io/token/${CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 rounded bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 transition-colors"
            >
              <ExternalLink size={14} className="text-green-400" />
              <span className="font-mono text-xs text-green-300">Etherscan</span>
            </a>
          </div>

          {/* Navigation tabs */}
          <div className="flex gap-2 flex-wrap">
            {(
              [
                { key: "overview", label: "OVERVIEW", icon: Eye },
                { key: "wallet", label: "WALLET", icon: Wallet },
                { key: "gallery", label: "MY POTENTIALS", icon: Crown },
                { key: "my-claims", label: "CLAIMED CARDS", icon: Sparkles },
              ] as const
            ).map((tab) => {
              const Icon = tab.icon;
              const active = viewMode === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setViewMode(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md font-mono text-xs transition-all ${
                    active
                      ? "bg-purple-500/20 border border-purple-500/40 text-purple-300"
                      : "bg-secondary/50 border border-border/30 text-muted-foreground hover:text-foreground hover:border-purple-500/20"
                  }`}
                >
                  <Icon size={14} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div className="px-4 sm:px-6">
        <AnimatePresence mode="wait">
          {viewMode === "overview" && (
            <OverviewSection
              key="overview"
              stats={collectionStats.data}
              onNavigate={setViewMode}
              isAuthenticated={isAuthenticated}
            />
          )}
          {viewMode === "wallet" && (
            <WalletSection
              key="wallet"
              isAuthenticated={isAuthenticated}
              walletAddress={walletAddress}
              linkedWallets={linkedWallets.data || []}
              isConnecting={isConnecting}
              isLinking={linkWallet.isPending}
              onConnect={connectWallet}
              onLink={signAndLink}
              onUnlink={(addr) => unlinkWallet.mutate({ walletAddress: addr })}
              onCopy={copyAddress}
              copiedAddress={copiedAddress}
            />
          )}
          {viewMode === "gallery" && (
            <GallerySection
              key="gallery"
              isAuthenticated={isAuthenticated}
              hasLinkedWallet={hasLinkedWallet}
              ownedTokens={ownedTokens}
              claimedTokenIds={claimedTokenIds}
              isLoading={ownership.isLoading}
              selectedToken={selectedToken}
              onSelectToken={setSelectedToken}
              tokenMetadata={tokenMetadata.data}
              claimStatus={claimStatus.data}
              onClaim={(tokenId) => {
                if (primaryWallet) {
                  claimCard.mutate({ tokenId, walletAddress: primaryWallet });
                }
              }}
              isClaiming={claimCard.isPending}
              onNavigate={setViewMode}
            />
          )}
          {viewMode === "my-claims" && (
            <ClaimsSection
              key="claims"
              claims={myClaims.data || []}
              isLoading={myClaims.isLoading}
              isAuthenticated={isAuthenticated}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   OVERVIEW SECTION
   ═══════════════════════════════════════════════════════ */
function OverviewSection({
  stats,
  onNavigate,
  isAuthenticated,
}: {
  stats: any;
  onNavigate: (v: ViewMode) => void;
  isAuthenticated: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Lore intro */}
      <div className="border border-purple-500/20 rounded-lg bg-purple-500/5 p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-3">
          <Shield size={16} className="text-purple-400" />
          <span className="font-display text-xs font-bold tracking-[0.2em] text-purple-300">
            CLASSIFIED BRIEFING
          </span>
        </div>
        <div className="font-mono text-sm text-muted-foreground leading-relaxed space-y-3">
          <p>
            The <span className="text-purple-400">Potentials</span> are 1,000 unique operatives whose genetic code
            and neural patterns were harvested by <span className="text-foreground">The Collector</span> — preserved
            as living data on the Ethereum blockchain.
          </p>
          <p>
            Each Potential carries a unique combination of <span className="text-primary">Class</span>,{" "}
            <span className="text-accent">Weapon</span>, <span className="text-destructive">Species</span>, and{" "}
            <span className="text-chart-4">Background</span> — traits that define their role in the Dischordian Saga.
          </p>
          <p>
            If you hold a Potential in your Ethereum wallet, you can claim a{" "}
            <span className="text-purple-400 font-bold">unique 1/1 Loredex card</span> — a permanent record of your
            operative's identity. This card can only be claimed <span className="text-foreground font-bold">once</span>.
            Even if the NFT changes hands, the card remains with its original claimer.
          </p>
        </div>
      </div>

      {/* How it works */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          {
            step: "01",
            title: "CONNECT WALLET",
            desc: "Link your Ethereum wallet to verify your identity on-chain.",
            icon: Wallet,
            color: "text-blue-400",
            border: "border-blue-500/20",
            bg: "bg-blue-500/5",
          },
          {
            step: "02",
            title: "VERIFY OWNERSHIP",
            desc: "We check the blockchain to confirm which Potentials you hold.",
            icon: Shield,
            color: "text-green-400",
            border: "border-green-500/20",
            bg: "bg-green-500/5",
          },
          {
            step: "03",
            title: "CLAIM 1/1 CARD",
            desc: "Mint your unique Loredex card — one per Potential, forever.",
            icon: Sparkles,
            color: "text-purple-400",
            border: "border-purple-500/20",
            bg: "bg-purple-500/5",
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.step}
              className={`rounded-lg border ${item.border} ${item.bg} p-4`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="font-display text-lg font-black text-muted-foreground/30">
                  {item.step}
                </span>
                <Icon size={16} className={item.color} />
              </div>
              <h3 className="font-display text-xs font-bold tracking-wider text-foreground mb-1">
                {item.title}
              </h3>
              <p className="font-mono text-[11px] text-muted-foreground leading-relaxed">
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Arena Perks */}
      <div className="border border-amber-500/20 rounded-lg bg-amber-500/5 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Swords size={16} className="text-amber-400" />
          <span className="font-display text-xs font-bold tracking-[0.2em] text-amber-300">
            ARENA PERKS
          </span>
        </div>
        <div className="font-mono text-sm text-muted-foreground leading-relaxed space-y-2">
          <p>
            Potentials holders receive exclusive perks in <span className="text-amber-400">The Collector's Arena</span>:
          </p>
          <ul className="space-y-1 ml-4">
            <li className="flex items-center gap-2">
              <Zap size={12} className="text-amber-400" />
              <span><span className="text-foreground">+25% bonus fight points</span> per claimed Potential (up to +125%)</span>
            </li>
            <li className="flex items-center gap-2">
              <Crown size={12} className="text-purple-400" />
              <span>Exclusive <span className="text-purple-400">Collector's Champion</span> title displayed in arena</span>
            </li>
            <li className="flex items-center gap-2">
              <Gem size={12} className="text-cyan-400" />
              <span>Unique <span className="text-cyan-400">1/1 holographic cards</span> with your Potential's art and traits</span>
            </li>
          </ul>
        </div>
      </div>

      {/* CTA */}
      <div className="flex gap-3">
        <button
          onClick={() => onNavigate("wallet")}
          className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-purple-500/15 border border-purple-500/40 text-purple-300 font-mono text-sm hover:bg-purple-500/25 transition-all"
        >
          <Wallet size={16} />
          {isAuthenticated ? "CONNECT WALLET" : "LOGIN TO START"}
          <ChevronRight size={14} />
        </button>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   WALLET SECTION
   ═══════════════════════════════════════════════════════ */
function WalletSection({
  isAuthenticated,
  walletAddress,
  linkedWallets,
  isConnecting,
  isLinking,
  onConnect,
  onLink,
  onUnlink,
  onCopy,
  copiedAddress,
}: {
  isAuthenticated: boolean;
  walletAddress: string | null;
  linkedWallets: Array<{ walletAddress: string; chain: string; linkedAt: Date }>;
  isConnecting: boolean;
  isLinking: boolean;
  onConnect: () => void;
  onLink: () => void;
  onUnlink: (addr: string) => void;
  onCopy: (addr: string) => void;
  copiedAddress: boolean;
}) {
  if (!isAuthenticated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="flex flex-col items-center justify-center py-16 gap-4"
      >
        <Lock size={48} className="text-muted-foreground/30" />
        <p className="font-mono text-sm text-muted-foreground">
          Login to your Loredex account to link your wallet
        </p>
        <a
          href={getLoginUrl()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary/15 border border-primary/40 text-primary font-mono text-sm hover:bg-primary/25 transition-all"
        >
          LOGIN TO LOREDEX
        </a>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Linked wallets */}
      {linkedWallets.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-display text-xs font-bold tracking-[0.2em] text-foreground flex items-center gap-2">
            <Link2 size={14} className="text-green-400" />
            LINKED WALLETS
          </h3>
          {linkedWallets.map((w) => (
            <div
              key={w.walletAddress}
              className="flex items-center justify-between p-3 rounded-lg border border-green-500/20 bg-green-500/5"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Check size={14} className="text-green-400" />
                </div>
                <div>
                  <p className="font-mono text-xs text-foreground">
                    {w.walletAddress.slice(0, 6)}...{w.walletAddress.slice(-4)}
                  </p>
                  <p className="font-mono text-[10px] text-muted-foreground">
                    {w.chain} · linked {new Date(w.linkedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onCopy(w.walletAddress)}
                  className="p-1.5 rounded hover:bg-secondary transition-colors"
                  title="Copy address"
                >
                  {copiedAddress ? (
                    <CheckCheck size={14} className="text-green-400" />
                  ) : (
                    <Copy size={14} className="text-muted-foreground" />
                  )}
                </button>
                <button
                  onClick={() => onUnlink(w.walletAddress)}
                  className="p-1.5 rounded hover:bg-destructive/20 transition-colors"
                  title="Unlink wallet"
                >
                  <Unlink size={14} className="text-destructive" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Connect new wallet */}
      <div className="border border-border/30 rounded-lg bg-card/30 p-5">
        <h3 className="font-display text-xs font-bold tracking-[0.2em] text-foreground mb-3 flex items-center gap-2">
          <Wallet size={14} className="text-purple-400" />
          {linkedWallets.length > 0 ? "LINK ANOTHER WALLET" : "CONNECT YOUR WALLET"}
        </h3>

        {!walletAddress ? (
          <div className="space-y-3">
            <p className="font-mono text-xs text-muted-foreground leading-relaxed">
              Connect your Ethereum wallet to verify Potentials ownership. We'll ask you to sign a
              message (no gas cost) to prove you control the address.
            </p>
            <button
              onClick={onConnect}
              disabled={isConnecting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-purple-500/15 border border-purple-500/40 text-purple-300 font-mono text-sm hover:bg-purple-500/25 transition-all disabled:opacity-50"
            >
              {isConnecting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Wallet size={16} />
              )}
              {isConnecting ? "CONNECTING..." : "CONNECT METAMASK"}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-3 rounded bg-secondary/50 border border-border/30">
              <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Wallet size={12} className="text-purple-400" />
              </div>
              <span className="font-mono text-xs text-foreground">
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </span>
              <span className="font-mono text-[10px] text-green-400 ml-auto">CONNECTED</span>
            </div>

            {/* Check if already linked */}
            {linkedWallets.some(
              (w) => w.walletAddress.toLowerCase() === walletAddress.toLowerCase()
            ) ? (
              <div className="flex items-center gap-2 text-green-400 font-mono text-xs">
                <Check size={14} />
                This wallet is already linked to your account
              </div>
            ) : (
              <button
                onClick={onLink}
                disabled={isLinking}
                className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-green-500/15 border border-green-500/40 text-green-300 font-mono text-sm hover:bg-green-500/25 transition-all disabled:opacity-50"
              >
                {isLinking ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Link2 size={16} />
                )}
                {isLinking ? "SIGNING..." : "SIGN & LINK WALLET"}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Warning */}
      <div className="flex items-start gap-3 p-3 rounded-lg border border-amber-500/20 bg-amber-500/5">
        <AlertTriangle size={16} className="text-amber-400 mt-0.5 shrink-0" />
        <p className="font-mono text-[11px] text-amber-300/80 leading-relaxed">
          Wallet linking only verifies ownership — we never request transaction approvals or access
          to your funds. The signature is a free, gasless proof of identity.
        </p>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   GALLERY SECTION — Shows owned Potentials
   ═══════════════════════════════════════════════════════ */
function GallerySection({
  isAuthenticated,
  hasLinkedWallet,
  ownedTokens,
  claimedTokenIds,
  isLoading,
  selectedToken,
  onSelectToken,
  tokenMetadata,
  claimStatus,
  onClaim,
  isClaiming,
  onNavigate,
}: {
  isAuthenticated: boolean;
  hasLinkedWallet: boolean;
  ownedTokens: number[];
  claimedTokenIds: Set<number>;
  isLoading: boolean;
  selectedToken: number | null;
  onSelectToken: (id: number | null) => void;
  tokenMetadata: any;
  claimStatus: any;
  onClaim: (tokenId: number) => void;
  isClaiming: boolean;
  onNavigate: (v: ViewMode) => void;
}) {
  if (!isAuthenticated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="flex flex-col items-center justify-center py-16 gap-4"
      >
        <Lock size={48} className="text-muted-foreground/30" />
        <p className="font-mono text-sm text-muted-foreground">Login to view your Potentials</p>
      </motion.div>
    );
  }

  if (!hasLinkedWallet) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="flex flex-col items-center justify-center py-16 gap-4"
      >
        <Wallet size={48} className="text-muted-foreground/30" />
        <p className="font-mono text-sm text-muted-foreground">
          Link your wallet first to check ownership
        </p>
        <button
          onClick={() => onNavigate("wallet")}
          className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-purple-500/15 border border-purple-500/40 text-purple-300 font-mono text-sm"
        >
          <Wallet size={16} />
          GO TO WALLET
        </button>
      </motion.div>
    );
  }

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="flex flex-col items-center justify-center py-16 gap-4"
      >
        <Loader2 size={32} className="text-purple-400 animate-spin" />
        <p className="font-mono text-sm text-muted-foreground">
          Scanning blockchain for your Potentials...
        </p>
      </motion.div>
    );
  }

  if (ownedTokens.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="flex flex-col items-center justify-center py-16 gap-4"
      >
        <Gem size={48} className="text-muted-foreground/30" />
        <p className="font-mono text-sm text-muted-foreground">
          No Potentials found in your linked wallet
        </p>
        <a
          href="https://opensea.io/collection/potentials-eth"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-blue-500/15 border border-blue-500/40 text-blue-300 font-mono text-sm"
        >
          <ExternalLink size={16} />
          BROWSE ON OPENSEA
        </a>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-display text-xs font-bold tracking-[0.2em] text-foreground flex items-center gap-2">
          <Crown size={14} className="text-purple-400" />
          YOUR POTENTIALS ({ownedTokens.length})
        </h3>
      </div>

      {/* Token grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {ownedTokens.map((tokenId) => {
          const isClaimed = claimedTokenIds.has(tokenId);
          const isSelected = selectedToken === tokenId;
          return (
            <button
              key={tokenId}
              onClick={() => onSelectToken(isSelected ? null : tokenId)}
              className={`relative rounded-lg border overflow-hidden text-left transition-all ${
                isSelected
                  ? "border-purple-500/60 ring-1 ring-purple-500/30"
                  : isClaimed
                  ? "border-green-500/30 hover:border-green-500/50"
                  : "border-border/30 hover:border-purple-500/40"
              }`}
            >
              <div className="aspect-square bg-secondary/30 flex items-center justify-center">
                <span className="font-display text-2xl font-black text-muted-foreground/20">
                  #{tokenId}
                </span>
              </div>
              <div className="p-2">
                <p className="font-mono text-xs font-semibold truncate">Potential #{tokenId}</p>
                <p className="font-mono text-[10px] text-muted-foreground">
                  {isClaimed ? (
                    <span className="text-green-400">✓ CLAIMED</span>
                  ) : (
                    <span className="text-purple-400">UNCLAIMED</span>
                  )}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected token detail */}
      <AnimatePresence>
        {selectedToken !== null && (
          <TokenDetailPanel
            tokenId={selectedToken}
            metadata={tokenMetadata}
            claimStatus={claimStatus}
            onClaim={() => onClaim(selectedToken)}
            isClaiming={isClaiming}
            onClose={() => onSelectToken(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   TOKEN DETAIL PANEL
   ═══════════════════════════════════════════════════════ */
function TokenDetailPanel({
  tokenId,
  metadata,
  claimStatus,
  onClaim,
  isClaiming,
  onClose,
}: {
  tokenId: number;
  metadata: any;
  claimStatus: any;
  onClaim: () => void;
  isClaiming: boolean;
  onClose: () => void;
}) {
  const isClaimed = claimStatus?.claimed;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="border border-purple-500/30 rounded-lg bg-card/50 overflow-hidden"
    >
      <div className="flex items-center justify-between p-4 border-b border-border/20">
        <h3 className="font-display text-sm font-bold tracking-wider text-foreground">
          {metadata?.name || `Potential #${tokenId}`}
        </h3>
        <button onClick={onClose} className="p-1 rounded hover:bg-secondary transition-colors">
          <X size={16} className="text-muted-foreground" />
        </button>
      </div>

      <div className="p-4 flex flex-col sm:flex-row gap-4">
        {/* Image */}
        <div className="w-full sm:w-48 shrink-0">
          {metadata?.imageUrl ? (
            <img
              src={metadata.imageUrl}
              alt={metadata.name}
              className="w-full aspect-square object-contain rounded-lg border border-border/20"
            />
          ) : (
            <div className="w-full aspect-square bg-secondary/30 rounded-lg flex items-center justify-center">
              <Loader2 size={24} className="text-muted-foreground animate-spin" />
            </div>
          )}
        </div>

        {/* Metadata */}
        <div className="flex-1 space-y-3">
          {/* Traits grid */}
          {metadata?.attributes && (
            <div className="grid grid-cols-2 gap-2">
              {(metadata.attributes as Array<{ trait_type: string; value: string | number }>)
                .slice(0, 10)
                .map((attr: { trait_type: string; value: string | number }) => (
                  <div
                    key={attr.trait_type}
                    className="p-2 rounded bg-secondary/30 border border-border/20"
                  >
                    <p className="font-mono text-[9px] text-muted-foreground/60 tracking-wider uppercase">
                      {attr.trait_type}
                    </p>
                    <p className="font-mono text-xs text-foreground truncate">
                      {CLASS_ICONS[String(attr.value)] || ""} {String(attr.value)}
                    </p>
                  </div>
                ))}
            </div>
          )}

          {/* Lore flavor text */}
          {metadata && (
            <div className="p-3 rounded bg-purple-500/5 border border-purple-500/15">
              <p className="font-mono text-[11px] text-purple-300/80 italic leading-relaxed">
                "From the Collector's vault — a {metadata.specie || "being"} of the{" "}
                {metadata.nftClass || "unknown"} class, wielding{" "}
                {metadata.weapon || "unknown power"}, forged in the{" "}
                {metadata.background || "void"}."
              </p>
            </div>
          )}

          {/* Claim button */}
          {isClaimed ? (
            <div className="flex items-center gap-2 p-3 rounded bg-green-500/10 border border-green-500/20">
              <Check size={16} className="text-green-400" />
              <div>
                <p className="font-mono text-xs text-green-300 font-bold">1/1 CARD CLAIMED</p>
                <p className="font-mono text-[10px] text-muted-foreground">
                  Claimed on {new Date(claimStatus.claimedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ) : (
            <button
              onClick={onClaim}
              disabled={isClaiming}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-md bg-purple-500/20 border border-purple-500/50 text-purple-200 font-mono text-sm font-bold hover:bg-purple-500/30 transition-all disabled:opacity-50"
            >
              {isClaiming ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  CLAIMING...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  CLAIM 1/1 CARD
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   CLAIMS SECTION — Shows claimed 1/1 cards
   ═══════════════════════════════════════════════════════ */
function ClaimsSection({
  claims,
  isLoading,
  isAuthenticated,
}: {
  claims: Array<{
    tokenId: number;
    cardId: string | null;
    cardImageUrl: string | null;
    claimedAt: Date;
    metadata: Record<string, unknown> | null;
  }>;
  isLoading: boolean;
  isAuthenticated: boolean;
}) {
  if (!isAuthenticated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="flex flex-col items-center justify-center py-16 gap-4"
      >
        <Lock size={48} className="text-muted-foreground/30" />
        <p className="font-mono text-sm text-muted-foreground">Login to view your claimed cards</p>
      </motion.div>
    );
  }

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="flex items-center justify-center py-16"
      >
        <Loader2 size={32} className="text-purple-400 animate-spin" />
      </motion.div>
    );
  }

  if (claims.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="flex flex-col items-center justify-center py-16 gap-4"
      >
        <Sparkles size={48} className="text-muted-foreground/30" />
        <p className="font-mono text-sm text-muted-foreground">
          No cards claimed yet. Own a Potential? Go to My Potentials to claim!
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      <h3 className="font-display text-xs font-bold tracking-[0.2em] text-foreground flex items-center gap-2">
        <Sparkles size={14} className="text-purple-400" />
        YOUR 1/1 CARDS ({claims.length})
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {claims.map((claim) => {
          const meta = claim.metadata as any;
          return (
            <div
              key={claim.tokenId}
              className="rounded-lg border border-purple-500/30 bg-purple-500/5 overflow-hidden"
            >
              {claim.cardImageUrl ? (
                <img
                  src={claim.cardImageUrl}
                  alt={meta?.name || `Potential #${claim.tokenId}`}
                  className="w-full aspect-square object-contain"
                />
              ) : (
                <div className="w-full aspect-square bg-secondary/30 flex items-center justify-center">
                  <Gem size={32} className="text-purple-400/30" />
                </div>
              )}
              <div className="p-3">
                <p className="font-mono text-xs font-bold text-foreground truncate">
                  {meta?.name || `Potential #${claim.tokenId}`}
                </p>
                <p className="font-mono text-[10px] text-purple-400">1/1 UNIQUE CARD</p>
                <p className="font-mono text-[9px] text-muted-foreground mt-1">
                  Claimed {new Date(claim.claimedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
