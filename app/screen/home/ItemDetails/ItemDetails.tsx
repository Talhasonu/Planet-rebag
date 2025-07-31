import { Colors } from "@/constants/Colors";
import { FontAwesome6, Ionicons, MaterialIcons } from "@expo/vector-icons";

import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import tw from "tailwind-react-native-classnames";

const BAG_TYPES = [
  { name: "Carrefour" },
  { name: "Lulu" },
  { name: "Almaya" },
  { name: "Other" },
];
const BOTTLE_TYPES = [
  { name: "Al Ain" },
  { name: "Masafi" },
  { name: "Mai Dubai" },
  { name: "Other" },
];

export default function ItemDetails() {
  const params = useLocalSearchParams();
 

  function parseCounts(param: any) {
    if (typeof param === "string") {
      // Try to parse JSON string
      try {
        const arr = JSON.parse(param);
        if (Array.isArray(arr)) return arr.map(Number);
      } catch {
        // If not JSON, try comma-separated string
        if (param.includes(",")) {
          return param.split(",").map(Number);
        }
        // Single number string
        const num = Number(param);
        return isNaN(num) ? [] : [num];
      }
    } else if (Array.isArray(param)) {
      return param.map(Number);
    } else if (typeof param === "number") {
      return [param];
    }
    return [];
  }

  const bagCounts = parseCounts(params.bags);
  const bottleCounts = parseCounts(params.bottles);

  const bags = BAG_TYPES.map((type, idx) => ({
    name: type.name,
    quantity: bagCounts[idx] || 0,
  })).filter((item) => item.quantity > 0);
  const bottles = BOTTLE_TYPES.map((type, idx) => ({
    name: type.name,
    quantity: bottleCounts[idx] || 0,
  })).filter((item) => item.quantity > 0);

  const totalItems =
    bags.reduce((sum, b) => sum + b.quantity, 0) +
    bottles.reduce((sum, b) => sum + b.quantity, 0);

  return (
    <View style={tw`flex-1 bg-white pt-10 px-4`}>
      <View style={tw`flex-row items-center `}>
      <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
      <Text style={[tw`text-lg font-semibold text-center ml-20`,{color:Colors.light.titleText}]}>Item Details</Text>
      </View>
      <ScrollView>
        <Text style={[tw`text-base font-bold mt-10 mb-5`,{color:Colors.light.titleText}]}>Bags Details</Text>
        {bags.length === 0 && bottles.length === 0 ? (
          <Text style={tw`text-center text-gray-500 my-8`}>
            No items added yet.
          </Text>
        ) : (
          <>
            {bags.map((bag, idx) => (
              <View style={tw`flex-row items-center mb-2`} key={idx}>
                <MaterialIcons name="shopping-bag" size={22} style={{color:Colors.light.titleText}} />
                <Text style={[tw`flex-1 text-base ml-2`,{color:Colors.light.titleText}]}>{bag.name}</Text>
                <Text style={[tw`text-base `,{color:Colors.light.titleText}]}>{bag.quantity}</Text>
              </View>
            ))}
            <Text style={[tw`text-base font-bold mt-4 mb-4`,{color:Colors.light.titleText}]}>
              Bottles Details
            </Text>
            {bottles.map((bottle, idx) => (
              <View style={tw`flex-row items-center mb-2`} key={idx}>
                <FontAwesome6 name="bottle-droplet" size={22} style={{color:Colors.light.titleText}} />
                <Text style={[tw`flex-1 text-base ml-2`,,{color:Colors.light.titleText}]}>{bottle.name}</Text>
                <Text style={[tw`text-base `,{color:Colors.light.titleText}]}>{bottle.quantity}</Text>
              </View>
            ))}
            <View
              style={tw`flex-row justify-between border-t border-b border-gray-200 py-3 mt-4`}
            >
              <Text style={[tw`text-base font-bold`,{color:Colors.light.titleText}]}>Total Items</Text>
              <Text style={[tw`text-base font-bold`,{color:Colors.light.titleText}]}>{totalItems}</Text>
            </View>
          </>
        )}
        <TouchableOpacity
        onPress={() => router.push("/screen/home/RedeemQRCode/RedeemQRCode")}
          style={[tw` py-3 rounded-lg items-center mt-16 mb-8`,{backgroundColor:Colors.light.primaryGreen}]}
        >
          <Text style={[tw`text-white text-base font-bold`]}>Confirm Count</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
