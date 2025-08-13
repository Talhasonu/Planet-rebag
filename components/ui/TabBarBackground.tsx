import React from "react";
import { StyleSheet, View } from "react-native";
import Tabbg from "../../assets/images/tab-bg.svg"; // Adjust the path as necessary
export default function TabBarBackground() {
  return (
    <View style={styles.container}>
      <Tabbg
        width="100%"
        height="120px"
        style={{
          marginBottom: 80,
          padding: 0,
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          top: -40,
          backgroundRepeat: "no-repeat",
        }}
      />
    </View>
  );
}

export function useBottomTabOverflow() {
  return 0;
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
