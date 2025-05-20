import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "../Commons/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { t } from "@/src/service/translateService";
import AfterPhotoPicker from "../AddChallengeModal/AfterPhotoPicker";
import { supabase } from "@/src/service/supabaseClient";
import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system";

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
      Alert.alert(t("error"), t("please_add_after_photo"));
      return;
    }

    try {
      setIsSubmitting(true);

      const fileName = `${Date.now()}.jpg`;
      const filePath = `${fileName}`;

      const base64 = await FileSystem.readAsStringAsync(photoUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const { error: uploadError } = await supabase.storage
        .from("after")
        .upload(filePath, decode(base64), {
          contentType: "image/jpeg",
        });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("after").getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from("challenges")
        .update({ after_photo_url: publicUrl })
        .eq("id", challengeId);

      if (updateError) throw updateError;

      onPhotoAdded();
      onClose();
    } catch (error) {
      Alert.alert(t("error"), t("error_uploading_photo"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) return null;

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>{t("add_after_photo")}</ThemedText>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={Colors.PrimaryGray} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView}>
          <AfterPhotoPicker photoUri={photoUri} onPhotoChange={setPhotoUri} />
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              isSubmitting && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <ThemedText style={styles.submitButtonText}>{t("save")}</ThemedText>
          </TouchableOpacity>
        </View>
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: Colors.White,
    borderRadius: 12,
    width: "90%",
    maxHeight: "90%",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.PrimaryGray,
  },
  closeButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  footer: {
    marginTop: 16,
  },
  submitButton: {
    backgroundColor: Colors.PrimaryPink,
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
