import { HabitCategory } from "@/components/AddHabitModal/types";
import { HabitIcon } from "../types/types";
import { Colors } from "@/constants/Colors";

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
