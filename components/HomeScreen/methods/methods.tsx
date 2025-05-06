import { Challenge, HabitCategory } from "@/components/AddHabitModal/types";
import { HabitIcon } from "../types/types";
import { Colors } from "@/constants/Colors";
import { format, isAfter, isToday, isTomorrow, isYesterday } from "date-fns";
import { isBefore } from "date-fns";
import { parseISO } from "date-fns";
import { getLocale, t } from "@/src/service/translateService";
import { Locale } from "date-fns";

export const getIconForCategory = (category: HabitCategory): HabitIcon => {
  switch (category) {
    case "health":
      return {
        name: "heart-outline",
        backgroundColor: Colors.LightPink,
        color: Colors.PrimaryRed,
      };
    case "fitness":
      return {
        name: "barbell-outline",
        backgroundColor: Colors.LightBlue,
        color: Colors.Blue,
      };
    case "beauty":
      return {
        name: "sunny-outline",
        backgroundColor: Colors.LightPurple,
        color: Colors.Purple,
      };
    case "mindfulness":
      return {
        name: "leaf-outline",
        backgroundColor: Colors.LightBrown,
        color: Colors.Brown,
      };
    case "education":
      return {
        name: "school-outline",
        backgroundColor: Colors.LightGreen,
        color: Colors.Green,
      };
    case "self-development":
      return {
        name: "sparkles-outline",
        backgroundColor: Colors.LightYellow,
        color: Colors.Yellow,
      };
    case "other":
      return {
        name: "apps-outline",
        backgroundColor: Colors.LightOrange,
        color: Colors.Orange,
      };
  }
};

export const getChallengeDayLabel = (
  challenge: Challenge,
  selectedDate: Date
): string => {
  if (!challenge.startDate || !challenge.endDate) return "";

  const start = parseISO(challenge.startDate);
  const end = parseISO(challenge.endDate);
  const totalDays = Math.max(
    1,
    Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
  );

  if (isBefore(selectedDate, start)) {
    const daysUntilStart = Math.ceil(
      (start.getTime() - selectedDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return `${t("starts_in")} ${daysUntilStart} ${t("days")}`;
  }

  if (isAfter(selectedDate, end)) {
    return t("completed");
  }

  const currentDay =
    Math.ceil(
      (selectedDate.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1;

  return `${t("day")} ${currentDay}/${totalDays}`;
};

export const getTitle = (selectedDate: Date) => {
  const locale = getLocale();
  if (isToday(selectedDate)) return t("today");
  if (isTomorrow(selectedDate)) return t("tomorrow");
  if (isYesterday(selectedDate)) return t("yesterday");
  return format(selectedDate, "d MMMM", { locale });
};
