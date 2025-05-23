import React from "react";
import { View, StyleSheet, Modal, TouchableOpacity, Image } from "react-native";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/Commons/ThemedText";
import { t } from "@/src/service/translateService";

interface RemoveFriendModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const RemoveFriendModal = ({
  visible,
  onConfirm,
  onCancel,
}: RemoveFriendModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Image
            source={require("@/assets/ilustrations/trash.png")}
            style={styles.illustration}
            resizeMode="contain"
          />
          <ThemedText style={styles.title} bold>
            {t("remove_friend")}
          </ThemedText>
          <ThemedText style={styles.message}>
            {t("remove_friend_confirmation")}
          </ThemedText>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
            >
              <ThemedText style={styles.cancelButtonText} bold>
                {t("cancel")}
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={onConfirm}
            >
              <ThemedText style={styles.confirmButtonText} bold>
                {t("remove")}
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
    borderRadius: 12,
    padding: 20,
    width: "90%",
    maxWidth: 400,
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 12,
    color: Colors.PrimaryGray,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: Colors.PrimaryGray,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: Colors.White,
    borderWidth: 1,
    borderColor: Colors.HotPink,
  },
  confirmButton: {
    backgroundColor: Colors.HotPink,
  },
  cancelButtonText: {
    color: Colors.HotPink,
    fontSize: 16,
  },
  confirmButtonText: {
    color: Colors.White,
    fontSize: 16,
  },
  illustration: {
    width: 120,
    height: 120,
    marginBottom: 12,
    alignSelf: "center",
  },
});
