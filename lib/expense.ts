import * as Crypto from "expo-crypto";

// matched with harvest
export type Rate = {
  id: string;
  type: string; // labor, equipment, or other
  description: string; // what the rate is for, like "Tractor X"
  unit: string; // e.g. hours, days
  price: number;
  isPassthrough: boolean;
};

// shape returned by /api/mobile/recentexpenses
export type RecentExpense = {
  id: number;
  type: string;
  activity: string;
  description: string;
  price: number;
  quantity: number;
  total: number;
  createdOn: string;
  approvedOn: string | null;
  approvedBy: string;
  approved: boolean;
  projectId: string;
  rateId: number;
  rateName: string;
  projectName: string;
};

// matched with harvest
export type Expense = {
  type: string;
  activity: string; // description of the overall activity which is flattened onto each expense
  description: string; // for other
  price: number; // rate amount, immutable
  quantity: number;
  projectId: string;
  rateId: string; // ties to specific rates
  rate?: Rate; // optional reference to the rate details
  markup: boolean;
  uniqueId: string; // for tracking and sync
};

// queued expense w/ extra info
export type QueuedExpense = Expense & {
  id?: number; // AUTO INCREMENT PRIMARY KEY from database
  status: "pending" | "syncing" | "synced" | "failed"; // queue status
  createdDate: string; // ISO timestamp when created
  syncAttempts: number; // number of sync attempts
  lastSyncAttempt?: string; // ISO timestamp of last sync attempt
  errorMessage?: string; // error message if sync failed
};

export const MARKUP_RATE = 0.2;
export const MARKUP_CAP = 1000;

export function calculateExpenseTotal(
  price: number,
  quantity: number,
  markup: boolean
): number {
  const baseTotal = price * quantity;

  if (!markup) {
    return baseTotal;
  }

  return baseTotal + Math.min(baseTotal, MARKUP_CAP) * MARKUP_RATE;
}

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

// Fake rates for testing/demonstration
export const fakeRates: Rate[] = [
  {
    id: "rate-001",
    type: "labor",
    description: "Senior Laborer",
    unit: "hours",
    price: 125.0,
    isPassthrough: false,
  },
  {
    id: "rate-002",
    type: "equipment",
    description: "John Deere 6120M Tractor",
    unit: "hours",
    price: 85.5,
    isPassthrough: false,
  },
  {
    id: "rate-003",
    type: "labor",
    description: "Field Technician",
    unit: "hours",
    price: 45.0,
    isPassthrough: false,
  },
  {
    id: "rate-004",
    type: "equipment",
    description: "Kubota Excavator U35-4",
    unit: "days",
    price: 350.0,
    isPassthrough: false,
  },
  {
    id: "rate-005",
    type: "other",
    description: "Materials and Supplies",
    unit: "per item",
    price: 25.75,
    isPassthrough: false,
  },
];

// Types for expense creation results
export interface CreateExpenseErrors {
  field: string;
  code: string;
  message: string;
}

export interface CreateExpenseResultItem {
  uniqueId?: string; // GUID
  expenseId?: number;
  createdDate: Date;
  result: "Created" | "Duplicate" | "Rejected";
  errors: CreateExpenseErrors;
}

export interface CreateExpenseSummaryModel {
  created: number;
  duplicate: number;
  rejected: number;
}

export interface CreateExpenseResultsModel {
  results: CreateExpenseResultItem[];
  summary: CreateExpenseSummaryModel;
}
