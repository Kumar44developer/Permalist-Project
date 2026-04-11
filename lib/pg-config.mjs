import pg from "pg";

/**
 * Prefer DATABASE_URL if set. Otherwise use PGUSER + PGDATABASE (+ PGPASSWORD, PGHOST, PGPORT).
 * Use the PG_* form when your password contains @ — URLs break unless you encode @ as %40.
 */

export function createPgPool() {
  const databaseUrl = process.env.DATABASE_URL?.trim();
  if (databaseUrl) {
    const isLocal =
      /localhost|127\.0\.0\.1/i.test(databaseUrl) ||
      databaseUrl.includes("sslmode=disable");
    return new pg.Pool({
      connectionString: databaseUrl,
      ...(isLocal ? {} : { ssl: { rejectUnauthorized: false } }),
    });
  }





























