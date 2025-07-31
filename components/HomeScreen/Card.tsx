import React from "react";
import { Image, Text, View } from "react-native";
import tw from "tailwind-react-native-classnames";
import CardProgress from "./CardProgress";
import { Colors } from "@/constants/Colors";

interface CardProps {
  logo: any; // SVG component or image source
  title: string;
  cashback: string;
  stats: string;
  color: string;
  progressValue: number;
  progressMax: number;
  progressColor?: string;
  progressBackgroundColor?: string;
  cashbackLabel?: string;
  statsLabel?: string;
}

const Card: React.FC<CardProps> = ({
  logo,
  title,
  cashback,
  stats,
  color,
  progressValue,
  progressMax,
  progressColor = "#16a34a",
  progressBackgroundColor = "#d1fae5",
  cashbackLabel = "AED 0.5",
  statsLabel = "AED 1.00",
}) => (
  <View
    style={[
      tw`rounded-2xl p-2 m-1 `,
      { backgroundColor: color },
      { width: 100 },
    ]}
  >
    {/* Logo and Brand */}
    <View style={tw`items-start mb-1.5`}>
      {typeof logo === "function" ? (
        React.createElement(logo)
      ) : (
        <Image source={logo} />
      )}
    </View>
    {/* Cashback */}
    <Text style={[tw`font-bold text-xs mb-0.5`,{color:Colors.light.titleText}]}>{cashback}</Text>
    <Text style={[tw`mb-2`, { fontSize: 8, color: Colors.light.titleText }]}>{title}</Text>
    {/* Progress and Stats Row */}
    <View style={tw`flex-row items-center mt-2`}>
      <CardProgress
        value={progressValue}
        max={progressMax}
        color={progressColor}
        backgroundColor={progressBackgroundColor}
      />
      <View style={tw`ml-2`}>
        <Text style={[tw`mb-0.5`, { fontSize: 8, color: Colors.light.titleText }]}>{cashbackLabel}</Text>
        <Text style={[{ fontSize: 8 , color:Colors.light.titleText}]}>{statsLabel}</Text>
      </View>
    </View>
  </View>
);

export default Card;
