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

import "../global.css";

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
      <StatusBar style="light" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
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
}
