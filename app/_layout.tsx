import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";

import { AutoSyncManager } from "@/components/AutoSyncManager";
import { AuthProvider, useAuth } from "@/components/context/AuthContext";
import { AuthGuard } from "@/components/context/AuthGuard";
import { ExpenseProvider } from "@/components/context/ExpenseContext";
import { QueryContext } from "@/components/context/QueryContext";
import { useAppInit } from "@/lib/app";
import "@/lib/i18n";

import * as Sentry from "@sentry/react-native";
import "../global.css";

import { QrScanButton } from "@/components/ui/QrScanButton";
import { AboutCloseButton } from "@/components/ui/AboutCloseButton";
import { Colors } from "@/constants/Colors";
import { toastConfig } from "@/toast.config";
import { Stack } from "expo-router";
import React, { useEffect } from "react";
import Toast from "react-native-toast-message";

SplashScreen.preventAutoHideAsync().catch(() => {
  // SplashScreen might already be prevented from auto hiding; ignore errors
});

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
            headerTintColor: "white",
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
              headerRight: () => <QrScanButton context="rate" />,
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
          <Stack.Screen
            name="about"
            options={{
              title: "About",
              presentation: "modal",
              headerBackVisible: false,
              headerRight: () => <AboutCloseButton />,
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
    </ThemeProvider>
  );
}

export default Sentry.wrap(function RootLayout() {
  const { status } = useAppInit();
  const [loaded] = useFonts({
    ProximaNova: require("../assets/fonts/proximanova-regular.ttf"),
  });

  if (!loaded || status !== "ready") {
    return null;
  }

  return (
    <QueryContext>
      <AuthProvider>
        <AppReadyGate>
          <ExpenseProvider>
            <AutoSyncManager />
            <RootLayoutNav />
          </ExpenseProvider>
        </AppReadyGate>
      </AuthProvider>
    </QueryContext>
  );
});

function AppReadyGate({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  const authReady = isLoggedIn !== null;

  useEffect(() => {
    if (authReady) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [authReady]);

  if (!authReady) {
    return null;
  }

  return <>{children}</>;
}
