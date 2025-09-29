import { queryClient } from "@/components/context/queryClient";
import { getDbOrThrow } from "@/lib/db/client";
import {
  CreateExpenseResultsModel,
  Expense,
  QueuedExpense,
} from "@/lib/expense";
import { logger } from "@/lib/logger";
import { useMutation } from "@tanstack/react-query";
import { fetchFromApi } from "../api";

import Toast from 'react-native-toast-message';

async function insertExpensesToApi(
  expenses: QueuedExpense[]
): Promise<CreateExpenseResultsModel> {
  // strip off fields that aren't part of the base expense model
  const expensePayload: Expense[] = expenses.map((expense) => ({
    projectId: expense.projectId,
    rateId: expense.rateId,
    type: expense.type,
    activity: expense.activity,
    description: expense.description,
    quantity: expense.quantity,
    price: expense.price,
    uniqueId: expense.uniqueId,
  }));

  try {
    const result = await fetchFromApi<CreateExpenseResultsModel>(
      "/api/mobile/expense/createExpenses",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(expensePayload),
      }
    );

    logger.info("API sync completed", {
      expenseCount: expenses.length,
      successCount: result.results.filter(
        (r) => r.result === "Created" || r.result === "Duplicate"
      ).length,
      failureCount: result.results.filter(
        (r) => r.result !== "Created" && r.result !== "Duplicate"
      ).length,
    });

    return result;
  } catch (error) {
    logger.error("Failed to sync expenses to API", error, {
      expenseCount: expenses.length,
      endpoint: "/api/mobile/expense/createExpenses",
      method: "POST",
    });
    throw error;
  }
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

  try {
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
  } catch (error) {
    logger.error("Failed to update expense status", error, {
      expenseId,
      status,
      errorMessage,
    });
    throw error;
  }
}

/**
 * Remove successfully synced expense from the queue
 */
async function removeExpenseFromQueue(expenseId: number): Promise<void> {
  const db = getDbOrThrow();

  try {
    await db.withExclusiveTransactionAsync(async (tx) => {
      await tx.runAsync("DELETE FROM expenses_queue WHERE id = ?", [expenseId]);
    });
  } catch (error) {
    logger.error("Failed to remove expense from queue", error, {
      expenseId,
    });
    throw error;
  }
}

/**
 * Get all pending expenses from the queue
 */
async function getPendingExpensesFromQueue(): Promise<QueuedExpense[]> {
  const db = getDbOrThrow();

  const result = await db.getAllAsync<QueuedExpense>(
    `SELECT * FROM expenses_queue WHERE status = 'pending' ORDER BY createdDate ASC`
  );

  return result;
}

/**
 * Main sync function that processes all pending expenses
 */
async function syncAllPendingExpenses(): Promise<void> {
  try {
    const pendingExpenses = await getPendingExpensesFromQueue();

    if (pendingExpenses.length === 0) {
      return;
    }

    const results = await insertExpensesToApi(pendingExpenses);

    let processedCount = 0;
    let successCount = 0;
    let failureCount = 0;

    // Process results
    for (const res of results.results) {
      const expense = pendingExpenses.find((e) => e.uniqueId === res.uniqueId);
      if (!expense || !expense.id) {
        logger.warn("Could not find expense for sync result", {
          uniqueId: res.uniqueId,
        });
        continue;
      }

      processedCount++;

      if (res.result === "Created" || res.result === "Duplicate") {
        await removeExpenseFromQueue(expense.id);
        successCount++;
        logger.info("Expense synced successfully", {
          expenseId: expense.id,
          uniqueId: expense.uniqueId,
          result: res.result,
        });
      } else {
        await updateExpenseStatus(
          expense.id,
          "pending", // TODO: determine if we want to mark as failed or keep as pending, or should we always just remove?
          JSON.stringify(res.errors) || "Unknown error"
        );
        failureCount++;
        logger.warn("Expense sync failed", {
          expenseId: expense.id,
          uniqueId: expense.uniqueId,
          result: res.result,
          errors: res.errors,
        });
      }
    }

    logger.info("Expense sync completed", {
      totalPending: pendingExpenses.length,
      processed: processedCount,
      successful: successCount,
      failed: failureCount,
    });
     if (successCount > 0) {
      Toast.show({
        type: "success",
        text1: "Expense(s) saved",
      });
    }
  } catch (error) {
    logger.error("Expense sync operation failed", error, {
      operation: "syncAllPendingExpenses",
    });
    throw error;
  }
}

export const MUTATION_KEY_SYNC_EXPENSES = ["sync-expenses"] as const;

/**
 * React Query mutation hook for syncing the expense queue
 */
export function useSyncExpenseQueue() {
  return useMutation({
    mutationKey: [MUTATION_KEY_SYNC_EXPENSES], // Enables automatic deduplication
    mutationFn: syncAllPendingExpenses,
    retry: (failureCount, error) => {
      // Retry up to 3 times for network errors
      if (failureCount < 3) {
        return true;
      }
      return false;
    },
    retryDelay: (attemptIndex) => {
      // Exponential backoff: 1s, 2s, 4s
      const delay = Math.min(1000 * Math.pow(2, attemptIndex), 10000);

      return delay;
    },
    onSuccess: () => {
      logger.info("Sync expense queue mutation succeeded");
      // Toast.show({
      //   type: 'success',
      //   text1: 'Expense(s) saved.',
      // });
    },
    onError: (error, variables, context) => {
      logger.error("Sync expense queue mutation failed", error, {
        mutationType: "syncExpenseQueue",
        retryAttempts: context,
      });
    },
    onSettled: () => {
      // Always refresh the pending expenses query after sync completes
      queryClient.invalidateQueries({ queryKey: ["expenses", "pending"] });
    },
  });
}
