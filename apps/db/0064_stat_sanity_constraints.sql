-- ─────────────────────────────────────────────────────────────────
-- Stat sanity — DB-enforced non-negativity on currency / score columns.
--
-- Defense-in-depth on top of the application-level conditional
-- UPDATEs added in G4. If any code path bypasses the routers
-- (admin scripts, future migrations, manual SQL), MySQL still
-- refuses to write a negative balance.
--
-- CHECK constraints are enforced from MySQL 8.0.16+. On older
-- versions they parse but don't enforce — harmless.
-- ─────────────────────────────────────────────────────────────────

ALTER TABLE `dream_balance`
  ADD CONSTRAINT `chk_dream_tokens_nonneg`
    CHECK (`dream_tokens` >= 0);
--> statement-breakpoint

ALTER TABLE `memory_energy_balance`
  ADD CONSTRAINT `chk_memory_energy_nonneg`
    CHECK (`memory_energy` >= 0);
--> statement-breakpoint

ALTER TABLE `memory_energy_balance`
  ADD CONSTRAINT `chk_memory_total_spent_nonneg`
    CHECK (`total_spent` >= 0);
--> statement-breakpoint

-- userProgress.level must never decrease. We can't enforce strict
-- monotonicity in a CHECK without a trigger; the >= 1 floor at
-- least catches accidental zero/negative writes.
ALTER TABLE `user_progress`
  ADD CONSTRAINT `chk_user_progress_level_floor`
    CHECK (`level` >= 1);
--> statement-breakpoint

ALTER TABLE `user_progress`
  ADD CONSTRAINT `chk_user_progress_xp_nonneg`
    CHECK (`xp` >= 0);
--> statement-breakpoint

ALTER TABLE `user_progress`
  ADD CONSTRAINT `chk_user_progress_points_nonneg`
    CHECK (`points` >= 0);
