import { Colors } from "@/constants/Colors";
import { useAuth } from "@/contexts/AuthContext";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import tw from "tailwind-react-native-classnames";
import Logo from "../assets/images/logo.svg";
import Logoname from "../assets/images/logoname.svg";

interface AuthenticatedRouteProps {
  children: React.ReactNode;
}

export const AuthenticatedRoute: React.FC<AuthenticatedRouteProps> = ({
  children,
}) => {
  const { user, userInfo, loading } = useAuth();
  const [timeoutReached, setTimeoutReached] = useState(false);

  // Fallback timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        console.warn(
          "⚠️ Loading timeout reached, forcing authentication check"
        );
        setTimeoutReached(true);
      }
    }, 10000); // 10 second timeout

    return () => clearTimeout(timeout);
  }, [loading]);

  useEffect(() => {
    if (!loading || timeoutReached) {
      if (!user) {
        // User is not logged in, redirect to login
        console.log("🔄 No user found, redirecting to login");
        router.replace("/screen/(auth)/Login");
      } else if (user && userInfo) {
        // Check if user is disabled
        if (userInfo.status === "disabled") {
          console.log("🚫 User is disabled, redirecting to login");
          router.replace("/screen/(auth)/Login");
          return;
        }
        console.log("✅ User authenticated successfully");
        // User is logged in and enabled, continue
        return;
      } else if (user && !userInfo && timeoutReached) {
        // User exists but no userInfo after timeout - create minimal userInfo
        console.log(
          "⚠️ Timeout reached with no userInfo, allowing access with basic auth"
        );
      }
    }
  }, [user, userInfo, loading, timeoutReached]);

  // Show loading screen while authentication state is being determined
  if ((loading && !timeoutReached) || (user && !userInfo && !timeoutReached)) {
    return (
      <View
        style={[
          tw`flex-1 justify-center items-center px-5`,
          { backgroundColor: Colors.light.primaryGreen },
        ]}
      >
        <View style={tw`items-center mb-4`}>
          <Logo width="86" height="112" />
        </View>
        <View style={tw`items-center mb-6`}>
          <Logoname width="234" height="20" />
        </View>
        <ActivityIndicator size="large" color="white" />
        <Text style={tw`text-white text-base font-normal text-center mt-4`}>
          {timeoutReached
            ? "Finalizing authentication..."
            : "Loading your dashboard..."}
        </Text>
        {timeoutReached && (
          <Text
            style={tw`text-white text-sm font-normal text-center mt-2 opacity-75`}
          >
            This is taking longer than usual...
          </Text>
        )}
      </View>
    );
  }

  // Show login screen if not authenticated
  if (!user) {
    return null; // Router will handle redirect
  }

  // User is authenticated and user info is available
  return <>{children}</>;
};

export default AuthenticatedRoute;
