import { useAuth } from "@/components/context/AuthContext";
import { Redirect } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";

WebBrowser.maybeCompleteAuthSession(); // needed to close the auth popup

export default function LoginScreen() {
  const { isLoggedIn, clearAllData } = useAuth();
  const [isClearing, setIsClearing] = useState(false);

  if (isLoggedIn) {
    return <Redirect href="/" />;
  }

  const onLoginPress = async () => {
    await WebBrowser.openBrowserAsync(
      process.env.EXPO_PUBLIC_LOGIN_URL ||
        "https://harvest-test.azurewebsites.net/mobileToken"
    );
  };

  const onClearAllDataPress = () => {
    Alert.alert(
      "Clear All Data",
      "This will delete all stored data including authentication tokens, cached projects, and offline expenses. This action cannot be undone. Are you sure?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear All Data",
          style: "destructive",
          onPress: async () => {
            setIsClearing(true);
            try {
              await clearAllData();
              Alert.alert(
                "Success",
                "All data has been cleared. You can now login again."
              );
            } catch {
              Alert.alert(
                "Error",
                "Failed to clear all data. Please try again or reinstall the app."
              );
            } finally {
              setIsClearing(false);
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

        <TouchableOpacity
          className="bg-danger py-3 px-6 rounded-lg my-2"
          onPress={onClearAllDataPress}
          disabled={isClearing}
        >
          <Text className="text-white text-center font-semibold">
            {isClearing ? "Clearing..." : "Clear All Data"}
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
