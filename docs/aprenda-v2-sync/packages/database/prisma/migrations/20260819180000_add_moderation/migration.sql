-- Additive only: two new tables for name moderation.
-- No existing table is altered. Current users and their names are untouched;
-- names already in the database keep working until a teacher reviews them.

CREATE TABLE `moderation_terms` (
  `id` VARCHAR(191) NOT NULL,
  `term` VARCHAR(64) NOT NULL,
  `severity` ENUM('BLOCK', 'REVIEW') NOT NULL DEFAULT 'BLOCK',
  `category` ENUM('PROFANITY', 'SLUR', 'SEXUAL', 'IMPERSONATION', 'SPAM') NOT NULL DEFAULT 'PROFANITY',
  `match_mode` ENUM('TOKEN', 'CONTAINS') NOT NULL DEFAULT 'CONTAINS',
  `active` BOOLEAN NOT NULL DEFAULT true,
  `created_by_id` VARCHAR(191) NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL,

  UNIQUE INDEX `moderation_terms_term_key`(`term`),
  INDEX `moderation_terms_active_idx`(`active`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `moderation_events` (
  `id` VARCHAR(191) NOT NULL,
  `kind` ENUM('NAME_BLOCKED', 'NAME_FLAGGED', 'FORCED_RENAME', 'USER_REPORT') NOT NULL,
  `field` ENUM('USER_NAME', 'TEAM_NAME', 'TEAM_DESCRIPTION') NOT NULL DEFAULT 'USER_NAME',
  `subject_user_id` VARCHAR(191) NULL,
  `team_id` VARCHAR(191) NULL,
  `reporter_id` VARCHAR(191) NULL,
  `attempted_value` VARCHAR(280) NOT NULL,
  `matched_term` VARCHAR(64) NULL,
  `severity` ENUM('BLOCK', 'REVIEW') NULL,
  `category` ENUM('PROFANITY', 'SLUR', 'SEXUAL', 'IMPERSONATION', 'SPAM') NULL,
  `note` VARCHAR(280) NULL,
  `resolved` BOOLEAN NOT NULL DEFAULT false,
  `resolved_by_id` VARCHAR(191) NULL,
  `resolved_at` DATETIME(3) NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

  INDEX `moderation_events_resolved_created_at_idx`(`resolved`, `created_at`),
  INDEX `moderation_events_subject_user_id_idx`(`subject_user_id`),
  INDEX `moderation_events_kind_idx`(`kind`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `moderation_events` ADD CONSTRAINT `moderation_events_subject_user_id_fkey`
  FOREIGN KEY (`subject_user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `moderation_events` ADD CONSTRAINT `moderation_events_reporter_id_fkey`
  FOREIGN KEY (`reporter_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
