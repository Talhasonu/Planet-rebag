import { Colors } from "@/constants/Colors";
import { useAuth } from "@/contexts/AuthContext";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import tw from "tailwind-react-native-classnames";
import Logo from "../assets/images/logo.svg";
import Logoname from "../assets/images/logoname.svg";

export default function Index() {
  const { user, userInfo, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        const timer = setTimeout(() => {
          router.replace("/screen/(auth)/Login");
        }, 2000);
        return () => clearTimeout(timer);
      } else if (user && userInfo) {
        
        const timer = setTimeout(() => {
          if (userInfo.role === "admin") {
            router.replace("/(tabs)");
          } else {
            router.replace("/(tabs)");
          }
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [user, userInfo, loading]);

  // Show splash screen
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
      <Text style={tw`text-white text-base font-normal text-center mb-6`}>
        SCAN AND EARN MONEY
      </Text>

      {loading || (user && !userInfo) ? (
        <>
          <ActivityIndicator size="large" color="white" />
          <Text style={tw`text-white text-sm font-normal text-center mt-4`}>
            Loading your dashboard...
          </Text>
        </>
      ) : !user ? (
        <Text style={tw`text-white text-sm font-normal text-center mt-4`}>
          Welcome to Planet Rebag
        </Text>
      ) : null}
    </View>
  );
}
