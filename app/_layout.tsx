import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { AuthProvider } from "@/components/context/AuthContext";
import { QueryContext } from "@/components/context/QueryContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useInitDb } from "@/hooks/useInitDb";

import "../global.css";

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
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
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const { status } = useInitDb();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded || status !== "ready") {
    return null;
  }

  return (
    <QueryContext>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </QueryContext>
  );
}
