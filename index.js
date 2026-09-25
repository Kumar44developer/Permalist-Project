import express from "express";
import dotenv from "dotenv";
import { createPgPool } from "./lib/pg-config.mjs";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const pool = createPgPool();
let useDatabase = false;
let items = [];

async function initDatabase() {
  if (!pool) {
    console.log("No database config found. Running in in-memory mode.");
    console.log("Set DATABASE_URL or PGUSER + PGDATABASE in .env to use PostgreSQL.");
    return;
  }

  try {
    await pool.query("SELECT 1");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS items (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL
      )
    `);
    useDatabase = true;
    console.log("Connected to PostgreSQL database");
  } catch (err) {
    console.error("Database connection failed:", err.message);
    console.log("Falling back to in-memory mode.");
  }
}

async function getItems() {
  if (useDatabase) {
    const result = await pool.query("SELECT * FROM items ORDER BY id ASC");
    return result.rows;
  }
  return items;
}

async function getDbStats() {
  if (!useDatabase) return { storageMode: "In-memory", tableRowCount: null, dbPingMs: null };
  const start = Date.now();
  const { rows } = await pool.query("SELECT COUNT(*)::int AS n FROM items");
  return {
    storageMode: "PostgreSQL",
    tableRowCount: rows[0].n,
    dbPingMs: Date.now() - start,
  };
}

app.get("/", async (req, res) => {
  try {
    const listItems = await getItems();
    const stats = await getDbStats();
    res.render("index", {
      listTitle: "Today",
      listItems,
      ...stats,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.post("/add", async (req, res) => {
  const newItem = req.body.newItem?.trim();
  if (!newItem) return res.redirect("/");

  try {
    if (useDatabase) {
      await pool.query("INSERT INTO items (title) VALUES ($1)", [newItem]);
    } else {
      items.push({ id: Date.now(), title: newItem });
    }
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.post("/edit", async (req, res) => {
  const id = parseInt(req.body.updatedItemId);
  const title = req.body.updatedItemTitle?.trim();
  if (!title) return res.redirect("/");

  try {
    if (useDatabase) {
      await pool.query("UPDATE items SET title = $1 WHERE id = $2", [title, id]);
    } else {
      const item = items.find((i) => i.id === id);
      if (item) item.title = title;
    }
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.post("/delete", async (req, res) => {
  const id = parseInt(req.body.deleteItemId);

  try {
    if (useDatabase) {
      await pool.query("DELETE FROM items WHERE id = $1", [id]);
    } else {
      items = items.filter((i) => i.id !== id);
    }
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

initDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
});
