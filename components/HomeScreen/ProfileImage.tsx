import { router } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import tw from "tailwind-react-native-classnames";

interface ProfileImageProps {
  uri?: string;
  initials?: string;
  size?: number;
}

const ProfileImage: React.FC<ProfileImageProps> = ({
  uri,
  initials = "A",
  size = 40,
}) => {
  if (uri) {
    return (
      <TouchableOpacity onPress={() => router.push("/screen/home/Profile/Profile")}
      style={tw`bg-red-500`}>
      <Image
      
        source={{ uri }}
        style={[
          tw`rounded-full  overflow-hidden`,
          { width: size, height: size },
        ]}
        resizeMode="cover"
      />
      </TouchableOpacity>
    );
  }
  return (
    <TouchableOpacity
    onPress={() => router.push("/screen/home/Profile/Profile")}
    >
    <View
    
      style={[
        tw`rounded-full  bg-gray-300 items-center justify-center overflow-hidden`,
        { width: size, height: size },
      ]}
    >
      <Text style={tw`text-lg font-bold text-white`}>{initials}</Text>
    </View>
    </TouchableOpacity>
  );
};

export default ProfileImage;
