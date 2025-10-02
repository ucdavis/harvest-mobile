import {
  BarcodeScanningResult,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { CameraIcon, ShieldCheckIcon } from "react-native-heroicons/outline";

import { useAuth } from "@/components/context/AuthContext";
import { useExpenses } from "@/components/context/ExpenseContext";

type QRScanContext = "rate" | "project";

export default function App() {
  const { authInfo } = useAuth();
  const { setScannedRateId } = useExpenses();
  const [isScanning, setIsScanning] = useState(true);
  const [permission, requestPermission] = useCameraPermissions();
  const { context } = useLocalSearchParams<{
    context: QRScanContext;
  }>();

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View className="flex-1 bg-secondary p-6">
        <View className="flex-1 justify-center items-center">
          {/* Header Section */}
          <View className="items-center mb-8">
            <View className="bg-harvest/10 p-4 rounded-full mb-4">
              <CameraIcon size={64} color="#266041" />
            </View>
            <Text className="text-2xl font-bold text-primaryfont text-center mb-2">
              Camera Access Required
            </Text>
            <Text className="text-base text-primaryfont/60 text-center leading-6">
              To scan QR codes, we need permission to access your camera
            </Text>
          </View>

          {/* Features Section */}
          <View className="w-full mb-8">
            <View className="flex-row items-center mb-4 bg-white p-4 rounded-xl border border-primaryborder">
              <View className="bg-harvest/10 p-2 rounded-lg mr-3">
                <ShieldCheckIcon size={24} color="#266041" />
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-primaryfont mb-1">
                  Privacy Protected
                </Text>
                <Text className="text-sm text-primaryfont/60">
                  Your camera is only used for scanning QR codes
                </Text>
              </View>
            </View>
          </View>

          {/* Action Button */}
          <TouchableOpacity
            className="harvest-button w-full"
            onPress={requestPermission}
          >
            <Text className="harvest-button-text">Grant Camera Permission</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const onFakeScan = () => {
    // Simulate scanning a QR code for testing purposes
    if (context === "rate") {
      const fakeRateId = "32";

      onBarCodeScanned({
        data: `https://example.com/caes/rate/details/${fakeRateId}`,
        type: "QR",
        cornerPoints: [],
        bounds: {
          origin: { x: 0, y: 0 },
          size: { width: 100, height: 100 },
        },
      });
    } else if (context === "project") {
      const fakeProjectId = "66";
      onBarCodeScanned({
        data: `https://example.com/caes/project/details/${fakeProjectId}`,
        type: "QR",
        cornerPoints: [],
        bounds: {
          origin: { x: 0, y: 0 },
          size: { width: 100, height: 100 },
        },
      });
    }
  };

  const onBarCodeScanned = (result: BarcodeScanningResult) => {
    console.log("QR Code scanned:", result);

    if (!isScanning) return; // prevent multiple scans
    setIsScanning(false);

    try {
      const scannedData = result.data.trim();

      const url = new URL(scannedData);
      // Check to make sure the scanned QR code matches the expected context
      // https://<host>/<team>/project/details/<project_id>
      // or https://<host>/<team>/rate/details/<rate_id>

      const pathSegments = url.pathname.split("/").filter(Boolean);
      const expectedType = pathSegments.find((segment) => segment === context);

      if (!expectedType) {
        console.warn(`Expected QR code for ${context} but got different type`);
        setIsScanning(true); // Allow scanning again
        return;
      }

      // now make sure team in the URL matches the current team
      const teamInUrl = pathSegments[0];
      if (teamInUrl !== authInfo?.team) {
        console.warn(
          `Scanned QR code for team ${teamInUrl} but current team is ${authInfo?.team}`
        );
        setIsScanning(true); // Allow scanning again
        return;
      }

      console.log(`Valid ${context} QR code scanned`);
      // TODO: Process the scanned data based on context

      if (context === "rate") {
        // Process rate QR code
        const rateId = pathSegments[pathSegments.length - 1];

        // Store the scanned rate ID in context and navigate back
        setScannedRateId(rateId);
        router.back();
      } else if (context === "project") {
        const scannedProjectId = pathSegments[pathSegments.length - 1];
        // Process project QR code
        // TODO: Handle project QR code scanning
        console.log(`Scanned project ID: ${scannedProjectId}`);
      }

      // url is
    } catch (error) {
      console.error("Error processing scanned data:", error);
    }
  };

  return (
    <View className="flex-1 justify-center">
      <CameraView
        className="flex-1"
        facing={"front"}
        onBarcodeScanned={onBarCodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
      />
      <View className="absolute bottom-16 flex-row w-full px-8">
        <TouchableOpacity
          className="flex-1 bg-harvest/90 py-4 px-6 rounded-xl items-center border border-white/20"
          onPress={onFakeScan}
        >
          <Text className="text-xl font-bold text-white">
            🔍 Fake Scan (Testing)
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
