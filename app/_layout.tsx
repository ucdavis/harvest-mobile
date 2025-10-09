import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { router, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { AutoSyncManager } from "@/components/AutoSyncManager";
import { AuthProvider } from "@/components/context/AuthContext";
import { AuthGuard } from "@/components/context/AuthGuard";
import { ExpenseProvider } from "@/components/context/ExpenseContext";
import { QueryContext } from "@/components/context/QueryContext";
import { useInitDb } from "@/hooks/useInitDb";

import * as Sentry from "@sentry/react-native";
import "../global.css";

import { Colors } from "@/constants/Colors";
import { toastConfig } from "@/toast.config";
import { HeaderButton } from "@react-navigation/elements";
import React from "react";
import { QrCodeIcon } from "react-native-heroicons/solid";
import Toast from "react-native-toast-message";

Sentry.init({
  dsn: "https://fab598815739ee48f41e03c092212c08@o4507619154657280.ingest.us.sentry.io/4510064547332096",

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

function RootLayoutNav() {
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: Colors.secondarybg,
    },
  };

  return (
    <ThemeProvider value={theme}>
      <AuthGuard>
      <Stack
        screenOptions={{
          headerShown: true,
          headerStyle: { backgroundColor: Colors.harvest },
          headerBackVisible: false,
          headerTitleStyle: { color: "white" },
          headerBackButtonDisplayMode: "minimal",
        }}
      >
        <Stack.Screen
          name="login"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="applink" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="addExpenses"
          options={{
            title: "New Activity",
            presentation: "card",
            headerBackVisible: true,
          }}
        />
        <Stack.Screen
          name="rateSelect"
          options={() => ({
            title: "Select Rate",
            presentation: "card",
            headerBackVisible: true,
            headerRight: () => (
              <HeaderButton
                accessibilityLabel="QR Scan"
                onPress={() =>
                  router.push({
                    pathname: "/qrScan",
                    params: {
                      context: "rate",
                    },
                  })
                }
              >
                <QrCodeIcon size={22} color={"#fff"} />
              </HeaderButton>
            ),
          })}
        />
        <Stack.Screen
          name="qrScan"
          options={{
            title: "Scan QR Code",
            presentation: "card",
            headerBackVisible: true,
          }}
        />
        <Stack.Screen
          name="expenseDetails"
          options={{
            headerShown: false,
            presentation: "modal",
          }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
      </AuthGuard>

      <Toast
        config={toastConfig}
        position="top"
        topOffset={60} // adjust for your header / safe area
        visibilityTime={2500}
        keyboardOffset={24} // iOS: avoid the keyboard
        autoHide
      />
      <StatusBar style="light" />
    </ThemeProvider>
  );
}

export default Sentry.wrap(function RootLayout() {
  const { status } = useInitDb();
  const [loaded] = useFonts({
    ProximaNova: require("../assets/fonts/proximanova-regular.ttf"),
  });

  if (!loaded || status !== "ready") {
    return null;
  }

  return (
    <QueryContext>
      <AuthProvider>
        <ExpenseProvider>
          <AutoSyncManager />
          <RootLayoutNav />
        </ExpenseProvider>
      </AuthProvider>
    </QueryContext>
  );
});
