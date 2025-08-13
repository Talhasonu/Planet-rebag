import { Colors } from "@/constants/Colors";
import { useAuth } from "@/contexts/AuthContext";
import { showToast } from "@/utils/toast";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
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
}

const UserManagement: React.FC = () => {
  const { userInfo } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  const db = getFirestore();

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
            userData.email?.split("@")[0] ||
            "User",
          role: userData.role || "user",
          status: userData.status || "enabled",
          fullName: userData.fullName || userData.name,
          phoneNumber: userData.phoneNumber?.toString() || "",
          username: userData.userName || userData.username || "",
          createdAt: userData.createdAt || userData.updatedAt || "",
        });
      });

      setUsers(fetchedUsers);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      showToast.error("Error", "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.fullName &&
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const updateUserRole = async (userId: string, newRole: "user" | "admin") => {
    try {
      setUpdating(true);

      // Prevent changing own role
      if (userId === userInfo?.uid) {
        showToast.error("Error", "You cannot change your own role");
        return;
      }

      const userDocRef = doc(db, "users", userId);
      await updateDoc(userDocRef, {
        role: newRole,
        updatedAt: new Date().toISOString(),
      });

      // Update local state
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.uid === userId ? { ...user, role: newRole } : user
        )
      );

      showToast.success("Success", `User role updated to ${newRole}`);
      setShowRoleModal(false);
      setSelectedUser(null);
    } catch (error: any) {
      console.error("Error updating user role:", error);
      showToast.error("Error", "Failed to update user role");
    } finally {
      setUpdating(false);
    }
  };

  const updateUserStatus = async (
    userId: string,
    newStatus: "enabled" | "disabled"
  ) => {
    try {
      setUpdating(true);

      // Prevent disabling own account
      if (userId === userInfo?.uid) {
        showToast.error("Error", "You cannot disable your own account");
        return;
      }

      const userDocRef = doc(db, "users", userId);
      await updateDoc(userDocRef, {
        status: newStatus,
        updatedAt: new Date().toISOString(),
      });

      // Update local state
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.uid === userId ? { ...user, status: newStatus } : user
        )
      );

      showToast.success(
        "Success",
        `User ${newStatus === "enabled" ? "enabled" : "disabled"} successfully`
      );
    } catch (error: any) {
      console.error("Error updating user status:", error);
      showToast.error("Error", "Failed to update user status");
    } finally {
      setUpdating(false);
    }
  };

  const confirmRoleChange = (user: User) => {
    setSelectedUser(user);
    setShowRoleModal(true);
  };

  const confirmStatusChange = (user: User) => {
    const action = user.status === "enabled" ? "disable" : "enable";
    const newStatus = user.status === "enabled" ? "disabled" : "enabled";

    Alert.alert(
      `${action.charAt(0).toUpperCase() + action.slice(1)} User`,
      `Are you sure you want to ${action} ${user.displayName}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: action.charAt(0).toUpperCase() + action.slice(1),
          style: "destructive",
          onPress: () => updateUserStatus(user.uid, newStatus),
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-gray-50`}>
        <ActivityIndicator size="large" color={Colors.light.primaryGreen} />
        <Text style={[tw`mt-4 text-base`, { color: Colors.light.grayText }]}>
          Loading users...
        </Text>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      {/* Header */}
      <View
        style={[
          tw`px-6 pt-12 pb-6`,
          { backgroundColor: Colors.light.primaryGreen },
        ]}
      >
        <View style={tw`flex-row items-center justify-between mb-4`}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={tw`text-white text-lg font-semibold`}>
            User Management
          </Text>
          <View style={tw`w-6`} />
        </View>

        {/* Search Bar */}
        <View style={tw`flex-row items-center bg-white rounded-lg px-4 py-3`}>
          <MaterialIcons
            name="search"
            size={20}
            color={Colors.light.lightgrayText}
          />
          <TextInput
            style={[
              tw`flex-1 ml-3 text-base`,
              { color: Colors.light.titleText },
            ]}
            placeholder="Search users..."
            placeholderTextColor={Colors.light.lightgrayText}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Users List */}
      <ScrollView style={tw`flex-1 px-4 pt-4`} contentContainerStyle={tw`pb-8`}>
        <Text
          style={[
            tw`text-lg font-bold mb-4 px-2`,
            { color: Colors.light.titleText },
          ]}
        >
          All Users ({filteredUsers.length})
        </Text>

        {filteredUsers.map((user) => (
          <View
            key={user.uid}
            style={tw`bg-white rounded-xl p-4 mb-3 mx-2 shadow-sm`}
          >
            <View style={tw`flex-row items-start justify-between`}>
              <View style={tw`flex-1`}>
                <View style={tw`flex-row items-center mb-2`}>
                  <Text
                    style={[
                      tw`text-base font-semibold`,
                      { color: Colors.light.titleText },
                    ]}
                  >
                    {user.displayName}
                  </Text>
                  <View
                    style={[
                      tw`ml-2 px-2 py-1 rounded-full`,
                      {
                        backgroundColor:
                          user.role === "admin"
                            ? "#FF6B35"
                            : Colors.light.primaryGreen,
                      },
                    ]}
                  >
                    <Text style={tw`text-white text-xs font-medium`}>
                      {user.role.toUpperCase()}
                    </Text>
                  </View>
                  <View
                    style={[
                      tw`ml-2 px-2 py-1 rounded-full`,
                      {
                        backgroundColor:
                          user.status === "enabled" ? "#10B981" : "#EF4444",
                      },
                    ]}
                  >
                    <Text style={tw`text-white text-xs font-medium`}>
                      {user.status.toUpperCase()}
                    </Text>
                  </View>
                </View>

                <Text
                  style={[tw`text-sm mb-1`, { color: Colors.light.grayText }]}
                >
                  {user.email}
                </Text>

                {user.phoneNumber && (
                  <Text style={[tw`text-sm`, { color: Colors.light.grayText }]}>
                    📞 {user.phoneNumber}
                  </Text>
                )}
              </View>

              <View style={tw`flex-row`}>
                {/* Role Change Button */}
                <TouchableOpacity
                  style={[
                    tw`p-2 rounded-lg mr-2`,
                    { backgroundColor: `${Colors.light.primaryGreen}20` },
                  ]}
                  onPress={() => confirmRoleChange(user)}
                  disabled={user.uid === userInfo?.uid || updating}
                >
                  <MaterialIcons
                    name="admin-panel-settings"
                    size={20}
                    color={
                      user.uid === userInfo?.uid
                        ? Colors.light.lightgrayText
                        : Colors.light.primaryGreen
                    }
                  />
                </TouchableOpacity>

                {/* Status Toggle Button */}
                <TouchableOpacity
                  style={[
                    tw`p-2 rounded-lg`,
                    {
                      backgroundColor:
                        user.status === "enabled" ? "#EF444420" : "#10B98120",
                    },
                  ]}
                  onPress={() => confirmStatusChange(user)}
                  disabled={user.uid === userInfo?.uid || updating}
                >
                  <MaterialIcons
                    name={user.status === "enabled" ? "block" : "check-circle"}
                    size={20}
                    color={
                      user.uid === userInfo?.uid
                        ? Colors.light.lightgrayText
                        : user.status === "enabled"
                        ? "#EF4444"
                        : "#10B981"
                    }
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}

        {filteredUsers.length === 0 && (
          <View style={tw`items-center py-8`}>
            <MaterialIcons
              name="people-outline"
              size={64}
              color={Colors.light.lightgrayText}
            />
            <Text
              style={[tw`text-base mt-4`, { color: Colors.light.grayText }]}
            >
              No users found
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Role Change Modal */}
      <Modal
        visible={showRoleModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowRoleModal(false)}
      >
        <View style={tw`flex-1 justify-end bg-black bg-opacity-50`}>
          <View style={tw`bg-white rounded-t-3xl p-6`}>
            <Text
              style={[
                tw`text-xl font-bold mb-4 text-center`,
                { color: Colors.light.titleText },
              ]}
            >
              Change User Role
            </Text>

            {selectedUser && (
              <>
                <Text
                  style={[
                    tw`text-base mb-6 text-center`,
                    { color: Colors.light.grayText },
                  ]}
                >
                  Change role for {selectedUser.displayName}?{"\n"}Current role:{" "}
                  {selectedUser.role}
                </Text>

                <View style={tw`flex-row justify-around mb-6`}>
                  <TouchableOpacity
                    style={[
                      tw`flex-1 py-3 rounded-lg mr-2`,
                      {
                        backgroundColor:
                          selectedUser.role === "user"
                            ? Colors.light.lightgrayText
                            : Colors.light.primaryGreen,
                      },
                    ]}
                    onPress={() => updateUserRole(selectedUser.uid, "user")}
                    disabled={updating || selectedUser.role === "user"}
                  >
                    <Text style={tw`text-white text-center font-medium`}>
                      Make User
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      tw`flex-1 py-3 rounded-lg ml-2`,
                      {
                        backgroundColor:
                          selectedUser.role === "admin"
                            ? Colors.light.lightgrayText
                            : "#FF6B35",
                      },
                    ]}
                    onPress={() => updateUserRole(selectedUser.uid, "admin")}
                    disabled={updating || selectedUser.role === "admin"}
                  >
                    <Text style={tw`text-white text-center font-medium`}>
                      Make Admin
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={[
                    tw`py-3 rounded-lg`,
                    { backgroundColor: Colors.light.lightgrayText },
                  ]}
                  onPress={() => {
                    setShowRoleModal(false);
                    setSelectedUser(null);
                  }}
                  disabled={updating}
                >
                  <Text style={tw`text-white text-center font-medium`}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {updating && (
              <View
                style={tw`absolute inset-0 justify-center items-center bg-white bg-opacity-90`}
              >
                <ActivityIndicator
                  size="large"
                  color={Colors.light.primaryGreen}
                />
                <Text style={[tw`mt-2`, { color: Colors.light.grayText }]}>
                  Updating...
                </Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default UserManagement;
