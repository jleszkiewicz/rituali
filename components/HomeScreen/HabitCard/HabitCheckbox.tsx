import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

interface HabitCheckboxProps {
  isCompleted: boolean;
  isLoading: boolean;
  isFutureDate: boolean;
  onPress: () => void;
}

const HabitCheckbox: React.FC<HabitCheckboxProps> = ({
  isCompleted,
  isLoading,
  isFutureDate,
  onPress,
}) => {
  if (isFutureDate) return null;

  return (
    <TouchableOpacity
      style={[
        styles.checkbox,
        isCompleted && styles.checkboxChecked,
        isLoading && styles.checkboxDisabled,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={isLoading}
    >
      {isCompleted && (
        <Ionicons name="checkmark" size={20} color={Colors.White} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.PrimaryGray,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: Colors.PrimaryGray,
  },
  checkboxDisabled: {
    opacity: 0.5,
    backgroundColor: Colors.LightGray,
  },
});

export default HabitCheckbox;
