import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import { XMarkIcon } from "react-native-heroicons/outline";

export function AboutCloseButton() {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.back()}
      accessibilityLabel="Close About"
      accessibilityRole="button"
      hitSlop={12}
      style={{ paddingRight: 4 }}
    >
      <XMarkIcon size={26} color="white" />
    </TouchableOpacity>
  );
}
