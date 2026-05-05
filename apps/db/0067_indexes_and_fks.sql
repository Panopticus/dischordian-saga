-- ─────────────────────────────────────────────────────────────────
-- G16/G17 — high-value composite indexes + FKs on new tables.
--
-- Scope: indexes that cover the dominant query patterns flagged by
-- the system audit, and foreign-key constraints on the brand-new
-- tables added in G8/G14/G15 (userAgreements, userTwoFactor,
-- userSessions) where orphan-row risk is zero.
--
-- A separate, dedicated PR will add FKs across the historical
-- schema after each table is verified orphan-free. That work is
-- tracked in docs/operations/SCHEMA_FK_AUDIT.md.
-- ─────────────────────────────────────────────────────────────────

-- ─── Composite indexes ─────────────────────────────────────────

-- pvp_leaderboard sandbagging detection joins on (peak_elo - elo,
-- last_match_at). The (last_match_at) index speeds the time-windowed
-- scan; the heuristic is too dynamic for a covering index, so we
-- accept the row-by-row evaluation of the peak/elo math.
ALTER TABLE `pvp_leaderboard`
  ADD INDEX IF NOT EXISTS `idx_pvp_lb_last_match_at` (`last_match_at`);

-- card_trades collusion detection groups by (buyer, seller). A
-- composite makes the GROUP BY index-only.
ALTER TABLE `card_trades`
  ADD INDEX IF NOT EXISTS `idx_card_trades_pair`
    (`buyer_user_id`, `seller_user_id`, `created_at`);

-- crafting_log queries from the user dashboard pull the last N
-- crafts per user.
ALTER TABLE `crafting_log`
  ADD INDEX IF NOT EXISTS `idx_crafting_log_user_created`
    (`user_id`, `created_at`);

-- analytics_events: dashboard groups by event name within a time
-- window — composite on (event_name, created_at).
ALTER TABLE `analytics_events`
  ADD INDEX IF NOT EXISTS `idx_analytics_events_name_created`
    (`event_name`, `created_at`);

-- ─── Foreign keys on new tables ────────────────────────────────

-- user_agreements (migration 0063)
ALTER TABLE `user_agreements`
  ADD CONSTRAINT `fk_user_agreements_user`
    FOREIGN KEY (`userId`) REFERENCES `users`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE;

-- user_two_factor (migration 0065)
ALTER TABLE `user_two_factor`
  ADD CONSTRAINT `fk_user_two_factor_user`
    FOREIGN KEY (`userId`) REFERENCES `users`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE;

-- user_sessions (migration 0066)
ALTER TABLE `user_sessions`
  ADD CONSTRAINT `fk_user_sessions_user`
    FOREIGN KEY (`userId`) REFERENCES `users`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE;
