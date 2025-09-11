ALTER TABLE users
  ADD COLUMN reset_token_hash CHAR(64) NULL COMMENT 'SHA-256 hashed token',
  ADD COLUMN reset_token_expires_at DATETIME NULL COMMENT 'token expiry time',
  ADD INDEX idx_reset_token_hash (reset_token_hash),
  ADD INDEX idx_reset_token_expires (reset_token_expires_at);