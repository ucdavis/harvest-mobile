import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect } from "react";
import { Alert, View } from "react-native";

import { useAuth } from "@/components/context/AuthContext";
import { useExpenses } from "@/components/context/ExpenseContext";
import { RatesList } from "@/components/rates/RatesList";
import { Rate } from "@/lib/expense";
import { useRates } from "@/services/queries/rates";

export default function RateSelectScreen() {
  const { authInfo } = useAuth();
  const { scannedRateId, setScannedRateId } = useExpenses();
  const { projectId, projectName } = useLocalSearchParams<{
    projectId: string;
    projectName: string;
  }>();
  const { data: rates, isLoading, error } = useRates(authInfo);

  const handleRateSelect = useCallback(
    (rate: Rate) => {
      router.push({
        pathname: "/expenseDetails",
        params: {
          rate: JSON.stringify(rate),
          projectId: projectId || "",
          projectName,
        },
      });
    },
    [projectId, projectName]
  );

  // Handle scanned rate ID
  useEffect(() => {
    if (scannedRateId && rates) {
      const scannedRate = rates.find(
        (rate) => rate.id.toString() === scannedRateId
      );
      if (scannedRate) {
        // Clear the scanned rate ID to prevent re-triggering
        setScannedRateId(null);
        handleRateSelect(scannedRate);
      } else {
        Alert.alert(
          "Rate Not Found",
          `The scanned rate (ID: ${scannedRateId}) is not valid. Please scan a valid rate QR code or select a rate from the list.`,
          [
            {
              text: "OK",
              onPress: () => setScannedRateId(null),
            },
          ]
        );
        // Clear the invalid scanned rate ID
        setScannedRateId(null);
      }
    }
  }, [scannedRateId, rates, handleRateSelect, setScannedRateId]);

  return (
    <View className="flex-1 bg-secondarybg">
      {/* Rates List */}
      <RatesList
        rates={rates || []}
        queryKey={["rates", authInfo?.team]}
        onRatePress={handleRateSelect}
        isLoading={isLoading}
        error={error}
      />
    </View>
  );
}
