import { useAuth } from "@/components/context/AuthContext";
import { Rate } from "@/lib/expense";
import { logger } from "@/lib/logger";
import {
  extractRateIdFromUrl,
  validateTeamInUrl,
} from "@/lib/qr-scanner-utils";
import { useRates } from "@/services/queries/rates";
import {
  BarcodeScanningResult,
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function QRScanScreen() {
  const { projectId } = useLocalSearchParams<{ projectId: string }>();
  const { authInfo } = useAuth();
  const { data: rates } = useRates(authInfo);
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(true);
  const scanTimeout = useRef<NodeJS.Timeout | null>(null);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const handleBarcodeScanned = (result: BarcodeScanningResult) => {
    if (!isScanning) return;

    // Prevent multiple scans
    setIsScanning(false);

    // Provide haptic feedback
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    logger.info("QR code scanned", { data: result.data });

    try {
      const scannedData = result.data.trim();

      // Extract rate ID from the URL format: .../{team}/Rate/Details/{id}
      const rateId = extractRateIdFromUrl(scannedData);

      if (!rateId) {
        throw new Error(
          "Invalid QR code format - could not extract rate ID from URL"
        );
      }

      // Validate that the URL contains the correct team (if we have auth info)
      if (authInfo?.team && !validateTeamInUrl(scannedData, authInfo.team)) {
        Alert.alert(
          "Wrong Team",
          `This QR code is for a different team. Please scan a QR code for team "${authInfo.team}".`,
          [
            {
              text: "Try Again",
              onPress: () => {
                scanTimeout.current = setTimeout(() => {
                  setIsScanning(true);
                }, 1000);
              },
            },
            {
              text: "Cancel",
              onPress: () => router.back(),
            },
          ]
        );
        return;
      }

      // Find the rate in our cached rates data
      const rate: Rate | undefined = rates?.find((r) => r.id === rateId);

      if (!rate) {
        logger.warn("Rate not found in cached data", {
          rateId,
          availableRates: rates?.length,
        });
        Alert.alert(
          "Rate Not Found",
          `The scanned rate (ID: ${rateId}) was not found in the available rates. The rate may be inactive or you may not have permission to use it.`,
          [
            {
              text: "Try Again",
              onPress: () => {
                scanTimeout.current = setTimeout(() => {
                  setIsScanning(true);
                }, 1000);
              },
            },
            {
              text: "Cancel",
              onPress: () => router.back(),
            },
          ]
        );
        return;
      }

      logger.info("Successfully found rate from QR scan", {
        rateId,
        rateDescription: rate.description,
        rateType: rate.type,
      });

      // Navigate to expense details with the found rate
      router.push({
        pathname: "/expenseDetails",
        params: {
          rate: JSON.stringify(rate),
          projectId: projectId || "",
        },
      });
    } catch (error) {
      logger.error("Failed to process QR code data", error, {
        qrData: result.data,
        projectId,
      });

      Alert.alert(
        "Invalid QR Code",
        "The scanned QR code does not contain a valid rate URL. Please try scanning a different code.",
        [
          {
            text: "Try Again",
            onPress: () => {
              // Re-enable scanning after a short delay
              scanTimeout.current = setTimeout(() => {
                setIsScanning(true);
              }, 1000);
            },
          },
          {
            text: "Cancel",
            onPress: () => router.back(),
          },
        ]
      );
    }
  };

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  const handleCancel = () => {
    if (scanTimeout.current) {
      clearTimeout(scanTimeout.current);
    }
    router.back();
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        onBarcodeScanned={isScanning ? handleBarcodeScanned : undefined}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
      />

      {/* Scanning overlay */}
      <View style={styles.overlay}>
        <View style={styles.scanArea} />
        <Text style={styles.instructionText}>
          Scan a Harvest rate QR code to add it to your expense
        </Text>
      </View>

      {/* Control buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleCancel}>
          <Text style={styles.text}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
          <Text style={styles.text}>Flip Camera</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: "#00FF00",
    borderRadius: 10,
    backgroundColor: "transparent",
  },
  instructionText: {
    position: "absolute",
    bottom: 150,
    color: "white",
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 64,
    flexDirection: "row",
    backgroundColor: "transparent",
    width: "100%",
    paddingHorizontal: 32,
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    minWidth: 80,
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
});
