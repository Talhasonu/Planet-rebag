import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import tw from "tailwind-react-native-classnames";
import BagsTab from "./BagsTab";
import BottlesTab from "./BottlesTab";
import ProfileImage from "./ProfileImage";
import ReturnedRecord from "./ReturnedRecord";
import Tabs from "./Tabs";
import TransactionHistory from "./TransactionHistory";

import { auth } from "@/utils/firebase";
import { router } from "expo-router";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { useEffect, useState } from "react";

const HomeScreen = () => {
  const [userName, setUserName] = useState<string>("User");
  const [loading, setLoading] = useState(true);
  const db = getFirestore();

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          let displayName = "User";

          // First try to get name from Firebase Auth
          if (currentUser.displayName) {
            displayName = currentUser.displayName.split(" ")[0]; // Get first name only
          } else if (currentUser.email) {
            // Fallback to email username
            displayName = currentUser.email.split("@")[0];
          }

          // Try to get additional data from Firestore
          try {
            const userDocRef = doc(db, "users", currentUser.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
              const userData = userDoc.data();

              // Use Firestore name if available
              const fullName = userData.fullName || userData.name;
              if (fullName) {
                displayName = fullName.split(" ")[0]; // Get first name only
              }
            }
          } catch (firestoreError) {
            console.log(
              "Could not fetch user data from Firestore:",
              firestoreError
            );
            // Continue with Firebase Auth data
          }

          setUserName(displayName);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserName("User");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [db]);

  // Bag data
  const returnedBags = 20;
  const pendingBags = 8;
  const bagTransactions = [
    {
      merchant: "Carrefour",
      amount: "AED 10.00",
      returnedBags: 10,
      totalBags: "10/10",
      time: "10:19 AM",
      date: "23/07/2023",
      location: "Al Ain, Abu Dhabi",
    },
    // Add more bag transactions as needed
  ];

  // Bottle data
  const returnedBottles = 12;
  const pendingBottles = 3;
  const bottleTransactions = [
    {
      merchant: "Lulu",
      amount: "AED 5.00",
      returnedBags: 6,
      totalBags: "8/8",
      time: "11:00 AM",
      date: "24/07/2023",
      location: "Dubai Mall",
    },
    // Add more bottle transactions as needed
  ];

  const [activeTab, setActiveTab] = useState(0);

  return (
    <ScrollView style={tw`flex-1 bg-white mt-1 p-4`}>
      {/* Top Header */}
      <View style={tw`flex-row items-center  justify-between mt-2 mb-4`}>
        {/* Menu icon */}
        <View style={tw`flex-row items-center`}>
          <TouchableOpacity
            onPress={() => router.push("/screen/home/Profile/Profile")}
            style={tw`w-8 h-8 rounded-full bg-gray-200 items-center justify-center mr-2`}
          >
            <Text style={tw`text-xl`}>≡</Text>
          </TouchableOpacity>
        </View>
        <View>
          <Text
            style={[
              tw`text-lg font-semibold   text-center`,
              { color: Colors.light.titleText },
            ]}
          >
            Home
          </Text>
        </View>
        {/* Profile image */}
        <ProfileImage initials="A" size={40} />
      </View>
      {/* Welcome */}
      <Text
        style={[
          tw`text-2xl font-bold  my-4`,
          { color: Colors.light.titleText },
        ]}
      >
        {loading ? "Welcome!" : `Welcome, ${userName}!`}
      </Text>
      <Tabs
        tabs={["Bags", "Bottles"]}
        children={[
          <BagsTab
            key="bags"
            returnedBags={returnedBags}
            pendingBags={pendingBags}
            bagTransactions={bagTransactions}
          />,
          <BottlesTab
            key="bottles"
            returnedBottles={returnedBottles}
            pendingBottles={pendingBottles}
            bottleTransactions={bottleTransactions}
          />,
        ]}
        active={activeTab}
        setActive={setActiveTab}
      />
      {/* Returned Record */}
      <ReturnedRecord
        bagsReturned={activeTab === 0 ? returnedBags : returnedBottles}
        pendingReturns={activeTab === 0 ? pendingBags : pendingBottles}
        backgroundColor={"rgba(227, 136, 0, 0.1)"}
        type={activeTab === 0 ? "Bag" : "Bottle"}
      />
      <TransactionHistory
        transactions={
          activeTab === 0
            ? bagTransactions.map((tx) => ({ ...tx, type: "Bag" }))
            : bottleTransactions.map((tx) => ({ ...tx, type: "Bottle" }))
        }
      />
    </ScrollView>
  );
};

export default HomeScreen;
