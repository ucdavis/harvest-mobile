import { useAuth } from "@/components/context/AuthContext";
import { Text, TouchableOpacity, View } from "react-native";
import { ArrowRightOnRectangleIcon } from "react-native-heroicons/outline";

export default function LogoutScreen() {
  const { logout } = useAuth();

  return (
    <View className="main">

      <TouchableOpacity
        onPress={logout}
        className="flex-row items-center gap-1 px-4 py-2 rounded-md bg-harvest mx-auto mt-10"
        accessibilityRole="button"
        accessibilityLabel="Logout"
      >
        <ArrowRightOnRectangleIcon size={36} color="#fff" />
        <Text className="text-lg font-semibold text-white">Log out from CAS</Text>
      </TouchableOpacity>


    </View>
  );
}
