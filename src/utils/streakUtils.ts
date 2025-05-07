import { Frequency } from "../../components/AddHabitModal/types";
import { isSameDay, isAfter, subDays, parseISO } from "date-fns";

export const calculateStreak = (
  frequency: Frequency,
  startDate: string,
  completionDates: string[],
  selectedDays?: string[],
): number => {
  const today = new Date();
  const parsedStartDate = parseISO(startDate);
  const sortedDates = completionDates
    .filter(date => date) // Filter out undefined or null dates
    .map(date => parseISO(date))
    .sort((a, b) => a.getTime() - b.getTime());

  const wasCompleted = (date: Date): boolean =>
    sortedDates.some(completedDate => isSameDay(completedDate, date));

  let streak = 0;

  if (frequency === "daily") {
    let checkDate = subDays(today, 1);
    while (isAfter(checkDate, parsedStartDate) || isSameDay(checkDate, parsedStartDate)) {
      if (wasCompleted(checkDate)) {
        streak++;
        checkDate = subDays(checkDate, 1);
      } else {
        break;
      }
    }
  } else if (frequency === "weekly") {
    const habitWeekday = parsedStartDate.getDay();
    let checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - ((checkDate.getDay() + 7 - habitWeekday) % 7));
    while (isAfter(checkDate, parsedStartDate) || isSameDay(checkDate, parsedStartDate)) {
      if (wasCompleted(checkDate)) {
        streak++;
        checkDate = subDays(checkDate, 7);
      } else {
        break;
      }
    }
  } else if (frequency === "monthly") {
    const habitDay = parsedStartDate.getDate();
    let checkDate = new Date(today);
    checkDate.setDate(habitDay);

    while (checkDate.getDate() !== habitDay) {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    while (isAfter(checkDate, parsedStartDate) || isSameDay(checkDate, parsedStartDate)) {
      if (wasCompleted(checkDate)) {
        streak++;
        checkDate.setMonth(checkDate.getMonth() - 1);
        checkDate.setDate(habitDay);
      } else {
        break;
      }
    }
  } else if (frequency === "selected_days" && selectedDays && selectedDays.length > 0) {
    let checkDate = new Date(today);
    while (isAfter(checkDate, parsedStartDate) || isSameDay(checkDate, parsedStartDate)) {
      if (selectedDays.includes(checkDate.getDay().toString())) {
        if (wasCompleted(checkDate)) {
          streak++;
        } else {
          break;
        }
      }
      checkDate = subDays(checkDate, 1);
    }
  }

  return streak;
};
 