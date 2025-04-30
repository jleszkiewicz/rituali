import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { t } from "@/src/service/translateService";
import { format } from "date-fns";
import { getLocale } from "@/src/service/translateService";
import { useTranslation } from "react-i18next";

interface DaySelectorProps {
  selectedDays: number[];
  onToggleDay: (day: number) => void;
}

const DaySelector: React.FC<DaySelectorProps> = ({
  selectedDays,
  onToggleDay,
}) => {
  const { i18n } = useTranslation();
  const locale = getLocale(i18n.language);

  const getDayName = (day: number) => {
    const date = new Date();
    date.setDate(date.getDate() - date.getDay() + day);
    const dayKey = format(date, "eee", { locale }).toLowerCase();
    return t(dayKey);
  };

  return (
    <View style={styles.daysContainer}>
      <Text style={styles.sectionTitle}>{t("select_days")}</Text>
      <View style={styles.daysGrid}>
        {[0, 1, 2, 3, 4, 5, 6].map((day) => (
          <TouchableOpacity
            key={day}
            style={[
              styles.dayButton,
              selectedDays.includes(day) && styles.selectedDay,
            ]}
            onPress={() => onToggleDay(day)}
          >
            <Text
              style={[
                styles.dayText,
                selectedDays.includes(day) && styles.selectedDayText,
              ]}
            >
              {getDayName(day)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  daysContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  daysGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  dayButton: {
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.PrimaryPink,
    borderRadius: 5,
    margin: 2,
    padding: 5,
  },
  selectedDay: {
    backgroundColor: Colors.PrimaryPink,
  },
  dayText: {
    color: Colors.Black,
    fontSize: 14,
  },
  selectedDayText: {
    color: Colors.White,
  },
});
export default DaySelector;
