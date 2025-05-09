import React from "react";
import { TouchableOpacity, StyleSheet, Modal, View } from "react-native";
import { Colors } from "@/constants/Colors";
import { t } from "@/src/service/translateService";
import { ThemedText } from "../Commons/ThemedText";

interface AddOptionsModalProps {
  isVisible: boolean;
  onClose: () => void;
  onAddHabit: () => void;
  onAddChallenge: () => void;
}

const AddOptionsModal = ({
  isVisible,
  onClose,
  onAddHabit,
  onAddChallenge,
}: AddOptionsModalProps) => {
  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ThemedText style={styles.title}>{t("add_new")}</ThemedText>
          <TouchableOpacity style={styles.option} onPress={onAddHabit}>
            <ThemedText style={styles.optionText}>{t("add_habit")}</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option} onPress={onAddChallenge}>
            <ThemedText style={styles.optionText}>
              {t("add_challenge")}
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <ThemedText style={styles.cancelButtonText}>
              {t("cancel")}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: Colors.White,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: "center",
  },
  option: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.PrimaryGray,
  },
  optionText: {
    fontSize: 16,
    color: Colors.PrimaryGray,
  },
  cancelButton: {
    padding: 15,
    marginTop: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    color: Colors.PrimaryRed,
    textAlign: "center",
  },
});

export default AddOptionsModal;
