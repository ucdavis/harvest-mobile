import { queryClient } from "@/components/context/queryClient";
import { getDbOrThrow } from "@/lib/db/client";
import { fakeRates, Rate } from "@/lib/expense";
import { onlineManager, useQuery } from "@tanstack/react-query";

// we either get rates from the db (cache) or query from the API (and overwrite cache)
async function fetchRatesFromDb() {
  const result = await getDbOrThrow().getAllAsync<Rate>(
    "SELECT * FROM rates ORDER BY type ASC, description ASC"
  );
  return result;
}

async function fetchFakeRatesFromApi() {
  // we'll just fake a few for now
  // TODO: remove this!
  const rates = [...fakeRates];
  await getDbOrThrow().withExclusiveTransactionAsync(async (tx) => {
    await tx.execAsync("DELETE FROM rates");

    for (const r of rates) {
      await tx.runAsync(
        "INSERT INTO rates (id, type, description, unit, price) VALUES (?,?,?,?,?)",
        r.id,
        r.type,
        r.description,
        r.unit,
        r.price
      );
    }
  });

  return rates;
}

async function fetchRatesFromApi() {
  // TODO: actually have an API and refactor
  const res = await fetch("http://harvest.caes.ucdavis.edu/api/rates");
  const rates = (await res.json()) as Rate[];
  // update the local DB in a transaction
  await getDbOrThrow().withExclusiveTransactionAsync(async (tx) => {
    await tx.execAsync("DELETE FROM rates");
    for (const r of rates) {
      await tx.runAsync(
        "INSERT INTO rates (id, type, description, unit, price) VALUES (?,?,?,?,?)",
        r.id,
        r.type,
        r.description,
        r.unit,
        r.price
      );
    }
  });
  return rates;
}

// now here's our actual hook to query rates
// react-query will take care of when to call our fn based on our caching rules
export function useRates() {
  return useQuery<Rate[]>({
    queryKey: ["rates"],
    queryFn: async () => {
      // if offline, return cached rates; if online, fetch from API
      const cached = await fetchRatesFromDb();
      if (!onlineManager.isOnline()) {
        return cached;
      }

      const fresh = await fetchFakeRatesFromApi();
      return fresh;
    },
    initialData: () => queryClient.getQueryData(["rates"]) as Rate[] | [],
    // we could overwrite cache/gc time here if we want to.  for now let's use the global settings
  });
}
