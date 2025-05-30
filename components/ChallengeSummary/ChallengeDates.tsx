import React from "react";
import { View, StyleSheet } from "react-native";
import { ThemedText } from "../Commons/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { format } from "date-fns";
import { dateFormat } from "@/constants/Constants";
import { t } from "@/src/service/translateService";

interface ChallengeDatesProps {
  startDate: Date;
  endDate: Date;
}

export const ChallengeDates = ({ startDate, endDate }: ChallengeDatesProps) => {
  return (
    <View style={styles.datesContainer}>
      <View style={styles.dateItem}>
        <Ionicons
          name="calendar-outline"
          size={20}
          color={Colors.PrimaryGray}
          style={styles.dateIcon}
        />
        <View>
          <ThemedText style={styles.dateLabel} bold>
            {t("start_date")}
          </ThemedText>
          <ThemedText style={styles.dateValue}>
            {format(startDate, dateFormat)}
          </ThemedText>
        </View>
      </View>
      <View style={styles.dateDivider} />
      <View style={styles.dateItem}>
        <Ionicons
          name="flag-outline"
          size={20}
          color={Colors.PrimaryGray}
          style={styles.dateIcon}
        />
        <View>
          <ThemedText style={styles.dateLabel} bold>
            {t("end_date")}
          </ThemedText>
          <ThemedText style={styles.dateValue}>
            {format(endDate, dateFormat)}
          </ThemedText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  datesContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.ButterYellow,
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  dateItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  dateIcon: {
    marginRight: 10,
  },
  dateLabel: {
    fontSize: 14,
    color: Colors.PrimaryGray,
    opacity: 0.7,
    marginBottom: 2,
  },
  dateValue: {
    fontSize: 16,
    color: Colors.PrimaryGray,
    fontWeight: "500",
  },
  dateDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.LightGray,
    marginHorizontal: 15,
  },
});
