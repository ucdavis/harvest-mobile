import * as SQLite from "expo-sqlite";
import { useCallback, useEffect, useRef, useState } from "react";

type InitStatus = "idle" | "initializing" | "ready" | "error";

export function useInitDb(dbName = "harvest.db") {
  const [status, setStatus] = useState<InitStatus>("idle");
  const [error, setError] = useState<unknown>(null);
  const dbRef = useRef<SQLite.SQLiteDatabase | null>(null);
  const initOnceRef = useRef<Promise<void> | null>(null);

  const initDb = useCallback(async () => {
    if (initOnceRef.current) return initOnceRef.current;

    initOnceRef.current = (async () => {
      setStatus("initializing");

      // Open DB (persisted across restarts)
      const db = await SQLite.openDatabaseAsync(dbName);

      // Sensible defaults
      await db.execAsync("PRAGMA journal_mode = WAL;");
      await db.execAsync("PRAGMA foreign_keys = ON;");

      // CREATE TABLES WE NEED
      await db.withExclusiveTransactionAsync(async (tx) => {
        await tx.execAsync(`
          CREATE TABLE IF NOT EXISTS projects (
            id        TEXT PRIMARY KEY,
            name      TEXT NOT NULL,
            piName    TEXT NOT NULL
          );
        `);
        await tx.execAsync(`
          CREATE INDEX IF NOT EXISTS idx_projects_name ON projects(name);
          CREATE INDEX IF NOT EXISTS idx_projects_piName ON projects(piName);
        `);
      });

      dbRef.current = db;
      setStatus("ready");
    })().catch((e) => {
      setError(e);
      setStatus("error");
      throw e;
    });

    return initOnceRef.current;
  }, [dbName]);

  useEffect(() => {
    void initDb();
  }, [initDb]);

  const reinit = useCallback(async () => {
    setStatus("idle");
    setError(null);
    initOnceRef.current = null;
    await initDb();
  }, [initDb]);

  return { db: dbRef.current, status, error, initDb, reinit };
}
