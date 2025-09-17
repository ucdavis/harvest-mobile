import { useAuth } from "@/components/context/AuthContext";
import ExpenseQueue from "@/components/expenses/ExpenseQueue";
import { Text, TouchableOpacity, View } from "react-native";
import { ArrowRightOnRectangleIcon } from "react-native-heroicons/outline";

export default function LogoutScreen() {
  const { logout } = useAuth();

  return (
    <View className="main">
      <Text className="mt-20 text-center text-xl font-semibold text-primary-font">
        Current User:

      </Text>
      <TouchableOpacity
        onPress={logout}
        className="flex-row items-center gap-1 px-4 py-2 rounded-md bg-harvest mx-auto mt-10"
        accessibilityRole="button"
        accessibilityLabel="Logout"
      >
        <ArrowRightOnRectangleIcon size={36} color="#fff" />
        <Text className="text-lg font-semibold text-white">
          Log out of Harvest
        </Text>
      </TouchableOpacity>

      {__DEV__ && (
        <View className="mx-4 mt-8">
          <ExpenseQueue />
        </View>
      )}
    </View>
  );
}
