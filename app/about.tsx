import Constants from "expo-constants";
import { useMemo } from "react";
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

export default function AboutScreen() {
  const { appName, appVersion } = useMemo(() => {
    const name = Constants.expoConfig?.name || "Harvest Mobile";
    const version = Constants.expoConfig?.version || "Unknown version";

    return {
      appName: name,
      appVersion: version,
    };
  }, []);

  const handleResetPress = () => {
    Alert.alert(
      "Reset coming soon",
      "This button will wipe local app data when troubleshooting. It is a placeholder for now."
    );
  };

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
          Track project expenses quickly, stay in sync with your team, and keep
          your field data clean while offline or on-site.
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
          accessibilityHint="Currently a placeholder; will remove local data in a future update"
        >
          <View className="flex-1 pr-3">
            <Text className="text-lg font-semibold text-white">
              Reset App Data
            </Text>
            <Text className="text-sm text-white/80">
              Placeholder only. This will erase stored data and reload the app
              once implemented.
            </Text>
          </View>
          <ArrowPathIcon size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
