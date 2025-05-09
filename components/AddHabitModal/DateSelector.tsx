import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { format, isValid } from "date-fns";
import DateTimePickerModal from "react-native-modal-datetime-picker";
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

  const handleDateChange = (newDate: Date) => {
    if (isValid(newDate)) {
      setDisplayDate(newDate);
      onDateChange(newDate);
    }
    setShowDatePicker(false);
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={styles.dateButton}
      >
        <ThemedText style={styles.dateText}>
          {format(displayDate, dateFormat)}
        </ThemedText>
      </TouchableOpacity>
      <DateTimePickerModal
        minimumDate={minDate}
        maximumDate={maxDate}
        isVisible={showDatePicker}
        mode="date"
        date={displayDate}
        onConfirm={handleDateChange}
        onCancel={() => setShowDatePicker(false)}
        pickerContainerStyleIOS={{ backgroundColor: Colors.White }}
      />
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
    borderColor: Colors.PrimaryGray,
    borderRadius: 5,
    padding: 10,
  },
  dateText: {
    fontSize: 16,
  },
});

export default DateSelector;
