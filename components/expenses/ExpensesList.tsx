import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  FlatList,
  RefreshControl,
  View,
} from "react-native";


import { ExpenseCard } from "@/components/ui/ExpenseCard";
import { ExpenseCardInfo } from "@/lib/expense";


type ExpensesListProps = {
  expenses: ExpenseCardInfo[];
  queryKey: (string | undefined)[];
  onExpensePress: (expense: ExpenseCardInfo) => void;
  isLoading?: boolean;
  scrollEnabled?: boolean;
};

export function ExpensesList({
  expenses,
  queryKey,
  onExpensePress,
}: ExpensesListProps) {
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.refetchQueries({
      queryKey,
    });
    setRefreshing(false);
  };

  const handleExpensePress = (expense: ExpenseCardInfo) => {
    onExpensePress(expense);
  };

  const renderExpenseCard = ({ item }: { item: ExpenseCardInfo }) => (
  <ExpenseCard
    projectName={item.projectName}
    rateName={item.rateName}
    type={item.type}
    uniqueId={item.uniqueId}
    onPress={() => handleExpensePress(item)}
  />
);


  return (
    <View className="flex-1">
      {/* Projects List Content */}
        <View className="px-4 flex-1">
          <FlatList
            data={expenses}
            renderItem={renderExpenseCard}
            keyExtractor={(item) => item.uniqueId} // keep internal key stable
            contentContainerStyle={{ paddingTop: 8, paddingBottom: 88 }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        </View>
    </View>
  );
}