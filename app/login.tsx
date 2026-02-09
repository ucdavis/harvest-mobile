import { useAuth } from "@/components/context/AuthContext";
import { tx } from "@/lib/i18n";
import { Redirect, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { InformationCircleIcon } from "react-native-heroicons/outline";
import { useSafeAreaInsets } from "react-native-safe-area-context";

WebBrowser.maybeCompleteAuthSession(); // needed to close the auth popup

export default function LoginScreen() {
  const { isLoggedIn } = useAuth();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  if (isLoggedIn) {
    return <Redirect href="/" />;
  }

  const onLoginPress = async () => {
    await WebBrowser.openBrowserAsync(
      process.env.EXPO_PUBLIC_LOGIN_URL ||
        "https://harvest-test.azurewebsites.net/mobileToken"
    );
  };

  return (
    <View className="flex-1 p-4">
      <TouchableOpacity
        onPress={() => router.push("/about")}
        className="absolute right-4 rounded-full bg-harvest/90 px-2 py-2"
        style={{ top: insets.top + 12, zIndex: 10 }}
        accessibilityRole="button"
        accessibilityLabel={tx("auth.aboutThisAppAccessibilityLabel")}
      >
        <InformationCircleIcon size={22} color="#fff" />
      </TouchableOpacity>

      <View className="flex-1 items-center justify-center">
        <Image
          source={require("../assets/images/studentfarmer.png")}
          className="w-56 h-56"
          resizeMode="contain"
        />
      </View>

      <View className="pb-6">
        <Text className="text-harvest text-center text-4xl font-bold">
          {tx("auth.welcomeToHarvest")}
        </Text>

        <TouchableOpacity
          className="harvest-button my-6"
          onPress={onLoginPress}
        >
          <Text className="harvest-button-text">
            {tx("auth.loginWithUCDavis")}
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
