import { Colors } from "@/constants/Colors";
import { HeaderButton } from "@react-navigation/elements";
import { router, Stack } from "expo-router";
import React from "react";
import { QrCodeIcon } from "react-native-heroicons/solid";

const ProjectQrScan = () => (
  <HeaderButton
    accessibilityLabel="QR Scan"
    onPress={() =>
      router.push({
        pathname: "/qrScan",
        params: {
          context: "project",
        },
      })
    }
  >
    <QrCodeIcon size={22} color={"#fff"} />
  </HeaderButton>
);

export default function TabsStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: Colors.harvest },
        headerTitleStyle: { color: "white" },
        headerTintColor: "white",
        headerTitle: "All Projects",
        headerRight: () => <ProjectQrScan />
      }}
    />
  );
}
