import { Colors } from "@/constants/Colors";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import tw from "tailwind-react-native-classnames";

interface TabsProps {
  tabs: string[];
  children: React.ReactNode[];
  active?: number;
  setActive?: (idx: number) => void;
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  children,
  active: controlledActive,
  setActive: controlledSetActive,
}) => {
  const [internalActive, internalSetActive] = useState(0);
  const active =
    controlledActive !== undefined ? controlledActive : internalActive;
  const setActive = controlledSetActive || internalSetActive;
  return (
    <View>
      <View style={tw`flex-row mb-2 `}>
        {tabs.map((tab, idx) => (
          <TouchableOpacity
            key={tab}
            style={[
              tw`flex-1 px-0 py-3 items-center border-b-2`,
              active === idx
                ? { borderBottomColor: Colors.light.primaryGreen }
                : { borderBottomColor: "transparent" },
            ]}
            onPress={() => setActive(idx)}
          >
            <Text
              style={[
                tw`text-base`,
                {
                  fontWeight: active === idx ? "bold" : "normal",
                  color:
                    active === idx
                      ? Colors.light.primaryGreen
                      : Colors.light.titleText,
                },
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View>{children[active]}</View>
    </View>
  );
};

// ...existing code...
export default Tabs;
