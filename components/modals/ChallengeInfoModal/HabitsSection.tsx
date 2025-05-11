import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/Colors";
import { HabitData } from "@/components/AddHabitModal/types";
import { ThemedText } from "../../Commons/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { t } from "@/src/service/translateService";
import ChallengeHabitCard from "../../HomeScreen/HabitCard/ChallengeHabitCard";
import EmptyHabitsList from "@/components/SelectHabitsModal/EmptyHabitsList";

interface HabitsSectionProps {
  habits: HabitData[];
  challengeId: string;
  onAddHabit: () => void;
}

const HabitsSection: React.FC<HabitsSectionProps> = ({
  habits,
  challengeId,
  onAddHabit,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title} bold>
          {t("habits")}
        </ThemedText>
        <TouchableOpacity style={styles.addButton} onPress={onAddHabit}>
          <Ionicons
            name="add-circle-outline"
            size={24}
            color={Colors.HotPink}
          />
          <ThemedText style={styles.addButtonText}>{t("add_habit")}</ThemedText>
        </TouchableOpacity>
      </View>

      {habits.length === 0 ? (
        <EmptyHabitsList />
      ) : (
        habits.map((habit) => (
          <ChallengeHabitCard
            key={habit.id}
            habit={habit}
            challengeId={challengeId}
          />
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    color: Colors.White,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  addButtonText: {
    color: Colors.HotPink,
    fontSize: 16,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: Colors.White,
    borderRadius: 10,
  },
  emptyText: {
    marginTop: 10,
    color: Colors.LightGray,
    fontSize: 16,
    textAlign: "center",
  },
});

export default HabitsSection;
