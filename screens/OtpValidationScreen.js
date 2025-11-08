import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";

export default function OtpValidationScreen({ navigation, route }) {

  const handleValidateOtp = async () => {
    const { email } = route.params || {};
    if (!email) {
      Alert.alert("Error", "Email is required");
      return;
    }

    try {
      const response = await fetch(
        "https://9d0c2b656a61.ngrok-free.app/sendotp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send OTP");
      }

      const data = await response.json();
      console.log(data);
      if (data.otpstatus === 1) {
        navigation.navigate("VerifyOtp", { email });
      } else {
        Alert.alert("Error", data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to send OTP. Please try again.");
    }
  };

  return (
    <View className="flex-1 p-5 justify-center bg-white">
      <Text className="text-2xl font-bold text-gray-900 text-center mb-2">
        Verify Your Account
      </Text>
      <Text className="text-base text-gray-500 text-center mb-8">
        Click the button below to receive a verification code via email
      </Text>

      <TouchableOpacity
        className="bg-blue-600 rounded-xl py-4 items-center mb-4"
        onPress={handleValidateOtp}
      >
        <Text className="text-white text-base font-semibold">Send OTP</Text>
      </TouchableOpacity>
    </View>
  );
}
