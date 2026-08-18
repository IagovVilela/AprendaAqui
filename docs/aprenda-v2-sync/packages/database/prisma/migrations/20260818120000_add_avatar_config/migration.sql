-- Customização persistida do avatar 3D (JSON com cores + itens equipados).
ALTER TABLE `users` ADD COLUMN `avatar_config` JSON NULL;
