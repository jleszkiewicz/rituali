import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { format } from "date-fns";
import { getLocale } from "@/src/service/translateService";
import { Colors } from "../../constants/Colors";
import { dateFormat } from "@/constants/Constants";
import { t } from "@/src/service/translateService";
import { ThemedText } from "../Commons/ThemedText";

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
  const locale = getLocale();

  const isSelected =
    format(item, dateFormat) === format(selectedDate, dateFormat);
  const isToday = format(item, dateFormat) === format(new Date(), dateFormat);

  const getDayName = () => {
    const dayKey = format(item, "eee", { locale }).toLowerCase();
    return t(dayKey);
  };

  const getCircleColor = () => {
    if (isSelected) return Colors.HotPink;
    if (isToday && !isSelected) return Colors.LightPink;
    return Colors.LightGray;
  };

  return (
    <TouchableOpacity
      onPress={() => setSelectedDate(item)}
      style={{ ...styles.dayContainer, width: itemWidth }}
    >
      <ThemedText style={styles.dayName}>{getDayName()}</ThemedText>
      <View style={[styles.circle, { backgroundColor: getCircleColor() }]}>
        <ThemedText
          style={[
            styles.dayText,
            { color: isSelected || isToday ? Colors.White : Colors.Black },
          ]}
        >
          {format(item, "d")}
        </ThemedText>
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
    fontSize: 14,
    fontWeight: "600",
    color: Colors.PrimaryGray,
  },
});

export default CalendarElement;
