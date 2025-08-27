import * as Crypto from "expo-crypto";

export type Rate = {
  id: string;
  type: string; // labor, equipment, or other
  description: string; // what the rate is for, like "Tractor X"
  unit: string; // e.g. hours, days
  price: number;
};

export type Expense = {
  type: string;
  description: string; // for other
  price: number; // rate amount, immutable
  quantity: number;
  projectId: string;
  rateId: string; // ties to specific rates
  rate?: Rate; // optional reference to the rate details
  uniqueId: string; // for tracking and sync
};

export function getExpenseUniqueId(): string {
  // Generate a UUID v4 using expo-crypto
  return Crypto.randomUUID();
}

export function createExpenseWithUniqueId(
  expense: Omit<Expense, "uniqueId">
): Expense {
  return {
    ...expense,
    uniqueId: getExpenseUniqueId(),
  };
}
