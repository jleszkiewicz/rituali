import React from "react";
import { TouchableOpacity, StyleSheet, Modal, View, Text } from "react-native";
import { Colors } from "@/constants/Colors";
import { t } from "@/src/service/translateService";

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
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.modalButton} onPress={onAddHabit}>
            <Text style={styles.buttonText}>{t("add_new_habit")}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalButton} onPress={onAddChallenge}>
            <Text style={styles.buttonText}>
              {t("add_and_start_challenge")}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Colors.White,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
    alignItems: "center",
  },
  modalButton: {
    backgroundColor: Colors.PrimaryPink,
    padding: 15,
    borderRadius: 10,
    width: "100%",
    marginVertical: 10,
    alignItems: "center",
  },
  buttonText: {
    color: Colors.White,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default AddOptionsModal;
