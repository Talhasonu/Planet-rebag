import { Colors } from "@/constants/Colors";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/utils/firebase";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Path,
  Stop,
  Text as SvgText,
} from "react-native-svg";
import tw from "tailwind-react-native-classnames";

interface User {
  uid: string;
  email: string;
  displayName: string;
  fullName?: string;
  lastLoginAt?: string;
  createdAt?: string;
  profileImageUrl?: string;
  type?: "login" | "signup";
}

interface DailyData {
  day: string;
  loginCount: number;
  signupCount: number;
}

const screenWidth = Dimensions.get("window").width;

const OneMonthLoginScreen: React.FC = () => {
  const { userInfo } = useAuth();
  const [monthLogins, setMonthLogins] = useState<User[]>([]);
  const [monthSignups, setMonthSignups] = useState<User[]>([]);
  const [dailyData, setDailyData] = useState<DailyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [totalMonthLogins, setTotalMonthLogins] = useState(0);
  const [totalMonthSignups, setTotalMonthSignups] = useState(0);
  const [showMoreLogins, setShowMoreLogins] = useState(false);
  const [showMoreSignups, setShowMoreSignups] = useState(false);

  const fetchMonthLogins = async () => {
    try {
      setLoading(true);

      const now = new Date();
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


      const monthLoginUsers: User[] = [];
      const monthSignupUsers: User[] = [];
      const dailyLoginMap = new Map<string, number>();
      const dailySignupMap = new Map<string, number>();

      // Initialize daily maps for the month
      const daysInMonth = endOfMonth.getDate();
      for (let i = 1; i <= daysInMonth; i++) {
        const dateKey = `${now.getFullYear()}-${(now.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${i.toString().padStart(2, "0")}`;
        dailyLoginMap.set(dateKey, 0);
        dailySignupMap.set(dateKey, 0);
      }

      let processedUsers = 0;
      let usersWithLogin = 0;
      let usersWithSignup = 0;

      snapshot.forEach((doc) => {
        const userData = doc.data();
        const lastLoginAt = userData.lastLoginAt;
        const createdAt = userData.createdAt;
        processedUsers++;

        if (lastLoginAt) {
          usersWithLogin++;
          let loginDate: Date;

          try {
            if (typeof lastLoginAt === "object" && lastLoginAt.toDate) {
              loginDate = lastLoginAt.toDate();
            } else if (typeof lastLoginAt === "object" && lastLoginAt.seconds) {
              loginDate = new Date(lastLoginAt.seconds * 1000);
            } else if (typeof lastLoginAt === "string") {
              loginDate = new Date(lastLoginAt);
            } else {
              loginDate = new Date(lastLoginAt);
            }


            if (loginDate >= startOfMonth && loginDate <= endOfMonth) {
              const user: User = {
                uid: doc.id,
                email: userData.email || "",
                displayName: userData.displayName || "",
                fullName: userData.fullName || "",
                profileImageUrl: userData.profileImageUrl || "",
                lastLoginAt: loginDate.toISOString(),
                createdAt: userData.createdAt
                  ? userData.createdAt.toDate
                    ? userData.createdAt.toDate().toISOString()
                    : userData.createdAt.toString()
                  : "",
                type: "login",
              };
              monthLoginUsers.push(user);
             
              const dateKey = `${loginDate.getFullYear()}-${(
                loginDate.getMonth() + 1
              )
                .toString()
                .padStart(2, "0")}-${loginDate
                .getDate()
                .toString()
                .padStart(2, "0")}`;
              dailyLoginMap.set(dateKey, (dailyLoginMap.get(dateKey) || 0) + 1);
            }
          } catch (error) {
            console.error(
              `Error processing login date for user ${userData.email}:`,
              error
            );
          }
        }

        if (createdAt) {
          usersWithSignup++;
          let signupDate: Date;

          try {
            if (typeof createdAt === "object" && createdAt.toDate) {
              signupDate = createdAt.toDate();
            } else if (typeof createdAt === "object" && createdAt.seconds) {
              signupDate = new Date(createdAt.seconds * 1000);
            } else if (typeof createdAt === "string") {
              signupDate = new Date(createdAt);
            } else {
              signupDate = new Date(createdAt);
            }

           

            if (signupDate >= startOfMonth && signupDate <= endOfMonth) {
              const user: User = {
                uid: doc.id,
                email: userData.email || "",
                displayName: userData.displayName || "",
                fullName: userData.fullName || "",
                profileImageUrl: userData.profileImageUrl || "",
                lastLoginAt: userData.lastLoginAt
                  ? userData.lastLoginAt.toDate
                    ? userData.lastLoginAt.toDate().toISOString()
                    : userData.lastLoginAt.toString()
                  : "",
                createdAt: signupDate.toISOString(),
                type: "signup",
              };
              monthSignupUsers.push(user);
             

              // Count daily signups
              const dateKey = `${signupDate.getFullYear()}-${(
                signupDate.getMonth() + 1
              )
                .toString()
                .padStart(2, "0")}-${signupDate
                .getDate()
                .toString()
                .padStart(2, "0")}`;
              dailySignupMap.set(
                dateKey,
                (dailySignupMap.get(dateKey) || 0) + 1
              );
            }
          } catch (error) {
            console.error(
              `Error processing signup date for user ${userData.email}:`,
              error
            );
          }
        }
      });

      // Convert map to array for chart
      const chartData: DailyData[] = [];
      for (let i = 1; i <= daysInMonth; i++) {
        const dateKey = `${now.getFullYear()}-${(now.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${i.toString().padStart(2, "0")}`;
        chartData.push({
          day: i.toString(),
          loginCount: dailyLoginMap.get(dateKey) || 0,
          signupCount: dailySignupMap.get(dateKey) || 0,
        });
      }


      setMonthLogins(monthLoginUsers);
      setMonthSignups(monthSignupUsers);
      setDailyData(chartData);
      setTotalMonthLogins(monthLoginUsers.length);
      setTotalMonthSignups(monthSignupUsers.length);
    } catch (error) {
      console.error("Error fetching month's data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMonthLogins();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchMonthLogins();
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    };
  };

  // ProfileImage Component
  const ProfileImage = ({
    user,
    size = 32,
    fontSize = "xs",
  }: {
    user: User;
    size?: number;
    fontSize?: string;
  }) => {
    const [imageError, setImageError] = useState(false);

    if (user.profileImageUrl && !imageError) {
      return (
        <View
          style={[
            tw`rounded-full items-center justify-center mr-3`,
            {
              width: size,
              height: size,
            },
          ]}
        >
          <Image
            source={{ uri: user.profileImageUrl }}
            style={[
              tw`rounded-full`,
              {
                width: size,
                height: size,
              },
            ]}
            onError={() => setImageError(true)}
          />
        </View>
      );
    }

    // Fallback to first letter
    const displayName = user.fullName || user.displayName || user.email;
    const firstLetter = displayName.charAt(0).toUpperCase();

    return (
      <View
        style={[
          tw`rounded-full items-center justify-center mr-3`,
          {
            width: size,
            height: size,
            backgroundColor:
              user.type === "login"
                ? Colors.light.green40 || "rgba(121, 170, 0, 0.2)"
                : "rgba(59, 130, 246, 0.2)",
          },
        ]}
      >
        <Text
          style={[
            tw`font-bold ${fontSize}`,
            {
              color:
                user.type === "login" ? Colors.light.primaryGreen : "#3B82F6",
            },
          ]}
        >
          {firstLetter}
        </Text>
      </View>
    );
  };

  // Custom Pie Chart Component (Beautiful Donut Chart)
  const CustomPieChart = ({
    totalLogins,
    totalSignups,
    width,
    height,
  }: {
    totalLogins: number;
    totalSignups: number;
    width: number;
    height: number;
  }) => {
    const total = totalLogins + totalSignups;
    if (total === 0) {
      return (
        <View
          style={[
            tw`rounded-3xl p-6 border items-center justify-center`,
            {
              height: height,
            },
          ]}
        >
          <Ionicons
            name="pie-chart-outline"
            size={60}
            color={Colors.light.grayText}
          />
          <Text
            style={[
              tw`text-center mt-4 text-lg font-medium`,
              { color: Colors.light.grayText },
            ]}
          >
            No activity data this month
          </Text>
        </View>
      );
    }

    const loginPercentage = (totalLogins / total) * 100;
    const signupPercentage = (totalSignups / total) * 100;

    // Calculate angles for pie slices
    const loginAngle = (totalLogins / total) * 360;
    const signupAngle = (totalSignups / total) * 360;

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.3;
    const innerRadius = radius * 0.6; // For donut effect

    // Create SVG path for pie slices
    const createArcPath = (
      centerX: number,
      centerY: number,
      radius: number,
      innerRadius: number,
      startAngle: number,
      endAngle: number
    ) => {
      const startAngleRad = (startAngle * Math.PI) / 180;
      const endAngleRad = (endAngle * Math.PI) / 180;

      const x1 = centerX + radius * Math.cos(startAngleRad);
      const y1 = centerY + radius * Math.sin(startAngleRad);
      const x2 = centerX + radius * Math.cos(endAngleRad);
      const y2 = centerY + radius * Math.sin(endAngleRad);

      const x3 = centerX + innerRadius * Math.cos(endAngleRad);
      const y3 = centerY + innerRadius * Math.sin(endAngleRad);
      const x4 = centerX + innerRadius * Math.cos(startAngleRad);
      const y4 = centerY + innerRadius * Math.sin(startAngleRad);

      const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

      return [
        `M ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        `L ${x3} ${y3}`,
        `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}`,
        "Z",
      ].join(" ");
    };

    const loginPath = createArcPath(
      centerX,
      centerY,
      radius,
      innerRadius,
      -90,
      -90 + loginAngle
    );
    const signupPath = createArcPath(
      centerX,
      centerY,
      radius,
      innerRadius,
      -90 + loginAngle,
      -90 + loginAngle + signupAngle
    );

    return (
      <View style={tw`rounded-3xl p-6`}>
        <Svg width={width} height={height}>
          {/* Define beautiful gradients */}
          <Defs>
            {/* Login slice gradient */}
            <LinearGradient
              id="loginPieGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <Stop
                offset="0%"
                stopColor={Colors.light.primaryGreen}
                stopOpacity="1"
              />
              <Stop
                offset="100%"
                stopColor={Colors.light.primaryGreen}
                stopOpacity="0.8"
              />
            </LinearGradient>

            {/* Signup slice gradient */}
            <LinearGradient
              id="signupPieGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <Stop
                offset="0%"
                stopColor={Colors.light.greenText}
                stopOpacity="1"
              />
              <Stop
                offset="100%"
                stopColor={Colors.light.greenText}
                stopOpacity="0.8"
              />
            </LinearGradient>

            {/* Shadow gradient */}
            <LinearGradient
              id="shadowGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <Stop offset="0%" stopColor="rgba(0,0,0,0.1)" stopOpacity="1" />
              <Stop offset="100%" stopColor="rgba(0,0,0,0.2)" stopOpacity="0" />
            </LinearGradient>
          </Defs>

          {/* Shadow effect */}
          <Circle
            cx={centerX + 2}
            cy={centerY + 2}
            r={radius}
            fill="url(#shadowGradient)"
            opacity="0.3"
          />

          {/* Login slice */}
          {totalLogins > 0 && (
            <Path
              d={loginPath}
              fill="url(#loginPieGradient)"
              stroke="white"
              strokeWidth="3"
            />
          )}

          {/* Signup slice */}
          {totalSignups > 0 && (
            <Path
              d={signupPath}
              fill="url(#signupPieGradient)"
              stroke="white"
              strokeWidth="3"
            />
          )}

          {/* Center circle with gradient */}
          <Circle
            cx={centerX}
            cy={centerY}
            r={innerRadius}
            fill="white"
            stroke="rgba(121, 170, 0, 0.1)"
            strokeWidth="2"
          />

          {/* Center content */}
          <SvgText
            x={centerX}
            y={centerY - 10}
            fontSize="20"
            fill={Colors.light.titleText}
            textAnchor="middle"
            fontWeight="700"
          >
            {total}
          </SvgText>

          <SvgText
            x={centerX}
            y={centerY + 8}
            fontSize="12"
            fill={Colors.light.grayText}
            textAnchor="middle"
            fontWeight="500"
          >
            Total Users
          </SvgText>

          {/* Login percentage label */}
          {totalLogins > 0 && (
            <React.Fragment>
              <SvgText
                x={
                  centerX +
                  radius *
                    0.75 *
                    Math.cos(((-90 + loginAngle / 2) * Math.PI) / 180)
                }
                y={
                  centerY +
                  radius *
                    0.75 *
                    Math.sin(((-90 + loginAngle / 2) * Math.PI) / 180)
                }
                fontSize="14"
                fill="white"
                textAnchor="middle"
                fontWeight="700"
              >
                {loginPercentage.toFixed(1)}%
              </SvgText>
            </React.Fragment>
          )}

          {/* Signup percentage label */}
          {totalSignups > 0 && (
            <React.Fragment>
              <SvgText
                x={
                  centerX +
                  radius *
                    0.75 *
                    Math.cos(
                      ((-90 + loginAngle + signupAngle / 2) * Math.PI) / 180
                    )
                }
                y={
                  centerY +
                  radius *
                    0.75 *
                    Math.sin(
                      ((-90 + loginAngle + signupAngle / 2) * Math.PI) / 180
                    )
                }
                fontSize="14"
                fill="white"
                textAnchor="middle"
                fontWeight="700"
              >
                {signupPercentage.toFixed(1)}%
              </SvgText>
            </React.Fragment>
          )}
        </Svg>

        {/* Statistics below the pie chart */}
        <View style={tw`flex-row justify-between mt-6`}>
          <View style={tw`flex-1 items-center`}>
            <View style={tw`flex-row items-center mb-2`}>
              <View
                style={[
                  tw`w-4 h-4 rounded-full mr-2`,
                  { backgroundColor: Colors.light.primaryGreen },
                ]}
              />
              <Text
                style={[
                  tw`text-sm font-semibold`,
                  { color: Colors.light.titleText },
                ]}
              >
                Logins
              </Text>
            </View>
            <Text
              style={[
                tw`text-2xl font-bold`,
                { color: Colors.light.primaryGreen },
              ]}
            >
              {totalLogins}
            </Text>
            <Text style={[tw`text-sm`, { color: Colors.light.grayText }]}>
              {loginPercentage.toFixed(1)}% of total
            </Text>
          </View>

          <View style={[tw`w-px bg-gray-200 mx-4`, { height: 80 }]} />

          <View style={tw`flex-1 items-center`}>
            <View style={tw`flex-row items-center mb-2`}>
              <View
                style={[
                  tw`w-4 h-4 rounded-full mr-2`,
                  { backgroundColor: Colors.light.greenText },
                ]}
              />
              <Text
                style={[
                  tw`text-sm font-semibold`,
                  { color: Colors.light.titleText },
                ]}
              >
                Signups
              </Text>
            </View>
            <Text
              style={[
                tw`text-2xl font-bold`,
                { color: Colors.light.greenText },
              ]}
            >
              {totalSignups}
            </Text>
            <Text style={[tw`text-sm`, { color: Colors.light.grayText }]}>
              {signupPercentage.toFixed(1)}% of total
            </Text>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-white`}>
        <ActivityIndicator size="large" color={Colors.light.primaryGreen} />
        <Text style={[tw`mt-4`, { color: Colors.light.grayText }]}>
          Loading this month's data...
        </Text>
      </View>
    );
  }

  const currentMonth = new Date().toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <View style={tw`flex-1 bg-white`}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* Header */}
      <View style={tw`flex-row items-center justify-between px-4 pb-4`}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={tw`p-2 rounded-full`}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={Colors.light.titleText}
          />
        </TouchableOpacity>

        <Text
          style={[tw`text-xl font-bold`, { color: Colors.light.titleText }]}
        >
          {currentMonth} Activity
        </Text>

        <TouchableOpacity onPress={onRefresh} style={tw`p-2 rounded-full`}>
          <MaterialIcons
            name="refresh"
            size={24}
            color={Colors.light.primaryGreen}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={tw`flex-1`}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Summary Cards */}
        <View style={tw`px-4 mb-6`}>
          <View style={tw`flex-row justify-between mb-4`}>
            <View
              style={[
                tw`flex-1 p-4 rounded-xl mr-2`,
                {
                  backgroundColor:
                    Colors.light.green40 || "rgba(121, 170, 0, 0.1)",
                },
              ]}
            >
              <Ionicons
                name="log-in"
                size={24}
                color={Colors.light.primaryGreen}
              />
              <Text
                style={[
                  tw`text-2xl font-bold mt-2`,
                  { color: Colors.light.titleText },
                ]}
              >
                {totalMonthLogins}
              </Text>
              <Text style={[tw`text-sm`, { color: Colors.light.greenText }]}>
                Total Logins This Month
              </Text>
            </View>

            <View
              style={[
                tw`flex-1 p-4 rounded-xl ml-2`,
                { backgroundColor: "rgba(59, 130, 246, 0.1)" },
              ]}
            >
              <Ionicons name="person-add" size={24} color="#3B82F6" />
              <Text
                style={[
                  tw`text-2xl font-bold mt-2`,
                  { color: Colors.light.titleText },
                ]}
              >
                {totalMonthSignups}
              </Text>
              <Text style={[tw`text-sm`, { color: "#3B82F6" }]}>
                New Signups This Month
              </Text>
            </View>
          </View>

          <View style={tw`flex-row justify-between`}>
            <View
              style={[
                tw`flex-1 p-4 rounded-xl mr-2`,
                { backgroundColor: "rgba(168, 85, 247, 0.1)" },
              ]}
            >
              <Ionicons name="calendar" size={24} color="#A855F7" />
              <Text
                style={[
                  tw`text-2xl font-bold mt-2`,
                  { color: Colors.light.titleText },
                ]}
              >
                {dailyData.reduce(
                  (max, curr) => Math.max(max, curr.loginCount),
                  0
                )}
              </Text>
              <Text style={[tw`text-sm`, { color: "#A855F7" }]}>
                Peak Day Logins
              </Text>
            </View>

            <View
              style={[
                tw`flex-1 p-4 rounded-xl ml-2`,
                { backgroundColor: "rgba(245, 158, 11, 0.1)" },
              ]}
            >
              <Ionicons name="trending-up" size={24} color="#F59E0B" />
              <Text
                style={[
                  tw`text-2xl font-bold mt-2`,
                  { color: Colors.light.titleText },
                ]}
              >
                {dailyData.reduce(
                  (max, curr) => Math.max(max, curr.signupCount),
                  0
                )}
              </Text>
              <Text style={[tw`text-sm`, { color: "#F59E0B" }]}>
                Peak Day Signups
              </Text>
            </View>
          </View>
        </View>

        {/* Charts Section */}
        <View style={tw`px-4`}>
          <Text
            style={[tw`text-lg font-bold`, { color: Colors.light.titleText }]}
          >
            Monthly Activity Distribution
          </Text>

          {/* Beautiful Pie Chart */}
          <View style={tw`mb-4 flex items-center justify-center`}>
            <CustomPieChart
              totalLogins={totalMonthLogins}
              totalSignups={totalMonthSignups}
              width={screenWidth - 32}
              height={300}
            />
          </View>
        </View>

        {/* Recent Login Users */}
        <View style={tw`px-4 mb-6`}>
          <Text
            style={[
              tw`text-lg font-bold mb-4`,
              { color: Colors.light.titleText },
            ]}
          >
            This Month's Login Users ({monthLogins.length})
          </Text>

          {monthLogins.length === 0 ? (
            <View style={tw`items-center py-6 bg-gray-50 rounded-xl mb-4`}>
              <Ionicons
                name="log-in-outline"
                size={40}
                color={Colors.light.grayText}
              />
              <Text
                style={[
                  tw`text-center mt-2 text-sm`,
                  { color: Colors.light.grayText },
                ]}
              >
                No users logged in this month yet
              </Text>
            </View>
          ) : (
            <View style={tw`mb-4`}>
              {monthLogins
                .sort(
                  (a, b) =>
                    new Date(b.lastLoginAt!).getTime() -
                    new Date(a.lastLoginAt!).getTime()
                )
                .slice(0, showMoreLogins ? monthLogins.length : 5)
                .map((user) => {
                  const { date, time } = formatDateTime(user.lastLoginAt!);
                  return (
                    <View
                      key={`login-${user.uid}`}
                      style={[
                        tw`p-3 rounded-lg mb-2 border`,
                        {
                          backgroundColor: "rgba(121, 170, 0, 0.05)",
                          borderColor: "rgba(121, 170, 0, 0.2)",
                        },
                      ]}
                    >
                      <View style={tw`flex-row items-center justify-between`}>
                        <View style={tw`flex-1`}>
                          <View style={tw`flex-row items-center`}>
                            <ProfileImage user={user} size={32} fontSize="xs" />
                            <View style={tw`flex-1`}>
                              <Text
                                style={[
                                  tw`font-medium text-sm`,
                                  { color: Colors.light.titleText },
                                ]}
                                numberOfLines={1}
                              >
                                {user.fullName ||
                                  user.displayName ||
                                  "Unknown User"}
                              </Text>
                              <Text
                                style={[
                                  tw`text-xs`,
                                  { color: Colors.light.grayText },
                                ]}
                                numberOfLines={1}
                              >
                                {user.email}
                              </Text>
                            </View>
                          </View>
                        </View>

                        <View style={tw`items-end`}>
                          <View style={tw`flex-row items-center mb-1`}>
                            <Ionicons
                              name="log-in"
                              size={12}
                              color={Colors.light.primaryGreen}
                            />
                            <Text
                              style={[
                                tw`text-xs font-medium ml-1`,
                                { color: Colors.light.primaryGreen },
                              ]}
                            >
                              {time}
                            </Text>
                          </View>
                          <Text
                            style={[
                              tw`text-xs`,
                              { color: Colors.light.grayText },
                            ]}
                          >
                            {date}
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                })}

              {monthLogins.length > 5 && (
                <TouchableOpacity
                  onPress={() => setShowMoreLogins(!showMoreLogins)}
                  style={[
                    tw`p-3 rounded-lg border-2 border-dashed items-center justify-center`,
                    {
                      borderColor: Colors.light.primaryGreen,
                      backgroundColor: "rgba(121, 170, 0, 0.02)",
                    },
                  ]}
                >
                  <View style={tw`flex-row items-center`}>
                    <Ionicons
                      name={showMoreLogins ? "chevron-up" : "chevron-down"}
                      size={16}
                      color={Colors.light.primaryGreen}
                    />
                    <Text
                      style={[
                        tw`text-sm font-medium ml-2`,
                        { color: Colors.light.primaryGreen },
                      ]}
                    >
                      {showMoreLogins
                        ? "Show Less"
                        : `Show ${monthLogins.length - 5} More`}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {/* Recent Signups List */}
        <View style={tw`px-4 mb-6`}>
          <Text
            style={[
              tw`text-lg font-bold mb-4`,
              { color: Colors.light.titleText },
            ]}
          >
            This Month's New Signups ({monthSignups.length})
          </Text>

          {monthSignups.length === 0 ? (
            <View style={tw`items-center py-6 bg-blue-50 rounded-xl`}>
              <Ionicons
                name="person-add-outline"
                size={40}
                color={Colors.light.grayText}
              />
              <Text
                style={[
                  tw`text-center mt-2 text-sm`,
                  { color: Colors.light.grayText },
                ]}
              >
                No new users signed up this month yet
              </Text>
            </View>
          ) : (
            <View style={tw`mb-4`}>
              {monthSignups
                .sort(
                  (a, b) =>
                    new Date(b.createdAt!).getTime() -
                    new Date(a.createdAt!).getTime()
                )
                .slice(0, showMoreSignups ? monthSignups.length : 5)
                .map((user) => {
                  const { date, time } = formatDateTime(user.createdAt!);
                  return (
                    <View
                      key={`signup-${user.uid}`}
                      style={[
                        tw`p-3 rounded-lg mb-2 border`,
                        {
                          backgroundColor: "rgba(59, 130, 246, 0.05)",
                          borderColor: "rgba(59, 130, 246, 0.2)",
                        },
                      ]}
                    >
                      <View style={tw`flex-row items-center justify-between`}>
                        <View style={tw`flex-1`}>
                          <View style={tw`flex-row items-center`}>
                            <ProfileImage user={user} size={32} fontSize="xs" />
                            <View style={tw`flex-1`}>
                              <Text
                                style={[
                                  tw`font-medium text-sm`,
                                  { color: Colors.light.titleText },
                                ]}
                                numberOfLines={1}
                              >
                                {user.fullName ||
                                  user.displayName ||
                                  "Unknown User"}
                              </Text>
                              <Text
                                style={[
                                  tw`text-xs`,
                                  { color: Colors.light.grayText },
                                ]}
                                numberOfLines={1}
                              >
                                {user.email}
                              </Text>
                            </View>
                          </View>
                        </View>

                        <View style={tw`items-end`}>
                          <View style={tw`flex-row items-center mb-1`}>
                            <Ionicons
                              name="person-add"
                              size={12}
                              color="#3B82F6"
                            />
                            <Text
                              style={[
                                tw`text-xs font-medium ml-1`,
                                { color: "#3B82F6" },
                              ]}
                            >
                              {time}
                            </Text>
                          </View>
                          <Text
                            style={[
                              tw`text-xs`,
                              { color: Colors.light.grayText },
                            ]}
                          >
                            {date}
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                })}

              {monthSignups.length > 5 && (
                <TouchableOpacity
                  onPress={() => setShowMoreSignups(!showMoreSignups)}
                  style={[
                    tw`p-3 rounded-lg border-2 border-dashed items-center justify-center`,
                    {
                      borderColor: "#3B82F6",
                      backgroundColor: "rgba(59, 130, 246, 0.02)",
                    },
                  ]}
                >
                  <View style={tw`flex-row items-center`}>
                    <Ionicons
                      name={showMoreSignups ? "chevron-up" : "chevron-down"}
                      size={16}
                      color="#3B82F6"
                    />
                    <Text
                      style={[
                        tw`text-sm font-medium ml-2`,
                        { color: "#3B82F6" },
                      ]}
                    >
                      {showMoreSignups
                        ? "Show Less"
                        : `Show ${monthSignups.length - 5} More`}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default OneMonthLoginScreen;
