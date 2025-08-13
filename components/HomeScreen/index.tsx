import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import tw from "tailwind-react-native-classnames";
import AdminCard from "./AdminCard";
import BagsTab from "./BagsTab";
import BottlesTab from "./BottlesTab";
import ProfileImage from "./ProfileImage";
import ReturnedRecord from "./ReturnedRecord";
import Tabs from "./Tabs";
import TransactionHistory from "./TransactionHistory";

import { useAuth } from "@/contexts/AuthContext";
import { router } from "expo-router";
import { useEffect, useState } from "react";

const HomeScreen = () => {
  const { userInfo, loading: authLoading } = useAuth();
  const [userName, setUserName] = useState<string>("User");

  useEffect(() => {
    if (userInfo) {
      // Get first name from user info
      const displayName = userInfo.displayName || userInfo.fullName || "User";
      const firstName = displayName.split(" ")[0];
      setUserName(firstName);
    }
  }, [userInfo]);

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

  const [adminData, setAdminData] = useState({
    totalUsers: 0,
    totalBags: 1200,
    totalBottles: 890,
    todayLogins: 0,
    monthLogins: 0,
  });

  // Fetch today's login count and month's login count for admin
  useEffect(() => {
    const fetchAdminData = async () => {
      if (userInfo?.role === "admin") {
        try {
          const { db } = await import("@/utils/firebase");
          const { collection, getDocs } = await import("firebase/firestore");

          const now = new Date();

          // Today's date range
          const startOfDay = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
          );
          const endOfDay = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() + 1
          );

          // This month's date range
          const startOfMonth = new Date(
            now.getFullYear(),
            now.getMonth(),
            1,
            0,
            0,
            0,
            0
          );
          const endOfMonth = new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            0,
            23,
            59,
            59,
            999
          );

          const usersRef = collection(db, "users");
          const snapshot = await getDocs(usersRef);

          let todayCount = 0;
          let monthCount = 0;
          let totalUsers = 0;

          snapshot.forEach((doc) => {
            const userData = doc.data();
            totalUsers++;

            if (userData.lastLoginAt) {
              let loginDate: Date;

              try {
                if (
                  typeof userData.lastLoginAt === "object" &&
                  userData.lastLoginAt.toDate
                ) {
                  loginDate = userData.lastLoginAt.toDate();
                } else if (
                  typeof userData.lastLoginAt === "object" &&
                  userData.lastLoginAt.seconds
                ) {
                  loginDate = new Date(userData.lastLoginAt.seconds * 1000);
                } else if (typeof userData.lastLoginAt === "string") {
                  loginDate = new Date(userData.lastLoginAt);
                } else {
                  loginDate = new Date(userData.lastLoginAt);
                }

                // Check if login is today
                if (loginDate >= startOfDay && loginDate < endOfDay) {
                  todayCount++;
                }

                // Check if login is this month
                if (loginDate >= startOfMonth && loginDate <= endOfMonth) {
                  monthCount++;
                }
              } catch (error) {
                console.error("Error processing login date:", error);
              }
            }
          });

          setAdminData((prev) => ({
            ...prev,
            totalUsers,
            todayLogins: todayCount,
            monthLogins: monthCount,
          }));
        } catch (error) {
          console.error("Error fetching admin data:", error);
        }
      }
    };

    fetchAdminData();
  }, [userInfo]);

  const isAdmin = userInfo?.role === "admin";

  return (
    <ScrollView
      style={tw`flex-1 bg-white`}
      contentContainerStyle={tw`p-4 pb-8`}
      showsVerticalScrollIndicator={false}
    >
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
        <ProfileImage size={40} debug={true} />
      </View>
      {/* Welcome */}
      <Text
        style={[
          tw`text-2xl font-bold  my-4`,
          { color: Colors.light.titleText },
        ]}
      >
        {authLoading ? "Welcome!" : `Welcome, ${userName}!`}
      </Text>

      {/* Admin Cards - Only show for admin users */}
      {isAdmin && (
        <View style={tw`mb-4`}>
          <Text
            style={[
              tw`text-lg font-semibold mb-3`,
              { color: Colors.light.titleText },
            ]}
          >
            Admin Overview
          </Text>
          <View style={tw`flex-row justify-between`}>
            <AdminCard
              iconName="people"
              iconColor="#3B82F6"
              iconLibrary="Ionicons"
              title="Total Users"
              count={adminData.totalUsers}
              backgroundColor="rgba(59, 130, 246, 0.1)"
              onPress={() => router.push("/screen/admin/TotalUsers")}
            />
            <AdminCard
              iconName="clock"
              iconColor="#22C55E"
              iconLibrary="Feather"
              title="Today's Login"
              count={adminData.todayLogins || 0}
              backgroundColor="rgba(34, 197, 94, 0.1)"
              onPress={() => router.push("/screen/admin/TodayLogin")}
            />
            <AdminCard
              iconName="calendar"
              iconColor="#A855F7"
              iconLibrary="AntDesign"
              title="1 Month Login"
              count={adminData.monthLogins}
              backgroundColor="rgba(168, 85, 247, 0.1)"
              onPress={() => router.push("/screen/admin/OneMonthLogin")}
            />
          </View>
        </View>
      )}

      {/* Main Content - Show for all users (both admin and regular) */}
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
