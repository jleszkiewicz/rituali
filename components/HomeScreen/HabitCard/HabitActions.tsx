import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

interface HabitActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

const HabitActions: React.FC<HabitActionsProps> = ({ onEdit, onDelete }) => {
  return (
    <View style={styles.actions}>
      <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
        <Ionicons name="create-outline" size={24} color={Colors.PrimaryGray} />
      </TouchableOpacity>
      <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
        <Ionicons name="trash-outline" size={24} color={Colors.HotPink} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
});

export default HabitActions;
