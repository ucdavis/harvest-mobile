import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  InputAccessoryView,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  CubeIcon,
  ExclamationTriangleIcon,
  QuestionMarkCircleIcon,
  UserIcon,
  WrenchScrewdriverIcon,
} from "react-native-heroicons/solid";

import { useExpenses } from "@/components/context/ExpenseContext";
import { createExpenseWithUniqueId, Rate } from "@/lib/expense";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ExpenseDetailsScreen() {
  const { rate: rateParam, projectId } = useLocalSearchParams<{
    rate: string;
    projectId: string;
  }>();

  // Parse the rate from URL params
  let rate: Rate | null = null;
  try {
    rate = rateParam ? JSON.parse(rateParam) : null;
  } catch {
    rate = null;
  }
  const { addExpense } = useExpenses();

  // for positioning submit button
  const insets = useSafeAreaInsets();
  const accessoryID = "form-accessory-id"; // Unique ID for the input accessory view

  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");

  const handleQuantityChange = (value: string) => {
    // Allow empty string for clearing the input
    if (value === "") {
      setQuantity("");
      return;
    }

    // Remove non-numeric characters except decimal point
    const numericValue = value.replace(/[^0-9.]/g, "");

    // Prevent multiple decimal points
    const parts = numericValue.split(".");
    if (parts.length > 2) {
      return; // Don't update if multiple decimal points
    }

    // Limit to 2 decimal places
    if (parts.length === 2 && parts[1].length > 2) {
      return; // Don't update if more than 2 decimal places
    }

    // Prevent leading zeros before decimal (except single 0)
    if (parts[0].length > 1 && parts[0].startsWith("0") && parts.length === 1) {
      return;
    }

    setQuantity(numericValue);
  };
  const quantityInputRef = useRef<TextInput>(null);

  // Focus on quantity input when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      quantityInputRef.current?.focus();
    }, 100); // Small delay to ensure the component is fully mounted

    return () => clearTimeout(timer);
  }, []);

  // rate needs to be other and passthrough, but all passthrough rates are other so just check that
  const showDescriptionInput = rate?.isPassthrough || false;

  const handleCancel = () => {
    router.back();
  };

  const handleConfirm = () => {
    const numericQuantity = parseFloat(quantity);

    if (!quantity.trim() || isNaN(numericQuantity) || numericQuantity <= 0) {
      Alert.alert(
        "Invalid Quantity",
        "Please enter a valid quantity greater than 0."
      );
      return;
    }

    if (!rate) {
      Alert.alert("Error", "Rate information is missing.");
      return;
    }

    if (showDescriptionInput && !description.trim()) {
      Alert.alert(
        "Description Required",
        "Please enter a description for this expense (required for passthrough)."
      );
      return;
    }

    // Create the new expense
    const newExpense = createExpenseWithUniqueId({
      type: rate.type,
      activity: "", // activity will be set in addExpenses screen
      description: description || rate.description,
      price: rate.price,
      quantity: numericQuantity,
      projectId: Number(projectId),
      rateId: rate.id,
      rate,
    });

    // Add expense to context
    addExpense(newExpense);

    // Navigate back to addExpenses
    router.dismiss(); // dismiss expenseDetails modal
    router.dismiss(); // dismiss rateSelect modal
  };

  const getTotalCost = () => {
    const numericQuantity = parseFloat(quantity) || 0;
    return (numericQuantity * (rate?.price || 0)).toFixed(2);
  };

  // keep your existing color scheme
  const getRateTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "labor":
        return "#00524C";
      case "equipment":
        return "#8A532F";
      case "other":
        return "#003A5D";
      default:
        return "#d7d7d7";
    }
  };

  const RateIcon = ({
    type,
    color = "white",
    size = 20,
  }: {
    type: string;
    color?: string;
    size?: number;
  }) => {
    switch ((type || "").toLowerCase()) {
      case "labor":
        return <UserIcon size={size} color={color} />;
      case "equipment":
        return <WrenchScrewdriverIcon size={size} color={color} />;
      case "other":
        return <CubeIcon size={size} color={color} />;
      default:
        return <QuestionMarkCircleIcon size={size} color={color} />;
    }
  };

  if (!rate) {
    return (
      <View className="flex-1 items-center justify-center bg-[#f8f9fa] p-8">
        <ExclamationTriangleIcon size={48} color="#EF4444" />
        <Text className="mt-4 text-base text-neutral-600 text-center">
          Rate information is missing
        </Text>
        <TouchableOpacity
          className="mt-4 bg-[#5e8a5e] px-6 py-3 rounded-lg"
          onPress={handleCancel}
        >
          <Text className="text-white text-base font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-secondary-bg"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      {/* main view area, press outside to dismiss */}
      <Pressable className="flex-1 bg-secondary-bg" onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1">
            {/* Header */}
            <View className="modal-header">
              <TouchableOpacity className="py-2" onPress={handleCancel}>
                <Text className="text-base text-white">Cancel</Text>
              </TouchableOpacity>
              <Text className="text-lg font-semibold text-white">
                Expense Details
              </Text>
              <View className="w-[60px]" />
            </View>
            <View className="flex-1">
              <View
                className="bg-white p-4 mb-2 border-b-2"
                style={{ borderColor: getRateTypeColor(rate.type) }}
              >
                <View className="flex-row items-center">
                  <View
                    className="mr-3 h-8 w-8 items-center justify-center rounded-full"
                    style={{ backgroundColor: getRateTypeColor(rate.type) }}
                  >
                    <RateIcon type={rate.type} color="white" size={16} />
                  </View>
                  <View className="flex-1">
                    <Text className="tertiary-label uppercase">
                      {rate.type}
                    </Text>
                    <Text className="text-lg font-semibold text-primary-font">
                      {rate.description}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="tertiary-label text-right">
                      {rate.unit}
                    </Text>
                    <Text className="text-lg font-bold text-primary-font">
                      ${rate.price}
                    </Text>
                  </View>
                </View>
              </View>
              <View className="p-4">
                {/* Quantity Input */}
                <View className="mb-6">
                  <Text className="text-[12px] font-semibold text-neutral-500 tracking-tight mb-2">
                    Quantity ({rate.unit})
                  </Text>
                  <TextInput
                    ref={quantityInputRef}
                    className="bg-white rounded-lg p-4 text-[18px] font-semibold border border-neutral-200 text-center"
                    value={quantity}
                    onChangeText={handleQuantityChange}
                    placeholder="0.00"
                    placeholderTextColor="#999"
                    keyboardType="decimal-pad"
                    selectTextOnFocus
                  />
                </View>

                {/* Description Input */}
                {showDescriptionInput && (
                  <View className="mb-6">
                    <Text className="text-sm font-semibold text-neutral-500 tracking-tight mb-2">
                      Description (required for passthrough)
                    </Text>
                    <TextInput
                      className="bg-white rounded-lg p-4 text-base border border-neutral-200 min-h-[80px]"
                      value={description}
                      onChangeText={setDescription}
                      placeholder="Enter description (required)"
                      placeholderTextColor="#999"
                      multiline
                      textAlignVertical="top"
                    />
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* spacer to keep bottom bar pinned */}
          <View className="flex-1" />
        </ScrollView>
        {/* sticky bottom bar outside of the scroll view */}
        <View
          style={{ paddingBottom: (insets.bottom || 12) + 12 }}
          className="border-t border-neutral-200 bg-white px-4 pt-3"
        >
          <View className="p-4 mb-4 bg-white border-t mt-auto border-primary-border">
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-xl font-semibold text-primary-font">
                Total Cost
              </Text>
              <Text
                className="text-xl font-extrabold"
                style={{ color: "#5e8a5e" }}
              >
                ${getTotalCost()}
              </Text>
            </View>
            <Text className="text-lg font-semibold text-primary-font/40 text-start mb-2">
              {quantity || "0"} {rate.unit} × ${rate.price} = ${getTotalCost()}
            </Text>
            <TouchableOpacity
              className="harvest-button"
              onPress={handleConfirm}
            >
              <Text className="harvest-button-text">Add Expense</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
      {/* accessory bar for the keyboard */}
      <InputAccessoryView nativeID={accessoryID}>
        <View className="flex-row items-center gap-2 border-t border-neutral-300 bg-neutral-100 p-2">
          <TouchableOpacity
            onPress={Keyboard.dismiss}
            className="rounded-lg bg-neutral-200 px-3 py-2"
          >
            <Text className="font-semibold">Done</Text>
          </TouchableOpacity>
          <View className="flex-1" />
          {/* could put a submit button here */}
        </View>
      </InputAccessoryView>
    </KeyboardAvoidingView>
  );
}
