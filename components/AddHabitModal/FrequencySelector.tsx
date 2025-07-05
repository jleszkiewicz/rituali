import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { ThemedText } from "../Commons/ThemedText";
import { Colors } from "@/constants/Colors";
import { Frequency } from "./types";
import { t } from "@/src/service/translateService";

interface FrequencySelectorProps {
  onFrequencyChange: (frequency: Frequency) => void;
  onSelectedDaysChange?: (days: string[]) => void;
  initialFrequency?: Frequency;
  initialSelectedDays?: string[];
}

const FrequencySelector: React.FC<FrequencySelectorProps> = ({
  onFrequencyChange,
  onSelectedDaysChange,
  initialFrequency = "daily",
  initialSelectedDays = [],
}) => {
  const [selectedFrequency, setSelectedFrequency] =
    useState<Frequency>(initialFrequency);
  const [selectedDays, setSelectedDays] =
    useState<string[]>(initialSelectedDays);

  const frequencies = [
    { id: "daily", label: t("daily") },
    { id: "weekly", label: t("weekly") },
    { id: "selected_days", label: t("selected_days") },
  ];

  const weekDays = [
    { id: "monday", label: t("monday"), short: t("mon") },
    { id: "tuesday", label: t("tuesday"), short: t("tue") },
    { id: "wednesday", label: t("wednesday"), short: t("wed") },
    { id: "thursday", label: t("thursday"), short: t("thu") },
    { id: "friday", label: t("friday"), short: t("fri") },
    { id: "saturday", label: t("saturday"), short: t("sat") },
    { id: "sunday", label: t("sunday"), short: t("sun") },
  ];

  const handleFrequencySelect = (frequency: Frequency) => {
    setSelectedFrequency(frequency);
    onFrequencyChange(frequency);

    if (frequency !== "selected_days") {
      setSelectedDays([]);
      onSelectedDaysChange?.([]);
    }
  };

  const handleDayToggle = (dayId: string) => {
    const newSelectedDays = selectedDays.includes(dayId)
      ? selectedDays.filter((day) => day !== dayId)
      : [...selectedDays, dayId];

    setSelectedDays(newSelectedDays);
    onSelectedDaysChange?.(newSelectedDays);
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.label} bold>
        {t("frequency")}
      </ThemedText>

      <View style={styles.frequencyOptions}>
        {frequencies.map((frequency) => (
          <TouchableOpacity
            key={frequency.id}
            style={[
              styles.frequencyOption,
              selectedFrequency === frequency.id && styles.selectedOption,
            ]}
            onPress={() => handleFrequencySelect(frequency.id as Frequency)}
          >
            <ThemedText
              style={[
                styles.frequencyText,
                selectedFrequency === frequency.id && styles.selectedText,
              ]}
            >
              {frequency.label}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      {selectedFrequency === "selected_days" && (
        <View style={styles.daysContainer}>
          <ThemedText style={styles.daysLabel} bold>
            {t("select_days")}
          </ThemedText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.daysScroll}
          >
            {weekDays.map((day) => (
              <TouchableOpacity
                key={day.id}
                style={[
                  styles.dayOption,
                  selectedDays.includes(day.id) && styles.selectedDay,
                ]}
                onPress={() => handleDayToggle(day.id)}
              >
                <ThemedText
                  style={[
                    styles.dayText,
                    selectedDays.includes(day.id) && styles.selectedDayText,
                  ]}
                >
                  {day.short}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 12,
    color: Colors.PrimaryGray,
  },
  frequencyOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  frequencyOption: {
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.LightGray,
    backgroundColor: Colors.White,
  },
  selectedOption: {
    backgroundColor: Colors.HotPink,
    borderColor: Colors.HotPink,
  },
  frequencyText: {
    fontSize: 14,
    color: Colors.PrimaryGray,
  },
  selectedText: {
    color: Colors.White,
  },
  daysContainer: {
    marginTop: 16,
  },
  daysLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: Colors.PrimaryGray,
  },
  daysScroll: {
    paddingHorizontal: 4,
  },
  dayOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.LightGray,
    backgroundColor: Colors.White,
    marginRight: 8,
  },
  selectedDay: {
    backgroundColor: Colors.HotPink,
    borderColor: Colors.HotPink,
  },
  dayText: {
    fontSize: 12,
    color: Colors.PrimaryGray,
  },
  selectedDayText: {
    color: Colors.White,
  },
});

export default FrequencySelector;
