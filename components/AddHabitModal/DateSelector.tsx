import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { t } from "@/src/service/translateService";
import { format } from "date-fns";
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

  return (
    <View style={styles.dateContainer}>
      <Text style={styles.sectionTitle}>{label}</Text>
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={styles.dateButton}
      >
        <Text>{format(date, dateFormat)}</Text>
      </TouchableOpacity>
      <DateTimePickerModal
        minimumDate={minDate}
        maximumDate={maxDate}
        isVisible={showDatePicker}
        mode="date"
        date={date}
        onConfirm={(date) => {
          onDateChange(date);
          setShowDatePicker(false);
        }}
        onCancel={() => setShowDatePicker(false)}
        pickerContainerStyleIOS={{ backgroundColor: "#fff" }}
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
    borderColor: Colors.PrimaryPink,
    borderRadius: 10,
    marginBottom: 10,
  },
});

export default DateSelector;
