import React from "react";
import { View, Modal, StyleSheet, Image, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/Commons/ThemedText";
import { Colors } from "@/constants/Colors";
import { t } from "@/src/service/translateService";

interface FriendRequestModalProps {
  visible: boolean;
  isSuccess: boolean;
  onClose: () => void;
}

export const FriendRequestModal = ({
  visible,
  isSuccess,
  onClose,
}: FriendRequestModalProps) => {
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
            source={
              isSuccess
                ? require("@/assets/ilustrations/success.png")
                : require("@/assets/ilustrations/error.png")
            }
            style={styles.modalImage}
          />
          <ThemedText
            style={[styles.modalTitle, isSuccess && styles.successTitle]}
          >
            {isSuccess ? t("friend_request_sent") : t("friend_request_error")}
          </ThemedText>
          <ThemedText style={styles.modalText}>
            {isSuccess
              ? t("friend_request_sent_description")
              : t("friend_request_error_description")}
          </ThemedText>
          <TouchableOpacity
            style={[styles.modalButton, isSuccess && styles.successButton]}
            onPress={onClose}
          >
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
    width: "90%",
    alignItems: "center",
  },
  modalImage: {
    width: 160,
    height: 160,
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.PrimaryRed,
    marginBottom: 10,
    textAlign: "center",
  },
  successTitle: {
    color: Colors.HotPink,
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
  successButton: {
    backgroundColor: Colors.HotPink,
  },
  modalButtonText: {
    color: Colors.White,
    fontSize: 16,
  },
});
