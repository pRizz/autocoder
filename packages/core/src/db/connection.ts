/**
 * Database connection management for open-autocoder
 */

import Database from "better-sqlite3";
import { drizzle, BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema.js";

export type DatabaseConnection = BetterSQLite3Database<typeof schema>;

let db: DatabaseConnection | null = null;
let sqliteDb: Database.Database | null = null;

/**
 * Initialize and return the database connection
 *
 * @param dbPath - Path to the SQLite database file
 * @returns The Drizzle database connection
 */
export function getDatabase(dbPath: string): DatabaseConnection {
  if (db) {
    return db;
  }

  sqliteDb = new Database(dbPath);
  sqliteDb.pragma("journal_mode = WAL");
  sqliteDb.pragma("busy_timeout = 5000");

  db = drizzle(sqliteDb, { schema });

  return db;
}

/**
 * Close the database connection
 */
export function closeDatabase(): void {
  if (sqliteDb) {
    sqliteDb.close();
    sqliteDb = null;
    db = null;
  }
}

/**
 * Initialize database tables if they don't exist
 *
 * @param database - The database connection
 */
export function initializeTables(database: DatabaseConnection): void {
  const sqlite = (database as unknown as { $client: Database.Database })
    .$client;

  // Create features table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS features (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      priority INTEGER NOT NULL,
      category TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      steps TEXT NOT NULL,
      passes INTEGER NOT NULL DEFAULT 0,
      in_progress INTEGER NOT NULL DEFAULT 0,
      dependencies TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);

  // Create projects table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      name TEXT PRIMARY KEY,
      path TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      model TEXT,
      provider TEXT,
      concurrency INTEGER DEFAULT 3,
      yolo_mode INTEGER DEFAULT 0,
      testing_agent_ratio INTEGER DEFAULT 1
    )
  `);

  // Create providers table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS providers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      api_key_encrypted TEXT,
      base_url TEXT,
      is_default INTEGER DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);

  // Create sessions table
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      project_name TEXT NOT NULL,
      agent_type TEXT NOT NULL,
      feature_id INTEGER,
      started_at TEXT NOT NULL,
      ended_at TEXT,
      status TEXT NOT NULL,
      output_log TEXT
    )
  `);
}
