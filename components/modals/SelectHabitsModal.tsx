import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { HabitData } from "@/components/AddHabitModal/types";
import { ThemedText } from "../Commons/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { t } from "@/src/service/translateService";
import HabitSelectionItem from "../SelectHabitsModal/HabitSelectionItem";
import EmptyHabitsList from "../SelectHabitsModal/EmptyHabitsList";

interface SelectHabitsModalProps {
  isVisible: boolean;
  onClose: () => void;
  availableHabits: HabitData[];
  onSelectHabits: (selectedHabits: HabitData[]) => void;
}

const SelectHabitsModal: React.FC<SelectHabitsModalProps> = ({
  isVisible,
  onClose,
  availableHabits,
  onSelectHabits,
}) => {
  const [selectedHabits, setSelectedHabits] = useState<HabitData[]>([]);

  const toggleHabitSelection = (habit: HabitData) => {
    setSelectedHabits((prev) =>
      prev.some((h) => h.id === habit.id)
        ? prev.filter((h) => h.id !== habit.id)
        : [...prev, habit]
    );
  };

  const handleConfirm = () => {
    onSelectHabits(selectedHabits);
    setSelectedHabits([]);
    onClose();
  };

  const renderContent = () => {
    if (availableHabits.length === 0) {
      return (
        <View style={styles.emptyListContainer}>
          <EmptyHabitsList />
        </View>
      );
    }

    return (
      <FlatList
        data={availableHabits}
        renderItem={({ item }) => (
          <HabitSelectionItem
            habit={item}
            isSelected={selectedHabits.some((h) => h.id === item.id)}
            onToggle={toggleHabitSelection}
          />
        )}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
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
          <View style={styles.header}>
            <ThemedText style={styles.title} bold>
              {t("select_habits")}
            </ThemedText>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={Colors.White} />
            </TouchableOpacity>
          </View>

          {renderContent()}

          {availableHabits.length > 0 && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
              >
                <ThemedText style={styles.buttonText}>{t("cancel")}</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.confirmButton,
                  selectedHabits.length === 0 && styles.disabledButton,
                ]}
                onPress={handleConfirm}
                disabled={selectedHabits.length === 0}
              >
                <ThemedText style={styles.buttonText}>
                  {t("add_selected_habits")}
                </ThemedText>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    marginTop: 100,
    flex: 1,
    backgroundColor: Colors.PrimaryGray,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    color: Colors.White,
    lineHeight: 30,
  },
  closeButton: {
    padding: 5,
  },
  list: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: Colors.LightGray,
  },
  confirmButton: {
    backgroundColor: Colors.HotPink,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: Colors.White,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SelectHabitsModal;
