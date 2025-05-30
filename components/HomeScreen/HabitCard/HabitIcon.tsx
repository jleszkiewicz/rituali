import React from "react";
import { View, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { HabitCategory } from "@/components/AddHabitModal/types";

interface HabitIconProps {
  category: HabitCategory;
}

const getIconForCategory = (category: HabitCategory): string => {
  switch (category) {
    case "health":
      return "heart-outline";
    case "fitness":
      return "barbell-outline";
    case "beauty":
      return "sunny-outline";
    case "mindfulness":
      return "leaf-outline";
    case "education":
      return "school-outline";
    case "self-development":
      return "sparkles-outline";
    case "other":
      return "apps-outline";
  }
};

const HabitIcon: React.FC<HabitIconProps> = ({ category }) => {
  return (
    <View style={styles.iconContainer}>
      <Ionicons
        name={getIconForCategory(category) as any}
        size={28}
        color={Colors.PrimaryRed}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    backgroundColor: Colors.White,
    width: 46,
    height: 46,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default HabitIcon;
