import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

export default function CreateAccountScreen({ navigation }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    try {
      console.log("Create account", {
        firstName,
        lastName,
        email,
        phoneNumber,
      });

      const response = await fetch(
        "https://9d0c2b656a61.ngrok-free.app/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fname: firstName,
            lname: lastName,
            email: email,
            pno: phoneNumber,
            password: password,
          }),
        }
      );

      const data = await response.json();
      console.log(data);

      navigation.navigate("OtpValidation", { email });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          paddingHorizontal: 20,
          paddingVertical: 40,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center">
          <Text className="text-2xl font-bold text-gray-900 text-center mb-8">
            Create Account
          </Text>

          <View className="space-y-4">
            <TextInput
              className="my-4 w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50"
              placeholder="First Name"
              value={firstName}
              onChangeText={setFirstName}
              autoCapitalize="words"
            />

            <TextInput
              className="mb-4 w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50"
              placeholder="Last Name"
              value={lastName}
              onChangeText={setLastName}
              autoCapitalize="words"
            />

            <TextInput
              className="mb-4 w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50"
              placeholder="Phone Number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />

            <TextInput
              className="mb-4 w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50"
              placeholder="Email Address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50"
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            className="bg-blue-600 rounded-xl py-4 items-center mt-8 mb-6"
            onPress={handleSignUp}
          >
            <Text className="text-white text-base font-semibold">
              Create Account
            </Text>
          </TouchableOpacity>

          <View className="flex-row justify-center">
            <Text className="text-gray-500 mr-1">Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text className="text-blue-600 font-semibold">Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
