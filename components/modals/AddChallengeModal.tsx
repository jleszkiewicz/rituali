import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { useTranslation } from "react-i18next";
import { ChallengeData } from "@/components/AddChallengeModal/types";
import { addChallenge } from "@/src/service/apiService";
import { useSelector } from "react-redux";
import { selectUserId } from "@/src/store/userSlice";
import DateSelector from "../AddHabitModal/DateSelector";

interface AddChallengeModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function AddChallengeModal({
  isVisible,
  onClose,
}: AddChallengeModalProps) {
  const { t } = useTranslation();
  const userId = useSelector(selectUserId);
  const [challengeData, setChallengeData] = useState<ChallengeData>({
    name: "",
    startDate: new Date(),
    endDate: new Date(),
  });
  const [errors, setErrors] = useState({
    name: "",
  });

  const validateForm = () => {
    const newErrors = {
      name: "",
    };

    if (!challengeData.name.trim()) {
      newErrors.name = t("challenge_name_required");
    }

    setErrors(newErrors);
    return !newErrors.name;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !userId) return;

    try {
      await addChallenge(userId, challengeData);
      setChallengeData({
        name: "",
        startDate: new Date(),
        endDate: new Date(),
      });
      onClose();
    } catch (error) {
      console.error("Error adding challenge:", error);
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>{t("add_challenge")}</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t("challenge_name")}</Text>
            <TextInput
              style={[styles.input, errors.name ? styles.inputError : null]}
              value={challengeData.name}
              onChangeText={(text) =>
                setChallengeData({ ...challengeData, name: text })
              }
              placeholder={t("challenge_name")}
            />
            {errors.name ? (
              <Text style={styles.errorText}>{errors.name}</Text>
            ) : null}
          </View>

          <DateSelector
            label={t("start_date")}
            date={challengeData.startDate}
            onDateChange={(date) =>
              setChallengeData({ ...challengeData, startDate: date })
            }
            minDate={new Date()}
            maxDate={challengeData.endDate}
          />

          <DateSelector
            label={t("end_date")}
            date={challengeData.endDate}
            onDateChange={(date) =>
              setChallengeData({ ...challengeData, endDate: date })
            }
            minDate={challengeData.startDate}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>{t("cancel")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>{t("submit")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

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
    maxWidth: 400,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.Gray,
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  inputError: {
    borderColor: Colors.PrimaryRed,
  },
  errorText: {
    color: Colors.PrimaryRed,
    fontSize: 12,
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    minWidth: 100,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: Colors.Gray,
  },
  submitButton: {
    backgroundColor: Colors.HotPink,
  },
  buttonText: {
    color: Colors.White,
    fontSize: 16,
    fontWeight: "bold",
  },
});
