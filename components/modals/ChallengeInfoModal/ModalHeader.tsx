import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "../../Commons/ThemedText";
import { Ionicons } from "@expo/vector-icons";

interface ModalHeaderProps {
  title: string;
  onClose: () => void;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({ title, onClose }) => {
  return (
    <View style={styles.header}>
      <ThemedText style={styles.title} bold>
        {title}
      </ThemedText>
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Ionicons name="close" size={24} color={Colors.White} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    color: Colors.White,
    lineHeight: 30,
  },
  closeButton: {
    padding: 5,
  },
});

export default ModalHeader;
