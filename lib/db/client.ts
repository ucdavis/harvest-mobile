import * as SQLite from "expo-sqlite";

let dbInstance: SQLite.SQLiteDatabase | null = null;
let initPromise: Promise<SQLite.SQLiteDatabase> | null = null;

const DB_NAME = "harvest.db";

export async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (dbInstance) return dbInstance;
  if (initPromise) return initPromise;

  const promise = (async () => {
    const db = await SQLite.openDatabaseAsync(DB_NAME);

    // supposedly these are good defaults
    try {
      await db.execAsync("PRAGMA journal_mode = WAL;");
    } catch {}
    try {
      await db.execAsync("PRAGMA foreign_keys = ON;");
    } catch {}

    await runMigrations(db);

    dbInstance = db;
    return db;
  })();

  initPromise = promise;
  // Ensure we don’t get stuck if init fails or after it settles
  promise.finally(() => {
    if (initPromise === promise) initPromise = null;
  });

  return promise;
}

export function getDbOrThrow(): SQLite.SQLiteDatabase {
  if (!dbInstance) throw new Error("DB not initialized yet");
  return dbInstance;
}

export async function closeDb(): Promise<void> {
  if (dbInstance) {
    await dbInstance.closeAsync();
  }
  dbInstance = null;
  initPromise = null;
}

// --- Migrations --------------------------------------------------------------

// 1-based schema version = migrations.length
type Tx = SQLite.SQLiteDatabase;
type Migration = (tx: Tx) => Promise<void>;

const migrations: Migration[] = [
  // V1: initial schema
  async function migrateToV1(tx: Tx) {
    // expenses_queue for unsynced expenses
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
        status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','synced','error')),
        createdDate TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
        syncAttempts INTEGER NOT NULL DEFAULT 0,
        lastSyncAttempt TEXT,
        errorMessage TEXT
      );
    `);

    await tx.execAsync(`
      CREATE INDEX IF NOT EXISTS idx_expq_status ON expenses_queue(status);
    `);

    // Optional helpful index if you often query "latest pendings"
    await tx.execAsync(`
      CREATE INDEX IF NOT EXISTS idx_expq_status_created ON expenses_queue(status, createdDate);
    `);
  },

  // V2: add activity column
  async function migrateToV2(tx: Tx) {
    const cols =
      (await tx.getAllAsync<{ name: string }>(
        "PRAGMA table_info(expenses_queue)"
      )) ?? [];
    const hasActivity = cols.some((c) => c.name === "activity");
    if (!hasActivity) {
      await tx.execAsync(`
        ALTER TABLE expenses_queue
        ADD COLUMN activity TEXT NOT NULL DEFAULT '';
      `);
    }
  },

  // add new migrations below
];

async function runMigrations(db: SQLite.SQLiteDatabase): Promise<void> {
  const currentVersionRow = await db.getFirstAsync<{ user_version: number }>(
    "PRAGMA user_version"
  );
  const currentVersion = currentVersionRow?.user_version ?? 0;
  const targetVersion = migrations.length;

  if (currentVersion >= targetVersion) {
    console.log("Database is up-to-date");
    // Already up-to-date
    return;
  }

  console.log(`Database version: ${currentVersion} -> ${targetVersion}`);

  // Apply each missing migration (1-based)
  for (let v = currentVersion; v < targetVersion; v++) {
    const nextVersion = v + 1;
    console.log(`Running migration to V${nextVersion}`);

    await db.withExclusiveTransactionAsync(async (tx) => {
      await migrations[v](tx);
      // Bump inside the same TX to record success atomically
      await tx.execAsync(`PRAGMA user_version = ${nextVersion}`);
    });

    console.log(`Migration to V${nextVersion} complete`);
  }
}
