import { HeaderButton } from "@react-navigation/elements";
import { tx } from "@/lib/i18n";
import { useRouter } from "expo-router";
import { XMarkIcon } from "react-native-heroicons/outline";

export function AboutCloseButton() {
  const router = useRouter();

  return (
    <HeaderButton
      accessibilityLabel={tx("components.ui.closeAboutAccessibilityLabel")}
      onPress={() => router.back()}
    >
      <XMarkIcon size={22} color="#fff" />
    </HeaderButton>
  );
}
