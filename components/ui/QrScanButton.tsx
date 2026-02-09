import { HeaderButton } from "@react-navigation/elements";
import { router } from "expo-router";
import { QrCodeIcon } from "react-native-heroicons/solid";

import type { QRScanContext } from "@/app/qrScan";
import { tx } from "@/lib/i18n";

type QrScanButtonProps = {
  context: QRScanContext;
};

export const QrScanButton = ({ context }: QrScanButtonProps) => (
  <HeaderButton
    accessibilityLabel={tx("components.ui.qrScanAccessibilityLabel")}
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
