import { isSameDay, isAfter, subDays, parseISO } from "date-fns";

export const calculateStreak = (
  startDate: string,
  completionDates: string[],
): number => {
  const today = new Date();
  const parsedStartDate = parseISO(startDate);
  const sortedDates = completionDates
    .filter(date => date)
    .map(date => parseISO(date))
    .sort((a, b) => a.getTime() - b.getTime());

  const wasCompleted = (date: Date): boolean =>
    sortedDates.some(completedDate => isSameDay(completedDate, date));

  let streak = 0;
  let checkDate = subDays(today, 1);

  while (isAfter(checkDate, parsedStartDate) || isSameDay(checkDate, parsedStartDate)) {
    if (wasCompleted(checkDate)) {
      streak++;
      checkDate = subDays(checkDate, 1);
    } else {
      break;
    }
  }

  return streak;
};
 