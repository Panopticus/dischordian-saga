-- Epoch Witness System — Batch T
-- Additive only. No drops.

CREATE TABLE IF NOT EXISTS epoch_votes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  vote_id VARCHAR(50) NOT NULL,
  epoch VARCHAR(50) NOT NULL,
  user_id INT NOT NULL,
  option_chosen VARCHAR(10) NOT NULL,
  voted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  archetype_at_time VARCHAR(50) NULL,
  UNIQUE KEY uniq_epoch_vote (vote_id, user_id),
  INDEX idx_epoch_vote_id (vote_id),
  INDEX idx_epoch_user (user_id)
);

CREATE TABLE IF NOT EXISTS epoch_vote_tallies (
  vote_id VARCHAR(50) PRIMARY KEY,
  option_a_count INT DEFAULT 0,
  option_b_count INT DEFAULT 0,
  option_c_count INT DEFAULT 0,
  option_d_count INT DEFAULT 0,
  option_e_count INT DEFAULT 0,
  total_votes INT DEFAULT 0,
  is_closed BOOLEAN DEFAULT FALSE,
  closed_at TIMESTAMP NULL,
  winning_option VARCHAR(10) NULL
);

CREATE TABLE IF NOT EXISTS shadow_tongue_state (
  id INT PRIMARY KEY DEFAULT 1,
  power_level INT DEFAULT 0,
  active_edits JSON NULL,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  grand_edit_active BOOLEAN DEFAULT FALSE,
  CONSTRAINT shadow_tongue_singleton CHECK (id = 1)
);

INSERT INTO shadow_tongue_state (id, power_level) SELECT 1, 0
WHERE NOT EXISTS (SELECT 1 FROM shadow_tongue_state WHERE id = 1);

CREATE TABLE IF NOT EXISTS player_epoch_progress (
  user_id INT PRIMARY KEY,
  epochs_voted JSON NULL,
  archetype VARCHAR(50) NULL,
  archetype_earned_at TIMESTAMP NULL,
  shadow_tongue_catches INT DEFAULT 0,
  campaign_complete BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS mandela_effects (
  id INT PRIMARY KEY AUTO_INCREMENT,
  triggered_by_vote VARCHAR(50) NOT NULL,
  entry_id VARCHAR(100) NOT NULL,
  field_edited VARCHAR(100) NOT NULL,
  original_value TEXT NOT NULL,
  edited_value TEXT NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  triggered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  restored_at TIMESTAMP NULL,
  players_who_noticed INT DEFAULT 0,
  INDEX idx_mandela_active (active),
  INDEX idx_mandela_vote (triggered_by_vote)
);
