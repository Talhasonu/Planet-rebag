import { Colors } from "@/constants/Colors";
import { auth } from "@/utils/firebase";
import { showToast } from "@/utils/toast";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
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

interface SignUpFormData {
  fullName: string;
  email: string;
  mobileNumber: string;
  password: string;
}
export default function SignUpScreen() {
  const [signUpType, setSignUpType] = useState<"email" | "mobile">("email");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const db = getFirestore();

  const {
    control,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    defaultValues: {
      fullName: "",
      email: "",
      mobileNumber: "",
      password: "",
    },
  });

  const handleSignUpTypeChange = (type: "email" | "mobile") => {
    setSignUpType(type);
    setValue("email", "");
    setValue("mobileNumber", "");
    clearErrors(["email", "mobileNumber"]);
  };

  const onSubmit = async (data: SignUpFormData) => {
    try {
      if (signUpType === "email") {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          data.email,
          data.password
        );
        const user = userCredential.user;

        // Update Firebase Auth profile
        await updateProfile(user, {
          displayName: data.fullName,
        });

        // Create user document in Firestore with default values
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, {
          uid: user.uid,
          email: data.email,
          fullName: data.fullName,
          phoneNumber: data.mobileNumber || "", // Include mobile number if provided
          role: "user", // Default role
          status: "enabled", // Default status
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

        showToast.success("Account created!", "You can now log in.");
        router.push("/screen/(auth)/Login");
      } else {
        showToast.error("Mobile signup not implemented");
      }
    } catch (error: any) {
      showToast.error(
        "Signup failed",
        error.message || "Something went wrong."
      );
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
        <View style={tw`my-8`}>
          <Text
            style={[
              tw`text-3xl font-bold mb-2`,
              { color: Colors.light.greenText },
            ]}
          >
            Sign Up
          </Text>
          <Text
            style={[
              tw`text-white text-base mb-8`,
              { color: Colors.light.grayText },
            ]}
          >
            Create your new account.
          </Text>

          <Text
            style={[
              tw`text-base font-bold mb-4`,
              { color: Colors.light.titleText },
            ]}
          >
            Sign up With
          </Text>
          <View style={tw`flex flex-row items-center mb-6`}>
            {/* Email Option */}
            <TouchableOpacity
              style={tw`flex-row items-center`}
              onPress={() => handleSignUpTypeChange("email")}
            >
              <View
                style={[
                  tw`w-5 h-5 rounded-full border-2 mr-3 items-center justify-center`,
                  {
                    borderColor:
                      signUpType === "email"
                        ? Colors.light.primaryGreen
                        : Colors.light.lightgrayText,
                  },
                ]}
              >
                {signUpType === "email" && (
                  <View
                    style={[
                      tw`w-2.5 h-2.5 rounded-full`,
                      { backgroundColor: Colors.light.primaryGreen },
                    ]}
                  />
                )}
              </View>
              <Text
                style={[
                  tw`text-base font-normal`,
                  {
                    color:
                      signUpType === "email"
                        ? Colors.light.titleText
                        : Colors.light.lightgrayText,
                  },
                ]}
              >
                Email
              </Text>
            </TouchableOpacity>

            {/* Mobile Number Option */}
            <TouchableOpacity
              style={tw`flex-row items-center ml-10`}
              onPress={() => handleSignUpTypeChange("mobile")}
            >
              <View
                style={[
                  tw`w-5 h-5 rounded-full border-2 mr-3 items-center justify-center`,
                  {
                    borderColor:
                      signUpType === "mobile"
                        ? Colors.light.primaryGreen
                        : Colors.light.lightgrayText,
                  },
                ]}
              >
                {signUpType === "mobile" && (
                  <View
                    style={[
                      tw`w-2.5 h-2.5 rounded-full`,
                      { backgroundColor: Colors.light.primaryGreen },
                    ]}
                  />
                )}
              </View>
              <Text
                style={[
                  tw`text-base font-normal`,
                  {
                    color:
                      signUpType === "mobile"
                        ? Colors.light.titleText
                        : Colors.light.lightgrayText,
                  },
                ]}
              >
                Mobile Number
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Form */}
        <View style={tw`mb-6`}>
          {/* Full Name Input */}
          <View style={tw`mb-4`}>
            <Text
              style={[
                tw`text-base mb-2 font-bold`,
                { color: Colors.light.titleText },
              ]}
            >
              Full Name
            </Text>
            <Controller
              control={control}
              name="fullName"
              rules={{
                required: "Full name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[
                    tw`rounded-lg px-4 py-4`,
                    {
                      backgroundColor: Colors.light.borderColor,
                      color: Colors.light.lightgrayText,
                    },
                    errors.fullName && tw`border border-red-400`,
                  ]}
                  placeholder="Enter your full name"
                  placeholderTextColor={Colors.light.lightgrayText}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value || ""}
                  autoCapitalize="words"
                />
              )}
            />
            {errors.fullName && (
              <Text style={tw`text-red-300 text-xs mt-1`}>
                {errors.fullName.message}
              </Text>
            )}
          </View>

          {/* Email/Mobile Input */}
          <View style={tw`mb-4`}>
            <Text
              style={[
                tw`text-base mb-2 font-bold`,
                { color: Colors.light.titleText },
              ]}
            >
              {signUpType === "email" ? "Email" : "Mobile Number"}
            </Text>
            <Controller
              control={control}
              name={signUpType === "email" ? "email" : "mobileNumber"}
              rules={
                signUpType === "email"
                  ? {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    }
                  : {
                      required: "Mobile number is required",
                      pattern: {
                        value: /^[0-9]{10,15}$/,
                        message: "Invalid mobile number",
                      },
                    }
              }
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  key={signUpType}
                  style={[
                    tw`rounded-lg px-4 py-4`,
                    {
                      backgroundColor: Colors.light.borderColor,
                      color: Colors.light.lightgrayText,
                    },
                    ((signUpType === "email" && errors.email) ||
                      (signUpType === "mobile" && errors.mobileNumber)) &&
                      tw`border border-red-400`,
                  ]}
                  placeholder={
                    signUpType === "email"
                      ? "Enter your email"
                      : "Enter your mobile number"
                  }
                  placeholderTextColor={Colors.light.lightgrayText}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value || ""}
                  keyboardType={
                    signUpType === "email" ? "email-address" : "phone-pad"
                  }
                  autoCapitalize="none"
                />
              )}
            />
            {((signUpType === "email" && errors.email) ||
              (signUpType === "mobile" && errors.mobileNumber)) && (
              <Text style={tw`text-red-300 text-xs mt-1`}>
                {signUpType === "email"
                  ? errors.email?.message
                  : errors.mobileNumber?.message}
              </Text>
            )}
          </View>

          {/* Password Input */}
          <View style={tw`mb-4`}>
            <Text
              style={[
                tw`text-base font-bold mb-2`,
                { color: Colors.light.titleText },
              ]}
            >
              Password
            </Text>
            <Controller
              control={control}
              name="password"
              rules={{
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
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
                      errors.password && tw`border border-red-400`,
                    ]}
                    placeholder="••••••••••"
                    placeholderTextColor={Colors.light.lightgrayText}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    style={tw`absolute right-4 top-4`}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <FontAwesome
                      name={showPassword ? "eye" : "eye-slash"}
                      size={24}
                      color={Colors.light.lightgrayText}
                    />
                  </TouchableOpacity>
                </View>
              )}
            />
            {errors.password && (
              <Text style={tw`text-red-300 text-xs mt-1`}>
                {errors.password.message}
              </Text>
            )}
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
              {isSubmitting ? "Creating Account..." : "Submit"}
            </Text>
          </TouchableOpacity>

          {/* Login Link */}
          <View style={tw`flex-row justify-center items-center mb-10`}>
            <Text style={[tw`text-base`, { color: Colors.light.titleText }]}>
              Already have an account?{" "}
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
