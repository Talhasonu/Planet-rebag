import { useAuth } from "@/contexts/AuthContext";
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
  const { profileImageUri, userInitials, loading } = useAuth();

  // Use props if provided, otherwise use auth context
  const displayImageUri = uri || profileImageUri;
  const displayInitials = initials !== "A" ? initials : userInitials;

  if (loading) {
    return (
      <View
        style={[
          tw`rounded-full bg-gray-200 items-center justify-center`,
          { width: size, height: size },
        ]}
      >
        <Text style={tw`text-xs text-gray-400`}>...</Text>
      </View>
    );
  }

  if (displayImageUri) {
    return (
      <TouchableOpacity
        onPress={() => router.push("/screen/home/EditProfile/EditProfile")}
      >
        <Image
          source={{ uri: displayImageUri }}
          style={[
            tw`rounded-full overflow-hidden`,
            { width: size, height: size },
          ]}
          resizeMode="cover"
        />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={() => router.push("/screen/home/EditProfile/EditProfile")}
    >
      <View
        style={[
          tw`rounded-full bg-gray-300 items-center justify-center overflow-hidden`,
          { width: size, height: size },
        ]}
      >
        <Text style={tw`text-lg font-bold text-white`}>{displayInitials}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ProfileImage;
