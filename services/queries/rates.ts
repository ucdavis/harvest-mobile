import { HOUR_IN_MS } from "@/components/context/queryClient";
import { fakeRates, Rate } from "@/lib/expense";
import { queryOptions, useQuery } from "@tanstack/react-query";

async function fetchFakeRatesFromApi() {
  // we'll just fake a few for now
  // TODO: remove this!
  const rates = [...fakeRates];

  return rates;
}

async function fetchRatesFromApi() {
  // TODO: actually have an API and refactor
  const res = await fetch("http://harvest.caes.ucdavis.edu/api/rates");
  const rates = (await res.json()) as Rate[];

  return rates;
}

// uses api data and caches it
export const ratesApiQueryOptions = () =>
  queryOptions({
    queryKey: ["rates"] as const,
    queryFn: fetchFakeRatesFromApi,
    staleTime: 12 * HOUR_IN_MS,
  });

export const useRates = () => {
  return useQuery(ratesApiQueryOptions());
};
