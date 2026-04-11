import pg from "pg";

/**
 * Prefer DATABASE_URL if set. Otherwise use PGUSER + PGDATABASE (+ PGPASSWORD, PGHOST, PGPORT).
 * Use the PG_* form when your password contains @ — URLs break unless you encode @ as %40.
 */
