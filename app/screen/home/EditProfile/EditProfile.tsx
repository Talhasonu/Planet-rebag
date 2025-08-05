import { Colors } from "@/constants/Colors";
import { useAuth } from "@/contexts/AuthContext";
import { uploadImageToCloudinary } from "@/utils/cloudinary";
import { auth } from "@/utils/firebase";
import { showToast } from "@/utils/toast";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { updateProfile, User } from "firebase/auth";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  AppState,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "tailwind-react-native-classnames";

interface EditProfileFormData {
  fullName: string;
  email: string;
  username: string;
  phoneNumber: string;
  bio: string;
}

export default function EditProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isImagePickerActive, setIsImagePickerActive] = useState(false);
  const [showImagePickerModal, setShowImagePickerModal] = useState(false);
  const router = useRouter();
  const db = getFirestore();
  const appState = useRef(AppState.currentState);
  const { updateProfileImage, refreshUserData } = useAuth();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EditProfileFormData>({
    defaultValues: {
      fullName: "",
      email: "",
      username: "",
      phoneNumber: "",
      bio: "",
    },
  });

  useEffect(() => {
    const loadUserData = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        setUser(currentUser);
        setValue("fullName", currentUser.displayName || "");
        setValue("email", currentUser.email || "");
        setProfileImage(currentUser.photoURL);

        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();

            setValue("username", userData.userName || userData.username || "");
            setValue("phoneNumber", userData.phoneNumber?.toString() || "");
            setValue("bio", userData.bio || "");
            setValue(
              "fullName",
              userData.name ||
                userData.fullName ||
                currentUser.displayName ||
                ""
            );

            if (userData.photoURL) {
              setProfileImage(userData.photoURL);
            }
          } else {
            console.log(" No user document found in Firestore");
          }
        } catch (error: any) {
          console.log("Firestore access denied:", error.message);

          if (error.code === "permission-denied") {
            console.log(
              "Permission denied - you need to update Firestore security rules"
            );
          }

          if (currentUser.displayName) {
            setValue("fullName", currentUser.displayName);
          }
        }
      }
    };

    const handleAppStateChange = (nextAppState: any) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        console.log("App has come to the foreground!");
        setIsImagePickerActive(false);
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    loadUserData();

    return () => {
      subscription?.remove();
    };
  }, [setValue, db]);

  const pickImage = async () => {
    try {
      setShowImagePickerModal(true);
    } catch (error) {
      showToast.error("Error", "Failed to pick image");
    }
  };

  const closeModal = () => {
    setShowImagePickerModal(false);
  };

  const openCamera = async () => {
    try {
      closeModal();

      if (isImagePickerActive) {
        console.log("Image picker already active, ignoring request");
        return;
      }

      setIsImagePickerActive(true);

      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Sorry, we need camera permissions to take photos!"
        );
        setIsImagePickerActive(false);
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: false,
        exif: false,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        console.log("Image captured successfully:", result.assets[0].uri);
        const newImageUri = result.assets[0].uri;
        setProfileImage(newImageUri);
        updateProfileImage(newImageUri); // Update context immediately
        showToast.success("Success", "Photo captured successfully!");
      } else {
        console.log("Camera was cancelled or no image selected");
      }
    } catch (error: any) {
      console.error("Camera error:", error);
      showToast.error(
        "Error",
        `Failed to take photo: ${error.message || "Unknown error"}`
      );
    } finally {
      setIsImagePickerActive(false);
    }
  };

  const openGallery = async () => {
    try {
      closeModal();

      if (isImagePickerActive) {
        console.log("Image picker already active, ignoring request");
        return;
      }

      setIsImagePickerActive(true);

      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Sorry, we need camera roll permissions to make this work!"
        );
        setIsImagePickerActive(false);
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: false,
        exif: false,
      });

      console.log("Gallery result:", result);

      if (!result.canceled && result.assets && result.assets[0]) {
        console.log("Image selected successfully:", result.assets[0].uri);
        const newImageUri = result.assets[0].uri;
        setProfileImage(newImageUri);
        updateProfileImage(newImageUri); // Update context immediately
        showToast.success("Success", "Image selected successfully!");
      } else {
        console.log("Gallery was cancelled or no image selected");
      }
    } catch (error: any) {
      console.error("Gallery error:", error);
      showToast.error(
        "Error",
        `Failed to pick image from gallery: ${error.message || "Unknown error"}`
      );
    } finally {
      setIsImagePickerActive(false);
    }
  };

  const onSubmit = async (data: EditProfileFormData) => {
    try {
      if (!user) {
        showToast.error("Error", "No user found");
        return;
      }

      setUploading(true);

      let photoURL = user.photoURL;
      if (profileImage && profileImage !== user.photoURL) {
        console.log("🔄 Uploading image to Cloudinary...");
        photoURL = await uploadImageToCloudinary(profileImage);
        console.log("✅ Image uploaded successfully:", photoURL);
        // Update context with the uploaded URL
        updateProfileImage(photoURL);
      }

      await updateProfile(user, {
        displayName: data.fullName,
        photoURL: photoURL,
      });

      try {
        const userDocRef = doc(db, "users", user.uid);
        const userData = {
          fullName: data.fullName,
          email: data.email,
          username: data.username,
          phoneNumber: data.phoneNumber,
          bio: data.bio,
          photoURL: photoURL,
          updatedAt: new Date().toISOString(),
        };

        await setDoc(userDocRef, userData, { merge: true });

        console.log(" User data saved successfully to Firestore!");
      } catch (firestoreError: any) {
        console.error(" Firestore error:", firestoreError.message);

        if (firestoreError.code === "permission-denied") {
          console.log(
            "This is a permissions issue. Check Firestore security rules."
          );
        }
      }

      // Refresh auth context to ensure all components have latest data
      await refreshUserData();

      showToast.success(
        "Profile updated!",
        "Your profile has been updated successfully."
      );
    } catch (error: any) {
      showToast.error(
        "Update failed",
        error.message || "Something went wrong."
      );
    } finally {
      setUploading(false);
    }
  };

  const ImagePickerModal = () => {
    return (
      <Modal
        transparent={true}
        visible={showImagePickerModal}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View
          style={[
            tw`flex-1 justify-center items-center`,
            { backgroundColor: "rgba(0,0,0,0.5)" },
          ]}
        >
          <View style={tw`bg-white rounded-2xl p-6 mx-8 w-80 relative`}>
            <TouchableOpacity
              style={tw`absolute right-4 top-4 z-10`}
              onPress={closeModal}
              activeOpacity={0.8}
            >
              <Ionicons name="close" size={24} color={Colors.light.grayText} />
            </TouchableOpacity>

            <View style={tw`items-center mb-6 mt-2`}>
              <Text
                style={[
                  tw`text-lg font-semibold`,
                  { color: Colors.light.titleText },
                ]}
              >
                Update Profile Picture
              </Text>
            </View>

            <View style={tw`mb-4`}>
              <TouchableOpacity
                style={[
                  tw`p-4 rounded-lg mb-3 items-center border`,
                  { borderColor: Colors.light.primaryGreen },
                ]}
                onPress={openCamera}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    tw`text-base font-semibold`,
                    { color: Colors.light.primaryGreen },
                  ]}
                >
                  Take a Photo
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  tw`p-4 rounded-lg mb-3 items-center border`,
                  { borderColor: Colors.light.primaryGreen },
                ]}
                onPress={openGallery}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    tw`text-base font-semibold`,
                    { color: Colors.light.primaryGreen },
                  ]}
                >
                  Choose from Gallery
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <KeyboardAvoidingView
      style={[tw`flex-1`, { backgroundColor: "white" }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar backgroundColor={Colors.light.white} barStyle="dark-content" />

      <ScrollView
        contentContainerStyle={tw`px-6 pb-8`}
        showsVerticalScrollIndicator={false}
      >
        <View style={tw`flex-row items-center my-5 mt-14`}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="black" />
          </TouchableOpacity>
          <Text
            style={[
              tw`text-lg font-semibold text-center ml-24`,
              { color: Colors.light.titleText },
            ]}
          >
            Edit Profile
          </Text>
        </View>

        <View style={tw`my-4 `}>
          <Text
            style={[
              tw`text-2xl font-bold mb-2`,
              { color: Colors.light.greenText },
            ]}
          >
            Update Profile
          </Text>
          <Text style={[tw`text-sm `, { color: Colors.light.grayText }]}>
            Update your profile information.
          </Text>
        </View>

        <View style={tw`items-center mb-8`}>
          <TouchableOpacity onPress={pickImage} style={tw`relative`}>
            <View
              style={[
                tw`w-32 h-32 rounded-full items-center justify-center`,
                { backgroundColor: Colors.light.borderColor },
              ]}
            >
              {profileImage ? (
                <Image
                  source={{ uri: profileImage }}
                  style={tw`w-full h-full rounded-full`}
                  resizeMode="cover"
                />
              ) : (
                <Ionicons
                  name="person"
                  size={64}
                  color={Colors.light.lightgrayText}
                />
              )}
            </View>
            <View
              style={[
                tw`absolute bottom-0 right-0 w-10 h-10 rounded-full items-center justify-center`,
                { backgroundColor: Colors.light.primaryGreen },
              ]}
            >
              <MaterialIcons name="camera-alt" size={20} color="white" />
            </View>
          </TouchableOpacity>
          <Text style={[tw`mt-2 text-sm`, { color: Colors.light.grayText }]}>
            Tap to change profile picture
          </Text>
        </View>

        {/* Form */}
        <View style={tw`mb-6`}>
          {/* Full Name Input */}
          <View style={tw`mb-4`}>
            <Text
              style={[
                tw`text-base mb-2 font-bold`,
                { color: Colors.light.titleText },
              ]}
            >
              Full Name
            </Text>
            <Controller
              control={control}
              name="fullName"
              rules={{
                required: "Full name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[
                    tw`rounded-lg px-4 py-4`,
                    {
                      backgroundColor: Colors.light.borderColor,
                      color: Colors.light.lightgrayText,
                    },
                    errors.fullName && tw`border border-red-400`,
                  ]}
                  placeholder="Enter your full name"
                  placeholderTextColor={Colors.light.lightgrayText}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value || ""}
                  autoCapitalize="words"
                />
              )}
            />
            {errors.fullName && (
              <Text style={tw`text-red-300 text-xs mt-1`}>
                {errors.fullName.message}
              </Text>
            )}
          </View>

          <View style={tw`mb-4`}>
            <Text
              style={[
                tw`text-base mb-2 font-bold`,
                { color: Colors.light.titleText },
              ]}
            >
              Email
            </Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { value } }) => (
                <TextInput
                  style={[
                    tw`rounded-lg px-4 py-4`,
                    {
                      backgroundColor: Colors.light.borderColor,
                      color: Colors.light.lightgrayText,
                    },
                  ]}
                  placeholder="Email address"
                  placeholderTextColor={Colors.light.lightgrayText}
                  value={value || ""}
                  editable={false}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              )}
            />
            <Text style={[tw`text-xs mt-1`, { color: Colors.light.grayText }]}>
              Email cannot be changed
            </Text>
          </View>

          <View style={tw`mb-4`}>
            <Text
              style={[
                tw`text-base mb-2 font-bold`,
                { color: Colors.light.titleText },
              ]}
            >
              Username
            </Text>
            <Controller
              control={control}
              name="username"
              rules={{
                minLength: {
                  value: 3,
                  message: "Username must be at least 3 characters",
                },
                pattern: {
                  value: /^[a-zA-Z0-9_]+$/,
                  message:
                    "Username can only contain letters, numbers, and underscores",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[
                    tw`rounded-lg px-4 py-4`,
                    {
                      backgroundColor: Colors.light.borderColor,
                      color: Colors.light.lightgrayText,
                    },
                    errors.username && tw`border border-red-400`,
                  ]}
                  placeholder="Enter your username"
                  placeholderTextColor={Colors.light.lightgrayText}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value || ""}
                  autoCapitalize="none"
                />
              )}
            />
            {errors.username && (
              <Text style={tw`text-red-300 text-xs mt-1`}>
                {errors.username.message}
              </Text>
            )}
          </View>

          <View style={tw`mb-4`}>
            <Text
              style={[
                tw`text-base mb-2 font-bold`,
                { color: Colors.light.titleText },
              ]}
            >
              Phone Number
            </Text>
            <Controller
              control={control}
              name="phoneNumber"
              rules={{
                pattern: {
                  value: /^[0-9+\-\s()]+$/,
                  message: "Please enter a valid phone number",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[
                    tw`rounded-lg px-4 py-4`,
                    {
                      backgroundColor: Colors.light.borderColor,
                      color: Colors.light.lightgrayText,
                    },
                    errors.phoneNumber && tw`border border-red-400`,
                  ]}
                  placeholder="Enter your phone number"
                  placeholderTextColor={Colors.light.lightgrayText}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value || ""}
                  keyboardType="phone-pad"
                />
              )}
            />
            {errors.phoneNumber && (
              <Text style={tw`text-red-300 text-xs mt-1`}>
                {errors.phoneNumber.message}
              </Text>
            )}
          </View>

          <View style={tw`mb-4`}>
            <Text
              style={[
                tw`text-base mb-2 font-bold`,
                { color: Colors.light.titleText },
              ]}
            >
              Bio
            </Text>
            <Controller
              control={control}
              name="bio"
              rules={{
                maxLength: {
                  value: 150,
                  message: "Bio must be less than 150 characters",
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[
                    tw`rounded-lg px-4 py-4`,
                    {
                      backgroundColor: Colors.light.borderColor,
                      color: Colors.light.lightgrayText,
                      minHeight: 100,
                    },
                    errors.bio && tw`border border-red-400`,
                  ]}
                  placeholder="Tell us about yourself..."
                  placeholderTextColor={Colors.light.lightgrayText}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value || ""}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              )}
            />
            {errors.bio && (
              <Text style={tw`text-red-300 text-xs mt-1`}>
                {errors.bio.message}
              </Text>
            )}
          </View>

          <TouchableOpacity
            style={[
              tw`rounded-lg py-4 items-center mb-6 mt-4`,
              { backgroundColor: Colors.light.primaryGreen },
              (isSubmitting || uploading) && tw`opacity-70`,
            ]}
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting || uploading}
          >
            <Text
              style={[tw`font-bold text-base`, { color: Colors.light.white }]}
            >
              {isSubmitting || uploading ? "Saving..." : "Save Changes"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              tw`rounded-lg py-4 items-center border`,
              { borderColor: Colors.light.primaryGreen },
            ]}
            onPress={() => router.back()}
          >
            <Text
              style={[
                tw`font-bold text-base`,
                { color: Colors.light.primaryGreen },
              ]}
            >
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <ImagePickerModal />
    </KeyboardAvoidingView>
  );
}
