-- Additive only: creates new tables for teams, wars and the live quiz engine.
-- No existing table is altered or dropped. Current users, progress, gems,
-- inventory, tracks and lessons are untouched.

CREATE TABLE `teams` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `slug` VARCHAR(191) NOT NULL,
  `description` VARCHAR(280) NULL,
  `emblem_seed` VARCHAR(191) NOT NULL,
  `emblem_color` VARCHAR(9) NOT NULL DEFAULT '#58CC02',
  `join_policy` ENUM('INVITE_ONLY', 'REQUEST') NOT NULL DEFAULT 'REQUEST',
  `max_members` INTEGER NOT NULL DEFAULT 25,
  `xp_total` INTEGER NOT NULL DEFAULT 0,
  `war_points` INTEGER NOT NULL DEFAULT 0,
  `wars_won` INTEGER NOT NULL DEFAULT 0,
  `wars_lost` INTEGER NOT NULL DEFAULT 0,
  `owner_id` VARCHAR(191) NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL,

  UNIQUE INDEX `teams_name_key`(`name`),
  UNIQUE INDEX `teams_slug_key`(`slug`),
  INDEX `teams_war_points_idx`(`war_points`),
  INDEX `teams_owner_id_idx`(`owner_id`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- user_id is UNIQUE: one team per user is enforced by the database.
CREATE TABLE `team_members` (
  `id` VARCHAR(191) NOT NULL,
  `team_id` VARCHAR(191) NOT NULL,
  `user_id` VARCHAR(191) NOT NULL,
  `role` ENUM('OWNER', 'ADMIN', 'MEMBER') NOT NULL DEFAULT 'MEMBER',
  `season_points` INTEGER NOT NULL DEFAULT 0,
  `week_points` INTEGER NOT NULL DEFAULT 0,
  `joined_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

  UNIQUE INDEX `team_members_user_id_key`(`user_id`),
  INDEX `team_members_team_id_idx`(`team_id`),
  INDEX `team_members_team_id_season_points_idx`(`team_id`, `season_points`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `team_invites` (
  `id` VARCHAR(191) NOT NULL,
  `team_id` VARCHAR(191) NOT NULL,
  `code` VARCHAR(16) NOT NULL,
  `created_by_id` VARCHAR(191) NOT NULL,
  `max_uses` INTEGER NULL,
  `uses` INTEGER NOT NULL DEFAULT 0,
  `expires_at` DATETIME(3) NULL,
  `revoked_at` DATETIME(3) NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

  UNIQUE INDEX `team_invites_code_key`(`code`),
  INDEX `team_invites_team_id_idx`(`team_id`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `team_join_requests` (
  `id` VARCHAR(191) NOT NULL,
  `team_id` VARCHAR(191) NOT NULL,
  `user_id` VARCHAR(191) NOT NULL,
  `status` ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
  `decided_by_id` VARCHAR(191) NULL,
  `decided_at` DATETIME(3) NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

  UNIQUE INDEX `team_join_requests_team_id_user_id_key`(`team_id`, `user_id`),
  INDEX `team_join_requests_user_id_idx`(`user_id`),
  INDEX `team_join_requests_team_id_status_idx`(`team_id`, `status`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `quiz_questions` (
  `id` VARCHAR(191) NOT NULL,
  `track_id` VARCHAR(191) NULL,
  `lesson_id` VARCHAR(191) NULL,
  `topic` VARCHAR(191) NOT NULL,
  `difficulty` ENUM('EASY', 'MEDIUM', 'HARD') NOT NULL DEFAULT 'MEDIUM',
  `prompt` TEXT NOT NULL,
  `options` JSON NOT NULL,
  `correct_index` INTEGER NOT NULL,
  `time_limit_sec` INTEGER NOT NULL DEFAULT 20,
  `source` ENUM('LESSON', 'TEACHER', 'SEED') NOT NULL DEFAULT 'LESSON',
  `active` BOOLEAN NOT NULL DEFAULT true,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL,

  INDEX `quiz_questions_track_id_active_idx`(`track_id`, `active`),
  INDEX `quiz_questions_lesson_id_idx`(`lesson_id`),
  INDEX `quiz_questions_difficulty_idx`(`difficulty`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `quiz_sessions` (
  `id` VARCHAR(191) NOT NULL,
  `code` VARCHAR(8) NOT NULL,
  `mode` ENUM('TEAM_INTERNAL', 'TEAM_WAR') NOT NULL,
  `status` ENUM('LOBBY', 'QUESTION', 'INTERMISSION', 'FINISHED', 'CANCELLED') NOT NULL DEFAULT 'LOBBY',
  `host_user_id` VARCHAR(191) NULL,
  `team_id` VARCHAR(191) NULL,
  `war_id` VARCHAR(191) NULL,
  `track_id` VARCHAR(191) NULL,
  `current_question_index` INTEGER NOT NULL DEFAULT 0,
  `question_started_at` DATETIME(3) NULL,
  `question_ends_at` DATETIME(3) NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `finished_at` DATETIME(3) NULL,

  UNIQUE INDEX `quiz_sessions_code_key`(`code`),
  UNIQUE INDEX `quiz_sessions_war_id_key`(`war_id`),
  INDEX `quiz_sessions_team_id_idx`(`team_id`),
  INDEX `quiz_sessions_status_idx`(`status`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `quiz_session_questions` (
  `id` VARCHAR(191) NOT NULL,
  `session_id` VARCHAR(191) NOT NULL,
  `question_id` VARCHAR(191) NOT NULL,
  `order` INTEGER NOT NULL,
  `time_limit_sec` INTEGER NOT NULL DEFAULT 20,

  UNIQUE INDEX `quiz_session_questions_session_id_order_key`(`session_id`, `order`),
  INDEX `quiz_session_questions_question_id_idx`(`question_id`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `quiz_participants` (
  `id` VARCHAR(191) NOT NULL,
  `session_id` VARCHAR(191) NOT NULL,
  `user_id` VARCHAR(191) NOT NULL,
  `team_id` VARCHAR(191) NULL,
  `score` INTEGER NOT NULL DEFAULT 0,
  `correct_count` INTEGER NOT NULL DEFAULT 0,
  `answered_count` INTEGER NOT NULL DEFAULT 0,
  `option_seed` INTEGER NOT NULL,
  `connected` BOOLEAN NOT NULL DEFAULT true,
  `last_seen_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `joined_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

  UNIQUE INDEX `quiz_participants_session_id_user_id_key`(`session_id`, `user_id`),
  INDEX `quiz_participants_session_id_score_idx`(`session_id`, `score`),
  INDEX `quiz_participants_team_id_idx`(`team_id`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- One answer per participant per question, enforced by the database.
CREATE TABLE `quiz_answers` (
  `id` VARCHAR(191) NOT NULL,
  `session_id` VARCHAR(191) NOT NULL,
  `participant_id` VARCHAR(191) NOT NULL,
  `question_id` VARCHAR(191) NOT NULL,
  `selected_index` INTEGER NOT NULL,
  `correct` BOOLEAN NOT NULL,
  `response_ms` INTEGER NOT NULL,
  `points` INTEGER NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

  UNIQUE INDEX `quiz_answers_participant_id_question_id_key`(`participant_id`, `question_id`),
  INDEX `quiz_answers_session_id_idx`(`session_id`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `team_wars` (
  `id` VARCHAR(191) NOT NULL,
  `challenger_team_id` VARCHAR(191) NOT NULL,
  `opponent_team_id` VARCHAR(191) NOT NULL,
  `status` ENUM('PREPARATION', 'BATTLE', 'FINISHED', 'CANCELLED') NOT NULL DEFAULT 'PREPARATION',
  `track_id` VARCHAR(191) NULL,
  `created_by_id` VARCHAR(191) NOT NULL,
  `min_participants` INTEGER NOT NULL DEFAULT 5,
  `prep_ends_at` DATETIME(3) NOT NULL,
  `battle_started_at` DATETIME(3) NULL,
  `challenger_score` INTEGER NULL,
  `opponent_score` INTEGER NULL,
  `winner_team_id` VARCHAR(191) NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `finished_at` DATETIME(3) NULL,

  INDEX `team_wars_challenger_team_id_idx`(`challenger_team_id`),
  INDEX `team_wars_opponent_team_id_idx`(`opponent_team_id`),
  INDEX `team_wars_status_idx`(`status`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `team_war_participants` (
  `id` VARCHAR(191) NOT NULL,
  `war_id` VARCHAR(191) NOT NULL,
  `team_id` VARCHAR(191) NOT NULL,
  `user_id` VARCHAR(191) NOT NULL,
  `confirmed_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `score` INTEGER NULL,

  UNIQUE INDEX `team_war_participants_war_id_user_id_key`(`war_id`, `user_id`),
  INDEX `team_war_participants_war_id_team_id_idx`(`war_id`, `team_id`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `teams` ADD CONSTRAINT `teams_owner_id_fkey`
  FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `team_members` ADD CONSTRAINT `team_members_team_id_fkey`
  FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `team_members` ADD CONSTRAINT `team_members_user_id_fkey`
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `team_invites` ADD CONSTRAINT `team_invites_team_id_fkey`
  FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `team_invites` ADD CONSTRAINT `team_invites_created_by_id_fkey`
  FOREIGN KEY (`created_by_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `team_join_requests` ADD CONSTRAINT `team_join_requests_team_id_fkey`
  FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `team_join_requests` ADD CONSTRAINT `team_join_requests_user_id_fkey`
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `quiz_questions` ADD CONSTRAINT `quiz_questions_track_id_fkey`
  FOREIGN KEY (`track_id`) REFERENCES `tracks`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `quiz_questions` ADD CONSTRAINT `quiz_questions_lesson_id_fkey`
  FOREIGN KEY (`lesson_id`) REFERENCES `lessons`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `quiz_sessions` ADD CONSTRAINT `quiz_sessions_team_id_fkey`
  FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `quiz_sessions` ADD CONSTRAINT `quiz_sessions_war_id_fkey`
  FOREIGN KEY (`war_id`) REFERENCES `team_wars`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `quiz_session_questions` ADD CONSTRAINT `quiz_session_questions_session_id_fkey`
  FOREIGN KEY (`session_id`) REFERENCES `quiz_sessions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `quiz_session_questions` ADD CONSTRAINT `quiz_session_questions_question_id_fkey`
  FOREIGN KEY (`question_id`) REFERENCES `quiz_questions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `quiz_participants` ADD CONSTRAINT `quiz_participants_session_id_fkey`
  FOREIGN KEY (`session_id`) REFERENCES `quiz_sessions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `quiz_participants` ADD CONSTRAINT `quiz_participants_user_id_fkey`
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `quiz_answers` ADD CONSTRAINT `quiz_answers_session_id_fkey`
  FOREIGN KEY (`session_id`) REFERENCES `quiz_sessions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `quiz_answers` ADD CONSTRAINT `quiz_answers_participant_id_fkey`
  FOREIGN KEY (`participant_id`) REFERENCES `quiz_participants`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `quiz_answers` ADD CONSTRAINT `quiz_answers_question_id_fkey`
  FOREIGN KEY (`question_id`) REFERENCES `quiz_questions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `team_wars` ADD CONSTRAINT `team_wars_challenger_team_id_fkey`
  FOREIGN KEY (`challenger_team_id`) REFERENCES `teams`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `team_wars` ADD CONSTRAINT `team_wars_opponent_team_id_fkey`
  FOREIGN KEY (`opponent_team_id`) REFERENCES `teams`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `team_war_participants` ADD CONSTRAINT `team_war_participants_war_id_fkey`
  FOREIGN KEY (`war_id`) REFERENCES `team_wars`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `team_war_participants` ADD CONSTRAINT `team_war_participants_user_id_fkey`
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
