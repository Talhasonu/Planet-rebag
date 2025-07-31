import { Colors } from "@/constants/Colors";
import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import tw from "tailwind-react-native-classnames";
import Bag from "../../assets/images/bag.svg";
import Bottle from "../../assets/images/bottle.svg";
import Pendingbag from "../../assets/images/pendingbag.svg";
import { router } from "expo-router";
interface ReturnedRecordProps {
  bagsReturned: number;
  pendingReturns: number;
  backgroundColor?: string;
  type?: "Bag" | "Bottle";
}

const ReturnedRecord: React.FC<ReturnedRecordProps> = ({
  bagsReturned,
  pendingReturns,
  type = "Bag",
}) => {

  const handleBagPress = () => {
    router.push("/screen/home/TransactionHistory/TransactionHistory"); // Replace with your route name
  };
   const handleBottlePress = () => {
    router.push("/screen/home/PendingRedeem/PendingRedeem"); // Replace with your route name
  };
  return (
    <View style={tw`mb-4`}>
      <Text
        style={[tw`font-bold text-lg my-2`, { color: Colors.light.titleText }]}
      >
        Returned Record
      </Text>
      <View style={tw`flex-row`}>
        <TouchableOpacity
          style={[
            tw`flex-1 flex-row items-center justify-between rounded-xl p-3 mr-2`,
            { backgroundColor: "rgba(227, 136, 0, 0.1)" },
          ]}
          activeOpacity={0.7}
          onPress={handleBagPress}
        >
          <View style={tw`flex flex-row items-center`}>
            {type === "Bag" ? (
              <Bag width={24} height={24} style={tw``} />
            ) : (
              <Bottle width={24} height={24} style={tw``} />
            )}
            <Text
              style={[
                tw`font-normal ml-1`,
                { fontSize: 10, color: Colors.light.titleText },
              ]}
            >
              {type === "Bag" ? "Bags Returned" : "Bottles Returned"}
            </Text>
          </View>
          <View style={tw`flex flex-row items-center`}>
            <Text
              style={[tw`text-sm font-bold`, { color: Colors.light.titleText }]}
            >
              {bagsReturned}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleBottlePress}>
          <View
            style={[
              tw`flex-1 flex-row items-center justify-between rounded-xl p-3`,
              { backgroundColor: "rgba(255, 61, 61, 0.1)" },
            ]}
        >
          <View style={tw`flex flex-row items-center`}>
            <Pendingbag width={24} height={24} style={tw`mr-1`} />
            <Text
              style={[
                tw`font-normal`,
                { fontSize: 10, color: Colors.light.titleText },
              ]}
            >
              Pending Returns
            </Text>
          </View>
          <View style={tw`flex flex-row items-center`}>
            <Text
              style={[
                tw`text-sm font-bold ml-2`,
                { color: Colors.light.titleText },
              ]}
            >
              {pendingReturns}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  </View>
  );
};

export default ReturnedRecord;
