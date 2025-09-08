import { useAuth } from "@/components/context/AuthContext";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Redirect } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { StyleSheet, TouchableOpacity } from "react-native";

WebBrowser.maybeCompleteAuthSession(); // needed to close the auth popup

export default function LoginScreen() {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) {
    return <Redirect href="/" />;
  }

  const onLoginPress = async () => {
    console.log("Login button pressed");
    // initiate the login process
    await WebBrowser.openBrowserAsync(
      process.env.EXPO_PUBLIC_LOGIN_URL ||
        "https://harvest-test.azurewebsites.net/caes/mobile/token"
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Welcome to Harvest
      </ThemedText>

      <TouchableOpacity style={[styles.button]} onPress={onLoginPress}>
        <ThemedText style={styles.buttonText}>
          {"Login with UC Davis"}
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    textAlign: "center",
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#0a7ea4",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
