import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/Colors";
import { HabitData } from "@/components/AddHabitModal/types";
import { t } from "@/src/service/translateService";
import { useSelector } from "react-redux";
import { selectActiveHabits } from "@/src/store/habitsSlice";
import { ThemedText } from "../Commons/ThemedText";
import Dropdown from "../Commons/Dropdown";
import { Ionicons } from "@expo/vector-icons";

interface HabitsSelectorProps {
  selectedHabits: string[];
  error: string;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  onToggleHabit: (habitId: string) => void;
  onAddHabit: () => void;
}

export default function HabitsSelector({
  selectedHabits,
  error,
  isExpanded,
  onToggleExpanded,
  onToggleHabit,
  onAddHabit,
}: HabitsSelectorProps) {
  const activeHabits = useSelector(selectActiveHabits);

  return (
    <View style={styles.inputContainer}>
      <View style={styles.header}>
        <ThemedText style={styles.label} bold>
          {t("habits")}
        </ThemedText>
        <TouchableOpacity style={styles.addButton} onPress={onAddHabit}>
          <Ionicons
            name="add-circle-outline"
            size={24}
            color={Colors.HotPink}
          />
          <ThemedText style={styles.addButtonText}>
            {t("add_new_habit")}
          </ThemedText>
        </TouchableOpacity>
      </View>
      <Dropdown
        isExpanded={isExpanded}
        onToggle={onToggleExpanded}
        selectedText={
          selectedHabits.length > 0
            ? `${t("habits_selected")}: ${selectedHabits.length}`
            : ""
        }
        placeholder={t("select_habits")}
        items={activeHabits.map((habit) => ({
          id: habit.id,
          label: habit.name,
          isSelected: selectedHabits.includes(habit.id),
        }))}
        onItemSelect={onToggleHabit}
        noItemsText={t("no_active_habits")}
        error={error}
        expandHeight
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  label: {
    textTransform: "capitalize",
    fontSize: 16,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  addButtonText: {
    color: Colors.HotPink,
    fontSize: 14,
  },
});
