// audit-allow-procs: all
/* ═══════════════════════════════════════════════════════
   LOREDEX CARRY ROUTER

   Reads + mutates the per-member loredex carry table:

     - getMemorialOnly()
         lists every entry whose carrier(s) are dead with the
         entry unread. Used by the Memorial Wall surface to
         render "took N entries with them" prose.

     - markRead({ entryId })
         flips read=1 for every carry row this user owns of
         the given entry. Called by the loredex reader UI on
         entry-open.
   ═══════════════════════════════════════════════════════ */

import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import {
  listMemorialOnly,
  markRead,
} from "../services/crewLoredexCarryService";

export const loredexCarryRouter = router({
  getMemorialOnly: protectedProcedure.query(async ({ ctx }) => {
    const rows = await listMemorialOnly(ctx.user.id);
    // Group by deceasedMemberKey for the UI's "Took X entries with them"
    // prose. Each group keeps the list of entry ids so the UI can link
    // to the entry texts.
    const byMember = new Map<string, {
      memberKey: string;
      memorialAtCycle: number;
      entries: string[];
    }>();
    for (const r of rows) {
      const existing = byMember.get(r.deceasedMemberKey);
      if (existing) {
        existing.entries.push(r.loredexEntryId);
      } else {
        byMember.set(r.deceasedMemberKey, {
          memberKey: r.deceasedMemberKey,
          memorialAtCycle: r.memorialAtCycle,
          entries: [r.loredexEntryId],
        });
      }
    }
    return Array.from(byMember.values());
  }),

  markRead: protectedProcedure
    .input(z.object({ entryId: z.string().min(1).max(96) }))
    .mutation(async ({ ctx, input }) => {
      const updated = await markRead(ctx.user.id, input.entryId);
      return { ok: true, updated };
    }),
});
