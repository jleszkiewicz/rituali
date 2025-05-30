import React from "react";
import { View, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/Commons/ThemedText";
import { t } from "@/src/service/translateService";
import PrimaryButton from "@/components/Commons/PrimaryButton";

interface ActionButtonsProps {
  onLeaveChallenge: () => void;
  onDeleteChallenge: () => void;
  isCreator: boolean;
}

export default function ActionButtons({
  onLeaveChallenge,
  onDeleteChallenge,
  isCreator,
}: ActionButtonsProps) {
  return (
    <View style={styles.buttonsContainer}>
      <PrimaryButton style={styles.leaveButton} onPress={onLeaveChallenge}>
        <ThemedText style={styles.leaveButtonText} bold>
          {t("leave_challenge")}
        </ThemedText>
      </PrimaryButton>

      {isCreator && (
        <PrimaryButton style={styles.deleteButton} onPress={onDeleteChallenge}>
          <ThemedText style={styles.deleteButtonText} bold>
            {t("delete_challenge")}
          </ThemedText>
        </PrimaryButton>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  buttonsContainer: {
    gap: 10,
    marginTop: 20,
  },
  leaveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: 15,
    backgroundColor: Colors.LightGray,
    borderColor: Colors.LightGray,
  },
  leaveButtonText: {
    color: Colors.White,
    fontSize: 16,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: 15,
    backgroundColor: Colors.HotPink,
  },
  deleteButtonText: {
    color: Colors.White,
    fontSize: 16,
  },
});
