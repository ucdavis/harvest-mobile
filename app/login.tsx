import { useAuth } from "@/components/context/AuthContext";
import { Redirect } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";

WebBrowser.maybeCompleteAuthSession(); // needed to close the auth popup

export default function LoginScreen() {
  const { isLoggedIn, clearAllData } = useAuth();

  if (isLoggedIn) {
    return <Redirect href="/" />;
  }

  const onLoginPress = async () => {
    await WebBrowser.openBrowserAsync(
      process.env.EXPO_PUBLIC_LOGIN_URL ||
        "https://harvest-test.azurewebsites.net/mobileToken"
    );
  };

  const onClearDataPress = async () => {
    Alert.alert(
      "Clear All App Data",
      "This will remove all stored data including login info, cached data, and the local database. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear Data",
          style: "destructive",
          onPress: async () => {
            try {
              await clearAllData();

              Alert.alert(
                "Data Cleared",
                "All app data has been cleared. Please restart the app.",
                [{ text: "OK" }]
              );
            } catch {
              Alert.alert(
                "Error",
                "Failed to clear some data. Please try uninstalling the app.",
                [{ text: "OK" }]
              );
            }
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 p-4">
      <View className="flex-1 items-center justify-center">
        <Image
          source={require("../assets/images/studentfarmer.png")}
          className="w-56 h-56"
          resizeMode="contain"
        />
      </View>

      <View className="pb-6">
        <Text className="text-harvest text-center text-4xl font-bold">
          Welcome to Harvest
        </Text>

        <TouchableOpacity
          className="harvest-button my-6"
          onPress={onLoginPress}
        >
          <Text className="harvest-button-text">Login with UC Davis</Text>
        </TouchableOpacity>

        {/* Troubleshooting button */}
        <TouchableOpacity
          className="border border-harvest rounded-lg py-3 px-6 mt-2"
          onPress={onClearDataPress}
        >
          <Text className="text-harvest text-center font-semibold">
            Troubleshooting: Clear All Data
          </Text>
        </TouchableOpacity>

        <Image
          source={require("../assets/images/caes-logo.png")}
          className="w-60 h-16 mx-auto my-6"
          resizeMode="contain"
        />
      </View>
    </View>
  );
}
