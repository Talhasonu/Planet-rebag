import React from "react";
import { View } from "react-native";
import Almaya from "../../assets/images/almaya.svg";
import Kite from "../../assets/images/kite.svg";
import Lulu from "../../assets/images/lulu.svg";
import Card from "./Card";

type BagTransaction = {
  merchant: string;
  amount: string;
  returnedBags: number;
  totalBags: string;
  time: string;
  date: string;
  location: string;
};

type BagsTabProps = {
  returnedBags: number;
  pendingBags: number;
  bagTransactions: BagTransaction[];
};

const BagsTab: React.FC<BagsTabProps> = ({
  returnedBags,
  pendingBags,
  bagTransactions,
}) => (
  <View>
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <Card
        logo={Lulu}
        cashback="AED 10.00"
        title="Total Cashback"
        stats="15BAGS | AED 1.00"
        color="rgba(0, 169, 80, 0.1)"
        progressValue={15}
        progressMax={25}
        cashbackLabel="AED 0.5"
        statsLabel="AED 1.00"
        progressColor="rgba(0, 169, 80, 10)"
        progressBackgroundColor="rgba(0, 169, 80, 0.1)"
      />
      <Card
        logo={Kite}
        cashback="AED 10.00"
        title="Total Cashback"
        stats="21BAGS | AED 1.00"
        color="rgba(0, 78, 159, 0.1)"
        progressValue={21}
        progressMax={25}
        cashbackLabel="AED 0.5"
        statsLabel="AED 1.00"
        progressColor="rgba(0, 78, 159, 10)"
        progressBackgroundColor="rgba(0, 78, 159, 0.1)"
      />
      <Card
        logo={Almaya}
        cashback="AED 10.00"
        title="Total Cashback"
        stats="17BAGS | AED 1.00"
        color="rgba(191, 28, 34, 0.1)"
        progressValue={7}
        progressMax={25}
        progressColor="rgba(191, 28, 34, 10)"
        progressBackgroundColor="rgba(191, 28, 34, 0.1)"
        cashbackLabel="AED 0.5"
        statsLabel="AED 1.00"
      />
    </View>
    {/* You can use returnedBags, pendingBags, and bagTransactions as needed below */}
  </View>
);

export default BagsTab;
