import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { Colors } from "@/constants/Colors";
import { HabitData } from "@/components/AddHabitModal/types";
import { useDispatch, useSelector } from "react-redux";
import { selectHabits, setHabits } from "@/src/store/habitsSlice";
import { selectUserId } from "@/src/store/userSlice";
import { updateHabitCompletion } from "@/src/service/apiService";
import { isAfter, isToday, parseISO } from "date-fns";
import { calculateStreak } from "@/src/utils/streakUtils";
import HabitTitle from "./HabitTitle";
import HabitCheckbox from "./HabitCheckbox";
import HabitIcon from "./HabitIcon";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

interface HabitCardProps {
  habit: HabitData;
  selectedDate: string;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, selectedDate }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const habits = useSelector(selectHabits);
  const userId = useSelector(selectUserId);
  const [isLoading, setIsLoading] = useState(false);
  const [strikeThroughAnim] = useState(new Animated.Value(0));

  const isFutureDate = isAfter(parseISO(selectedDate), new Date());
  const isTodayDate = isToday(parseISO(selectedDate));
  const isCompleted = habit.completionDates.some((date: string) => {
    if (!date) return false;
    return date === selectedDate;
  });

  useEffect(() => {
    Animated.timing(strikeThroughAnim, {
      toValue: isCompleted ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isCompleted]);

  const toggleCompletion = async () => {
    if (isLoading || isFutureDate) return;

    setIsLoading(true);
    try {
      const updatedCompletionDates = isCompleted
        ? habit.completionDates.filter((date: string) => date !== selectedDate)
        : [...habit.completionDates, selectedDate];

      const updatedHabits = habits.map((h) =>
        h.id === habit.id
          ? { ...h, completionDates: updatedCompletionDates }
          : h
      );
      dispatch(setHabits(updatedHabits));
      await updateHabitCompletion(habit.id, updatedCompletionDates);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePress = () => {
    router.push({
      pathname: "/habit-summary",
      params: { habitId: habit.id },
    });
  };

  const streak = calculateStreak(habit.startDate, habit.completionDates);

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <View style={styles.content}>
        <View style={styles.leftContent}>
          <HabitIcon category={habit.category} />
          <View style={styles.titleContainer}>
            <HabitTitle
              name={habit.name}
              streak={streak}
              isToday={isTodayDate}
              strikeThroughAnim={strikeThroughAnim}
            />
          </View>
        </View>

        <View style={styles.rightContent}>
          <HabitCheckbox
            isCompleted={isCompleted}
            isDisabled={isLoading || isFutureDate}
            onPress={toggleCompletion}
          />
          <Ionicons
            name="chevron-forward"
            size={20}
            color={Colors.PrimaryGray}
            style={styles.chevron}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.LightPink,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  rightContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  titleContainer: {
    flex: 1,
    marginLeft: 10,
  },
  chevron: {
    marginLeft: 4,
  },
});

export default HabitCard;
