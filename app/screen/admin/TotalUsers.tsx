import AuthenticatedRoute from "@/components/AuthenticatedRoute";
import { Colors } from "@/constants/Colors";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/utils/firebase";
import { showToast } from "@/utils/toast";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "tailwind-react-native-classnames";

interface User {
  uid: string;
  email: string;
  displayName: string;
  role: "user" | "admin";
  status: "enabled" | "disabled";
  fullName?: string;
  phoneNumber?: string;
  username?: string;
  createdAt?: string;
  lastLoginAt?: string;
  profileImageUri?: string;
}

const TotalUsersScreen: React.FC = () => {
  const { userInfo } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [updating, setUpdating] = useState(false);

  // Filter options
  const filterOptions = [
    { key: "All", label: "All", count: 0 },
    { key: "Active", label: "Active", count: 0 },
    { key: "Admin", label: "Admins", count: 0 },
    { key: "Disabled", label: "Disabled", count: 0 },
    { key: "Complete", label: "Complete Profile", count: 0 },
  ];

  // Update filter counts
  const updateFilterCounts = () => {
    filterOptions[0].count = users.length; // All
    filterOptions[1].count = users.filter((u) => u.status === "enabled").length; // Active
    filterOptions[2].count = users.filter((u) => u.role === "admin").length; // Admin
    filterOptions[3].count = users.filter(
      (u) => u.status === "disabled"
    ).length; // Disabled
    filterOptions[4].count = users.filter(
      (u) => u.phoneNumber && u.fullName && u.phoneNumber.length > 0
    ).length; // Complete Profile
  };

  // Apply filter based on active filter
  const applyFilter = (userList: User[]) => {
    switch (activeFilter) {
      case "Active":
        return userList.filter((u) => u.status === "enabled");
      case "Admin":
        return userList.filter((u) => u.role === "admin");
      case "Disabled":
        return userList.filter((u) => u.status === "disabled");
      case "Complete":
        return userList.filter(
          (u) => u.phoneNumber && u.fullName && u.phoneNumber.length > 0
        );
      default:
        return userList;
    }
  };

  // Check if current user is admin
  useEffect(() => {
    if (userInfo?.role !== "admin") {
      showToast.error(
        "Access Denied",
        "You don't have permission to access this page."
      );
      router.back();
    }
  }, [userInfo]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const usersRef = collection(db, "users");
      const q = query(usersRef, orderBy("email"));
      const querySnapshot = await getDocs(q);

      const fetchedUsers: User[] = [];
      querySnapshot.forEach((doc) => {
        const userData = doc.data();

        fetchedUsers.push({
          uid: doc.id,
          email: userData.email || "",
          displayName:
            userData.fullName ||
            userData.name ||
            userData.displayName ||
            userData.email?.split("@")[0] ||
            "User",
          role: userData.role || "user",
          status: userData.status || "enabled",
          fullName: userData.fullName || userData.name || userData.displayName,
          phoneNumber: userData.phoneNumber?.toString() || "",
          username: userData.userName || userData.username || "",
          createdAt: userData.createdAt || userData.updatedAt || "",
          lastLoginAt: userData.lastLoginAt || "",
          profileImageUri: userData.photoURL || userData.profileImageUri || "",
        });
      });

      setUsers(fetchedUsers);
      setFilteredUsers(fetchedUsers);

      if (fetchedUsers.length === 0) {
        showToast.success(
          "Users Loaded",
          "No users are registered in the system yet."
        );
      } else {
        showToast.success(
          "Success",
          `Loaded ${fetchedUsers.length} users successfully`
        );
      }
    } catch (error: any) {
      let errorMessage = "Unable to fetch users from the database.";

      if (error.code === "permission-denied") {
        errorMessage =
          "Access denied: You don't have permission to view users. Please contact your administrator to configure Firestore security rules.";
      } else if (error.code === "unavailable") {
        errorMessage =
          "Database is currently unavailable. Please check your internet connection and try again.";
      } else if (error.code === "unauthenticated") {
        errorMessage = "Authentication required. Please log in again.";
      } else {
        errorMessage =
          error.message || "An unexpected error occurred while fetching users.";
      }

      setError(errorMessage);

      showToast.error("Failed to Load Users", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
    fetchUsers();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUsers();
    setRefreshing(false);
  };

  useEffect(() => {
    if (userInfo?.role === "admin") {
      fetchUsers();
    }
  }, [userInfo]);

  // Filter users based on search query and active filter
  useEffect(() => {
    updateFilterCounts();

    let filtered = users;

    // Apply search filter first
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter(
        (user) =>
          user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.phoneNumber?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply tab filter
    filtered = applyFilter(filtered);

    setFilteredUsers(filtered);
  }, [searchQuery, users, activeFilter]);

  const getRoleColor = (role: string) => {
    return role === "admin" ? Colors.light.primaryGreen : "#6B7280";
  };

  const getStatusColor = (status: string) => {
    return status === "enabled" ? "#10B981" : "#EF4444";
  };

  const getUserInitials = (displayName: string) => {
    return displayName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  // Function to update user status
  const updateUserStatus = async (
    userId: string,
    newStatus: "enabled" | "disabled",
    userName: string
  ) => {
    try {
      setUpdating(true);

      // Debug logging
      console.log("🔄 Attempting to update user status:", {
        userId,
        newStatus,
        userName,
        currentUserRole: userInfo?.role,
        currentUserId: userInfo?.uid,
      });

      // Prevent disabling own account
      if (userId === userInfo?.uid) {
        showToast.error("Error", "You cannot disable your own account");
        return;
      }

      const userDocRef = doc(db, "users", userId);
      const updateData = {
        status: newStatus,
        updatedAt: new Date().toISOString(),
      };

      console.log("📝 Update data:", updateData);
      console.log("🎯 Target document:", userDocRef.path);

      await updateDoc(userDocRef, updateData);

      console.log("✅ User status updated successfully in Firestore");

      // Update local state
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.uid === userId ? { ...user, status: newStatus } : user
        )
      );

      // Update filtered users as well
      setFilteredUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.uid === userId ? { ...user, status: newStatus } : user
        )
      );

      const action = newStatus === "enabled" ? "enabled" : "disabled";

      // Send notification to the user about status change
      let successMessage = `${userName} has been ${action} successfully`;

      // try {
      //   const notificationSent = await sendStatusChangeNotification(
      //     userId,
      //     userName,
      //     newStatus
      //   );
      //   if (notificationSent) {
      //     successMessage += " and notified";
      //     console.log("🔔 Status change notification sent successfully");
      //   } else {
      //     console.warn(
      //       "⚠️ Status updated but notification failed (non-critical)"
      //     );
      //   }
      // } catch (notificationError: any) {
      //   console.warn(
      //     "⚠️ Notification error (non-critical):",
      //     notificationError.message
      //   );
      // }

      showToast.success("Status Updated", successMessage);
    } catch (error: any) {
      console.error("❌ Error updating user status:", error);
      console.error("📋 Error details:", {
        code: error.code,
        message: error.message,
        stack: error.stack,
      });

      let errorMessage = "Failed to update user status";
      let helpText = "";

      if (error.code === "permission-denied") {
        errorMessage = "Permission denied: Unable to update user status";
        helpText =
          "🔧 SOLUTION REQUIRED:\n\n1. Go to Firebase Console\n2. Navigate to Firestore Database → Rules\n3. Deploy the security rules from your project\n4. Ensure you have admin role in Firestore\n\nContact your developer to configure Firestore security rules.";

        // Show a more detailed error dialog
        setTimeout(() => {
          Alert.alert(
            "🔒 Firestore Permission Error",
            "The Firebase security rules need to be updated to allow admin operations.\n\nRequired Actions:\n• Deploy Firestore security rules\n• Verify admin permissions\n• Contact technical support",
            [
              {
                text: "Copy Error Details",
                onPress: () => {
                  // You could copy error details to clipboard here
                  showToast.error(
                    "Error Details",
                    `Code: ${error.code}\nMessage: ${error.message}`
                  );
                },
              },
              { text: "OK" },
            ]
          );
        }, 1000);
      } else if (error.code === "not-found") {
        errorMessage = "User document not found";
        helpText = "The user document may have been deleted.";
      } else if (error.code === "unavailable") {
        errorMessage = "Firestore service is currently unavailable";
        helpText = "Please check your internet connection and try again.";
      } else {
        errorMessage = error.message || "An unexpected error occurred";
      }

      showToast.error("Error", errorMessage);

      if (helpText) {
        console.error("🔧 Help Text:", helpText);
      }
    } finally {
      setUpdating(false);
    }
  };

  // Function to confirm status change
  const confirmStatusChange = (user: User) => {
    const action = user.status === "enabled" ? "disable" : "enable";
    const newStatus = user.status === "enabled" ? "disabled" : "enabled";

    Alert.alert(
      `${action.charAt(0).toUpperCase() + action.slice(1)} User`,
      `Are you sure you want to ${action} ${user.displayName}?

${
  newStatus === "disabled"
    ? "This user will be automatically logged out and won't be able to log in until enabled again."
    : "This user will be able to log in again."
}`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: action.charAt(0).toUpperCase() + action.slice(1),
          style: newStatus === "disabled" ? "destructive" : "default",
          onPress: () =>
            updateUserStatus(user.uid, newStatus, user.displayName),
        },
      ]
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not available";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };

  if (loading) {
    return (
      <AuthenticatedRoute>
        <StatusBar
          backgroundColor={Colors.light.primaryGreen}
          barStyle="light-content"
        />
        <View style={tw`flex-1 justify-center items-center bg-gray-50`}>
          <ActivityIndicator size="large" color={Colors.light.primaryGreen} />
          <Text
            style={[
              tw`mt-4 text-lg font-medium`,
              { color: Colors.light.titleText },
            ]}
          >
            Loading Users...
          </Text>
          <Text
            style={[
              tw`mt-2 text-center px-8`,
              { color: Colors.light.grayText },
            ]}
          >
            Fetching user data from the database
          </Text>
          {retryCount > 0 && (
            <Text style={[tw`mt-2 text-sm`, { color: Colors.light.grayText }]}>
              Attempt {retryCount + 1}
            </Text>
          )}
        </View>
      </AuthenticatedRoute>
    );
  }

  // Show error state with retry option
  if (error && users.length === 0) {
    return (
      <AuthenticatedRoute>
        <StatusBar
          backgroundColor={Colors.light.primaryGreen}
          barStyle="light-content"
        />
        <View style={tw`flex-1 justify-center items-center bg-gray-50 px-6`}>
          <Ionicons name="warning-outline" size={64} color="#EF4444" />
          <Text
            style={[
              tw`text-xl font-semibold mt-4 text-center`,
              { color: Colors.light.titleText },
            ]}
          >
            Unable to Load Users
          </Text>
          <Text
            style={[
              tw`text-center mt-2 mb-6`,
              { color: Colors.light.grayText },
            ]}
          >
            {error}
          </Text>
          <TouchableOpacity
            style={[
              tw`px-6 py-3 rounded-lg`,
              { backgroundColor: Colors.light.primaryGreen },
            ]}
            onPress={handleRetry}
          >
            <Text style={tw`text-white font-medium`}>Try Again</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`mt-3`}
            onPress={() => setShowDebugInfo(true)}
          >
            <Text style={[tw`text-sm`, { color: Colors.light.primaryGreen }]}>
              Show Debug Info
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={tw`mt-2`} onPress={() => router.back()}>
            <Text style={[tw`text-sm`, { color: Colors.light.grayText }]}>
              Go Back
            </Text>
          </TouchableOpacity>
        </View>
      </AuthenticatedRoute>
    );
  }

  return (
    <AuthenticatedRoute>
      <StatusBar
        backgroundColor={Colors.light.primaryGreen}
        barStyle="light-content"
      />
      <View style={tw`flex-1 bg-gray-50`}>
        {/* Header */}
        <View
          style={[
            tw`px-6 pt-12 pb-6`,
            // { backgroundColor: Colors.light.primaryGreen },
          ]}
        >
          <View style={tw`flex-row items-center justify-between mb-6`}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons
                name="chevron-back"
                size={24}
                style={{ color: Colors.light.titleText }}
              />
            </TouchableOpacity>
            <Text
              style={[
                tw`text-white text-lg font-semibold`,
                { color: Colors.light.titleText },
              ]}
            >
              Total Users ({filteredUsers.length})
            </Text>
            <TouchableOpacity
              onPress={handleRetry}
              disabled={loading}
              style={tw`mr-3`}
            >
              <Ionicons
                name="refresh"
                size={24}
                color={
                  loading ? "rgba(255,255,255,0.5)" : Colors.light.titleText
                }
              />
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={() => setShowDebugInfo(!showDebugInfo)}>
              <Ionicons name="bug" size={20} color={Colors.light.titleText} />
            </TouchableOpacity> */}
          </View>

          {/* Search Bar */}
          <View
            style={[
              tw`flex-row items-center bg-white rounded-lg px-2 py-1`,
              { borderColor: Colors.light.borderColor },
            ]}
          >
            <MaterialIcons
              name="search"
              size={20}
              color={Colors.light.lightgrayText}
            />
            <TextInput
              style={[
                tw`flex-1 ml-3`,
                { color: Colors.light.titleText, fontSize: 12 },
              ]}
              placeholder="Search users by name, email, or phone..."
              placeholderTextColor={Colors.light.lightgrayText}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons
                  name="close-circle"
                  size={20}
                  color={Colors.light.lightgrayText}
                />
              </TouchableOpacity>
            )}
          </View>

          {/* Filter Tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={tw`mt-6`}
            contentContainerStyle={tw`px-2`}
          >
            {filterOptions.map((filter) => (
              <TouchableOpacity
                key={filter.key}
                style={[
                  tw`mr-3 px-4 py-1 rounded-full flex-row items-center`,
                  activeFilter === filter.key
                    ? { backgroundColor: Colors.light.primaryGreen }
                    : {
                        backgroundColor: "white",
                        borderWidth: 1,
                        borderColor: "#E5E7EB",
                      },
                ]}
                onPress={() => setActiveFilter(filter.key)}
              >
                <Text
                  style={[
                    tw`text-sm font-medium`,
                    {
                      color:
                        activeFilter === filter.key
                          ? "white"
                          : Colors.light.titleText,
                    },
                  ]}
                >
                  {filter.label}
                </Text>
                {filter.count > 0 && (
                  <View
                    style={[
                      tw`ml-2 px-2 py-1 rounded-full`,
                      activeFilter === filter.key
                        ? { backgroundColor: "rgba(255,255,255,0.3)" }
                        : { backgroundColor: Colors.light.primaryGreen },
                    ]}
                  >
                    <Text
                      style={[
                        tw`text-xs font-bold`,
                        {
                          color:
                            activeFilter === filter.key ? "white" : "white",
                        },
                      ]}
                    >
                      {filter.count}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Statistics */}
        {/* <View style={tw`px-6 py-4 bg-white mx-4 mt-4 rounded-lg shadow-sm`}>
          <View style={tw`flex-row justify-between`}>
            <View style={tw`items-center`}>
              <Text
                style={[
                  tw`text-2xl font-bold`,
                  { color: Colors.light.primaryGreen },
                ]}
              >
                {users.filter((u) => u.status === "enabled").length}
              </Text>
              <Text style={[tw`text-sm`, { color: Colors.light.grayText }]}>
                Active Users
              </Text>
            </View>
            <View style={tw`items-center`}>
              <Text
                style={[
                  tw`text-2xl font-bold`,
                  { color: Colors.light.primaryGreen },
                ]}
              >
                {users.filter((u) => u.role === "admin").length}
              </Text>
              <Text style={[tw`text-sm`, { color: Colors.light.grayText }]}>
                Admins
              </Text>
            </View>
            <View style={tw`items-center`}>
              <Text style={[tw`text-2xl font-bold`, { color: "#EF4444" }]}>
                {users.filter((u) => u.status === "disabled").length}
              </Text>
              <Text style={[tw`text-sm`, { color: Colors.light.grayText }]}>
                Disabled
              </Text>
            </View>
          </View>
        </View> */}

        {/* Users List */}
        <ScrollView
          style={tw`flex-1 px-4`}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[Colors.light.primaryGreen]}
              tintColor={Colors.light.primaryGreen}
            />
          }
        >
          {/* Active Filter Indicator */}
          {activeFilter !== "All" && (
            <View
              style={[
                tw`py-3 px-4 mx-2 mt-2  rounded-lg  `,
                { backgroundColor: Colors.light.green40 },
              ]}
            >
              <Text
                style={[
                  tw`text-sm text-center`,
                  { color: Colors.light.primaryGreen },
                ]}
              >
                Showing:{" "}
                {filterOptions.find((f) => f.key === activeFilter)?.label} (
                {filteredUsers.length})
              </Text>
            </View>
          )}

          {filteredUsers.length === 0 ? (
            <View style={tw`py-20 items-center`}>
              <Ionicons
                name="people-outline"
                size={64}
                color={Colors.light.lightgrayText}
              />
              <Text
                style={[
                  tw`text-lg font-medium mt-4`,
                  { color: Colors.light.grayText },
                ]}
              >
                {searchQuery ? "No users found" : "No users available"}
              </Text>
              {searchQuery && (
                <Text
                  style={[tw`text-sm mt-2`, { color: Colors.light.grayText }]}
                >
                  Try adjusting your search criteria
                </Text>
              )}
            </View>
          ) : (
            <View style={tw`py-4`}>
              {filteredUsers.map((user, index) => (
                <TouchableOpacity
                  key={user.uid}
                  style={tw`bg-white rounded-lg p-4 mb-3 shadow-sm relative`}
                  onPress={() => {
                    // You can add navigation to user details here if needed
                    showToast.success(
                      "User Info",
                      `Selected user: ${user.displayName}`
                    );
                  }}
                >
                  {/* Status Toggle Button - Top Right */}
                  <TouchableOpacity
                    style={[
                      tw`p-2 rounded-full absolute top-2 right-2 z-10`,
                      {
                        backgroundColor:
                          user.status === "enabled" ? "#EF444420" : "#10B98120",
                      },
                    ]}
                    onPress={() => confirmStatusChange(user)}
                    disabled={user.uid === userInfo?.uid || updating}
                  >
                    <MaterialIcons
                      name={
                        user.status === "enabled" ? "block" : "check-circle"
                      }
                      size={16}
                      color={
                        user.uid === userInfo?.uid
                          ? Colors.light.lightgrayText
                          : user.status === "enabled"
                          ? "#EF4444"
                          : "#10B981"
                      }
                    />
                  </TouchableOpacity>

                  <View style={tw`flex-row items-center justify-between`}>
                    <View style={tw`flex-1 pr-12`}>
                      {/* User Avatar */}
                      <View style={tw`flex-row items-center mb-2`}>
                        <View
                          style={[
                            tw`w-10 h-10 rounded-full items-center justify-center mr-3 overflow-hidden`,
                            {
                              backgroundColor: `${Colors.light.primaryGreen}20`,
                            },
                          ]}
                        >
                          {user.profileImageUri ? (
                            <Image
                              source={{ uri: user.profileImageUri }}
                              style={tw`w-full h-full rounded-full`}
                              resizeMode="cover"
                            />
                          ) : (
                            <Text
                              style={[
                                tw`font-bold`,
                                { color: Colors.light.primaryGreen },
                              ]}
                            >
                              {getUserInitials(user.displayName)}
                            </Text>
                          )}
                        </View>
                        <View style={tw`flex-1`}>
                          <View style={tw`flex-row items-center`}>
                            <Text
                              style={[
                                tw`font-semibold text-base`,
                                { color: Colors.light.titleText },
                              ]}
                            >
                              {user.displayName}
                            </Text>
                            <View
                              style={[
                                tw`px-2 py-1 rounded-full ml-2`,
                                {
                                  backgroundColor: `${getRoleColor(
                                    user.role
                                  )}20`,
                                },
                              ]}
                            >
                              <Text
                                style={[
                                  tw`text-xs font-medium`,
                                  { color: getRoleColor(user.role) },
                                ]}
                              >
                                {user.role}
                              </Text>
                            </View>
                          </View>
                          <Text
                            style={[
                              tw`text-sm mb-1`,
                              { color: Colors.light.grayText },
                            ]}
                          >
                            {user.email}
                          </Text>
                          {user.phoneNumber && (
                            <Text
                              style={[
                                tw`text-sm`,
                                { color: Colors.light.grayText },
                              ]}
                            >
                              📞 {user.phoneNumber}
                            </Text>
                          )}
                        </View>
                      </View>

                      {/* User Status and Join Date */}
                      <View
                        style={tw`flex-row items-center justify-between mt-2`}
                      >
                        <View style={tw`flex-row items-center`}>
                          <View
                            style={[
                              tw`w-2 h-2 rounded-full mr-2`,
                              {
                                backgroundColor:
                                  user.status === "enabled"
                                    ? Colors.light.primaryGreen
                                    : "#EF4444",
                              },
                            ]}
                          />
                          <Text
                            style={[
                              tw`text-sm`,
                              {
                                color:
                                  user.status === "enabled"
                                    ? Colors.light.primaryGreen
                                    : "#EF4444",
                              },
                            ]}
                          >
                            {user.status === "enabled" ? "Active" : "Disabled"}
                          </Text>
                        </View>
                        <Text
                          style={[
                            tw`text-xs`,
                            { color: Colors.light.grayText },
                          ]}
                        >
                          Joined: {formatDate(user.createdAt)}
                        </Text>
                      </View>

                      {/* Last Login */}
                      {user.lastLoginAt && (
                        <View style={tw`mt-1`}>
                          <Text
                            style={[
                              tw`text-xs`,
                              { color: Colors.light.grayText },
                            ]}
                          >
                            Last login: {formatDate(user.lastLoginAt)}
                          </Text>
                        </View>
                      )}
                    </View>

                    {/* Action Arrow */}
                    <MaterialIcons
                      name="chevron-right"
                      size={24}
                      color={Colors.light.lightgrayText}
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </AuthenticatedRoute>
  );
};

export default TotalUsersScreen;
