import React, { useState } from "react";
import { SafeAreaView, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import CalendarCarousel from "../../components/HomeScreen/CalendarCarousel";
import { getLocale } from "@/src/service/translateService";
import { format, isToday, isTomorrow, isYesterday } from "date-fns";
import { Colors } from "@/constants/Colors";
import EmptyHabitsList from "@/components/HomeScreen/EmptyHabitsList";

export default function HomeScreen() {
  const { t, i18n } = useTranslation();
  const locale = getLocale(i18n.language);

  const [selectedDate, setSelectedDate] = useState(new Date());

  const getTitle = () => {
    if (isToday(selectedDate)) return t("today");
    if (isTomorrow(selectedDate)) return t("tomorrow");
    if (isYesterday(selectedDate)) return t("yesterday");
    return format(selectedDate, "d MMMM", { locale });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.selectedDateText}>{getTitle()}</Text>
      <CalendarCarousel
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      <EmptyHabitsList />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.White,
    flex: 1,
    marginTop: 10,
  },
  selectedDateText: {
    textAlign: "center",
    marginVertical: 20,
    fontSize: 18,
    fontWeight: "600",
    color: Colors.PrimaryGray,
  },
});
