import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "../Commons/ThemedText";
import { t } from "@/src/service/translateService";
import AfterPhotoPicker from "../AddChallengeModal/AfterPhotoPicker";
import ModalHeader from "./ChallengeInfoModal/ModalHeader";
import { uploadAfterPhoto } from "@/src/service/apiService";

interface AddAfterPhotoModalProps {
  isVisible: boolean;
  onClose: () => void;
  challengeId: string;
  onPhotoAdded: () => void;
}

const AddAfterPhotoModal: React.FC<AddAfterPhotoModalProps> = ({
  isVisible,
  onClose,
  challengeId,
  onPhotoAdded,
}) => {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!photoUri) {
      return;
    }

    try {
      setIsSubmitting(true);
      await uploadAfterPhoto(challengeId, photoUri);
      onPhotoAdded();
      onClose();
    } catch (error) {
      console.error("Error uploading photo:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ModalHeader
            title={t("add_after_photo")}
            onClose={onClose}
            color={Colors.PrimaryGray}
          />

          <View style={styles.contentContainer}>
            <AfterPhotoPicker photoUri={photoUri} onPhotoChange={setPhotoUri} />
          </View>

          <View style={styles.footerContainer}>
            <TouchableOpacity
              style={[
                styles.submitButton,
                isSubmitting && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <ThemedText style={styles.submitButtonText}>
                {t("submit")}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.White,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "80%",
  },
  contentContainer: {
    marginTop: 20,
  },
  footerContainer: {
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: Colors.HotPink,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: Colors.White,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AddAfterPhotoModal;
