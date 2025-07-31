import Airways from "@/assets/images/airways.svg";
import Etisalad from "@/assets/images/etisalad.svg";
import KFC from "@/assets/images/kfc.svg";
import Noon from "@/assets/images/noon.svg";
import { Colors } from "@/constants/Colors";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import tw from "tailwind-react-native-classnames";
const deals = [
  {
    id: 1,
    title: "KFC - Super Mega Deal",
    description: "12 Pcs COB + Family Fries + Large Coleslaw",
    points: "30/50 Credit Points",
    redeemed: false,
    logo: KFC,
  },
  {
    id: 2,
    title: "Noon - Promo Code",
    description:
      "10% Cashback for new customer\n5% Cashback for existing customer",
    points: "30/30 Credit Points",
    redeemed: true,
    logo: Noon, 
  },
  {
    id: 3,
    title: "Etihad Airways - Discount Deal",
    description: "get 20% discount in your next flight to London",
    points: "30/150 Credit Points",
    redeemed: false,
    logo: Airways,
  },
  {
    id: 4,
    title: "Etisalat - Discount Offer",
    description: "get 20% discount in every data package",
    points: "30/150 Credit Points",
    redeemed: false,
    logo: Etisalad,
  },
];

export default function DealScreen() {
  return (
    <ScrollView style={tw`flex-1 bg-white`} contentContainerStyle={tw`pb-8`}>
      <View style={tw`mt-8 mb-4 items-center`}>
        <Text
          style={[
            tw`text-xl font-bold mb-2 mt-5 `,
            { color: Colors.light.titleText },
          ]}
        >
          Hot Deals
        </Text>
      </View>
      <View style={tw`px-4`}>
        {deals.map((deal, idx) => (
          <View
            key={deal.id}
            style={[
              tw`rounded-2xl mb-4 bg-white`,
              {
                backgroundColor: Colors.light.borderColor,
                shadowColor: "#000",
                shadowOpacity: 0.05,
                shadowRadius: 8,
                elevation: 2,
              },
            ]}
          >
            <View style={tw`flex-row items-center p-4 pb-2`}>
              {/* Logo/Icon */}
              <View style={tw`mr-4`}>
                <View
                  style={tw`w-12 h-12 rounded-xl items-center justify-center `}
                >
                  <deal.logo width={64} height={64} />
                </View>
              </View>
              {/* Deal Info */}
              <View style={tw`flex-1 ml-2`}>
                <Text
                  style={[
                    tw`font-bold text-base mb-1`,
                    {
                      color:
                        idx === 1 
                          ? Colors.light.titleText
                          : Colors.light.lightgrayText,
                    },
                  ]}
                >
                  {deal.title}
                </Text>
                <Text
                  style={[tw`text-xs mb-2`, { color: Colors.light.grayText }]}
                >
                  {deal.description}
                </Text>
              </View>
            </View>
            {/* Border top and actions */}
            <View
              style={tw`border-t border-gray-200 flex-row items-center justify-between px-4 py-2 bg-transparent`}
            >
              <Text style={[tw`text-xs`, { color: Colors.light.titleText }]}>
                {deal.points}
              </Text>
              <TouchableOpacity
                style={[
                  tw`rounded-lg px-6 py-2`,
                  deal.redeemed
                    ? { backgroundColor: Colors.light.primaryGreen }
                    : { backgroundColor: Colors.light.lightgrayText },
                  { minWidth: 90, alignItems: "center" },
                ]}
                disabled={!deal.redeemed}
              >
                <Text
                  style={[tw`font-bold text-xs`, { color: Colors.light.white }]}
                >
                  Redeem
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
