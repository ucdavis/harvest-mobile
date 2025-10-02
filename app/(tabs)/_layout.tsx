// app/(tabs)/_layout.tsx
import { useAuth } from "@/components/context/AuthContext";
import { Colors } from "@/constants/Colors";
import { Redirect, Slot } from "expo-router";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";

export default function TabLayout() {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Redirect href="/login" />;
  }

  return (
    <NativeTabs

      labelStyle={{ color: Colors.primaryfont }}
    >
      {/* Dashboard */}
      <NativeTabs.Trigger name="index">
        <Icon
          sf={{ default: "house", selected: "house.fill" }}
          selectedColor={Colors.harvest}
        />
        <Label selectedStyle={{ color: Colors.harvest }}>Dashboard</Label>
      </NativeTabs.Trigger>

      {/* All Projects */}
      <NativeTabs.Trigger name="projects">
        <Icon
          sf={{
            default: "list.bullet.rectangle",
            selected: "list.bullet.rectangle.fill",
          }}
          selectedColor={Colors.harvest}
        />
        <Label selectedStyle={{ color: Colors.harvest }}>All Projects</Label>
      </NativeTabs.Trigger>

      {/* Settings */}
      <NativeTabs.Trigger name="settings">
        <Icon sf={{ default: "gearshape", selected: "gearshape.fill" }} selectedColor={Colors.harvest} />
        <Label selectedStyle={{ color: Colors.harvest }}>Settings</Label>
      </NativeTabs.Trigger>

      <Slot />
    </NativeTabs>
  );
}
