import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "tailwind-react-native-classnames";

export default function VerifyOtpScreen() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const router = useRouter();

  // Focus management for OTP inputs
  const inputs = [React.useRef<TextInput>(null), React.useRef<TextInput>(null), React.useRef<TextInput>(null), React.useRef<TextInput>(null)];

  const handleChange = (text: string, idx: number) => {
    if (/^\d?$/.test(text)) {
      const newOtp = [...otp];
      newOtp[idx] = text;
      setOtp(newOtp);
      if (text && idx < 3) {
        inputs[idx + 1].current?.focus();
      }
    }
  };

  const handleVerify = () => {
    // Add OTP verification logic here
    // For now, just show a success toast or navigate
    // showToast.success("OTP Verified", "Welcome!");
    router.push("/screen/home/homeScreen");
  };

  return (
    <KeyboardAvoidingView
      style={[tw`flex-1`, { backgroundColor: Colors.light.white }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar backgroundColor={Colors.light.white} barStyle="dark-content" />
      <View style={tw`flex-1 px-6 pt-10`}>
        {/* Back Arrow */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={tw`mb-2 w-8 h-8 justify-center`}
        >
          <Text style={[tw`text-2xl`, { color: Colors.light.greenText }]}>
            {"\u2190"}
          </Text>
        </TouchableOpacity>

        {/* Title */}
        <Text
          style={[
            tw`text-2xl font-bold mb-1`,
            { color: Colors.light.greenText },
          ]}
        >
          Enter OTP
        </Text>
        <Text style={[tw`text-base mb-8`, { color: Colors.light.grayText }]}>
          A 4 digit code sent to +97101******789.
        </Text>

        {/* OTP Input */}
        <Text
          style={[
            tw`text-base font-bold mb-4 text-center`,
            { color: Colors.light.titleText },
          ]}
        >
          Enter OTP
        </Text>
        <View style={tw`flex-row justify-center mb-8`}>
          {otp.map((digit, idx) => (
            <TextInput
              key={idx}
              ref={inputs[idx]}
              style={[
                tw`w-12 h-12 mx-1 rounded-lg text-center text-xl font-bold border`,
                {
                  borderColor: Colors.light.greenText,
                  color: Colors.light.titleText,
                },
              ]}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleChange(text, idx)}
              returnKeyType={idx === 3 ? "done" : "next"}
            />
          ))}
        </View>

        {/* Verify Button */}
        <TouchableOpacity
          style={[
            tw`rounded-lg py-4 items-center mb-6`,
            { backgroundColor: Colors.light.primaryGreen },
          ]}
          onPress={handleVerify}
          disabled={otp.some((d) => d === "")}
        >
          <Text
            style={[tw`font-bold text-base`, { color: Colors.light.white }]}
          >
            Verify
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
