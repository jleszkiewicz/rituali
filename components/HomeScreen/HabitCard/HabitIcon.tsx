import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { HabitCategory } from "@/components/AddHabitModal/types";
import { getIconForCategory } from "../methods/methods";

interface HabitIconProps {
  category: HabitCategory;
}

const HabitIcon: React.FC<HabitIconProps> = ({ category }) => {
  const iconName = getIconForCategory(category);

  return (
    <View style={styles.iconContainer}>
      <Ionicons name={iconName as any} size={30} color={Colors.HotPink} />
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    backgroundColor: Colors.LightPink,
    borderRadius: 10,
    padding: 5,
    marginEnd: 10,
  },
});

export default HabitIcon;
