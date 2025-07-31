import React from "react";
import { Text, View } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";

interface CardProgressProps {
  value: number;
  max: number;
  color?: string;
    backgroundColor?: string;
}

const CardProgress: React.FC<CardProgressProps> = ({
  value,
  max,
  backgroundColor,
  color = "#16a34a",
}) => {
  const fill = (value / max) * 100;
  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <AnimatedCircularProgress
        size={40}
        width={8}
        fill={fill}
        tintColor={color}
        backgroundColor={backgroundColor}
        rotation={225}
        arcSweepAngle={270}
        lineCap="round"
        children={() => (
          <Text
            style={{ fontWeight: "bold", fontSize: 8 }}
          >{`${value}/${max}`}</Text>
        )}
      />
    </View>
  );
};

export default CardProgress;
