import React from "react";
import { Calendar } from "react-native-calendars";
import { StyleSheet, View } from "react-native";
import { Colors } from "@/constants/Colors";

interface CustomCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({
  selectedDate,
  onDateSelect,
  minDate,
  maxDate,
}) => {
  const markedDates = {
    [selectedDate.toISOString().split("T")[0]]: {
      selected: true,
      selectedColor: Colors.PrimaryPink,
    },
  };

  return (
    <View style={styles.container}>
      <Calendar
        current={selectedDate.toISOString().split("T")[0]}
        onDayPress={(day) => onDateSelect(new Date(day.dateString))}
        markedDates={markedDates}
        minDate={minDate?.toISOString().split("T")[0]}
        maxDate={maxDate?.toISOString().split("T")[0]}
        theme={{
          calendarBackground: Colors.White,
          textSectionTitleColor: Colors.PrimaryGray,
          selectedDayBackgroundColor: Colors.PrimaryPink,
          selectedDayTextColor: Colors.White,
          todayTextColor: Colors.PrimaryPink,
          dayTextColor: Colors.PrimaryGray,
          textDisabledColor: Colors.LightGray,
          dotColor: Colors.PrimaryPink,
          selectedDotColor: Colors.White,
          arrowColor: Colors.PrimaryPink,
          monthTextColor: Colors.PrimaryGray,
          indicatorColor: Colors.PrimaryPink,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.White,
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
  },
});

export default CustomCalendar;
