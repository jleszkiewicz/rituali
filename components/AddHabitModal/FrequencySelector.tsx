import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { t } from "@/src/service/translateService";
import { Frequency } from "./types";
import { ThemedText } from "../Commons/ThemedText";

interface FrequencySelectorProps {
  frequency: Frequency;
  onFrequencyChange: (frequency: Frequency) => void;
}

const FrequencySelector: React.FC<FrequencySelectorProps> = ({
  frequency,
  onFrequencyChange,
}) => {
  return (
    <View style={styles.frequencyContainer}>
      <ThemedText style={styles.sectionTitle} bold>
        {t("frequency")}
      </ThemedText>
      <View style={styles.frequencyButtons}>
        <TouchableOpacity
          style={[
            styles.frequencyButton,
            frequency === "daily" && styles.selectedFrequency,
          ]}
          onPress={() => onFrequencyChange("daily")}
        >
          <ThemedText
            style={[
              styles.frequencyText,
              frequency === "daily" && styles.selectedFrequencyText,
            ]}
          >
            {t("daily")}
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.frequencyButton,
            frequency === "weekly" && styles.selectedFrequency,
          ]}
          onPress={() => onFrequencyChange("weekly")}
        >
          <ThemedText
            style={[
              styles.frequencyText,
              frequency === "weekly" && styles.selectedFrequencyText,
            ]}
          >
            {t("weekly")}
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.frequencyButton,
            frequency === "monthly" && styles.selectedFrequency,
          ]}
          onPress={() => onFrequencyChange("monthly")}
        >
          <ThemedText
            style={[
              styles.frequencyText,
              frequency === "monthly" && styles.selectedFrequencyText,
            ]}
          >
            {t("monthly")}
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.frequencyButton,
            frequency === "selected_days" && styles.selectedFrequency,
          ]}
          onPress={() => onFrequencyChange("selected_days")}
        >
          <ThemedText
            style={[
              styles.frequencyText,
              frequency === "selected_days" && styles.selectedFrequencyText,
            ]}
          >
            {t("selected_days")}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  frequencyContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 10,
  },
  frequencyButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  frequencyButton: {
    padding: 6,
    borderWidth: 1,
    borderRadius: 10,
    minWidth: "45%",
    alignItems: "center",
    borderColor: Colors.HotPink,
  },
  selectedFrequency: {
    backgroundColor: Colors.HotPink,
    color: Colors.White,
  },
  frequencyText: {
    color: Colors.Black,
    fontSize: 14,
  },
  selectedFrequencyText: {
    color: Colors.White,
  },
});

export default FrequencySelector;
