// import { toastConfig } from "@/config/toastConfig";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import Toast from "react-native-toast-message";
import "../global.css";

import { AuthProvider } from "@/contexts/AuthContext";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen
            name="screen/home/homeScreen"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="app/index"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="screen/(auth)/Login"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="screen/(auth)/Signup"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="screen/(auth)/ForgetPassword"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="screen/(auth)/emailVerification"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="screen/(auth)/otpVerification"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="screen/home/AddItems/AddItems"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="screen/home/ItemDetails/ItemDetails"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="screen/home/RedeemQRCode/RedeemQRCode"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="screen/home/TransactionHistory/TransactionHistory"
            options={{ headerShown: false }}
          />
           <Stack.Screen
            name="screen/home/PendingRedeem/PendingRedeem"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="screen/home/Profile/Profile"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="screen/home/Faqs/Faqs"
            options={{ headerShown: false }}
          />
           <Stack.Screen
            name="screen/home/PrivacyPolicy/PrivacyPolicy"
            options={{ headerShown: false }}
          />
           <Stack.Screen
            name="screen/home/EditProfile/EditProfile"
            options={{ headerShown: false }}
          />
           <Stack.Screen
            name="screen/home/ChangePassword/ChangePassword"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
        <Toast />
      </ThemeProvider>
    </AuthProvider>
  );
}
