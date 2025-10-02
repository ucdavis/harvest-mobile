import { useAuth } from "@/components/context/AuthContext";
import { HapticTab } from "@/components/HapticTab";
import { Colors } from "@/constants/Colors";
import { HeaderButton } from "@react-navigation/elements";
import { Redirect, router, Tabs } from "expo-router";
import { Platform } from "react-native";
import {
  ClipboardDocumentListIcon,
  ClockIcon,
  CogIcon,
  QrCodeIcon,
} from "react-native-heroicons/solid";

export default function TabLayout() {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: Colors.harvest },
        headerTitleStyle: { color: "white" },
        headerBackButtonDisplayMode: "minimal",
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
          headerRight: () => <ProjectQrScan />,
        }}
      />
      <Tabs.Screen
        name="projects"
        options={{
          title: "All Projects",
          tabBarIcon: ({ color }) => (
            <ClipboardDocumentListIcon size={28} color={color} />
          ),
          headerRight: () => <ProjectQrScan />,
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
