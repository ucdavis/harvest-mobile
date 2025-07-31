import { useAuth } from "@/components/context/AuthContext";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { authConfig } from "@/lib/auth";
import {
  ResponseType,
  exchangeCodeAsync,
  useAuthRequest,
} from "expo-auth-session";
import { Redirect } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

WebBrowser.maybeCompleteAuthSession(); // needed to close the auth popup

export default function LoginScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const { isLoggedIn, login } = useAuth();

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: authConfig.clientId,
      redirectUri: authConfig.redirectUri,
      scopes: ["openid", "profile", "email", "offline_access"],
      extraParams: {
        domain_hint: "ucdavis.edu", // Optional: pre-fill the username field with this domain
      },
      responseType: ResponseType.Code,
    },
    authConfig.discovery
  );

  useEffect(() => {
    console.log("Auth response:", response);
    if (response?.type === "success" && isLoggedIn === false) {
      const { code } = response.params;

      exchangeCodeAsync(
        {
          clientId: authConfig.clientId,
          code,
          extraParams: { code_verifier: request?.codeVerifier || "" },
          redirectUri: authConfig.redirectUri,
        },
        authConfig.discovery
      )
        .then((tokenResponse) => {
          console.log("Token response:", tokenResponse);
          login(tokenResponse);
        })
        .catch((error) => {
          console.error("Error exchanging code for token:", error);
        });
    }
  }, [isLoggedIn, login, request?.codeVerifier, response]);

  console.log("LoginScreen rendered");

  if (isLoggedIn) {
    return <Redirect href="/" />;
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Welcome to Harvest
      </ThemedText>

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={() => {
          promptAsync();
        }}
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
