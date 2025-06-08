import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Pressable,
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
  isWithBuddy?: boolean;
  isPartOfChallenge?: boolean;
}

const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  onClose,
  title,
  message,
  type,
  isWithBuddy,
  isPartOfChallenge,
}) => {
  if (!visible) return null;

  const getImageSource = () => {
    if (type === "error") {
      return require("@/assets/illustrations/warning.png");
    }
    if (isWithBuddy) {
      return require("@/assets/illustrations/onboarding2.png");
    }
    if (isPartOfChallenge) {
      return require("@/assets/illustrations/onboarding2.png");
    }
    return require("@/assets/illustrations/success.png");
  };

  return (
    <View style={styles.modalOverlay}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.modalContent}>
        <Image source={getImageSource()} style={styles.modalIcon} />
        <ThemedText style={styles.modalTitle}>{title}</ThemedText>
        <ThemedText style={styles.modalMessage}>{message}</ThemedText>
        <TouchableOpacity style={styles.modalButton} onPress={onClose}>
          <ThemedText style={styles.modalButtonText}>{t("ok")}</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
