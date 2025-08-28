import { getDb } from "@/lib/db/client";
import { useCallback, useEffect, useState } from "react";

type InitStatus = "idle" | "initializing" | "ready" | "error";

export function useInitDb() {
  const [status, setStatus] = useState<InitStatus>("idle");
  const [error, setError] = useState<unknown>(null);

  const initDb = useCallback(async () => {
    try {
      if (status === "initializing" || status === "ready") return;
      setStatus("initializing");
      await getDb();
      setStatus("ready");
    } catch (e) {
      setError(e);
      setStatus("error");
    }
  }, [status]);

  useEffect(() => {
    void initDb();
  }, [initDb]);

  return { status, error, initDb };
}
