import React from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Colors } from "@/constants/Colors";
import { HabitData } from "@/components/AddHabitModal/types";
import { ThemedText } from "../../Commons/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { t } from "@/src/service/translateService";
import ChallengeHabitCard from "../../HomeScreen/HabitCard/ChallengeHabitCard";
import EmptyHabitsList from "@/components/HomeScreen/EmptyHabitsList";

interface HabitsSectionProps {
  habits: HabitData[];
  challengeId: string;
  headerColor?: string;
  onAddHabit: () => void;
}

const HabitsSection: React.FC<HabitsSectionProps> = ({
  habits,
  challengeId,
  headerColor = Colors.White,
  onAddHabit,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={[styles.title, { color: headerColor }]} bold>
          {t("habits")}
        </ThemedText>
        <TouchableOpacity style={styles.addButton} onPress={onAddHabit}>
          <Ionicons
            name="add-circle-outline"
            size={24}
            color={Colors.HotPink}
          />
          <ThemedText style={[styles.addButtonText, { color: Colors.HotPink }]}>
            {t("add_habit")}
          </ThemedText>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.habitsList}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        contentContainerStyle={styles.habitsListContent}
      >
        {habits.length === 0 ? (
          <EmptyHabitsList
            imageWidth={120}
            textColor={Colors.White}
            title={t("no_habits_title")}
            description={t("no_habits_in_challenge_description")}
          />
        ) : (
          habits.map((habit) => (
            <ChallengeHabitCard
              key={habit.id}
              habit={habit}
              challengeId={challengeId}
            />
          ))
        )}
      </ScrollView>
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
    textTransform: "capitalize",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  addButtonText: {
    color: Colors.ButterYellow,
    fontSize: 16,
  },
  habitsList: {
    maxHeight: 250,
  },
  habitsListContent: {
    paddingBottom: 10,
  },
});

export default HabitsSection;
