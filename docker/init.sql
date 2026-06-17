-- xiaoji database initialization
-- This file is executed when the MySQL container starts for the first time

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- Create database if not exists (already handled by MYSQL_DATABASE env var)
-- CREATE DATABASE IF NOT EXISTS xiaoji_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- The actual schema is managed by Prisma migrations
-- Run `pnpm db:migrate:dev` after the database is ready
