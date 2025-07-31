import { Collapsible } from "@/components/Collapsible";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import tw from "tailwind-react-native-classnames";

const faqs = [
  {
    question: "What is Planet Rebag?",
    answer:
      "Planet Rebag is a platform that allows users to recycle bags and bottles, track their recycling history, and redeem rewards for their contributions to sustainability.",
  },
  {
    question: "How do I add items for recycling?",
    answer:
      "Go to the Add Items section from the home screen, select the type of item (bag or bottle), and follow the instructions to submit your items for recycling.",
  },
  {
    question: "How can I redeem rewards?",
    answer:
      "Once you have accumulated enough points from recycling, visit the Redeem section and choose from available rewards. You will receive a QR code to claim your reward.",
  },
  {
    question: "Where can I view my transaction history?",
    answer:
      "Your transaction history is available in the Transaction History section, where you can see all your recycling and redemption activities.",
  },
  {
    question: "How do I reset my password?",
    answer:
      "Go to the Login screen and tap on 'Forgot Password'. Follow the instructions to reset your password via email.",
  },
  {
    question: "Who do I contact for support?",
    answer:
      "You can reach out to our support team via the Contact Us section in your profile or email us at support@planetrebag.com.",
  },
];

export default function Faqs() {
  const [openIdx, setOpenIdx] = React.useState(0);

  return (
    <ScrollView
      style={[tw`flex-1 bg-white`, { backgroundColor: Colors.light.white }]}
      contentContainerStyle={tw`px-4 py-6`}
      showsVerticalScrollIndicator={false}
    >
      <View style={tw`flex-row items-center my-5 mt-10 mb-8`}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text
          style={[
            tw`text-lg font-semibold text-center ml-28`,
            { color: Colors.light.titleText },
          ]}
        >
          FAQs
        </Text>
      </View>
      <View style={tw`mb-4`}>
        {faqs.map((faq, idx) => (
          <View key={idx} style={tw`border-b border-gray-200 pb-2 mb-7`}>
            <Collapsible
              title={faq.question}
              isOpen={openIdx === idx}
              onPress={() => setOpenIdx(openIdx === idx ? -1 : idx)}
            >
              {faq.answer ? (
                <View style={tw`pt-2 leading-relaxed`}>
                  <Text
                    style={[
                      tw`text-xs leading-5`,
                      { color: Colors.light.grayText },
                    ]}
                  >
                    {faq.answer}
                  </Text>
                </View>
              ) : null}
            </Collapsible>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
