import { getDbOrThrow } from "@/lib/db/client";
import { Expense, QueuedExpense, ExpenseCardInfo, getExpenseUniqueId } from "@/lib/expense";
import { Project } from "@/lib/project";
import { logger } from "@/lib/logger";
import { useMutation, useQuery, useQueryClient, queryOptions} from "@tanstack/react-query";

import { HOUR_IN_MS } from "@/components/context/queryClient";
import { TeamAuthInfo } from "@/lib/auth";
import { Rate } from "@/lib/expense";
import { fetchFromApi } from "../api";

// Insert expenses into the local database queue
async function insertExpensesToDb(
  expenses: Expense[]
): Promise<QueuedExpense[]> {
  const db = getDbOrThrow();
  const results: QueuedExpense[] = [];

  try {
    await db.withExclusiveTransactionAsync(async (tx) => {
      for (const expense of expenses) {
        const createdDate = new Date().toISOString();

        // Insert the expense into the queue
        const result = await tx.runAsync(
          `INSERT INTO expenses_queue (
          projectId, 
          rateId,
          type, 
          activity,
          description, 
          quantity, 
          price, 
          uniqueId,
          status,
          createdDate,
          syncAttempts
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(uniqueId) DO NOTHING;`, // ignore if duplicate
          [
            expense.projectId,
            expense.rateId,
            expense.type,
            expense.activity,
            expense.description,
            expense.quantity,
            expense.price,
            expense.uniqueId,
            "pending",
            createdDate,
            0,
          ]
        );

        // Create the queued expense object with the generated ID
        const queuedExpense: QueuedExpense = {
          ...expense,
          id: result.lastInsertRowId,
          status: "pending" as const,
          createdDate,
          syncAttempts: 0,
        };

        results.push(queuedExpense);
      }
    });

    logger.info("Successfully inserted expenses to DB", {
      expenseCount: expenses.length,
      resultCount: results.length,
    });

    return results;
  } catch (error) {
    logger.error("Failed to insert expenses to DB", error, {
      expenseCount: expenses.length,
      expenses: expenses.map((e) => ({
        uniqueId: e.uniqueId,
        projectId: e.projectId,
        description: e.description,
      })),
    });
    throw error;
  }
}

// React Query mutation hook for inserting expenses
export function useInsertExpenses() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: insertExpensesToDb,
    networkMode: "offlineFirst", // don't require network to insert to db
    onSuccess: (data) => {
      // Invalidate and refetch any expense-related queries
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
    onError: (error) => {
      logger.error("Insert expenses mutation failed", error, {
        mutationType: "insertExpenses",
        networkMode: "offlineFirst",
      });
    },
  });
}

// Query function to get pending expenses from the queue
async function getPendingExpensesFromDb(): Promise<QueuedExpense[]> {
  const db = getDbOrThrow();

  const result = await db.getAllAsync<QueuedExpense>(
    `SELECT * FROM expenses_queue WHERE status = 'pending' ORDER BY createdDate DESC`
  );

  return result;
}

// Hook to get pending expenses with auto-sync functionality
export function usePendingExpenses() {
  return useQuery({
    queryKey: ["expenses", "pending"],
    queryFn: getPendingExpensesFromDb,
    networkMode: "offlineFirst", 
    staleTime: 30 * 1000, // 30 seconds - shorter stale time for more responsive sync
    refetchOnWindowFocus: true, // Trigger sync when app becomes active
    refetchOnReconnect: true, // Trigger sync when network returns
    refetchOnMount: true, // Trigger sync on component mount
  });
}

// Clear all expenses from the queue
async function clearExpenseQueue(): Promise<void> {
  const db = getDbOrThrow();

  try {
    await db.withExclusiveTransactionAsync(async (tx) => {
      await tx.runAsync(`DELETE FROM expenses_queue`);
    });
  } catch (error) {
    logger.error("Failed to clear expense queue", error, {
      operation: "clearExpenseQueue",
    });
    throw error;
  }
}

// Only for development/testing purposes
export function useClearExpenseQueue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearExpenseQueue,
    networkMode: "offlineFirst", // don't require network to clear db
    onSuccess: () => {
      // Invalidate and refetch expense-related queries
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
    onError: (error) => {
      logger.error("Clear expense queue mutation failed", error, {
        mutationType: "clearExpenseQueue",
        networkMode: "offlineFirst",
      });
    },
  });
}

// Query functions to fetch recent expenses from harvest API
async function fetchRecentExpensesFromApi(authInfo?: TeamAuthInfo) {
  return fetchFromApi<Expense[]>("/api/mobile/recentexpenses", {}, authInfo);
}

export const recentExpensesApiQueryOptions = (authInfo?: TeamAuthInfo) =>
  queryOptions({
    queryKey: ["expenses", authInfo?.team, "recent"] as const,
    queryFn: () => fetchRecentExpensesFromApi(authInfo),
    staleTime: 5 * HOUR_IN_MS,
    enabled: !!authInfo, // only run query if we have auth info
  });

export const useRecentExpenses = (authInfo?: TeamAuthInfo) => {
  return useQuery(recentExpensesApiQueryOptions(authInfo));
};

export async function getRecentExpenseCardInfo(
  expenses: Expense[],
  authInfo?: TeamAuthInfo
): Promise<ExpenseCardInfo[]> {
  try {
    const [rates, projects] = await Promise.all([
      fetchFromApi<any[]>("/api/mobile/activerates", {}, authInfo),
      fetchFromApi<any[]>("/api/mobile/projects", {}, authInfo),
    ]);

    const rateMap = new Map(rates.map((r) => [r.id, r]));
    const projectMap = new Map(
      projects.map((p) => [
        p.id,
        {
          projectName: p.name,
          piName: p.piName,
        },
      ])
    );

    return expenses.map((expense) => {
      const rate = rateMap.get(expense.rateId);
      const projectInfo = projectMap.get(expense.projectId);
      return {
        ...expense,
        uniqueId: expense.uniqueId ?? getExpenseUniqueId(),
        rateName: rate?.description ?? expense.description ?? "Unknown Rate",
        rate, // <-- Return the entire rate object here
        unit: rate?.unit ?? "",
        projectName: projectInfo?.projectName ?? `Project #${expense.projectId}`,
        piName: projectInfo?.piName ?? "Unknown PI",
      };
    });
  } catch (error) {
    console.error("Error mapping expense cards:", error);
    return expenses.map((expense) => ({
      ...expense,
      uniqueId: expense.uniqueId ?? getExpenseUniqueId(),
      rateName: expense.description ?? "Unknown Rate",
      rate: undefined,
      unit: "",
      projectName: `Project #${expense.projectId}`,
      piName: "",
    }));
  }
}


