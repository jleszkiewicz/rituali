import React from "react";
import { View, StyleSheet, Modal, TouchableOpacity, Image } from "react-native";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "./ThemedText";
import { t } from "@/src/service/translateService";

interface CustomModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type: "success" | "error";
  isWithBuddy?: boolean;
}

const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  onClose,
  title,
  message,
  type,
  isWithBuddy,
}) => {
  const getImageSource = () => {
    if (type === "error") {
      return require("@/assets/ilustrations/warning.png");
    }
    return isWithBuddy
      ? require("@/assets/ilustrations/onboarding2.png")
      : require("@/assets/ilustrations/success.png");
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent={true}
      presentationStyle="overFullScreen"
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Image source={getImageSource()} style={styles.modalIcon} />
          <ThemedText style={styles.modalTitle}>{title}</ThemedText>
          <ThemedText style={styles.modalMessage}>{message}</ThemedText>
          <TouchableOpacity style={styles.modalButton} onPress={onClose}>
            <ThemedText style={styles.modalButtonText}>{t("ok")}</ThemedText>
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
    elevation: 5,
    shadowColor: Colors.Black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
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
