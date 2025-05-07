import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { t } from "@/src/service/translateService";
interface DurationInputProps {
  value: string;
  error: string;
  onChange: (text: string) => void;
}

export default function DurationInput({
  value,
  error,
  onChange,
}: DurationInputProps) {
  return (
    <View style={styles.numberInputContainer}>
      <Text style={styles.label}>{t("duration_days")}</Text>
      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        value={value}
        onChangeText={onChange}
        keyboardType="numeric"
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  numberInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
});
