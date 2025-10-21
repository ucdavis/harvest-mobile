// components/QrScanButton.tsx
import { HeaderButton } from "@react-navigation/elements";
import { router } from "expo-router";
import {
  QrCodeIcon,
} from "react-native-heroicons/solid";

export const QrScanButton = () => (
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
    <QrCodeIcon size={22} color="#fff" />
  </HeaderButton>
);
