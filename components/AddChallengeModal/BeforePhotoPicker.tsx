import React from "react";
import { View, StyleSheet, TouchableOpacity, Image, Alert } from "react-native";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "../Commons/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { t } from "@/src/service/translateService";
import { useImageUpload } from "@/src/hooks/useImageUpload";

interface BeforePhotoPickerProps {
  photoUri: string | null;
  onPhotoChange: (uri: string | null) => void;
}

const BeforePhotoPicker: React.FC<BeforePhotoPickerProps> = ({
  photoUri,
  onPhotoChange,
}) => {
  const { pickImage, isLoading } = useImageUpload({
    onError: (error) => {
      Alert.alert(t("error_picking_image"), error.message);
    },
  });

  const handlePickImage = async () => {
    try {
      const uri = await pickImage();
      if (uri) {
        onPhotoChange(uri);
      }
    } catch (error) {}
  };

  const handleRemovePhoto = () => {
    onPhotoChange(null);
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.label}>{t("before_photo")}</ThemedText>
      <ThemedText style={styles.description}>
        {t("before_photo_description")}
      </ThemedText>
      <TouchableOpacity
        style={styles.photoContainer}
        onPress={handlePickImage}
        disabled={isLoading}
      >
        {photoUri ? (
          <View style={styles.photoWrapper}>
            <Image source={{ uri: photoUri }} style={styles.photo} />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={handleRemovePhoto}
            >
              <Ionicons name="close-circle" size={24} color={Colors.White} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.placeholder}>
            <Ionicons
              name="camera-outline"
              size={32}
              color={Colors.PrimaryGray}
            />
            <ThemedText style={styles.placeholderText}>
              {t("add_before_photo")}
            </ThemedText>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: Colors.PrimaryGray,
    marginBottom: 8,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    color: Colors.PrimaryGray,
    marginBottom: 12,
    lineHeight: 20,
  },
  photoContainer: {
    width: "100%",
    height: 200,
    backgroundColor: Colors.LightGray,
    borderRadius: 10,
    overflow: "hidden",
  },
  photoWrapper: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  photo: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  removeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 12,
  },
  placeholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    marginTop: 8,
    color: Colors.PrimaryGray,
    fontSize: 14,
  },
});

export default BeforePhotoPicker;
