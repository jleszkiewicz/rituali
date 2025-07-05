import { isSameDay, isAfter, subDays, parseISO, getDay, getWeek, getYear } from "date-fns";
import { Frequency } from "@/components/AddHabitModal/types";

export const calculateStreak = (
  startDate: string,
  completionDates: string[],
  frequency: Frequency = "daily",
  selectedDays: string[] = [],
): number => {
  const today = new Date();
  const parsedStartDate = parseISO(startDate);
  const sortedDates = completionDates
    .filter(date => date)
    .map(date => parseISO(date))
    .sort((a, b) => a.getTime() - b.getTime());

  const wasCompleted = (date: Date): boolean =>
    sortedDates.some(completedDate => isSameDay(completedDate, date));

  const shouldShowHabitOnDate = (date: Date): boolean => {
    if (isAfter(parsedStartDate, date)) {
      return false;
    }

    switch (frequency) {
      case "daily":
        return true;

      case "weekly":
        const weekOfYear = getWeek(date);
        const yearOfYear = getYear(date);
        const habitStartWeek = getWeek(parsedStartDate);
        const habitStartYear = getYear(parsedStartDate);
        return weekOfYear === habitStartWeek && yearOfYear === habitStartYear;

      case "selected_days":
        const dayNames = [
          "sunday",
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
        ];
        const currentDayName = dayNames[getDay(date)];
        return selectedDays.includes(currentDayName);

      default:
        return true;
    }
  };

  let streak = 0;
  let checkDate = wasCompleted(today) ? today : subDays(today, 1);

  while (isAfter(checkDate, parsedStartDate) || isSameDay(checkDate, parsedStartDate)) {
    if (shouldShowHabitOnDate(checkDate)) {
      if (wasCompleted(checkDate)) {
        streak++;
        checkDate = subDays(checkDate, 1);
      } else {
        break;
      }
    } else {
      checkDate = subDays(checkDate, 1);
    }
  }

  return streak;
};
 