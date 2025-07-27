import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { ThemedText } from "../ThemedText";
import { Colors } from "@/constants/Colors";
import { t } from "@/src/service/translateService";

interface TrialButtonProps {
  onPress: () => void;
}

export const TrialButton: React.FC<TrialButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.trialButton} onPress={onPress}>
      <ThemedText style={styles.trialButtonText}>
        {t("start_free_trial")}
      </ThemedText>
      <ThemedText style={styles.trialButtonSubtext}>
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
  trialButtonText: {
    color: Colors.HotPink,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  trialButtonSubtext: {
    color: Colors.PrimaryGray,
    fontSize: 14,
    marginTop: 5,
  },
});
