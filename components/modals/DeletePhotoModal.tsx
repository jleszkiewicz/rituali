import React from "react";
import { View, StyleSheet, Pressable, Dimensions, Image } from "react-native";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "../Commons/ThemedText";
import { t } from "@/src/service/translateService";
import PrimaryButton from "../Commons/PrimaryButton";

interface DeletePhotoModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const DeletePhotoModal: React.FC<DeletePhotoModalProps> = ({
  isVisible,
  onClose,
  onConfirm,
}) => {
  if (!isVisible) return null;

  return (
    <View style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.content}>
        <Image
          source={require("@/assets/illustrations/trash.png")}
          style={styles.illustration}
          resizeMode="contain"
        />
        <ThemedText style={styles.title}>{t("delete_photo")}</ThemedText>
        <ThemedText style={styles.description}>
          {t("delete_photo_confirmation")}
        </ThemedText>
        <View style={styles.buttonContainer}>
          <Pressable
            style={[styles.button, styles.cancelButton]}
            onPress={onClose}
          >
            <ThemedText style={styles.buttonText}>{t("cancel")}</ThemedText>
          </Pressable>
          <PrimaryButton style={styles.button} onPress={onConfirm}>
            <ThemedText style={[styles.buttonText, styles.deleteButtonText]}>
              {t("delete")}
            </ThemedText>
          </PrimaryButton>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    marginHorizontal: -10,
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

export default DeletePhotoModal;
