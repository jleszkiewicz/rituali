import React from "react";
import {
  View,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "./ThemedText";
import { t } from "@/src/service/translateService";

interface CustomModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type: "success" | "error";
}

const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  onClose,
  title,
  message,
  type,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Image
              source={
                type === "success"
                  ? require("@/assets/ilustrations/poke.png")
                  : require("@/assets/ilustrations/warning.png")
              }
              style={styles.modalIcon}
            />
            <ThemedText style={styles.modalTitle}>{title}</ThemedText>
            <ThemedText style={styles.modalMessage}>{message}</ThemedText>
            <TouchableOpacity style={styles.modalButton} onPress={onClose}>
              <ThemedText style={styles.modalButtonText}>{t("ok")}</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
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
  modalIcon: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  modalContent: {
    backgroundColor: Colors.White,
    borderRadius: 12,
    padding: 20,
    width: "90%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 14,
    color: Colors.PrimaryGray,
    textAlign: "center",
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: Colors.HotPink,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  modalButtonText: {
    color: Colors.White,
    fontSize: 16,
    fontWeight: "500",
  },
});

export default CustomModal;
