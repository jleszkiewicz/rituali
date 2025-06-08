import React from "react";
import { View, Modal, StyleSheet, Image, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/Commons/ThemedText";
import { Colors } from "@/constants/Colors";
import { t } from "@/src/service/translateService";

interface FriendRequestModalProps {
  visible: boolean;
  isSuccess: boolean;
  error?: string;
  onClose: () => void;
}

export const FriendRequestModal = ({
  visible,
  isSuccess,
  error,
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
                ? require("@/assets/illustrations/success.png")
                : require("@/assets/illustrations/error.png")
            }
            style={styles.modalImage}
          />
          <ThemedText style={styles.title} bold>
            {isSuccess ? t("friend_request_sent") : t("friend_request_error")}
          </ThemedText>
          <ThemedText style={styles.message}>
            {isSuccess
              ? t("friend_request_sent_description")
              : error || t("friend_request_error_description")}
          </ThemedText>
          <TouchableOpacity style={styles.button} onPress={onClose}>
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
    borderRadius: 10,
    padding: 20,
    width: "90%",
    alignItems: "center",
  },
  modalImage: {
    width: 160,
    height: 160,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: Colors.PrimaryGray,
  },
  button: {
    backgroundColor: Colors.HotPink,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    width: "40%",
  },
  buttonText: {
    color: Colors.White,
    fontSize: 16,
    fontWeight: "600",
  },
});
