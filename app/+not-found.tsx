import { Link, Stack } from "expo-router";
import { Text, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View className="flex-1 items-center justify-center p-5">
        <Text className="text-2xl font-semibold text-primary-font">
          This screen does not exist.
        </Text>

        <Link href="/" asChild>
          <Text className="mt-4 py-4 text-harvest underline">
            Go to home screen!
          </Text>
        </Link>
      </View>
    </>
  );
}
