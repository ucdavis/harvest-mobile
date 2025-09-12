import { getDbOrThrow } from "@/lib/db/client";
import { CreateExpenseResultsModel, QueuedExpense } from "@/lib/expense";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchFromApi } from "../api";

async function insertExpensesToApi(
  expenses: QueuedExpense[]
): Promise<CreateExpenseResultsModel> {
  const result = await fetchFromApi<CreateExpenseResultsModel>(
    "/api/mobile/expense/createExpenses",
    {
      method: "POST",
      body: JSON.stringify(expenses),
    }
  );

  return result;
}

/**
 * Update expense status in the local database
 */
async function updateExpenseStatus(
  expenseId: number,
  status: QueuedExpense["status"],
  errorMessage?: string
): Promise<void> {
  const db = getDbOrThrow();

  await db.withExclusiveTransactionAsync(async (tx) => {
    const updateQuery = `
      UPDATE expenses_queue 
      SET status = ?, 
          lastSyncAttempt = ?, 
          syncAttempts = syncAttempts + 1,
          errorMessage = ?
      WHERE id = ?
    `;

    await tx.runAsync(updateQuery, [
      status,
      new Date().toISOString(),
      errorMessage || null,
      expenseId,
    ]);
  });
}

/**
 * Remove successfully synced expense from the queue
 */
async function removeExpenseFromQueue(expenseId: number): Promise<void> {
  const db = getDbOrThrow();

  await db.withExclusiveTransactionAsync(async (tx) => {
    await tx.runAsync("DELETE FROM expenses_queue WHERE id = ?", [expenseId]);
  });
}

/**
 * Get all pending expenses from the queue
 */
async function getPendingExpensesFromQueue(): Promise<QueuedExpense[]> {
  const db = getDbOrThrow();

  const result = await db.getAllAsync(
    `SELECT * FROM expenses_queue WHERE status = 'pending' ORDER BY createdDate ASC`
  );

  return result.map((row: any) => ({
    id: row.id,
    projectId: row.projectId ? row.projectId.toString() : null,
    rateId: row.rateId,
    type: row.type,
    description: row.description,
    quantity: row.quantity,
    price: row.price,
    uniqueId: row.uniqueId,
    status: row.status as QueuedExpense["status"],
    createdDate: row.createdDate,
    syncAttempts: row.syncAttempts,
    lastSyncAttempt: row.lastSyncAttempt,
    errorMessage: row.errorMessage,
  }));
}

/**
 * Main sync function that processes all pending expenses
 */
async function syncAllPendingExpenses(): Promise<void> {
  console.log("Starting expense queue sync...");

  const pendingExpenses = await getPendingExpensesFromQueue();

  if (pendingExpenses.length === 0) {
    console.log("No pending expenses to sync");
  }

  console.log(`Found ${pendingExpenses.length} pending expenses to sync`);

  const results = await insertExpensesToApi(pendingExpenses);

  console.log("API sync results:", results);

  // Process results
  for (const res of results.results) {
    const expense = pendingExpenses.find((e) => e.uniqueId === res.uniqueId);
    if (!expense || !expense.id) {
      console.warn(
        `No matching local expense found for uniqueId ${res.uniqueId}`
      );
      continue;
    }

    if (res.result === "Created" || res.result === "Duplicate") {
      await removeExpenseFromQueue(expense.id);
      console.log(`Expense ${expense.id} synced and removed from queue`);
    } else {
      await updateExpenseStatus(
        expense.id,
        "pending", // TODO: determine if we want to mark as failed or keep as pending, or should we always just remove?
        JSON.stringify(res.errors) || "Unknown error"
      );
      console.log(
        `Expense ${expense.id} failed to sync: ${JSON.stringify(res.errors) || "Unknown error"}`
      );
    }
  }
}

/**
 * React Query mutation hook for syncing the expense queue
 */
export function useSyncExpenseQueue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["sync-expenses"], // Enables automatic deduplication
    mutationFn: syncAllPendingExpenses,
    retry: (failureCount, error) => {
      // Retry up to 3 times for network errors
      if (failureCount < 3) {
        console.log(`Sync attempt ${failureCount + 1} failed, retrying...`);
        return true;
      }
      return false;
    },
    retryDelay: (attemptIndex) => {
      // Exponential backoff: 1s, 2s, 4s
      return Math.min(1000 * Math.pow(2, attemptIndex), 10000);
    },
    onMutate: () => {
      console.log("Expense sync started");
    },
    onSuccess: () => {
      console.log("Expense sync completed successfully:");

      // Invalidate pending expenses query to refresh UI
      queryClient.invalidateQueries({ queryKey: ["expenses", "pending"] });

      // If there are still pending expenses (new ones added during sync),
      // we'll let the query's onSuccess handler trigger another sync
    },
    onError: (error) => {
      console.error("Expense sync failed:", error);

      // Still refresh the UI to show updated error states
      queryClient.invalidateQueries({ queryKey: ["expenses", "pending"] });
    },
    onSettled: () => {
      // Always refresh the pending expenses query after sync completes
      queryClient.invalidateQueries({ queryKey: ["expenses", "pending"] });
    },
  });
}
