/* ═══════════════════════════════════════════════════════
   SOCIAL PAGE — Friends, DMs, pending requests
   ═══════════════════════════════════════════════════════ */
import { trpc } from "@/lib/trpc";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "wouter";
import {
  ChevronLeft, Users, MessageCircle, UserPlus, Check,
  X, Send, Clock, ChevronRight, Inbox
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Tab = "friends" | "messages" | "requests";

export default function SocialPage() {
  const [tab, setTab] = useState<Tab>("friends");
  const [friendIdInput, setFriendIdInput] = useState("");
  const [selectedConvoId, setSelectedConvoId] = useState<number | null>(null);
  const [messageText, setMessageText] = useState("");

  const { data: friends, isLoading, refetch: refetchFriends } = trpc.social.getMyFriends.useQuery();
  const { data: pending } = trpc.social.getPendingRequests.useQuery();
  const { data: inbox } = trpc.social.getInbox.useQuery(undefined, { enabled: tab === "messages" });
  const { data: conversation } = trpc.social.getConversation.useQuery(
    { otherUserId: selectedConvoId! },
    { enabled: !!selectedConvoId }
  );

  const sendRequestMut = trpc.social.sendFriendRequest.useMutation({
    onSuccess: () => { toast.success("Friend request sent!"); setFriendIdInput(""); },
    onError: (e: any) => toast.error(e.message),
  });
  const acceptMut = trpc.social.acceptFriendRequest.useMutation({
    onSuccess: () => { toast.success("Friend request accepted!"); refetchFriends(); },
    onError: (e: any) => toast.error(e.message),
  });
  const sendMsgMut = trpc.social.sendMessage.useMutation({
    onSuccess: () => { toast.success("Message sent!"); setMessageText(""); },
    onError: (e: any) => toast.error(e.message),
  });

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
          <Users size={18} className="text-primary" />
          <h1 className="font-display text-sm font-bold tracking-[0.15em]">SOCIAL</h1>
          {pending && pending.length > 0 && (
            <span className="ml-auto px-2 py-0.5 rounded-full bg-destructive/20 text-destructive text-[10px] font-mono">
              {pending.length} pending
            </span>
          )}
        </div>
        <div className="px-4 sm:px-6 flex gap-1 pb-2">
          {(["friends", "messages", "requests"] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${
                tab === t ? "bg-primary/20 text-primary border border-primary/30" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 sm:px-6 pt-4 space-y-4">
        {tab === "friends" && (
          <>
            {/* Add friend */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter user ID to add..."
                value={friendIdInput}
                onChange={(e) => setFriendIdInput(e.target.value)}
                className="flex-1 px-3 py-2 rounded-md bg-card/30 border border-border/30 font-mono text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50"
              />
              <Button
                size="sm"
                onClick={() => {
                  if (!friendIdInput || isNaN(Number(friendIdInput))) {
                    toast.error("Enter a valid user ID");
                    return;
                  }
                  sendRequestMut.mutate({ targetUserId: Number(friendIdInput) });
                }}
                disabled={sendRequestMut.isPending}
              >
                <UserPlus size={12} className="mr-1" /> Add
              </Button>
            </div>

            {/* Friends list */}
            {friends && friends.length > 0 ? (
              <div className="space-y-2">
                {friends.map((f: any, i: number) => (
                  <motion.div
                    key={f.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="rounded-lg border border-border/30 bg-card/30 p-3 flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users size={14} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-xs font-semibold">Player #{f.userId === f.user1Id ? f.user2Id : f.user1Id}</p>
                      <p className="font-mono text-[10px] text-muted-foreground">
                        Friends since {new Date(f.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedConvoId(f.userId === f.user1Id ? f.user2Id : f.user1Id);
                        setTab("messages");
                      }}
                    >
                      <MessageCircle size={12} />
                    </Button>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users size={48} className="mx-auto text-muted-foreground/20 mb-4" />
                <p className="font-mono text-sm text-muted-foreground">No friends yet</p>
                <p className="font-mono text-xs text-muted-foreground/60 mt-1">Add friends by entering their user ID above</p>
              </div>
            )}
          </>
        )}

        {tab === "messages" && (
          <div className="space-y-3">
            {selectedConvoId ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <div className="flex items-center gap-2">
                  <button onClick={() => setSelectedConvoId(null)} className="text-muted-foreground hover:text-primary">
                    <ChevronLeft size={16} />
                  </button>
                  <p className="font-mono text-xs font-semibold">Conversation with Player #{selectedConvoId}</p>
                </div>

                {/* Messages */}
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {conversation?.map((msg: any, i: number) => (
                    <div
                      key={msg.id}
                      className={`rounded-lg p-2.5 max-w-[80%] ${
                        msg.senderId === selectedConvoId
                          ? "bg-muted/10 mr-auto"
                          : "bg-primary/10 ml-auto"
                      }`}
                    >
                      <p className="font-mono text-xs">{msg.content}</p>
                      <p className="font-mono text-[9px] text-muted-foreground/60 mt-1">
                        {new Date(msg.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Send message */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && messageText.trim()) {
                        sendMsgMut.mutate({ recipientId: selectedConvoId, content: messageText });
                      }
                    }}
                    className="flex-1 px-3 py-2 rounded-md bg-card/30 border border-border/30 font-mono text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50"
                  />
                  <Button
                    size="sm"
                    onClick={() => {
                      if (messageText.trim()) {
                        sendMsgMut.mutate({ recipientId: selectedConvoId, content: messageText });
                      }
                    }}
                    disabled={sendMsgMut.isPending || !messageText.trim()}
                  >
                    <Send size={12} />
                  </Button>
                </div>
              </motion.div>
            ) : (
              <>
                {inbox && inbox.length > 0 ? (
                  inbox.map((msg: any, i: number) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      onClick={() => setSelectedConvoId(msg.senderId)}
                      className="rounded-lg border border-border/30 bg-card/30 p-3 flex items-center gap-3 cursor-pointer hover:border-primary/30 transition-all"
                    >
                      <MessageCircle size={14} className={msg.read ? "text-muted-foreground" : "text-primary"} />
                      <div className="flex-1 min-w-0">
                        <p className="font-mono text-xs font-semibold">Player #{msg.senderId}</p>
                        <p className="font-mono text-[10px] text-muted-foreground truncate">{msg.content}</p>
                      </div>
                      <ChevronRight size={14} className="text-muted-foreground/40" />
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Inbox size={48} className="mx-auto text-muted-foreground/20 mb-4" />
                    <p className="font-mono text-sm text-muted-foreground">No messages yet</p>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {tab === "requests" && (
          <div className="space-y-2">
            {pending && pending.length > 0 ? (
              pending.map((req: any, i: number) => (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="rounded-lg border border-accent/20 bg-card/30 p-3 flex items-center gap-3"
                >
                  <UserPlus size={14} className="text-accent" />
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-xs font-semibold">Player #{req.user1Id}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">
                      Sent {new Date(req.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      onClick={() => acceptMut.mutate({ friendshipId: req.id })}
                      disabled={acceptMut.isPending}
                    >
                      <Check size={12} />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => toast.info("Feature coming soon")}>
                      <X size={12} />
                    </Button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12">
                <Clock size={48} className="mx-auto text-muted-foreground/20 mb-4" />
                <p className="font-mono text-sm text-muted-foreground">No pending requests</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
