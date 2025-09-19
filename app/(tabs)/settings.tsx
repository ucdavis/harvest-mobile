import { useAuth } from "@/components/context/AuthContext";
import { queryClient } from "@/components/context/queryClient";
import ExpenseQueue from "@/components/expenses/ExpenseQueue";
import { useClearExpenseQueue } from "@/services/queries/expenses";
import { useUserInfo } from "@/services/queries/users";
import { Text, TouchableOpacity, View } from "react-native";
import { ArrowRightOnRectangleIcon } from "react-native-heroicons/outline";

export default function LogoutScreen() {
  const { logout, authInfo } = useAuth();

  const userQuery = useUserInfo(authInfo);
  const clearExpenseQueueMutation = useClearExpenseQueue();

  const onLogoutPress = async () => {
    // invalidate all queries, clear the expense queue and logout
    await queryClient.cancelQueries(); // cancel in-flight queries

    try {
      await clearExpenseQueueMutation.mutateAsync();
    } catch (error) {
      console.error("Failed to clear expense queue:", error);
    } finally {
      queryClient.clear(); // Clear all cached queries
      logout();
    }
  };

  return (
    <View className="main">
      <View className="card">
        <Text className="text-md uppercase font-bold text-harvest tracking-tight">User Details</Text>
        <Text className="text-lg font-semibold text-primary-font">
          Current User:
        </Text>
        <Text className="text-lg text-primary-font">
          {userQuery.data?.user.email || "Loading User"} in team{" "}
          {userQuery.data?.teamSlug || "Unknown Team"}
        </Text>
        <TouchableOpacity
          onPress={onLogoutPress}
          className="harvest-button-icon"
          accessibilityRole="button"
          accessibilityLabel="Logout"
        >

          <Text className="harvest-button-text">
            Log out of Harvest
          </Text>
          <ArrowRightOnRectangleIcon size={24} color="#fff" />
        </TouchableOpacity>
      </View>



      <ExpenseQueue />

    </View>
  );
}
