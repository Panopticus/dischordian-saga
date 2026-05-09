/* ═══════════════════════════════════════════════════════
   MEMORIAL-ONLY BADGE — surfaced on loredex entries that
   are gated to the Memorial Wall (the carrier died with
   them unread).

   The carry table stamps memorialAtCycle on the unread
   rows when the carrier dies. This badge tells the player
   the entry is part of someone's last unread record.
   ═══════════════════════════════════════════════════════ */

import { Skull } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Props {
  /** Memberkey of the carrier whose death sealed the entry. */
  deceasedMemberKey: string;
  /** Cycle the carrier died on. */
  deathCycle: number;
  /** Optional display name resolution callback. */
  resolveName?: (memberKey: string) => string | null;
}

export default function MemorialOnlyBadge(props: Props) {
  const display = props.resolveName?.(props.deceasedMemberKey) ?? props.deceasedMemberKey;
  return (
    <Badge variant="outline" className="gap-1 text-xs">
      <Skull className="w-3 h-3" />
      <span>
        Memorial — carried by {display} (cycle {props.deathCycle})
      </span>
    </Badge>
  );
}
