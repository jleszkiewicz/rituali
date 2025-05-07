import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { t } from "@/src/service/translateService";
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
      <Text style={styles.label}>{t("challenge_name")}</Text>
      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        value={value}
        onChangeText={onChange}
        placeholder={t("challenge_name")}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
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
});
