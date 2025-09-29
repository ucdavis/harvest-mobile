// app/(tabs)/_layout.tsx
import { HapticTab } from "@/components/HapticTab";
import { Colors } from "@/constants/Colors";
import { useNavigation } from "@react-navigation/native";
import { Tabs, useSegments } from "expo-router";
import { useEffect } from "react";
import { Platform } from "react-native";
import { ClipboardDocumentListIcon, ClockIcon, CogIcon } from "react-native-heroicons/solid";

export default function TabLayout() {
  const navigation = useNavigation();
  const segments = useSegments(); // gives you the current route segments

  const titles: Record<string, string> = {
    index: "Recent Projects",
    projects: "All Projects",
    settings: "Settings",
  };

  useEffect(() => {
    const active = segments[1] ?? "";
    navigation.setOptions({ title: titles[active] || "Harvest" });
  }, [segments, navigation]);
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // tabs manage no headers
        tabBarActiveTintColor: Colors.harvest,
        tabBarInactiveTintColor: "#b7b7b7",
        tabBarButton: HapticTab,
        tabBarStyle: Platform.select({
          ios: { position: "absolute" },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Recent Projects",
          tabBarIcon: ({ color }) => <ClockIcon size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="projects"
        options={{
          title: "All Projects",
          tabBarIcon: ({ color }) => <ClipboardDocumentListIcon size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => <CogIcon size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}
