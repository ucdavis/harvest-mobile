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
      await tx.execAsync(`
        CREATE TABLE IF NOT EXISTS projects (
          id        TEXT PRIMARY KEY,
          name      TEXT NOT NULL,
          piName    TEXT NOT NULL
        );
      `);
      await tx.execAsync(
        `CREATE INDEX IF NOT EXISTS idx_projects_name ON projects(name);`
      );
      await tx.execAsync(
        `CREATE INDEX IF NOT EXISTS idx_projects_piName ON projects(piName);`
      );

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
