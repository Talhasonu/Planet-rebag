import CenterTabButton from "@/app/(tabs)/CenterTabButton"
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].primaryGreen,
        tabBarInactiveTintColor: Colors[colorScheme ?? "light"].tabIconDefault,
        headerShown: false,
        tabBarBackground: TabBarBackground,
        tabBarStyle: {
          backgroundColor: "white",
          elevation: 0,
          borderTopWidth: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) =>
            focused ? (
              <Ionicons name="home" size={28} color={color} />
            ) : (
              <Ionicons name="home-outline" size={28} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="CenterTabButton"
        options={{
          title: "Add Item",
          tabBarButton: (props: any) => <CenterTabButton {...props} />,
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) =>
            focused ? (
              <Ionicons name="add-circle" size={36} color={color} />
            ) : (
              <Ionicons name="add-circle-outline" size={36} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Deals",
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) =>
            focused ? (
              <Ionicons name="grid" size={28} color={color} />
            ) : (
              <Ionicons name="grid-outline" size={28} color={color} />
            ),
        }}
      />
    </Tabs>
  );
}
