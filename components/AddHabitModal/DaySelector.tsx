import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { t } from "@/src/service/translateService";
import { ThemedText } from "../Commons/ThemedText";

interface DaySelectorProps {
  selectedDays: string[];
  onDayToggle: (day: string) => void;
}

const DaySelector = ({ selectedDays, onDayToggle }: DaySelectorProps) => {
  const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

  return (
    <View style={styles.container}>
      <ThemedText style={styles.label}>{t("select_days")}</ThemedText>
      <View style={styles.daysContainer}>
        {days.map((day) => (
          <TouchableOpacity
            key={day}
            style={[
              styles.dayButton,
              selectedDays.includes(day) && styles.selectedDay,
            ]}
            onPress={() => onDayToggle(day)}
          >
            <ThemedText
              style={[
                styles.dayText,
                selectedDays.includes(day) && styles.selectedDayText,
              ]}
            >
              {t(day)}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  daysContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  dayButton: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    minWidth: "45%",
    alignItems: "center",
    borderColor: Colors.PrimaryPink,
  },
  selectedDay: {
    backgroundColor: Colors.PrimaryPink,
  },
  dayText: {
    color: Colors.Black,
    fontSize: 14,
  },
  selectedDayText: {
    color: Colors.White,
  },
});

export default DaySelector;
