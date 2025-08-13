import { useAuth } from "@/contexts/AuthContext";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "tailwind-react-native-classnames";

interface ProfileImageProps {
  uri?: string;
  initials?: string;
  size?: number;
  debug?: boolean;
}

const ProfileImage: React.FC<ProfileImageProps> = ({
  uri,
  initials,
  size = 40,
  debug = false,
}) => {
  const { userInfo, loading, profileImageUri, userInitials } = useAuth();
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  // Helper function to get initials from name (fallback if context doesn't provide them)
  const getInitials = (name?: string): string => {
    if (!name) return "U"; // Default to "U" for User

    const names = name.trim().split(/\s+/);
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    return `${names[0].charAt(0)}${names[names.length - 1].charAt(
      0
    )}`.toUpperCase();
  };

  // Use props first, then context computed properties, then fallback computation
  const displayImageUri = uri || profileImageUri || userInfo?.photoURL;
  const displayInitials =
    initials || userInitials || getInitials(userInfo?.name || userInfo?.email);

  // Debug logging
  if (debug) {
    console.log("ProfileImage Debug:", {
      uri,
      profileImageUri,
      userInfo_photoURL: userInfo?.photoURL,
      displayImageUri,
      displayInitials,
      userInfo_name: userInfo?.name,
      userInfo_email: userInfo?.email,
      imageError,
      loading,
    });
  }

  // Show loading state
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

  // Show image if available and no error occurred
  if (displayImageUri && !imageError) {
    return (
      <TouchableOpacity
        onPress={() => router.push("/screen/home/EditProfile/EditProfile")}
        style={[
          tw`rounded-full overflow-hidden border border-gray-200 bg-gray-100`,
          { width: size, height: size },
        ]}
      >
        {imageLoading && (
          <View
            style={[
              tw`absolute inset-0 rounded-full bg-gray-100 items-center justify-center z-10`,
              { width: size, height: size },
            ]}
          >
            <ActivityIndicator size="small" color="#6B7280" />
          </View>
        )}
        <Image
          source={{ uri: displayImageUri }}
          style={[tw`rounded-full`, { width: size, height: size }]}
          resizeMode="cover"
          onError={() => {
            console.log("Profile image failed to load:", displayImageUri);
            setImageError(true);
            setImageLoading(false);
          }}
          onLoadStart={() => {
            setImageError(false);
            setImageLoading(true);
          }}
          onLoadEnd={() => setImageLoading(false)}
          onLoad={() => setImageLoading(false)}
        />
      </TouchableOpacity>
    );
  }

  // Fallback to initials
  return (
    <TouchableOpacity
      onPress={() => router.push("/screen/home/EditProfile/EditProfile")}
    >
      <View
        style={[
          tw`rounded-full bg-blue-500 items-center justify-center border border-gray-200 shadow-sm`,
          { width: size, height: size },
        ]}
      >
        <Text
          style={[
            tw`font-bold text-white`,
            { fontSize: Math.max(12, size * 0.4) },
          ]}
        >
          {displayInitials}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ProfileImage;
