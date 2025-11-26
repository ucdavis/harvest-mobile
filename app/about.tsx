import Constants from "expo-constants";
import { useCallback, useMemo, useState } from "react";
import {
  Alert,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  ArrowPathIcon,
  ArrowTopRightOnSquareIcon,
} from "react-native-heroicons/outline";

import { resetAppState } from "@/lib/app";
import { logger } from "@/lib/logger";

export default function AboutScreen() {
  const [isResetting, setIsResetting] = useState(false);

  const { appName, appVersion } = useMemo(() => {
    const name = Constants.expoConfig?.name || "Harvest Mobile";
    const version = Constants.expoConfig?.version || "Unknown version";

    return {
      appName: name,
      appVersion: version,
    };
  }, []);

  const handleResetPress = useCallback(() => {
    if (isResetting) return;

    Alert.alert(
      "Reset app data",
      "This will erase cached data, local auth, and the offline database. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            setIsResetting(true);

            try {
              await resetAppState();
              Alert.alert(
                "Reset complete",
                "Local data cleared. Close the about page and sign in to continue."
              );
            } catch (error) {
              logger.error("About: clearAllData failed", error);
              Alert.alert(
                "Reset failed",
                "We couldn't clear local data. Please try again."
              );
            } finally {
              setIsResetting(false);
            }
          },
        },
      ]
    );
  }, [isResetting]);

  const supportUrl = "https://caeshelp.ucdavis.edu/?appname=Harvest";

  const handleSupportPress = () => {
    Linking.openURL(supportUrl).catch(() => {
      Alert.alert("Unable to open link", "Please try again or copy the URL.");
    });
  };

  return (
    <ScrollView
      className="flex-1 bg-secondarybg"
      contentContainerStyle={{ padding: 16 }}
      accessibilityLabel="About Harvest Mobile"
    >
      <View className="card">
        <Text className="text-md uppercase font-bold text-harvest tracking-tight">
          About
        </Text>
        <Text className="text-2xl font-semibold text-primaryfont mt-2">
          {appName}
        </Text>
        <Text className="text-base text-primaryfont/80 mt-2">
          Track project expenses quickly and easily with Harvest Mobile, the
          official app for UC Davis Harvest system. Log your hours, submit
          expenses, and stay connected on the go.
        </Text>

        <View className="mt-4 space-y-2">
          <View className="flex-row justify-between">
            <Text className="text-base font-semibold text-primaryfont">
              Version
            </Text>
            <Text className="text-base text-primaryfont/80">{appVersion}</Text>
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-base font-semibold text-primaryfont">
              Support
            </Text>
            <TouchableOpacity
              onPress={handleSupportPress}
              className="flex-row items-center gap-2"
              accessibilityRole="link"
              accessibilityLabel="Open support site in browser"
            >
              <Text className="text-base font-semibold text-harvest underline">
                caeshelp.ucdavis.edu
              </Text>
              <ArrowTopRightOnSquareIcon size={18} color="#266041" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View className="card">
        <Text className="text-md uppercase font-bold text-harvest tracking-tight">
          Troubleshooting
        </Text>
        <Text className="text-base text-primaryfont mt-2">
          If things look off, resetting local data can help clear cached info
          and force a fresh sync.
        </Text>

        <TouchableOpacity
          onPress={handleResetPress}
          className="flex-row items-center justify-between bg-merlot rounded-md mt-4 px-4 py-3"
          accessibilityRole="button"
          accessibilityLabel="Reset app data"
          accessibilityHint="Clears local cache, auth, and offline database"
          disabled={isResetting}
          style={isResetting ? { opacity: 0.7 } : undefined}
          activeOpacity={0.9}
        >
          <View className="flex-1 pr-3">
            <Text className="text-lg font-semibold text-white">
              {isResetting ? "Resetting..." : "Reset App Data"}
            </Text>
            <Text className="text-sm text-white/80">
              Clears cached data and local auth - useful if you can&apos;t
              login.
            </Text>
          </View>
          <ArrowPathIcon size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
