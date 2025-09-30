import { Colors } from "@/constants/Colors";
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
  InformationCircleIcon,
  TrashIcon,
  UserIcon
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

import { SquaresPlusIcon } from "react-native-heroicons/outline";
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
    router.push({ pathname: "/rateSelect", params: { projectId, projectName, piName } });
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
        clearExpenses(); // clear local expenses

        // invalidate the recent projects query to refresh recent projects
        queryClient.invalidateQueries({
          queryKey: ["projects", auth.authInfo?.team, "recent"],
        });

        // if we aren't already syncing, trigger a sync
        queryClient.isMutating({
          mutationKey: [MUTATION_KEY_SYNC_EXPENSES],
        }) === 0 && syncExpenseQueueMutation.mutate(); // trigger sync of expense queue
        Toast.show({
          type: 'warning',
          text1: 'Your expenses have been added to the queue.',
        });
        router.back();
      },
      onError: (error) => {
        console.error("Failed to submit expenses:", error);
      },
    });
  };

  return (
    <View className="flex-1">

      <View className="bg-white px-5 py-4 border-b border-primaryborder flex-row items-end justify-between">
        <View>
          <Text className="text-xl font-semibold text-harvest">
            {projectName}
          </Text>
          <Text className="text-md font-medium text-primaryfont"><UserIcon size={12} color={Colors.primaryfont} /> {piName}</Text>
        </View>
        <View>
          <Text className="text-sm uppercase font-bold text-primaryfont/40 tracking-tight">
            # {projectId}
          </Text>
        </View>
        {showMoreProjectInfoButton && (
          <TouchableOpacity onPress={handleProjectInfo}>
            <InformationCircleIcon size={24} color="#a0a0a0" />
          </TouchableOpacity>
        )}

      </View>
      <ScrollView
        className="flex-1 px-4 py-4"
        showsVerticalScrollIndicator={false}
      >


        <View className="card">
          <Text className="text-md uppercase font-bold text-harvest tracking-tight">
            Notes
          </Text>
          <TextInput
            className="border mt-5 border-primaryborder rounded-md p-3 text-base min-h-[60px] bg-gray-50"
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
            <Text className="text-primaryfont/80 mt-2">
              No expenses added.
            </Text>
          )}

          {expenses.map((item) => (
            <View
              key={item.uniqueId}
              className="flex-row items-end justify-between py-3 border-b border-primaryborder"
            >
              <View className="flex-1">
                <Text className="tertiary-label uppercase">{item.type}</Text>
                <Text className="text-lg text-primaryfont font-medium">
                  {item.rate?.description}
                </Text>
              </View>

              <View className="flex-row items-center space-x-3">
                <Text className="text-base text-primaryfont/80 font-semibold">
                  {item.quantity} {item.rate?.unit} @ ${item.price}
                </Text>

                <TouchableOpacity
                  className="ml-3"
                  onPress={() => handleDeleteExpense(item.uniqueId)}
                >
                  <TrashIcon size={16} color={Colors.merlot} />
                </TouchableOpacity>
              </View>
            </View>
          ))}

          <TouchableOpacity
            className="flex-row bg-harvest rounded-md mt-5 justify-between py-2 px-4"
            onPress={handleAddExpenses}
          >
            <Text className="text-base text-white font-bold pt-0.5">Add expense</Text>
            <SquaresPlusIcon size={24} color="white" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View className="p-4 pb-10 bg-white border-t border-primaryborder">
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
