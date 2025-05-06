import React from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { getLocale } from "@/src/service/translateService";
import { Colors } from "../../constants/Colors";
import { dateFormat } from "@/constants/Constants";

interface CalendarElementProps {
  item: Date;
  selectedDate: Date;
  itemWidth: number;
  setSelectedDate: (date: Date) => void;
}

const CalendarElement: React.FC<CalendarElementProps> = ({
  item,
  selectedDate,
  itemWidth,
  setSelectedDate,
}) => {
  const { t, i18n } = useTranslation();
  const locale = getLocale(i18n.language);

  const isSelected =
    format(item, dateFormat) === format(selectedDate, dateFormat);

  const getDayName = () => {
    const dayKey = format(item, "eee", { locale }).toLowerCase();
    return t(dayKey);
  };

  return (
    <TouchableOpacity
      onPress={() => setSelectedDate(item)}
      style={{ ...styles.dayContainer, width: itemWidth }}
    >
      <Text style={styles.dayName}>{getDayName()}</Text>
      <View
        style={[
          styles.circle,
          { backgroundColor: isSelected ? Colors.HotPink : Colors.LightGray },
        ]}
      >
        <Text
          style={[
            styles.dayText,
            { color: isSelected ? Colors.White : Colors.Black },
          ]}
        >
          {format(item, "d")}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  dayContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 5,
  },
  dayText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  dayName: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.PrimaryGray,
  },
});

export default CalendarElement;
