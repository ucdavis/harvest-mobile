import { Colors } from "@/constants/Colors";
import { Stack } from "expo-router";

export default function TabsStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: Colors.harvest },
        headerTitleStyle: { color: "white" },
        headerTintColor: "white",
        headerTitle: "Settings",
      }}
    />
  );
}
