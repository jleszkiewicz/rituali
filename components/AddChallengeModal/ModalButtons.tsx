import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { t } from "@/src/service/translateService";

interface ModalButtonsProps {
  onCancel: () => void;
  onSubmit: () => void;
}

export default function ModalButtons({
  onCancel,
  onSubmit,
}: ModalButtonsProps) {
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={[styles.button, styles.cancelButton]}
        onPress={onCancel}
      >
        <Text style={styles.buttonText}>{t("cancel")}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.submitButton]}
        onPress={onSubmit}
      >
        <Text style={styles.buttonText}>{t("submit")}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    minWidth: "40%",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: Colors.DarkGray,
  },
  submitButton: {
    backgroundColor: Colors.HotPink,
  },
  buttonText: {
    color: Colors.White,
    fontSize: 16,
    fontWeight: "bold",
  },
});
