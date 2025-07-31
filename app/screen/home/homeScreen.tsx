import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { StatusBar, Text, TouchableOpacity, View } from "react-native";
import tw from "tailwind-react-native-classnames";
import Logo from "../../../assets/images/logo.svg";
import Logoname from "../../../assets/images/logoname.svg";

export default function HomeScreen() {
  const [showLogo, setShowLogo] = useState(false);

  useEffect(() => {
    // Show logo after 1 second
    const logoTimer = setTimeout(() => setShowLogo(true), 1000);

    // Navigate to login after 4 seconds (1s + 3s)
    const navTimer = setTimeout(() => {
      router.replace("/screen/(auth)/Login");
    }, 3000);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(navTimer);
    };
  }, []);

  return (
    <View
      style={[
        tw`flex-1 justify-center items-center px-5`,
        { backgroundColor: Colors.light.primaryGreen },
      ]}
    >
      <StatusBar
        backgroundColor={Colors.light.primaryGreen}
        barStyle="light-content"
      />

      {showLogo && (
        <>
          <View style={tw`items-center mb-4`}>
            <Logo width="86" height="112" />
          </View>
          <View style={tw`items-center mb-2`}>
            <Logoname width="234" height="20" />
          </View>
          <Text style={tw`text-white text-base font-normal text-center mb-6`}>
            SCAN AND EARN MONEY
          </Text>
        </>
      )}
    </View>
  );
}
