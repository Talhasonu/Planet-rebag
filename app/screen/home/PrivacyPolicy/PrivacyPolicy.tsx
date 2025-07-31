import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import tw from "tailwind-react-native-classnames";

export default function PrivacyPolicyScreen() {
  return (
    <View style={[tw`flex-1 bg-white`]}>
      <StatusBar backgroundColor={Colors.light.white} barStyle="dark-content" />
      
      <ScrollView
        contentContainerStyle={tw`px-6 py-6`}
        showsVerticalScrollIndicator={false}
      >
         <View style={tw`flex-row items-center my-5 mt-10 mb-8`}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text
          style={[
            tw`text-lg font-semibold text-center ml-20`,
            { color: Colors.light.titleText },
          ]}
        >
          Privacy Policy
        </Text>
      </View>
        <Text
          style={[
            tw`text-sm font-semibold mb-`,
            { color: Colors.light.titleText },
          ]}
        >
          Acceptance of the Privacy Policy
        </Text>
        <View style={[tw`h-0.5  mb-4`,{color:Colors.light.grayText}]} />
        <Text style={[tw`text-xs mb-4 leading-5`,{color:Colors.light.grayText}]}>
         Planet Rebag is committed to protecting your privacy. This policy explains how we handle your personal information when you use our mobile application. We may collect personal details such as your name, email address, and other information you provide when you sign up or use the app. We also collect usage data like app activity and device information to help us improve the app’s performance and user experience. Location data may be collected if you allow it, and it is only used to enhance app features.
        </Text>
        <Text style={[tw`text-xs mb-4 leading-5`,{color:Colors.light.grayText}]}>
         We use your information to operate and maintain the app, respond to support requests, improve user experience, and send optional notifications. Your data is stored securely using trusted services like Firebase. We do not sell your personal information. However, we may share your data with service providers to help operate the app, or with legal authorities if required by law.
        </Text>
        <Text style={[tw`text-xs mb-4 leading-5`  ,{color:Colors.light.grayText}]}>
         You can request access to, update, or delete your information by contacting us. You can also turn off app notifications in your device settings. We do not knowingly collect data from children under 13. If we discover that such data has been collected, we will remove it promptly. We may occasionally update this policy, and any changes will be shared within the app. If you have any questions or concerns, please contact us at plantrebag@support.com .
        </Text>
      </ScrollView>
    </View>
  );
}
