import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useRef, useState } from "react";

import { clearAllAuthData } from "@/lib/auth";
import { getDb, resetDb } from "@/lib/db/client";
import { logger } from "@/lib/logger";

type ClearTask = {
  name: string;
  run: () => Promise<void>;
};

const INSTALL_FLAG_KEY = "install_flag";
type AppInitStatus = "idle" | "initializing" | "ready" | "error";

/**
 * Clear all locally persisted app data (DB, auth, AsyncStorage).
 * Attempts all steps and surfaces a single error if any fail.
 */
export async function clearAllData(): Promise<void> {
  const tasks: ClearTask[] = [
    { name: "database", run: () => resetDb().then(() => undefined) },
    { name: "auth", run: clearAllAuthData },
    { name: "asyncStorage", run: AsyncStorage.clear },
  ];

  const failures: string[] = [];

  for (const task of tasks) {
    try {
      await task.run();
    } catch (error) {
      failures.push(task.name);
      logger.error(`clearAllData: ${task.name} reset failed`, error);
    }
  }

  if (failures.length) {
    throw new Error(`clearAllData failed for: ${failures.join(", ")}`);
  }
}

/**
 * On a fresh install, wipe all persisted data once and mark completion so it only runs once.
 */
export async function resetOnFreshInstall(): Promise<void> {
  const alreadyReset = await AsyncStorage.getItem(INSTALL_FLAG_KEY);
  if (alreadyReset) return;

  try {
    await clearAllData();
  } catch (error) {
    logger.error("resetOnFreshInstall: clearAllData failed", error);
    throw error;
  }

  try {
    await AsyncStorage.setItem(INSTALL_FLAG_KEY, "true");
  } catch (error) {
    logger.error("resetOnFreshInstall: failed to set install flag", error);
    throw error;
  }
}

/**
 * Initialize app persistent state (fresh-install wipe + DB ready).
 */
export function useAppInit() {
  const [status, setStatus] = useState<AppInitStatus>("idle");
  const [error, setError] = useState<unknown>(null);
  const statusRef = useRef<AppInitStatus>("idle");

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  const init = useCallback(async () => {
    if (
      statusRef.current === "initializing" ||
      statusRef.current === "ready"
    ) {
      return;
    }

    setStatus("initializing");
    setError(null);

    try {
      await resetOnFreshInstall();
      await getDb();
      setStatus("ready");
    } catch (err) {
      logger.error("useAppInit: initialization failed", err);
      setError(err);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    void init();
  }, [init]);

  return { status, error, retry: init };
}
