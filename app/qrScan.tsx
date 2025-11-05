import {
  BarcodeScanningResult,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { CameraIcon, ShieldCheckIcon } from "react-native-heroicons/outline";

import { useAuth } from "@/components/context/AuthContext";
import { useExpenses } from "@/components/context/ExpenseContext";
import { Colors } from "@/constants/Colors";

export type QRScanContext = "rate" | "project";

export default function App() {
  const { authInfo } = useAuth();
  const { setScannedRateId, setScannedProjectId } = useExpenses();
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
              <CameraIcon size={64} color={Colors.harvest} />
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
            <Text className="harvest-button-text">Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const onFakeScan = (testType: "rate32" | "project66" | "rate999") => {
    // Simulate scanning different QR codes for testing purposes
    let fakeData: string;

    switch (testType) {
      case "rate32":
        fakeData = `https://example.com/caes/rate/details/32`;
        break;
      case "project66":
        fakeData = `https://example.com/caes/project/details/66`;
        break;
      case "rate999":
        fakeData = `https://example.com/caes/rate/details/999`;
        break;
    }

    onBarCodeScanned({
      data: fakeData,
      type: "QR",
      cornerPoints: [],
      bounds: {
        origin: { x: 0, y: 0 },
        size: { width: 100, height: 100 },
      },
    });
  };

  const onBarCodeScanned = (result: BarcodeScanningResult) => {
    if (!isScanning) return; // prevent multiple scans
    setIsScanning(false);

    try {
      const scannedData = result.data.trim();

      const url = new URL(scannedData);
      // Check to make sure the scanned QR code matches the expected context
      // https://<host>/<team>/project/details/<project_id>
      // or https://<host>/<team>/rate/details/<rate_id>

      const pathSegments = url.pathname.split("/").filter(Boolean);
      const expectedType = pathSegments.find(
        (segment) => segment.toLowerCase() === context.toLowerCase()
      );

      if (!expectedType) {
        Alert.alert(
          "Wrong QR Code Type",
          `This QR code is not for ${context === "rate" ? "a rate" : "a project"}. Please scan a ${context} QR code.`,
          [
            {
              text: "Try Again",
              onPress: () => setIsScanning(true),
            },
          ]
        );
        return;
      }

      // now make sure team in the URL matches the current team
      const teamInUrl = pathSegments[0];
      if (teamInUrl.toLowerCase() !== authInfo?.team?.toLowerCase()) {
        Alert.alert(
          "Wrong Team",
          `This QR code belongs to team "${teamInUrl}" but you're currently working with team "${authInfo?.team}". Please scan a QR code for your current team.`,
          [
            {
              text: "Try Again",
              onPress: () => setIsScanning(true),
            },
          ]
        );
        return;
      }

      // we're going to extract the ids and use our expense context to store them and then dismiss this QR scan screen
      if (context === "rate") {
        const rateId = pathSegments[pathSegments.length - 1];
        setScannedRateId(rateId);
        router.back();
      } else if (context === "project") {
        const scannedProjectId = pathSegments[pathSegments.length - 1];
        setScannedProjectId(scannedProjectId);
        router.back();
      }
    } catch {
      // something went wrong, probably an invalid URL, so let's let them scan again after showing an error
      setIsScanning(true);
      Alert.alert(
        "Invalid QR Code",
        "The scanned QR code is not valid. Please try again.",
        [
          {
            text: "OK",
            onPress: () => setIsScanning(true),
          },
        ]
      );
    }
  };

  return (
    <View className="flex-1 justify-center bg-black">
      <CameraView
        style={{ flex: 1 }}
        facing="back"
        onBarcodeScanned={onBarCodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        animateShutter={false}
      />
      {__DEV__ && (
        <View className="absolute bottom-16 w-full px-4">
          <View className="bg-black/70 p-4 rounded-xl">
            <Text className="text-white text-center font-bold mb-3">
              Testing Buttons
            </Text>
            <View className="space-y-2">
              <TouchableOpacity
                className="bg-harvest/90 py-3 px-4 rounded-lg items-center border border-white/20"
                onPress={() => onFakeScan("rate32")}
              >
                <Text className="text-white font-semibold">
                  🔍 Rate Scan (ID: 32)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-blue-600/90 py-3 px-4 rounded-lg items-center border border-white/20"
                onPress={() => onFakeScan("project66")}
              >
                <Text className="text-white font-semibold">
                  🏗️ Project Scan (ID: 66)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-red-600/90 py-3 px-4 rounded-lg items-center border border-white/20"
                onPress={() => onFakeScan("rate999")}
              >
                <Text className="text-white font-semibold">
                  ❌ Rate Scan (Bad ID: 999)
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
