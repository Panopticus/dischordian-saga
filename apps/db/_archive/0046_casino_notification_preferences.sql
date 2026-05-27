-- Phase: Casino notification preferences
--
-- Follow-up to 0045. Adds a per-user opt-out flag so heavy-
-- notification users can exclude themselves from the progressive
-- jackpot claim broadcast fanout.

ALTER TABLE `casino_state`
  ADD COLUMN `jackpotBroadcastOptOut` BOOLEAN NOT NULL DEFAULT FALSE;
