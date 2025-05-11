import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { HabitData } from "@/components/AddHabitModal/types";
import { ThemedText } from "../Commons/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import HabitIcon from "../HomeScreen/HabitCard/HabitIcon";

interface HabitSelectionItemProps {
  habit: HabitData;
  isSelected: boolean;
  onToggle: (habit: HabitData) => void;
}

const HabitSelectionItem: React.FC<HabitSelectionItemProps> = ({
  habit,
  isSelected,
  onToggle,
}) => {
  return (
    <TouchableOpacity
      style={[styles.habitItem, isSelected && styles.selectedHabit]}
      onPress={() => onToggle(habit)}
    >
      <View style={styles.habitContent}>
        <HabitIcon category={habit.category} />
        <ThemedText style={styles.habitName}>{habit.name}</ThemedText>
      </View>
      {isSelected && (
        <Ionicons name="checkmark-sharp" size={24} color={Colors.HotPink} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  habitItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.White,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  selectedHabit: {
    borderWidth: 2,
    borderColor: Colors.HotPink,
    backgroundColor: Colors.ButterYellow,
  },
  habitContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  habitName: {
    fontSize: 16,
    marginLeft: 10,
  },
});

export default HabitSelectionItem;
