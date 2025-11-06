import { useAuth } from "@/components/context/AuthContext";
import { Redirect } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { Image, Text, TouchableOpacity, View } from "react-native";

WebBrowser.maybeCompleteAuthSession(); // needed to close the auth popup

export default function LoginScreen() {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) {
    return <Redirect href="/" />;
  }

  const onLoginPress = async () => {
    console.log("Login button pressed");
    await WebBrowser.openBrowserAsync(
      process.env.EXPO_PUBLIC_LOGIN_URL ||
        "https://harvest.caes.ucdavis.edu/mobileToken"
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

        <Image
          source={require("../assets/images/caes-logo.png")}
          className="w-60 h-16 mx-auto my-6"
          resizeMode="contain"
        />
      </View>
    </View>
  );
}
