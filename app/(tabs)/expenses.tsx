import { useAuth } from "@/components/context/AuthContext";
import { RateTypeIcon } from "@/components/ui/rateType";
import { Colors } from "@/constants/Colors";
import { RecentExpense } from "@/lib/expense";
import { useRecentExpenses } from "@/services/queries/expenses";
import { useQueryClient } from "@tanstack/react-query";
import { FlatList, RefreshControl, Text, View } from "react-native";
import { ClipboardDocumentListIcon } from "react-native-heroicons/outline";

export default function ExpensesScreen() {
  const { authInfo } = useAuth();
  const queryClient = useQueryClient();
  const recentExpensesQuery = useRecentExpenses(authInfo);
  const queryKey = ["expenses", authInfo?.team, "recent"] as const;

  const handleRefresh = async () => {
    await queryClient.refetchQueries({ queryKey });
  };

  if (recentExpensesQuery.isLoading) {
    return (
      <View className="flex-1 items-center justify-center p-6">
        <Text className="text-base text-primaryfont/70">
          Loading recent expenses...
        </Text>
      </View>
    );
  }

  if (recentExpensesQuery.isError) {
    return (
      <View className="flex-1 items-center justify-center p-6">
        <Text className="text-base text-primaryfont">
          Couldn&apos;t load recent expenses.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <FlatList
        data={recentExpensesQuery.data || []}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ flexGrow: 1, paddingTop: 12, paddingBottom: 88 }}
        alwaysBounceVertical
        showsVerticalScrollIndicator={false}
        renderItem={({ item }: { item: RecentExpense }) => (
          <View className="mx-4 mb-4 overflow-hidden rounded-md border border-primaryborder bg-white">
            <View className="flex-row items-start justify-between px-4 py-3">
              <View className="flex-1 pr-3">
                <Text
                  className="text-xs font-bold uppercase tracking-tight text-primaryfont/70"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.projectName}
                </Text>
                <Text
                  className="mt-1 text-xl font-semibold tracking-tight text-harvest"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.rateName}
                </Text>
                <Text className="mt-2 text-sm text-primaryfont/70">
                  {new Date(item.createdOn).toLocaleDateString()}
                </Text>
              </View>

              <View className="items-end">
                <View
                  className={`rounded-full px-3 py-1 ${
                    item.approved ? "bg-green-100" : "bg-blue-100"
                  }`}
                >
                  <Text
                    className={`text-xs font-semibold uppercase ${
                      item.approved ? "text-green-700" : "text-blue-700"
                    }`}
                  >
                    {item.approved ? "approved" : "submitted"}
                  </Text>
                </View>
                <View className="mt-2 rounded-full bg-harvest/10 px-3 py-1">
                  <View className="flex-row items-center">
                    <RateTypeIcon type={item.type} size={12} />
                    <Text className="ml-1 text-xs font-semibold uppercase text-harvest">
                      {item.type}
                    </Text>
                  </View>
                </View>
                <Text className="mt-3 text-lg font-bold text-primaryfont">
                  ${item.total.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center">
            <ClipboardDocumentListIcon size={72} color={Colors.icon} />
            <Text className="mt-4 text-lg font-semibold text-primaryfont">
              No recent expenses yet
            </Text>
            <Text className="mt-2 text-primaryfont/80">
              Pull down to refresh.
            </Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={recentExpensesQuery.isRefetching}
            onRefresh={handleRefresh}
          />
        }
      />
    </View>
  );
}
