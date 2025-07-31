import React from "react";
import { Text, View } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import tw from "tailwind-react-native-classnames";

interface Transaction {
  merchant: string;
  amount: string;
  returnedBags: number;
  totalBags: string;
  time: string;
  date: string;
  location: string;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
}) => (
  <View style={tw`mb-4`}>
    <Text style={tw`font-bold text-lg mb-2`}>Transaction History</Text>
    {transactions.map((tx, idx) => (
      <View key={idx} style={tw` rounded-xl  border border-gray-200`}>
        <View style={tw`flex-row justify-between mb-2 bg-gray-100 rounded-t-xl p-2 px-2 `}>
          <Text style={[tw`font-bold text-base`,{color:Colors.light.titleText}]}>{tx.merchant}</Text>
          <Text style={[tw`font-bold text-base`,{color:Colors.light.titleText}]}>{tx.amount}</Text>
        </View>
        <View style={tw`flex-row justify-between mb-1 px-2`}>
            <View style={tw`flex-col justify-between mb-1 px-2`}>
          <Text style={[tw`font-bold text-xs`,{color:Colors.light.titleText}]}>Returned Bags</Text>
          <Text style={[tw` text-xs`,{color:Colors.light.titleText}]}>{tx.returnedBags}</Text>

        </View>
        <View style={tw`flex-col justify-between mb-1 px-2`}>
          <Text style={[tw`font-bold text-xs `,{color:Colors.light.titleText}]}>Time & Date</Text>

          <Text style={[tw`text-xs`,{color:Colors.light.titleText}]}>
            {tx.time} | {tx.date}
          </Text>
        </View> 
        </View>
    <View style={tw`flex-row  mb-1 px-2 `}>
        <View style={tw`flex-col justify-between mb-1 px-2 `}>
            <Text style={[tw`font-bold text-xs`, { color: Colors.light.titleText }]}>Total Bags</Text>
            <Text style={[tw`text-xs`, { color: Colors.light.titleText }]}>{tx.totalBags}</Text>
        </View>
        <View style={[tw`flex-col justify-between mb-1  px-2  `,{marginLeft: 100}]}>
            <Text style={[tw`font-bold text-xs`, { color: Colors.light.titleText }]}>Location</Text>
            <Text style={[tw`text-xs`, { color: Colors.light.titleText }]}>{tx.location}</Text>
        </View>
    </View>
       
      </View>
    ))}
  </View>
);

export default TransactionHistory;
