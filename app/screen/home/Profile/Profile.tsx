import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import tw from "tailwind-react-native-classnames";

import { Colors } from "@/constants/Colors";
import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/utils/firebase";
import { showToast } from "@/utils/toast";
import {
  AntDesign,
  Foundation,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { router } from "expo-router";
import { signOut } from "firebase/auth";

export default function Profile() {
  const { userInfo,  loading: authLoading } = useAuth();
  const [userName, setUserName] = useState<string>("User");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userInfo) {
      setUserName(userInfo.displayName || userInfo.fullName || "User");
      setLoading(false);
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [userInfo, authLoading]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // await clearUserInfo(); // Clear user info from context and AsyncStorage
      showToast.success("Logged out", "You have been signed out.");
      router.replace("/screen/(auth)/Login");
    } catch (error: any) {
      showToast.error(
        "Logout failed",
        error.message || "Something went wrong."
      );
    }
  };
  return (
    <ScrollView style={tw`flex-1 bg-white`} contentContainerStyle={tw`pb-8`}>
      <View style={tw`flex-row items-center my-5 mt-14`}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text
          style={[
            tw`text-lg font-semibold text-center ml-28`,
            { color: Colors.light.titleText },
          ]}
        >
          {loading ? "Profile" : userName}
        </Text>
      </View>
      <View style={tw`px-6 `}>
        {/* Account Section */}
        <Text
          style={[
            tw`mt-6 mb-2 text-lg font-bold`,
            { color: Colors.light.titleText },
          ]}
        >
          Your Account
        </Text>
        <TouchableOpacity
          style={tw`bg-white flex-row justify-between items-center  rounded-lg py-3 `}
          onPress={() => router.push("/screen/home/EditProfile/EditProfile")}
        >
          <View style={tw`flex-row items-center`}>
            <MaterialCommunityIcons
              name="account-edit-outline"
              size={24}
              style={[tw``, { color: Colors.light.titleText }]}
            />
            <Text
              style={[tw`ml-2 text-base`, { color: Colors.light.titleText }]}
            >
              Edit Profile
            </Text>
          </View>
          <MaterialIcons
            name="navigate-next"
            size={24}
            style={[tw``, { color: Colors.light.lightgrayText }]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`bg-white flex-row justify-between items-center  rounded-lg py-3 `}
          onPress={() =>
            router.push("/screen/home/ChangePassword/ChangePassword")
          }
        >
          <View style={tw`flex-row items-center`}>
            <MaterialCommunityIcons
              name="account-key-outline"
              size={24}
              style={[tw``, { color: Colors.light.titleText }]}
            />
            <Text
              style={[tw`ml-2 text-base`, { color: Colors.light.titleText }]}
            >
              Change Password
            </Text>
          </View>
          <MaterialIcons
            name="navigate-next"
            size={24}
            style={[tw``, { color: Colors.light.lightgrayText }]}
          />
        </TouchableOpacity>
        {/* Support Section */}
        <Text
          style={[
            tw`mt-6 mb-2 text-lg font-bold`,
            { color: Colors.light.titleText },
          ]}
        >
          Support
        </Text>
        <View style={tw`bg-white rounded-lg`}>
          <TouchableOpacity
            style={tw`bg-white flex-row justify-between items-center  rounded-lg py-3 `}
            onPress={() => router.push("/screen/home/Faqs/Faqs")}
          >
            <View style={tw`flex-row items-center`}>
              <Foundation
                name="clipboard-notes"
                size={24}
                style={[tw``, { color: Colors.light.titleText }]}
              />
              <Text
                style={[tw`ml-2 text-base`, { color: Colors.light.titleText }]}
              >
                FAQs
              </Text>
            </View>
            <MaterialIcons
              name="navigate-next"
              size={24}
              style={[tw``, { color: Colors.light.lightgrayText }]}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`bg-white flex-row justify-between items-center  rounded-lg py-3 `}
            //   onPress={() => router.navigate("/edit-profile")}
          >
            <View style={tw`flex-row items-center`}>
              <MaterialCommunityIcons
                name="message-question-outline"
                size={24}
                style={[tw``, { color: Colors.light.titleText }]}
              />
              <Text
                style={[tw`ml-2 text-base`, { color: Colors.light.titleText }]}
              >
                Contact Us
              </Text>
            </View>
            <MaterialIcons
              name="navigate-next"
              size={24}
              style={[tw``, { color: Colors.light.lightgrayText }]}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`bg-white flex-row justify-between items-center  rounded-lg py-3 `}
            onPress={() =>
              router.push("/screen/home/PrivacyPolicy/PrivacyPolicy")
            }
          >
            <View style={tw`flex-row items-center`}>
              <AntDesign
                name="filetext1"
                size={24}
                style={[tw``, { color: Colors.light.titleText }]}
              />
              <Text
                style={[tw`ml-2 text-base`, { color: Colors.light.titleText }]}
              >
                Privacy Policy
              </Text>
            </View>
            <MaterialIcons
              name="navigate-next"
              size={24}
              style={[tw``, { color: Colors.light.lightgrayText }]}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`bg-white flex-row justify-between items-center  rounded-lg py-3 `}
            //   onPress={() => router.navigate("/edit-profile")}
          >
            <View style={tw`flex-row items-center`}>
              <AntDesign
                name="staro"
                size={24}
                style={[tw``, { color: Colors.light.titleText }]}
              />
              <Text
                style={[tw`ml-2 text-base`, { color: Colors.light.titleText }]}
              >
                Rate This App
              </Text>
            </View>
            <MaterialIcons
              name="navigate-next"
              size={24}
              style={[tw``, { color: Colors.light.lightgrayText }]}
            />
          </TouchableOpacity>
        </View>
        {/* Log Out */}
        <View style={tw`mt-6`}>
          <TouchableOpacity
            style={tw`bg-white flex-row justify-between items-center  rounded-lg py-3 `}
            onPress={() => handleLogout()}
          >
            <View style={tw`flex-row items-center`}>
              <MaterialIcons
                name="login"
                size={24}
                style={[tw`text-red-500`, {}]}
              />
              <Text style={[tw`ml-2 text-base font-bold text-red-500`, {}]}>
                Logout
              </Text>
            </View>
            <MaterialIcons
              name="navigate-next"
              size={24}
              style={[tw``, { color: Colors.light.lightgrayText }]}
            />
          </TouchableOpacity>
        </View>
      </View>
      {/* Footer */}
      <View style={tw`mt-20 items-center justify-center`}>
        <Text style={[tw`text-sm `, { color: Colors.light.titleText }]}>
          Terms and Conditions
        </Text>
        <Text style={[tw`text-sm mt-1`, { color: Colors.light.grayText }]}>
          App version 1.0
        </Text>
      </View>
    </ScrollView>
  );
}
