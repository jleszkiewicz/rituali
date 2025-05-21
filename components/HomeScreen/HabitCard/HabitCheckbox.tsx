import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

interface HabitCheckboxProps {
  isCompleted: boolean;
  isDisabled: boolean;
  onPress: () => void;
}

const HabitCheckbox: React.FC<HabitCheckboxProps> = ({
  isCompleted,
  isDisabled,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      style={[
        styles.checkbox,
        isCompleted && styles.checkboxCompleted,
        isDisabled && styles.checkboxDisabled,
      ]}
    >
      {isCompleted && (
        <Ionicons name="checkmark-sharp" size={20} color={Colors.White} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkbox: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: Colors.HotPink,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxCompleted: {
    backgroundColor: Colors.HotPink,
    borderColor: Colors.HotPink,
  },
  checkboxDisabled: {
    opacity: 0.5,
  },
});

export default HabitCheckbox;
