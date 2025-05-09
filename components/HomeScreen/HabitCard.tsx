import React, { useState, useRef } from "react";
import { Colors } from "@/constants/Colors";
import { HabitData } from "../AddHabitModal/types";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  PanResponder,
} from "react-native";
import { getIconForCategory } from "./methods/methods";
import { t } from "@/src/service/translateService";
import { calculateStreak } from "@/src/utils/streakUtils";
import { useDispatch, useSelector } from "react-redux";
import { selectHabits, setHabits } from "@/src/store/habitsSlice";
import { updateHabitCompletion } from "@/src/service/apiService";
import { isAfter, parseISO, isToday } from "date-fns";
import DeleteHabitModal from "../modals/DeleteHabitModal";
import { ThemedText } from "../Commons/ThemedText";

interface HabitCardProps {
  habit: HabitData;
  selectedDate: string;
  onEdit: (habit: HabitData) => void;
}

const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  selectedDate,
  onEdit,
}) => {
  const dispatch = useDispatch();
  const habits = useSelector(selectHabits);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const pan = useRef(new Animated.ValueXY()).current;

  const isFutureDate = isAfter(parseISO(selectedDate), new Date());
  const isTodayDate = isToday(parseISO(selectedDate));
  const isCompleted = habit.completionDates.some((date: string) => {
    if (!date) return false;
    return date === selectedDate;
  });

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
      console.error("Error updating habit completion:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx < 0) {
          pan.setValue({ x: gestureState.dx, y: 0 });
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -50) {
          Animated.spring(pan, {
            toValue: { x: -160, y: 0 },
            useNativeDriver: true,
            tension: 50,
            friction: 7,
          }).start();
        } else {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
            tension: 50,
            friction: 7,
          }).start();
        }
      },
    })
  ).current;

  const streak = calculateStreak(
    habit.frequency,
    habit.startDate,
    habit.completionDates,
    habit.selectedDays
  );
  const { name, color, backgroundColor } = getIconForCategory(habit.category);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.card,
          {
            transform: [{ translateX: pan.x }, { translateY: pan.y }],
            borderTopEndRadius: pan.x.interpolate({
              inputRange: [-160, 0],
              outputRange: [0, 10],
              extrapolate: "clamp",
            }),
            borderBottomEndRadius: pan.x.interpolate({
              inputRange: [-160, 0],
              outputRange: [0, 10],
              extrapolate: "clamp",
            }),
          },
        ]}
        {...panResponder.panHandlers}
      >
        <View style={styles.cardContent}>
          <View style={{ ...styles.iconContainer, backgroundColor }}>
            <Ionicons name={name as any} size={30} color={color} />
          </View>
          <View style={styles.textContainer}>
            <ThemedText style={styles.title}>{habit.name}</ThemedText>
            {isTodayDate && streak > 0 && (
              <ThemedText style={styles.streak}>{`${streak} 🔥`}</ThemedText>
            )}
          </View>
          {!isFutureDate && (
            <TouchableOpacity
              style={[
                styles.checkbox,
                isCompleted && styles.checkboxChecked,
                isLoading && styles.checkboxDisabled,
              ]}
              onPress={toggleCompletion}
              activeOpacity={0.7}
              disabled={isLoading}
            >
              {isCompleted && (
                <Ionicons
                  name="checkmark-sharp"
                  size={20}
                  color={Colors.White}
                />
              )}
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
      <Animated.View
        style={[
          styles.editButtonContainer,
          {
            opacity: pan.x.interpolate({
              inputRange: [-160, -80, 0],
              outputRange: [1, 0.5, 0],
              extrapolate: "clamp",
            }),
          },
        ]}
      >
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => {
            Animated.spring(pan, {
              toValue: { x: 0, y: 0 },
              useNativeDriver: true,
              tension: 50,
              friction: 7,
            }).start();
            onEdit(habit);
          }}
        >
          <Ionicons name="create-outline" size={24} color={Colors.White} />
          <ThemedText style={styles.editButtonText}>{t("edit")}</ThemedText>
        </TouchableOpacity>
      </Animated.View>
      <Animated.View
        style={[
          styles.deleteButtonContainer,
          {
            opacity: pan.x.interpolate({
              inputRange: [-160, -80, 0],
              outputRange: [1, 0.5, 0],
              extrapolate: "clamp",
            }),
          },
        ]}
      >
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => {
            Animated.spring(pan, {
              toValue: { x: 0, y: 0 },
              useNativeDriver: true,
              tension: 50,
              friction: 7,
            }).start();
            setIsDeleteModalVisible(true);
          }}
        >
          <Ionicons name="trash-outline" size={24} color={Colors.White} />
          <ThemedText style={styles.deleteButtonText}>{t("delete")}</ThemedText>
        </TouchableOpacity>
      </Animated.View>
      <DeleteHabitModal
        isVisible={isDeleteModalVisible}
        onClose={() => setIsDeleteModalVisible(false)}
        habitId={habit.id}
      />
    </View>
  );
};

export default HabitCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginVertical: 5,
    overflow: "hidden",
    height: 60,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: Colors.LightGray,
    borderRadius: 10,
    flex: 1,
    height: "100%",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    backgroundColor: Colors.PrimaryPink,
    borderRadius: 10,
    padding: 5,
    marginEnd: 10,
  },
  textContainer: {
    flex: 1,
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  streak: {
    fontSize: 14,
    color: Colors.PrimaryGray,
    textAlign: "left",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.HotPink,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: Colors.HotPink,
  },
  checkboxDisabled: {
    opacity: 0.5,
    backgroundColor: Colors.LightGray,
  },
  editButtonContainer: {
    position: "absolute",
    right: 80,
    top: 0,
    bottom: 0,
    width: 80,
  },
  editButton: {
    backgroundColor: Colors.PrimaryPink,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    borderRadius: 0,
  },
  editButtonText: {
    color: Colors.White,
    marginLeft: 5,
    fontSize: 14,
    fontWeight: "600",
  },
  deleteButtonContainer: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 80,
  },
  deleteButton: {
    backgroundColor: Colors.PrimaryRed,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    borderTopEndRadius: 10,
    borderBottomEndRadius: 10,
  },
  deleteButtonText: {
    color: Colors.White,
    marginLeft: 5,
    fontSize: 14,
    fontWeight: "600",
  },
});
