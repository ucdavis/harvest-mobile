import { useAuth } from "@/components/context/AuthContext";
import ExpenseQueue from "@/components/expenses/ExpenseQueue";
import { useUserInfo } from "@/services/queries/users";
import { Text, TouchableOpacity, View } from "react-native";
import { ArrowRightOnRectangleIcon } from "react-native-heroicons/outline";
import { useCallback, useRef, useState } from "react";

export default function LogoutScreen() {
  const { logout, authInfo } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const isLoggingOutRef = useRef(false);

  const userQuery = useUserInfo(authInfo);

  const onLogoutPress = useCallback(async () => {
    if (isLoggingOutRef.current) {
      return;
    }

    isLoggingOutRef.current = true;
    setIsLoggingOut(true);

    try {
      await logout();
    } finally {
      isLoggingOutRef.current = false;
      setIsLoggingOut(false);
    }
  }, [logout]);

  return (
    <View className="main">
      <View className="card">
        <Text className="text-md uppercase font-bold text-harvest tracking-tight">
          User Details
        </Text>
        <Text className="text-lg font-semibold text-primaryfont">
          Current User:
        </Text>
        <Text className="text-lg text-primaryfont">
          {userQuery.data?.user.email || "Loading User"} in team{" "}
          {userQuery.data?.teamSlug || "Unknown Team"}
        </Text>
        <TouchableOpacity
          onPress={onLogoutPress}
          className="harvest-button-icon"
          disabled={isLoggingOut}
          accessibilityRole="button"
          accessibilityLabel="Logout"
          accessibilityState={{ disabled: isLoggingOut }}
        >
          <Text className="harvest-button-text">Log out of Harvest</Text>
          <ArrowRightOnRectangleIcon size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ExpenseQueue />
    </View>
  );
}
