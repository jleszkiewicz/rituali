import React from "react";
import { TouchableOpacity, StyleSheet, Modal, View } from "react-native";
import { Colors } from "@/constants/Colors";
import { t } from "@/src/service/translateService";
import { ThemedText } from "../Commons/ThemedText";
import { LinearGradient } from "expo-linear-gradient";
import PrimaryButton from "../Commons/PrimaryButton";
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
          <PrimaryButton
            title={t("add_habit")}
            onPress={onAddHabit}
            style={styles.option}
          />
          <PrimaryButton
            title={t("add_challenge")}
            onPress={onAddChallenge}
            style={styles.option}
          />
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
    borderRadius: 10,
    marginBottom: 10,
  },
  cancelButton: {
    padding: 15,
    marginTop: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    color: Colors.PrimaryGray,
    textAlign: "center",
  },
});

export default AddOptionsModal;
