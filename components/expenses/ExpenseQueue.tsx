import { queryClient } from "@/components/context/queryClient";
import { QueuedExpense } from "@/lib/expense";
import { tx } from "@/lib/i18n";
import {
  MUTATION_KEY_SYNC_EXPENSES,
  useSyncExpenseQueue,
} from "@/services/queries/expenseQueue";
import {
  useClearExpenseQueue,
  usePendingExpenses,
} from "@/services/queries/expenses";
import React from "react";
import {
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ChevronRightIcon } from "react-native-heroicons/solid";

interface ExpenseQueueProps {
  className?: string;
}

export default function ExpenseQueue({ className }: ExpenseQueueProps) {
  const { data: expenses = [], isRefetching, refetch } = usePendingExpenses();

  const clearExpenseQueueMutation = useClearExpenseQueue();
  const syncExpenseQueueMutation = useSyncExpenseQueue();

  const getStatusColor = (status: QueuedExpense["status"]) => {
    switch (status) {
      case "pending":
        return "text-yellow-600";
      case "syncing":
        return "text-blue-600";
      case "synced":
        return "text-green-600";
      case "failed":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusText = (status: QueuedExpense["status"]) => {
    switch (status) {
      case "pending":
        return tx("components.expenseQueue.statusPending");
      case "syncing":
        return tx("components.expenseQueue.statusSyncing");
      case "synced":
        return tx("components.expenseQueue.statusSynced");
      case "failed":
        return tx("components.expenseQueue.statusFailed");
    }

    return "";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleSyncQueue = () => {
    const isSyncing =
      queryClient.isMutating({
        mutationKey: [MUTATION_KEY_SYNC_EXPENSES],
      }) > 0;

    if (!isSyncing) {
      syncExpenseQueueMutation.mutate();
    }
  };

  const handleClearQueue = () => {
    if (expenses.length === 0) return;

    Alert.alert(
      tx("components.expenseQueue.clearAlertTitle"),
      tx("components.expenseQueue.clearAlertMessage", {
        count: expenses.length,
      }),
      [
        {
          text: tx("components.expenseQueue.cancelAction"),
          style: "cancel",
        },
        {
          text: tx("components.expenseQueue.clearAction"),
          style: "destructive",
          onPress: () => {
            clearExpenseQueueMutation.mutate();
          },
        },
      ]
    );
  };

  return (
    <View className={`card ${className || ""}`}>
      <View className="flex-row justify-between items-center mb-1">
        <Text className="text-md uppercase font-bold text-harvest tracking-tight">
          {tx("components.expenseQueue.titleWithCount", {
            count: expenses.length,
          })}
        </Text>

        {expenses.length > 0 && (
          <TouchableOpacity
            onPress={handleSyncQueue}
            className="flex-row bg-yellow-500 rounded-md mt-5 py-2 px-4 items-center"
            disabled={syncExpenseQueueMutation.isPending}
          >
            <Text className="text-white text-sm font-medium">
              {syncExpenseQueueMutation.isPending
                ? tx("components.expenseQueue.syncing")
                : tx("components.expenseQueue.syncQueue")}
            </Text>
            <ChevronRightIcon size={16} color="white" />
          </TouchableOpacity>
        )}
      </View>

      <Text className="text-sm text-primaryfont/80 mb-2">
        {tx("components.expenseQueue.subtitle")}
      </Text>

      <ScrollView
        className="max-h-96"
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={handleRefresh} />
        }
      >
        {expenses.length === 0 ? (
          <View className="p-4">
            <Text className="text-primaryfont/40 text-center">
              {tx("components.expenseQueue.emptyQueue")}
            </Text>
          </View>
        ) : (
          expenses.map((expense) => (
            <View
              key={expense.id || expense.uniqueId}
              className="p-4 border-b border-gray-100 last:border-b-0"
            >
              <View className="flex-row justify-between items-start mb-2">
                <Text className="font-medium text-gray-900 flex-1">
                  {expense.description}
                </Text>
                <Text
                  className={`font-semibold ${getStatusColor(expense.status)}`}
                >
                  {getStatusText(expense.status)}
                </Text>
              </View>

              <View className="space-y-1">
                <View className="flex-row justify-between">
                  <Text className="text-sm text-gray-600">
                    {tx("components.expenseQueue.typeLabel")}
                  </Text>
                  <Text className="text-sm text-gray-900">{expense.type}</Text>
                </View>

                <View className="flex-row justify-between">
                  <Text className="text-sm text-gray-600">
                    {tx("components.expenseQueue.priceLabel")}
                  </Text>
                  <Text className="text-sm text-gray-900">
                    {formatPrice(expense.price)}
                  </Text>
                </View>

                <View className="flex-row justify-between">
                  <Text className="text-sm text-gray-600">
                    {tx("components.expenseQueue.quantityLabel")}
                  </Text>
                  <Text className="text-sm text-gray-900">
                    {expense.quantity}
                  </Text>
                </View>

                <View className="flex-row justify-between">
                  <Text className="text-sm text-gray-600">
                    {tx("components.expenseQueue.markupLabel")}
                  </Text>
                  <Text className="text-sm text-gray-900">
                    {expense.markup
                      ? tx("components.expenseQueue.markupYes")
                      : tx("components.expenseQueue.markupNo")}
                  </Text>
                </View>

                <View className="flex-row justify-between">
                  <Text className="text-sm text-gray-600">
                    {tx("components.expenseQueue.totalLabel")}
                  </Text>
                  <Text className="text-sm font-medium text-gray-900">
                    {formatPrice(expense.price * expense.quantity)}
                  </Text>
                </View>

                <View className="flex-row justify-between">
                  <Text className="text-sm text-gray-600">
                    {tx("components.expenseQueue.projectIdLabel")}
                  </Text>
                  <Text className="text-sm text-gray-900">
                    {expense.projectId}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-sm text-gray-600">
                    {tx("components.expenseQueue.rateIdLabel")}
                  </Text>
                  <Text className="text-sm text-gray-900">
                    {expense.rateId}
                  </Text>
                </View>

                <View className="flex-row justify-between">
                  <Text className="text-sm text-gray-600">
                    {tx("components.expenseQueue.createdLabel")}
                  </Text>
                  <Text className="text-sm text-gray-900">
                    {formatDate(expense.createdDate)}
                  </Text>
                </View>

                <View className="flex-row justify-between">
                  <Text className="text-sm text-gray-600">
                    {tx("components.expenseQueue.syncAttemptsLabel")}
                  </Text>
                  <Text className="text-sm text-gray-900">
                    {expense.syncAttempts}
                  </Text>
                </View>

                {expense.lastSyncAttempt && (
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-gray-600">
                      {tx("components.expenseQueue.lastSyncLabel")}
                    </Text>
                    <Text className="text-sm text-gray-900">
                      {formatDate(expense.lastSyncAttempt)}
                    </Text>
                  </View>
                )}

                {expense.errorMessage && (
                  <View className="mt-2">
                    <Text className="text-sm text-gray-600">
                      {tx("components.expenseQueue.errorLabel")}
                    </Text>
                    <Text className="text-sm text-red-600 mt-1">
                      {expense.errorMessage}
                    </Text>
                  </View>
                )}

                <View className="mt-2 pt-2 border-t border-gray-100">
                  <Text className="text-xs text-gray-500">
                    {tx("components.expenseQueue.idLabel")} {expense.uniqueId}
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}
        {expenses.length > 0 && (
          <TouchableOpacity
            onPress={handleClearQueue}
            className="flex-row bg-merlot rounded-md mt-5 justify-between py-2 px-4"
            disabled={clearExpenseQueueMutation.isPending}
          >
            <Text className="text-white text-sm font-medium">
              {clearExpenseQueueMutation.isPending
                ? tx("components.expenseQueue.clearing")
                : tx("components.expenseQueue.clearAll")}
            </Text>
            <ChevronRightIcon size={16} color="white" />
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}
