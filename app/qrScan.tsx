import { CameraView, useCameraPermissions } from "expo-camera";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function QrScanScreen() {
  const { projectId } = useLocalSearchParams<{ projectId?: string }>();
  const [permission, requestPermission] = useCameraPermissions();
  const [active, setActive] = useState(true);
  const locked = useRef(false); // simple debounce to prevent duplicate fires

  useEffect(() => {
    if (!permission) return;
    if (!permission.granted) requestPermission();
  }, [permission]);

  if (!permission) return <View style={{ flex: 1, backgroundColor: "black" }} />;
  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <Text className="text-white mb-3">We need your permission to use the camera.</Text>
        <TouchableOpacity onPress={requestPermission} className="px-4 py-2 bg-white/10 rounded-xl">
          <Text className="text-white">Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const onScan = ({ data }: { type: string; data: string }) => {
    if (locked.current) return;
    locked.current = true;
    setActive(false);

    // TODO: adapt this to your QR format
    // Example: send the QR payload forward to expenseDetails
    router.replace({
      pathname: "/expenseDetails",
      params: {
        projectId: projectId ?? "",
        qr: data, // handle in ExpenseDetails or resolve to a Rate first
      },
    });
  };

  return (
    <View className="flex-1 bg-black">
      <CameraView
        style={{ flex: 1 }}
        active={active}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={onScan}
      />
      {/* Top bar */}
      <View className="absolute top-0 left-0 right-0 p-4 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => router.back()} className="px-3 py-2 bg-white/10 rounded-xl">
          <Text className="text-white">Close</Text>
        </TouchableOpacity>
        <Text className="text-white font-semibold">Scan a QR Code</Text>
        <View style={{ width: 72 }} />
      </View>

      {/* Optional overlay box */}
      <View className="absolute inset-0 items-center justify-center pointer-events-none">
        <View className="w-64 h-64 border-2 border-white/70 rounded-2xl" />
        <Text className="text-white mt-4">Align QR inside the box</Text>
      </View>
    </View>
  );
}