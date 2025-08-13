import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import tw from "tailwind-react-native-classnames";
import Toast from "react-native-toast-message";
const orders = [
  {
    id: 1,
    pendingBags: 6,
    pendingBottles: 7,
    totalQty: 13,
    dateAdded: "10:19 AM | 23/07/2023",
  },
  {
    id: 2,
    pendingBags: 6,
    pendingBottles: 7,
    totalQty: 13,
    dateAdded: "10:19 AM | 23/07/2023",
  },
  {
    id: 3,
    pendingBags: 6,
    pendingBottles: 7,
    totalQty: 13,
    dateAdded: "10:19 AM | 23/07/2023",
  },
];

export default function PendingRedeem() {
  const [selected, setSelected] = useState<number[]>([]);

  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <View style={[tw`flex-1 bg-white`, { paddingTop: 40 }]}>
      {/* Top padding for status bar */}
      <View style={tw`flex-row items-center  mb-7 `}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text
          style={[
            tw`text-lg font-semibold text-center ml-20`,
            { color: Colors.light.titleText },
          ]}
        >
          Pending Redeem
        </Text>
      </View>
      <ScrollView style={tw`px-6`} contentContainerStyle={tw`pb-6`}>
        <Text
          style={[
            tw`text-base font-bold mb-5 `,
            { color: Colors.light.titleText },
          ]}
        >
          Select Order to Generate QR Code
        </Text>
        {orders.map((order) => (
          <View key={order.id} style={tw`flex-row items-center mb-4`}>
            <TouchableOpacity
              style={tw`mr-3`}
              activeOpacity={0.9}
              onPress={() => toggleSelect(order.id)}
            >
              <View
                style={[
                  tw`w-6 h-6 rounded-md border-2 items-center justify-center`,
                  {
                    borderColor: Colors.light.primaryGreen,
                  },
                ]}
              >
                {selected.includes(order.id) && (
                  <View
                    style={[
                      tw`w-5 h-5  items-center justify-center`,
                      { backgroundColor: Colors.light.primaryGreen },
                    ]}
                  >
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color={Colors.light.white}
                    />
                  </View>
                )}
              </View>
            </TouchableOpacity>
            {/* Card */}
            <TouchableOpacity
              style={[
                tw`rounded-xl p-4 flex-1`,
                {
                  backgroundColor: Colors.light.borderColor,
                  shadowColor: Colors.light.grayText,
                  shadowOpacity: 0.08,
                  shadowRadius: 8,
                  elevation: 2,
                },
              ]}
              activeOpacity={0.9}
              onPress={() => toggleSelect(order.id)}
            >
              <View style={tw`flex-1`}>
                <View style={tw`flex-row justify-between mb-1`}>
                  <Text
                    style={[
                      tw`font-semibold`,
                      { color: Colors.light.titleText },
                    ]}
                  >
                    Pending Bags
                  </Text>
                  <Text
                    style={[
                      tw`font-semibold`,
                      { color: Colors.light.titleText },
                    ]}
                  >
                    Pending Bottles
                  </Text>
                </View>
                <View style={tw`flex-row justify-between mb-1`}>
                  <Text
                    style={[tw`text-base`, { color: Colors.light.titleText }]}
                  >
                    {order.pendingBags}
                  </Text>
                  <Text
                    style={[tw`text-base`, { color: Colors.light.titleText }]}
                  >
                    {order.pendingBottles}
                  </Text>
                </View>
                <View style={tw`flex-row justify-between mb-1`}>
                  <Text
                    style={[
                      tw`font-semibold`,
                      { color: Colors.light.titleText },
                    ]}
                  >
                    Total Qty
                  </Text>
                  <Text
                    style={[
                      tw`font-semibold`,
                      { color: Colors.light.titleText },
                    ]}
                  >
                    Date Added
                  </Text>
                </View>
                <View style={tw`flex-row justify-between`}>
                  <Text
                    style={[tw`text-base`, { color: Colors.light.titleText }]}
                  >
                    {order.totalQty}
                  </Text>
                  <Text style={[tw`text-xs`, { color: Colors.light.grayText }]}>
                    {order.dateAdded}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <View style={tw`px-6 mb-8`}>
        <TouchableOpacity
          style={[
            tw`rounded-lg py-4 items-center`,
            { backgroundColor: Colors.light.primaryGreen },
          ]}
          activeOpacity={0.8}
          onPress={() => {
            if (selected.length > 0) {
              router.push("/screen/home/RedeemQRCode/RedeemQRCode");
            } else {
              // @ts-ignore
              Toast.show({
                type: "error",
                text1: "Please select item",
              });
            }
          }}
        >
          <Text
            style={[tw`font-bold text-base`, { color: Colors.light.white }]}
          >
            Generate QR Code
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
