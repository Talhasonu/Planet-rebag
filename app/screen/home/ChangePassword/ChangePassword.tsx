import { Colors } from "@/constants/Colors";
import { auth } from "@/utils/firebase";
import { showToast } from "@/utils/toast";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import React, { useState } from "react";
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
import FontAwesome from "react-native-vector-icons/FontAwesome";
import tw from "tailwind-react-native-classnames";

interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ChangePasswordScreen() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormData>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = watch("newPassword");

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      const user = auth.currentUser;
      if (!user || !user.email) {
        showToast.error("Error", "User not authenticated");
        return;
      }

      // Re-authenticate user with current password
      const credential = EmailAuthProvider.credential(
        user.email,
        data.currentPassword
      );
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, data.newPassword);

      showToast.success("Success", "Password changed successfully!");
    } catch (error: any) {
      if (error.code === "auth/wrong-password") {
        showToast.error("Error", "Current password is incorrect");
      } else if (error.code === "auth/weak-password") {
        showToast.error("Error", "New password is too weak");
      } else {
        showToast.error("Error", error.message || "Failed to change password");
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={[tw`flex-1`, { backgroundColor: "white" }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar backgroundColor={Colors.light.white} barStyle="dark-content" />

      <ScrollView
        contentContainerStyle={tw`flex-1 justify-center px-6`}
        showsVerticalScrollIndicator={false}
      >
        <View style={tw``}>
          {/* Header */}
          <View style={tw`flex-row items-center `}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} color="black" />
            </TouchableOpacity>
            <Text
              style={[
                tw`text-lg font-semibold text-center ml-20`,
                { color: Colors.light.titleText },
              ]}
            >
              Change Password
            </Text>
          </View>

          <Text style={[tw`text-base my-6`, { color: Colors.light.grayText }]}>
            Enter your current password and choose a new secure password.
          </Text>
        </View>

        {/* Form */}
        <View style={tw``}>
          {/* Current Password Input */}
          <View style={tw`mb-4`}>
            <Text
              style={[
                tw`text-base font-bold mb-2`,
                { color: Colors.light.titleText },
              ]}
            >
              Current Password
            </Text>
            <Controller
              control={control}
              name="currentPassword"
              rules={{
                required: "Current password is required",
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={tw`relative`}>
                  <TextInput
                    style={[
                      tw`rounded-lg px-4 py-4 pr-12`,
                      {
                        backgroundColor: Colors.light.borderColor,
                        color: Colors.light.lightgrayText,
                      },
                      errors.currentPassword && tw`border border-red-400`,
                    ]}
                    placeholder="Enter your current password"
                    placeholderTextColor={Colors.light.lightgrayText}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    secureTextEntry={!showCurrentPassword}
                  />
                  <TouchableOpacity
                    style={tw`absolute right-4 top-4`}
                    onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    <FontAwesome
                      name={showCurrentPassword ? "eye" : "eye-slash"}
                      size={24}
                      color={Colors.light.lightgrayText}
                    />
                  </TouchableOpacity>
                </View>
              )}
            />
            {errors.currentPassword && (
              <Text style={tw`text-red-300 text-xs mt-1`}>
                {errors.currentPassword.message}
              </Text>
            )}
          </View>

          {/* New Password Input */}
          <View style={tw`mb-4`}>
            <Text
              style={[
                tw`text-base font-bold mb-2`,
                { color: Colors.light.titleText },
              ]}
            >
              New Password
            </Text>
            <Controller
              control={control}
              name="newPassword"
              rules={{
                required: "New password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                  message:
                    "Password must contain uppercase, lowercase and number",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={tw`relative`}>
                  <TextInput
                    style={[
                      tw`rounded-lg px-4 py-4 pr-12`,
                      {
                        backgroundColor: Colors.light.borderColor,
                        color: Colors.light.lightgrayText,
                      },
                      errors.newPassword && tw`border border-red-400`,
                    ]}
                    placeholder="Enter your new password"
                    placeholderTextColor={Colors.light.lightgrayText}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    secureTextEntry={!showNewPassword}
                  />
                  <TouchableOpacity
                    style={tw`absolute right-4 top-4`}
                    onPress={() => setShowNewPassword(!showNewPassword)}
                  >
                    <FontAwesome
                      name={showNewPassword ? "eye" : "eye-slash"}
                      size={24}
                      color={Colors.light.lightgrayText}
                    />
                  </TouchableOpacity>
                </View>
              )}
            />
            {errors.newPassword && (
              <Text style={tw`text-red-300 text-xs mt-1`}>
                {errors.newPassword.message}
              </Text>
            )}
          </View>

          {/* Confirm Password Input */}
          <View style={tw`mb-6`}>
            <Text
              style={[
                tw`text-base font-bold mb-2`,
                { color: Colors.light.titleText },
              ]}
            >
              Confirm New Password
            </Text>
            <Controller
              control={control}
              name="confirmPassword"
              rules={{
                required: "Please confirm your new password",
                validate: (value) =>
                  value === newPassword || "Passwords do not match",
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={tw`relative`}>
                  <TextInput
                    style={[
                      tw`rounded-lg px-4 py-4 pr-12`,
                      {
                        backgroundColor: Colors.light.borderColor,
                        color: Colors.light.lightgrayText,
                      },
                      errors.confirmPassword && tw`border border-red-400`,
                    ]}
                    placeholder="Confirm your new password"
                    placeholderTextColor={Colors.light.lightgrayText}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    secureTextEntry={!showConfirmPassword}
                  />
                  <TouchableOpacity
                    style={tw`absolute right-4 top-4`}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <FontAwesome
                      name={showConfirmPassword ? "eye" : "eye-slash"}
                      size={24}
                      color={Colors.light.lightgrayText}
                    />
                  </TouchableOpacity>
                </View>
              )}
            />
            {errors.confirmPassword && (
              <Text style={tw`text-red-300 text-xs mt-1`}>
                {errors.confirmPassword.message}
              </Text>
            )}
          </View>

          {/* Password Requirements */}
          <View
            style={[
              tw`mb-6 p-4 rounded-lg`,
              { backgroundColor: Colors.light.green40 },
            ]}
          >
            <Text
              style={[
                tw`text-sm font-bold mb-2`,
                { color: Colors.light.greenText },
              ]}
            >
              Password Requirements:
            </Text>
            <Text style={[tw`text-xs`, { color: Colors.light.greenText }]}>
              • At least 6 characters long
            </Text>
            <Text style={[tw`text-xs`, { color: Colors.light.greenText }]}>
              • Contains uppercase letter (A-Z)
            </Text>
            <Text style={[tw`text-xs`, { color: Colors.light.greenText }]}>
              • Contains lowercase letter (a-z)
            </Text>
            <Text style={[tw`text-xs`, { color: Colors.light.greenText }]}>
              • Contains at least one number (0-9)
            </Text>
          </View>

          {/* Submit Button */}
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
              {isSubmitting ? "Changing Password..." : "Change Password"}
            </Text>
          </TouchableOpacity>

          {/* Cancel Button */}
          <TouchableOpacity
            style={[
              tw`rounded-lg py-4 items-center border`,
              { borderColor: Colors.light.lightgrayText },
            ]}
            onPress={() => router.back()}
          >
            <Text
              style={[
                tw`font-bold text-base`,
                { color: Colors.light.grayText },
              ]}
            >
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
