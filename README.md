# Permalist

A persistent to-do list application built with Node.js, Express, PostgreSQL, and EJS. Supports full CRUD operations to add, edit, and delete items. Data is stored permanently in a PostgreSQL database. Falls back to in-memory storage when no database is configured.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **Templating Engine:** EJS
- **Styling:** Vanilla CSS

## Prerequisites

- [Node.js](https://nodejs.org/) v16 or higher
- [PostgreSQL](https://www.postgresql.org/) v12 or higher (optional for in-memory mode)
- npm (comes with Node.js)

## Project Structure

```
Permalist-Project/
├── lib/
│   └── pg-config.mjs
├── public/
│   ├── assets/
│   │   └── icons/
│   │       ├── check-solid.svg
│   │       ├── pencil-solid.svg
│   │       └── trash-solid.svg
│   └── styles/
│       └── main.css
├── scripts/
│   └── test-db.mjs
├── views/
│   ├── partials/
│   │   ├── header.ejs
│   │   └── footer.ejs
│   └── index.ejs
├── .env
├── .env.example
├── .gitignore
├── index.js
├── package.json
└── README.md
```

## Database Setup

1. Open your PostgreSQL shell or pgAdmin.

2. Create the database:

```sql
CREATE DATABASE permalist;
```

3. The `items` table is created automatically when the server starts. If you want to create it manually:

```sql
\c permalist

CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL
);
```

## Installation

1. Clone the repository:

```bash
git clone https://github.com/Kumar44developer/Permalist-Project.git
cd Permalist-Project
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

4. Open `.env` and update the values with your PostgreSQL credentials:

```
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=your_password_here
PGDATABASE=permalist
PORT=3000
```

## Running the App

Start the server:

```bash
npm start
```

Start the server in development mode with auto-reload:

```bash
npm run dev
```

Test database connectivity:

```bash
npm run test:db
```

The app will be running at `http://localhost:3000`.

## Usage

1. Open `http://localhost:3000` in your browser.
2. Type a new item in the input field and click the **+** button to add it.
3. Click the **pencil icon** next to any item to edit its title.
4. After editing, click the **check icon** to save changes.
5. Click the **trash icon** to delete an item.
6. The storage mode (PostgreSQL or In-memory) is displayed at the bottom of the list.

## API Routes

| Method | Route     | Description                     |
|--------|-----------|---------------------------------|
| GET    | `/`       | Displays all items              |
| POST   | `/add`    | Adds a new item                 |
| POST   | `/edit`   | Updates an existing item title  |
| POST   | `/delete` | Deletes an item by ID           |

## Environment Variables

| Variable     | Description               | Default     |
|--------------|---------------------------|-------------|
| `PGHOST`     | PostgreSQL host           | `localhost` |
| `PGPORT`     | PostgreSQL port           | `5432`      |
| `PGUSER`     | PostgreSQL username       | `postgres`  |
| `PGPASSWORD` | PostgreSQL password       | -           |
| `PGDATABASE` | PostgreSQL database name  | `permalist` |
| `PORT`       | Express server port       | `3000`      |

You can also use a single `DATABASE_URL` connection string instead of separate variables:

```
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/permalist
```

## Features

- **Add Items** — Type a title and click + to create a new to-do item
- **Edit Items** — Click the pencil icon to inline-edit any item title
- **Delete Items** — Click the trash icon to remove an item permanently
- **Persistent Storage** — All items are stored in PostgreSQL and survive server restarts
- **In-Memory Fallback** — Works without a database for quick testing
- **Auto Table Creation** — The items table is created automatically on first run
- **Database Health Check** — Built-in test script to verify database connectivity
- **Database Status Display** — Shows storage mode, row count, and ping time in the UI

## License

ISC
