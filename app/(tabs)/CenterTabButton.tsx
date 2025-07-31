import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import tw from "tailwind-react-native-classnames";

import { Colors } from "@/constants/Colors";
import type { PressableProps } from "react-native";

import { Link } from "expo-router";

type CenterTabButtonProps = PressableProps & {
  accessibilityState?: { selected?: boolean };
};

export default function CenterTabButton({
  onPress,
  accessibilityState,
}: CenterTabButtonProps) {
  const focused = accessibilityState?.selected;
  return (
    <Link href="/screen/home/AddItems/AddItems" asChild>
      <TouchableOpacity
      style={tw`-top-8 justify-center items-center`}
      activeOpacity={0.8}
      >
      <View
        style={tw.style(
        `w-16 h-16 rounded-full justify-center items-center border-4 border-white`,
        focused
          ? { backgroundColor: "#7BB13C" }
          : { backgroundColor: "#8BC53F" }
        )}
      >
        <Ionicons
        name="add"
        size={25}
        color="#fff"
        style={[
          tw`text-center p-0.5 rounded-lg`,
          { backgroundColor: Colors.light.white40 },
        ]}
        />
      </View>
      </TouchableOpacity>
    </Link>
  );
}
