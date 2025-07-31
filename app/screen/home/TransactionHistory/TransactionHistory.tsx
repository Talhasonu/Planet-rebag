import { Colors } from "@/constants/Colors";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import React, { useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import tw from "tailwind-react-native-classnames";

const stores = [
  "All",
  "Carrefour",
  "Lulu",
  "Almaya",
  "Al Ain",
  "MAsafi",
  "Mai Dubai",
];
const tabs = ["All", "Bag", "Bottle"];

const transactions = [
  {
    merchant: "Carrefour",
    amount: "AED 10.00",
    returnedBags: 7,
    totalBags: "7/10",
    time: "10:19 AM",
    date: "23/07/2023",
    location: "Al Ain, Abu Dhabi",
    type: "Bag",
    status: "Redeemed",
  },
  {
    merchant: "Carrefour",
    amount: "AED 10.00",
    returnedBags: 7,
    totalBags: "7/10",
    time: "10:19 AM",
    date: "23/07/2023",
    location: "Al Ain, Abu Dhabi",
    type: "Bag",
    status: "Redeemed",
  },
  {
    merchant: "Lulu",
    amount: "AED 5.00",
    returnedBags: 3,
    totalBags: "3/5",
    time: "11:30 AM",
    date: "24/07/2023",
    location: "Dubai Mall, Dubai",
    type: "Bottle",
    status: "Pending",
  },
  {
    merchant: "Almaya",
    amount: "AED 8.00",
    returnedBags: 5,
    totalBags: "5/8",
    time: "09:45 AM",
    date: "25/07/2023",
    location: "Almaya Center, Sharjah",
    type: "Bag",
    status: "Redeemed",
  },
  {
    merchant: "Mai Dubai",
    amount: "AED 12.00",
    returnedBags: 10,
    totalBags: "10/12",
    time: "02:15 PM",
    date: "26/07/2023",
    location: "Downtown, Dubai",
    type: "Bottle",
    status: "Redeemed",
  },
  {
    merchant: "Al Ain",
    amount: "AED 6.00",
    returnedBags: 4,
    totalBags: "4/6",
    time: "03:10 PM",
    date: "27/07/2023",
    location: "Al Ain, Abu Dhabi",
    type: "Bottle",
    status: "Pending",
  },
  {
    merchant: "MAsafi",
    amount: "AED 7.50",
    returnedBags: 5,
    totalBags: "5/7",
    time: "04:20 PM",
    date: "28/07/2023",
    location: "MAsafi, Fujairah",
    type: "Bottle",
    status: "Redeemed",
  },
  {
    merchant: "Mai Dubai",
    amount: "AED 9.00",
    returnedBags: 6,
    totalBags: "6/9",
    time: "05:30 PM",
    date: "29/07/2023",
    location: "Downtown, Dubai",
    type: "Bottle",
    status: "Pending",
  },
  // Add more transactions as needed
];

export default function TransactionHistoryScreen() {
  const [selectedStore, setSelectedStore] = useState("All");
  const [activeTab, setActiveTab] = useState(0);

  // Filter transactions by store and tab
  const filteredTransactions = transactions.filter((tx) => {
    const storeMatch = selectedStore === "All" || tx.merchant === selectedStore;
    const tabType = tabs[activeTab];
    const typeMatch = tabType === "All" || tx.type === tabType;
    return storeMatch && typeMatch;
  });

  return (
    <View style={tw`flex-1 bg-white px-4 pt-8`}>
      <View style={tw`flex-row items-center my-5 `}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text
          style={[
            tw`text-lg font-semibold text-center ml-20`,
            { color: Colors.light.titleText },
          ]}
        >
          Transaction History
        </Text>
      </View>
      {/* Store Picker */}
      <View style={tw`mb-4`}>
        <Text style={tw`mb-2 text-base font-bold`}>Select Store</Text>
        <View style={[tw` rounded-lg  bg-gray-100 `]}>
          <Picker
            selectedValue={selectedStore}
            onValueChange={setSelectedStore}
            style={{ height: 53 }}
          >
            {stores.map((store) => (
              <Picker.Item label={store} value={store} key={store} />
            ))}
          </Picker>
        </View>
      </View>
      {/* Tabs */}
      <View style={tw`flex-row mb-4`}>
        {tabs.map((tab, idx) => (
          <TouchableOpacity
            key={tab}
            style={[
              tw`flex flex-row items-center py-1.5 px-5 mx-1 rounded-lg`,
              {
                backgroundColor:
                  activeTab === idx
                    ? Colors.light.primaryGreen
                    : Colors.light.borderColor,
              },
            ]}
            onPress={() => setActiveTab(idx)}
          >
            {/* Add icon for Bag and Bottle tabs */}
            {tab === "Bag" && (
              <FontAwesome6
                name="bag-shopping"
                size={18}
                color={
                  activeTab === idx
                    ? Colors.light.white
                    : Colors.light.lightgrayText
                }
                style={{ marginRight: 6 }}
              />
            )}
            {tab === "Bottle" && (
              <FontAwesome6
                name="bottle-droplet"
                size={18}
                color={
                  activeTab === idx
                    ? Colors.light.white
                    : Colors.light.lightgrayText
                }
                style={{ marginRight: 6 }}
              />
            )}
            <Text
              style={[
                tw`${
                  activeTab === idx ? "text-white font-bold" : "text-gray-700"
                } text-center`,
                {
                  color:
                    activeTab === idx
                      ? Colors.light.white
                      : Colors.light.lightgrayText,
                },
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* Transaction Cards */}
      {filteredTransactions.length === 0 ? (
        <Text style={tw`text-center text-gray-500 mt-8`}>
          No transactions found.
        </Text>
      ) : (
        <FlatList
          data={filteredTransactions}
          keyExtractor={(_, idx) => idx.toString()}
          renderItem={({ item }) => (
            <View
              style={tw`mb-4 rounded-xl border border-gray-200 bg-white shadow-sm`}
            >
              <View
                style={[
                  tw`flex-row justify-between items-center bg-gray-100 rounded-t-xl p-3`,
                  { color: Colors.light.titleText },
                ]}
              >
                <Text
                  style={[
                    tw`font-bold text-base`,
                    { color: Colors.light.titleText },
                  ]}
                >
                  {item.merchant}
                </Text>
                <Text style={tw`font-bold text-base`}>{item.amount}</Text>
              </View>
              <View style={tw`flex-row flex-wrap px-3 py-2`}>
                <View
                  style={[tw`w-1/2 mb-2`, { color: Colors.light.titleText }]}
                >
                  <Text
                    style={[
                      tw`font-semibold text-sm `,
                      { color: Colors.light.titleText },
                    ]}
                  >
                    Item Type
                  </Text>
                  <Text
                    style={[tw`text-sm`, { color: Colors.light.titleText }]}
                  >
                    {item.type}
                  </Text>
                </View>
                <View style={tw`w-1/2 mb-2 pl-5`}>
                  <Text
                    style={[
                      tw`font-semibold text-sm `,
                      { color: Colors.light.titleText },
                    ]}
                  >
                    Returned Qty
                  </Text>
                  <Text
                    style={[tw`text-sm `, { color: Colors.light.titleText }]}
                  >
                    {item.returnedBags}
                  </Text>
                </View>
                <View style={tw`w-1/2 mb-2`}>
                  <Text
                    style={[
                      tw`font-semibold text-sm `,
                      { color: Colors.light.titleText },
                    ]}
                  >
                    Total Qty
                  </Text>
                  <Text
                    style={[tw`text-sm `, { color: Colors.light.titleText }]}
                  >
                    {item.totalBags}
                  </Text>
                </View>
                <View style={tw`w-1/2 mb-2 pl-5`}>
                  <Text
                    style={[
                      tw`font-semibold text-sm `,
                      { color: Colors.light.titleText },
                    ]}
                  >
                    Location
                  </Text>
                  <Text
                    style={[tw`text-sm `, { color: Colors.light.titleText }]}
                  >
                    {item.location}
                  </Text>
                </View>
                <View style={tw`w-1/2 mb-2`}>
                  <Text
                    style={[
                      tw`font-semibold text-sm `,
                      { color: Colors.light.titleText },
                    ]}
                  >
                    Time & Date
                  </Text>
                  <Text
                    style={[tw`text-sm `, { color: Colors.light.titleText }]}
                  >
                    {item.time} | {item.date}
                  </Text>
                </View>
                <View style={tw`w-1/2 mb-2  pl-5`}>
                  <Text
                    style={[
                      tw`font-semibold text-sm `,
                      { color: Colors.light.titleText },
                    ]}
                  >
                    Status
                  </Text>
                  <Text
                    style={[tw`text-sm `, { color: Colors.light.titleText }]}
                  >
                    {item.status}
                  </Text>
                </View>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}
