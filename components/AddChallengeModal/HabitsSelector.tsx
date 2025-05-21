import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/Colors";
import { t } from "@/src/service/translateService";
import { useSelector } from "react-redux";
import { selectHabits } from "@/src/store/habitsSlice";
import { ThemedText } from "@/components/Commons/ThemedText";
import Dropdown from "@/components/Commons/Dropdown";
import { Ionicons } from "@expo/vector-icons";

interface HabitsSelectorProps {
  selectedHabits: string[];
  error?: string;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  onToggleHabit: (habitId: string) => void;
  onAddHabit?: () => void;
}

const HabitsSelector: React.FC<HabitsSelectorProps> = ({
  selectedHabits,
  error,
  isExpanded,
  onToggleExpanded,
  onToggleHabit,
  onAddHabit,
}) => {
  const habits = useSelector(selectHabits);
  const activeHabits = habits.filter((habit) => habit.status === "active");
  const validSelectedHabits = selectedHabits.filter((id) =>
    activeHabits.some((habit) => habit.id === id)
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.label} bold>
          {t("habits")}
        </ThemedText>
        {onAddHabit && (
          <TouchableOpacity style={styles.addButton} onPress={onAddHabit}>
            <Ionicons
              name="add-circle-outline"
              size={24}
              color={Colors.HotPink}
            />
            <ThemedText style={styles.addButtonText}>
              {t("add_habit")}
            </ThemedText>
          </TouchableOpacity>
        )}
      </View>

      <Dropdown
        isExpanded={isExpanded}
        onToggle={onToggleExpanded}
        selectedText={
          validSelectedHabits.length > 0
            ? `${t("habits_selected")}: ${validSelectedHabits.length}`
            : ""
        }
        placeholder={t("select_habits")}
        items={activeHabits.map((habit) => ({
          id: habit.id,
          label: habit.name,
          isSelected: validSelectedHabits.includes(habit.id),
        }))}
        onItemSelect={onToggleHabit}
        noItemsText={t("no_active_habits")}
        error={error}
        expandHeight
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    textTransform: "capitalize",
    fontSize: 16,
    color: Colors.PrimaryGray,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  addButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: Colors.HotPink,
  },
});

export default HabitsSelector;
