-- Phase: Per-type broadcast opt-out split
--
-- Follow-up to 0046. Adds a second boolean column so the player can
-- opt out of jackpot-claim broadcasts and Christmas milestone
-- broadcasts independently. Existing `jackpotBroadcastOptOut` is
-- preserved — the old column now only controls jackpot broadcasts
-- (that's the behaviour it was named for anyway).

ALTER TABLE `casino_state`
  ADD COLUMN `milestoneBroadcastOptOut` BOOLEAN NOT NULL DEFAULT FALSE;
