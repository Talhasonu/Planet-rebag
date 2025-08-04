import { auth } from "@/utils/firebase";
import { router } from "expo-router";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import React, { useEffect, useState } from "react";
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
  const [profileImageUri, setProfileImageUri] = useState<string | null>(
    uri || null
  );
  const [userInitials, setUserInitials] = useState<string>(initials);
  const [loading, setLoading] = useState(true);
  const db = getFirestore();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          // First try to get image from Firebase Auth
          if (currentUser.photoURL) {
            setProfileImageUri(currentUser.photoURL);
          }

          // Get user initials from display name or email
          const displayName = currentUser.displayName;
          const email = currentUser.email;

          if (displayName) {
            const nameInitials = displayName
              .split(" ")
              .map((name) => name.charAt(0).toUpperCase())
              .join("")
              .substring(0, 2);
            setUserInitials(nameInitials);
          } else if (email) {
            setUserInitials(email.charAt(0).toUpperCase());
          }

          try {
            const userDocRef = doc(db, "users", currentUser.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
              const userData = userDoc.data();

              // Use Firestore image if available and different from Auth
              if (userData.photoURL) {
                setProfileImageUri(userData.photoURL);
              }

              // Update initials from Firestore data if available
              const fullName = userData.fullName || userData.name;
              if (fullName) {
                const nameInitials = fullName
                  .split(" ")
                  .map((name: string) => name.charAt(0).toUpperCase())
                  .join("")
                  .substring(0, 2);
                setUserInitials(nameInitials);
              }
            }
          } catch (firestoreError) {
            console.log(
              "Could not fetch user data from Firestore:",
              firestoreError
            );
            // Continue with Firebase Auth data
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (uri) {
      setProfileImageUri(uri);
      setLoading(false);
    } else {
      fetchUserData();
    }
  }, [uri, db]);

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

  if (profileImageUri) {
    return (
      <TouchableOpacity
        onPress={() => router.push("/screen/home/EditProfile/EditProfile")}
      >
        <Image
          source={{ uri: profileImageUri }}
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
        <Text style={tw`text-lg font-bold text-white`}>{userInitials}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ProfileImage;
