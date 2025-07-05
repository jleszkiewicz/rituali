import React from "react";
import { View, StyleSheet, Pressable, Image, Modal } from "react-native";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "../Commons/ThemedText";
import { t } from "@/src/service/translateService";
import PrimaryButton from "../Commons/PrimaryButton";

interface DeleteAccountModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
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
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.content}>
          <Image
            source={require("@/assets/illustrations/trash.png")}
            style={styles.illustration}
            resizeMode="contain"
          />
          <ThemedText style={styles.title}>{title}</ThemedText>
          <ThemedText style={styles.description}>{message}</ThemedText>
          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <ThemedText style={styles.buttonText}>{cancelText}</ThemedText>
            </Pressable>
            <PrimaryButton style={styles.button} onPress={onConfirm}>
              <ThemedText
                style={[styles.buttonText, styles.deleteButtonText]}
                bold
              >
                {confirmText}
              </ThemedText>
            </PrimaryButton>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    backgroundColor: Colors.White,
    borderRadius: 16,
    padding: 24,
    width: "90%",
    alignItems: "center",
  },
  illustration: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.PrimaryGray,
    marginBottom: 12,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: Colors.PrimaryGray,
    marginBottom: 24,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: Colors.White,
    borderWidth: 1,
    borderColor: Colors.PrimaryGray,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  deleteButtonText: {
    color: Colors.White,
  },
});

export default DeleteAccountModal;
