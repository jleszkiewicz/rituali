import React from "react";
import { View, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "../Commons/ThemedText";
import { t } from "@/src/service/translateService";

interface ConfirmationModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isVisible,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = t("delete"),
  cancelText = t("cancel"),
}) => {
  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ThemedText style={styles.title} bold>
            {title}
          </ThemedText>
          <ThemedText style={styles.message}>{message}</ThemedText>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <ThemedText style={styles.buttonText}>{cancelText}</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={() => {
                onConfirm();
                onClose();
              }}
            >
              <ThemedText style={styles.buttonText}>{confirmText}</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: Colors.PrimaryGray,
    borderRadius: 20,
    padding: 20,
    width: "80%",
    maxWidth: 400,
  },
  title: {
    fontSize: 20,
    color: Colors.White,
    marginBottom: 10,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: Colors.White,
    marginBottom: 20,
    textAlign: "center",
    opacity: 0.8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: Colors.LightGray,
  },
  confirmButton: {
    backgroundColor: Colors.HotPink,
  },
  buttonText: {
    color: Colors.White,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ConfirmationModal;
