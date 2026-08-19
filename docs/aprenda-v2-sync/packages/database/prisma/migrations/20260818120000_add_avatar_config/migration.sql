-- Additive only. Existing users, progress, gems, inventory and seed rows stay intact.
-- Nullable JSON: current rows receive NULL and the app uses the default avatar.
ALTER TABLE `users` ADD COLUMN `avatar_config` JSON NULL;
