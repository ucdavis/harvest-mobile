import Constants from "expo-constants";
import { useCallback, useState } from "react";
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
import { tx } from "@/lib/i18n";
import { logger } from "@/lib/logger";

export default function AboutScreen() {
  const [isResetting, setIsResetting] = useState(false);

  const appName = Constants.expoConfig?.name || tx("about.defaultAppName");
  const appVersion =
    Constants.expoConfig?.version || tx("about.unknownVersion");

  const handleResetPress = useCallback(() => {
    if (isResetting) return;

    Alert.alert(
      tx("about.alerts.resetTitle"),
      tx("about.alerts.resetMessage"),
      [
        { text: tx("about.alerts.cancel"), style: "cancel" },
        {
          text: tx("about.alerts.resetAction"),
          style: "destructive",
          onPress: async () => {
            setIsResetting(true);

            try {
              await resetAppState();
              Alert.alert(
                tx("about.alerts.resetCompleteTitle"),
                tx("about.alerts.resetCompleteMessage")
              );
            } catch (error) {
              logger.error("About: clearAllData failed", error);
              Alert.alert(
                tx("about.alerts.resetFailedTitle"),
                tx("about.alerts.resetFailedMessage")
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
      Alert.alert(
        tx("about.alerts.unableToOpenLinkTitle"),
        tx("about.alerts.unableToOpenLinkMessage")
      );
    });
  };

  return (
    <ScrollView
      className="flex-1 bg-secondarybg"
      contentContainerStyle={{ padding: 16 }}
      accessibilityLabel={tx("about.accessibilityLabel")}
    >
      <View className="card">
        <Text className="text-md uppercase font-bold text-harvest tracking-tight">
          {tx("about.title")}
        </Text>
        <Text className="text-2xl font-semibold text-primaryfont mt-2">
          {appName}
        </Text>
        <Text className="text-base text-primaryfont/80 mt-2">
          {tx("about.description")}
        </Text>

        <View className="mt-4 space-y-2">
          <View className="flex-row justify-between">
            <Text className="text-base font-semibold text-primaryfont">
              {tx("about.versionLabel")}
            </Text>
            <Text className="text-base text-primaryfont/80">{appVersion}</Text>
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-base font-semibold text-primaryfont">
              {tx("about.supportLabel")}
            </Text>
            <TouchableOpacity
              onPress={handleSupportPress}
              className="flex-row items-center gap-2"
              accessibilityRole="link"
              accessibilityLabel={tx("about.supportLinkAccessibilityLabel")}
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
          {tx("about.troubleshootingTitle")}
        </Text>
        <Text className="text-base text-primaryfont mt-2">
          {tx("about.troubleshootingDescription")}
        </Text>

        <TouchableOpacity
          onPress={handleResetPress}
          className="flex-row items-center justify-between bg-merlot rounded-md mt-4 px-4 py-3"
          accessibilityRole="button"
          accessibilityLabel={tx("about.resetButtonAccessibilityLabel")}
          accessibilityHint={tx("about.resetButtonAccessibilityHint")}
          disabled={isResetting}
          style={isResetting ? { opacity: 0.7 } : undefined}
          activeOpacity={0.9}
        >
          <View className="flex-1 pr-3">
            <Text className="text-lg font-semibold text-white">
              {isResetting
                ? tx("about.resettingLabel")
                : tx("about.resetButtonLabel")}
            </Text>
            <Text className="text-sm text-white/80">
              {tx("about.resetButtonDescription")}
            </Text>
          </View>
          <ArrowPathIcon size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
