import { useAuth } from "@/components/context/AuthContext";
import { queryClient } from "@/components/context/queryClient";
import ExpenseQueue from "@/components/expenses/ExpenseQueue";
import { useUserInfo } from "@/services/queries/users";
import { Text, TouchableOpacity, View } from "react-native";
import { ArrowRightOnRectangleIcon } from "react-native-heroicons/outline";

export default function LogoutScreen() {
  const { logout, authInfo } = useAuth();

  const userQuery = useUserInfo(authInfo);

  const onLogoutPress = () => {
    // invalidate all queries and logout
    queryClient.invalidateQueries();
    logout();
  };

  return (
    <View className="main">
      <Text className="mt-20 text-center text-xl font-semibold text-primary-font">
        Current User: {userQuery.data?.user.email || "Loading User"} in team{" "}
        {userQuery.data?.teamSlug || "Unknown Team"}
      </Text>
      <TouchableOpacity
        onPress={onLogoutPress}
        className="flex-row items-center gap-1 px-4 py-2 rounded-md bg-harvest mx-auto mt-10"
        accessibilityRole="button"
        accessibilityLabel="Logout"
      >
        <ArrowRightOnRectangleIcon size={36} color="#fff" />
        <Text className="text-lg font-semibold text-white">
          Log out of Harvest
        </Text>
      </TouchableOpacity>

      <View className="mx-4 mt-8">
        <ExpenseQueue />
      </View>
    </View>
  );
}
