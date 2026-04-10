import "dotenv/config";
import { createPgPool } from "../lib/pg-config.mjs";

const pool = createPgPool();
if (!pool) {
  console.error(
    "No database config. Set DATABASE_URL or PGUSER + PGDATABASE in .env (see .env.example)."
  );
  process.exit(1);
}

try {
  const ping = Date.now();
  await pool.query("SELECT 1 AS ok");
  console.log(`Ping: OK (${Date.now() - ping} ms)`);
























