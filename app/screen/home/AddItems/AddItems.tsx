import almaya from "@/assets/images/almaya.svg";
import kite from "@/assets/images/kite.svg";
import lulu from "@/assets/images/lulu.svg";
import Tabs from "@/components/HomeScreen/Tabs";
import { Colors } from "@/constants/Colors";
import { showToast } from "@/utils/toast";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import tw from "tailwind-react-native-classnames";
import BottleLogo from "../../../../assets/images/bottle.svg"; 
const BAG_TYPES = [
  {
    name: "Carrefour",
    price: 0.75,
    color: "rgba(0, 78, 159, 0.1)",
    logo: kite,
  },
  {
    name: "Lulu",
    price: 1.0,
    color: "rgba(0, 169, 80, 0.1)",
    logo: lulu,
  },
  {
    name: "Almaya",
    price: 0.5,
    color: "rgba(191, 28, 34, 0.1)",
    logo: almaya,
  },
  { name: "Other", price: 0, color: "#fff", logo: null },
];

const BOTTLE_TYPES = [
  {
    name: "Al Ain",
    price: 0.12,
    color: "rgba(0, 78, 159, 0.1)",
    logo: kite,
  },
  {
    name: "Masafi",
    price: 0.24,
    color: "rgba(0, 169, 80, 0.1)",
    logo: lulu,
  },
  {
    name: "Mai Dubai",
    price: 0.76,
    color: "rgba(191, 28, 34, 0.1)",
    logo: almaya,
  },
  { name: "Other", price: 0, color: "#fff", logo: null },
];

export default function AddItems() {
  const router = useRouter();
  const [counts, setCounts] = useState([0, 0, 0, 0]);
  const [bottleCounts, setBottleCounts] = useState([0, 0, 0, 0]);

  const totalBags = counts.reduce((sum, val) => sum + val, 0);
  const totalBottles = bottleCounts.reduce((sum, val) => sum + val, 0);

  const handleInc = (idx: number) => {
    setCounts((prev) =>
      prev.map((count, i) => (i === idx ? count + 1 : count))
    );
  };
  const handleDec = (idx: number) => {
    setCounts((prev) =>
      prev.map((count, i) => (i === idx ? Math.max(0, count - 1) : count))
    );
  };

  const handleBottleInc = (idx: number) => {
    setBottleCounts((prev) =>
      prev.map((count, i) => (i === idx ? count + 1 : count))
    );
  };
  const handleBottleDec = (idx: number) => {
    setBottleCounts((prev) =>
      prev.map((count, i) => (i === idx ? Math.max(0, count - 1) : count))
    );
  };

  const [activeTab, setActiveTab] = useState(0);
  return (
    <SafeAreaView style={tw`flex-1 bg-white p-4`}>
      <View style={tw`flex-row items-center  mt-8   `}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={tw`text-lg font-semibold ml-20 `}>Add Items</Text>
      </View>
      <Tabs
        tabs={["Bags", "Bottles"]}
        active={activeTab}
        setActive={setActiveTab}
      >
        <View>
          <View style={tw`flex-row justify-between my-3`}>
            {BAG_TYPES.slice(0, 3).map((bag) => (
              <View
                key={bag.name}
                style={[
                  tw` rounded-lg flex-col justify-center items-center  w-24 h-20`,
                  { backgroundColor: bag.color },
                ]}
              >
                {bag.logo && React.createElement(bag.logo)}

                <Text
                  style={[
                    tw`text-sm font-bold mt-1`,
                    { color: Colors.light.titleText },
                  ]}
                >
                  AED {bag.price.toFixed(2)}
                </Text>
              </View>
            ))}
          </View>
          <View
            style={[
              tw`flex-row items-center rounded-lg p-3 mb-7`,
              { backgroundColor: Colors.light.borderColor },
            ]}
          >
            <MaterialIcons
              name="shopping-bag"
              size={24}
              style={{ color: Colors.light.primaryGreen }}
            />
            <Text
              style={[tw`ml-2 text-base`, { color: Colors.light.titleText }]}
            >
              Total Bags
            </Text>
            <Text
              style={[
                tw`ml-auto font-bold text-lg`,
                { color: Colors.light.titleText },
              ]}
            >
              {totalBags}
            </Text>
          </View>
          {BAG_TYPES.map((bag, idx) => (
            <View key={bag.name} style={tw`mb-4`}>
              <Text
                style={[
                  tw`text-base mb-2  font-bold`,
                  { color: Colors.light.titleText },
                ]}
              >
                {bag.name} 
              </Text>
              <View
                style={[
                  tw`flex-row justify-between items-center rounded-xl p-2`,
                  { backgroundColor: Colors.light.borderColor },
                ]}
              >
                <TouchableOpacity
                  style={[
                    tw` rounded-md p-2 mx-1`,
                    { backgroundColor: Colors.light.green40 },
                  ]}
                  onPress={() => handleDec(idx)}
                  accessibilityLabel={`Decrease ${bag.name} Bags`}
                >
                  <Ionicons
                    name="remove"
                    size={20}
                    style={{ color: Colors.light.primaryGreen }}
                  />
                </TouchableOpacity>
                <Text
                  style={[
                    tw` text-xl text-center font-semibold `,
                    { color: Colors.light.titleText },
                  ]}
                >
                 
                  {counts[idx]}
                </Text>
                <TouchableOpacity
                  style={[
                    tw` rounded-md p-2 mx-1`,
                    { backgroundColor: Colors.light.green40 },
                  ]}
                  onPress={() => handleInc(idx)}
                  accessibilityLabel={`Increase ${bag.name} Bags`}
                >
                  <Ionicons
                    name="add"
                    size={20}
                    style={{ color: Colors.light.primaryGreen }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <View>
          <View style={tw`flex-row justify-between my-3`}>
            {BOTTLE_TYPES.slice(0, 3).map((bottle, idx) => (
              <View
                key={bottle.name}
                style={[
                  tw` rounded-lg flex-col justify-center items-center  w-24 h-20`,
                  { backgroundColor: bottle.color },
                ]}
              >
                {bottle.logo && React.createElement(bottle.logo)}
                <Text
                  style={[
                    tw`text-sm font-bold mt-1`,
                    { color: Colors.light.titleText },
                  ]}
                >
                  
                  AED {bottle.price.toFixed(2)}
                </Text>
              </View>
            ))}
          </View>
          <View
            style={[
              tw`flex-row items-center rounded-lg p-3 mb-7`,
              { backgroundColor: Colors.light.borderColor },
            ]}
          >
            <BottleLogo />

            <Text
              style={[tw`ml-2 text-base`, { color: Colors.light.titleText }]}
            >
              
              Total Bottles
            </Text>
            <Text
              style={[
                tw`ml-auto font-bold text-lg`,
                { color: Colors.light.titleText },
              ]}
            >
            
              {totalBottles}
            </Text>
          </View>
          {BOTTLE_TYPES.map((bottle, idx) => (
            <View key={bottle.name} style={tw`mb-4`}>
              <Text
                style={[
                  tw`text-base mb-2  font-bold`,
                  { color: Colors.light.titleText },
                ]}
              >
                {bottle.name} Bottles
              </Text>
              <View
                style={[
                  tw`flex-row justify-between items-center rounded-xl p-2`,
                  { backgroundColor: Colors.light.borderColor },
                ]}
              >
                <TouchableOpacity
                  style={[
                    tw` rounded-md p-2 mx-1`,
                    { backgroundColor: Colors.light.green40 },
                  ]}
                  onPress={() => handleBottleDec(idx)}
                  accessibilityLabel={`Decrease ${bottle.name} Bottles`}
                >
                  <Ionicons
                    name="remove"
                    size={20}
                    style={{ color: Colors.light.primaryGreen }}
                  />
                </TouchableOpacity>
                <Text
                  style={[
                    tw` text-xl text-center font-semi-bold `,
                    { color: Colors.light.titleText },
                  ]}
                >
                  
                  {bottleCounts[idx]}
                </Text>
                <TouchableOpacity
                  style={[
                    tw` rounded-md p-2 mx-1`,
                    { backgroundColor: Colors.light.green40 },
                  ]}
                  onPress={() => handleBottleInc(idx)}
                  accessibilityLabel={`Increase ${bottle.name} Bottles`}
                >
                  <Ionicons
                    name="add"
                    size={20}
                    style={{ color: Colors.light.primaryGreen }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </Tabs>

      <TouchableOpacity
        style={[
          tw` rounded-md py-3 items-center mt-3`,
          { backgroundColor: Colors.light.primaryGreen },
        ]}
        onPress={() => {
          if (totalBags > 0 || totalBottles > 0) {
            router.push({
              pathname: "/screen/home/ItemDetails/ItemDetails",
              params: {
                bags: counts,
                bottles: bottleCounts,
              },
            });
          } else {
            showToast.error("Please add an item first");
          }
        }}
      >
        <Text style={tw`text-white font-bold text-base`}>Add</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
