import React from "react";
import { TouchableOpacity, StyleSheet, Modal, View } from "react-native";
import { Colors } from "@/constants/Colors";
import { t } from "@/src/service/translateService";
import { ThemedText } from "../Commons/ThemedText";
import { LinearGradient } from "expo-linear-gradient";
interface AddOptionsModalProps {
  isVisible: boolean;
  onClose: () => void;
  onAddHabit: () => void;
  onAddChallenge: () => void;
}

const AddOptionsModal = ({
  isVisible,
  onClose,
  onAddHabit,
  onAddChallenge,
}: AddOptionsModalProps) => {
  const Button = ({ onPress, text }: { onPress: () => void; text: string }) => {
    return (
      <View style={styles.option}>
        <TouchableOpacity onPress={onPress}>
          <ThemedText style={styles.optionText} bold>
            {text}
          </ThemedText>
        </TouchableOpacity>
      </View>
    );
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
          <Button onPress={onAddHabit} text={t("add_habit")} />
          <Button onPress={onAddChallenge} text={t("add_challenge")} />
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <ThemedText style={styles.cancelButtonText}>
              {t("cancel")}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: Colors.White,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: "center",
  },
  option: {
    padding: 15,
    backgroundColor: Colors.ButterYellow,
    borderWidth: 2,
    borderColor: Colors.HotPink,
    borderRadius: 10,
    marginBottom: 10,
  },
  optionText: {
    fontSize: 16,
    color: Colors.HotPink,
  },
  cancelButton: {
    padding: 15,
    marginTop: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    color: Colors.PrimaryGray,
    textAlign: "center",
  },
});

export default AddOptionsModal;
