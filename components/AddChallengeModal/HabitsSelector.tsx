import React from "react";
import { View, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { HabitData } from "@/components/AddHabitModal/types";
import { t } from "@/src/service/translateService";
import { useSelector } from "react-redux";
import { selectActiveHabits } from "@/src/store/habitsSlice";
import { ThemedText } from "../Commons/ThemedText";
import Dropdown from "../Commons/Dropdown";

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
      <ThemedText style={styles.label} bold>
        {t("habits")}
      </ThemedText>
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
        addButton={{
          text: t("add_new_habit"),
          onPress: onAddHabit,
        }}
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
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
});
