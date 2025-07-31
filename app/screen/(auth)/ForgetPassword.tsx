import { Colors } from "@/constants/Colors";
import { auth } from "@/utils/firebase";
import { showToast } from "@/utils/toast";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { sendPasswordResetEmail } from "firebase/auth";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "tailwind-react-native-classnames";


interface ForgetPasswordFormData {
  email: string;
}

export default function ForgetPasswordScreen() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgetPasswordFormData>({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgetPasswordFormData) => {
    try {
      await sendPasswordResetEmail(auth, data.email);
      showToast.success(
        "Reset email sent!",
        "Check your inbox for instructions."
      );
      router.push("/screen/(auth)/Login");
    } catch (error: any) {
      showToast.error("Reset failed", error.message || "Something went wrong.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={[tw`flex-1`, { backgroundColor: "white" }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar
        backgroundColor={Colors.light.white}
        barStyle="light-content"
      />

      <ScrollView
        contentContainerStyle={tw`flex-1 justify-center px-6`}
        showsVerticalScrollIndicator={false}
      >
        {/* Back Button */}
        <TouchableOpacity
          style={tw`absolute top-12 left-6 z-10`}
          onPress={() => router.back()}
        >
          <FontAwesome
            name="arrow-left"
            size={24}
            color={Colors.light.titleText}
          />
        </TouchableOpacity>

        <View style={tw`my-8`}>

          <Text
            style={[
              tw`text-3xl font-bold mb-2`,
              { color: Colors.light.greenText },
            ]}
          >
            Forgot Password?
          </Text>
          <Text style={[tw`text-base mb-8`, { color: Colors.light.grayText }]}>
            Enter your associated with your account and we’ll send an email with
            instruction to reset your password.
          </Text>
        </View>

        {/* Form */}
        <View style={tw`mb-6`}>
          {/* Email Input */}
          <View style={tw`mb-6`}>
            <Text
              style={[
                tw`text-base mb-2 font-bold`,
                { color: Colors.light.titleText },
              ]}
            >
              Email
            </Text>
            <Controller
              control={control}
              name="email"
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={tw`relative`}>
                  <TextInput
                    style={[
                      tw`rounded-lg pl-6 pr-4 py-4`,
                      {
                        backgroundColor: Colors.light.borderColor,
                        color: Colors.light.lightgrayText,
                      },
                      errors.email && tw`border border-red-400`,
                    ]}
                    placeholder="Enter your email"
                    placeholderTextColor={Colors.light.lightgrayText}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value || ""}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              )}
            />
            {errors.email && (
              <Text style={tw`text-red-300 text-xs mt-1`}>
                {errors.email.message}
              </Text>
            )}
          </View>

          {/* Reset Password Button */}
          <TouchableOpacity
            style={[
              tw`rounded-lg py-4 items-center mb-6`,
              { backgroundColor: Colors.light.primaryGreen },
              isSubmitting && tw`opacity-70`,
            ]}
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            <Text
              style={[tw`font-bold text-base`, { color: Colors.light.white }]}
            >
              {isSubmitting ? "Sending..." : "Reset Password"}
            </Text>
          </TouchableOpacity>

          {/* Back to Login Link */}
          <View style={tw`flex-row justify-center items-center mb-10`}>
            <Text style={[tw`text-base`, { color: Colors.light.titleText }]}>
              Remember your password?{" "}
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/screen/(auth)/Login")}
            >
              <Text
                style={[
                  tw`font-bold text-base`,
                  { color: Colors.light.primaryGreen },
                ]}
              >
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
