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
        <ThemedText style={styles.submitButtonText}>{t("add")}</ThemedText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    marginRight: 10,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.PrimaryPink,
    alignItems: "center",
  },
  submitButton: {
    flex: 1,
    marginLeft: 10,
    padding: 15,
    borderRadius: 10,
    backgroundColor: Colors.PrimaryPink,
    alignItems: "center",
  },
  cancelButtonText: {
    color: Colors.PrimaryPink,
    fontSize: 16,
  },
  submitButtonText: {
    color: Colors.White,
    fontSize: 16,
  },
});

export default ModalButtons;
