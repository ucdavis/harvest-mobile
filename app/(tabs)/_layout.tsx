import { Redirect, Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { useAuth } from "@/components/context/AuthContext";
import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { useColorScheme } from "@/hooks/useColorScheme";

// ✅ Heroicons (solid set)
import {
  ArrowRightOnRectangleIcon,
  ClockIcon,
  ListBulletIcon,
} from "react-native-heroicons/solid";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#266041",
        tabBarInactiveTintColor: "#b7b7b7",
        headerShown: true,
        headerStyle: { backgroundColor: "#266041" },
        headerTintColor: "#fff",
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
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
          tabBarIcon: ({ color }) => <ListBulletIcon size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="logout"
        options={{
          title: "Log out",
          tabBarIcon: ({ color }) => (
            <ArrowRightOnRectangleIcon size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
