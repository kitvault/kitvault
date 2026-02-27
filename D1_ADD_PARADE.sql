-- Add in_parade column to user_sprites (defaults to 1 = shown in parade)
ALTER TABLE user_sprites ADD COLUMN in_parade INTEGER NOT NULL DEFAULT 1;
