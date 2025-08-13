import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import tw from "tailwind-react-native-classnames";

interface UserRoleStatusProps {
  role: string;
  status: string;
  showLabels?: boolean;
}

const UserRoleStatus: React.FC<UserRoleStatusProps> = ({
  role,
  status,
  showLabels = false,
}) => {
  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "shield";
      case "moderator":
        return "star";
      case "premium":
        return "diamond";
      default:
        return "person";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return Colors.light.primaryGreen;
      case "moderator":
        return "#FF6B35";
      case "premium":
        return "#FFD700";
      default:
        return Colors.light.grayText;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "enabled":
      case "active":
        return "#10B981";
      case "disabled":
      case "suspended":
        return "#EF4444";
      case "pending":
        return "#F59E0B";
      default:
        return Colors.light.grayText;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "enabled":
      case "active":
        return "checkmark-circle";
      case "disabled":
      case "suspended":
        return "close-circle";
      case "pending":
        return "time";
      default:
        return "help-circle";
    }
  };

  return (
    <View style={tw`flex-row items-center justify-between`}>
      {/* Role */}
      <View style={tw`flex-row items-center flex-1`}>
        <View style={tw`flex-row items-center`}>
          <Ionicons
            name={getRoleIcon(role) as any}
            size={16}
            color={getRoleColor(role)}
            style={tw`mr-1`}
          />
          <Text
            style={[
              tw`text-sm font-medium capitalize`,
              { color: getRoleColor(role) },
            ]}
          >
            {role}
          </Text>
        </View>
        {showLabels && (
          <Text style={[tw`text-xs ml-2`, { color: Colors.light.grayText }]}>
            Role
          </Text>
        )}
      </View>

      {/* Status */}
      <View style={tw`flex-row items-center`}>
        {showLabels && (
          <Text style={[tw`text-xs mr-2`, { color: Colors.light.grayText }]}>
            Status:
          </Text>
        )}
        <View style={tw`flex-row items-center`}>
          <Ionicons
            name={getStatusIcon(status) as any}
            size={16}
            color={getStatusColor(status)}
            style={tw`mr-1`}
          />
          <Text
            style={[
              tw`text-sm font-medium capitalize`,
              { color: getStatusColor(status) },
            ]}
          >
            {status}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default UserRoleStatus;
