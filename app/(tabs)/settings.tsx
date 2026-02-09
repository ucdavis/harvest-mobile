import { useAuth } from "@/components/context/AuthContext";
import ExpenseQueue from "@/components/expenses/ExpenseQueue";
import { tx } from "@/lib/i18n";
import { useUserInfo } from "@/services/queries/users";
import { useCallback, useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ArrowRightOnRectangleIcon } from "react-native-heroicons/outline";

export default function LogoutScreen() {
  const { logout, authInfo } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const isLoggingOutRef = useRef(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const userQuery = useUserInfo(authInfo);
  const userEmail = userQuery.data?.user.email || tx("settings.loadingUser");
  const team = userQuery.data?.teamSlug || tx("settings.unknownTeam");

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
      if (isMountedRef.current) {
        // don't want to set state if unmounted
        setIsLoggingOut(false);
      }
    }
  }, [logout]);

  return (
    <View className="main">
      <View className="card">
        <Text className="text-md uppercase font-bold text-harvest tracking-tight">
          {tx("settings.userDetailsTitle")}
        </Text>
        <Text className="text-lg font-semibold text-primaryfont">
          {tx("settings.currentUserLabel")}
        </Text>
        <Text className="text-lg text-primaryfont">
          {tx("settings.currentUserTeamLine", { email: userEmail, team })}
        </Text>
        <TouchableOpacity
          onPress={onLogoutPress}
          className="harvest-button-icon"
          disabled={isLoggingOut}
          accessibilityRole="button"
          accessibilityLabel={tx("settings.logoutAccessibilityLabel")}
          accessibilityState={{ disabled: isLoggingOut }}
        >
          <Text className="harvest-button-text">{tx("settings.logoutButton")}</Text>
          <ArrowRightOnRectangleIcon size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ExpenseQueue />
    </View>
  );
}
