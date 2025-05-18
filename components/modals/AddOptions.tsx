import React, { useEffect, useState } from "react";
import { StyleSheet, View, TouchableOpacity, Modal } from "react-native";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/Commons/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import * as Network from "expo-network";

interface AddOptionsProps {
  isVisible: boolean;
  onClose: () => void;
  onAddHabit: () => void;
  onAddChallenge: () => void;
}

const AddOptions = ({
  isVisible,
  onClose,
  onAddHabit,
  onAddChallenge,
}: AddOptionsProps) => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkConnection = async () => {
      try {
        const networkState = await Network.getNetworkStateAsync();
        if (isMounted) {
          setIsConnected(networkState.isConnected ?? true);
        }
      } catch (error) {
        console.error("Error checking network state:", error);
        if (isMounted) {
          setIsConnected(true);
        }
      }
    };

    checkConnection();
    const intervalId = setInterval(checkConnection, 5000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  if (!isConnected) {
    onClose();
    return null;
  }

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.modalContent}>
          <TouchableOpacity
            style={styles.option}
            onPress={() => {
              onClose();
              onAddHabit();
            }}
          >
            <Ionicons
              name="add-circle-outline"
              size={24}
              color={Colors.HotPink}
            />
            <ThemedText style={styles.optionText}>Add Habit</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.option}
            onPress={() => {
              onClose();
              onAddChallenge();
            }}
          >
            <Ionicons name="trophy-outline" size={24} color={Colors.HotPink} />
            <ThemedText style={styles.optionText}>Add Challenge</ThemedText>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: Colors.White,
    borderRadius: 10,
    padding: 20,
    width: "80%",
    maxWidth: 300,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.LightGray,
  },
  optionText: {
    marginLeft: 10,
    fontSize: 16,
    color: Colors.PrimaryGray,
  },
});

export default AddOptions;
