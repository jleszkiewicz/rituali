import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const AddButton = () => {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => alert("Button clicked")}
    >
      <Ionicons name="add" size={30} color="#fff" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    bottom: 10,
    left: "50%",
    transform: [{ translateX: -30 }], // Centrujemy przycisk
    backgroundColor: "#3498db",
    width: 60,
    height: 60,
    borderRadius: 30, // Okrągły przycisk
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
});

export default AddButton;
