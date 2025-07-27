import React from "react";
import { View, Modal, StyleSheet, Image, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/Commons/ThemedText";
import { Colors } from "@/constants/Colors";

interface ErrorModalProps {
  visible: boolean;
  message: string;
  title: string;
  onClose: () => void;
}

export const ErrorModal = ({
  visible,
  message,
  title,
  onClose,
}: ErrorModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Image
            source={require("@/assets/illustrations/login_error.png")}
            style={styles.modalImage}
          />
          <ThemedText style={styles.modalTitle}>{title}</ThemedText>
          <ThemedText style={styles.modalText}>{message}</ThemedText>
          <TouchableOpacity style={styles.modalButton} onPress={onClose}>
            <ThemedText style={styles.modalButtonText}>OK</ThemedText>
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
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  modalImage: {
    width: 250,
    height: 250,
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.PrimaryRed,
    marginBottom: 10,
    lineHeight: 30,
  },
  modalText: {
    fontSize: 16,
    color: Colors.Black,
    textAlign: "center",
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: Colors.PrimaryRed,
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 25,
  },
  modalButtonText: {
    color: Colors.White,
    fontSize: 16,
  },
});
