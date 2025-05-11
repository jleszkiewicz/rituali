import React from "react";
import { TouchableOpacity, StyleSheet, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "../../Commons/ThemedText";
import { t } from "@/src/service/translateService";

interface HabitActionsProps {
  pan: Animated.ValueXY;
  onEdit: () => void;
  onDelete: () => void;
}

const HabitActions: React.FC<HabitActionsProps> = ({
  pan,
  onEdit,
  onDelete,
}) => {
  return (
    <>
      <Animated.View
        style={[
          styles.editButtonContainer,
          {
            opacity: pan.x.interpolate({
              inputRange: [-160, -80, 0],
              outputRange: [1, 0.5, 0],
              extrapolate: "clamp",
            }),
          },
        ]}
      >
        <TouchableOpacity style={styles.editButton} onPress={onEdit}>
          <Ionicons name="create-outline" size={24} color={Colors.White} />
          <ThemedText style={styles.editButtonText} bold>
            {t("edit")}
          </ThemedText>
        </TouchableOpacity>
      </Animated.View>
      <Animated.View
        style={[
          styles.deleteButtonContainer,
          {
            opacity: pan.x.interpolate({
              inputRange: [-160, -80, 0],
              outputRange: [1, 0.5, 0],
              extrapolate: "clamp",
            }),
          },
        ]}
      >
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <Ionicons name="trash-outline" size={24} color={Colors.White} />
          <ThemedText style={styles.deleteButtonText} bold>
            {t("delete")}
          </ThemedText>
        </TouchableOpacity>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  editButtonContainer: {
    position: "absolute",
    right: 80,
    top: 0,
    bottom: 0,
    width: 80,
  },
  editButton: {
    backgroundColor: Colors.HotPink,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    borderRadius: 0,
  },
  editButtonText: {
    color: Colors.White,
    marginStart: 5,
    fontSize: 14,
  },
  deleteButtonContainer: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 80,
  },
  deleteButton: {
    backgroundColor: Colors.PrimaryRed,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    borderTopEndRadius: 10,
    borderBottomEndRadius: 10,
  },
  deleteButtonText: {
    color: Colors.White,
    marginLeft: 5,
    fontSize: 14,
    fontWeight: "600",
  },
});

export default HabitActions;
