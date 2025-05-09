import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { t } from "@/src/service/translateService";
import { ThemedText } from "../Commons/ThemedText";
interface ChallengeNameInputProps {
  value: string;
  error: string;
  onChange: (text: string) => void;
}

export default function ChallengeNameInput({
  value,
  error,
  onChange,
}: ChallengeNameInputProps) {
  return (
    <View style={styles.inputContainer}>
      <ThemedText style={styles.label} bold>
        {t("challenge_name")}
      </ThemedText>
      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        value={value}
        onChangeText={onChange}
        placeholder={t("challenge_name")}
      />
      {error ? <ThemedText style={styles.errorText}>{error}</ThemedText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.PrimaryGray,
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    fontFamily: "Poppins-Regular",
  },
  inputError: {
    borderColor: Colors.PrimaryRed,
  },
  errorText: {
    color: Colors.PrimaryRed,
    fontSize: 12,
    marginTop: 5,
  },
});
