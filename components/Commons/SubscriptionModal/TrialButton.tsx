import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { ThemedText } from "../ThemedText";
import { Colors } from "@/constants/Colors";
import { t } from "@/src/service/translateService";

interface TrialButtonProps {
  onPress: () => void;
  disabled?: boolean;
}

export const TrialButton: React.FC<TrialButtonProps> = ({
  onPress,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      style={[styles.trialButton, disabled && styles.trialButtonDisabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <ThemedText
        style={[
          styles.trialButtonText,
          disabled && styles.trialButtonTextDisabled,
        ]}
      >
        {disabled ? t("processing") : t("start_free_trial")}
      </ThemedText>
      <ThemedText
        style={[
          styles.trialButtonSubtext,
          disabled && styles.trialButtonSubtextDisabled,
        ]}
      >
        {t("7_days_free")}
      </ThemedText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  trialButton: {
    backgroundColor: Colors.White,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 10,
    width: "100%",
  },
  trialButtonDisabled: {
    backgroundColor: Colors.LightGray,
    opacity: 0.6,
  },
  trialButtonText: {
    color: Colors.HotPink,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  trialButtonTextDisabled: {
    color: Colors.PrimaryGray,
  },
  trialButtonSubtext: {
    color: Colors.PrimaryGray,
    fontSize: 14,
    marginTop: 5,
  },
  trialButtonSubtextDisabled: {
    opacity: 0.6,
  },
});
