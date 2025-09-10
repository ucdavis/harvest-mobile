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
      // TODO: create expenses outbox table to keep record of unsync'd expenses

      // TODO: get rid of rates table and refactor to use query cache
      await tx.execAsync(`
        CREATE TABLE IF NOT EXISTS rates (
          id          TEXT PRIMARY KEY,
          type        TEXT NOT NULL,
          description TEXT NOT NULL,
          unit        TEXT NOT NULL,
          price       REAL NOT NULL
        );
      `);
      await tx.execAsync(
        `CREATE INDEX IF NOT EXISTS idx_rates_type ON rates(type);`
      );
      await tx.execAsync(
        `CREATE INDEX IF NOT EXISTS idx_rates_description ON rates(description);`
      );
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
