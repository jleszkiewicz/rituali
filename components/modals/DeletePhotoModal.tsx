import React from "react";
import { View, StyleSheet, Modal, TouchableOpacity, Image } from "react-native";
import { ThemedText } from "@/components/Commons/ThemedText";
import { Colors } from "@/constants/Colors";
import { t } from "@/src/service/translateService";

interface DeletePhotoModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeletePhotoModal: React.FC<DeletePhotoModalProps> = ({
  isVisible,
  onClose,
  onConfirm,
}) => {
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
            source={require("@/assets/ilustrations/trash.png")}
            style={styles.illustration}
            resizeMode="contain"
          />
          <ThemedText style={styles.title}>{t("delete_photo")}</ThemedText>
          <ThemedText style={styles.description}>
            {t("delete_photo_confirmation")}
          </ThemedText>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <ThemedText style={styles.buttonText}>{t("cancel")}</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={onConfirm}
            >
              <ThemedText style={[styles.buttonText, styles.deleteButtonText]}>
                {t("delete")}
              </ThemedText>
            </TouchableOpacity>
          </View>
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
    borderRadius: 16,
    padding: 24,
    width: "80%",
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
  deleteButton: {
    backgroundColor: Colors.HotPink,
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

export default DeletePhotoModal;
