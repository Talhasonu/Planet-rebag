import { Colors } from "@/constants/Colors";
import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/utils/firebase";
import { showToast } from "@/utils/toast";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
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
import At from "../../../assets/images/attherate.svg";
import Instagram from "../../../assets/images/instagram.svg";
import Phone from "../../../assets/images/phone.svg";

interface LoginFormData {
  email: string;
  mobileNumber: string;
  password: string;
}

export default function LoginScreen() {
  const [loginType, setLoginType] = useState<"email" | "mobile">("email");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { saveUserInfo } = useAuth();
  const db = getFirestore();

  const {
    control,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      mobileNumber: "",
      password: "",
    },
  });

  const handleLoginTypeChange = (type: "email" | "mobile") => {
    setLoginType(type);
    setValue("email", "");
    setValue("mobileNumber", "");
    clearErrors(["email", "mobileNumber"]);
  };

  const onSubmit = async (data: LoginFormData) => {
    try {
      if (loginType === "email") {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          data.email,
          data.password
        );
        const user = userCredential.user;

        showToast.success("Login successful!", "Welcome back.");

        // Fetch user role and info from Firestore
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);

          let userRole: "user" | "admin" = "user";
          let userStatus: "enabled" | "disabled" = "enabled";
          let fullName =
            user.displayName || user.email?.split("@")[0] || "User";
          let phoneNumber = "";
          let username = "";

          if (userDoc.exists()) {
            const userData = userDoc.data();
            userRole = userData.role || "user";
            userStatus = userData.status || "enabled";
            fullName = userData.fullName || userData.name || fullName;
            phoneNumber = userData.phoneNumber?.toString() || "";
            username = userData.userName || userData.username || "";
          }

          // Check if user is disabled
          if (userStatus === "disabled") {
            showToast.error(
              "Account Disabled",
              "Your account has been disabled. Please contact support."
            );
            return;
          }

          // Create user info object
          const userInfo = {
            uid: user.uid,
            email: user.email || "",
            displayName: fullName,
            role: userRole,
            status: userStatus,
            profileImageUri: user.photoURL || undefined,
            initials: fullName
              .split(" ")
              .map((name) => name.charAt(0).toUpperCase())
              .join("")
              .substring(0, 2),
            fullName,
            phoneNumber,
            username,
          };

          // 🔥 UPDATE LOGIN TIMESTAMP IN FIREBASE
          try {
            const { updateDoc } = await import("firebase/firestore");
            const userDocRef = doc(db, "users", user.uid);
            await updateDoc(userDocRef, {
              lastLoginAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
            console.log(
              "✅ Login timestamp updated successfully for",
              user.email
            );
          } catch (updateError) {
            console.error("❌ Failed to update login timestamp:", updateError);
          }

          // Save user info to context and AsyncStorage
          await saveUserInfo(userInfo);

          // Navigate based on role
          if (userRole === "admin") {
            router.replace("/(tabs)");
          } else {
            router.replace("/(tabs)");
          }
        } catch (firestoreError) {
          console.log(
            "Could not fetch user role from Firestore:",
            firestoreError
          );
          // Default to regular user navigation
          router.replace("/(tabs)");
        }
      } else {
        showToast.error("Mobile login not implemented");
      }
    } catch (error: any) {
      if (
        error.code === "auth/wrong-password" ||
        error.code === "auth/user-not-found"
      ) {
        showToast.error(
          "Invalid email or password",
          "Please check your credentials and try again."
        );
      } else if (error.code === "auth/invalid-email") {
        showToast.error(
          "Invalid email format",
          "Please enter a valid email address."
        );
      } else {
        showToast.error(
          "Login failed",
          error.message || "Please sign up first"
        );
      }
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
        contentContainerStyle={tw`flex-1 justify-center  px-6`}
        showsVerticalScrollIndicator={false}
      >
        <View style={tw` my-8`}>
          <Text
            style={[
              tw`text-3xl font-bold mb-2`,
              { color: Colors.light.greenText },
            ]}
          >
            Welcome back!
          </Text>
          <Text
            style={[
              tw`text-white text-base mb-8`,
              { color: Colors.light.grayText },
            ]}
          >
            Login to your account with
          </Text>

          {/* Login Type Toggle - Radio Button Style */}
          <View style={tw`flex flex-row  items-center `}>
            {/* Email Option */}
            <TouchableOpacity
              style={tw`flex-row items-center`}
              onPress={() => handleLoginTypeChange("email")}
            >
              <View
                style={[
                  tw`w-5 h-5 rounded-full border-2  mr-3 items-center justify-center`,
                  {
                    borderColor:
                      loginType === "email"
                        ? Colors.light.primaryGreen
                        : Colors.light.lightgrayText,
                  },
                ]}
              >
                {loginType === "email" && (
                  <View
                    style={[
                      tw`w-2.5 h-2.5 rounded-full `,
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
                      loginType === "email"
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
              style={tw`flex-row  items-center ml-10`}
              onPress={() => handleLoginTypeChange("mobile")}
            >
              <View
                style={[
                  tw`w-5 h-5 rounded-full border-2 mr-3 items-center justify-center`,
                  {
                    borderColor:
                      loginType === "mobile"
                        ? Colors.light.primaryGreen
                        : Colors.light.lightgrayText,
                  },
                ]}
              >
                {loginType === "mobile" && (
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
                      loginType === "mobile"
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
        <View style={tw`mb-6 `}>
          <Text style={tw`text-white text-xs mb-2`}>
            Current login type: {loginType}
          </Text>

          {/* Email/Mobile Input */}
          <View style={tw`mb-4`}>
            <Text
              style={[
                tw` text-base mb-2 font-bold`,
                { color: Colors.light.titleText },
              ]}
            >
              {loginType === "email" ? "Email" : "Mobile Number"}
            </Text>
            <Controller
              control={control}
              name={loginType === "email" ? "email" : "mobileNumber"}
              rules={
                loginType === "email"
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
                  key={loginType}
                  style={[
                    tw` rounded-lg px-4 py-4 `,
                    {
                      backgroundColor: Colors.light.borderColor,
                      color: Colors.light.lightgrayText,
                    },
                    ((loginType === "email" && errors.email) ||
                      (loginType === "mobile" && errors.mobileNumber)) &&
                      tw`border border-red-400`,
                  ]}
                  placeholder={
                    loginType === "email"
                      ? "Enter your email"
                      : "Enter your mobile number"
                  }
                  placeholderTextColor={Colors.light.lightgrayText}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value || ""}
                  keyboardType={
                    loginType === "email" ? "email-address" : "phone-pad"
                  }
                  autoCapitalize="none"
                />
              )}
            />
            {((loginType === "email" && errors.email) ||
              (loginType === "mobile" && errors.mobileNumber)) && (
              <Text style={tw`text-red-300 text-xs mt-1`}>
                {loginType === "email"
                  ? errors.email?.message
                  : errors.mobileNumber?.message}
              </Text>
            )}
          </View>

          {/* Password Input */}
          <View style={tw`mb-4`}>
            <Text
              style={[
                tw` text-base font-bold mb-2 `,
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
                      tw` bg-opacity-90 rounded-lg px-4 py-4 pr-12 text-gray-800`,
                      { backgroundColor: Colors.light.borderColor },
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
                    <Text style={tw`text-gray-500 text-lg`}>
                      {showPassword ? (
                        <FontAwesome
                          name="eye"
                          size={24}
                          color={Colors.light.lightgrayText}
                        />
                      ) : (
                        <FontAwesome
                          name="eye-slash"
                          size={24}
                          color={Colors.light.lightgrayText}
                        />
                      )}
                    </Text>
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

          {/* Remember Me & Forgot Password */}
          <View style={tw`flex-row justify-between items-center mb-8`}>
            <TouchableOpacity
              style={tw`flex-row items-center`}
              onPress={() => setRememberMe(!rememberMe)}
            >
              <View
                style={[
                  tw`w-10 h-6 rounded-full mr-3 p-1 flex-row items-center`,
                  {
                    backgroundColor: rememberMe
                      ? Colors.light.primaryGreen
                      : Colors.light.lightgrayText,
                  },
                ]}
              >
                <View
                  style={[
                    tw`w-4 h-4 rounded-full shadow-sm`,
                    {
                      backgroundColor: "white",
                      transform: [{ translateX: rememberMe ? 16 : 0 }],
                    },
                  ]}
                />
              </View>
              <Text
                style={[
                  tw`text-sm font-normal`,
                  { color: Colors.light.grayText },
                ]}
              >
                Remember me
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/screen/(auth)/ForgetPassword")}
            >
              <Text
                style={[
                  tw`font-bold text-sm`,
                  { color: Colors.light.primaryGreen },
                ]}
              >
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[
              tw` rounded-lg py-4 items-center mb-6`,
              { backgroundColor: Colors.light.primaryGreen },
              isSubmitting && tw`opacity-70`,
            ]}
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            <Text
              style={[tw`font-bold text-base`, { color: Colors.light.white }]}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </Text>
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View style={tw`flex-row justify-center items-center mb-10`}>
            <Text style={[tw`text-base`, { color: Colors.light.titleText }]}>
              Don't have an account?{" "}
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/screen/(auth)/Signup")}
            >
              <Text
                style={[
                  tw`font-bold text-base`,
                  { color: Colors.light.primaryGreen },
                ]}
              >
                Sign up
              </Text>
            </TouchableOpacity>
          </View>

          {/* Contact Us */}
          <View style={tw`flex-row items-center  p-2`}>
            <View>
              <Text
                style={[
                  tw`text-base font-normal`,
                  { color: Colors.light.titleText },
                ]}
              >
                Contact Us:
              </Text>
            </View>

            <View style={tw`flex-row ml-3`}>
              <TouchableOpacity style={tw`mr-6`}>
                <Phone width={32} height={32} />
              </TouchableOpacity>

              <TouchableOpacity style={tw`mr-6`}>
                <Instagram width={32} height={32} />
              </TouchableOpacity>

              <TouchableOpacity>
                <At width={32} height={32} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
