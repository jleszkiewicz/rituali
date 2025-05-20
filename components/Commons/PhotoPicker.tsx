import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  View,
  ViewStyle,
  DimensionValue,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "./ThemedText";
import { Colors } from "@/constants/Colors";
import { t } from "@/src/service/translateService";

interface PhotoPickerProps {
  onPress: () => void;
  height?: number;
  width?: DimensionValue;
  style?: ViewStyle;
  imageUri?: string | null;
  onRemove?: () => void;
}

const PhotoPicker: React.FC<PhotoPickerProps> = ({
  onPress,
  height = 300,
  width = "100%",
  style,
  imageUri,
  onRemove,
}) => {
  return (
    <TouchableOpacity
      style={[styles.photoPicker, { height, width }, style]}
      onPress={onPress}
    >
      {imageUri ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.image} />
          {onRemove && (
            <TouchableOpacity
              style={styles.removeButton}
              onPress={(e) => {
                e.stopPropagation();
                onRemove();
              }}
            >
              <Ionicons name="close-circle" size={24} color={Colors.White} />
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <>
          <Ionicons
            name="camera-outline"
            size={48}
            color={Colors.PrimaryGray}
          />
          <ThemedText style={styles.pickerText}>{t("pick_photo")}</ThemedText>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  photoPicker: {
    borderRadius: 12,
    backgroundColor: Colors.White,
    borderWidth: 2,
    borderColor: Colors.PrimaryGray,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  pickerText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.PrimaryGray,
  },
  imageContainer: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  image: {
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
});

export default PhotoPicker;
