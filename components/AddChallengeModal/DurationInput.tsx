import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { t } from "@/src/service/translateService";
import { ThemedText } from "../Commons/ThemedText";

interface DurationInputProps {
  value: string;
  error?: string;
  onChange: (text: string) => void;
}

const DurationInput = ({ value, error, onChange }: DurationInputProps) => {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.label} bold>
        {t("duration_days")}
      </ThemedText>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        value={value}
        onChangeText={onChange}
        keyboardType="numeric"
        placeholder={t("enter_duration")}
        placeholderTextColor={Colors.PrimaryGray}
      />
      {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.LightGray,
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

export default DurationInput;
