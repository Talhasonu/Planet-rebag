import AuthenticatedRoute from "@/components/AuthenticatedRoute";
import UserManagement from "@/components/UserManagement";
import { Colors } from "@/constants/Colors";
import React from "react";
import { StatusBar } from "react-native";

export default function UserManagementScreen() {
  return (
    <AuthenticatedRoute>
      <StatusBar
        backgroundColor={Colors.light.primaryGreen}
        barStyle="light-content"
      />
      <UserManagement />
    </AuthenticatedRoute>
  );
}
