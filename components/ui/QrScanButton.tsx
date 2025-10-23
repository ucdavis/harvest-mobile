import { HeaderButton } from "@react-navigation/elements";
import { router } from "expo-router";
import { QrCodeIcon } from "react-native-heroicons/solid";

import type { QRScanContext } from "@/app/qrScan";

type QrScanButtonProps = {
  context: QRScanContext;
};

export const QrScanButton = ({ context }: QrScanButtonProps) => (
  <HeaderButton
    accessibilityLabel="QR Scan"
    onPress={() =>
      router.push({
        pathname: "/qrScan",
        params: {
          context,
        },
      })
    }
  >
    <QrCodeIcon size={22} color="#fff" />
  </HeaderButton>
);
