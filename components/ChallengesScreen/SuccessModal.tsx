import React from "react";
import { View, StyleSheet, Modal, TouchableOpacity, Image } from "react-native";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "../Commons/ThemedText";
import { t } from "@/src/service/translateService";

interface SuccessModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export const SuccessModal = ({ isVisible, onClose }: SuccessModalProps) => {
  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Image
            source={require("@/assets/illustrations/success.png")}
            style={styles.modalImage}
          />
          <ThemedText style={styles.modalTitle}>
            {t("challenge_added")}
          </ThemedText>
          <ThemedText style={styles.modalDescription}>
            {t("challenge_added_description")}
          </ThemedText>
          <TouchableOpacity
            style={[styles.modalButton, styles.addButton]}
            onPress={onClose}
          >
            <ThemedText style={styles.buttonText}>{t("ok")}</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: Colors.White,
    borderRadius: 20,
    padding: 24,
    width: "90%",
    maxWidth: 400,
    alignItems: "center",
  },
  modalImage: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    color: Colors.Black,
    marginBottom: 8,
    textAlign: "center",
  },
  modalDescription: {
    fontSize: 14,
    color: Colors.Black,
    marginBottom: 24,
    textAlign: "center",
    opacity: 0.7,
  },
  modalButton: {
    width: "50%",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  addButton: {
    backgroundColor: Colors.HotPink,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.White,
  },
});
