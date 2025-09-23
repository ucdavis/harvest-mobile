import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { AutoSyncManager } from "@/components/AutoSyncManager";
import { AuthProvider } from "@/components/context/AuthContext";
import { ExpenseProvider } from "@/components/context/ExpenseContext";
import { QueryContext } from "@/components/context/QueryContext";
import { useInitDb } from "@/hooks/useInitDb";

import * as Sentry from "@sentry/react-native";
import "../global.css";

import Toast, {BaseToast} from "react-native-toast-message";

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
      background: "#f7f7f7",
    },
  };

  return (
    <ThemeProvider value={theme}>
      <Stack
        screenOptions={{
          headerShown: false,
          headerStyle: { backgroundColor: "#266041" },
          headerTintColor: "#fff",
        }}
      >
        <Stack.Screen name="login" />
        <Stack.Screen name="(tabs)" options={{ title: "Harvest" }} />
        <Stack.Screen
          name="addExpenses"
          options={{
            headerShown: true,
            title: "Add Expense",
            presentation: "card",
          }}
        />
        <Stack.Screen
          name="rateSelect"
          options={{
            headerShown: false,
            presentation: "modal",
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
      <Toast
  config={{
    success: (props) => (
      <BaseToast
        {...props}
        style={{ backgroundColor: "#fff" }} 
        text1Style={{
          fontSize: 16,
          fontWeight: "600",
        }}
      />
    ),
  }}
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
