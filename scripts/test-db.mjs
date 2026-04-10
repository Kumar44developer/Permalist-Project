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



  await pool.query(`
    CREATE TABLE IF NOT EXISTS items (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL
    )
  `);


  const { rows: before } = await pool.query(
    "SELECT COUNT(*)::int AS n FROM items"
  );
  console.log(`Items in database (before test row): ${before[0].n}`);

  const title = `__db_test_${Date.now()}__`;
  const ins = await pool.query(
    "INSERT INTO items (title) VALUES ($1) RETURNING id",
    [title]
  );
  const id = ins.rows[0].id;

















