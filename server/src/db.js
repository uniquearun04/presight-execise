
import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(currentDir, "../data");

fs.mkdirSync(dataDir, { recursive: true });

const dbPath = process.env.DB_PATH
    ? path.resolve(process.env.DB_PATH)
    : path.join(dataDir, "users.sqlite");

fs.mkdirSync(path.dirname(dbPath), { recursive: true });

export const db = new Database(dbPath);

db.pragma("foreign_keys = ON");
db.pragma("journal_mode = WAL");

db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        avatar TEXT NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        age INTEGER NOT NULL CHECK (age >= 0),
        nationality TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS hobbies (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS user_hobbies (
        user_id INTEGER NOT NULL,
        hobby_id INTEGER NOT NULL,
        PRIMARY KEY (user_id, hobby_id),

        FOREIGN KEY (user_id)
            REFERENCES users(id) ON DELETE CASCADE,

        FOREIGN KEY (hobby_id)
            REFERENCES hobbies(id)
    );

    CREATE INDEX IF NOT EXISTS idx_users_nationality
        ON users(nationality);

    CREATE INDEX IF NOT EXISTS idx_users_name
        ON users(first_name, last_name);

    CREATE INDEX IF NOT EXISTS idx_user_hobbies_hobby
        ON user_hobbies(hobby_id, user_id);
`);

console.log(`SQLite database: ${dbPath}`);
