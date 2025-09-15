import * as SQLite from "expo-sqlite";

let dbInstance: SQLite.SQLiteDatabase | null = null;
let initPromise: Promise<SQLite.SQLiteDatabase> | null = null;

let dbName = "harvest.db";

export async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (dbInstance) return dbInstance;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const db = await SQLite.openDatabaseAsync(dbName);
    // sensible PRAGMAs
    await db.execAsync("PRAGMA journal_mode = WAL;");
    await db.execAsync("PRAGMA foreign_keys = ON;");

    // schema init (do it here so everyone shares the same path)
    await db.withExclusiveTransactionAsync(async (tx) => {
      // expenses queue table to keep record of unsync'd expenses
      await tx.execAsync(`
        CREATE TABLE IF NOT EXISTS expenses_queue (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          projectId INTEGER NOT NULL,
          rateId TEXT NOT NULL,
          type TEXT NOT NULL,
          description TEXT NOT NULL,
          quantity REAL NOT NULL,
          price REAL NOT NULL,
          uniqueId TEXT NOT NULL UNIQUE,
          status TEXT NOT NULL DEFAULT 'pending',
          createdDate TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
          syncAttempts INTEGER NOT NULL DEFAULT 0,
          lastSyncAttempt TEXT,
          errorMessage TEXT
        );
      `);

      // we'll search on status a lot
      await tx.execAsync(`
        CREATE INDEX IF NOT EXISTS idx_expq_status ON expenses_queue(status);
      `);
    });

    dbInstance = db;
    return db;
  })();

  return initPromise;
}

// most can just use this since we don't need to re-init
export function getDbOrThrow(): SQLite.SQLiteDatabase {
  if (!dbInstance) throw new Error("DB not initialized yet");
  return dbInstance;
}
