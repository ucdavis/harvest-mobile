import { useAuth } from "@/components/context/AuthContext";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Redirect, router } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, TouchableOpacity } from "react-native";

export default function LoginScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const { isLoggedIn, login } = useAuth();

  console.log("LoginScreen rendered");

  if (isLoggedIn) {
    return <Redirect href="/" />;
  }

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      login("dummy_token");
      router.replace("/");
    } catch {
      Alert.alert("Error", "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Welcome to Harvest
      </ThemedText>

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={isLoading}
      >
        <ThemedText style={styles.buttonText}>
          {isLoading ? "Signing In..." : "Login with UC Davis"}
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
