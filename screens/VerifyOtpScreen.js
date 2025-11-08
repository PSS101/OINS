import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { OtpInput } from "react-native-otp-entry";
import { styled } from "nativewind";

export default function VerifyOtpScreen({ navigation, route }) {
  const [otp, setOtp] = useState("");
  const { email } = route.params || {};

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      Alert.alert("Error", "Please enter a valid 6-digit OTP");
      return;
    }

    try {
      const response = await fetch(
        "https://9d0c2b656a61.ngrok-free.app/verifyotp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            otp: otp,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to verify OTP");
      }

      const data = await response.json();
      console.log(data);

      if (data.otpverify === 1) {
        Alert.alert("Success", "OTP verified successfully", [
          {
            text: "Continue",
            onPress: () => navigation.navigate("Login"),
          },
        ]);
      } else {
        Alert.alert("Error", "Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to verify OTP. Please try again.");
    }
  };

  return (
    <View className="flex-1 p-5 justify-center bg-white">
      <Text className="text-2xl font-bold text-gray-900 text-center mb-2">
        Verify OTP
      </Text>
      <Text className="text-base text-gray-500 text-center mb-8">
        Enter the 6-digit code sent to your email address
      </Text>

      <OtpInput
        numberOfDigits={6}
        focusColor="#2563eb"
        focusStickBlinkingDuration={500}
        onTextChange={(x) => setOtp(x)}
        theme={{
          containerStyle: { marginVertical: 20 },
          pinCodeContainerStyle: {
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "#d1d5db",
            width: 45,
            height: 60,
          },
          pinCodeTextStyle: { fontSize: 20 },
          margin: 5,
        }}
      />

      <TouchableOpacity
        className="bg-blue-600 rounded-xl py-4 items-center mb-4"
        onPress={handleVerifyOtp}
      >
        <Text className="text-white text-base font-semibold">Verify OTP</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="items-center"
        onPress={() => navigation.goBack()}
      >
        <Text className="text-blue-600 text-sm font-medium">Resend OTP</Text>
      </TouchableOpacity>
    </View>
  );
}
