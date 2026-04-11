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

  const user = process.env.PGUSER?.trim();
  const database = process.env.PGDATABASE?.trim();
  if (!user || !database) return null;

  const host = process.env.PGHOST?.trim() || "127.0.0.1";
  const port = Number.parseInt(process.env.PGPORT || "5432", 10);
  const password = process.env.PGPASSWORD ?? "";

  const isLocalHost = /^(localhost|127\.0\.0\.1)$/i.test(host);
  return new pg.Pool({
    host,
    port,
    user,
    password,























