import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import tw from "tailwind-react-native-classnames";
import QR from "../../../../assets/images/qr.svg"
export default function RedeemQRCode() {
  return (
    <View style={tw`flex-1 bg-white pt-10 px-4`}>
      <View style={tw`flex-row items-center mb-6`}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={[tw`text-lg font-semibold text-center ml-20`, { color: Colors.light.titleText }]}>Redeem QR Code</Text>
      </View>
      {/* Add placeholder content to ensure the page is visible */}
      <View style={tw`flex-1 items-center mt-28`}>
        <Text style={[tw`text-lg font-bold mb-10`, { color: Colors.light.titleText }]}>Take a screenshot</Text>
        <QR width={200} height={200} />
        <Text style={[tw`text-lg font-bold mt-10`, { color: Colors.light.titleText }]}>ID: KYT4532267</Text>
        <Text style={[tw`text-base text-gray-700 text-center mt-6`, { color: Colors.light.grayText }]}>Return the scanned bags to the supermarket and redeem 10% Discount up to AED 25 using this QR Code.Thanks!</Text>
        {/* You can add your QR code scanner or other content below */}
      </View>
      <TouchableOpacity
        onPress={() => router.push("/(tabs)")}
          style={[tw` py-3 rounded-lg items-center mt-16 mb-8`,{backgroundColor:Colors.light.primaryGreen}]}
        >
          <Text style={[tw`text-white text-base font-bold`]}>Done</Text>
        </TouchableOpacity>
    </View>
  );
}
