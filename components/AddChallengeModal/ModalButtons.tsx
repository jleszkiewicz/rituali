import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { t } from "@/src/service/translateService";
import { ThemedText } from "../Commons/ThemedText";

interface ModalButtonsProps {
  onCancel: () => void;
  onSubmit: () => void;
}

const ModalButtons = ({ onCancel, onSubmit }: ModalButtonsProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
        <ThemedText style={styles.cancelButtonText}>{t("cancel")}</ThemedText>
      </TouchableOpacity>
      <TouchableOpacity style={styles.submitButton} onPress={onSubmit}>
        <ThemedText style={styles.submitButtonText}>{t("submit")}</ThemedText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    marginEnd: 10,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.HotPink,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButton: {
    flex: 1,
    marginStart: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: Colors.HotPink,
    alignItems: "center",
  },
  cancelButtonText: {
    color: Colors.HotPink,
    fontSize: 16,
  },
  submitButtonText: {
    color: Colors.White,
    fontSize: 16,
  },
});

export default ModalButtons;
