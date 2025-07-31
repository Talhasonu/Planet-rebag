import { PropsWithChildren } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

import { Ionicons } from "@expo/vector-icons";

export function Collapsible({
  children,
  title,
  isOpen,
  onPress,
}: PropsWithChildren & {
  title: string;
  isOpen: boolean;
  onPress: () => void;
}) {
  const theme = useColorScheme() ?? "light";

  return (
    <ThemedView>
      <TouchableOpacity
        style={[styles.heading, { justifyContent: "space-between" }]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <ThemedText type="defaultSemiBold">{title}</ThemedText>
        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={18}
          color={theme === "light" ? Colors.light.icon : Colors.dark.icon}
          style={{ marginLeft: 2 }}
        />
      </TouchableOpacity>
      {isOpen && <ThemedView style={styles.content}>{children}</ThemedView>}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    color: Colors.light.titleText,
  },
  content: {
    marginTop: 6,
    marginRight: 28,
  },
});
