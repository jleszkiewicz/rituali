import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { HabitData } from "@/components/AddHabitModal/types";
import { Ionicons } from "@expo/vector-icons";
import { t } from "@/src/service/translateService";
import { useSelector } from "react-redux";
import { selectActiveHabits } from "@/src/store/habitsSlice";

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
      <TouchableOpacity
        style={styles.dropdownHeader}
        onPress={onToggleExpanded}
      >
        <Text style={styles.dropdownHeaderText}>
          {selectedHabits.length > 0
            ? `${t("habits_selected")}: ${selectedHabits.length}`
            : t("select_habits")}
        </Text>
        <Text style={styles.dropdownArrow}>{isExpanded ? "▲" : "▼"}</Text>
      </TouchableOpacity>

      {isExpanded && (
        <ScrollView style={styles.dropdownContent}>
          {activeHabits.length === 0 ? (
            <Text style={styles.noHabits}>{t("no_active_habits")}</Text>
          ) : (
            <>
              {activeHabits.map((habit) => (
                <TouchableOpacity
                  key={habit.id}
                  style={[
                    styles.dropdownItem,
                    selectedHabits.includes(habit.id) && styles.selectedHabit,
                  ]}
                  onPress={() => onToggleHabit(habit.id)}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      selectedHabits.includes(habit.id) &&
                        styles.selectedHabitText,
                    ]}
                  >
                    {habit.name}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={styles.addHabitButton}
                onPress={onAddHabit}
              >
                <Ionicons name="add" size={20} color={Colors.White} />
                <Text style={styles.addHabitButtonText}>
                  {t("add_new_habit")}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      )}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 15,
  },
  dropdownHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.Gray,
    borderRadius: 5,
    marginBottom: 5,
  },
  dropdownHeaderText: {
    fontSize: 16,
  },
  dropdownArrow: {
    fontSize: 12,
  },
  dropdownContent: {
    maxHeight: 190,
    borderWidth: 1,
    borderColor: Colors.Gray,
    borderRadius: 5,
    marginBottom: 5,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.Gray,
  },
  selectedHabit: {
    backgroundColor: Colors.PrimaryPink,
  },
  noHabits: {
    padding: 10,
    textAlign: "center",
    color: Colors.PrimaryGray,
  },
  dropdownItemText: {
    fontSize: 14,
  },
  selectedHabitText: {
    color: Colors.White,
    fontWeight: "bold",
  },
  addHabitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.HotPink,
    padding: 10,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  addHabitButtonText: {
    color: Colors.White,
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 5,
  },
  errorText: {
    color: Colors.PrimaryRed,
    fontSize: 12,
    marginTop: 5,
  },
});
