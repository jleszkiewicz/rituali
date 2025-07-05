import React from "react";
import { View, StyleSheet } from "react-native";
import { ThemedText } from "../../Commons/ThemedText";
import { Colors } from "@/constants/Colors";
import { Frequency } from "@/components/AddHabitModal/types";
import { t } from "@/src/service/translateService";

interface FrequencyChipProps {
  frequency: Frequency;
  selectedDays?: string[];
}

const FrequencyChip: React.FC<FrequencyChipProps> = ({
  frequency,
  selectedDays = [],
}) => {
  const dayNames = [
    { id: "monday", short: t("mon") },
    { id: "tuesday", short: t("tue") },
    { id: "wednesday", short: t("wed") },
    { id: "thursday", short: t("thu") },
    { id: "friday", short: t("fri") },
    { id: "saturday", short: t("sat") },
    { id: "sunday", short: t("sun") },
  ];

  let parsedSelectedDays: string[] = [];
  if (typeof selectedDays === "string") {
    try {
      parsedSelectedDays = JSON.parse(selectedDays);
    } catch (error) {
      console.error("Error parsing selectedDays:", error);
      parsedSelectedDays = [];
    }
  } else if (Array.isArray(selectedDays)) {
    parsedSelectedDays = selectedDays;
  }

  if (
    frequency === "selected_days" &&
    Array.isArray(parsedSelectedDays) &&
    parsedSelectedDays.length > 0
  ) {
    return (
      <View style={styles.chipsContainer}>
        {parsedSelectedDays.map((dayId) => {
          const day = dayNames.find((d) => d.id === dayId);
          if (!day) return null;

          return (
            <View key={dayId} style={styles.chip}>
              <ThemedText style={styles.chipText}>{day.short}</ThemedText>
            </View>
          );
        })}
      </View>
    );
  }

  const getFrequencyLabel = () => {
    switch (frequency) {
      case "daily":
        return t("daily");
      case "weekly":
        return t("weekly");
      case "selected_days":
        return t("selected_days");
      default:
        return t("daily");
    }
  };

  return (
    <View style={styles.chip}>
      <ThemedText style={styles.chipText}>{getFrequencyLabel()}</ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  chip: {
    backgroundColor: Colors.HotPink,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginStart: 8,
  },
  chipText: {
    fontSize: 11,
    color: Colors.White,
  },
});

export default FrequencyChip;
