import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, StyleSheet, Platform } from "react-native";
import { Colors } from "@/constants/Colors";
import { format, isValid } from "date-fns";
import DateTimePicker from "@react-native-community/datetimepicker";
import { dateFormat } from "@/constants/Constants";
import { t } from "@/src/service/translateService";
import { ThemedText } from "../Commons/ThemedText";

interface DateSelectorProps {
  label: string;
  date: Date;
  onDateChange: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
}

const DateSelector = ({
  label,
  date,
  onDateChange,
  minDate,
  maxDate,
}: DateSelectorProps) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [displayDate, setDisplayDate] = useState<Date>(
    isValid(date) ? date : new Date()
  );

  useEffect(() => {
    if (isValid(date)) {
      setDisplayDate(date);
    }
  }, [date]);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || displayDate;
    setShowDatePicker(Platform.OS === "ios");
    if (isValid(currentDate)) {
      setDisplayDate(currentDate);
      onDateChange(currentDate);
    }
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.label} bold>
        {label}
      </ThemedText>
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={styles.dateButton}
      >
        <ThemedText style={styles.dateText}>
          {format(displayDate, dateFormat)}
        </ThemedText>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={displayDate}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateChange}
          minimumDate={minDate}
          maximumDate={maxDate}
        />
      )}
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
  dateButton: {
    borderWidth: 1,
    borderColor: Colors.LightGray,
    borderRadius: 5,
    padding: 10,
  },
  dateText: {
    fontSize: 16,
  },
});

export default DateSelector;
