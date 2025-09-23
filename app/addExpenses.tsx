import { router, useLocalSearchParams } from "expo-router";
import { openBrowserAsync } from "expo-web-browser";
import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  ChevronRightIcon,
  InformationCircleIcon,
  TrashIcon,
} from "react-native-heroicons/solid";

import { useAuth } from "@/components/context/AuthContext";
import { useExpenses } from "@/components/context/ExpenseContext";
import { queryClient } from "@/components/context/queryClient";
import { getProjectLink } from "@/lib/project";
import {
  MUTATION_KEY_SYNC_EXPENSES,
  useSyncExpenseQueue,
} from "@/services/queries/expenseQueue";
import { useInsertExpenses } from "@/services/queries/expenses";

import Toast from 'react-native-toast-message';


const showMoreProjectInfoButton = false; // false for now since workers can't see project details

export default function AddExpenseScreen() {
  const { projectId, projectName, piName } = useLocalSearchParams<{
    projectId: string;
    projectName: string;
    piName: string;
  }>();

  const auth = useAuth();
  const [activity, setActivity] = useState("");

  const { expenses, removeExpense, clearExpenses } = useExpenses();
  const insertExpensesMutation = useInsertExpenses();
  const syncExpenseQueueMutation = useSyncExpenseQueue();

  // Clear expenses on mount (when navigating to a new project)
  useEffect(() => {
    clearExpenses();
  }, [clearExpenses]); // Include clearExpenses in dependencies

  const handleAddExpenses = () => {
    router.push({ pathname: "/rateSelect", params: { projectId } });
  };

  const handleDeleteExpense = (uniqueId: string) => {
    removeExpense(uniqueId);
  };

  const handleProjectInfo = async () => {
    const url = getProjectLink(projectId, auth.authInfo!);
    if (url) {
      await openBrowserAsync(url);
    }
  };

  const handleSubmit = () => {
    // prep the expenses for submission
    // add activity to each expense (flattened)
    // remove the rate object, we only need the rateId
    const expensesWithActivity = expenses.map((expense) => ({
      ...expense,
      rate: undefined, // remove rate object
      activity: activity.trim(),
    }));
    insertExpensesMutation.mutate(expensesWithActivity, {
      onSuccess: () => {
        // TODO: some kind of success message 
          Toast.show({
            type: 'success',
            text1: 'Your expenses have been submitted',
          });
        clearExpenses(); // clear local expenses

        // invalidate the recent projects query to refresh recent projects
        queryClient.invalidateQueries({
          queryKey: ["projects", auth.authInfo?.team, "recent"],
        });

        // if we aren't already syncing, trigger a sync
        queryClient.isMutating({
          mutationKey: [MUTATION_KEY_SYNC_EXPENSES],
        }) === 0 && syncExpenseQueueMutation.mutate(); // trigger sync of expense queue
        router.back();
      },
      onError: (error) => {
        console.error("Failed to submit expenses:", error);
      },
    });
  };

  return (
    <View className="flex-1">
      <ScrollView
        className="flex-1 px-4 py-4"
        showsVerticalScrollIndicator={false}
      >
        <View className="card">
          <View className="flex-row items-start justify-between">
            <View>
              <Text className="text-md uppercase font-bold text-primary-font/40 tracking-tight mb-1">
                {projectId}
              </Text>
              <Text className="text-xl font-bold text-harvest">
                {projectName}
              </Text>
              <Text className="text-md font-medium text-primary-font">PI: {piName}</Text>
            </View>
            {showMoreProjectInfoButton && (
              <TouchableOpacity onPress={handleProjectInfo}>
                <InformationCircleIcon size={24} color="#a0a0a0" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View className="card">
          <Text className="text-md uppercase font-bold text-harvest tracking-tight">
            Activity
          </Text>
          <TextInput
            className="border mt-5 border-primary-border rounded-md p-3 text-base min-h-[60px] bg-gray-50"
            placeholder="Add expense activity..."
            placeholderTextColor="#999"
            value={activity}
            onChangeText={setActivity}
            multiline
            textAlignVertical="top"
          />
        </View>

        <View className="card">
          <Text className="text-md uppercase font-bold text-harvest tracking-tight">
            Expenses
          </Text>
          {expenses.length === 0 && (
            <Text className="text-primary-font/80 mt-2">
              No expenses added.
            </Text>
          )}

          {expenses.map((item) => (
            <View
              key={item.uniqueId}
              className="flex-row items-end justify-between py-3 border-b border-primary-border"
            >
              <View className="flex-1">
                <Text className="tertiary-label uppercase">{item.type}</Text>
                <Text className="text-lg text-primary-font font-medium">
                  {item.rate?.description}
                </Text>
              </View>

              <View className="flex-row items-center space-x-3">
                <Text className="text-base text-primary-font/80 font-semibold">
                  {item.quantity} {item.rate?.unit} @ ${item.price}
                </Text>

                <TouchableOpacity
                  className="ml-3"
                  onPress={() => handleDeleteExpense(item.uniqueId)}
                >
                  <TrashIcon size={16} color="#79242F" />
                </TouchableOpacity>
              </View>
            </View>
          ))}

          <TouchableOpacity
            className="flex-row bg-harvest rounded-md mt-5 justify-between py-2 px-4"
            onPress={handleAddExpenses}
          >
            <Text className="text-base text-white font-bold">Add expense</Text>
            <ChevronRightIcon size={24} color="white" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View className="p-4 mb-4 bg-white border-t border-primary-border">
        <TouchableOpacity
          className={`harvest-button ${expenses.length === 0 ? "opacity-50" : ""}`}
          onPress={expenses.length > 0 ? handleSubmit : undefined}
          disabled={expenses.length === 0}
        >
          <Text className="harvest-button-text">Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
