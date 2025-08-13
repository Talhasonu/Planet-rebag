import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import tw from "tailwind-react-native-classnames";

interface AdminCardProps {
  title: string;
  count: number;
  onPress?: () => void;
  backgroundColor?: string;
  iconName?: string;
  iconColor?: string;
  iconLibrary?: "Ionicons" | "Feather" | "AntDesign";
}

const AdminCard: React.FC<AdminCardProps> = ({
  title,
  count,
  onPress,
  backgroundColor = "rgba(34, 197, 94, 0.1)",
  iconName = "stats-chart",
  iconColor = Colors.light.titleText,
  iconLibrary = "Ionicons",
}) => {
  const renderIcon = () => {
    const iconProps = {
      size: 24,
      color: iconColor,
      style: tw`mb-1 mt-1`,
    };

    switch (iconLibrary) {
      case "Feather":
        return <Feather name={iconName as any} {...iconProps} />;
      case "AntDesign":
        return <AntDesign name={iconName as any} {...iconProps} />;
      case "Ionicons":
      default:
        return <Ionicons name={iconName as any} {...iconProps} />;
    }
  };

  return (
    <TouchableOpacity
      style={[tw`flex  h-32 rounded-xl px-2`, { backgroundColor, width: 100 }]}
      onPress={onPress}
    >
      <View style={tw``}>
        {renderIcon()}
        <Text style={[tw`text-xs  mb-1`, { color: Colors.light.titleText }]}>
          {title}
        </Text>
        <View style={tw`flex-row items-center justify-between`}>
          <Text
            style={[
              tw`text-2xl font-medium`,
              { color: Colors.light.titleText },
            ]}
          >
            {count}
          </Text>
          {/* <Entypo name="bar-graph" size={24} color={iconColor} /> */}
        </View>
        <View style={tw`flex-row items-center justify-between mt-2 `}>
          <Text style={[tw`text-xs`, { color: iconColor }]}>View Details</Text>
          <AntDesign
            name="arrowright"
            size={15}
            color={iconColor}
            style={tw`ml-1.5`}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default AdminCard;
