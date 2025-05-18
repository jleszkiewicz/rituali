import React, { useState, useEffect } from "react";
import { Pressable, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { t } from "@/src/service/translateService";
import { ThemedText } from "../Commons/ThemedText";
import PrimaryButton from "../Commons/PrimaryButton";

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
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkConnection = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch("https://www.google.com", {
          method: "HEAD",
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (isMounted) {
          setIsConnected(response.ok);
        }
      } catch (error) {
        if (isMounted) {
          setIsConnected(false);
        }
      }
    };

    if (isVisible) {
      checkConnection();
      const intervalId = setInterval(checkConnection, 3000);
      return () => {
        isMounted = false;
        clearInterval(intervalId);
      };
    }
  }, [isVisible]);

  if (!isVisible) return null;
  if (!isConnected) {
    onClose();
    return null;
  }

  return (
    <Pressable style={styles.container} onPress={onClose}>
      <Pressable style={styles.content} onPress={(e) => e.stopPropagation()}>
        <PrimaryButton
          title={t("add_habit")}
          onPress={onAddHabit}
          style={styles.option}
        />
        <PrimaryButton
          title={t("add_challenge")}
          onPress={onAddChallenge}
          style={styles.option}
        />
        <Pressable style={styles.cancelButton} onPress={onClose}>
          <ThemedText style={styles.cancelButtonText}>{t("cancel")}</ThemedText>
        </Pressable>
      </Pressable>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
    zIndex: 1000,
  },
  content: {
    backgroundColor: Colors.White,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  option: {
    marginBottom: 10,
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
