import { HabitCategory } from "@/components/AddHabitModal/types";
import { format, isToday, isTomorrow, isYesterday } from "date-fns";
import { getLocale, t } from "@/src/service/translateService";

export const getIconForCategory = (category: HabitCategory): string => {
  switch (category) {
    case "health":
      return "heart-outline";
    case "fitness":
      return "barbell-outline";
    case "beauty":
      return "sunny-outline";
    case "mindfulness":
      return "leaf-outline";
    case "education":
      return "school-outline";
    case "self-development":
      return "sparkles-outline";
    case "other":
      return "apps-outline";
  }
};

export const getTitle = (selectedDate: Date) => {
  const locale = getLocale();
  if (isToday(selectedDate)) return t("today");
  if (isTomorrow(selectedDate)) return t("tomorrow");
  if (isYesterday(selectedDate)) return t("yesterday");
  return format(selectedDate, "d MMMM", { locale });
};
