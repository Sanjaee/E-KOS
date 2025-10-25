-- Create e-kos database and user if not exists
-- This script runs automatically when PostgreSQL container first starts

-- Create database if not exists
SELECT 'CREATE DATABASE ekos_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'ekos_db')\gexec

-- Create user if not exists
DO
$$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'ekos_user') THEN
    CREATE USER ekos_user WITH PASSWORD 'ekos_password';
  END IF;
END
$$;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE ekos_db TO ekos_user;

-- Connect to ekos_db and grant schema privileges
\c ekos_db

-- Grant privileges on public schema
GRANT ALL ON SCHEMA public TO ekos_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ekos_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ekos_user;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO ekos_user;

-- Set default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO ekos_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO ekos_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO ekos_user;

-- Install useful extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Log completion
\echo 'Database initialization completed successfully!'

