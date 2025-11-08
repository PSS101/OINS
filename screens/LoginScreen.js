import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      console.log("Attempting login with:", { email, password });

      const response = await fetch(
        "https://9d0c2b656a61.ngrok-free.app/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );

      clearTimeout(timeoutId);

      const data = await response.json();
      console.log("Server response:", data);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <View className="flex-1 p-5 justify-center bg-white">
      <Text className="text-2xl font-bold text-gray-900 text-center mb-8">
        Login
      </Text>

      <TextInput
        className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-4 bg-gray-50"
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-6 bg-gray-50"
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        className="bg-blue-600 rounded-xl py-4 items-center mb-6"
        onPress={handleLogin}
      >
        <Text className="text-white text-base font-semibold">Login</Text>
      </TouchableOpacity>

      <View className="flex-row justify-center">
        <Text className="text-gray-500 mr-1">Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("CreateAccount")}>
          <Text className="text-blue-600 font-semibold">Create Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
