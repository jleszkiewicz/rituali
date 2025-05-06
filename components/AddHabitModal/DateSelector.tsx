import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { format, isValid } from "date-fns";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { dateFormat } from "@/constants/Constants";

interface DateSelectorProps {
  label: string;
  date: Date;
  onDateChange: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
}

const DateSelector: React.FC<DateSelectorProps> = ({
  label,
  date,
  onDateChange,
  minDate,
  maxDate,
}) => {
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
    <View style={styles.dateContainer}>
      <Text style={styles.sectionTitle}>{label}</Text>
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={styles.dateButton}
      >
        <Text>{format(displayDate, dateFormat)}</Text>
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
  dateContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  dateButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.PrimaryGray,
    borderRadius: 10,
    marginBottom: 10,
  },
});

export default DateSelector;
