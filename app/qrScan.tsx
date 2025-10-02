import { useAuth } from "@/components/context/AuthContext";
import {
  BarcodeScanningResult,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type QRScanContext = "rate" | "project";

export default function App() {
  const { authInfo } = useAuth();
  const [isScanning, setIsScanning] = useState(true);
  const [permission, requestPermission] = useCameraPermissions();
  const { context, projectId, projectName } = useLocalSearchParams<{
    context: QRScanContext;
    projectId?: string;
    projectName?: string;
  }>();

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

        // Navigate back to rateSelect with the scanned rateId as a query parameter
        router.replace({
          pathname: "/rateSelect",
          params: {
            projectId: projectId || "",
            projectName: projectName || "",
            scannedRateId: rateId,
          },
        });
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
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={"front"}
        onBarcodeScanned={onBarCodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={onFakeScan}>
          <Text style={styles.text}>Fake Scan</Text>
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
  buttonContainer: {
    position: "absolute",
    bottom: 64,
    flexDirection: "row",
    backgroundColor: "transparent",
    width: "100%",
    paddingHorizontal: 64,
  },
  button: {
    flex: 1,
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
