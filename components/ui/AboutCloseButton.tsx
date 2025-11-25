import { HeaderButton } from "@react-navigation/elements";
import { useRouter } from "expo-router";
import { XMarkIcon } from "react-native-heroicons/outline";

export function AboutCloseButton() {
  const router = useRouter();

  return (
    <HeaderButton
      accessibilityLabel="Close About"
      onPress={() => router.back()}
    >
      <XMarkIcon size={22} color="#fff" />
    </HeaderButton>
  );
}
