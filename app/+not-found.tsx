import { tx } from "@/lib/i18n";
import { Link, Stack } from "expo-router";
import { Text, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: tx("navigation.notFoundOops") }} />
      <View className="flex-1 items-center justify-center p-5">
        <Text className="text-2xl font-semibold text-primaryfont">
          {tx("notFound.screenDoesNotExist")}
        </Text>

        <Link href="/" asChild>
          <Text className="mt-4 py-4 text-harvest underline">
            {tx("notFound.goHomeScreen")}
          </Text>
        </Link>
      </View>
    </>
  );
}
