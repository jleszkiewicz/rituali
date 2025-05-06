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
  const [durationDays, setDurationDays] = useState("30");
  const [errors, setErrors] = useState({
    name: "",
    durationDays: "",
  });

  const validateForm = () => {
    const newErrors = {
      name: "",
      durationDays: "",
    };

    if (!challengeData.name.trim()) {
      newErrors.name = t("challenge_name_required");
    }

    const days = parseInt(durationDays);
    if (!days || days < 1 || days > 1000) {
      newErrors.durationDays = t("duration_days_required");
    }

    setErrors(newErrors);
    return !newErrors.name && !newErrors.durationDays;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !userId) return;

    try {
      const days = parseInt(durationDays);
      const endDate = new Date(challengeData.startDate);
      endDate.setDate(endDate.getDate() + days - 1);

      await addChallenge(userId, {
        ...challengeData,
        endDate,
      });

      setChallengeData({
        name: "",
        startDate: new Date(),
        endDate: new Date(),
      });
      setDurationDays("30");
      onClose();
    } catch (error) {
      console.error("Error adding challenge:", error);
    }
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
          <Text style={styles.title}>{t("add_challenge")}</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t("challenge_name")}</Text>
            <TextInput
              style={[styles.input, errors.name ? styles.inputError : null]}
              value={challengeData.name}
              onChangeText={(text) => {
                setChallengeData({ ...challengeData, name: text });
                setErrors({ ...errors, name: "" });
              }}
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

          <View style={styles.numberInputContainer}>
            <Text style={styles.label}>{t("duration_days")}</Text>
            <TextInput
              style={[
                styles.input,
                errors.durationDays ? styles.inputError : null,
              ]}
              value={durationDays}
              onChangeText={(text) => {
                const number = parseInt(text);
                if (!isNaN(number) && number >= 1 && number <= 1000) {
                  setDurationDays(text);
                  const endDate = new Date(challengeData.startDate);
                  endDate.setDate(endDate.getDate() + number - 1);
                  setChallengeData({ ...challengeData, endDate });
                  setErrors({ ...errors, durationDays: "" });
                } else if (text === "") {
                  setDurationDays(text);
                }
              }}
              keyboardType="numeric"
            />
          </View>
          {errors.durationDays ? (
            <Text style={styles.errorText}>{errors.durationDays}</Text>
          ) : null}

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
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: Colors.White,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 40,
    width: "100%",
    maxHeight: "90%",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 15,
  },
  numberInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    minWidth: 60,
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
    marginVertical: 20,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    minWidth: "40%",
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
